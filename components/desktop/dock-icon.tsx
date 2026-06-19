"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
const MAGNIFY_DISTANCE = 150;
const SPRING_CONFIG = { stiffness: 150, damping: 20, mass: 0.1 };
const DOT_MARGIN = 4;

/** Icons render at full slot size (matches reference dock `metrics.icon`). */
export const DOCK_ICON_VISUAL_RATIO = 1;

export function getDockIconVisualSize(baseSize: number): number {
  return Math.round(baseSize * DOCK_ICON_VISUAL_RATIO);
}

export interface DockIconBadgeMetrics {
  height: number;
  minWidth: number;
  paddingX: number;
  fontSize: number;
}

interface DockIconProps {
  mouseX: MotionValue<number>;
  baseSize: number;
  maxSize: number;
  appId: string;
  name: string;
  iconSrc: string;
  isOpen: boolean;
  showOpenDot: boolean;
  badgeCount: number;
  animState: "entering" | "exiting" | "stable";
  magnificationEnabled: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  tooltip?: React.ReactNode;
  dotSize: number;
  badgeMetrics: DockIconBadgeMetrics;
  dockArtScale?: number;
}

function formatBadgeCount(count: number): string {
  if (count > 99) return "99+";
  return String(count);
}

export function getDockSlotHeight(baseSize: number, dotSize: number): number {
  return baseSize + DOT_MARGIN + dotSize;
}

export function DockIcon({
  mouseX,
  baseSize,
  maxSize,
  appId,
  name,
  iconSrc,
  isOpen,
  showOpenDot,
  badgeCount,
  animState,
  magnificationEnabled,
  onClick,
  onMouseEnter,
  onMouseLeave,
  tooltip,
  dotSize,
  badgeMetrics,
  dockArtScale = 1,
}: DockIconProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const slotHeight = getDockSlotHeight(baseSize, dotSize);

  const distance = useTransform(mouseX, (mx) => {
    if (!magnificationEnabled || !Number.isFinite(mx)) return MAGNIFY_DISTANCE;
    const el = buttonRef.current;
    if (!el) return MAGNIFY_DISTANCE;
    const rect = el.getBoundingClientRect();
    return mx - (rect.left + rect.width / 2);
  });

  const targetSize = useTransform(
    distance,
    [-MAGNIFY_DISTANCE, 0, MAGNIFY_DISTANCE],
    [baseSize, maxSize, baseSize]
  );
  const slotWidth = useSpring(targetSize, SPRING_CONFIG);
  const iconScale = useTransform(slotWidth, (w) => w / baseSize);

  const useMagnify = magnificationEnabled && animState === "stable";
  const visualSize = getDockIconVisualSize(baseSize);
  const artScale = dockArtScale > 0 ? dockArtScale : 1;

  const tooltipBottom = useTransform(iconScale, (scale) => {
    const visualScale = useMagnify ? scale : 1;
    return dotSize + DOT_MARGIN + baseSize * visualScale + 10;
  });

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={name}
      className={cn(
        "group relative flex flex-col items-center justify-end outline-none flex-shrink-0 overflow-visible",
        animState === "entering" && "animate-dock-enter",
        animState === "exiting" && "animate-dock-exit"
      )}
      style={{
        width: useMagnify ? slotWidth : baseSize,
        height: slotHeight,
        minWidth: baseSize,
      }}
    >
      <motion.div
        className="relative z-10 flex items-end justify-center overflow-visible"
        style={{
          width: baseSize,
          height: baseSize,
          scale: useMagnify ? iconScale : 1,
          transformOrigin: "bottom center",
        }}
      >
        <div className="flex h-full w-full items-end justify-center pointer-events-none">
          <div
            className="[filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.35))]"
            style={{
              width: visualSize,
              height: visualSize,
              transform: artScale !== 1 ? `scale(${artScale})` : undefined,
              transformOrigin: "bottom center",
            }}
          >
            <Image
              src={iconSrc}
              alt={name}
              width={visualSize}
              height={visualSize}
              className="h-full w-full object-contain pointer-events-none"
              draggable={false}
              unoptimized
            />
          </div>
        </div>
        {badgeCount > 0 && (
          <div
            className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white font-semibold leading-none flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
            style={{
              minWidth: `${badgeMetrics.minWidth}px`,
              height: `${badgeMetrics.height}px`,
              paddingLeft: `${badgeMetrics.paddingX}px`,
              paddingRight: `${badgeMetrics.paddingX}px`,
              fontSize: `${badgeMetrics.fontSize}px`,
            }}
          >
            {formatBadgeCount(badgeCount)}
          </div>
        )}
      </motion.div>
      {tooltip && (
        <motion.div
          className="absolute left-1/2 z-[100] -translate-x-1/2 pointer-events-none"
          style={{ bottom: tooltipBottom }}
        >
          {tooltip}
        </motion.div>
      )}
      <div
        className={cn(
          "relative z-0 rounded-full shrink-0",
          isOpen || showOpenDot ? "bg-black/60 dark:bg-white/60 opacity-100" : "opacity-0"
        )}
        style={{ width: dotSize, height: dotSize, marginTop: DOT_MARGIN }}
      />
    </motion.button>
  );
}
