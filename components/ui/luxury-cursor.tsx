"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export function LuxuryCursor() {
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState<"default" | "hover" | "view" | "drag">("default");
  const [isVisible, setIsVisible] = useState(false);
  const isEnteringRef = useRef(true);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 32, stiffness: 450, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop fine-pointer devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Prevent off-screen spring streaks on entry/re-entry
      if (isEnteringRef.current) {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        isEnteringRef.current = false;
      } else {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }

      if (!isVisible) {
        setIsVisible(true);
      }

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

    const handleMouseEnter = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      isEnteringRef.current = false;
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      isEnteringRef.current = true;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, cursorX, cursorY, isVisible]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Subtle Ambient cursor light glow */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(200,164,94,0.06)_0%,transparent_70%)] blur-2xl pointer-events-none"
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
          scale: cursorVariant === "view" || cursorVariant === "drag" ? 1 : cursorVariant === "hover" ? 1.3 : 1,
          width: cursorVariant === "view" || cursorVariant === "drag" ? 54 : cursorVariant === "hover" ? 24 : 8,
          height: cursorVariant === "view" || cursorVariant === "drag" ? 54 : cursorVariant === "hover" ? 24 : 8,
          backgroundColor:
            cursorVariant === "view" || cursorVariant === "drag"
              ? "rgba(7, 61, 49, 0.9)"
              : cursorVariant === "hover"
              ? "rgba(200, 164, 94, 0.2)"
              : "rgba(7, 61, 49, 0.85)",
          borderColor:
            cursorVariant === "view" || cursorVariant === "drag"
              ? "rgba(225, 201, 142, 0.9)"
              : cursorVariant === "hover"
              ? "rgba(200, 164, 94, 0.85)"
              : "rgba(200, 164, 94, 0)",
        }}
        transition={{ type: "spring", stiffness: 450, damping: 32 }}
        className="rounded-full flex items-center justify-center border shadow-xs backdrop-blur-[2px] pointer-events-none"
      >
        {cursorText && (
          <span className="text-[8.5px] font-bold tracking-widest text-[#F7F4ED] font-sans">
            {cursorText}
          </span>
        )}
      </motion.div>
    </div>
  );
}

