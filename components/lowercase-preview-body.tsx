"use client";

import { useEffect } from "react";
import { isLowercasePreviewEnabled, LOWERCASE_PREVIEW_CLASS } from "@/lib/lowercase-preview";

/** Ensures lowercase preview class is on <body> after hydration (pairs with server layout). */
export function LowercasePreviewBody() {
  useEffect(() => {
    if (!isLowercasePreviewEnabled()) return;
    document.body.classList.add(LOWERCASE_PREVIEW_CLASS);
    return () => {
      document.body.classList.remove(LOWERCASE_PREVIEW_CLASS);
    };
  }, []);

  return null;
}
