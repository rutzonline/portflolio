"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSwipeable } from "react-swipeable";
import { SwipeActions } from "./swipe-actions";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Note } from "@/lib/notes/types";
import { getDisplayCreatedAt } from "@/lib/notes/display-created-at";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import {
  IOS_MOBILE_LIST_ROW_CLASS,
  IOS_MOBILE_LIST_ROW_SUBTITLE_CLASS,
  IOS_MOBILE_LIST_ROW_TITLE_CLASS,
} from "@/lib/ui-tokens";
import { IosMobileListChevron } from "@/components/mobile/ios/ios-mobile-list";

const SIDEBAR_DATE_PLACEHOLDER = "00/00/0000";

function previewContent(content: string): string {
  return content
    .replace(/!\[[^\]]*\]\([^\)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/\[[ x]\]/g, "")
    .replace(/[#*_~`>+\-]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface NoteItemProps {
  item: Note;
  selectedNoteSlug: string | null;
  sessionId: string;
  onNoteSelect: (note: Note) => void;
  onNoteEdit: (slug: string) => void;
  handlePinToggle: (slug: string) => void;
  isPinned: boolean;
  isHighlighted: boolean;
  isSearching: boolean;
  handleNoteDelete: (note: Note) => Promise<void>;
  openSwipeItemSlug: string | null;
  setOpenSwipeItemSlug: Dispatch<SetStateAction<string | null>>;
  showDivider?: boolean;
  useCallbackNavigation?: boolean;
  isMobileView?: boolean;
}

export const NoteItem = React.memo(function NoteItem({
  item,
  selectedNoteSlug,
  sessionId,
  onNoteSelect,
  onNoteEdit,
  handlePinToggle,
  isPinned,
  isHighlighted,
  isSearching,
  handleNoteDelete,
  openSwipeItemSlug,
  setOpenSwipeItemSlug,
  showDivider = false,
  useCallbackNavigation = false,
  isMobileView = false,
}: NoteItemProps) {
  const [isSwiping, setIsSwiping] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const isSwipeOpen = openSwipeItemSlug === item.slug;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (isSwiping) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventDefault);
    };
  }, [isSwiping]);

  const handleDelete = async () => {
    setOpenSwipeItemSlug(null);
    await handleNoteDelete(item);
  };

  const handleEdit = () => {
    setOpenSwipeItemSlug(null);
    onNoteEdit(item.slug);
  };

  const handlePinAction = () => {
    handlePinToggle(item.slug);
    setOpenSwipeItemSlug(null);
  };

  const handleSwipeAction = (action: () => void) => {
    if (isSwipeOpen) {
      action();
    }
  };

  const formattedDate = hasMounted
    ? new Date(getDisplayCreatedAt(item)).toLocaleDateString("en-US")
    : SIDEBAR_DATE_PLACEHOLDER;

  const preview = previewContent(item.content);

  const isDesktopSelected =
    !isMobileView &&
    ((isSearching && isHighlighted) || (!isSearching && item.slug === selectedNoteSlug));

  const desktopNoteContentInner = (
    <>
      <h2 className="text-sm font-bold px-2 break-words line-clamp-1">
        {item.emoji} {item.title}
      </h2>
      <p
        className={cn(
          "text-xs pl-2 flex items-baseline overflow-hidden",
          isDesktopSelected ? "text-muted-foreground dark:text-white/80" : "text-muted-foreground"
        )}
      >
        <span className="text-black dark:text-white shrink-0">
          <span
            className={cn(
              "inline-block whitespace-nowrap mr-1 tabular-nums",
              hasMounted ? "visible" : "invisible"
            )}
          >
            {formattedDate}
          </span>
        </span>
        <span className="block w-0 min-w-0 flex-1 truncate">{preview}</span>
      </p>
    </>
  );

  const mobileNoteContentInner = (
    <>
      <div className="min-w-0 flex-1 py-0.5">
        <div className={cn(IOS_MOBILE_LIST_ROW_TITLE_CLASS, "line-clamp-1")}>
          {item.emoji} {item.title}
        </div>
        <div
          className={cn(
            IOS_MOBILE_LIST_ROW_SUBTITLE_CLASS,
            "mt-0.5 tabular-nums",
            hasMounted ? "visible" : "invisible"
          )}
        >
          {formattedDate}
        </div>
        {preview ? (
          <div className={cn(IOS_MOBILE_LIST_ROW_SUBTITLE_CLASS, "mt-0.5 line-clamp-2 leading-snug")}>
            {preview}
          </div>
        ) : null}
      </div>
      <IosMobileListChevron className="self-center" />
    </>
  );

  const noteRowInner = isMobileView ? mobileNoteContentInner : desktopNoteContentInner;

  const rowButtonClass = isMobileView
    ? cn(
        IOS_MOBILE_LIST_ROW_CLASS,
        "min-h-[58px] h-full w-full items-start py-2.5"
      )
    : "block py-2 h-full w-full flex flex-col justify-center text-left";

  const NoteContent = isMobileView ? (
    <div
      tabIndex={0}
      className="min-h-[58px] w-full"
    >
      <div data-note-slug={item.slug} className="h-full w-full">
        {useCallbackNavigation ? (
          <button onClick={() => onNoteSelect(item)} tabIndex={-1} className={rowButtonClass}>
            {noteRowInner}
          </button>
        ) : (
          <Link
            href={`/notes/${item.slug || ""}`}
            prefetch={true}
            tabIndex={-1}
            className={rowButtonClass}
          >
            {noteRowInner}
          </Link>
        )}
      </div>
    </div>
  ) : (
    <li
      tabIndex={0}
      className={cn(
        "w-full h-[70px]",
        isDesktopSelected && "bg-[#FFE390] dark:bg-[#9D7D28] dark:text-white rounded-md",
        showDivider &&
          (isSearching ? !isHighlighted : item.slug !== selectedNoteSlug) &&
          'after:content-[""] after:block after:mx-2 after:border-t after:border-muted-foreground/20'
      )}
    >
      <div data-note-slug={item.slug} className="h-full w-full px-4">
        {useCallbackNavigation ? (
          <button onClick={() => onNoteSelect(item)} tabIndex={-1} className={rowButtonClass}>
            {noteRowInner}
          </button>
        ) : (
          <Link
            href={`/notes/${item.slug || ""}`}
            prefetch={true}
            tabIndex={-1}
            className={cn(rowButtonClass, "flex flex-col justify-center")}
          >
            {noteRowInner}
          </Link>
        )}
      </div>
    </li>
  );

  const handlers = useSwipeable({
    onSwipeStart: () => setIsSwiping(true),
    onSwiped: () => setIsSwiping(false),
    onSwipedLeft: () => {
      setOpenSwipeItemSlug(item.slug);
      setIsSwiping(false);
    },
    onSwipedRight: () => {
      setOpenSwipeItemSlug(null);
      setIsSwiping(false);
    },
    trackMouse: true,
  });

  if (isMobileView) {
    return (
      <div {...handlers} className="relative overflow-hidden">
        <div
          data-note-slug={item.slug}
          className={cn(
            "w-full transition-transform duration-300 ease-out",
            isSwipeOpen && "transform -translate-x-24",
            showDivider && "border-b border-border/50"
          )}
        >
          {NoteContent}
        </div>
        <SwipeActions
          isOpen={isSwipeOpen}
          onPin={() => handleSwipeAction(handlePinAction)}
          onEdit={() => handleSwipeAction(handleEdit)}
          onDelete={() => handleSwipeAction(handleDelete)}
          isPinned={isPinned}
          canEditOrDelete={item.session_id === sessionId}
        />
      </div>
    );
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>{NoteContent}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handlePinAction} className="cursor-pointer">
          {isPinned ? "Unpin" : "Pin"}
        </ContextMenuItem>
        {item.session_id === sessionId && (
          <>
            <ContextMenuItem onClick={handleEdit} className="cursor-pointer">
              Edit
            </ContextMenuItem>
            <ContextMenuItem onClick={handleDelete} className="cursor-pointer">
              Delete
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
});
