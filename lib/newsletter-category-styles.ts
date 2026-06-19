import { BRAND_COLORS } from "@/components/apps/calendar/consumption/category-styles";

/** Newsletter/blog categories → consumption log brand palette */
export const NEWSLETTER_CATEGORY_COLORS: Record<string, string> = {
  Marketing: BRAND_COLORS.blush,
  Business: BRAND_COLORS.matcha,
  "Product & Growth": BRAND_COLORS.sea,
  "Email Marketing": BRAND_COLORS.tangerine,
  "Design & Culture": BRAND_COLORS.butter,
};

function resolveNewsletterCategoryColor(category: string | null | undefined): string {
  if (!category?.trim()) return BRAND_COLORS.sea;
  const normalized = category.trim().toLowerCase();
  const entry = Object.entries(NEWSLETTER_CATEGORY_COLORS).find(
    ([key]) => key.toLowerCase() === normalized
  );
  return entry?.[1] ?? BRAND_COLORS.sea;
}

export function getNewsletterCategoryColor(category: string | null | undefined): string {
  return resolveNewsletterCategoryColor(category);
}

export function getNewsletterCategoryStyles(category: string | null | undefined): {
  color: string;
} {
  return {
    color: resolveNewsletterCategoryColor(category),
  };
}
