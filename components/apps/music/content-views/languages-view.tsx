"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";

interface Language {
  id: string;
  name: string;
  level: string;
  order_index: number;
}

interface LanguagesViewProps {
  isMobileView: boolean;
}

export function LanguagesView({ isMobileView }: LanguagesViewProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("Failed to fetch languages:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLanguages();
  }, []);

  return (
    <ScrollArea className="h-full" bottomMargin="0">
      <div className={cn("p-6", isMobileView && "p-4 pb-20")}>
        <h2 className="text-lg font-semibold mb-1">Languages I know</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Human languages, not programming ones.
        </p>
        <div className="border-t border-border pt-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-border/50">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-0">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full border border-muted-foreground inline-block flex-shrink-0" />
                    <span className="text-sm font-medium">{lang.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{lang.level}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
