export function isVideoUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".webm");
}

/** Normalize Supabase storage URLs to direct object/public paths. */
export function getOriginalImageUrl(url: string): string {
  return url
    .replace("/storage/v1/render/image/public/", "/storage/v1/object/public/")
    .replace(/\?.*$/, "");
}

/** Grid thumbnails — Next.js Image optimizer handles small widths. */
export function getThumbnailUrl(url: string): string {
  if (isVideoUrl(url)) return url;
  return getOriginalImageUrl(url);
}

/** Viewer — load the public URL directly (optimizer fails on large originals). */
export function getViewerUrl(url: string): string {
  if (isVideoUrl(url)) return url;
  return getOriginalImageUrl(url);
}
