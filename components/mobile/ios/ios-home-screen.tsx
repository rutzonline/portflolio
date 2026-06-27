"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSystemSettings } from "@/lib/system-settings-context";
import { getWallpaperPath } from "@/lib/os-versions";
import { getIosHomeGridApps } from "@/lib/ios-home-apps";
import { IosStatusBar, IOS_STATUS_BAR_OFFSET_CLASS } from "./ios-status-bar";
import { IosAppIcon } from "./ios-app-icon";
import { IosDock } from "./ios-dock";

interface IosHomeScreenProps {
  onOpenApp: (appId: string) => void;
}

export function IosHomeScreen({ onOpenApp }: IosHomeScreenProps) {
  const { currentOS } = useSystemSettings();
  const wallpaperSrc = getWallpaperPath(currentOS.id);
  const gridApps = getIosHomeGridApps();

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <Image
        src={wallpaperSrc}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        unoptimized
      />
      <div className="absolute inset-0 bg-black/10" aria-hidden />

      <IosStatusBar />

      <div className={cn("relative z-10 flex min-h-0 flex-1 flex-col", IOS_STATUS_BAR_OFFSET_CLASS)}>
        <div className="flex-1 overflow-y-auto px-5 pb-4 pt-4">
          <div className="grid grid-cols-4 gap-x-3 gap-y-6">
            {gridApps.map((app) => (
              <IosAppIcon key={app.id} app={app} onOpen={onOpenApp} size="grid" />
            ))}
          </div>
        </div>

        <IosDock onOpenApp={onOpenApp} />
      </div>
    </div>
  );
}
