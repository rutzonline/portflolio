import { resolveFinderFileParam } from "@/lib/finder-file-slugs";
import { INTRO_DOC_BASELINE } from "@/lib/intro-doc-baseline";
import { LLMS_DOC_BASELINE } from "@/lib/llms-doc-baseline";
import { isDesktopPdfPath, getDesktopPdfAssetUrl } from "@/lib/desktop-folder";

export const HOME_DIR = "/Users/rutujarochkari";
export const PROJECTS_DIR = `${HOME_DIR}/Projects`;

export const INTRO_DOC_PATH = `${HOME_DIR}/Documents/intro.txt`;
export const LLMS_DOC_PATH = `${HOME_DIR}/Documents/llms.txt`;
export const CURSOR_DOWNLOAD_PATH = `${HOME_DIR}/Downloads/Cursor.txt`;

export const CURSOR_APP_DETAILS = `Cursor
═══════════════════════════════════════

AI-powered code editor for building software with AI.

Website: https://cursor.com
Docs: https://docs.cursor.com

Highlights
──────────
• Composer — multi-file edits from natural language
• Tab — inline autocomplete across your codebase
• Agent — autonomous tasks with repo context
• MCP — connect external tools and data sources

Install
───────
1. Download Cursor for macOS from cursor.com
2. Drag Cursor.app into Applications
3. Sign in and open your project folder

This portfolio was built and iterated in Cursor.
`;

export const INTRO_DOC_CONTENT = INTRO_DOC_BASELINE;
export const LLMS_DOC_CONTENT = LLMS_DOC_BASELINE;

export type DocumentAppId = "textedit" | "preview";
export type LocalSampleFileKind = "text" | "preview";

export interface LocalFinderItem {
  name: string;
  type: "file" | "dir";
  path: string;
}

interface LocalSampleFile {
  assetUrl?: string;
  content?: string;
  directoryPath: string;
  kind: LocalSampleFileKind;
  path: string;
}

interface DocumentAppConfig {
  finderTargetPath: string;
  localFileKind: LocalSampleFileKind;
}

export const DOCUMENT_APP_CONFIGS: Record<DocumentAppId, DocumentAppConfig> = {
  textedit: {
    finderTargetPath: `${HOME_DIR}/Documents`,
    localFileKind: "text",
  },
  preview: {
    finderTargetPath: `${HOME_DIR}/Desktop`,
    localFileKind: "preview",
  },
};

const LOCAL_SAMPLE_FILES: LocalSampleFile[] = [
  {
    content: INTRO_DOC_CONTENT,
    directoryPath: `${HOME_DIR}/Documents`,
    kind: "text",
    path: INTRO_DOC_PATH,
  },
  {
    content: LLMS_DOC_CONTENT,
    directoryPath: `${HOME_DIR}/Documents`,
    kind: "text",
    path: LLMS_DOC_PATH,
  },
  {
    content: "hello world!",
    directoryPath: `${HOME_DIR}/Documents`,
    kind: "text",
    path: `${HOME_DIR}/Documents/hello.md`,
  },
  {
    content: CURSOR_APP_DETAILS,
    directoryPath: `${HOME_DIR}/Downloads`,
    kind: "text",
    path: CURSOR_DOWNLOAD_PATH,
  },
];

const LOCAL_SAMPLE_FILE_MAP = Object.fromEntries(
  LOCAL_SAMPLE_FILES.map((file) => [file.path, file])
) as Record<string, LocalSampleFile>;

export const LOCAL_FINDER_FILES: Record<string, LocalFinderItem[]> = {
  [HOME_DIR]: [
    { name: "Desktop", type: "dir", path: `${HOME_DIR}/Desktop` },
    { name: "Documents", type: "dir", path: `${HOME_DIR}/Documents` },
    { name: "Downloads", type: "dir", path: `${HOME_DIR}/Downloads` },
    { name: "Projects", type: "dir", path: `${HOME_DIR}/Projects` },
  ],
  [`${HOME_DIR}/Desktop`]: LOCAL_SAMPLE_FILES.filter((file) => file.directoryPath === `${HOME_DIR}/Desktop`).map((file) => ({
    name: file.path.split("/").pop() ?? file.path,
    type: "file" as const,
    path: file.path,
  })),
  // Desktop PDFs are listed via /api/finder/desktop-files (public/desktop/*.pdf)
  [`${HOME_DIR}/Documents`]: LOCAL_SAMPLE_FILES.filter((file) => file.directoryPath === `${HOME_DIR}/Documents`).map((file) => ({
    name: file.path.split("/").pop() ?? file.path,
    type: "file" as const,
    path: file.path,
  })),
  [`${HOME_DIR}/Downloads`]: LOCAL_SAMPLE_FILES.filter(
    (file) => file.directoryPath === `${HOME_DIR}/Downloads`
  ).map((file) => ({
    name: file.path.split("/").pop() ?? file.path,
    type: "file" as const,
    path: file.path,
  })),
};

export function getDocumentAppFinderTarget(appId: DocumentAppId): string {
  return DOCUMENT_APP_CONFIGS[appId].finderTargetPath;
}

export function getLocalTextFileContent(filePath: string): string | null {
  const file = LOCAL_SAMPLE_FILE_MAP[filePath];
  return file?.kind === "text" ? (file.content ?? null) : null;
}

export function getLocalPreviewAssetUrl(filePath: string): string | null {
  const resolved = resolveFinderFileParam(filePath);
  const file = LOCAL_SAMPLE_FILE_MAP[resolved];
  if (file?.kind === "preview") return file.assetUrl ?? null;

  return getDesktopPdfAssetUrl(resolved);
}

export function isSupportedDocumentAppPath(appId: DocumentAppId, filePath: string): boolean {
  if (!filePath) return false;
  const resolved = resolveFinderFileParam(filePath);
  if (appId === "textedit" && resolved.startsWith(`${PROJECTS_DIR}/`)) return true;

  const file = LOCAL_SAMPLE_FILE_MAP[resolved];
  if (file?.kind === DOCUMENT_APP_CONFIGS[appId].localFileKind) return true;

  if (appId === "preview" && isDesktopPdfPath(resolved)) return true;

  return false;
}

export function isSupportedTextEditPath(filePath: string): boolean {
  return isSupportedDocumentAppPath("textedit", filePath);
}
