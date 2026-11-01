"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ReelBeat, TemplateReelDefinition } from "@/config/template-reels";
import { resolveReelBeatsForTemplate } from "@/config/template-reels";
import { usePreviewTemplateData } from "@/lib/hooks/use-preview-template-data";
import { useReelSectionDriver } from "@/components/reels/use-reel-section-driver";

export const REEL_LOGICAL_WIDTH_PX = 390;

interface ReelPlaybackContextValue {
  reel: TemplateReelDefinition;
  scrollRootRef: React.RefObject<HTMLDivElement | null>;
  beats: ReelBeat[];
  sampleData: Record<string, unknown>;
  normalizedId: string;
  supportsReel: boolean;
  activeIndex: number;
  activeBeat: ReelBeat | undefined;
  progress: number;
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  heroRevealed: boolean;
  scratchReveal: boolean;
  goTo: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
  reset: () => void;
  handleHeroRevealed: () => void;
  reelActiveBeatId: string | undefined;
  reelEnterEpoch: number;
}

const ReelPlaybackContext = createContext<ReelPlaybackContextValue | null>(null);

export function useReelPlaybackContext() {
  const ctx = useContext(ReelPlaybackContext);
  if (!ctx) {
    throw new Error("useReelPlaybackContext must be used within ReelPlaybackProvider");
  }
  return ctx;
}

export function useOptionalReelPlaybackContext() {
  return useContext(ReelPlaybackContext);
}

interface ReelPlaybackProviderProps {
  reel: TemplateReelDefinition;
  children: ReactNode;
  /** Pause autoplay when tab hidden (detail page) */
  pauseWhenHidden?: boolean;
}

export function ReelPlaybackProvider({
  reel,
  children,
  pauseWhenHidden = true,
}: ReelPlaybackProviderProps) {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hiddenPaused, setHiddenPaused] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [scratchReveal, setScratchReveal] = useState(false);
  const [reelEnterEpoch, setReelEnterEpoch] = useState(0);

  const { sampleData, eventsForBeats, normalizedId } = usePreviewTemplateData(
    reel.linkedTemplateId
  );

  const beats = useMemo(
    () => resolveReelBeatsForTemplate(reel.templateId, eventsForBeats),
    [reel.templateId, eventsForBeats]
  );

  const onBeatChange = useCallback((_beat: ReelBeat, index: number) => {
    const b = beats[index];
    setScratchReveal(Boolean(b?.autoRevealScratch));
    setReelEnterEpoch((e) => e + 1);
  }, [beats]);

  const effectivePaused = isPaused || hiddenPaused;

  const driver = useReelSectionDriver({
    beats,
    scrollRootRef,
    paused: effectivePaused,
    heroRevealed,
    onBeatChange,
  });

  const handleHeroRevealed = useCallback(() => {
    setHeroRevealed(true);
  }, []);

  useEffect(() => {
    if (!pauseWhenHidden) return;
    const onVis = () => {
      setHiddenPaused(document.visibilityState === "hidden");
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [pauseWhenHidden]);

  const supportsReel = normalizedId === "rose-gold-blush";

  const value = useMemo(
    (): ReelPlaybackContextValue => ({
      reel,
      scrollRootRef,
      beats,
      sampleData: sampleData as Record<string, unknown>,
      normalizedId,
      supportsReel,
      activeIndex: driver.activeIndex,
      activeBeat: driver.activeBeat,
      progress: driver.progress,
      isPaused: effectivePaused,
      setIsPaused,
      heroRevealed,
      scratchReveal,
      goTo: driver.goTo,
      goNext: driver.goNext,
      goPrev: driver.goPrev,
      reset: () => {
        setHeroRevealed(false);
        setScratchReveal(false);
        driver.reset();
      },
      handleHeroRevealed,
      reelActiveBeatId: driver.activeBeat?.beatKey ?? driver.activeBeat?.id,
      reelEnterEpoch,
    }),
    [
      reel,
      beats,
      sampleData,
      normalizedId,
      supportsReel,
      driver,
      effectivePaused,
      heroRevealed,
      scratchReveal,
      handleHeroRevealed,
      reelEnterEpoch,
    ]
  );

  return (
    <ReelPlaybackContext.Provider value={value}>{children}</ReelPlaybackContext.Provider>
  );
}
