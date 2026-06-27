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
        "flex w-full flex-col items-center gap-1 active:scale-95 transition-transform",
        className
      )}
    >
      <Image
        src={app.icon}
        alt=""
        width={iconSize}
        height={iconSize}
        className="rounded-[22%]"
        unoptimized
      />
      {size === "grid" ? (
        <span className="w-full max-w-[72px] text-center text-[10px] font-normal leading-[13px] tracking-tight text-white/95">
          {app.name}
        </span>
      ) : null}
    </button>
  );
}
