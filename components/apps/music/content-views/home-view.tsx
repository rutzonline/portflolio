"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SECTION_SUBTEXT_CLASS } from "@/lib/ui-tokens";
import { ContentFetchError } from "@/components/shared/content-fetch-error";
import { createClient } from "@/utils/supabase/client";

interface HomeContent {
  banner_image_url: string;
  banner_title: string;
  banner_subtitle: string;
  about_text: string[];
}

interface HomeViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  playlists: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  songs: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPlaylistSelect: (id: string) => void;
  isMobileView: boolean;
  isWindowExpanded?: boolean;
}

export function HomeView({ isMobileView, isWindowExpanded = false }: HomeViewProps) {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHome() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("misc_home")
          .select("*")
          .limit(1)
          .single();
        if (error) throw error;
        setContent(data);
        setFetchError(null);
      } catch (err) {
        console.error("Failed to fetch home content:", err);
        setFetchError("Couldn't load home content. Try refreshing.");
      } finally {
        setLoading(false);
      }
    }
    fetchHome();
  }, []);

  const banner = (
    <div className={cn("relative overflow-hidden rounded-xl bg-muted", isWindowExpanded ? "aspect-[16/10]" : "aspect-[21/9]")}>
      {loading ? (
        <div className="h-full w-full animate-pulse bg-muted" />
      ) : content?.banner_image_url ? (
        <>
          <Image
            src={content.banner_image_url}
            alt={content.banner_title || "beyond the desk"}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className={cn("absolute bottom-0 left-0 right-0", isWindowExpanded ? "p-8" : "p-6")}>
            <h2
              className={cn(
                "mb-1 font-bold text-white",
                isWindowExpanded ? "text-3xl" : "text-2xl desktop:text-3xl"
              )}
            >
              {content.banner_title}
            </h2>
            <p className={cn("text-white/60", isWindowExpanded ? "max-w-xl text-base" : "text-sm")}>
              {content.banner_subtitle}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );

  const about = (
    <div
      className={cn(
        "space-y-4 leading-relaxed text-muted-foreground",
        isWindowExpanded ? "max-w-none text-base" : "max-w-2xl text-sm"
      )}
    >
      {loading ? (
        <>
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        </>
      ) : (
        content?.about_text?.map((para, i) => <p key={i}>{para}</p>)
      )}
    </div>
  );

  return (
    <div className="overflow-x-hidden">
      <div className={cn("p-6", isMobileView && "p-4 pb-20", isWindowExpanded && "p-8")}>
        <p className={SECTION_SUBTEXT_CLASS}>beyond the desk</p>
        {fetchError && <ContentFetchError message={fetchError} />}

        {isWindowExpanded && !isMobileView ? (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div>{banner}</div>
            <div className="pt-1">{about}</div>
          </div>
        ) : (
          <>
            <div className="mb-6">{banner}</div>
            {about}
          </>
        )}
      </div>
    </div>
  );
}
