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
  Play,
  ArrowsClockwise,
  Star,
  MoonStars,
  GlobeHemisphereWest,
  SpeakerHigh,
  SpeakerSlash,
  SpeakerSimpleSlash,
  CaretDown,
  MagnifyingGlassPlus,
} from "@phosphor-icons/react";
import { FloatingPetals } from "@/components/invitation/FloatingPetals";
import { ShapedScratchCard } from "@/components/invitation/ShapedScratchCard";
import defaultData from "./data.json";
import "./style.css";

// Helper to safely resolve audio track URLs (preventing 'track1' / 404 / unsupported source errors)
function resolveAudioTrack(track?: string | null): string {
  if (!track || track === "track1" || track === "track2" || track === "track3" || track === "default" || track === "ambient-sitar" || track.trim() === "") {
    return "/templates/rose-gold-blush/music.mp3";
  }
  if (track.startsWith("/") || track.startsWith("http://") || track.startsWith("https://") || track.startsWith("blob:")) {
    return track;
  }
  return `/audio/${track}.mp3`;
}

interface RoseGoldBlushProps {
  data?: any;
}

export default function RoseGoldBlush({ data }: RoseGoldBlushProps) {
  const brideName = data?.brideName || data?.couple?.brideName || defaultData.couple.brideName;
  const groomName = data?.groomName || data?.couple?.groomName || defaultData.couple.groomName;
  const groomParents = data?.groomParents || data?.couple?.groomParents || defaultData.couple.groomParents;
  const groomEducation = data?.groomEducation || data?.couple?.groomEducation || defaultData.couple.groomEducation;
  const groomProfession = data?.groomProfession || data?.couple?.groomProfession || defaultData.couple.groomProfession;
  const brideParents = data?.brideParents || data?.couple?.brideParents || defaultData.couple.brideParents;
  const brideEducation = data?.brideEducation || data?.couple?.brideEducation || defaultData.couple.brideEducation;
  const brideProfession = data?.brideProfession || data?.couple?.brideProfession || defaultData.couple.brideProfession;

  const rawDate = data?.weddingDate || defaultData.weddingDate;
  const weddingDateObj = new Date(rawDate);
  const dayStr = weddingDateObj.toLocaleDateString("en-IN", { weekday: "long" });
  const dateStr = weddingDateObj.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
  const yearStr = weddingDateObj.getFullYear().toString();
  const hashtag = data?.hashtag || defaultData.hashtag || `#${groomName}Found${brideName}`.replace(/\s+/g, "");

  const venueName = data?.venueName || data?.venue?.name || defaultData.venue.name;
  const venueAddress = data?.venueAddress || data?.venue?.address || defaultData.venue.address;
  const venueMapUrl = data?.venue?.mapUrl || defaultData.venue.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(venueName + " " + venueAddress)}`;

  const videoUrl = data?.videoUrl || defaultData.videoUrl;
  const galleryImages: string[] = (data?.gallery && data.gallery.length > 0)
    ? data.gallery
    : defaultData.gallery;

  const rawEvents = data?.events || data?.eventsJson;
  const events = (rawEvents && rawEvents.length > 0) ? rawEvents : defaultData.events;

  // Faith / Religion selection (Universal / Hindu / Muslim)
  const initialReligion = data?.religion || defaultData.religion || "universal";
  const [selectedReligion, setSelectedReligion] = useState<"universal" | "hindu" | "muslim">(
    initialReligion === "hindu" || initialReligion === "muslim" ? initialReligion : "universal"
  );

  // Video Gate Timing & Content Reveal State
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [isContentRevealed, setIsContentRevealed] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Gallery Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // RSVP Form & Modal State
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpAttending, setRsvpAttending] = useState("yes");
  const [rsvpGuests, setRsvpGuests] = useState("2");
  const [rsvpWishes, setRsvpWishes] = useState("");
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);

  // Lock page and body scrolling until video completes and gate opens
  useEffect(() => {
    if (!isContentRevealed) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [isContentRevealed]);

  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contentSectionRef = useRef<HTMLDivElement | null>(null);

  const audioTrackUrl = resolveAudioTrack(data?.musicTrack || defaultData.musicTrack);

  // Multi-layer Parallax Scroll Tracking
  const { scrollYProgress } = useScroll();
  const backgroundFloatY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const archParallaxY = useTransform(scrollYProgress, [0, 1], ["-2%", "20%"]);

  // Toggle Audio Safely & Unmute
  const toggleAudio = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.src || audio.src.includes("track1") || audio.error) {
      audio.src = audioTrackUrl;
      audio.load();
    }

    if (audio.paused) {
      audio.muted = false;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlayingMusic(true);
          })
          .catch((err) => {
            console.warn("Audio play blocked, fallback to default track:", err);
            audio.src = "/templates/rose-gold-blush/music.mp3";
            audio.muted = false;
            audio.load();
            audio.play().then(() => setIsPlayingMusic(true)).catch(() => {});
          });
      }
    } else {
      audio.pause();
      setIsPlayingMusic(false);
    }
  };

  // Video playback time listener to trigger gate reveal at ~6.4s - 7.0s (increased by 2 seconds)
  const handleVideoTimeUpdate = () => {
    if (!heroVideoRef.current || !isVideoStarted) return;
    const ct = heroVideoRef.current.currentTime;
    setVideoCurrentTime(ct);

    // Gate opens in video and content reveals at ct >= 6.4s AFTER user initiates
    if (ct >= 6.4 && !isContentRevealed) {
      setIsContentRevealed(true);
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.55 },
        colors: ["#f3cf7a", "#d4af37", "#fae4a8", "#ffffff"],
      });
    }
  };

  // Initial user start interaction (Start video + audio + initiate gate journey)
  const handleStartGateExperience = () => {
    setIsVideoStarted(true);
    setIsContentRevealed(false);

    if (heroVideoRef.current) {
      heroVideoRef.current.currentTime = 0;
      heroVideoRef.current.play().catch(() => {});
    }
    if (audioRef.current) {
      const audio = audioRef.current;
      if (!audio.src || audio.src.includes("track1") || audio.error) {
        audio.src = audioTrackUrl;
        audio.load();
      }
      audio.muted = false;
      audio.play().then(() => {
        setIsPlayingMusic(true);
      }).catch((err) => {
        console.warn("Audio autoplay blocked on gate open:", err);
      });
    }

    // Fallback timer with +2 seconds delay
    setTimeout(() => {
      setIsContentRevealed(true);
    }, 6800);
  };

  // Replay Gate Opening
  const handleReplayGate = () => {
    setIsContentRevealed(false);
    setIsVideoStarted(true);
    if (heroVideoRef.current) {
      heroVideoRef.current.currentTime = 0;
      heroVideoRef.current.play().catch(() => {});
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToContent = () => {
    if (contentSectionRef.current) {
      contentSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
          invitationId: data?.id || "preview",
          senderName: rsvpName || "Gracious Guest",
          messageText: `[RSVP - ${rsvpAttending.toUpperCase()}] Attending guests: ${rsvpGuests}. Phone: ${rsvpPhone}. Wishes: ${rsvpWishes}`,
        }),
      });
    } catch {
      // Fallback
    }

    setIsRsvpSubmitted(true);
    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.7 },
      colors: ["#f3cf7a", "#d4af37", "#fae4a8"],
    });
  };

  // Dual Faith Invocation Texts
  const getInvocation = () => {
    switch (selectedReligion) {
      case "hindu":
        return {
          title: "॥ श्री गणेशाय नमः ॥",
          arabicOrSanskrit: "मङ्गलम् भगवान विष्णुः मङ्गलम् गरुडध्वजः । मङ्गलम् पुण्डरीकाक्षः मङ्गलाय तनो हरिः ॥",
          english: "With the divine grace of Almighty God, ancestors, and beloved elders, we solicit your gracious presence.",
          tag: "Vedic Hindu Blessing",
        };
      case "muslim":
        return {
          title: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
          arabicOrSanskrit: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
          english: "“And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them.” (Surah Ar-Rum 30:21)",
          tag: "Sacred Nikah Blessing",
        };
      default:
        return {
          title: "Two Souls · One Sacred Journey",
          arabicOrSanskrit: "“Where there is love, there is life.”",
          english: defaultData.quote,
          tag: "Universal Celebration",
        };
    }
  };

  const invocation = getInvocation();

  // Scattered Gallery Initial Coordinate Presets
  const scatterPresets = [
    { x: -140, y: -40, rotate: -10, scale: 0.92, zIndex: 12 },
    { x: 130, y: -60, rotate: 12, scale: 0.95, zIndex: 14 },
    { x: -90, y: 50, rotate: 6, scale: 0.9, zIndex: 11 },
    { x: 110, y: 70, rotate: -8, scale: 0.94, zIndex: 15 },
    { x: -160, y: 140, rotate: -14, scale: 0.88, zIndex: 10 },
    { x: 140, y: 160, rotate: 9, scale: 0.93, zIndex: 13 },
  ];

  return (
    <div className={`min-h-screen bg-castle-twilight text-[#fcf9f2] font-lora relative selection:bg-[#d4af37]/30 selection:text-[#fae4a8] ${!isContentRevealed ? "h-[100dvh] max-h-screen overflow-hidden touch-none" : "overflow-x-hidden"}`}>
      {/* Ambient Starlight Gold Petals */}
      <FloatingPetals density={16} theme="gold-dust" />

      {/* Synchronized Background Audio Track */}
      <audio
        ref={audioRef}
        src={audioTrackUrl}
        loop
        preload="auto"
        playsInline
        onPlay={() => setIsPlayingMusic(true)}
        onPause={() => setIsPlayingMusic(false)}
      >
        <source src={audioTrackUrl} type="audio/mpeg" />
        <source src="/templates/rose-gold-blush/music.mp3" type="audio/mpeg" />
        <source src="/audio/wedding-ambience.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Toggle (Bottom-Right Circular Gold Button) */}
      <motion.button
        type="button"
        id="rgb-music-toggle-btn"
        className="rgb-music-toggle pointer-events-auto cursor-pointer"
        onClick={toggleAudio}
        aria-label={isPlayingMusic ? "Mute soundtrack" : "Play soundtrack"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {isPlayingMusic ? (
          <>
            <SpeakerHigh size={19} weight="fill" />
            <span className="rgb-soundwave-bars">
              <span />
              <span />
              <span />
            </span>
          </>
        ) : (
          <SpeakerSlash size={19} weight="fill" />
        )}
      </motion.button>

      {/* ----------------------------------------------------
          1. CINEMATIC HERO SECTION (SYNCHRONIZED GATE REVEAL)
             0s - 6.4s: Closed gate with ambient atmosphere
             ~6.4s+: Gate swings open, light radiates, text emerges
             Full-screen fairy-tale castle with gold calligraphy
          ---------------------------------------------------- */}
      <section className="relative w-full h-screen min-h-[100dvh] overflow-hidden flex flex-col justify-between items-center text-center select-none bg-black">
        {/* Full-Screen Hero Background Video (Muted, Paused on initial load until user taps Open) */}
        <video
          ref={heroVideoRef}
          src={videoUrl}
          playsInline
          loop
          muted={true}
          preload="auto"
          onTimeUpdate={handleVideoTimeUpdate}
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.88] contrast-[1.05]"
        />

        {/* Ambient Twilight Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/80 z-[1] pointer-events-none" />

        {/* Top Header: Discreet Faith Switcher Pill */}
        <header className="relative z-20 w-full px-4 pt-4 md:pt-6 flex items-center justify-center max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-black/50 backdrop-blur-md border border-[#d4af37]/30 shadow-lg text-xs font-montserrat">
            <button
              onClick={() => setSelectedReligion("universal")}
              className={`px-3 py-1 rounded-full transition-all text-[10px] md:text-[11px] font-semibold flex items-center gap-1 ${
                selectedReligion === "universal"
                  ? "bg-[#d4af37] text-[#080c14] shadow-sm font-bold"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <GlobeHemisphereWest size={12} weight="bold" />
              Universal
            </button>
            <button
              onClick={() => setSelectedReligion("hindu")}
              className={`px-3 py-1 rounded-full transition-all text-[10px] md:text-[11px] font-semibold flex items-center gap-1 ${
                selectedReligion === "hindu"
                  ? "bg-[#d4af37] text-[#080c14] shadow-sm font-bold"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <FlowerLotus size={12} weight="bold" />
              Hindu
            </button>
            <button
              onClick={() => setSelectedReligion("muslim")}
              className={`px-3 py-1 rounded-full transition-all text-[10px] md:text-[11px] font-semibold flex items-center gap-1 ${
                selectedReligion === "muslim"
                  ? "bg-[#d4af37] text-[#080c14] shadow-sm font-bold"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <MoonStars size={12} weight="bold" />
              Muslim
            </button>
          </div>
        </header>

        {/* ----------------------------------------------------
            GATE OPENING INVITATION PROMPT (Shown ONLY BEFORE user clicks)
            ---------------------------------------------------- */}
        <AnimatePresence>
          {!isVideoStarted && (
            <motion.div
              key="gate-closed-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 my-auto px-4 max-w-lg mx-auto flex flex-col items-center justify-center space-y-4"
            >
              {/* Top Tag */}
              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-black/60 border border-[#d4af37]/40 shadow-lg backdrop-blur-sm">
                <Sparkle size={14} weight="fill" className="text-[#f3cf7a]" />
                <span className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-[#fae4a8] font-semibold font-montserrat">
                  Royal Wedding Invitation
                </span>
                <Sparkle size={14} weight="fill" className="text-[#f3cf7a]" />
              </div>

              {/* Pulsing Central Seal */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartGateExperience}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full rose-gold-seal-btn flex flex-col items-center justify-center text-[#080c14] shadow-[0_0_50px_rgba(212,175,55,0.75)] cursor-pointer mt-3 group"
              >
                <Play size={26} weight="fill" className="ml-1 text-[#080c14] group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black tracking-[0.2em] uppercase text-[#080c14] mt-0.5">
                  Open
                </span>
              </motion.button>

              <p className="text-[11px] md:text-xs font-semibold tracking-[0.2em] text-[#fae4a8] uppercase font-montserrat animate-pulse pt-2 drop-shadow-md">
                ✦ Tap To Unlock The Gates ✦
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ----------------------------------------------------
            CHOREOGRAPHED CONTENT REVEAL (Synchronized at ~5s after click)
            Emerges through opening gates with depth scale & blur reduction
            ---------------------------------------------------- */}
        <AnimatePresence>
          {isContentRevealed && (
            <motion.div
              key="gate-opened-content"
              initial={{ opacity: 0, scale: 0.88, y: 35, filter: "blur(14px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 my-auto px-4 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-1.5 md:space-y-3"
            >
              {/* Heart Icon */}
              <div className="text-white/90 text-sm md:text-base drop-shadow-md">
                🤍
              </div>

              {/* We're getting married */}
              <p className="font-alex-brush text-2xl md:text-4xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] tracking-wide">
                We&apos;re getting married
              </p>

              <div className="text-white/70 text-xs">
                🤍
              </div>

              {/* GROOM BLOCK */}
              <div className="space-y-0.5 pt-1">
                <h1 className="font-great-vibes text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#f3cf7a] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] leading-none">
                  {groomName}
                </h1>
                <p className="font-lora italic text-xs sm:text-sm md:text-base text-stone-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] font-light">
                  {groomParents}
                </p>
                {(groomEducation || groomProfession) && (
                  <p className="text-[11px] sm:text-xs md:text-sm text-stone-300 font-lora drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                    {groomEducation}
                    {groomEducation && groomProfession && " · "}
                    {groomProfession}
                  </p>
                )}
              </div>

              {/* GOLDEN AMPERSAND */}
              <div className="py-0.5">
                <span className="font-great-vibes text-3xl sm:text-4xl md:text-5xl text-[#f3cf7a] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] block">
                  &amp;
                </span>
              </div>

              {/* BRIDE BLOCK */}
              <div className="space-y-0.5">
                <h1 className="font-great-vibes text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#f3cf7a] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] leading-none">
                  {brideName}
                </h1>
                <p className="font-lora italic text-xs sm:text-sm md:text-base text-stone-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] font-light">
                  {brideParents}
                </p>
                {(brideEducation || brideProfession) && (
                  <p className="text-[11px] sm:text-xs md:text-sm text-stone-300 font-lora drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                    {brideEducation}
                    {brideEducation && brideProfession && " · "}
                    {brideProfession}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom SCROLL Indicator (Revealed ONLY after gate content opens) */}
        <AnimatePresence>
          {isContentRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative z-20 pb-6 md:pb-8 flex flex-col items-center gap-1 cursor-pointer"
              onClick={scrollToContent}
            >
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/80 font-montserrat font-semibold drop-shadow-md">
                Scroll
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              >
                <CaretDown size={20} weight="bold" className="text-white/90 drop-shadow-md" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ----------------------------------------------------
          2. CONTINUOUS STORYTELLING CHAPTERS (THEMED TO CASTLE)
          ---------------------------------------------------- */}
      <main ref={contentSectionRef} className="relative z-10 bg-castle-twilight overflow-hidden">
        {/* Ambient Royal Gold Glow Orbs */}
        <div className="pointer-events-none absolute top-40 -left-20 w-[420px] h-[420px] rounded-full bg-[#d4af37]/[0.04] blur-3xl z-0" />
        <div className="pointer-events-none absolute top-[900px] -right-20 w-[480px] h-[480px] rounded-full bg-[#fae4a8]/[0.04] blur-3xl z-0" />
        <div className="pointer-events-none absolute bottom-40 left-1/4 w-[500px] h-[500px] rounded-full bg-[#c98a75]/[0.03] blur-3xl z-0" />

        {/* CHAPTER 1: SACRED BLESSINGS & INVOCATIONS */}
        <section className="py-14 sm:py-20 md:py-28 px-4 max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="castle-card-shell p-6 sm:p-8 md:p-14 rounded-[2rem] sm:rounded-[2.5rem] space-y-5 sm:space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full castle-card-inner border border-[#d4af37]/40 shadow-sm">
              <Sparkle size={14} weight="fill" className="text-[#f3cf7a]" />
              <span className="font-jakarta text-xs md:text-sm font-bold tracking-[0.2em] gold-shimmer-text">
                {invocation.tag}
              </span>
              <Sparkle size={14} weight="fill" className="text-[#f3cf7a]" />
            </div>

            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#fae4a8]">
              {invocation.title}
            </h2>

            <p className="font-amiri text-lg sm:text-xl md:text-2xl text-[#fcf9f2] italic leading-relaxed whitespace-pre-line font-medium">
              {invocation.arabicOrSanskrit}
            </p>

            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto" />

            <p className="font-cormorant text-sm sm:text-base md:text-lg text-stone-200 leading-relaxed max-w-xl mx-auto">
              {invocation.english}
            </p>
          </motion.div>
        </section>

        {/* CHAPTER 2: AUSPICIOUS DATE SCRATCH REVEAL */}
        <section className="py-10 sm:py-14 md:py-20 px-4 max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-bold font-jakarta">
              Auspicious Wedding Muhurat
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#fcf9f2]">
              Scratch To Reveal The Date
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-lora">
              Scratch off the shimmering 24K gold foil to unveil our sacred wedding date
            </p>

            <div className="pt-4 sm:pt-6 flex justify-center">
              <ShapedScratchCard
                dayStr={dayStr}
                dateStr={dateStr}
                yearStr={yearStr}
                timeStr={data?.weddingTime || defaultData.weddingTime}
                badgeText="✦ Sacred Vivah Muhurat ✦"
                theme="champagne"
                shape="heart"
              />
            </div>
          </motion.div>
        </section>

        {/* CHAPTER 3: CELESTIAL COUNTDOWN (FULL-HEIGHT & FULL-WIDTH CRAZY PARALLAX SHOWCASE) */}
        <PalaceParallaxCountdownSection
          targetDate={rawDate}
          dayStr={dayStr}
          dateStr={dateStr}
          yearStr={yearStr}
        />

        {/* CHAPTER 4: ORDER OF CEREMONIES (ROYAL CEREMONY JOURNEY) */}
        <section className="relative z-10">
          <CeremonyJourney
            events={events}
            venueName={venueName}
            venueMapUrl={venueMapUrl}
            dateStr={dateStr}
          />
        </section>

        {/* ----------------------------------------------------
            CHAPTER 5: MEMORY GALLERY (SCATTER -> ASSEMBLE -> 3D REEL)
            ---------------------------------------------------- */}
        <ScatteredMemoriesGallery
          images={galleryImages}
          groomName={groomName}
          brideName={brideName}
          onOpenPhoto={(idx) => setActivePhotoIdx(idx)}
        />

        {/* CHAPTER 6: DESTINATION & VENUE DIRECTIONS */}
        <section className="py-14 sm:py-20 md:py-28 px-4 max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="castle-card-shell p-6 sm:p-8 md:p-14 rounded-[2rem] sm:rounded-[2.5rem] text-center space-y-5 sm:space-y-6 shadow-2xl"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full castle-card-inner border border-[#d4af37]/50 flex items-center justify-center mx-auto text-[#f3cf7a]">
              <MapPin size={28} weight="fill" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-bold font-montserrat">
                Celebration Estate
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-lora font-bold text-[#fcf9f2]">
                {venueName}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-stone-300 max-w-lg mx-auto font-lora">
                {venueAddress}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-3 sm:pt-4">
              <a
                href={venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#d4af37] text-[#080c14] hover:bg-[#fae4a8] transition-all text-xs font-bold font-montserrat flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <ArrowSquareOut size={15} weight="bold" />
                Google Maps Navigation
              </a>

              <button
                onClick={handleCopyAddress}
                className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-full castle-card-inner border border-white/20 hover:border-[#d4af37] text-stone-200 transition-all text-xs font-semibold font-montserrat flex items-center gap-2 cursor-pointer"
              >
                {copiedAddress ? (
                  <>
                    <CheckCircle size={15} weight="fill" className="text-emerald-400" />
                    Address Copied!
                  </>
                ) : (
                  <>
                    <Copy size={15} weight="bold" />
                    Copy Estate Address
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </section>

        {/* CHAPTER 7: RSVP (ROYAL PEDESTAL CTA & MODAL DIALOG) */}
        <section className="py-14 sm:py-20 md:py-24 px-4 max-w-2xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="castle-card-shell p-7 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-lg"
              >
                <Heart size={28} weight="fill" />
              </motion.div>
            </div>

            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-bold font-montserrat block mb-2">
              Your Presence is Our Honour
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-lora font-bold text-[#fcf9f2] mb-3">
              Celebrate With Us
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto mb-8 leading-relaxed font-lora">
              Please honor us with your confirmed attendance and warm blessings as we step into this glorious new chapter of our lives.
            </p>

            <motion.button
              type="button"
              onClick={() => setIsRsvpOpen(true)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto sm:min-w-[260px] mx-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3cf7a] to-[#d4af37] hover:brightness-110 text-[#080c14] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer font-montserrat"
            >
              <Sparkle size={18} weight="fill" className="text-[#080c14]" />
              <span>✦ Confirm Your RSVP ✦</span>
            </motion.button>
          </motion.div>
        </section>

        {/* CHAPTER 8: FOOTER */}
        <footer className="py-14 border-t border-white/10 text-center space-y-4 text-xs text-stone-400">
          <p className="font-lora italic text-base text-[#fae4a8]">
            With boundless love and gratitude, <br />
            The Oberoi &amp; Singhania Families
          </p>
          <p className="text-[11px] font-montserrat tracking-widest text-[#d4af37] font-semibold">
            {hashtag}
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={handleReplayGate}
              className="inline-flex items-center gap-1.5 text-xs text-[#fae4a8] hover:text-white font-semibold cursor-pointer"
            >
              <ArrowsClockwise size={14} /> Replay Gate Opening
            </button>
            <span>·</span>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white font-semibold cursor-pointer"
            >
              Back to Top
            </button>
          </div>
        </footer>
      </main>

      {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
      <AnimatePresence>
        {activePhotoIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button
              onClick={() => setActivePhotoIdx(null)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X size={22} weight="bold" />
            </button>

            <button
              onClick={() => setActivePhotoIdx((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              <CaretLeft size={24} weight="bold" />
            </button>

            <button
              onClick={() => setActivePhotoIdx((prev) => (prev !== null ? (prev + 1) % galleryImages.length : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              <CaretRight size={24} weight="bold" />
            </button>

            <div className="max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src={galleryImages[activePhotoIdx]}
                alt="Portrait detail"
                className="w-full h-full object-contain max-h-[85vh]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ROYAL RSVP MODAL DIALOG (MATCHING EMERALD-QASR) ── */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="rgb-modal-overlay" onClick={() => setIsRsvpOpen(false)}>
            <motion.div
              className="rgb-modal-container font-montserrat"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="rgb-modal-close"
                onClick={() => setIsRsvpOpen(false)}
                aria-label="Close RSVP form"
              >
                <X size={18} weight="bold" />
              </button>

              <div className="text-center mb-6 pt-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-bold font-montserrat block mb-1">
                  {selectedReligion === "muslim" ? "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ" : selectedReligion === "hindu" ? "॥ श्री गणेशाय नमः ॥" : "✦ Sacred Union ✦"}
                </span>
                <h3 className="text-xl sm:text-2xl font-lora font-bold text-[#fcf9f2]">
                  Confirm Attendance
                </h3>
                <p className="text-xs text-stone-300 font-lora mt-1">
                  For {groomName} &amp; {brideName}&apos;s Royal Celebration
                </p>
              </div>

              {isRsvpSubmitted ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37] mx-auto shadow-xl">
                    <CheckCircle size={36} weight="fill" />
                  </div>
                  <h4 className="text-xl font-lora font-bold text-[#fae4a8]">
                    Heartfelt Gratitude!
                  </h4>
                  <p className="text-xs text-stone-300 font-lora leading-relaxed max-w-xs mx-auto">
                    Thank you, <strong>{rsvpName || "Dear Guest"}</strong>! Your RSVP and heartfelt blessings have been lovingly recorded.
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRsvpOpen(false);
                        setIsRsvpSubmitted(false);
                      }}
                      className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#fae4a8] text-[#080c14] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#fae4a8] uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="e.g. Rahul & Sneha Sharma"
                      className="w-full px-4 py-3 rounded-xl castle-card-inner border border-white/15 focus:border-[#d4af37] focus:outline-none text-sm text-white font-lora"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#fae4a8] uppercase tracking-wider mb-1.5">
                      WhatsApp / Phone
                    </label>
                    <input
                      type="tel"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl castle-card-inner border border-white/15 focus:border-[#d4af37] focus:outline-none text-sm text-white font-lora"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#fae4a8] uppercase tracking-wider mb-1.5">
                      Number of Guests
                    </label>
                    <select
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl castle-card-inner border border-white/15 focus:border-[#d4af37] focus:outline-none text-sm text-white font-lora"
                    >
                      <option value="1" className="bg-[#0f172a] text-white">1 Person</option>
                      <option value="2" className="bg-[#0f172a] text-white">2 Persons</option>
                      <option value="3" className="bg-[#0f172a] text-white">3 Persons</option>
                      <option value="4" className="bg-[#0f172a] text-white">4 Persons</option>
                      <option value="5+" className="bg-[#0f172a] text-white">5+ Family Members</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#fae4a8] uppercase tracking-wider mb-1.5">
                      Attending Ceremonies
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setRsvpAttending("yes")}
                        className={`py-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          rsvpAttending === "yes"
                            ? "bg-[#d4af37] text-[#080c14] border-[#d4af37] shadow-lg font-bold"
                            : "castle-card-inner border-white/15 text-stone-300 hover:border-[#d4af37]"
                        }`}
                      >
                        ✨ Joyfully Attending
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpAttending("no")}
                        className={`py-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          rsvpAttending === "no"
                            ? "bg-[#d4af37] text-[#080c14] border-[#d4af37] shadow-lg font-bold"
                            : "castle-card-inner border-white/15 text-stone-300 hover:border-[#d4af37]"
                        }`}
                      >
                        Regretfully Declining
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#fae4a8] uppercase tracking-wider mb-1.5">
                      Warm Wishes &amp; Blessings
                    </label>
                    <textarea
                      rows={3}
                      value={rsvpWishes}
                      onChange={(e) => setRsvpWishes(e.target.value)}
                      placeholder={`Leave your heartfelt blessings for ${groomName} & ${brideName}...`}
                      className="w-full px-4 py-3 rounded-xl castle-card-inner border border-white/15 focus:border-[#d4af37] focus:outline-none text-sm text-white font-lora"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3cf7a] to-[#d4af37] hover:brightness-110 text-[#080c14] text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Sparkle size={16} weight="fill" className="text-[#080c14]" />
                    <span>Submit RSVP</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-Component: Full-Width Full-Height Crazy Parallax Palace Countdown Section
function PalaceParallaxCountdownSection({
  targetDate,
  dayStr,
  dateStr,
  yearStr,
}: {
  targetDate: string;
  dayStr: string;
  dateStr: string;
  yearStr: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Crazy multi-layered parallax transforms across height, scale, rotation and glow
  const bgY = useTransform(scrollYProgress, [0, 1], ["-26%", "26%"]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.3, 1.08, 1.25]);
  const bgRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["75px", "-75px"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.85, 0.3]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100vh] sm:min-h-[110vh] overflow-hidden flex items-center justify-center py-20 sm:py-28 px-4 select-none my-8 md:my-14"
    >
      {/* FULL WIDTH & FULL HEIGHT CRAZY PARALLAX PALACE BACKGROUND IMAGE */}
      <motion.div
        style={{
          y: bgY,
          scale: bgScale,
          rotate: bgRotate,
        }}
        className="absolute inset-x-0 -top-[30%] h-[160%] w-full pointer-events-none z-0 overflow-hidden"
      >
        <img
          src="/templates/rose-gold-blush/palace-arch.jpg"
          alt="Royal Palace Arch"
          className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.14] saturate-[1.2]"
        />
      </motion.div>

      {/* Atmospheric Top & Bottom Seamless Dark Twilight Gradients */}
      <div className="absolute inset-x-0 top-0 h-44 sm:h-64 bg-gradient-to-b from-[#080c14] via-[#080c14]/80 to-transparent z-[1] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-44 sm:h-64 bg-gradient-to-t from-[#080c14] via-[#080c14]/80 to-transparent z-[1] pointer-events-none" />

      {/* Central Ambient Vignette Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] z-[1] pointer-events-none" />

      {/* Luminous Pulsing Gold Glow Aura */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.18)_0%,_transparent_70%)] z-[1] pointer-events-none"
      />

      {/* FOREGROUND CONTENT: FLOATING CELESTIAL COUNTDOWN PEDESTAL */}
      <motion.div
        style={{ y: contentY }}
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl mx-auto p-6 sm:p-10 md:p-14 rounded-[2.2rem] sm:rounded-[2.8rem] bg-black/65 backdrop-blur-2xl border border-[#d4af37]/45 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.2)] text-center space-y-6 sm:space-y-8"
      >
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-black/70 border border-[#d4af37]/50 shadow-md">
          <Sparkle size={14} weight="fill" className="text-[#f3cf7a] animate-spin" style={{ animationDuration: "6s" }} />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#fae4a8] font-bold font-jakarta">
            ✦ Celestial Wedding Countdown ✦
          </span>
          <Sparkle size={14} weight="fill" className="text-[#f3cf7a] animate-spin" style={{ animationDuration: "6s" }} />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#fcf9f2] drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
            Until We Say &quot;Forever&quot;
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-lora max-w-md mx-auto italic">
            Every passing moment brings us closer to the sacred vows of our eternal union
          </p>
        </div>

        {/* Golden Countdown Grid */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 font-jakarta pt-2">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Mins", value: timeLeft.minutes },
            { label: "Secs", value: timeLeft.seconds },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -4 }}
              className="py-4 px-2 sm:py-5 sm:px-3 md:py-6 rounded-2xl bg-black/60 border border-[#d4af37]/40 shadow-lg flex flex-col items-center justify-center min-w-0 group hover:border-[#d4af37] transition-all"
            >
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#fae4a8] group-hover:text-[#fff6d6] font-cinzel block leading-none drop-shadow-md truncate">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[9px] sm:text-[10px] md:text-xs uppercase font-bold tracking-[0.15em] text-stone-300 group-hover:text-[#f3cf7a] mt-2 block truncate transition-colors">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Bottom Sub-Pill with Auspicious Date Summary */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 text-[11px] font-montserrat text-stone-300">
          <span className="text-[#d4af37] font-bold">✨ Auspicious Muhurat:</span>
          <span>{dayStr}, {dateStr} {yearStr}</span>
        </div>
      </motion.div>
    </section>
  );
}

// Helper: Dynamically infer theme personality for ceremonies
function getEventTheme(name: string = "", index: number) {
  const lower = name.toLowerCase();
  if (lower.includes("mehendi") || lower.includes("sangeet") || lower.includes("henna")) {
    return {
      accentColor: "#10b981", // Emerald warmth
      gradient: "radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.14) 0%, transparent 70%)",
      swatches: ["#f472b6", "#fae4a8", "#10b981", "#d4af37"],
      motif: "✦ Henna & Sangeet Rhythms ✦",
    };
  }
  if (lower.includes("haldi") || lower.includes("manjha") || lower.includes("pithi")) {
    return {
      accentColor: "#f59e0b", // Saffron turmeric glow
      gradient: "radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.16) 0%, transparent 70%)",
      swatches: ["#fbbf24", "#f59e0b", "#fef08a", "#d4af37"],
      motif: "✦ Golden Turmeric & Phoolon Ki Holi ✦",
    };
  }
  if (lower.includes("baraat") || lower.includes("procession") || lower.includes("swagat")) {
    return {
      accentColor: "#e11d48", // Royal Crimson
      gradient: "radial-gradient(ellipse at 50% 50%, rgba(225, 29, 72, 0.14) 0%, transparent 70%)",
      swatches: ["#991b1b", "#fae4a8", "#d4af37", "#ffffff"],
      motif: "✦ Grand Royal Procession ✦",
    };
  }
  if (lower.includes("nikah") || lower.includes("vivah") || lower.includes("vows") || lower.includes("wedding") || lower.includes("phera")) {
    return {
      accentColor: "#f3cf7a", // Sacred Ivory Champagne Gold
      gradient: "radial-gradient(ellipse at 50% 50%, rgba(243, 207, 122, 0.18) 0%, transparent 70%)",
      swatches: ["#fae4a8", "#d4af37", "#fdf4dc", "#c98a75"],
      motif: "✦ Sacred Eternal Covenant ✦",
    };
  }
  if (lower.includes("reception") || lower.includes("walima") || lower.includes("banquet") || lower.includes("party")) {
    return {
      accentColor: "#38bdf8", // Midnight Starlight
      gradient: "radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.14) 0%, transparent 70%)",
      swatches: ["#0f172a", "#38bdf8", "#fae4a8", "#ffffff"],
      motif: "✦ Starlight Celebrations & Banquet ✦",
    };
  }
  // Universal fallback cycle
  const fallbacks = [
    { accentColor: "#f3cf7a", gradient: "radial-gradient(ellipse at 50% 50%, rgba(243, 207, 122, 0.14) 0%, transparent 70%)", swatches: ["#fae4a8", "#d4af37", "#f2c4ce"], motif: "✦ Royal Celebration ✦" },
    { accentColor: "#f59e0b", gradient: "radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.14) 0%, transparent 70%)", swatches: ["#f59e0b", "#fbbf24", "#fae4a8"], motif: "✦ Auspicious Rituals ✦" },
    { accentColor: "#10b981", gradient: "radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.14) 0%, transparent 70%)", swatches: ["#10b981", "#fae4a8", "#34d399"], motif: "✦ Joyful Togetherness ✦" },
  ];
  return fallbacks[index % fallbacks.length];
}

// Sub-Component: Royal Ceremony Journey (Continuous Interactive Golden Path)
function CeremonyJourney({
  events,
  venueName,
  venueMapUrl,
  dateStr,
}: {
  events: any[];
  venueName: string;
  venueMapUrl?: string;
  dateStr: string;
}) {
  const [activeTab, setActiveTab] = useState(0);

  const scrollToChapter = (idx: number) => {
    setActiveTab(idx);
    const el = document.getElementById(`ceremony-chapter-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="py-16 sm:py-24 md:py-32 px-4 max-w-6xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-[#d4af37]/30 text-[#fae4a8] text-[10px] font-bold font-jakarta tracking-[0.25em] uppercase">
          <Sparkle size={12} weight="fill" className="text-[#f3cf7a]" />
          <span>The Sacred Celebration Journey</span>
          <Sparkle size={12} weight="fill" className="text-[#f3cf7a]" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#fcf9f2]">
          Order of Ceremonies
        </h2>

        <p className="text-sm sm:text-base text-stone-300 max-w-md mx-auto font-cormorant">
          We warmly invite you to journey with us across each joyous ceremony and sacred ritual
        </p>

        {/* Interactive Chapter Quick Jump Pills */}
        <div className="flex items-center justify-center gap-2 pt-3 flex-wrap">
          {events.map((evt: any, i: number) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToChapter(i)}
              className={`ceremony-progress-pill ${activeTab === i ? "active" : ""}`}
            >
              <span>0{i + 1}</span> {evt.name?.split(" ")[0] || `Chapter ${i + 1}`}
            </button>
          ))}
        </div>
      </div>

      {/* CONTINUOUS ROYAL GOLDEN SPINE JOURNEY */}
      <div className="relative">
        {/* Center Golden Spine Line on Desktop */}
        <div className="hidden md:block absolute left-1/2 top-10 bottom-10 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#d4af37]/20 via-[#d4af37] to-[#d4af37]/20 shadow-[0_0_12px_rgba(212,175,55,0.4)]" />

        {/* Mobile Left Golden Spine Line */}
        <div className="block md:hidden ceremony-spine-line" />

        <div className="space-y-12 md:space-y-24">
          {events.map((evt: any, idx: number) => {
            const theme = getEventTheme(evt.name, idx);
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={idx}
                id={`ceremony-chapter-${idx}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
                onViewportEnter={() => setActiveTab(idx)}
                className="relative scroll-mt-28"
              >
                {/* ── DESKTOP ALTERNATING ROYAL PEDESTAL LAYOUT ── */}
                <div className="hidden md:grid grid-cols-12 gap-8 items-center">
                  {/* Left Column (Always slides in smoothly from the Left) */}
                  <motion.div
                    initial={{ opacity: 0, x: -85 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.55 }}
                    transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                    className="col-span-5"
                  >
                    {isEven ? (
                      /* Main Ceremony Card on Left */
                      <div className="castle-card-shell p-8 rounded-[2rem] shadow-2xl space-y-4 border border-[#d4af37]/35 relative overflow-hidden text-left hover:border-[#d4af37] transition-all">
                        <div
                          className="absolute -top-16 -left-16 w-32 h-32 rounded-full pointer-events-none opacity-40 blur-2xl"
                          style={{ background: theme.accentColor }}
                        />
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider font-lora italic border"
                          style={{
                            borderColor: `${theme.accentColor}55`,
                            backgroundColor: `${theme.accentColor}18`,
                            color: theme.accentColor,
                          }}
                        >
                          {theme.motif}
                        </span>

                        <h3 className="text-2xl font-lora font-bold text-[#fcf9f2]">
                          {evt.name}
                        </h3>

                        <p className="text-sm text-stone-300 font-lora leading-relaxed">
                          {evt.description}
                        </p>

                        <div className="pt-2">
                          <a
                            href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(evt.venue || venueName)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full castle-card-inner border border-[#d4af37]/35 text-xs font-semibold text-[#fae4a8] hover:text-white hover:border-[#d4af37] transition-all shadow-md group"
                          >
                            <MapPin size={15} className="text-[#f3cf7a] group-hover:scale-110 transition-transform" />
                            <span>{evt.venue || venueName}</span>
                            <ArrowSquareOut size={13} className="opacity-70 group-hover:opacity-100" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      /* Timing & Dress Code Station on Left */
                      <div className="space-y-4">
                        <div className="castle-card-shell p-6 rounded-[2rem] border border-[#d4af37]/35 shadow-xl space-y-3 text-center">
                          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#d4af37] font-montserrat block">
                            Auspicious Timing
                          </span>
                          <div className="py-1 border-y border-white/10 my-1">
                            <span className="text-3xl font-lora font-bold text-[#fae4a8] block leading-none">
                              {evt.date ? evt.date.split(" ")[1]?.replace(",", "") || "18" : "18"}
                            </span>
                            <span className="text-[11px] uppercase font-bold tracking-widest text-[#fcf9f2] font-montserrat block mt-1">
                              {evt.date ? evt.date.split(" ")[0] : "MAY"} {evt.date ? evt.date.split(" ")[2] || "2027" : "2027"}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-semibold text-stone-200 font-montserrat">
                            <Clock size={13} className="text-[#f3cf7a]" />
                            <span>{evt.time || "06:30 PM"}</span>
                          </div>
                        </div>

                        {evt.dress && (
                          <div className="ceremony-dress-tag space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#d4af37] font-montserrat">
                                Dress Code
                              </span>
                              <div className="flex items-center gap-1.5">
                                {theme.swatches.map((color, sIdx) => (
                                  <span key={sIdx} className="ceremony-swatch-dot" style={{ backgroundColor: color }} />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs font-semibold text-stone-200 font-lora">
                              {evt.dress}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>

                  {/* Center Column: Milestone Node (Scales up smoothly) */}
                  <div className="col-span-2 flex flex-col items-center justify-center relative">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.4 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.55 }}
                      transition={{ duration: 1.05, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ scale: 1.15 }}
                      className="w-14 h-14 rounded-full bg-[#0e1626] border-2 border-[#d4af37] text-[#f3cf7a] flex flex-col items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.45)] z-10 cursor-pointer font-montserrat"
                    >
                      <span className="text-[9px] uppercase tracking-wider text-[#d4af37] font-bold">CH</span>
                      <span className="text-sm font-bold leading-none">0{idx + 1}</span>
                    </motion.div>
                  </div>

                  {/* Right Column (Always slides in smoothly from the Right) */}
                  <motion.div
                    initial={{ opacity: 0, x: 85 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.55 }}
                    transition={{ duration: 1.3, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="col-span-5"
                  >
                    {!isEven ? (
                      /* Main Ceremony Card on Right */
                      <div className="castle-card-shell p-8 rounded-[2rem] shadow-2xl space-y-4 border border-[#d4af37]/35 relative overflow-hidden text-left hover:border-[#d4af37] transition-all">
                        <div
                          className="absolute -top-16 -right-16 w-32 h-32 rounded-full pointer-events-none opacity-40 blur-2xl"
                          style={{ background: theme.accentColor }}
                        />
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider font-lora italic border"
                          style={{
                            borderColor: `${theme.accentColor}55`,
                            backgroundColor: `${theme.accentColor}18`,
                            color: theme.accentColor,
                          }}
                        >
                          {theme.motif}
                        </span>

                        <h3 className="text-2xl font-lora font-bold text-[#fcf9f2]">
                          {evt.name}
                        </h3>

                        <p className="text-sm text-stone-300 font-lora leading-relaxed">
                          {evt.description}
                        </p>

                        <div className="pt-2">
                          <a
                            href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(evt.venue || venueName)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full castle-card-inner border border-[#d4af37]/35 text-xs font-semibold text-[#fae4a8] hover:text-white hover:border-[#d4af37] transition-all shadow-md group"
                          >
                            <MapPin size={15} className="text-[#f3cf7a] group-hover:scale-110 transition-transform" />
                            <span>{evt.venue || venueName}</span>
                            <ArrowSquareOut size={13} className="opacity-70 group-hover:opacity-100" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      /* Timing & Dress Code Station on Right */
                      <div className="space-y-4">
                        <div className="castle-card-shell p-6 rounded-[2rem] border border-[#d4af37]/35 shadow-xl space-y-3 text-center">
                          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#d4af37] font-montserrat block">
                            Auspicious Timing
                          </span>
                          <div className="py-1 border-y border-white/10 my-1">
                            <span className="text-3xl font-lora font-bold text-[#fae4a8] block leading-none">
                              {evt.date ? evt.date.split(" ")[1]?.replace(",", "") || "18" : "18"}
                            </span>
                            <span className="text-[11px] uppercase font-bold tracking-widest text-[#fcf9f2] font-montserrat block mt-1">
                              {evt.date ? evt.date.split(" ")[0] : "MAY"} {evt.date ? evt.date.split(" ")[2] || "2027" : "2027"}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-semibold text-stone-200 font-montserrat">
                            <Clock size={13} className="text-[#f3cf7a]" />
                            <span>{evt.time || "06:30 PM"}</span>
                          </div>
                        </div>

                        {evt.dress && (
                          <div className="ceremony-dress-tag space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#d4af37] font-montserrat">
                                Dress Code
                              </span>
                              <div className="flex items-center gap-1.5">
                                {theme.swatches.map((color, sIdx) => (
                                  <span key={sIdx} className="ceremony-swatch-dot" style={{ backgroundColor: color }} />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs font-semibold text-stone-200 font-lora">
                              {evt.dress}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* ── MOBILE / TABLET CONTINUOUS FLOW ── */}
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
                  className="block md:hidden pl-10 sm:pl-14"
                >
                  {/* Milestone Node Badge */}
                  <div
                    className="ceremony-spine-node absolute -left-[40px] sm:-left-[46px] top-4"
                    style={{ borderColor: theme.accentColor }}
                  >
                    0{idx + 1}
                  </div>

                  <div className="castle-card-shell p-5 sm:p-6 rounded-[1.6rem] shadow-xl space-y-3 relative overflow-hidden border border-[#d4af37]/30">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-black/40 text-[#fae4a8] border border-[#d4af37]/30 font-montserrat">
                        {evt.date || dateStr}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-stone-300 font-montserrat flex items-center gap-1">
                        <Clock size={12} className="text-[#f3cf7a]" />
                        {evt.time || "06:30 PM"}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-lora font-bold text-[#fcf9f2]">
                      {evt.name}
                    </h3>

                    <p className="text-xs text-stone-300 font-lora leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="pt-1">
                      <a
                        href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(evt.venue || venueName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#fae4a8] hover:text-white font-semibold font-lora"
                      >
                        <MapPin size={13} className="text-[#f3cf7a]" />
                        <span>{evt.venue || venueName}</span>
                        <ArrowSquareOut size={11} className="opacity-70" />
                      </a>
                    </div>

                    {evt.dress && (
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-[#d4af37] font-montserrat block">
                            Dress Code
                          </span>
                          <span className="text-xs font-semibold text-stone-200 font-lora block">
                            {evt.dress}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {theme.swatches.slice(0, 3).map((color, sIdx) => (
                            <span key={sIdx} className="ceremony-swatch-dot" style={{ backgroundColor: color }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Sub-Component: Scattered Memories Gallery (Scatter -> Collect -> 3D Perspective Reel / Mobile Deck)
function ScatteredMemoriesGallery({
  images,
  groomName,
  brideName,
  onOpenPhoto,
}: {
  images: string[];
  groomName: string;
  brideName: string;
  onOpenPhoto: (idx: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAssembled, setIsAssembled] = useState(false);

  // Trigger assembly smoothly via IntersectionObserver once ~50% into viewport
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAssembled(true);
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -15% 0px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Deterministic scattered positions for photos when in scattered state
  const scatterOffsets = [
    { x: -380, y: -90, rot: -14, scale: 0.88, z: 2 },
    { x: 390, y: -70, rot: 12, scale: 0.9, z: 2 },
    { x: -220, y: 110, rot: 8, scale: 0.82, z: 1 },
    { x: 230, y: 120, rot: -9, scale: 0.84, z: 1 },
    { x: -440, y: 130, rot: 16, scale: 0.78, z: 0 },
    { x: 450, y: 140, rot: -15, scale: 0.76, z: 0 },
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  return (
    <section
      ref={containerRef}
      className="py-16 sm:py-24 md:py-32 px-4 max-w-7xl mx-auto relative z-10 overflow-hidden"
    >
      {/* Chapter Title & Subtitle */}
      <div className="text-center space-y-3 mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-[#d4af37]/30 text-[#fae4a8] text-[10px] font-bold font-jakarta tracking-[0.25em] uppercase">
          <Sparkle size={12} weight="fill" className="text-[#f3cf7a]" />
          <span>Chapter V · Captured Moments</span>
          <Sparkle size={12} weight="fill" className="text-[#f3cf7a]" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#fcf9f2]">
          Scattered Memories
        </h2>

        <p className="text-sm sm:text-base text-stone-300 max-w-md mx-auto font-cormorant">
          Glimpses of laughter, stolen glances, and cherished milestones woven into our eternal love story
        </p>
      </div>

      {/* ── DESKTOP & TABLET: SCATTERED → 3D PERSPECTIVE MEMORY REEL ── */}
      <div className="hidden md:block">
        {/* Assembly Indicator Badge */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsAssembled((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full castle-card-inner border border-[#d4af37]/35 text-[11px] font-semibold text-[#fae4a8] hover:border-[#d4af37] transition-all cursor-pointer font-jakarta"
          >
            <Sparkle size={13} className="text-[#f3cf7a]" />
            <span>{isAssembled ? "✦ Memories Collected · 3D Reel Active" : "✦ Scroll to Collect Scattered Memories"}</span>
          </button>
        </div>

        <div className="scattered-gallery-stage h-[520px] flex items-center justify-center relative">
          {images.map((imgSrc, idx) => {
            // Robust circular distance from activeIndex
            let diff = idx - activeIndex;
            while (diff > images.length / 2) diff -= images.length;
            while (diff < -images.length / 2) diff += images.length;
            const normalizedOffset = diff;
            const absOffset = Math.abs(normalizedOffset);

            const isCenter = normalizedOffset === 0;
            const isVisibleInReel = absOffset <= 2.5;

            const scatterConfig = scatterOffsets[idx % scatterOffsets.length];

            const xPos = isAssembled
              ? normalizedOffset * 270
              : scatterConfig.x;
            const yPos = isAssembled
              ? absOffset * 14
              : scatterConfig.y;
            const rotateY = isAssembled
              ? normalizedOffset * -24
              : scatterConfig.rot;
            const scale = isAssembled
              ? isCenter ? 1.08 : Math.max(0.72, 1 - absOffset * 0.14)
              : scatterConfig.scale;
            const zIndex = isAssembled
              ? 50 - Math.round(absOffset * 10)
              : scatterConfig.z + 5;
            const opacity = isAssembled
              ? isVisibleInReel ? (isCenter ? 1 : Math.max(0.5, 0.9 - absOffset * 0.18)) : 0
              : 0.95;

            return (
              <motion.div
                key={idx}
                animate={{
                  x: xPos,
                  y: yPos,
                  rotateY: rotateY,
                  scale: scale,
                  zIndex: zIndex,
                  opacity: opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 18,
                  mass: 0.9,
                }}
                onClick={() => {
                  if (isCenter) {
                    onOpenPhoto(idx);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                className={`absolute w-[280px] h-[380px] rounded-3xl cursor-pointer group select-none ${
                  isCenter ? "memory-hero-mount" : "memory-photo-mount"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  pointerEvents: isAssembled && !isVisibleInReel ? "none" : "auto",
                }}
              >
                <div className="relative w-full h-full overflow-hidden rounded-3xl bg-slate-900 border border-white/10">
                  <img
                    src={imgSrc}
                    alt={`Memory portrait ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Top Memory Badge */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#d4af37]/40 text-[9px] font-bold text-[#fae4a8] tracking-widest uppercase font-montserrat">
                      0{idx + 1} / 0{images.length}
                    </span>
                    {isCenter && (
                      <span className="w-7 h-7 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
                        <MagnifyingGlassPlus size={14} weight="bold" />
                      </span>
                    )}
                  </div>

                  {/* Bottom Caption for Active Hero Card */}
                  {isCenter && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-3.5 left-3.5 right-3.5 p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-[#d4af37]/35 text-center"
                    >
                      <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#d4af37] font-montserrat block">
                        Memory 0{idx + 1}
                      </span>
                      <h4 className="text-sm font-lora font-bold text-[#fcf9f2] truncate">
                        {groomName} &amp; {brideName}
                      </h4>
                      <p className="text-[10px] text-stone-300 font-lora italic mt-0.5 truncate">
                        Click to view fullscreen
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 3D Reel Controls & Counter */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={handlePrev}
            aria-label="Previous photograph"
            className="w-12 h-12 rounded-full castle-card-inner border border-[#d4af37]/40 hover:border-[#d4af37] text-[#fae4a8] hover:text-white flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            <CaretLeft size={22} weight="bold" />
          </button>

          <div className="text-center font-montserrat px-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] block">
              PORTRAIT
            </span>
            <span className="text-lg font-bold text-[#fcf9f2] font-lora">
              0{activeIndex + 1} <span className="text-[#d4af37]/60 text-sm">/ 0{images.length}</span>
            </span>
          </div>

          <button
            onClick={handleNext}
            aria-label="Next photograph"
            className="w-12 h-12 rounded-full castle-card-inner border border-[#d4af37]/40 hover:border-[#d4af37] text-[#fae4a8] hover:text-white flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            <CaretRight size={22} weight="bold" />
          </button>
        </div>
      </div>

      {/* ── MOBILE: STACKED PHOTO DECK (SWIPEABLE PHYSICAL CARDS) ── */}
      <div className="block md:hidden">
        <div className="memory-deck-stack flex items-center justify-center">
          {images.map((imgSrc, idx) => {
            const offset = (idx - activeIndex + images.length) % images.length;
            const isTop = offset === 0;

            if (offset > 2 && offset < images.length - 1) return null;

            return (
              <motion.div
                key={idx}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.65}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 60) handlePrev();
                  else if (info.offset.x < -60) handleNext();
                }}
                animate={{
                  scale: isTop ? 1 : 1 - offset * 0.06,
                  y: isTop ? 0 : offset * 14,
                  rotateZ: isTop ? 0 : (offset % 2 === 1 ? 4 : -4),
                  zIndex: 20 - offset,
                  opacity: isTop ? 1 : 0.65 - offset * 0.2,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                onClick={() => {
                  if (isTop) onOpenPhoto(idx);
                }}
                className={`absolute w-[290px] sm:w-[320px] h-[410px] rounded-3xl cursor-grab active:cursor-grabbing select-none ${
                  isTop ? "memory-hero-mount" : "memory-photo-mount"
                }`}
              >
                <div className="relative w-full h-full overflow-hidden rounded-3xl bg-slate-900 border border-white/10">
                  <img
                    src={imgSrc}
                    alt={`Portrait ${idx + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Memory Header Pill */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#d4af37]/40 text-[9px] font-bold text-[#fae4a8] tracking-widest uppercase font-montserrat">
                      0{idx + 1} / 0{images.length}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
                      <MagnifyingGlassPlus size={15} weight="bold" />
                    </span>
                  </div>

                  {/* Bottom Caption Pill */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-black/80 backdrop-blur-md border border-[#d4af37]/35 text-center">
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#d4af37] font-montserrat block">
                      Swipe or Tap
                    </span>
                    <h4 className="text-sm font-lora font-bold text-[#fcf9f2] truncate">
                      {groomName} &amp; {brideName}
                    </h4>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Swipe / Arrow Controls */}
        <div className="flex items-center justify-center gap-5 mt-6">
          <button
            onClick={handlePrev}
            aria-label="Previous card"
            className="w-11 h-11 rounded-full castle-card-inner border border-[#d4af37]/40 text-[#fae4a8] flex items-center justify-center active:scale-95 cursor-pointer shadow-md"
          >
            <CaretLeft size={20} weight="bold" />
          </button>

          <span className="text-xs font-montserrat font-bold text-[#fae4a8] tracking-wider">
            0{activeIndex + 1} / 0{images.length}
          </span>

          <button
            onClick={handleNext}
            aria-label="Next card"
            className="w-11 h-11 rounded-full castle-card-inner border border-[#d4af37]/40 text-[#fae4a8] flex items-center justify-center active:scale-95 cursor-pointer shadow-md"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        </div>
      </div>
    </section>
  );
}

