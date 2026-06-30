"use client";

import { cn } from "@/lib/utils";
import {
  IOS_NAV_ACCENT,
  IOS_NAV_BACK_BUTTON_CLASS,
  IOS_NAV_BACK_LABEL_CLASS,
} from "@/lib/ios-nav-back-styles";
import { IosNavChevronBack } from "./ios-nav-chevron-back";

interface IosWindowNavBackProps {
  canGoBack: boolean;
  onBack: () => void;
  backTitle?: string;
  tone?: "accent" | "onAccent";
}

/** WindowNavShell left slot — shared sizing across mobile apps. */
export function IosWindowNavBack({
  canGoBack,
  onBack,
  backTitle,
  tone = "accent",
}: IosWindowNavBackProps) {
  const labelColor = tone === "onAccent" ? "#FFFFFF" : IOS_NAV_ACCENT;

  return (
    <button
      type="button"
      onClick={onBack}
      onMouseDown={(event) => event.stopPropagation()}
      disabled={!canGoBack}
      className={cn(
        IOS_NAV_BACK_BUTTON_CLASS,
        canGoBack ? "active:opacity-70" : "opacity-0 pointer-events-none"
      )}
      style={{ color: labelColor }}
      aria-label="Go back"
    >
      <IosNavChevronBack tone={tone} />
      {backTitle ? (
        <span className={IOS_NAV_BACK_LABEL_CLASS} style={{ color: labelColor }}>
          {backTitle}
        </span>
      ) : null}
    </button>
  );
}
