"use client";

import dynamic from "next/dynamic";
import { Desktop } from "@/components/desktop/desktop";
import { useShellIsMobile } from "@/lib/use-shell-is-mobile";

const MobileShell = dynamic(
  () => import("@/components/mobile/mobile-shell").then((mod) => mod.MobileShell),
  { ssr: false }
);

interface AppShellPageProps {
  appId?: string;
  initialNoteSlug?: string;
  initialTextEditFile?: string;
  initialPreviewFile?: string;
}

export function AppShellPage({
  appId,
  initialNoteSlug,
  initialTextEditFile,
  initialPreviewFile,
}: AppShellPageProps) {
  const isMobile = useShellIsMobile();

  if (isMobile === null) return null;

  if (isMobile) {
    return <MobileShell initialApp={appId} initialNoteSlug={initialNoteSlug} />;
  }

  return (
    <Desktop
      initialAppId={appId}
      initialNoteSlug={initialNoteSlug}
      initialTextEditFile={initialTextEditFile}
      initialPreviewFile={initialPreviewFile}
    />
  );
}
