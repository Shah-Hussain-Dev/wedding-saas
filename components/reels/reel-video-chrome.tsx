"use client";

import { Pause, Play } from "@phosphor-icons/react";
import type { ReelBeat } from "@/config/template-reels";

interface ReelVideoChromeProps {
  beats: ReelBeat[];
  activeIndex: number;
  progress: number;
  isPaused: boolean;
  onTogglePause: () => void;
  className?: string;
}

export function ReelVideoChrome({
  beats,
  activeIndex,
  progress,
  isPaused,
  onTogglePause,
  className = "",
}: ReelVideoChromeProps) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-40 flex flex-col gap-2 p-3 ${className}`}>
      <div className="flex gap-0.5" aria-hidden>
        {beats.map((_, idx) => {
          const filled =
            idx < activeIndex ? 100 : idx === activeIndex ? progress : 0;
          return (
            <div
              key={beats[idx]?.id ?? idx}
              className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/25"
            >
              <div
                className="h-full rounded-full bg-white/90 transition-[width] duration-75 ease-linear"
                style={{ width: `${filled}%` }}
              />
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onTogglePause}
        className="pointer-events-auto ml-auto flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
        aria-pressed={isPaused}
      >
        {isPaused ? <Play size={18} weight="fill" /> : <Pause size={18} weight="fill" />}
        <span className="sr-only">{isPaused ? "Play reel" : "Pause reel"}</span>
      </button>
    </div>
  );
}
