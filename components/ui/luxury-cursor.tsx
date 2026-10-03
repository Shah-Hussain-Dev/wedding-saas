"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export function LuxuryCursor() {
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState<"default" | "hover" | "view" | "drag">("default");
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;
      const isInteractive = target.closest("a, button, input, [role='button']");

      if (cursorTarget) {
        const type = cursorTarget.getAttribute("data-cursor");
        if (type === "view") {
          setCursorVariant("view");
          setCursorText("VIEW");
        } else if (type === "drag") {
          setCursorVariant("drag");
          setCursorText("DRAG");
        } else if (type === "explore") {
          setCursorVariant("view");
          setCursorText("EXPLORE");
        }
      } else if (isInteractive) {
        setCursorVariant("hover");
        setCursorText("");
      } else {
        setCursorVariant("default");
        setCursorText("");
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Ambient cursor light glow */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(200,164,94,0.08)_0%,transparent_70%)] blur-2xl pointer-events-none"
      />

      {/* Main Luxury Cursor Ring / Bead */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: cursorVariant === "view" || cursorVariant === "drag" ? 1 : cursorVariant === "hover" ? 1.4 : 1,
          width: cursorVariant === "view" || cursorVariant === "drag" ? 64 : cursorVariant === "hover" ? 28 : 10,
          height: cursorVariant === "view" || cursorVariant === "drag" ? 64 : cursorVariant === "hover" ? 28 : 10,
          backgroundColor:
            cursorVariant === "view" || cursorVariant === "drag"
              ? "rgba(7, 61, 49, 0.92)"
              : cursorVariant === "hover"
              ? "rgba(200, 164, 94, 0.15)"
              : "rgba(7, 61, 49, 1)",
          borderColor:
            cursorVariant === "view" || cursorVariant === "drag"
              ? "rgba(225, 201, 142, 1)"
              : cursorVariant === "hover"
              ? "rgba(200, 164, 94, 1)"
              : "rgba(200, 164, 94, 0)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="rounded-full flex items-center justify-center border shadow-sm backdrop-blur-xs pointer-events-none"
      >
        {cursorText && (
          <span className="text-[9px] font-bold tracking-widest text-[#F7F4ED] font-sans">
            {cursorText}
          </span>
        )}
      </motion.div>
    </div>
  );
}
