"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSystemSettings } from "@/lib/system-settings-context";
import { getWallpaperPath } from "@/lib/os-versions";
import { getHeadshotSrc } from "@/config/site";

interface LockScreenProps {
  onUnlock: () => void;
}

function formatLockTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatLockDate(date: Date): string {
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  return `${weekday}, ${month} ${day}`;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const { currentOS } = useSystemSettings();
  const [currentTime, setCurrentTime] = useState(() => formatLockTime(new Date()));
  const [currentDate, setCurrentDate] = useState(() => formatLockDate(new Date()));
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(formatLockTime(now));
      setCurrentDate(formatLockDate(now));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlock = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      onUnlock();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center transition-opacity duration-300 bg-black ${
        isUnlocking ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleUnlock}
    >
      {/* Wallpaper background (not blurred) - covers everything */}
      <div className="absolute inset-0">
        <Image
          src={getWallpaperPath(currentOS.id)}
          alt="Lock screen wallpaper"
          fill
          className="object-cover"
          priority
          quality={75}
        />
      </div>

      {/* Date and Time - positioned near top */}
      <div className="mt-24 text-center relative z-10">
        <div className="text-2xl font-medium text-white/90 tracking-wide">
          {currentDate}
        </div>
        <div className="text-[120px] font-medium text-white leading-none tracking-tight">
          {currentTime}
        </div>
      </div>

      {/* Spacer to push user section to bottom */}
      <div className="flex-1" />

      {/* User Avatar and Name - at bottom */}
      <div className="mb-16 flex flex-col items-center relative z-10">
        {/* Avatar with shadow */}
        <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl">
          <Image
            src={getHeadshotSrc()}
            alt="rutuja rochkari"
            width={64}
            height={64}
            className="object-cover w-full h-full"
            unoptimized
          />
        </div>

        {/* Name */}
        <div className="mt-2 text-sm font-medium text-white drop-shadow-md">
          rutuja rochkari
        </div>

        {/* Touch ID prompt */}
        <div className="mt-1 text-xs text-white/70 drop-shadow-sm">
          Touch ID or Enter Password
        </div>
      </div>
    </div>
  );
}
