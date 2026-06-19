"use client";

import { DesktopIcon } from "./desktop-icon";

interface DesktopIconsProps {
  onOpenIntro: () => void;
}

/** Desktop readme — bottom-left, above the dock. */
export function DesktopIcons({ onOpenIntro }: DesktopIconsProps) {
  return (
    <div
      className="fixed z-[50] pointer-events-none"
      style={{
        left: 20,
        bottom: 28,
      }}
    >
      <div className="pointer-events-auto">
        <DesktopIcon label="readme" onOpen={onOpenIntro} />
      </div>
    </div>
  );
}
