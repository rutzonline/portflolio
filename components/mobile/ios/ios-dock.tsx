"use client";

import { getIosDockApps } from "@/lib/ios-home-apps";
import { cn } from "@/lib/utils";
import { IosAppIcon } from "./ios-app-icon";

interface IosDockProps {
  onOpenApp: (appId: string) => void;
  className?: string;
}

export function IosDock({ onOpenApp, className }: IosDockProps) {
  const dockApps = getIosDockApps();

  return (
    <div
      className={cn(
        "mx-3 mb-[max(env(safe-area-inset-bottom),12px)] rounded-[28px]",
        "border border-white/20 bg-white/18 backdrop-blur-2xl",
        "px-3 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      <div className="grid grid-cols-4 items-end justify-items-center gap-1">
        {dockApps.map((app) => (
          <IosAppIcon key={app.id} app={app} onOpen={onOpenApp} size="dock" />
        ))}
      </div>
    </div>
  );
}
