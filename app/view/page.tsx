import { Suspense } from "react";
import { ViewMediaPage } from "@/components/view-media-page";

export default function ViewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-zinc-950 text-sm text-zinc-500">
          Loading…
        </div>
      }
    >
      <ViewMediaPage />
    </Suspense>
  );
}
