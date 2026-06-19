import { redirect } from "next/navigation";
import { AppShellPage } from "@/lib/desktop/app-shell-page";
import { isSupportedTextEditPath } from "@/lib/file-route-utils";
import { isIntroDocPath } from "@/lib/intro-doc";
import { resolveFinderFileParam } from "@/lib/finder-file-slugs";

type PageProps = {
  searchParams: Promise<{ file?: string }>;
};

export default async function TextEditPage({ searchParams }: PageProps) {
  const { file } = await searchParams;
  const resolved = file ? resolveFinderFileParam(file) : undefined;
  if (resolved && isIntroDocPath(resolved)) {
    redirect("/readme");
  }
  if (!resolved || !isSupportedTextEditPath(resolved)) {
    return <AppShellPage appId="textedit" />;
  }
  return <AppShellPage appId="textedit" initialTextEditFile={resolved} />;
}
