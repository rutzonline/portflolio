"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { DESKTOP_NAV_SIDEBAR_WIDTH_CLASS } from "@/lib/ui-tokens";
import { useWindowExpanded } from "@/lib/use-window-expanded";
import { useMusic } from "@/lib/music/use-music";
import { loadMusicState, saveMusicState } from "@/lib/sidebar-persistence";
import { MusicView } from "./types";
import { Sidebar } from "./sidebar";
import { DeskTopNav } from "./nav";
import { useMobileAppStackContext } from "@/components/mobile/ios/mobile-app-stack-context";
import { IosWindowNavBack } from "@/components/mobile/ios/ios-window-nav-back";
import { IosMobileNavTitle } from "@/components/mobile/ios/ios-mobile-nav-title";
import { WindowNavShell, WindowNavSpacer } from "@/components/window-nav-shell";
import { MobileAppShellSkeleton } from "@/components/mobile/ios/mobile-app-skeleton";
import {
  HomeView,
  BrowseView,
  ArtistsView,
  AlbumsView,
  SongsView,
  BeyondDeskView,
  NewslettersView,
} from "./content-views";


interface AppProps {
  isDesktop?: boolean;
}

const getInitialState = () => {
  const saved = loadMusicState();
  return {
    view: saved.view,
    playlistId: saved.playlistId,
    showContent: saved.view !== "home",
  };
};

export default function App({ isDesktop = false }: AppProps) {
  const { playlists, albums, artists, songs } = useMusic();
  const isWindowExpanded = useWindowExpanded();

  const [initialState] = useState(getInitialState);
  const [activeView, setActiveView] = useState<MusicView>(initialState.view);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(initialState.playlistId);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLayoutInitialized, setIsLayoutInitialized] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showContent, setShowContent] = useState(initialState.showContent);

  const mobileStack = useMobileAppStackContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileEntryInitializedRef = useRef(false);

  useEffect(() => {
    setIsMobileView(!isDesktop);
    setIsLayoutInitialized(true);
  }, [isDesktop]);

  // Mobile-only: always enter the app in Home content first.
  // Back from Home should return to the sections list (sidebar), not exit the app.
  useEffect(() => {
    if (!isMobileView) return;
    if (!isLayoutInitialized) return;
    if (mobileEntryInitializedRef.current) return;
    mobileEntryInitializedRef.current = true;

    setActiveView("home");
    setSelectedPlaylistId(null);
    setShowContent(true);
  }, [isLayoutInitialized, isMobileView]);

  useEffect(() => {
    saveMusicState(activeView, selectedPlaylistId);
  }, [activeView, selectedPlaylistId]);

  const handleViewSelect = useCallback((view: MusicView, playlistId?: string) => {
    setActiveView(view);
    if (view === "playlist" && playlistId) {
      setSelectedPlaylistId(playlistId);
    } else {
      setSelectedPlaylistId(null);
    }
    setShowContent(true);
  }, []);

  const handleBack = useCallback(() => {
    setShowContent(false);
  }, []);

  const handleBackToMiscHome = useCallback(() => {
    setShowContent(true);
    setActiveView("home");
  }, []);

  // Section titles shown in the content header (desktop) and mobile header.
  const sectionTitle = (() => {
    switch (activeView) {
      case "home":
        return "Home";
      case "browse":
        return "prime internet real estate";
      case "artists":
        return "brands getting it right";
      case "albums":
        return "campaigns & content";
      case "beyond-desk":
        return "interests and all";
      case "songs":
        return "Products & Packaging";
      case "newsletters":
        return "Newsletters & Blogs";
      default:
        return "";
    }
  })();

  if (!isLayoutInitialized) {
    return !isDesktop ? <MobileAppShellSkeleton variant="content" /> : <div className="h-full bg-background" />;
  }

  const showSidebar = !isMobileView || !showContent;
  const showMainContent = !isMobileView || showContent;

  const renderContent = () => {
    switch (activeView) {
      case "home":
        return (
          <HomeView
            playlists={playlists}
            songs={songs}
            onPlaylistSelect={(id) => handleViewSelect("playlist", id)}
            isMobileView={isMobileView}
            isWindowExpanded={isWindowExpanded}
            onOpenLibrary={isMobileView ? handleBack : undefined}
          />
        );
      case "browse":
        return <BrowseView isMobileView={isMobileView} isWindowExpanded={isWindowExpanded} />;
      case "artists":
        return <ArtistsView artists={artists} isMobileView={isMobileView} />;
      case "albums":
        return <AlbumsView albums={albums} isMobileView={isMobileView} isWindowExpanded={isWindowExpanded} />;
      case "songs":
        return <SongsView songs={songs} isMobileView={isMobileView} isWindowExpanded={isWindowExpanded} />;
      case "beyond-desk":
        return <BeyondDeskView isMobileView={isMobileView} isWindowExpanded={isWindowExpanded} />;
      case "newsletters":
        return <NewslettersView isMobileView={isMobileView} isWindowExpanded={isWindowExpanded} />;
      default:
        return (
          <HomeView
            playlists={playlists}
            songs={songs}
            onPlaylistSelect={(id) => handleViewSelect("playlist", id)}
            isMobileView={isMobileView}
            isWindowExpanded={isWindowExpanded}
            onOpenLibrary={isMobileView ? handleBack : undefined}
          />
        );
    }
  };

  return (
    <div
      ref={containerRef}
      data-app="desk"
      tabIndex={-1}
      onMouseDown={() => containerRef.current?.focus()}
      className="music-app flex-1 h-full w-full flex bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none overflow-hidden"
    >
      {/* Sidebar */}
      <div
        className={cn(
          "h-full flex-shrink-0 overflow-hidden",
          showSidebar
            ? isMobileView
              ? "block w-full"
              : cn("block border-r dark:border-foreground/20", DESKTOP_NAV_SIDEBAR_WIDTH_CLASS)
            : "hidden"
        )}
      >
        {isMobileView && !showContent && (
          <WindowNavShell
            isMobile={true}
            isScrolled={isScrolled}
            className="shrink-0 bg-background"
            left={
              <IosWindowNavBack
                canGoBack
                onBack={handleBackToMiscHome}
                backTitle="moodboard"
              />
            }
            center={<IosMobileNavTitle>moodboard</IosMobileNavTitle>}
            right={<WindowNavSpacer isMobile={true} />}
          />
        )}
        <Sidebar
          playlists={playlists}
          activeView={activeView}
          selectedPlaylistId={selectedPlaylistId}
          onViewSelect={handleViewSelect}
          isMobileView={isMobileView}
          onScroll={setIsScrolled}
        >
          {null}
        </Sidebar>
      </div>

      {/* Content column */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden w-full",
          showMainContent ? "flex" : "hidden"
        )}
      >
        {!isMobileView && <DeskTopNav title={sectionTitle} isDesktop={isDesktop} />}
        {isMobileView && (
          <WindowNavShell
            isMobile={true}
            className="shrink-0 bg-background"
            left={
              activeView === "home" ? (
                <IosWindowNavBack
                  canGoBack
                  onBack={() => mobileStack?.popToHome()}
                  backTitle="home"
                />
              ) : (
                <IosWindowNavBack
                  canGoBack
                  onBack={handleBack}
                  backTitle="home"
                />
              )
            }
            center={<IosMobileNavTitle>moodboard</IosMobileNavTitle>}
            right={<WindowNavSpacer isMobile={true} />}
          />
        )}

        <div className="desk-scroll flex-1 min-h-0 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );

  /*
  return (
    <div className="h-full w-full overflow-hidden rounded-b-lg bg-background">
      <iframe
        title="Notion — Portfolio"
        src="https://rutujarochkari.notion.site/portfolio"
        className="w-full h-full border-0"
      />
    </div>
  );
  */
}
