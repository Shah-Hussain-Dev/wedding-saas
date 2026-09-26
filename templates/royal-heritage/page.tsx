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
  ArrowsClockwise,
  MoonStars,
  GlobeHemisphereWest,
  SpeakerHigh,
  SpeakerSlash,
  CaretDown,
  MagnifyingGlassPlus,
  Compass,
} from "@phosphor-icons/react";
import { FloatingPetals } from "@/components/invitation/FloatingPetals";
import { ShapedScratchCard } from "@/components/invitation/ShapedScratchCard";
import defaultData from "./data.json";
import "./style.css";

// Helper to safely resolve audio track URLs
function resolveAudioTrack(track?: string | null): string {
  if (!track || track === "track1" || track === "track2" || track === "track3" || track === "default" || track.trim() === "") {
    return "/templates/royal-heritage/music.mp3";
  }
  if (track.startsWith("/") || track.startsWith("http://") || track.startsWith("https://") || track.startsWith("blob:")) {
    return track;
  }
  return `/audio/${track}.mp3`;
}

interface RoyalHeritageProps {
  data?: any;
}

export default function RoyalHeritage({ data }: RoyalHeritageProps) {
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

  // RSVP Form & Modal State
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpAttending, setRsvpAttending] = useState("yes");
  const [rsvpGuests, setRsvpGuests] = useState("2");
  const [rsvpWishes, setRsvpWishes] = useState("");
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);

  // Lock page and body scrolling until video completes and doors open
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
            audio.src = "/templates/royal-heritage/music.mp3";
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

  // Video playback time listener to trigger door reveal at ~5.8s
  const handleVideoTimeUpdate = () => {
    if (!heroVideoRef.current || !isVideoStarted) return;
    const ct = heroVideoRef.current.currentTime;
    setVideoCurrentTime(ct);

    if (ct >= 5.8 && !isContentRevealed) {
      setIsContentRevealed(true);
      confetti({
        particleCount: 85,
        spread: 85,
        origin: { y: 0.55 },
        colors: ["#77A3AE", "#D95147", "#E66B5E", "#E8E3D9", "#876B45"],
      });
    }
  };

  // Initial user start interaction (Tapping anywhere on the powder blue door)
  const handleStartDoorExperience = () => {
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
        console.warn("Audio autoplay blocked on door open:", err);
      });
    }

    // Fallback timer
    setTimeout(() => {
      setIsContentRevealed(true);
    }, 6200);
  };

  // Replay Door Opening
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
      colors: ["#77A3AE", "#D95147", "#E8E3D9", "#876B45"],
    });
  };

  // Dual Faith Invocation Texts
  const getInvocation = () => {
    switch (selectedReligion) {
      case "hindu":
        return {
          title: "॥ श्री गणेशाय नमः ॥",
          arabicOrSanskrit: "मङ्गलम् भगवान विष्णुः मङ्गलम् गरुडध्वजः । मङ्गलम् पुण्डरीकाक्षः मङ्गलाय तनो हरिः ॥",
          english: "With the divine blessings of the Almighty, cherished ancestors, and beloved elders, we solicit your gracious presence.",
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
          title: "Two Souls · One Mediterranean Adventure",
          arabicOrSanskrit: "“Where there is true love, there is peace, light, and eternal bliss.”",
          english: defaultData.quote,
          tag: "Universal Celebration",
        };
    }
  };

  const invocation = getInvocation();

  return (
    <div className={`min-h-screen bg-[#E8E3D9] text-[#153E4B] font-lora relative selection:bg-[#77A3AE]/30 selection:text-[#153E4B] ${!isContentRevealed ? "h-[100dvh] max-h-screen overflow-hidden touch-none" : "overflow-x-hidden"}`}>
      {/* Ambient Bougainvillea & Gold Petals */}
      <FloatingPetals density={18} theme="gold-dust" />

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
        <source src="/templates/royal-heritage/music.mp3" type="audio/mpeg" />
        <source src="/audio/wedding-ambience.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Toggle (Bottom-Right Circular Azure Button) */}
      <motion.button
        type="button"
        id="heritage-music-toggle-btn"
        className="heritage-music-toggle pointer-events-auto cursor-pointer"
        onClick={toggleAudio}
        aria-label={isPlayingMusic ? "Mute soundtrack" : "Play soundtrack"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {isPlayingMusic ? (
          <>
            <SpeakerHigh size={19} weight="fill" />
            <span className="heritage-soundwave-bars">
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
          1. CINEMATIC HERO SECTION (SYNCHRONIZED DOOR OPENING)
          ---------------------------------------------------- */}
      <section className="relative w-full h-screen min-h-[100dvh] overflow-hidden flex flex-col justify-between items-center text-center select-none bg-[#E8E3D9]">
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

        {/* Ambient Subtle Cinematic Vignette (Ensures full video visibility while giving text crisp contrast) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/70 z-[1] pointer-events-none" />

        {/* Top Header: Faith Switcher Pill */}
        <header className="relative z-20 w-full px-4 pt-4 md:pt-6 flex items-center justify-center max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-black/40 backdrop-blur-md border border-white/30 shadow-md text-xs font-montserrat">
            <button
              onClick={() => setSelectedReligion("universal")}
              className={`px-3 py-1 rounded-full transition-all text-[10px] md:text-[11px] font-semibold flex items-center gap-1 ${
                selectedReligion === "universal"
                  ? "bg-[#77A3AE] text-[#153E4B] shadow-sm font-bold"
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
                  ? "bg-[#77A3AE] text-[#153E4B] shadow-sm font-bold"
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
                  ? "bg-[#77A3AE] text-[#153E4B] shadow-sm font-bold"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <MoonStars size={12} weight="bold" />
              Muslim
            </button>
          </div>
        </header>

        {/* Transparent Clickable Trigger Over Door (Video contains pre-baked "You're Invited · tap to open") */}
        {!isVideoStarted && (
          <div
            onClick={handleStartDoorExperience}
            className="absolute inset-0 z-15 cursor-pointer flex flex-col items-center justify-end pb-16 touch-manipulation"
          >
            <motion.div
              animate={{ y: [0, -6, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#77A3AE]/70 text-[#FAF8F5] text-[11px] font-bold font-montserrat shadow-xl tracking-wider"
            >
              ✨ Tap to Open The Villa Doors ✨
            </motion.div>
          </div>
        )}

        {/* ----------------------------------------------------
            CHOREOGRAPHED CONTENT REVEAL (Cinematic & Fully Visible Background)
            ---------------------------------------------------- */}
        <AnimatePresence>
          {isContentRevealed && (
            <motion.div
              key="door-opened-content"
              initial={{ opacity: 0, scale: 0.88, y: 35, filter: "blur(14px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 my-auto px-4 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-1.5 md:space-y-2.5 text-center"
            >
              <div className="text-[#E66B5E] text-base drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                🌺
              </div>

              <p className="font-alex-brush text-3xl sm:text-4xl md:text-5xl text-[#FAF8F5] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] tracking-wide font-normal">
                We&apos;re getting married
              </p>

              <div className="text-[#E66B5E] text-xs drop-shadow-md">
                🌸
              </div>

              {/* GROOM BLOCK */}
              <div className="space-y-0.5 pt-1">
                <h1 className="font-great-vibes text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#FAF8F5] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] leading-none font-normal">
                  {groomName}
                </h1>
                <p className="font-lora italic text-xs sm:text-sm md:text-base text-stone-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-light">
                  {groomParents}
                </p>
                {(groomEducation || groomProfession) && (
                  <p className="text-[11px] sm:text-xs md:text-sm text-[#91B5BC] font-lora drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-medium">
                    {groomEducation}
                    {groomEducation && groomProfession && " · "}
                    {groomProfession}
                  </p>
                )}
              </div>

              {/* FLORAL AMPERSAND */}
              <div className="py-0.5">
                <span className="font-great-vibes text-4xl sm:text-5xl md:text-6xl text-[#E66B5E] drop-shadow-[0_3px_16px_rgba(0,0,0,0.95)] block">
                  &amp;
                </span>
              </div>

              {/* BRIDE BLOCK */}
              <div className="space-y-0.5">
                <h1 className="font-great-vibes text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#FAF8F5] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] leading-none font-normal">
                  {brideName}
                </h1>
                <p className="font-lora italic text-xs sm:text-sm md:text-base text-stone-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-light">
                  {brideParents}
                </p>
                {(brideEducation || brideProfession) && (
                  <p className="text-[11px] sm:text-xs md:text-sm text-[#91B5BC] font-lora drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-medium">
                    {brideEducation}
                    {brideEducation && brideProfession && " · "}
                    {brideProfession}
                  </p>
                )}
              </div>

              {/* WEDDING DATE & VENUE PILL */}
              <div className="pt-3">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/50 backdrop-blur-md border border-[#77A3AE]/60 text-[#FAF8F5] text-xs font-montserrat shadow-xl">
                  <span className="text-[#E66B5E] font-bold">✦ {dayStr}, {dateStr} {yearStr}</span>
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
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#FAF8F5] font-montserrat font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                Scroll
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              >
                <CaretDown size={20} weight="bold" className="text-[#E66B5E] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ----------------------------------------------------
          2. CONTINUOUS MEDITERRANEAN STORYTELLING CHAPTERS
          ---------------------------------------------------- */}
      <main ref={contentSectionRef} className="relative z-10 overflow-hidden bg-[#E8E3D9]">
        {/* CHAPTER 1: SACRED BLESSINGS & INVOCATIONS */}
        <section className="py-14 sm:py-20 md:py-28 px-4 bg-heritage-ivory relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="heritage-card-arch p-6 sm:p-8 md:p-14 space-y-5 sm:space-y-6 shadow-xl relative overflow-hidden max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full heritage-coral-pill shadow-sm">
              <Sparkle size={14} weight="fill" className="text-[#D95147]" />
              <span className="font-jakarta text-xs md:text-sm font-bold tracking-[0.2em]">
                {invocation.tag}
              </span>
              <Sparkle size={14} weight="fill" className="text-[#D95147]" />
            </div>

            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#153E4B]">
              {invocation.title}
            </h2>

            <p className="font-amiri text-lg sm:text-xl md:text-2xl text-[#315F6B] italic leading-relaxed whitespace-pre-line font-medium">
              {invocation.arabicOrSanskrit}
            </p>

            <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#77A3AE] to-transparent mx-auto" />

            <p className="font-cormorant text-sm sm:text-base md:text-lg text-[#4C4D31] leading-relaxed max-w-xl mx-auto font-medium">
              {invocation.english}
            </p>
          </motion.div>
        </section>

        {/* CHAPTER 2: AUSPICIOUS DATE SCRATCH REVEAL */}
        <section className="py-14 sm:py-20 md:py-24 px-4 bg-heritage-ivory text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4 max-w-2xl mx-auto"
          >
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#D95147] font-bold font-jakarta">
              Auspicious Wedding Muhurat
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#153E4B]">
              Scratch To Reveal The Date
            </h2>
            <p className="text-xs sm:text-sm text-[#315F6B] font-lora font-medium">
              Scratch off the shimmering seal to unveil our sacred wedding date
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

        {/* CHAPTER 3: CELESTIAL VILLA PARALLAX COUNTDOWN */}
        <VillaParallaxCountdownSection
          targetDate={rawDate}
          dayStr={dayStr}
          dateStr={dateStr}
          yearStr={yearStr}
        />

        {/* CHAPTER 4: ORDER OF CEREMONIES (UNIQUE ARCHED PORTAL CARDS) */}
        <section className="relative z-10 bg-heritage-ivory">
          <CeremonyArchwayJourney
            events={events}
            venueName={venueName}
            venueMapUrl={venueMapUrl}
            dateStr={dateStr}
          />
        </section>

        {/* CHAPTER 5: 3D PANORAMIC ARCH HORIZON GALLERY */}
        <section className="bg-heritage-deep">
          <PanoramicArchGallery
            images={galleryImages}
            groomName={groomName}
            brideName={brideName}
            onOpenPhoto={(idx) => setActivePhotoIdx(idx)}
          />
        </section>

        {/* CHAPTER 6: CELEBRATION ESTATE & VENUE DIRECTIONS */}
        <section className="py-14 sm:py-20 md:py-28 px-4 bg-heritage-ivory relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="heritage-card-arch p-6 sm:p-8 md:p-14 text-center space-y-5 sm:space-y-6 shadow-xl max-w-4xl mx-auto"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-[#77A3AE] flex items-center justify-center mx-auto text-[#D95147] shadow-md">
              <MapPin size={28} weight="fill" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#D95147] font-bold font-montserrat">
                Celebration Estate
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-lora font-bold text-[#153E4B]">
                {venueName}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[#315F6B] max-w-lg mx-auto font-lora font-medium">
                {venueAddress}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-3 sm:pt-4">
              <a
                href={venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-full heritage-btn-primary transition-all text-xs font-bold font-montserrat flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <ArrowSquareOut size={15} weight="bold" />
                Google Maps Navigation
              </a>

              <button
                onClick={handleCopyAddress}
                className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white border border-[#77A3AE]/50 hover:border-[#D95147] text-[#153E4B] transition-all text-xs font-semibold font-montserrat flex items-center gap-2 cursor-pointer shadow-sm"
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
        </section>

        {/* CHAPTER 7: RSVP (MEDITERRANEAN PEDESTAL & MODAL) */}
        <section className="py-20 sm:py-28 md:py-32 px-4 bg-heritage-ivory relative z-10 text-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="heritage-card-arch p-7 sm:p-10 md:p-14 relative z-10 max-w-2xl mx-auto text-center"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-[#D95147] flex items-center justify-center text-[#D95147] shadow-md"
              >
                <Heart size={28} weight="fill" />
              </motion.div>
            </div>

            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#D95147] font-bold font-montserrat block mb-2">
              Your Presence is Our Honour
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-lora font-bold text-[#153E4B] mb-3">
              Celebrate With Us
            </h2>
            <p className="text-xs sm:text-sm text-[#315F6B] max-w-md mx-auto mb-8 leading-relaxed font-lora font-medium">
              Please honor us with your confirmed attendance and warm blessings as we step into this glorious new chapter of our lives.
            </p>

            <motion.button
              type="button"
              onClick={() => setIsRsvpOpen(true)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="heritage-btn-coral w-full sm:w-auto sm:min-w-[260px] mx-auto px-8 py-4 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 cursor-pointer font-montserrat"
            >
              <Sparkle size={18} weight="fill" className="text-white" />
              <span>✦ Confirm Your RSVP ✦</span>
            </motion.button>
          </motion.div>
        </section>

        {/* CHAPTER 8: FOOTER (DEEP TEAL & NAVY) */}
        <footer className="py-14 bg-heritage-deep border-t border-[#77A3AE]/30 text-center space-y-4 text-xs text-[#FAF8F5]/80">
          <p className="font-lora italic text-base text-[#FAF8F5]">
            With boundless love and gratitude, <br />
            The Singhania &amp; Rathore Families
          </p>
          <p className="text-[11px] font-montserrat tracking-widest text-[#E66B5E] font-semibold">
            {hashtag}
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={handleReplayGate}
              className="inline-flex items-center gap-1.5 text-xs text-[#77A3AE] hover:text-white font-semibold cursor-pointer transition-colors"
            >
              <ArrowsClockwise size={14} /> Replay Villa Doors
            </button>
            <span>·</span>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#FAF8F5]/70 hover:text-white font-semibold cursor-pointer transition-colors"
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

      {/* ── CRISP & HIGH-CONTRAST ROYAL RSVP MODAL DIALOG ── */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="heritage-modal-overlay" onClick={() => setIsRsvpOpen(false)}>
            <motion.div
              className="heritage-modal-container font-montserrat"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="heritage-modal-close"
                onClick={() => setIsRsvpOpen(false)}
                aria-label="Close RSVP form"
              >
                <X size={18} weight="bold" />
              </button>

              <div className="text-center mb-6 pt-1">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#D95147] font-bold font-montserrat block mb-1">
                  {selectedReligion === "muslim" ? "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ" : selectedReligion === "hindu" ? "॥ श्री गणेशाय नमः ॥" : "✦ SACRED UNION ✦"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-lora font-bold text-[#153E4B]">
                  Confirm Attendance
                </h3>
                <p className="text-xs sm:text-sm text-[#315F6B] font-lora mt-1 font-medium">
                  For {groomName} &amp; {brideName}&apos;s Royal Celebration
                </p>
              </div>

              {isRsvpSubmitted ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#77A3AE]/20 border-2 border-[#77A3AE] flex items-center justify-center text-[#153E4B] mx-auto shadow-xl">
                    <CheckCircle size={36} weight="fill" />
                  </div>
                  <h4 className="text-2xl font-lora font-bold text-[#153E4B]">
                    Heartfelt Gratitude!
                  </h4>
                  <p className="text-sm text-[#315F6B] font-lora leading-relaxed max-w-xs mx-auto font-medium">
                    Thank you, <strong className="text-[#153E4B]">{rsvpName || "Dear Guest"}</strong>! Your RSVP and heartfelt blessings have been lovingly recorded.
                  </p>
                  <div className="pt-4 border-t border-[#77A3AE]/30">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRsvpOpen(false);
                        setIsRsvpSubmitted(false);
                      }}
                      className="heritage-btn-coral w-full py-3 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md font-bold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[11px] font-bold text-[#153E4B] uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="e.g. Vikram & Maya Singhania"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#77A3AE]/50 focus:border-[#D95147] focus:ring-2 focus:ring-[#D95147]/20 focus:outline-none text-sm text-[#153E4B] placeholder:text-[#876B45] font-lora font-medium shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#153E4B] uppercase tracking-wider mb-1.5">
                      WhatsApp / Phone Number
                    </label>
                    <input
                      type="tel"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#77A3AE]/50 focus:border-[#D95147] focus:ring-2 focus:ring-[#D95147]/20 focus:outline-none text-sm text-[#153E4B] placeholder:text-[#876B45] font-lora font-medium shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#153E4B] uppercase tracking-wider mb-1.5">
                      Number of Guests
                    </label>
                    <select
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#77A3AE]/50 focus:border-[#D95147] focus:ring-2 focus:ring-[#D95147]/20 focus:outline-none text-sm text-[#153E4B] font-lora font-medium shadow-inner cursor-pointer"
                    >
                      <option value="1" className="text-[#153E4B]">1 Person</option>
                      <option value="2" className="text-[#153E4B]">2 Persons</option>
                      <option value="3" className="text-[#153E4B]">3 Persons</option>
                      <option value="4" className="text-[#153E4B]">4 Persons</option>
                      <option value="5+" className="text-[#153E4B]">5+ Family Members</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#153E4B] uppercase tracking-wider mb-1.5">
                      Attending Ceremonies
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setRsvpAttending("yes")}
                        className={`py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                          rsvpAttending === "yes"
                            ? "bg-[#315F6B] text-white border-[#315F6B] shadow-md"
                            : "bg-white border-[#77A3AE]/40 text-[#153E4B] hover:border-[#315F6B]"
                        }`}
                      >
                        ✨ Joyfully Attending
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpAttending("no")}
                        className={`py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                          rsvpAttending === "no"
                            ? "bg-[#315F6B] text-white border-[#315F6B] shadow-md"
                            : "bg-white border-[#77A3AE]/40 text-[#153E4B] hover:border-[#315F6B]"
                        }`}
                      >
                        Regretfully Declining
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#153E4B] uppercase tracking-wider mb-1.5">
                      Warm Wishes &amp; Blessings
                    </label>
                    <textarea
                      rows={3}
                      value={rsvpWishes}
                      onChange={(e) => setRsvpWishes(e.target.value)}
                      placeholder={`Leave your heartfelt blessings for ${groomName} & ${brideName}...`}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#77A3AE]/50 focus:border-[#D95147] focus:ring-2 focus:ring-[#D95147]/20 focus:outline-none text-sm text-[#153E4B] placeholder:text-[#876B45] font-lora font-medium shadow-inner resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="heritage-btn-coral w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
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

// Sub-Component: Villa Parallax Countdown Section
function VillaParallaxCountdownSection({
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

  const bgY = useTransform(scrollYProgress, [0, 1], ["-24%", "24%"]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.25, 1.08, 1.22]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["65px", "-65px"]);

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
      className="relative w-full min-h-[100vh] sm:min-h-[110vh] overflow-hidden flex items-center justify-center py-20 sm:py-28 px-4 select-none my-0"
    >
      {/* Parallax Background Villa Image */}
      <motion.div
        style={{
          y: bgY,
          scale: bgScale,
        }}
        className="absolute inset-x-0 -top-[30%] h-[160%] w-full pointer-events-none z-0 overflow-hidden"
      >
        <img
          src="/templates/royal-heritage/villa-terrace.jpg"
          alt="Royal Mediterranean Villa Terrace"
          className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.12]"
        />
      </motion.div>

      {/* Atmospheric Top & Bottom Gradients */}
      <div className="absolute inset-x-0 top-0 h-44 sm:h-64 bg-gradient-to-b from-[#E8E3D9] via-[#E8E3D9]/60 to-transparent z-[1] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-44 sm:h-64 bg-gradient-to-t from-[#E8E3D9] via-[#E8E3D9]/60 to-transparent z-[1] pointer-events-none" />

      {/* Central Vignette */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px] z-[1] pointer-events-none" />

      {/* Countdown Pedestal */}
      <motion.div
        style={{ y: contentY }}
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl mx-auto p-6 sm:p-10 md:p-14 heritage-card-azure text-center space-y-6 sm:space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/20 border border-[#77A3AE] shadow-md">
          <Sparkle size={14} weight="fill" className="text-[#E66B5E] animate-spin" style={{ animationDuration: "6s" }} />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#FAF8F5] font-bold font-jakarta">
            ✦ Mediterranean Wedding Countdown ✦
          </span>
          <Sparkle size={14} weight="fill" className="text-[#E66B5E] animate-spin" style={{ animationDuration: "6s" }} />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#FAF8F5] drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
            Until We Say &quot;Forever&quot;
          </h2>
          <p className="text-xs sm:text-sm text-[#EAF2F4] font-lora max-w-md mx-auto italic font-medium">
            Every passing moment brings us closer to our sacred vows by the sunlit waters
          </p>
        </div>

        {/* Countdown Grid */}
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
              className="py-4 px-2 sm:py-5 sm:px-3 md:py-6 rounded-2xl bg-black/40 border border-[#77A3AE]/50 shadow-lg flex flex-col items-center justify-center min-w-0 group hover:border-[#D95147] transition-all"
            >
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#FAF8F5] group-hover:text-[#E66B5E] font-cinzel block leading-none drop-shadow-md truncate">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[9px] sm:text-[10px] md:text-xs uppercase font-bold tracking-[0.15em] text-[#91B5BC] group-hover:text-[#FAF8F5] mt-2 block truncate transition-colors">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-center gap-3 text-[11px] font-montserrat text-[#FAF8F5]/90">
          <span className="text-[#E66B5E] font-bold">✨ Auspicious Muhurat:</span>
          <span>{dayStr}, {dateStr} {yearStr}</span>
        </div>
      </motion.div>
    </section>
  );
}

// Sub-Component: Ceremony Archway Journey (Unique Arched Portal Cards Animation)
function CeremonyArchwayJourney({
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
    const el = document.getElementById(`ceremony-heritage-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="py-16 sm:py-24 md:py-32 px-4 max-w-6xl mx-auto relative z-10">
      <div className="text-center space-y-3 mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full heritage-coral-pill text-[10px] font-bold font-jakarta tracking-[0.25em] uppercase shadow-sm">
          <Sparkle size={12} weight="fill" className="text-[#D95147]" />
          <span>The Royal Celebration Journey</span>
          <Sparkle size={12} weight="fill" className="text-[#D95147]" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#153E4B]">
          Order of Ceremonies
        </h2>

        <p className="text-sm sm:text-base text-[#315F6B] max-w-md mx-auto font-cormorant font-medium">
          Step through each arched gateway of joy, music, and sacred blessings
        </p>

        {/* Quick Jump Chapter Pills */}
        <div className="flex items-center justify-center gap-2 pt-3 flex-wrap">
          {events.map((evt: any, i: number) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToChapter(i)}
              className={`heritage-ceremony-pill ${activeTab === i ? "active" : ""}`}
            >
              <span>0{i + 1}</span> {evt.name?.split(" ")[0] || `Chapter ${i + 1}`}
            </button>
          ))}
        </div>
      </div>

      {/* CONTINUOUS GOLDEN & AZURE SPINE */}
      <div className="relative">
        <div className="hidden md:block absolute left-1/2 top-10 bottom-10 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#77A3AE]/30 via-[#77A3AE] to-[#77A3AE]/30 shadow-[0_0_12px_rgba(119,163,174,0.4)]" />

        <div className="space-y-12 md:space-y-24">
          {events.map((evt: any, idx: number) => {
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={idx}
                id={`ceremony-heritage-${idx}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
                onViewportEnter={() => setActiveTab(idx)}
                className="relative scroll-mt-28"
              >
                {/* ── DESKTOP ALTERNATING ARCH PORTAL CARDS ── */}
                <div className="hidden md:grid grid-cols-12 gap-8 items-center">
                  {/* Left Column */}
                  <motion.div
                    initial={{ opacity: 0, x: -85 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.55 }}
                    transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                    className="col-span-5"
                  >
                    {isEven ? (
                      /* Main Arched Ceremony Card */
                      <div className="heritage-card-arch p-8 shadow-xl space-y-4 relative overflow-hidden text-left">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider font-lora italic bg-[#77A3AE]/15 text-[#315F6B] border border-[#77A3AE]/40">
                          ✦ Villa Gateway 0{idx + 1} ✦
                        </span>

                        <h3 className="text-2xl font-lora font-bold text-[#153E4B]">
                          {evt.name}
                        </h3>

                        <p className="text-sm text-[#315F6B] font-lora leading-relaxed font-medium">
                          {evt.description}
                        </p>

                        <div className="pt-2">
                          <a
                            href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(evt.venue || venueName)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#77A3AE]/50 text-xs font-semibold text-[#153E4B] hover:text-[#D95147] hover:border-[#D95147] transition-all shadow-sm group"
                          >
                            <MapPin size={15} className="text-[#D95147] group-hover:scale-110 transition-transform" />
                            <span>{evt.venue || venueName}</span>
                            <ArrowSquareOut size={13} className="opacity-70 group-hover:opacity-100" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      /* Timing & Dress Code Station */
                      <div className="space-y-4">
                        <div className="heritage-card-arch p-6 shadow-lg space-y-3 text-center">
                          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D95147] font-montserrat block">
                            Auspicious Timing
                          </span>
                          <div className="py-1 border-y border-[#77A3AE]/25 my-1">
                            <span className="text-3xl font-lora font-bold text-[#153E4B] block leading-none">
                              {evt.date ? evt.date.split(" ")[1]?.replace(",", "") || "24" : "24"}
                            </span>
                            <span className="text-[11px] uppercase font-bold tracking-widest text-[#315F6B] font-montserrat block mt-1">
                              {evt.date ? evt.date.split(" ")[0] : "NOV"} {evt.date ? evt.date.split(" ")[2] || "2027" : "2027"}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#77A3AE]/40 text-xs font-semibold text-[#153E4B] font-montserrat">
                            <Clock size={13} className="text-[#D95147]" />
                            <span>{evt.time || "06:30 PM"}</span>
                          </div>
                        </div>

                        {evt.dress && (
                          <div className="heritage-card-inner p-4 rounded-2xl border border-[#77A3AE]/35 space-y-1 text-center">
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D95147] font-montserrat block">
                              Dress Code
                            </span>
                            <p className="text-xs font-semibold text-[#153E4B] font-lora">
                              {evt.dress}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>

                  {/* Center Node */}
                  <div className="col-span-2 flex flex-col items-center justify-center relative">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.4 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.55 }}
                      transition={{ duration: 1.05, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="heritage-ceremony-node"
                    >
                      0{idx + 1}
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
                      /* Main Arched Ceremony Card */
                      <div className="heritage-card-arch p-8 shadow-xl space-y-4 relative overflow-hidden text-left">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider font-lora italic bg-[#77A3AE]/15 text-[#315F6B] border border-[#77A3AE]/40">
                          ✦ Villa Gateway 0{idx + 1} ✦
                        </span>

                        <h3 className="text-2xl font-lora font-bold text-[#153E4B]">
                          {evt.name}
                        </h3>

                        <p className="text-sm text-[#315F6B] font-lora leading-relaxed font-medium">
                          {evt.description}
                        </p>

                        <div className="pt-2">
                          <a
                            href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(evt.venue || venueName)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#77A3AE]/50 text-xs font-semibold text-[#153E4B] hover:text-[#D95147] hover:border-[#D95147] transition-all shadow-sm group"
                          >
                            <MapPin size={15} className="text-[#D95147] group-hover:scale-110 transition-transform" />
                            <span>{evt.venue || venueName}</span>
                            <ArrowSquareOut size={13} className="opacity-70 group-hover:opacity-100" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      /* Timing & Dress Code Station */
                      <div className="space-y-4">
                        <div className="heritage-card-arch p-6 shadow-lg space-y-3 text-center">
                          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D95147] font-montserrat block">
                            Auspicious Timing
                          </span>
                          <div className="py-1 border-y border-[#77A3AE]/25 my-1">
                            <span className="text-3xl font-lora font-bold text-[#153E4B] block leading-none">
                              {evt.date ? evt.date.split(" ")[1]?.replace(",", "") || "24" : "24"}
                            </span>
                            <span className="text-[11px] uppercase font-bold tracking-widest text-[#315F6B] font-montserrat block mt-1">
                              {evt.date ? evt.date.split(" ")[0] : "NOV"} {evt.date ? evt.date.split(" ")[2] || "2027" : "2027"}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#77A3AE]/40 text-xs font-semibold text-[#153E4B] font-montserrat">
                            <Clock size={13} className="text-[#D95147]" />
                            <span>{evt.time || "06:30 PM"}</span>
                          </div>
                        </div>

                        {evt.dress && (
                          <div className="heritage-card-inner p-4 rounded-2xl border border-[#77A3AE]/35 space-y-1 text-center">
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D95147] font-montserrat block">
                              Dress Code
                            </span>
                            <p className="text-xs font-semibold text-[#153E4B] font-lora">
                              {evt.dress}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* ── MOBILE CONTINUOUS FLOW ── */}
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
                  className="block md:hidden"
                >
                  <div className="heritage-card-arch p-5 sm:p-6 shadow-lg space-y-3 relative overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#77A3AE]/25 pb-2.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white text-[#153E4B] border border-[#77A3AE]/40 font-montserrat">
                        0{idx + 1} · {evt.date || dateStr}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-[#315F6B] font-montserrat flex items-center gap-1">
                        <Clock size={12} className="text-[#D95147]" />
                        {evt.time || "06:30 PM"}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-lora font-bold text-[#153E4B]">
                      {evt.name}
                    </h3>

                    <p className="text-xs text-[#315F6B] font-lora leading-relaxed font-medium">
                      {evt.description}
                    </p>

                    <div className="pt-1">
                      <a
                        href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(evt.venue || venueName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#153E4B] hover:text-[#D95147] font-semibold font-lora"
                      >
                        <MapPin size={13} className="text-[#D95147]" />
                        <span>{evt.venue || venueName}</span>
                        <ArrowSquareOut size={11} className="opacity-70" />
                      </a>
                    </div>

                    {evt.dress && (
                      <div className="pt-2 border-t border-[#77A3AE]/20 flex items-center justify-between gap-2">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-[#D95147] font-montserrat">
                          Dress Code
                        </span>
                        <span className="text-xs font-semibold text-[#315F6B] font-lora">
                          {evt.dress}
                        </span>
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

// Sub-Component: 3D Panoramic Arch Horizon Gallery
function PanoramicArchGallery({
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

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section
      ref={containerRef}
      className="py-16 sm:py-24 md:py-32 px-4 max-w-7xl mx-auto relative z-10 overflow-hidden"
    >
      <div className="text-center space-y-3 mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#77A3AE]/50 text-[#EAF2F4] text-[10px] font-bold font-jakarta tracking-[0.25em] uppercase">
          <Sparkle size={12} weight="fill" className="text-[#E66B5E]" />
          <span>Chapter V · Riviera Memories</span>
          <Sparkle size={12} weight="fill" className="text-[#E66B5E]" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#FAF8F5]">
          Panoramic Arch Horizon
        </h2>

        <p className="text-sm sm:text-base text-[#91B5BC] max-w-md mx-auto font-cormorant font-medium">
          Glimpses of laughter, sunlit serenity, and timeless milestones by the azure lake
        </p>
      </div>

      {/* ── DESKTOP & TABLET: 3D PARABOLIC HORIZON REEL ── */}
      <div className="hidden md:block">
        <div className="heritage-gallery-stage h-[520px] flex items-center justify-center relative">
          {images.map((imgSrc, idx) => {
            let diff = idx - activeIndex;
            while (diff > images.length / 2) diff -= images.length;
            while (diff < -images.length / 2) diff += images.length;
            const normalizedOffset = diff;
            const absOffset = Math.abs(normalizedOffset);

            const isCenter = normalizedOffset === 0;
            const isVisible = absOffset <= 2.5;

            const xPos = normalizedOffset * 280;
            const yPos = absOffset * 16;
            const rotateY = normalizedOffset * -22;
            const scale = isCenter ? 1.08 : Math.max(0.72, 1 - absOffset * 0.15);
            const zIndex = 50 - Math.round(absOffset * 10);
            const opacity = isVisible ? (isCenter ? 1 : Math.max(0.45, 0.9 - absOffset * 0.2)) : 0;

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
                className={`absolute w-[285px] h-[390px] cursor-pointer group select-none ${
                  isCenter ? "heritage-photo-hero-mount" : "heritage-photo-arch-mount"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  pointerEvents: !isVisible ? "none" : "auto",
                }}
              >
                <div className="relative w-full h-full overflow-hidden bg-slate-900">
                  <img
                    src={imgSrc}
                    alt={`Memory portrait ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-85" />

                  {/* Top Badge */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#77A3AE]/50 text-[9px] font-bold text-[#EAF2F4] tracking-widest uppercase font-montserrat">
                      0{idx + 1} / 0{images.length}
                    </span>
                    {isCenter && (
                      <span className="w-7 h-7 rounded-full bg-[#D95147]/30 border border-[#D95147] flex items-center justify-center text-white">
                        <MagnifyingGlassPlus size={14} weight="bold" />
                      </span>
                    )}
                  </div>

                  {/* Bottom Caption for Active Hero */}
                  {isCenter && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-3.5 left-3.5 right-3.5 p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-[#77A3AE]/45 text-center"
                    >
                      <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#E66B5E] font-montserrat block">
                        Riviera Memory 0{idx + 1}
                      </span>
                      <h4 className="text-sm font-lora font-bold text-[#FAF8F5] truncate">
                        {groomName} &amp; {brideName}
                      </h4>
                      <p className="text-[10px] text-[#91B5BC] font-lora italic mt-0.5 truncate font-medium">
                        Click to view fullscreen
                      </p>
                    </motion.div>
                  )}
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
            className="w-12 h-12 rounded-full bg-white/10 border border-[#77A3AE]/50 hover:border-[#D95147] text-[#EAF2F4] hover:text-white flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            <CaretLeft size={22} weight="bold" />
          </button>

          <div className="text-center font-montserrat px-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E66B5E] block">
              PORTRAIT
            </span>
            <span className="text-lg font-bold text-[#FAF8F5] font-lora">
              0{activeIndex + 1} <span className="text-[#77A3AE]/80 text-sm">/ 0{images.length}</span>
            </span>
          </div>

          <button
            onClick={handleNext}
            aria-label="Next photograph"
            className="w-12 h-12 rounded-full bg-white/10 border border-[#77A3AE]/50 hover:border-[#D95147] text-[#EAF2F4] hover:text-white flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            <CaretRight size={22} weight="bold" />
          </button>
        </div>
      </div>

      {/* ── MOBILE: SLEEK TOUCH ARCH CAROUSEL WITH THUMBNAILS ── */}
      <div className="block md:hidden">
        <div className="relative w-full max-w-[320px] mx-auto">
          {/* Main Card Viewport */}
          <div className="relative w-full h-[400px] rounded-[2.2rem] border-2 border-[#77A3AE] bg-[#102A43] overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 50) handlePrev();
                  else if (info.offset.x < -50) handleNext();
                }}
                onClick={() => onOpenPhoto(activeIndex)}
                className="relative w-full h-full cursor-pointer select-none"
              >
                <img
                  src={images[activeIndex]}
                  alt={`Memory portrait ${activeIndex + 1}`}
                  className="w-full h-full object-cover pointer-events-none"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* Top Badge & Zoom Icon */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#77A3AE]/50 text-[10px] font-bold text-[#FAF8F5] tracking-widest uppercase font-montserrat shadow-md">
                    0{activeIndex + 1} / 0{images.length}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-md">
                    <MagnifyingGlassPlus size={16} weight="bold" />
                  </span>
                </div>

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-[#77A3AE]/40 text-center pointer-events-none">
                  <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#E66B5E] font-montserrat block">
                    Tap To Enlarge
                  </span>
                  <h4 className="text-sm font-lora font-bold text-[#FAF8F5] truncate">
                    {groomName} &amp; {brideName}
                  </h4>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quick Jump Thumbnail Strip */}
          <div className="flex items-center justify-center gap-2 mt-4 px-2 overflow-x-auto py-1">
            {images.map((thumbSrc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-11 h-11 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                  activeIndex === idx
                    ? "border-[#77A3AE] scale-105 shadow-md ring-2 ring-[#77A3AE]/50"
                    : "border-white/20 opacity-50 hover:opacity-80"
                }`}
                aria-label={`Select photo ${idx + 1}`}
              >
                <img src={thumbSrc} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Nav Controls */}
          <div className="flex items-center justify-center gap-5 mt-4">
            <button
              onClick={handlePrev}
              aria-label="Previous photograph"
              className="w-10 h-10 rounded-full bg-white/10 border border-[#77A3AE]/50 text-[#FAF8F5] flex items-center justify-center active:scale-95 cursor-pointer shadow-md"
            >
              <CaretLeft size={20} weight="bold" />
            </button>

            <span className="text-xs font-montserrat font-bold text-[#FAF8F5] tracking-wider">
              0{activeIndex + 1} of 0{images.length}
            </span>

            <button
              onClick={handleNext}
              aria-label="Next photograph"
              className="w-10 h-10 rounded-full bg-white/10 border border-[#77A3AE]/50 text-[#FAF8F5] flex items-center justify-center active:scale-95 cursor-pointer shadow-md"
            >
              <CaretRight size={20} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
