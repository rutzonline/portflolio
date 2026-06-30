"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Note as NoteType } from "@/lib/notes/types";
import { withDisplayCreatedAtForNotes } from "@/lib/notes/display-created-at";
import { getCachedValue, getOrFetch } from "@/lib/mobile-supabase-cache";

const NOTES_CACHE_KEY = "notes:sidebar";

interface NotesCachePayload {
  notes: NoteType[];
  notesForFallback: NoteType[];
  sessionIdForSidebar: string;
  sessionNotesForSidebar: NoteType[];
}

export function useNotesData() {
  const cached = getCachedValue<NotesCachePayload>(NOTES_CACHE_KEY);
  const [notes, setNotes] = useState<NoteType[]>(cached?.notes ?? []);
  const [notesForFallback, setNotesForFallback] = useState<NoteType[]>(cached?.notesForFallback ?? []);
  const [sessionIdForSidebar, setSessionIdForSidebar] = useState<string>(cached?.sessionIdForSidebar ?? "");
  const [sessionNotesForSidebar, setSessionNotesForSidebar] = useState<NoteType[]>(
    cached?.sessionNotesForSidebar ?? []
  );
  const [loading, setLoading] = useState(!cached);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let cancelled = false;

    async function fetchNotes() {
      try {
        const { promise } = getOrFetch<NotesCachePayload>(NOTES_CACHE_KEY, async () => {
          const sessionId =
            typeof window !== "undefined" ? localStorage.getItem("session_id") : null;

          const [publicResult, sessionResult] = await Promise.all([
            supabase
              .from("notes")
              .select("*")
              .eq("public", true)
              .order("created_at", { ascending: false }),
            sessionId
              ? supabase.rpc("select_session_notes", { session_id_arg: sessionId })
              : Promise.resolve({ data: [] as NoteType[] }),
          ]);

          const publicNotes = (publicResult.data as NoteType[] | null) ?? [];
          const sessionNotes = (sessionResult.data as NoteType[] | null) ?? [];
          const normalizedSessionNotes = withDisplayCreatedAtForNotes(sessionNotes);
          const allNotes = [...publicNotes, ...sessionNotes];
          const uniqueBySlug = new Map<string, NoteType>();
          for (const note of allNotes) {
            uniqueBySlug.set(note.slug, note);
          }

          return {
            sessionIdForSidebar: sessionId ?? "",
            sessionNotesForSidebar: normalizedSessionNotes,
            notes: withDisplayCreatedAtForNotes(publicNotes),
            notesForFallback: withDisplayCreatedAtForNotes(Array.from(uniqueBySlug.values())),
          };
        });

        const payload = await promise;
        if (cancelled) return;

        setSessionIdForSidebar(payload.sessionIdForSidebar);
        setSessionNotesForSidebar(payload.sessionNotesForSidebar);
        setNotes(payload.notes);
        setNotesForFallback(payload.notesForFallback);
      } catch (error) {
        console.error("Failed to fetch notes for sidebar/fallback selection:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchNotes();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  return {
    loading,
    notes,
    notesForFallback,
    sessionIdForSidebar,
    sessionNotesForSidebar,
    supabase,
  };
}
