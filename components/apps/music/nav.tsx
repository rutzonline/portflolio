"use client";

import { WindowNavShell, WindowNavSpacer } from "@/components/window-nav-shell";
import { WindowControls } from "@/components/window-controls";
import { useWindowNavBehavior } from "@/lib/use-window-nav-behavior";

interface NavProps {
  isMobileView: boolean;
  isScrolled?: boolean;
  isDesktop?: boolean;
}

export function Nav({ isMobileView, isScrolled, isDesktop = false }: NavProps) {
  const nav = useWindowNavBehavior({ isDesktop, isMobile: isMobileView });

  return (
    <WindowNavShell
      isMobile={isMobileView}
      isScrolled={isScrolled}
      onMouseDown={nav.onDragStart}
      left={nav.navLeft}
      right={<WindowNavSpacer isMobile={isMobileView} />}
    />
  );
}

/** Finder-style top toolbar: traffic lights, back/forward, centered breadcrumb. */
export function DeskTopNav({ title, isDesktop }: { title: string; isDesktop: boolean }) {
  const nav = useWindowNavBehavior({ isDesktop, isMobile: false, allowStandaloneClose: false });
  const breadcrumb = title ? `rutuja rochkari / ${title}` : "rutuja rochkari";

  return (
    <WindowNavShell
      isMobile={false}
      className="min-w-0 gap-2 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700"
      onMouseDown={nav.onDragStart}
      left={
        <div className="flex items-center gap-2 shrink-0">
          <WindowControls
            inShell={nav.inShell}
            showWhenNotInShell={true}
            className="p-2"
            onClose={nav.onClose}
            onMinimize={nav.onMinimize}
            onToggleMaximize={nav.onToggleMaximize}
            isMaximized={nav.isMaximized}
            closeLabel={nav.closeLabel}
          />
          <div className="flex shrink-0 items-center gap-1">
            <span className="p-1 rounded text-zinc-300 dark:text-zinc-600">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </span>
            <span className="p-1 rounded text-zinc-300 dark:text-zinc-600">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          </div>
        </div>
      }
      center={
        <div
          className="w-full truncate text-center text-sm text-zinc-600 dark:text-zinc-400"
          title={breadcrumb}
        >
          {breadcrumb}
        </div>
      }
      centerClassName="flex items-center justify-center px-2"
      right={<WindowNavSpacer isMobile={false} />}
    />
  );
}
