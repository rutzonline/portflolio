/** Maps readme bold app labels (the site tab) to shell app ids or special actions. */
const APP_LABEL_TO_ID: Record<string, string> = {
  finder: "finder",
  notes: "notes",
  messages: "messages",
  photos: "photos",
  resume: "resume",
  calendar: "calendar",
  "misc": "desk",
  "beyond the desk": "desk",
  settings: "settings",
};

export type IntroReadmeAppAction = "trash";

export function normalizeReadmeAppLabel(label: string): string {
  return label.toLowerCase().replace(/['']/g, "").trim();
}

export function resolveIntroReadmeAppLink(label: string): string | IntroReadmeAppAction | null {
  const normalized = normalizeReadmeAppLabel(label);
  if (!normalized) return null;
  if (normalized === "trash") return "trash";
  if (normalized in APP_LABEL_TO_ID) return APP_LABEL_TO_ID[normalized];
  if (normalized.startsWith("resume")) return "resume";
  return null;
}
