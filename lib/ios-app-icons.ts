import { getIosDockApps, getIosHomeGridApps } from "@/lib/ios-home-apps";

/** Springboard grid icon artboard (px). */
export const IOS_GRID_ICON_SIZE = 68;

/** Dock icon artboard (px) — same visual weight as grid. */
export const IOS_DOCK_ICON_SIZE = 68;

/** Uniform scale for PNG artwork inside the squircle clip. */
export const IOS_PNG_ART_SCALE = 1.26;

/**
 * Live calendar white tile vs artboard. Slightly below 1 so the solid tile matches
 * the visual weight of scaled PNG squircles.
 */
export const IOS_CALENDAR_TILE_RATIO = 0.84;

export function getIosAppIconArtScale(appId: string): number {
  // xsettings.png artwork sits tighter in-file; needs less zoom than other springboard PNGs.
  if (appId === "settings") return 1.13;
  return IOS_PNG_ART_SCALE;
}

export function getIosAppIconSrc(appId: string, fallbackIcon: string): string {
  switch (appId) {
    case "notes":
      return "/xnotes.png";
    case "photos":
      return "/xphotos.png";
    case "messages":
      return "/xmessages.png";
    case "desk":
      return "/misc.png";
    case "resume":
      return "/xresume.png";
    case "settings":
      return "/xsettings.png";
    case "finder":
      return "/xfinder.png";
    case "weather":
      return "/xweather.png";
    default:
      return fallbackIcon;
  }
}

/** Eagerly decode home + dock PNGs in the browser cache. */
export function preloadIosHomeIcons(): void {
  if (typeof window === "undefined") return;

  const apps = [...getIosHomeGridApps(), ...getIosDockApps()];
  for (const app of apps) {
    if (app.id === "calendar") continue;
    const src = getIosAppIconSrc(app.id, app.icon);
    const img = new window.Image();
    img.decoding = "async";
    img.src = src;
  }
}
