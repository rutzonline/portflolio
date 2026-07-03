import { describe, it, expect } from "vitest";
import { formatDuration, formatTotalDuration } from "@/lib/music/utils";

describe("formatDuration", () => {
  it("formats 0 seconds as 0:00", () => {
    expect(formatDuration(0)).toBe("0:00");
  });

  it("formats seconds less than a minute", () => {
    expect(formatDuration(5)).toBe("0:05");
    expect(formatDuration(59)).toBe("0:59");
  });

  it("formats full minutes", () => {
    expect(formatDuration(60)).toBe("1:00");
    expect(formatDuration(120)).toBe("2:00");
  });

  it("formats minutes and seconds", () => {
    expect(formatDuration(90)).toBe("1:30");
    expect(formatDuration(185)).toBe("3:05");
    expect(formatDuration(3661)).toBe("61:01");
  });

  it("floors fractional seconds", () => {
    expect(formatDuration(90.7)).toBe("1:30");
    expect(formatDuration(61.9)).toBe("1:01");
  });
});

describe("formatTotalDuration", () => {
  it("formats minutes only when under an hour", () => {
    expect(formatTotalDuration(0)).toBe("0 min");
    expect(formatTotalDuration(300)).toBe("5 min");
    expect(formatTotalDuration(3599)).toBe("59 min");
  });

  it("formats hours and minutes", () => {
    expect(formatTotalDuration(3600)).toBe("1 hr 0 min");
    expect(formatTotalDuration(4980)).toBe("1 hr 23 min");
    expect(formatTotalDuration(7200)).toBe("2 hr 0 min");
    expect(formatTotalDuration(9000)).toBe("2 hr 30 min");
  });
});
