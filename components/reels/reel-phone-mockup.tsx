"use client";

import type { ReactNode } from "react";

interface ReelPhoneMockupProps {
  children: ReactNode;
  className?: string;
  /** Static poster when children empty (catalog thumbnail) */
  poster?: string;
  label?: string;
  size?: "default" | "large";
}

export function ReelPhoneMockup({
  children,
  className = "",
  poster,
  label,
  size = "default",
}: ReelPhoneMockupProps) {
  const widthClass =
    size === "large" ? "w-full max-w-[min(100%,360px)]" : "w-full max-w-[min(100%,300px)]";

  return (
    <div
      className={`relative mx-auto min-w-0 ${widthClass} ${className}`}
      aria-label={label}
    >
      <div className="rounded-[2.75rem] border-[5px] border-[#18211E] bg-[#18211E] p-[3px] shadow-[0_24px_60px_rgba(7,61,49,0.22)]">
        <div className="pointer-events-none absolute top-2.5 left-1/2 z-30 h-[22px] w-[28%] -translate-x-1/2 rounded-full bg-[#18211E]" />
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.4rem] bg-black">
          {poster && !children ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_28%]"
            />
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
