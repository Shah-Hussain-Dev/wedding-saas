"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Play, Sparkle } from "@phosphor-icons/react";

export function CinematicFilmCanvas() {
  return (
    <section className="relative w-full min-h-[70vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden bg-black text-white select-none">
      {/* Background Atmospheric Video / Media */}
      <div className="absolute inset-0 w-full h-full">
        <video
          src="/videos/royal-prestige.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover brightness-[0.45] contrast-[1.15]"
        />
        {/* Soft Vignette Shade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(7,61,49,0.3)_0%,transparent_70%)]" />
      </div>

      {/* Centered Editorial Copy */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-4 sm:gap-6 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#C8A45E]/40 backdrop-blur-md text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#E1C98E]">
          <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
          <span>Not a Card · An Experience</span>
          <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
        </div>

        <h2 className="font-serif text-3.5xl sm:text-5.5xl md:text-6.5xl font-medium tracking-tight text-white leading-[1.08]">
          The first moment <br className="hidden sm:inline" />
          of <span className="italic text-[#E1C98E] font-normal underline decoration-[#C8A45E]/50 decoration-1 underline-offset-8">forever</span>.
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-stone-200 max-w-2xl mx-auto font-sans leading-relaxed">
          Before your guests step into the palace, their celebration begins on their screen. 3D double doors open, bespoke music fills the room, and RSVPs fly instantly.
        </p>

        {/* Dual Actions with Roll */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-4 w-full sm:w-auto">
          <Link
            href="/templates"
            className="group w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#C8A45E] hover:bg-[#E1C98E] text-[#032A23] text-xs sm:text-sm font-bold tracking-wider uppercase font-sans transition-all duration-300 shadow-[0_10px_30px_rgba(200,164,94,0.35)] hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="roll">
              <span className="roll__a">Start Your Design</span>
              <span className="roll__b" aria-hidden="true">Start Your Design</span>
            </span>
            <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/about"
            className="group w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs sm:text-sm font-semibold tracking-wider uppercase font-sans backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="roll">
              <span className="roll__a">Our Story &amp; Craft</span>
              <span className="roll__b" aria-hidden="true">Our Story &amp; Craft</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
