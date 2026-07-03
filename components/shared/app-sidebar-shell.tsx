import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DESKTOP_NAV_SIDEBAR_WIDTH_CLASS } from "@/lib/ui-tokens";

interface AppSidebarShellProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
  isMobileView: boolean;
  onScroll?: (isScrolled: boolean) => void;
  className?: string;
  widthClass?: string;
}

export function AppSidebarShell({
  children,
  sidebarContent,
  isMobileView,
  onScroll,
  className,
  widthClass,
}: AppSidebarShellProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full",
        isMobileView ? "bg-background" : "bg-muted",
        className
      )}
    >
      {children}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea
          className="h-full"
          bottomMargin="0"
          onScrollCapture={(e) => {
            const target = e.target as HTMLElement;
            onScroll?.(target.scrollTop > 0);
          }}
        >
          <div
            className={cn(
              "px-2 py-2",
              isMobileView ? "w-full" : (widthClass || DESKTOP_NAV_SIDEBAR_WIDTH_CLASS)
            )}
          >
            {sidebarContent}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
