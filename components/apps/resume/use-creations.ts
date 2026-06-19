"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FALLBACK_CREATIONS, type CreationItem } from "./data";

function normalizeCreation(row: Record<string, unknown>): CreationItem | null {
  const id = String(row.id ?? "");
  const title = String(row.title ?? "");
  const url = String(row.url ?? "");
  const kind = String(row.kind ?? "link");
  if (!id || !title || !url) return null;
  if (!["video", "image", "embed", "link"].includes(kind)) return null;
  return {
    id,
    title,
    kind: kind as CreationItem["kind"],
    url,
    thumbnail_url: row.thumbnail_url != null ? String(row.thumbnail_url) : null,
    platform: row.platform != null ? String(row.platform) : null,
  };
}

export function useCreations() {
  const [items, setItems] = useState<CreationItem[]>(FALLBACK_CREATIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("creations")
          .select("id, title, kind, url, thumbnail_url, platform, sort_order, published")
          .eq("published", true)
          .order("sort_order", { ascending: true });

        if (error) throw error;
        if (!cancelled) {
          const rows = (data ?? [])
            .map((r) => normalizeCreation(r as Record<string, unknown>))
            .filter((r): r is CreationItem => r !== null);
          if (rows.length > 0) setItems(rows);
        }
      } catch {
        if (!cancelled) setItems(FALLBACK_CREATIONS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading };
}
