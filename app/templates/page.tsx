"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { GlassNav } from "@/components/ui/glass-nav";
import { PremiumFooter } from "@/components/ui/premium-footer";
import { LuxuryCursor } from "@/components/ui/luxury-cursor";
import { Sparkle, ArrowUpRight, MusicNotes, Play, Eye, ShieldCheck, Heart, MoonStars } from "@phosphor-icons/react";

const FILTERS = [
  { id: "All", label: "All Masterpieces" },
  { id: "Universal", label: "✦ Universal Themes" },
  { id: "Hindu", label: "🕉️ Hindu Weddings" },
  { id: "Muslim", label: "🌙 Muslim Weddings" },
  { id: "Best Sellers", label: "⭐ Best Sellers" },
  { id: "New", label: "✨ New Releases" },
] as const;

const TEMPLATES = [
  {
    id: "celestial-rose",
    name: "Celestial Rose Dreamscape",
    style: "Celestial Rose & Ethereal Starlight",
    tag: "Awwwards Dreamscape",
    religion: ["hindu", "muslim", "universal"],
    religionLabel: "Universal",
    colors: "Blush Rose + Celestial Blue + Champagne",
    opening: "Celestial Rose Terrace Video",
    desc: "A transcendent Awwwards-level dreamscape. Features celestial rose terrace video, multi-layer depth stack with pointer lerp parallax, orbital countdown, pinned constellation story, and wish-upon-a-star RSVP flight animation.",
    gradient: "from-[#5898B8] via-[#E8B8B8] to-[#F1E8E1]",
    video: "/videos/royal-prestige.mp4",
  },
  {
    id: "imperial-palace",
    name: "Imperial Palace",
    style: "Grand European & Royal Indian Palace",
    tag: "Masterpiece",
    religion: ["hindu", "muslim", "universal"],
    religionLabel: "Universal",
    colors: "Burgundy + Palace Ivory + Antique Gold",
    opening: "3D Monumental Palace Doors",
    desc: "Monumental 3D carved double walnut doors opening into an imperial palace staircase with crystal chandeliers, velvet transitions, gold foil scratch reveal, and royal art gallery.",
    gradient: "from-[#551618] via-[#E5D8C4] to-[#B89773]",
    image: "/templates/imperial-palace/ballroom.jpg",
  },
  {
    id: "royal-majesty",
    name: "Royal Majesty",
    style: "French Château & Regency Ballroom",
    tag: "New",
    religion: ["hindu", "muslim", "universal"],
    religionLabel: "Universal",
    colors: "Powder Blue + Pearl Ivory + Gold",
    opening: "Regency Ballroom Video",
    desc: "Enchanted French Château ballroom & starlit lake video reveal with crystal chandeliers, powder-blue hydrangea garlands, and 3D Rococo horizon gallery.",
    gradient: "from-[#A9C1D0] via-[#EBECE8] to-[#B7A16E]",
    video: "/videos/royal-majesty.mp4",
  },
  {
    id: "royal-heritage",
    name: "Royal Heritage",
    style: "Powder Blue & Coral Floral Arch",
    tag: "New",
    religion: ["hindu", "muslim", "universal"],
    religionLabel: "Universal",
    colors: "Powder Blue + Warm Ivory + Coral",
    opening: "Mediterranean Arch Video",
    desc: "Sun-kissed Mediterranean arched doorway & blooming coral bougainvillea cinematic video reveal with 3D panoramic arch photo horizon and ceremony portals.",
    gradient: "from-[#77A3AE] via-[#E8E3D9] to-[#D95147]",
    video: "/videos/royal-heritage.mp4",
  },
  {
    id: "royal-grace",
    name: "Royal Grace",
    style: "Botanical Velvet & Gold",
    tag: "New",
    religion: ["hindu", "muslim", "universal"],
    religionLabel: "Universal",
    colors: "Sage Green + Antique Gold",
    opening: "Cinematic Gate Opening",
    desc: "Enchanted botanical velvet gate opening video synchronized at 6s, 24K antique gold filigree, multi-axis parallax glasshouse palace, scratch date reveal, and 3D scattered memories reel.",
    gradient: "from-[#0e1713] via-[#1b2d24] to-[#121c17]",
    video: "/videos/royal-grace.mp4",
  },
  {
    id: "rose-gold-blush",
    name: "Rose Gold Blush Royal",
    style: "Rose Gold & Blush Parchment",
    tag: "New",
    religion: ["hindu", "muslim", "universal"],
    religionLabel: "Universal",
    colors: "Rose Gold + Blush Parchment",
    opening: "Cinematic Video Opening",
    desc: "Timeless dual-faith celebration with high-definition envelope opening video, Vedic & Islamic blessings, and scratch reveal card.",
    gradient: "from-[#F7EEE9] via-[#F3E9E2] to-[#E2DACF]",
    video: "/videos/rose-gold-blush.mp4",
  },
  {
    id: "noor-e-nikah",
    name: "Noor-e-Nikah",
    style: "Sacred Elegance",
    tag: "Featured",
    religion: ["muslim"],
    religionLabel: "Muslim",
    colors: "Ivory + 24K Gold",
    opening: "3D Floral Envelope",
    desc: "Sacred Islamic wedding experience with 3D embossed floral envelope, slow-lighting gold wax seal, grand mosque archway portal, and Nikah timeline.",
    gradient: "from-[#FAF8F5] via-[#F3EDE2] to-[#E5DAC6]",
    image: "/templates/noor-e-nikah/envelope-bg.jpg",
  },
  {
    id: "emerald-qasr",
    name: "Emerald Qasr",
    style: "Ottoman Royale",
    tag: "New",
    religion: ["muslim"],
    religionLabel: "Muslim",
    colors: "Emerald + 24K Gold",
    opening: "Cinematic Video Opening",
    desc: "Opulent Ottoman palace aesthetic with animated envelope opening video, gold filigree, Ayat Ar-Rum blessings, and scratch reveal.",
    gradient: "from-[#081F1A] via-[#0F382E] to-[#04120F]",
    image: "/templates/emerald-qasr/couple.jpg",
  },
  {
    id: "gul-e-noor",
    name: "Gul-e-Noor",
    style: "Blush Velvet & Rose",
    tag: "New",
    religion: ["muslim"],
    religionLabel: "Muslim",
    colors: "Pastel Rose + Pearl",
    opening: "Cinematic Video Opening",
    desc: "Dreamy blush pink & rose velvet celebration with floating floral envelope opening video, glowing pearl accents, and RSVP.",
    gradient: "from-[#FFF5F7] via-[#FCE8ED] to-[#F5D0DB]",
    image: "/templates/gul-e-noor/couple.jpg",
  },
  {
    id: "azure-nikah",
    name: "Azure Nikah",
    style: "Royal Sapphire",
    tag: "New",
    religion: ["muslim"],
    religionLabel: "Muslim",
    colors: "Midnight Sapphire + Gold",
    opening: "Cinematic Video Opening",
    desc: "Majestic midnight sapphire & celestial gold invitation with envelope opening video, crescent star motifs, and dual photo slider.",
    gradient: "from-[#0A1628] via-[#0F2342] to-[#060D18]",
    image: "/templates/azure-nikah/couple.jpg",
  },
  {
    id: "kitab-e-nikah",
    name: "Kitab-e-Nikah",
    style: "Sacred Velvet & Gold",
    tag: "New",
    religion: ["muslim"],
    religionLabel: "Muslim",
    colors: "Velvet Burgundy + Gold",
    opening: "Cinematic Video Opening",
    desc: "Sacred illuminated Nikah book opening video, ivory parchment texture, gold arabesque borders, and ceremony guide.",
    gradient: "from-[#1F080F] via-[#2F0D17] to-[#120409]",
    image: "/templates/kitab-e-nikah/couple.jpg",
  },
  {
    id: "crimson-royale",
    name: "Crimson Royale",
    style: "Royal Court",
    tag: "Trending",
    religion: ["hindu"],
    religionLabel: "Hindu",
    colors: "Crimson Velvet + 24K Gold",
    opening: "3D Split Gate",
    desc: "Regal crimson velvet and 24K gold foil aesthetic with royal gate reveal, interactive scratch card, and shehnai background music.",
    gradient: "from-[#420f18] via-[#7c2c3b] to-[#20050a]",
    image: "/templates/crimson-royale/bg-gate-closed.jpg",
  },
  {
    id: "royal-lotus",
    name: "Royal Lotus",
    style: "Royal Heritage",
    tag: "Best Seller",
    religion: ["hindu"],
    religionLabel: "Hindu",
    colors: "Ivory + 24K Gold + Maroon",
    opening: "3D Palace Gate",
    desc: "Grand Rajasthani palace with ivory canvas, 24K gold filigree, crimson accents, and floating lotus petals.",
    gradient: "from-[#FCF9F2] via-[#F5EFE0] to-[#EBDDC3]",
    image: "/templates/royal-lotus/gate-closed.jpg",
  },
  {
    id: "emerald-noir",
    name: "Emerald Noir",
    style: "Luxury Dark",
    tag: "Best Seller",
    religion: ["hindu", "universal"],
    religionLabel: "Hindu",
    colors: "Emerald + 24K Gold",
    opening: "3D Haveli Gate Reveal",
    desc: "Ornate 24K gold details on rich emerald canvas. 3D Haveli Gate reveal with glowing Ganesha seal, multi-layer parallax, and Muhurat scratch card.",
    gradient: "from-[#081F1A] via-[#0F382E] to-[#04120F]",
    image: "/templates/emerald-noir/gate-closed.jpg",
  },
  {
    id: "royal-elegance",
    name: "Royal Elegance",
    style: "Classic South Asian",
    tag: "Best Seller",
    religion: ["hindu", "universal"],
    religionLabel: "Hindu",
    colors: "Royal Crimson + Gold",
    opening: "Maharani Curtain Reveal",
    desc: "Traditional South Asian grandeur with 3D Maharani Silk Curtains, Royal Kundan Wax Seal, Gauri Ganesh blessings, and interactive scratch reveal.",
    gradient: "from-[#faf7f0] to-[#f0e8d8]",
    video: "/videos/royal-elegance-royal.mp4",
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    style: "Contemporary Chic",
    tag: "New",
    religion: ["hindu", "universal"],
    religionLabel: "Hindu",
    colors: "Warm Champagne + Gold",
    opening: "3D Origami Envelope",
    desc: "Contemporary Vedic luxury with a 3D architectural origami envelope & pure gold monogram seal, multi-layer parallax, and gallery lightbox.",
    gradient: "from-stone-50 to-stone-200",
  },
];

export default function TemplatesPage() {
  const [filter, setFilter] = useState("All");

  const filtered = TEMPLATES.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Universal") return t.religion.includes("universal");
    if (filter === "Hindu") return t.religion.includes("hindu");
    if (filter === "Muslim") return t.religion.includes("muslim");
    if (filter === "Best Sellers") return t.tag === "Best Seller" || t.tag === "Trending" || t.tag === "Masterpiece" || t.tag === "Awwwards Dreamscape";
    if (filter === "New") return t.tag === "New";
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F4ED] text-[#18211E]">
      <LuxuryCursor />
      <GlassNav />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Editorial Catalogue Hero Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#073D31]/10 text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#073D31] uppercase font-sans shadow-xs">
              <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
              Signature Catalogue
              <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#18211E]">
              Select your design.
            </h1>

            <p className="text-sm sm:text-base text-[#76766F] font-sans leading-relaxed max-w-xl mx-auto">
              Each experience is an interactive digital world. Explore live samples with synchronized soundtracks, 3D door reveals, and real-time RSVPs.
            </p>
          </div>

          {/* Filter Bar with Animated Layout */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {FILTERS.map((f) => {
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs font-sans font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#073D31] text-[#F7F4ED] shadow-md scale-[1.02]"
                      : "bg-white hover:bg-stone-50 text-[#76766F] border border-[#073D31]/8"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Template Masterpiece Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4"
          >
            <AnimatePresence>
              {filtered.map((tpl) => (
                <motion.div
                  key={tpl.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-3xl bg-white border border-[#073D31]/10 p-4 sm:p-5 shadow-xs hover:shadow-[0_20px_50px_rgba(7,61,49,0.1)] hover:border-[#C8A45E]/60 transition-all duration-300 flex flex-col justify-between group"
                  data-cursor="view"
                >
                  <div className="space-y-4">
                    {/* Visual Media Box */}
                    <Link href={`/preview/${tpl.id}`} className="block relative aspect-[16/10] rounded-2xl overflow-hidden bg-stone-900 border border-black/5 shadow-inner">
                      {tpl.video ? (
                        <video
                          src={tpl.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : tpl.image ? (
                        <div
                          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                          style={{ backgroundImage: `url(${tpl.image})` }}
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${tpl.gradient} flex items-center justify-center p-4`}
                        >
                          <span className="font-serif text-2xl font-bold text-stone-800">
                            {tpl.name}
                          </span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[9px] font-bold tracking-wider text-[#E1C98E] uppercase">
                          {tpl.tag}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-bold text-[#073D31] uppercase">
                          {tpl.religionLabel}
                        </span>
                      </div>
                    </Link>

                    {/* Metadata Header */}
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#C8A45E] font-sans">
                        {tpl.style}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18211E] group-hover:text-[#073D31] transition-colors">
                        {tpl.name}
                      </h3>
                      <p className="text-xs text-[#76766F] font-sans line-clamp-2 leading-relaxed">
                        {tpl.desc}
                      </p>
                    </div>

                    {/* Feature Details */}
                    <div className="space-y-1.5 py-2 border-t border-stone-100 text-[11px] font-sans text-left">
                      <div className="flex justify-between text-stone-600">
                        <span className="text-stone-400">Opening</span>
                        <span className="font-semibold truncate max-w-[65%]">{tpl.opening}</span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span className="text-stone-400">Palette</span>
                        <span className="font-semibold truncate max-w-[65%]">{tpl.colors}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 flex items-center gap-2.5">
                    <Link
                      href={`/preview/${tpl.id}`}
                      className="flex-1 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[#18211E] text-xs font-bold font-sans text-center transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Sample</span>
                      <ArrowUpRight size={13} weight="bold" />
                    </Link>

                    <Link
                      href={`/customize/${tpl.id}`}
                      className="flex-1 py-2.5 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs font-bold font-sans text-center transition-colors shadow-xs"
                    >
                      Try Free
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <PremiumFooter />
    </div>
  );
}
