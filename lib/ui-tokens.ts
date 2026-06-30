/** macOS system accent blue — single source for inline styles (must match globals.css `--accent-blue`). */
export const ACCENT_BLUE_HEX = "#007AFF";

export const ACCENT_BLUE_CLASS = "text-accent-blue";
export const ACCENT_BLUE_BG_CLASS = "bg-accent-blue";
export const ACCENT_BLUE_RING_CLASS = "ring-accent-blue";

/** Desktop sidebar row when the current section is selected. */
export const SIDEBAR_ITEM_ACTIVE_CLASS =
  "bg-[var(--sidebar-active-bg)] text-accent-blue opacity-100 [&_svg]:text-accent-blue [&_svg]:opacity-100 [&_span]:text-accent-blue";

/** Finder / Resume file list row when selected (solid accent fill). */
export const FILE_LIST_ROW_SELECTED_CLASS = "bg-accent-blue text-white";

/** Standard width for desktop nav sidebars (Notes, Messages, desk, photos, Resume). */
export const DESKTOP_NAV_SIDEBAR_WIDTH_CLASS = "w-52";

/** Section intro line under desk (misc) library headings. */
export const SECTION_SUBTEXT_CLASS = "text-sm text-muted-foreground mb-6";

/** Interactive media tile in desk library grids (browse, campaigns, products). */
export const DESK_MEDIA_CARD_CLASS =
  "group flex flex-col rounded-xl overflow-hidden bg-muted/50 border border-border/50 can-hover:hover:border-border transition-all can-hover:hover:shadow-lg";

/** Text-first tile in desk library (newsletters). */
export const DESK_TEXT_CARD_CLASS =
  "group flex flex-col p-4 rounded-xl bg-muted/50 border border-border/50 can-hover:hover:border-border can-hover:hover:bg-muted/70 transition-all min-w-0";

/** Outer frame for a selected thumbnail — ring sits outside a padded inset. */
export const SELECTION_FRAME_CLASS =
  "rounded-xl p-1 transition-all ring-2 ring-accent-blue ring-offset-2 ring-offset-background";

/** Quiet inline caption row — flex wrapper for line + text. */
export const CAPTION_ANNOTATION_ROW_CLASS = "flex w-full items-stretch gap-3";

/** Thin left accent line, vertically spans the caption text block. */
export const CAPTION_ACCENT_LINE_CLASS =
  "w-0.5 shrink-0 self-stretch rounded-full bg-accent-blue";

/** Caption text beside the accent line. */
export const CAPTION_ANNOTATION_TEXT_CLASS =
  "text-sm leading-relaxed text-muted-foreground text-left";

/** iOS-style grouped list screen background (mobile only). */
export const IOS_MOBILE_LIST_SCREEN_CLASS = "bg-muted/30";

/** Large navigation title for mobile list screens (iOS large-title style). */
export const IOS_MOBILE_LARGE_TITLE_CLASS =
  "px-4 pt-2 pb-3 text-[34px] font-bold leading-tight tracking-tight text-foreground";

/** Grouped inset list card container. */
export const IOS_MOBILE_LIST_GROUP_CLASS =
  "rounded-xl overflow-hidden bg-background border border-border/50";

/** Compact tappable row (~44px). */
export const IOS_MOBILE_LIST_ROW_CLASS =
  "flex min-h-11 w-full items-center gap-3 px-4 py-2 text-left transition-colors active:bg-muted/60 can-hover:hover:bg-muted/40";

/** Primary row label on mobile lists. */
export const IOS_MOBILE_LIST_ROW_TITLE_CLASS = "text-[17px] leading-snug text-foreground";

/** Secondary row label on mobile lists. */
export const IOS_MOBILE_LIST_ROW_SUBTITLE_CLASS = "text-[13px] leading-snug text-muted-foreground";

/** Section header above a grouped list block. */
export const IOS_MOBILE_LIST_SECTION_LABEL_CLASS =
  "px-4 pb-1.5 pt-5 first:pt-2 text-[13px] font-normal uppercase text-muted-foreground";

/** Trailing disclosure chevron on tappable rows. */
export const IOS_MOBILE_LIST_CHEVRON_CLASS = "h-[13px] w-[13px] shrink-0 text-muted-foreground/70";

/** Base body text size for mobile app content (applied at shell level). */
export const IOS_MOBILE_BODY_TEXT_CLASS = "text-[17px] leading-[1.5]";

/** Long-form reading copy — note bodies, message bubbles, resume panels. */
export const IOS_MOBILE_READING_TEXT_CLASS = "text-[17px] leading-[1.5]";

/** Pressed state for tappable controls (no motion). */
export const IOS_MOBILE_TOUCH_ACTIVE_CLASS = "active:opacity-70";

/** Minimum 44×44pt hit target via padding around a fixed-size icon. */
export const IOS_MOBILE_ICON_HIT_AREA_CLASS =
  "inline-flex min-h-11 min-w-11 items-center justify-center";

/** One swipe-action column width (matches w-16). */
export const IOS_MOBILE_SWIPE_ACTION_WIDTH_PX = 64;

/** Minimum horizontal swipe before snapping open/closed. */
export const IOS_MOBILE_SWIPE_SNAP_THRESHOLD_PX = 40;

export function iosMobileSwipeOffsetPx(actionCount: number): number {
  return IOS_MOBILE_SWIPE_ACTION_WIDTH_PX * actionCount;
}

/** Shared mobile search field height and padding. */
export const IOS_MOBILE_SEARCH_INPUT_CLASS =
  "h-10 w-full rounded-[10px] text-base focus:outline-none";

/** Horizontal inset for mobile search bars — slightly narrower than screen edges for a wider field. */
export const IOS_MOBILE_SEARCH_WRAPPER_CLASS = "px-2 py-2";
