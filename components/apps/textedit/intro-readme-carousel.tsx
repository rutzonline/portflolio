"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { INTRO_README_TABS, type IntroReadmeTabId } from "@/lib/intro-doc-baseline";
import { STICKY_NOTE_FOOTER_DIVIDER_CLASS } from "@/components/desktop/sticky-note-styles";
import { IntroReadmeContent } from "./intro-readme-content";

interface IntroReadmeCarouselProps {
  isFocused: boolean;
  onActiveTabChange?: (tabId: IntroReadmeTabId) => void;
  onOpenApp?: (appId: string) => void;
  onOpenTrash?: () => void;
}

export function IntroReadmeCarousel({
  isFocused,
  onActiveTabChange,
  onOpenApp,
  onOpenTrash,
}: IntroReadmeCarouselProps) {
  const [activeId, setActiveId] = useState<IntroReadmeTabId>(INTRO_README_TABS[0].id);
  const activeTab = INTRO_README_TABS.find((tab) => tab.id === activeId) ?? INTRO_README_TABS[0];
  const activeIndex = INTRO_README_TABS.findIndex((tab) => tab.id === activeId);

  const goToIndex = useCallback((index: number) => {
    const tab = INTRO_README_TABS[index];
    if (tab) setActiveId(tab.id);
  }, []);

  useEffect(() => {
    onActiveTabChange?.(activeId);
  }, [activeId, onActiveTabChange]);

  useEffect(() => {
    if (!isFocused) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToIndex(Math.max(0, activeIndex - 1));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToIndex(Math.min(INTRO_README_TABS.length - 1, activeIndex + 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFocused, activeIndex, goToIndex]);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto bg-zinc-950 px-4 py-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
        <IntroReadmeContent
          text={activeTab.content}
          linkAppNames={activeId === "the-site"}
          onOpenApp={onOpenApp}
          onOpenTrash={onOpenTrash}
        />
      </div>

      <div className={cn(STICKY_NOTE_FOOTER_DIVIDER_CLASS, "px-3 pt-2.5 pb-1.5")}>
        <div className="flex items-center justify-center gap-1.5">
          {INTRO_README_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveId(tab.id)}
              aria-current={tab.id === activeId ? "true" : undefined}
              className={cn(
                "rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors",
                tab.id === activeId
                  ? "bg-white/12 text-zinc-100"
                  : "text-zinc-500 can-hover:hover:text-zinc-300 can-hover:hover:bg-white/5"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
