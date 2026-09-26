"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
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
  Play,
  ArrowsClockwise,
  MoonStars,
  GlobeHemisphereWest,
  SpeakerHigh,
  SpeakerSlash,
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
    return "/templates/royal-grace/music.mp3";
  }
  if (track.startsWith("/") || track.startsWith("http://") || track.startsWith("https://") || track.startsWith("blob:")) {
    return track;
  }
  return `/audio/${track}.mp3`;
}

interface RoyalGraceProps {
  data?: any;
}

export default function RoyalGrace({ data }: RoyalGraceProps) {
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
  const hashtag = data?.hashtag || defaultData.hashtag || `#${groomName}Weds${brideName}`.replace(/\s+/g, "");

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

  // Video Gate Timing & Content Reveal State (opens at ~6.0s)
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [isContentRevealed, setIsContentRevealed] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

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
            audio.src = "/templates/royal-grace/music.mp3";
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

  // Video playback time listener to trigger gate reveal at ~6.0s when doors & curtains open
  const handleVideoTimeUpdate = () => {
    if (!heroVideoRef.current || !isVideoStarted) return;
    const ct = heroVideoRef.current.currentTime;
    setVideoCurrentTime(ct);

    if (ct >= 6.0 && !isContentRevealed) {
      setIsContentRevealed(true);
      confetti({
        particleCount: 80,
        spread: 85,
        origin: { y: 0.55 },
        colors: ["#d4af37", "#f3cf7a", "#8da48f", "#ffffff"],
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

    // Fallback timer at 6.2s
    setTimeout(() => {
      setIsContentRevealed(true);
    }, 6200);
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
      particleCount: 75,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#d4af37", "#f3cf7a", "#8da48f", "#faf8f2"],
    });
  };

  // Dual Faith Invocation Texts
  const getInvocation = () => {
    switch (selectedReligion) {
      case "hindu":
        return {
          title: "॥ श्री गणेशाय नमः ॥",
          arabicOrSanskrit: "मङ्गलम् भगवान विष्णुः मङ्गलम् गरुडध्वजः । मङ्गलम् पुण्डरीकाक्षः मङ्गलाय तनो हरिः ॥",
          english: "With the divine blessings of Lord Ganesha and our elders, we joyfully solicit your gracious presence at our sacred wedding celebration.",
          tag: "Vedic Hindu Blessing",
        };
      case "muslim":
        return {
          title: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
          arabicOrSanskrit: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
          english: "“And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.” (Surah Ar-Rum 30:21)",
          tag: "Sacred Nikah Blessing",
        };
      default:
        return {
          title: "Two Souls · Bound by Grace",
          arabicOrSanskrit: "“Where there is profound love, there is eternal grace.”",
          english: defaultData.quote,
          tag: "Universal Celebration",
        };
    }
  };

  const invocation = getInvocation();

  return (
    <div className={`min-h-screen bg-grace-twilight text-[#fcfbf9] font-lora relative selection:bg-[#d4af37]/30 selection:text-[#fae4a8] ${!isContentRevealed ? "h-[100dvh] max-h-screen overflow-hidden touch-none" : "overflow-x-hidden"}`}>
      {/* Ambient Botanical Gold Dust Petals */}
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
        <source src="/templates/royal-grace/music.mp3" type="audio/mpeg" />
        <source src="/audio/wedding-ambience.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Toggle (Bottom-Right Circular Gold Button) */}
      <motion.button
        type="button"
        id="grace-music-toggle-btn"
        className="grace-music-toggle pointer-events-auto cursor-pointer"
        onClick={toggleAudio}
        aria-label={isPlayingMusic ? "Mute soundtrack" : "Play soundtrack"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {isPlayingMusic ? (
          <>
            <SpeakerHigh size={19} weight="fill" />
            <span className="grace-soundwave-bars">
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
          1. CINEMATIC HERO SECTION (SYNCHRONIZED GATE & CURTAIN REVEAL)
             0s - 6.0s: Embossed Sage Velvet Doors with "TAP TO OPEN" Cartouche
             ~6.0s+: Doors swing wide open into the royal botanical hall
          ---------------------------------------------------- */}
      <section className="relative w-full h-screen min-h-[100dvh] overflow-hidden flex flex-col justify-between items-center text-center select-none bg-black">
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
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.9] contrast-[1.05]"
        />

        {/* Ambient Twilight Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/80 z-[1] pointer-events-none" />

        {/* Top Header: Faith Switcher Pill */}
        <header className="relative z-20 w-full px-4 pt-4 md:pt-6 flex items-center justify-center max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-black/55 backdrop-blur-md border border-[#d4af37]/35 shadow-lg text-xs font-jakarta">
            <button
              onClick={() => setSelectedReligion("universal")}
              className={`px-3 py-1 rounded-full transition-all text-[10px] md:text-[11px] font-semibold flex items-center gap-1 ${
                selectedReligion === "universal"
                  ? "bg-[#d4af37] text-[#0e1713] shadow-sm font-bold"
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
                  ? "bg-[#d4af37] text-[#0e1713] shadow-sm font-bold"
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
                  ? "bg-[#d4af37] text-[#0e1713] shadow-sm font-bold"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <MoonStars size={12} weight="bold" />
              Muslim
            </button>
          </div>
        </header>

        {/* ----------------------------------------------------
            FULL-SCREEN TAP TRIGGER (Clean unobstructed view for the video's built-in "TAP TO OPEN" placard)
            ---------------------------------------------------- */}
        {!isVideoStarted && (
          <button
            type="button"
            onClick={handleStartGateExperience}
            aria-label="Tap to open royal gates"
            className="absolute inset-0 z-10 w-full h-full cursor-pointer bg-transparent border-0 outline-none select-none focus:outline-none"
          />
        )}

        {/* ----------------------------------------------------
            CHOREOGRAPHED CONTENT REVEAL (Synchronized at ~6s after click)
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

              {/* AMPERSAND */}
              <div className="font-great-vibes text-3xl sm:text-4xl md:text-5xl text-[#fae4a8] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] py-0.5">
                &amp;
              </div>

              {/* BRIDE BLOCK */}
              <div className="space-y-0.5 pb-2">
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
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/80 font-jakarta font-semibold drop-shadow-md">
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
          2. CONTINUOUS STORYTELLING CHAPTERS (ALTERNATING MEHNDI SAGE & WARM IVORY)
          ---------------------------------------------------- */}
      <main ref={contentSectionRef} className="relative z-10 overflow-hidden">
        
        {/* ── CHAPTER 1: SACRED BLESSINGS & INVOCATIONS (WARM IVORY SECTION) ── */}
        <section className="bg-grace-ivory py-16 sm:py-24 md:py-32 px-4 relative z-10 border-b border-[#9A7A49]/25">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grace-card-ivory p-7 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[2.5rem] space-y-5 sm:space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#FAF7F0] border border-[#9A7A49]/60 shadow-sm">
                <Sparkle size={14} weight="fill" className="text-[#9A7A49]" />
                <span className="font-jakarta text-xs md:text-sm font-bold tracking-[0.2em] text-[#3C2F1D]">
                  {invocation.tag}
                </span>
                <Sparkle size={14} weight="fill" className="text-[#9A7A49]" />
              </div>

              <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#3C2F1D]">
                {invocation.title}
              </h2>

              <p className="font-amiri text-lg sm:text-xl md:text-2xl text-[#4A3B24] italic leading-relaxed whitespace-pre-line font-semibold">
                {invocation.arabicOrSanskrit}
              </p>

              <div className="w-28 h-[1.5px] bg-gradient-to-r from-transparent via-[#9A7A49] to-transparent mx-auto" />

              <p className="font-cormorant text-sm sm:text-base md:text-lg text-[#3C2F1D] leading-relaxed max-w-xl mx-auto font-medium">
                {invocation.english}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── CHAPTER 2: AUSPICIOUS DATE SCRATCH REVEAL (RICH MEHNDI GREEN SECTION) ── */}
        <section className="bg-grace-mehndi py-14 sm:py-20 md:py-28 px-4 relative z-10 text-center border-b border-[#9A7A49]/30">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#E0D3B8] font-bold font-jakarta">
                ✦ Auspicious Wedding Muhurat ✦
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#FAF7F0] drop-shadow-md">
                Scratch To Reveal The Date
              </h2>
              <p className="text-xs sm:text-sm text-[#E0D3B8] font-lora">
                Scratch off the shimmering antique gold foil to unveil our sacred wedding date
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
          </div>
        </section>

        {/* ── CHAPTER 3: CELESTIAL COUNTDOWN & PARALLAX BOTANICAL PALACE ── */}
        <RoyalGraceParallaxCountdown
          targetDate={rawDate}
          dayStr={dayStr}
          dateStr={dateStr}
          yearStr={yearStr}
        />

        {/* ── CHAPTER 4: ORDER OF CEREMONIES (WARM IVORY PARCHMENT SECTION) ── */}
        <section className="bg-grace-ivory py-16 sm:py-24 md:py-32 px-4 relative z-10 border-y border-[#9A7A49]/25">
          <RoyalGraceCeremonyJourney
            events={events}
            venueName={venueName}
            venueMapUrl={venueMapUrl}
            dateStr={dateStr}
          />
        </section>

        {/* ── CHAPTER 5: MEMORY GALLERY (RICH MEHNDI SAGE DECK SECTION) ── */}
        <section className="bg-grace-mehndi py-16 sm:py-24 md:py-32 px-4 relative z-10 border-b border-[#9A7A49]/30">
          <RoyalGraceGallery
            images={galleryImages}
            groomName={groomName}
            brideName={brideName}
            onOpenPhoto={(idx) => setActivePhotoIdx(idx)}
          />
        </section>

        {/* ── CHAPTER 6: CELEBRATION ESTATE & VENUE (WARM IVORY SECTION) ── */}
        <section className="bg-grace-ivory py-16 sm:py-24 md:py-28 px-4 relative z-10 border-b border-[#9A7A49]/25">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grace-card-ivory p-7 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[2.5rem] text-center space-y-5 sm:space-y-6 shadow-2xl"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FAF7F0] border-2 border-[#9A7A49] flex items-center justify-center mx-auto text-[#9A7A49] shadow-md">
                <MapPin size={28} weight="fill" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9A7A49] font-bold font-jakarta">
                  ✦ Celebration Estate ✦
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-lora font-bold text-[#3C2F1D]">
                  {venueName}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-[#4B4D34] max-w-lg mx-auto font-lora font-medium">
                  {venueAddress}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-3 sm:pt-4">
                <a
                  href={venueMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#9A7A49] text-[#FAF7F0] hover:bg-[#B69A68] transition-all text-xs font-bold font-jakarta flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <ArrowSquareOut size={15} weight="bold" />
                  Google Maps Navigation
                </a>

                <button
                  onClick={handleCopyAddress}
                  className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#FAF7F0] border border-[#9A7A49]/60 hover:border-[#9A7A49] text-[#3C2F1D] transition-all text-xs font-bold font-jakarta flex items-center gap-2 cursor-pointer shadow-sm"
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
          </div>
        </section>

        {/* ── CHAPTER 7: RSVP (RICH MEHNDI GREEN SECTION WITH IVORY FORM) ── */}
        <section className="bg-grace-mehndi py-16 sm:py-24 md:py-28 px-4 relative z-10 text-center">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grace-card-ivory p-8 sm:p-12 md:p-14 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#9A7A49]/15 border border-[#9A7A49] flex items-center justify-center text-[#9A7A49] shadow-lg"
                >
                  <Heart size={28} weight="fill" />
                </motion.div>
              </div>

              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9A7A49] font-bold font-jakarta block mb-2">
                ✦ Your Presence is Our Honour ✦
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-lora font-bold text-[#725A38] mb-3">
                Celebrate With Us
              </h2>
              <p className="text-xs sm:text-sm text-[#5F6144] max-w-md mx-auto mb-8 leading-relaxed font-lora font-medium">
                Please honor us with your confirmed attendance and warm blessings as we step into this glorious new chapter of our lives.
              </p>

              <motion.button
                type="button"
                onClick={() => setIsRsvpOpen(true)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto sm:min-w-[260px] mx-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#9A7A49] via-[#B69A68] to-[#9A7A49] hover:brightness-105 text-[#FAF7F0] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer font-jakarta"
              >
                <Sparkle size={18} weight="fill" className="text-[#FAF7F0]" />
                <span>✦ Confirm Your RSVP ✦</span>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* ── CHAPTER 8: FOOTER (DEEP OLIVE & ANTIQUE GOLD) ── */}
        <footer className="bg-grace-olive py-14 border-t border-[#9A7A49]/30 text-center space-y-4 text-xs text-[#E0D3B8]">
          <p className="font-lora italic text-base text-[#FAF7F0]">
            With boundless love and gratitude, <br />
            The Kapoor &amp; Singhania Families
          </p>
          <p className="text-[11px] font-jakarta tracking-widest text-[#B69A68] font-bold">
            {hashtag}
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 font-jakarta">
            <button
              onClick={handleReplayGate}
              className="inline-flex items-center gap-1.5 text-xs text-[#FAF7F0] hover:text-[#B69A68] font-semibold cursor-pointer"
            >
              <ArrowsClockwise size={14} /> Replay Gate Opening
            </button>
            <span>·</span>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#E0D3B8] hover:text-[#FAF7F0] font-semibold cursor-pointer"
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

      {/* ROYAL RSVP MODAL DIALOG */}
      {/* FULLSCREEN ROYAL RSVP MODAL */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="grace-modal-overlay" onClick={() => setIsRsvpOpen(false)}>
            <motion.div
              className="grace-modal-container font-jakarta shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="grace-modal-close"
                onClick={() => setIsRsvpOpen(false)}
                aria-label="Close RSVP form"
              >
                <X size={18} weight="bold" />
              </button>

              <div className="text-center mb-6 pt-1">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#9A7A49] font-bold font-jakarta block mb-1">
                  {selectedReligion === "muslim" ? "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ" : selectedReligion === "hindu" ? "॥ श्री गणेशाय नमः ॥" : "✦ SACRED UNION ✦"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-lora font-bold text-[#3C2F1D]">
                  Confirm Attendance
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6144] font-lora mt-1 font-medium">
                  For {groomName} &amp; {brideName}&apos;s Royal Celebration
                </p>
              </div>

              {isRsvpSubmitted ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#9A7A49]/20 border-2 border-[#9A7A49] flex items-center justify-center text-[#9A7A49] mx-auto shadow-xl">
                    <CheckCircle size={36} weight="fill" />
                  </div>
                  <h4 className="text-2xl font-lora font-bold text-[#3C2F1D]">
                    Heartfelt Gratitude!
                  </h4>
                  <p className="text-sm text-[#4B4D34] font-lora leading-relaxed max-w-xs mx-auto font-medium">
                    Thank you, <strong className="text-[#3C2F1D]">{rsvpName || "Dear Guest"}</strong>! Your RSVP and heartfelt blessings have been lovingly recorded.
                  </p>
                  <div className="pt-4 border-t border-[#9A7A49]/30">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRsvpOpen(false);
                        setIsRsvpSubmitted(false);
                      }}
                      className="w-full py-3 rounded-xl bg-[#9A7A49] hover:bg-[#B69A68] text-[#FAF7F0] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3C2F1D] uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="e.g. Vikram & Maya Singhania"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#9A7A49]/50 focus:border-[#9A7A49] focus:ring-2 focus:ring-[#9A7A49]/20 focus:outline-none text-sm text-[#1F1A12] placeholder:text-[#8C7D6B] font-lora font-medium shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3C2F1D] uppercase tracking-wider mb-1.5">
                      WhatsApp / Phone Number
                    </label>
                    <input
                      type="tel"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#9A7A49]/50 focus:border-[#9A7A49] focus:ring-2 focus:ring-[#9A7A49]/20 focus:outline-none text-sm text-[#1F1A12] placeholder:text-[#8C7D6B] font-lora font-medium shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3C2F1D] uppercase tracking-wider mb-1.5">
                      Number of Guests
                    </label>
                    <select
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#9A7A49]/50 focus:border-[#9A7A49] focus:ring-2 focus:ring-[#9A7A49]/20 focus:outline-none text-sm text-[#1F1A12] font-lora font-medium shadow-inner cursor-pointer"
                    >
                      <option value="1" className="text-[#1F1A12]">1 Person</option>
                      <option value="2" className="text-[#1F1A12]">2 Persons</option>
                      <option value="3" className="text-[#1F1A12]">3 Persons</option>
                      <option value="4" className="text-[#1F1A12]">4 Persons</option>
                      <option value="5+" className="text-[#1F1A12]">5+ Family Members</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3C2F1D] uppercase tracking-wider mb-1.5">
                      Attending Ceremonies
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setRsvpAttending("yes")}
                        className={`py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                          rsvpAttending === "yes"
                            ? "bg-[#9A7A49] text-[#FAF7F0] border-[#9A7A49] shadow-md"
                            : "bg-white border-[#9A7A49]/40 text-[#4B4D34] hover:border-[#9A7A49]"
                        }`}
                      >
                        ✨ Joyfully Attending
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpAttending("no")}
                        className={`py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                          rsvpAttending === "no"
                            ? "bg-[#9A7A49] text-[#FAF7F0] border-[#9A7A49] shadow-md"
                            : "bg-white border-[#9A7A49]/40 text-[#4B4D34] hover:border-[#9A7A49]"
                        }`}
                      >
                        Regretfully Declining
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3C2F1D] uppercase tracking-wider mb-1.5">
                      Warm Wishes &amp; Blessings
                    </label>
                    <textarea
                      rows={3}
                      value={rsvpWishes}
                      onChange={(e) => setRsvpWishes(e.target.value)}
                      placeholder={`Leave your heartfelt blessings for ${groomName} & ${brideName}...`}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#9A7A49]/50 focus:border-[#9A7A49] focus:ring-2 focus:ring-[#9A7A49]/20 focus:outline-none text-sm text-[#1F1A12] placeholder:text-[#8C7D6B] font-lora font-medium shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#9A7A49] via-[#B69A68] to-[#9A7A49] hover:brightness-105 text-[#FAF7F0] text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-3"
                  >
                    <Sparkle size={16} weight="fill" className="text-[#FAF7F0]" />
                    <span>✦ Submit RSVP ✦</span>
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

// Sub-Component: Full-Width Full-Height Crazy Parallax Botanical Glasshouse Palace Countdown Section
function RoyalGraceParallaxCountdown({
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

  // Multi-layered parallax transforms across height, scale, rotation and glow
  const bgY = useTransform(scrollYProgress, [0, 1], ["-28%", "28%"]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.32, 1.1, 1.28]);
  const bgRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["80px", "-80px"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.9, 0.35]);

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
          src="/templates/royal-grace/botanical-palace.jpg"
          alt="Royal Botanical Glasshouse Palace"
          className="w-full h-full object-cover object-center filter brightness-[0.76] contrast-[1.15] saturate-[1.22]"
        />
      </motion.div>

      {/* Atmospheric Top & Bottom Seamless Dark Gradients */}
      <div className="absolute inset-x-0 top-0 h-44 sm:h-64 bg-gradient-to-b from-[#5F6144] via-[#5F6144]/80 to-transparent z-[1] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-44 sm:h-64 bg-gradient-to-t from-[#FAF7F0] via-[#FAF7F0]/80 to-transparent z-[1] pointer-events-none" />

      {/* Central Ambient Vignette Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] z-[1] pointer-events-none" />

      {/* Luminous Pulsing Gold Glow Aura */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(182,154,104,0.22)_0%,_transparent_70%)] z-[1] pointer-events-none"
      />

      {/* FOREGROUND CONTENT: FLOATING CELESTIAL COUNTDOWN PEDESTAL */}
      <motion.div
        style={{ y: contentY }}
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl mx-auto p-6 sm:p-10 md:p-14 rounded-[2.2rem] sm:rounded-[2.8rem] bg-black/65 backdrop-blur-2xl border border-[#9A7A49]/50 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(182,154,104,0.25)] text-center space-y-6 sm:space-y-8"
      >
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-black/70 border border-[#9A7A49]/60 shadow-md">
          <Sparkle size={14} weight="fill" className="text-[#B69A68] animate-spin" style={{ animationDuration: "6s" }} />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#E0D3B8] font-bold font-jakarta">
            ✦ Celestial Wedding Countdown ✦
          </span>
          <Sparkle size={14} weight="fill" className="text-[#B69A68] animate-spin" style={{ animationDuration: "6s" }} />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#FAF7F0] drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
            Until We Say &quot;Forever&quot;
          </h2>
          <p className="text-xs sm:text-sm text-[#E0D3B8] font-lora max-w-md mx-auto italic">
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
              className="py-4 px-2 sm:py-5 sm:px-3 md:py-6 rounded-2xl bg-black/60 border border-[#9A7A49]/50 shadow-lg flex flex-col items-center justify-center min-w-0 group hover:border-[#B69A68] transition-all"
            >
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#E0D3B8] group-hover:text-[#FAF7F0] font-cinzel block leading-none drop-shadow-md truncate">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[9px] sm:text-[10px] md:text-xs uppercase font-bold tracking-[0.15em] text-[#D2C4AA] group-hover:text-[#B69A68] mt-2 block truncate transition-colors">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Bottom Sub-Pill with Auspicious Date Summary */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 text-[11px] font-jakarta text-[#E0D3B8]">
          <span className="text-[#B69A68] font-bold">✨ Auspicious Muhurat:</span>
          <span>{dayStr}, {dateStr} {yearStr}</span>
        </div>
      </motion.div>
    </section>
  );
}

// Helper: Dynamically infer theme personality for ceremonies
function getGraceEventTheme(name: string = "", index: number) {
  const lower = name.toLowerCase();
  if (lower.includes("mehendi") || lower.includes("sangeet") || lower.includes("henna")) {
    return {
      accentColor: "#10b981",
      gradient: "radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
      swatches: ["#8da48f", "#fae4a8", "#10b981", "#d4af37"],
      motif: "✦ Botanical Garden Soirée ✦",
    };
  }
  if (lower.includes("haldi") || lower.includes("pithi") || lower.includes("holi")) {
    return {
      accentColor: "#f59e0b",
      gradient: "radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.15) 0%, transparent 70%)",
      swatches: ["#fbbf24", "#fef3c7", "#f59e0b", "#d97706"],
      motif: "✦ Turmeric & Sunshine Phoolon Ki Holi ✦",
    };
  }
  if (lower.includes("baraat") || lower.includes("swagat") || lower.includes("vivah") || lower.includes("shaadi") || lower.includes("wedding")) {
    return {
      accentColor: "#d4af37",
      gradient: "radial-gradient(ellipse at 50% 50%, rgba(212, 175, 55, 0.18) 0%, transparent 70%)",
      swatches: ["#d4af37", "#f3cf7a", "#14221b", "#ffffff"],
      motif: "✦ Sacred Pheras & Royal Vows ✦",
    };
  }
  if (lower.includes("reception") || lower.includes("dinner") || lower.includes("walima")) {
    return {
      accentColor: "#38bdf8",
      gradient: "radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
      swatches: ["#38bdf8", "#bae6fd", "#d4af37", "#0c1712"],
      motif: "✦ Grand Imperial Reception ✦",
    };
  }
  const fallbackThemes = [
    { accentColor: "#d4af37", swatches: ["#d4af37", "#fae4a8", "#8da48f"] },
    { accentColor: "#10b981", swatches: ["#10b981", "#d1fae5", "#d4af37"] },
    { accentColor: "#f59e0b", swatches: ["#f59e0b", "#fef3c7", "#d4af37"] },
  ];
  const t = fallbackThemes[index % fallbackThemes.length];
  return {
    accentColor: t.accentColor,
    gradient: `radial-gradient(ellipse at 50% 50%, ${t.accentColor}25 0%, transparent 70%)`,
    swatches: t.swatches,
    motif: "✦ Sacred Celebration ✦",
  };
}

// Sub-Component: Order of Ceremonies (Royal Botanical Journey)
function RoyalGraceCeremonyJourney({
  events,
  venueName,
  venueMapUrl,
  dateStr,
}: {
  events: any[];
  venueName: string;
  venueMapUrl: string;
  dateStr: string;
}) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Chapter Heading */}
      <div className="text-center space-y-3 mb-12 sm:mb-20">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9A7A49] font-bold font-jakarta block">
          ✦ Order of Celebrations ✦
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#725A38]">
          The Wedding Journey
        </h2>
        <p className="text-xs sm:text-sm text-[#5F6144] max-w-md mx-auto font-lora font-medium">
          Join us across each sacred ceremony as we rejoice in the bond of two families
        </p>
      </div>

      {/* Alternating Journey Timeline */}
      <div className="relative">
        {/* Central Spine Line on Desktop */}
        <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#9A7A49]/50 to-transparent" />
        {/* Left Spine Line on Mobile */}
        <div className="block md:hidden absolute left-5 top-4 bottom-4 w-[2px] bg-gradient-to-b from-transparent via-[#9A7A49]/50 to-transparent" />

        <div className="space-y-12 sm:space-y-16 md:space-y-24">
          {events.map((evt, idx) => {
            const isEven = idx % 2 === 0;
            const theme = getGraceEventTheme(evt.name, idx);

            return (
              <div key={idx} className="relative">
                {/* ── DESKTOP ALTERNATING ROW (SLIDES FROM LEFT & RIGHT) ── */}
                <div className="hidden md:grid md:grid-cols-11 md:gap-8 items-center">
                  {/* Left Column */}
                  <motion.div
                    initial={{ opacity: 0, x: -85 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.55 }}
                    transition={{ duration: 1.3, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="col-span-5"
                  >
                    {isEven ? (
                      /* Main Ceremony Card on Left */
                      <div className="grace-card-ivory p-8 rounded-[2rem] shadow-2xl space-y-4 relative overflow-hidden text-left hover:border-[#725A38] transition-all">
                        <div
                          className="absolute -top-16 -left-16 w-32 h-32 rounded-full pointer-events-none opacity-20 blur-2xl"
                          style={{ background: theme.accentColor }}
                        />
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider font-lora italic border bg-[#FAF7F0] text-[#725A38]"
                          style={{ borderColor: "#9A7A49" }}
                        >
                          {theme.motif}
                        </span>

                        <h3 className="text-2xl font-lora font-bold text-[#725A38]">
                          {evt.name}
                        </h3>

                        <p className="text-sm text-[#5F6144] font-lora leading-relaxed font-medium">
                          {evt.description}
                        </p>

                        <div className="pt-2">
                          <a
                            href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(evt.venue || venueName)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF7F0] border border-[#9A7A49]/50 text-xs font-semibold text-[#725A38] hover:text-[#9A7A49] hover:border-[#9A7A49] transition-all shadow-sm group"
                          >
                            <MapPin size={15} className="text-[#9A7A49] group-hover:scale-110 transition-transform" />
                            <span>{evt.venue || venueName}</span>
                            <ArrowSquareOut size={13} className="opacity-70 group-hover:opacity-100" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      /* Timing & Dress Code Station on Left */
                      <div className="space-y-4">
                        <div className="grace-card-ivory p-6 rounded-[2rem] shadow-xl space-y-3 text-center">
                          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#9A7A49] font-jakarta block">
                            Auspicious Timing
                          </span>
                          <div className="py-1 border-y border-[#9A7A49]/30 my-1">
                            <span className="text-3xl font-lora font-bold text-[#725A38] block leading-none">
                              {evt.date ? evt.date.split(" ")[1]?.replace(",", "") || "22" : "22"}
                            </span>
                            <span className="text-[11px] uppercase font-bold tracking-widest text-[#5F6144] font-jakarta block mt-1">
                              {evt.date ? evt.date.split(" ")[0] : "NOV"} {evt.date ? evt.date.split(" ")[2] || "2027" : "2027"}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#9A7A49]/30 text-xs font-semibold text-[#725A38] font-jakarta">
                            <Clock size={13} className="text-[#9A7A49]" />
                            <span>{evt.time || "06:30 PM"}</span>
                          </div>
                        </div>

                        {evt.dress && (
                          <div className="grace-card-ivory p-4 rounded-2xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#9A7A49] font-jakarta">
                                Dress Code
                              </span>
                              <div className="flex items-center gap-1.5">
                                {theme.swatches.map((color, sIdx) => (
                                  <span key={sIdx} className="grace-swatch-dot" style={{ backgroundColor: color }} />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs font-semibold text-[#725A38] font-lora text-left">
                              {evt.dress}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>

                  {/* Center Column: Milestone Node */}
                  <div className="col-span-1 flex flex-col items-center justify-center relative">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.4 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.55 }}
                      transition={{ duration: 1.05, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ scale: 1.15 }}
                      className="w-14 h-14 rounded-full bg-[#FAF7F0] border-2 border-[#9A7A49] text-[#725A38] flex flex-col items-center justify-center shadow-[0_0_25px_rgba(154,122,73,0.35)] z-10 cursor-pointer font-jakarta"
                    >
                      <span className="text-[9px] uppercase tracking-wider text-[#9A7A49] font-bold">CH</span>
                      <span className="text-sm font-bold leading-none">0{idx + 1}</span>
                    </motion.div>
                  </div>

                  {/* Right Column */}
                  <motion.div
                    initial={{ opacity: 0, x: 85 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.55 }}
                    transition={{ duration: 1.3, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="col-span-5"
                  >
                    {!isEven ? (
                      /* Main Ceremony Card on Right */
                      <div className="grace-card-ivory p-8 rounded-[2rem] shadow-2xl space-y-4 relative overflow-hidden text-left hover:border-[#725A38] transition-all">
                        <div
                          className="absolute -top-16 -right-16 w-32 h-32 rounded-full pointer-events-none opacity-20 blur-2xl"
                          style={{ background: theme.accentColor }}
                        />
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider font-lora italic border bg-[#FAF7F0] text-[#725A38]"
                          style={{ borderColor: "#9A7A49" }}
                        >
                          {theme.motif}
                        </span>

                        <h3 className="text-2xl font-lora font-bold text-[#725A38]">
                          {evt.name}
                        </h3>

                        <p className="text-sm text-[#5F6144] font-lora leading-relaxed font-medium">
                          {evt.description}
                        </p>

                        <div className="pt-2">
                          <a
                            href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(evt.venue || venueName)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF7F0] border border-[#9A7A49]/50 text-xs font-semibold text-[#725A38] hover:text-[#9A7A49] hover:border-[#9A7A49] transition-all shadow-sm group"
                          >
                            <MapPin size={15} className="text-[#9A7A49] group-hover:scale-110 transition-transform" />
                            <span>{evt.venue || venueName}</span>
                            <ArrowSquareOut size={13} className="opacity-70 group-hover:opacity-100" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      /* Timing & Dress Code Station on Right */
                      <div className="space-y-4">
                        <div className="grace-card-ivory p-6 rounded-[2rem] shadow-xl space-y-3 text-center">
                          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#9A7A49] font-jakarta block">
                            Auspicious Timing
                          </span>
                          <div className="py-1 border-y border-[#9A7A49]/30 my-1">
                            <span className="text-3xl font-lora font-bold text-[#725A38] block leading-none">
                              {evt.date ? evt.date.split(" ")[1]?.replace(",", "") || "22" : "22"}
                            </span>
                            <span className="text-[11px] uppercase font-bold tracking-widest text-[#5F6144] font-jakarta block mt-1">
                              {evt.date ? evt.date.split(" ")[0] : "NOV"} {evt.date ? evt.date.split(" ")[2] || "2027" : "2027"}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#9A7A49]/30 text-xs font-semibold text-[#725A38] font-jakarta">
                            <Clock size={13} className="text-[#9A7A49]" />
                            <span>{evt.time || "06:30 PM"}</span>
                          </div>
                        </div>

                        {evt.dress && (
                          <div className="grace-card-ivory p-4 rounded-2xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#9A7A49] font-jakarta">
                                Dress Code
                              </span>
                              <div className="flex items-center gap-1.5">
                                {theme.swatches.map((color, sIdx) => (
                                  <span key={sIdx} className="grace-swatch-dot" style={{ backgroundColor: color }} />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs font-semibold text-[#725A38] font-lora text-left">
                              {evt.dress}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* ── MOBILE / TABLET CONTINUOUS FLOW (MOBILE FIRST) ── */}
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
                  className="block md:hidden pl-10 sm:pl-14"
                >
                  {/* Milestone Node Badge */}
                  <div
                    className="absolute -left-[14px] top-4 w-9 h-9 rounded-full bg-[#FAF7F0] border-2 border-[#9A7A49] text-[#725A38] flex items-center justify-center font-bold text-xs shadow-md font-jakarta"
                  >
                    0{idx + 1}
                  </div>

                  <div className="grace-card-ivory p-5 sm:p-6 rounded-[1.6rem] shadow-xl space-y-3 relative overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#9A7A49]/25 pb-2.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF7F0] text-[#725A38] border border-[#9A7A49]/40 font-jakarta">
                        {evt.date || dateStr}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-[#5F6144] font-jakarta flex items-center gap-1">
                        <Clock size={12} className="text-[#9A7A49]" />
                        {evt.time || "06:30 PM"}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-lora font-bold text-[#725A38]">
                      {evt.name}
                    </h3>

                    <p className="text-xs text-[#5F6144] font-lora leading-relaxed font-medium">
                      {evt.description}
                    </p>

                    <div className="pt-1">
                      <a
                        href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(evt.venue || venueName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#725A38] hover:text-[#9A7A49] font-semibold font-lora"
                      >
                        <MapPin size={13} className="text-[#9A7A49]" />
                        <span>{evt.venue || venueName}</span>
                        <ArrowSquareOut size={11} className="opacity-70" />
                      </a>
                    </div>

                    {evt.dress && (
                      <div className="pt-2 border-t border-[#9A7A49]/25 flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-[#9A7A49] font-jakarta block">
                            Dress Code
                          </span>
                          <span className="text-xs font-semibold text-[#725A38] font-lora block">
                            {evt.dress}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {theme.swatches.slice(0, 3).map((color, sIdx) => (
                            <span key={sIdx} className="grace-swatch-dot" style={{ backgroundColor: color }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Sub-Component: Unique "Scattered Botanical Memories" 3D Perspective Reel / Deck
function RoyalGraceGallery({
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

  // Trigger assembly smoothly once ~50% into viewport
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAssembled(true);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  // Scatter Coordinates
  const scatterOffsets = [
    { x: -280, y: -40, rot: -14, scale: 0.88, z: 1 },
    { x: -140, y: 35, rot: 8, scale: 0.92, z: 2 },
    { x: 0, y: -15, rot: -4, scale: 1.05, z: 5 },
    { x: 145, y: 40, rot: 12, scale: 0.9, z: 3 },
    { x: 285, y: -30, rot: -10, scale: 0.86, z: 1 },
    { x: -60, y: 90, rot: 6, scale: 0.84, z: 2 },
  ];

  return (
    <section
      ref={containerRef}
      className="py-16 sm:py-24 md:py-32 px-4 max-w-6xl mx-auto text-center relative z-10 overflow-hidden"
    >
      <div className="space-y-3 mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5F6144] border border-[#9A7A49]/50 shadow-sm mx-auto">
          <Sparkle size={13} weight="fill" className="text-[#B69A68]" />
          <span className="font-jakarta text-[11px] font-bold uppercase tracking-[0.25em] text-[#E0D3B8]">
            ✦ Botanical Memories ✦
          </span>
          <Sparkle size={13} weight="fill" className="text-[#B69A68]" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#FAF7F0] drop-shadow-md">
          Moments of Grace
        </h2>

        <p className="text-sm sm:text-base text-[#E0D3B8] max-w-md mx-auto font-cormorant font-medium">
          Glimpses of love, stolen glances, and cherished milestones woven into our eternal story
        </p>
      </div>

      {/* ── DESKTOP & TABLET: SCATTERED → 3D PERSPECTIVE MEMORY REEL ── */}
      <div className="hidden md:block">
        {/* Assembly Indicator Badge */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsAssembled((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5F6144] border border-[#9A7A49]/50 text-[11px] font-semibold text-[#E0D3B8] hover:border-[#B69A68] hover:text-[#FAF7F0] transition-all cursor-pointer font-jakarta"
          >
            <Sparkle size={13} className="text-[#B69A68]" />
            <span>{isAssembled ? "✦ Memories Collected · 3D Reel Active" : "✦ Scroll to Collect Scattered Memories"}</span>
          </button>
        </div>

        <div className="h-[520px] flex items-center justify-center relative">
          {images.map((imgSrc, idx) => {
            let diff = idx - activeIndex;
            while (diff > images.length / 2) diff -= images.length;
            while (diff < -images.length / 2) diff += images.length;
            const normalizedOffset = diff;
            const absOffset = Math.abs(normalizedOffset);

            const isCenter = normalizedOffset === 0;
            const isVisibleInReel = absOffset <= 2.5;

            const scatterConfig = scatterOffsets[idx % scatterOffsets.length];

            const xPos = isAssembled ? normalizedOffset * 270 : scatterConfig.x;
            const yPos = isAssembled ? absOffset * 14 : scatterConfig.y;
            const rotateY = isAssembled ? normalizedOffset * -24 : scatterConfig.rot;
            const scale = isAssembled
              ? isCenter ? 1.08 : Math.max(0.72, 1 - absOffset * 0.14)
              : scatterConfig.scale;
            const zIndex = isAssembled ? 50 - Math.round(absOffset * 10) : scatterConfig.z + 5;
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
                  isCenter ? "grace-memory-hero-mount" : "grace-memory-photo-mount"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  pointerEvents: isAssembled && !isVisibleInReel ? "none" : "auto",
                }}
              >
                <div className="relative w-full h-full overflow-hidden rounded-3xl bg-[#FAF7F0] border border-[#9A7A49]/40 p-2.5 flex flex-col justify-between">
                  <div className="relative w-full h-[84%] overflow-hidden rounded-2xl">
                    <img
                      src={imgSrc}
                      alt={`Memory portrait ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    {/* Top Memory Badge */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-[#9A7A49]/40 text-[9px] font-bold text-[#E0D3B8] tracking-widest uppercase font-jakarta">
                        0{idx + 1} / 0{images.length}
                      </span>
                      {isCenter && (
                        <span className="w-6 h-6 rounded-full bg-[#9A7A49]/30 border border-[#9A7A49] flex items-center justify-center text-[#9A7A49]">
                          <MagnifyingGlassPlus size={13} weight="bold" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Polaroid Bottom Caption */}
                  <div className="text-center pt-1 pb-0.5">
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#9A7A49] font-jakarta block leading-tight">
                      Memory 0{idx + 1}
                    </span>
                    <h4 className="text-xs font-lora font-bold text-[#725A38] truncate">
                      {groomName} &amp; {brideName}
                    </h4>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 3D Reel Controls */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={handlePrev}
            aria-label="Previous photograph"
            className="w-12 h-12 rounded-full bg-[#5F6144] border border-[#9A7A49]/50 hover:border-[#B69A68] text-[#E0D3B8] hover:text-[#FAF7F0] flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            <CaretLeft size={22} weight="bold" />
          </button>

          <div className="text-center font-jakarta px-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B69A68] block">
              PORTRAIT
            </span>
            <span className="text-lg font-bold text-[#FAF7F0] font-lora">
              0{activeIndex + 1} <span className="text-[#E0D3B8]/60 text-sm">/ 0{images.length}</span>
            </span>
          </div>

          <button
            onClick={handleNext}
            aria-label="Next photograph"
            className="w-12 h-12 rounded-full bg-[#5F6144] border border-[#9A7A49]/50 hover:border-[#B69A68] text-[#E0D3B8] hover:text-[#FAF7F0] flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            <CaretRight size={22} weight="bold" />
          </button>
        </div>
      </div>

      {/* ── MOBILE: STACKED PHOTO DECK (SWIPEABLE PHYSICAL CARDS) ── */}
      <div className="block md:hidden">
        <div className="h-[430px] flex items-center justify-center relative">
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
                  isTop ? "grace-memory-hero-mount" : "grace-memory-photo-mount"
                }`}
              >
                <div className="relative w-full h-full overflow-hidden rounded-3xl bg-[#FAF7F0] border border-[#9A7A49]/40 p-2.5 flex flex-col justify-between">
                  <div className="relative w-full h-[84%] overflow-hidden rounded-2xl">
                    <img
                      src={imgSrc}
                      alt={`Portrait ${idx + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                      loading="lazy"
                    />

                    {/* Memory Header Pill */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-[#9A7A49]/40 text-[9px] font-bold text-[#E0D3B8] tracking-widest uppercase font-jakarta">
                        0{idx + 1} / 0{images.length}
                      </span>
                      <span className="w-7 h-7 rounded-full bg-[#9A7A49]/30 border border-[#9A7A49] flex items-center justify-center text-[#9A7A49]">
                        <MagnifyingGlassPlus size={14} weight="bold" />
                      </span>
                    </div>
                  </div>

                  {/* Bottom Caption Pill */}
                  <div className="text-center pt-1 pb-0.5">
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#9A7A49] font-jakarta block leading-tight">
                      Swipe or Tap
                    </span>
                    <h4 className="text-xs font-lora font-bold text-[#725A38] truncate">
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
            className="w-11 h-11 rounded-full bg-[#5F6144] border border-[#9A7A49]/50 text-[#E0D3B8] flex items-center justify-center active:scale-95 cursor-pointer shadow-md"
          >
            <CaretLeft size={20} weight="bold" />
          </button>

          <span className="text-xs font-jakarta font-bold text-[#E0D3B8] tracking-wider">
            0{activeIndex + 1} / 0{images.length}
          </span>

          <button
            onClick={handleNext}
            aria-label="Next card"
            className="w-11 h-11 rounded-full bg-[#5F6144] border border-[#9A7A49]/50 text-[#E0D3B8] flex items-center justify-center active:scale-95 cursor-pointer shadow-md"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        </div>
      </div>
    </section>
  );
}
