import type { Calendar } from "../types";
import { CATEGORY_COLORS, CATEGORY_LABELS, isConsumptionCategory } from "./category-styles";
import type { ConsumptionCategory } from "@/types/consumption";

export const CONSUMPTION_CALENDARS: Calendar[] = (
  Object.keys(CATEGORY_COLORS) as ConsumptionCategory[]
).map((key) => ({
  id: `consumption-${key}`,
  name: CATEGORY_LABELS[key],
  color: CATEGORY_COLORS[key],
}));

export function calendarIdForCategory(category: string): string {
  if (isConsumptionCategory(category)) return `consumption-${category}`;
  return "consumption-article";
}
