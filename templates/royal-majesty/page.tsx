"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import confetti from "canvas-confetti";
import {
  Sparkle,
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
  ArrowsClockwise,
  MoonStars,
  GlobeHemisphereWest,
  SpeakerHigh,
  SpeakerSlash,
  CaretDown,
  MagnifyingGlassPlus,
  CalendarCheck,
  Crown,
  Eye,
} from "@phosphor-icons/react";
import { FloatingPetals } from "@/components/invitation/FloatingPetals";
import defaultData from "./data.json";
import "./style.css";

// Helper to safely resolve audio track URLs
function resolveAudioTrack(track?: string | null): string {
  if (!track || track === "track1" || track === "track2" || track === "track3" || track === "default" || track.trim() === "") {
    return "/templates/royal-majesty/music.mp3";
  }
  if (track.startsWith("/") || track.startsWith("http://") || track.startsWith("https://") || track.startsWith("blob:")) {
    return track;
  }
  return `/audio/${track}.mp3`;
}

interface RoyalMajestyProps {
  data?: any;
}

export default function RoyalMajesty({ data }: RoyalMajestyProps) {
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
  const hashtag = data?.hashtag || defaultData.hashtag || `#${groomName}And${brideName}`.replace(/\s+/g, "");

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
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activePhotoSrc, setActivePhotoSrc] = useState<string | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleOpenPhoto = (src: string, idx: number) => {
    setActivePhotoSrc(src);
    setActivePhotoIdx(idx);
  };

  // RSVP Form & Modal State
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpAttending, setRsvpAttending] = useState("yes");
  const [rsvpGuests, setRsvpGuests] = useState("2");
  const [rsvpWishes, setRsvpWishes] = useState("");
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);

  // Lock page and body scrolling until video completes and gates open
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
            audio.src = "/templates/royal-majesty/music.mp3";
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

  // Video playback time listener to trigger content reveal at ~5.8s
  const handleVideoTimeUpdate = () => {
    if (!heroVideoRef.current || !isVideoStarted) return;
    const ct = heroVideoRef.current.currentTime;

    if (ct >= 5.8 && !isContentRevealed) {
      setIsContentRevealed(true);
      confetti({
        particleCount: 90,
        spread: 85,
        origin: { y: 0.55 },
        colors: ["#A9C1D0", "#BCD0DA", "#B7A16E", "#EBECE8", "#708FA8"],
      });
    }
  };

  // Initial user start interaction (Tapping the Royal Wax Seal)
  const handleStartExperience = () => {
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
        console.warn("Audio autoplay blocked on seal tap:", err);
      });
    }

    // Fallback timer
    setTimeout(() => {
      setIsContentRevealed(true);
    }, 6200);
  };

  // Replay Ballroom Experience
  const handleReplay = () => {
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
      if (activePhotoIdx === null && activePhotoSrc === null) return;
      if (e.key === "Escape") {
        setActivePhotoIdx(null);
        setActivePhotoSrc(null);
      }
      if (e.key === "ArrowRight") {
        const total = galleryImages.length > 0 ? galleryImages.length : 1;
        const current = activePhotoIdx !== null ? activePhotoIdx : 0;
        const newIdx = (current + 1) % total;
        setActivePhotoIdx(newIdx);
        setActivePhotoSrc(galleryImages[newIdx] || (newIdx % 2 === 0 ? "/templates/royal-majesty/couple-portrait.jpg" : "/templates/royal-majesty/ballroom-terrace.jpg"));
      }
      if (e.key === "ArrowLeft") {
        const total = galleryImages.length > 0 ? galleryImages.length : 1;
        const current = activePhotoIdx !== null ? activePhotoIdx : 0;
        const newIdx = (current - 1 + total) % total;
        setActivePhotoIdx(newIdx);
        setActivePhotoSrc(galleryImages[newIdx] || (newIdx % 2 === 0 ? "/templates/royal-majesty/couple-portrait.jpg" : "/templates/royal-majesty/ballroom-terrace.jpg"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIdx, activePhotoSrc, galleryImages]);

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
          senderName: rsvpName || "Honoured Guest",
          messageText: `[RSVP - ${rsvpAttending.toUpperCase()}] Guests: ${rsvpGuests}. Phone: ${rsvpPhone}. Wishes: ${rsvpWishes}`,
        }),
      });
    } catch {
      // Fallback
    }

    setIsRsvpSubmitted(true);
    confetti({
      particleCount: 85,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#A9C1D0", "#B7A16E", "#EBECE8", "#708FA8"],
    });
  };

  // Dual Faith Invocation Texts
  const getInvocation = () => {
    switch (selectedReligion) {
      case "hindu":
        return {
          title: "॥ श्री गणेशाय नमः ॥",
          arabicOrSanskrit: "मङ्गलम् भगवान विष्णुः मङ्गलम् गरुडध्वजः । मङ्गलम् पुण्डरीकाक्षः मङ्गलाय तनो हरिः ॥",
          english: "With the divine grace of the Almighty, cherished ancestors, and beloved elders, we solicit the pleasure of your company.",
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
          title: "Two Hearts · One Royal Destiny",
          arabicOrSanskrit: "“Where there is great love, there are always miracles under starlit skies.”",
          english: defaultData.quote,
          tag: "Universal Royal Proclamation",
        };
    }
  };

  const invocation = getInvocation();

  return (
    <div className={`min-h-screen bg-[#EBECE8] text-[#4E687A] font-lora relative selection:bg-[#A9C1D0]/40 selection:text-[#4E687A] ${!isContentRevealed ? "h-[100dvh] max-h-screen overflow-hidden touch-none" : "overflow-x-hidden"}`}>
      {/* Floating Powder-Blue Hydrangea & Gold Petals */}
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
        <source src="/templates/royal-majesty/music.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Toggle Button */}
      <motion.button
        type="button"
        id="majesty-music-toggle-btn"
        className="majesty-music-toggle pointer-events-auto cursor-pointer"
        onClick={toggleAudio}
        aria-label={isPlayingMusic ? "Mute soundtrack" : "Play soundtrack"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {isPlayingMusic ? (
          <>
            <SpeakerHigh size={19} weight="fill" />
            <span className="majesty-soundwave-bars">
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
          1. CINEMATIC HERO SECTION (CHÂTEAU BALLROOM REVEAL)
          ---------------------------------------------------- */}
      <section className="relative w-full h-screen min-h-[100dvh] overflow-hidden flex flex-col justify-between items-center text-center select-none bg-[#EBECE8]">
        {/* Full-Screen Hero Background Video */}
        <video
          ref={heroVideoRef}
          src={videoUrl}
          playsInline
          loop={false}
          muted={true}
          preload="auto"
          onTimeUpdate={handleVideoTimeUpdate}
          onEnded={() => setIsContentRevealed(true)}
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.96] contrast-[1.03]"
        />

        {/* Ambient Subtle Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/70 z-[1] pointer-events-none" />

        {/* Top Header: Faith Switcher Pill */}
        <header className="relative z-20 w-full px-4 pt-4 md:pt-6 flex items-center justify-center max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-black/40 backdrop-blur-md border border-white/30 shadow-md text-xs font-montserrat">
            <button
              onClick={() => setSelectedReligion("universal")}
              className={`px-3 py-1 rounded-full transition-all text-[10px] md:text-[11px] font-semibold flex items-center gap-1 ${
                selectedReligion === "universal"
                  ? "bg-[#A9C1D0] text-[#1D2C36] shadow-sm font-bold"
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
                  ? "bg-[#A9C1D0] text-[#1D2C36] shadow-sm font-bold"
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
                  ? "bg-[#A9C1D0] text-[#1D2C36] shadow-sm font-bold"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <MoonStars size={12} weight="bold" />
              Muslim
            </button>
          </div>
        </header>

        {/* Transparent Clickable Trigger Over Full Screen */}
        {!isVideoStarted && (
          <div
            onClick={handleStartExperience}
            className="absolute inset-0 z-15 cursor-pointer flex flex-col items-center justify-end pb-16 touch-manipulation"
          />
        )}

        {/* ----------------------------------------------------
            CHOREOGRAPHED CONTENT REVEAL (Synchronized at ~5.8s)
            ---------------------------------------------------- */}
        <AnimatePresence>
          {isContentRevealed && (
            <motion.div
              key="ballroom-opened-content"
              initial={{ opacity: 0, scale: 0.88, y: 35, filter: "blur(14px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 my-auto px-4 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-1.5 md:space-y-2.5 text-center"
            >
              <div className="text-[#C9B989] text-base drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                👑
              </div>

              <p className="font-alex-brush text-3xl sm:text-4xl md:text-5xl text-[#FAFBF9] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] tracking-wide font-normal">
                We cordially request your presence
              </p>

              <div className="text-[#A9C1D0] text-xs drop-shadow-md">
                ✦ ✦ ✦
              </div>

              {/* GROOM BLOCK */}
              <div className="space-y-0.5 pt-1">
                <h1 className="font-great-vibes text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#FAFBF9] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] leading-none font-normal">
                  {groomName}
                </h1>
                <p className="font-lora italic text-xs sm:text-sm md:text-base text-stone-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-light">
                  {groomParents}
                </p>
                {(groomEducation || groomProfession) && (
                  <p className="text-[11px] sm:text-xs md:text-sm text-[#BCD0DA] font-lora drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-medium">
                    {groomEducation}
                    {groomEducation && groomProfession && " · "}
                    {groomProfession}
                  </p>
                )}
              </div>

              {/* FLORAL AMPERSAND */}
              <div className="py-0.5">
                <span className="font-great-vibes text-4xl sm:text-5xl md:text-6xl text-[#C9B989] drop-shadow-[0_3px_16px_rgba(0,0,0,0.95)] block">
                  &amp;
                </span>
              </div>

              {/* BRIDE BLOCK */}
              <div className="space-y-0.5">
                <h1 className="font-great-vibes text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#FAFBF9] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] leading-none font-normal">
                  {brideName}
                </h1>
                <p className="font-lora italic text-xs sm:text-sm md:text-base text-stone-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-light">
                  {brideParents}
                </p>
                {(brideEducation || brideProfession) && (
                  <p className="text-[11px] sm:text-xs md:text-sm text-[#BCD0DA] font-lora drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-medium">
                    {brideEducation}
                    {brideEducation && brideProfession && " · "}
                    {brideProfession}
                  </p>
                )}
              </div>

              {/* WEDDING DATE & ESTATE CHIP */}
              <div className="pt-3">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/50 backdrop-blur-md border border-[#A9C1D0]/60 text-[#FAFBF9] text-xs font-montserrat shadow-xl">
                  <span className="text-[#C9B989] font-bold">✦ {dayStr}, {dateStr} {yearStr}</span>
                  <span className="text-white/40">·</span>
                  <span className="text-stone-200">{venueName.split("&")[0]?.trim() || venueName}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom SCROLL Indicator */}
        <AnimatePresence>
          {isContentRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative z-20 pb-6 md:pb-8 flex flex-col items-center gap-1 cursor-pointer"
              onClick={scrollToContent}
            >
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#FAFBF9] font-montserrat font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                Scroll
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              >
                <CaretDown size={20} weight="bold" className="text-[#C9B989] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ----------------------------------------------------
          2. CONTINUOUS CHÂTEAU STORYTELLING CHAPTERS
          ---------------------------------------------------- */}
      <main ref={contentSectionRef} className="relative z-10 overflow-hidden bg-[#EBECE8]">
        {/* SCENE I: THE REGENCY GRAND SALON PROCLAMATION */}
        <section className="py-16 sm:py-24 md:py-32 px-4 bg-majesty-ivory relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="majesty-editorial-card rounded-[2.8rem] p-8 sm:p-12 md:p-16 text-center space-y-6 relative overflow-hidden"
            >
              {/* Corner Watermark Accents */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 text-[9px] sm:text-[10px] font-cinzel tracking-widest text-[#B7A16E]/70 font-bold uppercase">
                MMXXVII
              </div>
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-[9px] sm:text-[10px] font-cinzel tracking-widest text-[#B7A16E]/70 font-bold uppercase">
                ROYAL PALACE
              </div>

              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 rounded-full majesty-gold-pill shadow-sm">
                <Crown size={14} weight="fill" className="text-[#9B875D]" />
                <span className="font-montserrat text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-[#9B875D]">
                  {invocation.tag}
                </span>
                <Crown size={14} weight="fill" className="text-[#9B875D]" />
              </div>

              <h2 className="font-playfair text-2xl sm:text-4xl md:text-5xl font-bold text-[#4E687A]">
                {invocation.title}
              </h2>

              <p className="font-amiri text-lg sm:text-2xl md:text-3xl text-[#708FA8] italic leading-relaxed whitespace-pre-line font-medium max-w-2xl mx-auto">
                {invocation.arabicOrSanskrit}
              </p>

              <div className="w-24 sm:w-32 h-[1.5px] bg-gradient-to-r from-transparent via-[#B7A16E] to-transparent mx-auto" />

              <p className="font-cormorant text-sm sm:text-lg md:text-xl text-[#4E687A] leading-relaxed max-w-xl mx-auto font-medium">
                {invocation.english}
              </p>
            </motion.div>
          </div>
        </section>

        {/* SCENE II: INTERACTIVE CELESTIAL ASTROLABE & MUHURAT TIMEPIECE */}
        <section className="py-12 sm:py-24 px-4 bg-majesty-ivory text-center relative z-10">
          <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9B875D] font-bold font-montserrat">
              Auspicious Matrimonial Muhurat
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#4E687A]">
              The Celestial Timepiece
            </h2>
            <p className="text-xs sm:text-sm text-[#708FA8] font-lora font-medium max-w-md mx-auto">
              A consecrated moment in time when two aristocratic dynasties unite
            </p>

            {/* Astrolabe Timepiece Visual */}
            <div className="pt-6 sm:pt-8 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center"
              >
                {/* Rotating Outer Ring */}
                <div className="absolute inset-0 majesty-astrolabe-ring-outer" />
                {/* Rotating Inner Ring */}
                <div className="absolute inset-3 sm:inset-4 majesty-astrolabe-ring-inner" />

                {/* Central Consecrated Medallion */}
                <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-[#FAFBF9] via-[#EBECE8] to-[#CFD9DD] border-2 border-[#A9C1D0] shadow-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center space-y-1">
                  <div className="text-[#B7A16E]">
                    <Sparkle size={18} weight="fill" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#9B875D] font-bold font-montserrat">
                    {dayStr}
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-cinzel font-bold text-[#4E687A] leading-none">
                    {dateStr.split(" ")[0]}
                  </h3>
                  <span className="text-xs sm:text-sm uppercase tracking-widest text-[#708FA8] font-montserrat font-semibold">
                    {dateStr.split(" ")[1]} {yearStr}
                  </span>
                  <div className="pt-1.5 border-t border-[#A9C1D0]/40 w-24 sm:w-28">
                    <span className="text-[10px] sm:text-[11px] text-[#B7A16E] font-bold font-montserrat flex items-center justify-center gap-1">
                      <Clock size={11} weight="bold" />
                      {data?.weddingTime || defaultData.weddingTime}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SCENE III: CINEMATIC SPLIT PANORAMA COUNTDOWN */}
        <ChateauParallaxCountdownSection
          targetDate={rawDate}
          dayStr={dayStr}
          dateStr={dateStr}
          yearStr={yearStr}
        />

        {/* SCENE IV: 4-CHAPTER CHÂTEAU GRAND ITINERARY STAGE */}
        <section className="py-16 sm:py-24 md:py-32 px-4 bg-majesty-ivory relative z-10">
          <CeremonyChateauStage
            events={events}
            venueName={venueName}
            venueMapUrl={venueMapUrl}
          />
        </section>

        {/* SCENE V: THE MEMORY PORTAL / SPATIAL MEMORY UNIVERSE */}
        <section className="bg-majesty-twilight relative z-10">
          <SpatialMemoryUniverse
            images={galleryImages}
            groomName={groomName}
            brideName={brideName}
            onOpenPhoto={(src, idx) => handleOpenPhoto(src, idx)}
          />
        </section>

        {/* SCENE VI: CHÂTEAU ESTATE & VERSAILLES GUEST REGISTRY */}
        <section className="py-16 sm:py-24 md:py-32 px-4 bg-majesty-ivory relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Estate Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="majesty-editorial-card rounded-[2.5rem] p-8 sm:p-12 md:p-16 space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white border border-[#A9C1D0] flex items-center justify-center mx-auto text-[#B7A16E] shadow-md">
                <MapPin size={30} weight="fill" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9B875D] font-bold font-montserrat">
                  Château Estate &amp; Pavilion
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-playfair font-bold text-[#4E687A]">
                  {venueName}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-[#708FA8] max-w-lg mx-auto font-lora font-medium">
                  {venueAddress}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={venueMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full majesty-btn-primary transition-all text-xs font-bold font-montserrat flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <ArrowSquareOut size={15} weight="bold" />
                  Google Maps Navigation
                </a>

                <button
                  onClick={handleCopyAddress}
                  className="px-6 py-3.5 rounded-full bg-white border border-[#A9C1D0]/60 hover:border-[#B7A16E] text-[#4E687A] transition-all text-xs font-semibold font-montserrat flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {copiedAddress ? (
                    <>
                      <CheckCircle size={15} weight="fill" className="text-emerald-600" />
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

            {/* RSVP Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="majesty-editorial-card rounded-[2.5rem] p-8 sm:p-12 md:p-16 relative z-10 max-w-2xl mx-auto text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-white border border-[#B7A16E] flex items-center justify-center text-[#B7A16E] shadow-md mx-auto">
                <Heart size={30} weight="fill" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9B875D] font-bold font-montserrat block">
                  Your Gracious Presence
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-[#4E687A]">
                  Celebrate With Us
                </h2>
                <p className="text-xs sm:text-sm text-[#708FA8] max-w-md mx-auto leading-relaxed font-lora font-medium">
                  Please honour us with your confirmed attendance and warm wishes as we celebrate our holy union by the lake.
                </p>
              </div>

              <motion.button
                type="button"
                onClick={() => setIsRsvpOpen(true)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="majesty-btn-gold w-full sm:w-auto sm:min-w-[280px] mx-auto px-8 py-4 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 cursor-pointer font-montserrat"
              >
                <Sparkle size={18} weight="fill" className="text-white" />
                <span>✦ Confirm Your RSVP ✦</span>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-14 bg-majesty-twilight border-t border-[#A9C1D0]/30 text-center space-y-4 text-xs text-[#FAFBF9]/80">
          <p className="font-lora italic text-base text-[#FAFBF9]">
            With profound love and gratitude, <br />
            The Montgomery &amp; De Valois Families
          </p>
          <p className="text-[11px] font-montserrat tracking-widest text-[#C9B989] font-semibold">
            {hashtag}
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={handleReplay}
              className="inline-flex items-center gap-1.5 text-xs text-[#A9C1D0] hover:text-white font-semibold cursor-pointer transition-colors"
            >
              <ArrowsClockwise size={14} /> Replay Royal Opening
            </button>
            <span>·</span>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#FAFBF9]/70 hover:text-white font-semibold cursor-pointer transition-colors"
            >
              Back to Top
            </button>
          </div>
        </footer>
      </main>

      {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
      <AnimatePresence>
        {(activePhotoSrc !== null || activePhotoIdx !== null) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => {
              setActivePhotoSrc(null);
              setActivePhotoIdx(null);
            }}
          >
            <button
              onClick={() => {
                setActivePhotoSrc(null);
                setActivePhotoIdx(null);
              }}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer z-50 shadow-lg"
              aria-label="Close photo preview"
            >
              <X size={22} weight="bold" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const total = galleryImages.length > 0 ? galleryImages.length : 1;
                const current = activePhotoIdx !== null ? activePhotoIdx : 0;
                const newIdx = (current - 1 + total) % total;
                setActivePhotoIdx(newIdx);
                setActivePhotoSrc(galleryImages[newIdx] || (newIdx % 2 === 0 ? "/templates/royal-majesty/couple-portrait.jpg" : "/templates/royal-majesty/ballroom-terrace.jpg"));
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer z-50 shadow-lg"
              aria-label="Previous photo"
            >
              <CaretLeft size={24} weight="bold" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const total = galleryImages.length > 0 ? galleryImages.length : 1;
                const current = activePhotoIdx !== null ? activePhotoIdx : 0;
                const newIdx = (current + 1) % total;
                setActivePhotoIdx(newIdx);
                setActivePhotoSrc(galleryImages[newIdx] || (newIdx % 2 === 0 ? "/templates/royal-majesty/couple-portrait.jpg" : "/templates/royal-majesty/ballroom-terrace.jpg"));
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer z-50 shadow-lg"
              aria-label="Next photo"
            >
              <CaretRight size={24} weight="bold" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-white/20 relative"
            >
              <img
                src={activePhotoSrc || (activePhotoIdx !== null && galleryImages[activePhotoIdx] ? galleryImages[activePhotoIdx] : galleryImages[0] || "/templates/royal-majesty/couple-portrait.jpg")}
                alt="Portrait detail"
                className="w-full h-full object-contain max-h-[85vh]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CRISP ROYAL RSVP MODAL */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="majesty-modal-overlay" onClick={() => setIsRsvpOpen(false)}>
            <motion.div
              className="majesty-modal-container font-montserrat"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="majesty-modal-close"
                onClick={() => setIsRsvpOpen(false)}
                aria-label="Close RSVP form"
              >
                <X size={18} weight="bold" />
              </button>

              <div className="text-center mb-6 pt-1">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#9B875D] font-bold font-montserrat block mb-1">
                  {selectedReligion === "muslim" ? "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ" : selectedReligion === "hindu" ? "॥ श्री गणेशाय नमः ॥" : "✦ REGENCY WEDDING GALA ✦"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-lora font-bold text-[#4E687A]">
                  Confirm Attendance
                </h3>
                <p className="text-xs sm:text-sm text-[#708FA8] font-lora mt-1 font-medium">
                  For {groomName} &amp; {brideName}&apos;s Royal Matrimony
                </p>
              </div>

              {isRsvpSubmitted ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#A9C1D0]/20 border-2 border-[#A9C1D0] flex items-center justify-center text-[#4E687A] mx-auto shadow-xl">
                    <CheckCircle size={36} weight="fill" className="text-[#708FA8]" />
                  </div>
                  <h4 className="text-2xl font-lora font-bold text-[#4E687A]">
                    Heartfelt Gratitude!
                  </h4>
                  <p className="text-sm text-[#708FA8] font-lora leading-relaxed max-w-xs mx-auto font-medium">
                    Thank you, <strong className="text-[#4E687A]">{rsvpName || "Gracious Guest"}</strong>! Your RSVP and warm wishes have been recorded.
                  </p>
                  <div className="pt-4 border-t border-[#A9C1D0]/30">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRsvpOpen(false);
                        setIsRsvpSubmitted(false);
                      }}
                      className="majesty-btn-gold w-full py-3 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md font-bold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[11px] font-bold text-[#4E687A] uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="e.g. Lord & Lady Hamilton"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#A9C1D0]/50 focus:border-[#B7A16E] focus:ring-2 focus:ring-[#B7A16E]/20 focus:outline-none text-sm text-[#4E687A] placeholder:text-[#9B875D]/60 font-lora font-medium shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4E687A] uppercase tracking-wider mb-1.5">
                      WhatsApp / Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      placeholder="+44 7911 123456"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#A9C1D0]/50 focus:border-[#B7A16E] focus:ring-2 focus:ring-[#B7A16E]/20 focus:outline-none text-sm text-[#4E687A] placeholder:text-[#9B875D]/60 font-lora font-medium shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4E687A] uppercase tracking-wider mb-1.5">
                      Number of Guests
                    </label>
                    <select
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#A9C1D0]/50 focus:border-[#B7A16E] focus:ring-2 focus:ring-[#B7A16E]/20 focus:outline-none text-sm text-[#4E687A] font-lora font-medium shadow-inner cursor-pointer"
                    >
                      <option value="1" className="text-[#4E687A]">1 Person</option>
                      <option value="2" className="text-[#4E687A]">2 Persons</option>
                      <option value="3" className="text-[#4E687A]">3 Persons</option>
                      <option value="4" className="text-[#4E687A]">4 Persons</option>
                      <option value="5+" className="text-[#4E687A]">5+ Family Members</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4E687A] uppercase tracking-wider mb-1.5">
                      Attendance Confirmation
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setRsvpAttending("yes")}
                        className={`py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                          rsvpAttending === "yes"
                            ? "bg-[#708FA8] text-white border-[#708FA8] shadow-md"
                            : "bg-white border-[#A9C1D0]/40 text-[#4E687A] hover:border-[#708FA8]"
                        }`}
                      >
                        ✨ Joyfully Attending
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpAttending("no")}
                        className={`py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                          rsvpAttending === "no"
                            ? "bg-[#708FA8] text-white border-[#708FA8] shadow-md"
                            : "bg-white border-[#A9C1D0]/40 text-[#4E687A] hover:border-[#708FA8]"
                        }`}
                      >
                        Regretfully Declining
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4E687A] uppercase tracking-wider mb-1.5">
                      Warm Wishes &amp; Blessings
                    </label>
                    <textarea
                      rows={3}
                      value={rsvpWishes}
                      onChange={(e) => setRsvpWishes(e.target.value)}
                      placeholder={`Leave your heartfelt blessings for ${groomName} & ${brideName}...`}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#A9C1D0]/50 focus:border-[#B7A16E] focus:ring-2 focus:ring-[#B7A16E]/20 focus:outline-none text-sm text-[#4E687A] placeholder:text-[#9B875D]/60 font-lora font-medium shadow-inner resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="majesty-btn-gold w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Sparkle size={16} weight="fill" className="text-white" />
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

// Sub-Component: Château Parallax Countdown Section
function ChateauParallaxCountdownSection({
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

  const bgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.05, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);

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
      className="relative w-full min-h-[90vh] overflow-hidden flex items-center justify-center py-20 px-4 select-none my-0"
    >
      {/* Parallax Background Château Ballroom Terrace */}
      <motion.div
        style={{
          y: bgY,
          scale: bgScale,
        }}
        className="absolute inset-x-0 -top-[25%] h-[150%] w-full pointer-events-none z-0 overflow-hidden"
      >
        <img
          src="/templates/royal-majesty/ballroom-terrace.jpg"
          alt="Royal French Château Ballroom Terrace"
          className="w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.15]"
        />
      </motion.div>

      {/* Atmospheric Gradients */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#EBECE8] to-transparent z-[1] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#EBECE8] to-transparent z-[1] pointer-events-none" />
      <div className="absolute inset-0 bg-black/30 z-[1] pointer-events-none" />

      {/* Countdown Pedestal */}
      <motion.div
        style={{ y: contentY }}
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl mx-auto p-8 sm:p-12 rounded-[2.5rem] bg-[#2D414E]/90 border border-[#A9C1D0] backdrop-blur-md shadow-2xl text-center space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/15 border border-[#A9C1D0] shadow-md">
          <Sparkle size={14} weight="fill" className="text-[#C9B989]" />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#FAFBF9] font-bold font-montserrat">
            ✦ Regency Matrimony Countdown ✦
          </span>
          <Sparkle size={14} weight="fill" className="text-[#C9B989]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#FAFBF9] drop-shadow-md">
            Until We Say &quot;I Do&quot;
          </h2>
          <p className="text-xs sm:text-sm text-[#BCD0DA] font-lora max-w-md mx-auto italic font-medium">
            Every passing moment brings us closer to our sacred vows under chandelier starlight
          </p>
        </div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 font-montserrat pt-2">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Mins", value: timeLeft.minutes },
            { label: "Secs", value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="py-4 px-2 sm:py-5 rounded-2xl bg-black/45 border border-[#A9C1D0]/40 shadow-lg flex flex-col items-center justify-center min-w-0"
            >
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FAFBF9] font-cinzel leading-none">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#BCD0DA] mt-2">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-white/15 text-[11px] font-montserrat text-[#FAFBF9]/90 flex items-center justify-center gap-2">
          <span className="text-[#C9B989] font-bold">✨ Auspicious Muhurat:</span>
          <span>{dayStr}, {dateStr} {yearStr}</span>
        </div>
      </motion.div>
    </section>
  );
}

// Sub-Component: 4-Chapter Château Grand Itinerary Stage
function CeremonyChateauStage({
  events,
  venueName,
  venueMapUrl,
}: {
  events: any[];
  venueName: string;
  venueMapUrl?: string;
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeEvent = events[selectedIdx] || events[0];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center space-y-2.5 sm:space-y-3 mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full majesty-gold-pill text-[10px] font-bold font-montserrat tracking-[0.25em] uppercase shadow-sm">
          <Sparkle size={12} weight="fill" className="text-[#9B875D]" />
          <span>The Order of Festivities</span>
          <Sparkle size={12} weight="fill" className="text-[#9B875D]" />
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#4E687A]">
          Ceremonial Itinerary
        </h2>

        <p className="text-xs sm:text-base text-[#708FA8] max-w-md mx-auto font-cormorant font-medium">
          Step through each grand salon chamber of music, soirees, and matrimonial vows
        </p>
      </div>

      {/* MOBILE EXPERIENCE: INLINE LUXURY CHAMBER ACCORDION (< lg) */}
      <div className="lg:hidden space-y-3.5">
        {events.map((evt: any, idx: number) => {
          const isExpanded = selectedIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl transition-all duration-300 border ${
                isExpanded
                  ? "bg-white/95 border-[#A9C1D0] shadow-xl ring-1 ring-[#B7A16E]/30"
                  : "bg-white/70 border-[#A9C1D0]/40 hover:bg-white/90"
              } overflow-hidden`}
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => setSelectedIdx(isExpanded ? (idx === 0 ? 1 : 0) : idx)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-cinzel text-xs font-bold transition-all flex-shrink-0 ${
                      isExpanded
                        ? "bg-gradient-to-br from-[#708FA8] to-[#4E687A] text-white shadow-md"
                        : "bg-[#A9C1D0]/30 border border-[#A9C1D0]/60 text-[#4E687A]"
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-playfair text-base font-bold text-[#4E687A] truncate">
                      {evt.name}
                    </h4>
                    <p className="text-[11px] text-[#708FA8] font-montserrat truncate">
                      {evt.date} · {evt.time}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 text-[#B7A16E]">
                  <CaretDown
                    size={18}
                    weight="bold"
                    className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                  />
                </div>
              </button>

              {/* Accordion Expanded Details Body */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-5 pt-1 space-y-4 border-t border-[#A9C1D0]/25 text-left">
                      <div className="flex items-center justify-between gap-2 pt-2">
                        <span className="px-3 py-0.5 rounded-full bg-[#A9C1D0]/20 text-[#4E687A] text-[10px] font-bold font-montserrat uppercase tracking-wider">
                          Chamber 0{idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-[#B7A16E] font-montserrat flex items-center gap-1">
                          <Clock size={13} weight="bold" />
                          {evt.time || "06:00 PM"}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#708FA8] font-lora leading-relaxed font-medium">
                        {evt.description}
                      </p>

                      {/* Info Pills */}
                      <div className="grid grid-cols-1 gap-2.5 pt-1">
                        <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#A9C1D0]/40 space-y-0.5">
                          <span className="text-[9px] uppercase font-bold tracking-widest text-[#9B875D] font-montserrat flex items-center gap-1">
                            <CalendarCheck size={12} weight="bold" /> Date &amp; Timing
                          </span>
                          <p className="text-xs font-semibold text-[#4E687A] font-lora">
                            {evt.date} · {evt.time}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#A9C1D0]/40 space-y-0.5">
                          <span className="text-[9px] uppercase font-bold tracking-widest text-[#9B875D] font-montserrat flex items-center gap-1">
                            <MapPin size={12} weight="bold" /> Grand Venue
                          </span>
                          <p className="text-xs font-semibold text-[#4E687A] font-lora truncate">
                            {evt.venue || venueName}
                          </p>
                        </div>

                        {evt.dress && (
                          <div className="p-3 rounded-xl bg-[#BCD0DA]/20 border border-[#A9C1D0]/40 flex items-center justify-between gap-2">
                            <span className="text-[9px] uppercase font-bold tracking-widest text-[#9B875D] font-montserrat">
                              Dress Code:
                            </span>
                            <span className="text-xs font-semibold text-[#4E687A] font-lora">
                              {evt.dress}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2">
                        <a
                          href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(evt.venue || venueName)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl majesty-btn-primary text-xs font-bold font-montserrat shadow-md cursor-pointer"
                        >
                          <MapPin size={14} weight="bold" />
                          <span>Get Directions to {evt.venue || venueName}</span>
                          <ArrowSquareOut size={13} />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* DESKTOP EXPERIENCE: DYNAMIC DUAL-COLUMN SALON STAGE (hidden on mobile, visible on lg) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Chapter List */}
        <div className="lg:col-span-5 space-y-3">
          {events.map((evt: any, idx: number) => {
            const isActive = selectedIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`majesty-itinerary-tab ${isActive ? "active" : ""}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="badge-icon w-8 h-8 rounded-full bg-[#A9C1D0]/30 border border-[#A9C1D0]/60 flex items-center justify-center font-cinzel text-xs font-bold transition-all">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-playfair text-base sm:text-lg font-bold text-[#4E687A] transition-colors">
                        {evt.name}
                      </h4>
                      <p className="text-xs text-[#708FA8] font-montserrat transition-colors">
                        {evt.date} · {evt.time}
                      </p>
                    </div>
                  </div>
                  <CaretRight size={16} className={`transition-transform ${isActive ? "translate-x-1 text-[#B7A16E]" : "opacity-40"}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Chamber Stage */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIdx}
              initial={{ opacity: 0, x: 25, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -25, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="majesty-editorial-card rounded-[2.5rem] p-8 sm:p-12 space-y-6 text-left"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#A9C1D0]/30 pb-4">
                <span className="px-3.5 py-1 rounded-full bg-[#A9C1D0]/20 text-[#4E687A] border border-[#A9C1D0]/50 text-xs font-bold font-montserrat tracking-wider uppercase">
                  Chamber 0{selectedIdx + 1}
                </span>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B7A16E] font-montserrat">
                  <Clock size={14} weight="bold" />
                  <span>{activeEvent.time || "06:00 PM"}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-[#4E687A]">
                  {activeEvent.name}
                </h3>
                <p className="text-sm sm:text-base text-[#708FA8] font-lora leading-relaxed font-medium">
                  {activeEvent.description}
                </p>
              </div>

              {/* Chamber Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-[#A9C1D0]/40 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#9B875D] font-montserrat flex items-center gap-1">
                    <CalendarCheck size={13} weight="bold" /> Date &amp; Timing
                  </span>
                  <p className="text-xs font-semibold text-[#4E687A] font-lora">
                    {activeEvent.date} · {activeEvent.time}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#A9C1D0]/40 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#9B875D] font-montserrat flex items-center gap-1">
                    <MapPin size={13} weight="bold" /> Grand Venue
                  </span>
                  <p className="text-xs font-semibold text-[#4E687A] font-lora truncate">
                    {activeEvent.venue || venueName}
                  </p>
                </div>
              </div>

              {activeEvent.dress && (
                <div className="p-4 rounded-2xl bg-[#BCD0DA]/20 border border-[#A9C1D0]/40 flex items-center justify-between gap-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#9B875D] font-montserrat">
                    Dress Code:
                  </span>
                  <span className="text-xs font-semibold text-[#4E687A] font-lora">
                    {activeEvent.dress}
                  </span>
                </div>
              )}

              <div className="pt-2">
                <a
                  href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(activeEvent.venue || venueName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full majesty-btn-primary text-xs font-bold font-montserrat shadow-md cursor-pointer"
                >
                  <MapPin size={14} weight="bold" />
                  <span>Get Directions to {activeEvent.venue || venueName}</span>
                  <ArrowSquareOut size={13} />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Sub-Component: SPATIAL MEMORY UNIVERSE (Interactive 3D Perspective Corridor)
function SpatialMemoryUniverse({
  images,
  groomName,
  brideName,
  onOpenPhoto,
}: {
  images: string[];
  groomName: string;
  brideName: string;
  onOpenPhoto: (src: string, idx: number) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Guarantee 4 valid image assets with fallback to local photos
  const safeImg1 = images?.[0] || "/templates/royal-majesty/couple-portrait.jpg";
  const safeImg2 = images?.[1] || "/templates/royal-majesty/ballroom-terrace.jpg";
  const safeImg3 = images?.[2] || "/templates/royal-majesty/couple-portrait.jpg";
  const safeImg4 = images?.[3] || "/templates/royal-majesty/ballroom-terrace.jpg";
  const memoryPhotos = [safeImg1, safeImg2, safeImg3, safeImg4];
  const totalMemories = 4;

  const fallbackImg = "/templates/royal-majesty/couple-portrait.jpg";
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.currentTarget as HTMLImageElement).src = fallbackImg;
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 70, damping: 22 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 70, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct * 12);
    mouseY.set(yPct * -12);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const nextMemory = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % totalMemories);
  };

  const prevMemory = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + totalMemories) % totalMemories);
  };

  const goToMemory = (idx: number) => {
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
  };

  const chapters = [
    { title: "The Beginning", subtitle: "Solemn Union", tag: "Memory Portal" },
    { title: "Royal Elegance", subtitle: "Editorial Portrait", tag: "Haute Split" },
    { title: "Starlit Moments", subtitle: "Constellation", tag: "Triptych Shards" },
    { title: "Forever Together", subtitle: "Eternal Vows", tag: "Memory Freeze" },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-12 sm:py-20 md:py-28 px-3 sm:px-6 bg-majesty-twilight overflow-hidden select-none"
    >
      {/* Ambient Starlight & Aurora Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#A9C1D0]/10 filter blur-[90px]" />
        <div className="absolute bottom-10 right-1/4 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#B7A16E]/15 filter blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(112,143,168,0.15)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Top Atmosphere Header */}
        <div className="text-center space-y-2.5 sm:space-y-3 mb-6 sm:mb-10 w-full px-2">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/10 border border-[#A9C1D0]/50 text-[#FAFBF9] text-[9px] sm:text-xs font-bold font-montserrat tracking-[0.2em] uppercase shadow-lg backdrop-blur-md">
            <Sparkle size={12} weight="fill" className="text-[#C9B989]" />
            <span>The Memory Portal · Spatial Universe</span>
            <Sparkle size={12} weight="fill" className="text-[#C9B989]" />
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#FAFBF9] tracking-tight drop-shadow-md">
            Memories in Perspective
          </h2>
          <p className="text-[11px] sm:text-sm text-[#BCD0DA] font-lora italic max-w-md mx-auto">
            Step through the aristocratic chambers of our love story suspended in time
          </p>

          {/* Chapter Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-2 sm:pt-3">
            {chapters.map((ch, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  onClick={() => goToMemory(idx)}
                  className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-montserrat transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#B7A16E] to-[#C9B989] text-[#1D2C36] font-bold shadow-md shadow-[#B7A16E]/30 scale-105"
                      : "bg-white/10 hover:bg-white/20 text-[#DEE3E2] border border-[#A9C1D0]/30 font-medium"
                  }`}
                >
                  <span className="opacity-70 font-mono text-[9px]">0{idx + 1}</span>
                  <span>{ch.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Perspective Stage Corridor */}
        <motion.div
          style={{
            rotateY: smoothMouseX,
            rotateX: smoothMouseY,
          }}
          className="majesty-spatial-stage relative w-full h-[380px] sm:h-[460px] md:h-[520px] flex items-center justify-center"
        >
          {/* Background Giant Watermark Numeral */}
          <div className="majesty-giant-numeral">
            0{activeIndex + 1}
          </div>

          {/* 3D Multi-Layered Stack */}
          {Array.from({ length: totalMemories }).map((_, idx) => {
            const offset = (idx - activeIndex + totalMemories) % totalMemories;
            if (offset > 2) return null;

            const isFocus = offset === 0;
            const isNext = offset === 1;
            const isDeeper = offset === 2;

            let zTranslate = 0;
            let scaleVal = 1;
            let opacityVal = 1;
            let blurVal = "blur(0px)";
            let zIndexVal = 30;
            let yOffset = 0;

            if (isNext) {
              zTranslate = -140;
              scaleVal = 0.88;
              opacityVal = 0.45;
              blurVal = "blur(2px)";
              zIndexVal = 20;
              yOffset = 20;
            } else if (isDeeper) {
              zTranslate = -260;
              scaleVal = 0.78;
              opacityVal = 0.2;
              blurVal = "blur(4px)";
              zIndexVal = 10;
              yOffset = 38;
            }

            return (
              <motion.div
                key={idx}
                animate={{
                  scale: scaleVal,
                  opacity: opacityVal,
                  y: yOffset,
                  filter: blurVal,
                  zIndex: zIndexVal,
                }}
                transition={{
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  transform: `translateZ(${zTranslate}px)`,
                }}
                onClick={() => {
                  if (!isFocus) {
                    goToMemory(idx);
                  }
                }}
                className={`absolute inset-0 flex items-center justify-center p-1 sm:p-4 majesty-spatial-plane ${
                  !isFocus ? "cursor-pointer hover:opacity-75 transition-opacity" : ""
                }`}
              >
                {/* BESPOKE LAYOUTS BY CHAPTER */}
                {idx === 0 && (
                  /* Chapter 1: Royal Arch Frame */
                  <div
                    className={`relative w-[260px] sm:w-[320px] md:w-[380px] h-[350px] sm:h-[420px] md:h-[470px] majesty-portal-arch-frame group shadow-2xl bg-[#1D2C36] ${
                      isFocus ? "cursor-pointer" : ""
                    }`}
                    onClick={(e) => {
                      if (isFocus) {
                        e.stopPropagation();
                        onOpenPhoto(memoryPhotos[0], 0);
                      }
                    }}
                  >
                    <img
                      src={memoryPhotos[0]}
                      onError={handleImgError}
                      alt="The Beginning"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Stamp */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-[#A9C1D0]/60 text-[9px] sm:text-[10px] font-bold text-[#FAFBF9] font-montserrat uppercase tracking-wider">
                        Memory Portal · 01
                      </span>
                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white backdrop-blur-md shadow-md">
                        <MagnifyingGlassPlus size={14} weight="bold" />
                      </span>
                    </div>

                    {/* Bottom Pedestal Card */}
                    <div className="absolute bottom-3 left-3 right-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/80 backdrop-blur-md border border-[#A9C1D0]/50 text-center pointer-events-none space-y-0.5 sm:space-y-1">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9B989] font-montserrat block">
                        Solemn Union
                      </span>
                      <h4 className="text-sm sm:text-base md:text-lg font-lora font-bold text-[#FAFBF9] truncate">
                        {groomName} &amp; {brideName}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-[#BCD0DA] font-lora italic">
                        Tap to view photographic canvas
                      </p>
                    </div>
                  </div>
                )}

                {idx === 1 && (
                  /* Chapter 2: Royal Elegance Split Composition */
                  <div className="relative w-[92vw] max-w-xl md:max-w-2xl h-[350px] sm:h-[420px] flex items-center justify-center">
                    {/* Main Hero Landscape */}
                    <div
                      className={`w-[68%] h-[280px] sm:h-[350px] majesty-portal-split-hero relative z-10 group shadow-2xl bg-[#1D2C36] overflow-hidden ${
                        isFocus ? "cursor-pointer hover:ring-2 hover:ring-[#A9C1D0]/60 transition-all" : ""
                      }`}
                      onClick={(e) => {
                        if (isFocus) {
                          e.stopPropagation();
                          onOpenPhoto(memoryPhotos[1], 1);
                        }
                      }}
                    >
                      <img
                        src={memoryPhotos[1]}
                        onError={handleImgError}
                        alt="Royal Elegance"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 border border-white/20 text-[8px] sm:text-[9px] text-[#FAFBF9] font-montserrat">
                        <MagnifyingGlassPlus size={11} />
                        <span>Landscape ✦</span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-left pointer-events-none">
                        <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-widest text-[#C9B989] font-montserrat block">
                          Royal Elegance · 02
                        </span>
                        <h4 className="text-xs sm:text-base font-playfair font-bold text-white truncate">
                          Lakeside Romance &amp; Crystal Chandeliers
                        </h4>
                      </div>
                    </div>

                    {/* Floating Zoom Detail */}
                    <div
                      className={`w-[38%] h-[160px] sm:h-[210px] -ml-8 sm:-ml-10 -mt-12 sm:-mt-16 majesty-portal-split-detail relative z-20 shadow-2xl group border border-[#B7A16E]/70 bg-[#1D2C36] overflow-hidden ${
                        isFocus ? "cursor-pointer hover:ring-2 hover:ring-[#B7A16E] hover:scale-105 transition-all" : ""
                      }`}
                      onClick={(e) => {
                        if (isFocus) {
                          e.stopPropagation();
                          onOpenPhoto(memoryPhotos[2], 2);
                        }
                      }}
                    >
                      <img
                        src={memoryPhotos[2]}
                        onError={handleImgError}
                        alt="Couture Detail"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/75 border border-[#B7A16E]/60 text-[8px] sm:text-[9px] font-bold text-[#FAFBF9] font-montserrat flex items-center gap-1">
                        <MagnifyingGlassPlus size={10} />
                        <span>Detail ✦</span>
                      </div>
                    </div>
                  </div>
                )}

                {idx === 2 && (
                  /* Chapter 3: Starlit Moments Constellation (Triptych Shards) */
                  <div className="relative w-[92vw] max-w-xl md:max-w-2xl h-[350px] sm:h-[420px] grid grid-cols-3 gap-2 sm:gap-3 items-center">
                    {/* Left Shard */}
                    <div
                      className={`h-[210px] sm:h-[260px] majesty-fragment-shard -translate-y-2.5 sm:-translate-y-3 opacity-80 hover:opacity-100 bg-[#1D2C36] overflow-hidden group ${
                        isFocus ? "cursor-pointer hover:scale-105 transition-all" : ""
                      }`}
                      onClick={(e) => {
                        if (isFocus) {
                          e.stopPropagation();
                          onOpenPhoto(memoryPhotos[0], 0);
                        }
                      }}
                    >
                      <img src={memoryPhotos[0]} onError={handleImgError} alt="Left Shard" className="w-full h-full object-cover group-hover:scale-105 transition-transform pointer-events-none" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none" />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[8px] text-[#FAFBF9] font-montserrat">
                        01
                      </div>
                    </div>

                    {/* Center Shard */}
                    <div
                      className={`h-[280px] sm:h-[340px] majesty-fragment-shard border-2 border-[#B7A16E] z-10 shadow-2xl bg-[#1D2C36] overflow-hidden group ${
                        isFocus ? "cursor-pointer hover:scale-105 transition-all" : ""
                      }`}
                      onClick={(e) => {
                        if (isFocus) {
                          e.stopPropagation();
                          onOpenPhoto(memoryPhotos[2], 2);
                        }
                      }}
                    >
                      <img src={memoryPhotos[2]} onError={handleImgError} alt="Center Shard" className="w-full h-full object-cover group-hover:scale-105 transition-transform pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2.5 inset-x-1 text-center pointer-events-none">
                        <span className="text-[9px] sm:text-[10px] font-cinzel font-bold text-[#C9B989] uppercase tracking-wider flex items-center justify-center gap-1">
                          <MagnifyingGlassPlus size={12} />
                          <span>✦ Starlit Moments ✦</span>
                        </span>
                      </div>
                    </div>

                    {/* Right Shard */}
                    <div
                      className={`h-[210px] sm:h-[260px] majesty-fragment-shard translate-y-2.5 sm:translate-y-3 opacity-80 hover:opacity-100 bg-[#1D2C36] overflow-hidden group ${
                        isFocus ? "cursor-pointer hover:scale-105 transition-all" : ""
                      }`}
                      onClick={(e) => {
                        if (isFocus) {
                          e.stopPropagation();
                          onOpenPhoto(memoryPhotos[1], 1);
                        }
                      }}
                    >
                      <img src={memoryPhotos[1]} onError={handleImgError} alt="Right Shard" className="w-full h-full object-cover group-hover:scale-105 transition-transform pointer-events-none" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none" />
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[8px] text-[#FAFBF9] font-montserrat">
                        02
                      </div>
                    </div>
                  </div>
                )}

                {idx === 3 && (
                  /* Chapter 4: Forever Together Memory Freeze */
                  <div
                    className={`relative w-[90vw] max-w-2xl h-[350px] sm:h-[420px] majesty-portal-freeze-frame group shadow-2xl bg-[#1D2C36] ${
                      isFocus ? "cursor-pointer" : ""
                    }`}
                    onClick={(e) => {
                      if (isFocus) {
                        e.stopPropagation();
                        onOpenPhoto(memoryPhotos[3], 3);
                      }
                    }}
                  >
                    <img
                      src={memoryPhotos[3]}
                      onError={handleImgError}
                      alt="Forever Together"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 pointer-events-none filter brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50 pointer-events-none" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-1.5 sm:space-y-2 pointer-events-none">
                      <span className="text-[9px] sm:text-xs uppercase font-bold tracking-[0.25em] text-[#C9B989] font-montserrat flex items-center justify-center gap-1">
                        <MagnifyingGlassPlus size={14} />
                        <span>✦ Forever Together ✦</span>
                      </span>
                      <h3 className="font-great-vibes text-3xl sm:text-5xl md:text-6xl text-[#FAFBF9] drop-shadow-lg">
                        A Moment We&apos;ll Keep Forever
                      </h3>
                      <p className="font-cormorant text-sm sm:text-xl text-[#DEE3E2] max-w-md mx-auto italic font-medium">
                        {groomName} &amp; {brideName}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Interactive Controls (Single Unified Responsive Row) */}
        <div className="mt-6 sm:mt-8 flex flex-row items-center justify-center gap-2 sm:gap-3 w-full max-w-md px-2">
          {/* Arrow Left */}
          <button
            onClick={prevMemory}
            aria-label="Previous Memory"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-[#A9C1D0]/40 hover:border-[#B7A16E] text-[#FAFBF9] flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer flex-shrink-0 group"
          >
            <CaretLeft size={18} weight="bold" className="group-hover:-translate-x-0.5 transition-transform text-[#C9B989]" />
          </button>

          {/* Golden Advance CTA */}
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={nextMemory}
            className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#B7A16E] via-[#C9B989] to-[#B7A16E] text-[#1D2C36] font-montserrat text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#B7A16E]/20 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap"
          >
            <Sparkle size={14} weight="fill" />
            <span>Next Memory ({activeIndex + 1}/{totalMemories})</span>
            <CaretRight size={14} weight="bold" />
          </motion.button>

          {/* Arrow Right */}
          <button
            onClick={nextMemory}
            aria-label="Next Memory"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-[#A9C1D0]/40 hover:border-[#B7A16E] text-[#FAFBF9] flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer flex-shrink-0 group"
          >
            <CaretRight size={18} weight="bold" className="group-hover:translate-x-0.5 transition-transform text-[#C9B989]" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-2 mt-4">
          {Array.from({ length: totalMemories }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToMemory(i)}
              aria-label={`Jump to Memory 0${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === activeIndex
                  ? "w-6 bg-gradient-to-r from-[#B7A16E] to-[#C9B989] shadow-sm"
                  : "w-2 bg-[#A9C1D0]/40 hover:bg-[#A9C1D0]/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
