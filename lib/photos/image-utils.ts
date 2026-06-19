/**
 * Transform a Supabase storage URL to use image transformations.
 * Changes /object/ to /render/image/ and adds size parameters.
 *
 * @param url - Original Supabase public URL
 * @param width - Desired width in pixels
 * @param quality - Image quality (1-100), defaults to 80
 * @returns Transformed URL that serves an optimized image
 */
export function getOptimizedImageUrl(
  url: string,
  width: number,
  quality: number = 80
): string {
  if (!url.includes("/storage/v1/object/public/")) {
    return url;
  }

  const transformedUrl = url.replace(
    "/storage/v1/object/public/",
    "/storage/v1/render/image/public/"
  );

  const separator = transformedUrl.includes("?") ? "&" : "?";
  return `${transformedUrl}${separator}width=${width}&resize=contain&quality=${quality}`;
}

/** Grid thumbnails — ~400px covers 5-column layout at 2× density. */
export function getThumbnailUrl(url: string): string {
  return getOptimizedImageUrl(url, 400, 75);
}

/** Viewer — large but not full original unless already smaller. */
export function getViewerUrl(url: string): string {
  return getOptimizedImageUrl(url, 1600, 82);
}
