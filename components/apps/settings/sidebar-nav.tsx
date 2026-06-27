"use client";

import { WindowNavShell, WindowNavSpacer } from "@/components/window-nav-shell";
import { useWindowNavBehavior } from "@/lib/use-window-nav-behavior";

interface SidebarNavProps {
  isMobile: boolean;
  isScrolled?: boolean;
  isDesktop?: boolean;
}

export function SidebarNav({ isMobile, isScrolled, isDesktop = false }: SidebarNavProps) {
  const nav = useWindowNavBehavior({ isDesktop, isMobile });

  return (
    <WindowNavShell
      isMobile={isMobile}
      isScrolled={isScrolled}
      onMouseDown={nav.onDragStart}
      left={nav.navLeft}
      right={<WindowNavSpacer isMobile={isMobile} />}
    />
  );
}
