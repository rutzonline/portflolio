"use client";

import { createElement, useMemo, type ReactNode } from "react";
import { WindowControls } from "@/components/window-controls";
import { useWindowFocus } from "@/lib/window-focus-context";
import { useMobileAppStackContext } from "@/components/mobile/ios/mobile-app-stack-context";
import { IosWindowNavBack } from "@/components/mobile/ios/ios-window-nav-back";

interface UseWindowNavBehaviorProps {
  isDesktop?: boolean;
  isMobile?: boolean;
  shellEnabled?: boolean;
  allowStandaloneClose?: boolean;
}

export function useWindowNavBehavior({
  isDesktop = false,
  isMobile = false,
  shellEnabled = true,
  allowStandaloneClose = true,
}: UseWindowNavBehaviorProps) {
  const windowFocus = useWindowFocus();
  const mobileStack = useMobileAppStackContext();
  const inShell = !!(shellEnabled && isDesktop && windowFocus);
  const inIosAppHost = !!(isMobile && mobileStack?.isActive);

  const navLeft = useMemo((): ReactNode => {
    if (inIosAppHost && mobileStack) {
      return createElement(IosWindowNavBack, {
        canGoBack: true,
        onBack: mobileStack.popToHome,
        backTitle: "Home",
      });
    }

    return createElement(WindowControls, {
      inShell,
      showWhenNotInShell: !isMobile && allowStandaloneClose,
      className: "p-2",
      onClose: inShell
        ? windowFocus?.closeWindow
        : allowStandaloneClose && !isMobile
          ? () => window.close()
          : undefined,
      onMinimize: inShell ? windowFocus?.minimizeWindow : undefined,
      onToggleMaximize: inShell ? windowFocus?.toggleMaximize : undefined,
      isMaximized: windowFocus?.isMaximized ?? false,
      closeLabel: inShell ? "Close window" : "Close tab",
    });
  }, [
    allowStandaloneClose,
    inIosAppHost,
    inShell,
    isMobile,
    mobileStack,
    windowFocus,
  ]);

  return {
    inShell,
    inIosAppHost,
    navLeft,
    onDragStart: inShell ? windowFocus?.onDragStart : undefined,
    onClose: inShell
      ? windowFocus?.closeWindow
      : allowStandaloneClose && !isMobile
        ? () => window.close()
        : undefined,
    onMinimize: inShell ? windowFocus?.minimizeWindow : undefined,
    onToggleMaximize: inShell ? windowFocus?.toggleMaximize : undefined,
    isMaximized: windowFocus?.isMaximized ?? false,
    closeLabel: inShell ? "Close window" : "Close tab",
  };
}
