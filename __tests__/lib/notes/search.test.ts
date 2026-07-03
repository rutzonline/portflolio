import { describe, it, expect } from "vitest";
import { searchNotes } from "@/lib/notes/search";
import type { Note } from "@/lib/notes/types";

function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: "1",
    slug: "test",
    title: "Default Title",
    content: "Default content",
    created_at: "2024-06-15T12:00:00Z",
    session_id: null,
    public: true,
    ...overrides,
  };
}

describe("searchNotes", () => {
  const sessionId = "session-123";

  it("returns all accessible notes matching title", () => {
    const notes = [
      makeNote({ id: "1", title: "React Hooks Guide", content: "useEffect" }),
      makeNote({ id: "2", title: "CSS Tips", content: "flexbox" }),
    ];
    const result = searchNotes(notes, "react", sessionId);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("matches content as well as title", () => {
    const notes = [
      makeNote({ id: "1", title: "Guide", content: "Learn about flexbox" }),
    ];
    const result = searchNotes(notes, "flexbox", sessionId);
    expect(result).toHaveLength(1);
  });

  it("is case-insensitive", () => {
    const notes = [makeNote({ title: "TypeScript", content: "" })];
    const result = searchNotes(notes, "typescript", sessionId);
    expect(result).toHaveLength(1);
  });

  it("excludes private notes from other sessions", () => {
    const notes = [
      makeNote({ id: "1", title: "Secret", public: false, session_id: "other-session" }),
      makeNote({ id: "2", title: "Secret Public", public: true }),
    ];
    const result = searchNotes(notes, "secret", sessionId);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("includes private notes from the current session", () => {
    const notes = [
      makeNote({ id: "1", title: "My Private Note", public: false, session_id: sessionId }),
    ];
    const result = searchNotes(notes, "private", sessionId);
    expect(result).toHaveLength(1);
  });

  it("trims whitespace from search term", () => {
    const notes = [makeNote({ title: "Hello World" })];
    const result = searchNotes(notes, "  hello  ", sessionId);
    expect(result).toHaveLength(1);
  });

  it("returns empty array when no matches", () => {
    const notes = [makeNote({ title: "Foo", content: "Bar" })];
    const result = searchNotes(notes, "zzz", sessionId);
    expect(result).toHaveLength(0);
  });
});
