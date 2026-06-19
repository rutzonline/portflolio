"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface BeyondDeskLocalImageProps {
  localPath: string;
  remoteUrl?: string | null;
  alt: string;
  className?: string;
  onFailed?: () => void;
}

type ImageStage = "local" | "remote" | "failed";

export function BeyondDeskLocalImage({
  localPath,
  remoteUrl,
  alt,
  className,
  onFailed,
}: BeyondDeskLocalImageProps) {
  const [stage, setStage] = useState<ImageStage>("local");

  useEffect(() => {
    setStage("local");
  }, [localPath, remoteUrl]);

  if (stage === "failed") {
    return null;
  }

  const src = stage === "local" ? localPath : remoteUrl!;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      unoptimized
      onError={() => {
        if (stage === "local" && remoteUrl) {
          setStage("remote");
        } else {
          setStage("failed");
          onFailed?.();
        }
      }}
    />
  );
}
