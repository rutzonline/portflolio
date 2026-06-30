"use client";

import { WindowNavShell, WindowNavSpacer } from "@/components/window-nav-shell";
import { useWindowNavBehavior } from "@/lib/use-window-nav-behavior";
import { IosMobileNavTitle } from "@/components/mobile/ios/ios-mobile-nav-title";

interface NavProps {
  isMobileView: boolean;
  isScrolled?: boolean;
  isDesktop?: boolean;
  title?: string;
}

export function Nav({ isMobileView, isScrolled, isDesktop = false, title = "Photos" }: NavProps) {
  const nav = useWindowNavBehavior({ isDesktop, isMobile: isMobileView });

  return (
    <WindowNavShell
      isMobile={isMobileView}
      isScrolled={isScrolled}
      onMouseDown={nav.onDragStart}
      left={nav.navLeft}
      center={isMobileView ? <IosMobileNavTitle>{title}</IosMobileNavTitle> : undefined}
      right={<WindowNavSpacer isMobile={isMobileView} />}
    />
  );
}
