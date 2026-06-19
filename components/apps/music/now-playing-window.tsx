"use client";

import Image from "next/image";
import { useAudio } from "@/lib/music/audio-context";
import { useWindowNavBehavior } from "@/lib/use-window-nav-behavior";
import { WindowControls } from "@/components/window-controls";
import { cn } from "@/lib/utils";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { formatDuration } from "@/lib/music/utils";
import { DEFAULT_TRACK } from "@/components/apps/music/data";

export function NowPlayingWindow() {
  const { playbackState, pause, resume, play, next, previous, seek, setVolume } = useAudio();
  const nav = useWindowNavBehavior({ isDesktop: true, isMobile: false, allowStandaloneClose: false });

  const { currentTrack, isPlaying, progress, volume, duration, queue, queueIndex, repeatMode } = playbackState;

  const canNavigate = queue.length > 1;
  const canGoPrevious = canNavigate && queueIndex > 0;
  const canGoNext = canNavigate && (queueIndex < queue.length - 1 || repeatMode === "all");
  const currentTime = Math.floor(progress * duration);
  const displayTrack = currentTrack || DEFAULT_TRACK;

  if (!displayTrack) return null;

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (currentTrack) {
      resume();
    } else {
      play(DEFAULT_TRACK, [DEFAULT_TRACK]);
    }
  };

  const handleVolumeToggle = () => setVolume(volume > 0 ? 0 : 1);

  return (
    <div
      className="flex flex-col h-full bg-zinc-900 text-white rounded-xl overflow-hidden"
      onMouseDown={nav.onDragStart}
    >
      {/* Window controls — always visible at top */}
      <div className="flex items-center px-3 pt-3 pb-1 shrink-0">
        <WindowControls
          inShell={nav.inShell}
          showWhenNotInShell={true}
          className=""
          onClose={nav.onClose}
          onMinimize={nav.onMinimize}
          onToggleMaximize={nav.onToggleMaximize}
          isMaximized={nav.isMaximized}
          closeLabel={nav.closeLabel}
        />
      </div>

      <div
        className="flex-1 flex flex-col min-h-0 px-4"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Cover art — centered in upper flex space */}
        <div className="flex-1 flex items-center justify-center min-h-0 py-3">
          <div className="relative w-full max-w-[220px] max-h-[220px] aspect-square rounded-xl overflow-hidden bg-zinc-800 shadow-2xl">
            <Image
              src={displayTrack.albumArt}
              alt={displayTrack.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>

        {/* Track info + controls — anchored to bottom */}
        <div className="shrink-0 flex flex-col gap-4 pb-5">
          <div className="space-y-1">
            <p className="text-sm font-semibold truncate leading-tight">{displayTrack.name}</p>
            <p className="text-xs text-white/60 truncate">{displayTrack.artist}</p>
          </div>

          <div className="space-y-2">
            <Slider
              value={[progress * 100]}
              max={100}
              step={0.1}
              onValueChange={([value]) => seek(value / 100)}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-white/40 tabular-nums px-0.5">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 py-1">
            <button
              onClick={previous}
              disabled={!canGoPrevious}
              className={cn("transition-opacity", canGoPrevious ? "opacity-100" : "opacity-30 cursor-not-allowed")}
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={handlePlayPause}
              className="w-11 h-11 rounded-full bg-white text-zinc-900 flex items-center justify-center hover:bg-white/90 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button
              onClick={next}
              disabled={!canGoNext}
              className={cn("transition-opacity", canGoNext ? "opacity-100" : "opacity-30 cursor-not-allowed")}
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button onClick={handleVolumeToggle} className="text-white/60 hover:text-white transition-colors shrink-0">
              {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={([value]) => setVolume(value / 100)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
