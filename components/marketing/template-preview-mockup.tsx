"use client";

import { motion } from "motion/react";

export type PreviewMockupVariant = "phone" | "tablet";

interface TemplatePreviewMockupProps {
  src: string;
  title: string;
  variant?: PreviewMockupVariant;
  loaded: boolean;
  onLoad: () => void;
  /** Slightly wider phone frame for hero column on desktop */
  phoneSize?: "default" | "hero";
}

export function TemplatePreviewMockup({
  src,
  title,
  variant = "phone",
  loaded,
  onLoad,
  phoneSize = "default",
}: TemplatePreviewMockupProps) {
  if (variant === "phone") {
    const widthClass =
      phoneSize === "hero"
        ? "w-[min(100%,300px)] sm:w-[min(100%,320px)]"
        : "w-[min(100%,280px)]";

    return (
      <div className={`relative mx-auto ${widthClass}`}>
        <div className="rounded-[2.75rem] border-[5px] border-[#18211E] bg-[#18211E] p-[3px] shadow-[0_24px_60px_rgba(7,61,49,0.18)]">
          <div className="pointer-events-none absolute top-2.5 left-1/2 z-20 h-[22px] w-[28%] -translate-x-1/2 rounded-full bg-[#18211E]" />
          <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.4rem] bg-[#082F27]">
            {!loaded && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#F7F4ED]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
                  className="h-8 w-8 rounded-full border-2 border-[#C8A45E]/30 border-t-[#C8A45E]"
                />
              </div>
            )}
            <iframe
              key={src}
              src={src}
              title={title}
              onLoad={onLoad}
              className="absolute inset-0 h-full w-full border-0 bg-[#082F27]"
              allow="autoplay"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="rounded-[1.25rem] border-[5px] border-[#18211E] bg-[#18211E] p-1.5 shadow-[0_20px_50px_rgba(7,61,49,0.16)]">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-2 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#C8A45E]/80" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="ml-2 font-sans text-[10px] font-semibold uppercase tracking-wider text-white/50">
            Live preview
          </span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#082F27]">
          {!loaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#F7F4ED]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
                className="h-9 w-9 rounded-full border-2 border-[#C8A45E]/30 border-t-[#C8A45E]"
              />
            </div>
          )}
          <iframe
            key={src}
            src={src}
            title={title}
            onLoad={onLoad}
            className="absolute inset-0 h-full w-full border-0 bg-[#082F27]"
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  );
}
