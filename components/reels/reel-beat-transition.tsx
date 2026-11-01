"use client";

import { AnimatePresence, motion } from "motion/react";

interface ReelBeatTransitionProps {
  activeIndex: number;
}

/** Brief cinematic wipe between reel beats (reads as a cut, not page scroll). */
export function ReelBeatTransition({ activeIndex }: ReelBeatTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0.35 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 0.2 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0 z-30 bg-[#102A43]"
        aria-hidden
      />
    </AnimatePresence>
  );
}
