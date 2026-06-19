"use client";

import { cn } from "@/lib/utils";
import {
  INTRO_README_POLAROID_PATH,
  INTRO_README_POLAROID_VERSION,
} from "@/lib/intro-doc-baseline";
import type { Position } from "@/lib/use-window-behavior";

const POLAROID_GAP = 16;
const POLAROID_TOP_OFFSET = 32;
/** 690×790 source — scale down for crisp display without dominating the panel. */
const POLAROID_DISPLAY_WIDTH = 150;
const POLAROID_DISPLAY_HEIGHT = Math.round(
  POLAROID_DISPLAY_WIDTH * (790 / 690)
);

interface IntroReadmePolaroidProps {
  position: Position;
  zIndex: number;
  isFocused: boolean;
  onFocus: () => void;
}

export function IntroReadmePolaroid({
  position,
  zIndex,
  isFocused,
  onFocus,
}: IntroReadmePolaroidProps) {
  const src = `${INTRO_README_POLAROID_PATH}?v=${INTRO_README_POLAROID_VERSION}`;

  return (
    <div
      className={cn(
        "fixed pointer-events-auto select-none bg-transparent",
        !isFocused && "opacity-95"
      )}
      style={{
        left: position.x - POLAROID_GAP,
        top: position.y + POLAROID_TOP_OFFSET,
        transform: "translateX(-100%)",
        zIndex,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onFocus();
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Rutuja Rochkari"
        width={POLAROID_DISPLAY_WIDTH}
        height={POLAROID_DISPLAY_HEIGHT}
        className="block h-auto w-[150px] bg-transparent drop-shadow-[0_10px_28px_rgba(0,0,0,0.35)]"
        draggable={false}
        decoding="async"
      />
    </div>
  );
}
