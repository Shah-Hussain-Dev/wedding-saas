"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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

// 12 Astrological Calendar Months (Outer Ring 3)
const CALENDAR_MONTHS = [
  "DECEMBER",
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER"
];

// 31 Days of the Solar Month (Middle Ring 2, aligned to Baraat wedding date: 12)
const CALENDAR_DATES = [
  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
];

// 7 Weekdays (Inner Ring 1, aligned to Baraat wedding day: SATURDAY)
const CALENDAR_WEEKDAYS = [
  "SATURDAY",
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY"
];

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
 * Custom 2D canvas flip-tile unit renderer using 7x5 dot matrix bitmasks
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dotSize = 3.6;
    const gap = 1.8;
    const startY = 6;

    // Draw digit 1
    const startX1 = 8;
    for (let col = 0; col < 5; col++) {
      const bitmask = m1[col];
      for (let row = 0; row < 7; row++) {
        // Centered 5-row digit inside 7-row LED matrix: rows 1..5 decode bits 0..4 right-side up
        const isSet = row >= 1 && row <= 5 ? (bitmask & (1 << (row - 1))) !== 0 : false;
        const x = startX1 + col * (dotSize + gap);
        const y = startY + row * (dotSize + gap);

        ctx.beginPath();
        ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
        if (isSet) {
          ctx.fillStyle = "#fff0c4";
          ctx.shadowColor = "#e6cf98";
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = "rgba(11, 74, 59, 0.35)";
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
    }

    // Draw digit 2
    const startX2 = 46;
    for (let col = 0; col < 5; col++) {
      const bitmask = m2[col];
      for (let row = 0; row < 7; row++) {
        const isSet = row >= 1 && row <= 5 ? (bitmask & (1 << (row - 1))) !== 0 : false;
        const x = startX2 + col * (dotSize + gap);
        const y = startY + row * (dotSize + gap);

        ctx.beginPath();
        ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
        if (isSet) {
          ctx.fillStyle = "#fff0c4";
          ctx.shadowColor = "#e6cf98";
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = "rgba(11, 74, 59, 0.35)";
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center py-2 px-1 rounded-xl border border-[#c9a45c]/30 bg-[#02170f]/80 backdrop-blur-md shadow-md w-full min-w-[64px] sm:min-w-[80px]">
      <canvas
        ref={canvasRef}
        width={80}
        height={48}
        className="cd-unit w-full max-w-[68px] h-auto block select-none"
        aria-hidden="true"
      />
      <div className="mt-0.5 text-xl sm:text-2xl font-serif font-bold text-[#f5e2b3] tabular-nums tracking-wider text-shadow">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#c9a45c] font-serif font-bold mt-0.5">
        {label}
      </span>
    </div>
  );
}

export default function AstrolabeCountdown({
  targetDate = "2026-12-12T20:00:00+05:00",
  onPlaySfx
}: AstrolabeCountdownProps) {
  // Starts unaligned at 45° so the guest spins the astrolabe to reveal the auspicious date
  const [rotationAngle, setRotationAngle] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [time, setTime] = useState<TimeRemaining>(() => calculateRemaining(targetDate));

  const targetFormatted = useMemo(() => {
    try {
      const d = new Date(targetDate);
      if (!isNaN(d.getTime())) {
        const monthShort = d.toLocaleDateString("en-US", { month: "short" });
        const day = d.getDate();
        const year = d.getFullYear();
        return `${monthShort} ${day}, ${year}`;
      }
    } catch {}
    return "Dec 12, 2026";
  }, [targetDate]);

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

  // Preload sound effects on mount for zero-latency audio
  useEffect(() => {
    try {
      const tick = new Audio("/templates/sheesh-mahal/audio/sfx-tick.mp3");
      tick.preload = "auto";
      const lock = new Audio("/templates/sheesh-mahal/audio/sfx-lock.mp3");
      lock.preload = "auto";
    } catch {}
  }, []);

  // Live countdown timer loop
  useEffect(() => {
    setTime(calculateRemaining(targetDate));
    const timer = setInterval(() => {
      setTime(calculateRemaining(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Pointer drag mechanics for rotating the astrolabe dial
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSpinning) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dialRef.current || isSpinning) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const currentAngle = getAngleFromPoint(centerX, centerY, e.clientX, e.clientY);

    setRotationAngle(currentAngle);

    // Play metallic gear tick sound every 12 degrees
    if (Math.abs(currentAngle - lastTickAngleRef.current) >= 12) {
      playSfx("sfx-tick.mp3");
      lastTickAngleRef.current = currentAngle;
    }

    // Check lock snap: target alignment is 0° / 360° (within ±10°)
    if (!isLocked && (currentAngle <= 10 || currentAngle >= 350)) {
      setIsLocked(true);
      playSfx("sfx-lock.mp3");
    } else if (isLocked && currentAngle > 12 && currentAngle < 348) {
      setIsLocked(false);
    }

    lastAngleRef.current = currentAngle;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}

      // Snap to target if released close to alignment, revealing auspicious date
      if (rotationAngle <= 18 || rotationAngle >= 342) {
        setRotationAngle(0);
        setIsLocked(true);
        playSfx("sfx-lock.mp3");
      }
    }
  };

  // Kinetic spin reveal animation when user taps the spin button
  const handleSnapToDate = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsLocked(false);

    const startAngle = rotationAngle;
    const extraSpins = 360 * 2; // 2 complete revolutions for authentic astrolabe spin
    const target = extraSpins;
    const startTime = performance.now();
    const duration = 1400; // 1.4 seconds smooth deceleration

    let lastTick = startAngle;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out deceleration
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startAngle + (target - startAngle) * ease;

      const displayAngle = current % 360;
      setRotationAngle(displayAngle);

      if (Math.abs(current - lastTick) >= 20) {
        playSfx("sfx-tick.mp3");
        lastTick = current;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setRotationAngle(0);
        setIsSpinning(false);
        setIsLocked(true);
        playSfx("sfx-lock.mp3");
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <section
      id="countdown"
      className="cd-astro relative w-full py-16 px-4 flex flex-col items-center text-[#f5efe2] overflow-hidden"
      style={{
        backgroundColor: "#062a21",
        backgroundImage: `radial-gradient(ellipse at center, rgba(6, 42, 33, 0.45) 0%, rgba(2, 18, 13, 0.94) 100%), url("/templates/sheesh-mahal/assets/families/wall.webp")`,
        backgroundRepeat: "repeat",
        backgroundPosition: "center top",
        backgroundSize: "260px auto"
      }}
    >
      {/* Top Gold Border Trim */}
      <div
        className="absolute top-0 inset-x-0 h-[18px] bg-[url('/templates/sheesh-mahal/assets/letter/band.webp')] bg-repeat-x bg-[length:auto_18px] z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Section Header: Our Day is / Written in the Stars */}
      <div className="relative z-10 text-center max-w-md mb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[#c9a45c] mb-1.5 font-serif font-bold text-shadow">
          OUR DAY IS
        </p>
        <h2
          className="text-4xl sm:text-5xl font-normal text-[#f2dfb1] leading-tight"
          style={{
            fontFamily: "'Alex Brush', cursive",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(201, 164, 92, 0.4)"
          }}
        >
          Written in the Stars
        </h2>
      </div>

      {/* Authentic Concentric Mughal Astrolabe (Aspect Ratio 960/1316 = 0.7295) */}
      <div
        className="relative z-10 w-full max-w-[340px] sm:max-w-[380px] select-none mb-6"
        style={{
          aspectRatio: "960 / 1316",
          perspective: "1000px"
        }}
      >
        {/* Alignment Light Glow Pulse */}
        <div
          className={`cd-glow absolute rounded-full transition-opacity duration-1000 pointer-events-none ${
            isLocked
              ? "opacity-100 shadow-[0_0_90px_rgba(245,215,142,0.5),inset_0_0_60px_rgba(201,164,92,0.4)]"
              : "opacity-0"
          }`}
          style={{
            left: "50%",
            top: "61.55%",
            width: "82%",
            height: "82%",
            transform: "translate(-50%, -50%)"
          }}
        />

        {/* Emerald Star-Lattice Center Disc (Visible behind pierced rete) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "50%",
            top: "61.55%",
            width: "56%",
            aspectRatio: "1",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle at center, #0a4f3d 0%, #032117 75%, #01120c 100%)",
            boxShadow: "inset 0 0 22px rgba(0, 0, 0, 0.9)"
          }}
        />

        {/* Ring 3: Outer Months Calendar Ring (831px on 960px frame = 86.56%) */}
        <div
          className="absolute pointer-events-none bg-contain bg-center bg-no-repeat transition-transform duration-300"
          style={{
            left: "50%",
            top: "61.55%",
            width: "86.56%",
            aspectRatio: "1",
            transform: `translate(-50%, -50%) rotate(${rotationAngle * 0.3}deg)`,
            backgroundImage: "url(/templates/sheesh-mahal/assets/countdown/ring3.webp)"
          }}
        >
          <svg viewBox="0 0 831 831" className="absolute inset-0 w-full h-full select-none" aria-hidden="true">
            {CALENDAR_MONTHS.map((month, idx) => {
              const angle = (idx * 360) / 12;
              const dotAngle = angle + 15;
              return (
                <React.Fragment key={month}>
                  <g transform={`rotate(${angle} 415.5 415.5)`}>
                    <text
                      x="415.5"
                      y={415.5 - 388.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#4a3720"
                      fontSize="22"
                      fontWeight="bold"
                      letterSpacing="0.14em"
                      style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
                    >
                      {month}
                    </text>
                  </g>
                  <circle
                    cx="415.5"
                    cy={415.5 - 388.5}
                    r="3"
                    fill="#9c7a3c"
                    transform={`rotate(${dotAngle} 415.5 415.5)`}
                  />
                </React.Fragment>
              );
            })}
          </svg>
        </div>

        {/* Ring 2: Middle Day-of-Month Ring (730px on 960px frame = 76.04%) */}
        <div
          className="absolute pointer-events-none bg-contain bg-center bg-no-repeat transition-transform duration-300"
          style={{
            left: "50%",
            top: "61.55%",
            width: "76.04%",
            aspectRatio: "1",
            transform: `translate(-50%, -50%) rotate(${rotationAngle * 0.6}deg)`,
            backgroundImage: "url(/templates/sheesh-mahal/assets/countdown/ring2.webp)"
          }}
        >
          <svg viewBox="0 0 730 730" className="absolute inset-0 w-full h-full select-none" aria-hidden="true">
            {CALENDAR_DATES.map((dateNum, idx) => {
              const angle = (idx * 360) / 31;
              const dotAngle = angle + 180 / 31;
              return (
                <React.Fragment key={`${dateNum}-${idx}`}>
                  <g transform={`rotate(${angle} 365 365)`}>
                    <text
                      x="365"
                      y={365 - 328}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#4a3720"
                      fontSize="20"
                      fontWeight="600"
                      style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
                    >
                      {dateNum}
                    </text>
                  </g>
                  <circle
                    cx="365"
                    cy={365 - 328}
                    r="2"
                    fill="#9c7a3c"
                    transform={`rotate(${dotAngle} 365 365)`}
                  />
                </React.Fragment>
              );
            })}
          </svg>
        </div>

        {/* Ring 1: Inner Day-of-Week Ring (592px on 960px frame = 61.67%) */}
        <div
          className="absolute pointer-events-none bg-contain bg-center bg-no-repeat transition-transform duration-300"
          style={{
            left: "50%",
            top: "61.55%",
            width: "61.67%",
            aspectRatio: "1",
            transform: `translate(-50%, -50%) rotate(${rotationAngle * 1.0}deg)`,
            backgroundImage: "url(/templates/sheesh-mahal/assets/countdown/ring1.webp)"
          }}
        >
          <svg viewBox="0 0 592 592" className="absolute inset-0 w-full h-full select-none" aria-hidden="true">
            {CALENDAR_WEEKDAYS.map((day, idx) => {
              const angle = (idx * 360) / 7;
              const dotAngle = angle + 180 / 7;
              return (
                <React.Fragment key={day}>
                  <g transform={`rotate(${angle} 296 296)`}>
                    <text
                      x="296"
                      y={296 - 260.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#4a3720"
                      fontSize="18"
                      fontWeight="bold"
                      letterSpacing="0.16em"
                      style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
                    >
                      {day}
                    </text>
                  </g>
                  <circle
                    cx="296"
                    cy={296 - 260.5}
                    r="2.5"
                    fill="#9c7a3c"
                    transform={`rotate(${dotAngle} 296 296)`}
                  />
                </React.Fragment>
              );
            })}
          </svg>
        </div>

        {/* Pierced Brass Celestial Rete (555px on 960px frame = 57.81%) */}
        <div
          className="absolute pointer-events-none bg-contain bg-center bg-no-repeat transition-transform duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
          style={{
            left: "50%",
            top: "61.55%",
            width: "57.81%",
            aspectRatio: "1",
            transform: `translate(-50%, -50%) rotate(${rotationAngle}deg)`,
            backgroundImage: "url(/templates/sheesh-mahal/assets/countdown/rete.webp)"
          }}
        />

        {/* Outer Astrolabe Base Frame (960 x 1316) with Suspension Ring, Throne & Gemstones */}
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none drop-shadow-[0_16px_36px_rgba(0,0,0,0.6)]"
          style={{
            backgroundImage: "url(/templates/sheesh-mahal/assets/countdown/frame.webp)"
          }}
        />

        {/* Interactive Rotational Touch Dial (.cd-dial) */}
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
          className="cd-dial absolute z-30 rounded-full cursor-grab active:cursor-grabbing focus:outline-none"
          style={{
            left: "50%",
            top: "61.55%",
            width: "60%",
            aspectRatio: "1",
            transform: "translate(-50%, -50%)",
            touchAction: "none"
          }}
        />
      </div>

      {/* Alignment Status / Interactive Spin Prompt */}
      <div className="relative z-10 mb-6 flex flex-col items-center">
        {isLocked ? (
          <div className="px-5 py-2 rounded-full border border-[#c9a45c] bg-[#032117]/85 text-[#f2dfb1] text-xs font-serif uppercase tracking-[0.16em] shadow-[0_0_16px_rgba(201,164,92,0.35)] flex items-center gap-1.5 animate-fadeIn">
            <span className="text-[#c9a45c]">✦</span>
            <span>Celestial Conjunction Aligned · Baraat: {targetFormatted}</span>
            <span className="text-[#c9a45c]">✦</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSnapToDate}
            className="min-h-[44px] min-w-[44px] px-5 py-2.5 rounded-full border border-[#c9a45c]/80 bg-[#02170f]/90 text-[#f2dfb1] text-xs font-serif uppercase tracking-wider hover:bg-[#062a21] active:scale-95 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.5),0_0_12px_rgba(201,164,92,0.3)] cursor-pointer flex items-center gap-2"
            aria-label="Spin Astrolabe Dial to Reveal Auspicious Wedding Date"
          >
            <span className="text-[#c9a45c]">✦</span>
            <span>Spin Dial to Reveal Wedding Date</span>
            <span className="text-[#c9a45c]">✦</span>
          </button>
        )}
      </div>

      {/* Live Flip-Tile Countdown Grid (.cd-count) - Revealed only when user spins & aligns the dial */}
      <div
        className={`cd-count relative z-10 w-full max-w-[360px] grid grid-cols-4 gap-2 px-1 transition-all duration-700 ease-out ${
          isLocked
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none h-0 overflow-hidden"
        }`}
      >
        <CanvasDigitUnit value={time.days} label="Days" />
        <CanvasDigitUnit value={time.hours} label="Hours" />
        <CanvasDigitUnit value={time.minutes} label="Minutes" />
        <CanvasDigitUnit value={time.seconds} label="Seconds" />
      </div>
    </section>
  );
}
