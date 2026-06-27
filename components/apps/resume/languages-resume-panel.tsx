"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  RESUME_PANEL_CARD_OVERFLOW_CLASS,
  RESUME_PANEL_ROW_DIVIDER,
} from "./resume-panel-styles";
import { ContentFetchError } from "@/components/shared/content-fetch-error";
import { createClient } from "@/utils/supabase/client";

interface Language {
  id: string;
  name: string;
  level: string;
}

export function LanguagesResumePanel({ embedded = false }: { embedded?: boolean }) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("languages")
          .select("*")
          .order("order_index", { ascending: true });
        if (error) throw error;
        setLanguages(data || []);
        setFetchError(null);
      } catch (err) {
        console.error("Failed to fetch languages:", err);
        setFetchError("Couldn't load languages. Try refreshing.");
      } finally {
        setLoading(false);
      }
    }
    fetchLanguages();
  }, []);

  const content = (
    <div className={embedded ? "" : "max-w-lg"}>
      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 px-1">
        languages
      </div>
      {fetchError && <ContentFetchError message={fetchError} />}
      <div className={RESUME_PANEL_CARD_OVERFLOW_CLASS}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "px-4 py-2 flex justify-between gap-4",
                i < 3 && RESUME_PANEL_ROW_DIVIDER
              )}
            >
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            </div>
          ))
        ) : languages.length === 0 ? (
          <div className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">No languages listed yet.</div>
        ) : (
          languages.map((lang, idx) => (
            <div
              key={lang.id}
              className={cn(
                "px-4 py-2 text-sm flex items-center justify-between gap-4 text-zinc-800 dark:text-zinc-100",
                idx < languages.length - 1 && RESUME_PANEL_ROW_DIVIDER
              )}
            >
              <span>{lang.name}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{lang.level}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-lg space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Languages</h2>
        {content}
      </div>
    </div>
  );
}
