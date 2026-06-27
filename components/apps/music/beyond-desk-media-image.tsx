"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BeyondDeskFolderImage } from "./beyond-desk-folder-image";

interface BeyondDeskMediaImageProps {
  basePath: string;
  localId: string;
  remoteUrl?: string | null;
  alt: string;
  className?: string;
  onFailed?: () => void;
  showFailedPlaceholder?: boolean;
}

/** Supabase `image_url` when set; otherwise local file in `basePath/{localId}.jpg/png`. */
export function BeyondDeskMediaImage({
  basePath,
  localId,
  remoteUrl,
  alt,
  className,
  onFailed,
  showFailedPlaceholder = false,
}: BeyondDeskMediaImageProps) {
  const hasRemote = Boolean(remoteUrl?.trim());
  const [remoteFailed, setRemoteFailed] = useState(false);

  useEffect(() => {
    setRemoteFailed(false);
  }, [remoteUrl, localId]);

  if (hasRemote && !remoteFailed) {
    return (
      <Image
        src={remoteUrl!}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className={className}
        unoptimized
        onError={() => {
          setRemoteFailed(true);
          if (!localId) onFailed?.();
        }}
      />
    );
  }

  return (
    <BeyondDeskFolderImage
      basePath={basePath}
      id={localId}
      alt={alt}
      className={className}
      onFailed={onFailed}
      showFailedPlaceholder={showFailedPlaceholder}
    />
  );
}
