"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ContentFetchError } from "@/components/shared/content-fetch-error";
import { createClient } from "@/utils/supabase/client";
import { ContactCharmsPlayground } from "./contact-charms-playground";
import {
  RESUME_SECTION_HEADING_CLASS,
  resumePanelScrollClass,
} from "./resume-panel-styles";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      className={cn(
        "w-full text-left rounded-xl bg-muted/50 border border-border/50 px-4 py-3 transition-colors",
        "can-hover:hover:border-border can-hover:hover:bg-muted/70"
      )}
    >
      <div className="flex items-center gap-2.5">
        <svg
          aria-hidden
          viewBox="0 0 10 12"
          className={cn(
            "h-3 w-2.5 shrink-0 text-zinc-400/90 dark:text-zinc-500/90 transition-transform duration-200",
            open && "rotate-90"
          )}
        >
          <path
            d="M1.6 1.1c0-.55.6-.9 1.1-.65l6.2 3.4c.5.28.5 1.02 0 1.3L2.7 8.55c-.5.25-1.1-.1-1.1-.65V1.1z"
            fill="currentColor"
          />
        </svg>
        <span className="text-sm text-zinc-800 dark:text-zinc-100">{question}</span>
      </div>
      {open && (
        <p className="mt-2 ml-5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{answer}</p>
      )}
    </button>
  );
}

export function FaqResumePanel({ isMobileView = false }: { isMobileView?: boolean }) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("faqs")
          .select("*")
          .order("order_index", { ascending: true });
        if (error) throw error;
        setFaqs(data || []);
        setFetchError(null);
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
        setFetchError("Couldn't load FAQs. Try refreshing.");
      } finally {
        setLoading(false);
      }
    }
    fetchFAQs();
  }, []);

  return (
    <div className={resumePanelScrollClass(isMobileView, "pt-8")}>
      <div className="max-w-4xl">
        <div className={cn(RESUME_SECTION_HEADING_CLASS, "mb-4")}>
          the questions never stop, do they?
        </div>

        {fetchError && <ContentFetchError message={fetchError} className="mb-4" />}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-muted/50 border border-border/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        )}

        <div className="mt-12">
          <ContactCharmsPlayground />
        </div>
      </div>
    </div>
  );
}
