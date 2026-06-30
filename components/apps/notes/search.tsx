import { RefObject, Dispatch, SetStateAction, useEffect } from "react";
import { Note } from "@/lib/notes/types";
import { Icons } from "./icons";
import { useWindowFocus } from "@/lib/window-focus-context";
import { cn } from "@/lib/utils";
import { IOS_MOBILE_SEARCH_INPUT_CLASS, IOS_MOBILE_SEARCH_WRAPPER_CLASS, IOS_MOBILE_SEARCH_FIELD_CLASS, IOS_MOBILE_SEARCH_ICON_CLASS } from "@/lib/ui-tokens";

interface SearchBarProps {
  notes: Note[];
  onSearchResults: (results: Note[] | null) => void;
  sessionId: string;
  inputRef: RefObject<HTMLInputElement>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setHighlightedIndex: Dispatch<SetStateAction<number>>;
  clearSearch: () => void;
  isMobile?: boolean;
}

export function SearchBar({
  notes,
  onSearchResults,
  sessionId,
  inputRef,
  searchQuery,
  setSearchQuery,
  setHighlightedIndex,
  clearSearch,
  isMobile = false,
}: SearchBarProps) {
  const windowFocus = useWindowFocus();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if this app should handle the shortcut
      // In desktop mode (windowFocus exists), check if this window is focused
      // In standalone mode, check if target is within this app
      if (windowFocus) {
        if (!windowFocus.isFocused) return;
      } else {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-app="notes"]')) return;
      }

      // Handle second Escape press to clear search
      if (e.key === "Escape" && document.activeElement !== inputRef.current && searchQuery) {
        clearSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [inputRef, searchQuery, clearSearch, windowFocus]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      clearSearch();
      return;
    }

    const filteredNotes = notes.filter(
      (note) =>
        (note.public || note.session_id === sessionId) &&
        (note.title.toLowerCase().includes(query.trim().toLowerCase()) ||
          note.content.toLowerCase().includes(query.trim().toLowerCase()))
    );

    onSearchResults(filteredNotes);
    setHighlightedIndex(0);
  };

  return (
    <div className={cn(isMobile ? IOS_MOBILE_SEARCH_WRAPPER_CLASS : "p-2")}>
      <div className="relative">
        <div className={cn("absolute inset-y-0 left-0 flex items-center pointer-events-none", isMobile ? "pl-3" : "pl-3")}>
          <Icons.search className={cn(isMobile ? IOS_MOBILE_SEARCH_ICON_CLASS : "text-muted-foreground")} />
        </div>
        <input
          id="search"
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search"
          className={cn(
            "w-full pl-8 pr-8 focus:outline-none border border-muted-foreground/20 dark:border-none dark:bg-[#353533]",
            isMobile
              ? cn(IOS_MOBILE_SEARCH_INPUT_CLASS, IOS_MOBILE_SEARCH_FIELD_CLASS, "rounded-[10px] pl-9 pr-9")
              : "py-0.5 rounded-lg text-base desktop:text-sm placeholder:text-sm"
          )}
          aria-label="Search notes"
          autoComplete="off"
          ref={inputRef}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <Icons.close className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
