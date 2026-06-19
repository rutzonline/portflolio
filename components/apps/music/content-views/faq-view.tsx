"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((prev) => !prev)}
      className="w-full text-left rounded-xl bg-muted/50 border border-border/50 hover:border-border transition-all px-4 py-3"
    >
      <div className="flex items-center gap-3">
        <ChevronRight className={cn("w-3.5 h-3.5 text-muted-foreground flex-shrink-0 transition-transform duration-200", open && "rotate-90")} />
        <span className="text-sm font-medium">{question}</span>
      </div>
      {open && (
        <p className="mt-2 ml-6 text-sm text-muted-foreground leading-relaxed">
          {answer}
        </p>
      )}
    </button>
  );
}

interface FAQViewProps {
  isMobileView: boolean;
}

export function FAQView({ isMobileView }: FAQViewProps) {
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
    <ScrollArea className="h-full" bottomMargin="0">
      <div className={cn("p-6", isMobileView && "p-4 pb-20")}>
        <h2 className="text-lg font-semibold mb-1">Frequently Asked Questions</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Things people ask. Answered honestly (mostly).
        </p>

        {loading ? (
          <div className={cn("grid gap-3", isMobileView ? "grid-cols-1" : "grid-cols-2")}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className={cn("grid gap-3", isMobileView ? "grid-cols-1" : "grid-cols-2")}>
            {faqs.map((faq) => (
              <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
