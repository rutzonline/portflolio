"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getThumbnailUrl } from "@/lib/photos/image-utils";

interface PhotoThumbnailProps {
  url: string;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function PhotoThumbnail({
  url,
  alt = "Photo",
  className,
  sizes = "(max-width: 768px) 33vw, 16vw",
  priority = false,
}: PhotoThumbnailProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={cn("absolute inset-0 flex items-center justify-center bg-muted text-xs text-muted-foreground", className)}>
        —
      </div>
    );
  }

  return (
    <Image
      src={getThumbnailUrl(url)}
      alt={alt}
      fill
      className={cn("object-cover", className)}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      onError={() => setFailed(true)}
    />
  );
}
