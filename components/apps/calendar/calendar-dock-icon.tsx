"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

interface CalendarDockIconProps {
  /** Artboard size — same as other dock icons (`getDockIconVisualSize`). */
  size?: number;
  /**
   * White tile size relative to artboard. macOS dock uses ~79%; iOS springboard uses 100%
   * so calendar matches other squircle icons.
   */
  tileRatio?: number;
}

/** `size` is the full dock slot size. The tile renders at 79% of that, centered. */
const DESKTOP_DOCK_TILE_RATIO = 0.79;

export function CalendarDockIcon({ size = 48, tileRatio = DESKTOP_DOCK_TILE_RATIO }: CalendarDockIconProps) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const timeout = setTimeout(() => {
      setDate(new Date());
      intervalId = setInterval(() => {
        setDate(new Date());
      }, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => {
      clearTimeout(timeout);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const dayOfWeek = format(date, "EEE");
  const dayNumber = format(date, "d");
  const tileSize = Math.round(size * tileRatio);

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className="flex flex-col items-center justify-center overflow-hidden rounded-[22%] bg-white"
        style={{ width: tileSize, height: tileSize }}
      >
        <span
          className="text-[#FF3B30] font-medium leading-none"
          style={{ fontSize: tileSize * 0.2 }}
        >
          {dayOfWeek}
        </span>
        <span
          className="text-[#1c1c1e] font-normal leading-none"
          style={{ fontSize: tileSize * 0.5, marginTop: -tileSize * 0.02 }}
        >
          {dayNumber}
        </span>
      </div>
    </div>
  );
}
