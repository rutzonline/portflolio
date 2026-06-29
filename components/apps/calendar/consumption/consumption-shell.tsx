"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  format,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  loadConsumptionSubview,
  saveConsumptionSubview,
  loadConsumptionCalendarView,
  saveConsumptionCalendarView,
  type ConsumptionSubview,
  type ConsumptionCalendarView,
} from "@/lib/sidebar-persistence";
import { navigateDate } from "../utils";
import type { ViewType } from "../types";
import { ConsumptionList } from "./consumption-list";
import { ConsumptionWeekView } from "./consumption-week-view";
import { ConsumptionMonthView } from "./consumption-month-view";
import { ConsumptionYearView } from "./consumption-year-view";
import { useConsumptionLogs, useAllConsumptionLogs } from "./use-consumption-logs";
import { consumptionLogsToEvents } from "./logs-to-events";
import { CONSUMPTION_CALENDARS } from "./consumption-calendars";
import { CATEGORY_COLORS, CATEGORY_LABELS, categoryDotClassName } from "./category-styles";
import { ConsumptionLoadingDots } from "./consumption-loading-dots";
import { CONSUMPTION_CATEGORIES } from "@/types/consumption";

interface ConsumptionShellProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  isMobileView?: boolean;
  subview?: ConsumptionSubview;
  onSubviewChange?: (next: ConsumptionSubview) => void;
}

const SUBVIEW_OPTIONS: { value: ConsumptionSubview; label: string }[] = [
  { value: "calendar", label: "Calendar" },
  { value: "list", label: "List" },
];

const CALENDAR_VIEW_OPTIONS: { value: ConsumptionCalendarView; label: string }[] = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "year", label: "Year" },
];

function buildDisplayRange(date: Date, subview: ConsumptionSubview, calendarView: ConsumptionCalendarView) {
  if (subview === "list") {
    return {
      start: format(startOfMonth(date), "yyyy-MM-dd"),
      end: format(endOfMonth(date), "yyyy-MM-dd"),
    };
  }

  switch (calendarView) {
    case "week":
      return {
        start: format(startOfWeek(date), "yyyy-MM-dd"),
        end: format(endOfWeek(date), "yyyy-MM-dd"),
      };
    case "year":
      return {
        start: format(startOfYear(date), "yyyy-MM-dd"),
        end: format(endOfYear(date), "yyyy-MM-dd"),
      };
    case "month":
    default:
      return {
        start: format(startOfMonth(date), "yyyy-MM-dd"),
        end: format(endOfMonth(date), "yyyy-MM-dd"),
      };
  }
}

function buildFetchRange(date: Date): { start: string; end: string } {
  const year = date.getFullYear();
  return { start: `${year}-01-01`, end: `${year}-12-31` };
}

export function ConsumptionShell({
  currentDate,
  onDateChange,
  isMobileView = false,
  subview: controlledSubview,
  onSubviewChange,
}: ConsumptionShellProps) {
  const [uncontrolledSubview, setUncontrolledSubview] = useState<ConsumptionSubview>("calendar");
  const [calendarView, setCalendarView] = useState<ConsumptionCalendarView>("month");
  const [highlightDate, setHighlightDate] = useState<string | null>(null);
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const subview = controlledSubview ?? uncontrolledSubview;

  useEffect(() => {
    const savedSubview = loadConsumptionSubview();
    if (controlledSubview == null) {
      setUncontrolledSubview(savedSubview);
    } else {
      onSubviewChange?.(savedSubview);
    }
    setCalendarView(loadConsumptionCalendarView());
    setPrefsLoaded(true);
  }, []);

  const fetchRange = useMemo(() => buildFetchRange(currentDate), [currentDate.getFullYear()]);
  const { logs, loading, error, usingFallback } = useConsumptionLogs(fetchRange);
  const {
    logs: allLogs,
    loading: allLoading,
    error: allError,
    usingFallback: allUsingFallback,
  } = useAllConsumptionLogs();
  const consumptionEvents = useMemo(() => consumptionLogsToEvents(logs), [logs]);

  const displayRange = useMemo(
    () => buildDisplayRange(currentDate, subview, calendarView),
    [currentDate, subview, calendarView]
  );

  const visibleEvents = useMemo(() => {
    return consumptionEvents.filter(
      (e) => e.startDate >= displayRange.start && e.startDate <= displayRange.end
    );
  }, [consumptionEvents, displayRange.start, displayRange.end]);

  useEffect(() => {
    if (!highlightDate) return;
    const timer = window.setTimeout(() => setHighlightDate(null), 1000);
    return () => window.clearTimeout(timer);
  }, [highlightDate]);

  const handleSubviewChange = (next: ConsumptionSubview) => {
    if (controlledSubview == null) {
      setUncontrolledSubview(next);
    } else {
      onSubviewChange?.(next);
    }
    saveConsumptionSubview(next);
    if (next === "calendar") {
      setHighlightDate(null);
    }
  };

  const handleCalendarViewChange = (next: ConsumptionCalendarView) => {
    setCalendarView(next);
    saveConsumptionCalendarView(next);
  };

  const handleNavigate = useCallback(
    (direction: "prev" | "next") => {
      setHighlightDate(null);
      const view: ViewType = subview === "list" ? "month" : calendarView;
      onDateChange(navigateDate(currentDate, direction, view));
    },
    [currentDate, calendarView, subview, onDateChange]
  );

  const handleToday = useCallback(() => {
    setHighlightDate(null);
    onDateChange(new Date());
  }, [onDateChange]);

  const handleDayClick = useCallback(
    (date: Date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      onDateChange(date);
      setHighlightDate(dateKey);
      handleSubviewChange("list");
      saveConsumptionSubview("list");
    },
    [handleSubviewChange, onDateChange]
  );

  const handleMonthClick = useCallback(
    (date: Date) => {
      onDateChange(date);
      setCalendarView("month");
      saveConsumptionCalendarView("month");
      setHighlightDate(null);
    },
    [onDateChange]
  );

  if (!prefsLoaded) {
    return <div className="h-full bg-background" />;
  }

  return (
    <div className={cn("flex flex-col h-full min-h-0 bg-background text-foreground font-[system-ui,-apple-system,BlinkMacSystemFont,'SF_Pro',sans-serif]", isMobileView && "pb-2")}>
      <div
        className={cn(
          "px-4 border-b border-border/80 bg-muted/20 backdrop-blur-xl shrink-0",
          isMobileView ? "pt-2 pb-2" : "pt-3 pb-2"
        )}
      >
        <p className="text-sm text-muted-foreground">
          using this space to keep track of things I&apos;ve read (updated weekly)
          {(usingFallback || allUsingFallback) && (
            <span className="block text-xs text-amber-600/90 dark:text-amber-400/90 mt-1">
              Showing demo data — connect Supabase or run migrations to load your rows.
            </span>
          )}
        </p>
        <div className="flex items-center justify-between gap-2 mt-3">
          <div className="flex items-center gap-2" onMouseDown={(e) => e.stopPropagation()}>
            <div className="flex items-center bg-background/50 rounded-lg p-0.5 border border-border/50 backdrop-blur-md">
              {SUBVIEW_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSubviewChange(option.value)}
                  className={cn(
                    "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                    subview === option.value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground can-hover:hover:text-foreground"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {subview === "calendar" && (
              <div className="flex items-center bg-background/50 rounded-lg p-0.5 border border-border/50 backdrop-blur-md">
                {CALENDAR_VIEW_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleCalendarViewChange(option.value)}
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                      calendarView === option.value
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground can-hover:hover:text-foreground"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0" onMouseDown={(e) => e.stopPropagation()}>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-3 text-sm">
                  Categories
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="end" className="w-auto p-3">
                <div className="flex flex-col gap-1.5">
                  {CONSUMPTION_CATEGORIES.map((category) => {
                    const color = CATEGORY_COLORS[category];
                    return (
                      <span
                        key={category}
                        className="inline-flex items-center gap-2 text-xs text-foreground"
                      >
                        <span
                          className={cn("w-2.5 h-2.5 rounded-full shrink-0", categoryDotClassName(color))}
                          style={{ backgroundColor: color }}
                          aria-hidden
                        />
                        {CATEGORY_LABELS[category]}
                      </span>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate("prev")}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleToday} className="h-8 px-3 text-sm">
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate("next")}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col">
        {((subview === "list" ? allLoading : loading) &&
          (subview === "list" ? allLogs.length === 0 : logs.length === 0)) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
            <ConsumptionLoadingDots />
          </div>
        )}

        {subview === "list" ? (
          <ConsumptionList
            logs={allLogs}
            loading={allLoading}
            error={allError}
            highlightDate={highlightDate}
            isMobileView={isMobileView}
          />
        ) : calendarView === "month" ? (
          <ConsumptionMonthView
            currentDate={currentDate}
            events={visibleEvents}
            calendars={CONSUMPTION_CALENDARS}
            onDayClick={handleDayClick}
          />
        ) : calendarView === "week" ? (
          <ConsumptionWeekView
            currentDate={currentDate}
            events={visibleEvents}
            calendars={CONSUMPTION_CALENDARS}
            onDayClick={handleDayClick}
          />
        ) : (
          <ConsumptionYearView
            currentDate={currentDate}
            events={visibleEvents}
            calendars={CONSUMPTION_CALENDARS}
            onDayClick={handleDayClick}
            onMonthClick={handleMonthClick}
          />
        )}
      </div>
    </div>
  );
}
