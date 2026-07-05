"use client";

import { WindowNavShell, WindowNavSpacer } from "@/components/window-nav-shell";
import { useWindowNavBehavior } from "@/lib/use-window-nav-behavior";
import { IosMobileNavTitle } from "@/lib/dynamic-ios-nav";
import { cn } from "@/lib/utils";

interface SimpleAppNavProps {
  isMobileView: boolean;
  isScrolled?: boolean;
  isDesktop?: boolean;
  title?: string;
  showWindowControls?: boolean;
}

export function SimpleAppNav({
  isMobileView,
  isScrolled,
  isDesktop = false,
  title = "App",
  showWindowControls = true,
}: SimpleAppNavProps) {
  const nav = useWindowNavBehavior({ isDesktop, isMobile: isMobileView });

  return (
    <div className={cn(!isMobileView && "mx-3 mt-3")}>
      <WindowNavShell
        isMobile={isMobileView}
        isScrolled={isScrolled}
        onMouseDown={nav.onDragStart}
        left={showWindowControls ? nav.navLeft : undefined}
        center={
          isMobileView ? (
            <IosMobileNavTitle>{title}</IosMobileNavTitle>
          ) : undefined
        }
        right={<WindowNavSpacer isMobile={isMobileView} />}
        className={cn(
          !isMobileView && "min-w-0 gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-sm"
        )}
      />
    </div>
  );
}
