import { INTRO_DOC_CONTENT, INTRO_DOC_PATH } from "@/lib/file-route-utils";
import { INTRO_DOC_BASELINE } from "@/lib/intro-doc-baseline";

export { INTRO_DOC_PATH };
export { INTRO_README_TABS } from "@/lib/intro-doc-baseline";

/** Immutable prefix — users may only append after this text. */
export const INTRO_BASELINE = INTRO_DOC_CONTENT;

export function getIntroBaselineLength(): number {
  return INTRO_BASELINE.length;
}

export function isIntroDocPath(filePath: string): boolean {
  return filePath === INTRO_DOC_PATH;
}

/** Readme always uses baseline tabs — ignores stale browser localStorage. */
export function getIntroDocumentContent(): string {
  return INTRO_DOC_BASELINE;
}

/** Reject edits that remove or alter the baseline prefix. */
export function enforceIntroAppendOnly(next: string, previous: string): string {
  if (next.startsWith(INTRO_BASELINE)) return next;
  if (previous.startsWith(INTRO_BASELINE)) return previous;
  return INTRO_BASELINE;
}
