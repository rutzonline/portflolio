import { AppShellPage } from "@/lib/desktop/app-shell-page";
import { INTRO_DOC_PATH } from "@/lib/file-route-utils";

export default function ReadmePage() {
  return <AppShellPage appId="textedit" initialTextEditFile={INTRO_DOC_PATH} />;
}
