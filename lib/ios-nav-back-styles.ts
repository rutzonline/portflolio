/** iOS dark-mode system blue — single source for mobile in-app nav chrome. */
export const IOS_NAV_ACCENT = "#0A84FF";

import {
  IOS_MOBILE_ICON_HIT_AREA_CLASS,
  IOS_MOBILE_TOUCH_ACTIVE_CLASS,
} from "@/lib/ui-tokens";

/** Shared iOS shell back control (mobile only). */
export const IOS_NAV_BACK_BUTTON_CLASS =
  "flex items-center gap-1.5 -ml-0.5 rounded-md pr-1 " +
  IOS_MOBILE_ICON_HIT_AREA_CLASS +
  " " +
  IOS_MOBILE_TOUCH_ACTIVE_CLASS;

export const IOS_NAV_BACK_LABEL_CLASS =
  "text-[18px] font-medium leading-none";

export const IOS_MOBILE_NAV_TITLE_CLASS =
  "text-[18px] font-semibold leading-none text-white truncate";

export const IOS_MOBILE_NAV_BAR_CLASS =
  "relative z-[1] bg-background px-4 pt-1.5 select-none";

export const IOS_MOBILE_NAV_SIDE_RIGHT_CLASS =
  "[&_button]:inline-flex [&_button]:min-h-11 [&_button]:min-w-11 [&_button]:items-center [&_button]:justify-center [&_button]:text-[#0A84FF] [&_button]:active:opacity-70 [&_svg]:h-[22px] [&_svg]:w-[22px] [&_svg]:text-[#0A84FF]";
