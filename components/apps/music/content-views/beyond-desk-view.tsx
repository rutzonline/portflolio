"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";
import { BeyondDeskMediaImage } from "../beyond-desk-media-image";
import {
  BEYOND_DESK_SANE_DIR,
  getBeyondDeskSaneSlug,
} from "@/lib/beyond-desk-media";

interface Interest {
  id: string;
  label: string;
  image_url: string;
  category: string;
}

interface BeyondDeskViewProps {
  isMobileView: boolean;
}

function SaneActivityImage({ item }: { item: Interest }) {
  const [failed, setFailed] = useState(false);
  const slug = getBeyondDeskSaneSlug(item.label);

  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-2xl">
        {item.label.charAt(0)}
      </div>
    );
  }

  return (
    <BeyondDeskMediaImage
      basePath={BEYOND_DESK_SANE_DIR}
      localId={slug}
      remoteUrl={item.image_url}
      alt={item.label}
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      showFailedPlaceholder={false}
      onFailed={() => setFailed(true)}
    />
  );
}

export function BeyondDeskView({ isMobileView }: BeyondDeskViewProps) {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInterests() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("beyond_the_desk")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) throw error;
        setInterests(data || []);
      } catch (err) {
        console.error("Failed to fetch interests:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInterests();
  }, []);

  return (
    <ScrollArea className="h-full" bottomMargin="0">
      <div className={cn("p-6", isMobileView && "p-4 pb-20")}>
        <h2 className="text-lg font-semibold mb-1">Things (currently) keeping me sane</h2>
        <p className="text-sm text-muted-foreground mb-6">
          what i do when i'm not corporatemaxxing
        </p>
        {loading ? (
          <div className={cn("grid gap-4", isMobileView ? "grid-cols-2" : "grid-cols-2 desktop:grid-cols-3")}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-video rounded-xl bg-muted animate-pulse" />
                <div className="h-3 w-2/3 mx-auto rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className={cn("grid gap-4", isMobileView ? "grid-cols-2" : "grid-cols-2 desktop:grid-cols-3")}>
            {interests.map((item) => (
              <div key={item.id} className="group flex flex-col">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                  <SaneActivityImage item={item} />
                </div>
                <p className="mt-2 text-xs font-medium text-center truncate px-1">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
