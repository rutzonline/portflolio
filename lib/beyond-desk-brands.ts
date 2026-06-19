export const BRAND_SUBSECTIONS = ["d2c", "b2b", "b2b2c", "b2c"] as const;

export type BrandSubsectionId = (typeof BRAND_SUBSECTIONS)[number];

export function normalizeBrandCategory(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_-]/g, "");
}

export function getBrandSubsectionId(
  value: string | null | undefined
): BrandSubsectionId | null {
  if (!value?.trim()) return null;
  const normalized = normalizeBrandCategory(value);
  return BRAND_SUBSECTIONS.find((id) => id === normalized) ?? null;
}

export function resolveBrandSubsection(
  subsection: string | null | undefined,
  category: string | null | undefined
): BrandSubsectionId {
  return (
    getBrandSubsectionId(subsection) ??
    getBrandSubsectionId(category) ??
    "d2c"
  );
}
