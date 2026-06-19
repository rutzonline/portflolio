import { cn } from "@/lib/utils";

/** Shell classes shared with DesktopStickyNote. Pass `opaque` for larger panels (readme). */
export function stickyNoteShellClass(opaque = false) {
  return cn(
    "overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
    opaque ? "bg-zinc-900" : "bg-zinc-800/90 backdrop-blur-xl"
  );
}

export const STICKY_NOTE_TITLE_BAR_CLASS =
  "flex items-center gap-2 px-3 py-2.5 border-b border-white/8";

export const STICKY_NOTE_TITLE_CLASS =
  "flex-1 text-center text-[11px] font-medium text-zinc-400 tracking-wide pr-6";

export const STICKY_NOTE_FOOTER_DIVIDER_CLASS = "border-t border-white/8 pt-2 shrink-0";
