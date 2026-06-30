"use client";

import Image from "next/image";
import { CalendarDockIcon } from "@/components/apps/calendar/calendar-dock-icon";
import { cn } from "@/lib/utils";
import { IOS_MOBILE_TOUCH_ACTIVE_CLASS } from "@/lib/ui-tokens";
import {
  getIosAppIconArtScale,
  getIosAppIconSrc,
  IOS_CALENDAR_TILE_RATIO,
  IOS_DOCK_ICON_SIZE,
  IOS_GRID_ICON_SIZE,
} from "@/lib/ios-app-icons";
import type { AppConfig } from "@/types/apps";

const IOS_ICON_SQUIRCLE_CLASS = "rounded-[22%]";

/** Mobile dock badge — slightly larger than desktop base, tucked onto the icon corner. */
const IOS_DOCK_BADGE_METRICS = {
  height: 24,
  minWidth: 24,
  paddingX: 5,
  fontSize: 12,
} as const;

interface IosAppIconProps {
  app: AppConfig;
  onOpen: (appId: string) => void;
  size?: "grid" | "dock";
  className?: string;
  badgeCount?: number;
}

function formatBadgeCount(count: number): string {
  if (count > 99) return "99+";
  return String(count);
}

export function IosAppIcon({ app, onOpen, size = "grid", className, badgeCount = 0 }: IosAppIconProps) {
  const iconSize = size === "dock" ? IOS_DOCK_ICON_SIZE : IOS_GRID_ICON_SIZE;
  const isCalendar = app.id === "calendar";
  const iconSrc = getIosAppIconSrc(app.id, app.icon);
  const artScale = getIosAppIconArtScale(app.id);

  return (
    <button
      type="button"
      onClick={() => onOpen(app.id)}
      aria-label={app.name}
      onContextMenu={(event) => event.preventDefault()}
      className={cn(
        "flex w-full min-h-11 flex-col items-center justify-center gap-1.5 select-none touch-manipulation px-1",
        "[-webkit-touch-callout:none]",
        IOS_MOBILE_TOUCH_ACTIVE_CLASS,
        size === "dock" && "overflow-visible",
        className
      )}
    >
      <span
        className={cn("relative shrink-0", size === "dock" && "z-10 overflow-visible")}
        style={{ width: iconSize, height: iconSize }}
      >
        <span
          className={cn(
            "flex h-full w-full items-center justify-center overflow-hidden",
            IOS_ICON_SQUIRCLE_CLASS,
            size === "grid" ? "p-1.5" : "p-1"
          )}
        >
          {isCalendar ? (
            <CalendarDockIcon size={iconSize * (size === "grid" ? 0.82 : 0.88)} tileRatio={IOS_CALENDAR_TILE_RATIO} />
          ) : (
            <Image
              src={iconSrc}
              alt=""
              width={iconSize}
              height={iconSize}
              priority
              draggable={false}
              className="pointer-events-none max-w-none object-contain"
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${artScale})`,
              }}
              unoptimized
            />
          )}
        </span>
        {badgeCount > 0 && size === "dock" ? (
          <span
            className="pointer-events-none absolute -right-0.5 top-0.5 z-20 flex items-center justify-center rounded-full bg-red-500 font-semibold leading-none text-white shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
            style={{
              minWidth: `${IOS_DOCK_BADGE_METRICS.minWidth}px`,
              height: `${IOS_DOCK_BADGE_METRICS.height}px`,
              paddingLeft: `${IOS_DOCK_BADGE_METRICS.paddingX}px`,
              paddingRight: `${IOS_DOCK_BADGE_METRICS.paddingX}px`,
              fontSize: `${IOS_DOCK_BADGE_METRICS.fontSize}px`,
            }}
            aria-hidden
          >
            {formatBadgeCount(badgeCount)}
          </span>
        ) : null}
      </span>
      {size === "grid" ? (
        <span className="w-full max-w-[80px] text-center text-[13px] font-normal leading-[15px] tracking-tight text-white/95">
          {app.name}
        </span>
      ) : null}
    </button>
  );
}
