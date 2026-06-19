"use client";



import { useState, useEffect } from "react";

import Image from "next/image";

import { BEYOND_DESK_IMAGE_EXTENSIONS } from "@/lib/beyond-desk-media";



interface BeyondDeskFolderImageProps {

  basePath: string;

  id: string;

  alt: string;

  className?: string;

  remoteUrl?: string | null;

  onFailed?: () => void;

  showFailedPlaceholder?: boolean;

}



type ImageStage = "remote" | "local" | "failed";



export function BeyondDeskFolderImage({

  basePath,

  id,

  alt,

  className,

  remoteUrl,

  onFailed,

  showFailedPlaceholder = true,

}: BeyondDeskFolderImageProps) {

  const hasRemote = Boolean(remoteUrl?.trim());

  const [stage, setStage] = useState<ImageStage>(hasRemote ? "remote" : "local");

  const [extIndex, setExtIndex] = useState(0);



  useEffect(() => {

    setStage(hasRemote ? "remote" : "local");

    setExtIndex(0);

  }, [basePath, id, remoteUrl, hasRemote]);



  if (stage === "failed") {

    if (!showFailedPlaceholder) return null;

    return (

      <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-xs px-2 text-center">

        Add {id}.png or {id}.jpg

      </div>

    );

  }



  const localPath = `${basePath}/${id}${BEYOND_DESK_IMAGE_EXTENSIONS[extIndex]}`;

  const src = stage === "remote" ? remoteUrl!.trim() : localPath;



  return (

    <Image

      src={src}

      alt={alt}

      fill

      className={className}

      unoptimized

      onError={() => {

        if (stage === "remote") {

          setStage("local");

          setExtIndex(0);

          return;

        }



        if (extIndex < BEYOND_DESK_IMAGE_EXTENSIONS.length - 1) {

          setExtIndex((i) => i + 1);

        } else {

          setStage("failed");

          onFailed?.();

        }

      }}

    />

  );

}

