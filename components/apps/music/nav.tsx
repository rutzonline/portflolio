"use client";

import { WindowNavShell, WindowNavSpacer } from "@/components/window-nav-shell";
import { useWindowNavBehavior } from "@/lib/use-window-nav-behavior";
import { SimpleAppNav } from "@/components/shared/simple-app-nav";

interface NavProps {
  isMobileView: boolean;
  isScrolled?: boolean;
  isDesktop?: boolean;
  title?: string;
}

export function Nav({ isMobileView, isScrolled, isDesktop = false, title = "moodboard" }: NavProps) {
  const nav = useWindowNavBehavior({ isDesktop, isMobile: isMobileView });

  return (
    <SimpleAppNav
      isMobileView={isMobileView}
      isScrolled={isScrolled}
      isDesktop={isDesktop}
      title={title}
    />
  );
}

/** Finder-style top toolbar: centered section title only, no back/forward chrome. */
export function DeskTopNav({ title, isDesktop }: { title: string; isDesktop: boolean }) {
  const nav = useWindowNavBehavior({ isDesktop, isMobile: false, allowStandaloneClose: false });

  return (
    <div className="mx-3 mt-3">
      <WindowNavShell
        isMobile={false}
        className="min-w-0 gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-sm"
        onMouseDown={nav.onDragStart}
        left={<WindowNavSpacer isMobile={false} />}
        center={
          <div
            className="w-full truncate text-center text-sm text-zinc-600 dark:text-zinc-400"
            title={title}
          >
            {title}
          </div>
        }
        right={<WindowNavSpacer isMobile={false} />}
      />
    </div>
  );
}
