"use client";

import React from "react";
import { motion } from "motion/react";
import { Sparkle, Star } from "@phosphor-icons/react";

const STATEMENTS = [
  "NOT A CARD. AN EXPERIENCE.",
  "INTERACTIVE PORTALS",
  "3D LIVING ENVELOPES",
  "SYNCHRONIZED SOUNDTRACKS",
  "CELESTIAL SCRATCH REVEALS",
  "A TOUCH OF IMMORTALITY",
];

export function BrandStatement() {
  return (
    <section className="relative py-12 md:py-16 bg-[#EFE9DD]/60 border-y border-[#073D31]/8 overflow-hidden select-none">
      {/* Background Subtle Paper Texture */}
      <div className="absolute inset-0 paper-texture opacity-60 pointer-events-none" />

      {/* Kinetic Infinite Slow Marquee */}
      <div className="flex overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 32 }}
          className="flex items-center gap-10 sm:gap-16 font-serif text-xl sm:text-2xl md:text-3xl font-normal tracking-wide text-[#073D31]/85"
        >
          {[...STATEMENTS, ...STATEMENTS].map((statement, idx) => (
            <React.Fragment key={idx}>
              <span className="flex items-center gap-4">
                <span className="italic">{statement}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8A45E]" />
              </span>
              <Sparkle size={16} weight="fill" className="text-[#C8A45E] flex-shrink-0" />
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
