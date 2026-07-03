import { format, isToday, isYesterday, isThisWeek, parseISO } from "date-fns";

export function formatMessageTime(timestamp: string | undefined): string {
  if (!timestamp) return "";

  try {
    const date = parseISO(timestamp);

    if (isToday(date)) {
      return format(date, "HH:mm");
    }

    if (isYesterday(date)) {
      return "Yesterday";
    }

    if (isThisWeek(date)) {
      return format(date, "EEEE");
    }

    return format(date, "M/d/yy");
  } catch (error) {
    console.error("Error formatting time:", error, timestamp);
    return "Just now";
  }
}

export function getInitials(name: string): string {
  const names = name.split(" ");
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name[0].toUpperCase();
}
