"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { playSfx } from "./AudioDock";

export interface EntranceGateProps {
  onOpen?: () => void;
  isOpen?: boolean;
}

// Exactly 13 bespoke spark coordinates per leaf matching imperial mirror geometry
const LEFT_SPARKS = [
  { left: "42.92%", top: "22.891%", k: 0.55, delay: "0s" },
  { left: "35.791%", top: "28.188%", k: 0.9, delay: "3.67s" },
  { left: "35.01%", top: "71.288%", k: 0.75, delay: "2.94s" },
  { left: "45.557%", top: "56.835%", k: 0.6, delay: "2.21s" },
  { left: "39.6%", top: "12.23%", k: 0.95, delay: "1.48s" },
  { left: "43.896%", top: "34.598%", k: 0.8, delay: "0.75s" },
  { left: "39.404%", top: "47.482%", k: 0.65, delay: "0.02s" },
  { left: "44.043%", top: "71.288%", k: 1.0, delay: "3.69s" },
  { left: "36.914%", top: "37.606%", k: 0.85, delay: "2.96s" },
  { left: "39.551%", top: "80.706%", k: 0.7, delay: "2.23s" },
  { left: "36.475%", top: "61.216%", k: 0.55, delay: "1.5s" },
  { left: "45.02%", top: "6.279%", k: 0.9, delay: "0.77s" },
  { left: "48.584%", top: "15.697%", k: 0.75, delay: "0.04s" },
];

const RIGHT_SPARKS = [
  { left: "65.234%", top: "25.899%", k: 0.55, delay: "0s" },
  { left: "55.908%", top: "71.223%", k: 0.9, delay: "3.67s" },
  { left: "55.225%", top: "25.899%", k: 0.75, delay: "2.94s" },
  { left: "60.449%", top: "12.034%", k: 0.6, delay: "2.21s" },
  { left: "60.156%", top: "47.417%", k: 0.95, delay: "1.48s" },
  { left: "57.715%", top: "37.606%", k: 0.8, delay: "0.75s" },
  { left: "60.4%", top: "80.772%", k: 0.65, delay: "0.02s" },
  { left: "64.99%", top: "71.354%", k: 1.0, delay: "3.69s" },
  { left: "65.771%", top: "60.366%", k: 0.85, delay: "2.96s" },
  { left: "65.234%", top: "35.317%", k: 0.7, delay: "2.23s" },
  { left: "54.883%", top: "6.344%", k: 0.55, delay: "1.5s" },
  { left: "57.422%", top: "61.151%", k: 0.9, delay: "0.77s" },
  { left: "65.771%", top: "5.625%", k: 0.75, delay: "0.04s" },
];

export default function EntranceGate({ onOpen, isOpen = false }: EntranceGateProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isFullyOpen, setIsFullyOpen] = useState(isOpen);
  const isTriggered = useRef(false);

  // Manage body scroll lock
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (!isFullyOpen) {
        document.documentElement.classList.add("is-shut");
        document.body.style.overflow = "hidden";
      } else {
        document.documentElement.classList.remove("is-shut");
        document.body.style.overflow = "";
      }
    }
    return () => {
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("is-shut");
        document.body.style.overflow = "";
      }
    };
  }, [isFullyOpen]);

  const handleOpen = useCallback(() => {
    if (isTriggered.current || isOpening || isFullyOpen) return;
    isTriggered.current = true;

    // Trigger door opening sound
    playSfx("/templates/sheesh-mahal/audio/sfx-door-open.mp3");

    // Check system reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setIsFullyOpen(true);
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("is-shut");
        document.body.style.overflow = "";
      }
      onOpen?.();
      return;
    }

    setIsOpening(true);

    // After 1800ms door swing completion
    setTimeout(() => {
      setIsFullyOpen(true);
      setIsOpening(false);
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("is-shut");
        document.body.style.overflow = "";
      }
      onOpen?.();
    }, 1800);
  }, [isOpening, isFullyOpen, onOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  };

  if (isFullyOpen) return null;

  return (
    <section
      id="gate"
      className={`gate ${isOpening ? "is-opening" : ""} ${isFullyOpen ? "is-open" : ""}`}
      aria-label="Your invitation"
    >
      <div className="gate-backdrop" aria-hidden="true" />
      <div className="gate-inner" id="gateInner">
        <div className="doors" id="doors">
          <div className="stage" aria-hidden="true">
            {/* ONLY the radiant golden sunburst light explosion sits behind the opening leaves */}
            <div className="d-light">
              <i className="d-rays" />
              <i className="d-core" />
            </div>

            {/* Left Door Leaf (swings open to -105deg in 3D perspective) */}
            <div className="d-leaf d-leaf-l">
              <div className="d-art" />
              <div className="d-glint">
                <i className="d-pool" />
              </div>
              <div className="d-sparks">
                {LEFT_SPARKS.map((s, idx) => (
                  <i
                    key={idx}
                    className="spark"
                    style={
                      {
                        left: s.left,
                        top: s.top,
                        "--k": s.k,
                        "--d": s.delay,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
              <div className="d-shade" />
            </div>

            {/* Right Door Leaf (swings open to 105deg in 3D perspective) */}
            <div className="d-leaf d-leaf-r">
              <div className="d-art" />
              <div className="d-glint">
                <i className="d-pool" />
              </div>
              <div className="d-sparks">
                {RIGHT_SPARKS.map((s, idx) => (
                  <i
                    key={idx}
                    className="spark"
                    style={
                      {
                        left: s.left,
                        top: s.top,
                        "--k": s.k,
                        "--d": s.delay,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
              <div className="d-shade" />
            </div>

            <div className="d-seam" />
            <div className="d-vignette" />
          </div>

          {/* Central Medallion Seal (>= 44x44px touch target) */}
          <button
            className="medallion"
            id="medallion"
            type="button"
            aria-label="Open Sheesh Mahal Wedding Invitation"
            onClick={handleOpen}
            onKeyDown={handleKeyDown}
            disabled={isOpening || isFullyOpen}
          >
            <span className="m-ring" aria-hidden="true" />
            <span className="m-body" aria-hidden="true">
              <span className="medallion-img" />
              <span className="m-sheen">
                <i className="m-band" />
              </span>
            </span>
          </button>

          {/* Gate hint placed directly below the medallion for zero overlap on mobile */}
          <p className="gate-hint" aria-hidden="true">
            Touch the medallion to enter
          </p>
        </div>
      </div>

      {/* Atmospheric flood light flare during opening transition */}
      <div className={`d-flood ${isOpening ? "is-active" : ""}`} aria-hidden="true" />

      <style jsx>{`
        .gate {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #03170f;
          overflow: hidden;
          perspective: 1400px;
          transition: opacity 0.8s ease;
        }
        .gate.is-open {
          opacity: 0;
          pointer-events: none;
        }
        .gate-backdrop {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, #062a21 0%, #03170f 75%, #020c08 100%);
          z-index: 1;
        }
        .gate-inner {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          box-sizing: border-box;
        }
        .doors {
          position: relative;
          width: min(100vw, calc(100svh * 0.56545));
          height: min(100svh, calc(100vw / 0.56545));
          max-width: 480px;
          max-height: 100svh;
          aspect-ratio: 0.56545;
          perspective: 1400px;
          transform-style: preserve-3d;
          --gx: 50%;
          --gy: 42%;
        }
        .stage {
          position: absolute;
          inset: 0;
          perspective: 1400px;
          perspective-origin: 50% 50%;
          transform-style: preserve-3d;
        }
        .d-art {
          position: absolute;
          inset: 0;
          background-image: url("/templates/sheesh-mahal/assets/cover/doors.webp");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }

        /* ─── Golden Sunburst & Light Explosion (Behind Opening Leaves) ─── */
        .d-light {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: radial-gradient(
            ellipse 50% 42% at 50% 48%,
            #fffbea 0%,
            #ffe7aa 20%,
            #e9b863 42%,
            #8a6424 68%,
            #231a0a 100%
          );
          pointer-events: none;
        }
        .d-rays {
          position: absolute;
          left: 50%;
          top: 48%;
          width: 260%;
          aspect-ratio: 1;
          translate: -50% -50%;
          background: repeating-conic-gradient(
            from 0deg,
            rgba(255, 248, 220, 0.42),
            rgba(255, 248, 220, 0) 5deg 12deg,
            rgba(255, 248, 220, 0.42) 17deg
          );
          -webkit-mask: radial-gradient(closest-side, #000 5%, rgba(0, 0, 0, 0.5) 30%, transparent 62%);
          mask: radial-gradient(closest-side, #000 5%, rgba(0, 0, 0, 0.5) 30%, transparent 62%);
          filter: blur(3px);
          animation: d-spin-rays 40s linear infinite;
        }
        @keyframes d-spin-rays {
          to { transform: rotate(1turn); }
        }
        .d-core {
          position: absolute;
          left: 50%;
          top: 48%;
          width: 70%;
          aspect-ratio: 1;
          translate: -50% -50%;
          border-radius: 50%;
          background: radial-gradient(closest-side, #fffef6, rgba(255, 244, 205, 0.8) 40%, rgba(255, 230, 160, 0));
          opacity: 0.9;
          box-shadow: 0 0 100px rgba(255, 230, 160, 0.85);
        }

        /* ─── 3D Door Leaves ─── */
        .d-leaf {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          overflow: hidden;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transition: transform 1.8s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .d-leaf-l {
          left: 0;
          transform-origin: left center;
        }
        .d-leaf-r {
          right: 0;
          transform-origin: right center;
        }
        .d-leaf-l .d-art {
          width: 200%;
          left: 0;
        }
        .d-leaf-r .d-art {
          width: 200%;
          left: -100%;
        }
        .gate.is-opening .d-leaf-l {
          transform: rotateY(-105deg);
        }
        .gate.is-opening .d-leaf-r {
          transform: rotateY(105deg);
        }
        .d-glint {
          position: absolute;
          inset: 0;
          -webkit-mask-image: url("/templates/sheesh-mahal/assets/cover/mirrors.webp");
          mask-image: url("/templates/sheesh-mahal/assets/cover/mirrors.webp");
          -webkit-mask-size: 200% 100%;
          mask-size: 200% 100%;
          background: rgba(255, 255, 255, 0.2);
          mix-blend-mode: screen;
        }
        .d-leaf-l .d-glint {
          -webkit-mask-position: 0 0;
          mask-position: 0 0;
        }
        .d-leaf-r .d-glint {
          -webkit-mask-position: 100% 0;
          mask-position: 100% 0;
        }
        .d-sparks {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .spark {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: radial-gradient(circle, #fff 0%, #e6cf98 60%, transparent 100%);
          animation: d-twinkle 3.2s ease-in-out infinite;
          animation-delay: var(--d, 0s);
          opacity: 0;
          transform: scale(var(--k, 0.8));
        }
        @keyframes d-twinkle {
          0%, 68%, 100% {
            opacity: 0;
            transform: scale(0.2) rotate(10deg);
          }
          78% {
            opacity: 1;
            transform: scale(1.1) rotate(35deg);
          }
          88% {
            opacity: 0.4;
            transform: scale(0.45) rotate(55deg);
          }
        }
        .d-seam {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 2px;
          transform: translateX(-50%);
          background: linear-gradient(to bottom, transparent, rgba(201, 164, 92, 0.4) 20%, rgba(201, 164, 92, 0.4) 80%, transparent);
          z-index: 10;
        }
        .d-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 85% 75% at 50% 48%, transparent 58%, rgba(0, 10, 6, 0.5) 100%);
          pointer-events: none;
        }

        /* ─── Medallion ─── */
        .medallion {
          position: absolute;
          top: 49.386%;
          left: 49.991%;
          transform: translate(-50%, -50%);
          width: 88px;
          height: 88px;
          min-width: 44px;
          min-height: 44px;
          border-radius: 50%;
          border: none;
          background: transparent;
          cursor: pointer;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: transform 0.4s ease, opacity 0.4s ease;
        }
        .gate.is-opening .medallion {
          transform: translate(-50%, -50%) scale(1.15);
          opacity: 0;
          pointer-events: none;
        }
        .m-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1.5px solid rgba(240, 214, 150, 0.75);
          animation: m-pulse 3.2s ease-out infinite;
        }
        @keyframes m-pulse {
          0% {
            opacity: 0.9;
            transform: scale(0.95);
          }
          100% {
            opacity: 0;
            transform: scale(1.4);
          }
        }
        .m-body {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), 0 0 40px rgba(201, 164, 92, 0.4);
        }
        .medallion-img {
          position: absolute;
          inset: 0;
          background-image: url("/templates/sheesh-mahal/assets/cover/medallion.webp");
          background-size: cover;
          background-position: center;
        }
        .m-sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255, 250, 230, 0.65) 50%, transparent 60%);
          animation: m-sweep 4.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes m-sweep {
          0%, 62% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* ─── Hint positioned directly below medallion ─── */
        .gate-hint {
          position: absolute;
          top: calc(49.386% + 58px);
          left: 50%;
          transform: translateX(-50%);
          color: #e6cf98;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(11px, 2.8vw, 13px);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          z-index: 25;
          opacity: 0.85;
          padding: 6px 16px;
          border: 1px solid rgba(201, 164, 92, 0.4);
          border-radius: 999px;
          background: rgba(3, 23, 15, 0.75);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          animation: h-float 2.8s ease-in-out infinite;
          pointer-events: none;
          white-space: nowrap;
        }
        .gate.is-opening .gate-hint {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        @keyframes h-float {
          0%, 100% { transform: translate(-50%, 0); opacity: 0.85; }
          50% { transform: translate(-50%, -4px); opacity: 0.6; }
        }

        /* ─── Flood light transition flare ─── */
        .d-flood {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 48%,
            #fffef9 0%,
            #fff8e4 45%,
            #f6e2b0 90%
          );
          opacity: 0;
          pointer-events: none;
          z-index: 30;
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s;
        }
        .d-flood.is-active {
          opacity: 0.95;
        }

        @media (prefers-reduced-motion: reduce) {
          .d-rays, .spark, .m-sheen, .m-ring, .gate-hint {
            animation: none !important;
          }
          .d-leaf {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
