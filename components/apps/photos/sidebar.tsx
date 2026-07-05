"use client";

import { SidebarItem } from "@/components/shared/sidebar-item";
import { Collection, PhotosView } from "@/types/photos";
import { Images, Heart, FolderOpen } from "lucide-react";
import { WindowControls } from "@/components/window-controls";
import { useWindowNavBehavior } from "@/lib/use-window-nav-behavior";
import { cn } from "@/lib/utils";
import { DESKTOP_NAV_SIDEBAR_WIDTH_CLASS } from "@/lib/ui-tokens";

interface SidebarProps {
  collections: Collection[];
  activeView: PhotosView;
  onViewSelect: (view: PhotosView) => void;
  isMobileView: boolean;
  onScroll?: (isScrolled: boolean) => void;
}

export function Sidebar({
  collections,
  activeView,
  onViewSelect,
  isMobileView,
  onScroll,
}: SidebarProps) {
  const nav = useWindowNavBehavior({
    isDesktop: !isMobileView,
    isMobile: isMobileView,
    allowStandaloneClose: false,
  });

  // Mobile sidebar - iOS Files style with cards
  if (isMobileView) {
    return (
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-8 bg-background">
        <div className="rounded-xl bg-white dark:bg-zinc-800 overflow-hidden">
          <button
            onClick={() => onViewSelect("library")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 text-base transition-colors can-hover:hover:bg-zinc-50 dark:can-hover:hover:bg-zinc-700",
              activeView !== "favorites" && "border-b border-zinc-200 dark:border-zinc-700"
            )}
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-blue">
              <Images className="w-5 h-5 text-white" />
            </span>
            <span className="flex-1 text-left text-zinc-900 dark:text-white">Library</span>
          </button>
          <button
            onClick={() => onViewSelect("favorites")}
            className="w-full flex items-center gap-3 px-3 py-3 text-base transition-colors can-hover:hover:bg-zinc-50 dark:can-hover:hover:bg-zinc-700"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-blue">
              <Heart className="w-5 h-5 text-white" />
            </span>
            <span className="flex-1 text-left text-zinc-900 dark:text-white">Favorites</span>
          </button>
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => onViewSelect(collection.id)}
              className="w-full flex items-center gap-3 px-3 py-3 text-base transition-colors can-hover:hover:bg-zinc-50 dark:can-hover:hover:bg-zinc-700 border-t border-zinc-200 dark:border-zinc-700"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-blue">
                <FolderOpen className="w-5 h-5 text-white" />
              </span>
              <span className="flex-1 text-left text-zinc-900 dark:text-white">{collection.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop sidebar with traffic lights in top-left (matches Finder pattern)
  return (
    <div className={cn("h-full flex flex-col border-r border-zinc-200 dark:border-zinc-700 bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-xl", DESKTOP_NAV_SIDEBAR_WIDTH_CLASS)}>
      {/* Top region with traffic lights and drag handle */}
      <div className="h-[52px] flex items-center px-5 shrink-0 bg-transparent" onMouseDown={nav.onDragStart}>
        <WindowControls
          inShell={nav.inShell}
          showWhenNotInShell={true}
          onClose={nav.onClose}
          onMinimize={nav.onMinimize}
          onToggleMaximize={nav.onToggleMaximize}
          isMaximized={nav.isMaximized}
          closeLabel={nav.closeLabel}
        />
      </div>
      {/* Sidebar list */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        <div className="mb-4">
          <p className="text-xs text-muted-foreground px-3 py-1 font-semibold uppercase tracking-wide">
            Library
          </p>
          <SidebarItem
            icon={<Images className="w-4 h-4" />}
            label="Library"
            isActive={activeView === "library"}
            onClick={() => onViewSelect("library")}
            isMobileView={false}
          />
          <SidebarItem
            icon={<Heart className="w-4 h-4" />}
            label="Favorites"
            isActive={activeView === "favorites"}
            onClick={() => onViewSelect("favorites")}
            isMobileView={false}
          />
        </div>

        {collections.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground px-3 py-1 font-semibold uppercase tracking-wide">
              Collections
            </p>
            {collections.map((collection) => (
              <SidebarItem
                key={collection.id}
                icon={<FolderOpen className="w-4 h-4" />}
                label={collection.name}
                isActive={activeView === collection.id}
                onClick={() => onViewSelect(collection.id)}
                isMobileView={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}