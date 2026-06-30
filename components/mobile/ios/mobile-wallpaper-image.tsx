"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface MobileWallpaperImageProps {
  src: string;
  priority?: boolean;
  fetchPriority?: ImageProps["fetchPriority"];
}

/** Full-bleed mobile wallpaper — optimized via next/image, direct public URL on failure. */
export function MobileWallpaperImage({
  src,
  priority,
  fetchPriority,
}: MobileWallpaperImageProps) {
  const [useDirectSrc, setUseDirectSrc] = useState(false);

  if (useDirectSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        decoding="async"
        fetchPriority={priority ? "high" : fetchPriority}
        className="absolute inset-0 h-full w-full transform-gpu object-cover object-center"
      />
    );
  }

  return (
    <Image
      src={src}
      alt=""
      fill
      priority={priority}
      fetchPriority={fetchPriority}
      quality={75}
      className={cn("transform-gpu object-cover object-center")}
      sizes="100vw"
      onError={() => setUseDirectSrc(true)}
    />
  );
}
