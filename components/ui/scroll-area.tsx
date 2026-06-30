"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const IOS_SCROLLBAR_HIDE_MS = 2000

/**
 * Custom ScrollArea component for the chat interface
 * Customized with:
 * - 64px padding on top and bottom of the scrollbar so its not hidden bethind chat header and message input
 * - Custom scrollbar styling to match the scrollbar design in globals.css
 * - 14px total width with 4px transparent border for a clean look
 */
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    withVerticalMargins?: boolean
    mobileHeaderHeight?: boolean
    isMobile?: boolean
    iosOverlayScrollbar?: boolean
    bottomMargin?: string
    viewportClassName?: string
  }
>(({ className, children, withVerticalMargins = false, mobileHeaderHeight = false, isMobile = false, iosOverlayScrollbar = false, bottomMargin, viewportClassName, ...props }, ref) => {
  const [scrollbarVisible, setScrollbarVisible] = React.useState(false)
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const revealScrollbar = React.useCallback(() => {
    if (!iosOverlayScrollbar) return
    setScrollbarVisible(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => setScrollbarVisible(false), IOS_SCROLLBAR_HIDE_MS)
  }, [iosOverlayScrollbar])

  React.useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [])

  const handleViewportScroll = React.useCallback(() => {
    revealScrollbar()
  }, [revealScrollbar])

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className={cn("h-full w-full rounded-[inherit]", viewportClassName)}
        onScroll={iosOverlayScrollbar ? handleViewportScroll : undefined}
        onTouchStart={iosOverlayScrollbar ? revealScrollbar : undefined}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar 
        withVerticalMargins={withVerticalMargins} 
        mobileHeaderHeight={mobileHeaderHeight} 
        isMobile={isMobile}
        iosOverlayScrollbar={iosOverlayScrollbar}
        scrollbarVisible={scrollbarVisible}
        bottomMargin={bottomMargin}
      />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
})
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

// Add vertical margins to for chat area component
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & {
    withVerticalMargins?: boolean
    mobileHeaderHeight?: boolean
    isMobile?: boolean
    iosOverlayScrollbar?: boolean
    scrollbarVisible?: boolean
    bottomMargin?: string
  }
>(({ className, orientation = "vertical", withVerticalMargins = false, mobileHeaderHeight = false, isMobile = false, iosOverlayScrollbar = false, scrollbarVisible = false, bottomMargin, ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-opacity duration-300",
      iosOverlayScrollbar
        ? scrollbarVisible
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
        : "opacity-80 can-hover:hover:opacity-100",
      !iosOverlayScrollbar &&
        "bg-transparent can-hover:hover:border-l can-hover:hover:border-gray-200 dark:can-hover:hover:border-gray-700",
      orientation === "vertical" &&
        cn(
          isMobile ? "w-[8px]" : "w-[10px] can-hover:hover:w-[14px]",
          withVerticalMargins && mobileHeaderHeight
            ? "mt-24"
            : withVerticalMargins
            ? "mt-16"
            : ""
        ),
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    style={bottomMargin ? { marginBottom: bottomMargin } : { marginBottom: '64px' }}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb 
      className={cn(
        "relative flex-1 rounded-full transition-colors duration-200",
        "border-2 border-solid border-transparent bg-clip-padding",
        "bg-gray-500 dark:bg-gray-400"
      )} 
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
