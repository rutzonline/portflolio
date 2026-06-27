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
  Palette,
  UserCircle,
  type LucideIcon,
} from "lucide-react";
import { LEARNING_ITEMS, type LearningItemIcon } from "./data";
import {
  RESUME_PANEL_CARD_OVERFLOW_CLASS,
  RESUME_PANEL_TOP_DIVIDER,
  RESUME_SECTION_HEADING_CLASS,
  resumePanelScrollClass,
} from "./resume-panel-styles";

const LEARNING_ICONS: Record<LearningItemIcon, LucideIcon> = {
  store: Store,
  chart: BarChart2,
  pin: Pin,
  pointer: MousePointer2,
  analytics: BarChart3,
  pie: PieChart,
  users: Users,
  palette: Palette,
  user: UserCircle,
};

const LEARNING_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

/** Maps LEARNING_ITEMS id → actual filename base in public/resume/learning/ */
const LEARNING_IMAGE_BASENAMES: Record<string, string> = {
  "google-ad-manager": "google-ad-manager",
  "meta-ads-manager": "Meta-Ads-Manager",
  "pinterest-ads-manager": "Pinterest-Ads-Manager",
  "project-management": "Project-Management",
  "google-analytics": "Google-Analytics",
  "data-visualization": "Data-Visualization",
  "consumer-behavior": "Consumer-Behavior",
  "creative-strategy": "Creative-Strategy",
  "consumer-experience": "Consumer-Experience",
};

function LearningCardImage({ id, alt }: { id: string; alt: string }) {
  const [extIndex, setExtIndex] = useState(0);

  useEffect(() => {
    setExtIndex(0);
  }, [id]);

  const basename = LEARNING_IMAGE_BASENAMES[id] ?? id;
  const failed = extIndex >= LEARNING_IMAGE_EXTENSIONS.length;
  const path = `/resume/learning/${basename}${LEARNING_IMAGE_EXTENSIONS[extIndex]}`;

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

export function LearningCardsPanel({ isMobileView = false }: { isMobileView?: boolean }) {
  return (
    <div className={resumePanelScrollClass(isMobileView)}>
      <div className={`${RESUME_SECTION_HEADING_CLASS} mb-6`}>
        certifications &amp; courses
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
        {LEARNING_ITEMS.map((item) => {
          const Icon = LEARNING_ICONS[item.icon];
          return (
            <div
              key={item.id}
              className={RESUME_PANEL_CARD_OVERFLOW_CLASS}
            >
              <div className="relative aspect-video bg-zinc-200/50 dark:bg-zinc-800/40">
                <LearningCardImage id={item.id} alt={item.title} />
              </div>
              <div className={`flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-800 dark:text-zinc-100 ${RESUME_PANEL_TOP_DIVIDER}`}>
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
