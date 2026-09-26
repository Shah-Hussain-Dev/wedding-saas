"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import confetti from "canvas-confetti";
import {
  Sparkle,
  CalendarBlank,
  Clock,
  MapPin,
  Heart,
  X,
  CheckCircle,
  CaretLeft,
  CaretRight,
  Copy,
  ArrowSquareOut,
  FlowerLotus,
} from "@phosphor-icons/react";
import { FloatingPetals } from "@/components/invitation/FloatingPetals";
import { LuxuryAudioDock } from "@/components/invitation/LuxuryAudioDock";
import { ShapedScratchCard } from "@/components/invitation/ShapedScratchCard";
import defaultData from "./data.json";
import "./style.css";

interface ModernMinimalProps {
  data?: any;
}

export default function ModernMinimal({ data }: ModernMinimalProps) {
  const brideName = data?.brideName || defaultData.couple.brideName;
  const groomName = data?.groomName || defaultData.couple.groomName;
  const rawDate = data?.weddingDate || defaultData.weddingDate;
  const weddingDateObj = new Date(rawDate);
  const dayStr = weddingDateObj.toLocaleDateString("en-IN", { weekday: "long" });
  const dateStr = weddingDateObj.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
  const yearStr = weddingDateObj.getFullYear().toString();
  const hashtag = data?.hashtag || defaultData.hashtag || `#${brideName}${groomName}Forever`.replace(/\s+/g, "");

  const venueName = data?.venueName || data?.venue?.name || defaultData.venue.name;
  const venueAddress = data?.venueAddress || data?.venue?.address || defaultData.venue.address;
  const venueMapUrl = data?.venue?.mapUrl || defaultData.venue.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(venueName + " " + venueAddress)}`;

  const galleryImages: string[] = (data?.gallery && data.gallery.length > 0)
    ? data.gallery
    : defaultData.gallery;

  const rawEvents = data?.events || data?.eventsJson;
  const events = (rawEvents && rawEvents.length > 0) ? rawEvents : defaultData.events;

  // Opening State
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Scratch Card Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const isDrawingRef = useRef(false);
  const scratchedPixelsRef = useRef(0);
  const confettiFiredRef = useRef(false);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpAttending, setRsvpAttending] = useState("yes");
  const [rsvpGuests, setRsvpGuests] = useState("2");
  const [rsvpWishes, setRsvpWishes] = useState("");
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parallax Scroll Tracking (Window-level to prevent unhydrated ref errors)
  const { scrollYProgress } = useScroll();
  const heroParallaxY = useTransform(scrollYProgress, [0, 0.25], ["0%", "18%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.08]);
  const mandalaRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scratchCardY = useTransform(scrollYProgress, [0.15, 0.45], ["20px", "-20px"]);
  const galleryCol1Y = useTransform(scrollYProgress, [0.35, 0.75], ["18px", "-18px"]);
  const galleryCol2Y = useTransform(scrollYProgress, [0.35, 0.75], ["-18px", "18px"]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch((e) => console.log("Audio play error:", e));
    }
  };

  const handleOpenInvitation = () => {
    setIsOpening(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#d4af37", "#f3e5ab", "#aa771c", "#ffffff"],
    });

    setTimeout(() => {
      setIsOpen(true);
    }, 1300);
  };

  // Scratch Card Canvas Drawing Logic
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Clean champagne metallic brush overlay
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#e8dfd8");
    gradient.addColorStop(0.3, "#f4ece1");
    gradient.addColorStop(0.6, "#d4af37");
    gradient.addColorStop(1, "#c5a059");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative geometric border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Text on Scratch Surface
    ctx.fillStyle = "#222222";
    ctx.font = "bold 13px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✦ SCRATCH TO REVEAL MUHURAT ✦", width / 2, height / 2 - 4);
    ctx.fillStyle = "#555555";
    ctx.font = "11px Montserrat, sans-serif";
    ctx.fillText("Auspicious Vivah Date & Timings", width / 2, height / 2 + 14);
  };

  useEffect(() => {
    if (isOpen && !isScratched) {
      initCanvas();
    }
  }, [isOpen]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2, false);
    ctx.fill();

    scratchedPixelsRef.current += 1;
    if (scratchedPixelsRef.current > 35 && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      setIsScratched(true);
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.65 },
        colors: ["#d4af37", "#f5d77f", "#333333", "#ffffff"],
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  // Lightbox Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIdx === null) return;
      if (e.key === "Escape") setActivePhotoIdx(null);
      if (e.key === "ArrowRight") {
        setActivePhotoIdx((prev) => (prev !== null ? (prev + 1) % galleryImages.length : 0));
      }
      if (e.key === "ArrowLeft") {
        setActivePhotoIdx((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIdx, galleryImages.length]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${venueName}, ${venueAddress}`);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: data?.id || "modern-minimal-demo",
          guestName: rsvpName,
          phone: rsvpPhone,
          attending: rsvpAttending === "yes",
          guestCount: parseInt(rsvpGuests) || 1,
          notes: rsvpWishes,
        }),
      });
    } catch (err) {
      console.error("RSVP submit error:", err);
    }
    setIsRsvpSubmitted(true);
    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.6 },
      colors: ["#d4af37", "#f3e5ab", "#333333"],
    });
  };

  return (
    <div className="min-h-screen bg-minimal-linen text-[#1c1a17] overflow-x-hidden relative font-montserrat antialiased selection:bg-[#d4af37]/20 selection:text-[#1c1a17]">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src={data?.musicTrack || defaultData.musicTrack}
        loop
        preload="auto"
      />

      {/* Floating Dynamic Particle Petals Engine (Champagne Gold Dust & Lotus Pollen) */}
      {isOpen && <FloatingPetals theme="gold-dust" density={22} />}

      {/* Floating Luxury Audio Dock Widget */}
      {isOpen && (
        <LuxuryAudioDock
          isPlaying={isPlayingMusic}
          onToggle={toggleMusic}
          trackTitle="Meditative Sitar Symphony"
          theme="champagne"
        />
      )}

      {/* 1. CRAZY OPENING ANIMATION: 3D LUXURY ARCHITECTURAL ORIGAMI ENVELOPE */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="envelope-screen"
            exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#141414] px-4 overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/40 via-transparent to-transparent" />

            {/* Sacred Vedic Tag Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center mb-8 relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#d4af37]/40 backdrop-blur-md mb-2">
                <FlowerLotus size={16} weight="fill" className="text-[#d4af37]" />
                <span className="font-cormorant text-base font-bold tracking-[0.25em] text-[#fff2be]">
                  || श्री गणेशाय नमः ||
                </span>
                <FlowerLotus size={16} weight="fill" className="text-[#d4af37]" />
              </div>
              <h2 className="text-white text-xs font-light tracking-[0.3em] uppercase text-stone-300">
                You Are Cordially Invited
              </h2>
            </motion.div>

            {/* 3D Envelope Container */}
            <div className="envelope-3d-wrapper relative w-full max-w-sm aspect-[4/3] flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="envelope-card relative w-full h-full rounded-2xl bg-[#faf7f2] border border-[#d4af37]/30 flex flex-col items-center justify-center p-6 text-center shadow-2xl overflow-hidden"
              >
                {/* Envelope Top Flap Triangle */}
                <div
                  className={`envelope-top-flap absolute top-0 left-0 right-0 h-1/2 bg-[#ede6dc] border-b border-[#d4af37]/40 shadow-md ${
                    isOpening ? "open" : ""
                  }`}
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  }}
                />

                {/* Inner Monogram Details */}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#8c7b64] font-semibold mb-2">
                    Auspicious Vivah
                  </span>
                  <h1 className="text-3xl md:text-4xl font-cormorant font-bold tracking-tight text-[#1a1a1a] mb-1">
                    {brideName} & {groomName}
                  </h1>
                  <p className="text-xs text-[#8c7b64] tracking-widest font-light font-cormorant text-sm">
                    {dateStr} • {yearStr}
                  </p>
                </div>

                {/* Pure Gold Monogram Stamp Button */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleOpenInvitation}
                  disabled={isOpening}
                  className="monogram-seal-btn absolute z-20 w-16 h-16 rounded-full flex flex-col items-center justify-center cursor-pointer text-[#4a3410] shadow-xl border-2 border-[#fff3cc]"
                  aria-label="Tap to Open Invitation"
                >
                  <span className="text-lg font-bold font-cormorant leading-none">ॐ</span>
                  <span className="text-[8px] font-bold tracking-wider uppercase mt-0.5">Open</span>
                </motion.button>
              </motion.div>
            </div>

            {/* Footer Prompt */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 text-xs text-stone-400 tracking-[0.25em] uppercase font-light"
            >
              ✦ Tap the golden seal to unfold ✦
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN INVITATION BODY */}
      {isOpen && (
        <main className="relative">
          {/* Parallax Rotating Sacred Mandala Backdrop */}
          <motion.div
            style={{ rotate: mandalaRotate }}
            className="pointer-events-none fixed -top-40 -right-40 w-[600px] h-[600px] opacity-[0.04] z-0 animate-slow-spin"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-current text-[#996515]" fill="none" strokeWidth="0.5">
              <circle cx="50" cy="50" r="45" />
              <circle cx="50" cy="50" r="35" />
              <circle cx="50" cy="50" r="25" />
              <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" />
            </svg>
          </motion.div>

          {/* ----------------------------------------------------
              HERO SECTION (PERFECT FOR BOTH DESKTOP & MOBILE)
              ---------------------------------------------------- */}
          <section
            className="relative min-h-[95dvh] flex flex-col justify-center px-4 py-8 md:py-16 max-w-6xl mx-auto overflow-hidden"
          >
            {/* DESKTOP HERO: Grand Split Layout */}
            <div className="hidden md:grid md:grid-cols-12 gap-8 items-center z-10 my-auto">
              {/* Left Column */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9 }}
                className="col-span-7 space-y-6 text-left"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full champagne-glass-shell border border-[#d4af37]/35 shadow-sm">
                  <FlowerLotus size={16} weight="fill" className="text-[#b8860b]" />
                  <span className="font-cormorant text-base font-bold tracking-[0.25em] text-[#8c6d23]">
                    || श्री गणेशाय नमः ||
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-[#8c7b64] font-semibold block mb-2">
                    Contemporary Wedding Celebration
                  </span>
                  <h1 className="text-6xl lg:text-7xl font-cormorant font-bold text-[#1c1a17] leading-[1.05]">
                    {brideName} <br />
                    <span className="font-rozha text-3xl text-[#b8860b] italic my-1 inline-block">&</span> <br />
                    {groomName}
                  </h1>
                </div>

                <div className="border-l-2 border-[#d4af37]/40 pl-4 py-1 space-y-1">
                  <p className="font-cormorant text-lg text-[#6d5725] font-semibold">
                    {defaultData.couple.brideParents}
                  </p>
                  <p className="font-cormorant text-lg text-[#6d5725] font-semibold">
                    {defaultData.couple.groomParents}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="px-5 py-2.5 rounded-2xl champagne-glass-shell flex items-center gap-2.5">
                    <CalendarBlank size={18} className="text-[#b8860b]" />
                    <span className="text-xs font-semibold text-[#1c1a17]">{dateStr}, {yearStr}</span>
                  </div>

                  <div className="px-5 py-2.5 rounded-2xl champagne-glass-shell flex items-center gap-2.5">
                    <Clock size={18} className="text-[#b8860b]" />
                    <span className="text-xs font-semibold text-[#1c1a17]">{data?.weddingTime || defaultData.weddingTime}</span>
                  </div>

                  <div className="px-5 py-2.5 rounded-2xl champagne-glass-shell flex items-center gap-2.5">
                    <MapPin size={18} className="text-[#b8860b]" />
                    <span className="text-xs font-semibold text-[#1c1a17]">{venueName}</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Modern Arch Couple Portrait */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                style={{ y: heroParallaxY }}
                className="col-span-5 relative"
              >
                <div className="relative w-full aspect-[4/5] rounded-[2.5rem] p-2 bg-gradient-to-b from-[#d4af37] via-[#faf7f2] to-[#d4af37] shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-[#d4af37]/30">
                  <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-stone-100 relative">
                    <img
                      src={data?.heroImageUrl || defaultData.gallery[0]}
                      alt={`${brideName} and ${groomName}`}
                      className="w-full h-full object-cover object-top filter brightness-[0.98] contrast-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-4 left-4 right-4 text-center py-2 px-3 rounded-xl bg-white/90 backdrop-blur-md border border-[#d4af37]/40 shadow">
                      <span className="text-[10px] uppercase tracking-widest text-[#8c6d23] font-bold">
                        {hashtag}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* MOBILE HERO: 100% Facial Clearance Guarantee Layout */}
            <div className="md:hidden flex flex-col justify-between items-center min-h-[85dvh] text-center w-full">
              {/* Top: Sacred Mantra */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="pt-2 pb-1 z-10 w-full"
              >
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full champagne-glass-shell border border-[#d4af37]/30 shadow-sm">
                  <FlowerLotus size={14} weight="fill" className="text-[#b8860b]" />
                  <span className="font-cormorant text-sm font-semibold tracking-widest text-[#8c6d23]">
                    || श्री गणेशाय नमः ||
                  </span>
                  <FlowerLotus size={14} weight="fill" className="text-[#b8860b]" />
                </div>
              </motion.div>

              {/* Middle: 100% Unobstructed Couple Portrait */}
              <motion.div
                style={{ scale: heroScale, y: heroParallaxY }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative w-full max-w-[320px] aspect-[4/5] my-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-[#d4af37]/30 bg-stone-100"
              >
                <img
                  src={data?.heroImageUrl || defaultData.gallery[0]}
                  alt={`${brideName} and ${groomName}`}
                  className="w-full h-full object-cover object-top filter brightness-[0.98]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </motion.div>

              {/* Bottom: Frosted Champagne Pedestal Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="w-full max-w-sm champagne-glass-shell rounded-2xl p-4 z-10 mt-2 text-center"
              >
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#8c7b64] font-semibold block mb-0.5">
                  Wedding Celebration
                </span>
                <h1 className="text-3xl font-cormorant font-bold text-[#1c1a17] leading-none mb-1">
                  {brideName} <span className="font-rozha text-xl text-[#b8860b]">&</span> {groomName}
                </h1>
                <p className="text-xs text-[#8c6d23] font-medium tracking-wider font-cormorant text-base">
                  {dayStr}, {dateStr}, {yearStr}
                </p>
                <div className="mt-2 pt-2 border-t border-[#d4af37]/20 flex items-center justify-between text-[10px] text-[#6b6255]">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} weight="fill" className="text-[#b8860b]" />
                    {venueName}
                  </span>
                  <span className="font-semibold text-[#8c6d23]">{hashtag}</span>
                </div>
              </motion.div>
            </div>
          </section>

          {/* 3. VEDIC SHLOKA & BLESSING SECTION */}
          <section className="py-16 px-4 bg-minimal-banner border-y border-[#d4af37]/20">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center champagne-glass-shell rounded-3xl p-8 md:p-12 relative overflow-hidden"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#f4ece1] flex items-center justify-center text-[#b8860b] shadow-sm">
                <Sparkle size={24} weight="fill" />
              </div>
              <p className="font-cormorant text-xl md:text-2xl text-[#6d5725] font-bold leading-relaxed tracking-wider italic mb-4">
                {defaultData.vedicMantra}
              </p>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto my-4" />
              <p className="text-xs md:text-sm text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
                {defaultData.quote}
              </p>
              <div className="mt-6 text-[10px] uppercase tracking-[0.25em] text-[#8c7b64] font-bold">
                || सुमुहूर्त सावधान ||
              </div>
            </motion.div>
          </section>

          {/* 4. INTERACTIVE SCRATCH CARD: ARCHITECTURAL OCTAGON */}
          <section
            className="py-20 px-4 max-w-4xl mx-auto text-center"
          >
            <motion.div style={{ y: scratchCardY }}>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8c6d23] block mb-2">
                Auspicious Timing
              </span>
              <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-[#1c1a17] mb-8">
                Shubh Vivah Muhurat
              </h2>

              <ShapedScratchCard
                shape="octagon"
                theme="champagne"
                dateStr={dateStr}
                dayStr={dayStr}
                yearStr={yearStr}
                timeStr={data?.weddingTime || defaultData.weddingTime}
                badgeText="✦ Shubh Vivah Muhurat ✦"
              />
            </motion.div>
          </section>

          {/* 5. VEDIC CEREMONIES & ITINERARY */}
          <section className="py-20 px-4 max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8c6d23] block mb-2">
                Celebration Flow
              </span>
              <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-[#1c1a17]">
                Wedding Ceremonies
              </h2>
            </div>

            {/* 2-Column Desktop Grid / Mobile Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((evt: any, idx: number) => (
                <motion.div
                  key={evt.name || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.6 }}
                  className="champagne-glass-shell rounded-3xl p-6 md:p-8 hover:border-[#b8860b] transition-all group"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#d4af37]/15 text-[#8c6d23]">
                      Ceremony 0{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                      <Clock size={14} className="text-[#b8860b]" />
                      {evt.time}
                    </span>
                  </div>

                  <h3 className="text-2xl font-cormorant font-bold text-[#1c1a17] group-hover:text-[#b8860b] transition-colors mb-2">
                    {evt.name}
                  </h3>

                  {evt.description && (
                    <p className="text-xs text-stone-600 font-light leading-relaxed mb-4">
                      {evt.description}
                    </p>
                  )}

                  <div className="pt-3 border-t border-[#d4af37]/20 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-700">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CalendarBlank size={14} className="text-[#b8860b]" />
                      {evt.date}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-stone-600">
                      <MapPin size={14} className="text-[#b8860b]" />
                      {evt.venue}
                    </span>
                  </div>

                  {evt.dress && (
                    <div className="mt-3 pt-2 text-[11px] text-[#8c6d23] bg-[#f4ece1]/70 px-3 py-1.5 rounded-xl border border-[#d4af37]/20">
                      ✨ <span className="font-semibold">Attire:</span> {evt.dress}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* 6. PHOTO GALLERY WITH PARALLAX & FULL-SCREEN LIGHTBOX */}
          <section
            className="py-20 px-4 bg-minimal-banner border-t border-[#d4af37]/20"
          >
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8c6d23] block mb-2">
                  Captured Memories
                </span>
                <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-[#1c1a17]">
                  The Couple Gallery
                </h2>
              </div>

              {/* Multi-Column Desktop Masonry Grid / Mobile Parallax */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {galleryImages.map((imgUrl, idx) => (
                  <motion.div
                    key={idx}
                    style={{ y: idx % 2 === 0 ? galleryCol1Y : galleryCol2Y }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setActivePhotoIdx(idx)}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-[#d4af37]/30 bg-stone-200 group"
                  >
                    <img
                      src={imgUrl}
                      alt={`Moment ${idx + 1}`}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                      <span className="px-4 py-1.5 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-wider shadow-md">
                        Expand Photo
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Lightbox Modal */}
          <AnimatePresence>
            {activePhotoIdx !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
              >
                <button
                  onClick={() => setActivePhotoIdx(null)}
                  className="absolute top-6 right-6 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all z-20"
                  aria-label="Close Lightbox"
                >
                  <X size={24} weight="bold" />
                </button>

                <button
                  onClick={() => setActivePhotoIdx((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all z-20"
                  aria-label="Previous Photo"
                >
                  <CaretLeft size={28} weight="bold" />
                </button>

                <button
                  onClick={() => setActivePhotoIdx((prev) => (prev !== null ? (prev + 1) % galleryImages.length : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all z-20"
                  aria-label="Next Photo"
                >
                  <CaretRight size={28} weight="bold" />
                </button>

                <div className="relative max-w-4xl max-h-[85vh] flex flex-col items-center">
                  <img
                    src={galleryImages[activePhotoIdx]}
                    alt={`Enlarged ${activePhotoIdx + 1}`}
                    className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-[#d4af37]/30"
                  />
                  <div className="mt-4 text-center text-stone-300 text-xs tracking-widest font-cormorant text-base">
                    {activePhotoIdx + 1} / {galleryImages.length} • {brideName} & {groomName}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 7. VENUE & DIRECTIONS */}
          <section className="py-20 px-4 max-w-4xl mx-auto text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8c6d23] block mb-2">
              The Destination
            </span>
            <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-[#1c1a17] mb-8">
              Venue & Directions
            </h2>

            <div className="champagne-glass-shell rounded-3xl p-6 md:p-8 text-left">
              <h3 className="text-2xl md:text-3xl font-cormorant font-bold text-[#1c1a17] mb-1">
                {venueName}
              </h3>
              <p className="text-xs md:text-sm text-stone-600 font-light mb-6">
                {venueAddress}
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <a
                  href={venueMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1c1a17] text-[#fcfbfa] text-xs font-semibold hover:bg-[#333] transition-colors shadow-md"
                >
                  <ArrowSquareOut size={16} weight="bold" />
                  Get Google Maps Directions
                </a>

                <button
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-xs font-semibold text-[#1c1a17] border border-[#d4af37]/40 hover:bg-stone-50 transition-colors"
                >
                  <Copy size={16} weight="bold" />
                  {copiedAddress ? "Copied to Clipboard!" : "Copy Address"}
                </button>
              </div>

              <div className="w-full h-64 rounded-2xl overflow-hidden border border-stone-200">
                <iframe
                  title="Venue Location Map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(venueName + " " + venueAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          {/* 8. ON-SITE RSVP (NO EXTERNAL WHATSAPP REDIRECT) */}
          <section className="py-20 px-4 max-w-xl mx-auto text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8c6d23] block mb-2">
              Join the Celebration
            </span>
            <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-[#1c1a17] mb-4">
              Kindly RSVP
            </h2>
            <p className="text-xs text-stone-600 font-light max-w-md mx-auto mb-8">
              Please respond by April 01, 2027 so we may curate a delightful experience for you and your family.
            </p>

            <form
              onSubmit={handleRsvpSubmit}
              className="champagne-glass-shell rounded-3xl p-6 md:p-8 text-left space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="e.g. Anand & Priya Mehta"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-xs focus:outline-none focus:border-[#b8860b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={rsvpPhone}
                  onChange={(e) => setRsvpPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-xs focus:outline-none focus:border-[#b8860b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Will you attend?
                  </label>
                  <select
                    value={rsvpAttending}
                    onChange={(e) => setRsvpAttending(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-xs focus:outline-none focus:border-[#b8860b]"
                  >
                    <option value="yes">Joyfully Attending</option>
                    <option value="no">Regretfully Declining</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rsvpGuests}
                    onChange={(e) => setRsvpGuests(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-xs focus:outline-none focus:border-[#b8860b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Blessings & Wishes for the Couple
                </label>
                <textarea
                  rows={3}
                  value={rsvpWishes}
                  onChange={(e) => setRsvpWishes(e.target.value)}
                  placeholder="Share your warm thoughts, blessings or song requests..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-xs focus:outline-none focus:border-[#b8860b] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#1c1a17] text-[#fcfbfa] text-xs font-bold uppercase tracking-widest hover:bg-[#333] transition-colors shadow-lg mt-2"
              >
                Submit RSVP Confirmation
              </button>
            </form>
          </section>

          {/* RSVP Confirmation Modal */}
          <AnimatePresence>
            {isRsvpSubmitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-[#d4af37]/40"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f4ece1] flex items-center justify-center text-[#b8860b]">
                    <CheckCircle size={32} weight="fill" />
                  </div>
                  <h3 className="text-2xl font-cormorant font-bold text-[#1c1a17] mb-2">
                    RSVP Confirmed!
                  </h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed mb-6">
                    Thank you, <strong className="font-semibold">{rsvpName}</strong>! Your RSVP and heartfelt blessings have been lovingly recorded.
                  </p>
                  <button
                    onClick={() => setIsRsvpSubmitted(false)}
                    className="w-full py-3 rounded-xl bg-[#1c1a17] text-[#fcfbfa] text-xs font-bold uppercase tracking-wider"
                  >
                    Return to Invitation
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 9. FOOTER */}
          <footer className="py-16 px-4 text-center border-t border-[#d4af37]/20 bg-[#f7f4ee]">
            <p className="font-cormorant text-2xl font-bold text-[#1c1a17] mb-1">
              {brideName} & {groomName}
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8c6d23] font-semibold mb-4">
              # {hashtag.replace(/^#/, "")}
            </p>
            <p className="text-[11px] text-stone-500 font-light">
              We look forward to celebrating our sacred journey with you.
            </p>
            <div className="mt-8 text-[9px] text-stone-400 uppercase tracking-widest">
              UnfoldWed • Modern Wedding Experience
            </div>
          </footer>
        </main>
      )}
    </div>
  );
}
