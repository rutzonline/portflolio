import { cn } from "@/lib/utils";

export function ContentFetchError({
  message = "Couldn't load this section. Try refreshing.",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-sm text-red-600/90 dark:text-red-400/90 mb-4 px-1",
        className
      )}
      role="alert"
    >
      {message}
    </p>
  );
}
