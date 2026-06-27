import { siteConfig } from "@/config/site";

/**
 * Toggle `forceLowercasePreview` in config/site.ts to preview the site in lowercase.
 * Set to `false` to restore normal casing (no other changes needed).
 */
export function isLowercasePreviewEnabled(): boolean {
  return siteConfig.forceLowercasePreview === true;
}

export const LOWERCASE_PREVIEW_CLASS = "portfolio-lowercase-preview";

/** Keeps original casing for words wrapped by the lowercase preview DOM pass. */
export const LOWERCASE_PRESERVE_CLASS = "portfolio-lowercase-preserve";

/** True when a word contains two or more adjacent uppercase letters (e.g. HI, HTML). */
export function wordHasAdjacentCapitals(word: string): boolean {
  return /[A-Z]{2,}/.test(word);
}
