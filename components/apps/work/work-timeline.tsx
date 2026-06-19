"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { WORK_LOGOS } from "@/lib/work-logos";
import { ScrollArea } from "@/components/ui/scroll-area";
import { STATE_PLATE_BODY } from "./case-studies/fallback-data";
import { WorkMarkdown } from "./work-markdown";
import { WorkStintHeader } from "./work-stint-header";
import { useWorkStintMedia, WorkStintGallery } from "./work-stint-media";

export interface WorkStint {
  id: string;
  company: string;
  role: string;
  timeline: string;
  summary: string;
  logo?: string;
  type: "work" | "volunteering" | "project";
  /** Bullet highlights — fill in per role later */
  highlights?: string[];
  /** Long-form body — markdown or plain text later */
  details?: string;
}

export const WORK_PAGE_INTRO =
  "marketing & growth associate with 2+ years building multi-channel 0-1 engines across D2C, Fintech, and SaaS in India. AI-native marketer who thrives on learning, experimenting, and scaling across channels.";

export const ALL_WORK_STINTS: WorkStint[] = [
  {
    id: "freelance",
    company: "Freelance",
    role: "Freelance Marketer",
    timeline: "Apr 2025 – Present",
    summary:
      "Strengthened core marketing skills, studied growth experimentation frameworks, learned new tools, and took on projects that kept me engaged. Built lightweight landing pages and fun widgets using no-code tools.",
    type: "work",
    highlights: [
      "Independent projects across F&B, brand strategy, and content",
    ],
    logo: WORK_LOGOS.freelance,
  },
  {
    id: "state-plate",
    company: "The State Plate",
    role: "Marketing and Business Growth Associate",
    timeline: "Jan 2024 – Mar 2025",
    summary:
      "D2C regional Indian food startup · Bangalore. Built 0-1 growth across social, CRM, email, WhatsApp, Meta ads, and in-app engagement.",
    type: "work",
    highlights: [
      "Scaled app downloads from ~150 to 7K in 5 months with zero paid budget; ~20% of daily orders",
      "Drove email open rates from 8–10% to 35.8% across 75K subscribers in 5 months",
      "Redesigned web and app UX — 30% AOV lift (₹808 → ₹1,047) and 8% app conversion",
      "Grew Instagram to 45K followers (5M+ views) and WhatsApp community to 1,000 members",
    ],
    details: STATE_PLATE_BODY,
    logo: WORK_LOGOS["state-plate"],
  },
  {
    id: "hopstack",
    company: "Hopstack",
    role: "SaaS Marketing Generalist Intern",
    timeline: "Jun 2023 – Sept 2023",
    summary:
      "Warehouse management SaaS · Bangalore. Content, SEO, and newsletter ops for a technical B2B audience.",
    type: "work",
    highlights: [
      "Developed research-backed social content on complex warehouse management topics",
      "Managed website CMS, off-page SEO across blogs and landing pages, and newsletter ops on LinkedIn and beehiiv",
    ],
    logo: WORK_LOGOS.hopstack,
  },
  {
    id: "liquide",
    company: "Liquide",
    role: "Social Media Marketing Intern",
    timeline: "Mar 2022 – Jul 2022",
    summary:
      "Fintech startup · Bangalore. Zero-to-one influencer launch and multi-format content for a SEBI-registered investing app.",
    type: "work",
    highlights: [
      "Managed LiMo feature launch with 50+ LinkedIn influencers leading to 100K+ impressions and app download lift",
      "Scripts, website copy, emailers, and push notifications; scaled Instagram from 0 to 12K followers",
    ],
    logo: WORK_LOGOS.liquide,
  },
  {
    id: "kotak-tutor",
    company: "Kotak Education Foundation",
    role: "Tutor",
    timeline: "Jan 2021 – May 2021",
    summary: "Volunteer tutor supporting spoken English skills for underprivileged undergrads.",
    type: "volunteering",
    highlights: [],
  },
  {
    id: "proj-placeholder-1",
    company: " Airth - Air purifying filter for ACs (Featured on Shark Tank India, Season 4)",
    role: "Performance Marketing Strategy",
    timeline: "april 2023",
    summary: "Developed an integrated go-to-market strategy coordinating Google Search, Display, and Meta Ads campaigns; delivered 80K+ impressions, 1.01% CTR, and conversion rate improvement, significantly improving brand visibility and awareness.",
    type: "project",
    highlights: [],
  },
];

const WORK_STINTS = ALL_WORK_STINTS.filter((s) => s.type === "work");
const VOLUNTEERING = ALL_WORK_STINTS.filter((s) => s.type === "volunteering");
const PROJECTS = ALL_WORK_STINTS.filter((s) => s.type === "project");

function StintCard({
  stint,
  onSelect,
}: {
  stint: WorkStint;
  onSelect?: (stint: WorkStint) => void;
}) {
  const navigable = stint.type === "work" && onSelect;

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{stint.role}</p>
          <p className="mt-0.5 text-sm font-medium leading-tight text-zinc-900 dark:text-zinc-100">
            {stint.company}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
            {stint.timeline}
          </span>
          {navigable && (
            <ChevronRight
              className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          )}
        </div>
      </div>
      <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2 leading-relaxed">{stint.summary}</p>
      {(stint.highlights?.length ?? 0) > 0 && (
        <ul className="mt-3 space-y-2 pt-1">
          {stint.highlights!.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  if (!navigable) {
    return (
      <div className="mb-4">
        <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/60 p-4">{content}</div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => onSelect!(stint)}
        className="group w-full text-left rounded-lg bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors p-4"
      >
        {content}
      </button>
    </div>
  );
}

function TimelineSection({
  title,
  stints,
  onSelect,
}: {
  title: string;
  stints: WorkStint[];
  onSelect?: (stint: WorkStint) => void;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 px-1">
        {title}
      </h3>
      <div>
        {stints.map((stint) => (
          <StintCard key={stint.id} stint={stint} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

export function WorkStintDetail({ stint }: { stint: WorkStint }) {
  const hasHighlights = (stint.highlights?.length ?? 0) > 0;
  const hasDetails = Boolean(stint.details?.trim());
  const { media, loading, hasMedia } = useWorkStintMedia(stint.id);

  return (
    <ScrollArea className="h-full" bottomMargin="0">
      <div className="max-w-2xl p-6">
        <WorkStintHeader stint={stint} />

        {hasHighlights && (
          <div className="mb-6">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Highlights
            </h3>
            <ul className="space-y-2">
              {stint.highlights!.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm leading-relaxed text-zinc-300"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/80" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasDetails && <WorkMarkdown markdown={stint.details!} />}

        {loading && !hasDetails && (
          <div className="space-y-4">
            <div className="h-48 rounded-xl bg-zinc-800/40 animate-pulse" />
            <div className="h-48 rounded-xl bg-zinc-800/40 animate-pulse" />
          </div>
        )}

        {hasMedia && (
          <div className={hasDetails ? "mt-8 border-t border-white/10 pt-8" : undefined}>
            <WorkStintGallery media={media!} />
          </div>
        )}

        {!loading && !hasDetails && !hasMedia && (
          <div className="rounded-xl border border-dashed border-white/10 bg-zinc-800/30 px-4 py-8 text-center">
            <p className="text-sm text-zinc-500">More details coming soon.</p>
            <p className="text-xs text-zinc-600 mt-1">
              Add images to <code className="text-zinc-500">public/resume/work/{stint.id}/</code>
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

interface WorkTimelineProps {
  isMobileView?: boolean;
  onSelect?: (stint: WorkStint) => void;
}

export function WorkTimeline({ isMobileView = false, onSelect }: WorkTimelineProps) {
  return (
    <ScrollArea className="h-full" bottomMargin="0">
      <div className={cn("p-6", isMobileView && "p-4 pb-20")}>
        <p className="mb-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {WORK_PAGE_INTRO}
        </p>
        <TimelineSection title="Experience" stints={WORK_STINTS} onSelect={onSelect} />
        <TimelineSection title="Volunteering & Community" stints={VOLUNTEERING} />
        <TimelineSection title="Projects" stints={PROJECTS} />
      </div>
    </ScrollArea>
  );
}
