"use client";

import { useWindowFocus } from "@/lib/window-focus-context";

/** True when the hosting desktop window is maximized (full-screen shell mode). */
export function useWindowExpanded(): boolean {
  return useWindowFocus()?.isMaximized ?? false;
}
