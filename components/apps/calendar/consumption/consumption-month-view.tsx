"use client";

import { useMemo } from "react";
import { format, isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { getMonthViewDays, isToday } from "../utils";
import type { Calendar, CalendarEvent } from "../types";
import type { ConsumptionCalendarEvent } from "./logs-to-events";
import { BRAND_COLORS, categoryDotClassName } from "./category-styles";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_MOBILE = ["S", "M", "T", "W", "T", "F", "S"];

function eventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  const dayStr = format(day, "yyyy-MM-dd");
  return events.filter((e) => dayStr >= e.startDate && dayStr <= e.endDate);
}

function getCalendarColor(calendars: Calendar[], calendarId: string): string {
  return calendars.find((c) => c.id === calendarId)?.color ?? BRAND_COLORS.sea;
}

interface ConsumptionMonthViewProps {
  currentDate: Date;
  events: ConsumptionCalendarEvent[];
  calendars: Calendar[];
  onDayClick: (date: Date) => void;
  isMobileView?: boolean;
}

export function ConsumptionMonthView({
  currentDate,
  events,
  calendars,
  onDayClick,
  isMobileView = false,
}: ConsumptionMonthViewProps) {
  const days = useMemo(() => getMonthViewDays(currentDate), [currentDate]);
  const weekdayLabels = isMobileView ? WEEKDAYS_MOBILE : WEEKDAYS;

  return (
    <div className={cn("flex flex-col flex-1 min-h-0 h-full bg-background text-foreground min-w-0", isMobileView && "overflow-x-hidden")}>
      {!isMobileView && (
        <div className="border-b border-border bg-background shrink-0 px-4 py-3">
          <h1 className="font-semibold truncate text-2xl">
            {format(currentDate, "MMMM yyyy")}
          </h1>
        </div>
      )}

      <div className="grid grid-cols-7 border-b border-border bg-muted/30 shrink-0 min-w-0">
        {weekdayLabels.map((day, index) => (
          <div
            key={`${day}-${index}`}
            className={cn(
              "text-center font-medium text-muted-foreground py-2 text-sm",
              isMobileView && "text-base py-2.5"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden consumption-scrollbar">
        <div className="grid grid-cols-7 auto-rows-fr min-h-full min-w-0">
          {days.map((day) => {
            const dayEvents = eventsForDay(events, day);
            const inMonth = isSameMonth(day, currentDate);
            const dayIsToday = isToday(day);
            const hasContent = inMonth && dayEvents.length > 0;

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => onDayClick(day)}
                className={cn(
                  "flex flex-col border-b border-r border-border transition-colors min-w-0",
                  isMobileView ? "min-h-[72px] p-1" : "min-h-[88px] p-1.5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                  !inMonth && "bg-muted/10 text-muted-foreground/50",
                  inMonth && "can-hover:hover:bg-muted/30",
                  hasContent && "can-hover:hover:bg-muted/50"
                )}
              >
                <div className="flex justify-center w-full">
                  <span
                    className={cn(
                      "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                      isMobileView && "text-base w-8 h-8",
                      dayIsToday && inMonth && "text-white"
                    )}
                    style={
                      dayIsToday && inMonth
                        ? { backgroundColor: BRAND_COLORS.tangerine }
                        : undefined
                    }
                  >
                    {format(day, "d")}
                  </span>
                </div>

                <div className="flex-1 min-h-[6px]" />

                {hasContent && (
                  <div className="flex flex-wrap gap-1 justify-center items-center pb-1.5 px-1">
                    {dayEvents.map((event) => {
                      const dotColor = getCalendarColor(calendars, event.calendarId);
                      return (
                        <span
                          key={event.id}
                          className={cn("w-2 h-2 rounded-full shrink-0", categoryDotClassName(dotColor))}
                          style={{ backgroundColor: dotColor }}
                          title={(event as ConsumptionCalendarEvent).title}
                        />
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
