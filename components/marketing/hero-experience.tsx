"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, PanInfo } from "motion/react";
import {
  Sparkle,
  Play,
  ArrowRight,
  ShieldCheck,
  Heart,
  MoonStars,
  Crown,
  FlowerLotus,
  CaretLeft,
  CaretRight,
  Eye,
  MusicNotes,
  MapPin,
  EnvelopeSimple,
} from "@phosphor-icons/react";

interface HeroTemplate {
  id: string;
  name: string;
  category: string;
  style: string;
  tag: string;
  video?: string;
  image?: string;
  glowColor: string;
  accentColor: string;
  badge: string;
  features: string[];
}

const FEATURED_HERO_TEMPLATES: HeroTemplate[] = [
  {
    id: "celestial-rose",
    name: "Celestial Rose Dreamscape",
    category: "Universal / Celestial",
    style: "Awwwards 3D & Ethereal Starlight",
    tag: "Trending 2026",
    video: "/videos/royal-prestige.mp4",
    glowColor: "rgba(88, 152, 184, 0.35)",
    accentColor: "#5898B8",
    badge: "3D Zero-Gravity",
    features: ["Cinematic Terrace Video", "Scratch Stars Reveal", "Live Orchestral Score"],
  },
  {
    id: "imperial-palace",
    name: "Imperial Palace",
    category: "Royal Indian & European",
    style: "Grand Palace Doors & Gold Inlay",
    tag: "Signature Royale",
    image: "/templates/imperial-palace/ballroom.jpg",
    glowColor: "rgba(184, 151, 115, 0.4)",
    accentColor: "#C8A45E",
    badge: "3D Double Doors",
    features: ["Interactive Gate Opening", "Royal Procession Map", "Gold Wax Seal"],
  },
  {
    id: "noor-e-nikah",
    name: "Noor-e-Nikah",
    category: "Islamic / Nikah",
    style: "Sacred Ivory & 24K Gold Archway",
    tag: "Sacred Nikah",
    image: "/templates/noor-e-nikah/envelope-bg.jpg",
    glowColor: "rgba(7, 61, 49, 0.35)",
    accentColor: "#073D31",
    badge: "Bismillah Archway",
    features: ["Embossed Floral Envelope", "Quranic Ayah Inscription", "Instant WhatsApp RSVP"],
  },
  {
    id: "royal-majesty",
    name: "Royal Majesty",
    category: "Regency & Heritage",
    style: "French Château Ballroom & Chandeliers",
    tag: "Luxury Heritage",
    video: "/videos/royal-majesty.mp4",
    glowColor: "rgba(169, 193, 208, 0.35)",
    accentColor: "#7A92A3",
    badge: "Château Ballroom",
    features: ["Crystal Chandelier Parallax", "Live Guestbook Flight", "Dress Code Visualizer"],
  },
  {
    id: "rose-gold-blush",
    name: "Rose Gold Blush",
    category: "Modern Floral",
    style: "Champagne Silk & Petal Shower",
    tag: "Romantic Modern",
    video: "/videos/rose-gold-blush.mp4",
    glowColor: "rgba(225, 184, 184, 0.4)",
    accentColor: "#DDA7A5",
    badge: "Floating Petals",
    features: ["Velvet Gold Foil Finish", "Interactive Countdown", "Bespoke Monogram"],
  },
];

export function HeroExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeTemplate = FEATURED_HERO_TEMPLATES[activeIndex];

  // Mouse Parallax Physics for the 3D Stage (Desktop only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 45, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 45, damping: 25 });

  const stageRotateX = useTransform(smoothY, [-400, 400], [6, -6]);
  const stageRotateY = useTransform(smoothX, [-400, 400], [-8, 8]);
  const stageTranslateX = useTransform(smoothX, [-400, 400], [-12, 12]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const nextTemplate = () => {
    setActiveIndex((prev) => (prev + 1) % FEATURED_HERO_TEMPLATES.length);
  };

  const prevTemplate = () => {
    setActiveIndex((prev) => (prev - 1 + FEATURED_HERO_TEMPLATES.length) % FEATURED_HERO_TEMPLATES.length);
  };

  // Touch Swipe Gesture handler
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -40) {
      nextTemplate();
    } else if (info.offset.x > 40) {
      prevTemplate();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextTemplate();
      if (e.key === "ArrowLeft") prevTemplate();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full flex flex-col justify-start items-center bg-[#F7F4ED] text-[#18211E] overflow-hidden pt-24 sm:pt-32 pb-14 sm:pb-20 transition-colors duration-1000"
    >
      {/* Dynamic Ambient Background Glow tied to active template */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[800px] h-[400px] sm:h-[550px] rounded-full blur-[100px] sm:blur-[140px] pointer-events-none transition-all duration-1000 opacity-60"
        style={{
          backgroundColor: activeTemplate.glowColor,
        }}
      />

      {/* Subtle Gold Dust Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#C8A45E_0.75px,transparent_0.75px)] [background-size:24px_24px] sm:[background-size:28px_28px] opacity-[0.16] pointer-events-none" />

      {/* TOP SECTION: Monumental Headline & Value Proposition */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-3 sm:gap-4.5">
        {/* Curated Excellence Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[9.5px] sm:text-[11px] font-semibold tracking-[0.18em] sm:tracking-[0.22em] text-[#073D31] uppercase font-sans backdrop-blur-md"
        >
          <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
          <span>The New Dimension of Wedding Stationery</span>
          <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
        </motion.div>

        {/* Monumental Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[2.1rem] sm:text-5xl md:text-6xl lg:text-[4.6rem] font-medium leading-[1.12] tracking-tight text-[#18211E]"
        >
          Your story deserves <br className="hidden sm:inline" />
          more than an <span className="italic font-normal text-[#073D31] underline decoration-[#C8A45E]/50 decoration-1 underline-offset-6 sm:underline-offset-8">invitation</span>.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs sm:text-sm md:text-base text-[#76766F] max-w-xl mx-auto font-sans leading-relaxed px-2"
        >
          Interactive digital masterworks that unfold on your guests&apos; phones. 3D double-doors, synchronized scores, one-touch RSVP, and celestial maps.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 pt-1 w-full sm:w-auto max-w-xs sm:max-w-none"
        >
          <Link
            href="/templates"
            className="w-full sm:w-auto px-7 py-3 sm:py-3.5 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs sm:text-sm font-semibold tracking-wider uppercase font-sans transition-all duration-300 shadow-[0_10px_25px_rgba(7,61,49,0.25)] hover:shadow-[0_15px_35px_rgba(7,61,49,0.4)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Create Your Invitation</span>
            <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href={`/preview/${activeTemplate.id}`}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-full bg-white/90 hover:bg-white text-[#073D31] border border-[#073D31]/15 text-xs font-semibold tracking-wider uppercase font-sans transition-all duration-300 shadow-xs hover:border-[#C8A45E]/80 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Play size={13} weight="fill" className="text-[#C8A45E] group-hover:scale-110 transition-transform" />
            <span>Experience {activeTemplate.name}</span>
          </Link>
        </motion.div>
      </div>

      {/* MIDDLE SECTION: CRAZY 3D INTERACTIVE TEMPLATE SHOWCASE STAGE */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4 mt-6 sm:mt-10">
        {/* Template Category Switcher Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-3 no-scrollbar px-2">
          {FEATURED_HERO_TEMPLATES.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[10.5px] sm:text-xs font-medium tracking-wide transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#073D31] text-[#F7F4ED] shadow-md scale-105 border border-[#C8A45E]/40"
                    : "bg-white/70 text-[#76766F] hover:text-[#18211E] hover:bg-white border border-[#073D31]/10"
                }`}
              >
                {idx === 0 && <Sparkle size={12} weight="fill" className={isActive ? "text-[#E1C98E]" : "text-[#C8A45E]"} />}
                {idx === 1 && <Crown size={12} weight="fill" className={isActive ? "text-[#E1C98E]" : "text-[#C8A45E]"} />}
                {idx === 2 && <MoonStars size={12} weight="fill" className={isActive ? "text-[#E1C98E]" : "text-[#C8A45E]"} />}
                {idx === 3 && <Crown size={12} weight="fill" className={isActive ? "text-[#E1C98E]" : "text-[#C8A45E]"} />}
                {idx === 4 && <FlowerLotus size={12} weight="fill" className={isActive ? "text-[#E1C98E]" : "text-[#C8A45E]"} />}
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Curved / Winged Stage Container with Drag / Touch gestures */}
        <motion.div
          style={{
            rotateX: isMobile ? 0 : stageRotateX,
            rotateY: isMobile ? 0 : stageRotateY,
            x: isMobile ? 0 : stageTranslateX,
          }}
          className="relative w-full h-[400px] sm:h-[480px] md:h-[520px] flex items-center justify-center [perspective:1200px] mt-2 select-none touch-pan-y"
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevTemplate}
            aria-label="Previous template"
            className="absolute left-1 sm:left-4 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#073D31] border border-[#073D31]/15 shadow-md sm:shadow-lg backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <CaretLeft size={16} weight="bold" />
          </button>

          <button
            onClick={nextTemplate}
            aria-label="Next template"
            className="absolute right-1 sm:right-4 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#073D31] border border-[#073D31]/15 shadow-md sm:shadow-lg backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <CaretRight size={16} weight="bold" />
          </button>

          {/* 3D Floating Fan of Templates */}
          <motion.div
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]"
          >
            {FEATURED_HERO_TEMPLATES.map((tpl, index) => {
              const count = FEATURED_HERO_TEMPLATES.length;
              let offset = (index - activeIndex + count) % count;
              if (offset > count / 2) offset -= count;

              const isCenter = offset === 0;
              const isLeft1 = offset === -1;
              const isRight1 = offset === 1;
              const isLeft2 = offset === -2;
              const isRight2 = offset === 2;

              let translateX = 0;
              let translateY = 0;
              let translateZ = 0;
              let rotateY = 0;
              let rotateZ = 0;
              let scale = 1;
              let opacity = 1;
              let zIndex = 30;

              if (isCenter) {
                translateX = 0;
                translateY = 0;
                translateZ = isMobile ? 30 : 80;
                rotateY = 0;
                rotateZ = 0;
                scale = 1;
                opacity = 1;
                zIndex = 35;
              } else if (isLeft1) {
                translateX = isMobile ? -110 : -240;
                translateY = isMobile ? 8 : 12;
                translateZ = isMobile ? -25 : -40;
                rotateY = isMobile ? 16 : 22;
                rotateZ = isMobile ? -2 : -4;
                scale = isMobile ? 0.8 : 0.86;
                opacity = isMobile ? 0.35 : 0.85;
                zIndex = 25;
              } else if (isRight1) {
                translateX = isMobile ? 110 : 240;
                translateY = isMobile ? 8 : 12;
                translateZ = isMobile ? -25 : -40;
                rotateY = isMobile ? -16 : -22;
                rotateZ = isMobile ? 2 : 4;
                scale = isMobile ? 0.8 : 0.86;
                opacity = isMobile ? 0.35 : 0.85;
                zIndex = 25;
              } else if (isLeft2) {
                translateX = isMobile ? -220 : -420;
                translateY = isMobile ? 16 : 28;
                translateZ = isMobile ? -60 : -140;
                rotateY = isMobile ? 24 : 32;
                rotateZ = isMobile ? -4 : -8;
                scale = isMobile ? 0.65 : 0.72;
                opacity = isMobile ? 0 : 0.45;
                zIndex = 15;
              } else if (isRight2) {
                translateX = isMobile ? 220 : 420;
                translateY = isMobile ? 16 : 28;
                translateZ = isMobile ? -60 : -140;
                rotateY = isMobile ? -24 : -32;
                rotateZ = isMobile ? 4 : 8;
                scale = isMobile ? 0.65 : 0.72;
                opacity = isMobile ? 0 : 0.45;
                zIndex = 15;
              } else {
                opacity = 0;
                zIndex = 5;
              }

              return (
                <motion.div
                  key={tpl.id}
                  animate={{
                    x: translateX,
                    y: translateY,
                    z: translateZ,
                    rotateY: rotateY,
                    rotateZ: rotateZ,
                    scale: scale,
                    opacity: opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 190,
                    damping: 24,
                    mass: 0.8,
                  }}
                  onClick={() => setActiveIndex(index)}
                  className={`absolute w-[205px] sm:w-[255px] md:w-[270px] aspect-[9/18.5] rounded-[30px] sm:rounded-[36px] p-1.5 sm:p-2.5 bg-[#18211E]/95 border-2 ${
                    isCenter ? "border-[#C8A45E] shadow-[0_20px_50px_rgba(7,61,49,0.35)]" : "border-stone-700/50 shadow-md cursor-pointer"
                  } backdrop-blur-xl transition-shadow duration-500`}
                  style={{
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Phone Speaker & Dynamic Island Notch */}
                  <div className="absolute top-2.5 sm:top-3.5 left-1/2 -translate-x-1/2 w-14 sm:w-18 h-3.5 sm:h-4 rounded-full bg-black flex items-center justify-end px-1.5 sm:px-2 z-40">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#073D31]/80 ring-1 ring-white/20" />
                  </div>

                  {/* Inner Screen Container */}
                  <div className="relative w-full h-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-black flex flex-col justify-between">
                    {/* Media Preview (Video or Image) */}
                    <div className="absolute inset-0 w-full h-full">
                      {tpl.video ? (
                        <video
                          src={tpl.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover brightness-[0.92] contrast-[1.05]"
                        />
                      ) : (
                        <div
                          className="w-full h-full bg-cover bg-center brightness-[0.92]"
                          style={{ backgroundImage: `url(${tpl.image})` }}
                        />
                      )}
                      {/* Gradient Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
                    </div>

                    {/* Top Screen Overlays */}
                    <div className="relative z-20 p-2.5 sm:p-3 pt-5 sm:pt-6 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[8px] sm:text-[9px] font-bold tracking-wider text-[#E1C98E] uppercase border border-[#C8A45E]/30">
                        {tpl.badge}
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-semibold text-white/80 tracking-widest uppercase">
                        {tpl.tag}
                      </span>
                    </div>

                    {/* Center Action (when center) */}
                    {isCenter && (
                      <div className="relative z-20 mx-auto">
                        <Link
                          href={`/preview/${tpl.id}`}
                          className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#073D31]/90 hover:bg-[#073D31] text-[#F7F4ED] border border-[#C8A45E]/50 shadow-lg text-[9px] sm:text-[10px] font-bold tracking-wider uppercase backdrop-blur-md flex items-center gap-1.5 hover:scale-105 transition-all group cursor-pointer"
                        >
                          <Eye size={12} weight="bold" className="text-[#E1C98E]" />
                          <span>View Experience</span>
                        </Link>
                      </div>
                    )}

                    {/* Bottom Template Card Details */}
                    <div className="relative z-20 p-2.5 sm:p-3.5 bg-gradient-to-t from-black/95 to-transparent flex flex-col gap-0.5 sm:gap-1">
                      <span className="text-[8px] sm:text-[9px] font-medium text-[#C8A45E] uppercase tracking-wider">
                        {tpl.category}
                      </span>
                      <h3 className="font-serif text-xs sm:text-base font-bold text-white line-clamp-1">
                        {tpl.name}
                      </h3>
                      <p className="text-[9px] sm:text-[10px] text-stone-300 font-sans line-clamp-1">
                        {tpl.style}
                      </p>

                      {/* Micro Feature Chips on Desktop / Center */}
                      {isCenter && !isMobile && (
                        <div className="flex items-center gap-1 pt-1.5 flex-wrap">
                          {tpl.features.map((feat, fIdx) => (
                            <span
                              key={fIdx}
                              className="px-1.5 py-0.5 rounded bg-white/10 text-[8px] font-medium text-stone-200 border border-white/10"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Floating Luxury Orbit Badges (Desktop Only) */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="hidden lg:flex absolute left-8 top-1/4 z-30 px-3.5 py-2 rounded-2xl bg-white/90 border border-[#073D31]/12 shadow-lg backdrop-blur-md items-center gap-2 text-xs font-semibold text-[#073D31]"
          >
            <MusicNotes size={16} weight="fill" className="text-[#C8A45E]" />
            <span>Synchronized Cinematic Music</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
            className="hidden lg:flex absolute right-8 top-1/3 z-30 px-3.5 py-2 rounded-2xl bg-white/90 border border-[#073D31]/12 shadow-lg backdrop-blur-md items-center gap-2 text-xs font-semibold text-[#073D31]"
          >
            <EnvelopeSimple size={16} weight="fill" className="text-emerald-600" />
            <span>Instant RSVP &amp; WhatsApp Delivery</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="hidden lg:flex absolute right-16 bottom-8 z-30 px-3.5 py-2 rounded-2xl bg-white/90 border border-[#073D31]/12 shadow-lg backdrop-blur-md items-center gap-2 text-xs font-semibold text-[#073D31]"
          >
            <MapPin size={16} weight="fill" className="text-rose-500" />
            <span>Interactive Google Maps Itinerary</span>
          </motion.div>
        </motion.div>

        {/* Pagination Dots (Especially useful on Mobile) */}
        <div className="flex items-center justify-center gap-1.5 mt-2 sm:mt-3">
          {FEATURED_HERO_TEMPLATES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === activeIndex
                  ? "w-6 h-1.5 bg-[#073D31]"
                  : "w-1.5 h-1.5 bg-[#073D31]/25 hover:bg-[#073D31]/50"
              }`}
            />
          ))}
        </div>

        {/* Value Micro-Badges below showcase */}
        <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-7 text-[10.5px] sm:text-[11px] font-medium text-[#76766F] font-sans px-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} weight="fill" className="text-[#073D31]" />
            No App Install Required
          </span>
          <span className="hidden sm:inline text-stone-300">·</span>
          <span className="flex items-center gap-1.5">
            <MoonStars size={13} weight="fill" className="text-[#C8A45E]" />
            Universal, Hindu &amp; Muslim Themes
          </span>
          <span className="hidden sm:inline text-stone-300">·</span>
          <span className="flex items-center gap-1.5">
            <Heart size={13} weight="fill" className="text-rose-500" />
            100% WhatsApp Ready
          </span>
        </div>
      </div>
    </section>
  );
}
