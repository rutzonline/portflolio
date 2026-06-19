"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { CaseStudy, CaseStudyTag } from "@/types/work";
import { FALLBACK_CASE_STUDIES } from "./fallback-data";

function parseTags(raw: unknown): CaseStudyTag[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (t): t is CaseStudyTag =>
      typeof t === "object" &&
      t !== null &&
      typeof (t as CaseStudyTag).label === "string" &&
      typeof (t as CaseStudyTag).color === "string"
  );
}

export function useCaseStudies() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStudies() {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("case_studies")
          .select("*")
          .order("sort_order", { ascending: true });

        if (fetchError) throw fetchError;
        if (cancelled) return;

        const rows = (data ?? []).filter(
          (row) => row.published !== false
        ) as CaseStudy[];

        const mapped = rows.map((row) => ({
          ...row,
          tags: parseTags(row.tags),
        })) as CaseStudy[];

        if (mapped.length === 0) {
          setStudies(FALLBACK_CASE_STUDIES);
        } else {
          setStudies(mapped);
        }
        setError(null);
      } catch (err) {
        if (!cancelled) {
          console.warn("case_studies fetch failed, using fallback:", err);
          setStudies(FALLBACK_CASE_STUDIES);
          setError(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchStudies();
    return () => {
      cancelled = true;
    };
  }, []);

  return { studies, loading, error };
}

export function useCaseStudyBySlug(slug: string | null) {
  const { studies, loading, error } = useCaseStudies();
  const study = slug ? studies.find((s) => s.slug === slug) ?? null : null;
  return { study, loading, error };
}
