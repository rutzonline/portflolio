"use client";

import Image from "next/image";
import { CalendarDockIcon } from "@/components/apps/calendar/calendar-dock-icon";
import { cn } from "@/lib/utils";
import type { AppConfig } from "@/types/apps";

function getMobileOverrideIconSrc(appId: string): string | null {
  switch (appId) {
    case "notes":
      return "/xnotes.png";
    case "photos":
      return "/xphotos.png";
    case "messages":
      return "/xmessages.png";
    case "desk":
      return "/misc.png";
    case "resume":
      return "/xresume.png";
    case "settings":
      return "/xsettings.png";
    case "finder":
      return "/xfinder.png";
    case "weather":
      return "/xweather.png";
    default:
      return null;
  }
}

interface IosAppIconProps {
  app: AppConfig;
  onOpen: (appId: string) => void;
  size?: "grid" | "dock";
  className?: string;
}

export function IosAppIcon({ app, onOpen, size = "grid", className }: IosAppIconProps) {
  const iconSize = size === "dock" ? 62 : 60;
  const isCalendar = app.id === "calendar";
  const iconSrc = getMobileOverrideIconSrc(app.id) ?? app.icon;

  return (
    <button
      type="button"
      onClick={() => onOpen(app.id)}
      aria-label={app.name}
      className={cn(
        "flex w-full flex-col items-center gap-1 active:scale-95 transition-transform",
        className
      )}
    >
      {isCalendar ? (
        <CalendarDockIcon size={iconSize} />
      ) : (
        <Image
          src={iconSrc}
          alt=""
          width={iconSize}
          height={iconSize}
          className="rounded-[22%]"
          unoptimized
        />
      )}
      {size === "grid" ? (
        <span className="w-full max-w-[72px] text-center text-[10px] font-normal leading-[13px] tracking-tight text-white/95">
          {app.name}
        </span>
      ) : null}
    </button>
  );
}
