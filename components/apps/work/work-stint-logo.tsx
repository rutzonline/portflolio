"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface WorkStintLogoProps {
  company: string;
  logo: string;
  className?: string;
}

export function WorkStintLogo({ company, logo, className }: WorkStintLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="px-1 text-center text-xs font-bold uppercase leading-tight tracking-tight text-amber-400">
        {company
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")}
      </span>
    );
  }

  return (
    <Image
      src={logo}
      alt={`${company} logo`}
      width={56}
      height={56}
      className={cn("h-full w-full object-contain", className)}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
