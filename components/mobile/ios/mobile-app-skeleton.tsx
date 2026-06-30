import { cn } from "@/lib/utils";

export type MobileAppSkeletonVariant = "list" | "grid" | "content";

function SkeletonBar({ className }: { className?: string }) {
  return <div className={cn("rounded bg-muted/80 animate-pulse", className)} />;
}

export function MobileListBodySkeleton() {
  return (
    <div className="space-y-1 px-3 pt-2" aria-hidden>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 px-1 py-2.5">
          <SkeletonBar className="h-12 w-12 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonBar className="h-4 w-[38%]" />
            <SkeletonBar className="h-3.5 w-[72%]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MobileGridBodySkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2 p-4" aria-hidden>
      {Array.from({ length: 12 }).map((_, index) => (
        <SkeletonBar key={index} className="aspect-square rounded-sm" />
      ))}
    </div>
  );
}

export function MobileContentBodySkeleton() {
  return (
    <div className="space-y-3 px-4 pt-3" aria-hidden>
      <SkeletonBar className="h-28 w-full rounded-xl" />
      <SkeletonBar className="h-4 w-full" />
      <SkeletonBar className="h-4 w-[92%]" />
      <SkeletonBar className="h-4 w-[85%]" />
      <SkeletonBar className="h-4 w-[78%]" />
    </div>
  );
}

/** Nav chrome + body placeholder for dynamic app chunk loading (mobile only). */
export function MobileAppShellSkeleton({ variant = "list" }: { variant?: MobileAppSkeletonVariant }) {
  return (
    <div className="flex h-full flex-col bg-background" aria-busy="true" aria-label="Loading app">
      <div className="h-11 shrink-0 border-b border-border/40 bg-background" />
      <div className="min-h-0 flex-1 overflow-hidden">
        {variant === "grid" ? (
          <MobileGridBodySkeleton />
        ) : variant === "content" ? (
          <MobileContentBodySkeleton />
        ) : (
          <MobileListBodySkeleton />
        )}
      </div>
    </div>
  );
}
