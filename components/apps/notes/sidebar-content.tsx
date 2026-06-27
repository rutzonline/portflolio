import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { NoteItem } from "./note-item";
import { Note } from "@/lib/notes/types";
import {
  IosMobileListGroup,
  IosMobileListSectionLabel,
} from "@/components/mobile/ios/ios-mobile-list";

interface SidebarContentProps {
  groupedNotes: Record<string, Note[]>;
  selectedNoteSlug: string | null;
  onNoteSelect: (note: Note) => void;
  sessionId: string;
  handlePinToggle: (slug: string) => void;
  pinnedNotes: Set<string>;
  localSearchResults: Note[] | null;
  highlightedIndex: number;
  categoryOrder: string[];
  labels: Record<string, React.ReactNode>;
  handleNoteDelete: (note: Note) => Promise<void>;
  openSwipeItemSlug: string | null;
  setOpenSwipeItemSlug: React.Dispatch<React.SetStateAction<string | null>>;
  clearSearch: () => void;
  setSelectedNoteSlug: (slug: string | null) => void;
  useCallbackNavigation?: boolean;
  isMobile?: boolean;
}

export function SidebarContent({
  groupedNotes,
  selectedNoteSlug,
  onNoteSelect,
  sessionId,
  handlePinToggle,
  pinnedNotes,
  localSearchResults,
  highlightedIndex,
  categoryOrder,
  labels,
  handleNoteDelete,
  openSwipeItemSlug,
  setOpenSwipeItemSlug,
  clearSearch,
  setSelectedNoteSlug,
  useCallbackNavigation = false,
  isMobile = false,
}: SidebarContentProps) {
  const router = useRouter();

  const allNotes = useMemo(() => {
    return Object.values(groupedNotes).flat();
  }, [groupedNotes]);

  const handlePinToggleWithClear = useCallback(
    (slug: string) => {
      clearSearch();
      handlePinToggle(slug);
    },
    [clearSearch, handlePinToggle]
  );

  const handleEdit = useCallback(
    (slug: string) => {
      clearSearch();
      if (isMobile) {
        const note = allNotes.find((n) => n.slug === slug);
        if (note) onNoteSelect(note);
      } else {
        router.push(`/notes/${slug}`);
        setSelectedNoteSlug(slug);
      }
    },
    [clearSearch, router, setSelectedNoteSlug, isMobile, allNotes, onNoteSelect]
  );

  const handleDelete = useCallback(
    async (note: Note) => {
      clearSearch();
      await handleNoteDelete(note);
    },
    [clearSearch, handleNoteDelete]
  );

  const renderNoteItem = (item: Note, index: number, total: number, isSearching: boolean) => (
    <NoteItem
      key={isSearching ? item.id : `${item.slug}-${index}`}
      item={item}
      selectedNoteSlug={selectedNoteSlug}
      sessionId={sessionId}
      onNoteSelect={onNoteSelect}
      handlePinToggle={isSearching ? handlePinToggleWithClear : handlePinToggle}
      isPinned={pinnedNotes.has(item.slug)}
      isHighlighted={isSearching && index === highlightedIndex}
      isSearching={isSearching}
      handleNoteDelete={isSearching ? handleDelete : handleNoteDelete}
      onNoteEdit={handleEdit}
      openSwipeItemSlug={openSwipeItemSlug}
      setOpenSwipeItemSlug={setOpenSwipeItemSlug}
      showDivider={index < total - 1}
      useCallbackNavigation={useCallbackNavigation}
      isMobileView={isMobile}
    />
  );

  if (isMobile) {
    return (
      <div className="pb-4">
        {localSearchResults === null ? (
          <nav>
            {categoryOrder.map((categoryKey) => {
              const items = groupedNotes[categoryKey];
              if (!items || items.length === 0) return null;

              return (
                <section key={categoryKey}>
                  <IosMobileListSectionLabel className="px-0 pt-4 pb-1 first:pt-1">
                    {labels[categoryKey as keyof typeof labels]}
                  </IosMobileListSectionLabel>
                  <IosMobileListGroup>
                    {items.map((item, index) => renderNoteItem(item, index, items.length, false))}
                  </IosMobileListGroup>
                </section>
              );
            })}
          </nav>
        ) : localSearchResults.length > 0 ? (
          <IosMobileListGroup>
            {localSearchResults.map((item, index) =>
              renderNoteItem(item, index, localSearchResults.length, true)
            )}
          </IosMobileListGroup>
        ) : (
          <p className="px-4 text-[13px] text-muted-foreground mt-4">No results found</p>
        )}
      </div>
    );
  }

  return (
    <div className="py-2">
      {localSearchResults === null ? (
        <nav>
          {categoryOrder.map((categoryKey) =>
            groupedNotes[categoryKey] && groupedNotes[categoryKey].length > 0 ? (
              <section key={categoryKey}>
                <h3 className="py-1 text-xs font-bold text-muted-foreground ml-2">
                  {labels[categoryKey as keyof typeof labels]}
                </h3>
                <ul>
                  {groupedNotes[categoryKey].map((item: Note, index: number) =>
                    renderNoteItem(item, index, groupedNotes[categoryKey].length, false)
                  )}
                </ul>
              </section>
            ) : null
          )}
        </nav>
      ) : localSearchResults.length > 0 ? (
        <ul>
          {localSearchResults.map((item: Note, index: number) =>
            renderNoteItem(item, index, localSearchResults.length, true)
          )}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground px-2 mt-4">No results found</p>
      )}
    </div>
  );
}
