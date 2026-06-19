import { siteConfig } from "@/config/site";

/**
 * Toggle `forceLowercasePreview` in config/site.ts to preview the site in lowercase.
 * Set to `false` to restore normal casing (no other changes needed).
 */
export function isLowercasePreviewEnabled(): boolean {
  return siteConfig.forceLowercasePreview === true;
}

export const LOWERCASE_PREVIEW_CLASS = "portfolio-lowercase-preview";
