import { AppShellPage } from "@/lib/desktop/app-shell-page";
import { getPreviewMetadataFromPath } from "@/lib/preview-utils";
import { resolveFinderFileParam } from "@/lib/finder-file-slugs";

type PageProps = {
  searchParams: Promise<{ file?: string }>;
};

export default async function PreviewPage({ searchParams }: PageProps) {
  const { file } = await searchParams;
  const resolved = file ? resolveFinderFileParam(file) : undefined;
  if (!resolved || !getPreviewMetadataFromPath(resolved)) {
    return <AppShellPage appId="preview" />;
  }
  return <AppShellPage appId="preview" initialPreviewFile={resolved} />;
}
