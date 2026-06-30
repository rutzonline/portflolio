"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { DESKTOP_NAV_SIDEBAR_WIDTH_CLASS } from "@/lib/ui-tokens";
import { useWindowExpanded } from "@/lib/use-window-expanded";
import { useMusic } from "@/lib/music/use-music";
import { loadMusicState, saveMusicState } from "@/lib/sidebar-persistence";
import { MusicView } from "./types";
import { Sidebar } from "./sidebar";
import { Nav, DeskTopNav } from "./nav";
import { useMobileAppStackContext } from "@/components/mobile/ios/mobile-app-stack-context";
import { IosWindowNavBack } from "@/components/mobile/ios/ios-window-nav-back";
import { IosMobileNavTitle } from "@/components/mobile/ios/ios-mobile-nav-title";
import { WindowNavShell, WindowNavSpacer } from "@/components/window-nav-shell";
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

  // Section titles shown in the content header (desktop) and mobile header.
  const sectionTitle = (() => {
    switch (activeView) {
      case "home":
        return "Home";
      case "browse":
        return "Cool Websites";
      case "artists":
        return "brands getting it right";
      case "albums":
        return "campaigns & content";
      case "beyond-desk":
        return "Things keeping me sane";
      case "songs":
        return "Products & Packaging";
      case "newsletters":
        return "Newsletters & Blogs";
      default:
        return "";
    }
  })();

  if (!isLayoutInitialized) {
    return <div className="h-full bg-background" />;
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
      className="music-app h-full flex flex-col bg-background text-foreground outline-none overflow-hidden"
    >
      {!isMobileView && <DeskTopNav title={sectionTitle} isDesktop={isDesktop} />}

      <main className="flex-1 flex min-h-0 overflow-hidden">
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
          <Sidebar
            playlists={playlists}
            activeView={activeView}
            selectedPlaylistId={selectedPlaylistId}
            onViewSelect={handleViewSelect}
            isMobileView={isMobileView}
            onScroll={setIsScrolled}
          >
            {isMobileView ? (
              <Nav
                isMobileView={isMobileView}
                isScrolled={isScrolled}
                isDesktop={isDesktop}
              />
            ) : null}
          </Sidebar>
        </div>

        <div
          className={cn(
            "flex-1 flex-col min-h-0 min-w-0 overflow-hidden",
            showMainContent ? "flex" : "hidden"
          )}
        >
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
              center={<IosMobileNavTitle>misc</IosMobileNavTitle>}
              right={<WindowNavSpacer isMobile={true} />}
            />
          )}

          <div className="desk-scroll flex-1 min-h-0 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </main>
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
