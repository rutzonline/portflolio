"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { FILE_LIST_ROW_SELECTED_CLASS } from "@/lib/ui-tokens";
import { useCaseStudies } from "./case-studies/use-case-studies";
import type { CaseStudy } from "@/types/work";

interface SelectedWorkFoldersProps {
  onOpenStudy: (study: CaseStudy) => void;
  selectedSlug?: string | null;
  onSelect?: (study: CaseStudy) => void;
  isMobileView?: boolean;
}

export function SelectedWorkFolders({
  onOpenStudy,
  selectedSlug = null,
  onSelect,
  isMobileView = false,
}: SelectedWorkFoldersProps) {
  const { studies, loading, error } = useCaseStudies();

  if (loading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-2 animate-pulse">
            <div className="h-12 w-12 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="px-4 py-6 text-sm text-red-500">{error}</p>;
  }

  if (studies.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
        No case studies yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2 p-4">
      {studies.map((study) => (
        <button
          key={study.id}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (isMobileView) {
              onOpenStudy(study);
              return;
            }
            onSelect?.(study);
          }}
          onDoubleClick={() => {
            if (!isMobileView) onOpenStudy(study);
          }}
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-colors",
            selectedSlug === study.slug && "bg-zinc-200/70 dark:bg-zinc-700/70"
          )}
        >
          <Image
            src="/folder.png"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
            draggable={false}
          />
          <span
            className={cn(
              "line-clamp-2 break-all px-1 text-xs",
              selectedSlug === study.slug
                ? FILE_LIST_ROW_SELECTED_CLASS
                : "text-zinc-700 dark:text-zinc-300"
            )}
          >
            {study.title}
          </span>
        </button>
      ))}
    </div>
  );
}
