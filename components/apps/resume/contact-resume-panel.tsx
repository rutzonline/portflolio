"use client";

import { cn } from "@/lib/utils";

const CONTACT_LINKS = [
  {
    label: "Email",
    href: "mailto:rutujarochkari7@gmail.com",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/rutuja-rochkari",
  },
  {
    label: "Resume PDF",
    href: "https://drive.google.com/file/d/1ZZXKFaZv_sprKq0GHl6761upY9KIZfyF/view?pli=1",
  },
] as const;

export function ContactResumePanel() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-lg space-y-6">
        <div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 px-1 leading-relaxed">
            If you&apos;d like to work together, please say hi :)
          </p>
          <div className="inline-flex w-fit max-w-full rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 overflow-hidden">
            {CONTACT_LINKS.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className={cn(
                  "px-3.5 py-2 text-sm text-center text-zinc-800 dark:text-zinc-100 whitespace-nowrap",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-700/40 transition-colors",
                  idx < CONTACT_LINKS.length - 1 &&
                    "border-r border-zinc-200 dark:border-zinc-700/60"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
