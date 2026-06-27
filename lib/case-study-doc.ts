import { HOME_DIR } from "@/lib/file-route-utils";
import type { CaseStudy } from "@/types/work";

export const SELECTED_WORK_DIR = `${HOME_DIR}/Documents/Selected Work`;

export function toEmptyCaseStudy(study: CaseStudy): CaseStudy {
  return { ...study, body: "", description: "" };
}

export function getCaseStudyDocPath(slug: string): string {
  return `${SELECTED_WORK_DIR}/${slug}.md`;
}

export function isCaseStudyDocPath(filePath: string): boolean {
  return filePath.startsWith(`${SELECTED_WORK_DIR}/`) && filePath.endsWith(".md");
}

export function getCaseStudySlugFromPath(filePath: string): string | null {
  if (!isCaseStudyDocPath(filePath)) return null;
  const name = filePath.split("/").pop() ?? "";
  return name.replace(/\.md$/, "") || null;
}

export function getCaseStudyWindowTitle(
  filePath: string,
  caseStudy?: CaseStudy | null
): string {
  if (caseStudy?.title?.trim()) return caseStudy.title;
  const slug = getCaseStudySlugFromPath(filePath);
  if (slug) return slug;
  return filePath.split("/").pop() || "Untitled";
}
