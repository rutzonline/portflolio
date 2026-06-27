"use client";

import { useCallback } from "react";
import { isAppSupportedOnMobile } from "@/lib/app-availability";
import { IosAppHost } from "./ios-app-host";
import { IosHomeScreen } from "./ios-home-screen";
import { useMobileAppStack } from "./use-mobile-app-stack";

interface IosShellProps {
  renderApp: (appId: string) => React.ReactNode;
  initialApp?: string;
}

export function IosShell({ renderApp, initialApp }: IosShellProps) {
  const stack = useMobileAppStack(initialApp);

  const handleOpenApp = useCallback(
    (appId: string) => {
      if (!isAppSupportedOnMobile(appId)) return;
      stack.push(appId);
    },
    [stack]
  );

  if (stack.isActive) {
    return <IosAppHost stack={stack} renderApp={renderApp} />;
  }

  return <IosHomeScreen onOpenApp={handleOpenApp} />;
}
