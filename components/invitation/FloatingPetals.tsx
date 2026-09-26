"use client";

import React, { useEffect, useRef } from "react";

interface FloatingPetalsProps {
  theme?: "rose" | "marigold" | "gold-dust" | "lotus";
  density?: number;
  className?: string;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  swayAmplitude: number;
  swayFrequency: number;
  swayOffset: number;
  opacity: number;
  type: "petal" | "sparkle" | "leaf";
  color: string;
}

export function FloatingPetals({
  theme = "rose",
  density = 22,
  className = "",
}: FloatingPetalsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Color palettes based on theme
    const getThemeColors = () => {
      switch (theme) {
        case "marigold":
          return [
            "#ff9900", // Vibrant Marigold Orange
            "#ffb703", // Saffron Yellow
            "#fb8500", // Deep Sunset Marigold
            "#d4af37", // Gold
            "#e63946", // Vermilion Red accent
          ];
        case "gold-dust":
          return [
            "#D7B875", // Champagne Light Gold
            "#C5A46A", // Warm Champagne
            "#F1E9D8", // Moon Ivory
            "#FAF7F0", // Soft Shimmer Ivory
            "#8D5B5C", // Subtle Dusty Rose
          ];
        case "lotus":
          return [
            "#ffb3c6", // Soft Lotus Pink
            "#ff8fab", // Rose Lotus
            "#fb6f92", // Deep Lotus
            "#f4e8c1", // Gold Pollen
            "#ffffff", // Pure White Petal
          ];
        case "rose":
        default:
          return [
            "#c1121f", // Royal Crimson Rose
            "#780000", // Deep Velvet Burgundy
            "#e63946", // Fresh Rose Petal
            "#d4af37", // Gold Shimmer Flake
            "#ff758f", // Blush Rose
          ];
      }
    };

    const colors = getThemeColors();

    // Generate Petals
    const petals: Petal[] = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 12 + 8,
      speedY: Math.random() * 0.8 + 0.4,
      speedX: (Math.random() - 0.5) * 0.4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      swayAmplitude: Math.random() * 25 + 10,
      swayFrequency: Math.random() * 0.015 + 0.005,
      swayOffset: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.4,
      type: Math.random() > 0.25 ? "petal" : "sparkle",
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      petals.forEach((p) => {
        // Physics update
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time * p.swayFrequency + p.swayOffset) * 0.35;
        p.rotation += p.rotationSpeed;

        // Wrap around borders
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        if (p.type === "petal") {
          // Realistic Organic Curved Flower Petal
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, -p.size / 4, p.size, 0);
          ctx.bezierCurveTo(p.size, p.size / 4, p.size / 2, p.size / 2, 0, 0);
          ctx.fill();

          // Subtle inner petal contour line for realistic depth
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else {
          // Shimmering 4-Point Golden Star Sparkle
          ctx.fillStyle = p.color;
          ctx.beginPath();
          const r = p.size / 2.5;
          ctx.moveTo(0, -r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.quadraticCurveTo(0, 0, 0, r);
          ctx.quadraticCurveTo(0, 0, -r, 0);
          ctx.quadraticCurveTo(0, 0, 0, -r);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-20 w-full h-full ${className}`}
    />
  );
}
