"use client";

import { cn } from "@/lib/utils";
import type { CaseStudy } from "@/types/work";
import { TAG_COLOR_CLASSES } from "./tag-colors";

interface CaseStudyCardProps {
  study: CaseStudy;
  onClick: () => void;
}

export function CaseStudyCard({ study, onClick }: CaseStudyCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-shrink-0 w-[200px] text-left rounded-xl overflow-hidden bg-zinc-800/60 border border-white/8 transition-all can-hover:hover:bg-zinc-700/60 can-hover:hover:border-white/15 can-hover:hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group"
    >
      <div
        className="h-24 relative flex items-end p-3"
        style={{
          background: `linear-gradient(135deg, ${study.gradient_from} 0%, ${study.gradient_to} 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <span className="text-xl drop-shadow-sm relative z-10" aria-hidden>
          {study.icon}
        </span>
        <span className="ml-2 text-xs font-semibold text-white/90 drop-shadow line-clamp-2 relative z-10 leading-snug">
          {study.title}
        </span>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex flex-wrap gap-1">
          {study.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.label}
              className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded-full truncate max-w-[90px]",
                TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.gray
              )}
            >
              {tag.label}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
          {study.description}
        </p>
      </div>
    </button>
  );
}
