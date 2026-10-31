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
      // Zone 0: Upper Muqarnas Dome (55% of particles)
      // Zone 1: Left Pillar (22% of particles)
      // Zone 2: Right Pillar (23% of particles)
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
        // Gentle idle floating around the hanging chandelier
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
            // Horizontal ray
            ctx.moveTo(p.x - starRay, p.y);
            ctx.lineTo(p.x + starRay, p.y);
            // Vertical ray
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
          SACRED APEX & ROMANTIC CENTERPIECE INSIDE THE EMERALD ARCH:
          - Top zone: Sacred Bismillah arch apex & families line
          - Middle zone: Clear corridor ensuring crystal-clear facial and architectural view
          - Centerpiece: Gold-foil couple names & wedding invitation line (Unobscured marble floor)
        */}
        <div className="h-words">
          {/* Top Apex: Sacred Invocations */}
          <div className="h-top-zone">
            <p className="h-bism" lang="ar" aria-label={bismillahAria}>
              {bismillah}
            </p>
            <p className="h-kicker">Together with their families</p>
          </div>

          {/* Middle Focal Corridor: Unobstructed focal clearance corridor */}
          <div className="h-focal-corridor" aria-hidden="true" />

          {/* Couple Names Centerpiece in Alex Brush script without dark background box */}
          <div className="h-bottom-zone">
            <h1 className="h-names" id="heroNames">
              <span className="h-name">{groomName}</span>
              <span className="h-amp">&amp;</span>
              <span className="h-name">{brideName}</span>
            </h1>
            <p className="h-line">invite you to celebrate their wedding</p>
          </div>
        </div>
      </div>

      {/* Pulsating Scroll Indicator */}
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
          width: min(100vw, 480px);
          height: 100svh;
          min-height: 600px;
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

        /* ─── Emerald Arch Text Corridor (Screenshot 2) ─── */
        .h-words {
          position: absolute;
          left: 20%;
          right: 20%;
          top: 33.5%;
          bottom: 18.5%;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          pointer-events: none;
        }

        /* Top Apex: Bismillah & Kicker */
        .h-top-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          padding-top: 2px;
        }
        .h-bism {
          font-family: "Amiri", "Amiri Quran", serif;
          font-size: clamp(22px, 5.5vw, 32px);
          line-height: 1.25;
          margin: 0 0 4px 0;
          background: linear-gradient(180deg, #fff3d1 0%, #e6cf98 42%, #c9a45c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #e6cf98;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.85));
          direction: rtl;
          user-select: none;
        }
        .h-kicker {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(9.5px, 2.3vw, 12px);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c9a45c;
          margin: 0;
          font-weight: 600;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
        }

        /* Middle Focal Corridor */
        .h-focal-corridor {
          flex: 1;
          width: 100%;
          min-height: 40px;
          pointer-events: none;
        }

        /* Bottom Zone: Couple Names Centerpiece (No dark box container!) */
        .h-bottom-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
          background: transparent;
          padding: 0;
        }
        .h-names {
          font-family: "Alex Brush", cursive;
          font-size: clamp(38px, 9.8vw, 58px);
          line-height: 1.1;
          margin: 0;
          font-weight: 400;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 16px rgba(216, 181, 108, 0.35));
        }
        .h-name {
          display: block;
          background: linear-gradient(180deg, #fffef5 0%, #fae8b5 28%, #d8b56c 65%, #9b7430 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #e6cf98;
          white-space: nowrap;
        }
        .h-amp {
          font-family: "Alex Brush", cursive;
          font-size: 0.65em;
          line-height: 1;
          margin: -8px 0 -4px;
          background: linear-gradient(180deg, #fffbf0 0%, #fae8b5 40%, #c9a45c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #e6cf98;
        }
        .h-line {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-style: italic;
          font-weight: 500;
          font-size: clamp(13px, 3.4vw, 16px);
          letter-spacing: 0.04em;
          color: #f5efe2;
          margin: 6px 0 0;
          opacity: 0.94;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.9);
          white-space: nowrap;
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
          .h-scroll i::after {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
