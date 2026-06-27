"use client";

import { useCallback, useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { WindowManagerProvider, useWindowManager, getAppIdFromWindowId } from "@/lib/window-context";
import { useSystemSettings } from "@/lib/system-settings-context";
import { RecentsProvider, useRecents } from "@/lib/recents-context";
import { FileMenuProvider } from "@/lib/file-menu-context";
import dynamic from "next/dynamic";
import { MenuBar } from "./menu-bar";
import { Dock } from "./dock";
import { Window } from "./window";
import { MessagesNotificationBanner } from "./messages-notification-banner";
import { NotesApp } from "@/components/apps/notes/notes-app";
import { MessagesApp } from "@/components/apps/messages/messages-app";
import type { PreviewFileType } from "@/components/apps/preview";
import { getPreviewMetadataFromPath, PREVIEW_TITLE_BAR_HEIGHT } from "@/lib/preview-utils";
import {
  type DocumentAppId,
  getDocumentAppFinderTarget,
  PROJECTS_DIR,
  getLocalTextFileContent,
  isSupportedTextEditPath,
} from "@/lib/file-route-utils";
import { markIntroShown, hasDismissedNowPlaying, markNowPlayingDismissed } from "@/lib/onboarding";
import {
  getIntroDocumentContent,
  INTRO_DOC_PATH,
  isIntroDocPath,
  enforceIntroAppendOnly,
} from "@/lib/intro-doc";
import { getCaseStudyDocPath, toEmptyCaseStudy } from "@/lib/case-study-doc";
import type { CaseStudy } from "@/types/work";
import {
  getLlmsDocumentContent,
  isLlmsDocPath,
  enforceLlmsAppendOnly,
} from "@/lib/llms-doc";
import { DesktopIcons } from "./desktop-icons";
import { PhotoTrail } from "./photo-trail";
import { DesktopStickyNote } from "./desktop-sticky-note";
import { DOCK_HEIGHT, MENU_BAR_HEIGHT } from "@/lib/use-window-behavior";
import { LockScreen } from "./lock-screen";
import { SleepOverlay } from "./sleep-overlay";
import { ShutdownOverlay } from "./shutdown-overlay";
import { RestartOverlay } from "./restart-overlay";
import { getWallpaperPath } from "@/lib/os-versions";
import type { SettingsPanel, SettingsCategory } from "@/components/apps/settings/settings-app";
import { getTextEditContent, saveTextEditContent, cacheTextEditContent } from "@/lib/file-storage";
import { loadNotesSelectedSlug, saveMessagesConversation } from "@/lib/sidebar-persistence";
import { getNotesSelectedSlugMemory } from "@/lib/notes/selection-state";
import { setUrl } from "@/lib/set-url";
import { getShellUrlForApp } from "@/lib/shell-routing";
import { fetchGitHubFileContent } from "@/lib/github-client";
import type { MessagesNotificationPayload } from "@/types/messages/notification";
import type { MessagesConversationSelectRequest } from "@/types/messages/selection";
import { getMessagesUnreadCount } from "@/lib/messages/unread-count";
import { getAppById } from "@/lib/app-config";
import { useAudio } from "@/lib/music/audio-context";

const SettingsApp = dynamic(() => import("@/components/apps/settings/settings-app").then(m => ({ default: m.SettingsApp })));
const FinderApp = dynamic(() => import("@/components/apps/finder/finder-app").then(m => ({ default: m.FinderApp })));
const PhotosApp = dynamic(() => import("@/components/apps/photos/photos-app").then(m => ({ default: m.PhotosApp })));
const CalendarApp = dynamic(() => import("@/components/apps/calendar/calendar-app").then(m => ({ default: m.CalendarApp })));
const WeatherApp = dynamic(() => import("@/components/apps/weather/weather-app").then(m => ({ default: m.WeatherApp })));
const MusicApp = dynamic(() => import("@/components/apps/music/music-app").then(m => ({ default: m.MusicApp })));
const ResumeApp = dynamic(() => import("@/components/apps/work/resume-app").then(m => ({ default: m.ResumeApp })));
const TextEditWindow = dynamic(() => import("@/components/apps/textedit").then(m => ({ default: m.TextEditWindow })));
const PreviewWindow = dynamic(() => import("@/components/apps/preview").then(m => ({ default: m.PreviewWindow })));
const NowPlayingWindow = dynamic(() => import("@/components/apps/music/now-playing-window").then(m => ({ default: m.NowPlayingWindow })));

type DesktopMode = "active" | "locked" | "sleeping" | "shuttingDown" | "restarting";

interface DesktopProps {
  initialAppId?: string;
  initialNoteSlug?: string;
  initialTextEditFile?: string;
  initialPreviewFile?: string;
}

// Fetch file content from GitHub API
async function fetchFileContentFromGitHub(repo: string, path: string): Promise<string | null> {
  try {
    return await fetchGitHubFileContent(repo, path);
  } catch {
    return null;
  }
}

// Fetch file content given a full path
async function fetchFileContent(filePath: string): Promise<string | null> {
  if (filePath.startsWith(PROJECTS_DIR + "/")) {
    const relativePath = filePath.slice(PROJECTS_DIR.length + 1);
    const parts = relativePath.split("/");
    const repo = parts[0];
    const repoFilePath = parts.slice(1).join("/");
    return fetchFileContentFromGitHub(repo, repoFilePath);
  }
  return getLocalTextFileContent(filePath);
}

// Calculate optimal window size for an image based on its dimensions
function calculateImageWindowSize(
  naturalWidth: number,
  naturalHeight: number
): { width: number; height: number } {
  const minWidth = 400;
  const minContentHeight = 300 - PREVIEW_TITLE_BAR_HEIGHT;
  const maxContentWidth = Math.min(1200, window.innerWidth - 200);
  const maxContentHeight = Math.min(900, window.innerHeight - 200) - PREVIEW_TITLE_BAR_HEIGHT;

  let contentWidth = naturalWidth;
  let contentHeight = naturalHeight;

  if (contentWidth > maxContentWidth || contentHeight > maxContentHeight) {
    const scale = Math.min(maxContentWidth / contentWidth, maxContentHeight / contentHeight);
    contentWidth = Math.round(contentWidth * scale);
    contentHeight = Math.round(contentHeight * scale);
  }

  contentWidth = Math.max(contentWidth, minWidth);
  contentHeight = Math.max(contentHeight, minContentHeight);

  return {
    width: contentWidth,
    height: contentHeight + PREVIEW_TITLE_BAR_HEIGHT,
  };
}

// Load image and calculate optimal window size
function loadImageAndGetSize(
  fileUrl: string
): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      resolve(calculateImageWindowSize(img.naturalWidth, img.naturalHeight));
    };
    img.onerror = () => {
      resolve(null); // Return null on error, caller will use default size
    };
    img.src = fileUrl;
  });
}

function createWindowInstanceId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getCenteredFinderWindowPlacement(size: { width: number; height: number }) {
  const availableHeight = window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT;
  return {
    size,
    position: {
      x: Math.max(24, Math.round((window.innerWidth - size.width) / 2)),
      y: Math.max(24, Math.round(MENU_BAR_HEIGHT + (availableHeight - size.height) / 2)),
    },
  };
}

function getDefaultFinderWindowPlacement() {
  const finderApp = getAppById("finder");
  const defaultSize = finderApp?.defaultSize ?? { width: 900, height: 600 };
  return getCenteredFinderWindowPlacement(defaultSize);
}

function getTrashFinderWindowPlacement() {
  const finderApp = getAppById("finder");
  const defaultSize = finderApp?.defaultSize ?? { width: 900, height: 600 };
  const size = {
    width: Math.max(760, defaultSize.width - 140),
    height: Math.max(500, defaultSize.height - 80),
  };
  return getCenteredFinderWindowPlacement(size);
}

function getDocumentPickerFinderWindowPlacement() {
  const trashPlacement = getTrashFinderWindowPlacement();
  const size = {
    width: trashPlacement.size.width,
    height: Math.max(460, trashPlacement.size.height - 60),
  };
  return getCenteredFinderWindowPlacement(size);
}

function DesktopContent({
  initialAppId,
  initialNoteSlug,
  initialTextEditFile,
  initialPreviewFile,
}: {
  initialAppId?: string;
  initialNoteSlug?: string;
  initialTextEditFile?: string;
  initialPreviewFile?: string;
}) {
  const {
    openWindow,
    focusWindow,
    restoreWindow,
    getWindow,
    restoreDesktopDefault,
    state,
    // Multi-window methods
    openMultiWindow,
    closeMultiWindow,
    focusMultiWindow,
    minimizeMultiWindow,
    unminimizeMultiWindow,
    moveMultiWindow,
    resizeMultiWindow,
    toggleMaximizeMultiWindow,
    bringAppToFront,
    updateWindowMetadata,
    getWindowsByApp,
  } = useWindowManager();
  const { focusMode, currentOS } = useSystemSettings();
  const { touchRecent, addRecent } = useRecents();
  const { playbackState: nowPlayingState } = useAudio();
  const nowPlayingOpenedRef = useRef(false);
  const prevNowPlayingOpenRef = useRef(false);

  // Debounce touchRecent to avoid excessive re-renders
  const touchTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const debouncedTouchRecent = useCallback((path: string) => {
    if (touchTimers.current[path]) clearTimeout(touchTimers.current[path]);
    touchTimers.current[path] = setTimeout(() => {
      touchRecent(path);
      delete touchTimers.current[path];
    }, 500);
  }, [touchRecent]);

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = touchTimers.current;
    return () => Object.values(timers).forEach(clearTimeout);
  }, []);
  const [mode, setMode] = useState<DesktopMode>("locked");

  // Open Now Playing window the first time a track starts playing (unless user dismissed it)
  useEffect(() => {
    if (mode !== "active") return;
    if (hasDismissedNowPlaying()) return;

    if (nowPlayingState.isPlaying && nowPlayingState.currentTrack) {
      if (!nowPlayingOpenedRef.current) {
        nowPlayingOpenedRef.current = true;
        const win = getWindow("now-playing");
        if (!win?.isOpen) {
          openWindow("now-playing");
        } else if (win.isMinimized) {
          restoreWindow("now-playing");
        }
      }
    } else if (!nowPlayingState.currentTrack) {
      nowPlayingOpenedRef.current = false;
    }
  }, [mode, nowPlayingState.isPlaying, nowPlayingState.currentTrack, getWindow, openWindow, restoreWindow]);

  useEffect(() => {
    const win = getWindow("now-playing");
    const isOpen = win?.isOpen ?? false;
    if (prevNowPlayingOpenRef.current && !isOpen && nowPlayingState.currentTrack) {
      markNowPlayingDismissed();
    }
    prevNowPlayingOpenRef.current = isOpen;
  }, [getWindow, state.windows, nowPlayingState.currentTrack]);

  const [settingsPanel, setSettingsPanel] = useState<SettingsPanel | undefined>(undefined);
  const [settingsCategory, setSettingsCategory] = useState<SettingsCategory | undefined>(undefined);
  const [restoreDefaultOnUnlock, setRestoreDefaultOnUnlock] = useState(false);
  const [finderRouteProcessed, setFinderRouteProcessed] = useState(initialAppId !== "finder");
  const initialDocumentRouteAppId =
    initialAppId === "textedit" || initialAppId === "preview" ? initialAppId : null;
  const [documentAppRouteProcessed, setDocumentAppRouteProcessed] = useState(
    !(initialDocumentRouteAppId && !(initialDocumentRouteAppId === "textedit" ? initialTextEditFile : initialPreviewFile))
  );
  const [appBadges, setAppBadges] = useState<Record<string, number>>(() => {
    const badges: Record<string, number> = {};
    if (typeof window === "undefined") return badges;
    const unread = getMessagesUnreadCount();
    if (unread > 0) badges.messages = unread;
    return badges;
  });
  const [activeNotification, setActiveNotification] = useState<MessagesNotificationPayload | null>(null);
  const [isNotificationHovered, setIsNotificationHovered] = useState(false);
  const [messagesSelectRequest, setMessagesSelectRequest] = useState<MessagesConversationSelectRequest | null>(null);
  const nextMessagesSelectRequestIdRef = useRef(1);
  const notificationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const getNotesSlugForRouting = useCallback(
    () => getNotesSelectedSlugMemory() ?? loadNotesSelectedSlug() ?? undefined,
    []
  );
  // Get multi-window app state from the window manager
  const finderWindows = getWindowsByApp("finder");
  const textEditWindows = getWindowsByApp("textedit");
  const previewWindows = getWindowsByApp("preview");
  const documentAppWindows = useMemo(
    () => ({
      textedit: textEditWindows,
      preview: previewWindows,
    }),
    [textEditWindows, previewWindows]
  );
  const openFinderWindow = useCallback((
    initialPath = "recents",
    options?: { size?: { width: number; height: number }; position?: { x: number; y: number } }
  ) => {
    openMultiWindow("finder", createWindowInstanceId("finder"), {
      currentPath: initialPath,
    }, options?.size, options?.position);
  }, [openMultiWindow]);
  const openDedicatedFinderWindow = useCallback((
    initialPath: string,
    options?: { size?: { width: number; height: number }; position?: { x: number; y: number } }
  ) => {
    openFinderWindow(initialPath, options);
  }, [openFinderWindow]);
  const focusFinderApp = useCallback(() => {
    if (finderWindows.some((windowState) => windowState.isOpen)) {
      bringAppToFront("finder");
      return;
    }
    openDedicatedFinderWindow("recents", getDefaultFinderWindowPlacement());
  }, [finderWindows, bringAppToFront, openDedicatedFinderWindow]);
  const focusOrOpenTrashFinderWindow = useCallback(() => {
    const existingTrashWindow = [...finderWindows]
      .filter((windowState) => windowState.isOpen && String(windowState.metadata?.currentPath ?? "").startsWith("trash"))
      .sort((a, b) => b.zIndex - a.zIndex)[0];

    if (existingTrashWindow) {
      focusMultiWindow(existingTrashWindow.id);
      return;
    }

    openDedicatedFinderWindow("trash", getTrashFinderWindowPlacement());
  }, [finderWindows, focusMultiWindow, openDedicatedFinderWindow]);
  const handleInvalidFileRoute = useCallback((markProcessed: () => void) => {
    focusFinderApp();
    setUrl("/finder");
    markProcessed();
  }, [focusFinderApp]);

  const visibleFinderWindows = useMemo(
    () =>
      finderWindows
        .filter((w) => w.isOpen)
        .sort((a, b) => a.zIndex - b.zIndex),
    [finderWindows]
  );

  // Memoize filtered/sorted windows to avoid recomputing on every render
  const visibleTextEditWindows = useMemo(
    () =>
      textEditWindows
        .filter((w) => w.isOpen && !w.isMinimized && w.metadata?.filePath)
        .sort((a, b) => b.zIndex - a.zIndex),
    [textEditWindows]
  );

  const visiblePreviewWindows = useMemo(
    () =>
      previewWindows
        .filter((w) => w.isOpen && !w.isMinimized && w.metadata?.filePath)
        // Keep DOM order stable. Reordering iframe-backed windows on focus can trigger PDF reloads.
        .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })),
    [previewWindows]
  );

  // Track whether we've processed the URL file parameters
  const [urlFileProcessed, setUrlFileProcessed] = useState(!initialTextEditFile);
  const [urlPreviewProcessed, setUrlPreviewProcessed] = useState(!initialPreviewFile);

  useEffect(() => {
    if (mode !== "active") return;
    if (finderRouteProcessed || initialAppId !== "finder") return;

    if (finderWindows.some((w) => w.isOpen)) {
      focusFinderApp();
      setFinderRouteProcessed(true);
      return;
    }

    openDedicatedFinderWindow("recents", getDefaultFinderWindowPlacement());
    setFinderRouteProcessed(true);
  }, [mode, finderRouteProcessed, initialAppId, finderWindows, focusFinderApp, openDedicatedFinderWindow]);

  // Memoize the check for existing window to avoid effect re-runs
  const existingTextEditWindow = initialTextEditFile
    ? textEditWindows.find((w) => w.instanceId === initialTextEditFile)
    : null;
  const existingWindowId = existingTextEditWindow?.id;

  // Open TextEdit file from URL on mount (only once)
  useEffect(() => {
    if (mode !== "active") return;
    if (urlFileProcessed || !initialTextEditFile) return;

    const previewMetadata = getPreviewMetadataFromPath(initialTextEditFile);
    if (previewMetadata) {
      const { fileUrl, fileType } = previewMetadata;
      if (fileType === "pdf") {
        openMultiWindow("preview", initialTextEditFile, {
          filePath: initialTextEditFile,
          fileUrl,
          fileType,
        });
        setUrlFileProcessed(true);
        return;
      }

      loadImageAndGetSize(fileUrl).then((size) => {
        openMultiWindow(
          "preview",
          initialTextEditFile,
          { filePath: initialTextEditFile, fileUrl, fileType },
          size ?? undefined
        );
        setUrlFileProcessed(true);
      });
      return;
    }

    if (existingWindowId) {
      // Window already exists (restored from sessionStorage) - don't re-focus to preserve z-order
      setUrlFileProcessed(true);
      return;
    }

    // Window doesn't exist, need to create it
    const cachedContent = getTextEditContent(initialTextEditFile);
    if (cachedContent !== undefined) {
      const content = isLlmsDocPath(initialTextEditFile)
        ? getLlmsDocumentContent(cachedContent)
        : cachedContent;
      if (isLlmsDocPath(initialTextEditFile)) {
        cacheTextEditContent(initialTextEditFile, content);
      }
      openMultiWindow("textedit", initialTextEditFile, {
        filePath: initialTextEditFile,
        content,
      });
      setUrlFileProcessed(true);
    } else {
      if (!isSupportedTextEditPath(initialTextEditFile)) {
        handleInvalidFileRoute(() => setUrlFileProcessed(true));
        return;
      }
      fetchFileContent(initialTextEditFile).then((content) => {
        if (content === null) {
          handleInvalidFileRoute(() => setUrlFileProcessed(true));
          return;
        }
        openMultiWindow("textedit", initialTextEditFile, {
          filePath: initialTextEditFile,
          content,
        });
        setUrlFileProcessed(true);
      });
    }
  }, [mode, initialTextEditFile, urlFileProcessed, existingWindowId, openMultiWindow, handleInvalidFileRoute]);

  // Open Preview file from URL on mount (only once)
  const existingPreviewWindow = initialPreviewFile
    ? previewWindows.find((w) => w.instanceId === initialPreviewFile)
    : null;
  const existingPreviewWindowId = existingPreviewWindow?.id;

  useEffect(() => {
    if (mode !== "active") return;
    if (urlPreviewProcessed || !initialPreviewFile) return;

    if (existingPreviewWindowId) {
      // Window already exists (restored from sessionStorage) - don't re-focus to preserve z-order
      setUrlPreviewProcessed(true);
      return;
    }

    // Parse the file path to get URL and type
    const previewMeta = getPreviewMetadataFromPath(initialPreviewFile);
    if (previewMeta) {
      const { fileUrl, fileType } = previewMeta;

      if (fileType === "pdf") {
        openMultiWindow("preview", initialPreviewFile, {
          filePath: initialPreviewFile,
          fileUrl,
          fileType,
        });
        setUrlPreviewProcessed(true);
      } else {
        // For images, load to get dimensions first
        loadImageAndGetSize(fileUrl).then((size) => {
          openMultiWindow(
            "preview",
            initialPreviewFile,
            { filePath: initialPreviewFile, fileUrl, fileType },
            size ?? undefined
          );
          setUrlPreviewProcessed(true);
        });
      }
    } else {
      handleInvalidFileRoute(() => setUrlPreviewProcessed(true));
    }
  }, [mode, initialPreviewFile, urlPreviewProcessed, existingPreviewWindowId, openMultiWindow, handleInvalidFileRoute]);

  // Update URL when focus changes (only on unlocked desktop — avoids /resume on load)
  useEffect(() => {
    if (mode !== "active") return;

    const focusedWindowId = state.focusedWindowId;
    if (!focusedWindowId) {
      setUrl("/");
      return;
    }

    const focusedAppId = getAppIdFromWindowId(focusedWindowId);
    const focusedWindow = state.windows[focusedWindowId];
    const filePath = focusedWindow?.metadata?.filePath as string | undefined;
    const nextUrl = getShellUrlForApp(focusedAppId, {
      context: "desktop",
      currentPathname: window.location.pathname,
      noteSlug: getNotesSlugForRouting(),
      filePath,
    });
    if (nextUrl) {
      setUrl(nextUrl);
    }
  }, [mode, state.focusedWindowId, state.windows, getNotesSlugForRouting]);

  const isActive = mode === "active";

  // Handler for opening text files in TextEdit
  const handleOpenTextFile = useCallback(
    (filePath: string, content: string) => {
      let contentToUse: string;

      if (isIntroDocPath(filePath)) {
        contentToUse = getIntroDocumentContent();
      } else if (isLlmsDocPath(filePath)) {
        const cachedContent = getTextEditContent(filePath);
        contentToUse = getLlmsDocumentContent(cachedContent);
        cacheTextEditContent(filePath, contentToUse);
      } else {
        const cachedContent = getTextEditContent(filePath);
        contentToUse = cachedContent !== undefined ? cachedContent : content;
        if (cachedContent === undefined) {
          cacheTextEditContent(filePath, content);
        }
      }

      openMultiWindow("textedit", filePath, { filePath, content: contentToUse });
    },
    [openMultiWindow]
  );

  const handleOpenCaseStudy = useCallback(
    (study: CaseStudy) => {
      const emptyStudy = toEmptyCaseStudy(study);
      const filePath = getCaseStudyDocPath(study.slug);
      const existing = textEditWindows.find((w) => w.instanceId === filePath && w.isOpen);
      if (existing) {
        updateWindowMetadata(existing.id, { caseStudy: emptyStudy, content: "" });
        if (existing.isMinimized) {
          unminimizeMultiWindow(existing.id);
        }
        focusMultiWindow(existing.id);
        return;
      }
      openMultiWindow("textedit", filePath, {
        filePath,
        content: "",
        caseStudy: emptyStudy,
      });
    },
    [openMultiWindow, textEditWindows, focusMultiWindow, unminimizeMultiWindow, updateWindowMetadata]
  );

  const focusIntroWindow = useCallback(() => {
    const introWindow = getWindowsByApp("textedit").find(
      (w) => w.instanceId === INTRO_DOC_PATH && w.isOpen
    );
    if (introWindow) {
      focusMultiWindow(introWindow.id);
    }
  }, [getWindowsByApp, focusMultiWindow]);

  const openIntroWindow = useCallback(
    (options?: { addToRecents?: boolean }) => {
      const content = getIntroDocumentContent();
      cacheTextEditContent(INTRO_DOC_PATH, content);
      const existing = textEditWindows.find((w) => w.instanceId === INTRO_DOC_PATH);
      if (existing?.isOpen) {
        focusMultiWindow(existing.id);
        return;
      }
      if (options?.addToRecents) {
        addRecent({ path: INTRO_DOC_PATH, name: "intro.txt", type: "file" });
      }
      const placement = getCenteredTextEditPlacement();
      openMultiWindow(
        "textedit",
        INTRO_DOC_PATH,
        { filePath: INTRO_DOC_PATH, content },
        placement.size,
        placement.position
      );
      window.setTimeout(focusIntroWindow, 0);
    },
    [openMultiWindow, focusMultiWindow, textEditWindows, addRecent, focusIntroWindow]
  );

  const handleOpenIntro = useCallback(() => {
    openIntroWindow();
  }, [openIntroWindow]);

  // Handler for opening preview files (images and PDFs) in Preview
  const handleOpenPreviewFile = useCallback(
    (filePath: string, fileUrl: string, fileType: PreviewFileType) => {
      if (fileType === "pdf") {
        openMultiWindow("preview", filePath, { filePath, fileUrl, fileType });
        return;
      }

      // For images, load to get dimensions first
      loadImageAndGetSize(fileUrl).then((size) => {
        openMultiWindow("preview", filePath, { filePath, fileUrl, fileType }, size ?? undefined);
      });
    },
    [openMultiWindow]
  );

  // Handler for Finder dock icon click - focuses existing window or opens new one at Recents
  const handleFinderDockClick = useCallback(() => {
    focusFinderApp();
    const nextUrl = getShellUrlForApp("finder", { context: "desktop" });
    if (nextUrl) {
      setUrl(nextUrl);
    }
  }, [focusFinderApp]);

  // Handler for Trash dock icon click
  const handleTrashClick = useCallback(() => {
    focusOrOpenTrashFinderWindow();
  }, [focusOrOpenTrashFinderWindow]);

  const focusTopDocumentWindow = useCallback((windows: typeof textEditWindows) => {
    const topWindow = [...windows]
      .filter((windowState) => windowState.isOpen && !!windowState.metadata?.filePath)
      .sort((a, b) => b.zIndex - a.zIndex)[0];

    if (!topWindow) {
      return false;
    }

    focusMultiWindow(topWindow.id);
    return true;
  }, [focusMultiWindow]);

  const openDocumentAppPicker = useCallback((appId: DocumentAppId) => {
    openDedicatedFinderWindow(
      getDocumentAppFinderTarget(appId),
      getDocumentPickerFinderWindowPlacement()
    );
  }, [openDedicatedFinderWindow]);

  // Handler for opening apps from Finder
  const handleOpenApp = useCallback((appId: string) => {
    if (appId === "textedit" || appId === "preview") {
      const focusedExistingWindow = focusTopDocumentWindow(documentAppWindows[appId]);
      if (!focusedExistingWindow) {
        openDocumentAppPicker(appId);
      }
    } else {
      const windowState = getWindow(appId);
      if (windowState?.isOpen) {
        if (windowState.isMinimized) {
          restoreWindow(appId);
        } else {
          focusWindow(appId);
        }
      } else {
        openWindow(appId);
      }
    }
    const nextUrl = getShellUrlForApp(appId, {
      context: "desktop",
      currentPathname: window.location.pathname,
      noteSlug: getNotesSlugForRouting(),
    });
    if (nextUrl) {
      setUrl(nextUrl);
    }
  }, [getWindow, restoreWindow, focusWindow, openWindow, getNotesSlugForRouting, focusTopDocumentWindow, documentAppWindows, openDocumentAppPicker]);

  useEffect(() => {
    if (mode !== "active") return;
    if (documentAppRouteProcessed) return;

    if (initialDocumentRouteAppId && !(initialDocumentRouteAppId === "textedit" ? initialTextEditFile : initialPreviewFile)) {
      handleOpenApp(initialDocumentRouteAppId);
      setDocumentAppRouteProcessed(true);
    }
  }, [mode, documentAppRouteProcessed, initialDocumentRouteAppId, initialTextEditFile, initialPreviewFile, handleOpenApp]);

  function getCenteredTextEditPlacement() {
    const texteditApp = getAppById("textedit");
    const size = texteditApp?.defaultSize ?? { width: 700, height: 500 };
    return getCenteredFinderWindowPlacement(size);
  }

  // Menu bar handlers
  const handleOpenSettings = useCallback(() => {
    setSettingsCategory("general");
    setSettingsPanel(null);
    openWindow("settings");
    const nextUrl = getShellUrlForApp("settings", { context: "desktop" });
    if (nextUrl) {
      setUrl(nextUrl);
    }
  }, [openWindow]);

  const handleOpenWifiSettings = useCallback(() => {
    setSettingsCategory("wifi");
    setSettingsPanel(null);
    openWindow("settings");
    const nextUrl = getShellUrlForApp("settings", { context: "desktop" });
    if (nextUrl) {
      setUrl(nextUrl);
    }
  }, [openWindow]);

  const handleOpenAbout = useCallback(() => {
    setSettingsCategory("general");
    setSettingsPanel("about");
    openWindow("settings");
    const nextUrl = getShellUrlForApp("settings", { context: "desktop" });
    if (nextUrl) {
      setUrl(nextUrl);
    }
  }, [openWindow]);

  const handleSleep = useCallback(() => setMode("sleeping"), []);
  const handleRestart = useCallback(() => setMode("restarting"), []);
  const handleShutdown = useCallback(() => setMode("shuttingDown"), []);
  const handleLockScreen = useCallback(() => setMode("locked"), []);

  const handleLogout = useCallback(() => {
    setRestoreDefaultOnUnlock(true);
    setMode("locked");
  }, []);

  const handleWake = useCallback(() => setMode("locked"), []);

  const handleBootComplete = useCallback(() => {
    setRestoreDefaultOnUnlock(true);
    setMode("locked");
  }, []);

  const handleUnlock = useCallback(() => {
    setMode("active");
    markIntroShown();

    if (restoreDefaultOnUnlock) {
      restoreDesktopDefault();
      setRestoreDefaultOnUnlock(false);
    }

    openIntroWindow({ addToRecents: true });
  }, [restoreDefaultOnUnlock, restoreDesktopDefault, openIntroWindow]);

  const handleMessagesUnreadBadgeChange = useCallback((count: number) => {
    const safeCount = Math.max(0, Math.floor(count));
    setAppBadges((prev) => {
      if ((prev.messages ?? 0) === safeCount) return prev;
      return { ...prev, messages: safeCount };
    });
  }, []);

  const handleMessagesNotification = useCallback((notification: MessagesNotificationPayload) => {
    setActiveNotification(notification);
  }, []);

  const handleNotificationDismiss = useCallback(() => {
    setActiveNotification(null);
    setIsNotificationHovered(false);
  }, []);

  useEffect(() => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
      notificationTimeoutRef.current = null;
    }
    if (!activeNotification) return;
    if (isNotificationHovered) return;
    notificationTimeoutRef.current = setTimeout(() => {
      setActiveNotification(null);
      notificationTimeoutRef.current = null;
    }, 3000);
  }, [activeNotification, isNotificationHovered]);

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  const handleNotificationClick = useCallback((notification: MessagesNotificationPayload) => {
    const { conversationId } = notification;
    saveMessagesConversation(conversationId);
    const requestId = nextMessagesSelectRequestIdRef.current++;
    setMessagesSelectRequest({ conversationId, requestId });
    setActiveNotification(null);
    setIsNotificationHovered(false);

    const messagesWindow = getWindow("messages");
    if (messagesWindow?.isOpen) {
      if (messagesWindow.isMinimized) {
        restoreWindow("messages");
      } else {
        focusWindow("messages");
      }
      return;
    }
    openWindow("messages");
  }, [getWindow, restoreWindow, focusWindow, openWindow]);

  const handleOpenMessagesConversation = useCallback((conversationId: string) => {
    saveMessagesConversation(conversationId);
    const requestId = nextMessagesSelectRequestIdRef.current++;
    setMessagesSelectRequest({ conversationId, requestId });

    const messagesWindow = getWindow("messages");
    if (messagesWindow?.isOpen) {
      if (messagesWindow.isMinimized) {
        restoreWindow("messages");
      } else {
        focusWindow("messages");
      }
      return;
    }
    openWindow("messages");
  }, [getWindow, restoreWindow, focusWindow, openWindow]);

  const handleMessagesSelectRequestHandled = useCallback((requestId: number) => {
    setMessagesSelectRequest((prev) => {
      if (!prev || prev.requestId !== requestId) return prev;
      return null;
    });
  }, []);

  return (
    <div className="fixed inset-0" data-shell="desktop">
      <Image
        src={getWallpaperPath(currentOS.id)}
        alt="Desktop wallpaper"
        fill
        className="object-cover -z-10"
        priority
        quality={75}
      />
      {isActive && (
      <MenuBar
        onOpenSettings={handleOpenSettings}
        onOpenWifiSettings={handleOpenWifiSettings}
        onOpenAbout={handleOpenAbout}
        onSleep={handleSleep}
        onRestart={handleRestart}
        onShutdown={handleShutdown}
        onLockScreen={handleLockScreen}
        onLogout={handleLogout}
        onOpenMessagesConversation={handleOpenMessagesConversation}
      />
      )}

      {isActive && (
        <>
          <Window appId="notes">
            <NotesApp inShell={true} initialSlug={initialNoteSlug} />
          </Window>

          <Window appId="messages" keepMountedWhenMinimized={true}>
            <MessagesApp
              inShell={true}
              focusModeActive={focusMode !== "off"}
              onUnreadBadgeCountChange={handleMessagesUnreadBadgeChange}
              onNotification={handleMessagesNotification}
              externalSelectConversationRequest={messagesSelectRequest}
              onExternalSelectRequestHandled={handleMessagesSelectRequestHandled}
            />
          </Window>

          <Window appId="settings">
            <SettingsApp inShell={true} initialPanel={settingsPanel} initialCategory={settingsCategory} />
          </Window>

          <Window appId="photos">
            <PhotosApp inShell={true} />
          </Window>

          <Window appId="calendar">
            <CalendarApp inShell={true} />
          </Window>

          <Window appId="weather">
            <WeatherApp inShell={true} />
          </Window>

          <Window appId="desk">
            <MusicApp />
          </Window>

          <Window appId="now-playing">
            <NowPlayingWindow />
          </Window>

          <Window appId="resume">
            <ResumeApp
              inShell={true}
              onOpenApp={handleOpenApp}
              onOpenTextFile={handleOpenTextFile}
              onOpenPreviewFile={handleOpenPreviewFile}
              onOpenCaseStudy={handleOpenCaseStudy}
            />
          </Window>

          {visibleFinderWindows.map((windowState) => {
              const currentPath = windowState.metadata?.currentPath as string | undefined;
              return (
                <Window
                  key={windowState.id}
                  appId="finder"
                  keepMountedWhenMinimized={true}
                  windowStateOverride={windowState}
                  controlledHandlers={{
                    focusWindow: () => focusMultiWindow(windowState.id),
                    closeWindow: () => closeMultiWindow(windowState.id),
                    minimizeWindow: () => minimizeMultiWindow(windowState.id),
                    toggleMaximize: () => toggleMaximizeMultiWindow(windowState.id),
                    moveWindow: (position) => moveMultiWindow(windowState.id, position),
                    resizeWindow: (size, position) => resizeMultiWindow(windowState.id, size, position),
                  }}
                >
                  <FinderApp
                    inShell={true}
                    initialPath={currentPath}
                    onPathChange={(path) => updateWindowMetadata(windowState.id, { currentPath: path })}
                    onOpenApp={handleOpenApp}
                    onOpenTextFile={handleOpenTextFile}
                    onOpenPreviewFile={handleOpenPreviewFile}
                  />
                </Window>
              );
            })}

          {/* TextEdit - multi-window support */}
          {/* On small screens, only show the topmost window */}
          {visibleTextEditWindows.map((windowState) => {
              const filePath = windowState.metadata!.filePath as string;
              const content = (windowState.metadata?.content as string) ?? "";
              const caseStudy = windowState.metadata?.caseStudy as CaseStudy | undefined;
              return (
                <TextEditWindow
                  key={windowState.id}
                  windowId={windowState.id}
                  filePath={filePath}
                  content={content}
                  caseStudy={caseStudy}
                  position={windowState.position}
                  size={windowState.size}
                  zIndex={windowState.zIndex}
                  isFocused={state.focusedWindowId === windowState.id}
                  isMaximized={windowState.isMaximized}
                  onFocus={() => focusMultiWindow(windowState.id)}
                  onClose={() => closeMultiWindow(windowState.id)}
                  onMinimize={() => minimizeMultiWindow(windowState.id)}
                  onToggleMaximize={() => toggleMaximizeMultiWindow(windowState.id)}
                  onMove={(pos) => moveMultiWindow(windowState.id, pos)}
                  onResize={(size, pos) => resizeMultiWindow(windowState.id, size, pos)}
                  onContentChange={(newContent) => {
                    const prior = (windowState.metadata?.content as string) ?? "";
                    const safeContent = isIntroDocPath(filePath)
                      ? enforceIntroAppendOnly(newContent, prior)
                      : isLlmsDocPath(filePath)
                        ? enforceLlmsAppendOnly(newContent, prior)
                        : newContent;
                    updateWindowMetadata(windowState.id, { content: safeContent });
                    if (filePath) {
                      saveTextEditContent(filePath, safeContent);
                      if (!isIntroDocPath(filePath)) {
                        debouncedTouchRecent(filePath);
                      }
                    }
                  }}
                  onOpenApp={isIntroDocPath(filePath) ? handleOpenApp : undefined}
                  onOpenTrash={isIntroDocPath(filePath) ? handleTrashClick : undefined}
                />
              );
            })}

          {/* Preview - multi-window support for images and PDFs */}
          {visiblePreviewWindows.map((windowState) => {
              const filePath = windowState.metadata!.filePath as string;
              const fileUrl = windowState.metadata!.fileUrl as string;
              const fileType = windowState.metadata!.fileType as PreviewFileType;
              const zoom = (windowState.metadata?.zoom as number) ?? 1;
              const scrollLeft = (windowState.metadata?.scrollLeft as number) ?? 0;
              const scrollTop = (windowState.metadata?.scrollTop as number) ?? 0;
              return (
                <PreviewWindow
                  key={windowState.id}
                  filePath={filePath}
                  fileUrl={fileUrl}
                  fileType={fileType}
                  position={windowState.position}
                  size={windowState.size}
                  zIndex={windowState.zIndex}
                  isFocused={state.focusedWindowId === windowState.id}
                  isMaximized={windowState.isMaximized}
                  initialZoom={zoom}
                  initialScrollLeft={scrollLeft}
                  initialScrollTop={scrollTop}
                  onFocus={() => focusMultiWindow(windowState.id)}
                  onClose={() => closeMultiWindow(windowState.id)}
                  onMinimize={() => minimizeMultiWindow(windowState.id)}
                  onToggleMaximize={() => toggleMaximizeMultiWindow(windowState.id)}
                  onMove={(pos) => moveMultiWindow(windowState.id, pos)}
                  onResize={(size, pos) => resizeMultiWindow(windowState.id, size, pos)}
                  onZoomChange={(newZoom) => updateWindowMetadata(windowState.id, { zoom: newZoom })}
                  onScrollChange={(left, top) => updateWindowMetadata(windowState.id, { scrollLeft: left, scrollTop: top })}
                />
              );
            })}

          <DesktopIcons onOpenIntro={handleOpenIntro} />
          <PhotoTrail />
          <DesktopStickyNote />
          <Dock
            onTrashClick={handleTrashClick}
            onFinderClick={handleFinderDockClick}
            appBadges={appBadges}
          />
          <MessagesNotificationBanner
            notification={activeNotification}
            onClick={handleNotificationClick}
            onDismiss={handleNotificationDismiss}
            onHoverChange={setIsNotificationHovered}
          />
        </>
      )}

      {mode === "locked" && <LockScreen onUnlock={handleUnlock} />}
      {mode === "sleeping" && <SleepOverlay onWake={handleWake} />}
      {mode === "shuttingDown" && <ShutdownOverlay onBootComplete={handleBootComplete} />}
      {mode === "restarting" && <RestartOverlay onBootComplete={handleBootComplete} />}
    </div>
  );
}

export function Desktop({ initialAppId, initialNoteSlug, initialTextEditFile, initialPreviewFile }: DesktopProps) {
  return (
    <RecentsProvider>
      <FileMenuProvider>
        <WindowManagerProvider key={initialAppId || "default"} initialAppId={initialAppId}>
          <DesktopContent
            initialAppId={initialAppId}
            initialNoteSlug={initialNoteSlug}
            initialTextEditFile={initialTextEditFile}
            initialPreviewFile={initialPreviewFile}
          />
        </WindowManagerProvider>
      </FileMenuProvider>
    </RecentsProvider>
  );
}