"use client";

import { WindowControls } from "@/components/window-controls";
import { cn } from "@/lib/utils";
import { WindowNavShell, WindowNavSpacer } from "@/components/window-nav-shell";
import { useWindowNavBehavior } from "@/lib/use-window-nav-behavior";
import type { CalendarAppMode } from "@/lib/sidebar-persistence";

interface ConsumptionAppNavProps {
  appMode: CalendarAppMode;
  onAppModeChange: (mode: CalendarAppMode) => void;
  inShell?: boolean;
  isMobile?: boolean;
}

const MODE_OPTIONS: { value: CalendarAppMode; label: string }[] = [
  { value: "consumption", label: "Consumption Log" },
  { value: "booking", label: "Book a call" },
];

export function ConsumptionAppNav({
  appMode,
  onAppModeChange,
  inShell = false,
  isMobile = false,
}: ConsumptionAppNavProps) {
  const nav = useWindowNavBehavior({ isDesktop: inShell, isMobile });

  if (isMobile) {
    return (
      <WindowNavShell
        isMobile={true}
        className="shrink-0 z-10 bg-background"
        onMouseDown={nav.onDragStart}
        left={nav.navLeft}
        right={<WindowNavSpacer isMobile={true} />}
      />
    );
  }

  return (
    <div
      className="px-4 py-2 flex items-center gap-2 sticky top-0 z-[1] select-none bg-muted/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10"
      onMouseDown={nav.onDragStart}
    >
      <WindowControls
        inShell={nav.inShell}
        className="p-2 shrink-0"
        onClose={nav.onClose}
        onMinimize={nav.onMinimize}
        onToggleMaximize={nav.onToggleMaximize}
        isMaximized={nav.isMaximized}
        closeLabel={nav.closeLabel}
      />
      <div className="flex items-center gap-2" onMouseDown={(e) => e.stopPropagation()}>
        <div className="inline-flex rounded-lg border border-border/50 p-0.5 bg-background/40 backdrop-blur-md">
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onAppModeChange(opt.value)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap",
                appMode === opt.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground can-hover:hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
