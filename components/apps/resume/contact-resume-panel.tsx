"use client";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ContactFooterPlayground } from "./contact-footer-playground";
import {
  resumePanelCardClass,
  RESUME_SECTION_HEADING_CLASS,
  resumePanelScrollClass,
} from "./resume-panel-styles";
import { IOS_MOBILE_READING_TEXT_CLASS, IOS_MOBILE_TOUCH_ACTIVE_CLASS } from "@/lib/ui-tokens";

const CONTACT_LINKS = [
  {
    label: "Email",
    href: "mailto:rutujarochkari7@gmail.com",
    external: false,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/rutuja-rochkari",
    external: true,
  },
  {
    label: "resume",
    href: "https://drive.google.com/file/d/1ZZXKFaZv_sprKq0GHl6761upY9KIZfyF/view?pli=1",
    external: true,
  },
  {
    label: "book a call",
    href: siteConfig.calBookingUrl,
    external: true,
  },
] as const;

export function ContactResumePanel({ isMobileView = false }: { isMobileView?: boolean }) {
  const visibleLinks = CONTACT_LINKS.filter(
    (link) => !(isMobileView && link.label === "resume")
  );
  return (
    <div className={resumePanelScrollClass(isMobileView, "pt-12")}>
      <div className="max-w-3xl space-y-14">
        <div>
          <p className={cn(RESUME_SECTION_HEADING_CLASS, "mb-4")}>
            if you&apos;d like to work together, say hi! i&apos;d love to connect
          </p>
          <div
            className={cn(
              "ml-3 gap-3",
              isMobileView ? "grid grid-cols-3" : "flex flex-wrap"
            )}
          >
            {visibleLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={cn(
                  resumePanelCardClass(isMobileView),
                  "px-3.5 py-2 text-center text-zinc-800 dark:text-zinc-100 whitespace-nowrap",
                  "can-hover:hover:bg-zinc-200/70 dark:can-hover:hover:bg-zinc-700/50",
                  isMobileView && cn(
                    IOS_MOBILE_READING_TEXT_CLASS,
                    IOS_MOBILE_TOUCH_ACTIVE_CLASS,
                    "flex items-center justify-center text-center"
                  ),
                  !isMobileView && "text-sm transition-colors"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <ContactFooterPlayground isMobileView={isMobileView} />
      </div>
    </div>
  );
}
