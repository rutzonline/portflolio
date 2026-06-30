"use client";

import { INTRO_README_TABS } from "@/lib/intro-doc-baseline";
import { IntroReadmeContent } from "@/components/apps/textedit/intro-readme-content";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const MOBILE_NAV_SECTION = `
**getting around (mobile)**

- **tap an app** on the home screen to open it full screen.
- use the **back chevron** (← Home) in the top left to return to the springboard.
- inside apps like Notes, Messages, or Photos, tap **back** again to return to the list.

**what you can explore**

- **Notes** — thoughts and writing
- **Resume** — work timeline and case studies
- **misc** — marketing curations I love
- **Photos** — pictures and an intro video
- **Calendar** — a log of things I've read, watched, and listened to
- **Messages** — conversations
- **Settings** — appearance and preferences
`;

/** Body markdown with the "hi, i'm rutuja" heading stripped (now in the pinned header). */
function buildMobileIntroBodyMarkdown(): string {
  const aboutRaw = INTRO_README_TABS.find((tab) => tab.id === "about")?.content.trim() ?? "";
  const about = aboutRaw
    .replace(/^>>\s*/, "")
    .replace(/^\*\*hi, i'm rutuja\*\*\s*/i, "")
    .trim();
  const aboutSite =
    INTRO_README_TABS.find((tab) => tab.id === "about-the-site")?.content.trim() ?? "";

  return [about, MOBILE_NAV_SECTION.trim(), aboutSite].filter(Boolean).join("\n\n---\n\n");
}

interface IosIntroSheetProps {
  onContinue: () => void;
}

export function IosIntroSheet({ onContinue }: IosIntroSheetProps) {
  const introBodyMarkdown = buildMobileIntroBodyMarkdown();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Full-viewport dim + light blur backdrop. */}
      <button
        type="button"
        aria-label="Close readme"
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px] dark:bg-black/40"
        onClick={onContinue}
      />

      <div
        className={cn(
          "relative flex max-h-[36vh] w-[82vw] max-w-[380px] min-h-0 translate-x-4 flex-col",
          "overflow-hidden rounded-2xl bg-[#F2F2F2] shadow-2xl dark:bg-background"
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="readme"
      >
        <button
          type="button"
          onClick={onContinue}
          aria-label="Close readme"
          className={cn(
            "absolute right-4 top-4 z-20 h-6 w-6 rounded-full bg-[#0A84FF]",
            "flex items-center justify-center text-white",
            "transition-opacity active:opacity-80"
          )}
        >
          <X className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
        </button>

        {/* Pinned header — stays put while the body scrolls behind it. */}
        <div className="relative z-10 shrink-0 border-b border-black/10 bg-[#F2F2F2] pb-3 pl-4 pr-12 pt-4 dark:border-white/10 dark:bg-background">
          <div className="min-w-0">
            <p className="text-[15px] font-normal leading-snug text-zinc-900 dark:text-zinc-100">
              hi, i&apos;m rutuja
            </p>
            <p className="mt-1 text-[15px] font-bold leading-snug text-zinc-900 dark:text-zinc-100">
              a marketing &amp; growth associate
            </p>
          </div>
        </div>

        {/* Scrollable body — only this region scrolls. */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-3 [&_.readme-markdown]:text-[15px]">
          <IntroReadmeContent text={introBodyMarkdown} linkAppNames={false} />
        </div>
      </div>
    </div>
  );
}
