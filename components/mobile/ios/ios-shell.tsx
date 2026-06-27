"use client";

import { useCallback, useEffect, useState } from "react";
import { isAppSupportedOnMobile } from "@/lib/app-availability";
import { IosAppHost } from "./ios-app-host";
import { IosHomeScreen } from "./ios-home-screen";
import { IosIntroSheet } from "./ios-intro-sheet";
import { IosLockScreen } from "./ios-lock-screen";
import {
  markIosIntroDismissed,
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
  const [phase, setPhase] = useState<IosShellPhase>("loading");

  useEffect(() => {
    setPhase(resolveIosShellPhase());
  }, []);

  const handleUnlock = useCallback(() => {
    markIosUnlocked();
    setPhase("intro");
  }, []);

  const handleIntroContinue = useCallback(() => {
    markIosIntroDismissed();
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

  if (phase === "locked") {
    return <IosLockScreen onUnlock={handleUnlock} />;
  }

  if (phase === "intro") {
    return <IosIntroSheet onContinue={handleIntroContinue} />;
  }

  if (stack.isActive) {
    return <IosAppHost stack={stack} renderApp={renderApp} />;
  }

  return <IosHomeScreen onOpenApp={handleOpenApp} />;
}
