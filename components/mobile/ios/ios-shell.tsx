"use client";

import { useCallback, useState } from "react";
import { X } from "lucide-react";
import { APPS } from "@/lib/app-config";
import { getMobileShellFallbackAppId, isAppSupportedOnMobile } from "@/lib/app-availability";
import { Button } from "@/components/ui/button";
import { IosHomeScreen } from "./ios-home-screen";

interface IosShellProps {
  renderApp: (appId: string) => React.ReactNode;
  initialApp?: string;
}

function resolveInitialApp(appId?: string): string | null {
  if (!appId) return null;
  if (!isAppSupportedOnMobile(appId)) {
    const fallback = getMobileShellFallbackAppId(appId);
    return isAppSupportedOnMobile(fallback) ? fallback : null;
  }
  return appId;
}

export function IosShell({ renderApp, initialApp }: IosShellProps) {
  const [openAppId, setOpenAppId] = useState<string | null>(() => resolveInitialApp(initialApp));

  const handleOpenApp = useCallback((appId: string) => {
    if (!isAppSupportedOnMobile(appId)) return;
    setOpenAppId(appId);
  }, []);

  const handleCloseApp = useCallback(() => {
    setOpenAppId(null);
  }, []);

  if (openAppId) {
    const app = APPS.find((entry) => entry.id === openAppId);

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-muted/80 px-4 py-3 backdrop-blur-xl">
          <span className="text-base font-semibold">{app?.name ?? "App"}</span>
          <Button variant="outline" size="sm" onClick={handleCloseApp} className="gap-1.5">
            <X className="h-4 w-4" />
            Close
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">{renderApp(openAppId)}</div>
      </div>
    );
  }

  return <IosHomeScreen onOpenApp={handleOpenApp} />;
}
