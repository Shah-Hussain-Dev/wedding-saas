"use client";

import { useReelPlaybackContext } from "@/components/reels/reel-playback-context";

function formatDuration(ms: number) {
  return `${(ms / 1000).toFixed(1)}s`;
}

export function ReelBeatGrid() {
  const { beats, activeIndex, goTo } = useReelPlaybackContext();

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {beats.map((beat, idx) => {
        const isCurrent = idx === activeIndex;
        const poster = beat.thumbnailPoster ?? "/templates/rose-gold-blush/palace-arch.jpg";
        return (
          <li key={beat.id} className="[content-visibility:auto] [contain-intrinsic-size:200px]">
            <button
              type="button"
              onClick={() => goTo(idx)}
              className={`group flex w-full flex-col text-left min-h-[44px] rounded-2xl transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#073D31] ${
                isCurrent
                  ? "ring-2 ring-[#C8A45E] ring-offset-2 ring-offset-[#FCFBF7] shadow-md"
                  : "hover:shadow-md"
              }`}
              aria-current={isCurrent ? "true" : undefined}
              aria-label={`Chapter ${idx + 1}: ${beat.label}`}
            >
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-[#073D31]/10 bg-[#18211E]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={poster}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-[center_28%] brightness-[0.92]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                {isCurrent ? (
                  <span className="absolute left-2 top-2 z-20 rounded-full bg-[#C8A45E] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#102A43]">
                    Playing
                  </span>
                ) : null}
                <span className="absolute right-2 top-2 z-20 flex h-6 min-w-[1.5rem] items-center justify-center rounded-md bg-black/55 px-1 text-[9px] font-bold text-[#E1C98E]">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-x-0 bottom-0 z-10 p-2">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-[#E1C98E] line-clamp-1">
                    {beat.label}
                  </p>
                  <p className="text-[9px] text-white/90">{formatDuration(beat.durationMs)}</p>
                </div>
              </div>
              <p className="px-0.5 pt-2 pb-1 text-xs text-[#76766F] line-clamp-1 group-hover:text-[#073D31]">
                Tap to jump in mockup
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
