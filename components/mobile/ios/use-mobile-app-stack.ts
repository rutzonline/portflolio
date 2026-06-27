"use client";

import { useCallback, useState } from "react";
import { getMobileShellFallbackAppId, isAppSupportedOnMobile } from "@/lib/app-availability";

export function resolveInitialMobileApp(appId?: string): string | null {
  if (!appId) return null;
  if (!isAppSupportedOnMobile(appId)) {
    const fallback = getMobileShellFallbackAppId(appId);
    return isAppSupportedOnMobile(fallback) ? fallback : null;
  }
  return appId;
}

export function useMobileAppStack(initialAppId?: string) {
  const [stack, setStack] = useState<string[]>(() => {
    const resolved = resolveInitialMobileApp(initialAppId);
    return resolved ? [resolved] : [];
  });

  const isActive = stack.length > 0;
  const currentAppId = stack[stack.length - 1] ?? null;

  const push = useCallback((appId: string) => {
    if (!isAppSupportedOnMobile(appId)) return;
    setStack((current) => {
      if (current[current.length - 1] === appId) return current;
      return [...current, appId];
    });
  }, []);

  const pop = useCallback(() => {
    setStack((current) => (current.length <= 1 ? [] : current.slice(0, -1)));
  }, []);

  const popToHome = useCallback(() => {
    setStack([]);
  }, []);

  return {
    stack,
    isActive,
    currentAppId,
    push,
    pop,
    popToHome,
  };
}

export type MobileAppStackValue = ReturnType<typeof useMobileAppStack>;
