/** Reset iOS Safari viewport zoom after focusing sub-16px inputs. */
export function resetIosInputZoom(): void {
  if (typeof window === "undefined") return;

  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) return;

  const base =
    "width=device-width, initial-scale=1.0, maximum-scale=1.0, interactive-widget=resizes-content";
  viewport.setAttribute("content", `${base}, user-scalable=no`);
  window.requestAnimationFrame(() => {
    viewport.setAttribute("content", base);
  });
}
