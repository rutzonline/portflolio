import { getLocalPreviewAssetUrl, PROJECTS_DIR } from "@/lib/file-route-utils";
import { resolveFinderFileParam } from "@/lib/finder-file-slugs";
import {
  DEFAULT_DESKTOP_PDF_ZOOM,
  getDesktopPdfZoomForFilename,
  getDesktopPdfZoomForPath,
} from "@/lib/desktop-folder";

export const PREVIEW_TITLE_BAR_HEIGHT = 44;

export const DEFAULT_PDF_VIEWER_ZOOM = DEFAULT_DESKTOP_PDF_ZOOM;

export function buildPdfViewerHash(zoomPercent = DEFAULT_PDF_VIEWER_ZOOM): string {
  return `toolbar=0&navpanes=0&scrollbar=0&zoom=${zoomPercent}`;
}

/** Default PDF viewer hash (40% zoom, sidebar/toolbar hidden). */
export const PDF_VIEWER_HASH = buildPdfViewerHash();

export function getPdfViewerZoomForPreview(filePath?: string, fileUrl?: string): number {
  if (filePath) {
    const desktopZoom = getDesktopPdfZoomForPath(filePath);
    if (desktopZoom !== null) return desktopZoom;

    const filename = filePath.split("/").pop();
    if (filename?.toLowerCase().endsWith(".pdf")) {
      return getDesktopPdfZoomForFilename(filename);
    }
  }

  if (fileUrl?.startsWith("/desktop/")) {
    try {
      const filename = decodeURIComponent(fileUrl.slice("/desktop/".length));
      return getDesktopPdfZoomForFilename(filename);
    } catch {
      // Ignore malformed URLs
    }
  }

  return DEFAULT_PDF_VIEWER_ZOOM;
}

export function getPdfProxyUrl(fileUrl: string): string {
  if (fileUrl.startsWith("/api/preview/pdf?")) {
    return fileUrl;
  }
  return `/api/preview/pdf?url=${encodeURIComponent(fileUrl)}`;
}

export function getPdfViewerIframeSrc(fileUrl: string, filePath?: string): string {
  const zoom = getPdfViewerZoomForPreview(filePath, fileUrl);
  return `${getPdfProxyUrl(fileUrl)}#${buildPdfViewerHash(zoom)}`;
}
const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico"];

export function getPreviewMetadataFromPath(
  filePath: string
): { fileUrl: string; fileType: "image" | "pdf" } | null {
  const resolved = resolveFinderFileParam(filePath);
  const ext = resolved.split(".").pop()?.toLowerCase() || "";
  const fileType: "image" | "pdf" | null = ext === "pdf" ? "pdf" : IMAGE_EXTENSIONS.includes(ext) ? "image" : null;
  if (!fileType) return null;

  if (resolved.startsWith(PROJECTS_DIR + "/")) {
    const relativePath = resolved.slice(PROJECTS_DIR.length + 1);
    const parts = relativePath.split("/");
    const repo = parts[0];
    const repoPath = parts.slice(1).join("/");
    const fileUrl = `https://raw.githubusercontent.com/rutujarochkari/${repo}/main/${repoPath}`;
    return { fileUrl, fileType };
  }

  const localPreviewUrl = getLocalPreviewAssetUrl(resolved);
  if (localPreviewUrl) {
    const fileUrl = localPreviewUrl;
    return { fileUrl, fileType };
  }

  return null;
}
