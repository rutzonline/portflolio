import React from 'react';
import { Pin, PinOff, Trash2, Edit } from "lucide-react";
import { SwipeActionButton, SwipeActionsContainer } from "@/components/shared/swipe-action-button";

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
    <SwipeActionsContainer isOpen={isOpen}>
      <SwipeActionButton onClick={onPin} bgColor="bg-[#3293FC]">
        {isPinned ? <PinOff size={20} /> : <Pin size={20} />}
      </SwipeActionButton>
      {canEditOrDelete && (
        <>
          <SwipeActionButton onClick={onEdit} bgColor="bg-[#787BFF]">
            <Edit size={20} />
          </SwipeActionButton>
          <SwipeActionButton onClick={onDelete} bgColor="bg-[#FF4539]">
            <Trash2 size={20} />
          </SwipeActionButton>
        </>
      )}
    </SwipeActionsContainer>
  );
}
