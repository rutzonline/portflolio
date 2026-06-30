"use client";

import { useCallback, useEffect, useState } from "react";
import { isAppSupportedOnMobile } from "@/lib/app-availability";
import { IosAppHost } from "./ios-app-host";
import { IosControlCenterChrome, IosControlCenterProvider } from "./ios-control-center";
import { IosHomeScreen } from "./ios-home-screen";
import { IosLockScreen } from "./ios-lock-screen";
import {
  markIosUnlocked,
  resolveIosShellPhase,
  type IosShellPhase,
} from "./ios-session-state";
import { useMobileAppStack } from "./use-mobile-app-stack";

interface IosShellProps {
  renderApp: (appId: string) => React.ReactNode;
  initialApp?: string;
}

export function IosShell({ renderApp, initialApp }: IosShellProps) {
  const stack = useMobileAppStack(initialApp);
  const [phase, setPhase] = useState<IosShellPhase>(() => resolveIosShellPhase());

  useEffect(() => {
    setPhase(resolveIosShellPhase());
  }, []);

  const handleUnlock = useCallback(() => {
    markIosUnlocked();
    stack.popToHome();
    setPhase("ready");
  }, [stack]);

  const handleOpenApp = useCallback(
    (appId: string) => {
      if (!isAppSupportedOnMobile(appId)) return;
      stack.push(appId);
    },
    [stack]
  );

  if (phase === "loading") {
    return <div className="fixed inset-0 z-[100] bg-black" aria-hidden />;
  }

  const showHome = (phase === "locked" || phase === "ready") && !stack.isActive;
  const isUnlocked = phase !== "locked";

  const shellContent = (
    <>
      {showHome ? (
        <IosHomeScreen
          onOpenApp={handleOpenApp}
          enableIntroAutoOpen={phase === "ready"}
        />
      ) : null}

      {stack.isActive ? <IosAppHost stack={stack} renderApp={renderApp} /> : null}

      {phase === "locked" ? <IosLockScreen onUnlock={handleUnlock} /> : null}

      {isUnlocked ? (
        <IosControlCenterChrome tone={stack.isActive ? "app" : "wallpaper"} />
      ) : null}
    </>
  );

  if (!isUnlocked) {
    return shellContent;
  }

  return <IosControlCenterProvider>{shellContent}</IosControlCenterProvider>;
}
