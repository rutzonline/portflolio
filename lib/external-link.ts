import { siteConfig } from "@/config/site";

function getSiteOrigin(): string {
  try {
    return new URL(siteConfig.url).origin;
  } catch {
    return "";
  }
}

function getSupabaseOrigin(): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;
  try {
    return new URL(supabaseUrl).origin;
  } catch {
    return null;
  }
}

/** Public assets, same-origin URLs, or this site's Supabase storage. */
export function isSiteOwnedMediaUrl(href: string): boolean {
  if (!href) return false;

  if (href.startsWith("/") && !href.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;

    const siteOrigin = getSiteOrigin();
    if (siteOrigin && url.origin === siteOrigin) return true;

    if (typeof window !== "undefined" && url.origin === window.location.origin) {
      return true;
    }

    const supabaseOrigin = getSupabaseOrigin();
    if (
      supabaseOrigin &&
      url.origin === supabaseOrigin &&
      url.pathname.startsWith("/storage/v1/object/public/")
    ) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

/** Validate media URLs passed to `/view`. */
export function sanitizeSiteMediaUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;

  const trimmed = raw.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  try {
    const decoded = decodeURIComponent(trimmed);
    if (decoded.startsWith("/") && !decoded.startsWith("//")) {
      return decoded;
    }

    const url = new URL(decoded);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!isSiteOwnedMediaUrl(url.href)) return null;
    return url.href;
  } catch {
    return null;
  }
}

/**
 * Wrap site-owned media in `/view` so new tabs keep the portfolio favicon.
 * Third-party URLs are returned unchanged.
 */
export function getSiteMediaViewHref(href: string): string {
  if (!isSiteOwnedMediaUrl(href)) return href;
  return `/view?url=${encodeURIComponent(href)}`;
}

export function openSiteMediaInNewTab(href: string): void {
  window.open(getSiteMediaViewHref(href), "_blank", "noopener,noreferrer");
}
