export interface MobileWallpaper {
  id: string;
  name: string;
  file: string;
}

export const MOBILE_WALLPAPERS: MobileWallpaper[] = [
  { id: "orange", name: "Orange", file: "orange.png" },
  { id: "gold", name: "Gold", file: "gold.png" },
  { id: "blue", name: "Blue", file: "blue.png" },
  { id: "lavender", name: "Lavender", file: "lavender.png" },
  { id: "pink", name: "Pink", file: "pink.png" },
  { id: "purple", name: "Purple", file: "purple.png" },
  { id: "space", name: "Space", file: "space.png" },
  { id: "white", name: "White", file: "white.png" },
];

export const DEFAULT_MOBILE_WALLPAPER_ID = "orange";

export function getMobileWallpaper(id: string): MobileWallpaper {
  return (
    MOBILE_WALLPAPERS.find((wallpaper) => wallpaper.id === id) ??
    MOBILE_WALLPAPERS.find((wallpaper) => wallpaper.id === DEFAULT_MOBILE_WALLPAPER_ID)!
  );
}

export function getMobileWallpaperPath(id: string): string {
  const wallpaper = getMobileWallpaper(id);
  return `/mobile/${wallpaper.file}`;
}
