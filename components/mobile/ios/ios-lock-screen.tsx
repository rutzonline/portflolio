"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSystemSettings } from "@/lib/system-settings-context";
import { getMobileWallpaperPath } from "@/lib/mobile-wallpapers";

interface IosLockScreenProps {
  onUnlock: () => void;
}

function formatLockDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatLockTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

const UNLOCK_ANIMATION_MS = 1100;
const DOUBLE_TAP_WINDOW_MS = 400;
const SWIPE_UNLOCK_THRESHOLD_PX = 48;

export function IosLockScreen({ onUnlock }: IosLockScreenProps) {
  const { mobileWallpaperId } = useSystemSettings();
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [pullOffset, setPullOffset] = useState(0);
  const lastTapAtRef = useRef(0);
  const pullStartYRef = useRef<number | null>(null);
  const didSwipeRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    const interval = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(interval);
  }, []);

  const triggerUnlock = useCallback(() => {
    if (isUnlocking) return;
    setIsUnlocking(true);
    setPullOffset(0);
    window.setTimeout(onUnlock, UNLOCK_ANIMATION_MS);
  }, [isUnlocking, onUnlock]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isUnlocking) return;
      pullStartYRef.current = event.clientY;
      didSwipeRef.current = false;
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [isUnlocking]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isUnlocking || pullStartYRef.current == null) return;

      const offset = Math.min(0, event.clientY - pullStartYRef.current);
      setPullOffset(offset);

      if (offset < -12) {
        didSwipeRef.current = true;
      }
    },
    [isUnlocking]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isUnlocking) return;

      const startY = pullStartYRef.current;
      pullStartYRef.current = null;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      const swipeDistance = startY != null ? startY - event.clientY : 0;

      if (swipeDistance > SWIPE_UNLOCK_THRESHOLD_PX || pullOffset < -SWIPE_UNLOCK_THRESHOLD_PX) {
        lastTapAtRef.current = 0;
        triggerUnlock();
        return;
      }

      setPullOffset(0);

      if (didSwipeRef.current) {
        lastTapAtRef.current = 0;
        return;
      }

      const tappedAt = Date.now();
      const elapsed = tappedAt - lastTapAtRef.current;

      if (elapsed > 0 && elapsed <= DOUBLE_TAP_WINDOW_MS) {
        lastTapAtRef.current = 0;
        triggerUnlock();
        return;
      }

      lastTapAtRef.current = tappedAt;
    },
    [isUnlocking, pullOffset, triggerUnlock]
  );

  const handlePointerCancel = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    pullStartYRef.current = null;
    didSwipeRef.current = false;
    setPullOffset(0);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col overflow-hidden bg-black touch-none",
        "will-change-transform",
        (isUnlocking || pullOffset === 0) &&
          "transition-transform duration-[1100ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
        isUnlocking && "pointer-events-none"
      )}
      style={{
        transform: isUnlocking ? "translateY(-100%)" : `translateY(${pullOffset}px)`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      role="button"
      aria-label="Swipe up or double tap to unlock"
    >
      <Image
        src={getMobileWallpaperPath(mobileWallpaperId)}
        alt=""
        fill
        priority
        quality={75}
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/20" aria-hidden />

      <div className="relative z-10 flex flex-1 flex-col items-center px-6 pt-[max(env(safe-area-inset-top),24px)]">
        <div className="mt-16 text-center text-white">
          <p className="text-lg font-medium tracking-tight text-white/90">
            {mounted ? formatLockDate(now) : "\u00A0"}
          </p>
          <p
            className="mt-1 font-semibold leading-none tracking-tight text-white"
            style={{ fontSize: "clamp(4.5rem, 22vw, 6.5rem)" }}
          >
            {mounted ? formatLockTime(now) : "\u00A0"}
          </p>
        </div>

        <div className="flex-1" />

        <div
          className={cn(
            "mb-[max(env(safe-area-inset-bottom),28px)] flex flex-col items-center gap-2 text-white/90",
            "transition-opacity duration-500 ease-out",
            isUnlocking && "opacity-0"
          )}
        >
          <ChevronUp className="h-6 w-6 animate-bounce" aria-hidden />
          <p className="text-sm font-medium tracking-wide text-center">
            Swipe up or double tap to unlock
          </p>
        </div>
      </div>
    </div>
  );
}
