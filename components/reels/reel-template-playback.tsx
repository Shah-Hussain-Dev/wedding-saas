"use client";

import RoseGoldBlush from "@/templates/rose-gold-blush/page";
import { ReelPhoneMockup } from "@/components/reels/reel-phone-mockup";
import { ReelVideoChrome } from "@/components/reels/reel-video-chrome";
import { ReelMobileViewport } from "@/components/reels/reel-mobile-viewport";
import { ReelBeatTransition } from "@/components/reels/reel-beat-transition";
import { useReelPlaybackContext } from "@/components/reels/reel-playback-context";

interface ReelTemplatePlaybackProps {
  size?: "default" | "large";
  className?: string;
  showChrome?: boolean;
}

export function ReelTemplatePlayback({
  size = "large",
  className = "",
  showChrome = true,
}: ReelTemplatePlaybackProps) {
  const {
    reel,
    scrollRootRef,
    beats,
    sampleData,
    supportsReel,
    activeIndex,
    progress,
    isPaused,
    setIsPaused,
    scratchReveal,
    handleHeroRevealed,
    reelActiveBeatId,
    reelEnterEpoch,
  } = useReelPlaybackContext();

  return (
    <div className={`relative w-full ${className}`}>
      <ReelPhoneMockup size={size} label={`${reel.name} video preview`}>
        <div className="absolute inset-0 overflow-hidden">
          {showChrome ? (
            <ReelVideoChrome
              beats={beats}
              activeIndex={activeIndex}
              progress={progress}
              isPaused={isPaused}
              onTogglePause={() => setIsPaused((p) => !p)}
            />
          ) : null}
          <ReelBeatTransition activeIndex={activeIndex} />
          <ReelMobileViewport scrollRootRef={scrollRootRef}>
            {supportsReel ? (
              <RoseGoldBlush
                data={sampleData}
                reelMode
                onReelHeroRevealed={handleHeroRevealed}
                reelScratchReveal={scratchReveal}
                reelActiveBeatId={reelActiveBeatId}
                reelEnterEpoch={reelEnterEpoch}
              />
            ) : (
              <p className="p-4 text-center text-xs text-white">
                Reel not available for this template.
              </p>
            )}
          </ReelMobileViewport>
        </div>
      </ReelPhoneMockup>
    </div>
  );
}
