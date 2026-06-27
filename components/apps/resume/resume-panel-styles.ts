import { cn } from "@/lib/utils";

/** Subtle filled fill used by every resume card/block + the contact inputs. */
export const RESUME_PANEL_FILL_CLASS = "bg-zinc-100/70 dark:bg-zinc-800/40";

/** Resume list/card chrome — shared across work + static panels. */
export const RESUME_PANEL_CARD_CLASS =
  `rounded-lg border border-zinc-200/80 dark:border-zinc-700/45 ${RESUME_PANEL_FILL_CLASS}`;

export const RESUME_PANEL_CARD_OVERFLOW_CLASS = `${RESUME_PANEL_CARD_CLASS} overflow-hidden`;

export const RESUME_PANEL_ROW_DIVIDER =
  "border-b border-zinc-200/60 dark:border-zinc-700/40";

export const RESUME_PANEL_COL_DIVIDER =
  "border-r border-zinc-200/60 dark:border-zinc-700/40";

export const RESUME_PANEL_TOP_DIVIDER =
  "border-t border-zinc-200/60 dark:border-zinc-700/40";

/** Section label — matches resume-section-list and sidebar headings. */
export const RESUME_SECTION_HEADING_CLASS =
  "text-xs text-muted-foreground px-3 py-1 font-semibold uppercase tracking-wide";

/** Lead line under a section heading. */
export const RESUME_SECTION_LEAD_CLASS =
  "text-sm text-zinc-800 dark:text-zinc-100 px-3";

/** Scrollable resume panel root — adds mobile bottom inset when needed. */
export function resumePanelScrollClass(isMobileView = false, extra?: string) {
  return cn("flex-1 overflow-y-auto p-6", isMobileView && "pb-20", extra);
}
