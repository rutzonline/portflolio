"use client";

import { useAudio } from "@/lib/music/audio-context";
import { useWindowManager } from "@/lib/window-context";
import { cn } from "@/lib/utils";
import { clearNowPlayingDismissed } from "@/lib/onboarding";

function MiniBars({ isPlaying }: { isPlaying: boolean }) {
  return (
    <span className="flex items-end gap-[2px] h-3.5 mr-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "w-[2px] rounded-full bg-black dark:bg-white origin-bottom",
            isPlaying && "animate-pulse"
          )}
          style={{
            height: isPlaying ? `${8 + (i % 2) * 4}px` : "4px",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </span>
  );
}

export function NowPlayingMenuItem() {
  const { playbackState } = useAudio();
  const { openWindow, focusWindow, restoreWindow, getWindow } = useWindowManager();

  const track = playbackState.currentTrack;
  if (!track) return null;

  const handleClick = () => {
    clearNowPlayingDismissed();
    const win = getWindow("now-playing");
    if (!win?.isOpen) {
      openWindow("now-playing");
    } else if (win.isMinimized) {
      restoreWindow("now-playing");
    } else {
      focusWindow("now-playing");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center max-w-[140px] px-2 py-0.5 rounded can-hover:hover:bg-white/10 text-black dark:text-white transition-colors"
      title={`${track.name} — ${track.artist}`}
    >
      <MiniBars isPlaying={playbackState.isPlaying} />
      <span className="text-xs truncate font-medium">{track.name}</span>
    </button>
  );
}
