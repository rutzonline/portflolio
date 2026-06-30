import React from 'react';
import { Pin, PinOff, Trash2, Edit } from "lucide-react";
import { IOS_MOBILE_TOUCH_ACTIVE_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

interface SwipeActionsProps {
  isOpen: boolean;
  onPin: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isPinned: boolean;
  canEditOrDelete: boolean;
}

export function SwipeActions({
  isOpen,
  onPin,
  onEdit,
  onDelete,
  isPinned,
  canEditOrDelete,
}: SwipeActionsProps) {
  return (
    <div
      className={`absolute top-0 right-0 h-full flex items-center transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={onPin}
        className={cn(
          "bg-[#3293FC] text-white h-full w-16 flex items-center justify-center",
          IOS_MOBILE_TOUCH_ACTIVE_CLASS
        )}
      >
        {isPinned ? <PinOff size={20} /> : <Pin size={20} />}
      </button>
      {canEditOrDelete && (
        <>
          <button
            onClick={onEdit}
            className={cn(
              "bg-[#787BFF] text-white h-full w-16 flex items-center justify-center",
              IOS_MOBILE_TOUCH_ACTIVE_CLASS
            )}
          >
            <Edit size={20} />
          </button>
          <button
            onClick={onDelete}
            className={cn(
              "bg-[#FF4539] text-white h-full w-16 flex items-center justify-center",
              IOS_MOBILE_TOUCH_ACTIVE_CLASS
            )}
          >
            <Trash2 size={20} />
          </button>
        </>
      )}
    </div>
  );
}