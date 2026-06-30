"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSystemSettingsSafe } from "@/lib/system-settings-context";

export const IOS_STATUS_BAR_OFFSET_CLASS =
  "pt-[calc(max(env(safe-area-inset-top),10px)+34px)]";

function formatStatusTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function AirplaneGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="currentColor"
      aria-hidden
      className={cn("h-[13px] w-[18px]", className)}
    >
      <path d="M16.2 1.8 9.4 8.6 3.6 2.8 2.2 4.2l5.2 5.2-5.2 5.2 1.4 1.4 5.8-5.8 6.8 6.8 1.4-1.4-6.8-6.8 6.8-6.8-1.4-1.4Z" />
    </svg>
  );
}

function WifiGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 14"
      fill="currentColor"
      aria-hidden
      className={cn("h-[13px] w-[18px]", className)}
    >
      <path d="M9 12.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z" />
      <path d="M5.8 9.1a5.2 5.2 0 0 1 6.4 0l.9-1.1a6.7 6.7 0 0 0-8.2 0l.9 1.1Z" />
      <path d="M2.6 6.2a9.4 9.4 0 0 1 12.8 0l.9-1.1a11 11 0 0 0-14.6 0l.9 1.1Z" />
    </svg>
  );
}

function BatteryGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 27 13"
      fill="none"
      aria-hidden
      className={cn("h-[13px] w-[26px]", className)}
    >
      <rect x="0.75" y="1.25" width="21" height="10.5" rx="2.25" stroke="currentColor" strokeWidth="1.1" />
      <rect x="2.5" y="3" width="16.5" height="7" rx="1.2" fill="currentColor" />
      <path
        d="M23.5 4.6v3.8c1-.35 1.7-1.25 1.7-1.9s-.7-1.55-1.7-1.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IosStatusBar({ tone = "wallpaper" }: { tone?: "wallpaper" | "app" }) {
  const [mounted, setMounted] = useState(false);
  const [timeLabel, setTimeLabel] = useState("");
  const { airplaneModeEnabled, wifiEnabled } = useSystemSettingsSafe();

  useEffect(() => {
    setMounted(true);

    const sync = () => setTimeLabel(formatStatusTime(new Date()));
    sync();

    const intervalId = window.setInterval(sync, 1_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50",
        "flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),10px)] pb-1.5",
        "text-[15px] font-semibold tracking-tight",
        tone === "wallpaper" ? "text-white" : "text-foreground"
      )}
      aria-hidden
    >
      <span className="tabular-nums min-w-[3rem]">{mounted ? timeLabel : null}</span>
      <div className="flex items-center gap-2">
        {airplaneModeEnabled ? <AirplaneGlyph /> : wifiEnabled ? <WifiGlyph /> : null}
        <BatteryGlyph />
      </div>
    </div>
  );
}
