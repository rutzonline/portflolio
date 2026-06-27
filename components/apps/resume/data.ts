import type { ConsumptionCategory } from "@/types/consumption";
import { WORK_LOGOS } from "@/lib/work-logos";

export type ResumeSectionId =
  | "work"
  | "skills"
  | "education"
  | "tools"
  | "certifications"
  | "creations";

export interface WorkStint {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  logoLabel?: string;
  logoColor?: string;
  /** PNG/SVG under /public, e.g. `/resume/logos/liquide.png` */
  logoUrl?: string;
  location?: string;
  highlights: string[];
}

export interface WorkGroup {
  id: string;
  title?: string;
  stints: WorkStint[];
}

export interface ResumeListSection {
  heading: string;
  items: string[];
}

export interface CreationItem {
  id: string;
  title: string;
  kind: "video" | "image" | "embed" | "link";
  url: string;
  thumbnail_url?: string | null;
  platform?: string | null;
}

export const RESUME_SIDEBAR: { id: ResumeSectionId; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "tools", label: "Tools & Stack" },
  { id: "certifications", label: "Certifications" },
  { id: "creations", label: "Creations" },
];

const EXPERIENCE_STINTS: WorkStint[] = [
  {
    id: "liquide",
    company: "Liquide",
    role: "Growth & Marketing",
    period: "2024 – present",
    summary: "Lifecycle, CRM, and performance marketing for a SEBI-registered investing platform.",
    logoUrl: WORK_LOGOS.liquide,
    logoLabel: "LQ",
    logoColor: "#FF6B35",
    highlights: [
      "Built retention loops across push, email, and in-app journeys",
      "Ran paid social experiments with creative iteration cadences",
      "Partnered with product on onboarding and activation metrics",
    ],
  },
  {
    id: "hopstack",
    company: "Hopstack",
    role: "Marketing",
    period: "2023 – 2024",
    summary: "Positioning, content, and demand gen for warehouse management SaaS.",
    logoUrl: WORK_LOGOS.hopstack,
    logoLabel: "HS",
    logoColor: "#FF6B35",
    highlights: [
      "Owned website messaging and sales-enablement collateral",
      "Launched newsletter and LinkedIn content engine",
      "Supported founder-led outbound with ICP research",
    ],
  },
  {
    id: "state-plate",
    company: "The State Plate",
    role: "Growth & Brand",
    period: "2022 – 2023",
    summary: "Community, partnerships, and launch campaigns for a Shark Tank India D2C brand.",
    logoUrl: WORK_LOGOS["state-plate"],
    logoLabel: "SP",
    logoColor: "#FF6B35",
    highlights: [
      "Scaled Instagram and UGC programs for regional storytelling",
      "Coordinated offline tastings and influencer collaborations",
      "Ran email flows for launches and seasonal drops",
    ],
  },
  {
    id: "fampay",
    company: "FamPay",
    role: "Copy Intern",
    period: "2021",
    summary: "Brand copy, social experiments, and youth-focused messaging for a teen payments app.",
    logoLabel: "FP",
    logoColor: "#FF6B35",
    highlights: [
      "Drafted in-app microcopy and notification variants",
      "Supported Instagram and YouTube content calendars",
      "Collaborated with design on campaign landing pages",
    ],
  },
];

const VOLUNTEER_STINTS: WorkStint[] = [
  {
    id: "flame-comm",
    company: "FLAME University — Communications Club",
    role: "Core Member",
    period: "2022 – 2023",
    summary: "Campus storytelling, event promos, and peer-led content reviews.",
    logoLabel: "FC",
    logoColor: "#FF6B35",
    highlights: ["Co-led workshop series on personal branding for students"],
  },
  {
    id: "open-mic",
    company: "Community Open Mic Series",
    role: "Volunteer Producer",
    period: "2021 – 2022",
    summary: "Curated lineups and ran social promos for monthly arts nights.",
    logoLabel: "OM",
    logoColor: "#FF6B35",
    highlights: ["Managed Instagram reels and recap posts for each event"],
  },
  {
    id: "ngo-content",
    company: "Local NGO — Digital Literacy",
    role: "Content Volunteer",
    period: "2020 – 2021",
    summary: "Simplified guides and WhatsApp creatives for neighborhood outreach.",
    logoLabel: "NG",
    logoColor: "#FF6B35",
    highlights: ["Drafted bilingual FAQ sheets for first-time smartphone users"],
  },
];

export const WORK_GROUPS: WorkGroup[] = [
  { id: "experience", stints: EXPERIENCE_STINTS },
  { id: "volunteer", title: "volunteering & community", stints: VOLUNTEER_STINTS },
];

/** Flat list for detail lookup */
export const ALL_WORK_STINTS: WorkStint[] = WORK_GROUPS.flatMap((g) => g.stints);

export const SKILLS_SECTIONS: ResumeListSection[] = [
  {
    heading: "Growth Marketing",
    items: [
      "SEO",
      "Content Marketing",
      "Email Marketing",
      "Paid Social",
      "App Store Optimization",
      "Community Building",
    ],
  },
  {
    heading: "Product Marketing",
    items: ["GTM Strategy", "Positioning", "Messaging", "Launch Planning", "Competitive Analysis"],
  },
  {
    heading: "Analytics",
    items: ["GA4", "Mixpanel", "Amplitude", "Hotjar"],
  },
  {
    heading: "Lifecycle",
    items: ["CRM", "Push Notifications", "Retention Loops"],
  },
];

export const EDUCATION_SECTIONS: ResumeListSection[] = [
  {
    heading: "education",
    items: ["flame university"],
  },
  {
    heading: "major",
    items: ["digital marketing and communications"],
  },
  {
    heading: "minor",
    items: ["open (design, theatre, dance, advertising et al)"],
  },
  {
    heading: "courses",
    items: ["data driven marketing", "digital futures"],
  },
  {
    heading: "clubs",
    items: ["photography & yearbook committee"],
  },
  {
    heading: "sports",
    items: ["handball", "basketball", "football"],
  },
  {
    heading: "winner",
    items: ["best report — discover india program"],
  },
];

export const TOOLS_SECTIONS: ResumeListSection[] = [
  { heading: "Marketing", items: ["Notion", "Milanote", "Figma", "Canva"] },
  { heading: "Growth", items: ["n8n", "Make", "Zapier"] },
  { heading: "Dev", items: ["VS Code", "Vercel", "Supabase", "Next.js"] },
  { heading: "AI", items: ["Claude", "ChatGPT", "Cursor", "Wispr Flow"] },
];

export type LearningItemIcon =
  | "store"
  | "chart"
  | "pin"
  | "pointer"
  | "analytics"
  | "pie"
  | "users"
  | "palette"
  | "user";

export interface LearningItem {
  id: string;
  title: string;
  icon: LearningItemIcon;
  kind: "course" | "certification";
}

/** Cover images: `public/resume/learning/{id}.png` or `{id}.jpg` */
export const LEARNING_ITEMS: LearningItem[] = [
  { id: "google-ad-manager", title: "Google Ad Manager", icon: "store", kind: "certification" },
  { id: "meta-ads-manager", title: "Meta Ads Manager", icon: "chart", kind: "certification" },
  { id: "pinterest-ads-manager", title: "Pinterest Ads Manager", icon: "pin", kind: "certification" },
  { id: "project-management", title: "Project Management", icon: "pointer", kind: "course" },
  { id: "google-analytics", title: "Google Analytics", icon: "analytics", kind: "certification" },
  { id: "data-visualization", title: "Data Visualization", icon: "pie", kind: "course" },
  { id: "consumer-behavior", title: "Consumer Behavior", icon: "users", kind: "course" },
  { id: "creative-strategy", title: "Creative Strategy", icon: "palette", kind: "course" },
  { id: "consumer-experience", title: "Consumer Experience", icon: "user", kind: "course" },
];

export const FALLBACK_CREATIONS: CreationItem[] = [
  {
    id: "c1",
    title: "Growth loops breakdown",
    kind: "video",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    platform: "YouTube",
  },
  {
    id: "c2",
    title: "Portfolio desktop",
    kind: "image",
    url: "/sierra-wallpaper.jpg",
    thumbnail_url: "/sierra-wallpaper.jpg",
  },
  {
    id: "c3",
    title: "Cal.com booking",
    kind: "embed",
    url: "https://cal.com/rutujarochkari/hi?duration=25",
    platform: "Cal.com",
  },
];

export const CATEGORY_COLOR_MAP: Record<ConsumptionCategory, string> = {
  video: "#F08C21",
  article: "#6698CC",
  newsletter: "#B4B534",
  post: "#F2D88F",
  podcast: "#E36888",
};
