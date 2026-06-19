"use client";

/**
 * PhotoTrail — desktop icon that spawns a cursor-trail of album cover images.
 * Fetches recent tracks from Last.fm (rutzonline) and uses album art as trail images.
 * Click a trail card to flip it and reveal the song name + artist.
 * Double-click anywhere to stop the trail.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
export const PHOTO_STACK_ICON_PATH = "/desktop/photo-stack.png";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface TrackData {
  src: string;       // album art URL
  song: string;      // track name
  artist: string;    // artist name
}

interface TrailCard {
  id: number;
  src: string;
  song: string;
  artist: string;
  x: number;
  y: number;
  rot: number;
  zIndex: number;
  flipped: boolean;
  fading: boolean;
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
const SETTINGS = {
  minDistance: 100,
  maxVisible: 6,
  fadeAfterMs: 500,
  fadeJitterMs: 800,
  flippedHoldMs: 4000,
  width: 200,
  height: 200,
  maxRotationDeg: 0,
} as const;

// ─── LAST.FM FETCH ───────────────────────────────────────────────────────────
async function fetchRecentTracks(): Promise<TrackData[]> {
  try {
    const res = await fetch("/api/lastfm/recent-tracks");
    if (!res.ok) {
      console.warn(`PhotoTrail: API returned ${res.status}`);
      return [];
    }
    const data = (await res.json()) as { tracks?: TrackData[]; error?: string };
    if (data.error) {
      console.warn("PhotoTrail:", data.error);
    }
    return data.tracks ?? [];
  } catch (err) {
    console.warn("PhotoTrail: failed to fetch Last.fm tracks", err);
    return [];
  }
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function buildShuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function probeImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

// ─── TRAIL CARD ELEMENT ───────────────────────────────────────────────────────
function TrailCardEl({
  card,
  onFlip,
}: {
  card: TrailCard;
  onFlip: (id: number, e: React.MouseEvent) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const { width: W, height: H } = SETTINGS;

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setMounted(true))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const visible = mounted && !card.fading;

  return (
    <div
      onClick={(e) => onFlip(card.id, e)}
      style={{
        position: "fixed",
        left: card.x,
        top: card.y,
        width: W,
        height: H,
        zIndex: card.zIndex,
        pointerEvents: "auto",
        cursor: "pointer",
        perspective: 600,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.85)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: card.flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1)",
        }}
      >
        {/* FRONT — album art */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 4,
            overflow: "hidden",
            transform: `rotate(${card.rot}deg)`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.src}
            alt={`${card.song} by ${card.artist}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              pointerEvents: "none",
              userSelect: "none",
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {/* BACK — song name + artist (stays until manually closed) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: `rotateY(180deg) rotate(${card.rot}deg)`,
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
            background: "#0d0d0d",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 24px",
            gap: 8,
            pointerEvents: "auto",
          }}
        >
          {/* X button — click to un-flip and resume fade */}
          <button
            onClick={(e) => onFlip(card.id, e)}
            style={{
              position: "absolute",
              top: 8, right: 8,
              width: 20, height: 20,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.4)",
              fontSize: 10,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.18)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)";
            }}
          >
            ✕
          </button>
          {/* Small music note icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            style={{ opacity: 0.35, flexShrink: 0 }}
          >
            <path
              d="M6 14V5.5l8-2V12"
              stroke="#e8d5b7"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="4.5" cy="14" r="2" fill="#e8d5b7" />
            <circle cx="12.5" cy="12" r="2" fill="#e8d5b7" />
          </svg>

          {/* Song name */}
          <p
            style={{
              fontFamily: "'DM Serif Display', 'Georgia', serif",
              fontSize: 15,
              color: "#e8d5b7",
              lineHeight: 1.4,
              textAlign: "center",
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {card.song}
          </p>

          {/* Artist name */}
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 400,
              color: "rgba(232,213,183,0.5)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: 0,
              textAlign: "center",
            }}
          >
            {card.artist}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── HELP NOTE ────────────────────────────────────────────────────────────────
function TrailHelpNote({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed z-[55] pointer-events-none" style={{ left: 20, top: 56 }}>
      <div
        role="note"
        className={cn(
          "pointer-events-auto relative w-[240px] rounded-xl overflow-hidden",
          "bg-zinc-800/90 backdrop-blur-xl border border-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        )}
      >
        <button
          type="button"
          aria-label="close"
          onClick={onDismiss}
          style={{
            position: "absolute", top: 8, right: 10,
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.3)", fontSize: 14, lineHeight: 1,
            padding: 2,
          }}
        >
          ✕
        </button>
        <div className="px-4 py-4 space-y-1.5">
          <p className="text-[12px] text-zinc-300 leading-snug m-0">move the cursor around</p>
          <p className="text-[12px] text-zinc-300 leading-snug m-0">click any cover to reveal the song</p>
          <p className="text-[12px] text-zinc-300 leading-snug m-0">double-click to stop trailing</p>
        </div>
      </div>
    </div>
  );
}

// ─── FALLBACK ICON (if photo-stack.png missing) ───────────────────────────────
function FallbackStackIcon({ active }: { active: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <rect x="4" y="8" width="22" height="16" rx="2" fill="rgba(255,255,255,0.15)" transform="rotate(-8 4 8)" />
        <rect x="6" y="10" width="22" height="16" rx="2" fill="rgba(255,255,255,0.22)" transform="rotate(-3 6 10)" />
        <rect x="8" y="11" width="22" height="16" rx="2" fill={active ? "rgba(255,220,100,0.85)" : "rgba(255,255,255,0.85)"} />
        <path d="M14 19V13l8-2v5" stroke={active ? "#c68a00" : "#bca882"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12.5" cy="19" r="2" fill={active ? "#c68a00" : "#bca882"} />
        <circle cx="20.5" cy="17" r="2" fill={active ? "#c68a00" : "#bca882"} />
      </svg>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
type CardFadeTimers = {
  fadeOut: number;
  remove: number | null;
};

export function PhotoTrail() {
  const [active, setActive] = useState(false);
  const [cards, setCards] = useState<TrailCard[]>([]);
  const [trackPool, setTrackPool] = useState<TrackData[]>([]);
  const [stackIconVisible, setStackIconVisible] = useState(false);
  const [showHelpNote, setShowHelpNote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const mouseRef = useRef({ x: 0, y: 0 });
  const lagRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const lastSpawnRef = useRef({ x: -999, y: -999 });
  const zCounterRef = useRef(100);
  const cardIdRef = useRef(0);
  const shuffledRef = useRef<TrackData[]>([]);
  const shuffleIdxRef = useRef(0);
  const fadeTimersRef = useRef<Map<number, CardFadeTimers>>(new Map());

  const clearCardTimers = useCallback((id: number) => {
    const timers = fadeTimersRef.current.get(id);
    if (!timers) return;
    clearTimeout(timers.fadeOut);
    if (timers.remove !== null) clearTimeout(timers.remove);
    fadeTimersRef.current.delete(id);
  }, []);

  const scheduleCardFade = useCallback(
    (id: number, delayMs: number) => {
      // cancel any existing timers for this card first
      clearCardTimers(id);

      // Use a container object so the remove timer id can be stored
      // back into the same map entry after fadeOut fires
      const timers: CardFadeTimers = { fadeOut: 0, remove: null };

      timers.fadeOut = window.setTimeout(() => {
        setCards((prev) => prev.map((c) => (c.id === id ? { ...c, fading: true } : c)));
        timers.remove = window.setTimeout(() => {
          setCards((prev) => prev.filter((c) => c.id !== id));
          fadeTimersRef.current.delete(id);
        }, 350);
      }, delayMs);

      fadeTimersRef.current.set(id, timers);
    },
    [clearCardTimers]
  );

  // Probe for the stack icon image on mount
  useEffect(() => {
    probeImage(PHOTO_STACK_ICON_PATH).then(setStackIconVisible);
  }, []);

  // Pre-fetch tracks on mount so clicking the icon feels instant
  useEffect(() => {
    fetchRecentTracks().then((tracks) => {
      setTrackPool(tracks);
      shuffledRef.current = buildShuffled(tracks);
      setFetchError(tracks.length === 0);
    });
  }, []);

  const nextTrack = useCallback((): TrackData | null => {
    if (shuffledRef.current.length === 0) return null;
    if (shuffleIdxRef.current >= shuffledRef.current.length) {
      shuffledRef.current = buildShuffled(trackPool);
      shuffleIdxRef.current = 0;
    }
    return shuffledRef.current[shuffleIdxRef.current++];
  }, [trackPool]);

  const spawnCard = useCallback(
    (x: number, y: number) => {
      const track = nextTrack();
      if (!track) return; // no tracks available yet

      const { width: W, height: H, maxRotationDeg, maxVisible } = SETTINGS;
      const rot = Math.random() * maxRotationDeg * 2 - maxRotationDeg;
      const id = cardIdRef.current++;
      const zIndex = zCounterRef.current++;

      setCards((prev) => {
        let next = [...prev];
        // only count non-fading, non-flipped cards toward the visible limit
        // flipped cards are "pinned" — never evicted by new spawns
        if (next.filter((c) => !c.fading && !c.flipped).length >= maxVisible) {
          const oldest = next.find((c) => !c.fading && !c.flipped);
          if (oldest) {
            next = next.map((c) => (c.id === oldest.id ? { ...c, fading: true } : c));
          }
        }
        return [
          ...next,
          {
            id,
            src: track.src,
            song: track.song,
            artist: track.artist,
            x: x - W / 2,
            y: y - H / 2,
            rot,
            zIndex,
            flipped: false,
            fading: false,
          },
        ];
      });

      const delay = SETTINGS.fadeAfterMs + Math.random() * SETTINGS.fadeJitterMs;
      scheduleCardFade(id, delay);
    },
    [nextTrack, scheduleCardFade]
  );

  // Mouse move → spawn cards
  useEffect(() => {
    if (!active) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      const dx = e.clientX - lastSpawnRef.current.x;
      const dy = e.clientY - lastSpawnRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) >= SETTINGS.minDistance) {
        lastSpawnRef.current = { x: e.clientX, y: e.clientY };
        spawnCard(e.clientX, e.clientY);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [active, spawnCard]);

  // Lagged cursor dot RAF loop
  useEffect(() => {
    const LERP = 0.12;
    const tick = () => {
      lagRef.current.x += (mouseRef.current.x - lagRef.current.x) * LERP;
      lagRef.current.y += (mouseRef.current.y - lagRef.current.y) * LERP;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${lagRef.current.x}px`;
        cursorRef.current.style.top = `${lagRef.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Double-click to stop
  useEffect(() => {
    if (!active) return;
    const onDbl = () => {
      setActive(false);
      setShowHelpNote(false);
    };
    window.addEventListener("dblclick", onDbl);
    return () => window.removeEventListener("dblclick", onDbl);
  }, [active]);

  // When trail stops: cancel all timers, fade all cards, then remove them
  useEffect(() => {
    if (active) return;
    // cancel every pending timer
    fadeTimersRef.current.forEach((_, id) => clearCardTimers(id));
    // mark all cards as fading immediately
    setCards((prev) => prev.map((c) => ({ ...c, fading: true })));
    // remove them from DOM after the CSS fade-out (350ms)
    const cleanup = window.setTimeout(() => setCards([]), 400);
    return () => clearTimeout(cleanup);
  }, [active, clearCardTimers]);

  const flipCard = useCallback(
    (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      let isNowFlipped = false;
      setCards((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const flipped = !c.flipped;
          isNowFlipped = flipped;
          return { ...c, flipped, fading: false, zIndex: zCounterRef.current++ };
        })
      );
      if (isNowFlipped) {
        // card is now showing — cancel all timers, hold indefinitely
        clearCardTimers(id);
      } else {
        // card was un-flipped — resume normal fade lifecycle
        scheduleCardFade(id, SETTINGS.fadeAfterMs);
      }
    },
    [clearCardTimers, scheduleCardFade]
  );

  const handleIconClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (active) return;

    // Re-fetch on each activation so the pool is always fresh
    setLoading(true);
    setFetchError(false);
    const tracks = await fetchRecentTracks();
    setLoading(false);

    if (tracks.length === 0) {
      setFetchError(true);
      console.warn("PhotoTrail: no tracks returned from Last.fm");
      return;
    }

    setTrackPool(tracks);
    shuffledRef.current = buildShuffled(tracks);
    shuffleIdxRef.current = 0;

    setActive(true);
    setShowHelpNote(true);
    lastSpawnRef.current = { x: -999, y: -999 };
  };

  return (
    <>
      {/* Lagged cursor dot */}
      {active && (
        <div
          ref={cursorRef}
          style={{
            position: "fixed",
            width: 8,
            height: 8,
            background: "rgba(255,255,255,0.6)",
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 9999,
            transform: "translate(-50%, -50%)",
            mixBlendMode: "difference",
          }}
        />
      )}

      {/* Trail cards */}
      {cards.map((card) => (
        <TrailCardEl key={card.id} card={card} onFlip={flipCard} />
      ))}

      {/* Help note */}
      {showHelpNote && active && (
        <TrailHelpNote onDismiss={() => setShowHelpNote(false)} />
      )}

      {/* Desktop icon */}
      <div className="fixed z-[50] pointer-events-none" style={{ left: 20, bottom: 188 }}>
        <button
          type="button"
          onClick={handleIconClick}
          title={active ? "double-click anywhere to stop" : "click to start"}
          disabled={loading}
          className={cn(
            "pointer-events-auto flex flex-col items-center gap-1 p-2 rounded-lg w-[88px] select-none",
            "can-hover:hover:bg-white/10 active:bg-white/5 transition-colors",
            active && "bg-white/15 ring-1 ring-white/20"
          )}
          style={{
            background: "none",
            border: "none",
            cursor: active ? "none" : loading ? "wait" : "pointer",
          }}
        >
          {/* Dynamic album cover stack */}
          <div style={{ position: "relative", width: 64, height: 64 }}>
            {trackPool.length === 0 ? (
              // Placeholder stack before tracks load
              <>
                <div style={{
                  position: "absolute", width: 46, height: 46,
                  top: 12, left: 14,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 8, transform: "rotate(12deg)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
                }} />
                <div style={{
                  position: "absolute", width: 46, height: 46,
                  top: 8, left: 10,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 8, transform: "rotate(6deg)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                }} />
                <div style={{
                  position: "absolute", width: 46, height: 46,
                  top: 4, left: 4,
                  background: "rgba(255,255,255,0.16)",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7 16V7l10-2.5V13" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="5" cy="16" r="2.5" fill="rgba(255,255,255,0.55)" />
                    <circle cx="15" cy="13" r="2.5" fill="rgba(255,255,255,0.55)" />
                  </svg>
                </div>
              </>
            ) : (
              <>
                {/* Back card — most rotated clockwise, furthest right+down */}
                <div style={{
                  position: "absolute",
                  width: 44, height: 44,
                  top: 16, left: 18,
                  borderRadius: 6,
                  overflow: "hidden",
                  transform: "rotate(12deg)",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.5)",
                  outline: "1px solid rgba(255,255,255,0.12)",
                }}>
                  <img
                    src={trackPool[2]?.src ?? trackPool[0].src}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>

                {/* Middle card — slight clockwise tilt */}
                <div style={{
                  position: "absolute",
                  width: 46, height: 46,
                  top: 10, left: 10,
                  borderRadius: 7,
                  overflow: "hidden",
                  transform: "rotate(5deg)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                  outline: "1px solid rgba(255,255,255,0.18)",
                }}>
                  <img
                    src={trackPool[1]?.src ?? trackPool[0].src}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>

                {/* Front card — slight counter-clockwise, top-left anchor */}
                {/* White border gives Polaroid / album sleeve feel */}
                <div style={{
                  position: "absolute",
                  width: 48, height: 48,
                  top: 2, left: 2,
                  borderRadius: 8,
                  transform: "rotate(-4deg)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.65)",
                  background: "white",
                  padding: 2,
                }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: 6, overflow: "hidden" }}>
                    <img
                      src={trackPool[0].src}
                      alt="most recent album"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                </div>

                {/* Pulse ring when active */}
                {active && (
                  <div style={{
                    position: "absolute",
                    width: 54, height: 54,
                    top: -2, left: -1,
                    borderRadius: 11,
                    border: "1.5px solid rgba(232,213,183,0.7)",
                    transform: "rotate(-4deg)",
                    animation: "pulse-ring 1.5s ease-in-out infinite",
                    pointerEvents: "none",
                  }} />
                )}
              </>
            )}
          </div>
          <span className="text-[11px] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] tracking-wide">
            {loading
              ? "loading…"
              : fetchError
                ? "last.fm unavailable"
                : active
                  ? "trailing…"
                  : "listentome"}
          </span>
        </button>
      </div>
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.04); }
        }
      `}</style>
    </>
  );
}