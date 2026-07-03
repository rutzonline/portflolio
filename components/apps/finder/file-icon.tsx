import Image from "next/image";
import { APPS } from "@/lib/app-config";
import { cn } from "@/lib/utils";

export function FileIcon({
  type,
  name,
  icon,
  className,
}: {
  type: "file" | "dir" | "app";
  name: string;
  icon?: string;
  className?: string;
}) {
  if (type === "dir") {
    return (
      <svg
        className={cn("text-accent-blue", className)}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
      </svg>
    );
  }
  if (type === "app") {
    const cleanName = name.replace(/\.app$/i, "");
    const appIcon =
      icon ||
      APPS.find((a) => a.name === cleanName || a.id === cleanName.toLowerCase())
        ?.icon;
    if (appIcon) {
      return (
        <Image
          src={appIcon}
          alt={name}
          width={48}
          height={48}
          className={className}
          unoptimized={appIcon.endsWith(".svg")}
        />
      );
    }
  }
  const ext = name.split(".").pop()?.toLowerCase();
  let color = "text-zinc-400";
  if (ext === "md") color = "text-blue-400";
  else if (ext === "ts" || ext === "tsx") color = "text-blue-600";
  else if (ext === "js" || ext === "jsx") color = "text-yellow-500";
  else if (ext === "json") color = "text-green-500";
  else if (ext === "css") color = "text-pink-500";

  return (
    <svg
      className={cn(color, className)}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
    </svg>
  );
}
