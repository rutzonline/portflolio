"use client";

import { useRef, useState } from "react";
import {
  Wifi,
  Bluetooth,
  Sun,
  Volume2,
  Moon,
  BedDouble,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSystemSettings, type FocusMode } from "@/lib/system-settings-context";
import { ControlCenterNowPlaying } from "./control-center-now-playing";

export function AirDropIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 18a6 6 0 0 0 0-12" />
      <path d="M12 14a2 2 0 0 0 0-4" />
      <path d="M12 22a10 10 0 0 0 0-20" />
    </svg>
  );
}

export const focusModeConfig: Record<
  Exclude<FocusMode, "off">,
  { name: string; icon: React.ReactNode }
> = {
  doNotDisturb: { name: "Do Not Disturb", icon: <Moon className="w-4 h-4" /> },
  sleep: { name: "Sleep", icon: <BedDouble className="w-4 h-4" /> },
  reduceInterruptions: {
    name: "Reduce Interruptions",
    icon: <SlidersHorizontal className="w-4 h-4" />,
  },
};

const moduleCardClass = "rounded-2xl bg-black/5 dark:bg-white/10";
const toggleIconClass = (enabled: boolean) =>
  cn(
    "flex items-center justify-center w-7 h-7 rounded-full shrink-0",
    enabled ? "bg-accent-blue" : "bg-black/10 dark:bg-white/10"
  );

const sliderClass =
  "flex-1 h-1.5 bg-black/10 dark:bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md";

interface ControlCenterModulesProps {
  className?: string;
}

/** Mobile control center tiles — mirrors desktop modules with inline now playing. */
export function ControlCenterModules({ className }: ControlCenterModulesProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showFocusMenu, setShowFocusMenu] = useState(false);
  const {
    brightness,
    setBrightness,
    volume,
    setVolume,
    wifiEnabled,
    setWifiEnabled,
    bluetoothEnabled,
    setBluetoothEnabled,
    airdropMode,
    setAirdropMode,
    focusMode,
    setFocusMode,
  } = useSystemSettings();

  const toggleAirdrop = () => {
    setAirdropMode(airdropMode === "contacts" ? "everyone" : "contacts");
  };

  const handleFocusSelect = (mode: FocusMode) => {
    setFocusMode(focusMode === mode ? "off" : mode);
    setShowFocusMenu(false);
  };

  return (
    <div ref={menuRef} className={cn("space-y-2", className)}>
      <div className="grid grid-cols-2 gap-2">
        <div className={cn(moduleCardClass, "p-3 space-y-3")}>
          <button
            type="button"
            onClick={() => setWifiEnabled(!wifiEnabled)}
            className="flex items-center gap-2.5 w-full"
          >
            <div className={toggleIconClass(wifiEnabled)}>
              <Wifi className={cn("w-4 h-4", wifiEnabled ? "text-white" : "")} />
            </div>
            <div className="text-left min-w-0">
              <div className="text-sm font-medium truncate">Wi-Fi</div>
              <div className="text-xs truncate text-muted-foreground">
                {wifiEnabled ? "basecase" : "Off"}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
            className="flex items-center gap-2.5 w-full"
          >
            <div className={toggleIconClass(bluetoothEnabled)}>
              <Bluetooth className={cn("w-4 h-4", bluetoothEnabled ? "text-white" : "")} />
            </div>
            <div className="text-left min-w-0">
              <div className="text-sm font-medium truncate">Bluetooth</div>
              <div className="text-xs truncate text-muted-foreground">
                {bluetoothEnabled ? "On" : "Off"}
              </div>
            </div>
          </button>

          <button type="button" onClick={toggleAirdrop} className="flex items-center gap-2.5 w-full">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent-blue shrink-0">
              <AirDropIcon className="w-4 h-4 text-white" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-sm font-medium truncate">AirDrop</div>
              <div className="text-xs truncate text-muted-foreground">
                {airdropMode === "contacts" ? "Contacts Only" : "Everyone"}
              </div>
            </div>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <ControlCenterNowPlaying />
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFocusMenu(!showFocusMenu)}
              className={cn(moduleCardClass, "flex w-full items-center gap-2.5 p-3")}
            >
              <div className={toggleIconClass(focusMode !== "off")}>
                <Moon className={cn("w-4 h-4", focusMode !== "off" ? "text-white" : "")} />
              </div>
              <div className="min-w-0 text-left">
                <div className="truncate text-sm font-medium">Focus</div>
                <div className="truncate text-xs text-muted-foreground">
                  {focusMode === "off" ? "Off" : focusModeConfig[focusMode].name}
                </div>
              </div>
            </button>

            {showFocusMenu ? (
              <div className="absolute left-0 top-full z-10 mt-1.5 w-full min-w-[160px] rounded-xl border border-black/10 bg-white/95 py-1 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-800/95">
                <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">Focus</div>
                {(Object.keys(focusModeConfig) as Exclude<FocusMode, "off">[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleFocusSelect(mode)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors can-hover:hover:bg-accent-blue can-hover:hover:text-white"
                  >
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full",
                        focusMode === mode ? "bg-purple-500 text-white" : "bg-black/10 dark:bg-white/10"
                      )}
                    >
                      {focusModeConfig[mode].icon}
                    </div>
                    <span className="text-sm">{focusModeConfig[mode].name}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className={cn(moduleCardClass, "p-3")}>
        <div className="text-sm font-medium mb-2">Display</div>
        <div className="flex items-center gap-2.5">
          <Sun className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className={sliderClass}
            aria-label="Display brightness"
          />
          <Sun className="w-4 h-4 shrink-0" />
        </div>
      </div>

      <div className={cn(moduleCardClass, "p-3")}>
        <div className="text-sm font-medium mb-2">Sound</div>
        <div className="flex items-center gap-2.5">
          <Volume2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className={sliderClass}
            aria-label="Sound volume"
          />
          <Volume2 className="w-4 h-4 shrink-0" />
        </div>
      </div>
    </div>
  );
}
