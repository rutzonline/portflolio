import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  IOS_MOBILE_NAV_BAR_CLASS,
  IOS_MOBILE_NAV_SIDE_RIGHT_CLASS,
} from "@/lib/ios-nav-back-styles";

interface WindowNavShellProps {
  isMobile: boolean;
  isScrolled?: boolean;
  className?: string;
  onMouseDown?: MouseEventHandler<HTMLDivElement>;
  left: ReactNode;
  center?: ReactNode;
  centerClassName?: string;
  right?: ReactNode;
}

export function WindowNavShell({
  isMobile,
  isScrolled = false,
  className,
  onMouseDown,
  left,
  center,
  centerClassName,
  right,
}: WindowNavShellProps) {
  if (isMobile) {
    return (
      <div
        className={cn(IOS_MOBILE_NAV_BAR_CLASS, "sticky top-0", className)}
        onMouseDown={onMouseDown}
      >
        <div className="relative flex h-12 w-full items-center justify-between">
          <div className="z-[1] flex shrink-0 items-center">{left}</div>
          <div className={cn("z-[1] flex shrink-0 items-center", IOS_MOBILE_NAV_SIDE_RIGHT_CLASS)}>
            {right}
          </div>
          {center ? (
            <div
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center px-16",
                centerClassName
              )}
            >
              {center}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "px-4 py-2 flex items-center sticky top-0 z-[1] select-none bg-muted",
        isScrolled && "border-b shadow-[0_2px_4px_-1px_rgba(0,0,0,0.15)]",
        className
      )}
      onMouseDown={onMouseDown}
    >
      <div className="shrink-0">{left}</div>
      {center ? (
        <div className={cn("flex-1 min-w-0", centerClassName)}>{center}</div>
      ) : (
        <div className="flex-1" />
      )}
      <div className="shrink-0">{right}</div>
    </div>
  );
}

export function WindowNavSpacer({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={cn("desktop:p-2 rounded-lg", isMobile && "h-12 w-12")}>
        <div className={cn(isMobile ? "h-[24px] w-[24px]" : "w-4 h-4")} />
      </div>
    </div>
  );
}
