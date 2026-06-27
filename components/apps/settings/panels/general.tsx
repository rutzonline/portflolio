"use client";

import { Info, Download, HardDrive, ChevronRight } from "lucide-react";
import { SettingsPanel, SettingsCategory } from "../settings-app";
import { cn } from "@/lib/utils";
import { IosMobileListGroup } from "@/components/mobile/ios/ios-mobile-list";
import {
  IOS_MOBILE_LIST_CHEVRON_CLASS,
  IOS_MOBILE_LIST_ROW_CLASS,
  IOS_MOBILE_LIST_ROW_TITLE_CLASS,
} from "@/lib/ui-tokens";

interface GeneralPanelProps {
  onPanelSelect: (panel: SettingsPanel) => void;
  onCategorySelect?: (category: SettingsCategory, options?: { scrollToOSVersion?: boolean }) => void;
  isMobile?: boolean;
}

const items = [
  {
    id: "about" as const,
    name: "About",
    icon: <Info className="w-5 h-5 text-white" />,
    iconBg: "bg-accent-blue",
    navigable: true,
  },
  {
    id: "software-update" as const,
    name: "Software Update",
    icon: <Download className="w-5 h-5 text-white" />,
    iconBg: "bg-gray-500",
    navigable: true,
  },
  {
    id: "storage" as const,
    name: "Storage",
    icon: <HardDrive className="w-5 h-5 text-white" />,
    iconBg: "bg-gray-500",
    navigable: true,
  },
];

export function GeneralPanel({ onPanelSelect, onCategorySelect, isMobile = false }: GeneralPanelProps) {
  const handleItemClick = (itemId: string) => {
    if (itemId === "about") {
      onPanelSelect("about");
    } else if (itemId === "software-update") {
      onCategorySelect?.("appearance", { scrollToOSVersion: true });
    } else if (itemId === "storage") {
      onPanelSelect("storage");
    }
  };

  if (isMobile) {
    return (
      <IosMobileListGroup>
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => item.navigable && handleItemClick(item.id)}
            disabled={!item.navigable}
            className={cn(
              IOS_MOBILE_LIST_ROW_CLASS,
              item.navigable ? "can-hover:hover:bg-muted/40 cursor-pointer" : "cursor-default",
              index !== items.length - 1 && "border-b border-border/50"
            )}
          >
            <span className={cn("flex items-center justify-center w-7 h-7 rounded-lg shrink-0", item.iconBg)}>
              {item.icon}
            </span>
            <span className={cn(IOS_MOBILE_LIST_ROW_TITLE_CLASS, "flex-1 text-left")}>{item.name}</span>
            {item.navigable && <ChevronRight className={IOS_MOBILE_LIST_CHEVRON_CLASS} aria-hidden />}
          </button>
        ))}
      </IosMobileListGroup>
    );
  }

  return (
    <div className="space-y-1">
      <div className="rounded-xl overflow-hidden bg-muted/50">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => item.navigable && handleItemClick(item.id)}
            disabled={!item.navigable}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 transition-colors",
              item.navigable ? "can-hover:hover:bg-muted cursor-pointer" : "cursor-default",
              index !== items.length - 1 && "border-b border-border/50"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-md bg-muted-foreground/10">
                {item.id === "about" ? (
                  <Info className="w-5 h-5" />
                ) : item.id === "software-update" ? (
                  <Download className="w-5 h-5" />
                ) : (
                  <HardDrive className="w-5 h-5" />
                )}
              </span>
              <span className="text-xs">{item.name}</span>
            </div>
            {item.navigable && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </button>
        ))}
      </div>
    </div>
  );
}
