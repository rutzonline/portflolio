"use client";

import { Filter, ArrowUpDown, Search } from "lucide-react";
import { CaseStudyCard } from "./case-study-card";
import { useCaseStudies } from "./use-case-studies";
import type { CaseStudy } from "@/types/work";

interface CaseStudyGridProps {
  onSelect: (study: CaseStudy) => void;
}

export function CaseStudyGrid({ onSelect }: CaseStudyGridProps) {
  const { studies, loading, error } = useCaseStudies();

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-700/60 shrink-0">
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Selected Work
        </p>
        <div className="flex items-center gap-1 text-zinc-400">
          <button
            type="button"
            className="p-1.5 rounded-md can-hover:hover:bg-zinc-100 dark:can-hover:hover:bg-zinc-700/60 transition-colors"
            aria-label="Filter"
          >
            <Filter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-md can-hover:hover:bg-zinc-100 dark:can-hover:hover:bg-zinc-700/60 transition-colors"
            aria-label="Sort"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-md can-hover:hover:bg-zinc-100 dark:can-hover:hover:bg-zinc-700/60 transition-colors"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 py-4 min-h-0">
        {loading && (
          <div className="flex gap-3 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[200px] h-[190px] rounded-xl bg-zinc-700/40" />
            ))}
          </div>
        )}
        {error && <p className="text-sm text-red-400 px-2">{error}</p>}
        {!loading && !error && studies.length === 0 && (
          <p className="text-sm text-zinc-500 px-2">No case studies yet.</p>
        )}
        {!loading && studies.length > 0 && (
          <div className="flex gap-3 pb-2 h-full items-start">
            {studies.map((study) => (
              <CaseStudyCard key={study.id} study={study} onClick={() => onSelect(study)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
