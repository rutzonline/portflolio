"use client";

import { RefObject } from "react";
import { Note as NoteType } from "@/lib/notes/types";
import Sidebar from "../sidebar";
import Note from "../note";
import { IosWindowNavBack } from "@/components/mobile/ios/ios-window-nav-back";
import { MobileListBodySkeleton } from "@/components/mobile/ios/mobile-app-skeleton";

interface NotesMobilePresenterProps {
  containerRef: RefObject<HTMLDivElement>;
  handleBackToSidebar: () => void;
  handleNoteCreated: (note: NoteType) => void;
  handleNoteSelect: (note: NoteType) => Promise<void>;
  loading: boolean;
  notes: NoteType[];
  selectedNote: NoteType | null;
  selectedSlugForSidebar: string | null;
  showSidebar: boolean;
}

export function NotesMobilePresenter({
  containerRef,
  handleBackToSidebar,
  handleNoteCreated,
  handleNoteSelect,
  loading,
  notes,
  selectedNote,
  selectedSlugForSidebar,
  showSidebar,
}: NotesMobilePresenterProps) {
  return (
    <div
      ref={containerRef}
      data-app="notes"
      tabIndex={-1}
      onMouseDown={() => containerRef.current?.focus()}
      className="notes-app h-full bg-background text-foreground outline-none"
    >
      {showSidebar ? (
        loading ? (
          <MobileListBodySkeleton />
        ) : (
          <Sidebar
            notes={notes}
            onNoteSelect={handleNoteSelect}
            isMobile={true}
            selectedSlug={selectedSlugForSidebar}
            useCallbackNavigation
            onNoteCreated={handleNoteCreated}
          />
        )
      ) : (
        <div className="h-full">
          {selectedNote && (
            <div className="h-full p-3">
              <Note key={selectedNote.id} note={selectedNote} isMobile={true} onBack={handleBackToSidebar} />
            </div>
          )}
          {!selectedNote && (
            <div className="h-full p-3">
              <IosWindowNavBack canGoBack onBack={handleBackToSidebar} backTitle="Notes" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
