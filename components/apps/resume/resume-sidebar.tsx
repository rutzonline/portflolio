"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Briefcase,
  LayoutGrid,
  GraduationCap,
  Code2,
  Award,
  GalleryHorizontalEnd,
} from "lucide-react";
import type { ResumeSectionId } from "./data";

const SECTION_ICONS: Record<ResumeSectionId, React.ReactNode> = {
  work: <Briefcase className="w-4 h-4" />,
  skills: <LayoutGrid className="w-4 h-4" />,
  education: <GraduationCap className="w-4 h-4" />,
  tools: <Code2 className="w-4 h-4" />,
  certifications: <Award className="w-4 h-4" />,
  creations: <GalleryHorizontalEnd className="w-4 h-4" />,
};

const SECTIONS: { id: ResumeSectionId; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "tools", label: "Tools & Stack" },
  { id: "certifications", label: "Certifications" },
  { id: "creations", label: "Creations" },
];

interface ResumeSidebarProps {
  children: React.ReactNode;
  activeSection: ResumeSectionId;
  onSectionSelect: (id: ResumeSectionId) => void;
  isMobileView: boolean;
  onScroll?: (isScrolled: boolean) => void;
}

export function ResumeSidebar({
  children,
  activeSection,
  onSectionSelect,
  isMobileView,
  onScroll,
}: ResumeSidebarProps) {
  return (
    <div className={cn("flex flex-col h-full", isMobileView ? "bg-background" : "bg-muted")}>
      {children}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea
          className="h-full"
          bottomMargin="0"
          onScrollCapture={(e) => {
            const target = e.target as HTMLElement;
            onScroll?.(target.scrollTop > 0);
          }}
        >
          <div className={cn("px-2 py-2", isMobileView ? "w-full" : "w-[220px]")}>
            <div className="mb-2">
              <p className="text-xs text-muted-foreground px-3 py-1 font-semibold uppercase tracking-wide">
                Resume
              </p>
              {SECTIONS.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={SECTION_ICONS[item.id]}
                  label={item.label}
                  isActive={activeSection === item.id}
                  onClick={() => onSectionSelect(item.id)}
                  isMobileView={isMobileView}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  isActive,
  onClick,
  isMobileView,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isMobileView: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors text-left",
        isActive && !isMobileView
          ? "bg-zinc-200/70 dark:bg-zinc-700/70 text-blue-500"
          : "text-foreground",
        isMobileView && "py-3"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
