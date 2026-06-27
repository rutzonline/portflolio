import { LLMS_DOC_PATH } from "@/lib/file-route-utils";
import {
  LLMS_DOC_BASELINE,
  LLMS_DOC_BASELINE_VERSION,
} from "@/lib/llms-doc-baseline";

const LLMS_BASELINE_VERSION_KEY = "llms-doc-baseline-version";

export { LLMS_DOC_PATH };

export function isLlmsDocPath(filePath: string): boolean {
  return filePath === LLMS_DOC_PATH;
}

/** Resolves llms.txt content — refreshes from baseline when the version bumps. */
export function getLlmsDocumentContent(cached?: string): string {
  if (typeof window === "undefined") return LLMS_DOC_BASELINE;

  try {
    const storedVersion = localStorage.getItem(LLMS_BASELINE_VERSION_KEY);
    const currentVersion = String(LLMS_DOC_BASELINE_VERSION);

    if (storedVersion !== currentVersion) {
      localStorage.setItem(LLMS_BASELINE_VERSION_KEY, currentVersion);
      return LLMS_DOC_BASELINE;
    }
  } catch {
    return LLMS_DOC_BASELINE;
  }

  return cached !== undefined ? cached : LLMS_DOC_BASELINE;
}

/** Reject edits that remove or alter the baseline prefix. */
export function enforceLlmsAppendOnly(next: string, previous: string): string {
  if (next.startsWith(LLMS_DOC_BASELINE)) return next;
  if (previous.startsWith(LLMS_DOC_BASELINE)) return previous;
  return LLMS_DOC_BASELINE;
}
