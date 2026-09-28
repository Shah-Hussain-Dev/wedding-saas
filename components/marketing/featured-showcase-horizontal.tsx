"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Sparkle, ArrowRight, Play, Eye, MusicNotes, Sparkle as StarIcon } from "@phosphor-icons/react";

const SHOWCASE_TEMPLATES = [
  {
    id: "celestial-rose",
    name: "Celestial Rose Dreamscape",
    category: "Universal & Romantic",
    opening: "Celestial Rose Terrace Video",
    tag: "Awwwards Dreamscape",
    colors: "Blush Rose + Celestial Blue + Champagne",
    description: "An Awwwards-level dreamscape. Features living blue curtains, floating rose petal physics, pinned constellation story, and wish-upon-a-star RSVP flight.",
    video: "/videos/royal-prestige.mp4",
    bleedGlow: "rgba(232, 184, 184, 0.28)",
    ambientClass: "from-[#F7F4ED] via-[#E8B8B8]/15 to-[#F7F4ED]",
    cardBorder: "#5898B8",
  },
  {
    id: "imperial-palace",
    name: "Imperial Palace",
    category: "Grand Royal European & Indian",
    opening: "3D Double Walnut Palace Doors",
    tag: "Masterpiece",
    colors: "Burgundy + Palace Ivory + Antique Gold",
    description: "Monumental carved walnut double doors opening into an imperial staircase with crystal chandeliers, velvet transitions, gold foil scratch reveal, and royal art gallery.",
    image: "/templates/imperial-palace/ballroom.jpg",
    bleedGlow: "rgba(85, 22, 24, 0.22)",
    ambientClass: "from-[#F7F4ED] via-[#551618]/10 to-[#F7F4ED]",
    cardBorder: "#B89773",
  },
  {
    id: "royal-majesty",
    name: "Royal Majesty",
    category: "French Château & Regency Ballroom",
    opening: "Regency Ballroom Video Reveal",
    tag: "New",
    colors: "Powder Blue + Pearl Ivory + Gold",
    description: "Enchanted French Château ballroom & starlit lake video reveal with crystal chandeliers, powder-blue hydrangea garlands, and 3D Rococo horizon gallery.",
    video: "/videos/royal-majesty.mp4",
    bleedGlow: "rgba(169, 193, 208, 0.3)",
    ambientClass: "from-[#F7F4ED] via-[#A9C1D0]/18 to-[#F7F4ED]",
    cardBorder: "#A9C1D0",
  },
  {
    id: "emerald-qasr",
    name: "Emerald Qasr",
    category: "Ottoman Royale & Sacred Nikah",
    opening: "Cinematic Envelope Video Opening",
    tag: "Exclusive",
    colors: "Emerald Velvet + 24K Gold",
    description: "Opulent Ottoman palace aesthetic with animated envelope opening video, gold filigree, Ayat Ar-Rum blessings, and scratch reveal card.",
    image: "/templates/emerald-qasr/couple.jpg",
    bleedGlow: "rgba(8, 31, 26, 0.25)",
    ambientClass: "from-[#F7F4ED] via-[#081F1A]/10 to-[#F7F4ED]",
    cardBorder: "#0F382E",
  },
  {
    id: "noor-e-nikah",
    name: "Noor-e-Nikah",
    category: "Sacred Ivory Elegance",
    opening: "3D Embossed Floral Envelope",
    tag: "Featured",
    colors: "Ivory Silk + 24K Gold Wax Seal",
    description: "Sacred Islamic wedding experience with 3D embossed floral envelope, slow-lighting gold wax seal, grand mosque archway portal, and Nikah timeline.",
    image: "/templates/noor-e-nikah/envelope-bg.jpg",
    bleedGlow: "rgba(200, 164, 94, 0.25)",
    ambientClass: "from-[#F7F4ED] via-[#C8A45E]/12 to-[#F7F4ED]",
    cardBorder: "#C8A45E",
  },
];

export function FeaturedShowcaseHorizontal() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeTemplate = SHOWCASE_TEMPLATES[activeIdx];

  return (
    <section
      id="showcase"
      className="relative py-24 md:py-32 bg-[#F7F4ED] transition-colors duration-1000 overflow-hidden"
    >
      {/* Dynamic Ambient Color Bleed from Active Template */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 blur-3xl opacity-80"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${activeTemplate.bleedGlow} 0%, transparent 75%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#073D31]/10 pb-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#073D31] font-bold font-sans flex items-center gap-1.5">
              <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
              Signature Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#18211E] leading-tight">
              Cinematic worlds, crafted for your ceremony.
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 hover:bg-white text-[#073D31] border border-[#073D31]/15 text-xs font-bold tracking-wider uppercase font-sans shadow-xs transition-all hover:scale-105"
            >
              <span>View All 16 Templates</span>
              <ArrowRight size={13} weight="bold" />
            </Link>
          </div>
        </div>

        {/* Template Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {SHOWCASE_TEMPLATES.map((tpl, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`relative flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-[#073D31] text-[#F7F4ED] shadow-md scale-[1.02]"
                    : "bg-white/80 hover:bg-white text-[#76766F] border border-[#073D31]/8"
                }`}
              >
                <span>0{idx + 1}</span>
                <span>{tpl.name}</span>
              </button>
            );
          })}
        </div>

        {/* Showcase Cinematic Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          {/* Visual Preview Window (Left 7 Cols) */}
          <div className="lg:col-span-7 relative group" data-cursor="view">
            <Link href={`/preview/${activeTemplate.id}`} className="block">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-stone-900 border-2 border-white shadow-[0_25px_60px_rgba(7,61,49,0.18)]">
                {activeTemplate.video ? (
                  <video
                    key={activeTemplate.video}
                    src={activeTemplate.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url(${activeTemplate.image})` }}
                  />
                )}

                {/* Floating Tags Over Preview */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-[10px] font-bold tracking-widest text-[#E1C98E] uppercase">
                    {activeTemplate.tag}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold tracking-wider text-[#073D31] uppercase">
                    {activeTemplate.opening}
                  </span>
                </div>

                {/* Center Hover "View Live Demo" Portal */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="px-6 py-3 rounded-full bg-white/95 text-[#073D31] text-xs font-bold tracking-widest uppercase font-sans shadow-xl flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                    <Eye size={16} weight="bold" />
                    <span>Experience Invitation</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Editorial Details Panel (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C8A45E] font-sans">
                {activeTemplate.category}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#18211E]">
                {activeTemplate.name}
              </h3>
              <p className="text-sm sm:text-base text-[#76766F] font-sans leading-relaxed">
                {activeTemplate.description}
              </p>
            </div>

            {/* Feature Specs */}
            <div className="space-y-3 pt-2 border-t border-[#073D31]/10 text-xs font-sans">
              <div className="flex items-center justify-between py-1.5 border-b border-[#073D31]/5">
                <span className="text-[#76766F]">Palette &amp; Finish</span>
                <span className="font-semibold text-[#18211E]">{activeTemplate.colors}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#073D31]/5">
                <span className="text-[#76766F]">Opening Reveal</span>
                <span className="font-semibold text-[#073D31]">{activeTemplate.opening}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#76766F]">Soundtrack &amp; Haptics</span>
                <span className="font-semibold text-[#18211E] flex items-center gap-1">
                  <MusicNotes size={13} weight="bold" className="text-[#C8A45E]" />
                  Included
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <Link
                href={`/preview/${activeTemplate.id}`}
                className="flex-1 px-6 py-3.5 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs font-bold tracking-wider uppercase font-sans text-center transition-all shadow-md hover:shadow-lg"
              >
                Live Sample
              </Link>
              <Link
                href={`/customize/${activeTemplate.id}`}
                className="flex-1 px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 text-[#073D31] border border-[#073D31]/20 text-xs font-bold tracking-wider uppercase font-sans text-center transition-all"
              >
                Try Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
