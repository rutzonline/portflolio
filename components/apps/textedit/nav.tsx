"use client";

import { WindowNavShell } from "@/components/window-nav-shell";
import { useWindowNavBehavior } from "@/lib/use-window-nav-behavior";

interface NavProps {
  isMobile: boolean;
  isDesktop?: boolean;
  fileName?: string | null;
}

export function Nav({ isMobile, isDesktop = false, fileName }: NavProps) {
  const nav = useWindowNavBehavior({ isDesktop, isMobile });

  return (
    <WindowNavShell
      isMobile={isMobile}
      onMouseDown={nav.onDragStart}
      className="min-w-0"
      left={nav.navLeft}
      center={
        <span className="block truncate text-muted-foreground text-sm">
          {fileName || "Untitled"}
        </span>
      }
      centerClassName="px-2 text-center"
      right={<div className="w-[68px] shrink-0" aria-hidden />}
    />
  );
}
