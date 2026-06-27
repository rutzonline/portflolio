"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { SELECTED_WORK_FOLDERS } from "./case-studies/fallback-data";
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
  return (
    <div
      className="flex flex-wrap items-start gap-2 p-4"
      onClick={(e) => e.stopPropagation()}
    >
      {SELECTED_WORK_FOLDERS.map((study) => {
        const isSelected = selectedSlug === study.slug;
        return (
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
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (!isMobileView) onOpenStudy(study);
            }}
            className={cn(
              "flex w-[88px] flex-col items-center gap-1.5 rounded-lg p-2 text-center transition-colors outline-none",
              isSelected
                ? "bg-accent-blue/20 ring-2 ring-accent-blue"
                : "can-hover:hover:bg-zinc-100 dark:can-hover:hover:bg-zinc-800/80"
            )}
          >
            <Image
              src="/file.png"
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
              draggable={false}
            />
            <span
              className={cn(
                "text-sm whitespace-nowrap",
                isSelected
                  ? "font-medium text-accent-blue dark:text-accent-blue"
                  : "text-zinc-700 dark:text-zinc-300"
              )}
            >
              {study.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
