/** Lightweight in-memory cache for stable mobile Supabase reads (survives app remounts). */

export function getCachedValue<T>(key: string): T | null {
  return (cache.get(key) as T | undefined) ?? null;
}

export function setCachedValue<T>(key: string, value: T): void {
  cache.set(key, value);
}

export function getOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>
): { value: T | null; promise: Promise<T> } {
  const cached = getCachedValue<T>(key);
  if (cached != null) {
    return { value: cached, promise: Promise.resolve(cached) };
  }

  let promise = inflight.get(key) as Promise<T> | undefined;
  if (!promise) {
    promise = fetcher().then((result) => {
      setCachedValue(key, result);
      inflight.delete(key);
      return result;
    });
    inflight.set(key, promise);
  }

  return { value: null, promise };
}

const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();
