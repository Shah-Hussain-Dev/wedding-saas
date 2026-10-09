"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/** Cinematic timeline (seconds) */
const T = {
  rod: 0.35,
  brand: 1.15,
  divider1: 2.35,
  welcome: 2.75,
  divider2: 4.05,
  tagline: 4.45,
  textFade: 5.65,
  curtains: 6.0,
  exit: 9.2,
} as const;

const CURTAIN_DURATION_S = 2.5;
const DURATION_MS = T.exit * 1000;

const STAGE = "#000000";
const CURTAIN_LEFT = "#6e0d1d";
const CURTAIN_RIGHT = "#5a0a17";
const EASE = [0.32, 0.72, 0, 1] as const;
const CURTAIN_EASE = [0.77, 0, 0.175, 1] as const;

const curtainTexture = `
  radial-gradient(circle at 50% 0%, rgba(255,255,255,0.14), transparent 58%),
  repeating-linear-gradient(
    to right,
    rgba(0,0,0,0.55) 0px,
    rgba(0,0,0,0.2) 18px,
    rgba(232,197,122,0.08) 36px,
    rgba(0,0,0,0.35) 54px
  )
`;

function LoaderContent() {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center overflow-hidden pointer-events-auto"
      style={{ zIndex: 99999 }}
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        filter: "blur(18px) brightness(1.2)",
        transition: { duration: 1.1, ease: EASE },
      }}
      aria-live="polite"
      aria-label="Welcome"
    >
      {/* Stage — starts dark, spotlight blooms before copy */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_65%)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 2.2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,197,122,0.07),transparent_55%)]"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: T.brand - 0.3, duration: 1.8, ease: "easeOut" }}
        />
      </div>

      {/* Black backdrop — fades as curtains open */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: STAGE }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: T.curtains + 0.5, duration: 1.6, ease: "easeOut" }}
        aria-hidden
      />

      {/* Curtains — closed until copy has been read */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: "-102%" }}
        transition={{ duration: CURTAIN_DURATION_S, ease: CURTAIN_EASE, delay: T.curtains }}
        className="absolute left-0 top-0 z-20 h-full w-[51%] will-change-transform"
        style={{
          backgroundColor: CURTAIN_LEFT,
          backgroundImage: curtainTexture,
          boxShadow: "40px 0 120px rgba(0,0,0,0.92)",
        }}
        aria-hidden
      >
        <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-black/75 to-transparent" />
      </motion.div>

      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: "102%" }}
        transition={{ duration: CURTAIN_DURATION_S, ease: CURTAIN_EASE, delay: T.curtains }}
        className="absolute right-0 top-0 z-20 h-full w-[51%] will-change-transform"
        style={{
          backgroundColor: CURTAIN_RIGHT,
          backgroundImage: curtainTexture,
          boxShadow: "-40px 0 120px rgba(0,0,0,0.92)",
        }}
        aria-hidden
      >
        <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-black/75 to-transparent" />
      </motion.div>

      {/* Curtain rod */}
      <motion.div
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -56, opacity: 0 }}
        transition={{ delay: T.rod, duration: 0.9, ease: EASE }}
        className="absolute top-0 left-0 right-0 z-40 h-4 shadow-[0_10px_30px_rgba(0,0,0,0.85)]"
        style={{ background: "linear-gradient(to bottom, #f5d27a, #c59b27, #8a6d3b)" }}
        aria-hidden
      >
        <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
      </motion.div>

      {/* Welcome copy — each line staged; fades before curtains pull */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: T.textFade, duration: 0.55, ease: "easeIn" }}
        className="relative z-30 px-6 text-center"
      >
        <motion.p
          initial={{ y: 48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: T.brand, duration: 1.1, ease: EASE }}
          className="font-serif text-5xl tracking-tight text-white drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)] md:text-7xl"
        >
          wedinvites
        </motion.p>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: T.divider1, duration: 0.9, ease: EASE }}
          className="mx-auto my-6 h-0.5 max-w-[240px] origin-center bg-gradient-to-r from-transparent via-[#e8c57a] to-transparent md:max-w-[300px]"
          aria-hidden
        />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: T.welcome, duration: 1.2, ease: EASE }}
          className="font-serif text-5xl font-normal text-[#e8c57a] md:text-7xl"
          style={{
            textShadow: "0 4px 12px rgba(0,0,0,0.55), 0 0 40px rgba(232,197,122,0.35)",
          }}
        >
          Welcome
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: T.divider2, duration: 0.9, ease: EASE }}
          className="mx-auto my-6 h-0.5 max-w-[240px] origin-center bg-gradient-to-r from-transparent via-[#e8c57a]/80 to-transparent md:max-w-[300px]"
          aria-hidden
        />

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 0.88, y: 0 }}
          transition={{ delay: T.tagline, duration: 1, ease: EASE }}
          className="text-[10px] font-medium uppercase italic tracking-[0.3em] text-[#c9b896] md:text-xs md:tracking-[0.38em]"
        >
          Digital invitations atelier
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export function CurtainLoader() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (prefersReducedMotion) return;

    setIsVisible(true);
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      setIsVisible(false);
    }, DURATION_MS);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [prefersReducedMotion]);

  const handleExitComplete = () => {
    document.body.style.overflow = "";
  };

  if (!mounted || prefersReducedMotion) return null;

  return createPortal(
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && <LoaderContent />}
    </AnimatePresence>,
    document.body
  );
}
