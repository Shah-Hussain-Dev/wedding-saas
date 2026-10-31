"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { playSfx as triggerSfx } from "./AudioDock";

export interface AstrolabeCountdownProps {
  targetDate?: string; // Default: "2026-12-12T20:00:00+05:00" (Baraat reception)
  onPlaySfx?: (sfxName: string) => void;
}

const FONT_7x5: Record<string, number[]> = {
  "0": [0x1f, 0x11, 0x11, 0x11, 0x1f],
  "1": [0x00, 0x12, 0x1f, 0x10, 0x00],
  "2": [0x1d, 0x15, 0x15, 0x15, 0x17],
  "3": [0x11, 0x15, 0x15, 0x15, 0x1f],
  "4": [0x07, 0x04, 0x04, 0x1f, 0x04],
  "5": [0x17, 0x15, 0x15, 0x15, 0x1d],
  "6": [0x1f, 0x15, 0x15, 0x15, 0x1d],
  "7": [0x01, 0x01, 0x19, 0x05, 0x03],
  "8": [0x1f, 0x15, 0x15, 0x15, 0x1f],
  "9": [0x17, 0x15, 0x15, 0x15, 0x1f]
};

function getAngleFromPoint(centerX: number, centerY: number, x: number, y: number): number {
  const dx = x - centerX;
  const dy = y - centerY;
  let rad = Math.atan2(dy, dx);
  let deg = (rad * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateRemaining(targetIso: string): TimeRemaining {
  const targetTime = new Date(targetIso).getTime();
  const now = Date.now();
  const diffMs = targetTime - now;

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

/**
 * Custom 2D canvas flip-tile unit renderer using 7x5 matrix
 */
function CanvasDigitUnit({ value, label }: { value: number; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const strVal = String(value).padStart(2, "0");
    const d1 = strVal[0];
    const d2 = strVal[1];

    const m1 = FONT_7x5[d1] || FONT_7x5["0"];
    const m2 = FONT_7x5[d2] || FONT_7x5["0"];

    // Canvas dimensions: 110x70
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dotSize = 4.5;
    const gap = 2.2;
    const startY = 8;

    // Draw digit 1
    const startX1 = 12;
    for (let col = 0; col < 5; col++) {
      const bitmask = m1[col];
      for (let row = 0; row < 7; row++) {
        const isSet = (bitmask & (1 << (6 - row))) !== 0;
        const x = startX1 + col * (dotSize + gap);
        const y = startY + row * (dotSize + gap);

        ctx.beginPath();
        ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
        if (isSet) {
          ctx.fillStyle = "#e6cf98";
          ctx.shadowColor = "#c9a45c";
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = "rgba(11, 74, 59, 0.4)";
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
    }

    // Draw digit 2
    const startX2 = 62;
    for (let col = 0; col < 5; col++) {
      const bitmask = m2[col];
      for (let row = 0; row < 7; row++) {
        const isSet = (bitmask & (1 << (6 - row))) !== 0;
        const x = startX2 + col * (dotSize + gap);
        const y = startY + row * (dotSize + gap);

        ctx.beginPath();
        ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
        if (isSet) {
          ctx.fillStyle = "#e6cf98";
          ctx.shadowColor = "#c9a45c";
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = "rgba(11, 74, 59, 0.4)";
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center p-2 sm:p-3 rounded-xl border border-[#c9a45c]/30 bg-[#062a21]/90 backdrop-blur-md shadow-lg min-w-[64px] sm:min-w-[80px] w-full">
      <canvas
        ref={canvasRef}
        width={110}
        height={66}
        className="cd-unit w-full max-w-[96px] h-auto block select-none"
        aria-hidden="true"
      />
      <div className="mt-1 text-2xl sm:text-3xl font-serif font-bold text-[#e6cf98] tabular-nums tracking-wider">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#c9a45c] font-semibold mt-1">
        {label}
      </span>
    </div>
  );
}

export default function AstrolabeCountdown({
  targetDate = "2026-12-12T20:00:00+05:00",
  onPlaySfx
}: AstrolabeCountdownProps) {
  const [rotationAngle, setRotationAngle] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [time, setTime] = useState<TimeRemaining>(() => calculateRemaining(targetDate));

  const dialRef = useRef<HTMLDivElement | null>(null);
  const lastAngleRef = useRef(45);
  const lastTickAngleRef = useRef(45);

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

  // Live countdown timer loop
  useEffect(() => {
    setTime(calculateRemaining(targetDate));
    const timer = setInterval(() => {
      setTime(calculateRemaining(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Pointer drag mechanics for interactive astrolabe dial
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const currentAngle = getAngleFromPoint(centerX, centerY, e.clientX, e.clientY);

    setRotationAngle(currentAngle);

    // Play metallic gear tick sfx on ~15 deg rotation steps
    if (Math.abs(currentAngle - lastTickAngleRef.current) >= 15) {
      playSfx("sfx-tick.mp3");
      lastTickAngleRef.current = currentAngle;
    }

    // Check lock snap: target alignment is 0° / 360° (or within ±8°)
    if (!isLocked && (currentAngle <= 8 || currentAngle >= 352)) {
      setIsLocked(true);
      playSfx("sfx-lock.mp3");
    }

    lastAngleRef.current = currentAngle;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handleSnapToDate = () => {
    setRotationAngle(0);
    setIsLocked(true);
    playSfx("sfx-lock.mp3");
  };

  return (
    <section
      id="countdown"
      className="cd-astro relative w-full py-16 px-4 flex flex-col items-center bg-[#03170f] text-[#f5efe2] overflow-hidden"
    >
      {/* Background Ambient Celestial Ceiling */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: "url(/templates/sheesh-mahal/assets/countdown/ceiling.webp)"
        }}
      />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-md mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c9a45c] mb-2 font-serif font-semibold">
          Celestial Timepiece
        </p>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#e6cf98] mb-3">
          Astrolabe Countdown
        </h2>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#c9a45c] to-transparent mx-auto mb-3" />
        <p className="text-xs sm:text-sm text-[#f5efe2]/80 font-light">
          Rotate the antique brass dial to align the celestial rings with the royal wedding date
        </p>
      </div>

      {/* Interactive Astrolabe Stage */}
      <div className="relative z-10 w-full max-w-[340px] sm:max-w-[400px] aspect-square flex items-center justify-center mb-10 select-none">
        {/* Alignment Radial Glow Flare */}
        <div
          className={`cd-glow absolute inset-4 rounded-full transition-opacity duration-1000 pointer-events-none ${
            isLocked
              ? "opacity-100 shadow-[0_0_80px_rgba(230,207,152,0.45),inset_0_0_60px_rgba(201,164,92,0.35)]"
              : "opacity-0"
          }`}
        />

        {/* Outer Astrolabe Base Frame */}
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: "url(/templates/sheesh-mahal/assets/countdown/frame.webp)"
          }}
        />

        {/* Ring 3 (Outer Solar Calendar Ring) */}
        <div
          className="absolute inset-[8%] bg-contain bg-center bg-no-repeat pointer-events-none transition-transform duration-300"
          style={{
            backgroundImage: "url(/templates/sheesh-mahal/assets/countdown/ring3.webp)",
            transform: `rotate(${rotationAngle * 0.3}deg)`
          }}
        />

        {/* Ring 2 (Middle Lunar Calendar Ring) */}
        <div
          className="absolute inset-[18%] bg-contain bg-center bg-no-repeat pointer-events-none transition-transform duration-300"
          style={{
            backgroundImage: "url(/templates/sheesh-mahal/assets/countdown/ring2.webp)",
            transform: `rotate(${-rotationAngle * 0.6}deg)`
          }}
        />

        {/* Ring 1 (Inner Zodiac Degree Ring) */}
        <div
          className="absolute inset-[28%] bg-contain bg-center bg-no-repeat pointer-events-none transition-transform duration-300"
          style={{
            backgroundImage: "url(/templates/sheesh-mahal/assets/countdown/ring1.webp)",
            transform: `rotate(${rotationAngle * 1.2}deg)`
          }}
        />

        {/* Pierced Brass Rete Pointer */}
        <div
          className="absolute inset-[15%] bg-contain bg-center bg-no-repeat pointer-events-none transition-transform duration-300"
          style={{
            backgroundImage: "url(/templates/sheesh-mahal/assets/countdown/rete.webp)",
            transform: `rotate(${rotationAngle}deg)`
          }}
        />

        {/* Center Interactive Touch Dial (.cd-dial) */}
        <div
          ref={dialRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="slider"
          aria-label="Astrolabe Alignment Dial"
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={Math.round(rotationAngle)}
          tabIndex={0}
          className="cd-dial relative z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#e6cf98] bg-[#062a21]/95 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_24px_rgba(201,164,92,0.4)] transition-transform hover:scale-105 active:scale-95"
          style={{ touchAction: "none" }}
        >
          {/* Compass / Pointer Needle */}
          <div
            className="w-1.5 h-10 bg-gradient-to-t from-transparent via-[#c9a45c] to-[#e6cf98] rounded-full mb-1 transition-transform"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
          />
          <span className="text-[10px] uppercase font-serif tracking-widest text-[#e6cf98] font-semibold">
            {isLocked ? "Aligned" : "Drag Dial"}
          </span>
        </div>
      </div>

      {/* Alignment Status Banner */}
      <div className="relative z-10 mb-8 flex flex-col items-center">
        {isLocked ? (
          <div className="px-5 py-2 rounded-full border border-[#c9a45c] bg-[#0b4a3b]/60 text-[#e6cf98] text-xs font-serif uppercase tracking-wider shadow-[0_0_20px_rgba(201,164,92,0.3)] animate-pulse flex items-center gap-2">
            <span>✦</span>
            <span>Celestial Conjunction Aligned · Baraat: Dec 12, 2026</span>
            <span>✦</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSnapToDate}
            className="min-h-[44px] min-w-[44px] px-4 py-2 rounded-full border border-[#c9a45c]/60 bg-[#062a21]/80 text-[#e6cf98] text-xs font-serif uppercase tracking-wider hover:bg-[#0b4a3b] active:scale-95 transition-all shadow-md cursor-pointer"
            aria-label="Snap Astrolabe Dial to Auspicious Wedding Date"
          >
            ✦ Snap to Auspicious Date ✦
          </button>
        )}
      </div>

      {/* Live 2D Canvas Flip-Tile Countdown Grid (.cd-count) */}
      <div className="cd-count relative z-10 w-full max-w-lg grid grid-cols-4 gap-2 sm:gap-4 px-2">
        <CanvasDigitUnit value={time.days} label="Days" />
        <CanvasDigitUnit value={time.hours} label="Hours" />
        <CanvasDigitUnit value={time.minutes} label="Minutes" />
        <CanvasDigitUnit value={time.seconds} label="Seconds" />
      </div>
    </section>
  );
}
