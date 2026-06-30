"use client";

import Image from "next/image";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudio } from "@/lib/music/audio-context";
import { DEFAULT_TRACK } from "@/components/apps/music/data";

const moduleCardClass = "rounded-2xl bg-black/5 dark:bg-white/10";

/** Inline now playing — uses `useAudio()` only; no desktop window. */
export function ControlCenterNowPlaying({ className }: { className?: string }) {
  const { playbackState, pause, resume, play, next, previous } = useAudio();

  const displayTrack = playbackState.currentTrack || DEFAULT_TRACK;
  const isPlaying = playbackState.isPlaying;
  const hasCurrentTrack = !!playbackState.currentTrack;

  const canNavigate = playbackState.queue.length > 1;
  const canGoPrevious = canNavigate && playbackState.queueIndex > 0;
  const canGoNext =
    canNavigate &&
    (playbackState.queueIndex < playbackState.queue.length - 1 ||
      playbackState.repeatMode === "all");

  return (
    <div className={cn(moduleCardClass, "p-3", className)}>
      <div className="flex items-center gap-2.5">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image
            src={displayTrack.albumArt}
            alt={displayTrack.album}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{displayTrack.name}</p>
          <p className="truncate text-xs text-muted-foreground">{displayTrack.artist}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={previous}
          disabled={!canGoPrevious}
          className={cn(
            "rounded p-1 transition-colors",
            canGoPrevious
              ? "text-muted-foreground can-hover:hover:text-foreground"
              : "cursor-not-allowed text-muted-foreground/30"
          )}
          aria-label="Previous track"
        >
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (isPlaying) {
              pause();
            } else if (hasCurrentTrack) {
              resume();
            } else {
              play(DEFAULT_TRACK, [DEFAULT_TRACK]);
            }
          }}
          className="rounded p-1 text-foreground transition-colors can-hover:hover:text-foreground/80"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={next}
          disabled={!canGoNext}
          className={cn(
            "rounded p-1 transition-colors",
            canGoNext
              ? "text-muted-foreground can-hover:hover:text-foreground"
              : "cursor-not-allowed text-muted-foreground/30"
          )}
          aria-label="Next track"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
