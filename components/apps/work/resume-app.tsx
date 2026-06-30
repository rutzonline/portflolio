"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { useWindowFocus } from "@/lib/window-focus-context";
import { useRecents } from "@/lib/recents-context";
import { cn } from "@/lib/utils";
import { SIDEBAR_ITEM_ACTIVE_CLASS, ACCENT_BLUE_CLASS, FILE_LIST_ROW_SELECTED_CLASS, DESKTOP_NAV_SIDEBAR_WIDTH_CLASS, IOS_MOBILE_LIST_CHEVRON_CLASS, IOS_MOBILE_LIST_ROW_CLASS, IOS_MOBILE_LIST_ROW_SUBTITLE_CLASS, IOS_MOBILE_LIST_ROW_TITLE_CLASS, IOS_MOBILE_LIST_SCREEN_CLASS } from "@/lib/ui-tokens";
import { IosMobileListGroup } from "@/components/mobile/ios/ios-mobile-list";
import { FinderNav, FinderSidebarMobileNav } from "../finder/nav";
import { IosWindowNavBack } from "@/components/mobile/ios/ios-window-nav-back";
import { IosMobileNavTitle } from "@/components/mobile/ios/ios-mobile-nav-title";
import { WindowNavShell, WindowNavSpacer } from "@/components/window-nav-shell";
import type { SidebarItem } from "../finder/sidebar-types";
import { getSearchSectionForSidebar, STATIC_SIDEBAR_PANELS } from "../finder/sidebar-types";
import { APPS } from "@/lib/app-config";
import {
  HOME_DIR,
  LOCAL_FINDER_FILES,
  FINDER_DOWNLOAD_APP_URLS,
  getLocalTextFileContent,
  PROJECTS_DIR,
} from "@/lib/file-route-utils";
import { getFinderVisibleApps } from "@/lib/app-availability";
import { getFileModifiedDate } from "@/lib/file-storage";
import { saveFinderPath } from "@/lib/sidebar-persistence";
import { DESKTOP_FINDER_PATH } from "@/lib/desktop-folder";
import { getPreviewMetadataFromPath } from "@/lib/preview-utils";
import {
  fetchGitHubFileContentOrNull,
  fetchGitHubRecentFiles,
  fetchGitHubRepoTree,
  fetchGitHubRepos,
  getCachedRepoTrees,
  prefetchAllRepoTrees,
  type GitHubRecentFile,
} from "@/lib/github-client";
import { useRouter } from "next/navigation";
import { FinderSearchEngine, type EntryInput } from "../finder/search-engine";
import { CaseStudyDetail } from "./case-studies/case-study-detail";
import { SelectedWorkFolders } from "./selected-work-folders";
import { getCaseStudyDocPath, toEmptyCaseStudy } from "@/lib/case-study-doc";
import { WorkTimeline, WorkStintDetail, WORK_STINT_DETAILS_ENABLED, type WorkStint } from "./work-timeline";
import type { CaseStudy } from "@/types/work";
import {
  EDUCATION_SECTIONS,
  SKILLS_SECTIONS,
  TOOLS_SECTIONS,
} from "@/components/apps/resume/data";
import { LearningCardsPanel } from "@/components/apps/resume/learning-cards-panel";
import { LanguagesResumePanel } from "@/components/apps/resume/languages-resume-panel";
import { FaqResumePanel } from "@/components/apps/resume/faq-resume-panel";
import { ContactResumePanel } from "@/components/apps/resume/contact-resume-panel";
import {
  RESUME_PANEL_CARD_OVERFLOW_CLASS,
  RESUME_PANEL_COL_DIVIDER,
  resumePanelScrollClass,
} from "@/components/apps/resume/resume-panel-styles";

const USERNAME = "rutuja rochkari";

interface FileItem {
  name: string;
  type: "file" | "dir" | "app";
  path: string;
  icon?: string;
  displayName?: string;
}

// Sidebar items

// Sidebar items that show a static info panel instead of files
const STATIC_PANEL_ITEMS = STATIC_SIDEBAR_PANELS;

const SIDEBAR_ITEMS: { id: SidebarItem; label: string; icon: string }[] = [
  { id: "documents", label: "Experience", icon: "document" },
  { id: "education", label: "Education", icon: "desktop" },
  { id: "skills", label: "Skills", icon: "grid" },
  { id: "tools", label: "Tools & Stack", icon: "code" },
  { id: "certifications", label: "Certifications", icon: "certification" },
  { id: "selected-work", label: "Selected Work", icon: "folder" },
  { id: "contact", label: "Contact", icon: "phone" },
  { id: "faqs", label: "FAQs", icon: "help" },
];

// Static panel content
const STATIC_PANEL_CONTENT: Record<string, { heading: string; items: string[] }[]> = {
  skills: SKILLS_SECTIONS,
  education: EDUCATION_SECTIONS,
  tools: TOOLS_SECTIONS,
};

// Mock deleted files for Trash
const TRASH_FILES: FileItem[] = [
  { name: "old-notes.md", type: "file", path: "trash/old-notes.md" },
  { name: "draft-v1.tsx", type: "file", path: "trash/draft-v1.tsx" },
  { name: "unused-assets", type: "dir", path: "trash/unused-assets" },
  { name: "backup-2024", type: "dir", path: "trash/backup-2024" },
  { name: "config.old.json", type: "file", path: "trash/config.old.json" },
];

interface ResumeAppProps {
  isMobile?: boolean;
  inShell?: boolean;
  onOpenApp?: (appId: string) => void;
  onOpenTextFile?: (filePath: string, content: string) => void;
  onOpenPreviewFile?: (filePath: string, fileUrl: string, fileType: "image" | "pdf") => void;
  onOpenCaseStudy?: (study: CaseStudy) => void;
  initialPath?: string;
  onPathChange?: (path: string) => void;
}

// Image extensions that should open in Preview
const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico"];

function isImageFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return IMAGE_EXTENSIONS.includes(ext);
}

function isPdfFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ext === "pdf";
}

// Preview handles images and PDFs
function isPreviewFile(filename: string): boolean {
  return isImageFile(filename) || isPdfFile(filename);
}
// Icon component
function FileIcon({ type, name, icon, className }: { type: "file" | "dir" | "app"; name: string; icon?: string; className?: string }) {
  // File type icons based on extension
  const getFileIcon = () => {
    if (type === "dir") {
      return (
        <svg className={cn("text-accent-blue", className)} viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
        </svg>
      );
    }
    if (type === "app") {
      const cleanName = name.replace(/\.app$/i, '');

      // Use the passed icon prop if available, otherwise look up by name
      const appIcon = icon || APPS.find(a => {
        return a.name === cleanName || a.id === cleanName.toLowerCase();
      })?.icon;
      if (appIcon) {
        return (
          <Image
            src={appIcon}
            alt={name}
            width={48}
            height={48}
            className={className}
          />
        );
      }
    }
    // File icon
    const ext = name.split('.').pop()?.toLowerCase();
    let color = "text-zinc-400";
    if (ext === "md") color = "text-blue-400";
    else if (ext === "ts" || ext === "tsx") color = "text-blue-600";
    else if (ext === "js" || ext === "jsx") color = "text-yellow-500";
    else if (ext === "json") color = "text-green-500";
    else if (ext === "css") color = "text-pink-500";

    return (
      <svg className={cn(color, className)} viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
      </svg>
    );
  };

  return getFileIcon();
}

// Sidebar icon component
function SidebarIcon({ icon, className }: { icon: string; className?: string }) {
  const icons: Record<string, JSX.Element> = {
    clock: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    grid: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
      </svg>
    ),
    desktop: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" />
      </svg>
    ),
    folder: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
      </svg>
    ),
    document: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
      </svg>
    ),
    download: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
      </svg>
    ),
    code: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
      </svg>
    ),
    certification: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="12" height="16" rx="1" />
        <line x1="8.5" y1="8" x2="14" y2="8" strokeWidth="2.25" />
      </svg>
    ),
    award: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v8l3-2 3 2V3" />
      </svg>
    ),
    heart: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
    phone: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    help: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
    trash: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
      </svg>
    ),
  };
  return icons[icon] || null;
}

export function ResumeApp({
  isMobile = false,
  inShell = false,
  onOpenApp,
  onOpenTextFile,
  onOpenPreviewFile,
  onOpenCaseStudy,
  initialPath,
  onPathChange,
}: ResumeAppProps) {
  const router = useRouter();
  const windowFocus = useWindowFocus();
  const { recents, addRecent, fileModifiedVersion } = useRecents();
  const containerRef = useRef<HTMLDivElement>(null);

  // Map sidebar item to its base path
  const getPathForSidebarItem = useCallback((tab: SidebarItem): string => {
    switch (tab) {
      case "recents": return "recents";
      case "applications": return "applications";
      case "desktop": return `${HOME_DIR}/Desktop`;
      case "documents": return `${HOME_DIR}/Documents`;
      case "selected-work": return "selected-work";
      case "downloads": return `${HOME_DIR}/Downloads`;
      case "projects": return PROJECTS_DIR;
      case "trash": return "trash";
      // Static panel items use their id as the path
      case "skills": return "skills";
      case "education": return "education";
      case "tools": return "tools";
      case "certifications": return "certifications";
      case "contact": return "contact";
      case "faqs": return "faqs";
      default: return `${HOME_DIR}/Documents`;
    }
  }, []);

  // Derive sidebar item from a path (inverse of getPathForSidebarItem)
  const getSidebarForPath = (path: string): SidebarItem => {
    if (path === "recents") return "recents";
    if (path === "applications") return "applications";
    if (path === "trash" || path.startsWith("trash/")) return "trash";
    if (path === `${HOME_DIR}/Desktop` || path.startsWith(`${HOME_DIR}/Desktop/`)) return "desktop";
    if (path === `${HOME_DIR}/Documents` || path.startsWith(`${HOME_DIR}/Documents/`)) return "documents";
    if (path === "selected-work") return "selected-work";
    if (path === `${HOME_DIR}/Downloads` || path.startsWith(`${HOME_DIR}/Downloads/`)) return "downloads";
    if (path === PROJECTS_DIR || path.startsWith(`${PROJECTS_DIR}/`)) return "projects";
    // Static panel sections
    if (path === "skills") return "skills";
    if (path === "education") return "education";
    if (path === "tools") return "tools";
    if (path === "certifications") return "certifications";
    if (path === "contact") return "contact";
    if (path === "faqs") return "faqs";
    return "documents";
  };

  const getInitialPath = (): string => {
    if (initialPath) return initialPath;
    return `${HOME_DIR}/Documents`;
  };

  const [currentPath, setCurrentPathRaw] = useState(getInitialPath);
  const [pathHistory, setPathHistory] = useState<string[]>(() => [getInitialPath()]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedSidebar, setSelectedSidebar] = useState<SidebarItem>(() => getSidebarForPath(currentPath));
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true); // For mobile
  const [viewMode, setViewMode] = useState<"icons" | "list">("list");
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [githubRecentFiles, setGithubRecentFiles] = useState<GitHubRecentFile[]>([]);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [selectedWorkFolderSlug, setSelectedWorkFolderSlug] = useState<string | null>(null);
  const [selectedWorkStint, setSelectedWorkStint] = useState<WorkStint | null>(null);

  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState<"current" | "all">("all");
  const [searchHighlightIndex, setSearchHighlightIndex] = useState(-1);
  const [searchIndexSize, setSearchIndexSize] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const searchPrefetchStartedRef = useRef(false);
  const searchEngine = useMemo(() => new FinderSearchEngine(), []);

  const historyIndexRef = useRef(historyIndex);
  historyIndexRef.current = historyIndex;
  const currentPathRef = useRef(currentPath);
  currentPathRef.current = currentPath;
  const lastReportedPathRef = useRef<string | null>(null);

  const setCurrentPath = useCallback((path: string) => {
    if (path === currentPathRef.current) return;
    setCurrentPathRaw(path);
    setPathHistory((prev) => [...prev.slice(0, historyIndexRef.current + 1), path]);
    setHistoryIndex((prev) => prev + 1);
  }, []);

  const canGoForward = historyIndex < pathHistory.length - 1;
  const finderContext = isMobile ? "mobile" : "desktop";
  const finderVisibleApps = useMemo(
    () => getFinderVisibleApps(finderContext),
    [finderContext]
  );

  const handleForward = useCallback(() => {
    if (!canGoForward) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    setCurrentPathRaw(pathHistory[nextIndex]);
    setSelectedSidebar(getSidebarForPath(pathHistory[nextIndex]));
  }, [canGoForward, historyIndex, pathHistory]);

  const inDesktopShell = !!(inShell && windowFocus);

  // Load files for current path
  const loadFiles = useCallback(async (path: string) => {
    setLoading(true);
    setPreviewContent(null);

    try {
      // Special handling for Recents - handled separately via useEffect
      if (path === "recents") {
        setLoading(false);
        return;
      }

      // Special handling for Applications
      if (path === "applications") {
        const apps: FileItem[] = finderVisibleApps
          .map(app => ({
            name: app.name,
            type: "app" as const,
            path: `/${app.id}`, // Route path for navigation
            icon: app.icon,
          }));
        setFiles(apps);
        setLoading(false);
        return;
      }

      // Special handling for Trash
      if (path === "trash") {
        setFiles(TRASH_FILES);
        setLoading(false);
        return;
      }

      // Handle trash subdirectories (show as empty for mock data)
      if (path.startsWith("trash/")) {
        setFiles([]);
        setLoading(false);
        return;
      }

      // Projects directory - fetch from GitHub
      if (path === PROJECTS_DIR) {
        const repos = await fetchGitHubRepos();
        setFiles(repos.map(repo => ({
          name: repo,
          type: "dir" as const,
          path: `${PROJECTS_DIR}/${repo}`,
        })));
        setLoading(false);
        return;
      }

      // Inside a GitHub repo
      if (path.startsWith(PROJECTS_DIR + "/")) {
        const relativePath = path.slice(PROJECTS_DIR.length + 1);
        const parts = relativePath.split("/");
        const repo = parts[0];
        const repoPath = parts.slice(1).join("/");

        const tree = await fetchGitHubRepoTree(repo);

        // Filter to show only items at current level
        const items = tree.filter(item => {
          if (!repoPath) {
            return !item.path.includes("/");
          }
          if (!item.path.startsWith(repoPath + "/")) {
            return false;
          }
          const remaining = item.path.slice(repoPath.length + 1);
          return remaining && !remaining.includes("/");
        });

        setFiles(items.map(item => ({
          name: item.name,
          type: item.type,
          path: `${PROJECTS_DIR}/${repo}/${item.path}`,
        })));
        setLoading(false);
        return;
      }

      // Static panel sections (Skills, Education, Tools, Certifications, Contact) — no files
      if (STATIC_PANEL_ITEMS.has(path as SidebarItem)) {
        setFiles([]);
        setLoading(false);
        return;
      }

      // Work sidebar Documents = case study grid (not file list)
      if (path === `${HOME_DIR}/Documents`) {
        setFiles([]);
      } else if (path === DESKTOP_FINDER_PATH) {
        try {
          const res = await fetch("/api/finder/desktop-files");
          if (res.ok) {
            const data = await res.json();
            setFiles(data.files ?? []);
          } else {
            setFiles([]);
          }
        } catch {
          setFiles([]);
        }
      } else if (LOCAL_FINDER_FILES[path]) {
        setFiles(LOCAL_FINDER_FILES[path]);
      } else {
        setFiles([]);
      }
    } catch {
      setFiles([]);
    }

    setLoading(false);
  }, [finderVisibleApps]);

  // Load files when path changes
  useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath, loadFiles]);

  // Desktop windows sync path back into window metadata; standalone/mobile Finder keeps the legacy session path.
  useEffect(() => {
    if (lastReportedPathRef.current !== currentPath) {
      onPathChange?.(currentPath);
      lastReportedPathRef.current = currentPath;
    }
    if (!inShell) {
      saveFinderPath(currentPath);
    }
  }, [currentPath, inShell, onPathChange]);

  // Fetch GitHub files when entering Recents (only fetches, doesn't sort)
  useEffect(() => {
    if (currentPath !== "recents") return;

    const abortController = new AbortController();
    let cancelled = false;

    const fetchGithubData = async () => {
      setLoading(true);
      try {
        const files = await fetchGitHubRecentFiles(abortController.signal);
        if (!cancelled) {
          setGithubRecentFiles(files);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        // Silently handle fetch errors - will show empty recents
      }
      if (!cancelled) setLoading(false);
    };

    fetchGithubData();
    return () => {
      cancelled = true;
      abortController.abort();
    };
  }, [currentPath]);

  // Compute sorted recents from GitHub files + local recents (re-sorts when either changes)
  const sortedRecentFiles = useMemo(() => {
    // Force recalculation when file modified timestamps are bumped via context.
    void fileModifiedVersion;
    const allFiles: Array<{ file: FileItem; timestamp: number }> = [];
    const seenPaths = new Set<string>();

    // Add GitHub files
    for (const gf of githubRecentFiles) {
      const fullPath = `${PROJECTS_DIR}/${gf.repo}/${gf.path}`;
      const githubTime = new Date(gf.modifiedAt).getTime();
      const textEditTime = getFileModifiedDate(fullPath);
      const effectiveTime = textEditTime && textEditTime > githubTime ? textEditTime : githubTime;

      seenPaths.add(fullPath);
      allFiles.push({
        file: {
          name: gf.path.split("/").pop() || gf.path,
          type: "file" as const,
          path: fullPath,
        },
        timestamp: effectiveTime,
      });
    }

    // Add local recents not in GitHub files
    for (const r of recents) {
      if (!seenPaths.has(r.path)) {
        const textEditTime = getFileModifiedDate(r.path);
        const effectiveTime = textEditTime || r.accessedAt;
        allFiles.push({
          file: { name: r.name, type: r.type, path: r.path },
          timestamp: effectiveTime,
        });
      }
    }

    // Sort by timestamp (most recent first)
    allFiles.sort((a, b) => b.timestamp - a.timestamp);

    // Disambiguate duplicate file names by walking up the path
    const nameCount = new Map<string, number>();
    for (const entry of allFiles) {
      nameCount.set(entry.file.name, (nameCount.get(entry.file.name) || 0) + 1);
    }
    const dupes = allFiles.filter(e => (nameCount.get(e.file.name) || 0) > 1);
    if (dupes.length > 0) {
      const segments = dupes.map(e => e.file.path.split("/"));
      // Walk up from parent dir until all display names are unique
      for (let depth = 2; depth <= Math.max(...segments.map(s => s.length)); depth++) {
        const names = segments.map(s =>
          s.length >= depth ? s.slice(-depth).join("/") : s.join("/")
        );
        const unique = new Set(names).size === names.length;
        if (unique) {
          dupes.forEach((entry, i) => {
            entry.file = { ...entry.file, displayName: names[i] };
          });
          break;
        }
      }
    }

    return allFiles.map(f => f.file);
  }, [githubRecentFiles, recents, fileModifiedVersion]);

  // Update files state when viewing Recents
  useEffect(() => {
    if (currentPath === "recents") {
      setFiles(sortedRecentFiles);
    }
  }, [currentPath, sortedRecentFiles]);

  useEffect(() => {
    const entries: EntryInput[] = [];

    for (const items of Object.values(LOCAL_FINDER_FILES)) {
      for (const item of items) {
        const section: SidebarItem = item.path.includes("/Desktop")
          ? "desktop"
          : item.path.includes("/Documents")
            ? "documents"
            : item.path.includes("/Downloads")
              ? "downloads"
              : item.path.includes("/Projects")
                ? "projects"
                : "desktop";
        entries.push({ ...item, section });
      }
    }

    for (const item of TRASH_FILES) {
      entries.push({ ...item, section: "trash" });
    }

    for (const app of finderVisibleApps) {
      entries.push({
        name: app.name,
        type: "app",
        path: `/${app.id}`,
        icon: app.icon,
        section: "applications",
      });
    }

    for (const [repo, tree] of Object.entries(getCachedRepoTrees())) {
      const basePath = `${PROJECTS_DIR}/${repo}`;
      entries.push({ name: repo, type: "dir", path: basePath, section: "projects" });
      for (const item of tree) {
        entries.push({
          name: item.name,
          type: item.type,
          path: `${basePath}/${item.path}`,
          section: "projects",
        });
      }
    }

    searchEngine.buildIndex(entries);
    setSearchIndexSize(searchEngine.version);
  }, [searchEngine, finderVisibleApps]);

  useEffect(() => {
    if (!searchActive || searchPrefetchStartedRef.current) return;
    searchPrefetchStartedRef.current = true;
    let cancelled = false;

    const repoEntry = (repo: string): EntryInput => ({
      name: repo, type: "dir", path: `${PROJECTS_DIR}/${repo}`, section: "projects",
    });

    const hydrateProjectsIndex = async () => {
      try {
        const repos = await fetchGitHubRepos();
        if (cancelled) return;
        searchEngine.addEntries(repos.map(repoEntry));
        setSearchIndexSize(searchEngine.version);

        await prefetchAllRepoTrees();
        if (cancelled) return;

        const projectEntries: EntryInput[] = [];
        for (const [repo, tree] of Object.entries(getCachedRepoTrees())) {
          const basePath = `${PROJECTS_DIR}/${repo}`;
          projectEntries.push(repoEntry(repo));
          for (const item of tree) {
            projectEntries.push({
              name: item.name,
              type: item.type,
              path: `${basePath}/${item.path}`,
              section: "projects",
            });
          }
        }

        searchEngine.addEntries(projectEntries);
        setSearchIndexSize(searchEngine.version);
      } catch {
        // Ignore network failures and preserve partial index results.
      }
    };

    void hydrateProjectsIndex();
    return () => {
      cancelled = true;
    };
  }, [searchActive, searchEngine]);

  const computedSearchResults = useMemo(() => {
    void searchIndexSize;
    if (!searchActive || !searchQuery) return [];

    if (searchScope === "current" && selectedSidebar === "recents") {
      const allResults = searchEngine.search({ query: searchQuery, scope: "all" });
      const recentPaths = new Set(files.map((f) => f.path));
      return allResults.filter((r) => recentPaths.has(r.entry.path));
    }

    return searchEngine.search({
      query: searchQuery,
      scope: searchScope,
      section: getSearchSectionForSidebar(searchScope, selectedSidebar),
    });
  }, [searchQuery, searchScope, selectedSidebar, searchActive, searchIndexSize, files, searchEngine]);

  useEffect(() => {
    setSearchHighlightIndex(-1);
  }, [searchQuery, searchScope, selectedSidebar]);

  // Handle sidebar selection
  const handleSidebarSelect = useCallback((item: SidebarItem) => {
    setSelectedSidebar(item);
    setCurrentPath(getPathForSidebarItem(item));
    setSelectedFile(null);
    setSelectedCaseStudy(null);
    setSelectedWorkStint(null);
    setSelectedWorkFolderSlug(null);
    if (isMobile) {
      setShowSidebar(false);
    }
  }, [getPathForSidebarItem, isMobile, setCurrentPath]);

  // Handle file/folder click
  const handleFileClick = useCallback((file: FileItem) => {
    // Don't select files in trash (they don't exist)
    if (file.type === "file" && file.path.startsWith("trash/")) return;
    setSelectedFile(file.path);
  }, []);

  // Handle file/folder double-click
  const handleFileDoubleClick = useCallback(async (file: FileItem) => {
    if (file.type === "dir") {
      setCurrentPath(file.path);
      setSelectedFile(null);
    } else if (file.type === "app") {
      const appId = file.path.replace("/", "");
      const downloadUrl = FINDER_DOWNLOAD_APP_URLS[appId];
      if (downloadUrl) {
        window.open(downloadUrl, "_blank", "noopener,noreferrer");
        return;
      }
      if (onOpenApp) {
        // Use window manager callback (desktop shell)
        onOpenApp(appId);
      } else {
        // Fallback to soft navigation (mobile or standalone)
        router.push(file.path);
      }
    } else if (file.type === "file") {
      // Don't preview files in trash (they don't exist)
      if (file.path.startsWith("trash/")) return;

      // Clear selection immediately when opening a file
      setSelectedFile(null);

      // Add to recents when viewing a file
      addRecent({ path: file.path, name: file.name, type: file.type });

      // Check if it's a preview file (image or PDF)
      if (isPreviewFile(file.name) && onOpenPreviewFile) {
        const previewMeta = getPreviewMetadataFromPath(file.path);
        if (previewMeta) {
          onOpenPreviewFile(file.path, previewMeta.fileUrl, previewMeta.fileType);
        }
        return;
      }

      // Get file content for text files
      let content: string | null = "";
      if (file.path.startsWith(PROJECTS_DIR + "/")) {
        const relativePath = file.path.slice(PROJECTS_DIR.length + 1);
        const parts = relativePath.split("/");
        const repo = parts[0];
        const filePath = parts.slice(1).join("/");
        try {
          content = await fetchGitHubFileContentOrNull(repo, filePath);
        } catch {
          content = null;
        }
      } else {
        content = getLocalTextFileContent(file.path);
      }

      // Handle file not found (shouldn't happen after tree verification, but just in case)
      if (content === null) {
        return;
      }

      // Open all non-preview files in TextEdit
      if (onOpenTextFile) {
        onOpenTextFile(file.path, content);
      } else {
        // Fallback to preview panel
        setPreviewContent(content);
      }
    }
  }, [onOpenApp, onOpenTextFile, onOpenPreviewFile, addRecent, router, setCurrentPath]);

  const openSearchResult = useCallback((file: FileItem) => {
    setSearchActive(false);
    setSearchQuery("");
    if (file.type === "dir") {
      setCurrentPath(file.path);
      setSelectedSidebar(getSidebarForPath(file.path));
      setSelectedFile(null);
    } else {
      handleFileDoubleClick(file);
    }
  }, [handleFileDoubleClick, setCurrentPath]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (windowFocus && !windowFocus.isFocused) return;
      if (isMobile) return;
      const target = e.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (e.key === "Escape" && searchActive) {
        e.preventDefault();
        if (searchQuery) {
          setSearchQuery("");
        } else {
          setSearchActive(false);
        }
        (document.activeElement as HTMLElement)?.blur();
        return;
      }

      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !isTypingTarget) {
        e.preventDefault();
        setSearchActive(true);
        setTimeout(() => searchInputRef.current?.focus(), 0);
        return;
      }

      if (!searchActive) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSearchHighlightIndex((prev) => Math.min(prev + 1, computedSearchResults.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSearchHighlightIndex((prev) => prev <= 0 ? -1 : prev - 1);
        return;
      }

      if (e.key === "Enter" && computedSearchResults.length > 0 && searchHighlightIndex >= 0) {
        e.preventDefault();
        const result = computedSearchResults[searchHighlightIndex];
        if (result) {
          openSearchResult({
            name: result.entry.name,
            type: result.entry.type,
            path: result.entry.path,
            icon: result.entry.icon,
          });
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [windowFocus, isMobile, searchActive, searchQuery, computedSearchResults, searchHighlightIndex, openSearchResult]);

  useEffect(() => {
    if (!searchActive || computedSearchResults.length === 0 || searchHighlightIndex < 0) return;
    const container = searchResultsRef.current;
    if (!container) return;
    const row = viewMode === "list"
      ? (container.children[1]?.children[searchHighlightIndex] as HTMLElement)
      : (container.children[searchHighlightIndex] as HTMLElement);
    row?.scrollIntoView({ block: "nearest" });
  }, [searchHighlightIndex, searchActive, computedSearchResults.length, viewMode]);

  const handleBack = useCallback(() => {
    if (selectedWorkStint) {
      setSelectedWorkStint(null);
      return;
    }
    if (selectedCaseStudy) {
      setSelectedCaseStudy(null);
      return;
    }
    if (isMobile && !showSidebar) {
      const parentPath = currentPath.split("/").slice(0, -1).join("/");
      const sidebarPath = getPathForSidebarItem(selectedSidebar);
      if (currentPath !== sidebarPath && (parentPath.startsWith(HOME_DIR) || currentPath.startsWith("trash/"))) {
        setCurrentPath(parentPath || "trash");
      } else {
        setShowSidebar(true);
      }
      return;
    }

    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setCurrentPathRaw(pathHistory[prevIndex]);
      setSelectedSidebar(getSidebarForPath(pathHistory[prevIndex]));
    }
  }, [currentPath, isMobile, showSidebar, selectedSidebar, getPathForSidebarItem, historyIndex, pathHistory, setCurrentPath, selectedCaseStudy, selectedWorkStint]);

  // Get breadcrumb parts
  const isWorkDocumentsView =
    currentPath === `${HOME_DIR}/Documents` && selectedSidebar === "documents";
  const isSelectedWorkView = selectedSidebar === "selected-work";

  const handleOpenCaseStudyFolder = useCallback(
    (study: CaseStudy) => {
      setSelectedWorkFolderSlug(null);
      const emptyStudy = toEmptyCaseStudy(study);
      if (onOpenCaseStudy) {
        onOpenCaseStudy(emptyStudy);
        return;
      }
      onOpenTextFile?.(getCaseStudyDocPath(study.slug), "");
    },
    [onOpenCaseStudy, onOpenTextFile]
  );

  const handleCaseStudyBack = useCallback(() => {
    setSelectedCaseStudy(null);
  }, []);

  const getBreadcrumbs = useCallback(() => {
    if (selectedWorkStint) {
      return [USERNAME, "Experience", selectedWorkStint.company];
    }
    if (selectedCaseStudy) {
      return [USERNAME, "Experience", selectedCaseStudy.title];
    }
    if (currentPath === "recents") return ["Recents"];
    if (currentPath === "applications") return ["Applications"];
    if (currentPath === "trash") return ["Trash"];
    // Static panel breadcrumbs
    const staticLabel = SIDEBAR_ITEMS.find(i => i.id === currentPath)?.label;
    if (staticLabel) return [USERNAME, staticLabel];
    // Handle trash subdirectories
    if (currentPath.startsWith("trash/")) {
      const parts = currentPath.split("/");
      parts[0] = "Trash";
      return parts;
    }
    const parts = currentPath.replace(HOME_DIR, USERNAME).split("/").filter(Boolean);
    // Rename "Documents" segment to "Experience" for Resume app
    return parts.map(p => p === "Documents" ? "Experience" : p);
  }, [currentPath, selectedCaseStudy, selectedWorkStint]);

  // Check if can go back
  const canGoBack = useCallback(() => {
    if (selectedWorkStint || selectedCaseStudy) return true;
    return historyIndex > 0;
  }, [historyIndex, selectedCaseStudy, selectedWorkStint]);

  // Render mobile sidebar nav (traffic lights only, like Settings SidebarNav)
  const renderMobileSidebarNav = () => <FinderSidebarMobileNav />;

  // Render mobile content nav (back button + title, like Settings Nav)
  const renderMobileContentNav = (backTitle: string) => (
    <WindowNavShell
      isMobile={true}
      className="bg-background"
      left={<IosWindowNavBack canGoBack onBack={handleBack} backTitle={backTitle} />}
      center={<IosMobileNavTitle>Resume</IosMobileNavTitle>}
      right={<WindowNavSpacer isMobile={true} />}
    />
  );

  // Get the back title for mobile navigation
  const getMobileBackTitle = () => {
    // Handle trash subdirectories
    if (currentPath.startsWith("trash/")) {
      const parentPath = currentPath.split("/").slice(0, -1).join("/");
      if (parentPath === "trash") {
        return "Trash";
      }
      return currentPath.split("/").slice(-2, -1)[0] || "Back";
    }

    // If we're in a nested folder within a sidebar section, show parent folder name
    const sidebarPath = getPathForSidebarItem(selectedSidebar);
    if (currentPath !== sidebarPath && currentPath.startsWith(HOME_DIR)) {
      const parentPath = currentPath.split("/").slice(0, -1).join("/");
      if (parentPath === sidebarPath || parentPath === PROJECTS_DIR) {
        // Going back to the sidebar section
        return SIDEBAR_ITEMS.find(item => item.id === selectedSidebar)?.label || "Browse";
      }
      // Going back to parent folder
      return currentPath.split("/").slice(-2, -1)[0] || "Back";
    }
    return "Browse";
  };

  // Render sidebar
  const renderSidebar = () => {
    // Mobile sidebar - iOS Files style with cards
    if (isMobile) {
      return (
        <div className={cn("flex-1 overflow-y-auto px-4 pt-1 pb-8", IOS_MOBILE_LIST_SCREEN_CLASS)}>
          <IosMobileListGroup>
            {SIDEBAR_ITEMS.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleSidebarSelect(item.id)}
                className={cn(
                  IOS_MOBILE_LIST_ROW_CLASS,
                  "can-hover:hover:bg-muted/40",
                  index < SIDEBAR_ITEMS.length - 1 && "border-b border-border/50"
                )}
              >
                <span className="flex items-center justify-center w-7 h-7 shrink-0">
                  <SidebarIcon icon={item.icon} className="w-5 h-5 text-[#0A84FF]" />
                </span>
                <span className={cn(IOS_MOBILE_LIST_ROW_TITLE_CLASS, "flex-1 text-left")}>{item.label}</span>
                <svg className={IOS_MOBILE_LIST_CHEVRON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ))}
          </IosMobileListGroup>
        </div>
      );
    }

    // Desktop sidebar
    return (
      <div className={cn("flex flex-col border-r border-zinc-200 dark:border-zinc-700 bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-xl", DESKTOP_NAV_SIDEBAR_WIDTH_CLASS)}>
        <div className="flex-1 overflow-y-auto py-2">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => handleSidebarSelect(item.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left rounded-md",
                selectedSidebar === item.id
                  ? SIDEBAR_ITEM_ACTIVE_CLASS
                  : "text-zinc-900 dark:text-zinc-100"
              )}
            >
              <SidebarIcon
                icon={item.icon}
                className={cn(
                  "w-4 h-4",
                  selectedSidebar === item.id ? ACCENT_BLUE_CLASS : "text-zinc-900 dark:text-zinc-100"
                )}
              />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Format a date as a display string
  const formatDateString = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const isPM = hours >= 12;
    const displayHours = hours % 12 || 12;
    const timeStr = `${displayHours}:${minutes.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${timeStr}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${timeStr}`;
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${timeStr}`;
    }
  };

  // Get file date - uses real modified date if available, otherwise generates pseudo-random
  const getFileDate = (file: FileItem): string => {
    const textEditDate = getFileModifiedDate(file.path);

    // Check if this is a GitHub file
    const githubFile = githubRecentFiles.find(gf =>
      `${PROJECTS_DIR}/${gf.repo}/${gf.path}` === file.path
    );
    const githubDate = githubFile ? new Date(githubFile.modifiedAt).getTime() : null;

    // Use most recent of TextEdit date or GitHub date
    if (textEditDate && githubDate) {
      return formatDateString(new Date(Math.max(textEditDate, githubDate)));
    }
    if (textEditDate) {
      return formatDateString(new Date(textEditDate));
    }
    if (githubDate) {
      return formatDateString(new Date(githubDate));
    }

    // Check local recents for accessedAt
    const recentFile = recents.find(r => r.path === file.path);
    if (recentFile) {
      return formatDateString(new Date(recentFile.accessedAt));
    }

    // Fall back to pseudo-random date based on filename (deterministic)
    const filename = file.name;
    let hash = 0;
    for (let i = 0; i < filename.length; i++) {
      hash = ((hash << 5) - hash) + filename.charCodeAt(i);
      hash = hash & hash;
    }
    const daysAgo = Math.abs(hash) % 7;
    const hours12 = Math.abs(hash >> 3) % 12 + 1; // 1-12
    const minutes = Math.abs(hash >> 7) % 60;
    const isPM = (hash >> 11) % 2 === 0;

    // Convert 12-hour to 24-hour format
    const hours24 = isPM
      ? (hours12 === 12 ? 12 : hours12 + 12)  // 12 PM = 12, 1-11 PM = 13-23
      : (hours12 === 12 ? 0 : hours12);        // 12 AM = 0, 1-11 AM = 1-11

    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hours24, minutes, 0, 0);

    return formatDateString(date);
  };

  // Get file kind description
  const getFileKind = (file: FileItem): string => {
    if (file.type === "dir") return "Folder";
    if (file.type === "app") return "Application";
    const ext = file.name.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "txt": return "Plain Text";
      case "ts": case "tsx": return "TypeScript";
      case "js": case "jsx": return "JavaScript";
      case "json": return "JSON";
      case "css": return "CSS";
      case "html": return "HTML";
      case "svg": return "SVG Image";
      case "png": return "PNG Image";
      case "jpg": case "jpeg": return "JPEG Image";
      case "pdf": return "PDF Document";
      default: return "Document";
    }
  };

  // Skeleton loading for desktop list view
  const renderDesktopListSkeleton = () => (
    <div className="flex flex-col animate-pulse">
      {/* Column headers */}
      <div className="flex items-center px-4 py-1 border-b border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex-1 min-w-0">Name</div>
        <div className="w-32 text-left">Kind</div>
        <div className="w-52 text-left">Date Modified</div>
      </div>
      {/* Skeleton rows */}
      <div className="flex-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-full flex items-center px-4 py-1">
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-zinc-200 dark:bg-zinc-700 flex-shrink-0" />
              <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700" style={{ width: `${120 + (i * 17) % 80}px` }} />
            </div>
            <div className="w-32">
              <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <div className="w-52">
              <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Skeleton loading for desktop icons view
  const renderIconsGridSkeleton = () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2 p-4 animate-pulse">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1 p-2">
          <div className="w-12 h-12 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-3 rounded bg-zinc-200 dark:bg-zinc-700" style={{ width: `${40 + (i * 13) % 30}px` }} />
        </div>
      ))}
    </div>
  );

  // Skeleton loading for mobile list view
  const renderMobileListSkeleton = () => (
    <div className={cn("px-4 pt-2 pb-8 animate-pulse", IOS_MOBILE_LIST_SCREEN_CLASS)}>
      <div className="h-9 w-32 rounded bg-muted mb-4" />
      <div className="rounded-xl overflow-hidden border border-border/50 bg-background">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex min-h-11 items-center gap-3 px-4 py-2",
              i < 5 && "border-b border-border/50"
            )}
          >
            <div className="w-7 h-7 rounded-lg bg-muted flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="h-4 rounded bg-muted" style={{ width: `${100 + (i * 23) % 60}px` }} />
              <div className="h-3 w-16 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render file grid (desktop icons view)
  const renderFileGrid = () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2 p-4">
      {files.map(file => (
        <button
          key={file.path}
          onClick={(e) => { e.stopPropagation(); handleFileClick(file); }}
          onDoubleClick={() => handleFileDoubleClick(file)}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-lg text-center",
            selectedFile === file.path && "bg-zinc-200/70 dark:bg-zinc-700/70"
          )}
        >
          <FileIcon type={file.type} name={file.name} icon={file.icon} className="w-12 h-12" />
          <span className={cn(
            "text-xs break-all line-clamp-2 px-1 rounded",
            selectedFile === file.path
              ? FILE_LIST_ROW_SELECTED_CLASS
              : "text-zinc-700 dark:text-zinc-300"
          )}>
            {file.displayName || file.name}
          </span>
        </button>
      ))}
      {files.length === 0 && !loading && (
        <div className="col-span-full text-center text-sm text-zinc-400 dark:text-zinc-500 py-8">
          This folder is empty
        </div>
      )}
    </div>
  );

  // Render desktop list view
  const renderDesktopListView = () => (
    <div className="flex flex-col">
      {/* Column headers */}
      <div className="flex items-center px-4 py-1 border-b border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex-1 min-w-0">Name</div>
        <div className="w-32 text-left">Kind</div>
        <div className="w-52 text-left">Date Modified</div>
      </div>
      {/* File rows */}
      <div className="flex-1">
        {files.map(file => (
          <button
            key={file.path}
            onClick={(e) => { e.stopPropagation(); handleFileClick(file); }}
            onDoubleClick={() => handleFileDoubleClick(file)}
            className={cn(
              "w-full flex items-center px-4 py-1 text-left text-sm text-zinc-900 dark:text-zinc-100",
              selectedFile === file.path && FILE_LIST_ROW_SELECTED_CLASS
            )}
          >
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <FileIcon
                type={file.type}
                name={file.name}
                icon={file.icon}
                className={cn("w-4 h-4 flex-shrink-0", selectedFile === file.path && file.type !== "app" && "brightness-0 invert")}
              />
              <span className="truncate">{file.displayName || file.name}</span>
            </div>
            <div className={cn(
              "w-32 text-left truncate",
              selectedFile === file.path ? "text-white/80" : "text-zinc-500 dark:text-zinc-400"
            )}>
              {getFileKind(file)}
            </div>
            <div className={cn(
              "w-52 text-left truncate",
              selectedFile === file.path ? "text-white/80" : "text-zinc-500 dark:text-zinc-400"
            )}>
              {getFileDate(file)}
            </div>
          </button>
        ))}
        {files.length === 0 && !loading && (
          <div className="text-center text-sm text-zinc-400 dark:text-zinc-500 py-8">
            This folder is empty
          </div>
        )}
      </div>
    </div>
  );

  // Render file list (mobile)
  const renderFileList = () => (
    <div className={cn("px-4 pt-2 pb-8", IOS_MOBILE_LIST_SCREEN_CLASS)}>
      <IosMobileListGroup>
        {files.map((file, index) => {
          const isNavigable = file.type === "dir" || file.type === "app";
          return (
            <button
              key={file.path}
              onClick={() => {
                handleFileClick(file);
                if (isNavigable) {
                  handleFileDoubleClick(file);
                }
              }}
              className={cn(
                IOS_MOBILE_LIST_ROW_CLASS,
                isNavigable && "can-hover:hover:bg-muted/40",
                index < files.length - 1 && "border-b border-border/50"
              )}
            >
              <FileIcon type={file.type} name={file.name} icon={file.icon} className="w-7 h-7 flex-shrink-0" />
              <div className="flex-1 min-w-0 text-left">
                <div className={cn(IOS_MOBILE_LIST_ROW_TITLE_CLASS, "truncate")}>
                  {file.displayName || file.name}
                </div>
                <div className={IOS_MOBILE_LIST_ROW_SUBTITLE_CLASS}>
                  {file.type === "dir" ? "Folder" : file.type === "app" ? "Application" : "File"}
                </div>
              </div>
              {isNavigable && (
                <svg className={IOS_MOBILE_LIST_CHEVRON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
            </button>
          );
        })}
      </IosMobileListGroup>
      {files.length === 0 && !loading && (
        <div className="text-center text-sm text-zinc-400 dark:text-zinc-500 py-8">
          This folder is empty
        </div>
      )}
    </div>
  );

  const getLocationLabel = (path: string): string => {
    if (path.startsWith(PROJECTS_DIR + "/")) {
      const rel = path.slice(PROJECTS_DIR.length + 1);
      const parts = rel.split("/");
      if (parts.length <= 2) return parts[0];
      return parts.slice(0, -1).join("/");
    }
    if (path.startsWith(HOME_DIR + "/")) {
      return path.slice(HOME_DIR.length + 1).split("/").slice(0, -1).join("/") || "Home";
    }
    if (path.startsWith("trash")) return "Trash";
    if (path.startsWith("/")) return "Applications";
    return path;
  };

  const renderSearchResults = () => {
    if (computedSearchResults.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <p className="text-sm">No results</p>
        </div>
      );
    }

    if (viewMode === "icons") {
      return (
        <div ref={searchResultsRef} className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2 p-4">
          {computedSearchResults.map((result, i) => {
            const file = result.entry;
            const isSelected = i === searchHighlightIndex;
            return (
              <button
                key={file.path}
                onClick={(e) => { e.stopPropagation(); setSearchHighlightIndex(i); }}
                onDoubleClick={() => openSearchResult({
                  name: file.name, type: file.type, path: file.path, icon: file.icon,
                })}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg text-center",
                  isSelected && "bg-zinc-200/70 dark:bg-zinc-700/70"
                )}
              >
                <FileIcon type={file.type} name={file.name} icon={file.icon} className="w-12 h-12" />
                <span className={cn(
                  "text-xs break-all line-clamp-2 px-1 rounded",
                  isSelected
                    ? FILE_LIST_ROW_SELECTED_CLASS
                    : "text-zinc-700 dark:text-zinc-300"
                )}>
                  {file.name}
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    return (
      <div ref={searchResultsRef} className="flex flex-col">
        <div className="sticky top-0 z-[1] flex items-center px-4 py-1 border-b border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900">
          <div className="flex-1 min-w-0">Name</div>
          <div className="w-32 text-left">Kind</div>
          <div className="w-52 text-left">Location</div>
        </div>
        <div className="flex-1">
          {computedSearchResults.map((result, i) => {
            const isSelected = i === searchHighlightIndex;
            const file = result.entry;
            return (
              <button
                key={file.path}
                onClick={(e) => { e.stopPropagation(); setSearchHighlightIndex(i); }}
                onDoubleClick={() => openSearchResult({
                  name: file.name, type: file.type, path: file.path, icon: file.icon,
                })}
                className={cn(
                  "w-full flex items-center px-4 py-1 text-left text-sm text-zinc-900 dark:text-zinc-100",
                  isSelected && FILE_LIST_ROW_SELECTED_CLASS
                )}
              >
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <FileIcon
                    type={file.type}
                    name={file.name}
                    icon={file.icon}
                    className={cn("w-4 h-4 flex-shrink-0", isSelected && file.type !== "app" && "brightness-0 invert")}
                  />
                  <span className="truncate">{file.name}</span>
                </div>
                <div className={cn(
                  "w-32 text-left truncate",
                  isSelected ? "text-white/80" : "text-zinc-500 dark:text-zinc-400"
                )}>
                  {getFileKind({ name: file.name, type: file.type, path: file.path })}
                </div>
                <div className={cn(
                  "w-52 text-left truncate",
                  isSelected ? "text-white/80" : "text-zinc-500 dark:text-zinc-400"
                )}>
                  {getLocationLabel(file.path)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const currentSectionLabel = SIDEBAR_ITEMS.find(item => item.id === selectedSidebar)?.label || "";

  const renderStaticPanel = () => {
    if (currentPath === "certifications") {
      return <LearningCardsPanel isMobileView={isMobile} />;
    }

    if (currentPath === "faqs") {
      return <FaqResumePanel isMobileView={isMobile} />;
    }

    if (currentPath === "contact") {
      return <ContactResumePanel isMobileView={isMobile} />;
    }

    const renderInlineHeading = (heading: string) =>
      heading.trim() ? (
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 px-1">
          {heading}
        </div>
      ) : null;

    // Items laid out horizontally as columns within a single filled card
    // that hugs its content rather than stretching the full row width.
    const renderRowItems = (items: string[]) => (
      <div className={cn(RESUME_PANEL_CARD_OVERFLOW_CLASS, "inline-flex flex-wrap w-fit max-w-full")}>
        {items.map((item, idx) => (
          <div
            key={item}
            className={cn(
              "px-4 py-2 text-sm text-zinc-800 dark:text-zinc-100",
              idx < items.length - 1 && RESUME_PANEL_COL_DIVIDER
            )}
          >
            {item}
          </div>
        ))}
      </div>
    );

    if (currentPath === "skills") {
      const sections = STATIC_PANEL_CONTENT.skills ?? [];
      return (
        <div className={resumePanelScrollClass(isMobile)}>
          <div className="max-w-4xl space-y-6">
            {sections.map((section) => (
              <div key={section.heading || section.items[0]}>
                {renderInlineHeading(section.heading)}
                {renderRowItems(section.items)}
              </div>
            ))}
            <LanguagesResumePanel embedded />
          </div>
        </div>
      );
    }

    const sections = STATIC_PANEL_CONTENT[currentPath] ?? [];

    // Education: education / major / minor stay frameless plain text (major and
    // minor sit side by side); the remaining sections get framed like the other
    // sidebar sections.
    if (currentPath === "education") {
      const renderPlainSection = (section: (typeof sections)[number]) => (
        <div key={section.heading || section.items[0]}>
          {renderInlineHeading(section.heading)}
          <div className="space-y-1 px-1">
            {section.items.map((item) => (
              <div key={item} className="text-sm text-zinc-800 dark:text-zinc-100">
                {item}
              </div>
            ))}
          </div>
        </div>
      );

      const [eduSection, majorSection, minorSection, ...restSections] = sections;

      return (
        <div className={resumePanelScrollClass(isMobile)}>
          <div className="max-w-2xl space-y-6">
            {eduSection ? renderPlainSection(eduSection) : null}

            {(majorSection || minorSection) && (
              <div className="flex flex-wrap gap-x-12 gap-y-6">
                {majorSection ? renderPlainSection(majorSection) : null}
                {minorSection ? renderPlainSection(minorSection) : null}
              </div>
            )}

            {restSections.map((section) => (
              <div key={section.heading || section.items[0]}>
                {renderInlineHeading(section.heading)}
                {renderRowItems(section.items)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Tools & stack: horizontal column items.
    return (
      <div className={resumePanelScrollClass(isMobile)}>
        <div className="max-w-4xl space-y-6">
          {sections.map((section) => (
            <div key={section.heading || section.items[0]}>
              {renderInlineHeading(section.heading)}
              {renderRowItems(section.items)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderScopeBar = () => (
    <div className="flex items-center gap-1.5 px-4 py-1 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 select-none">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">Search:</span>
      <button
        onClick={() => setSearchScope("all")}
        className={cn(
          "px-2 py-0.5 rounded text-xs transition-colors",
          searchScope === "all"
            ? "bg-zinc-300 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100 font-medium"
            : "text-zinc-500 dark:text-zinc-400"
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        This Mac
      </button>
      <button
        onClick={() => setSearchScope("current")}
        className={cn(
          "px-2 py-0.5 rounded text-xs transition-colors",
          searchScope === "current"
            ? "bg-zinc-300 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100 font-medium"
            : "text-zinc-500 dark:text-zinc-400"
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {currentSectionLabel}
      </button>
    </div>
  );

  // Render nav bar
  const renderNav = () => (
    <FinderNav
      isDesktopShell={inDesktopShell}
      breadcrumbs={getBreadcrumbs()}
      canGoBack={canGoBack()}
      canGoForward={canGoForward}
      onBack={handleBack}
      onForward={handleForward}
      searchActive={searchActive}
      searchQuery={searchQuery}
      showViewDropdown={showViewDropdown}
      viewMode={viewMode}
      searchInputRef={searchInputRef}
      onToggleViewDropdown={() => setShowViewDropdown((prev) => !prev)}
      onCloseViewDropdown={() => setShowViewDropdown(false)}
      onSetViewMode={(mode) => {
        setViewMode(mode);
        setShowViewDropdown(false);
      }}
      onSearchQueryChange={setSearchQuery}
      onSearchActivate={() => {
        setSearchActive(true);
        window.setTimeout(() => searchInputRef.current?.focus(), 0);
      }}
      onSearchBlur={() => {
        if (!searchQuery) setSearchActive(false);
      }}
      onSearchClear={() => setSearchQuery("")}
    />
  );

  // Mobile view
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className="flex flex-col h-dvh w-full bg-background"
        data-app="resume"
      >
        {showSidebar ? (
          <>
            {renderMobileSidebarNav()}
            {renderSidebar()}
          </>
        ) : (
          <>
            {renderMobileContentNav(getMobileBackTitle())}
            <div className="flex-1 overflow-y-auto">
              {STATIC_PANEL_ITEMS.has(selectedSidebar) ? (
                renderStaticPanel()
              ) : isSelectedWorkView ? (
                <SelectedWorkFolders
                  isMobileView
                  selectedSlug={selectedWorkFolderSlug}
                  onSelect={(study) =>
                    setSelectedWorkFolderSlug((current) =>
                      current === study.slug ? null : study.slug
                    )
                  }
                  onOpenStudy={handleOpenCaseStudyFolder}
                />
              ) : isWorkDocumentsView && WORK_STINT_DETAILS_ENABLED && selectedWorkStint ? (
                <WorkStintDetail stint={selectedWorkStint} />
              ) : isWorkDocumentsView && selectedCaseStudy ? (
                <CaseStudyDetail study={selectedCaseStudy} />
              ) : isWorkDocumentsView ? (
                <WorkTimeline
                  isMobileView={true}
                  onSelect={WORK_STINT_DETAILS_ENABLED ? setSelectedWorkStint : undefined}
                />
              ) : loading ? (
                renderMobileListSkeleton()
              ) : (
                renderFileList()
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-white dark:bg-zinc-900"
      data-app="resume"
    >
      {renderNav()}
      <div className="flex flex-1 min-h-0">
        {renderSidebar()}
        <div className="flex-1 flex flex-col min-w-0">
          {searchActive && searchQuery && !isMobile && renderScopeBar()}
          <div
            className="flex-1 overflow-y-auto"
            onClick={() => {
              setSelectedFile(null);
              setSelectedWorkFolderSlug(null);
            }}
          >
          {searchActive && searchQuery ? (
            renderSearchResults()
          ) : STATIC_PANEL_ITEMS.has(selectedSidebar) ? (
            renderStaticPanel()
          ) : isSelectedWorkView ? (
            <SelectedWorkFolders
              selectedSlug={selectedWorkFolderSlug}
              onSelect={(study) =>
                setSelectedWorkFolderSlug((current) =>
                  current === study.slug ? null : study.slug
                )
              }
              onOpenStudy={handleOpenCaseStudyFolder}
            />
          ) : loading ? (
            viewMode === "list" ? renderDesktopListSkeleton() : renderIconsGridSkeleton()
          ) : isWorkDocumentsView && WORK_STINT_DETAILS_ENABLED && selectedWorkStint ? (
            <WorkStintDetail stint={selectedWorkStint} />
          ) : isWorkDocumentsView && selectedCaseStudy ? (
            <CaseStudyDetail study={selectedCaseStudy} />
          ) : isWorkDocumentsView ? (
            <WorkTimeline
              isMobileView={false}
              onSelect={WORK_STINT_DETAILS_ENABLED ? setSelectedWorkStint : undefined}
            />
          ) : previewContent !== null ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                  {selectedFile?.split("/").pop()}
                </h3>
                <button
                  onClick={() => { setPreviewContent(null); setSelectedFile(null); }}
                  className="text-sm text-accent-blue hover:text-accent-blue"
                >
                  Close Preview
                </button>
              </div>
              <pre className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-mono bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg overflow-auto max-h-[60vh]">
                {previewContent}
              </pre>
            </div>
          ) : viewMode === "list" ? (
            renderDesktopListView()
          ) : (
            renderFileGrid()
          )}
          </div>
        </div>
      </div>
    </div>
  );
}