import { useEffect, useRef } from "react";
import { Icons } from "./icons";
import { useWindowFocus } from "@/lib/window-focus-context";
import { cn } from "@/lib/utils";
import { IOS_MOBILE_SEARCH_INPUT_CLASS, IOS_MOBILE_SEARCH_WRAPPER_CLASS } from "@/lib/ui-tokens";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isMobileView?: boolean;
}

export function SearchBar({ value, onChange, isMobileView = false }: SearchBarProps) {
  const justBlurred = useRef(false);
  const windowFocus = useWindowFocus();

  useEffect(() => {
    const handleGlobalEscape = (e: KeyboardEvent) => {
      if (windowFocus) {
        if (!windowFocus.isFocused) return;
      } else {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-app="messages"]')) return;
      }

      if (e.key === "Escape") {
        const searchInput = document.querySelector(
          "[data-messages-search]"
        );
        if (
          document.activeElement !== searchInput &&
          value &&
          !justBlurred.current
        ) {
          onChange("");
        }
        justBlurred.current = false;
      }
    };

    window.addEventListener("keydown", handleGlobalEscape);
    return () => window.removeEventListener("keydown", handleGlobalEscape);
  }, [value, onChange, windowFocus]);

  return (
    <div className={cn(isMobileView ? IOS_MOBILE_SEARCH_WRAPPER_CLASS : "p-2")}>
      <div className="relative">
        <Icons.search
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2",
            isMobileView ? "text-[#8E8E93]" : "text-muted-foreground"
          )}
        />
        <input
          type="text"
          data-messages-search
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              if (document.activeElement === e.currentTarget) {
                justBlurred.current = true;
                e.currentTarget.blur();
                setTimeout(() => {
                  justBlurred.current = false;
                }, 0);
              }
            }
          }}
          placeholder={isMobileView ? "search" : "Search"}
          className={cn(
            "w-full focus:outline-none",
            isMobileView
              ? cn(
                  IOS_MOBILE_SEARCH_INPUT_CLASS,
                  "pl-9 pr-9 bg-[#1C1C1E] placeholder:text-[#8E8E93] text-foreground"
                )
              : "pl-8 pr-8 py-0.5 rounded-lg text-base desktop:text-sm placeholder:text-sm placeholder:text-muted-foreground bg-[#E8E8E7] dark:bg-[#353533]"
          )}
        />
        {isMobileView ? (
          <Icons.mic className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8E8E93]" />
        ) : (
          value && (
            <button
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <Icons.close className="h-4 w-4" />
            </button>
          )
        )}
      </div>
    </div>
  );
}
