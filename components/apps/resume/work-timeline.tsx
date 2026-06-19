"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ALL_WORK_STINTS, WORK_GROUPS, type WorkStint } from "./data";

interface WorkTimelineProps {
  onSelectionChange?: (hasSelection: boolean) => void;
}

function StintRow({ stint, onClick }: { stint: WorkStint; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 rounded-lg border px-4 py-5 min-h-[88px] text-left transition-colors",
        "border-zinc-300 bg-zinc-200/90 can-hover:hover:bg-zinc-300/90",
        "dark:border-zinc-600/80 dark:bg-zinc-800/90 dark:can-hover:hover:bg-zinc-700/90 dark:can-hover:hover:border-zinc-500"
      )}
    >
      <div
        className="w-14 h-14 shrink-0 rounded-md overflow-hidden flex items-center justify-center text-[10px] font-bold text-black uppercase"
        style={{ backgroundColor: stint.logoUrl ? undefined : (stint.logoColor ?? "#FF6B35") }}
      >
        {stint.logoUrl ? (
          <Image
            src={stint.logoUrl}
            alt=""
            width={56}
            height={56}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          (stint.logoLabel ?? "logo")
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-none mb-1">{stint.role}</p>
        <p className="text-base font-semibold text-zinc-900 dark:text-white leading-tight truncate">
          {stint.company}
        </p>
        <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">{stint.summary}</p>
      </div>
      <p className="text-sm text-zinc-700 dark:text-zinc-200 shrink-0 tabular-nums">{stint.period}</p>
    </button>
  );
}

export function WorkTimeline({ onSelectionChange }: WorkTimelineProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = selectedId ? ALL_WORK_STINTS.find((s) => s.id === selectedId) : null;

  const selectStint = (id: string | null) => {
    setSelectedId(id);
    onSelectionChange?.(id !== null);
  };

  if (selected) {
    return (
      <div className="flex flex-col flex-1 min-h-0 bg-background">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shrink-0 select-none">
          <button
            type="button"
            onClick={() => selectStint(null)}
            className="flex items-center gap-1 text-sm text-blue-500 can-hover:hover:text-blue-600"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            work
          </button>
          <span className="text-sm text-muted-foreground">/</span>
          <span className="text-sm font-medium truncate">{selected.company}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{selected.company}</h2>
            <p className="text-sm text-muted-foreground mt-1">{selected.role}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{selected.period}</p>
            <p className="text-sm leading-relaxed mt-4 text-foreground">{selected.summary}</p>
            <ul className="mt-5 space-y-2">
              {selected.highlights.map((item) => (
                <li
                  key={item}
                  className="text-sm text-foreground pl-3 border-l-2 border-blue-500/50"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-zinc-100 dark:bg-zinc-950">
      <header className="shrink-0 px-5 pt-4 pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
        <h2 className="text-[22px] font-semibold tracking-tight text-zinc-900 dark:text-white">
          work
        </h2>
      </header>
      <div className="flex-1 overflow-y-auto p-5 min-h-0">
      <div className="max-w-4xl mx-auto space-y-8">
        {WORK_GROUPS.map((group) => (
          <div key={group.id}>
            {group.title && (
              <h3 className="text-sm font-medium text-zinc-400 mb-3 px-0.5">{group.title}</h3>
            )}
            <div className="space-y-3">
              {group.stints.map((stint) => (
                <StintRow key={stint.id} stint={stint} onClick={() => selectStint(stint.id)} />
              ))}
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
