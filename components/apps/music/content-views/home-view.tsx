"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
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
}

export function HomeView({ isMobileView }: HomeViewProps) {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("Failed to fetch home content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHome();
  }, []);

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden">
      <div className={cn("p-6", isMobileView && "p-4 pb-20")}>

        {/* Banner */}
        <div className="mb-6">
          <div className="relative rounded-xl overflow-hidden aspect-[21/9] bg-muted">
            {loading ? (
              <div className="w-full h-full bg-muted animate-pulse" />
            ) : content?.banner_image_url ? (
              <>
                <Image
                  src={content.banner_image_url}
                  alt={content.banner_title || "beyond the desk"}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white/70 text-sm font-medium mb-1 uppercase tracking-wider">
                    beyond the desk
                  </p>
                  <h2 className="text-white text-2xl desktop:text-3xl font-bold mb-1">
                    {content.banner_title}
                  </h2>
                  <p className="text-white/60 text-sm">
                    {content.banner_subtitle}
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* About text */}
        <div className="max-w-2xl space-y-4 text-sm text-muted-foreground leading-relaxed">
          {loading ? (
            <>
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            </>
          ) : (
            content?.about_text?.map((para, i) => (
              <p key={i}>{para}</p>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
