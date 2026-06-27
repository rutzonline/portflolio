import type { CalendarEvent } from "../types";
import type { ConsumptionLog } from "@/types/consumption";
import { calendarIdForCategory } from "./consumption-calendars";
export type ConsumptionCalendarEvent = CalendarEvent & {
  url: string;
  category: string;
  platform: string | null;
};

export function consumptionLogsToEvents(logs: ConsumptionLog[]): ConsumptionCalendarEvent[] {
  return logs.map((log) => ({
    id: log.id,
    title: log.title,
    startDate: log.consumed_on,
    endDate: log.consumed_on,
    isAllDay: true,
    calendarId: calendarIdForCategory(log.category),
    url: log.url,
    category: log.category,
    platform: log.platform,
  }));
}

export function openConsumptionUrl(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}