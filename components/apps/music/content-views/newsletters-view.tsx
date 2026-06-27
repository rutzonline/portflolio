"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { SECTION_SUBTEXT_CLASS, DESK_TEXT_CARD_CLASS } from "@/lib/ui-tokens";
import { ContentFetchError } from "@/components/shared/content-fetch-error";
import { createClient } from "@/utils/supabase/client";
import { getNewsletterCategoryStyles } from "@/lib/newsletter-category-styles";

interface Newsletter {
  id: string;
  name: string;
  author: string;
  description: string;
  url: string;
  frequency: string;
  category: string;
}

interface NewslettersViewProps {
  isMobileView: boolean;
  isWindowExpanded?: boolean;
}

export function NewslettersView({ isMobileView, isWindowExpanded = false }: NewslettersViewProps) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNewsletters() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("newsletters")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;
        setNewsletters(data || []);
        setFetchError(null);
      } catch (err) {
        console.error("Failed to fetch newsletters:", err);
        setFetchError("Couldn't load newsletters. Try refreshing.");
      } finally {
        setLoading(false);
      }
    }
    fetchNewsletters();
  }, []);

  const gridClass = cn(
    "grid gap-4",
    isMobileView
      ? "grid-cols-1"
      : isWindowExpanded
        ? "grid-cols-3 max-w-5xl"
        : "grid-cols-2 max-w-3xl"
  );

  return (
    <div className={cn("p-6", isMobileView && "p-4 pb-20", isWindowExpanded && "p-8")}>
        <p className={SECTION_SUBTEXT_CLASS}>
          happily subscribed to
        </p>
        {fetchError && <ContentFetchError message={fetchError} />}
        {loading ? (
          <div className={gridClass}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className={gridClass}>
            {newsletters.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(DESK_TEXT_CARD_CLASS, "min-h-[5.5rem]")}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-sm font-medium leading-snug line-clamp-2 min-w-0">
                    {item.name}
                  </p>
                  <ExternalLink
                    className="w-3 h-3 flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                  />
                </div>
                {item.category?.trim() ? (
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 whitespace-nowrap"
                    style={getNewsletterCategoryStyles(item.category)}
                  >
                    {item.category}
                  </span>
                ) : null}
                {!isMobileView && item.description ? (
                  <p className="text-[11px] text-muted-foreground/70 line-clamp-2 leading-snug">
                    {item.description}
                  </p>
                ) : null}
              </a>
            ))}
          </div>
        )}
    </div>
  );
}
