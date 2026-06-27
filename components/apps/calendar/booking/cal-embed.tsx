"use client";

import { siteConfig } from "@/config/site";

export function CalEmbed() {
  return (
    <div className="flex flex-col flex-1 min-h-0 p-4 bg-background">
      <div className="flex-1 min-h-0 flex items-center justify-center rounded-xl border border-border/80 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xl overflow-hidden">
        <iframe
          src={siteConfig.calBookingUrl}
          title="Book a call with Rutuja Rochkari"
          className="w-full h-full min-h-[480px] border-0"
          style={{ objectFit: "contain" }}
          loading="lazy"
          allow="clipboard-write"
        />
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground shrink-0">
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
