/** Shared sidebar ids for Finder and Resume (Work) apps. */
export type SidebarItem =
  | "recents"
  | "applications"
  | "desktop"
  | "documents"
  | "downloads"
  | "projects"
  | "trash"
  | "skills"
  | "education"
  | "tools"
  | "certifications"
  | "contact"
  | "faqs";

/** Static resume panels — no file index entries to search. */
export const STATIC_SIDEBAR_PANELS = new Set<SidebarItem>([
  "skills",
  "education",
  "tools",
  "certifications",
  "contact",
  "faqs",
]);

export function getSearchSectionForSidebar(
  scope: "current" | "all",
  sidebar: SidebarItem | undefined
): SidebarItem | undefined {
  if (scope !== "current") return undefined;
  if (!sidebar || STATIC_SIDEBAR_PANELS.has(sidebar)) return "recents";
  return sidebar;
}
