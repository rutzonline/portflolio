"use client";

import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface IosWindowNavBackProps {
  canGoBack: boolean;
  onBack: () => void;
  backTitle?: string;
}

/** WindowNavShell left slot — matches settings mobile back control. */
export function IosWindowNavBack({ canGoBack, onBack, backTitle }: IosWindowNavBackProps) {
  return (
    <button
      type="button"
      onClick={onBack}
      onMouseDown={(event) => event.stopPropagation()}
      disabled={!canGoBack}
      className={cn(
        "flex items-center gap-1 rounded-lg px-2 py-1.5 transition-colors text-accent-blue",
        canGoBack ? "can-hover:hover:bg-muted-foreground/10" : "opacity-0 pointer-events-none"
      )}
      aria-label="Go back"
    >
      <ChevronLeft className="h-7 w-7" />
      {backTitle ? <span className="text-base leading-none">{backTitle}</span> : null}
    </button>
  );
}
