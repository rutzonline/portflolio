import { Icons } from "./icons";
import { useEffect } from "react";
import { useWindowFocus } from "@/lib/window-focus-context";
import { WindowNavShell } from "@/components/window-nav-shell";
import { useWindowNavBehavior } from "@/lib/use-window-nav-behavior";
import { IosMobileNavTitle } from "@/lib/dynamic-ios-nav";
import { cn } from "@/lib/utils";
import { IOS_MOBILE_ICON_HIT_AREA_CLASS, IOS_MOBILE_TOUCH_ACTIVE_CLASS } from "@/lib/ui-tokens";

interface NavProps {
  onNewChat: () => void;
  isMobileView: boolean;
  isScrolled?: boolean;
  isDesktop?: boolean;
  title?: string;
}

export function Nav({
  onNewChat,
  isMobileView,
  isScrolled,
  isDesktop = false,
  title = "Messages",
}: NavProps) {
  const windowFocus = useWindowFocus();
  const nav = useWindowNavBehavior({
    isDesktop,
    isMobile: isMobileView,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      if (windowFocus) {
        if (!windowFocus.isFocused) return;
      } else {
        if (!target.closest('[data-app="messages"]')) return;
      }

      if (
        document.activeElement?.tagName === "INPUT" ||
        e.metaKey ||
        document.querySelector(".ProseMirror")?.contains(document.activeElement)
      ) {
        return;
      }

      if (e.key === "n") {
        e.preventDefault();
        onNewChat();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onNewChat, windowFocus]);

  return (
    <WindowNavShell
      isMobile={isMobileView}
      isScrolled={isScrolled}
      onMouseDown={nav.onDragStart}
      left={nav.navLeft}
      center={isMobileView ? <IosMobileNavTitle>{title}</IosMobileNavTitle> : undefined}
      right={
        <button
          className={cn(
            "desktop:p-2 hover:bg-muted-foreground/10 rounded-lg",
            isMobileView
              ? cn(IOS_MOBILE_ICON_HIT_AREA_CLASS, IOS_MOBILE_TOUCH_ACTIVE_CLASS)
              : ""
          )}
          onClick={onNewChat}
          onMouseDown={(e) => e.stopPropagation()}
          aria-label="New conversation (n)"
        >
          <Icons.new />
        </button>
      }
    />
  );
}
