"use client";

import { cn } from "@/lib/utils";
import type { CaseStudy } from "@/types/work";
import { WorkMarkdown } from "@/components/apps/work/work-markdown";
import { TAG_COLOR_CLASSES } from "./tag-colors";
import { IOS_MOBILE_READING_TEXT_CLASS } from "@/lib/ui-tokens";

interface CaseStudyDetailProps {
  study: CaseStudy;
  isMobileView?: boolean;
}

export function CaseStudyDetail({ study, isMobileView = false }: CaseStudyDetailProps) {
  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div
        className="h-40 relative flex items-end p-6 shrink-0"
        style={{
          background: `linear-gradient(135deg, ${study.gradient_from} 0%, ${study.gradient_to} 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <span className="text-3xl" aria-hidden>
            {study.icon}
          </span>
          <h1 className="text-xl font-bold text-white mt-2 drop-shadow-md leading-tight">
            {study.title}
          </h1>
          {study.subtitle && (
            <p className="text-sm text-white/70 mt-0.5">{study.subtitle}</p>
          )}
        </div>
      </div>

      <div className="max-w-2xl p-6">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {study.tags.map((tag) => (
            <span
              key={tag.label}
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.gray
              )}
            >
              {tag.label}
            </span>
          ))}
        </div>

        {study.description.trim() ? (
          <p
            className={cn(
              "mb-6 border-b border-zinc-200 pb-6 text-zinc-500 dark:border-zinc-700/60 dark:text-zinc-400",
              isMobileView ? IOS_MOBILE_READING_TEXT_CLASS : "text-sm leading-relaxed"
            )}
          >
            {study.description}
          </p>
        ) : null}

        {study.body.trim() ? (
          <WorkMarkdown markdown={study.body} isMobileView={isMobileView} />
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800/30 px-4 py-10 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Content coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
