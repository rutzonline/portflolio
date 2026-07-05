"use client";



import { SimpleAppNav } from "@/components/shared/simple-app-nav";



interface NavProps {
  isMobileView: boolean;
  isScrolled?: boolean;
  isDesktop?: boolean;
  title?: string;
  showWindowControls?: boolean;
}

export function Nav({ isMobileView, isScrolled, isDesktop = false, title = "Photos", showWindowControls = false }: NavProps) {
  return (
    <SimpleAppNav
      isMobileView={isMobileView}
      isScrolled={isScrolled}
      isDesktop={isDesktop}
      title={title}
      showWindowControls={showWindowControls}
    />
  );
}

