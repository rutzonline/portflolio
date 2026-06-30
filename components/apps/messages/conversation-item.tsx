import { memo, useState, useEffect } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { Conversation, REACTION_TEXT } from "@/types/messages";
import { cn } from "@/lib/utils";
import {
  IOS_MOBILE_SWIPE_SNAP_THRESHOLD_PX,
  iosMobileSwipeOffsetPx,
} from "@/lib/ui-tokens";
import { SwipeActions } from "./swipe-actions";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Icons } from "./icons";
import { useTheme } from "next-themes";

interface ConversationItemProps {
  conversation: Conversation;
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onUpdateConversation: (conversations: Conversation[], updateType?: 'pin' | 'mute') => void;
  conversations: Conversation[];
  formatTime: (timestamp: string | undefined) => string;
  getInitials: (name: string) => string;
  isMobileView?: boolean;
  showDivider?: boolean;
  openSwipedConvo: string | null;
  setOpenSwipedConvo: (id: string | null) => void;
}

export const ConversationItem = memo(function ConversationItem({
  conversation,
  activeConversation,
  onSelectConversation,
  onDeleteConversation,
  onUpdateConversation,
  conversations,
  formatTime,
  getInitials,
  isMobileView,
  showDivider,
  openSwipedConvo,
  setOpenSwipedConvo,
}: ConversationItemProps) {
  const [isSwiping, setIsSwiping] = useState(false);
  const isSwipeOpen = openSwipedConvo === conversation.id;
  const { theme, systemTheme } = useTheme();
  const effectiveTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (isSwiping && e.cancelable) {
        // Only prevent default if the touch movement is more horizontal than vertical
        const touch = e.touches[0];
        const prevTouch = e.targetTouches[0];
        if (prevTouch) {
          const xDiff = Math.abs(touch.clientX - prevTouch.clientX);
          const yDiff = Math.abs(touch.clientY - prevTouch.clientY);
          if (xDiff > yDiff) {
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventDefault);
    };
  }, [isSwiping]);

  const handlers = useSwipeable({
    onSwipeStart: () => setIsSwiping(true),
    onSwiped: (eventData) => {
      setIsSwiping(false);
      const { deltaX } = eventData;
      if (deltaX < -IOS_MOBILE_SWIPE_SNAP_THRESHOLD_PX) {
        setOpenSwipedConvo(conversation.id);
      } else if (deltaX > IOS_MOBILE_SWIPE_SNAP_THRESHOLD_PX) {
        setOpenSwipedConvo(null);
      } else {
        setOpenSwipedConvo(isSwipeOpen ? conversation.id : null);
      }
    },
    trackMouse: true,
  });

  const handleSwipePin = () => {
    if (!isSwipeOpen) return;
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversation.id ? { ...conv, pinned: !conv.pinned } : conv
    );
    onUpdateConversation(updatedConversations, 'pin');
    setOpenSwipedConvo(null);
  };

  const handleSwipeDelete = () => {
    if (!isSwipeOpen) return;
    onDeleteConversation(conversation.id);
    setOpenSwipedConvo(null);
  };

  const handleSwipeHideAlerts = () => {
    if (!isSwipeOpen) return;
    handleContextMenuHideAlerts();
    setOpenSwipedConvo(null);
  };

  const handleContextMenuPin = () => {
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversation.id ? { ...conv, pinned: !conv.pinned } : conv
    );
    onUpdateConversation(updatedConversations, 'pin');
  };

  const handleContextMenuDelete = () => {
    onDeleteConversation(conversation.id);
  };

  const handleContextMenuHideAlerts = () => {
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversation.id
        ? { ...conv, hideAlerts: !conv.hideAlerts }
        : conv
    );
    onUpdateConversation(updatedConversations, 'mute');
  };

  const ConversationContent = (
    <button
      onClick={() => onSelectConversation(conversation.id)}
      aria-label={`Conversation with ${conversation.recipients
        .map((r) => r.name)
        .join(", ")}`}
      aria-current={activeConversation === conversation.id ? "true" : undefined}
      className={cn(
        "w-full text-left relative flex items-center",
        isMobileView ? "h-[72px] active:bg-white/5" : "h-[70px] py-2",
        activeConversation === conversation.id && !isMobileView
          ? "bg-accent-blue text-white rounded-md"
          : "",
        showDivider &&
          (isMobileView
            ? 'after:content-[""] after:absolute after:bottom-0 after:left-[78px] after:right-0 after:border-t-[0.5px] after:border-[rgba(255,255,255,0.1)]'
            : 'after:content-[""] after:absolute after:bottom-0 after:left-[56px] after:right-4 after:border-t after:border-muted-foreground/20')
      )}
    >
      {conversation.unreadCount > 0 &&
        activeConversation !== conversation.id && (
        <div
          className={cn(
            "absolute rounded-full flex-shrink-0",
            isMobileView
              ? "left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#0A84FF]"
              : "left-0.5 w-2.5 h-2.5 bg-accent-blue"
          )}
        />
      )}
      <div className={cn("flex items-center w-full", isMobileView ? "gap-3 px-4" : "gap-2 px-4")}>
        <div
          className={cn(
            "rounded-full overflow-hidden flex-shrink-0 relative",
            isMobileView ? "w-[50px] h-[50px]" : "w-10 h-10"
          )}
        >
          {conversation.recipients[0].avatar ? (
            <Image
              src={conversation.recipients[0].avatar}
              alt={`${conversation.recipients[0].name} avatar`}
              fill
              sizes={isMobileView ? "50px" : "40px"}
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#9BA1AA] to-[#7D828A] relative">
              <span className="relative text-white text-md font-medium">
                {getInitials(conversation.recipients[0].name)}
              </span>
            </div>
          )}
        </div>
        <div className={cn("flex-1 min-w-0", isMobileView ? "py-0" : "py-2")}>
          <div className="flex justify-between items-baseline gap-2">
            <span
              className={cn(
                "line-clamp-1 min-w-0",
                isMobileView
                  ? "text-[17px] leading-5 font-semibold text-white max-w-[65%]"
                  : "font-medium text-sm max-w-[70%]"
              )}
            >
              {conversation.name || conversation.recipients.map((r) => r.name).join(", ")}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
              {conversation.lastMessageTime && (
                <span
                  className={cn(
                    isMobileView ? "text-[13px] text-[#8E8E93]" : "text-xs ml-2",
                    !isMobileView &&
                      (activeConversation === conversation.id
                        ? "text-white/80"
                        : "text-muted-foreground")
                  )}
                >
                  {formatTime(conversation.lastMessageTime)}
                </span>
              )}
            </div>
          </div>
          <div
            className={cn(
              "flex items-start justify-between",
              isMobileView
                ? "text-[15px] leading-5 text-[#8E8E93] mt-0.5"
                : "text-xs h-8",
              !isMobileView &&
                (activeConversation === conversation.id
                  ? "text-white/80"
                  : "text-muted-foreground")
            )}
          >
            {conversation.isTyping ? (
              <div className="flex items-center py-0.5">
                <div className="relative">
                  <Image
                    src={
                      activeConversation === conversation.id
                        ? "/messages/typing-bubbles/typing-blue.svg"
                        : effectiveTheme === "dark"
                        ? "/messages/typing-bubbles/typing-dark.svg"
                        : "/messages/typing-bubbles/typing-light.svg"
                    }
                    alt="typing"
                    width={45}
                    height={20}
                    className="w-[45px] h-auto"
                    unoptimized
                  />
                  <div className="absolute top-[40%] left-[35%] flex gap-[2px]">
                    <div
                      style={{ animation: "blink 1.4s infinite linear" }}
                      className={`w-1 h-1 ${
                        activeConversation === conversation.id
                          ? "bg-blue-100"
                          : "bg-gray-500 dark:bg-gray-300"
                      } rounded-full`}
                    ></div>
                    <div
                      style={{ animation: "blink 1.4s infinite linear 0.2s" }}
                      className={`w-1 h-1 ${
                        activeConversation === conversation.id
                          ? "bg-blue-100"
                          : "bg-gray-500 dark:bg-gray-300"
                      } rounded-full`}
                    ></div>
                    <div
                      style={{ animation: "blink 1.4s infinite linear 0.4s" }}
                      className={`w-1 h-1 ${
                        activeConversation === conversation.id
                          ? "bg-blue-100"
                          : "bg-gray-500 dark:bg-gray-300"
                      } rounded-full`}
                    ></div>
                  </div>
                </div>
              </div>
            ) : conversation.messages.length > 0 ? (
              <div className="flex items-center gap-2 w-full">
                <div className="line-clamp-2 flex-1">
                  {(() => {
                    const lastMessage = conversation.messages
                      .filter((message) => message.sender !== "system")
                      .slice(-1)[0];

                    if (!lastMessage) return "";

                    // Check if the last message has any reaction
                    const lastReaction = lastMessage.reactions?.[0];
                    if (lastReaction) {
                      const reactionText = REACTION_TEXT[lastReaction.type];

                      return lastReaction.sender === "me"
                        ? `You ${reactionText} "${lastMessage.content}"`
                        : `${
                            lastReaction.sender.split(" ")[0]
                          } ${reactionText} "${lastMessage.content}"`;
                    }

                    return lastMessage.content;
                  })()}
                </div>
                {conversation.hideAlerts && (
                  <Icons.bellOff
                    className={`flex-shrink-0 h-3 w-3 ${
                      activeConversation === conversation.id 
                        ? "text-white/80" 
                        : "text-muted-foreground"
                    }`} 
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );

  if (isMobileView) {
    const swipeOffsetPx = iosMobileSwipeOffsetPx(3);

    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div {...handlers} className="relative overflow-hidden">
            <div
              className={cn("w-full", !isSwiping && "transition-transform duration-300 ease-out")}
              style={{
                transform: isSwipeOpen ? `translateX(-${swipeOffsetPx}px)` : undefined,
              }}
            >
              {ConversationContent}
            </div>
            <SwipeActions
              isOpen={isSwipeOpen}
              onPin={handleSwipePin}
              onDelete={handleSwipeDelete}
              onHideAlerts={handleSwipeHideAlerts}
              isPinned={conversation.pinned}
              hideAlerts={conversation.hideAlerts}
              aria-hidden={!isSwipeOpen}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className={`focus:bg-accent-blue focus:text-white ${
              isMobileView ? "flex items-center justify-between" : ""
            }`}
            onClick={handleContextMenuPin}
          >
            <span>{conversation.pinned ? "Unpin" : "Pin"}</span>
            {isMobileView && <Icons.pin className="h-4 w-4 ml-2" />}
          </ContextMenuItem>
          <ContextMenuItem
            className={`focus:bg-accent-blue focus:text-white ${
              isMobileView ? "flex items-center justify-between" : ""
            }`}
            onClick={handleContextMenuHideAlerts}
          >
            <span>{conversation.hideAlerts ? "Show Alerts" : "Hide Alerts"}</span>
            {isMobileView && (
              conversation.hideAlerts ? 
                <Icons.bell className="h-4 w-4 ml-2" /> :
                <Icons.bellOff className="h-4 w-4 ml-2" />
            )}
          </ContextMenuItem>
          <ContextMenuItem
            className={`focus:bg-accent-blue focus:text-white ${
              isMobileView ? "flex items-center justify-between" : ""
            } text-red-600`}
            onClick={handleContextMenuDelete}
          >
            <span>Delete</span>
            {isMobileView && <Icons.trash className="h-4 w-4 ml-2" />}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  } else {
    return (
      <ContextMenu>
        <ContextMenuTrigger className="w-full">
          {ConversationContent}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className={`focus:bg-accent-blue focus:text-white focus:rounded-md`}
            onClick={handleContextMenuPin}
          >
            <span>{conversation.pinned ? "Unpin" : "Pin"}</span>
          </ContextMenuItem>
          <ContextMenuItem
            className={`focus:bg-accent-blue focus:text-white focus:rounded-md`}
            onClick={handleContextMenuHideAlerts}
          >
            <span>{conversation.hideAlerts ? "Show Alerts" : "Hide Alerts"}</span>
          </ContextMenuItem>
          <ContextMenuItem
            className={`focus:bg-accent-blue focus:text-white focus:rounded-md text-red-600`}
            onClick={handleContextMenuDelete}
          >
            <span>Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }
});
