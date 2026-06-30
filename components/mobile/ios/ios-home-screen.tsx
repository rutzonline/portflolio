"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSystemSettings } from "@/lib/system-settings-context";
import { getMobileWallpaperPath } from "@/lib/mobile-wallpapers";
import { getMessagesUnreadCount } from "@/lib/messages/unread-count";
import { preloadIosHomeIcons } from "@/lib/ios-app-icons";
import { getIosHomeGridApps } from "@/lib/ios-home-apps";
import { IosStatusBar, IOS_STATUS_BAR_OFFSET_CLASS } from "./ios-status-bar";
import { IosAppIcon } from "./ios-app-icon";
import { IosDock } from "./ios-dock";
import { IosIntroSheet } from "./ios-intro-sheet";
import { IosReadmeIcon } from "./ios-readme-icon";
import { isIosIntroDismissed, markIosIntroDismissed } from "./ios-session-state";

const IOS_INTRO_AUTO_OPEN_MS = 1000;

interface IosHomeScreenProps {
  onOpenApp: (appId: string) => void;
  enableIntroAutoOpen?: boolean;
}

export function IosHomeScreen({ onOpenApp, enableIntroAutoOpen = false }: IosHomeScreenProps) {
  const { mobileWallpaperId } = useSystemSettings();
  const wallpaperSrc = getMobileWallpaperPath(mobileWallpaperId);
  const gridApps = getIosHomeGridApps();
  const [showIntro, setShowIntro] = useState(false);
  const [messagesBadgeCount, setMessagesBadgeCount] = useState(0);

  useEffect(() => {
    preloadIosHomeIcons();
  }, []);

  useEffect(() => {
    const updateBadge = () => {
      const unread = getMessagesUnreadCount();
      setMessagesBadgeCount(unread);
    };

    updateBadge();
    window.addEventListener("storage", updateBadge);
    const intervalId = window.setInterval(updateBadge, 2000);

    return () => {
      window.removeEventListener("storage", updateBadge);
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!enableIntroAutoOpen) return;
    if (isIosIntroDismissed()) return;

    const timerId = window.setTimeout(() => {
      setShowIntro(true);
    }, IOS_INTRO_AUTO_OPEN_MS);

    return () => window.clearTimeout(timerId);
  }, [enableIntroAutoOpen]);

  const handleIntroClose = useCallback(() => {
    markIosIntroDismissed();
    setShowIntro(false);
  }, []);

  const handleOpenIntro = useCallback(() => {
    setShowIntro(true);
  }, []);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden select-none [-webkit-touch-callout:none]">
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
        <div className="flex-1 overflow-y-auto px-3 pb-3 pt-3">
          <div className="grid grid-cols-4 gap-x-2 gap-y-7 justify-items-center">
            {gridApps.map((app) => (
              <IosAppIcon
                key={app.id}
                app={app}
                onOpen={onOpenApp}
                size="grid"
                badgeCount={app.id === "messages" ? messagesBadgeCount : 0}
                className={
                  app.id === "resume"
                    ? "col-start-3"
                    : app.id === "desk"
                      ? "col-start-4 -ml-2"
                      : undefined
                }
              />
            ))}
          </div>
        </div>

        <div className="relative shrink-0 overflow-visible">
          <IosReadmeIcon
            onOpen={handleOpenIntro}
            className="absolute bottom-full left-4 z-10 mb-4"
          />
          <IosDock onOpenApp={onOpenApp} />
        </div>
      </div>

      {showIntro ? <IosIntroSheet onContinue={handleIntroClose} /> : null}
    </div>
  );
}
