"use client";

import { SidebarItem } from "@/components/shared/sidebar-item";
import { AppSidebarShell } from "@/components/shared/app-sidebar-shell";
import { Collection, PhotosView } from "@/types/photos";
import { Images, Heart, FolderOpen } from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
  collections: Collection[];
  activeView: PhotosView;
  onViewSelect: (view: PhotosView) => void;
  isMobileView: boolean;
  onScroll?: (isScrolled: boolean) => void;
}

export function Sidebar({
  children,
  collections,
  activeView,
  onViewSelect,
  isMobileView,
  onScroll,
}: SidebarProps) {
  return (
    <AppSidebarShell
      isMobileView={isMobileView}
      onScroll={onScroll}
      sidebarContent={
        <>
            {/* Library Section */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground px-3 py-1 font-semibold uppercase tracking-wide">
                Library
              </p>
              <SidebarItem
                icon={<Images className="w-4 h-4" />}
                label="Library"
                isActive={activeView === "library"}
                onClick={() => onViewSelect("library")}
                isMobileView={isMobileView}
              />
              <SidebarItem
                icon={<Heart className="w-4 h-4" />}
                label="Favorites"
                isActive={activeView === "favorites"}
                onClick={() => onViewSelect("favorites")}
                isMobileView={isMobileView}
              />
            </div>

            {/* Collections Section */}
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
                    isMobileView={isMobileView}
                  />
                ))}
              </div>
            )}
        </>
      }
    >
      {children}
    </AppSidebarShell>
  );
}


