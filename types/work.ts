export type CaseStudyTagColor =
  | "green"
  | "teal"
  | "purple"
  | "brown"
  | "red"
  | "yellow"
  | "blue"
  | "gray"
  | "pink";

export interface CaseStudyTag {
  label: string;
  color: CaseStudyTagColor;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  icon: string;
  gradient_from: string;
  gradient_to: string;
  body: string;
  tags: CaseStudyTag[];
  sort_order: number;
  published: boolean;
  created_at: string;
}
