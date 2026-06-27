"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SECTION_SUBTEXT_CLASS, DESK_MEDIA_CARD_CLASS } from "@/lib/ui-tokens";
import { ContentFetchError } from "@/components/shared/content-fetch-error";
import { createClient } from "@/utils/supabase/client";
import { BeyondDeskMediaImage } from "../beyond-desk-media-image";
import { ExternalLink } from "lucide-react";
import {
  BEYOND_DESK_CAMPAIGNS_DIR,
  slugifyBeyondDeskName,
} from "@/lib/beyond-desk-media";

interface Campaign {
  id: string;
  slug: string | null;
  title: string;
  brand_name: string;
  description: string;
  image_url: string | null;
  url: string | null;
}

function getCampaignLocalId(campaign: Campaign): string {
  if (campaign.slug?.trim()) return campaign.slug.trim();
  return slugifyBeyondDeskName(campaign.title);
}

interface CampaignsViewProps {
  albums: unknown[];
  isMobileView: boolean;
  isWindowExpanded?: boolean;
}

function CampaignCardImage({ campaign }: { campaign: Campaign }) {
  const [failed, setFailed] = useState(false);
  const localId = getCampaignLocalId(campaign);

  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-muted-foreground">
        {campaign.title.charAt(0)}
      </div>
    );
  }

  return (
    <BeyondDeskMediaImage
      basePath={BEYOND_DESK_CAMPAIGNS_DIR}
      localId={localId}
      remoteUrl={campaign.image_url}
      alt={campaign.title}
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      onFailed={() => setFailed(true)}
    />
  );
}

export function AlbumsView({ isMobileView, isWindowExpanded = false }: CampaignsViewProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("campaigns")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) throw error;
        setCampaigns(data || []);
        setFetchError(null);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
        setFetchError("Couldn't load campaigns. Try refreshing.");
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  const gridClass = cn(
    "grid gap-4",
    isMobileView
      ? "grid-cols-1"
      : isWindowExpanded
        ? "grid-cols-4 max-w-6xl"
        : "grid-cols-2 lg:grid-cols-3 max-w-5xl"
  );

  return (
    <div className={cn("p-6", isMobileView && "p-4 pb-20", isWindowExpanded && "p-8")}>
        <p className={SECTION_SUBTEXT_CLASS}>
          my content marketing hall of fame
        </p>
        {fetchError && <ContentFetchError message={fetchError} />}
        {loading ? (
          <div className={gridClass}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-border/40">
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                <div className="h-16 bg-muted/60 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className={gridClass}>
            {campaigns.map((campaign) => {
              const card = (
                <>
                  <div className="relative aspect-[4/3] bg-muted">
                    <CampaignCardImage campaign={campaign} />
                    {campaign.url?.trim() && (
                      <ExternalLink
                        className="absolute top-2 right-2 w-3.5 h-3.5 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"
                      />
                    )}
                  </div>
                  <div className="p-3 min-w-0">
                    <p className="text-[11px] text-muted-foreground truncate">
                      {campaign.title}
                    </p>
                    {campaign.brand_name?.trim() ? (
                      <p className="text-sm font-medium leading-snug line-clamp-2 mt-0.5">
                        {campaign.brand_name}
                      </p>
                    ) : null}
                    {!isMobileView && campaign.description?.trim() ? (
                      <p className="text-[11px] text-muted-foreground/70 mt-1 line-clamp-2 leading-snug">
                        {campaign.description}
                      </p>
                    ) : null}
                  </div>
                </>
              );

              const className = cn(DESK_MEDIA_CARD_CLASS, "min-w-0 can-hover:hover:bg-muted/70");

              if (campaign.url?.trim()) {
                return (
                  <a
                    key={campaign.id}
                    href={campaign.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {card}
                  </a>
                );
              }

              return (
                <div key={campaign.id} className={className}>
                  {card}
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
