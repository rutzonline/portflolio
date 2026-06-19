export const CONSUMPTION_CATEGORIES = [
  "video",
  "article",
  "newsletter",
  "post",
  "podcast",
] as const;

export type ConsumptionCategory = (typeof CONSUMPTION_CATEGORIES)[number];

export interface ConsumptionLog {
  id: string;
  consumed_on: string;
  title: string;
  url: string;
  category: ConsumptionCategory;
  platform: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
}
