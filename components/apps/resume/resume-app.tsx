"use client";

import { useState, useCallback } from "react";
import {
  SKILLS_SECTIONS,
  EDUCATION_SECTIONS,
  TOOLS_SECTIONS,
  type ResumeSectionId,
} from "./data";
import { ResumeSidebar } from "./resume-sidebar";
import { ResumeNav } from "./resume-nav";
import { WorkSection } from "./work-section";
import { ResumeSectionList } from "./resume-section-list";
import { CreationsPanel } from "./creations-panel";
import { LearningCardsPanel } from "./learning-cards-panel";

interface ResumeAppProps {
  isMobile?: boolean;
  inShell?: boolean;
}

export function ResumeApp({ isMobile = false, inShell = false }: ResumeAppProps) {
  const isMobileView = isMobile && !inShell;
  const isDesktop = inShell && !isMobile;
  const [section, setSection] = useState<ResumeSectionId>("work");
  const [isScrolled, setIsScrolled] = useState(false);
  const [workHasSelection, setWorkHasSelection] = useState(false);
  const [mobileShowContent, setMobileShowContent] = useState(false);

  const handleSectionSelect = useCallback(
    (id: ResumeSectionId) => {
      setSection(id);
      setWorkHasSelection(false);
      if (isMobileView) setMobileShowContent(true);
    },
    [isMobileView]
  );

  const renderContent = () => {
    switch (section) {
      case "work":
        return <WorkSection onSelectionChange={setWorkHasSelection} />;
      case "skills":
        return <ResumeSectionList sections={SKILLS_SECTIONS} twoColumn />;
      case "education":
        return <ResumeSectionList sections={EDUCATION_SECTIONS} />;
      case "tools":
        return <ResumeSectionList sections={TOOLS_SECTIONS} twoColumn />;
      case "certifications":
        return <LearningCardsPanel />;
      case "creations":
        return <CreationsPanel />;
      default:
        return <WorkSection onSelectionChange={setWorkHasSelection} />;
    }
  };

  const showSidebar = !isMobileView || (!mobileShowContent && !workHasSelection);

  return (
    <div
      data-app="resume"
      tabIndex={-1}
      className="flex h-full relative outline-none overflow-hidden bg-background"
    >
      <main className="h-full w-full bg-background flex flex-col overflow-hidden">
        <div className="flex-1 flex min-h-0">
          <div
            className={`h-full flex-shrink-0 overflow-hidden ${
              showSidebar
                ? isMobileView
                  ? "block w-full"
                  : "block w-[220px] border-r dark:border-foreground/20"
                : "hidden"
            }`}
          >
            <ResumeSidebar
              activeSection={section}
              onSectionSelect={handleSectionSelect}
              isMobileView={isMobileView}
              onScroll={setIsScrolled}
            >
              <ResumeNav isMobileView={isMobileView} isScrolled={isScrolled} isDesktop={isDesktop} />
            </ResumeSidebar>
          </div>

          <div
            className={`flex-1 min-h-0 flex flex-col overflow-hidden ${
              isMobileView && showSidebar ? "hidden" : "block"
            }`}
          >
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
