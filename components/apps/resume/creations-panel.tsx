"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreations } from "./use-creations";
import type { CreationItem } from "./data";

function CreationCard({ item }: { item: CreationItem }) {
  const open = () => window.open(item.url, "_blank", "noopener,noreferrer");

  if (item.kind === "embed") {
    return (
      <div className="rounded-xl border border-border/70 overflow-hidden bg-background shadow-sm">
        <div className="px-3 py-2 border-b border-border/60 flex items-center justify-between gap-2">
          <span className="text-[13px] font-medium truncate">{item.title}</span>
          {item.platform && (
            <span className="text-[10px] text-muted-foreground shrink-0">{item.platform}</span>
          )}
        </div>
        <div className="aspect-video bg-muted/30">
          <iframe
            src={item.url}
            title={item.title}
            className="w-full h-full border-0"
            loading="lazy"
            allow="clipboard-write"
          />
        </div>
      </div>
    );
  }

  if (item.kind === "video") {
    return (
      <button
        type="button"
        onClick={open}
        className="group rounded-xl border border-border/70 overflow-hidden bg-background text-left can-hover:hover:shadow-md transition-shadow w-full"
      >
        <div className="aspect-video bg-zinc-900/90 flex items-center justify-center relative">
          <span className="text-white/90 text-sm font-medium px-3 text-center">{item.title}</span>
          <ExternalLink className="absolute top-2 right-2 w-4 h-4 text-white/60 opacity-0 group-hover:opacity-100" />
        </div>
        <div className="px-3 py-2 text-[12px] text-muted-foreground">{item.platform ?? "Video"}</div>
      </button>
    );
  }

  if (item.kind === "image") {
    const src = item.thumbnail_url ?? item.url;
    return (
      <button
        type="button"
        onClick={open}
        className="group rounded-xl border border-border/70 overflow-hidden bg-background can-hover:hover:shadow-md transition-shadow w-full"
      >
        <div className="relative aspect-[4/3] bg-muted">
          <Image src={src} alt={item.title} fill className="object-cover" unoptimized />
        </div>
        <div className="px-3 py-2 text-[13px] font-medium truncate">{item.title}</div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      className={cn(
        "rounded-xl border border-border/70 px-4 py-3 text-left w-full",
        "bg-background can-hover:hover:bg-accent/40 transition-colors flex items-center gap-2"
      )}
    >
      <span className="text-[13px] font-medium flex-1 truncate">{item.title}</span>
      <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

export function CreationsPanel() {
  const { items, loading } = useCreations();

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading creations…</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-background">
      <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4 max-w-4xl">
        {items.map((item) => (
          <CreationCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
