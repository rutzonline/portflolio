"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

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
      className="w-full text-left rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 px-4 py-3 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
    >
      <div className="flex items-start gap-2">
        <ChevronRight
          className={cn(
            "w-3.5 h-3.5 text-zinc-400 flex-shrink-0 mt-0.5 transition-transform duration-200",
            open && "rotate-90"
          )}
        />
        <span className="text-sm text-zinc-800 dark:text-zinc-100">{question}</span>
      </div>
      {open && (
        <p className="mt-2 ml-5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{answer}</p>
      )}
    </button>
  );
}

export function FaqResumePanel() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFAQs();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-background">
      <div className="max-w-3xl space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">FAQs</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
