"use client";

import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Photo } from "@/types/photos";
import { ChevronLeft, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWindowFocus } from "@/lib/window-focus-context";
import { toZonedTime } from "date-fns-tz";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { getViewerUrl } from "@/lib/photos/image-utils";
import { getPhotoAlt } from "@/lib/photos/photo-alt";

function isVideo(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.endsWith(".mp4") || lower.endsWith(".mov");
}

interface PhotoViewerProps {
  photo: Photo;
  photos: Photo[];
  currentIndex: number;
  totalPhotos: number;
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleFavorite?: (photoId: string) => void;
  isMobileView: boolean;
  isDesktop?: boolean;
}

export function PhotoViewer({
  photo,
  currentIndex,
  totalPhotos,
  onBack,
  onPrevious,
  onNext,
  onToggleFavorite,
  isMobileView,
  isDesktop = false,
}: PhotoViewerProps) {
  const windowFocus = useWindowFocus();
  const [imageFailed, setImageFailed] = useState(false);
  const inShell = isDesktop && windowFocus;
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [photo.id]);

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (isSwiping && e.cancelable) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventDefault);
    };
  }, [isSwiping]);

  const swipeHandlers = useSwipeable({
    onSwipeStart: () => setIsSwiping(true),
    onSwiped: () => setIsSwiping(false),
    onSwipedLeft: () => onNext(),
    onSwipedRight: () => onPrevious(),
    trackMouse: false,
    delta: 50,
    preventScrollOnSwipe: true,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const photosApp = document.querySelector('[data-app="photos"]');
      if (!photosApp?.contains(document.activeElement) && document.activeElement !== photosApp) {
        return;
      }

      if (e.key === "ArrowLeft") {
        onPrevious();
      } else if (e.key === "ArrowRight") {
        onNext();
      } else if (e.key === "Escape") {
        onBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPrevious, onNext, onBack]);

  const pstDate = toZonedTime(parseISO(photo.timestamp), "America/Los_Angeles");
  const formattedDate = format(pstDate, "MMMM d, yyyy 'at' h:mm:ss a");

  return (
    <div className="h-full flex flex-col bg-background">
      <div
        className={cn(
          "px-4 py-3 flex items-center justify-between border-b dark:border-foreground/20 select-none",
          isMobileView ? "bg-background" : "bg-muted/50"
        )}
        onMouseDown={inShell && !isMobileView ? windowFocus.onDragStart : undefined}
      >
        <button
          onClick={onBack}
          onMouseDown={(e) => e.stopPropagation()}
          className="flex items-center -ml-2"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>

        <div className="text-center">
          <p className="text-sm font-medium">{formattedDate}</p>
          <p className="text-xs text-muted-foreground">
            {currentIndex + 1} of {totalPhotos}
          </p>
        </div>

        <button
          onClick={() => onToggleFavorite?.(photo.id)}
          onMouseDown={(e) => e.stopPropagation()}
          className="p-1 -mr-1"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors text-foreground",
              photo.isFavorite && "fill-foreground"
            )}
          />
        </button>
      </div>

      <div
        {...swipeHandlers}
        className="flex-1 flex items-center justify-center min-h-0 bg-muted/30"
      >
        <div className="relative w-full h-full">
          {isVideo(photo.url) ? (
            <video
              key={photo.id}
              src={photo.url}
              controls
              playsInline
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : imageFailed ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
              <p>Couldn&apos;t load this photo.</p>
              <button
                type="button"
                className="text-accent-blue underline can-hover:hover:opacity-80"
                onClick={() => setImageFailed(false)}
              >
                Try again
              </button>
            </div>
          ) : (
            <Image
              key={photo.id}
              src={getViewerUrl(photo.url)}
              alt={getPhotoAlt(photo)}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
              unoptimized
              onError={() => setImageFailed(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
