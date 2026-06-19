export const DESKTOP_FINDER_PATH = "/Users/rutujarochkari/Desktop";

/** One-word URL slugs for desktop PDFs (override auto-generated slugs). */
export const DESKTOP_PDF_FILENAME_TO_SLUG: Record<string, string> = {
  "FamPay - Copy Intern Assignment.pdf": "fampay",
  "Assignment - wisprflow.pdf": "wisprflow",
  "Content and SM  Pitch deck.pdf": "pitchdeck",
};

/** Default iframe PDF zoom per desktop file (fit-to-window tuning). */
export const DESKTOP_PDF_FILENAME_TO_ZOOM: Record<string, number> = {
  "FamPay - Copy Intern Assignment.pdf": 40,
  "Assignment - wisprflow.pdf": 50,
  "Content and SM  Pitch deck.pdf": 40,
};

export const DEFAULT_DESKTOP_PDF_ZOOM = 40;

const DESKTOP_PDF_SLUG_TO_FILENAME: Record<string, string> = Object.fromEntries(
  Object.entries(DESKTOP_PDF_FILENAME_TO_SLUG).map(([filename, slug]) => [slug, filename])
);

export function getDesktopPdfZoomForFilename(filename: string): number {
  return DESKTOP_PDF_FILENAME_TO_ZOOM[filename] ?? DEFAULT_DESKTOP_PDF_ZOOM;
}

export function getDesktopPdfZoomForPath(filePath: string): number | null {
  if (!filePath.startsWith(DESKTOP_FINDER_PATH + "/")) return null;
  const filename = filePath.slice(DESKTOP_FINDER_PATH.length + 1);
  if (!filename || filename.includes("/")) return null;
  return getDesktopPdfZoomForFilename(filename);
}

export function getDesktopPdfSlugForFilename(filename: string): string {
  const explicit = DESKTOP_PDF_FILENAME_TO_SLUG[filename];
  if (explicit) return explicit;

  const word = filename.replace(/\.pdf$/i, "").match(/[a-zA-Z0-9]+/);
  return word ? word[0].toLowerCase() : "pdf";
}

export function getDesktopPdfSlugForPath(filePath: string): string | null {
  if (!filePath.startsWith(DESKTOP_FINDER_PATH + "/")) return null;
  const filename = filePath.slice(DESKTOP_FINDER_PATH.length + 1);
  if (!filename || filename.includes("/")) return null;
  return getDesktopPdfSlugForFilename(filename);
}

export function getDesktopPdfFilenameForSlug(slug: string): string | null {
  return DESKTOP_PDF_SLUG_TO_FILENAME[slug] ?? null;
}

/** Maps a Finder Desktop PDF path to its `public/desktop/` asset URL. */
export function getDesktopPdfAssetUrl(filePath: string): string | null {
  if (!filePath.startsWith(DESKTOP_FINDER_PATH + "/")) return null;
  if (!filePath.toLowerCase().endsWith(".pdf")) return null;

  const filename = filePath.slice(DESKTOP_FINDER_PATH.length + 1);
  if (!filename || filename.includes("/") || filename.includes("\\")) return null;

  return `/desktop/${encodeURIComponent(filename)}`;
}

export function isDesktopPdfPath(filePath: string): boolean {
  return getDesktopPdfAssetUrl(filePath) !== null;
}
