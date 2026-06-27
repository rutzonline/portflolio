"use client";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useWindowExpanded } from "@/lib/use-window-expanded";

export function CalEmbed() {
  const isExpanded = useWindowExpanded();

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-1 flex-col bg-background",
        isExpanded ? "p-2 pb-1" : "p-4"
      )}
    >
      <div
        className={cn(
          "min-h-0 flex-1 overflow-hidden rounded-xl border border-border/80 bg-white/50 backdrop-blur-xl dark:bg-zinc-900/40",
          !isExpanded && "flex items-center justify-center"
        )}
      >
        <iframe
          src={siteConfig.calBookingUrl}
          title="Book a call with Rutuja Rochkari"
          className={cn(
            "w-full border-0",
            isExpanded ? "h-full min-h-0" : "h-full min-h-[480px]"
          )}
          loading="lazy"
          allow="clipboard-write"
        />
      </div>
      <p className="mt-2 shrink-0 text-center text-xs text-muted-foreground">
        <a
          href={siteConfig.calBookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="can-hover:hover:text-accent-blue underline"
        >
          Open in Cal.com if the embed does not load
        </a>
      </p>
    </div>
  );
}
