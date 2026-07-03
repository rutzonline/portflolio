import React from 'react';
import { Icons } from './icons';
import { SwipeActionButton, SwipeActionsContainer } from "@/components/shared/swipe-action-button";

interface SwipeActionsProps {
  isOpen: boolean;
  onDelete: () => void;
  onPin: () => void;
  onHideAlerts: () => void;
  isPinned?: boolean;
  hideAlerts?: boolean;
}

export function SwipeActions({
  isOpen,
  onDelete,
  onPin,
  onHideAlerts,
  isPinned = false,
  hideAlerts = false,
}: SwipeActionsProps) {
  return (
    <SwipeActionsContainer isOpen={isOpen}>
      <SwipeActionButton onClick={onHideAlerts} bgColor="bg-[#5E5BE6]">
        {hideAlerts ? <Icons.bell size={20} className="text-white" /> : <Icons.bellOff size={20} className="text-white" />}
      </SwipeActionButton>
      <SwipeActionButton onClick={onPin} bgColor="bg-[#3293FC]">
        <Icons.pin size={20} className={isPinned ? "rotate-45 text-white" : "text-white"} />
      </SwipeActionButton>
      <SwipeActionButton onClick={onDelete} bgColor="bg-[#FF4539]">
        <Icons.trash size={20} className="text-white" />
      </SwipeActionButton>
    </SwipeActionsContainer>
  );
}
