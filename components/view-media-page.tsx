"use client";

import { useSearchParams } from "next/navigation";
import { sanitizeSiteMediaUrl } from "@/lib/external-link";

function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|webm)(\?|$)/i.test(url);
}

function isPdfUrl(url: string): boolean {
  return /\.pdf(\?|$)/i.test(url) || url.includes("/api/preview/pdf");
}

export function ViewMediaPage() {
  const searchParams = useSearchParams();
  const url = sanitizeSiteMediaUrl(searchParams.get("url"));

  if (!url) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-950 px-6 text-center text-sm text-zinc-400">
        Invalid or missing media URL.
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-950">
      <div className="flex min-h-0 flex-1 items-center justify-center p-4">
        {isPdfUrl(url) ? (
          <iframe
            src={url}
            title="Document preview"
            className="h-full w-full max-h-dvh border-0 bg-white"
          />
        ) : isVideoUrl(url) ? (
          <video src={url} controls playsInline className="max-h-full max-w-full" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="max-h-full max-w-full object-contain" />
        )}
      </div>
    </div>
  );
}
