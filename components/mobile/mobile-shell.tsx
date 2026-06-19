"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { RecentsProvider } from "@/lib/recents-context";
import type { Note as NoteType } from "@/lib/notes/types";
import { MobileHomeGrid } from "./mobile-home-grid";

const NotesApp = dynamic(() => import("@/components/apps/notes/notes-app").then((mod) => mod.NotesApp), {
  ssr: false,
});
const MessagesApp = dynamic(
  () => import("@/components/apps/messages/messages-app").then((mod) => mod.MessagesApp),
  { ssr: false }
);
const SettingsApp = dynamic(
  () => import("@/components/apps/settings/settings-app").then((mod) => mod.SettingsApp),
  { ssr: false }
);
const FinderApp = dynamic(
  () => import("@/components/apps/finder/finder-app").then((mod) => mod.FinderApp),
  { ssr: false }
);
const PhotosApp = dynamic(() => import("@/components/apps/photos/photos-app").then((mod) => mod.PhotosApp), {
  ssr: false,
});
const CalendarApp = dynamic(
  () => import("@/components/apps/calendar/calendar-app").then((mod) => mod.CalendarApp),
  { ssr: false }
);
const MusicApp = dynamic(() => import("@/components/apps/music/music-app").then((mod) => mod.MusicApp), {
  ssr: false,
});
const ResumeApp = dynamic(
  () => import("@/components/apps/work/resume-app").then((mod) => mod.ResumeApp),
  { ssr: false }
);

interface MobileShellProps {
  initialApp?: string;
  initialNoteSlug?: string;
  initialNote?: NoteType;
}

export function MobileShell({ initialNoteSlug, initialNote }: MobileShellProps) {
  const renderApp = useCallback(
    (appId: string) => {
      switch (appId) {
        case "notes":
          return (
            <NotesApp
              isMobile={true}
              inShell={false}
              initialSlug={initialNoteSlug}
              initialNote={initialNoteSlug === initialNoteSlug ? initialNote : undefined}
            />
          );
        case "messages":
          return <MessagesApp isMobile={true} inShell={false} />;
        case "settings":
          return <SettingsApp isMobile={true} inShell={false} />;
        case "finder":
          return <FinderApp isMobile={true} inShell={false} onOpenApp={() => {}} />;
        case "photos":
          return <PhotosApp isMobile={true} inShell={false} />;
        case "calendar":
          return <CalendarApp isMobile={true} inShell={false} />;
        case "desk":
          return <MusicApp isMobile={true} />;
        case "resume":
          return <ResumeApp isMobile={true} inShell={false} />;
        default:
          return null;
      }
    },
    [initialNoteSlug, initialNote]
  );

  return (
    <RecentsProvider>
      <MobileHomeGrid renderApp={renderApp} />
    </RecentsProvider>
  );
}
