"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getYearMonths, getMonthViewDays, isToday, isSameMonth } from "../utils";
import type { Calendar, CalendarEvent } from "../types";
import { BRAND_COLORS, categoryDotClassName } from "./category-styles";

const WEEKDAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

function eventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  const dayStr = format(day, "yyyy-MM-dd");
  return events.filter((e) => dayStr >= e.startDate && dayStr <= e.endDate);
}

function getCalendarColor(calendars: Calendar[], calendarId: string): string {
  return calendars.find((c) => c.id === calendarId)?.color ?? BRAND_COLORS.sea;
}

interface ConsumptionYearViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  calendars: Calendar[];
  onDayClick: (date: Date) => void;
  onMonthClick: (date: Date) => void;
  isMobileView?: boolean;
}

function MiniMonth({
  monthDate,
  events,
  calendars,
  onDayClick,
  onMonthClick,
  isMobileView = false,
}: {
  monthDate: Date;
  events: CalendarEvent[];
  calendars: Calendar[];
  onDayClick: (date: Date) => void;
  onMonthClick: (date: Date) => void;
  isMobileView?: boolean;
}) {
  const days = getMonthViewDays(monthDate);
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div>
      <button
        type="button"
        className={cn("font-semibold mb-2 hover:underline text-left", isMobileView ? "text-base" : "text-sm")}
        style={{ color: BRAND_COLORS.tangerine }}
        onClick={() => onMonthClick(monthDate)}
      >
        {format(monthDate, "MMMM")}
      </button>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_LETTERS.map((letter, idx) => (
          <div
            key={idx}
            className={cn(
              "text-center text-muted-foreground",
              isMobileView ? "text-xs" : "text-[10px]"
            )}
          >
            {letter}
          </div>
        ))}
      </div>

      <div className="space-y-0.5">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7">
            {week.map((day, dayIdx) => {
              const isCurrentMonth = isSameMonth(day, monthDate);
              const dayIsToday = isToday(day);
              const dayEvents = eventsForDay(events, day);

              return (
                <button
                  key={dayIdx}
                  type="button"
                  className={cn(
                    "aspect-square flex flex-col items-center justify-center rounded-full transition-colors relative",
                    isMobileView ? "text-xs" : "text-[10px]",
                    !isCurrentMonth && "text-transparent pointer-events-none",
                    isCurrentMonth && "text-foreground can-hover:hover:bg-muted/60",
                    dayIsToday && isCurrentMonth && "text-white"
                  )}
                  style={
                    dayIsToday && isCurrentMonth
                      ? { backgroundColor: BRAND_COLORS.tangerine }
                      : undefined
                  }
                  onClick={() => isCurrentMonth && onDayClick(day)}
                  disabled={!isCurrentMonth}
                >
                  <span>{format(day, "d")}</span>
                  {isCurrentMonth && dayEvents.length > 0 && !dayIsToday && (
                    <span className="flex gap-[2px] mt-[1px] absolute bottom-0.5">
                      {dayEvents.slice(0, 3).map((ev) => {
                        const dotColor = getCalendarColor(calendars, ev.calendarId);
                        return (
                          <span
                            key={ev.id}
                            className={cn("w-1 h-1 rounded-full", categoryDotClassName(dotColor))}
                            style={{ backgroundColor: dotColor }}
                          />
                        );
                      })}
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

export function ConsumptionYearView({
  currentDate,
  events,
  calendars,
  onDayClick,
  onMonthClick,
  isMobileView = false,
}: ConsumptionYearViewProps) {
  const year = currentDate.getFullYear();
  const months = useMemo(() => getYearMonths(year), [year]);

  return (
    <div className={cn("flex flex-col flex-1 min-h-0 h-full bg-background text-foreground min-w-0", isMobileView && "overflow-x-hidden")}>
      {!isMobileView && (
        <div className="border-b border-border bg-background shrink-0 px-4 py-3">
          <h1 className="font-semibold text-2xl">{year}</h1>
        </div>
      )}

      <div className={cn("flex-1 min-h-0 overflow-y-auto overflow-x-hidden consumption-scrollbar", isMobileView ? "p-3" : "p-4")}>
        <div className="grid grid-cols-2 desktop:grid-cols-4 gap-x-4 desktop:gap-x-6 gap-y-6 max-w-5xl min-w-0">
          {months.map((monthDate, monthIdx) => (
            <MiniMonth
              key={monthIdx}
              monthDate={monthDate}
              events={events}
              calendars={calendars}
              onDayClick={onDayClick}
              onMonthClick={onMonthClick}
              isMobileView={isMobileView}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
