"use client";

import React, { useState, useRef, useCallback } from "react";
import { SheeshMahalSacred } from "../types";
import { playSfx as triggerSfx } from "./AudioDock";

export interface ReflectingPoolProps {
  sacred?: SheeshMahalSacred;
  familySignoff?: string;
  onReplay?: () => void;
  onPlaySfx?: (sfxName: string) => void;
}

interface DiyaInstance {
  id: string;
  xPct: number;
  yPct: number;
  diyaIndex: number;
  createdAt: number;
}

const DIYA_IMAGES = [
  "/templates/sheesh-mahal/assets/closing/diya-0.webp",
  "/templates/sheesh-mahal/assets/closing/diya-1.webp",
  "/templates/sheesh-mahal/assets/closing/diya-2.webp",
  "/templates/sheesh-mahal/assets/closing/diya-3.webp"
];

const PALACE_SPARKLES = [
  { x: 50, y: 15, size: 24, delay: 0 },
  { x: 35, y: 23, size: 16, delay: 0.8 },
  { x: 65, y: 23, size: 16, delay: 1.4 },
  { x: 50, y: 46, size: 18, delay: 0.4 },
  { x: 9, y: 38, size: 14, delay: 1.6 },
  { x: 91, y: 38, size: 14, delay: 1.0 },
  { x: 26, y: 48, size: 13, delay: 1.9 },
  { x: 74, y: 48, size: 13, delay: 0.5 }
];

const MAX_DIYAS = 20;

export default function ReflectingPool({
  sacred,
  familySignoff,
  onReplay,
  onPlaySfx
}: ReflectingPoolProps) {
  // Prepopulate pool with 3 floating diyas matching ceremonial layout
  const [diyas, setDiyas] = useState<DiyaInstance[]>([
    { id: "diya-init-1", xPct: 62, yPct: 78, diyaIndex: 0, createdAt: 1 },
    { id: "diya-init-2", xPct: 50, yPct: 92, diyaIndex: 1, createdAt: 2 },
    { id: "diya-init-3", xPct: 75, yPct: 88, diyaIndex: 0, createdAt: 3 }
  ]);

  const poolRef = useRef<HTMLDivElement | null>(null);

  const playSfx = useCallback(
    (name: string) => {
      if (onPlaySfx) {
        onPlaySfx(name);
        return;
      }
      triggerSfx(name);
    },
    [onPlaySfx]
  );

  const handlePoolClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!poolRef.current) return;
    const rect = poolRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPct = Math.max(5, Math.min(95, (clickX / rect.width) * 100));
    const yPct = Math.max(15, Math.min(85, (clickY / rect.height) * 100));

    const newDiya: DiyaInstance = {
      id: `diya-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      xPct,
      yPct,
      diyaIndex: Math.floor(Math.random() * DIYA_IMAGES.length),
      createdAt: Date.now()
    };

    playSfx("sfx-diya.mp3");

    setDiyas((prev) => {
      const updated = [...prev, newDiya];
      // Concurrency capped at 20 to prevent DOM/memory saturation
      if (updated.length > MAX_DIYAS) {
        return updated.slice(updated.length - MAX_DIYAS);
      }
      return updated;
    });
  };

  const handleReplayClick = () => {
    // Smooth scroll to top of window
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }

    if (onReplay) {
      onReplay();
    }
  };

  const closingArabic =
    sacred?.closingDua ||
    "بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ";
  const closingEnglish =
    "May Allah bless you both, shower His blessings upon you, and unite you in goodness.";

  return (
    <section
      id="closing"
      className="sheesh-mahal-closing relative w-full pt-12 sm:pt-16 pb-0 flex flex-col items-center bg-[#021811] text-[#f5efe2] overflow-hidden"
    >
      {/* Top Ornamental Gold Band Border */}
      <div
        className="absolute top-0 left-0 right-0 h-4 bg-repeat-x bg-contain bg-top z-10 pointer-events-none"
        style={{
          backgroundImage: "url('/templates/sheesh-mahal/assets/letter/band.webp')",
          backgroundSize: "auto 16px"
        }}
        aria-hidden="true"
      />

      {/* Crescent Moon Visual Graphic (.cl-moon) */}
      <div className="cl-moon hidden" aria-hidden="true" />

      {/* Sacred Inscription & Blessings Header */}
      <div className="relative z-10 w-full max-w-lg mx-auto text-center px-4 mb-4 sm:mb-6">
        {/* Arabic Closing Dua */}
        <p
          className="font-arabic text-xl sm:text-2xl md:text-3xl text-[#e6cf98] mb-2 leading-relaxed select-none"
          dir="rtl"
          aria-label="Baraka Allahu Lakuma Dua"
        >
          {closingArabic}
        </p>

        {/* English Translation */}
        <p className="font-serif italic text-xs sm:text-sm text-[#f5efe2]/90 leading-relaxed max-w-xs sm:max-w-md mx-auto mb-3">
          {closingEnglish}
        </p>

        {/* Delicate Golden Sparkle Star Divider */}
        <div className="flex items-center justify-center gap-3 my-2 text-[#c9a45c]" aria-hidden="true">
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#c9a45c]/50" />
          <span className="text-xs">✦</span>
          <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#c9a45c]/50" />
        </div>

        {/* Heartfelt Gratitude Message */}
        <p className="font-serif text-sm sm:text-base text-[#f5efe2] leading-relaxed max-w-xs sm:max-w-md mx-auto mb-3">
          Your presence and your prayers are the greatest gift we could ask for.
        </p>

        {/* Warm Family Signoff */}
        <p className="font-serif italic text-xs sm:text-sm text-[#c9a45c] mb-0.5">
          With love and duas,
        </p>
        <p
          className="font-script text-2xl sm:text-3xl text-[#e6cf98] leading-tight"
          style={{ fontFamily: "'Alex Brush', cursive" }}
        >
          {familySignoff || "the Siddiqui & Chaudhry families"}
        </p>
      </div>

      {/* Midnight Palace & Reflecting Pool (.cl-scene, .cl-float, .cl-diyas) */}
      <div
        ref={poolRef}
        onClick={handlePoolClick}
        role="region"
        aria-label="Midnight Reflecting Pool. Click anywhere on the water to float a glowing brass diya."
        className="cl-scene cl-float relative w-full aspect-[1080/1490] max-w-lg mx-auto overflow-hidden cursor-pointer select-none"
        style={{
          backgroundImage: "url('/templates/sheesh-mahal/assets/closing/scene.webp')",
          backgroundSize: "100% auto",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Soft Vignette Sky Gradient Blend at Top */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#021811] via-[#021811]/60 to-transparent pointer-events-none z-10" />

        {/* Palace Sparkling Glints */}
        <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
          <svg className="hidden">
            <defs>
              <radialGradient id="sparkle-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#fff8e7" />
                <stop offset="80%" stopColor="#e6cf98" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>

          {PALACE_SPARKLES.map((s, idx) => (
            <div
              key={idx}
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animation: `palace-twinkle 2.8s ease-in-out infinite ${s.delay}s`
              }}
            >
              <svg viewBox="0 0 24 24" className="w-full h-full filter drop-shadow-[0_0_6px_rgba(255,245,200,0.9)]">
                <path
                  d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9L12 0Z"
                  fill="url(#sparkle-grad)"
                />
                <circle cx="12" cy="12" r="2.5" fill="#ffffff" />
              </svg>
            </div>
          ))}
        </div>

        {/* Floating Diyas Container on Water Surface (.cl-diyas) */}
        <div className="cl-diyas absolute inset-0 pointer-events-none z-20">
          {diyas.map((d) => (
            <div
              key={d.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${d.xPct}%`,
                top: `${d.yPct}%`
              }}
            >
              {/* Concentric Water Ripple on Spawn */}
              <div className="absolute inset-0 -m-3 sm:-m-4 rounded-full border border-[#c9a45c]/50 animate-ping opacity-70" />

              {/* Diya Graphic with Sinusoidal Vertical Bobbing Physics (.cl-bob) */}
              <div
                className="cl-bob w-11 h-11 sm:w-13 sm:h-13 bg-contain bg-center bg-no-repeat transition-transform duration-1000"
                style={{
                  backgroundImage: `url(${DIYA_IMAGES[d.diyaIndex]})`,
                  filter: "drop-shadow(0 0 10px rgba(240,215,160,0.85)) drop-shadow(0 4px 6px rgba(0,0,0,0.5))",
                  animation: "cl-bob 3.6s ease-in-out infinite"
                }}
              />
            </div>
          ))}
        </div>

        {/* Sleek Centered Replay / Demo Badge (.cl-replay with >= 44x44px touch target) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <button
            type="button"
            onClick={handleReplayClick}
            className="cl-replay min-h-[44px] min-w-[44px] px-6 py-2 rounded-full border border-[#c9a45c]/40 bg-[#021811]/85 backdrop-blur-md text-[#e6cf98] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-serif hover:bg-[#062a21] hover:border-[#c9a45c] active:scale-95 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.6)] cursor-pointer flex items-center gap-2 select-none"
            aria-label="Replay Royal Invitation from the Entrance Gate"
          >
            <span>✦</span>
            <span>DEMO · AQD INVITES</span>
            <span>✦</span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes palace-twinkle {
          0%, 100% {
            opacity: 0.25;
            transform: translate(-50%, -50%) scale(0.6);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.15);
            filter: drop-shadow(0 0 8px rgba(255, 245, 210, 1));
          }
        }
        @keyframes cl-bob {
          0%, 100% {
            transform: translateY(0px) rotate(-1.6deg);
          }
          50% {
            transform: translateY(3.5px) rotate(1.6deg);
          }
        }
      `}</style>
    </section>
  );
}
