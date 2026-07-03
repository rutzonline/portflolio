export interface FileItem {
  name: string;
  type: "file" | "dir" | "app";
  path: string;
  icon?: string;
  displayName?: string;
}

export const IMAGE_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg",
  "bmp",
  "ico",
];

export function isImageFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return IMAGE_EXTENSIONS.includes(ext);
}

export function isPdfFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ext === "pdf";
}

export function isPreviewFile(filename: string): boolean {
  return isImageFile(filename) || isPdfFile(filename);
}

export const TRASH_FILES: FileItem[] = [
  { name: "old-notes.md", type: "file", path: "trash/old-notes.md" },
  { name: "draft-v1.tsx", type: "file", path: "trash/draft-v1.tsx" },
  { name: "unused-assets", type: "dir", path: "trash/unused-assets" },
  { name: "backup-2024", type: "dir", path: "trash/backup-2024" },
  { name: "config.old.json", type: "file", path: "trash/config.old.json" },
];
