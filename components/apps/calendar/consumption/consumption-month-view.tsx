"use client";

import { useMemo } from "react";
import { format, isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { getMonthViewDays, isToday } from "../utils";
import type { Calendar, CalendarEvent } from "../types";
import type { ConsumptionCalendarEvent } from "./logs-to-events";
import { BRAND_COLORS, categoryDotClassName } from "./category-styles";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
}

export function ConsumptionMonthView({
  currentDate,
  events,
  calendars,
  onDayClick,
}: ConsumptionMonthViewProps) {
  const days = useMemo(() => getMonthViewDays(currentDate), [currentDate]);

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full bg-background text-foreground">
      <div className="px-4 py-3 border-b border-border bg-background shrink-0">
        <h1 className="text-2xl font-semibold">{format(currentDate, "MMMM yyyy")}</h1>
      </div>

      <div className="grid grid-cols-7 border-b border-border bg-muted/30 shrink-0">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center py-2 text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto consumption-scrollbar">
        <div className="grid grid-cols-7 auto-rows-fr min-h-full">
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
                  "flex flex-col min-h-[88px] border-b border-r border-border p-1.5 transition-colors",
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
