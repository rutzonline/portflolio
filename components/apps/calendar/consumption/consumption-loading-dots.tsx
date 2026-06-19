"use client";

import { cn } from "@/lib/utils";
import { CATEGORY_COLORS, categoryDotClassName } from "./category-styles";

const DOT_COLORS = Object.values(CATEGORY_COLORS);

export function ConsumptionLoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-end gap-2", className)} role="status" aria-label="Loading consumption log">
      {DOT_COLORS.map((color, index) => (
        <span
          key={color}
          className={cn(
            "consumption-loading-dot h-2.5 w-2.5 rounded-full",
            categoryDotClassName(color)
          )}
          style={{
            backgroundColor: color,
            animationDelay: `${index * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}
