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
  type CalendarAppMode,
} from "@/lib/sidebar-persistence";

interface CalendarAppProps {
  isMobile?: boolean;
  inShell?: boolean;
}

function toMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function CalendarApp({ isMobile = false, inShell = false }: CalendarAppProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [appMode, setAppMode] = useState<CalendarAppMode>("consumption");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setAppMode(loadCalendarAppMode());
    setCurrentDate(new Date());
    setIsLoaded(true);
  }, []);

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

  if (!isLoaded) {
    return <div className="h-full bg-background" />;
  }

  return (
    <div
      ref={containerRef}
      data-app="calendar"
      tabIndex={-1}
      onMouseDown={() => containerRef.current?.focus()}
      className="calendar-app h-full flex flex-col bg-background text-foreground relative outline-none overflow-hidden"
    >
      <div className={cn(isMobile && "shrink-0")}>
        <ConsumptionAppNav
          appMode={appMode}
          onAppModeChange={handleAppModeChange}
          inShell={inShell}
          isMobile={isMobile}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {appMode === "booking" ? (
          <CalEmbed />
        ) : (
          <ConsumptionShell currentDate={currentDate} onDateChange={handleDateChange} isMobileView={isMobile} />
        )}
      </div>
    </div>
  );
}
