"use client";

import { WindowNavShell, WindowNavSpacer } from "@/components/window-nav-shell";
import { useWindowNavBehavior } from "@/lib/use-window-nav-behavior";
import { IosMobileNavTitle } from "@/components/mobile/ios/ios-mobile-nav-title";

interface SidebarNavProps {
  isMobile: boolean;
  isScrolled?: boolean;
  isDesktop?: boolean;
  title?: string;
}

export function SidebarNav({ isMobile, isScrolled, isDesktop = false, title = "Settings" }: SidebarNavProps) {
  const nav = useWindowNavBehavior({ isDesktop, isMobile });

  return (
    <WindowNavShell
      isMobile={isMobile}
      isScrolled={isScrolled}
      onMouseDown={nav.onDragStart}
      left={nav.navLeft}
      center={isMobile ? <IosMobileNavTitle>{title}</IosMobileNavTitle> : undefined}
      right={<WindowNavSpacer isMobile={isMobile} />}
    />
  );
}
