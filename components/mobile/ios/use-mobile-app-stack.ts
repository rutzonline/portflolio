"use client";

import { useCallback, useState } from "react";
import { getMobileShellFallbackAppId, isAppSupportedOnMobile } from "@/lib/app-availability";
import { getShellUrlForApp, isNotesDetailPathname } from "@/lib/shell-routing";
import { setUrl } from "@/lib/set-url";

function syncMobileShellUrl(appId: string | null) {
  if (typeof window === "undefined") return;

  if (!appId) {
    setUrl("/");
    return;
  }

  if (appId === "notes" && isNotesDetailPathname(window.location.pathname)) {
    return;
  }

  if (appId === "messages" && window.location.pathname.startsWith("/messages")) {
    return;
  }

  const nextUrl = getShellUrlForApp(appId, { context: "mobile" });
  if (nextUrl && window.location.pathname !== nextUrl) {
    setUrl(nextUrl);
  }
}

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
    if (resolved) {
      syncMobileShellUrl(resolved);
      return [resolved];
    }
    syncMobileShellUrl(null);
    return [];
  });

  const isActive = stack.length > 0;
  const currentAppId = stack[stack.length - 1] ?? null;

  const push = useCallback((appId: string) => {
    if (!isAppSupportedOnMobile(appId)) return;
    setStack((current) => {
      if (current[current.length - 1] === appId) return current;
      return [...current, appId];
    });
    syncMobileShellUrl(appId);
  }, []);

  const pop = useCallback(() => {
    setStack((current) => {
      if (current.length <= 1) {
        syncMobileShellUrl(null);
        return [];
      }
      const next = current.slice(0, -1);
      syncMobileShellUrl(next[next.length - 1] ?? null);
      return next;
    });
  }, []);

  const popToHome = useCallback(() => {
    setStack([]);
    syncMobileShellUrl(null);
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
