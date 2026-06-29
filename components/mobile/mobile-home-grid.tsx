"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import { APPS } from "@/lib/app-config";
import { Button } from "@/components/ui/button";

function getMobileOverrideIconSrc(appId: string, fallback: string): string {
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
      return fallback;
  }
}

const MOBILE_GRID_APP_IDS = [
  "finder",
  "notes",
  "messages",
  "photos",
  "desk",
  "calendar",
  "resume",
  "settings",
] as const;

interface MobileHomeGridProps {
  renderApp: (appId: string) => React.ReactNode;
}

export function MobileHomeGrid({ renderApp }: MobileHomeGridProps) {
  const [openAppId, setOpenAppId] = useState<string | null>(null);

  const gridApps = MOBILE_GRID_APP_IDS.map((id) => APPS.find((a) => a.id === id)).filter(Boolean);

  if (openAppId) {
    const app = APPS.find((a) => a.id === openAppId);
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/80 backdrop-blur-xl shrink-0">
          <span className="text-base font-semibold">{app?.name ?? "App"}</span>
          <Button variant="outline" size="sm" onClick={() => setOpenAppId(null)} className="gap-1.5">
            <X className="w-4 h-4" />
            Close
          </Button>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">{renderApp(openAppId)}</div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="grid grid-cols-4 grid-rows-2 gap-6 w-full max-w-md">
        {gridApps.map((app) =>
          app ? (
            <button
              key={app.id}
              type="button"
              onClick={() => setOpenAppId(app.id)}
              className="flex flex-col items-center gap-2 can-hover:hover:opacity-90 active:scale-95 transition-transform"
            >
              <Image
                src={getMobileOverrideIconSrc(app.id, app.icon)}
                alt={app.name}
                width={56}
                height={56}
                className="rounded-xl shadow-lg"
                unoptimized
              />
              <span className="text-[11px] text-zinc-300 text-center leading-tight max-w-[72px] truncate">
                {app.name}
              </span>
            </button>
          ) : null
        )}
      </div>
    </div>
  );
}
