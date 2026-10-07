"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkle,
  MusicNotes,
  Clock,
  MapPin,
  Heart,
  ArrowRight,
  Crown,
  MoonStars,
  FlowerLotus,
  Eye,
  CheckCircle,
  SpeakerHigh,
} from "@phosphor-icons/react";

interface ThemePreset {
  id: string;
  name: string;
  tagline: string;
  category: string;
  bgImage: string;
  gradientOverlay: string;
  accentGold: string;
  ambientGlow: string;
  musicTrack: string;
  venueDefault: string;
  badge: string;
  fontClass: string;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: "celestial-rose",
    name: "Celestial Rose",
    tagline: "Starlight Terrace & Ethereal Zero-G",
    category: "Universal / Celestial",
    bgImage: "/templates/imperial-palace/art-gallery.jpg",
    gradientOverlay: "from-[#0d1b2a]/90 via-[#1b263b]/70 to-[#0d1b2a]/95",
    accentGold: "#E1C98E",
    ambientGlow: "rgba(88, 152, 184, 0.35)",
    musicTrack: "Celestial Starlight Harp Score",
    venueDefault: "The Starlight Observatory, Lake Como",
    badge: "Awwwards 3D",
    fontClass: "font-serif",
  },
  {
    id: "imperial-palace",
    name: "Imperial Palace",
    tagline: "Monumental Double Doors & 24K Gold Inlay",
    category: "Royal Indian & European",
    bgImage: "/templates/imperial-palace/ballroom.jpg",
    gradientOverlay: "from-[#2b080c]/90 via-[#3d0f14]/65 to-[#1a0507]/95",
    accentGold: "#C8A45E",
    ambientGlow: "rgba(184, 151, 115, 0.4)",
    musicTrack: "Imperial Royal String Quartet",
    venueDefault: "The Taj Lake Palace, Udaipur",
    badge: "Royal Signature",
    fontClass: "font-serif",
  },
  {
    id: "noor-e-nikah",
    name: "Noor-e-Nikah",
    tagline: "3D Embossed Floral Envelope & Gold Arch",
    category: "Sacred Nikah / Islamic",
    bgImage: "/templates/noor-e-nikah/envelope-bg.jpg",
    gradientOverlay: "from-[#07241d]/90 via-[#0d3b30]/65 to-[#041612]/95",
    accentGold: "#C8A45E",
    ambientGlow: "rgba(200, 164, 94, 0.45)",
    musicTrack: "Ottoman Oud & Acoustic Serenade",
    venueDefault: "Emirates Palace Grand Ballroom, Abu Dhabi",
    badge: "Sacred Nikah",
    fontClass: "font-serif",
  },
  {
    id: "royal-majesty",
    name: "Royal Majesty",
    tagline: "French Château Ballroom & Chandeliers",
    category: "French Château & Regency",
    bgImage: "/templates/imperial-palace/doors-hero.jpg",
    gradientOverlay: "from-[#141d26]/90 via-[#233140]/65 to-[#0e141a]/95",
    accentGold: "#B7A16E",
    ambientGlow: "rgba(169, 193, 208, 0.35)",
    musicTrack: "Viennese Waltz in D Major",
    venueDefault: "Château de Chantilly, Paris",
    badge: "Château Luxe",
    fontClass: "font-serif",
  },
];

export function InteractiveCustomizerDemo() {
  const [groomName, setGroomName] = useState("Aarav");
  const [brideName, setBrideName] = useState("Zara");
  const [weddingDate, setWeddingDate] = useState("November 28, 2026");
  const [weddingVenue, setWeddingVenue] = useState("The Taj Lake Palace, Udaipur");
  const [selectedPreset, setSelectedPreset] = useState<ThemePreset>(THEME_PRESETS[1]); // Imperial Palace
  const [religion, setReligion] = useState<"universal" | "hindu" | "muslim">("universal");

  const groomInitial = (groomName.trim()[0] || "A").toUpperCase();
  const brideInitial = (brideName.trim()[0] || "Z").toUpperCase();

  const handlePresetSelect = (preset: ThemePreset) => {
    setSelectedPreset(preset);
    setWeddingVenue(preset.venueDefault);
  };

  return (
    <section className="py-20 sm:py-28 md:py-32 bg-[#F7F4ED] border-y border-[#073D31]/10 relative overflow-hidden transition-colors duration-1000 select-none">
      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none opacity-40 transition-all duration-1000"
        style={{ backgroundColor: selectedPreset.ambientGlow }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#C8A45E_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.12] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#073D31] font-bold font-sans backdrop-blur-md">
            <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
            <span>Live Interactive Studio</span>
            <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#18211E]">
            Watch your story transform in real time.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#76766F] font-sans leading-relaxed">
            Type your names, choose a royal atmosphere, and watch the interactive masterwork adapt instantaneously.
          </p>
        </div>

        {/* Customization Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Controls Panel (Left 5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-[28px] bg-white/90 border border-[#073D31]/15 shadow-[0_20px_50px_rgba(7,61,49,0.08)] backdrop-blur-xl space-y-5">
            {/* Panel Title & Monogram Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-[#073D31]/10">
              <div>
                <span className="text-[9.5px] font-bold tracking-widest text-[#C8A45E] uppercase font-sans">
                  Studio Configurator
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#073D31]">
                  Personalize Live Card
                </h3>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#073D31] text-[#E1C98E] font-serif text-xs font-bold flex items-center justify-center border border-[#C8A45E]/40 shadow-xs">
                {groomInitial}&amp;{brideInitial}
              </div>
            </div>

            {/* Couple Names Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans flex items-center gap-1">
                  <span>Groom&apos;s Name</span>
                </label>
                <input
                  type="text"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  placeholder="Groom"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50/80 border border-stone-200 text-xs font-semibold text-[#18211E] outline-none focus:border-[#C8A45E] focus:bg-white focus:ring-2 focus:ring-[#C8A45E]/20 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans flex items-center gap-1">
                  <span>Bride&apos;s Name</span>
                </label>
                <input
                  type="text"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  placeholder="Bride"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50/80 border border-stone-200 text-xs font-semibold text-[#18211E] outline-none focus:border-[#C8A45E] focus:bg-white focus:ring-2 focus:ring-[#C8A45E]/20 transition-all"
                />
              </div>
            </div>

            {/* Wedding Date & Venue */}
            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans">
                  Wedding Date
                </label>
                <input
                  type="text"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50/80 border border-stone-200 text-xs font-semibold text-[#18211E] outline-none focus:border-[#C8A45E] focus:bg-white focus:ring-2 focus:ring-[#C8A45E]/20 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans">
                  Palace / Venue Destination
                </label>
                <input
                  type="text"
                  value={weddingVenue}
                  onChange={(e) => setWeddingVenue(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50/80 border border-stone-200 text-xs font-semibold text-[#18211E] outline-none focus:border-[#C8A45E] focus:bg-white focus:ring-2 focus:ring-[#C8A45E]/20 transition-all"
                />
              </div>
            </div>

            {/* Theme Presets Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans">
                Atmosphere &amp; World Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {THEME_PRESETS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between gap-1 ${
                        isSelected
                          ? "bg-[#073D31] text-[#F7F4ED] border-[#C8A45E]/70 shadow-md scale-[1.02]"
                          : "bg-stone-50/70 hover:bg-stone-100/90 text-stone-700 border-stone-200/80"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-serif">{preset.name}</span>
                        {isSelected && <CheckCircle size={13} weight="fill" className="text-[#E1C98E]" />}
                      </div>
                      <span className={`text-[9px] font-sans truncate ${isSelected ? "text-stone-300" : "text-stone-500"}`}>
                        {preset.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sacred Invocations */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans">
                Sacred Invocation &amp; Blessing
              </label>
              <div className="flex gap-2">
                {(["universal", "hindu", "muslim"] as const).map((f) => {
                  const isActive = religion === f;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setReligion(f)}
                      className={`flex-1 py-1.5 rounded-xl text-[11px] font-semibold capitalize transition-all cursor-pointer border flex items-center justify-center gap-1 ${
                        isActive
                          ? "bg-[#C8A45E] text-white border-[#C8A45E] shadow-xs"
                          : "bg-stone-50/80 text-stone-600 border-stone-200/80 hover:bg-stone-100"
                      }`}
                    >
                      {f === "universal" && <Sparkle size={11} weight="fill" />}
                      {f === "hindu" && <FlowerLotus size={11} weight="fill" />}
                      {f === "muslim" && <MoonStars size={11} weight="fill" />}
                      <span>{f}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <Link
                href={`/preview/${selectedPreset.id}`}
                className="group w-full py-3 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs font-bold tracking-wider uppercase font-sans flex items-center justify-center gap-2 transition-all shadow-[0_10px_25px_rgba(7,61,49,0.25)] hover:shadow-[0_15px_35px_rgba(7,61,49,0.38)] cursor-pointer"
              >
                <span className="roll">
                  <span className="roll__a">Experience This Masterpiece</span>
                  <span className="roll__b" aria-hidden="true">Experience This Masterpiece</span>
                </span>
                <ArrowRight size={13} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Live Phone Mockup Preview (Right 7 Cols) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-[310px] sm:max-w-[350px] aspect-[9/18] rounded-[38px] sm:rounded-[44px] bg-[#18211E] p-2.5 sm:p-3 border-[3px] border-[#C8A45E]/50 shadow-[0_30px_70px_rgba(7,61,49,0.35)] select-none transition-all duration-700">
              {/* Dynamic Island / Camera Notch */}
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-30 flex items-center justify-end px-2 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#073D31] ring-1 ring-white/20" />
              </div>

              {/* Screen Interior */}
              <div className="relative w-full h-full rounded-[30px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between p-4 sm:p-5 text-center transition-all duration-700">
                {/* Visual Background Artwork */}
                <div className="absolute inset-0 w-full h-full">
                  <div
                    className="w-full h-full bg-cover bg-center brightness-[0.88] contrast-[1.08] transition-all duration-1000 scale-105"
                    style={{ backgroundImage: `url(${selectedPreset.bgImage})` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-b ${selectedPreset.gradientOverlay}`} />
                  {/* Subtle Shimmer Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,164,94,0.18)_0%,transparent_70%)]" />
                </div>

                {/* Top Section: Sacred Invocation Header */}
                <div className="relative z-20 pt-6 space-y-1">
                  <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.25em] uppercase text-[#E1C98E] font-sans drop-shadow-md">
                    {religion === "hindu"
                      ? "॥ ॐ श्री गणेशाय नमः ॥"
                      : religion === "muslim"
                      ? "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
                      : "TOGETHER WITH THEIR FAMILIES"}
                  </span>
                  <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C8A45E] to-transparent mx-auto" />
                </div>

                {/* Center Section: Royal Monogram & Monumental Couple Names */}
                <div className="relative z-20 my-auto py-2 flex flex-col items-center gap-2">
                  {/* Ornate Gold Monogram Seal */}
                  <div className="w-11 h-11 rounded-full bg-black/40 border border-[#C8A45E] shadow-[0_0_15px_rgba(200,164,94,0.4)] backdrop-blur-md flex items-center justify-center text-[#E1C98E] font-serif text-sm font-bold">
                    <span>{groomInitial}</span>
                    <span className="text-[10px] text-[#C8A45E]/80 mx-0.5">&amp;</span>
                    <span>{brideInitial}</span>
                  </div>

                  {/* Couple Names */}
                  <div className="space-y-0.5">
                    <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#F7F4ED] drop-shadow-md">
                      {groomName || "Groom"}
                    </h2>
                    <span className="font-serif text-lg block italic text-[#E1C98E]">
                      and
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#F7F4ED] drop-shadow-md">
                      {brideName || "Bride"}
                    </h2>
                  </div>

                  {/* Frosted Pedestal Card: Date & Venue */}
                  <div className="mt-2 w-full max-w-[220px] p-2 sm:p-2.5 rounded-2xl bg-black/55 backdrop-blur-md border border-[#C8A45E]/40 shadow-lg flex flex-col gap-1 text-[9px] text-[#F7F4ED] font-sans">
                    <div className="flex items-center justify-center gap-1 text-[#E1C98E] font-semibold">
                      <Clock size={11} weight="bold" />
                      <span>{weddingDate}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-stone-300 text-[8.5px] truncate px-1">
                      <MapPin size={10} weight="fill" className="text-[#C8A45E] shrink-0" />
                      <span className="truncate">{weddingVenue}</span>
                    </div>
                  </div>

                  {/* Interactive Wax Seal Button */}
                  <div className="pt-1">
                    <Link
                      href={`/preview/${selectedPreset.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#073D31]/90 hover:bg-[#073D31] text-[#F7F4ED] text-[8.5px] sm:text-[9.5px] font-bold tracking-wider uppercase border border-[#C8A45E]/70 shadow-md backdrop-blur-md hover:scale-105 transition-all cursor-pointer"
                    >
                      <Eye size={11} weight="bold" className="text-[#E1C98E]" />
                      <span>Open Invitation</span>
                    </Link>
                  </div>
                </div>

                {/* Bottom Section: Live Soundtrack Visualizer */}
                <div className="relative z-20 pb-1">
                  <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[8px] sm:text-[9px] font-sans text-white/90 flex items-center justify-between border border-white/10 shadow-sm">
                    <div className="flex items-center gap-1.5 truncate">
                      <SpeakerHigh size={11} weight="bold" className="text-[#E1C98E] shrink-0" />
                      <span className="truncate text-[8px] text-stone-200">{selectedPreset.musicTrack}</span>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0 pl-1.5">
                      <span className="w-0.5 h-2 bg-[#E1C98E] rounded-full animate-pulse" />
                      <span className="w-0.5 h-3 bg-[#E1C98E] rounded-full animate-pulse delay-75" />
                      <span className="w-0.5 h-1.5 bg-[#E1C98E] rounded-full animate-pulse delay-150" />
                    </div>
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
