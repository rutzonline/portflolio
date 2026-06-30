"use client";

import { useEffect, useState } from "react";
import { getIosDockApps } from "@/lib/ios-home-apps";
import { getMessagesUnreadCount } from "@/lib/messages/unread-count";
import { cn } from "@/lib/utils";
import { IosAppIcon } from "./ios-app-icon";

interface IosDockProps {
  onOpenApp: (appId: string) => void;
  className?: string;
}

export function IosDock({ onOpenApp, className }: IosDockProps) {
  const dockApps = getIosDockApps();
  const [messagesBadgeCount, setMessagesBadgeCount] = useState(0);

  useEffect(() => {
    const updateBadge = () => {
      setMessagesBadgeCount(getMessagesUnreadCount());
    };

    updateBadge();
    window.addEventListener("storage", updateBadge);
    const intervalId = window.setInterval(updateBadge, 2000);

    return () => {
      window.removeEventListener("storage", updateBadge);
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      className={cn(
        "mx-3 mb-[max(env(safe-area-inset-bottom),12px)] overflow-visible rounded-[28px]",
        "border border-white/20 bg-white/18 backdrop-blur-2xl",
        "px-3 pb-2.5 pt-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      <div className="grid grid-cols-5 items-end justify-items-center gap-0.5 overflow-visible">
        {dockApps.map((app) => (
          <IosAppIcon
            key={app.id}
            app={app}
            onOpen={onOpenApp}
            size="dock"
            badgeCount={app.id === "messages" ? messagesBadgeCount : 0}
          />
        ))}
      </div>
    </div>
  );
}
