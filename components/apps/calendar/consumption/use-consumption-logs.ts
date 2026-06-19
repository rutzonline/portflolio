"use client";

import { useState, useEffect, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { createClient } from "@/utils/supabase/client";
import type { ConsumptionLog, ConsumptionCategory } from "@/types/consumption";
import { isConsumptionCategory } from "./category-styles";

export interface ConsumptionLogRange {
  start: string;
  end: string;
}

const FALLBACK_LOGS: ConsumptionLog[] = [
  {
    id: "fb-1",
    consumed_on: "2026-05-30",
    title: "Verifying Agentic Development at Scale",
    url: "https://example.com/agentic-dev",
    category: "article",
    platform: "Substack",
    sort_order: 0,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "fb-2",
    consumed_on: "2026-05-29",
    title: "Building Growth Loops in B2B SaaS",
    url: "https://example.com/growth-loops",
    category: "newsletter",
    platform: "Lenny's Newsletter",
    sort_order: 0,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "fb-3",
    consumed_on: "2026-06-02",
    title: "Notion API Documentation",
    url: "https://developers.notion.com",
    category: "article",
    platform: "Notion",
    sort_order: 0,
    published: true,
    created_at: new Date().toISOString(),
  },
];

const CATEGORY_ALIASES: Record<string, ConsumptionCategory> = {
  youtube: "video",
  doc: "article",
  docs: "article",
  blog: "article",
  tweet: "post",
  tweets: "post",
  x: "post",
};

const yearCache = new Map<number, ConsumptionLog[]>();
const yearFetchPromises = new Map<number, Promise<{ logs: ConsumptionLog[]; fromFallback: boolean }>>();

let allLogsCache: ConsumptionLog[] | null = null;
let allLogsFetchPromise: Promise<{ logs: ConsumptionLog[]; fromFallback: boolean }> | null = null;

function normalizeConsumedOn(value: unknown): string | null {
  if (value == null) return null;
  const raw = String(value);
  const dateOnly = raw.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) return null;
  return dateOnly;
}

function normalizeCategory(raw: unknown): ConsumptionCategory | null {
  const key = String(raw ?? "article").toLowerCase().trim();
  const resolved = CATEGORY_ALIASES[key] ?? key;
  if (isConsumptionCategory(resolved)) return resolved;
  return null;
}

function normalizeRow(row: Record<string, unknown>): ConsumptionLog | null {
  const consumed_on = normalizeConsumedOn(row.consumed_on ?? row.date);
  const category = normalizeCategory(row.category);
  const title = String(row.title ?? "").trim();
  const url = String(row.url ?? "").trim();
  const id = String(row.id ?? "").trim();

  if (!id || !consumed_on || !category || !title || !url) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Skipped consumption_logs row:", row, { id, consumed_on, category, title, url });
    }
    return null;
  }

  const published =
    row.published === undefined || row.published === null ? true : row.published !== false;

  if (!published) return null;

  return {
    id,
    consumed_on,
    title,
    url,
    category,
    platform: row.platform != null ? String(row.platform) : null,
    sort_order: Number(row.sort_order ?? 0),
    published: true,
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}

function filterByRange(logs: ConsumptionLog[], range: ConsumptionLogRange): ConsumptionLog[] {
  return logs.filter((l) => l.consumed_on >= range.start && l.consumed_on <= range.end);
}

async function fetchYearLogs(year: number): Promise<{ logs: ConsumptionLog[]; fromFallback: boolean }> {
  if (yearCache.has(year)) {
    return { logs: yearCache.get(year)!, fromFallback: false };
  }

  const inFlight = yearFetchPromises.get(year);
  if (inFlight) return inFlight;

  const promise = (async () => {
    const start = `${year}-01-01`;
    const end = `${year}-12-31`;

    try {
      const supabase = createClient();

      // Remote table may use `date` instead of `consumed_on` (dashboard-created schema).
      let data: Record<string, unknown>[] | null = null;

      const standard = await supabase
        .from("consumption_logs")
        .select("*")
        .gte("consumed_on", start)
        .lte("consumed_on", end)
        .order("consumed_on", { ascending: false });

      if (!standard.error) {
        data = (standard.data ?? []) as Record<string, unknown>[];
      } else {
        const legacy = await supabase
          .from("consumption_logs")
          .select("*")
          .gte("date", start)
          .lte("date", end)
          .order("date", { ascending: false });

        if (legacy.error) throw legacy.error;
        data = (legacy.data ?? []) as Record<string, unknown>[];
      }

      const rows = (data ?? [])
        .map((row) => normalizeRow(row))
        .filter((row): row is ConsumptionLog => row !== null)
        .sort((a, b) => {
          const byDate = b.consumed_on.localeCompare(a.consumed_on);
          if (byDate !== 0) return byDate;
          return a.sort_order - b.sort_order;
        });

      if (process.env.NODE_ENV === "development" && data && data.length > rows.length) {
        console.warn(
          `consumption_logs: ${data.length - rows.length} row(s) skipped (check category, title, url, consumed_on)`
        );
      }

      yearCache.set(year, rows);
      return { logs: rows, fromFallback: false };
    } catch (err) {
      console.warn("consumption_logs fetch failed, using local fallback:", err);
      const fallback = filterByRange(FALLBACK_LOGS, { start, end });
      return { logs: fallback, fromFallback: true };
    } finally {
      yearFetchPromises.delete(year);
    }
  })();

  yearFetchPromises.set(year, promise);
  return promise;
}

async function fetchAllLogs(): Promise<{ logs: ConsumptionLog[]; fromFallback: boolean }> {
  if (allLogsCache) {
    return { logs: allLogsCache, fromFallback: false };
  }

  if (allLogsFetchPromise) return allLogsFetchPromise;

  allLogsFetchPromise = (async () => {
    try {
      const supabase = createClient();

      let data: Record<string, unknown>[] | null = null;

      const standard = await supabase
        .from("consumption_logs")
        .select("*")
        .order("consumed_on", { ascending: false });

      if (!standard.error) {
        data = (standard.data ?? []) as Record<string, unknown>[];
      } else {
        const legacy = await supabase
          .from("consumption_logs")
          .select("*")
          .order("date", { ascending: false });

        if (legacy.error) throw legacy.error;
        data = (legacy.data ?? []) as Record<string, unknown>[];
      }

      const rows = (data ?? [])
        .map((row) => normalizeRow(row))
        .filter((row): row is ConsumptionLog => row !== null)
        .sort((a, b) => {
          const byDate = b.consumed_on.localeCompare(a.consumed_on);
          if (byDate !== 0) return byDate;
          return a.sort_order - b.sort_order;
        });

      allLogsCache = rows;
      return { logs: rows, fromFallback: false };
    } catch (err) {
      console.warn("consumption_logs (all) fetch failed, using local fallback:", err);
      const fallback = [...FALLBACK_LOGS].sort((a, b) => b.consumed_on.localeCompare(a.consumed_on));
      return { logs: fallback, fromFallback: true };
    } finally {
      allLogsFetchPromise = null;
    }
  })();

  return allLogsFetchPromise;
}

function yearsInRange(range: ConsumptionLogRange): number[] {
  const startYear = Number.parseInt(range.start.slice(0, 4), 10);
  const endYear = Number.parseInt(range.end.slice(0, 4), 10);
  const years: number[] = [];
  for (let y = startYear; y <= endYear; y++) years.push(y);
  return years;
}

export function useConsumptionLogs(range: ConsumptionLogRange) {
  const years = useMemo(() => yearsInRange(range), [range.start, range.end]);
  const yearsKey = years.join(",");
  const [cacheVersion, setCacheVersion] = useState(0);
  const [loading, setLoading] = useState(() => !years.every((y) => yearCache.has(y)));
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const needsFetch = years.some((y) => !yearCache.has(y));
      if (!needsFetch) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await Promise.all(years.map((y) => fetchYearLogs(y)));
        if (!cancelled) {
          setUsingFallback(results.some((r) => r.fromFallback));
          setCacheVersion((v) => v + 1);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Failed to load consumption log");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [yearsKey, years]);

  const logs = useMemo(() => {
    void cacheVersion;
    const merged: ConsumptionLog[] = [];
    for (const y of years) {
      const chunk = yearCache.get(y);
      if (chunk) merged.push(...chunk);
    }
    return filterByRange(merged, range);
  }, [years, range.start, range.end, cacheVersion]);

  const logsByDate = useMemo(() => {
    const map = new Map<string, ConsumptionLog[]>();
    for (const log of logs) {
      const list = map.get(log.consumed_on) ?? [];
      list.push(log);
      map.set(log.consumed_on, list);
    }
    return map;
  }, [logs]);

  const sortedDates = useMemo(
    () => [...logsByDate.keys()].sort((a, b) => b.localeCompare(a)),
    [logsByDate]
  );

  return { logs, logsByDate, sortedDates, loading, error, usingFallback };
}

export function useAllConsumptionLogs() {
  const [cacheVersion, setCacheVersion] = useState(0);
  const [loading, setLoading] = useState(() => allLogsCache === null);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (allLogsCache) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const result = await fetchAllLogs();
        if (!cancelled) {
          setUsingFallback(result.fromFallback);
          setCacheVersion((v) => v + 1);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Failed to load consumption log");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const logs = useMemo(() => {
    void cacheVersion;
    return allLogsCache ?? [];
  }, [cacheVersion]);

  return { logs, loading, error, usingFallback };
}

export function formatConsumptionDateHeader(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "EEEE, MMMM d, yyyy").toUpperCase();
  } catch {
    return dateStr;
  }
}
