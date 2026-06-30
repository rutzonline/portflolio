"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { ConsumptionAppNav } from "./consumption-app-nav";
import { ConsumptionShell } from "./consumption/consumption-shell";
import { CalEmbed } from "./booking/cal-embed";
import {
  loadCalendarAppMode,
  saveCalendarAppMode,
  saveConsumptionMonth,
  loadConsumptionSubview,
  saveConsumptionSubview,
  type CalendarAppMode,
  type ConsumptionSubview,
} from "@/lib/sidebar-persistence";
import { useMobileAppStackContext } from "@/components/mobile/ios/mobile-app-stack-context";
import { MobileAppShellSkeleton } from "@/components/mobile/ios/mobile-app-skeleton";

interface CalendarAppProps {
  isMobile?: boolean;
  inShell?: boolean;
}

function toMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function CalendarApp({ isMobile = false, inShell = false }: CalendarAppProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileStack = useMobileAppStackContext();
  const [appMode, setAppMode] = useState<CalendarAppMode>("consumption");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [mobileSubview, setMobileSubview] = useState<ConsumptionSubview>("calendar");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setAppMode(loadCalendarAppMode());
    setCurrentDate(new Date());
    if (isMobile) {
      setMobileSubview(loadConsumptionSubview());
    }
    setIsLoaded(true);
  }, [isMobile]);

  useEffect(() => {
    if (isLoaded) {
      saveConsumptionMonth(toMonthKey(currentDate));
    }
  }, [currentDate, isLoaded]);

  const handleAppModeChange = useCallback((mode: CalendarAppMode) => {
    setAppMode(mode);
    saveCalendarAppMode(mode);
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const handleMobileBack = useCallback(() => {
    if (!isMobile) return;

    if (mobileSubview === "list") {
      setMobileSubview("calendar");
      saveConsumptionSubview("calendar");
      return;
    }

    mobileStack?.popToHome();
  }, [isMobile, mobileStack, mobileSubview]);

  if (!isLoaded) {
    return isMobile ? <MobileAppShellSkeleton variant="content" /> : <div className="h-full bg-background" />;
  }

  return (
    <div
      ref={containerRef}
      data-app="calendar"
      tabIndex={-1}
      onMouseDown={() => containerRef.current?.focus()}
      className={cn(
        "calendar-app h-full flex flex-col bg-background text-foreground relative outline-none overflow-hidden",
        isMobile && "max-w-full overflow-x-hidden"
      )}
    >
      <div className={cn(isMobile && "shrink-0")}>
        <ConsumptionAppNav
          appMode={appMode}
          onAppModeChange={handleAppModeChange}
          inShell={inShell}
          isMobile={isMobile}
          onMobileBack={isMobile ? handleMobileBack : undefined}
          mobileBackTitle={isMobile ? (mobileSubview === "list" ? "Calendar" : "Home") : undefined}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {appMode === "booking" ? (
          <CalEmbed />
        ) : (
          <ConsumptionShell
            currentDate={currentDate}
            onDateChange={handleDateChange}
            isMobileView={isMobile}
            subview={isMobile ? mobileSubview : undefined}
            onSubviewChange={isMobile ? setMobileSubview : undefined}
          />
        )}
      </div>
    </div>
  );
}
