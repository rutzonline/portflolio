import React from "react";
import { IOS_MOBILE_TOUCH_ACTIVE_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

interface SwipeActionButtonProps {
  onClick: () => void;
  bgColor: string;
  children: React.ReactNode;
}

export function SwipeActionButton({
  onClick,
  bgColor,
  children,
}: SwipeActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        bgColor,
        "text-white h-full w-16 flex items-center justify-center",
        IOS_MOBILE_TOUCH_ACTIVE_CLASS
      )}
    >
      {children}
    </button>
  );
}

interface SwipeActionsContainerProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export function SwipeActionsContainer({
  isOpen,
  children,
}: SwipeActionsContainerProps) {
  return (
    <div
      className={`absolute top-0 right-0 h-full flex items-center transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {children}
    </div>
  );
}
