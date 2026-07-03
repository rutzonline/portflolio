import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatRelativeTime,
  getLastSpeaker,
  getConversationState,
  formatConversationReversed,
} from "@/lib/messages/temporal-context";
import type { Message } from "@/types/messages";

function makeMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: "msg-1",
    sender: "alice",
    content: "Hello",
    timestamp: new Date().toISOString(),
    reactions: [],
    ...overrides,
  } as Message;
}

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'just now' for < 60 seconds ago", () => {
    const timestamp = new Date("2024-06-15T11:59:30Z").toISOString();
    expect(formatRelativeTime(timestamp)).toBe("just now");
  });

  it("returns '1 min ago' for 1 minute ago", () => {
    const timestamp = new Date("2024-06-15T11:59:00Z").toISOString();
    expect(formatRelativeTime(timestamp)).toBe("1 min ago");
  });

  it("returns 'N min ago' for minutes < 60", () => {
    const timestamp = new Date("2024-06-15T11:45:00Z").toISOString();
    expect(formatRelativeTime(timestamp)).toBe("15 min ago");
  });

  it("returns '1 hour ago' for 1 hour ago", () => {
    const timestamp = new Date("2024-06-15T11:00:00Z").toISOString();
    expect(formatRelativeTime(timestamp)).toBe("1 hour ago");
  });

  it("returns 'N hours ago' for hours < 24", () => {
    const timestamp = new Date("2024-06-15T06:00:00Z").toISOString();
    expect(formatRelativeTime(timestamp)).toBe("6 hours ago");
  });

  it("returns 'yesterday' for 1 day ago", () => {
    const timestamp = new Date("2024-06-14T12:00:00Z").toISOString();
    expect(formatRelativeTime(timestamp)).toBe("yesterday");
  });

  it("returns 'N days ago' for < 7 days", () => {
    const timestamp = new Date("2024-06-12T12:00:00Z").toISOString();
    expect(formatRelativeTime(timestamp)).toBe("3 days ago");
  });

  it("returns formatted date for >= 7 days", () => {
    const timestamp = new Date("2024-06-01T14:30:00Z").toISOString();
    const result = formatRelativeTime(timestamp);
    expect(result).toContain("Jun");
    expect(result).toContain("1");
  });
});

describe("getLastSpeaker", () => {
  it("returns null for empty messages", () => {
    expect(getLastSpeaker([])).toBeNull();
  });

  it("returns the last non-system sender", () => {
    const messages = [
      makeMessage({ sender: "alice" }),
      makeMessage({ sender: "bob" }),
      makeMessage({ sender: "system" }),
    ];
    expect(getLastSpeaker(messages)).toBe("bob");
  });

  it("skips system messages", () => {
    const messages = [
      makeMessage({ sender: "alice" }),
      makeMessage({ sender: "system" }),
    ];
    expect(getLastSpeaker(messages)).toBe("alice");
  });
});

describe("getConversationState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts messages since last human message", () => {
    const messages = [
      makeMessage({ sender: "me", content: "Hi", timestamp: "2024-06-15T11:50:00Z" }),
      makeMessage({ sender: "alice", content: "Hello", timestamp: "2024-06-15T11:51:00Z" }),
      makeMessage({ sender: "bob", content: "Hey", timestamp: "2024-06-15T11:52:00Z" }),
    ];
    const state = getConversationState(messages);
    expect(state.messagesSinceHuman).toBe(2);
    expect(state.lastHumanMessage).toBe("Hi");
    expect(state.lastSpeaker).toBe("bob");
  });

  it("returns null when no human messages exist", () => {
    const messages = [
      makeMessage({ sender: "alice", content: "Hello" }),
    ];
    const state = getConversationState(messages);
    expect(state.lastHumanMessage).toBeNull();
    expect(state.lastHumanTime).toBeNull();
  });
});

describe("formatConversationReversed", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null mostRecent for empty array", () => {
    const result = formatConversationReversed([]);
    expect(result.mostRecent).toBeNull();
    expect(result.history).toBe("");
  });

  it("filters out system messages", () => {
    const messages = [
      makeMessage({ sender: "system", content: "joined" }),
      makeMessage({ sender: "alice", content: "Hello", timestamp: "2024-06-15T11:59:00Z" }),
    ];
    const result = formatConversationReversed(messages);
    expect(result.mostRecent).toContain("alice: Hello");
    expect(result.history).toBe("");
  });

  it("replaces 'me' with 'anon'", () => {
    const messages = [
      makeMessage({ sender: "me", content: "Hi", timestamp: "2024-06-15T11:58:00Z" }),
      makeMessage({ sender: "alice", content: "Hey", timestamp: "2024-06-15T11:59:00Z" }),
    ];
    const result = formatConversationReversed(messages);
    expect(result.mostRecent).toContain("alice: Hey");
    expect(result.history).toContain("anon: Hi");
    expect(result.history).not.toContain("me:");
  });
});
