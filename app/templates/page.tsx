"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { GlassNav } from "@/components/ui/glass-nav";
import { PremiumFooter } from "@/components/ui/premium-footer";
import { LuxuryCursor } from "@/components/ui/luxury-cursor";
import {
  Sparkle,
  ArrowRight,
  Eye,
  Heart,
  MagnifyingGlass,
  Crown,
  MoonStars,
  FlowerLotus,
} from "@phosphor-icons/react";
import { useTemplatePricing } from "@/lib/hooks/use-template-pricing";

const FILTERS = [
  { id: "All", label: "All Masterpieces (16)" },
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
    price: "₹1,199",
    desc: "A transcendent dreamscape with starlight terrace video, pointer lerp parallax, orbital countdown, pinned constellation story, and wish-upon-a-star RSVP flight.",
    video: "/videos/royal-prestige.mp4",
    scenes: [
      { title: "Starlight Terrace Video", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Scratch-the-Stars Reveal", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Orchestral Score", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Wish RSVP Flight", image: "/templates/imperial-palace/ballroom.jpg" },
    ],
  },
  {
    id: "imperial-palace",
    name: "Imperial Palace",
    style: "Grand European & Royal Indian Palace",
    tag: "Signature Royale",
    religion: ["hindu", "muslim", "universal"],
    religionLabel: "Universal",
    price: "₹1,199",
    desc: "Monumental 3D carved double walnut doors opening into an imperial palace ballroom with crystal chandeliers, velvet transitions, and royal procession itinerary.",
    image: "/templates/imperial-palace/ballroom.jpg",
    scenes: [
      { title: "3D Double Palace Doors", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Royal Procession Map", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Gold Wax Seal", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "VIP Seating Portal", image: "/templates/imperial-palace/ballroom.jpg" },
    ],
  },
  {
    id: "royal-majesty",
    name: "Royal Majesty",
    style: "French Château & Regency Ballroom",
    tag: "New",
    religion: ["hindu", "muslim", "universal"],
    religionLabel: "Universal",
    price: "₹1,199",
    desc: "Enchanted French Château ballroom & starlit lake video reveal with crystal chandeliers, powder-blue hydrangea garlands, and live guestbook flights.",
    video: "/videos/royal-majesty.mp4",
    scenes: [
      { title: "Château Ballroom Waltz", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Crystal Chandeliers", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Guestbook Flight", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Dress Code Visualizer", image: "/templates/imperial-palace/ballroom.jpg" },
    ],
  },
  {
    id: "royal-heritage",
    name: "Royal Heritage",
    style: "Powder Blue & Coral Floral Arch",
    tag: "New",
    religion: ["hindu", "muslim", "universal"],
    religionLabel: "Universal",
    price: "₹1,199",
    desc: "Sun-kissed Mediterranean arched doorway & blooming coral bougainvillea cinematic video reveal with 3D panoramic arch photo horizon.",
    video: "/videos/royal-heritage.mp4",
    scenes: [
      { title: "Mediterranean Archway", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Bougainvillea Horizon", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Ceremony Timeline", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "One-Touch WhatsApp", image: "/templates/imperial-palace/ballroom.jpg" },
    ],
  },
  {
    id: "royal-grace",
    name: "Royal Grace",
    style: "Botanical Velvet & Gold Filigree",
    tag: "Featured",
    religion: ["hindu", "muslim", "universal"],
    religionLabel: "Universal",
    price: "₹1,199",
    desc: "Enchanted botanical velvet gate opening video, 24K antique gold filigree, glasshouse palace parallax, and scratch date reveal.",
    video: "/videos/royal-grace.mp4",
    scenes: [
      { title: "Botanical Gate Opening", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Glasshouse Palace", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Scratch Date Card", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Interactive Travel Map", image: "/templates/imperial-palace/ballroom.jpg" },
    ],
  },
  {
    id: "rose-gold-blush",
    name: "Rose Gold Blush Royal",
    style: "Rose Gold & Champagne Silk",
    tag: "Romantic Modern",
    religion: ["hindu", "muslim", "universal"],
    religionLabel: "Universal",
    price: "₹1,199",
    desc: "Falling sakura petals, velvet gold foil typography, synchronized orchestral harp, and dual Vedic & Islamic blessings.",
    video: "/videos/rose-gold-blush.mp4",
    scenes: [
      { title: "Falling Sakura Petals", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Gold Monogram Stamp", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Countdown Flight", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Venue Google Navigation", image: "/templates/imperial-palace/ballroom.jpg" },
    ],
  },
  {
    id: "noor-e-nikah",
    name: "Noor-e-Nikah",
    style: "Sacred Ivory & 24K Gold Archway",
    tag: "Sacred Nikah",
    religion: ["muslim"],
    religionLabel: "Muslim",
    price: "₹1,199",
    desc: "3D embossed ivory floral envelope, slow-lighting wax seal, grand mosque archway portal, and Bismillah Nikah timeline.",
    image: "/templates/noor-e-nikah/envelope-bg.jpg",
    scenes: [
      { title: "Embossed Floral Envelope", image: "/templates/noor-e-nikah/envelope-bg.jpg" },
      { title: "24K Gold Bismillah", image: "/templates/noor-e-nikah/envelope-bg.jpg" },
      { title: "Nikah Ceremony Timeline", image: "/templates/noor-e-nikah/envelope-bg.jpg" },
      { title: "Instant WhatsApp RSVP", image: "/templates/noor-e-nikah/envelope-bg.jpg" },
    ],
  },
  {
    id: "emerald-qasr",
    name: "Emerald Qasr",
    style: "Ottoman Royale & Emerald Velvet",
    tag: "Cinematic Video",
    religion: ["muslim"],
    religionLabel: "Muslim",
    price: "₹1,199",
    desc: "Opulent Ottoman palace celebration featuring an animated cinematic envelope opening video, 24K gold filigree, Ayat Ar-Rum blessings, and multi-event Nikah itinerary.",
    video: "/templates/emerald-qasr/opening.mp4",
    image: "/templates/emerald-qasr/envelope-desktop.jpg",
    scenes: [
      { title: "Ottoman Envelope Opening", image: "/templates/emerald-qasr/envelope-desktop.jpg" },
      { title: "24K Gold Filigree", image: "/templates/emerald-qasr/envelope-desktop.jpg" },
      { title: "Ayat Ar-Rum Blessings", image: "/templates/emerald-qasr/envelope-desktop.jpg" },
      { title: "Nikah Multi-Event Itinerary", image: "/templates/emerald-qasr/envelope-desktop.jpg" },
    ],
  },
  {
    id: "gul-e-noor",
    name: "Gul-e-Noor",
    style: "Blush Velvet & Rose Gold",
    tag: "Romantic Video",
    religion: ["muslim"],
    religionLabel: "Muslim",
    price: "₹1,199",
    desc: "A dreamy blush pink & rose velvet celebration with a floating floral envelope animation video, glowing pearl accents, Quranic blessings, and interactive RSVP.",
    video: "/templates/gul-e-noor/opening.mp4",
    image: "/templates/gul-e-noor/envelope-desktop.jpg",
    scenes: [
      { title: "Floating Floral Envelope", image: "/templates/gul-e-noor/envelope-desktop.jpg" },
      { title: "Glowing Pearl Accents", image: "/templates/gul-e-noor/envelope-desktop.jpg" },
      { title: "Quranic Blessings", image: "/templates/gul-e-noor/envelope-desktop.jpg" },
      { title: "Interactive Guestbook RSVP", image: "/templates/gul-e-noor/envelope-desktop.jpg" },
    ],
  },
  {
    id: "azure-nikah",
    name: "Azure Nikah",
    style: "Persian Sapphire & Starlight Courtyard",
    tag: "Sacred Nikah",
    religion: ["muslim"],
    religionLabel: "Muslim",
    price: "₹1,199",
    desc: "Persian sapphire tilework with celestial moonrise animations, Quranic Ayah in gold calligraphy, and family blessings.",
    video: "/templates/azure-nikah/opening.mp4",
    image: "/templates/azure-nikah/envelope-desktop.jpg",
    scenes: [
      { title: "Sapphire Tile Courtyard", image: "/templates/azure-nikah/envelope-desktop.jpg" },
      { title: "Moonrise Calligraphy", image: "/templates/azure-nikah/envelope-desktop.jpg" },
      { title: "Walima Schedule", image: "/templates/azure-nikah/envelope-desktop.jpg" },
      { title: "Guest Flight Portal", image: "/templates/azure-nikah/envelope-desktop.jpg" },
    ],
  },
  {
    id: "kitab-e-nikah",
    name: "Kitab-e-Nikah",
    style: "Sacred Velvet & Arabesque Gold",
    tag: "Luxury Video",
    religion: ["muslim"],
    religionLabel: "Muslim",
    price: "₹1,199",
    desc: "A sacred velvet tome unfolding invitation featuring a cinematic opening book video, ivory parchment texture, gold arabesque motifs, and an interactive Nikah ceremony guide.",
    video: "/templates/kitab-e-nikah/opening.mp4",
    image: "/templates/kitab-e-nikah/envelope-desktop.jpg",
    scenes: [
      { title: "Cinematic Unfolding Tome", image: "/templates/kitab-e-nikah/envelope-desktop.jpg" },
      { title: "Gold Arabesque Motifs", image: "/templates/kitab-e-nikah/envelope-desktop.jpg" },
      { title: "Sacred Nikah Schedule", image: "/templates/kitab-e-nikah/envelope-desktop.jpg" },
      { title: "WhatsApp 1-Click RSVP", image: "/templates/kitab-e-nikah/envelope-desktop.jpg" },
    ],
  },
  {
    id: "crimson-royale",
    name: "Crimson Royale",
    style: "Traditional Velvet & Marigold Elegance",
    tag: "Hindu Heritage",
    religion: ["hindu"],
    religionLabel: "Hindu",
    price: "₹1,199",
    desc: "Grand traditional double red doors opening into a royal courtyard with Ganesh Vandana, Sangeet & Pheras itinerary.",
    image: "/templates/crimson-royale/bg-welcome-desktop.jpg",
    scenes: [
      { title: "Velvet Red Double Doors", image: "/templates/crimson-royale/bg-welcome-desktop.jpg" },
      { title: "Ganesh Vandana Invocation", image: "/templates/crimson-royale/bg-events-desktop.jpg" },
      { title: "Sangeet & Pheras Timetable", image: "/templates/crimson-royale/bg-gallery-desktop.jpg" },
      { title: "Google Maps Venue Link", image: "/templates/crimson-royale/bg-venue-desktop.jpg" },
    ],
  },
  {
    id: "royal-lotus",
    name: "Royal Lotus",
    style: "Rajasthani Haveli & Ivory Gold",
    tag: "Auspicious",
    religion: ["hindu"],
    religionLabel: "Hindu",
    price: "₹1,199",
    desc: "A grand Rajasthani palace experience with ivory canvas, 24K antique gold filigree, deep crimson accents, floating lotus petals, and a 3D royal palace gate reveal.",
    image: "/templates/imperial-palace/ballroom.jpg",
    scenes: [
      { title: "Royal Haveli Gate Reveal", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Floating Lotus Petals", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Vedic Muhurat Countdown", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Interactive Haldi & Sangeet", image: "/templates/imperial-palace/ballroom.jpg" },
    ],
  },
  {
    id: "emerald-noir",
    name: "Emerald Noir",
    style: "Luxury Dark & 24K Gold Filigree",
    tag: "Best Seller",
    religion: ["hindu", "universal"],
    religionLabel: "Hindu",
    price: "₹1,199",
    desc: "Ornate 24K gold details on rich emerald canvas. Features a 3D Royal Haveli Gate reveal with glowing Ganesha seal, multi-layer parallax, and interactive scratch reveal card.",
    image: "/templates/imperial-palace/ballroom.jpg",
    scenes: [
      { title: "3D Haveli Gate Reveal", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Glowing Ganesha Seal", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Multi-Layer Parallax", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Interactive Scratch Card", image: "/templates/imperial-palace/ballroom.jpg" },
    ],
  },
  {
    id: "royal-elegance",
    name: "Royal Elegance",
    style: "Maharani Crimson Silk & Kundan Seal",
    tag: "Best Seller",
    religion: ["hindu", "universal"],
    religionLabel: "Hindu",
    price: "₹1,199",
    desc: "Traditional South Asian grandeur featuring 3D Maharani Crimson Silk Curtains with Royal Kundan Wax Seal, Gauri Ganesh blessings, and gallery lightbox.",
    video: "/videos/royal-elegance-royal.mp4",
    scenes: [
      { title: "Maharani Silk Curtains", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Royal Kundan Wax Seal", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Gauri Ganesh Blessings", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Photo Lightbox Gallery", image: "/templates/imperial-palace/ballroom.jpg" },
    ],
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    style: "Contemporary Chic & Origami Monogram",
    tag: "New",
    religion: ["hindu", "universal"],
    religionLabel: "Hindu",
    price: "₹1,199",
    desc: "Contemporary Vedic luxury with a 3D architectural origami envelope & pure gold monogram seal, multi-layer parallax, and interactive Muhurat scratch card.",
    image: "/templates/imperial-palace/ballroom.jpg",
    scenes: [
      { title: "Architectural Origami Envelope", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Pure Gold Monogram Seal", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Muhurat Scratch Card", image: "/templates/imperial-palace/ballroom.jpg" },
      { title: "Minimalist RSVP Form", image: "/templates/imperial-palace/ballroom.jpg" },
    ],
  },
];

export default function TemplatesPage() {
  const { getPriceFormatted } = useTemplatePricing();
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSceneIndex, setActiveSceneIndex] = useState<Record<string, number>>({});
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});

  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "All") return true;
    if (activeFilter === "Universal") return t.religion.includes("universal");
    if (activeFilter === "Hindu") return t.religion.includes("hindu");
    if (activeFilter === "Muslim") return t.religion.includes("muslim");
    if (activeFilter === "Best Sellers")
      return (
        t.tag === "Best Seller" ||
        t.tag === "Masterpiece" ||
        t.tag === "Signature Royale" ||
        t.tag === "Awwwards Dreamscape"
      );
    if (activeFilter === "New") return t.tag === "New" || t.tag === "Trending";
    return true;
  });

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
    <div className="flex flex-col min-h-screen bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <LuxuryCursor />
      <GlassNav />

      <main className="flex-grow pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* HEADER SECTION */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#073D31] uppercase font-sans backdrop-blur-md"
            >
              <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
              <span>Curated Showroom Collection · All 16 Masterpieces</span>
              <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-3.5xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#18211E]"
            >
              Every celebration has a sanctuary.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xs sm:text-sm md:text-base text-[#76766F] font-sans max-w-xl mx-auto leading-relaxed"
            >
              Explore our full collection of 16 interactive 3D digital wedding stationery templates. Move your cursor across any card to scrub through ceremony chapters.
            </motion.p>

            {/* SEARCH & FILTER CONTROLS */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
              <div className="relative w-full">
                <MagnifyingGlass
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by theme, faith, ballroom, starlight..."
                  className="w-full bg-white/90 border border-[#073D31]/12 rounded-full pl-11 pr-4 py-3 text-xs sm:text-sm text-[#18211E] placeholder:text-stone-400 outline-none focus:border-[#073D31] focus:ring-1 focus:ring-[#073D31] shadow-xs transition-all"
                />
              </div>
            </div>
          </div>

          {/* CATEGORY FILTER TABS */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-8">
            {FILTERS.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#073D31] text-white shadow-md border border-[#C8A45E]/40 scale-105"
                      : "bg-white/80 text-stone-600 hover:text-[#18211E] hover:bg-white border border-[#073D31]/10"
                  }`}
                >
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* TEMPLATES SHOWROOM GRID - ALL 16 TEMPLATES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((item) => {
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
                    {/* MEDIA CONTAINER WITH SEGMENTED BARS */}
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 border border-black/5">
                      {/* 4 Segmented Scrubber Bars */}
                      <div className="pcard__bars">
                        {[0, 1, 2, 3].map((barIdx) => (
                          <div
                            key={barIdx}
                            className="pcard__bar"
                            data-state={barIdx === currentScene ? "on" : "off"}
                          />
                        ))}
                      </div>

                      {/* Wishlist Button */}
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

                      {/* Visual Content */}
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
                            backgroundImage: `url(${item.scenes[currentScene]?.image || item.image || item.scenes[0].image})`,
                          }}
                        />
                      )}

                      {/* Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/35" />

                      {/* Scene Title Hover Tag */}
                      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[9px] font-bold tracking-wider text-[#E1C98E] uppercase border border-white/10">
                          {item.scenes[currentScene]?.title}
                        </span>
                        <span className="text-[10px] font-bold text-white font-mono">
                          {getPriceFormatted(item.id, item.price)}
                        </span>
                      </div>
                    </div>

                    {/* BOTTOM CARD DETAILS */}
                    <div className="p-3 pt-4 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A45E]">
                          {item.religionLabel}
                        </span>
                        <span className="text-[9px] font-semibold text-[#073D31] px-2 py-0.5 rounded-full bg-[#073D31]/8">
                          {item.tag}
                        </span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-[#18211E] group-hover:text-[#073D31] transition-colors line-clamp-1">
                        {item.name}
                      </h3>

                      <p className="text-xs text-[#76766F] font-sans line-clamp-2">
                        {item.desc}
                      </p>

                      {/* Action Links */}
                      <div className="flex items-center gap-2 pt-3 mt-1 border-t border-[#073D31]/8">
                        <Link
                          href={`/preview/${item.id}`}
                          className="flex-1 py-2 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-[11px] font-bold tracking-wider uppercase font-sans flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md cursor-pointer"
                        >
                          <Eye size={13} weight="bold" className="text-[#E1C98E]" />
                          <span className="roll">
                            <span className="roll__a">Preview Live</span>
                            <span className="roll__b" aria-hidden="true">Preview Live</span>
                          </span>
                        </Link>

                        <Link
                          href={`/customize/${item.id}`}
                          className="px-4 py-2 rounded-full bg-white hover:bg-[#F7F4ED] text-[#073D31] border border-[#073D31]/20 text-[11px] font-bold tracking-wider uppercase font-sans flex items-center justify-center transition-all cursor-pointer"
                        >
                          <span className="roll">
                            <span className="roll__a">Customize</span>
                            <span className="roll__b" aria-hidden="true">Customize</span>
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
      </main>

      <PremiumFooter />
    </div>
  );
}
