"use client";

import { APPS } from "@/lib/app-config";
import { cn } from "@/lib/utils";
import { IosStatusBar, IOS_STATUS_BAR_OFFSET_CLASS } from "./ios-status-bar";
import { MobileAppStackProvider, useMobileAppStackContext } from "./mobile-app-stack-context";
import type { MobileAppStackValue } from "./use-mobile-app-stack";

interface IosAppHostProps {
  stack: MobileAppStackValue;
  renderApp: (appId: string) => React.ReactNode;
}

function IosAppHostContent({ renderApp }: { renderApp: (appId: string) => React.ReactNode }) {
  const stack = useMobileAppStackContext();
  if (!stack?.currentAppId) return null;

  const app = APPS.find((entry) => entry.id === stack.currentAppId);

  return (
    <div className="flex min-h-full flex-col bg-background">
      <div className={cn("min-h-0 flex-1 overflow-y-auto", IOS_STATUS_BAR_OFFSET_CLASS)}>
        <div className="min-h-full">{renderApp(stack.currentAppId)}</div>
      </div>
      <span className="sr-only">{app?.name ?? "App"}</span>
    </div>
  );
}

export function IosAppHost({ stack, renderApp }: IosAppHostProps) {
  if (!stack.isActive || !stack.currentAppId) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <IosStatusBar tone="app" />
      <MobileAppStackProvider value={stack}>
        <IosAppHostContent renderApp={renderApp} />
      </MobileAppStackProvider>
    </div>
  );
}
