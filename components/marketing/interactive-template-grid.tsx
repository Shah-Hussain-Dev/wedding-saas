"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Eye, Heart, Sparkle, Play, CaretRight } from "@phosphor-icons/react";
import { useTemplatePricing } from "@/lib/hooks/use-template-pricing";

interface TemplateItem {
  id: string;
  name: string;
  category: "all" | "royal" | "muslim" | "hindu" | "celestial" | "modern";
  categoryLabel: string;
  style: string;
  price: string;
  tag: string;
  video?: string;
  scenes: {
    title: string;
    image: string;
  }[];
}

const CATALOGUE_TEMPLATES: TemplateItem[] = [
  {
    id: "celestial-rose",
    name: "Celestial Rose Dreamscape",
    category: "celestial",
    categoryLabel: "Universal Celestial",
    style: "Awwwards 3D & Ethereal Starlight",
    price: "₹1,199",
    tag: "Trending 2026",
    video: "/videos/royal-prestige.mp4",
    scenes: [
      { title: "Starlight Terrace Video", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Scratch-the-Stars Reveal", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Orchestral Harp Score", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Wish RSVP Flight", image: "/templates/imperial-palace/ballroom.jpg" },
    ],
  },
  {
    id: "imperial-palace",
    name: "Imperial Palace",
    category: "royal",
    categoryLabel: "Royal Indian & European",
    style: "Grand Palace Doors & Gold Inlay",
    price: "₹1,199",
    tag: "Signature Royale",
    scenes: [
      { title: "3D Double Palace Doors", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Royal Procession Itinerary", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Gold Wax Seal", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "VIP Seating Map", image: "/templates/imperial-palace/ballroom.jpg" },
    ],
  },
  {
    id: "noor-e-nikah",
    name: "Noor-e-Nikah",
    category: "muslim",
    categoryLabel: "Islamic / Nikah",
    style: "Sacred Ivory & 24K Gold Archway",
    price: "₹1,199",
    tag: "Sacred Nikah",
    scenes: [
      { title: "Embossed Floral Envelope", image: "/templates/noor-e-nikah/envelope-bg.jpg" },
      { title: "24K Gold Bismillah", image: "/templates/noor-e-nikah/envelope-bg.jpg" },
      { title: "Nikah Ceremony Timeline", image: "/templates/noor-e-nikah/envelope-bg.jpg" },
      { title: "Instant WhatsApp RSVP", image: "/templates/noor-e-nikah/envelope-bg.jpg" },
    ],
  },
  {
    id: "royal-majesty",
    name: "Royal Majesty",
    category: "royal",
    categoryLabel: "Regency & Heritage",
    style: "French Château Ballroom & Chandeliers",
    price: "₹1,199",
    tag: "Luxury Heritage",
    video: "/videos/royal-majesty.mp4",
    scenes: [
      { title: "Château Ballroom Parallax", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Crystal Chandeliers", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Live Guestbook Flight", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Dress Code Visualizer", image: "/templates/imperial-palace/ballroom.jpg" },
    ],
  },
  {
    id: "rose-gold-blush",
    name: "Rose Gold Blush",
    category: "modern",
    categoryLabel: "Modern Floral",
    style: "Champagne Silk & Petal Shower",
    price: "₹1,199",
    tag: "Romantic Modern",
    video: "/videos/rose-gold-blush.mp4",
    scenes: [
      { title: "Falling Sakura Petals", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Gold Foil Monogram", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Event Countdown", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Interactive Travel Map", image: "/templates/imperial-palace/ballroom.jpg" },
    ],
  },
  {
    id: "crimson-royale",
    name: "Crimson Royale",
    category: "hindu",
    categoryLabel: "Hindu Heritage",
    style: "Traditional Velvet & Marigold Elegance",
    price: "₹1,199",
    tag: "Traditional Grandeur",
    scenes: [
      { title: "Velvet Red Double Doors", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Ganesh Vandana Invocation", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Sangeet & Pheras Itinerary", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Venue Google Navigation", image: "/templates/imperial-palace/ballroom.jpg" },
    ],
  },
];

const CATEGORY_TABS = [
  { id: "all", label: "All Masterpieces" },
  { id: "royal", label: "Royal Palaces" },
  { id: "muslim", label: "Muslim Nikah" },
  { id: "hindu", label: "Hindu Heritage" },
  { id: "celestial", label: "Celestial" },
  { id: "modern", label: "Modern Floral" },
];

export function InteractiveTemplateGrid() {
  const { getPriceFormatted } = useTemplatePricing();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [activeSceneIndex, setActiveSceneIndex] = useState<Record<string, number>>({});
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});

  const filtered =
    activeTab === "all"
      ? CATALOGUE_TEMPLATES
      : CATALOGUE_TEMPLATES.filter((t) => t.category === activeTab);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, x / rect.width));
    const sceneIdx = Math.min(3, Math.floor(progress * 4));
    setActiveSceneIndex((prev) => ({ ...prev, [id]: sceneIdx }));
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="showcase" className="relative w-full py-20 sm:py-28 bg-[#F7F4ED] text-[#18211E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#073D31]/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#073D31] tracking-widest font-semibold mb-2">
              <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
              <span>Multi-Scene Preview Catalogue</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#18211E]">
              Select your wedding world.
            </h2>
            <p className="text-xs sm:text-sm text-[#76766F] font-sans mt-2 max-w-lg">
              Hover across any card to scrub through its opening sequence, ceremony chapters, and guest interactions.
            </p>
          </div>

          <Link
            href="/templates"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#073D31] uppercase tracking-wider font-sans hover:text-[#C8A45E] transition-colors"
          >
            <span className="roll">
              <span className="roll__a">View All 16 Templates</span>
              <span className="roll__b" aria-hidden="true">View All 16 Templates</span>
            </span>
            <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-6">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#073D31] text-white shadow-md border border-[#C8A45E]/40"
                    : "bg-white/80 text-stone-600 hover:text-[#18211E] hover:bg-white border border-[#073D31]/10"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TEMPLATE GRID WITH SEGMENTED SCENE SCRUBBER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const currentScene = activeSceneIndex[item.id] || 0;
              const isWish = wishlisted[item.id];

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="group relative rounded-3xl bg-white border border-[#073D31]/10 p-3 shadow-sm hover:shadow-xl hover:border-[#073D31]/25 transition-all duration-500 flex flex-col justify-between overflow-hidden"
                  onMouseMove={(e) => handleCardMouseMove(e, item.id)}
                  onMouseLeave={() =>
                    setActiveSceneIndex((prev) => ({ ...prev, [item.id]: 0 }))
                  }
                >
                  {/* MEDIA CONTAINER WITH SEGMENTED PROGRESS BARS */}
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 border border-black/5">
                    {/* Yushe-Style Top Segmented Scrubber Bars */}
                    <div className="pcard__bars">
                      {[0, 1, 2, 3].map((barIdx) => (
                        <div
                          key={barIdx}
                          className="pcard__bar"
                          data-state={barIdx === currentScene ? "on" : "off"}
                        />
                      ))}
                    </div>

                    {/* Wishlist Heart Action */}
                    <button
                      onClick={(e) => toggleWishlist(item.id, e)}
                      aria-label="Save to wishlist"
                      className={`absolute top-4 right-3 z-40 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-90 cursor-pointer ${
                        isWish
                          ? "bg-rose-500 text-white shadow-md"
                          : "bg-black/40 text-white/80 hover:text-white hover:bg-black/60"
                      }`}
                    >
                      <Heart size={14} weight={isWish ? "fill" : "bold"} />
                    </button>

                    {/* Visual Media with Crossfade */}
                    {item.video && currentScene === 0 ? (
                      <video
                        src={item.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                        style={{
                          backgroundImage: `url(${item.scenes[currentScene]?.image || item.scenes[0].image})`,
                        }}
                      />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/35" />

                    {/* Scene Caption Hover Pill */}
                    <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold tracking-wider text-[#E1C98E] uppercase border border-white/10">
                        {item.scenes[currentScene]?.title}
                      </span>
                      <span className="text-[10px] font-bold text-white font-mono">
                        {getPriceFormatted(item.id, item.price)}
                      </span>
                    </div>
                  </div>

                  {/* BOTTOM CARD INFO */}
                  <div className="p-3 pt-4 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A45E]">
                        {item.categoryLabel}
                      </span>
                      <span className="text-[9px] font-semibold text-[#073D31] px-2 py-0.5 rounded-full bg-[#073D31]/8">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#18211E] group-hover:text-[#073D31] transition-colors line-clamp-1">
                      {item.name}
                    </h3>

                    <p className="text-xs text-[#76766F] font-sans line-clamp-1">
                      {item.style}
                    </p>

                    {/* Direct Action Bar with Roll */}
                    <div className="flex items-center gap-2 pt-3 mt-1 border-t border-[#073D31]/8">
                      <Link
                        href={`/preview/${item.id}`}
                        className="flex-1 py-2 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-[11px] font-bold tracking-wider uppercase font-sans flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md cursor-pointer"
                      >
                        <Eye size={13} weight="bold" className="text-[#E1C98E]" />
                        <span className="roll">
                          <span className="roll__a">Preview Experience</span>
                          <span className="roll__b" aria-hidden="true">Preview Experience</span>
                        </span>
                      </Link>

                      <Link
                        href={`/customize/${item.id}`}
                        className="px-3.5 py-2 rounded-full bg-white hover:bg-[#F7F4ED] text-[#073D31] border border-[#073D31]/20 text-[11px] font-bold tracking-wider uppercase font-sans flex items-center justify-center transition-all cursor-pointer"
                      >
                        <span className="roll">
                          <span className="roll__a">Try Free</span>
                          <span className="roll__b" aria-hidden="true">Try Free</span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
