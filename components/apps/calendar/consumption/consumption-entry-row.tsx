"use client";

import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConsumptionLog } from "@/types/consumption";
import { getCategoryColor, getCategoryLabel, categoryDotClassName } from "./category-styles";
import { openConsumptionUrl } from "./logs-to-events";

interface ConsumptionEntryRowProps {
  log: ConsumptionLog;
}

export function ConsumptionEntryRow({ log }: ConsumptionEntryRowProps) {
  const color = getCategoryColor(log.category);
  const subtitle = [getCategoryLabel(log.category), log.platform].filter(Boolean).join(" · ");

  return (
    <button
      type="button"
      onClick={() => openConsumptionUrl(log.url)}
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3.5 text-left rounded-lg",
        "can-hover:hover:bg-accent/60 transition-colors group"
      )}
    >
      <span
        className={cn(
          "w-1 self-stretch min-h-[44px] rounded-full shrink-0",
          categoryDotClassName(color)
        )}
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-2">
          <span className="text-base font-medium text-foreground leading-snug">{log.title}</span>
          <ExternalLink className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-50 text-muted-foreground" />
        </span>
        <span className="block text-sm text-muted-foreground mt-1">{subtitle}</span>
      </span>
    </button>
  );
}
