import type { Position, Size } from "@/types/window";
import { MENU_BAR_HEIGHT, DOCK_HEIGHT } from "@/lib/use-window-behavior";

/** Right-center placement for the Now Playing window (matches desktop layout). */
export function getNowPlayingDefaultPosition(size: Size): Position {
  if (typeof window === "undefined") {
    return { x: 880, y: 100 };
  }

  const margin = 48;
  const availableHeight = window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT;

  return {
    x: Math.max(24, window.innerWidth - size.width - margin),
    y: Math.max(
      MENU_BAR_HEIGHT + 20,
      MENU_BAR_HEIGHT + Math.round((availableHeight - size.height) / 2)
    ),
  };
}
