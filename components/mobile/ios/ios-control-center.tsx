"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { ControlCenterModules } from "@/components/control-center/control-center-modules";
import { IosStatusBar } from "./ios-status-bar";

const PANEL_ANIMATION_MS = 320;
const SWIPE_OPEN_THRESHOLD_PX = 36;
const SWIPE_DISMISS_THRESHOLD_PX = 48;

/** Height of the interactive status-bar strip (time / wifi / battery row only). */
const IOS_STATUS_BAR_STRIP_HEIGHT_PX = 22;

interface IosControlCenterContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const IosControlCenterContext = createContext<IosControlCenterContextValue | null>(null);

export function IosControlCenterProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      isOpen,
      open,
      close,
    }),
    [isOpen, open, close]
  );

  return (
    <IosControlCenterContext.Provider value={value}>{children}</IosControlCenterContext.Provider>
  );
}

function useIosControlCenter() {
  const context = useContext(IosControlCenterContext);
  if (!context) {
    throw new Error("useIosControlCenter must be used within IosControlCenterProvider");
  }
  return context;
}

interface IosStatusBarControlRegionProps {
  tone?: "wallpaper" | "app";
}

function IosStatusBarControlRegion({ tone = "wallpaper" }: IosStatusBarControlRegionProps) {
  const { isOpen, open } = useIosControlCenter();
  const pullStartYRef = useRef<number | null>(null);
  const didSwipeRef = useRef(false);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isOpen) return;
      pullStartYRef.current = event.clientY;
      didSwipeRef.current = false;
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [isOpen]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isOpen || pullStartYRef.current == null) return;
      if (event.clientY - pullStartYRef.current > 8) {
        didSwipeRef.current = true;
      }
    },
    [isOpen]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isOpen) return;

      const startY = pullStartYRef.current;
      pullStartYRef.current = null;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      const swipeDistance = startY != null ? event.clientY - startY : 0;

      if (swipeDistance > SWIPE_OPEN_THRESHOLD_PX) {
        open();
        return;
      }

      if (!didSwipeRef.current) {
        open();
      }

      didSwipeRef.current = false;
    },
    [isOpen, open]
  );

  const handlePointerCancel = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    pullStartYRef.current = null;
    didSwipeRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const stripStyle: React.CSSProperties = {
    top: 0,
    left: 0,
    right: 0,
    height: `calc(max(env(safe-area-inset-top), 10px) + ${IOS_STATUS_BAR_STRIP_HEIGHT_PX}px)`,
  };

  return (
    <>
      <IosStatusBar tone={tone} />
      {!isOpen ? (
        <div
          className="fixed z-[60] touch-none"
          style={stripStyle}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          aria-label="Open Control Center"
        />
      ) : null}
    </>
  );
}

function IosControlCenterOverlay() {
  const { isOpen, close } = useIosControlCenter();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const pullStartYRef = useRef<number | null>(null);
  const pullOffsetRef = useRef(0);
  const [pullOffset, setPullOffset] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    setVisible(false);
    setIsDismissing(false);
    setPullOffset(0);
    pullOffsetRef.current = 0;
    const timeoutId = window.setTimeout(() => setMounted(false), PANEL_ANIMATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const finishDismiss = useCallback(() => {
    setIsDismissing(false);
    setPullOffset(0);
    pullOffsetRef.current = 0;
    close();
  }, [close]);

  const handlePanelPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isOpen || isDismissing) return;
      pullStartYRef.current = event.clientY;
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [isDismissing, isOpen]
  );

  const handlePanelPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isOpen || isDismissing || pullStartYRef.current == null) return;
      const offset = Math.min(0, event.clientY - pullStartYRef.current);
      pullOffsetRef.current = offset;
      setPullOffset(offset);
    },
    [isDismissing, isOpen]
  );

  const handlePanelPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isOpen || isDismissing) return;

      const startY = pullStartYRef.current;
      pullStartYRef.current = null;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      const swipeUpDistance = startY != null ? startY - event.clientY : 0;
      const shouldDismiss =
        swipeUpDistance > SWIPE_DISMISS_THRESHOLD_PX ||
        pullOffsetRef.current < -SWIPE_DISMISS_THRESHOLD_PX;

      if (shouldDismiss) {
        setIsDismissing(true);
        setPullOffset(0);
        pullOffsetRef.current = 0;
        window.setTimeout(finishDismiss, PANEL_ANIMATION_MS);
        return;
      }

      setPullOffset(0);
      pullOffsetRef.current = 0;
    },
    [finishDismiss, isDismissing, isOpen]
  );

  const handlePanelPointerCancel = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      pullStartYRef.current = null;
      setPullOffset(0);
      pullOffsetRef.current = 0;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    []
  );

  if (!mounted) return null;

  const panelTransform = isDismissing
    ? "translateY(-100%)"
    : pullOffset !== 0
      ? `translateY(${pullOffset}px)`
      : visible
        ? "translateY(0)"
        : "translateY(-100%)";

  return (
    <div
      className="fixed inset-0 z-[100] touch-none"
      role="dialog"
      aria-modal="true"
      aria-label="Control Center"
    >
      <button
        type="button"
        aria-label="Close Control Center"
        className={cn(
          "absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300",
          visible && !isDismissing ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={close}
      />

      <div
        ref={panelRef}
        className={cn(
          "absolute inset-x-0 top-0 mx-auto w-full max-w-lg px-3 pt-[max(env(safe-area-inset-top),10px)]",
          pullOffset === 0 && "transition-transform duration-300 ease-\\[cubic-bezier(0.32,0.72,0,1)\\]"
        )}
        style={{ transform: panelTransform }}
        onPointerDown={handlePanelPointerDown}
        onPointerMove={handlePanelPointerMove}
        onPointerUp={handlePanelPointerUp}
        onPointerCancel={handlePanelPointerCancel}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={cn(
            "overflow-hidden rounded-b-[28px] border border-black/10 shadow-2xl",
            "bg-white/75 backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/75"
          )}
        >
          <div className="px-3 pb-4 pt-2">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-black/15 dark:bg-white/20" />
            <ControlCenterModules />
          </div>
        </div>
      </div>
    </div>
  );
}

interface IosControlCenterChromeProps {
  tone?: "wallpaper" | "app";
}

/** Status bar pull-down trigger + control center overlay (mobile only). */
export function IosControlCenterChrome({ tone = "wallpaper" }: IosControlCenterChromeProps) {
  return (
    <>
      <IosStatusBarControlRegion tone={tone} />
      <IosControlCenterOverlay />
    </>
  );
}
