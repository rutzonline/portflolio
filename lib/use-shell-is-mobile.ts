"use client";

import { useEffect, useState } from "react";
import {
  SHELL_POINTER_MEDIA_QUERY,
  detectMobileClientFromWindow,
} from "@/lib/device-detection";

export function useShellIsMobile(initialIsMobile?: boolean): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(
    typeof initialIsMobile === "boolean" ? initialIsMobile : null
  );

  useEffect(() => {
    const mediaQueries = [window.matchMedia(SHELL_POINTER_MEDIA_QUERY)];

    const syncIsMobile = () => {
      setIsMobile(detectMobileClientFromWindow());
    };

    syncIsMobile();

    mediaQueries.forEach((mediaQuery) => {
      mediaQuery.addEventListener("change", syncIsMobile);
    });

    window.addEventListener("resize", syncIsMobile);

    return () => {
      mediaQueries.forEach((mediaQuery) => {
        mediaQuery.removeEventListener("change", syncIsMobile);
      });
      window.removeEventListener("resize", syncIsMobile);
    };
  }, []);

  return isMobile;
}
