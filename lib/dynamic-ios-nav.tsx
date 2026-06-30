"use client";

import dynamic from "next/dynamic";

export const IosMobileNavTitle = dynamic(
  () =>
    import("@/components/mobile/ios/ios-mobile-nav-title").then((mod) => mod.IosMobileNavTitle),
  { ssr: false }
);

export const IosWindowNavBack = dynamic(
  () =>
    import("@/components/mobile/ios/ios-window-nav-back").then((mod) => mod.IosWindowNavBack),
  { ssr: false }
);
