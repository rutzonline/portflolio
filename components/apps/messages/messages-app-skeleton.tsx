export function MessagesAppSkeleton() {
  return (
    <div className="h-full bg-background px-3 pt-3 space-y-1" aria-hidden>
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 px-1 py-2.5">
          <div className="h-12 w-12 shrink-0 rounded-full bg-muted/80 animate-pulse" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-[17px] w-[38%] rounded bg-muted/80 animate-pulse" />
            <div className="h-[15px] w-[72%] rounded bg-muted/70 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
