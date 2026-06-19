const INTRO_SHOWN_KEY = "portfolio_intro_shown";

export function hasSeenIntro(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(INTRO_SHOWN_KEY) === "1";
  } catch {
    return true;
  }
}

export function markIntroShown(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INTRO_SHOWN_KEY, "1");
  } catch {
    // ignore
  }
}

export const NOW_PLAYING_DISMISSED_KEY = "now_playing_dismissed";

export function hasDismissedNowPlaying(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(NOW_PLAYING_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markNowPlayingDismissed(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(NOW_PLAYING_DISMISSED_KEY, "1");
  } catch {
    // ignore
  }
}

export function clearNowPlayingDismissed(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(NOW_PLAYING_DISMISSED_KEY);
  } catch {
    // ignore
  }
}
