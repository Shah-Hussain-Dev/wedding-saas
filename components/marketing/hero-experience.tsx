"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from "motion/react";
import {
  Sparkle,
  ArrowRight,
  ShieldCheck,
  Heart,
  MoonStars,
  Crown,
  FlowerLotus,
  CaretLeft,
  CaretRight,
  Eye,
} from "@phosphor-icons/react";

interface HeroInvitation {
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
  price: string;
}

const HERO_INVITATIONS: HeroInvitation[] = [
  {
    id: "celestial-rose",
    name: "Celestial Rose Dreamscape",
    category: "Universal / Celestial",
    style: "Awwwards 3D & Ethereal Starlight",
    tag: "Trending 2026",
    video: "/videos/royal-prestige.mp4",
    glowColor: "rgba(88, 152, 184, 0.4)",
    accentColor: "#5898B8",
    badge: "3D Starlight",
    price: "₹1,199",
  },
  {
    id: "imperial-palace",
    name: "Imperial Palace",
    category: "Royal Indian & European",
    style: "Grand Palace Doors & Gold Inlay",
    tag: "Signature Royale",
    image: "/templates/imperial-palace/ballroom.jpg",
    glowColor: "rgba(184, 151, 115, 0.45)",
    accentColor: "#C8A45E",
    badge: "3D Double Doors",
    price: "₹1,199",
  },
  {
    id: "noor-e-nikah",
    name: "Noor-e-Nikah",
    category: "Islamic / Nikah",
    style: "Sacred Ivory & 24K Gold Archway",
    tag: "Sacred Nikah",
    image: "/templates/noor-e-nikah/envelope-bg.jpg",
    glowColor: "rgba(7, 61, 49, 0.4)",
    accentColor: "#073D31",
    badge: "Bismillah Archway",
    price: "₹1,199",
  },
  {
    id: "royal-majesty",
    name: "Royal Majesty",
    category: "Regency & Heritage",
    style: "French Château Ballroom & Chandeliers",
    tag: "Luxury Heritage",
    video: "/videos/royal-majesty.mp4",
    glowColor: "rgba(169, 193, 208, 0.4)",
    accentColor: "#7A92A3",
    badge: "Château Ballroom",
    price: "₹1,199",
  },
  {
    id: "rose-gold-blush",
    name: "Rose Gold Blush",
    category: "Modern Floral",
    style: "Champagne Silk & Petal Shower",
    tag: "Romantic Modern",
    video: "/videos/rose-gold-blush.mp4",
    glowColor: "rgba(225, 184, 184, 0.45)",
    accentColor: "#DDA7A5",
    badge: "Floating Petals",
    price: "₹1,199",
  },
];

export function HeroExperience() {
  const [activeIndex, setActiveIndex] = useState(2); // Start with Noor-e-Nikah center
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse Physics for 3D Head/Face Follow Cursor (Desktop)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // 3D stage rotational tilts following cursor
  const stageTiltY = useTransform(smoothX, [-500, 500], [-10, 10]);
  const stageTiltX = useTransform(smoothY, [-400, 400], [8, -8]);
  const stageShiftX = useTransform(smoothX, [-500, 500], [-14, 14]);

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
    setActiveIndex((prev) => (prev + 1) % HERO_INVITATIONS.length);
  };

  const prevTemplate = () => {
    setActiveIndex((prev) => (prev - 1 + HERO_INVITATIONS.length) % HERO_INVITATIONS.length);
  };

  // Mobile Swipe handler (No desktop dragging)
  const handlePanEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isMobile) return;
    if (info.offset.x < -35) {
      nextTemplate();
    } else if (info.offset.x > 35) {
      prevTemplate();
    }
  };

  const activeTemplate = HERO_INVITATIONS[activeIndex];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full flex flex-col justify-start items-center bg-[#F7F4ED] text-[#18211E] overflow-hidden pt-20 sm:pt-28 pb-10 sm:pb-14 transition-colors duration-1000 select-none"
    >
      {/* Dynamic Ambient Background Glow tied to active template */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[850px] h-[450px] sm:h-[600px] rounded-full blur-[110px] sm:blur-[160px] pointer-events-none transition-all duration-1000 opacity-60"
        style={{
          backgroundColor: activeTemplate.glowColor,
        }}
      />

      {/* Subtle Gold Dust Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#C8A45E_0.75px,transparent_0.75px)] [background-size:24px_24px] sm:[background-size:28px_28px] opacity-[0.14] pointer-events-none" />

      {/* TOP SECTION: Monumental Headline */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-3 sm:gap-4">
        {/* Curated Excellence Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[9.5px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#073D31] uppercase font-sans backdrop-blur-md"
        >
          <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
          <span>The Showroom · Interactive Wedding Experiences</span>
          <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
        </motion.div>

        {/* Monumental Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[2rem] sm:text-4.5xl md:text-5.5xl lg:text-[4.2rem] font-medium leading-[1.12] tracking-tight text-[#18211E]"
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
          Interactive digital masterworks that unfold on your guests&apos; phones. 3D double-doors, synchronized scores, one-touch RSVP, and celestial navigation.
        </motion.p>

        {/* Kinetic Roll CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3.5 pt-1 w-full sm:w-auto"
        >
          <Link
            href="/templates"
            className="group w-full sm:w-auto px-7 py-3 sm:py-3.5 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs sm:text-sm font-semibold tracking-wider uppercase font-sans transition-all duration-300 shadow-[0_10px_25px_rgba(7,61,49,0.25)] hover:shadow-[0_15px_35px_rgba(7,61,49,0.4)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="roll">
              <span className="roll__a">Create Your Invitation</span>
              <span className="roll__b" aria-hidden="true">Create Your Invitation</span>
            </span>
            <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href={`/preview/${activeTemplate.id}`}
            className="group w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-full bg-white/90 hover:bg-white text-[#073D31] border border-[#073D31]/15 text-xs font-semibold tracking-wider uppercase font-sans transition-all duration-300 shadow-xs hover:border-[#C8A45E]/80 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="roll">
              <span className="roll__a">Experience {activeTemplate.name}</span>
              <span className="roll__b" aria-hidden="true">Experience {activeTemplate.name}</span>
            </span>
            <Eye size={14} weight="bold" className="text-[#C8A45E]" />
          </Link>
        </motion.div>
      </div>

      {/* MIDDLE SECTION: 3D DEVICES STAGE FOLLOWING THE CURSOR */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4 mt-6 sm:mt-8">
        {/* Template Category Switcher Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-3 no-scrollbar px-2 mb-2">
          {HERO_INVITATIONS.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[10.5px] sm:text-xs font-medium tracking-wide transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#073D31] text-[#F7F4ED] shadow-md scale-105 border border-[#C8A45E]/40 font-bold"
                    : "bg-white/75 text-[#76766F] hover:text-[#18211E] hover:bg-white border border-[#073D31]/10"
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

        {/* 3D Curved / Winged Stage (Cursor Follow on Desktop, Touch Pan on Mobile) */}
        <motion.div
          style={{
            rotateX: isMobile ? 0 : stageTiltX,
            rotateY: isMobile ? 0 : stageTiltY,
            x: isMobile ? 0 : stageShiftX,
          }}
          onPanEnd={handlePanEnd}
          className="relative w-full h-[380px] sm:h-[450px] md:h-[490px] flex items-center justify-center [perspective:1400px] mt-1 select-none touch-pan-y"
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

          {/* 3D Multi-Device Cluster */}
          <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
            {HERO_INVITATIONS.map((inv, index) => {
              const count = HERO_INVITATIONS.length;
              let offset = (index - activeIndex + count) % count;
              if (offset > count / 2) offset -= count;

              const isCenter = offset === 0;
              const isLeft1 = offset === -1;
              const isRight1 = offset === 1;
              const isLeft2 = offset === -2;
              const isRight2 = offset === 2;

              let x = 0;
              let y = 0;
              let z = 0;
              let rotY = 0;
              let rotZ = 0;
              let scale = 1;
              let opacity = 1;
              let zIndex = 30;

              if (isCenter) {
                x = 0;
                y = 0;
                z = isMobile ? 30 : 90;
                rotY = 0;
                rotZ = 0;
                scale = isMobile ? 1 : 1.05;
                opacity = 1;
                zIndex = 40;
              } else if (isLeft1) {
                x = isMobile ? -110 : -240;
                y = isMobile ? 6 : 10;
                z = isMobile ? -25 : -30;
                rotY = isMobile ? 14 : 20;
                rotZ = isMobile ? -2 : -3;
                scale = isMobile ? 0.82 : 0.88;
                opacity = isMobile ? 0.45 : 0.85;
                zIndex = 25;
              } else if (isRight1) {
                x = isMobile ? 110 : 240;
                y = isMobile ? 6 : 10;
                z = isMobile ? -25 : -30;
                rotY = isMobile ? -14 : -20;
                rotZ = isMobile ? 2 : 3;
                scale = isMobile ? 0.82 : 0.88;
                opacity = isMobile ? 0.45 : 0.85;
                zIndex = 25;
              } else if (isLeft2) {
                x = isMobile ? -220 : -440;
                y = isMobile ? 14 : 24;
                z = isMobile ? -60 : -120;
                rotY = isMobile ? 22 : 30;
                rotZ = isMobile ? -4 : -6;
                scale = isMobile ? 0.65 : 0.72;
                opacity = isMobile ? 0 : 0.45;
                zIndex = 15;
              } else if (isRight2) {
                x = isMobile ? 220 : 440;
                y = isMobile ? 14 : 24;
                z = isMobile ? -60 : -120;
                rotY = isMobile ? -22 : -30;
                rotZ = isMobile ? 4 : 6;
                scale = isMobile ? 0.65 : 0.72;
                opacity = isMobile ? 0 : 0.45;
                zIndex = 15;
              } else {
                opacity = 0;
                zIndex = 5;
              }

              return (
                <motion.div
                  key={inv.id}
                  animate={{
                    x,
                    y,
                    z,
                    rotateY: rotY,
                    rotateZ: rotZ,
                    scale,
                    opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 190,
                    damping: 24,
                    mass: 0.8,
                  }}
                  onClick={() => setActiveIndex(index)}
                  className={`absolute w-[205px] sm:w-[250px] md:w-[275px] aspect-[9/18.5] rounded-[28px] sm:rounded-[34px] p-1.5 sm:p-2 bg-[#18211E]/95 border-2 ${
                    isCenter
                      ? "border-[#C8A45E] shadow-[0_20px_50px_rgba(7,61,49,0.38)]"
                      : "border-stone-700/50 shadow-lg hover:border-[#C8A45E]/50 cursor-pointer"
                  } backdrop-blur-xl transition-all duration-300`}
                  style={{
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Phone Notch */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-3 sm:h-3.5 rounded-full bg-black flex items-center justify-end px-1.5 z-40">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#073D31]/80 ring-1 ring-white/20" />
                  </div>

                  {/* Inner Screen Preview */}
                  <div className="relative w-full h-full rounded-[22px] sm:rounded-[26px] overflow-hidden bg-black flex flex-col justify-between">
                    {/* Media */}
                    <div className="absolute inset-0 w-full h-full">
                      {inv.video ? (
                        <video
                          src={inv.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover brightness-[0.92] contrast-[1.05]"
                        />
                      ) : (
                        <div
                          className="w-full h-full bg-cover bg-center brightness-[0.92]"
                          style={{ backgroundImage: `url(${inv.image})` }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/45" />
                    </div>

                    {/* Top Screen Overlays */}
                    <div className="relative z-20 p-2 sm:p-3 pt-4 sm:pt-5 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[8px] sm:text-[9px] font-bold tracking-wider text-[#E1C98E] uppercase border border-[#C8A45E]/30">
                        {inv.badge}
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-semibold text-white/80 tracking-widest uppercase">
                        {inv.tag}
                      </span>
                    </div>

                    {/* Center Direct CTA when center */}
                    {isCenter && (
                      <div className="relative z-20 mx-auto">
                        <Link
                          href={`/preview/${inv.id}`}
                          className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#073D31]/95 hover:bg-[#073D31] text-[#F7F4ED] border border-[#C8A45E]/60 shadow-lg text-[9px] sm:text-[10px] font-bold tracking-wider uppercase backdrop-blur-md flex items-center gap-1.5 hover:scale-105 transition-all group cursor-pointer"
                        >
                          <Eye size={12} weight="bold" className="text-[#E1C98E]" />
                          <span>View Experience</span>
                        </Link>
                      </div>
                    )}

                    {/* Bottom Details */}
                    <div className="relative z-20 p-2.5 sm:p-3 bg-gradient-to-t from-black/95 to-transparent flex flex-col gap-0.5">
                      <span className="text-[8px] sm:text-[9px] font-medium text-[#C8A45E] uppercase tracking-wider">
                        {inv.category}
                      </span>
                      <h3 className="font-serif text-xs sm:text-sm font-bold text-white line-clamp-1">
                        {inv.name}
                      </h3>
                      <p className="text-[9px] text-stone-300 font-sans line-clamp-1">
                        {inv.style}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Centered Spotlight Pedestal Badge below the 3D Stage */}
        <div className="mt-3 sm:mt-4 flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-[#073D31]/15 shadow-sm backdrop-blur-md text-xs font-sans">
            <span className="w-2 h-2 rounded-full bg-[#C8A45E]" />
            <span className="font-serif font-bold text-[#073D31]">{activeTemplate.name}</span>
            <span className="text-stone-300">·</span>
            <span className="text-xs font-bold font-mono text-[#073D31]">{activeTemplate.price}</span>
            <span className="text-stone-300">·</span>
            <span className="text-[10px] text-[#76766F] uppercase tracking-wider font-semibold">{activeTemplate.category}</span>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-1">
            {HERO_INVITATIONS.map((_, idx) => (
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
        </div>
      </div>

      {/* BOTTOM TRUST BADGES */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-7 text-[10.5px] sm:text-[11px] font-medium text-[#76766F] font-sans px-2">
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
    </section>
  );
}
