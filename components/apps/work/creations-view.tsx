"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";
import { ExternalLink, Play } from "lucide-react";

interface Creation {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "link" | "image" | "video" | "embed" | "canva";
  thumbnail_url: string;
  tags: string[];
  created_at: string;
}

const TAG_COLORS: Record<string, string> = {
  "vibe coded": "bg-purple-500/20 text-purple-400",
  canva: "bg-pink-500/20 text-pink-400",
  design: "bg-blue-500/20 text-blue-400",
  video: "bg-red-500/20 text-red-400",
  writing: "bg-yellow-500/20 text-yellow-400",
  marketing: "bg-green-500/20 text-green-400",
};

function tagColor(tag: string) {
  return TAG_COLORS[tag.toLowerCase()] ?? "bg-zinc-500/20 text-zinc-400";
}

function CreationCard({ creation }: { creation: Creation }) {
  const isVideo = creation.type === "video";

  return (
    <a
      href={creation.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl overflow-hidden bg-zinc-800/50 border border-white/8 hover:border-white/15 hover:bg-zinc-800/80 transition-all hover:shadow-xl"
    >
      <div className="relative aspect-video bg-zinc-700/50 overflow-hidden">
        {creation.thumbnail_url ? (
          <Image
            src={creation.thumbnail_url}
            alt={creation.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl text-zinc-600">
              {creation.type === "video"
                ? "▶"
                : creation.type === "canva"
                  ? "✦"
                  : creation.type === "image"
                    ? "◻"
                    : "⊕"}
            </span>
          </div>
        )}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-4 h-4 text-white ml-0.5" />
            </div>
          </div>
        )}
        <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white/80">
          {creation.type}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-zinc-100 line-clamp-1">{creation.title}</p>
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
        </div>
        {creation.description && (
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{creation.description}</p>
        )}
        {creation.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {creation.tags.map((tag) => (
              <span
                key={tag}
                className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", tagColor(tag))}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

interface CreationsViewProps {
  isMobileView?: boolean;
}

export function CreationsView({ isMobileView = false }: CreationsViewProps) {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCreations() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("creations")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setCreations(data || []);
      } catch (err) {
        console.error("Failed to fetch creations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCreations();
  }, []);

  const allTags = Array.from(new Set(creations.flatMap((c) => c.tags || [])));
  const filtered = activeTag
    ? creations.filter((c) => c.tags?.includes(activeTag))
    : creations;

  return (
    <ScrollArea className="h-full" bottomMargin="0">
      <div className={cn("p-6", isMobileView && "p-4 pb-20")}>
        <h2 className="text-lg font-semibold text-zinc-100 mb-1">Creations</h2>
        <p className="text-sm text-zinc-400 mb-4">
          Things I&apos;ve made or vibe-coded or found worth sharing.
        </p>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            <button
              onClick={() => setActiveTag(null)}
              className={cn(
                "text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors",
                activeTag === null
                  ? "bg-zinc-100 dark:bg-zinc-200 text-zinc-900 border-transparent"
                  : "border-white/10 text-zinc-400 hover:border-white/20"
              )}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={cn(
                  "text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors",
                  activeTag === tag
                    ? cn(tagColor(tag), "border-transparent")
                    : "border-white/10 text-zinc-400 hover:border-white/20"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div
            className={cn(
              "grid gap-4",
              isMobileView ? "grid-cols-1" : "grid-cols-2 desktop:grid-cols-3"
            )}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-white/8">
                <div className="aspect-video bg-zinc-700/40 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-32 bg-zinc-700/40 rounded animate-pulse" />
                  <div className="h-3 w-48 bg-zinc-700/40 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-sm">
            {creations.length === 0 ? "Nothing added yet — coming soon." : "No results for this tag."}
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-4",
              isMobileView ? "grid-cols-1" : "grid-cols-2 desktop:grid-cols-3"
            )}
          >
            {filtered.map((creation) => (
              <CreationCard key={creation.id} creation={creation} />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
