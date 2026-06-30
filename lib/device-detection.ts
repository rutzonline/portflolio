export const MOBILE_USER_AGENT_PATTERN =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

const IPAD_OS_MAC_PATTERN = /Macintosh/i;
const MOBILE_SAFARI_FRAGMENT_PATTERN = /Mobile\//i;

export const SHELL_POINTER_MEDIA_QUERY = "(pointer: coarse)";

/** Viewport width at or above this with a fine primary pointer is always desktop. */
export const DESKTOP_MIN_VIEWPORT_WIDTH = 1024;

/** Viewport width below this is treated as phone-sized (matches legacy 768px shell gate). */
export const PHONE_MAX_VIEWPORT_WIDTH = 768;

interface MobileSignals {
  clientHintMobile?: boolean;
  userAgent?: string;
  pointerCoarse?: boolean;
  viewportWidth?: number;
}

export function isLikelyMobileUserAgent(userAgent: string): boolean {
  if (!userAgent) return false;

  if (MOBILE_USER_AGENT_PATTERN.test(userAgent)) {
    return true;
  }

  // iPadOS can report as Macintosh while still exposing mobile Safari details.
  return IPAD_OS_MAC_PATTERN.test(userAgent) && MOBILE_SAFARI_FRAGMENT_PATTERN.test(userAgent);
}

export function isMobileBySignals(signals: MobileSignals): boolean {
  if (signals.clientHintMobile) {
    return true;
  }

  if (signals.userAgent && isLikelyMobileUserAgent(signals.userAgent)) {
    return true;
  }

  const viewportWidth = signals.viewportWidth;
  const primaryPointerIsCoarse = Boolean(signals.pointerCoarse);
  const primaryPointerIsFine = signals.pointerCoarse === false;

  // Touchscreen laptops: large viewport + mouse-primary must never get the mobile shell.
  if (
    typeof viewportWidth === "number" &&
    viewportWidth >= DESKTOP_MIN_VIEWPORT_WIDTH &&
    primaryPointerIsFine
  ) {
    return false;
  }

  // Phones and touch-first tablets (coarse primary pointer).
  if (primaryPointerIsCoarse) {
    return true;
  }

  // Narrow desktop windows / phone-sized viewports without UA (legacy width gate).
  if (typeof viewportWidth === "number" && viewportWidth < PHONE_MAX_VIEWPORT_WIDTH) {
    return true;
  }

  return false;
}

export function detectMobileClientFromWindow(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const nav = window.navigator;

  return isMobileBySignals({
    userAgent: nav.userAgent,
    pointerCoarse: window.matchMedia(SHELL_POINTER_MEDIA_QUERY).matches,
    viewportWidth: window.innerWidth,
  });
}
