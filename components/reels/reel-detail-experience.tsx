"use client";

import Link from "next/link";
import { CaretLeft, FilmStrip, Pause, PencilSimpleLine, Play, Sparkle } from "@phosphor-icons/react";
import type { TemplateReelDefinition } from "@/config/template-reels";
import {
  ReelPlaybackProvider,
  useReelPlaybackContext,
} from "@/components/reels/reel-playback-context";
import { ReelTemplatePlayback } from "@/components/reels/reel-template-playback";
import { ReelBeatGrid } from "@/components/reels/reel-beat-grid";
import { ReelActionBar } from "@/components/reels/reel-action-bar";

interface ReelDetailExperienceProps {
  reel: TemplateReelDefinition;
  downloadAvailable: boolean;
}

function totalReelDuration(reel: TemplateReelDefinition) {
  const sec = reel.beats.reduce((sum, s) => sum + s.durationMs, 0) / 1000;
  return sec >= 60 ? `${Math.floor(sec / 60)}m ${Math.round(sec % 60)}s` : `${Math.round(sec)}s`;
}

function ReelDetailInner({ reel, downloadAvailable }: ReelDetailExperienceProps) {
  const { activeBeat, activeIndex, beats, isPaused, setIsPaused } = useReelPlaybackContext();
  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-6xl overflow-x-hidden bg-[#FCFBF7]">
      <header className="sticky top-0 z-40 flex items-center gap-2 border-b border-[#073D31]/8 bg-[#FCFBF7]/95 px-4 py-3 backdrop-blur-md sm:px-5 lg:px-8">
        <Link
          href="/reels"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white shadow-sm text-[#073D31]"
          aria-label="Back to reels catalog"
        >
          <CaretLeft size={20} weight="bold" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#C8A45E]">
            Reel
          </p>
          <h1 className="truncate font-serif text-base font-medium text-[#18211E] lg:text-lg">
            {reel.name.replace(/\s*·\s*Reel\s*$/i, "")}
          </h1>
        </div>
        <button
          type="button"
          aria-pressed={isPaused}
          onClick={() => setIsPaused((p) => !p)}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#073D31] text-white lg:hidden"
        >
          {isPaused ? <Play size={20} weight="fill" /> : <Pause size={20} weight="fill" />}
          <span className="sr-only">{isPaused ? "Play reel" : "Pause reel"}</span>
        </button>
      </header>

      <div className="flex flex-col gap-6 px-4 py-5 sm:px-5 lg:grid lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-10 lg:px-8 lg:py-8">
        <aside className="w-full min-w-0 lg:sticky lg:top-[4.5rem] lg:self-start">
          <div className="mx-auto w-full max-w-[360px] lg:mx-0 lg:max-w-none">
            <ReelTemplatePlayback size="large" className="w-full" />
            <div className="mt-4 hidden items-center justify-center gap-3 lg:flex">
              <button
                type="button"
                aria-pressed={isPaused}
                onClick={() => setIsPaused((p) => !p)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#073D31] text-white"
              >
                {isPaused ? <Play size={20} weight="fill" /> : <Pause size={20} weight="fill" />}
                <span className="sr-only">{isPaused ? "Play reel" : "Pause reel"}</span>
              </button>
              <p className="text-center text-xs text-[#76766F]">
                Chapter {activeIndex + 1} / {beats.length} ·{" "}
                <span className="font-semibold text-[#18211E]">{activeBeat?.label}</span>
              </p>
            </div>
            <p className="mt-2 text-center text-xs text-[#76766F] lg:hidden">
              Chapter {activeIndex + 1} / {beats.length} · {activeBeat?.label}
            </p>
          </div>
        </aside>

        <div className="min-w-0 border-t border-[#073D31]/8 pt-2 lg:border-t-0 lg:pt-0">
          <div className="flex flex-wrap items-center gap-2">
            {reel.tag ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#C8A45E]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#073D31]">
                <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
                {reel.tag}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 rounded-full border border-[#073D31]/12 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#76766F]">
              <FilmStrip size={12} weight="bold" />
              {beats.length} chapters · ~{totalReelDuration(reel)}
            </span>
          </div>

          <h2 className="mt-4 font-serif text-2xl font-medium text-[#18211E] lg:text-3xl">{reel.name}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#76766F]">{reel.description}</p>
          <p className="mt-2 text-xs font-medium text-[#073D31]">{reel.tagline}</p>

          <section
            className="mt-6 rounded-2xl border border-[#C8A45E]/35 bg-gradient-to-br from-[#FFFDF8] to-[#F7F4ED] p-4"
            aria-labelledby="customize-reel-heading"
          >
            <h3 id="customize-reel-heading" className="font-serif text-lg text-[#18211E]">
              Autoplay reel in the mockup above
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#76766F]">
              Chapters advance like a social story. Edit names, dates, and ceremonies in Customize — your
              draft syncs to this reel. MP4 export for sharing is coming soon.
            </p>
            <div className="mt-4">
              <Link
                href={reel.customizeHref}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#073D31] px-4 text-xs font-bold uppercase tracking-wider text-[#F7F4ED] sm:w-auto sm:px-8"
              >
                <PencilSimpleLine size={16} weight="bold" className="text-[#E1C98E]" />
                Edit &amp; customize content
              </Link>
            </div>
          </section>

          <div className="mt-6 lg:hidden">
            <ReelActionBar
              customizeHref={reel.customizeHref}
              downloadHref={reel.downloadVideoPath}
              downloadAvailable={downloadAvailable}
            />
          </div>
        </div>
      </div>

      <section
        className="border-t border-[#073D31]/8 px-4 py-8 lg:px-8"
        aria-labelledby="all-chapters-heading"
      >
        <h3 id="all-chapters-heading" className="font-serif text-xl font-medium text-[#18211E] sm:text-2xl">
          All chapters
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-[#76766F]">
          Each card is a reel chapter. Tap to jump the autoplay mockup above.
        </p>
        <div className="mt-6">
          <ReelBeatGrid />
        </div>
      </section>

      <div className="hidden lg:block">
        <ReelActionBar
          customizeHref={reel.customizeHref}
          downloadHref={reel.downloadVideoPath}
          downloadAvailable={downloadAvailable}
        />
      </div>
    </div>
  );
}

export function ReelDetailExperience(props: ReelDetailExperienceProps) {
  return (
    <ReelPlaybackProvider reel={props.reel} pauseWhenHidden>
      <ReelDetailInner {...props} />
    </ReelPlaybackProvider>
  );
}
