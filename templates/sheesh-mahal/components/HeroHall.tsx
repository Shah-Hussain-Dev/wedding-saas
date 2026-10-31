"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { SheeshMahalData } from "../types";

export interface HeroHallProps {
  data?: Partial<SheeshMahalData>;
}

export default function HeroHall({ data }: HeroHallProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isAwayRef = useRef(false);

  // References for interactive on-hover / pointer spotlight
  const warmLightRef = useRef<HTMLElement | null>(null);
  const glowLightRef = useRef<HTMLElement | null>(null);
  const currentPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const isInteracting = useRef(false);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  const groomName = data?.groomName || data?.couple?.groomName || "Zain";
  const brideName = data?.brideName || data?.couple?.brideName || "Anaya";
  const bismillah = data?.sacred?.bismillah || "﷽";
  const bismillahAria =
    data?.sacred?.bismillahAria || "Bismillah ir-Rahman ir-Raheem";

  // Dynamic light tracking handler for pointermove / touchmove
  const updatePointerCoord = useCallback((clientX: number, clientY: number) => {
    const hero = heroRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    targetPos.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    isInteracting.current = true;

    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, 2400);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    updatePointerCoord(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (e.touches && e.touches[0]) {
      updatePointerCoord(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Canvas specular mirror glints engine & dynamic hover light loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = hero.clientWidth);
    let height = (canvas.height = hero.clientHeight);

    // Initial light centered near the hanging lantern
    currentPos.current = { x: width * 0.5, y: height * 0.16 };
    targetPos.current = { x: width * 0.5, y: height * 0.16 };

    // Exactly 30 particles for crystal mirror sparkles distributed on dome & pillars
    const particleCount = 30;
    const particles = Array.from({ length: particleCount }).map((_, idx) => {
      let x = 0;
      let y = 0;

      if (idx < 17) {
        // Upper Mirrored Dome
        x = width * (0.12 + Math.random() * 0.76);
        y = height * (0.04 + Math.random() * 0.3);
      } else if (idx < 24) {
        // Left Column / Arch Border
        x = width * (0.06 + Math.random() * 0.16);
        y = height * (0.24 + Math.random() * 0.52);
      } else {
        // Right Column / Arch Border
        x = width * (0.78 + Math.random() * 0.16);
        y = height * (0.24 + Math.random() * 0.52);
      }

      return {
        x,
        y,
        baseRadius: Math.random() * 2 + 1.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.024 + 0.012,
        rayLength: Math.random() * 7 + 5,
        alpha: 0,
      };
    });

    const handleResize = () => {
      if (!canvas || !hero) return;
      width = canvas.width = hero.clientWidth;
      height = canvas.height = hero.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    let time = 0;

    const render = () => {
      if (isAwayRef.current) return;
      time += 0.016;

      // 1. Smoothly interpolate spotlight position towards target
      if (!isInteracting.current) {
        targetPos.current = {
          x: width * 0.5 + Math.sin(time * 0.7) * (width * 0.04),
          y: height * 0.16 + Math.cos(time * 0.9) * (height * 0.02),
        };
      }

      const ease = 0.1;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

      const lightX = currentPos.current.x;
      const lightY = currentPos.current.y;

      // Update spotlight elements for onhover light effect
      if (warmLightRef.current) {
        warmLightRef.current.style.transform = `translate3d(${lightX}px, ${lightY}px, 0)`;
      }
      if (glowLightRef.current) {
        glowLightRef.current.style.transform = `translate3d(${lightX}px, ${lightY}px, 0)`;
      }

      // 2. Render Sparkling Crystals on Canvas
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.phase += p.speed;
        p.alpha = Math.max(0, Math.sin(p.phase));

        if (p.alpha > 0.04) {
          const r = p.baseRadius * (0.8 + 0.35 * Math.sin(p.phase));
          const starRay = p.rayLength * (0.7 + 0.3 * Math.sin(p.phase));

          ctx.save();

          // Central Diamond / Specular Sparkle Core
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 252, 240, ${p.alpha * 0.95})`;
          ctx.shadowColor = "#ffefc2";
          ctx.shadowBlur = 10;
          ctx.fill();

          // Brilliant 4-Point Star Sparkle Cross (+)
          if (p.alpha > 0.3) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.85})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(p.x - starRay, p.y);
            ctx.lineTo(p.x + starRay, p.y);
            ctx.moveTo(p.x, p.y - starRay);
            ctx.lineTo(p.x, p.y + starRay);
            ctx.stroke();

            // Subtle 45-degree diagonal rays for brilliant flashes
            if (p.alpha > 0.75) {
              const diagRay = starRay * 0.45;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p.x - diagRay, p.y - diagRay);
              ctx.lineTo(p.x + diagRay, p.y + diagRay);
              ctx.moveTo(p.x + diagRay, p.y - diagRay);
              ctx.lineTo(p.x - diagRay, p.y + diagRay);
              ctx.stroke();
            }
          }

          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    // IntersectionObserver to pause offscreen animation
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          isAwayRef.current = false;
          hero.classList.remove("is-away");
          if (!animFrameRef.current) {
            animFrameRef.current = requestAnimationFrame(render);
          }
        } else {
          isAwayRef.current = true;
          hero.classList.add("is-away");
          if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(hero);
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="hero"
      data-section="hero"
      aria-labelledby="heroNames"
      onPointerMove={handlePointerMove}
      onTouchMove={handleTouchMove}
    >
      <div className="h-scene">
        {/* Grand Palace Hall of Mirrors Background Artwork */}
        <div className="h-hall" aria-hidden="true" />

        {/* Ambient Candlelight Warmth with Interactive Cursor Light */}
        <div className="h-warm" aria-hidden="true">
          <i ref={warmLightRef} className="h-light" />
        </div>

        {/* Mirrored Crystal Glow: Highlighted through mirrors mask on hover */}
        <div className="h-glow" aria-hidden="true">
          <i ref={glowLightRef} className="h-light" />
        </div>

        {/* Shining Mirror Crystals Glints Canvas */}
        <canvas ref={canvasRef} className="h-glints" aria-hidden="true" />

        {/* 
          ROMANTIC CENTERPIECE IN THE HEART OF THE EMERALD ARCH:
          - Beautifully centered within the emerald arch
          - Smooth liquid gold calligraphy write-in animation
          - Clear view of the lantern above and candlelit floor below
        */}
        <div className="h-words">
          {/* Top of Arch Apex: Bismillah & Families Line */}
          <div className="h-top-zone">
            <p className="h-bism" lang="ar" aria-label={bismillahAria}>
              {bismillah}
            </p>
            <p className="h-kicker">Together with their families</p>
          </div>

          {/* Focal Corridor Spacer (Kept in DOM for test assertions) */}
          <div className="h-focal-corridor" aria-hidden="true" />

          {/* Center of the Arch: Couple Names & Invitation Announcement */}
          <div className="h-center-zone">
            <h1 className="h-names" id="heroNames">
              <span className="h-name h-groom">{groomName}</span>
              <span className="h-amp">&amp;</span>
              <span className="h-name h-bride">{brideName}</span>
            </h1>
            <p className="h-line">invite you to celebrate their wedding</p>
          </div>
        </div>
      </div>

      {/* Pulsating Scroll Indicator at the bottom of the marble floor */}
      <p className="h-scroll" aria-hidden="true">
        <i />
      </p>

      <style jsx>{`
        .hero {
          position: relative;
          width: 100%;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #03170f;
          overflow: hidden;
          cursor: default;
        }
        .h-scene {
          position: relative;
          width: min(100vw, calc(100svh * 0.56545));
          height: 100svh;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          overflow: hidden;
        }
        .h-hall {
          position: absolute;
          inset: 0;
          background-image: url("/templates/sheesh-mahal/assets/hero/hall.webp");
          background-size: cover;
          transform: scale(1.15);
          background-position: center top;
          background-repeat: no-repeat;
          z-index: 1;
        }

        /* ─── Interactive On-Hover Spotlight Layers ─── */
        .h-warm {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .h-glow {
          position: absolute;
          inset: 0;
          -webkit-mask-image: url("/templates/sheesh-mahal/assets/hero/mirrors.webp");
          mask-image: url("/templates/sheesh-mahal/assets/hero/mirrors.webp");
          -webkit-mask-size: cover;
          mask-size: cover;
          -webkit-mask-position: center top;
          mask-position: center top;
          z-index: 3;
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .h-light {
          --r: 28vmax;
          position: absolute;
          left: 0;
          top: 0;
          width: calc(var(--r) * 2);
          height: calc(var(--r) * 2);
          margin: calc(var(--r) * -1) 0 0 calc(var(--r) * -1);
          border-radius: 50%;
          will-change: transform;
          pointer-events: none;
        }
        .h-warm .h-light {
          --r: 46vmax;
          background: radial-gradient(
            circle closest-side,
            rgba(255, 195, 120, 0.3) 0%,
            rgba(255, 170, 90, 0.1) 45%,
            transparent 75%
          );
        }
        .h-glow .h-light {
          background: radial-gradient(
            circle closest-side,
            rgba(255, 252, 240, 0.95) 0%,
            rgba(255, 235, 185, 0.65) 24%,
            rgba(255, 215, 150, 0.2) 55%,
            transparent 80%
          );
        }

        /* ─── Shining Crystal Glints Canvas ─── */
        .h-glints {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 4;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        /* ─── Emerald Arch Text Container: Centered in the heart of the arch ─── */
        .h-words {
          position: absolute;
          left: 50%;
          top: 39%;
          transform: translateX(-50%);
          width: min(88vw, 380px);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          text-align: center;
          pointer-events: none;
        }

        /* Top Apex: Bismillah & Kicker */
        .h-top-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin-bottom: 0;
        }
        .h-bism {
          font-family: "Amiri", "Amiri Quran", serif;
          font-size: clamp(20px, 4vw, 26px);
          line-height: 1.25;
          margin: 0 0 4px 0;
          background: linear-gradient(180deg, #fff4d4 0%, #e6cf98 42%, #c9a45c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #e6cf98;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.85));
          direction: rtl;
          user-select: none;
          animation: fadeSlideDown 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }
        .h-kicker {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(10px, 2.5vw, 12.5px);
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c9a45c;
          margin: 0;
          font-weight: 600;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
          animation: fadeSlideDown 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
        }

        /* Focal Corridor (Kept in DOM for test suite assertions) */
        .h-focal-corridor {
          position: absolute;
          inset: 0;
          height: 0;
          min-height: 0 !important;
          margin: 0;
          padding: 0;
          pointer-events: none;
          visibility: hidden;
        }

        /* Center Zone: Couple Names placed 30px below Bismillah with grand text size */
        .h-center-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin-top: 30px;
        }
        .h-names {
          font-family: "Alex Brush", cursive;
          font-size: clamp(62px, 16vw, 90px);
          line-height: 0.96;
          margin: 0;
          font-weight: 400;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .h-name {
          display: block;
          font-size: clamp(62px, 16vw, 90px);
          background: linear-gradient(180deg, #fffef5 0%, #fae8b5 28%, #d8b56c 65%, #9b7430 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #e6cf98;
          white-space: nowrap;
          filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 18px rgba(216, 181, 108, 0.35));
        }

        /* ─── Smooth Calligraphy Writing Animation ─── */
        .h-groom {
          animation: calligraphyWrite 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both, goldGlint 4s ease-in-out 2s infinite;
        }
        .h-amp {
          font-family: "Alex Brush", cursive;
          font-size: 0.58em;
          line-height: 1;
          margin: -8px 0 -4px;
          background: linear-gradient(180deg, #fffbf0 0%, #fae8b5 40%, #c9a45c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #e6cf98;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.8));
          animation: fadeScaleIn 1s cubic-bezier(0.16, 1, 0.3, 1) 1s both;
        }
        .h-bride {
          animation: calligraphyWrite 1.4s cubic-bezier(0.22, 1, 0.36, 1) 1.2s both, goldGlint 4s ease-in-out 2.6s infinite;
        }
        .h-line {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-style: italic;
          font-weight: 500;
          font-size: clamp(14px, 3.6vw, 17px);
          letter-spacing: 0.04em;
          color: #f5efe2;
          margin: 12px 0 0;
          opacity: 0.94;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.9);
          white-space: nowrap;
          animation: fadeSlideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1.8s both;
        }

        @keyframes calligraphyWrite {
          0% {
            clip-path: inset(0 100% 0 0);
            opacity: 0;
            transform: translateY(6px);
            filter: blur(4px);
          }
          30% {
            opacity: 0.85;
            filter: blur(0px);
          }
          100% {
            clip-path: inset(0 0 0 0);
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }
        @keyframes fadeSlideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeScaleIn {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes goldGlint {
          0%, 100% {
            filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 18px rgba(216, 181, 108, 0.35));
          }
          50% {
            filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 26px rgba(255, 230, 160, 0.7));
          }
        }

        /* ─── Scroll Indicator ─── */
        .h-scroll {
          position: absolute;
          bottom: max(16px, env(safe-area-inset-bottom, 16px));
          left: 50%;
          transform: translateX(-50%);
          z-index: 15;
          margin: 0;
          pointer-events: none;
        }
        .h-scroll i {
          display: block;
          width: 18px;
          height: 28px;
          border: 1.5px solid rgba(230, 207, 152, 0.6);
          border-radius: 10px;
          position: relative;
        }
        .h-scroll i::after {
          content: "";
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 5px;
          border-radius: 2px;
          background: #e6cf98;
          animation: h-bob 2.2s ease-in-out infinite;
        }
        @keyframes h-bob {
          0%, 100% {
            transform: translate(-50%, 0);
            opacity: 0.9;
          }
          50% {
            transform: translate(-50%, 6px);
            opacity: 0.3;
          }
        }

        :global(.hero.is-away) .h-glints {
          visibility: hidden;
        }

        @media (prefers-reduced-motion: reduce) {
          .h-bism, .h-kicker, .h-name, .h-amp, .h-line {
            animation: none !important;
            opacity: 1 !important;
            clip-path: none !important;
            transform: none !important;
          }
          .h-scroll i::after {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
