"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  getYearMonths,
  getMonthViewDays,
  isToday,
  isSameMonth,
  format,
} from "./utils";
import type { CalendarEvent, Calendar } from "./types";

interface YearViewProps {
  currentDate: Date;
  onMonthClick?: (date: Date) => void;
  onDateClick?: (date: Date) => void;
  onYearChange?: (date: Date) => void;
  /** Heatmap dots for consumption mode */
  events?: CalendarEvent[];
  calendars?: Calendar[];
  eventsOnly?: boolean;
}

const WEEKDAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

// Simple approach: render a fixed range of years (no virtualization needed for year view)
const YEARS_BEFORE = 10;
const YEARS_AFTER = 10;

function countEventsOnDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  const dayStr = format(day, "yyyy-MM-dd");
  return events.filter((e) => dayStr >= e.startDate && dayStr <= e.endDate);
}

export function YearView({
  currentDate,
  onMonthClick,
  onDateClick,
  onYearChange,
  events = [],
  calendars = [],
  eventsOnly = false,
}: YearViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const yearRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [visibleYear, setVisibleYear] = useState(currentDate.getFullYear());
  const visibleYearRef = useRef(visibleYear);
  const initialScrollDone = useRef(false);
  const lastCurrentDate = useRef(currentDate);

  // Keep ref in sync with state
  useEffect(() => {
    visibleYearRef.current = visibleYear;
  }, [visibleYear]);

  // Generate array of years to render
  const currentYear = currentDate.getFullYear();
  const years: number[] = [];
  for (let i = -YEARS_BEFORE; i <= YEARS_AFTER; i++) {
    years.push(currentYear + i);
  }

  // Scroll to current year on mount or when currentDate changes
  useEffect(() => {
    const dateChanged = lastCurrentDate.current.getTime() !== currentDate.getTime();

    if (!initialScrollDone.current || dateChanged) {
      const yearEl = yearRefs.current.get(currentDate.getFullYear());
      if (yearEl && scrollRef.current) {
        const containerHeight = scrollRef.current.clientHeight;
        const yearTop = yearEl.offsetTop;
        const scrollTop = yearTop - containerHeight / 4;
        scrollRef.current.scrollTop = Math.max(0, scrollTop);
        initialScrollDone.current = true;
        lastCurrentDate.current = currentDate;

        if (dateChanged) {
          setVisibleYear(currentDate.getFullYear());
          onYearChange?.(currentDate);
        }
      }
    }
  }, [currentDate, onYearChange]);

  // Track visible year on scroll
  const handleScroll = useCallback(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const scrollTop = scrollEl.scrollTop;
    const viewportTop = scrollTop + 100; // A bit below the top

    // Find the year that's at the viewport top
    let closestYear = currentYear;
    let closestDistance = Infinity;

    yearRefs.current.forEach((el, year) => {
      const yearTop = el.offsetTop;
      const distance = Math.abs(yearTop - viewportTop);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestYear = year;
      }
    });

    // Use ref to avoid recreating callback when visibleYear changes
    if (closestYear !== visibleYearRef.current) {
      setVisibleYear(closestYear);
      onYearChange?.(new Date(closestYear, 0, 1));
    }
  }, [currentYear, onYearChange]);

  return (
    <div className="flex flex-col h-full">
      {/* Year header */}
      <div className="px-4 py-3 border-b border-border bg-background">
        <h1 className="text-2xl font-semibold">{visibleYear}</h1>
      </div>

      {/* Scrollable years container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        <div className="p-4 space-y-8">
          {years.map((year) => (
            <div
              key={year}
              ref={(el) => {
                if (el) {
                  yearRefs.current.set(year, el);
                } else {
                  yearRefs.current.delete(year);
                }
              }}
            >
              {/* Year label */}
              <div className="text-lg font-semibold text-muted-foreground mb-3">
                {year}
              </div>

              {/* Months grid */}
              <div className="grid grid-cols-2 desktop:grid-cols-4 gap-x-4 desktop:gap-x-6 gap-y-4">
                {getYearMonths(year).map((monthDate, monthIdx) => (
                  <MiniMonth
                    key={monthIdx}
                    monthDate={monthDate}
                    onMonthClick={onMonthClick}
                    onDateClick={onDateClick}
                    events={eventsOnly ? events : []}
                    calendars={calendars}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MiniMonthProps {
  monthDate: Date;
  onMonthClick?: (date: Date) => void;
  onDateClick?: (date: Date) => void;
  events: CalendarEvent[];
  calendars: Calendar[];
}

function MiniMonth({ monthDate, onMonthClick, onDateClick, events, calendars }: MiniMonthProps) {
  const getColor = (calendarId: string) =>
    calendars.find((c) => c.id === calendarId)?.color ?? "#34C759";
  const days = getMonthViewDays(monthDate);
  const weeks: Date[][] = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div>
      {/* Month name */}
      <button
        className="text-red-500 font-semibold mb-2 hover:underline text-left"
        onClick={() => onMonthClick?.(monthDate)}
      >
        {format(monthDate, "MMMM")}
      </button>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_LETTERS.map((letter, idx) => (
          <div
            key={idx}
            className="text-center text-[10px] desktop:text-xs text-muted-foreground"
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="space-y-0.5">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7">
            {week.map((day, dayIdx) => {
              const isCurrentMonth = isSameMonth(day, monthDate);
              const dayIsToday = isToday(day);

              const dayEvents = countEventsOnDay(events, day);
              const heatColor =
                dayEvents.length > 0 ? getColor(dayEvents[0].calendarId) : undefined;

              return (
                <button
                  key={dayIdx}
                  className={cn(
                    "text-[10px] desktop:text-xs aspect-square flex flex-col items-center justify-center rounded-full transition-colors relative",
                    !isCurrentMonth && "text-muted-foreground/50",
                    isCurrentMonth && "can-hover:hover:bg-muted",
                    dayIsToday && "bg-red-500 text-white can-hover:hover:bg-red-600"
                  )}
                  onClick={() => onDateClick?.(day)}
                  disabled={!isCurrentMonth}
                >
                  <span>{format(day, "d")}</span>
                  {heatColor && isCurrentMonth && !dayIsToday && (
                    <span className="flex gap-[2px] mt-[1px]">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <span
                          key={ev.id}
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: getColor(ev.calendarId) }}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
