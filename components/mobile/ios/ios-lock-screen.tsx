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

const UNLOCK_ANIMATION_MS = 720;

export function IosLockScreen({ onUnlock }: IosLockScreenProps) {
  const { mobileWallpaperId } = useSystemSettings();
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [isUnlocking, setIsUnlocking] = useState(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const interval = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(interval);
  }, []);

  const triggerUnlock = useCallback(() => {
    if (isUnlocking) return;
    setIsUnlocking(true);
    window.setTimeout(onUnlock, UNLOCK_ANIMATION_MS);
  }, [isUnlocking, onUnlock]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const startY = touchStartY.current;
    touchStartY.current = null;
    if (startY == null) return;
    const endY = event.changedTouches[0]?.clientY ?? startY;
    if (startY - endY > 48) {
      triggerUnlock();
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col overflow-hidden bg-black",
        "transition-[transform,opacity] duration-[720ms] ease-[cubic-bezier(0.33,1,0.68,1)] will-change-transform",
        isUnlocking ? "-translate-y-full opacity-95" : "translate-y-0 opacity-100"
      )}
      onClick={triggerUnlock}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="button"
      aria-label="Tap or swipe up to unlock"
    >
      <Image
        src={getMobileWallpaperPath(mobileWallpaperId)}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        unoptimized
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
            "transition-opacity duration-300 ease-out",
            isUnlocking && "opacity-0"
          )}
        >
          <ChevronUp className="h-6 w-6 animate-bounce" aria-hidden />
          <p className="text-sm font-medium tracking-wide">Swipe up to open</p>
          <p className="text-xs text-white/70">or tap anywhere</p>
        </div>
      </div>
    </div>
  );
}
