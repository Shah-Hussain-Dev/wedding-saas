"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, PanInfo, type Variants } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  Sparkle,
  Crown,
  MoonStars,
  FlowerLotus,
  Eye,
  CheckCircle,
} from "@phosphor-icons/react";

export interface HeroInvitation {
  id: string;
  name: string;
  shortName: string;
  category: string;
  style: string;
  video?: string;
  image?: string;
  glowColor: string;
  accentColor: string;
  badge: string;
  tag: string;
  price: string;
  slug: string;
}

export const HERO_INVITATIONS: HeroInvitation[] = [
  {
    id: "celestial-rose",
    name: "Celestial Rose Dreamscape",
    shortName: "Celestial",
    category: "Universal / Celestial",
    style: "Awwwards 3D & Zero Gravity",
    video: "/videos/royal-prestige.mp4",
    glowColor: "rgba(88, 152, 184, 0.28)",
    accentColor: "#E1C98E",
    badge: "Celestial Rose",
    tag: "Signature",
    price: "₹1,199",
    slug: "celestial-rose",
  },
  {
    id: "imperial-palace",
    name: "Imperial Palace",
    shortName: "Imperial",
    category: "Royal Heritage",
    style: "Monumental Doors & Gold Inlay",
    image: "/templates/imperial-palace/ballroom.jpg",
    glowColor: "rgba(184, 151, 115, 0.25)",
    accentColor: "#C8A45E",
    badge: "Imperial Palace",
    tag: "Royale",
    price: "₹1,199",
    slug: "imperial-palace",
  },
  {
    id: "noor-e-nikah",
    name: "Noor-e-Nikah",
    shortName: "Noor Nikah",
    category: "Sacred Nikah",
    style: "3D Embossed Floral Envelope & Gold Arch",
    image: "/templates/noor-e-nikah/envelope-bg.jpg",
    glowColor: "rgba(200, 164, 94, 0.28)",
    accentColor: "#C8A45E",
    badge: "Noor-e-Nikah",
    tag: "Sacred",
    price: "₹1,199",
    slug: "noor-e-nikah",
  },
  {
    id: "royal-majesty",
    name: "Royal Majesty",
    shortName: "Majesty",
    category: "Château Ballroom",
    style: "Ballroom Waltz & Lake Terrace",
    video: "/videos/royal-majesty.mp4",
    glowColor: "rgba(169, 193, 208, 0.28)",
    accentColor: "#B7A16E",
    badge: "Royal Majesty",
    tag: "Heritage",
    price: "₹1,199",
    slug: "royal-majesty",
  },
  {
    id: "rose-gold-blush",
    name: "Rose Gold Blush",
    shortName: "Rose Blush",
    category: "Romantic Modern",
    style: "Champagne Silk & Petal Shower",
    video: "/videos/rose-gold-blush.mp4",
    glowColor: "rgba(232, 184, 184, 0.25)",
    accentColor: "#DDA7A5",
    badge: "Rose Gold",
    tag: "Romantic",
    price: "₹1,199",
    slug: "rose-gold-blush",
  },
];

export function HeroExperience() {
  const [activeIndex, setActiveIndex] = useState(2); // Default to Noor-e-Nikah center
  const [viewportWidth, setViewportWidth] = useState(1200);
  const containerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;
  const isDesktop = viewportWidth >= 1024;

  // Gentle desktop 3D perspective follow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 22 });

  const stageTiltY = useTransform(smoothX, [-700, 700], [-6, 6]);
  const stageTiltX = useTransform(smoothY, [-500, 500], [5, -5]);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isMobile || prefersReducedMotion) return;
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

  const nextTemplate = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % HERO_INVITATIONS.length);
  }, []);

  const prevTemplate = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + HERO_INVITATIONS.length) % HERO_INVITATIONS.length);
  }, []);

  // Keyboard navigation when user is interacting with showcase
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft") {
        prevTemplate();
      } else if (e.key === "ArrowRight") {
        nextTemplate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextTemplate, prevTemplate]);

  // Mobile swipe gesture with elastic velocity threshold
  const handlePanEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isMobile) return;
    if (info.offset.x < -35 || info.velocity.x < -220) {
      nextTemplate();
    } else if (info.offset.x > 35 || info.velocity.x > 220) {
      prevTemplate();
    }
  };

  const activeTemplate = HERO_INVITATIONS[activeIndex];

  // Motion animation presets honoring reduced motion
  const easeOutCubic = [0.22, 1, 0.36, 1] as const;
  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.2 : 0.55,
        delay: prefersReducedMotion ? 0 : custom * 0.06,
        ease: easeOutCubic,
      },
    }),
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Hero Section"
      className="relative w-full min-h-[100dvh] flex flex-col justify-between items-center bg-[#F7F4ED] text-[#18211E] overflow-x-clip pt-24 sm:pt-28 lg:pt-30 pb-4 sm:pb-6 select-none"
    >
      {/* Restrained Ambient Background Halo */}
      <motion.div
        animate={{
          backgroundColor: activeTemplate.glowColor,
        }}
        transition={{ duration: 0.9 }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[950px] h-[300px] sm:h-[400px] lg:h-[480px] rounded-full blur-[90px] sm:blur-[130px] pointer-events-none opacity-60"
        aria-hidden="true"
      />

      {/* Subtle Warm Paper Texture Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7F4ED]/40 via-transparent to-[#F7F4ED] pointer-events-none" />

      {/* TOP EDITORIAL COPY & CTA HIERARCHY */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center shrink-0">
        {/* 1. Small, Understated Eyebrow */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/85 border border-[#073D31]/10 text-[9.5px] sm:text-[10.5px] font-semibold tracking-[0.2em] text-[#073D31] uppercase font-sans backdrop-blur-md shadow-2xs"
        >
          <span>INVITATIONS, REIMAGINED</span>
        </motion.div>

        {/* 2. Headline with Serif Italic 'unfolded.' */}
        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="mt-2 sm:mt-2.5 font-serif text-[2.1rem] sm:text-[2.6rem] md:text-[3rem] lg:text-[3.25rem] xl:text-[3.5rem] font-medium leading-[1.1] tracking-tight text-[#18211E]"
        >
          Your love story. <br className="hidden sm:inline" />
          Beautifully{" "}
          <span className="italic font-normal text-[#073D31] relative inline-block">
            <span>unfolded.</span>
            <span
              className="absolute left-0 bottom-1 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C8A45E]/80 to-transparent"
              aria-hidden="true"
            />
          </span>
        </motion.h1>

        {/* 3. Concise Supporting Description */}
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="mt-1 sm:mt-1.5 text-xs sm:text-[13px] lg:text-[14px] text-[#616562] max-w-md lg:max-w-lg mx-auto font-sans leading-relaxed px-2 font-normal"
        >
          Cinematic wedding invitations. Made to be remembered.
        </motion.p>

        {/* 4. Action Hierarchy: Prominent Emerald CTA + Quieter Text Link */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="mt-3 sm:mt-3.5 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 w-full sm:w-auto"
        >
          {/* Prominent Emerald CTA */}
          <Link
            href="/templates"
            className="group relative w-full sm:w-auto min-h-[40px] px-6 py-2 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs sm:text-[12px] font-semibold tracking-wider uppercase font-sans transition-all duration-300 shadow-[0_8px_20px_rgba(7,61,49,0.2)] hover:shadow-[0_12px_28px_rgba(7,61,49,0.32)] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A45E] flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Create your invitation</span>
            <ArrowRight
              size={13}
              weight="bold"
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>

          {/* Secondary Collection Pill */}
          <Link
            href="/templates"
            className="group w-full sm:w-auto min-h-[40px] px-5 py-2 rounded-full bg-white/80 hover:bg-white text-[#073D31] border border-[#073D31]/12 hover:border-[#C8A45E]/70 text-[11px] sm:text-xs font-semibold tracking-wider uppercase font-sans transition-all duration-300 shadow-2xs hover:shadow-xs flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-md"
          >
            <span>Explore the collection</span>
            <ArrowUpRight size={13} weight="bold" className="text-[#C8A45E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* MIDDLE SECTION: THEME SELECTOR & 3D HARDWARE SHOWCASE */}
      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="relative z-20 w-full max-w-5xl mx-auto px-3 sm:px-6 mt-3 sm:mt-4 flex flex-col items-center flex-1 justify-center min-h-0"
      >
        {/* Compact Theme Selector Control */}
        <div className="relative z-30 flex items-center justify-start sm:justify-center max-w-full overflow-x-auto pb-1 no-scrollbar px-2 mb-4 sm:mb-5 md:mb-6 shrink-0">
          <div
            role="tablist"
            aria-label="Invitation themes"
            className="inline-flex items-center p-1 rounded-full bg-white/90 border border-[#073D31]/10 shadow-2xs backdrop-blur-md"
          >
            {HERO_INVITATIONS.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${item.id}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-medium tracking-wide transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive ? "text-[#F7F4ED] font-bold" : "text-[#76766F] hover:text-[#18211E]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="heroThemePill"
                      className="absolute inset-0 rounded-full bg-[#073D31] shadow-[0_2px_8px_rgba(7,61,49,0.28)] border border-[#C8A45E]/40 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {idx === 0 && <Sparkle size={11} weight={isActive ? "fill" : "regular"} className={isActive ? "text-[#E1C98E]" : "text-[#C8A45E]"} />}
                  {idx === 1 && <Crown size={11} weight={isActive ? "fill" : "regular"} className={isActive ? "text-[#E1C98E]" : "text-[#C8A45E]"} />}
                  {idx === 2 && <MoonStars size={11} weight={isActive ? "fill" : "regular"} className={isActive ? "text-[#E1C98E]" : "text-[#C8A45E]"} />}
                  {idx === 3 && <Crown size={11} weight={isActive ? "fill" : "regular"} className={isActive ? "text-[#E1C98E]" : "text-[#C8A45E]"} />}
                  {idx === 4 && <FlowerLotus size={11} weight={isActive ? "fill" : "regular"} className={isActive ? "text-[#E1C98E]" : "text-[#C8A45E]"} />}
                  <span>{item.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Showcase Arena */}
        <motion.div
          style={{
            rotateX: isMobile || prefersReducedMotion ? 0 : stageTiltX,
            rotateY: isMobile || prefersReducedMotion ? 0 : stageTiltY,
          }}
          onPanEnd={handlePanEnd}
          className="relative w-full h-[340px] sm:h-[390px] md:h-[430px] lg:h-[460px] xl:h-[480px] flex items-center justify-center [perspective:1200px] select-none touch-pan-y"
        >
          {/* Tactile Side Carets */}
          <button
            onClick={prevTemplate}
            aria-label="Previous invitation"
            className="absolute left-1 sm:left-4 lg:left-2 xl:-left-4 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-[#073D31] border border-[#073D31]/12 shadow-md backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#073D31]"
          >
            <CaretLeft size={16} weight="bold" />
          </button>

          <button
            onClick={nextTemplate}
            aria-label="Next invitation"
            className="absolute right-1 sm:right-4 lg:right-2 xl:-right-4 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-[#073D31] border border-[#073D31]/12 shadow-md backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#073D31]"
          >
            <CaretRight size={16} weight="bold" />
          </button>

          {/* Staggered 3D Device Cluster (1 Center + 2 Peeking Flanks) */}
          <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
            {HERO_INVITATIONS.map((inv, index) => {
              const count = HERO_INVITATIONS.length;
              let offset = (index - activeIndex + count) % count;
              if (offset > count / 2) offset -= count;

              const isCenter = offset === 0;
              const isLeft1 = offset === -1;
              const isRight1 = offset === 1;

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
                z = isMobile ? 25 : isTablet ? 50 : 80;
                rotY = 0;
                rotZ = 0;
                scale = isMobile ? 1 : 1.02;
                opacity = 1;
                zIndex = 40;
              } else if (isLeft1) {
                x = isMobile ? -105 : isTablet ? -190 : -255;
                y = isMobile ? 4 : isTablet ? 6 : 8;
                z = isMobile ? -20 : isTablet ? -25 : -35;
                rotY = isMobile ? 14 : isTablet ? 15 : 17;
                rotZ = isMobile ? 0 : -1.5;
                scale = isMobile ? 0.83 : isTablet ? 0.86 : 0.88;
                opacity = isMobile ? 0.55 : isTablet ? 0.75 : 0.82;
                zIndex = 20;
              } else if (isRight1) {
                x = isMobile ? 105 : isTablet ? 190 : 255;
                y = isMobile ? 4 : isTablet ? 6 : 8;
                z = isMobile ? -20 : isTablet ? -25 : -35;
                rotY = isMobile ? -14 : isTablet ? -15 : -17;
                rotZ = isMobile ? 0 : 1.5;
                scale = isMobile ? 0.83 : isTablet ? 0.86 : 0.88;
                opacity = isMobile ? 0.55 : isTablet ? 0.75 : 0.82;
                zIndex = 20;
              } else {
                opacity = 0;
                scale = 0.6;
                zIndex = 5;
              }

              return (
                <motion.div
                  key={inv.id}
                  id={`panel-${inv.id}`}
                  role="tabpanel"
                  aria-hidden={!isCenter}
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
                    stiffness: 240,
                    damping: 28,
                    mass: 0.8,
                  }}
                  onClick={() => !isCenter && setActiveIndex(index)}
                  className={`absolute w-[155px] sm:w-[175px] md:w-[195px] lg:w-[215px] xl:w-[225px] aspect-[9/18.5] rounded-[22px] sm:rounded-[28px] lg:rounded-[32px] p-[4px] sm:p-[5px] lg:p-[6px] bg-[#1a1714] border-2 ${
                    isCenter
                      ? "border-[#C8A45E] shadow-[0_20px_50px_-10px_rgba(7,61,49,0.3),0_0_35px_rgba(200,164,94,0.15)]"
                      : "border-stone-800/80 shadow-md hover:border-[#C8A45E]/50 cursor-pointer"
                  } backdrop-blur-md transition-colors duration-300 ring-1 ring-black/30`}
                  style={{
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Dynamic Island Notch */}
                  <div
                    className="absolute top-2 sm:top-2.5 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-2 sm:h-2.5 rounded-full bg-black flex items-center justify-between px-1.5 sm:px-2 z-40 border border-white/10"
                    aria-hidden="true"
                  >
                    <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#073D31] ring-1 ring-white/20" />
                    <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full bg-emerald-500/80" />
                  </div>

                  {/* Concentric Inner Screen */}
                  <div className="relative w-full h-full rounded-[19px] sm:rounded-[24px] lg:rounded-[28px] overflow-hidden bg-black flex flex-col justify-between">
                    {/* Media Artwork Background */}
                    <div className="absolute inset-0 w-full h-full">
                      {inv.video ? (
                        <video
                          src={inv.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover brightness-[0.95] contrast-[1.02]"
                        />
                      ) : (
                        <div
                          className="w-full h-full bg-cover bg-center brightness-[0.95]"
                          style={{ backgroundImage: `url(${inv.image})` }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/45 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                    </div>

                    {/* Top Screen Arch Header (Unobstructed) */}
                    <div className="relative z-20 p-2 sm:p-2.5 pt-3 sm:pt-3.5 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[7px] sm:text-[8px] font-bold tracking-widest text-[#E1C98E] uppercase border border-[#C8A45E]/30 shadow-2xs">
                        {inv.tag}
                      </span>
                    </div>

                    {/* Middle: 100% Unobstructed Artwork */}
                    <div className="flex-1" />

                    {/* Bottom Frosted Glass Pedestal Card */}
                    <div className="relative z-20 m-1 sm:m-1.5 p-2 sm:p-2.5 rounded-[13px] sm:rounded-[16px] bg-black/70 backdrop-blur-xl border border-white/15 flex flex-col gap-0.5 sm:gap-1 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[7px] sm:text-[8px] font-semibold text-[#E1C98E] uppercase tracking-wider">
                          {inv.category}
                        </span>
                        <span className="text-[7.5px] sm:text-[8.5px] font-mono font-bold text-white/90">
                          {inv.price}
                        </span>
                      </div>

                      <h3 className="font-serif text-[10px] sm:text-xs font-bold text-white line-clamp-1 leading-snug">
                        {inv.name}
                      </h3>

                      {isCenter ? (
                        <Link
                          href={`/preview/${inv.id}`}
                          className="mt-0.5 w-full min-h-[26px] sm:min-h-[28px] py-1 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] border border-[#C8A45E]/50 text-[7.5px] sm:text-[8.5px] font-bold tracking-wider uppercase flex items-center justify-center gap-1 shadow-xs transition-all hover:scale-[1.02] active:scale-95"
                        >
                          <Eye size={10} weight="bold" className="text-[#E1C98E]" />
                          <span>View Preview</span>
                        </Link>
                      ) : (
                        <p className="text-[7px] sm:text-[8px] text-stone-300 line-clamp-1 font-sans">
                          {inv.style}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* BOTTOM METADATA, PAGINATION & REASSURANCE CAPSULE */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 mt-2 sm:mt-3 flex flex-col items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Active Title + Price + Reassurance in a clean single line on desktop */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10.5px] sm:text-xs text-[#616562] font-sans">
          <div className="inline-flex items-center gap-1.5 text-[#073D31] font-semibold">
            <span className="font-serif font-bold">{activeTemplate.name}</span>
            <span className="text-stone-300">·</span>
            <span className="font-mono font-bold">{activeTemplate.price}</span>
          </div>

          <span className="hidden sm:inline text-stone-300">|</span>

          <span className="flex items-center gap-1">
            <CheckCircle size={12} weight="fill" className="text-[#073D31]" />
            No app required
          </span>
          <span className="text-stone-300">·</span>
          <span className="flex items-center gap-1">
            <CheckCircle size={12} weight="fill" className="text-[#073D31]" />
            WhatsApp ready
          </span>
          <span className="text-stone-300">·</span>
          <span className="flex items-center gap-1">
            <CheckCircle size={12} weight="fill" className="text-[#073D31]" />
            Instant digital delivery
          </span>
        </div>

        {/* Understated Pagination Indicators */}
        <div className="flex items-center justify-center gap-1.5" role="navigation" aria-label="Showcase pagination">
          {HERO_INVITATIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Show ${item.name}`}
              aria-current={idx === activeIndex ? "true" : undefined}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === activeIndex
                  ? "w-6 sm:w-7 h-1 bg-[#073D31] shadow-2xs"
                  : "w-1.5 h-1 bg-[#073D31]/25 hover:bg-[#073D31]/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
