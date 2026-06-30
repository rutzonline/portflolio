/** sessionStorage keys — same `portfolio_` family as desktop onboarding (`lib/onboarding.ts`). */
const IOS_UNLOCKED_KEY = "portfolio_ios_unlocked";
const IOS_INTRO_DISMISSED_KEY = "portfolio_ios_intro_dismissed";

export type IosShellPhase = "loading" | "locked" | "ready";

export function resolveIosShellPhase(): IosShellPhase {
  if (typeof window === "undefined") return "loading";
  try {
    if (sessionStorage.getItem(IOS_UNLOCKED_KEY) === "1") return "ready";
    return "locked";
  } catch {
    return "ready";
  }
}

export function isIosIntroDismissed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem(IOS_INTRO_DISMISSED_KEY) === "1";
  } catch {
    return true;
  }
}

export function markIosUnlocked(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(IOS_UNLOCKED_KEY, "1");
  } catch {
    // ignore
  }
}

export function markIosIntroDismissed(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(IOS_UNLOCKED_KEY, "1");
    sessionStorage.setItem(IOS_INTRO_DISMISSED_KEY, "1");
  } catch {
    // ignore
  }
}
