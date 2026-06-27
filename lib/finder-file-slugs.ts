import {
  DESKTOP_FINDER_PATH,
  getDesktopPdfFilenameForSlug,
  getDesktopPdfSlugForPath,
} from "@/lib/desktop-folder";

const FINDER_HOME_DIR = "/Users/rutujarochkari";

/** One-word URL slugs for local Finder files (`?file=` query param). */
const STATIC_FILE_SLUGS: Record<string, string> = {
  [`${FINDER_HOME_DIR}/Documents/llms.txt`]: "llms",
  [`${FINDER_HOME_DIR}/Documents/hello.md`]: "hello",
  [`${FINDER_HOME_DIR}/Downloads/Cursor.app`]: "cursor",
};

const STATIC_SLUG_TO_PATH: Record<string, string> = Object.fromEntries(
  Object.entries(STATIC_FILE_SLUGS).map(([path, slug]) => [slug, path])
);

/** Resolve a one-word slug (or legacy full path) to a Finder file path. */
export function resolveFinderFileParam(param: string): string {
  if (!param) return param;

  if (param.startsWith("/Users/") || param.startsWith(FINDER_HOME_DIR)) {
    return param;
  }

  const desktopFilename = getDesktopPdfFilenameForSlug(param);
  if (desktopFilename) {
    return `${DESKTOP_FINDER_PATH}/${desktopFilename}`;
  }

  if (STATIC_SLUG_TO_PATH[param]) {
    return STATIC_SLUG_TO_PATH[param];
  }

  return param;
}

/** One-word slug for shell URLs; null if no slug mapping exists. */
export function getFinderFileSlug(filePath: string): string | null {
  const desktopSlug = getDesktopPdfSlugForPath(filePath);
  if (desktopSlug) return desktopSlug;

  return STATIC_FILE_SLUGS[filePath] ?? null;
}
