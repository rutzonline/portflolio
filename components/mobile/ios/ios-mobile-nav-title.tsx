import { cn } from "@/lib/utils";
import { IOS_MOBILE_NAV_TITLE_CLASS } from "@/lib/ios-nav-back-styles";

/** Centered mobile app title — pairs with `WindowNavShell` absolute center layout. */
export function IosMobileNavTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn(IOS_MOBILE_NAV_TITLE_CLASS, className)}>{children}</span>;
}

/** Width of the right balance slot — mirrors typical back-button column on the left. */
export const IOS_MOBILE_NAV_BALANCE_CLASS = "w-[56px] shrink-0";
