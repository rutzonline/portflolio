import { Position, Size } from "./window";

export interface AppMobilePolicy {
  supported?: boolean; // defaults to true
  shellFallbackAppId?: string; // fallback app when unsupported on mobile
  directRouteRedirectTo?: string; // defaults to "/"
  showInFinderApplications?: boolean; // defaults to true
  /** Hide from iOS home grid (Finder, Trash, dock apps, etc.). Defaults to true. */
  showOnIosHome?: boolean;
}

export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  accentColor: string;
  defaultPosition: Position;
  defaultSize: Size;
  minSize: Size;
  menuBarTitle: string;
  showOnDockByDefault?: boolean; // defaults to true if not specified
  showInFinderApplications?: boolean; // defaults to true if not specified
  mobile?: AppMobilePolicy;
  multiWindow?: boolean; // defaults to false - allows multiple windows per app
  cascadeOffset?: number; // offset for cascading new windows (default 30)
  /** Multiplier for dock icon art size (default 1). Use when PNG padding differs from other apps. */
  dockIconScale?: number;
}
