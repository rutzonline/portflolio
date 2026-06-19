"use client";



import { cn } from "@/lib/utils";



interface DesktopIconProps {

  label: string;

  onOpen: () => void;

  className?: string;

}



export function DesktopIcon({ label, onOpen, className }: DesktopIconProps) {

  return (

    <button

      type="button"

      onDoubleClick={onOpen}

      className={cn(

        "flex flex-col items-center gap-1 p-2 rounded-lg w-[88px] select-none",

        "can-hover:hover:bg-white/10 active:bg-white/5 transition-colors",

        className

      )}

    >

      <div className="w-12 h-14 flex items-end justify-center">

        <svg

          className="w-11 h-13 text-white [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.35))]"

          viewBox="0 0 24 28"

          fill="none"

          aria-hidden

        >

          <path

            d="M14 2H6c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"

            fill="white"

            fillOpacity="0.95"

          />

          <path d="M14 2v6h6" fill="white" fillOpacity="0.7" />

          <text

            x="12"

            y="19"

            textAnchor="middle"

            fill="#333"

            fontSize="7"

            fontFamily="system-ui, sans-serif"

            fontWeight="600"

          >

            TXT

          </text>

        </svg>

      </div>

      <span className="text-xs text-white text-center leading-tight line-clamp-2 px-0.5 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">

        {label}

      </span>

    </button>

  );

}


