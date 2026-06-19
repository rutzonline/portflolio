"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useMusic } from "@/lib/music/use-music";
import { useWindowFocus } from "@/lib/window-focus-context";
import { loadMusicState, saveMusicState } from "@/lib/sidebar-persistence";
import { MusicView } from "./types";
import { Sidebar } from "./sidebar";
import { Nav } from "./nav";
import { ChevronLeft } from "lucide-react";
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

  const [initialState] = useState(getInitialState);
  const [activeView, setActiveView] = useState<MusicView>(initialState.view);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(initialState.playlistId);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLayoutInitialized, setIsLayoutInitialized] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showContent, setShowContent] = useState(initialState.showContent);

  const containerRef = useRef<HTMLDivElement>(null);
  const windowFocus = useWindowFocus();
  const inShell = !!(isDesktop && windowFocus);

  useEffect(() => {
    setIsMobileView(!isDesktop);
    setIsLayoutInitialized(true);
  }, [isDesktop]);

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

  // Mobile header labels
  const mobileHeader = (() => {
    switch (activeView) {
      case "browse":
        return { title: "Cool Websites", subtitle: null };
      case "artists":
        return { title: "brands getting it right", subtitle: null };
      case "albums":
        return { title: "campaigns & content", subtitle: null };
      case "beyond-desk":
        return { title: "Things Keeping Me Sane", subtitle: null };
      case "songs":
        return { title: "Products & Packaging", subtitle: null };
      case "newsletters":
        return { title: "Newsletters & Blogs", subtitle: null };
      default:
        return { title: "", subtitle: null };
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
          />
        );
      case "browse":
        return <BrowseView isMobileView={isMobileView} />;
      case "artists":
        return <ArtistsView artists={artists} isMobileView={isMobileView} />;
      case "albums":
        return <AlbumsView albums={albums} isMobileView={isMobileView} />;
      case "songs":
        return <SongsView songs={songs} isMobileView={isMobileView} />;
      case "beyond-desk":
        return <BeyondDeskView isMobileView={isMobileView} />;
      case "newsletters":
        return <NewslettersView isMobileView={isMobileView} />;
      default:
        return (
          <HomeView
            playlists={playlists}
            songs={songs}
            onPlaylistSelect={(id) => handleViewSelect("playlist", id)}
            isMobileView={isMobileView}
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
      <main className="flex-1 flex min-h-0 overflow-hidden">
        {/* Sidebar */}
        <div
          className={cn(
            "h-full flex-shrink-0 overflow-hidden",
            showSidebar
              ? isMobileView
                ? "block w-full"
                : "block w-[220px] border-r dark:border-foreground/20"
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
            <Nav
              isMobileView={isMobileView}
              isScrolled={isScrolled}
              isDesktop={isDesktop}
            />
          </Sidebar>
        </div>

        {/* Main Content */}
        <div
          className={cn(
            "flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden relative",
            showMainContent ? "block" : "hidden"
          )}
        >
          {/* Mobile content header */}
          {isMobileView && (
            <div className="px-4 py-3 flex items-center gap-3 sticky top-0 z-[1] select-none bg-background">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {activeView !== "home" && activeView !== "browse" && (
                <div>
                  <h1 className="text-lg font-semibold">{mobileHeader.title}</h1>
                  {mobileHeader.subtitle && (
                    <p className="text-xs text-muted-foreground">{mobileHeader.subtitle}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Draggable header area for desktop window */}
          {!isMobileView && (
            <div
              className="absolute top-0 left-0 right-0 h-12 z-10 select-none"
              onMouseDown={inShell && windowFocus ? windowFocus.onDragStart : undefined}
            />
          )}

          {renderContent()}
        </div>
      </main>
    </div>
  );
}
