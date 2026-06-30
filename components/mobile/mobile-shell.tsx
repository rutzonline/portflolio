"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { RecentsProvider } from "@/lib/recents-context";
import type { Note as NoteType } from "@/lib/notes/types";
import { APP_SHELL_URL_CHANGE_EVENT } from "@/lib/set-url";
import { getNoteSlugFromShellPathname } from "@/lib/shell-routing";
import { MessagesAppSkeleton } from "@/components/apps/messages/messages-app-skeleton";
import { IosShell } from "./ios/ios-shell";

const NotesApp = dynamic(() => import("@/components/apps/notes/notes-app").then((mod) => mod.NotesApp), {
  ssr: false,
});
const MessagesApp = dynamic(
  () => import("@/components/apps/messages/messages-app").then((mod) => mod.MessagesApp),
  { ssr: false, loading: () => <MessagesAppSkeleton /> }
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

function readActiveNoteSlugFromLocation(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return getNoteSlugFromShellPathname(window.location.pathname);
}

export function MobileShell({ initialApp, initialNoteSlug, initialNote }: MobileShellProps) {
  const [activeNoteSlug, setActiveNoteSlug] = useState<string | undefined>(initialNoteSlug);

  useEffect(() => {
    const syncNoteSlugFromLocation = () => {
      setActiveNoteSlug(readActiveNoteSlugFromLocation());
    };

    syncNoteSlugFromLocation();
    window.addEventListener(APP_SHELL_URL_CHANGE_EVENT, syncNoteSlugFromLocation);
    window.addEventListener("popstate", syncNoteSlugFromLocation);

    return () => {
      window.removeEventListener(APP_SHELL_URL_CHANGE_EVENT, syncNoteSlugFromLocation);
      window.removeEventListener("popstate", syncNoteSlugFromLocation);
    };
  }, []);

  const renderApp = useCallback(
    (appId: string) => {
      switch (appId) {
        case "notes":
          return (
            <NotesApp
              isMobile={true}
              inShell={true}
              initialSlug={activeNoteSlug}
              initialNote={activeNoteSlug === initialNoteSlug ? initialNote : undefined}
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
    [activeNoteSlug, initialNoteSlug, initialNote]
  );

  return (
    <RecentsProvider>
      <IosShell initialApp={initialApp} renderApp={renderApp} />
    </RecentsProvider>
  );
}
