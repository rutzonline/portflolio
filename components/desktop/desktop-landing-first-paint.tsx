import { DEFAULT_OS_VERSION_ID, getWallpaperPath } from "@/lib/os-versions";

/**
 * Static desktop lock-screen wallpaper in the initial HTML for "/".
 * Visible only on coarse-pointer / narrow viewports via CSS (see globals.css).
 * Hidden once the client shell mounts (`html.shell-ready`).
 */
export function DesktopLandingFirstPaint() {
  const wallpaperSrc = getWallpaperPath(DEFAULT_OS_VERSION_ID);

  return (
    <>
      <link rel="preload" as="image" href={wallpaperSrc} fetchPriority="high" />
      <div aria-hidden className="desktop-landing-first-paint fixed inset-0 z-[90] bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={wallpaperSrc}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    </>
  );
}
