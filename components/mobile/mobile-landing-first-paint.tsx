import { DEFAULT_MOBILE_WALLPAPER_ID, getMobileWallpaperPath } from "@/lib/mobile-wallpapers";

/**
 * Static mobile wallpaper in the initial HTML for "/".
 * Visible only on coarse-pointer / phone-width viewports via CSS (see globals.css),
 * so it never affects the desktop shell. Removed once the mobile shell mounts
 * (`html.mobile-shell-ready`), keeping the screen painted across the JS handoff.
 */
export function MobileLandingFirstPaint() {
  const wallpaperSrc = getMobileWallpaperPath(DEFAULT_MOBILE_WALLPAPER_ID);

  return (
    <>
      <link rel="preload" as="image" href={wallpaperSrc} fetchPriority="high" />
      <div
        aria-hidden
        className="mobile-landing-first-paint fixed inset-0 z-[90] transform-gpu bg-black"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={wallpaperSrc}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
      </div>
    </>
  );
}
