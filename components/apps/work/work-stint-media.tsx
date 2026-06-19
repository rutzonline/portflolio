"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface WorkStintMediaItem {
  url: string;
  type: string;
  name: string;
}

function mediaLabel(name: string): string {
  const base = name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
  if (base.toLowerCase() === "before") return "Before";
  if (base.toLowerCase() === "after") return "After";
  return base;
}

function isComparisonPair(media: WorkStintMediaItem[]): WorkStintMediaItem[] | null {
  const before = media.find((m) => m.name.toLowerCase().startsWith("before."));
  const after = media.find((m) => m.name.toLowerCase().startsWith("after."));
  if (!before || !after) return null;
  return [before, after];
}

function MediaImage({ item, className }: { item: WorkStintMediaItem; className?: string }) {
  return (
    <Image
      src={item.url}
      alt={mediaLabel(item.name)}
      width={1200}
      height={675}
      className={cn("w-full h-auto object-contain", className)}
      unoptimized
    />
  );
}

export function WorkStintGallery({ media }: { media: WorkStintMediaItem[] }) {
  const pair = isComparisonPair(media);
  const rest = pair
    ? media.filter(
        (m) =>
          !m.name.toLowerCase().startsWith("before.") &&
          !m.name.toLowerCase().startsWith("after.")
      )
    : media;

  return (
    <div className="space-y-6">
      {pair && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pair.map((item) => (
            <figure key={item.url} className="space-y-2">
              <figcaption className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                {mediaLabel(item.name)}
              </figcaption>
              <div className="rounded-xl overflow-hidden border border-white/5 bg-zinc-800/40">
                <MediaImage item={item} />
              </div>
            </figure>
          ))}
        </div>
      )}

      {rest.map((item) => {
        if (item.type === "video") {
          return (
            <figure key={item.url} className="space-y-2">
              <div className="rounded-xl overflow-hidden border border-white/5 bg-zinc-800/40">
                <video src={item.url} controls className="w-full h-auto" playsInline>
                  <track kind="captions" />
                </video>
              </div>
            </figure>
          );
        }

        return (
          <figure key={item.url}>
            <div className="rounded-xl overflow-hidden border border-white/5 bg-zinc-800/40">
              <MediaImage item={item} />
            </div>
          </figure>
        );
      })}
    </div>
  );
}

export function useWorkStintMedia(stintId: string) {
  const [media, setMedia] = useState<WorkStintMediaItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setMedia(null);

    fetch(`/api/resume-work-media/${stintId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setMedia(data.media ?? []);
      })
      .catch(() => {
        if (!cancelled) setMedia([]);
      });

    return () => {
      cancelled = true;
    };
  }, [stintId]);

  return {
    media,
    loading: media === null,
    hasMedia: (media?.length ?? 0) > 0,
  };
}
