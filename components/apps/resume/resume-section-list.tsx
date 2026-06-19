"use client";

import { cn } from "@/lib/utils";
import type { ResumeListSection } from "./data";

export function ResumeSectionList({
  sections,
  twoColumn = false,
}: {
  sections: ResumeListSection[];
  twoColumn?: boolean;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-background">
      <div
        className={cn(
          twoColumn
            ? "max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
            : "max-w-lg space-y-6"
        )}
      >
        {sections.map((section) => (
          <div key={section.heading || section.items[0]}>
            {section.heading.trim() ? (
              <div className="text-xs text-muted-foreground px-3 py-1 font-semibold uppercase tracking-wide">
                {section.heading}
              </div>
            ) : null}
            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 overflow-hidden">
              {section.items.map((item, idx) => (
                <div
                  key={item}
                  className={cn(
                    "px-4 py-2 text-sm text-zinc-800 dark:text-zinc-100",
                    idx < section.items.length - 1 && "border-b border-zinc-200 dark:border-zinc-700/60"
                  )}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
