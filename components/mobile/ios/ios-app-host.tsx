"use client";

import { APPS } from "@/lib/app-config";
import { cn } from "@/lib/utils";
import { MobileAppStackProvider, useMobileAppStackContext } from "./mobile-app-stack-context";
import { IOS_STATUS_BAR_OFFSET_CLASS } from "./ios-status-bar";
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background text-[17px] leading-[1.5]">
      <div className="min-h-0 flex-1 overflow-hidden">{renderApp(stack.currentAppId)}</div>
      <span className="sr-only">{app?.name ?? "App"}</span>
    </div>
  );
}

export function IosAppHost({ stack, renderApp }: IosAppHostProps) {
  if (!stack.isActive || !stack.currentAppId) return null;

  return (
    <div className={cn("fixed inset-0 z-50 flex flex-col bg-background", IOS_STATUS_BAR_OFFSET_CLASS)}>
      <MobileAppStackProvider value={stack}>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <IosAppHostContent renderApp={renderApp} />
        </div>
      </MobileAppStackProvider>
    </div>
  );
}
