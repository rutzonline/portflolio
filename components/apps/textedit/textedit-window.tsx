"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { WindowControls } from "@/components/window-controls";
import {
  stickyNoteShellClass,
  STICKY_NOTE_TITLE_BAR_CLASS,
  STICKY_NOTE_TITLE_CLASS,
} from "@/components/desktop/sticky-note-styles";
import {
  useWindowBehavior,
  Position,
  Size,
  MENU_BAR_HEIGHT,
  DOCK_HEIGHT,
  CORNER_SIZE,
  EDGE_SIZE,
} from "@/lib/use-window-behavior";
import { MAXIMIZED_Z_INDEX, useWindowManager } from "@/lib/window-context";
import { isIntroDocPath } from "@/lib/intro-doc";
import { isCaseStudyDocPath } from "@/lib/case-study-doc";
import type { IntroReadmeTabId } from "@/lib/intro-doc-baseline";
import { CaseStudyDetail } from "@/components/apps/work/case-studies/case-study-detail";
import type { CaseStudy } from "@/types/work";
import { IntroReadmeCarousel } from "./intro-readme-carousel";
import { IntroReadmePolaroid } from "./intro-readme-polaroid";

interface TextEditWindowProps {
  windowId: string; // Unique window identifier for multi-window support
  filePath: string;
  content: string;
  position: Position;
  size: Size;
  zIndex: number;
  isFocused: boolean;
  isMaximized: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onMove: (position: Position) => void;
  onResize: (size: Size, position?: Position) => void;
  onContentChange: (content: string) => void;
  onOpenApp?: (appId: string) => void;
  onOpenTrash?: () => void;
  caseStudy?: CaseStudy;
}

export function TextEditWindow({
  windowId,
  filePath,
  content,
  position,
  size,
  zIndex,
  isFocused,
  isMaximized,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
  onResize,
  onContentChange,
  onOpenApp,
  onOpenTrash,
  caseStudy,
}: TextEditWindowProps) {
  // windowId is used for identification in multi-window scenarios
  void windowId;
  const windowRef = useRef<HTMLDivElement>(null);
  const fileName = caseStudy?.title || filePath?.split("/").pop() || "Untitled";
  const isCaseStudyDoc = Boolean(caseStudy) || isCaseStudyDocPath(filePath);
  const { isMenuOpenRef } = useWindowManager();
  const isIntroDoc = isIntroDocPath(filePath);
  const [activeReadmeTab, setActiveReadmeTab] = useState<IntroReadmeTabId>("about");

  const { isInteracting, handleDragStart, handleResizeStart } = useWindowBehavior({
    position,
    size,
    minSize: { width: 400, height: 300 },
    isMaximized,
    onMove,
    onResize,
    onFocus,
    windowRef,
  });

  // Keyboard shortcuts: Escape to unfocus, 'q' to quit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if this window is focused
      if (!isFocused) return;

      if (e.key === "Escape") {
        (document.activeElement as HTMLElement)?.blur();
        return;
      }

      // 'q' to close window (only when not typing)
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      if (e.key.toLowerCase() === "q") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, onClose]);

  const windowStyle: React.CSSProperties = isMaximized
    ? { top: MENU_BAR_HEIGHT, left: 0, right: 0, bottom: DOCK_HEIGHT, width: "auto", height: "auto", zIndex: MAXIMIZED_Z_INDEX }
    : {
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: size.width,
        height: size.height,
        zIndex,
        willChange: isInteracting ? "transform,width,height" : undefined,
      };

  return (
    <>
    <div
      ref={windowRef}
      className={cn(
        "fixed",
        !isFocused && !isMaximized && !isIntroDoc && "opacity-95"
      )}
      style={windowStyle}
      onMouseDownCapture={(e) => {
        // Don't focus or propagate if menu is open
        if (isMenuOpenRef.current) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
        onFocus();
      }}
      onClickCapture={(e) => {
        // Block clicks if menu is open
        if (isMenuOpenRef.current) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      {/* Window chrome */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col",
          isIntroDoc
            ? stickyNoteShellClass(true)
            : "bg-white dark:bg-zinc-900 shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden",
          isMaximized ? "rounded-none" : "rounded-xl",
          !isFocused && "[&_*]:!cursor-default"
        )}
      >
        {/* Title bar */}
        <div
          className={cn(
            "flex min-w-0 items-center select-none cursor-default shrink-0",
            isIntroDoc
              ? STICKY_NOTE_TITLE_BAR_CLASS
              : "gap-2 px-4 py-2 justify-between bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700"
          )}
          onMouseDown={handleDragStart}
        >
          <WindowControls
            inShell={true}
            className={cn("window-controls shrink-0", isIntroDoc ? "" : "p-2")}
            onClose={onClose}
            onMinimize={onMinimize}
            onToggleMaximize={onToggleMaximize}
            isMaximized={isMaximized}
            closeLabel="Close window"
          />
          {isIntroDoc ? (
            <span className={STICKY_NOTE_TITLE_CLASS}>readme</span>
          ) : (
            <>
              <div className="flex-1 min-w-0 px-2 text-center">
                <span className="block truncate text-zinc-500 dark:text-zinc-400 text-sm">
                  {fileName}
                </span>
              </div>
              <div className="w-[68px] shrink-0" />
            </>
          )}
        </div>

        {/* Content */}
        {isIntroDoc ? (
          <IntroReadmeCarousel
            isFocused={isFocused}
            onActiveTabChange={setActiveReadmeTab}
            onOpenApp={onOpenApp}
            onOpenTrash={onOpenTrash}
          />
        ) : isCaseStudyDoc && caseStudy ? (
          <div className="flex-1 min-h-0 overflow-hidden bg-white dark:bg-zinc-900">
            <CaseStudyDetail study={caseStudy} />
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col">
            <textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="w-full flex-1 min-h-0 bg-transparent resize-none outline-none leading-relaxed overflow-auto font-mono text-sm p-4 text-zinc-900 dark:text-white"
              spellCheck={false}
            />
          </div>
        )}
      </div>

      {/* Resize handles */}
      {!isMaximized && (
        <>
          <div
            className="absolute cursor-nw-resize"
            style={{ top: -3, left: -3, width: CORNER_SIZE, height: CORNER_SIZE, zIndex: 20 }}
            onMouseDown={(e) => handleResizeStart(e, "nw")}
          />
          <div
            className="absolute cursor-ne-resize"
            style={{ top: -3, right: -3, width: CORNER_SIZE, height: CORNER_SIZE, zIndex: 20 }}
            onMouseDown={(e) => handleResizeStart(e, "ne")}
          />
          <div
            className="absolute cursor-sw-resize"
            style={{ bottom: -3, left: -3, width: CORNER_SIZE, height: CORNER_SIZE, zIndex: 20 }}
            onMouseDown={(e) => handleResizeStart(e, "sw")}
          />
          <div
            className="absolute cursor-se-resize"
            style={{ bottom: -3, right: -3, width: CORNER_SIZE, height: CORNER_SIZE, zIndex: 20 }}
            onMouseDown={(e) => handleResizeStart(e, "se")}
          />
          <div
            className="absolute cursor-n-resize"
            style={{ top: -3, left: CORNER_SIZE, right: CORNER_SIZE, height: EDGE_SIZE, zIndex: 10 }}
            onMouseDown={(e) => handleResizeStart(e, "n")}
          />
          <div
            className="absolute cursor-s-resize"
            style={{ bottom: -3, left: CORNER_SIZE, right: CORNER_SIZE, height: EDGE_SIZE, zIndex: 10 }}
            onMouseDown={(e) => handleResizeStart(e, "s")}
          />
          <div
            className="absolute cursor-w-resize"
            style={{ left: -3, top: CORNER_SIZE, bottom: CORNER_SIZE, width: EDGE_SIZE, zIndex: 10 }}
            onMouseDown={(e) => handleResizeStart(e, "w")}
          />
          <div
            className="absolute cursor-e-resize"
            style={{ right: -3, top: CORNER_SIZE, bottom: CORNER_SIZE, width: EDGE_SIZE, zIndex: 10 }}
            onMouseDown={(e) => handleResizeStart(e, "e")}
          />
        </>
      )}
    </div>

    {isIntroDoc && !isMaximized && activeReadmeTab === "about" && (
      <IntroReadmePolaroid
        position={position}
        zIndex={zIndex}
        isFocused={isFocused}
        onFocus={onFocus}
      />
    )}
    </>
  );
}
