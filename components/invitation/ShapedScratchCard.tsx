"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import confetti from "canvas-confetti";
import { Clock, Sparkle } from "@phosphor-icons/react";

interface ShapedScratchCardProps {
  shape?: "heart" | "arch" | "octagon";
  theme?: "emerald" | "crimson" | "champagne";
  dateStr: string;
  dayStr: string;
  yearStr: string;
  timeStr: string;
  badgeText?: string;
  className?: string;
}

export function ShapedScratchCard({
  shape = "heart",
  theme = "crimson",
  dateStr,
  dayStr,
  yearStr,
  timeStr,
  badgeText = "✦ Shubh Vivah Muhurat ✦",
  className = "",
}: ShapedScratchCardProps) {
  const uniqueId = useId().replace(/:/g, "");
  const clipPathId = `scratch-clip-${uniqueId}`;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const isDrawingRef = useRef(false);
  const scratchedPixelsRef = useRef(0);
  const confettiFiredRef = useRef(false);

  const getThemeColors = () => {
    switch (theme) {
      case "emerald":
        return {
          gradient: ["#0a382b", "#d4af37", "#0f4d3c", "#c5a059"],
          border: "#d4af37",
          bgFrom: "from-[#082a1f]",
          bgVia: "via-[#041810]",
          bgTo: "to-[#0a382a]",
          textColor: "text-[#fff2be]",
          subColor: "text-[#a7f3d0]",
          helperColor: "text-[#c5ddd3]",
          badgeBg: "bg-[#d4af37]/25 text-[#fff2be] border-[#d4af37]/50",
          confetti: ["#d4af37", "#34d399", "#ffb703", "#ffffff"],
        };
      case "champagne":
        return {
          gradient: ["#e8dfd8", "#f4ece1", "#d4af37", "#c5a059"],
          border: "#b8860b",
          bgFrom: "from-[#fffdfa]",
          bgVia: "via-[#faf4ec]",
          bgTo: "to-[#f5ede2]",
          textColor: "text-[#b8860b]",
          subColor: "text-[#8c7b64]",
          helperColor: "text-[#8c6d23]",
          badgeBg: "bg-[#d4af37]/20 text-[#8c6d23] border-[#d4af37]/40",
          confetti: ["#d4af37", "#f5d77f", "#333333", "#ffffff"],
        };
      case "crimson":
      default:
        return {
          gradient: ["#4a0e17", "#d4af37", "#7a1c2a", "#c5a059"],
          border: "#d4af37",
          bgFrom: "from-[#fffdfa]",
          bgVia: "via-[#f7eedb]",
          bgTo: "to-[#f4e6cd]",
          textColor: "text-[#5a0e1a]",
          subColor: "text-[#8c5d12]",
          helperColor: "text-[#5a0e1a]",
          badgeBg: "bg-[#5a0e1a] text-[#fff2be] border-[#d4af37]/50",
          confetti: ["#5a0e1a", "#d4af37", "#fcf8f0", "#e63946", "#ffffff"],
        };
    }
  };

  const colors = getThemeColors();

  const getShapeData = () => {
    switch (shape) {
      case "heart":
        return {
          aspectRatio: "aspect-[1/0.95] max-w-[340px] md:max-w-[380px]",
          clipDef: (
            <clipPath id={clipPathId} clipPathUnits="objectBoundingBox">
              <path d="M 0.50,0.88 C 0.22,0.64 0.04,0.46 0.04,0.27 C 0.04,0.13 0.15,0.04 0.28,0.04 C 0.38,0.04 0.45,0.09 0.50,0.17 C 0.55,0.09 0.62,0.04 0.72,0.04 C 0.85,0.04 0.96,0.13 0.96,0.27 C 0.96,0.46 0.78,0.64 0.50,0.88 Z" />
            </clipPath>
          ),
          svgBorder: (
            <svg viewBox="0 0 100 95" className="absolute inset-0 w-full h-full pointer-events-none z-20" fill="none">
              <path
                d="M 50,88 C 22,64 4,46 4,27 C 4,13 15,4 28,4 C 38,4 45,9 50,17 C 55,9 62,4 72,4 C 85,4 96,13 96,27 C 96,46 78,64 50,88 Z"
                stroke={colors.border}
                strokeWidth="2.5"
                className="drop-shadow-[0_4px_10px_rgba(212,175,55,0.5)]"
              />
              <path
                d="M 50,82 C 25,60 9,43 9,28 C 9,16 18,8 29,8 C 38,8 45,13 50,20 C 55,13 62,8 71,8 C 82,8 91,16 91,28 C 91,43 75,60 50,82 Z"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
                strokeDasharray="2.5 2.5"
              />
            </svg>
          ),
          innerPadding: "pt-8 pb-14 px-8",
        };
      case "arch":
        return {
          aspectRatio: "aspect-[4/3] max-w-[380px] md:max-w-[420px]",
          clipDef: (
            <clipPath id={clipPathId} clipPathUnits="objectBoundingBox">
              <path d="M 0.50,0.02 C 0.75,0.08 0.92,0.20 0.98,0.36 L 0.98,0.98 L 0.02,0.98 L 0.02,0.36 C 0.08,0.20 0.25,0.08 0.50,0.02 Z" />
            </clipPath>
          ),
          svgBorder: (
            <svg viewBox="0 0 100 75" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-20" fill="none">
              <path
                d="M 50,2 C 75,8 92,20 98,36 L 98,98 L 2,98 L 2,36 C 8,20 25,8 50,2 Z"
                stroke={colors.border}
                strokeWidth="2.5"
                className="drop-shadow-[0_4px_10px_rgba(212,175,55,0.5)]"
              />
              <path
                d="M 50,6 C 73,11 88,22 94,37 L 94,94 L 6,94 L 6,37 C 12,22 27,11 50,6 Z"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </svg>
          ),
          innerPadding: "pt-10 pb-6 px-8",
        };
      case "octagon":
      default:
        return {
          aspectRatio: "aspect-[16/10] max-w-[400px] md:max-w-[440px]",
          clipDef: (
            <clipPath id={clipPathId} clipPathUnits="objectBoundingBox">
              <polygon points="0.14,0 0.86,0 1,0.16 1,0.84 0.86,1 0.14,1 0,0.84 0,0.16" />
            </clipPath>
          ),
          svgBorder: (
            <svg viewBox="0 0 100 62.5" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-20" fill="none">
              <polygon
                points="14,1.5 86,1.5 98.5,16 98.5,46.5 86,61 14,61 1.5,46.5 1.5,16"
                stroke={colors.border}
                strokeWidth="2"
                className="drop-shadow-[0_4px_10px_rgba(212,175,55,0.4)]"
              />
              <polygon
                points="16,4 84,4 96,17.5 96,45 84,58.5 16,58.5 4,45 4,17.5"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
            </svg>
          ),
          innerPadding: "py-6 px-8",
        };
    }
  };

  const shapeData = getShapeData();

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Metallic Foil Texture
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors.gradient[0]);
    gradient.addColorStop(0.35, colors.gradient[1]);
    gradient.addColorStop(0.7, colors.gradient[2]);
    gradient.addColorStop(1, colors.gradient[3]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Text on Scratch Surface
    ctx.fillStyle = theme === "champagne" ? "#1a1a1a" : "#ffffff";
    ctx.font = "bold 13px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✦ SCRATCH TO REVEAL ✦", width / 2, height / 2 - 4);

    ctx.fillStyle = theme === "champagne" ? "#555555" : "#fff2be";
    ctx.font = "11px Montserrat, sans-serif";
    ctx.fillText("Shubh Vivah Muhurat", width / 2, height / 2 + 15);
  };

  useEffect(() => {
    initCanvas();
  }, [shape, theme]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2, false);
    ctx.fill();

    scratchedPixelsRef.current += 1;
    if (scratchedPixelsRef.current > 35 && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      setIsScratched(true);
      confetti({
        particleCount: 90,
        spread: 85,
        origin: { y: 0.65 },
        colors: colors.confetti,
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  return (
    <div className={`relative mx-auto flex flex-col items-center w-full max-w-lg ${className}`}>
      {/* Hidden SVG Definitions for Responsive ObjectBoundingBox ClipPaths */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>{shapeData.clipDef}</defs>
      </svg>

      {/* 1. Shaped Card Box (Scales 100% Responsively) */}
      <div className={`relative w-full ${shapeData.aspectRatio} mx-auto`}>
        {/* Inner Content Clipped Perfectly to SVG Path */}
        <div
          ref={containerRef}
          style={{ clipPath: `url(#${clipPathId})` }}
          className="relative w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] select-none overflow-hidden"
        >
          {/* Revealed Date/Muhurat Content */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center ${shapeData.innerPadding} bg-gradient-to-br ${colors.bgFrom} ${colors.bgVia} ${colors.bgTo} text-center`}
          >
            <span className={`text-[10px] uppercase tracking-[0.25em] font-bold mb-1 ${colors.subColor}`}>
              {dayStr}
            </span>
            <h3 className={`text-2xl sm:text-3xl md:text-4xl font-cormorant font-bold leading-tight ${colors.textColor}`}>
              {dateStr}, {yearStr}
            </h3>
            <div className={`flex items-center gap-1.5 mt-1.5 text-xs font-semibold ${colors.textColor}`}>
              <Clock size={14} className="text-[#d4af37]" />
              <span>{timeStr}</span>
            </div>
            <span
              className={`mt-2.5 inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-sm ${colors.badgeBg}`}
            >
              {badgeText}
            </span>
          </div>

          {/* Scratch Canvas Overlay */}
          {!isScratched && (
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="scratch-canvas-container absolute inset-0 w-full h-full cursor-crosshair z-10"
            />
          )}
        </div>

        {/* Decorative Gold Border Outline (Pixel-Aligned with ClipPath) */}
        {shapeData.svgBorder}
      </div>

      {/* 2. Helper Text Underneath Card */}
      <div className="mt-5 text-center flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-black/25 backdrop-blur-md border border-[#d4af37]/30 shadow-md">
        <Sparkle size={14} weight="fill" className="text-[#d4af37]" />
        <p className={`text-xs md:text-sm font-medium tracking-wide ${colors.helperColor}`}>
          {isScratched
            ? "Muhurat Revealed! We warmly await your graceful presence."
            : "Swipe or scratch across the card to reveal Shubh Vivah Muhurat."}
        </p>
        <Sparkle size={14} weight="fill" className="text-[#d4af37]" />
      </div>
    </div>
  );
}
