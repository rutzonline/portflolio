"use client";

import { SimpleAppNav } from "@/components/shared/simple-app-nav";

interface NavProps {
  isMobileView: boolean;
  isScrolled?: boolean;
  isDesktop?: boolean;
  title?: string;
}

export function Nav({ isMobileView, isScrolled, isDesktop = false, title = "Photos" }: NavProps) {
  return (
    <SimpleAppNav
      isMobileView={isMobileView}
      isScrolled={isScrolled}
      isDesktop={isDesktop}
      title={title}
    />
  );
}
