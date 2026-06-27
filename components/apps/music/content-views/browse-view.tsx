"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SECTION_SUBTEXT_CLASS, DESK_MEDIA_CARD_CLASS } from "@/lib/ui-tokens";
import { ContentFetchError } from "@/components/shared/content-fetch-error";
import { createClient } from "@/utils/supabase/client";
import { ExternalLink } from "lucide-react";

interface Website {
  id: string;
  name: string;
  url: string;
  description: string;
  image_url: string;
}

interface BrowseViewProps {
  isMobileView: boolean;
}

function WebsitePreviewImage({ name, imageUrl }: { name: string; imageUrl: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={name}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}

export function BrowseView({ isMobileView }: BrowseViewProps) {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWebsites() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("cool_websites")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) throw error;
        setWebsites(data || []);
        setFetchError(null);
      } catch (err) {
        console.error("Failed to fetch websites:", err);
        setFetchError("Couldn't load websites. Try refreshing.");
      } finally {
        setLoading(false);
      }
    }
    fetchWebsites();
  }, []);

  return (
    <div className={cn("p-6", isMobileView && "p-4 pb-20")}>
        <p className={SECTION_SUBTEXT_CLASS}>
          prime internet real estate
        </p>
        {fetchError && <ContentFetchError message={fetchError} />}
        {loading ? (
          <div className={cn("grid gap-4", isMobileView ? "grid-cols-1" : "grid-cols-2 desktop:grid-cols-3")}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border/50">
                <div className="aspect-video bg-muted animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={cn("grid gap-4", isMobileView ? "grid-cols-1" : "grid-cols-2 desktop:grid-cols-3")}>
            {websites.map((site) => (
              <a
                key={site.id}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className={DESK_MEDIA_CARD_CLASS}
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {site.image_url ? (
                    <WebsitePreviewImage name={site.name} imageUrl={site.image_url} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                      {site.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <p className="text-sm font-medium truncate min-w-0">{site.name}</p>
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        )}
    </div>
  );
}
