import { cn } from "@/lib/utils";
import { IOS_NAV_ACCENT } from "@/lib/ios-nav-back-styles";

interface IosNavChevronBackProps {
  tone?: "accent" | "onAccent";
}

/** SF Symbol–style chevron.backward for mobile nav back controls. */
export function IosNavChevronBack({ tone = "accent" }: IosNavChevronBackProps) {
  const stroke = tone === "onAccent" ? "#FFFFFF" : IOS_NAV_ACCENT;

  return (
    <svg
      viewBox="0 0 12 20"
      fill="none"
      aria-hidden
      className={cn("shrink-0", tone === "onAccent" ? "h-[18px] w-[11px]" : "h-[17px] w-[10px]")}
    >
      <path
        d="M10.5 2.5 2.5 10l8 8"
        stroke={stroke}
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
