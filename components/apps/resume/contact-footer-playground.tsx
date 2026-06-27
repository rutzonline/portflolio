"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import {
  RESUME_PANEL_FILL_CLASS,
  RESUME_SECTION_HEADING_CLASS,
  RESUME_SECTION_LEAD_CLASS,
} from "./resume-panel-styles";

const TOAST_MS = 1200;

type ToastKind = "done" | "rude" | "error";

const TOAST_IMAGES: Record<"done" | "rude", string> = {
  done: "/done!.png",
  rude: "/rude!.png",
};

export function ContactFooterPlayground() {
  const [feedback, setFeedback] = useState("");
  const [toast, setToast] = useState<ToastKind | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((kind: ToastKind) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(kind);
    toastTimerRef.current = setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  const handleSubmit = useCallback(async () => {
    const text = feedback.trim();
    if (!text) return;

    setFeedback("");
    showToast("done");

    try {
      const supabase = createClient();
      const { error } = await supabase.from("portfolio_notes").insert([{ content: text }]);
      if (error) throw error;
    } catch {
      setFeedback(text);
      showToast("error");
    }
  }, [feedback, showToast]);

  return (
    <div className="relative">
      <div className={RESUME_SECTION_HEADING_CLASS}>you could also</div>
      <p className={cn(RESUME_SECTION_LEAD_CLASS, "mt-1 mb-2 text-zinc-600/90 dark:text-zinc-400/90")}>
        share a note, any feedback, or your favourites to win the FIFA World Cup!
      </p>

      <div className="max-w-lg px-3 mt-4">
        <div className="relative">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="type here..."
            rows={3}
            className={cn(
              "w-full resize-none rounded-lg border",
              "border-zinc-200/80 dark:border-zinc-700/45",
              RESUME_PANEL_FILL_CLASS,
              "px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100",
              "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
              "outline-none focus:border-zinc-300 dark:focus:border-zinc-600 transition-colors"
            )}
          />
        </div>

        <div className="flex items-center justify-between mt-2.5 w-full">
          <button
            type="button"
            onClick={() => void handleSubmit()}
            className="text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:text-zinc-100 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors"
          >
            submit
          </button>
          <button
            type="button"
            onClick={() => {
              setFeedback("");
              showToast("rude");
            }}
            className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors"
          >
            no, thank you.
          </button>
        </div>

        <div
          className="mt-6 flex min-h-[2.75rem] w-full items-center justify-center"
          aria-live="polite"
        >
          {toast === "done" || toast === "rude" ? (
            <Image
              src={TOAST_IMAGES[toast]}
              alt={toast === "done" ? "done!" : "rude!"}
              width={90}
              height={36}
              unoptimized
              className="h-auto w-auto max-h-9 object-contain pointer-events-none select-none"
            />
          ) : toast === "error" ? (
            <p className="text-xs text-red-600/90 dark:text-red-400/90 text-center">
              couldn&apos;t save — try again?
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
