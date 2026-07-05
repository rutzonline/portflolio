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

/** Finder-style top toolbar: centered breadcrumb only (traffic lights in sidebar). */
export function DeskTopNav({ title, isDesktop }: { title: string; isDesktop: boolean }) {
  const nav = useWindowNavBehavior({ isDesktop, isMobile: false, allowStandaloneClose: false });
  const breadcrumb = title;

  return (
    <div className="mx-3 mt-3">
      <WindowNavShell
        isMobile={false}
        className="min-w-0 gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-sm"
        onMouseDown={nav.onDragStart}
        left={
        <div className="flex shrink-0 items-center gap-1">
          <span className="p-1 rounded text-zinc-300 dark:text-zinc-600">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </span>
          <span className="p-1 rounded text-zinc-300 dark:text-zinc-600">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6 6-6" />
            </svg>
          </span>
        </div>
      }
      center={
        <div
          className="w-full truncate text-center text-sm text-zinc-600 dark:text-zinc-400 font-medium"
          title={breadcrumb}
        >
          {breadcrumb}
        </div>
      }
      right={<WindowNavSpacer isMobile={false} />}
    />
    </div>
  );
}
