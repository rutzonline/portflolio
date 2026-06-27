"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  stickyNoteShellClass,
  STICKY_NOTE_TITLE_BAR_CLASS,
  STICKY_NOTE_TITLE_CLASS,
  STICKY_NOTE_FOOTER_DIVIDER_CLASS,
} from "./sticky-note-styles";
import { getMaxOpenWindowZIndex, useWindowManager } from "@/lib/window-context";

const DEFAULT_TODOS = [
  { id: "1", text: "update supabase db", done: false },
  { id: "2", text: "email paul", done: true },
  { id: "3", text: "check out clicky", done: false },
  { id: "4", text: "clear phone storage", done: false },
  { id: "5", text: "cancel unused subs", done: false },
];

const POS_STORAGE_KEY = "desktop_sticky_note_pos_v4";
const TODOS_STORAGE_KEY = "desktop_sticky_note_todos_v2";
const DEFAULT_POS = { x: 0, y: 0 };

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

function clampPosition(pos: { x: number; y: number }): { x: number; y: number } {
  if (typeof window === "undefined") return pos;
  const noteWidth = 220;
  const margin = 20;
  const topOffset = 108;
  const minX = -(window.innerWidth - noteWidth - margin * 2);
  const maxX = margin;
  const minY = -topOffset + 8;
  const maxY = window.innerHeight - 220;
  return {
    x: Math.min(maxX, Math.max(minX, pos.x)),
    y: Math.min(maxY, Math.max(minY, pos.y)),
  };
}

function loadPosition(): { x: number; y: number } {
  if (typeof window === "undefined") return DEFAULT_POS;
  try {
    const raw = localStorage.getItem(POS_STORAGE_KEY);
    if (!raw) return DEFAULT_POS;
    const parsed = JSON.parse(raw) as { x?: number; y?: number };
    if (typeof parsed.x === "number" && typeof parsed.y === "number")
      return clampPosition({ x: parsed.x, y: parsed.y });
  } catch {
    /* ignore */
  }
  return DEFAULT_POS;
}

function loadTodos(): TodoItem[] {
  if (typeof window === "undefined") return DEFAULT_TODOS;
  try {
    const raw = localStorage.getItem(TODOS_STORAGE_KEY);
    if (!raw) return DEFAULT_TODOS;
    const parsed = JSON.parse(raw) as TodoItem[];
    if (Array.isArray(parsed) && parsed.every((t) => t.id && typeof t.text === "string"))
      return parsed;
  } catch {
    /* ignore */
  }
  return DEFAULT_TODOS;
}

function saveTodos(todos: TodoItem[]) {
  try {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  } catch {
    /* ignore */
  }
}

export function DesktopStickyNote() {
  const { state, claimZIndex } = useWindowManager();
  const [visible, setVisible] = useState(true);
  const [offset, setOffset] = useState(DEFAULT_POS);
  const [todos, setTodos] = useState<TodoItem[]>(DEFAULT_TODOS);
  const [newItem, setNewItem] = useState("");
  const [dragging, setDragging] = useState(false);
  const [elevated, setElevated] = useState(false);
  const [zIndex, setZIndex] = useState(8);
  const [hoverControls, setHoverControls] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
    null
  );

  useEffect(() => {
    setVisible(true);
    setOffset(loadPosition());
    setTodos(loadTodos());
    // Clear legacy dismiss flag so the note reappears after a prior close
    try {
      localStorage.removeItem("desktop_sticky_note_hidden");
    } catch {
      /* ignore */
    }
  }, []);

  const maxWindowZ = getMaxOpenWindowZIndex(state);

  useEffect(() => {
    if (elevated) return;
    const behind = maxWindowZ > 0 ? maxWindowZ - 1 : 8;
    setZIndex(Math.max(1, behind));
  }, [maxWindowZ, elevated, state.focusedWindowId]);

  const persistTodos = useCallback((next: TodoItem[]) => {
    setTodos(next);
    saveTodos(next);
  }, []);

  const dismiss = () => {
    setVisible(false);
  };

  const toggleTodo = (id: string) =>
    persistTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const addTodo = () => {
    const text = newItem.trim();
    if (!text) return;
    persistTodos([...todos, { id: crypto.randomUUID(), text, done: false }]);
    setNewItem("");
  };

  const onDragHandlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
      setElevated(true);
      setZIndex(claimZIndex());
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        originX: offset.x,
        originY: offset.y,
      };
    },
    [offset, claimZIndex]
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    setOffset({
      x: dragRef.current.originX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.originY + (e.clientY - dragRef.current.startY),
    });
  }, []);

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const origin = dragRef.current;
    dragRef.current = null;
    setDragging(false);
    setElevated(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const next = clampPosition({
      x: origin.originX + (e.clientX - origin.startX),
      y: origin.originY + (e.clientY - origin.startY),
    });
    setOffset(next);
    try {
      localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const raiseNote = () => {
    setElevated(true);
    setZIndex(claimZIndex());
  };

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none select-none w-[220px]"
      style={{
        top: 108,
        right: 48,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        zIndex,
      }}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        role="note"
        className={cn(
          "pointer-events-auto relative rounded-xl",
          stickyNoteShellClass(),
          dragging && "shadow-2xl"
        )}
      >
        {/* Title bar */}
        <div
          className={cn(
            STICKY_NOTE_TITLE_BAR_CLASS,
            "cursor-grab active:cursor-grabbing touch-none"
          )}
          onPointerDown={onDragHandlePointerDown}
          onMouseEnter={() => setHoverControls(true)}
          onMouseLeave={() => setHoverControls(false)}
        >
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              aria-label="close"
              onClick={dismiss}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57] flex items-center justify-center transition-colors"
            >
              {hoverControls && (
                <svg className="w-1.5 h-1.5" viewBox="0 0 6 6" fill="none">
                  <path
                    d="M1 1l4 4M5 1L1 5"
                    stroke="#7a0000"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>

          <span className={STICKY_NOTE_TITLE_CLASS}>to-do</span>
        </div>

        {/* Content */}
        <div className="px-3 py-2.5">
          <ul className="space-y-1.5 mb-3">
            {todos.map((item) => (
              <li key={item.id}>
                <label className="flex gap-2 items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleTodo(item.id)}
                    className="mt-0.5 shrink-0 size-3 rounded-sm accent-blue-500"
                  />
                  <span
                    className={cn(
                      "text-[12px] leading-snug transition-colors",
                      item.done ? "line-through text-zinc-400 dark:text-zinc-600" : "text-zinc-700 dark:text-zinc-300"
                    )}
                  >
                    {item.text}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          {/* Add item */}
          <div className={cn("flex gap-1.5 items-center", STICKY_NOTE_FOOTER_DIVIDER_CLASS)}>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo();
              }}
              onFocus={raiseNote}
              placeholder="add item..."
              className="flex-1 min-w-0 bg-transparent text-[12px] text-zinc-800 placeholder:text-zinc-400 outline-none dark:text-zinc-300 dark:placeholder:text-zinc-600"
            />
            <button
              type="button"
              onClick={addTodo}
              className="text-[14px] font-medium text-zinc-400 can-hover:hover:text-zinc-700 transition-colors leading-none dark:text-zinc-500 dark:can-hover:hover:text-zinc-200"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
