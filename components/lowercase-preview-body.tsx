"use client";

import { useEffect } from "react";
import { isLowercasePreviewEnabled, LOWERCASE_PREVIEW_CLASS } from "@/lib/lowercase-preview";
import { observeLowercasePreviewPreservation } from "@/lib/lowercase-preview-dom";

/** Ensures lowercase preview class is on <body> after hydration (pairs with server layout). */
export function LowercasePreviewBody() {
  useEffect(() => {
    if (!isLowercasePreviewEnabled()) return;

    document.body.classList.add(LOWERCASE_PREVIEW_CLASS);
    const stopObserving = observeLowercasePreviewPreservation(document.body);

    return () => {
      stopObserving();
      document.body.classList.remove(LOWERCASE_PREVIEW_CLASS);
    };
  }, []);

  return null;
}
