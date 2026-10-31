"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { SheeshMahalData } from "../types";
import { playSfx } from "./AudioDock";

export interface FamilyLampsProps {
  data?: Partial<SheeshMahalData>;
}

export default function FamilyLamps({ data }: FamilyLampsProps) {
  const [groomLit, setGroomLit] = useState(false);
  const [brideLit, setBrideLit] = useState(false);
  const [bothLit, setBothLit] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const groomName = data?.groomName || data?.couple?.groomName || "Zain";
  const brideName = data?.brideName || data?.couple?.brideName || "Anaya";
  const groomParents =
    data?.groomParents || data?.couple?.groomParents || "Mr & Mrs Imran Siddiqui";
  const brideParents =
    data?.brideParents || data?.couple?.brideParents || "Mr & Mrs Faisal Chaudhry";

  const familyDua =
    data?.sacred?.familyDua || "اللَّهُمَّ أَلِّفْ بَيْنَ قُلُوبِنَا، وَأَصْلِحْ ذَاتَ بَيْنِنَا";
  const familyReference =
    data?.sacred?.familyReference || "Sunan Abi Dawud · 969";

  // Preload sound effects for zero-latency interaction
  useEffect(() => {
    try {
      const lightAudio = new Audio("/templates/sheesh-mahal/audio/sfx-light.mp3");
      lightAudio.preload = "auto";
      const joinAudio = new Audio("/templates/sheesh-mahal/audio/sfx-join.mp3");
      joinAudio.preload = "auto";
    } catch {
      // Audio preloading fallback for environments without Audio API
    }
  }, []);

  // Light groom lamp
  const handleGroomLamp = useCallback(() => {
    if (!groomLit) {
      playSfx("/templates/sheesh-mahal/audio/sfx-light.mp3");
      setGroomLit(true);
    }
  }, [groomLit]);

  // Light bride lamp
  const handleBrideLamp = useCallback(() => {
    if (!brideLit) {
      playSfx("/templates/sheesh-mahal/audio/sfx-light.mp3");
      setBrideLit(true);
    }
  }, [brideLit]);

  // Check confluence when both lamps become lit
  useEffect(() => {
    if (groomLit && brideLit && !bothLit) {
      setBothLit(true);
      playSfx("/templates/sheesh-mahal/audio/sfx-join.mp3");
    }
  }, [groomLit, brideLit, bothLit]);

  // Split honorific ("Mr & Mrs") from family name for authentic royal formatting
  const splitParents = (raw: string) => {
    const match = raw.match(/^(Mr\s*(?:&|and)\s*Mrs\.?)\s*(.*)$/i);
    if (match) {
      return { honorific: match[1], name: match[2] };
    }
    return { honorific: "", name: raw };
  };

  const groomInfo = splitParents(groomParents);
  const brideInfo = splitParents(brideParents);

  return (
    <section
      ref={sectionRef}
      id="families"
      className="families"
      data-section="families"
      aria-labelledby="famTitle"
    >
      <div className="fm-glow fm-glow-a" aria-hidden="true" />
      <div className="fm-glow fm-glow-b" aria-hidden="true" />

      {/* Header: With the blessings of / Our Families */}
      <header className="fm-head">
        <p className="fm-kicker">WITH THE BLESSINGS OF</p>
        <h2 className="fm-title" id="famTitle">
          Our Families
        </h2>
      </header>

      {/* Hanging Lanterns Stage with Rail, Dual Pendulums, and Golden Arc */}
      <div className="fm-stage">
        {/* Brass Hanging Rail with Finial End Caps */}
        <div className="fm-rail-wrap" aria-hidden="true">
          <span className="fm-finial fm-finial-l" />
          <i className="fm-rail" />
          <span className="fm-finial fm-finial-r" />
        </div>

        {/* Golden Confluence Bezier Threads (Arc between both lanterns) */}
        <svg
          className={`fm-threads ${bothLit ? "is-active" : ""}`}
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 400 240"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="fmGlowBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="fmGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d8b46e" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#fff3cf" stopOpacity="1" />
              <stop offset="100%" stopColor="#d8b46e" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Outer Golden Glow Arc */}
          <path
            className="fm-thread-glow"
            d="M 98,105 Q 200,185 302,105"
          />
          {/* Core Golden Luminous Arc */}
          <path
            className="fm-thread-core"
            d="M 98,105 Q 200,185 302,105"
          />

          {/* Center Golden Sparkle / Confluence Pearl */}
          <circle
            className="fm-thread-pearl"
            cx="200"
            cy="145"
            r="3.5"
          />
        </svg>

        {/* Dual Hanging Columns: Groom Side (Left) & Bride Side (Right) */}
        <div className="fm-columns">
          {/* Groom's Family Side */}
          <div className="fm-side fm-side-a">
            <div className="fm-hang">
              <i className="fm-chain" aria-hidden="true" />
              <button
                className={`fm-lamp ${groomLit ? "is-lit" : ""}`}
                type="button"
                aria-pressed={groomLit ? "true" : "false"}
                aria-label="Light the lamp for the groom's family"
                onClick={handleGroomLamp}
              >
                <span className="fm-halo" aria-hidden="true" />
                <span className="fm-lantern fm-unlit" aria-hidden="true" />
                <span className="fm-lantern fm-lit" aria-hidden="true" />
                <span className="fm-lantern fm-flicker" aria-hidden="true" />
              </button>
            </div>
            <div className="fm-names">
              <p className="fm-label">THE GROOM&rsquo;S FAMILY</p>
              <p className="fm-parents">
                {groomInfo.honorific && (
                  <span className="fm-honorific">{groomInfo.honorific}</span>
                )}
                <span className="fm-pname">{groomInfo.name}</span>
              </p>
            </div>
          </div>

          {/* Bride's Family Side */}
          <div className="fm-side fm-side-b">
            <div className="fm-hang">
              <i className="fm-chain" aria-hidden="true" />
              <button
                className={`fm-lamp ${brideLit ? "is-lit" : ""}`}
                type="button"
                aria-pressed={brideLit ? "true" : "false"}
                aria-label="Light the lamp for the bride's family"
                onClick={handleBrideLamp}
              >
                <span className="fm-halo" aria-hidden="true" />
                <span className="fm-lantern fm-unlit" aria-hidden="true" />
                <span className="fm-lantern fm-lit" aria-hidden="true" />
                <span className="fm-lantern fm-flicker" aria-hidden="true" />
              </button>
            </div>
            <div className="fm-names">
              <p className="fm-label">THE BRIDE&rsquo;S FAMILY</p>
              <p className="fm-parents">
                {brideInfo.honorific && (
                  <span className="fm-honorific">{brideInfo.honorific}</span>
                )}
                <span className="fm-pname">{brideInfo.name}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Central Union Block & Marriage Dua (Stacked cleanly beneath lanterns) */}
      <div className={`fm-union ${bothLit ? "is-united" : ""}`}>
        <h3 className="fm-couple">
          <span className="fm-name">{groomName}</span>{" "}
          <i className="fm-amp">&amp;</i>{" "}
          <span className="fm-name">{brideName}</span>
        </h3>
        <p className="fm-dua" lang="ar" dir="rtl">
          {familyDua}
        </p>
        <p className="fm-dua-en">
          &ldquo;O Allah, bring our hearts together, and set right what is
          between us.&rdquo;
        </p>
        <p className="fm-dua-ref">{familyReference}</p>
      </div>

      {/* Interactive Hint */}
      <p className={`fm-hint ${bothLit ? "is-blessed" : ""}`} aria-hidden="true">
        {bothLit ? "✦ May Allah bless this union ✦" : "✦ Tap each lamp to light it ✦"}
      </p>

      <i className={`fm-bloom ${bothLit ? "is-active" : ""}`} aria-hidden="true" />

      <style jsx>{`
        .families {
          position: relative;
          width: 100%;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #062a21;
          background-image: radial-gradient(
              ellipse at center,
              rgba(6, 42, 33, 0.45) 0%,
              rgba(2, 18, 13, 0.92) 100%
            ),
            url("/templates/sheesh-mahal/assets/families/wall.webp");
          background-repeat: repeat;
          background-position: center top;
          background-size: 260px auto;
          padding: clamp(24px, 4.5vh, 44px) 16px clamp(28px, 5.5vh, 48px) 16px;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .fm-glow {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          z-index: 1;
          opacity: 0.15;
          transition: opacity 1s ease;
        }
        .fm-glow-a {
          top: 15%;
          left: -80px;
          background: #c9a45c;
        }
        .fm-glow-b {
          top: 15%;
          right: -80px;
          background: #c9a45c;
        }

        .fm-head {
          text-align: center;
          margin-bottom: clamp(10px, 2vh, 18px);
          z-index: 10;
        }
        .fm-kicker {
          font-family: "Cormorant Garamond", serif !important;
          font-size: clamp(12px, 3.2vw, 14px) !important;
          letter-spacing: 0.24em !important;
          text-transform: uppercase !important;
          color: #d8b46e !important;
          margin: 0 0 4px 0 !important;
          font-weight: 700 !important;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.85);
        }
        .fm-title {
          font-family: "Alex Brush", cursive !important;
          font-size: clamp(38px, 10vw, 54px) !important;
          color: #f2dfb1 !important;
          margin: 0 !important;
          font-weight: 400 !important;
          line-height: 1.15;
          text-shadow: 0 4px 14px rgba(0, 0, 0, 0.8), 0 0 24px rgba(201, 164, 92, 0.35);
        }

        /* Main Hanging Lanterns Stage */
        .fm-stage {
          position: relative;
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          perspective: 1000px;
          z-index: 10;
        }

        /* Top Hanging Rail */
        .fm-rail-wrap {
          position: relative;
          width: 82%;
          height: 4px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fm-rail {
          display: block;
          width: 100%;
          height: 3px;
          background: linear-gradient(
            to right,
            #8a6428,
            #f5d78e 20%,
            #fff2c4 50%,
            #f5d78e 80%,
            #8a6428
          );
          border-radius: 2px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6), 0 0 8px rgba(201, 164, 92, 0.4);
        }
        .fm-finial {
          position: absolute;
          top: 50%;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fff1b8, #c9a45c, #5c3e10);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.7), 0 0 6px rgba(201, 164, 92, 0.5);
          transform: translateY(-50%);
        }
        .fm-finial-l {
          left: -5px;
        }
        .fm-finial-r {
          right: -5px;
        }

        /* Confluence SVG Arc */
        .fm-threads {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 230px;
          pointer-events: none;
          z-index: 5;
          opacity: 0;
          transition: opacity 0.8s ease;
        }
        .fm-threads.is-active {
          opacity: 1;
        }
        .fm-thread-glow {
          fill: none;
          stroke: url(#fmGoldGrad);
          stroke-width: 5;
          opacity: 0.8;
          filter: url(#fmGlowBlur);
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
        }
        .fm-thread-core {
          fill: none;
          stroke: #ffffff;
          stroke-width: 1.6;
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
        }
        .fm-threads.is-active .fm-thread-glow,
        .fm-threads.is-active .fm-thread-core {
          animation: fm-thread-draw 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes fm-thread-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        .fm-thread-pearl {
          fill: #ffffff;
          filter: drop-shadow(0 0 6px #ffd977);
          opacity: 0;
        }
        .fm-threads.is-active .fm-thread-pearl {
          animation: fm-pearl-reveal 0.6s ease-out 1.2s forwards,
            fm-pearl-pulse 2s ease-in-out infinite alternate 1.8s;
        }
        @keyframes fm-pearl-reveal {
          to {
            opacity: 1;
          }
        }
        @keyframes fm-pearl-pulse {
          0% {
            r: 3.5;
            filter: drop-shadow(0 0 5px #ffd977);
          }
          100% {
            r: 4.8;
            filter: drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 18px #ffd977);
          }
        }

        /* Two-Column Hanging Lanterns */
        .fm-columns {
          position: relative;
          width: 94%;
          max-width: 420px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-top: 0;
          z-index: 6;
        }

        .fm-side {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 48%;
          text-align: center;
        }

        /* Hanging Assembly (Chain + Lantern) with 3D Physics */
        .fm-hang {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform-origin: top center;
          transform-style: preserve-3d;
        }

        /* Left Lantern Pendulum & Floating Motion */
        .fm-side-a .fm-hang {
          animation: fm-float-left 4.6s ease-in-out infinite alternate,
            fm-sway-left 5.8s ease-in-out infinite alternate;
        }
        @keyframes fm-float-left {
          0% {
            transform: translateY(-3px);
          }
          100% {
            transform: translateY(4px);
          }
        }
        @keyframes fm-sway-left {
          0% {
            rotate: -2deg;
          }
          100% {
            rotate: 2deg;
          }
        }

        /* Right Lantern Pendulum & Floating Motion (Desynchronized for Realism) */
        .fm-side-b .fm-hang {
          animation: fm-float-right 5.2s ease-in-out infinite alternate -2.4s,
            fm-sway-right 6.4s ease-in-out infinite alternate -3.1s;
        }
        @keyframes fm-float-right {
          0% {
            transform: translateY(3px);
          }
          100% {
            transform: translateY(-4px);
          }
        }
        @keyframes fm-sway-right {
          0% {
            rotate: 2deg;
          }
          100% {
            rotate: -1.8deg;
          }
        }

        /* Chain connecting rod to lantern */
        .fm-chain {
          display: block;
          width: 8px;
          height: 24px;
          background-image: url("/templates/sheesh-mahal/assets/families/chain.webp");
          background-repeat: repeat-y;
          background-size: 8px auto;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
          margin-bottom: -2px;
        }

        /* Scaled Majestic Lantern Button - Perfectly Proportionate */
        .fm-lamp {
          position: relative;
          width: clamp(86px, 24vw, 110px);
          aspect-ratio: 520 / 1614;
          min-width: 44px;
          min-height: 44px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          touch-action: manipulation;
        }
        .fm-lamp:hover {
          transform: scale(1.03);
        }
        .fm-lamp:active {
          transform: scale(0.97);
        }

        /* Halo Glow Aura */
        .fm-halo {
          position: absolute;
          inset: -22%;
          background-image: url("/templates/sheesh-mahal/assets/families/lantern-glow.webp");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          opacity: 0;
          transition: opacity 0.8s ease;
          pointer-events: none;
        }
        .fm-lamp.is-lit .fm-halo {
          opacity: 0.95;
          animation: fm-halo-breathe 3.2s ease-in-out infinite alternate;
        }
        @keyframes fm-halo-breathe {
          0% {
            transform: scale(0.96);
            opacity: 0.85;
          }
          100% {
            transform: scale(1.04);
            opacity: 1;
          }
        }

        /* Lantern Texture Layers */
        .fm-lantern {
          position: absolute;
          inset: 0;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          transition: opacity 0.5s ease;
        }
        .fm-unlit {
          background-image: url("/templates/sheesh-mahal/assets/families/lantern-unlit.webp");
          filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.65));
          opacity: 1;
        }
        .fm-lit {
          background-image: url("/templates/sheesh-mahal/assets/families/lantern-lit.webp");
          filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.75))
            drop-shadow(0 0 16px rgba(245, 197, 66, 0.45));
          opacity: 0;
        }
        .fm-lamp.is-lit .fm-unlit {
          opacity: 0;
        }
        .fm-lamp.is-lit .fm-lit {
          opacity: 1;
        }
        .fm-flicker {
          background-image: url("/templates/sheesh-mahal/assets/families/lantern-lit.webp");
          opacity: 0;
          mix-blend-mode: screen;
          pointer-events: none;
        }
        .fm-lamp.is-lit .fm-flicker {
          animation: fm-flicker-flame 1.6s steps(6, jump-none) infinite;
        }
        @keyframes fm-flicker-flame {
          0%,
          100% {
            opacity: 0.82;
            filter: brightness(1);
          }
          20% {
            opacity: 1;
            filter: brightness(1.12);
          }
          45% {
            opacity: 0.88;
            filter: brightness(1.04);
          }
          65% {
            opacity: 0.98;
            filter: brightness(1.08);
          }
          85% {
            opacity: 0.85;
            filter: brightness(1.02);
          }
        }

        /* Family Names Under Lanterns - Highly Readable */
        .fm-names {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
        }
        .fm-label {
          font-family: "Cormorant Garamond", serif !important;
          font-size: clamp(11px, 2.9vw, 13px) !important;
          letter-spacing: 0.18em !important;
          text-transform: uppercase !important;
          color: #d8b46e !important;
          margin: 0 0 4px 0 !important;
          font-weight: 700 !important;
          white-space: nowrap !important;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.85);
        }
        .fm-parents {
          font-family: "Cormorant Garamond", serif !important;
          margin: 0 !important;
          line-height: 1.35 !important;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.85);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .fm-honorific {
          font-family: "Cormorant Garamond", serif !important;
          font-weight: 600 !important;
          font-size: clamp(15px, 4vw, 18px) !important;
          color: #ede0c8 !important;
          white-space: nowrap !important;
          display: block;
        }
        .fm-pname {
          font-family: "Cormorant Garamond", serif !important;
          font-weight: 700 !important;
          font-size: clamp(17px, 4.5vw, 21px) !important;
          color: #ffffff !important;
          white-space: nowrap !important;
          display: block;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
        }

        /* Central Union Block & Marriage Dua - High Contrast & Large Readability */
        .fm-union {
          width: 100%;
          max-width: 400px;
          text-align: center;
          margin-top: clamp(18px, 3.5vh, 28px);
          padding: 0 12px;
          box-sizing: border-box;
          z-index: 10;
          transition: transform 0.8s ease, filter 0.8s ease;
        }
        .fm-union.is-united {
          filter: drop-shadow(0 0 20px rgba(201, 164, 92, 0.35));
        }

        .fm-couple {
          margin: 0 0 6px 0 !important;
          line-height: 1.2 !important;
        }
        .fm-couple .fm-name {
          font-family: "Alex Brush", cursive !important;
          font-size: clamp(38px, 9.8vw, 50px) !important;
          color: #f2dfb1 !important;
          font-weight: 400 !important;
          display: inline-block;
          text-shadow: 0 3px 12px rgba(0, 0, 0, 0.85), 0 0 22px rgba(201, 164, 92, 0.45);
        }
        .fm-couple .fm-amp {
          font-family: "Alex Brush", cursive !important;
          font-size: clamp(28px, 7vw, 36px) !important;
          color: #d8b46e !important;
          margin: 0 6px !important;
          font-style: italic;
          opacity: 0.9;
          display: inline-block;
        }

        .fm-dua {
          font-family: "Amiri", "Amiri Quran", "Traditional Arabic", serif !important;
          font-size: clamp(22px, 6vw, 30px) !important;
          line-height: 1.85 !important;
          font-weight: 700 !important;
          color: #fff4d4 !important;
          margin: 4px 0 8px 0 !important;
          direction: rtl;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.85), 0 0 18px rgba(245, 197, 66, 0.35);
        }
        .fm-dua-en {
          font-family: "Cormorant Garamond", serif !important;
          font-size: clamp(14.5px, 3.8vw, 17.5px) !important;
          font-style: italic !important;
          font-weight: 500 !important;
          color: #f7f1e6 !important;
          line-height: 1.5 !important;
          margin: 0 auto 8px auto !important;
          max-width: 380px;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
        }
        .fm-dua-ref {
          font-family: "Cormorant Garamond", serif !important;
          font-size: 12.5px !important;
          letter-spacing: 0.22em !important;
          text-transform: uppercase !important;
          color: #d8b46e !important;
          margin: 0 !important;
          font-weight: 700 !important;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
        }

        /* Subtle Interactive Hint */
        .fm-hint {
          font-family: "Cormorant Garamond", serif !important;
          font-size: 12px !important;
          letter-spacing: 0.18em !important;
          text-transform: uppercase !important;
          color: #d8b46e !important;
          opacity: 0.85;
          margin: 12px 0 0 0 !important;
          z-index: 10;
          transition: opacity 0.5s ease, color 0.5s ease;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
        }
        .fm-hint.is-blessed {
          color: #f2dfb1 !important;
          opacity: 1;
          text-shadow: 0 0 12px rgba(201, 164, 92, 0.5);
        }

        /* Confluence Ambient Light Bloom */
        .fm-bloom {
          position: absolute;
          top: 38%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(245, 197, 66, 0.25) 0%,
            rgba(201, 164, 92, 0.08) 45%,
            transparent 70%
          );
          opacity: 0;
          pointer-events: none;
          z-index: 6;
          transition: opacity 1.2s ease;
        }
        .fm-bloom.is-active {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
