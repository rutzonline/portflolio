"use client";

import { WindowNavShell, WindowNavSpacer } from "@/components/window-nav-shell";
import { useWindowNavBehavior } from "@/lib/use-window-nav-behavior";
import { IosMobileNavTitle } from "@/lib/dynamic-ios-nav";

interface SimpleAppNavProps {
  isMobileView: boolean;
  isScrolled?: boolean;
  isDesktop?: boolean;
  title?: string;
}

export function SimpleAppNav({
  isMobileView,
  isScrolled,
  isDesktop = false,
  title = "App",
}: SimpleAppNavProps) {
  const nav = useWindowNavBehavior({ isDesktop, isMobile: isMobileView });

  return (
    <WindowNavShell
      isMobile={isMobileView}
      isScrolled={isScrolled}
      onMouseDown={nav.onDragStart}
      left={nav.navLeft}
      center={
        isMobileView ? (
          <IosMobileNavTitle>{title}</IosMobileNavTitle>
        ) : undefined
      }
      right={<WindowNavSpacer isMobile={isMobileView} />}
    />
  );
}
