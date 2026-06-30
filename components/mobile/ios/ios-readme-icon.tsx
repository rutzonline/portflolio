"use client";

import { cn } from "@/lib/utils";
import { IOS_MOBILE_TOUCH_ACTIVE_CLASS } from "@/lib/ui-tokens";

interface IosReadmeIconProps {
  onOpen: () => void;
  className?: string;
}

/** Springboard readme shortcut — bottom-left above the dock (mobile only). */
export function IosReadmeIcon({ onOpen, className }: IosReadmeIconProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="readme"
      className={cn(
        "flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 select-none touch-manipulation",
        IOS_MOBILE_TOUCH_ACTIVE_CLASS,
        className
      )}
    >
      <span className="flex h-[52px] w-[52px] items-end justify-center">
        <svg
          className="h-[50px] w-[44px] text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.4))]"
          viewBox="0 0 24 28"
          fill="none"
          aria-hidden
        >
          <path
            d="M14 2H6c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"
            fill="white"
            fillOpacity="0.95"
          />
          <path d="M14 2v6h6" fill="white" fillOpacity="0.7" />
          <text
            x="12"
            y="19"
            textAnchor="middle"
            fill="#333"
            fontSize="7"
            fontFamily="system-ui, sans-serif"
            fontWeight="600"
          >
            TXT
          </text>
        </svg>
      </span>
      <span className="w-full max-w-[80px] text-center text-[13px] font-normal leading-[15px] tracking-tight text-white/95">
        readme
      </span>
    </button>
  );
}
