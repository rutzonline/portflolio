"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { AppConfig } from "@/types/apps";

interface IosAppIconProps {
  app: AppConfig;
  onOpen: (appId: string) => void;
  size?: "grid" | "dock";
  className?: string;
}

export function IosAppIcon({ app, onOpen, size = "grid", className }: IosAppIconProps) {
  const iconSize = size === "dock" ? 62 : 60;

  return (
    <button
      type="button"
      onClick={() => onOpen(app.id)}
      className={cn(
        "flex flex-col items-center gap-1.5 active:scale-95 transition-transform",
        className
      )}
    >
      <Image
        src={app.icon}
        alt=""
        width={iconSize}
        height={iconSize}
        className={cn(
          "rounded-[22%] shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
          size === "dock" && "shadow-[0_10px_28px_rgba(0,0,0,0.45)]"
        )}
        unoptimized
      />
      {size === "grid" ? (
        <span className="max-w-[76px] truncate text-center text-[11px] font-medium leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]">
          {app.name}
        </span>
      ) : null}
    </button>
  );
}
