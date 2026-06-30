import { APPS, getAppById } from "@/lib/app-config";
import { isAppSupportedOnMobile } from "@/lib/app-availability";
import type { AppConfig } from "@/types/apps";

/** Pinned iOS dock — order is display order left to right. */
export const IOS_DOCK_APP_IDS = ["messages", "photos", "notes", "settings", "calendar"] as const;

export type IosDockAppId = (typeof IOS_DOCK_APP_IDS)[number];

const IOS_HOME_EXCLUDED_APP_IDS = new Set(["finder", "trash"]);

function isIosDockApp(appId: string): appId is IosDockAppId {
  return (IOS_DOCK_APP_IDS as readonly string[]).includes(appId);
}

function isVisibleOnIosHome(app: AppConfig): boolean {
  if (IOS_HOME_EXCLUDED_APP_IDS.has(app.id)) return false;
  if (app.mobile?.showOnIosHome === false) return false;
  if (!isAppSupportedOnMobile(app.id)) return false;
  if (isIosDockApp(app.id)) return false;
  return true;
}

/** Springboard grid apps — derived from app-config, excluding dock and hidden apps. */
export function getIosHomeGridApps(): AppConfig[] {
  return APPS.filter(isVisibleOnIosHome);
}

/** Dock apps in configured order. */
export function getIosDockApps(): AppConfig[] {
  return IOS_DOCK_APP_IDS.map((id) => getAppById(id)).filter(
    (app): app is AppConfig => app != null && isAppSupportedOnMobile(app.id)
  );
}
