"use client";

import { WindowNavShell, WindowNavSpacer } from "@/components/window-nav-shell";
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
