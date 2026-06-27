import { HOME_DIR } from "@/lib/file-route-utils";

export const SELECTED_WORK_DIR = `${HOME_DIR}/Documents/Selected Work`;

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
