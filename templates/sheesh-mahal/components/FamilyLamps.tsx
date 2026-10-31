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
    data?.sacred?.familyDua || "اللَّهُمَّ أَلِّفْ بَيْنَ قُلُوبِنَا، وَأَصْلِحْ ذَاتَ بَيْنِنَا";
  const familyReference =
    data?.sacred?.familyReference || "Sunan Abi Dawud · 969";

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

      <header className="fm-head">
        <p className="fm-kicker">With the blessings of</p>
        <h2 className="fm-title" id="famTitle">
          Our Families
        </h2>
      </header>

      <div className="fm-lamps">
        <i className="fm-rail" aria-hidden="true" />

        {/* Groom's Family Side Lamp */}
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
            <p className="fm-label">The groom&rsquo;s family</p>
            <p className="fm-parents">{groomParents}</p>
          </div>
        </div>

        {/* Central Union Block & Marriage Dua */}
        <div className={`fm-union ${bothLit ? "is-united" : ""}`}>
          <p className="fm-couple">
            <span className="fm-name">{groomName}</span> <i>&amp;</i>{" "}
            <span className="fm-name">{brideName}</span>
          </p>
          <p className="fm-dua" lang="ar" dir="rtl">
            {familyDua}
          </p>
          <p className="fm-dua-en">
            &ldquo;O Allah, bring our hearts together, and set right what is
            between us.&rdquo;
          </p>
          <p className="fm-dua-ref">{familyReference}</p>
        </div>

        {/* Bride's Family Side Lamp */}
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
            <p className="fm-label">The bride&rsquo;s family</p>
            <p className="fm-parents">{brideParents}</p>
          </div>
        </div>
      </div>

      <p className="fm-hint" aria-hidden="true">
        {bothLit ? "May Allah bless this union" : "Tap each lamp to light it"}
      </p>

      {/* Golden Confluence Bezier Threads */}
      <svg
        className={`fm-threads ${bothLit ? "is-active" : ""}`}
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="fmBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        {/* Glow Paths */}
        <path
          className="fm-thread-glow fm-t-a"
          d="M 60,40 Q 140,110 200,120"
        />
        <path
          className="fm-thread-glow fm-t-b"
          d="M 340,40 Q 260,110 200,120"
        />
        <path className="fm-thread-glow fm-t-drop" d="M 200,120 L 200,160" />
        {/* Core Golden Paths */}
        <path
          className="fm-thread-core fm-t-a"
          d="M 60,40 Q 140,110 200,120"
        />
        <path
          className="fm-thread-core fm-t-b"
          d="M 340,40 Q 260,110 200,120"
        />
        <path className="fm-thread-core fm-t-drop" d="M 200,120 L 200,160" />
      </svg>

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
          background-image: url("/templates/sheesh-mahal/assets/families/wall.webp");
          background-size: cover;
          background-position: center;
          padding: 48px 16px;
          box-sizing: border-box;
          overflow: hidden;
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
          margin-bottom: 24px;
          z-index: 10;
        }
        .fm-kicker {
          font-family: "Cormorant Garamond", serif;
          font-size: 13px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c9a45c;
          margin: 0 0 6px 0;
          font-weight: 600;
        }
        .fm-title {
          font-family: "Alex Brush", cursive;
          font-size: clamp(36px, 9vw, 54px);
          color: #e6cf98;
          margin: 0;
          font-weight: 400;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
        }
        .fm-lamps {
          position: relative;
          width: 100%;
          max-width: 500px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          z-index: 10;
          margin-bottom: 24px;
        }
        .fm-rail {
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 2px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(201, 164, 92, 0.6) 20%,
            rgba(201, 164, 92, 0.6) 80%,
            transparent
          );
        }
        .fm-side {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 38%;
          text-align: center;
        }
        .fm-hang {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 12px;
        }
        .fm-chain {
          display: block;
          width: 6px;
          height: 36px;
          background-image: url("/templates/sheesh-mahal/assets/families/chain.webp");
          background-repeat: repeat-y;
          background-size: 6px auto;
        }
        .fm-lamp {
          position: relative;
          width: 72px;
          height: 108px;
          min-width: 44px;
          min-height: 44px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        .fm-lamp:hover {
          transform: scale(1.05);
        }
        .fm-halo {
          position: absolute;
          inset: -20px;
          background-image: url("/templates/sheesh-mahal/assets/families/lantern-glow.webp");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          opacity: 0;
          transition: opacity 0.8s ease;
          pointer-events: none;
        }
        .fm-lamp.is-lit .fm-halo {
          opacity: 1;
        }
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
          opacity: 1;
        }
        .fm-lit {
          background-image: url("/templates/sheesh-mahal/assets/families/lantern-lit.webp");
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
        }
        .fm-lamp.is-lit .fm-flicker {
          animation: fm-flicker 1.2s steps(4, jump-none) infinite;
        }
        @keyframes fm-flicker {
          0%, 100% { opacity: 0.8; }
          25% { opacity: 1; }
          50% { opacity: 0.85; }
          75% { opacity: 0.95; }
        }
        .fm-names {
          margin-top: 8px;
        }
        .fm-label {
          font-family: "Cormorant Garamond", serif;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #c9a45c;
          margin: 0 0 2px 0;
          font-weight: 600;
        }
        .fm-parents {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(14px, 3.5vw, 17px);
          font-weight: 600;
          color: #f5efe2;
          margin: 0;
          line-height: 1.3;
        }
        .fm-union {
          width: 50%;
          text-align: center;
          padding: 16px 10px;
          border-radius: 16px;
          background: rgba(3, 23, 15, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(201, 164, 92, 0.2);
          transition: border-color 0.8s ease, box-shadow 0.8s ease, transform 0.8s ease;
          align-self: center;
        }
        .fm-union.is-united {
          border-color: rgba(201, 164, 92, 0.7);
          box-shadow: 0 0 32px rgba(201, 164, 92, 0.35);
          transform: scale(1.02);
        }
        .fm-couple {
          font-family: "Alex Brush", cursive;
          font-size: clamp(26px, 6.5vw, 36px);
          color: #e6cf98;
          margin: 0 0 6px 0;
        }
        .fm-couple i {
          font-size: 0.8em;
          margin: 0 4px;
        }
        .fm-dua {
          font-family: "Amiri", "Amiri Quran", serif;
          font-size: clamp(16px, 4.2vw, 20px);
          line-height: 1.8;
          color: #e6cf98;
          margin: 0 0 4px 0;
          direction: rtl;
        }
        .fm-dua-en {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(12px, 3vw, 14px);
          font-style: italic;
          color: #f5efe2;
          opacity: 0.9;
          line-height: 1.4;
          margin: 0 0 4px 0;
        }
        .fm-dua-ref {
          font-family: "Cormorant Garamond", serif;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #c9a45c;
          margin: 0;
          font-weight: 600;
        }
        .fm-hint {
          font-family: "Cormorant Garamond", serif;
          font-size: 13px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #e6cf98;
          opacity: 0.85;
          margin: 16px 0 0 0;
          z-index: 10;
        }
        .fm-threads {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 5;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.8s ease;
        }
        .fm-threads.is-active {
          opacity: 1;
        }
        .fm-thread-glow {
          fill: none;
          stroke: #c9a45c;
          stroke-width: 6;
          opacity: 0.6;
          filter: url(#fmBlur);
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
        }
        .fm-thread-core {
          fill: none;
          stroke: #fff;
          stroke-width: 2;
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
        }
        .fm-threads.is-active .fm-thread-glow,
        .fm-threads.is-active .fm-thread-core {
          animation: fm-draw 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes fm-draw {
          to { stroke-dashoffset: 0; }
        }
        .fm-bloom {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(230, 207, 152, 0.4) 0%, transparent 70%);
          opacity: 0;
          pointer-events: none;
          z-index: 6;
          transition: opacity 1s ease;
        }
        .fm-bloom.is-active {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
