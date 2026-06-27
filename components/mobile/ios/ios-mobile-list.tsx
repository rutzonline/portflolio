"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  IOS_MOBILE_LARGE_TITLE_CLASS,
  IOS_MOBILE_LIST_CHEVRON_CLASS,
  IOS_MOBILE_LIST_GROUP_CLASS,
  IOS_MOBILE_LIST_ROW_CLASS,
  IOS_MOBILE_LIST_ROW_SUBTITLE_CLASS,
  IOS_MOBILE_LIST_ROW_TITLE_CLASS,
  IOS_MOBILE_LIST_SCREEN_CLASS,
  IOS_MOBILE_LIST_SECTION_LABEL_CLASS,
} from "@/lib/ui-tokens";

export function IosMobileLargeTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h1 className={cn(IOS_MOBILE_LARGE_TITLE_CLASS, className)}>{children}</h1>;
}

export function IosMobileListScreen({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(IOS_MOBILE_LIST_SCREEN_CLASS, className)}>{children}</div>;
}

export function IosMobileListGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(IOS_MOBILE_LIST_GROUP_CLASS, className)}>{children}</div>;
}

export function IosMobileListSectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h2 className={cn(IOS_MOBILE_LIST_SECTION_LABEL_CLASS, className)}>{children}</h2>;
}

export function IosMobileListChevron({ className }: { className?: string }) {
  return <ChevronRight className={cn(IOS_MOBILE_LIST_CHEVRON_CLASS, className)} aria-hidden />;
}

export function IosMobileListRowTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(IOS_MOBILE_LIST_ROW_TITLE_CLASS, "truncate", className)}>{children}</div>;
}

export function IosMobileListRowSubtitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(IOS_MOBILE_LIST_ROW_SUBTITLE_CLASS, "truncate", className)}>{children}</div>
  );
}

interface IosMobileListRowProps {
  children: React.ReactNode;
  className?: string;
  showDivider?: boolean;
  showChevron?: boolean;
  onClick?: () => void;
  as?: "button" | "div";
  disabled?: boolean;
}

export function IosMobileListRow({
  children,
  className,
  showDivider = false,
  showChevron = true,
  onClick,
  as = "button",
  disabled,
}: IosMobileListRowProps) {
  const Comp = as;

  return (
    <Comp
      type={as === "button" ? "button" : undefined}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        IOS_MOBILE_LIST_ROW_CLASS,
        showDivider && "border-b border-border/50",
        disabled && "cursor-default",
        className
      )}
    >
      <span className="flex min-w-0 flex-1 items-center gap-3 text-left">{children}</span>
      {showChevron && <IosMobileListChevron />}
    </Comp>
  );
}
