import { cn } from "@/lib/utils";
import { SIDEBAR_ITEM_ACTIVE_CLASS, IOS_MOBILE_LIST_ROW_TITLE_CLASS } from "@/lib/ui-tokens";

export function SidebarItem({
  icon,
  label,
  isActive,
  onClick,
  isMobileView,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isMobileView: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 py-1.5 rounded-lg transition-colors text-left",
        isActive && !isMobileView
          ?"bg-white/[0.05] text-[#0047AB] font-semibold mx-2"
  : "text-foreground mx-2",
  
        isMobileView ? "px-3 py-3 text-base" : "px-3 text-sm"
      )}
    >
      {icon}
      <span className={cn("truncate", isMobileView && IOS_MOBILE_LIST_ROW_TITLE_CLASS)}>{label}</span>
    </button>
  );
}
