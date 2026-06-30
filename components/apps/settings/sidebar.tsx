"use client";

import { useState } from "react";
import Image from "next/image";
import { Settings, Paintbrush, Search, X, ChevronRight, Plane, Wifi, Bluetooth, Radio, Link2, Battery } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSystemSettings } from "@/lib/system-settings-context";
import { SettingsCategory, SettingsPanel } from "./settings-app";
import { SidebarNav } from "./sidebar-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getHeadshotSrc } from "@/config/site";
import {
  IosMobileListGroup,
  IosMobileListRowSubtitle,
  IosMobileListRowTitle,
} from "@/components/mobile/ios/ios-mobile-list";
import {
  IOS_MOBILE_LIST_CHEVRON_CLASS,
  IOS_MOBILE_LIST_ROW_CLASS,
  IOS_MOBILE_LIST_ROW_SUBTITLE_CLASS,
  IOS_MOBILE_LIST_ROW_TITLE_CLASS,
  IOS_MOBILE_LIST_SCREEN_CLASS,
} from "@/lib/ui-tokens";

interface SidebarProps {
  selectedCategory: SettingsCategory;
  selectedPanel: SettingsPanel;
  onCategorySelect: (category: SettingsCategory) => void;
  onAccountClick: () => void;
  isMobile: boolean;
  isDesktop?: boolean;
}

const categories: { id: SettingsCategory; name: string; icon: React.ReactNode; iconBg: string; keywords: string[]; desktopOnly?: boolean }[] = [
  {
    id: "wifi",
    name: "Wi-Fi",
    icon: <Wifi className="w-5 h-5 text-white" />,
    iconBg: "bg-accent-blue",
    keywords: ["wifi", "wireless", "network", "internet", "connect"],
    desktopOnly: true,
  },
  {
    id: "bluetooth",
    name: "Bluetooth",
    icon: <Bluetooth className="w-5 h-5 text-white" />,
    iconBg: "bg-accent-blue",
    keywords: ["bluetooth", "wireless", "devices", "airpods", "keyboard", "trackpad"],
    desktopOnly: true,
  },
  {
    id: "general",
    name: "General",
    icon: <Settings className="w-5 h-5 text-white" />,
    iconBg: "bg-gray-500",
    keywords: ["about", "macbook", "software update", "storage", "chip", "memory", "serial", "macos", "sonoma"],
  },
  {
    id: "appearance",
    name: "Appearance",
    icon: <Paintbrush className="w-5 h-5 text-white" />,
    iconBg: "bg-accent-blue",
    keywords: ["light", "dark", "auto", "theme", "mode"],
  },
];

const connectivityItems = [
  { id: "airplane", name: "Airplane Mode", icon: <Plane className="w-5 h-5 text-white" />, iconBg: "bg-orange-500", type: "toggle" as const, value: false },
  { id: "wifi", name: "Wi-Fi", icon: <Wifi className="w-5 h-5 text-white" />, iconBg: "bg-accent-blue", type: "value" as const, value: "basecase" },
  { id: "bluetooth", name: "Bluetooth", icon: <Bluetooth className="w-5 h-5 text-white" />, iconBg: "bg-accent-blue", type: "nav" as const, value: "On" },
  { id: "cellular", name: "Cellular", icon: <Radio className="w-5 h-5 text-white" />, iconBg: "bg-green-500", type: "static" as const },
  { id: "hotspot", name: "Personal Hotspot", icon: <Link2 className="w-5 h-5 text-white" />, iconBg: "bg-green-500", type: "value" as const, value: "Off" },
  { id: "battery", name: "Battery", icon: <Battery className="w-5 h-5 text-white" />, iconBg: "bg-green-500", type: "static" as const },
];

const appleAccountKeywords = ["rutuja", "rochkari", "apple", "account", "personal", "information", "name", "birthday"];

export function Sidebar({
  selectedCategory,
  selectedPanel,
  onCategorySelect,
  onAccountClick,
  isMobile,
  isDesktop = false,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    wifiEnabled,
    setWifiEnabled,
    airplaneModeEnabled,
    setAirplaneModeEnabled,
  } = useSystemSettings();

  const query = searchQuery.toLowerCase();

  // Filter categories based on search (name or keywords) and platform
  const filteredCategories = categories.filter((category) => {
    // Exclude desktop-only categories on mobile
    if (isMobile && category.desktopOnly) return false;
    return category.name.toLowerCase().includes(query) ||
      category.keywords.some((keyword) => keyword.includes(query));
  });

  // Check if Apple Account matches search
  const showAppleAccount =
    searchQuery === "" ||
    appleAccountKeywords.some((keyword) => keyword.includes(query));

  // Mobile layout - iOS style
  if (isMobile) {
    return (
      <div className={cn("flex flex-col h-full select-none w-full", IOS_MOBILE_LIST_SCREEN_CLASS)}>
        <SidebarNav isMobile={isMobile} isScrolled={isScrolled} isDesktop={isDesktop} />

        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea
            className="h-full"
            viewportClassName={IOS_MOBILE_LIST_SCREEN_CLASS}
            onScrollCapture={(e: React.UIEvent<HTMLDivElement>) => {
              const viewport = e.currentTarget.querySelector(
                "[data-radix-scroll-area-viewport]"
              );
              if (viewport) {
                setIsScrolled(viewport.scrollTop > 0);
              }
            }}
            isMobile={isMobile}
            bottomMargin="0px"
          >
            <div className="px-3 pt-2 pb-6 min-h-full">
              <div className="px-0 pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="w-full pl-9 pr-9 rounded-[10px] text-base placeholder:text-sm placeholder:text-muted-foreground focus:outline-none bg-[#E8E8E7] dark:bg-[#353533] h-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                {showAppleAccount && (
                  <IosMobileListGroup className="mb-3">
                    <button
                      onClick={onAccountClick}
                      className={cn(IOS_MOBILE_LIST_ROW_CLASS, "can-hover:hover:bg-muted/40")}
                    >
                      <Image
                        src={getHeadshotSrc()}
                        alt="Rutuja Rochkari"
                        width={40}
                        height={40}
                        className="rounded-full object-cover shrink-0"
                        unoptimized
                      />
                      <span className="min-w-0 flex-1 text-left">
                        <IosMobileListRowTitle>Rutuja Rochkari</IosMobileListRowTitle>
                        <IosMobileListRowSubtitle>Apple Account, iCloud+, and more</IosMobileListRowSubtitle>
                      </span>
                      <ChevronRight className={IOS_MOBILE_LIST_CHEVRON_CLASS} aria-hidden />
                    </button>
                  </IosMobileListGroup>
                )}

                <IosMobileListGroup className="mb-4">
                  {connectivityItems.map((item, index) => {
                    const isNav = item.type === "nav";
                    const Wrapper = isNav ? "button" : "div";
                    return (
                      <Wrapper
                        key={item.id}
                        onClick={isNav ? () => onCategorySelect("bluetooth") : undefined}
                        className={cn(
                          IOS_MOBILE_LIST_ROW_CLASS,
                          index < connectivityItems.length - 1 && "border-b border-border/50",
                          isNav && "can-hover:hover:bg-muted/40"
                        )}
                      >
                        <span
                          className={cn(
                            "flex items-center justify-center w-7 h-7 rounded-lg shrink-0",
                            item.iconBg
                          )}
                        >
                          {item.icon}
                        </span>
                        <span className="min-w-0 flex-1 text-left">
                          <span className={IOS_MOBILE_LIST_ROW_TITLE_CLASS}>{item.name}</span>
                        </span>
                        {item.type === "toggle" && (
                          <button
                            onClick={() => setAirplaneModeEnabled(!airplaneModeEnabled)}
                            className={cn(
                              "w-12 h-7 rounded-full relative transition-colors shrink-0",
                              airplaneModeEnabled ? "bg-green-500" : "bg-gray-300"
                            )}
                          >
                            <div
                              className={cn(
                                "absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform",
                                airplaneModeEnabled ? "translate-x-5" : "translate-x-0.5"
                              )}
                            />
                          </button>
                        )}
                        {item.type === "value" && item.id === "wifi" && (
                          <button
                            onClick={() => {
                              if (!airplaneModeEnabled) setWifiEnabled(!wifiEnabled);
                            }}
                            className={cn(
                              "w-12 h-7 rounded-full relative transition-colors shrink-0",
                              wifiEnabled && !airplaneModeEnabled ? "bg-green-500" : "bg-gray-300",
                              airplaneModeEnabled && "opacity-60"
                            )}
                            aria-label={wifiEnabled ? "Turn Wi-Fi off" : "Turn Wi-Fi on"}
                          >
                            <div
                              className={cn(
                                "absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform",
                                wifiEnabled && !airplaneModeEnabled ? "translate-x-5" : "translate-x-0.5"
                              )}
                            />
                          </button>
                        )}
                        {item.type === "value" && item.id !== "wifi" && (
                          <span className={IOS_MOBILE_LIST_ROW_SUBTITLE_CLASS}>{item.value}</span>
                        )}
                        {item.type === "nav" && (
                          <div className="flex items-center gap-1 shrink-0">
                            <span className={IOS_MOBILE_LIST_ROW_SUBTITLE_CLASS}>{item.value}</span>
                            <ChevronRight className={IOS_MOBILE_LIST_CHEVRON_CLASS} aria-hidden />
                          </div>
                        )}
                      </Wrapper>
                    );
                  })}
                </IosMobileListGroup>

                <IosMobileListGroup>
                  {filteredCategories.map((category, index) => (
                    <button
                      key={category.id}
                      onClick={() => onCategorySelect(category.id)}
                      className={cn(
                        IOS_MOBILE_LIST_ROW_CLASS,
                        "can-hover:hover:bg-muted/40",
                        index < filteredCategories.length - 1 && "border-b border-border/50"
                      )}
                    >
                      <span
                        className={cn(
                          "flex items-center justify-center w-7 h-7 rounded-lg shrink-0",
                          category.iconBg
                        )}
                      >
                        {category.icon}
                      </span>
                      <span className={cn(IOS_MOBILE_LIST_ROW_TITLE_CLASS, "flex-1 text-left")}>
                        {category.name}
                      </span>
                      <ChevronRight className={IOS_MOBILE_LIST_CHEVRON_CLASS} aria-hidden />
                    </button>
                  ))}
                </IosMobileListGroup>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex flex-col h-full select-none w-[320px] bg-muted border-r border-border/50">
      {/* Nav with window controls */}
      <SidebarNav isMobile={isMobile} isScrolled={isScrolled} isDesktop={isDesktop} />

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea
          className="h-full"
          onScrollCapture={(e: React.UIEvent<HTMLDivElement>) => {
            const viewport = e.currentTarget.querySelector(
              "[data-radix-scroll-area-viewport]"
            );
            if (viewport) {
              setIsScrolled(viewport.scrollTop > 0);
            }
          }}
          isMobile={isMobile}
          bottomMargin="0px"
        >
          <div className="flex flex-col w-full">
            <div className="w-[320px] px-2">
              {/* Search bar */}
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="w-full pl-8 pr-8 py-0.5 rounded-lg text-base desktop:text-sm placeholder:text-sm placeholder:text-muted-foreground focus:outline-none bg-[#E8E8E7] dark:bg-[#353533]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Apple Account */}
              {showAppleAccount && (
                <div className="py-2">
                  <button
                    onClick={onAccountClick}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-lg transition-colors",
                      selectedPanel === "personal-info"
                        ? "bg-zinc-300 dark:bg-zinc-600"
                        : "can-hover:hover:bg-background/50"
                    )}
                  >
                    <Image
                      src={getHeadshotSrc()}
                      alt="rutuja rochkari"
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                    <div className="text-left">
                      <div className="font-medium text-xs">rutuja rochkari</div>
                      <div className="text-[10px] text-muted-foreground">Apple Account</div>
                    </div>
                  </button>
                </div>
              )}

              {/* Categories */}
              <div className="py-2">
                <div className="space-y-0.5">
                  {filteredCategories.map((category) => {
                    const isSelected = selectedCategory === category.id && selectedPanel !== "personal-info";
                    return (
                      <button
                        key={category.id}
                        onClick={() => onCategorySelect(category.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors",
                          isSelected
                            ? "bg-zinc-300 dark:bg-zinc-600 text-foreground"
                            : "can-hover:hover:bg-background/50 text-foreground"
                        )}
                      >
                        <span
                          className={cn(
                            "flex items-center justify-center w-7 h-7 rounded-md",
                            category.iconBg
                          )}
                        >
                          {category.icon}
                        </span>
                        <span>{category.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
