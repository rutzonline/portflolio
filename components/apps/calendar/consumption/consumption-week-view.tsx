"use client";

import { useMemo, useCallback } from "react";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { getWeekDays } from "../utils";
import type { Calendar, CalendarEvent } from "../types";
import type { ConsumptionCalendarEvent } from "./logs-to-events";
import { openConsumptionUrl } from "./logs-to-events";
import { BRAND_COLORS } from "./category-styles";

interface ConsumptionWeekViewProps {
  currentDate: Date;
  events: ConsumptionCalendarEvent[];
  calendars: Calendar[];
  onDayClick?: (date: Date) => void;
}

function eventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  const dayStr = format(day, "yyyy-MM-dd");
  return events.filter((e) => dayStr >= e.startDate && dayStr <= e.endDate);
}

export function ConsumptionWeekView({
  currentDate,
  events,
  calendars,
  onDayClick,
}: ConsumptionWeekViewProps) {
  const weekDays = getWeekDays(currentDate);

  const getCalendarColor = useCallback(
    (calendarId: string): string => {
      const calendar = calendars.find((c) => c.id === calendarId);
      return calendar?.color || BRAND_COLORS.sea;
    },
    [calendars]
  );

  const eventsByDay = useMemo(
    () => weekDays.map((day) => eventsForDay(events, day)),
    [weekDays, events]
  );

  const weekLabel = `${format(weekDays[0], "MMM d")} – ${format(weekDays[6], "MMM d, yyyy")}`;

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full bg-background text-foreground">
      <div className="px-4 py-3 border-b border-border bg-background shrink-0">
        <h1 className="text-2xl font-semibold">{weekLabel}</h1>
      </div>

      <div className="grid grid-cols-7 border-b border-border bg-muted/30 shrink-0">
        {weekDays.map((date) => {
          const dayIsToday = isToday(date);
          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onDayClick?.(date)}
              className={cn(
                "py-2 text-center border-l border-border first:border-l-0 transition-colors",
                "can-hover:hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              )}
            >
              <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                {format(date, "EEE")}
              </div>
              <div
                className={cn(
                  "text-lg font-semibold mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-full",
                  dayIsToday && "text-white"
                )}
                style={
                  dayIsToday ? { backgroundColor: BRAND_COLORS.tangerine } : undefined
                }
              >
                {format(date, "d")}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto consumption-scrollbar">
        <div className="grid grid-cols-7 min-h-full">
          {weekDays.map((date, idx) => {
            const dayEvents = eventsByDay[idx];
            const accentColor =
              dayEvents.length > 0 ? getCalendarColor(dayEvents[0].calendarId) : undefined;

            return (
              <div
                key={date.toISOString()}
                className="border-l border-border first:border-l-0 min-h-[200px] flex flex-col"
                style={
                  accentColor
                    ? { borderTopWidth: 2, borderTopColor: accentColor, borderTopStyle: "solid" }
                    : undefined
                }
              >
                <div className="p-1.5 space-y-1 flex-1">
                  {dayEvents.map((event) => {
                    const consumption = event as ConsumptionCalendarEvent;
                    const color = getCalendarColor(event.calendarId);
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => openConsumptionUrl(consumption.url)}
                        className="w-full text-left text-[11px] font-medium px-1.5 py-1 rounded-[4px] truncate text-white shadow-sm can-hover:hover:brightness-110 transition-[filter]"
                        style={{ backgroundColor: color }}
                        title={event.title}
                      >
                        {event.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
