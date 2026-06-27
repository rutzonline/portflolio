import type { Position, Size } from "@/types/window";
import { MENU_BAR_HEIGHT } from "@/lib/use-window-behavior";

/** Canonical Now Playing placement — right of center, room for the to-do sticky note. */
export function getNowPlayingDefaultPosition(size: Size): Position {
  if (typeof window === "undefined") {
    return { x: 1190, y: 120 };
  }

  const stickyNoteReserve = 240;
  const targetX = Math.round(window.innerWidth * 0.62);
  const maxX = window.innerWidth - size.width - stickyNoteReserve;
  const y = Math.max(
    MENU_BAR_HEIGHT + 16,
    Math.round(window.innerHeight * 0.18)
  );

  return {
    x: Math.max(24, Math.min(targetX, maxX)),
    y,
  };
}
