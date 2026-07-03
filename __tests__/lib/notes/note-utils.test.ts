import { describe, it, expect } from "vitest";
import { groupNotesByCategory, sortGroupedNotes } from "@/lib/notes/note-utils";
import type { Note } from "@/lib/notes/types";

function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: "1",
    slug: "test-note",
    title: "Test Note",
    content: "Some content",
    created_at: new Date().toISOString(),
    session_id: null,
    public: false,
    ...overrides,
  };
}

describe("groupNotesByCategory", () => {
  it("places pinned notes in 'pinned' group", () => {
    const notes = [makeNote({ slug: "a" }), makeNote({ slug: "b" })];
    const pinned = new Set(["a"]);

    const groups = groupNotesByCategory(notes, pinned);
    expect(groups.pinned).toHaveLength(1);
    expect(groups.pinned[0].slug).toBe("a");
  });

  it("groups today's notes under 'today'", () => {
    const now = new Date();
    const notes = [makeNote({ slug: "today-note", created_at: now.toISOString() })];
    const groups = groupNotesByCategory(notes, new Set());
    expect(groups.today).toHaveLength(1);
  });

  it("groups yesterday's notes under 'yesterday'", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const notes = [makeNote({ slug: "y", created_at: yesterday.toISOString() })];
    const groups = groupNotesByCategory(notes, new Set());
    expect(groups.yesterday).toHaveLength(1);
  });

  it("groups notes from the last 7 days under '7'", () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const notes = [makeNote({ slug: "w", created_at: threeDaysAgo.toISOString() })];
    const groups = groupNotesByCategory(notes, new Set());
    expect(groups["7"]).toHaveLength(1);
  });

  it("groups notes from the last 30 days under '30'", () => {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    const notes = [makeNote({ slug: "m", created_at: fifteenDaysAgo.toISOString() })];
    const groups = groupNotesByCategory(notes, new Set());
    expect(groups["30"]).toHaveLength(1);
  });

  it("groups older notes under 'older'", () => {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const notes = [makeNote({ slug: "o", created_at: sixtyDaysAgo.toISOString() })];
    const groups = groupNotesByCategory(notes, new Set());
    expect(groups.older).toHaveLength(1);
  });

  it("uses note.category for public notes", () => {
    const notes = [
      makeNote({ slug: "pub", public: true, category: "design" }),
    ];
    const groups = groupNotesByCategory(notes, new Set());
    expect(groups.design).toHaveLength(1);
  });

  it("defaults public notes without category to 'older'", () => {
    const notes = [makeNote({ slug: "pub", public: true, category: undefined })];
    const groups = groupNotesByCategory(notes, new Set());
    expect(groups.older).toHaveLength(1);
  });
});

describe("sortGroupedNotes", () => {
  it("sorts notes within each category by created_at descending", () => {
    const groups = {
      pinned: [],
      today: [
        makeNote({ slug: "a", created_at: "2024-06-15T08:00:00Z" }),
        makeNote({ slug: "b", created_at: "2024-06-15T12:00:00Z" }),
        makeNote({ slug: "c", created_at: "2024-06-15T10:00:00Z" }),
      ],
    };
    sortGroupedNotes(groups);
    expect(groups.today[0].slug).toBe("b");
    expect(groups.today[1].slug).toBe("c");
    expect(groups.today[2].slug).toBe("a");
  });
});
