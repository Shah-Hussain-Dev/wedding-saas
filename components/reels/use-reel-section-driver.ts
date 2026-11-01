"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { ReelBeat } from "@/config/template-reels";

export const REEL_BEAT_TRANSITION_MS = 480;

function snapToBeat(root: HTMLElement, selector: string) {
  const el = root.querySelector(selector);
  if (!el || !(el instanceof HTMLElement)) return;

  const rootRect = root.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const scrollTop = root.scrollTop + (elRect.top - rootRect.top);

  root.scrollTo({ top: Math.max(0, scrollTop), behavior: "auto" });
}

export interface UseReelSectionDriverOptions {
  beats: ReelBeat[];
  scrollRootRef: React.RefObject<HTMLElement | null>;
  paused: boolean;
  heroRevealed: boolean;
  onBeatChange?: (beat: ReelBeat, index: number) => void;
}

export function useReelSectionDriver({
  beats,
  scrollRootRef,
  paused,
  heroRevealed,
  onBeatChange,
}: UseReelSectionDriverOptions) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [beatReady, setBeatReady] = useState(true);
  const progressStartRef = useRef(Date.now());
  const heroWaitRef = useRef(false);
  const transitionTimerRef = useRef<number | null>(null);
  const count = beats.length;

  const beginBeatTransition = useCallback(
    (index: number, beat: ReelBeat | undefined) => {
      setBeatReady(false);
      setProgress(0);
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
      const root = scrollRootRef.current;
      if (root && beat) {
        snapToBeat(root, beat.scrollTarget);
      }
      transitionTimerRef.current = window.setTimeout(() => {
        setBeatReady(true);
        progressStartRef.current = Date.now();
        transitionTimerRef.current = null;
      }, REEL_BEAT_TRANSITION_MS);
      if (beat) onBeatChange?.(beat, index);
    },
    [onBeatChange, scrollRootRef]
  );

  const goTo = useCallback(
    (index: number) => {
      const next = (index + count) % count;
      setActiveIndex(next);
      beginBeatTransition(next, beats[next]);
    },
    [beats, count, beginBeatTransition]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  const reset = useCallback(() => {
    setActiveIndex(0);
    setProgress(0);
    heroWaitRef.current = false;
    setBeatReady(false);
    const root = scrollRootRef.current;
    if (root) root.scrollTo({ top: 0, behavior: "auto" });
    if (beats[0]) {
      beginBeatTransition(0, beats[0]);
    }
  }, [beats, beginBeatTransition, scrollRootRef]);

  useEffect(() => {
    if (activeIndex !== 0) return;
    const root = scrollRootRef.current;
    if (root) root.scrollTo({ top: 0, behavior: "auto" });
  }, [activeIndex, scrollRootRef]);

  const beatsReadyRef = useRef(false);
  useEffect(() => {
    if (!beatsReadyRef.current && beats.length > 0) {
      beatsReadyRef.current = true;
      beginBeatTransition(0, beats[0]);
    }
    return () => {
      if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-time init when beats load
  }, [beats.length]);

  useEffect(() => {
    if (paused || prefersReducedMotion || count === 0 || !beatReady) return;

    const beat = beats[activeIndex];
    if (!beat) return;

    if (beat.waitForHeroReveal && !heroRevealed) {
      heroWaitRef.current = true;
      setProgress(0);
      return;
    }

    const duration = beat.durationMs;
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - progressStartRef.current;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (elapsed >= duration) {
        goNext();
      }
    }, 50);

    return () => window.clearInterval(tick);
  }, [
    activeIndex,
    paused,
    prefersReducedMotion,
    beats,
    count,
    goNext,
    heroRevealed,
    beatReady,
  ]);

  useEffect(() => {
    if (!heroRevealed || !heroWaitRef.current) return;
    heroWaitRef.current = false;
    progressStartRef.current = Date.now();
    setProgress(0);
    setBeatReady(true);
  }, [heroRevealed]);

  return {
    activeIndex,
    activeBeat: beats[activeIndex],
    progress,
    goTo,
    goNext,
    goPrev,
    reset,
    prefersReducedMotion,
    beatReady,
  };
}
