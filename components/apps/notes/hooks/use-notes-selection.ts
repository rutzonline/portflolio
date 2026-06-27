"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Note as NoteType } from "@/lib/notes/types";
import { saveNotesSelectedSlug } from "@/lib/sidebar-persistence";
import {
  getNoteSlugFromShellPathname,
  SHELL_DEFAULT_NOTE_SLUG,
  SHELL_NOTES_ROOT_PATH,
} from "@/lib/shell-routing";
import { setUrl } from "@/lib/set-url";
import {
  setNotesSelectedSlugMemory,
} from "@/lib/notes/selection-state";
import { groupNotesByCategory, sortGroupedNotes } from "@/lib/notes/note-utils";
import {
  withDisplayCreatedAt,
} from "@/lib/notes/display-created-at";

// Module state survives Notes unmount/remount within a single page session.
// It resets on hard refresh/navigation.
const SIDEBAR_CATEGORY_ORDER = ["pinned", "today", "yesterday", "7", "30", "older"] as const;

function getPinnedSlugsForFallback(notes: NoteType[]): Set<string> {
  const defaultPinned = new Set(
    notes
      .filter((note) => note.slug === "about-me" || note.slug === "quick-links")
      .map((note) => note.slug)
  );

  if (typeof window === "undefined") {
    return defaultPinned;
  }

  try {
    const raw = sessionStorage.getItem("pinnedNotes");
    if (!raw) return defaultPinned;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultPinned;
    return new Set(parsed.filter((slug): slug is string => typeof slug === "string"));
  } catch {
    return defaultPinned;
  }
}

function getDefaultNoteSlug(notes: NoteType[]): string | undefined {
  if (notes.length === 0) return undefined;

  const aboutMe = notes.find((note) => note.slug === SHELL_DEFAULT_NOTE_SLUG);
  if (aboutMe) return aboutMe.slug;

  return getTopmostNoteSlug(notes);
}

function findNoteInLists(
  slug: string,
  notes: NoteType[],
  notesForFallback: NoteType[]
): NoteType | undefined {
  return (
    notesForFallback.find((note) => note.slug === slug) ??
    notes.find((note) => note.slug === slug)
  );
}

function getTopmostNoteSlug(notes: NoteType[]): string | undefined {
  if (notes.length === 0) return undefined;

  const pinnedSlugs = getPinnedSlugsForFallback(notes);
  const grouped = groupNotesByCategory(notes, pinnedSlugs);
  sortGroupedNotes(grouped);

  for (const category of SIDEBAR_CATEGORY_ORDER) {
    const firstNote = grouped[category]?.[0];
    if (firstNote?.slug) return firstNote.slug;
  }

  return notes[0]?.slug;
}

function isNotesRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === SHELL_NOTES_ROOT_PATH ||
    pathname.startsWith(`${SHELL_NOTES_ROOT_PATH}/`)
  );
}

interface UseNotesSelectionArgs {
  initialNote?: NoteType;
  isMobile: boolean;
  isWindowFocused: boolean;
  loading: boolean;
  notes: NoteType[];
  notesForFallback: NoteType[];
  supabase: ReturnType<typeof createClient>;
}

export function useNotesSelection({
  initialNote,
  isMobile,
  isWindowFocused,
  loading,
  notes,
  notesForFallback,
  supabase,
}: UseNotesSelectionArgs) {
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(
    initialNote ? withDisplayCreatedAt(initialNote) : null
  );
  const [noteLoadError, setNoteLoadError] = useState<string | null>(null);
  const selectedSlugRef = useRef<string | undefined>(selectedNote?.slug);
  const syncCancelledRef = useRef(false);

  const canUpdateNotesUrl = useCallback(() => {
    if (isWindowFocused) return true;
    if (typeof window === "undefined") return false;
    return isNotesRoute(window.location.pathname);
  }, [isWindowFocused]);

  const safeSetNotesUrl = useCallback((url: string) => {
    if (canUpdateNotesUrl()) {
      setUrl(url);
    }
  }, [canUpdateNotesUrl]);

  const persistDesktopSelection = useCallback((slug: string) => {
    if (isMobile) return;
    setNotesSelectedSlugMemory(slug);
    saveNotesSelectedSlug(slug);
  }, [isMobile]);

  useEffect(() => {
    setSelectedNote((current) => (current ? withDisplayCreatedAt(current) : current));
  }, []);

  useEffect(() => {
    const slug = selectedNote?.slug;
    selectedSlugRef.current = slug;
    if (!isMobile && slug) {
      persistDesktopSelection(slug);
    }
  }, [isMobile, persistDesktopSelection, selectedNote]);

  useEffect(() => {
    if (loading) return;

    let cancelled = false;
    syncCancelledRef.current = false;

    const isCancelled = () => cancelled || syncCancelledRef.current;

    async function syncSelectedNote() {
      const routeSlug = getNoteSlugFromShellPathname(window.location.pathname);
      const availableNotes = notesForFallback.length > 0 ? notesForFallback : notes;
      const defaultSlug = getDefaultNoteSlug(availableNotes);

      if (isMobile && !routeSlug) {
        setSelectedNote(null);
        return;
      }

      const targetSlug = routeSlug || defaultSlug;
      if (!targetSlug) {
        setSelectedNote(null);
        return;
      }

      if (selectedNote?.slug === targetSlug) {
        return;
      }

      const listNote = findNoteInLists(targetSlug, notes, notesForFallback);
      if (listNote) {
        setSelectedNote(withDisplayCreatedAt(listNote));
        persistDesktopSelection(targetSlug);
        if (!isMobile) {
          const expectedPath = `/notes/${encodeURIComponent(targetSlug)}`;
          if (window.location.pathname !== expectedPath) {
            safeSetNotesUrl(expectedPath);
          }
        }
      }

      const { data: fullNote, error: fullNoteError } = await supabase
        .rpc("select_note", { note_slug_arg: targetSlug })
        .single();

      if (isCancelled()) return;

      if (fullNoteError) {
        console.error("Failed to load note:", fullNoteError);
      }

      if (fullNote) {
        setNoteLoadError(null);
        persistDesktopSelection(targetSlug);
        setSelectedNote(withDisplayCreatedAt(fullNote as NoteType));
        if (!isMobile) {
          const expectedPath = `/notes/${encodeURIComponent(targetSlug)}`;
          if (window.location.pathname !== expectedPath) {
            safeSetNotesUrl(expectedPath);
          }
        }
        return;
      }

      if (defaultSlug && defaultSlug !== targetSlug) {
        const { data: defaultFullNote, error: defaultNoteError } = await supabase
          .rpc("select_note", { note_slug_arg: defaultSlug })
          .single();

        if (isCancelled()) return;

        if (defaultNoteError) {
          console.error("Failed to load default note:", defaultNoteError);
        }

        const defaultListNote = findNoteInLists(defaultSlug, notes, notesForFallback);
        if (defaultFullNote || defaultListNote) {
          setNoteLoadError(null);
          persistDesktopSelection(defaultSlug);
          setSelectedNote(
            withDisplayCreatedAt(
              (defaultFullNote as NoteType | null) ??
                defaultListNote!
            )
          );
          safeSetNotesUrl(`/notes/${encodeURIComponent(defaultSlug)}`);
          return;
        }
      }

      if (!listNote) {
        setSelectedNote(null);
        if (fullNoteError) {
          setNoteLoadError("Couldn't load this note. Try refreshing.");
        }
      } else if (fullNoteError) {
        setNoteLoadError(null);
      }
    }

    void syncSelectedNote();

    return () => {
      cancelled = true;
    };
  }, [
    isMobile,
    loading,
    notes,
    notesForFallback,
    persistDesktopSelection,
    safeSetNotesUrl,
    selectedNote?.slug,
    supabase,
  ]);

  const handleNoteSelect = useCallback(async (note: NoteType) => {
    selectedSlugRef.current = note.slug;
    persistDesktopSelection(note.slug);
    setUrl(`/notes/${note.slug}`);
    setSelectedNote(withDisplayCreatedAt(note));

    const { data: fullNote, error: fullNoteError } = await supabase
      .rpc("select_note", { note_slug_arg: note.slug })
      .single();

    if (fullNoteError) {
      console.error("Failed to load note:", fullNoteError);
      if (!fullNote) {
        setNoteLoadError("Couldn't load this note. Try refreshing.");
      }
    } else {
      setNoteLoadError(null);
    }

    if (fullNote) {
      setSelectedNote((current) => (
        current?.slug === note.slug
          ? withDisplayCreatedAt(fullNote as NoteType)
          : current
      ));
    }
  }, [persistDesktopSelection, supabase]);

  const handleBackToSidebar = useCallback(() => {
    syncCancelledRef.current = true;
    selectedSlugRef.current = undefined;
    setSelectedNote(null);
    if (isMobile) {
      setUrl("/notes");
    }
  }, [isMobile]);

  const handleNoteCreated = useCallback((note: NoteType) => {
    selectedSlugRef.current = note.slug;
    persistDesktopSelection(note.slug);
    setSelectedNote(withDisplayCreatedAt(note));
    setUrl(`/notes/${note.slug}`);
  }, [persistDesktopSelection]);

  const selectedSlugForSidebar = selectedNote?.slug ?? null;

  return {
    handleBackToSidebar,
    handleNoteCreated,
    handleNoteSelect,
    noteLoadError,
    selectedNote,
    selectedSlugForSidebar,
  };
}
