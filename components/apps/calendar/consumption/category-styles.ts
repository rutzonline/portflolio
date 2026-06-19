import type { ConsumptionCategory } from "@/types/consumption";

/** Brand palette */
export const BRAND_COLORS = {
  tangerine: "#F08C21",
  butter: "#F2D88F",
  blush: "#E36888",
  sea: "#6698CC",
  matcha: "#B4B534",
} as const;

export const CATEGORY_COLORS: Record<ConsumptionCategory, string> = {
  video: BRAND_COLORS.tangerine,
  article: BRAND_COLORS.sea,
  newsletter: BRAND_COLORS.matcha,
  post: BRAND_COLORS.butter,
  podcast: BRAND_COLORS.blush,
};

export const CATEGORY_LABELS: Record<ConsumptionCategory, string> = {
  video: "Video",
  article: "Article",
  newsletter: "Newsletter",
  post: "Post",
  podcast: "Podcast",
};

/** Light fills need a ring so dots/bars stay visible on pale backgrounds */
export const LIGHT_CATEGORY_COLORS = new Set<string>([
  BRAND_COLORS.butter,
  BRAND_COLORS.matcha,
]);

export function isConsumptionCategory(value: string): value is ConsumptionCategory {
  return value in CATEGORY_COLORS;
}

export function getCategoryColor(category: string): string {
  if (isConsumptionCategory(category)) return CATEGORY_COLORS[category];
  return CATEGORY_COLORS.article;
}

export function getCategoryLabel(category: string): string {
  if (isConsumptionCategory(category)) return CATEGORY_LABELS[category];
  return category;
}

export function categoryDotClassName(color: string): string {
  return LIGHT_CATEGORY_COLORS.has(color)
    ? "ring-1 ring-foreground/25"
    : "";
}
