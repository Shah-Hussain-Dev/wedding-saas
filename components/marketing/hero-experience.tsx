"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  PanInfo,
  type Variants,
} from "motion/react";
import {
  ArrowRight,
  CaretLeft,
  CaretRight,
  FlowerLotus,
  Heart,
  PaperPlaneTilt,
  Play,
  Sparkle,
  Star,
  UsersThree,
  WhatsappLogo,
  Quotes,
  X,
  SpeakerHigh,
  SpeakerSlash,
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
    image: "/templates/imperial-palace/ballroom.jpg",
    glowColor: "rgba(88, 152, 184, 0.28)",
    accentColor: "#E1C98E",
    badge: "Celestial Rose",
    tag: "Signature 3D",
    price: "₹1,199",
    slug: "celestial-rose",
  },
  {
    id: "imperial-palace",
    name: "Imperial Palace",
    shortName: "Imperial",
    category: "Royal Heritage",
    style: "Monumental Doors & Gold Inlay",
    image: "/templates/imperial-palace/doors-hero.jpg",
    glowColor: "rgba(184, 151, 115, 0.25)",
    accentColor: "#C49A5A",
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
    accentColor: "#C49A5A",
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
    image: "/templates/royal-majesty/ballroom-terrace.jpg",
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
    image: "/templates/rose-gold-blush/palace-arch.jpg",
    glowColor: "rgba(232, 184, 184, 0.25)",
    accentColor: "#DDA7A5",
    badge: "Rose Gold",
    tag: "Romantic",
    price: "₹1,199",
    slug: "rose-gold-blush",
  },
];

/**
 * Dedicated high-performance media component for the 3D phone showcase.
 * Plays authentic template videos continuously with seamless loop,
 * guarantees muted autoplay compliance on DOM mount without aborting or pausing,
 * and renders high-res template backdrop for thumbnail-based designs.
 */
function PhoneMedia({
  video,
  image,
}: {
  video?: string;
  image?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !video) return;

    el.defaultMuted = true;
    el.muted = true;

    const playPromise = el.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Silently handled if browser requires initial user gesture
      });
    }
  }, [video]);

  if (video) {
    return (
      <div className="relative w-full h-full bg-black overflow-hidden">
        {image && (
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <video
          ref={videoRef}
          src={video}
          poster={image}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.98] contrast-[1.02]"
        />
      </div>
    );
  }

  return (
    <div
      className="w-full h-full bg-cover bg-center brightness-[0.98] contrast-[1.02]"
      style={{ backgroundImage: `url(${image})` }}
    />
  );
}

export function HeroExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

  // Gentle desktop 3D perspective follow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 22 });

  const stageTiltY = useTransform(smoothX, [-700, 700], [-4.5, 4.5]);
  const stageTiltX = useTransform(smoothY, [-500, 500], [3.5, -3.5]);

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
    setIsHovered(false);
  };

  // Immediate slide navigation
  const nextTemplate = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % HERO_INVITATIONS.length);
  }, []);

  const prevTemplate = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + HERO_INVITATIONS.length) % HERO_INVITATIONS.length);
  }, []);

  // Automatic Slide Transitions (Autoplay every 5.5s, pauses on hover/modal)
  useEffect(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    if (!isHovered && !isPreviewOpen) {
      autoplayTimerRef.current = setInterval(() => {
        nextTemplate();
      }, 5500);
    }
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [nextTemplate, isHovered, isPreviewOpen, activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      )
        return;
      if (e.key === "ArrowLeft") {
        prevTemplate();
      } else if (e.key === "ArrowRight") {
        nextTemplate();
      } else if (e.key === "Escape" && isPreviewOpen) {
        setIsPreviewOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextTemplate, prevTemplate, isPreviewOpen]);

  const isDraggingRef = useRef(false);

  // Swipe gesture with elastic velocity threshold (mobile touch & desktop swipe)
  const handlePanStart = () => {
    isDraggingRef.current = true;
  };

  const handlePanEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);

    if (info.offset.x < -30 || info.velocity.x < -180) {
      nextTemplate();
    } else if (info.offset.x > 30 || info.velocity.x > 180) {
      prevTemplate();
    }
  };

  const activeTemplate = HERO_INVITATIONS[activeIndex];

  // Motion variants
  const easeOutCubic = [0.22, 1, 0.36, 1] as const;
  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 14 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.2 : 0.6,
        delay: prefersReducedMotion ? 0 : custom * 0.08,
        ease: easeOutCubic,
      },
    }),
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="WedInvites Hero"
      className="relative w-full min-h-[100dvh] flex flex-col justify-between items-center bg-[#FFF8EC] text-[#171614] overflow-x-clip pt-24 sm:pt-28 lg:pt-30 pb-6 sm:pb-10 select-none"
    >
      {/* 1. PALACE ARCHITECTURAL BACKGROUND WITH RICH SUNLIGHT WASH */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-[center_22%] pointer-events-none"
        style={{
          backgroundImage: "url('/images/palace-hero-bg.jpg')",
        }}
        aria-hidden="true"
      />

      {/* 2. SOPHISTICATED BALANCED GRADIENTS — ARCHITECTURE REMAINS VISIBLE */}
      {/* Desktop: Soft warm diffusion on left so typography is crisp while palace arches shine through */}
      <div
        className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#FFF8EC]/94 via-[#FFF8EC]/78 via-42% to-transparent pointer-events-none"
        aria-hidden="true"
      />
      {/* Mobile/Tablet: Soft warm scrim */}
      <div
        className="lg:hidden absolute inset-0 bg-gradient-to-b from-[#FFF8EC]/92 via-[#FFF8EC]/80 to-[#FFF8EC]/94 pointer-events-none"
        aria-hidden="true"
      />
      {/* Ambient Radial Sunlight Glow */}
      <div
        className="absolute top-1/4 right-1/4 w-[500px] lg:w-[700px] h-[500px] lg:h-[700px] rounded-full bg-amber-100/25 blur-[130px] pointer-events-none"
        aria-hidden="true"
      />

      {/* 3. MAIN HERO GRID (SPLIT 2-COLUMN DESKTOP / MOBILE STACK) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
          {/* ========================================================= */}
          {/* LEFT COLUMN: EDITORIAL HEADLINE, CTAs & 4 PILLARS */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left xl:pr-2">
            {/* Eyebrow Pill */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#C49A5A]/35 text-[#A87535] text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.18em] uppercase font-sans backdrop-blur-md shadow-2xs"
            >
              <FlowerLotus size={15} weight="regular" className="text-[#C49A5A]" />
              <span>DIGITAL WEDDING INVITATIONS</span>
            </motion.div>

            {/* Main Headline — Exact 3-line layout matching reference */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="mt-4 sm:mt-5 font-serif text-[2.75rem] sm:text-[3.35rem] md:text-[3.75rem] lg:text-[4.1rem] xl:text-[4.5rem] font-bold text-[#171614] leading-[1.05] tracking-tight"
            >
              More than <br />
              an Invitation. <br />
              <span className="font-serif italic font-normal text-[#A87535] whitespace-nowrap block sm:inline">
                A Beautiful · Beginning.
              </span>
            </motion.h1>

            {/* Description Paragraph */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="mt-3.5 sm:mt-4 text-[15px] sm:text-base lg:text-[16.5px] text-[#716A60] font-sans leading-relaxed max-w-[530px] font-normal"
            >
              Turn your love story into a stunning digital wedding invitation. Share your
              special day with family and friends in the most beautiful, modern and meaningful way.
            </motion.p>

            {/* Dual CTAs — Generously sized pill buttons */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4 w-full sm:w-auto"
            >
              {/* Primary: Create Your Invitation */}
              <Link
                href="/templates"
                className="group w-full sm:w-auto min-h-[50px] px-8 sm:px-9 py-3.5 rounded-full bg-[#063F35] hover:bg-[#032A23] text-[#F7F4ED] text-xs sm:text-[13px] font-bold tracking-wider uppercase font-sans transition-all duration-300 shadow-[0_8px_24px_rgba(6,63,53,0.3)] hover:shadow-[0_12px_32px_rgba(6,63,53,0.4)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>CREATE YOUR INVITATION</span>
                <ArrowRight
                  size={14}
                  weight="bold"
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              {/* Secondary: Watch Preview Button */}
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="group w-full sm:w-auto min-h-[50px] px-7 sm:px-8 py-3.5 rounded-full bg-white/95 hover:bg-white text-[#171614] border border-[#E8D8BB] hover:border-[#C49A5A]/70 text-xs sm:text-[13px] font-bold tracking-wider uppercase font-sans transition-all duration-300 shadow-2xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-md"
              >
                <span className="w-5.5 h-5.5 rounded-full bg-[#C49A5A] text-white flex items-center justify-center pl-0.5 shadow-2xs">
                  <Play size={11} weight="fill" />
                </span>
                <span>WATCH PREVIEW</span>
              </button>
            </motion.div>

            {/* 4 Feature Pillars with Icons & Vertical Dividers (Pixel-Matched to Reference) */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-[#A3753C]/20 w-full grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0"
            >
              {/* Pillar 1 */}
              <div className="flex flex-col items-center text-center gap-1.5 sm:px-3">
                <Sparkle size={20} weight="fill" className="text-[#A3753C]" />
                <span className="text-[11px] sm:text-xs font-semibold text-[#221C14] leading-tight">
                  Premium <br />
                  3D Templates
                </span>
              </div>

              {/* Pillar 2 */}
              <div className="flex flex-col items-center text-center gap-1.5 sm:px-3 sm:border-l sm:border-[#A3753C]/20">
                <WhatsappLogo size={20} weight="regular" className="text-[#A3753C]" />
                <span className="text-[11px] sm:text-xs font-semibold text-[#221C14] leading-tight">
                  1-Click <br />
                  WhatsApp Share
                </span>
              </div>

              {/* Pillar 3 */}
              <div className="flex flex-col items-center text-center gap-1.5 sm:px-3 sm:border-l sm:border-[#A3753C]/20">
                <UsersThree size={20} weight="regular" className="text-[#A3753C]" />
                <span className="text-[11px] sm:text-xs font-semibold text-[#221C14] leading-tight">
                  Real-time <br />
                  RSVP Tracking
                </span>
              </div>

              {/* Pillar 4 */}
              <div className="flex flex-col items-center text-center gap-1.5 sm:px-3 sm:border-l sm:border-[#A3753C]/20">
                <span className="text-[#A3753C] text-xl font-bold leading-none font-sans">
                  ∞
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-[#221C14] leading-tight">
                  One Price <br />
                  Lifetime Hosting
                </span>
              </div>
            </motion.div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: 3D PHONE SLIDER WITH ACTUAL TEMPLATES & VIDEOS */}
          {/* ========================================================= */}
          <div
            id="hero-showcase"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="lg:col-span-6 xl:col-span-6 flex items-center justify-center relative mt-6 lg:mt-0"
          >
            {/* Flanking Side Carets for Instant Intuitive Control (Visible & Elevated) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevTemplate();
              }}
              aria-label="Previous invitation slide"
              className="absolute -left-2 sm:-left-4 lg:-left-7 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFFDF8]/95 hover:bg-white text-[#2C210E] border-2 border-[#D4AF37]/80 shadow-[0_10px_25px_rgba(6,63,53,0.18)] backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto"
            >
              <CaretLeft size={20} weight="bold" className="text-[#9E723D] -ml-0.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextTemplate();
              }}
              aria-label="Next invitation slide"
              className="absolute -right-2 sm:-right-4 lg:-right-7 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFFDF8]/95 hover:bg-white text-[#2C210E] border-2 border-[#D4AF37]/80 shadow-[0_10px_25px_rgba(6,63,53,0.18)] backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto"
            >
              <CaretRight size={20} weight="bold" className="text-[#9E723D] -mr-0.5" />
            </button>

            {/* Right Column: 3D Phone Showcase */}
            <motion.div
              style={{
                rotateX: isMobile || prefersReducedMotion ? 0 : stageTiltX,
                rotateY: isMobile || prefersReducedMotion ? 0 : stageTiltY,
              }}
              onPanStart={handlePanStart}
              onPanEnd={handlePanEnd}
              className="relative w-full h-[410px] sm:h-[480px] md:h-[530px] lg:h-[570px] xl:h-[600px] flex items-center justify-center [perspective:1400px] select-none touch-pan-y cursor-grab active:cursor-grabbing"
            >
              {/* Staggered 3D Device Cluster (Left Peek + Monumental Center Frame + Right Peek) */}
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
                    y = isMobile ? -6 : -8;
                    z = isMobile ? 35 : 70;
                    rotY = 0;
                    rotZ = 0;
                    scale = isMobile ? 1 : 1.05;
                    opacity = 1;
                    zIndex = 40;
                  } else if (isLeft1) {
                    x = isMobile ? -105 : isTablet ? -165 : -210;
                    y = isMobile ? 10 : 16;
                    z = isMobile ? -25 : -40;
                    rotY = isMobile ? 14 : 16;
                    rotZ = -1.5;
                    scale = isMobile ? 0.85 : 0.88;
                    opacity = isMobile ? 0.7 : 0.9;
                    zIndex = 20;
                  } else if (isRight1) {
                    x = isMobile ? 105 : isTablet ? 165 : 210;
                    y = isMobile ? 10 : 16;
                    z = isMobile ? -25 : -40;
                    rotY = isMobile ? -14 : -16;
                    rotZ = 1.5;
                    scale = isMobile ? 0.85 : 0.88;
                    opacity = isMobile ? 0.7 : 0.9;
                    zIndex = 20;
                  } else {
                    opacity = 0;
                    scale = 0.5;
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
                        stiffness: 240,
                        damping: 26,
                        mass: 0.8,
                      }}
                      onClick={() => {
                        if (isDraggingRef.current) return;
                        if (isLeft1) prevTemplate();
                        else if (isRight1) nextTemplate();
                      }}
                      className={`absolute w-[180px] sm:w-[220px] md:w-[250px] lg:w-[270px] xl:w-[285px] aspect-[9/18.8] rounded-[30px] sm:rounded-[36px] lg:rounded-[42px] p-[5px] sm:p-[6px] bg-[#1a1714] border-[3px] ${
                        isCenter
                          ? "border-[#D4AF37] shadow-[0_32px_75px_-12px_rgba(6,63,53,0.42),0_0_36px_rgba(212,175,55,0.22)] ring-1 ring-amber-200/50 cursor-default"
                          : "border-[#C49A5A]/50 shadow-2xl hover:border-[#D4AF37] cursor-pointer pointer-events-auto"
                      } backdrop-blur-md transition-colors duration-300`}
                      style={{
                        zIndex,
                        transformStyle: "preserve-3d",
                        pointerEvents: isCenter ? "auto" : "auto",
                      }}
                    >
                      {/* Dynamic Island Notch */}
                      <div
                        className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-2.5 sm:h-3 rounded-full bg-black flex items-center justify-between px-2 z-40 border border-white/10"
                        aria-hidden="true"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#063F35] ring-1 ring-white/20" />
                        <div className="w-1 h-1 rounded-full bg-emerald-400" />
                      </div>

                      {/* Concentric Inner Screen: 100% Unobstructed Artwork / Video Showcase */}
                      <div className="relative w-full h-full rounded-[24px] sm:rounded-[30px] lg:rounded-[36px] overflow-hidden bg-black flex flex-col justify-between">
                        {/* Media Artwork Background */}
                        <div className="absolute inset-0 w-full h-full">
                          <PhoneMedia
                            video={inv.video}
                            image={inv.image}
                          />

                          {/* Soft bottom vignette to provide contrast for the floating button */}
                          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Top: 100% Clear Artwork View */}
                        <div className="flex-1" />

                        {/* Bottom CTA: Golden Capsule Button on Active Center Phone Only */}
                        {isCenter && (
                          <div className="relative z-30 pb-4 sm:pb-5 px-4 flex justify-center">
                            <Link
                              href={`/templates/${inv.slug}`}
                              className="px-6 sm:px-7 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#DFB873] via-[#ECC985] to-[#D4A759] text-[#2C210E] font-bold text-[9px] sm:text-[10px] tracking-wider uppercase shadow-[0_8px_20px_rgba(212,167,89,0.35)] flex items-center justify-center gap-1.5 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                            >
                              <span>VIEW INVITATION</span>
                              <ArrowRight size={11} weight="bold" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. BOTTOM ROYAL SCALLOPED TRUST BAR (PIXEL PERFECT MOCKUP) */}
      {/* ========================================================= */}
      <div className="relative z-20 w-full max-w-6xl mx-auto mt-10 lg:mt-14 px-3 sm:px-6">
        <div className="relative filter drop-shadow-[0_12px_36px_rgba(40,30,15,0.08)]">
          {/* Authentic Royal Scalloped Cartouche Frame (Left Scallop + Center Fill + Right Scallop) */}
          <div className="absolute inset-0 flex items-stretch pointer-events-none z-0">
            {/* Left Scalloped Ogee Bracket Cap */}
            <div className="w-7 sm:w-9 h-full shrink-0">
              <svg
                viewBox="0 0 36 76"
                preserveAspectRatio="none"
                className="w-full h-full block"
              >
                <path
                  d="M 36 1 L 28 1 C 20 1 14 18 1 38 C 14 58 20 75 28 75 L 36 75 Z"
                  fill="#FCF8F1"
                  stroke="#C5A267"
                  strokeWidth="1.2"
                />
                <path
                  d="M 36 4.5 L 28 4.5 C 22 4.5 16 19 5 38 C 16 57 22 71.5 28 71.5 L 36 71.5"
                  fill="none"
                  stroke="#C5A267"
                  strokeOpacity="0.45"
                  strokeWidth="0.9"
                />
              </svg>
            </div>

            {/* Center Panel with Double Gold Hairline Border */}
            <div className="relative flex-1 bg-[#FCF8F1] border-t-[1.2px] border-b-[1.2px] border-[#C5A267]">
              {/* Inner top & bottom hairline borders */}
              <div className="absolute top-[3.5px] left-0 right-0 h-[0.9px] bg-[#C5A267]/45" />
              <div className="absolute bottom-[3.5px] left-0 right-0 h-[0.9px] bg-[#C5A267]/45" />
            </div>

            {/* Right Scalloped Ogee Bracket Cap */}
            <div className="w-7 sm:w-9 h-full shrink-0">
              <svg
                viewBox="0 0 36 76"
                preserveAspectRatio="none"
                className="w-full h-full block"
              >
                <path
                  d="M 0 1 L 8 1 C 16 1 22 18 35 38 C 22 58 16 75 8 75 L 0 75 Z"
                  fill="#FCF8F1"
                  stroke="#C5A267"
                  strokeWidth="1.2"
                />
                <path
                  d="M 0 4.5 L 8 4.5 C 14 4.5 20 19 31 38 C 20 57 14 71.5 8 71.5 L 0 71.5"
                  fill="none"
                  stroke="#C5A267"
                  strokeOpacity="0.45"
                  strokeWidth="0.9"
                />
              </svg>
            </div>
          </div>

          {/* Inner Content Layout (Horizontally Aligned, Exactly like Reference Mockup) */}
          <div className="relative z-10 py-3.5 sm:py-4 px-6 sm:px-8 lg:px-11 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 sm:gap-6 lg:gap-4">
            {/* Stat 1: 5000+ Happy Couples */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Heart size={16} weight="fill" className="text-[#A3753C] shrink-0" />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl sm:text-2xl text-[#1E1810] leading-none">
                  5000+
                </span>
                <span className="text-[11px] sm:text-xs text-[#6E6659] font-sans font-medium mt-0.5">
                  Happy Couples
                </span>
              </div>
            </div>

            {/* Stat 2: 1M+ Invitations Shared */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <PaperPlaneTilt size={16} weight="fill" className="text-[#A3753C] shrink-0" />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl sm:text-2xl text-[#1E1810] leading-none">
                  1M+
                </span>
                <span className="text-[11px] sm:text-xs text-[#6E6659] font-sans font-medium mt-0.5">
                  Invitations Shared
                </span>
              </div>
            </div>

            {/* Stat 3: 4.9 ★ Rated by Couples + 5 Distinct Avatars */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <UsersThree size={18} weight="fill" className="text-[#A3753C] shrink-0" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1 leading-none">
                  <span className="font-serif font-bold text-xl sm:text-2xl text-[#1E1810] leading-none">
                    4.9
                  </span>
                  <Star size={13} weight="fill" className="text-[#A3753C]" />
                </div>
                <span className="text-[11px] sm:text-xs text-[#6E6659] font-sans font-medium mt-0.5">
                  Rated by Couples
                </span>
              </div>

              {/* 5 Distinct Overlapping Couple Avatars */}
              <div className="flex items-center -space-x-2 sm:-space-x-2.5 ml-1 sm:ml-2 shrink-0">
                {[1, 2, 3, 4, 5].map((num) => (
                  <img
                    key={num}
                    src={`/images/avatar-${num}.jpg`}
                    alt={`Couple ${num}`}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-xs object-cover"
                  />
                ))}
              </div>
            </div>

            {/* Vertical Hairline Divider */}
            <div className="hidden lg:block w-px h-10 bg-[#C5A267]/40 shrink-0" />

            {/* Testimonial Quote */}
            <div className="flex items-start gap-2.5 max-w-sm w-full lg:w-auto">
              <span className="font-serif text-[#A3753C] text-2xl sm:text-3xl leading-none shrink-0 font-bold -mt-0.5 select-none">
                “
              </span>
              <div className="flex flex-col">
                <p className="font-serif italic text-xs sm:text-[13px] text-[#2C241B] leading-snug">
                  “Made our wedding announcement feel so special and personal!”
                </p>
                <span className="text-[10.5px] sm:text-[11px] text-[#786F62] font-sans font-medium mt-0.5">
                  — Real Couple
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. WATCH PREVIEW CINEMATIC MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md sm:max-w-lg aspect-[9/16] max-h-[85vh] rounded-[32px] overflow-hidden bg-black border-2 border-[#C49A5A] shadow-2xl flex flex-col justify-between p-4"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="absolute top-4 right-4 z-40 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white/90 border border-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                aria-label="Close Preview"
              >
                <X size={16} weight="bold" />
              </button>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (modalVideoRef.current) {
                    modalVideoRef.current.muted = !modalVideoRef.current.muted;
                    setIsAudioMuted(modalVideoRef.current.muted);
                  }
                }}
                className="absolute top-4 left-4 z-40 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black text-white/90 border border-white/20 backdrop-blur-md flex items-center gap-1.5 text-xs cursor-pointer font-sans"
              >
                {isAudioMuted ? (
                  <>
                    <SpeakerSlash size={14} weight="bold" />
                    <span>Unmute</span>
                  </>
                ) : (
                  <>
                    <SpeakerHigh size={14} weight="bold" />
                    <span>Sound On</span>
                  </>
                )}
              </button>

              {/* Video Element */}
              <video
                ref={modalVideoRef}
                key={activeTemplate.id}
                src={activeTemplate.video || "/videos/royal-prestige.mp4"}
                autoPlay
                loop
                muted={isAudioMuted}
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Bottom Card in Modal */}
              <div className="relative z-30 mt-auto p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-[#C49A5A]/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-[#E1C98E]">
                    {activeTemplate.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-white/90">
                    {activeTemplate.price}
                  </span>
                </div>
                <Link
                  href={`/templates/${activeTemplate.slug}`}
                  onClick={() => setIsPreviewOpen(false)}
                  className="w-full py-2.5 rounded-full bg-[#063F35] hover:bg-[#032A23] text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Select This Invitation</span>
                  <ArrowRight size={13} weight="bold" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
