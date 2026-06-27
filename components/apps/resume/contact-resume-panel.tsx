"use client";

import { cn } from "@/lib/utils";
import { ContactFooterPlayground } from "./contact-footer-playground";
import {
  RESUME_PANEL_CARD_CLASS,
  RESUME_SECTION_HEADING_CLASS,
  resumePanelScrollClass,
} from "./resume-panel-styles";

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

export function ContactResumePanel({ isMobileView = false }: { isMobileView?: boolean }) {
  return (
    <div className={resumePanelScrollClass(isMobileView, "pt-12")}>
      <div className="max-w-3xl space-y-14">
        <div>
          <p className={cn(RESUME_SECTION_HEADING_CLASS, "mb-4")}>
            if you&apos;d like to work together, say hi! i&apos;d love to connect
          </p>
          <div className="flex flex-wrap gap-3 ml-3">
            {CONTACT_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className={cn(
                  RESUME_PANEL_CARD_CLASS,
                  "px-3.5 py-2 text-sm text-center text-zinc-800 dark:text-zinc-100 whitespace-nowrap",
                  "can-hover:hover:bg-zinc-200/70 dark:can-hover:hover:bg-zinc-700/50 transition-colors"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <ContactFooterPlayground />
      </div>
    </div>
  );
}
