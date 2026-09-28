"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Sparkle, MusicNotes, Clock, MapPin, Heart, ArrowRight } from "@phosphor-icons/react";

const PRESETS = [
  {
    id: "celestial-rose",
    name: "Celestial Rose",
    bgClass: "from-[#F1E8E1] via-[#E8B8B8]/35 to-[#5898B8]/25",
    accentColor: "#5898B8",
    goldColor: "#C9A46E",
    titleFont: "font-serif",
    music: "Celestial Nightfall Score",
  },
  {
    id: "imperial-palace",
    name: "Imperial Palace",
    bgClass: "from-[#551618]/90 via-[#2C0F0D] to-[#551618]",
    accentColor: "#B89773",
    goldColor: "#D5BA97",
    titleFont: "font-serif",
    darkText: true,
    music: "Royal Palace String Quartet",
  },
  {
    id: "emerald-qasr",
    name: "Emerald Qasr",
    bgClass: "from-[#081F1A] via-[#0F382E] to-[#04120F]",
    accentColor: "#0F382E",
    goldColor: "#C8A45E",
    titleFont: "font-serif",
    darkText: true,
    music: "Ottoman Oud & Acoustic Serenade",
  },
  {
    id: "royal-ivory",
    name: "Royal Ivory",
    bgClass: "from-[#FAF8F5] via-[#F3EDE2] to-[#E5DAC6]",
    accentColor: "#073D31",
    goldColor: "#C8A45E",
    titleFont: "font-serif",
    music: "Acoustic Piano & Flute Waltz",
  },
];

export function InteractiveCustomizerDemo() {
  const [groomName, setGroomName] = useState("Aarav");
  const [brideName, setBrideName] = useState("Zara");
  const [weddingDate, setWeddingDate] = useState("November 28, 2026");
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [religion, setReligion] = useState<"universal" | "hindu" | "muslim">("universal");

  return (
    <section className="py-24 md:py-32 bg-[#EFE9DD]/60 border-y border-[#073D31]/10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#073D31] font-bold font-sans flex items-center justify-center gap-1.5">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            Live Interactive Playground
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#18211E]">
            Watch your story transform in real time.
          </h2>
          <p className="text-sm sm:text-base text-[#76766F] font-sans">
            Type your names, choose a royal atmosphere, and experience instant customization.
          </p>
        </div>

        {/* Customization Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Panel (Left 5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-[0_20px_50px_rgba(7,61,49,0.06)] space-y-6">
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#18211E]">
                Personalize Live Demo
              </h3>

              {/* Couple Names Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans">
                    Groom&apos;s Name
                  </label>
                  <input
                    type="text"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-[#18211E] outline-none focus:border-[#073D31]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans">
                    Bride&apos;s Name
                  </label>
                  <input
                    type="text"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-[#18211E] outline-none focus:border-[#073D31]"
                  />
                </div>
              </div>

              {/* Theme Presets */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans">
                  Atmosphere &amp; Color Scheme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPreset(preset)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer border ${
                        selectedPreset.id === preset.id
                          ? "bg-[#073D31] text-white border-[#073D31] shadow-xs"
                          : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Faith Invocations */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans">
                  Blessing &amp; Invocation
                </label>
                <div className="flex gap-2">
                  {(["universal", "hindu", "muslim"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setReligion(f)}
                      className={`flex-1 py-1.5 rounded-xl text-[11px] font-semibold capitalize transition-all cursor-pointer border ${
                        religion === f
                          ? "bg-[#C8A45E] text-white border-[#C8A45E]"
                          : "bg-stone-50 text-stone-600 border-stone-200"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/templates"
                className="w-full py-3 rounded-full bg-[#073D31] hover:bg-[#032A23] text-white text-xs font-bold tracking-wider uppercase font-sans flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Choose This Theme</span>
                <ArrowRight size={13} weight="bold" />
              </Link>
            </div>
          </div>

          {/* Live Phone Mockup Preview (Right 7 Cols) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] rounded-[2.5rem] bg-[#18211E] p-3.5 border-4 border-stone-800 shadow-[0_25px_60px_rgba(0,0,0,0.3)] select-none">
              {/* Camera Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/60 rounded-full z-20 backdrop-blur-md" />

              {/* Screen Interior */}
              <div
                className={`relative w-full h-full rounded-[2rem] overflow-hidden bg-gradient-to-br ${selectedPreset.bgClass} flex flex-col justify-between p-6 text-center transition-all duration-700`}
              >
                {/* Invocation Header */}
                <div className="pt-8 space-y-1">
                  <span
                    className={`text-[9px] font-bold tracking-[0.25em] uppercase font-sans ${
                      selectedPreset.darkText ? "text-[#E1C98E]" : "text-[#073D31]"
                    }`}
                  >
                    {religion === "hindu"
                      ? "॥ ॐ श्री गणेशाय नमः ॥"
                      : religion === "muslim"
                      ? "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
                      : "TOGETHER UNDER THE SAME SKY"}
                  </span>
                </div>

                {/* Couple Monumental Typography */}
                <div className="my-auto space-y-2">
                  <h2
                    className={`font-serif text-3xl sm:text-4xl font-normal leading-tight drop-shadow-sm ${
                      selectedPreset.darkText ? "text-[#F7F4ED]" : "text-[#18211E]"
                    }`}
                  >
                    {groomName || "Groom"}
                  </h2>
                  <span
                    className="font-serif text-2xl block italic"
                    style={{ color: selectedPreset.goldColor }}
                  >
                    &amp;
                  </span>
                  <h2
                    className={`font-serif text-3xl sm:text-4xl font-normal leading-tight drop-shadow-sm ${
                      selectedPreset.darkText ? "text-[#F7F4ED]" : "text-[#18211E]"
                    }`}
                  >
                    {brideName || "Bride"}
                  </h2>

                  <div className="pt-3">
                    <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/70 backdrop-blur-md text-[10px] font-bold font-sans text-stone-800 border border-black/5 shadow-xs">
                      <Clock size={12} weight="bold" className="text-[#C8A45E]" />
                      <span>{weddingDate}</span>
                    </div>
                  </div>
                </div>

                {/* Soundtrack Indicator */}
                <div className="pb-2">
                  <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-[9px] font-sans text-white/90 flex items-center justify-center gap-1.5 border border-white/10">
                    <MusicNotes size={12} weight="bold" className="text-[#E1C98E]" />
                    <span className="truncate">{selectedPreset.music}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
