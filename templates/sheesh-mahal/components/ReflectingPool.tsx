"use client";

import React, { useState, useRef, useCallback } from "react";
import { SheeshMahalSacred } from "../types";
import { playSfx as triggerSfx } from "./AudioDock";

export interface ReflectingPoolProps {
  sacred?: SheeshMahalSacred;
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

const MAX_DIYAS = 20;

export default function ReflectingPool({
  sacred,
  onReplay,
  onPlaySfx
}: ReflectingPoolProps) {
  // Prepopulate pool with 3 floating diyas
  const [diyas, setDiyas] = useState<DiyaInstance[]>([
    { id: "diya-init-1", xPct: 28, yPct: 52, diyaIndex: 0, createdAt: 1 },
    { id: "diya-init-2", xPct: 65, yPct: 44, diyaIndex: 1, createdAt: 2 },
    { id: "diya-init-3", xPct: 48, yPct: 68, diyaIndex: 2, createdAt: 3 }
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
      className="sheesh-mahal-closing relative w-full py-16 px-4 flex flex-col items-center bg-[#03170f] text-[#f5efe2] overflow-hidden"
    >
      {/* Crescent Moon Visual Graphic (.cl-moon) */}
      <div
        className="cl-moon w-24 h-24 sm:w-28 sm:h-28 bg-contain bg-center bg-no-repeat mb-4 animate-pulse select-none"
        style={{
          backgroundImage: "url(/templates/sheesh-mahal/assets/closing/moon.webp)",
          filter: "drop-shadow(0 0 24px rgba(230,207,152,0.6))"
        }}
        aria-hidden="true"
      />

      {/* Sacred Closing Dua */}
      <div className="text-center max-w-lg mb-8 px-4 z-10">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c9a45c] mb-3 font-serif font-semibold">
          Final Sacred Blessing
        </p>
        <p
          className="text-2xl sm:text-3xl font-serif text-[#e6cf98] mb-3 leading-loose select-none"
          dir="rtl"
          aria-label="Baraka Allahu Lakuma Dua"
        >
          {closingArabic}
        </p>
        <p className="text-xs sm:text-sm text-[#f5efe2]/85 italic font-serif leading-relaxed max-w-md mx-auto">
          "{closingEnglish}"
        </p>
      </div>

      {/* Midnight Reflecting Pool Stage (.cl-scene, .cl-float, .cl-diyas) */}
      <div className="w-full max-w-2xl px-2 mb-10 z-10">
        <div className="text-center mb-3">
          <span className="text-[11px] uppercase tracking-widest text-[#c9a45c] font-serif">
            ✦ Tap the water to float a glowing brass diya ✦
          </span>
        </div>

        <div
          ref={poolRef}
          onClick={handlePoolClick}
          role="region"
          aria-label="Midnight Reflecting Pool. Click anywhere on the water to spawn a floating diya."
          className="cl-scene cl-float relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden border-2 border-[#c9a45c]/50 bg-[#05140e] shadow-[0_16px_50px_rgba(0,0,0,0.8),inset_0_0_60px_rgba(11,74,59,0.5)] cursor-pointer select-none"
          style={{
            backgroundImage: "url(/templates/sheesh-mahal/assets/closing/scene.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center bottom"
          }}
        >
          {/* Water Surface Specular Sheen */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#062a21]/60 via-transparent to-black/30 pointer-events-none" />

          {/* Floating Diyas Container (.cl-diyas) */}
          <div className="cl-diyas absolute inset-0 pointer-events-none">
            {diyas.map((d) => (
              <div
                key={d.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${d.xPct}%`,
                  top: `${d.yPct}%`
                }}
              >
                {/* Concentric Water Ripple */}
                <div className="absolute inset-0 -m-4 rounded-full border border-[#c9a45c]/40 animate-ping opacity-60" />

                {/* Diya Graphic with Sinusoidal Vertical Bobbing Physics (.cl-bob) */}
                <div
                  className="cl-bob w-14 h-14 sm:w-16 sm:h-16 bg-contain bg-center bg-no-repeat transition-transform duration-1000"
                  style={{
                    backgroundImage: `url(${DIYA_IMAGES[d.diyaIndex]})`,
                    filter: "drop-shadow(0 0 12px rgba(230,207,152,0.8))",
                    animation: "cl-bob 3.6s ease-in-out infinite"
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Replay Invitation CTA Button (.cl-replay with minimum 44x44px touch target) */}
      <div className="z-10 flex flex-col items-center gap-4 mb-8">
        <button
          type="button"
          onClick={handleReplayClick}
          className="cl-replay min-h-[44px] min-w-[44px] px-8 py-3.5 rounded-full border-2 border-[#c9a45c] bg-[#0b4a3b] text-[#e6cf98] text-xs uppercase tracking-[0.2em] font-serif font-bold hover:bg-[#062a21] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(201,164,92,0.3)] cursor-pointer"
          aria-label="Replay Royal Invitation from the Entrance Gate"
        >
          ✦ Replay Royal Invitation ✦
        </button>
      </div>

      {/* Royal Colophon & Credits */}
      <div className="z-10 text-center text-xs text-[#f5efe2]/60 font-serif max-w-sm pt-6 border-t border-[#c9a45c]/20">
        <p className="mb-1 text-[#e6cf98]/80 font-medium">
          The Imperial Sheesh Mahal Wedding Invitation
        </p>
        <p className="text-[11px] text-[#f5efe2]/50">
          Designed with royal splendor · Invitation by Aqd Invites
        </p>
      </div>

      <style jsx global>{`
        @keyframes cl-bob {
          0%, 100% {
            transform: translateY(0px) rotate(-1.6deg);
          }
          50% {
            transform: translateY(4px) rotate(1.6deg);
          }
        }
      `}</style>
    </section>
  );
}
