"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Store,
  BarChart2,
  Pin,
  MousePointer2,
  BarChart3,
  PieChart,
  Users,
  Sparkles,
  UserCircle,
  type LucideIcon,
} from "lucide-react";
import { LEARNING_ITEMS, type LearningItemIcon } from "./data";

const LEARNING_ICONS: Record<LearningItemIcon, LucideIcon> = {
  store: Store,
  chart: BarChart2,
  pin: Pin,
  pointer: MousePointer2,
  analytics: BarChart3,
  pie: PieChart,
  users: Users,
  sparkles: Sparkles,
  user: UserCircle,
};

const LEARNING_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

function LearningCardImage({ id, alt }: { id: string; alt: string }) {
  const [extIndex, setExtIndex] = useState(0);

  useEffect(() => {
    setExtIndex(0);
  }, [id]);

  const failed = extIndex >= LEARNING_IMAGE_EXTENSIONS.length;
  const path = `/resume/learning/${id}${LEARNING_IMAGE_EXTENSIONS[extIndex]}`;

  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 text-sm">
        Add {id}.png or {id}.jpg
      </div>
    );
  }

  return (
    <Image
      src={path}
      alt={alt}
      fill
      className="object-cover"
      unoptimized
      onError={() => setExtIndex((i) => i + 1)}
    />
  );
}

export function LearningCardsPanel() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        Certifications & Courses completed
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
        {LEARNING_ITEMS.map((item) => {
          const Icon = LEARNING_ICONS[item.icon];
          return (
            <div
              key={item.id}
              className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800/60"
            >
              <div className="relative aspect-video bg-zinc-200 dark:bg-zinc-700">
                <LearningCardImage id={item.id} alt={item.title} />
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-800 dark:text-zinc-100 border-t border-zinc-200 dark:border-zinc-700/60">
                <Icon className="w-4 h-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                <span className="truncate">{item.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
