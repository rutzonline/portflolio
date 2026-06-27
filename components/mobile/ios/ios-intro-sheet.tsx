"use client";

import { INTRO_README_TABS } from "@/lib/intro-doc-baseline";
import { IntroReadmeContent } from "@/components/apps/textedit/intro-readme-content";
import { cn } from "@/lib/utils";

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

function buildMobileIntroMarkdown(): string {
  const about = INTRO_README_TABS.find((tab) => tab.id === "about")?.content.trim() ?? "";
  const aboutSite = INTRO_README_TABS.find((tab) => tab.id === "about-the-site")?.content.trim() ?? "";

  return [about, MOBILE_NAV_SECTION.trim(), aboutSite].filter(Boolean).join("\n\n---\n\n");
}

interface IosIntroSheetProps {
  onContinue: () => void;
}

export function IosIntroSheet({ onContinue }: IosIntroSheetProps) {
  const introMarkdown = buildMobileIntroMarkdown();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      <div className="shrink-0 border-b border-border/50 px-4 pb-3 pt-[max(env(safe-area-inset-top),12px)]">
        <h1 className="text-[34px] font-bold leading-tight tracking-tight text-foreground">
          readme
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A quick tour before you explore.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <IntroReadmeContent text={introMarkdown} linkAppNames={false} />
      </div>

      <div className="shrink-0 border-t border-border/50 bg-background/90 px-4 py-3 backdrop-blur-xl pb-[max(env(safe-area-inset-bottom),12px)]">
        <button
          type="button"
          onClick={onContinue}
          className={cn(
            "w-full rounded-xl bg-accent-blue py-3 text-[17px] font-semibold text-white",
            "transition-opacity active:opacity-80"
          )}
        >
          Continue to Home
        </button>
      </div>
    </div>
  );
}
