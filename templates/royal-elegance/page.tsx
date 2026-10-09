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

interface RoyalEleganceProps {
  data?: any;
}

export default function RoyalElegance({ data }: RoyalEleganceProps) {
  const brideName = data?.brideName || defaultData.couple.brideName;
  const groomName = data?.groomName || defaultData.couple.groomName;
  const rawDate = data?.weddingDate || defaultData.weddingDate;
  const weddingDateObj = new Date(rawDate);
  const dayStr = weddingDateObj.toLocaleDateString("en-IN", { weekday: "long" });
  const dateStr = weddingDateObj.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
  const yearStr = weddingDateObj.getFullYear().toString();
  const hashtag = data?.hashtag || defaultData.hashtag || `#${brideName}Weds${groomName}`.replace(/\s+/g, "");

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
  const heroParallaxY = useTransform(scrollYProgress, [0, 0.25], ["0%", "20%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.08]);
  const scratchCardY = useTransform(scrollYProgress, [0.15, 0.45], ["25px", "-25px"]);
  const galleryCol1Y = useTransform(scrollYProgress, [0.35, 0.75], ["20px", "-20px"]);
  const galleryCol2Y = useTransform(scrollYProgress, [0.35, 0.75], ["-20px", "20px"]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch((e) => console.log("Audio play:", e));
    }
  };

  const handleOpenInvitation = () => {
    setIsOpening(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#5a0e1a", "#d4af37", "#f8eedc", "#c1121f", "#ffffff"],
    });

    setTimeout(() => {
      setIsOpen(true);
    }, 1400);
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

    // Royal Crimson & Gold Parchment Scratch Layer
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#4a0e17");
    gradient.addColorStop(0.4, "#d4af37");
    gradient.addColorStop(0.7, "#7a1c2a");
    gradient.addColorStop(1, "#c5a059");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Kundan Gold Border
    ctx.strokeStyle = "rgba(255, 245, 200, 0.8)";
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Text on Scratch Surface
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✦ SCRATCH TO REVEAL VIVAH DATE ✦", width / 2, height / 2 - 6);
    ctx.fillStyle = "#fef0c7";
    ctx.font = "11px Montserrat, sans-serif";
    ctx.fillText("Shubh Vivah Muhurat & Timings", width / 2, height / 2 + 14);
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
        particleCount: 100,
        spread: 90,
        origin: { y: 0.65 },
        colors: ["#5a0e1a", "#d4af37", "#fcf8f0", "#e63946", "#ffffff"],
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
          invitationId: data?.id || "royal-elegance-demo",
          guestName: rsvpName,
          phone: rsvpPhone,
          attending: rsvpAttending === "yes",
          guestCount: parseInt(rsvpGuests) || 1,
          notes: rsvpWishes,
        }),
      });
    } catch (err) {
      console.error("RSVP submission error:", err);
    }
    setIsRsvpSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#5a0e1a", "#d4af37", "#fcf8f0", "#c1121f"],
    });
  };

  return (
    <div className="min-h-screen bg-silk-parchment text-[#2a0e14] overflow-x-hidden relative font-montserrat antialiased selection:bg-[#5a0e1a]/20 selection:text-[#5a0e1a]">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src={data?.musicTrack || defaultData.musicTrack}
        loop
        preload="auto"
      />

      {/* Floating Dynamic Particle Petals Engine (Rose Petals & Gold Flakes) */}
      {isOpen && <FloatingPetals theme="rose" density={22} />}

      {/* Floating Luxury Audio Dock Widget */}
      {isOpen && (
        <LuxuryAudioDock
          isPlaying={isPlayingMusic}
          onToggle={toggleMusic}
          trackTitle="Maharani Shehnai Raga"
          theme="crimson"
        />
      )}

      {/* 1. CRAZY OPENING ANIMATION: 3D MAHARANI SILK CURTAINS & KUNDAN WAX SEAL */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="maharani-curtains-opening"
            exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#25040a] px-4 overflow-hidden"
          >
            {/* Ambient Background Warm Velvet Glow */}
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/40 via-[#5a0e1a]/40 to-transparent" />

            {/* Sacred Vedic Tag Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center mb-6 relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#420912] border border-[#d4af37]/40 shadow-lg mb-2">
                <FlowerLotus size={16} weight="fill" className="text-[#d4af37]" />
                <span className="font-cormorant text-sm md:text-base font-bold tracking-[0.25em] text-[#fff2be]">
                  || ॐ श्री गणेशाय नमः ||
                </span>
                <FlowerLotus size={16} weight="fill" className="text-[#d4af37]" />
              </div>
              <h2 className="text-[#f7eedb] text-xs font-light tracking-[0.3em] uppercase">
                Royal Heritage Invitation
              </h2>
            </motion.div>

            {/* Curtain Stage Container */}
            <div className="curtain-container relative w-full max-w-md aspect-[3/4] flex items-center justify-center rounded-3xl p-3 bg-gradient-to-b from-[#5a0e1a] via-[#3a060f] to-[#1a0206] border-2 border-[#d4af37]/50 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
              {/* Left Curtain Drape */}
              <div
                className={`curtain-left absolute top-3 bottom-3 left-3 w-[calc(50%-12px)] bg-gradient-to-r from-[#3a060f] to-[#6b1220] rounded-l-2xl border-r border-[#d4af37]/60 flex flex-col justify-between p-4 shadow-2xl z-10 ${
                  isOpening ? "open" : ""
                }`}
              >
                <div className="w-full h-8 border-t-2 border-b border-[#d4af37]/40" />
                <div className="my-auto text-center opacity-30">
                  <span className="text-4xl text-[#d4af37] font-cinzel">⚜</span>
                </div>
                <div className="w-full h-8 border-b-2 border-t border-[#d4af37]/40" />
              </div>

              {/* Right Curtain Drape */}
              <div
                className={`curtain-right absolute top-3 bottom-3 right-3 w-[calc(50%-12px)] bg-gradient-to-l from-[#3a060f] to-[#6b1220] rounded-r-2xl border-l border-[#d4af37]/60 flex flex-col justify-between p-4 shadow-2xl z-10 ${
                  isOpening ? "open" : ""
                }`}
              >
                <div className="w-full h-8 border-t-2 border-b border-[#d4af37]/40" />
                <div className="my-auto text-center opacity-30">
                  <span className="text-4xl text-[#d4af37] font-cinzel">⚜</span>
                </div>
                <div className="w-full h-8 border-b-2 border-t border-[#d4af37]/40" />
              </div>

              {/* Inner Revealed Content Behind Curtains */}
              <div className="relative z-0 flex flex-col items-center justify-center text-center p-6 w-full h-full bg-[#fdfaf5] rounded-2xl border border-[#d4af37]/40 text-[#3b0810]">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#8c5d12] font-semibold mb-2">
                  Vivah Mahotsav
                </span>
                <h1 className="text-3xl md:text-4xl font-cormorant font-bold text-[#5a0e1a] leading-none mb-1">
                  {brideName}
                </h1>
                <span className="text-xl font-rozha text-[#8c5d12] my-0.5">&</span>
                <h1 className="text-3xl md:text-4xl font-cormorant font-bold text-[#5a0e1a] leading-none mb-3">
                  {groomName}
                </h1>
                <p className="text-xs text-[#8c5d12] font-light tracking-widest font-cormorant text-sm">
                  {dateStr} • {yearStr}
                </p>
              </div>

              {/* Center Royal Kundan Seal Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleOpenInvitation}
                disabled={isOpening}
                className="kundan-seal-btn absolute z-30 w-20 h-20 rounded-full flex flex-col items-center justify-center cursor-pointer text-[#fff3cc] border-2 border-[#fff3cc]"
                aria-label="Tap to Open Royal Curtains"
              >
                <span className="text-2xl font-bold font-cormorant leading-none text-[#fff2be]">ॐ</span>
                <span className="text-[8px] font-extrabold tracking-widest uppercase mt-0.5 text-[#fff2be]">Open</span>
              </motion.button>
            </div>

            {/* Tap Prompt */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-6 text-xs text-[#f8eedc] tracking-[0.3em] uppercase font-light animate-pulse"
            >
              ✦ Tap the royal seal to open ✦
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN INVITATION BODY */}
      {isOpen && (
        <main className="relative">
          {/* ----------------------------------------------------
              HERO SECTION (PERFECT FOR BOTH DESKTOP & MOBILE)
              ---------------------------------------------------- */}
          <section
            className="relative min-h-[95dvh] flex flex-col justify-center px-4 py-8 md:py-16 max-w-6xl mx-auto overflow-hidden"
          >
            {/* DESKTOP HERO: Grand Split Layout (Left: Sacred Calligraphy & Info, Right: Royal Framed Couple Portrait) */}
            <div className="hidden md:grid md:grid-cols-12 gap-8 items-center z-10 my-auto">
              {/* Left Column */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9 }}
                className="col-span-7 space-y-6 text-left"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5a0e1a] border border-[#d4af37]/40 shadow-md">
                  <FlowerLotus size={16} weight="fill" className="text-[#d4af37]" />
                  <span className="font-cormorant text-base font-bold tracking-[0.25em] text-[#fff2be]">
                    || ॐ श्री गणेशाय नमः ||
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-[#8c5d12] font-semibold block mb-2">
                    Auspicious Vivah Mahotsav
                  </span>
                  <h1 className="text-6xl lg:text-7xl font-cormorant font-bold text-[#5a0e1a] leading-[1.05]">
                    {brideName} <br />
                    <span className="font-rozha text-3xl text-[#8c5d12] italic my-1 inline-block">&</span> <br />
                    {groomName}
                  </h1>
                </div>

                <div className="border-l-2 border-[#d4af37]/60 pl-4 py-1 space-y-1">
                  <p className="font-cormorant text-lg text-[#5a0e1a] font-semibold">
                    {defaultData.couple.brideParents}
                  </p>
                  <p className="font-cormorant text-lg text-[#5a0e1a] font-semibold">
                    {defaultData.couple.groomParents}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="px-5 py-2.5 rounded-2xl silk-card-shell flex items-center gap-2.5">
                    <CalendarBlank size={18} className="text-[#8c5d12]" />
                    <span className="text-xs font-semibold text-[#5a0e1a]">{dateStr}, {yearStr}</span>
                  </div>

                  <div className="px-5 py-2.5 rounded-2xl silk-card-shell flex items-center gap-2.5">
                    <Clock size={18} className="text-[#8c5d12]" />
                    <span className="text-xs font-semibold text-[#5a0e1a]">{data?.weddingTime || defaultData.weddingTime}</span>
                  </div>

                  <div className="px-5 py-2.5 rounded-2xl silk-card-shell flex items-center gap-2.5">
                    <MapPin size={18} className="text-[#8c5d12]" />
                    <span className="text-xs font-semibold text-[#5a0e1a]">{venueName}</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Royal Framed Couple Portrait */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                style={{ y: heroParallaxY }}
                className="col-span-5 relative"
              >
                <div className="relative w-full aspect-[4/5] rounded-[2.5rem] p-2 bg-gradient-to-b from-[#d4af37] via-[#5a0e1a] to-[#d4af37] shadow-[0_25px_60px_rgba(90,14,26,0.35)] border border-[#fff3cc]/50">
                  <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-[#fdfaf5] relative">
                    <img
                      src={data?.heroImageUrl || defaultData.gallery[0]}
                      alt={`${brideName} and ${groomName}`}
                      className="w-full h-full object-cover object-top filter brightness-[0.98] contrast-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3b0810]/70 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-4 left-4 right-4 text-center py-2 px-3 rounded-xl bg-[#5a0e1a]/90 backdrop-blur-md border border-[#d4af37]/40">
                      <span className="text-[10px] uppercase tracking-widest text-[#fff2be] font-bold">
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
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#5a0e1a] text-[#fff2be] border border-[#d4af37]/40 shadow-md">
                  <FlowerLotus size={14} weight="fill" className="text-[#d4af37]" />
                  <span className="font-cormorant text-sm font-bold tracking-widest">
                    || ॐ श्री गणेशाय नमः ||
                  </span>
                  <FlowerLotus size={14} weight="fill" className="text-[#d4af37]" />
                </div>
              </motion.div>

              {/* Middle: 100% Unobstructed Couple Portrait */}
              <motion.div
                style={{ scale: heroScale, y: heroParallaxY }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative w-full max-w-[320px] aspect-[4/5] my-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-[#d4af37]/50 bg-[#f8eedc]"
              >
                <img
                  src={data?.heroImageUrl || defaultData.gallery[0]}
                  alt={`${brideName} and ${groomName}`}
                  className="w-full h-full object-cover object-top filter brightness-[0.98]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#420912]/60 via-transparent to-transparent pointer-events-none" />
              </motion.div>

              {/* Bottom: Frosted Silk Pedestal Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="w-full max-w-sm silk-card-shell rounded-2xl p-4 z-10 mt-2 text-center shadow-lg"
              >
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#8c5d12] font-semibold block mb-0.5">
                  Shubh Vivah Mahotsav
                </span>
                <h1 className="text-3xl font-cormorant font-bold text-[#5a0e1a] leading-none mb-1">
                  {brideName} <span className="font-rozha text-xl text-[#8c5d12]">&</span> {groomName}
                </h1>
                <p className="text-xs text-[#8c5d12] font-medium tracking-wider font-cormorant text-base">
                  {dayStr}, {dateStr}, {yearStr}
                </p>
                <div className="mt-2 pt-2 border-t border-[#d4af37]/25 flex items-center justify-between text-[10px] text-[#5a0e1a]">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin size={12} weight="fill" className="text-[#8c5d12]" />
                    {venueName}
                  </span>
                  <span className="font-semibold text-[#8c5d12]">{hashtag}</span>
                </div>
              </motion.div>
            </div>
          </section>

          {/* 3. VEDIC SHLOKA & BLESSING SECTION */}
          <section className="py-16 px-4 bg-palace-banner border-y border-[#d4af37]/30">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center silk-card-shell rounded-3xl p-8 md:p-12 relative overflow-hidden"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#5a0e1a] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shadow-lg">
                <Sparkle size={24} weight="fill" />
              </div>
              <p className="font-cormorant text-xl md:text-2xl text-[#5a0e1a] font-bold leading-relaxed tracking-wider italic mb-4">
                {defaultData.vedicMantra}
              </p>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto my-4" />
              <p className="text-xs md:text-sm text-[#4a2e1b] font-light leading-relaxed max-w-2xl mx-auto">
                {defaultData.quote}
              </p>
              <div className="mt-6 text-[10px] uppercase tracking-[0.25em] text-[#8c5d12] font-bold">
                || मङ्गलम् भगवान विष्णुः मङ्गलम् गरुडध्वजः ||
              </div>
            </motion.div>
          </section>

          {/* 4. INTERACTIVE SCRATCH CARD: SACRED KUNDAN HEART */}
          <section
            className="py-20 px-4 max-w-4xl mx-auto text-center"
          >
            <motion.div style={{ y: scratchCardY }}>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8c5d12] block mb-2">
                Auspicious Vivah Date
              </span>
              <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-[#5a0e1a] mb-8">
                Shubh Vivah Muhurat
              </h2>

              <ShapedScratchCard
                shape="heart"
                theme="crimson"
                dateStr={dateStr}
                dayStr={dayStr}
                yearStr={yearStr}
                timeStr={data?.weddingTime || defaultData.weddingTime}
                badgeText="✦ Saat Pheras & Hastamelap ✦"
              />
            </motion.div>
          </section>

          {/* 5. VEDIC CEREMONIES & ITINERARY */}
          <section className="py-20 px-4 max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8c5d12] block mb-2">
                Sacred Traditions
              </span>
              <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-[#5a0e1a]">
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
                  className="silk-card-shell rounded-3xl p-6 md:p-8 hover:border-[#5a0e1a] transition-all group"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#5a0e1a] text-[#fff2be]">
                      Rasam 0{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-[#8c5d12] flex items-center gap-1">
                      <Clock size={14} className="text-[#8c5d12]" />
                      {evt.time}
                    </span>
                  </div>

                  <h3 className="text-2xl font-cormorant font-bold text-[#5a0e1a] group-hover:text-[#8c5d12] transition-colors mb-2">
                    {evt.name}
                  </h3>

                  {evt.description && (
                    <p className="text-xs text-[#523e32] font-light leading-relaxed mb-4">
                      {evt.description}
                    </p>
                  )}

                  <div className="pt-3 border-t border-[#d4af37]/25 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5a0e1a]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CalendarBlank size={14} className="text-[#8c5d12]" />
                      {evt.date}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-[#8c5d12]">
                      <MapPin size={14} className="text-[#8c5d12]" />
                      {evt.venue}
                    </span>
                  </div>

                  {evt.dress && (
                    <div className="mt-3 pt-2 text-[11px] text-[#5a0e1a] bg-[#f7eedb]/70 px-3 py-1.5 rounded-xl border border-[#d4af37]/30">
                      ✨ <span className="font-semibold text-[#8c5d12]">Attire:</span> {evt.dress}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* 6. PHOTO GALLERY WITH PARALLAX & FULL-SCREEN LIGHTBOX */}
          <section
            className="py-20 px-4 bg-palace-banner border-t border-[#d4af37]/30"
          >
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8c5d12] block mb-2">
                  Memories & Love
                </span>
                <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-[#5a0e1a]">
                  Couple Gallery
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
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-[#d4af37]/40 bg-[#f8eedc] group"
                  >
                    <img
                      src={imgUrl}
                      alt={`Moment ${idx + 1}`}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#420912]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                      <span className="px-4 py-1.5 rounded-full bg-[#5a0e1a] text-[#fff2be] text-[10px] font-bold uppercase tracking-wider shadow-lg">
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
                    className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-[#d4af37]/40"
                  />
                  <div className="mt-4 text-center text-[#fff2be] text-xs tracking-widest font-cormorant text-base">
                    {activePhotoIdx + 1} / {galleryImages.length} • {brideName} & {groomName}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 7. VENUE & DIRECTIONS */}
          <section className="py-20 px-4 max-w-4xl mx-auto text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8c5d12] block mb-2">
              Royal Destination
            </span>
            <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-[#5a0e1a] mb-8">
              Venue & Directions
            </h2>

            <div className="silk-card-shell rounded-3xl p-6 md:p-8 text-left">
              <h3 className="text-2xl md:text-3xl font-cormorant font-bold text-[#5a0e1a] mb-1">
                {venueName}
              </h3>
              <p className="text-xs md:text-sm text-[#523e32] font-light mb-6">
                {venueAddress}
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <a
                  href={venueMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5a0e1a] text-[#fff2be] text-xs font-bold hover:bg-[#7a1c2a] transition-colors shadow-lg"
                >
                  <ArrowSquareOut size={16} weight="bold" />
                  Get Google Maps Directions
                </a>

                <button
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f8eedc] text-xs font-semibold text-[#5a0e1a] border border-[#d4af37]/50 hover:bg-white transition-colors"
                >
                  <Copy size={16} weight="bold" />
                  {copiedAddress ? "Copied to Clipboard!" : "Copy Address"}
                </button>
              </div>

              <div className="w-full h-64 rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-inner">
                <iframe
                  title="Venue Map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(venueName + " " + venueAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          {/* 8. ON-SITE RSVP (NO EXTERNAL WHATSAPP REDIRECT) */}
          <section className="py-20 px-4 max-w-xl mx-auto text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8c5d12] block mb-2">
              Join The Celebrations
            </span>
            <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-[#5a0e1a] mb-4">
              Shubh Vivah RSVP
            </h2>
            <p className="text-xs text-[#523e32] font-light max-w-md mx-auto mb-8">
              Please respond by your earliest convenience so that we may welcome you with royal warmth and hospitality.
            </p>

            <form
              onSubmit={handleRsvpSubmit}
              className="silk-card-shell rounded-3xl p-6 md:p-8 text-left space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#5a0e1a] uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="e.g. Smt. & Shri Rajesh Singhania"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#d4af37]/40 text-xs text-[#2a0e14] focus:outline-none focus:border-[#5a0e1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5a0e1a] uppercase tracking-wider mb-1.5">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={rsvpPhone}
                  onChange={(e) => setRsvpPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#d4af37]/40 text-xs text-[#2a0e14] focus:outline-none focus:border-[#5a0e1a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5a0e1a] uppercase tracking-wider mb-1.5">
                    Will You Attend?
                  </label>
                  <select
                    value={rsvpAttending}
                    onChange={(e) => setRsvpAttending(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#d4af37]/40 text-xs text-[#2a0e14] focus:outline-none focus:border-[#5a0e1a]"
                  >
                    <option value="yes">Joyfully Attending</option>
                    <option value="no">Regretfully Declining</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5a0e1a] uppercase tracking-wider mb-1.5">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rsvpGuests}
                    onChange={(e) => setRsvpGuests(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#d4af37]/40 text-xs text-[#2a0e14] focus:outline-none focus:border-[#5a0e1a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5a0e1a] uppercase tracking-wider mb-1.5">
                  Blessings & Wishes for the Couple
                </label>
                <textarea
                  rows={3}
                  value={rsvpWishes}
                  onChange={(e) => setRsvpWishes(e.target.value)}
                  placeholder="Share your loving wishes, blessings, notes..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#d4af37]/40 text-xs text-[#2a0e14] focus:outline-none focus:border-[#5a0e1a] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#5a0e1a] text-[#fff2be] text-xs font-bold uppercase tracking-widest hover:bg-[#7a1c2a] transition-colors shadow-lg mt-2"
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
                className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="silk-card-shell rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-2 border-[#5a0e1a]"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#5a0e1a] border border-[#d4af37] flex items-center justify-center text-[#fff2be]">
                    <CheckCircle size={36} weight="fill" />
                  </div>
                  <h3 className="text-2xl font-cormorant font-bold text-[#5a0e1a] mb-2">
                    RSVP Confirmed!
                  </h3>
                  <p className="text-xs text-[#523e32] font-light leading-relaxed mb-6">
                    Thank you, <strong className="text-[#5a0e1a]">{rsvpName}</strong>! Your RSVP and heartfelt blessings have been lovingly recorded.
                  </p>
                  <button
                    onClick={() => setIsRsvpSubmitted(false)}
                    className="w-full py-3 rounded-xl bg-[#5a0e1a] text-[#fff2be] text-xs font-bold uppercase tracking-wider"
                  >
                    Return to Invitation
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 9. FOOTER */}
          <footer className="py-16 px-4 text-center border-t border-[#d4af37]/30 bg-[#f8eedc]">
            <p className="font-cormorant text-2xl font-bold text-[#5a0e1a] mb-1">
              {brideName} & {groomName}
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8c5d12] font-semibold mb-4">
              # {hashtag.replace(/^#/, "")}
            </p>
            <p className="text-[11px] text-[#523e32] font-light">
              We warmly await the honor of your presence at our wedding festivities.
            </p>
            <div className="mt-8 text-[9px] text-stone-500 uppercase tracking-widest">
              WedInvites • wedinvites.in
            </div>
          </footer>
        </main>
      )}
    </div>
  );
}
