"use client";

import { cn } from "@/lib/utils";
import type { WorkStint } from "./work-timeline";
import { WorkStintLogo } from "./work-stint-logo";

interface WorkStintHeaderProps {
  stint: WorkStint;
  className?: string;
}

export function WorkStintHeader({ stint, className }: WorkStintHeaderProps) {
  return (
    <header className={cn("mb-6", className)}>
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border",
            stint.logo
              ? "border-white/10 bg-zinc-900"
              : "border-amber-500/30 bg-amber-500/20"
          )}
        >
          {stint.logo ? (
            <WorkStintLogo company={stint.company} logo={stint.logo} />
          ) : (
            <span className="px-1 text-center text-xs font-bold uppercase leading-tight tracking-tight text-amber-400">
              {stint.company
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold leading-tight text-zinc-100">{stint.company}</h2>
          <p className="mt-1 text-sm text-zinc-400">{stint.role}</p>
          <p className="mt-0.5 text-xs tabular-nums text-zinc-500">{stint.timeline}</p>
        </div>
      </div>

      <p className="mt-5 border-b border-white/8 pb-6 text-sm leading-relaxed text-zinc-400">
        {stint.summary}
      </p>
    </header>
  );
}
