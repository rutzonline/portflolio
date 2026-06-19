"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink } from "lucide-react";
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
}

export function NewslettersView({ isMobileView }: NewslettersViewProps) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("Failed to fetch newsletters:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNewsletters();
  }, []);

  return (
    <ScrollArea className="h-full" bottomMargin="0">
      <div className={cn("p-6", isMobileView && "p-4 pb-20")}>
        <h2 className="text-lg font-semibold mb-6">Newsletters & Blogs</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            {newsletters.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-4 rounded-lg bg-muted/40 border border-border/40 hover:border-border hover:bg-muted/70 transition-all min-w-0 min-h-[5.5rem]"
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
    </ScrollArea>
  );
}
