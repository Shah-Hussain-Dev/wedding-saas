"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import confetti from "canvas-confetti";
import { ScratchCard } from "@/components/invitation/ScratchCard";
import {
  SpeakerHigh,
  SpeakerSlash,
  CalendarBlank,
  Clock,
  MapPin,
  Sparkle,
  ArrowSquareOut,
  Heart,
  CheckCircle,
  X,
  ArrowsClockwise,
  EnvelopeSimpleOpen,
  SquaresFour,
  FilmStrip,
  CaretLeft,
  CaretRight,
  MagnifyingGlassPlus,
  Compass,
  Star,
  WhatsappLogo,
} from "@phosphor-icons/react";
import defaultData from "./data.json";
import { TemplateMarketingFooter } from "@/components/invitation/TemplateMarketingFooter";
import "./style.css";

interface EventItem {
  name?: string;
  date?: string;
  time?: string;
  venue?: string;
  location?: string;
  dressCode?: string;
  description?: string;
  enabled?: boolean;
}

interface AzureNikahProps {
  data?: any;
}

export default function AzureNikah({ data }: AzureNikahProps) {
  const resolvedData = { ...defaultData, ...data };

  // Video & Playback State
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoOpened, setVideoOpened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  // Gallery mode, slider index, lightbox
  const [galleryMode, setGalleryMode] = useState<"bento" | "slider">("bento");
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // References
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Hydration Mount & Desktop Auto-Reveal
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkDesktop = () => {
      const isDesk = window.innerWidth >= 1024;
      setIsDesktop(isDesk);
      if (isDesk) {
        setVideoOpened(true);
        setIsUnlocked(true);
      }
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Flash celebration & unlock lower sections once card writing completes on mobile
  useEffect(() => {
    if (videoOpened && !isUnlocked && !isDesktop) {
      const timer = setTimeout(() => {
        setIsFlashing(true);
        setIsUnlocked(true);
        try {
          confetti({
            particleCount: 65,
            spread: 75,
            origin: { y: 0.55 },
            colors: ["#38BDF8", "#FDE047", "#93C5FD", "#FFFDF8"],
          });
        } catch (_) { }
        setTimeout(() => setIsFlashing(false), 900);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [videoOpened, isUnlocked, isDesktop]);

  // RSVP Form State
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpAttending, setRsvpAttending] = useState("yes");
  const [rsvpGuests, setRsvpGuests] = useState("2");
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpDua, setRsvpDua] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Extract Props / Data
  const brideName = data?.brideName || data?.couple?.brideName || resolvedData.couple?.brideName || "Samira";
  const groomName = data?.groomName || data?.couple?.groomName || resolvedData.couple?.groomName || "Zayd";
  const brideParents = data?.brideParents || data?.couple?.brideParents || resolvedData.couple?.brideParents || "Mr. & Mrs. Farooq Ahmed Siddiqui";
  const groomParents = data?.groomParents || data?.couple?.groomParents || resolvedData.couple?.groomParents || "Mr. & Mrs. Danish Al-Mansoor";
  const weddingDateStr = data?.weddingDate || data?.date || resolvedData.weddingDate;
  const weddingDate = new Date(weddingDateStr);
  const formattedDate = !isNaN(weddingDate.getTime())
    ? weddingDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
    : resolvedData.dateFormatted;

  const revealMonthDay = !isNaN(weddingDate.getTime())
    ? weddingDate.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" })
    : "November 20";
  const revealDayName = !isNaN(weddingDate.getTime())
    ? weddingDate.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" })
    : "Friday";
  const revealYearStr = !isNaN(weddingDate.getTime())
    ? weddingDate.getFullYear().toString()
    : "2026";

  const venueName = data?.venueName || data?.venue?.name || resolvedData.venue?.name || "The Starlight Sapphire Hall";
  const venueAddress = data?.venueAddress || data?.venue?.address || resolvedData.venue?.address || "The Palm Jumeirah, Crescent Road, Dubai";
  const venueMapUrl = data?.venueMapUrl || data?.venue?.mapUrl || resolvedData.venue?.mapUrl;
  const islamicDate = data?.islamicDate || resolvedData.islamicDate || "11 Shawwal 1448 AH";

  // Background / Hero Custom Image
  const heroImageSrc = data?.heroImageUrl || data?.backgroundImage || null;

  // Gallery Photos
  const rawGallery: any[] = Array.isArray(data?.slideshowImages) && data.slideshowImages.length > 0
    ? data.slideshowImages
    : Array.isArray(data?.gallery) && data.gallery.length > 0
      ? data.gallery
      : Array.isArray(data?.galleryImages) && data.galleryImages.length > 0
        ? data.galleryImages
        : resolvedData.gallery || [
          "/templates/azure-nikah/poster.png",
          "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop",
        ];
  const galleryPhotos: string[] = rawGallery
    .map((item: any) => (typeof item === "string" ? item : item?.url || item?.src || ""))
    .filter(Boolean);

  const galleryCaptions = resolvedData.galleryCaptions || [
    { title: "Celestial Sapphire Night", subtitle: "Written in the Stars" },
    { title: "Sacred Nikah Solemnization", subtitle: "Two Souls in Harmony" },
    { title: "Moonlit Promenade", subtitle: "A Journey of Devotion" },
    { title: "The Royal Ballroom", subtitle: "Surrounded by Pure Blessings" },
    { title: "Eternal Duas & Wishes", subtitle: "Grace & Prosperity" },
  ];

  const events: EventItem[] = (data?.events || data?.eventsJson || resolvedData.events || []).filter((e: any) => e.enabled !== false);

  const hashtag = data?.hashtag || resolvedData.hashtag || `#${brideName}Weds${groomName}`;
  const storyMessage = data?.storyMessage || resolvedData.storyMessage || "Underneath a celestial sky lit by crescent moons and shimmering stars, our paths crossed in divine timing. With the heartfelt prayers of our parents and loved ones, we embark on this sacred lifetime journey together.";

  // Deterministic falling celestial star particles (Royal Lotus Parallax Engine)
  const petals = [
    { id: 0, left: "4.5%", size: 14, duration: 12.5, delay: 0.2 },
    { id: 1, left: "12.2%", size: 18, duration: 15.0, delay: 3.4 },
    { id: 2, left: "19.0%", size: 12, duration: 11.2, delay: 1.8 },
    { id: 3, left: "26.5%", size: 16, duration: 14.2, delay: 5.1 },
    { id: 4, left: "33.0%", size: 20, duration: 16.5, delay: 2.2 },
    { id: 5, left: "40.5%", size: 13, duration: 10.8, delay: 6.0 },
    { id: 6, left: "48.0%", size: 17, duration: 13.6, delay: 0.9 },
    { id: 7, left: "55.5%", size: 15, duration: 12.0, delay: 4.5 },
    { id: 8, left: "62.0%", size: 19, duration: 15.8, delay: 2.7 },
    { id: 9, left: "69.5%", size: 11, duration: 11.5, delay: 6.8 },
    { id: 10, left: "77.0%", size: 16, duration: 14.0, delay: 1.4 },
    { id: 11, left: "84.5%", size: 14, duration: 13.2, delay: 4.0 },
    { id: 12, left: "91.0%", size: 18, duration: 16.0, delay: 2.9 },
    { id: 13, left: "96.5%", size: 13, duration: 10.5, delay: 5.5 },
  ];

  // Live Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ days: 212, hours: 18, minutes: 30, seconds: 20 });
  useEffect(() => {
    const target = weddingDate.getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  // Auto advance slider
  useEffect(() => {
    if (galleryMode !== "slider" || galleryPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % galleryPhotos.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [galleryMode, galleryPhotos.length]);

  // Handle Tap to Open Video
  const handleOpenInvitation = () => {
    if (isPlayingVideo && !videoOpened) return;

    setIsPlayingVideo(true);

    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch((e) => console.log("Audio play:", e));
    }

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => { })
        .catch((err) => {
          console.log("Video play error:", err);
          setVideoOpened(true);
        });
    } else {
      setVideoOpened(true);
    }
  };

  const handleVideoEnded = () => {
    setVideoOpened(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoOpened(false);
    setIsPlayingVideo(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const inkContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.12,
      },
    },
  };

  const inkItemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 10,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.85,
        ease: "easeOut",
      },
    },
  };

  const toggleMusic = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch((err) => {
          console.log("Audio play error:", err);
        });
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#38BDF8", "#FBBF24", "#DFB76C", "#FFFFFF"],
      });
    } catch (_) { }



    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: data?.id,
          slug: (data as any)?.slug,
          guestName: rsvpName,
          message: rsvpDua,
          rsvpJson: {
            attending: rsvpAttending === "yes",
            guests: rsvpAttending === "yes" ? (parseInt(rsvpGuests, 10) || 1) : 0,
            submittedAt: new Date().toISOString(),
          },
        }),
      });
    } catch (err) {
      console.warn("Could not save RSVP to server:", err);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="azure-nikah-root">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src={resolvedData.audioTrack || "/audio/wedding-ambience.mp3"}
        loop
        preload="auto"
        onPlay={() => setIsPlayingMusic(true)}
        onPause={() => setIsPlayingMusic(false)}
      />

      {/* Royal Fixed Parallax Background */}
      <div className="an-parallax-bg" aria-hidden="true" />

      {/* Royal Unlock Golden Flash Burst Overlay */}
      {isFlashing && <div className="an-unlock-flash-overlay" aria-hidden="true" />}

      {/* Ambient Floating Celestial Sapphire & Gold Particles */}
      <div className="an-floating-particles" aria-hidden="true">
        <span className="an-particle p1"></span>
        <span className="an-particle p2"></span>
        <span className="an-particle p3"></span>
        <span className="an-particle p4"></span>
        <span className="an-particle p5"></span>
        <span className="an-particle p6"></span>
      </div>

      {/* Ambient Falling Celestial Stars & Gold Dust (Royal Lotus Parallax Engine) */}
      <div className="an-petals-field" aria-hidden="true">
        {petals.map((p) => (
          <span
            key={p.id}
            className="an-petal"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.4 8.6L21.5 9.1L16 13.8L17.7 20.7L12 17.1L6.3 20.7L8 13.8L2.5 9.1L9.6 8.6L12 2Z" />
            </svg>
          </span>
        ))}
      </div>

      {/* Flanking Celestial Motifs for Desktop Parallax Depth */}
      <motion.div
        className="an-flanking-motif left"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 0.85, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="an-flanking-motif right"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 0.85, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        aria-hidden="true"
      />

      {/* Floating Music Toggle with Dynamic Soundwave */}
      <motion.button
        className="an-music-toggle"
        onClick={toggleMusic}
        aria-label={isPlayingMusic ? "Mute music" : "Play music"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {isPlayingMusic ? (
          <>
            <SpeakerHigh size={18} weight="fill" />
            <span className="an-soundwave-bars">
              <span className="an-bar bar-1"></span>
              <span className="an-bar bar-2"></span>
              <span className="an-bar bar-3"></span>
            </span>
          </>
        ) : (
          <SpeakerSlash size={18} weight="fill" />
        )}
      </motion.button>

      <div className="an-viewport-shell">
        {/* Top Celestial Arch Inscription with Gentle Float */}
        <motion.header
          className="an-header-arch an-floating-element"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className="an-arch-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <div className="an-arch-tag">ROYAL CELESTIAL NIKAH · AZURE ROYALE</div>
        </motion.header>

        {/* ── Grand Envelope Hero Stage (Centered on All Screen Sizes) ── */}
        <section className="an-hero-stage-container">
          {/* Floating Atmospheric Royal Elements (Sapphire Lanterns & Starbursts) */}
          <div className="an-hero-floating-elements" aria-hidden="true">
            {/* Left Hanging Sapphire Lantern */}
            <div className="an-floating-lantern an-lantern-left">
              <div className="an-lantern-chain" />
              <div className="an-lantern-body">
                <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="an-lantern-svg">
                  <circle cx="24" cy="6" r="4" stroke="#FDE68A" strokeWidth="1.5" />
                  <path d="M16 12C16 12 20 8 24 8C28 8 32 12 32 12L36 18H12L16 12Z" fill="url(#anLanternGold)" />
                  <path d="M12 18L16 52H32L36 18H12Z" fill="rgba(56, 189, 248, 0.18)" stroke="#38BDF8" strokeWidth="1.2" />
                  <path d="M24 18V52M18 20C18 36 24 48 24 48C24 48 30 36 30 20" stroke="#FDE68A" strokeWidth="0.8" opacity="0.8" />
                  <circle cx="24" cy="36" r="4" fill="#FEF08A" className="an-lantern-flame" />
                  <path d="M16 52L24 64L32 52H16Z" fill="url(#anLanternGold)" />
                  <circle cx="24" cy="68" r="2" fill="#38BDF8" />
                  <defs>
                    <linearGradient id="anLanternGold" x1="12" y1="8" x2="36" y2="64" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FDE68A" />
                      <stop offset="0.5" stopColor="#38BDF8" />
                      <stop offset="1" stopColor="#0369A1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="an-lantern-light-glow" />
              </div>
            </div>

            {/* Right Hanging Sapphire Lantern */}
            <div className="an-floating-lantern an-lantern-right">
              <div className="an-lantern-chain" />
              <div className="an-lantern-body">
                <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="an-lantern-svg">
                  <circle cx="24" cy="6" r="4" stroke="#FDE68A" strokeWidth="1.5" />
                  <path d="M16 12C16 12 20 8 24 8C28 8 32 12 32 12L36 18H12L16 12Z" fill="url(#anLanternGoldR)" />
                  <path d="M12 18L16 52H32L36 18H12Z" fill="rgba(56, 189, 248, 0.18)" stroke="#38BDF8" strokeWidth="1.2" />
                  <path d="M24 18V52M18 20C18 36 24 48 24 48C24 48 30 36 30 20" stroke="#FDE68A" strokeWidth="0.8" opacity="0.8" />
                  <circle cx="24" cy="36" r="4" fill="#FEF08A" className="an-lantern-flame" />
                  <path d="M16 52L24 64L32 52H16Z" fill="url(#anLanternGoldR)" />
                  <circle cx="24" cy="68" r="2" fill="#38BDF8" />
                  <defs>
                    <linearGradient id="anLanternGoldR" x1="12" y1="8" x2="36" y2="64" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FDE68A" />
                      <stop offset="0.5" stopColor="#38BDF8" />
                      <stop offset="1" stopColor="#0369A1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="an-lantern-light-glow" />
              </div>
            </div>

            {/* Floating Celestial Starbursts & Medallions */}
            <div className="an-floating-medallion star-1">
              <Sparkle size={20} weight="fill" />
            </div>
            <div className="an-floating-medallion star-2">
              <Star size={16} weight="fill" />
            </div>
            <div className="an-floating-medallion star-3">
              <Sparkle size={18} weight="fill" />
            </div>
            <div className="an-floating-medallion star-4">
              <Star size={14} weight="fill" />
            </div>
          </div>

          {/* Right Column / Centerpiece Interactive Video Card */}
          <div className="an-video-hero-wrapper">
            <div
              className={`an-video-card ${videoOpened ? "an-card-revealed" : ""}`}
              onClick={!isPlayingVideo ? handleOpenInvitation : undefined}
            >
              {/* Desktop Specific High-Resolution 16:9 Envelope Preview */}
              <img
                src={resolvedData.videoOpening?.desktopPosterUrl || "/templates/azure-nikah/envelope-desktop.jpg"}
                alt="Azure Nikah Wedding Envelope"
                className="an-desktop-envelope-preview"
              />

              {/* The Opening Sapphire Envelope Video */}
              <video
                ref={videoRef}
                src={resolvedData.videoOpening.videoUrl}
                playsInline
                webkit-playsinline="true"
                muted={false}
                preload="auto"
                className="an-main-video"
                onEnded={handleVideoEnded}
                onTimeUpdate={() => {
                  if (
                    videoRef.current &&
                    videoRef.current.duration > 0 &&
                    videoRef.current.currentTime >= videoRef.current.duration - 0.15 &&
                    !videoOpened
                  ) {
                    setVideoOpened(true);
                  }
                }}
              />

              {/* Seamless Stamped Initials on Envelope Wax Seal (Mobile Only) */}
              {!isDesktop && (
                <div className={`an-seal-monogram-anchor ${isPlayingVideo ? "an-seal-lifting" : ""}`}>
                  <div className="an-wax-initials-ring">
                    <span className="an-wax-initials">
                      {brideName[0]}&amp;{groomName[0]}
                    </span>
                  </div>
                </div>
              )}

              {/* Tap Prompt Ribbon (Mobile Only) */}
              {!isPlayingVideo && !isDesktop && (
                <div className="an-tap-prompt-ribbon">
                  <Sparkle size={11} className="text-[#38BDF8]" weight="fill" />
                  <span>TAP TO UNVEIL INVITATION</span>
                  <Sparkle size={11} className="text-[#38BDF8]" weight="fill" />
                </div>
              )}

              {/* Seamless Paper Print Overlay directly filling the Card */}
              <AnimatePresence>
                {(videoOpened || isDesktop) && (
                  <motion.div
                    className="an-blank-card-overlay"
                    variants={inkContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="an-paper-print-content">
                      {/* Top Sacred Header */}
                      <motion.div className="an-print-header-group" variants={inkItemVariants}>
                        <div className="an-print-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                        <p className="an-print-honor">TOGETHER WITH THEIR FAMILIES</p>
                      </motion.div>

                      {/* Grand Couple Presentation */}
                      <motion.div className="an-print-couple-group" variants={inkItemVariants}>
                        <h1 className="an-print-couple-names">
                          <span className="an-couple-bride">{brideName}</span>
                          <span className="an-print-amp">&amp;</span>
                          <span className="an-couple-groom">{groomName}</span>
                        </h1>
                        <p className="an-print-subtext">
                          Invite you to share in the joy of their Nikah ceremony &amp; celebration
                        </p>
                      </motion.div>

                      {/* Auspicious Ceremony Timings & Venue Details */}
                      <motion.div className="an-print-details-group" variants={inkItemVariants}>
                        <div className="an-print-date-badge">
                          <CalendarBlank size={13} className="text-[#0284C7]" weight="fill" />
                          <span>{formattedDate}</span>
                        </div>

                        <div className="an-print-venue-badge">
                          <MapPin size={12} className="text-[#0284C7]" weight="fill" />
                          <span>{venueName}, {resolvedData.venue?.city || "Dubai"}</span>
                        </div>

                        <div className="an-print-time-text">
                          <Clock size={12} className="text-[#0284C7]" weight="fill" />
                          <span>Nikah: 4:30 PM &nbsp;•&nbsp; Reception: 7:30 PM</span>
                        </div>
                      </motion.div>

                      {/* Envelope Center Action Controls */}
                      <motion.div
                        className="an-envelope-actions-bar"
                        variants={inkItemVariants}
                      >
                        <button
                          className="an-print-btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsRsvpOpen(true);
                          }}
                        >
                          <EnvelopeSimpleOpen size={14} weight="bold" />
                          <span>RSVP</span>
                        </button>

                        <button
                          className="an-print-btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToSection("an-events-section");
                          }}
                        >
                          <Clock size={14} weight="bold" />
                          <span>Itinerary</span>
                        </button>

                        {!isDesktop && (
                          <button
                            className="an-print-btn-replay"
                            onClick={handleReplay}
                            title="Replay Video Opening"
                          >
                            <ArrowsClockwise size={14} weight="bold" />
                          </button>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Scroll Down Indicator */}
        {isUnlocked && (
          <motion.div
            className="an-scroll-cue"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => scrollToSection("an-quran-section")}
          >
            <span>Scroll for ceremonies, gallery &amp; details</span>
            <div className="an-scroll-chevron">↓</div>
          </motion.div>
        )}

        {/* ── Optional Custom Hero / Couple Portrait Banner (if uploaded by user) ── */}
        {isUnlocked && heroImageSrc && (
          <motion.div
            className="an-custom-hero-banner"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="an-custom-hero-frame">
              <img src={heroImageSrc} alt={`${brideName} & ${groomName}`} className="an-custom-hero-img" />
              <div className="an-custom-hero-gradient" />
              <div className="an-custom-hero-badge">
                <span className="an-custom-hero-tag">CELESTIAL COUPLE</span>
                <span className="an-custom-hero-names">{brideName} &amp; {groomName}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Unlocked Royal Content Flow ── */}
        <AnimatePresence>
          {isUnlocked && (
            <motion.div
              className="an-unlocked-flow"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              {/* ── Quranic Verse Section ── */}
              <motion.section
                id="an-quran-section"
                className="an-section an-quran-card"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="an-section-corner-ornament top-left" aria-hidden="true" />
                <div className="an-section-corner-ornament top-right" aria-hidden="true" />
                <div className="an-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="an-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="an-quran-glow-backdrop"></div>
                <p className="an-arabic-verse">{resolvedData.verse?.arabic || "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا"}</p>
                <p className="an-verse-translation">&ldquo;{resolvedData.verse?.translation || "Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us an example for the righteous."}&rdquo;</p>
                <p className="an-verse-ref">{resolvedData.verse?.reference || "Surah Al-Furqan · 25:74"}</p>

                {/* Prophetic Dua Banner */}
                <div className="an-prophetic-dua-wrap mt-5 pt-4 border-t border-[rgba(223,183,108,0.25)] text-center">
                  <p className="font-serif text-base sm:text-xl text-[#F9E8B2] leading-relaxed tracking-wide font-medium">
                    بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
                  </p>
                  <p className="text-[11px] sm:text-xs text-blue-100/85 italic mt-1 max-w-md mx-auto">
                    &ldquo;May Allah bless you, shower His blessings upon you, and unite you both in goodness and eternal love.&rdquo;
                  </p>
                </div>
              </motion.section>

              {/* ── 1A. Elders' & Parents' Blessing Invitation Card ── */}
              <motion.section
                className="an-section an-elders-blessing-card text-center"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="an-section-corner-ornament top-left" aria-hidden="true" />
                <div className="an-section-corner-ornament top-right" aria-hidden="true" />
                <div className="an-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="an-section-corner-ornament bottom-right" aria-hidden="true" />
                <span className="an-section-subtitle">WITH THE BLESSINGS OF OUR ELDERS</span>
                <h2 className="an-section-title">Royal Nikah Invitation</h2>
                <div className="text-[#DFB76C] text-sm my-2">✦ ✧ ✦</div>
                <p className="an-couple-story-text max-w-xl mx-auto leading-relaxed">
                  With the divine grace of <strong>Almighty Allah (SWT)</strong> and the cherished prayers of our beloved parents and elders:
                </p>
                <div className="my-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm sm:text-base font-serif font-bold text-[#F9E8B2]">
                  <span className="tracking-wide">{brideParents}</span>
                  <span className="text-[#38BDF8] font-sans font-normal opacity-70 text-xs">❖ &amp; ❖</span>
                  <span className="tracking-wide">{groomParents}</span>
                </div>
                <p className="an-couple-story-text max-w-xl mx-auto text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                  cordially invite you to celebrate the sacred bond of Nikah and shower your warm duas upon their beloved children:
                </p>
                <p className="font-serif text-xl sm:text-3xl font-bold text-[#F9E8B2] mt-3 tracking-wide">
                  {brideName} <span className="text-[#38BDF8] font-normal">&amp;</span> {groomName}
                </p>
                <p className="text-xs sm:text-sm text-[#F9E8B2] italic mt-3 font-medium opacity-90">
                  &ldquo;Aapki pur-khuloos shirkat aur duayein hamari khushiyon ko dobala karengi.&rdquo;
                </p>
              </motion.section>

              {/* ── 1B. Meet the Couple ("The Story of Two Souls") ── */}
              <motion.section
                className="an-section an-couple-story-box"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="an-section-corner-ornament top-left" aria-hidden="true" />
                <div className="an-section-corner-ornament top-right" aria-hidden="true" />
                <div className="an-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="an-section-corner-ornament bottom-right" aria-hidden="true" />
                <span className="an-section-subtitle">THE STORY OF TWO SOULS</span>
                <h2 className="an-section-title">Meet the Couple</h2>
                <div className="text-[#DFB76C] text-sm my-2">✦ ✧ ✦</div>
                <p className="an-couple-story-text">
                  {storyMessage}
                </p>
                <span className="an-couple-hashtag">{hashtag}</span>
              </motion.section>

              {/* ── 2-Column Split Row: Countdown Box & Interactive Scratch Foil ── */}
              <div className="an-grid-2col-row">
                {/* ── Live Countdown Box ── */}
                <motion.section
                  className="an-section an-countdown-box !mb-0 flex flex-col justify-center"
                  initial={{ opacity: 0, x: -35, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                >
                  <div className="an-section-corner-ornament top-left" aria-hidden="true" />
                  <div className="an-section-corner-ornament top-right" aria-hidden="true" />
                  <div className="an-section-corner-ornament bottom-left" aria-hidden="true" />
                  <div className="an-section-corner-ornament bottom-right" aria-hidden="true" />
                  <span className="an-section-subtitle">WITH FAITH &amp; ETERNAL LOVE</span>
                  <h2 className="an-section-title">Counting The Days</h2>
                  <div className="an-countdown-grid">
                    {[
                      { val: timeLeft.days, lbl: "Days" },
                      { val: timeLeft.hours, lbl: "Hours" },
                      { val: timeLeft.minutes, lbl: "Mins" },
                      { val: timeLeft.seconds, lbl: "Secs" },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        className="an-countdown-cell"
                        initial={{ opacity: 0, scale: 0.85, y: 15 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        whileHover={{ y: -4, scale: 1.05 }}
                      >
                        <span className="an-time-val">{item.val}</span>
                        <span className="an-time-lbl">{item.lbl}</span>
                      </motion.div>
                    ))}
                  </div>
                  <p className="an-hijri-date">Islamic Date: {islamicDate}</p>
                </motion.section>

                {/* ── Interactive Scratch to Reveal Date ── */}
                <motion.section
                  className="an-section an-countdown-box !mb-0 flex flex-col justify-center"
                  initial={{ opacity: 0, x: 35, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                >
                  <div className="an-section-corner-ornament top-left" aria-hidden="true" />
                  <div className="an-section-corner-ornament top-right" aria-hidden="true" />
                  <div className="an-section-corner-ornament bottom-left" aria-hidden="true" />
                  <div className="an-section-corner-ornament bottom-right" aria-hidden="true" />
                  <div className="an-scratch-section !mt-0 !pt-0 !border-0">
                    <div className="an-scratch-header">
                      <span className="an-scratch-subtitle">INTERACTIVE INVITATION</span>
                      <h3 className="an-scratch-title">Scratch Sapphire Gold Foil to Reveal Date</h3>
                      <p className="an-scratch-desc">Swipe across the celestial foil to uncover our sacred Nikah date</p>
                    </div>
                    <div className="an-scratch-card-wrapper">
                      <ScratchCard
                        revealDate={revealMonthDay}
                        revealDay={revealDayName}
                        revealYear={revealYearStr}
                        islamicDate={islamicDate}
                        theme="sapphire"
                        onRevealComplete={() => {
                          try {
                            confetti({
                              particleCount: 70,
                              spread: 75,
                              origin: { y: 0.7 },
                              colors: ["#38BDF8", "#FDE047", "#93C5FD", "#FFFFFF"],
                            });
                          } catch (_) { }
                        }}
                      />
                    </div>
                  </div>
                </motion.section>
              </div>

              {/* ── Wedding Ceremonies Timeline (3-Column Desktop) ── */}
              <motion.section
                id="an-events-section"
                className="an-section an-events-wrapper"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="an-section-corner-ornament top-left" aria-hidden="true" />
                <div className="an-section-corner-ornament top-right" aria-hidden="true" />
                <div className="an-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="an-section-corner-ornament bottom-right" aria-hidden="true" />
                <span className="an-section-subtitle">PROGRAM OF CELEBRATION</span>
                <h2 className="an-section-title">Celestial Itinerary</h2>

                <div className="an-events-list">
                  {events.map((evt, idx) => (
                    <motion.div
                      key={idx}
                      className="an-event-card"
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.6, delay: idx * 0.12 }}
                      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
                    >
                      <div className="an-event-card-header">
                        <span className="an-event-num">0{idx + 1}</span>
                        <h3 className="an-event-name">{evt.name}</h3>
                      </div>

                      <div className="an-event-details">
                        <div className="an-event-row">
                          <CalendarBlank size={16} className="text-[#38BDF8]" weight="fill" />
                          <span>{evt.date}</span>
                        </div>
                        <div className="an-event-row">
                          <Clock size={16} className="text-[#38BDF8]" weight="fill" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="an-event-row">
                          <MapPin size={16} className="text-[#38BDF8]" weight="fill" />
                          <span>{evt.venue} — {evt.location}</span>
                        </div>
                      </div>

                      {evt.dressCode && (
                        <div className="an-dress-pill">
                          <Sparkle size={12} className="text-[#38BDF8]" weight="fill" />
                          <span>Dress Code: {evt.dressCode}</span>
                        </div>
                      )}

                      {evt.description && (
                        <p className="an-event-desc">{evt.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* ── Curated Photo Gallery Section (Bento Grid & Animated Slider) ── */}
              {galleryPhotos.length > 0 && (
                <motion.section
                  className="an-section an-gallery-section"
                  initial={{ opacity: 0, y: 45, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="an-section-corner-ornament top-left" aria-hidden="true" />
                  <div className="an-section-corner-ornament top-right" aria-hidden="true" />
                  <div className="an-section-corner-ornament bottom-left" aria-hidden="true" />
                  <div className="an-section-corner-ornament bottom-right" aria-hidden="true" />
                  <span className="an-section-subtitle">CHERISHED MOMENTS</span>
                  <h2 className="an-section-title">Sapphire &amp; Starlight Gallery</h2>

                  {/* Mode Selector */}
                  <div className="an-gallery-mode-toggle">
                    <button
                      className={`an-toggle-btn ${galleryMode === "bento" ? "active" : ""}`}
                      onClick={() => setGalleryMode("bento")}
                      aria-label="Switch to Bento Mosaic grid"
                    >
                      <SquaresFour size={15} weight="fill" />
                      <span>Bento Mosaic</span>
                    </button>
                    <button
                      className={`an-toggle-btn ${galleryMode === "slider" ? "active" : ""}`}
                      onClick={() => setGalleryMode("slider")}
                      aria-label="Switch to Cinematic Slider"
                    >
                      <FilmStrip size={15} weight="fill" />
                      <span>Cinematic Slider</span>
                    </button>
                  </div>

                  {/* Bento Mosaic Grid */}
                  {galleryMode === "bento" && (
                    <motion.div
                      className="an-bento-grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {galleryPhotos.map((imgUrl, i) => {
                        const meta = galleryCaptions[i % galleryCaptions.length];
                        const isFeatured = i === 0;
                        const isWide = i === 3;
                        return (
                          <motion.div
                            key={i}
                            className={`an-bento-card ${isFeatured ? "an-bento-featured" : ""} ${isWide ? "an-bento-wide" : ""}`}
                            onClick={() => setSelectedPhoto(imgUrl)}
                            whileHover={{ scale: 1.03, y: -6 }}
                            transition={{ duration: 0.3 }}
                          >
                            <img src={imgUrl} alt={meta?.title || `Gallery Photo ${i + 1}`} className="an-bento-img" loading="lazy" />
                            <div className="an-bento-overlay">
                              <div className="an-bento-meta">
                                <span className="an-bento-title">{meta?.title || `${brideName} & ${groomName}`}</span>
                                <span className="an-bento-sub">{meta?.subtitle || "Sacred Memories"}</span>
                              </div>
                              <span className="an-bento-zoom-icon">
                                <MagnifyingGlassPlus size={16} weight="bold" />
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* Cinematic Slider View */}
                  {galleryMode === "slider" && (
                    <motion.div
                      className="an-slider-stage"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="an-slider-viewport">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeSlide}
                            className="an-slide-item"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.04 }}
                            transition={{ duration: 0.55, ease: "easeOut" }}
                            onClick={() => setSelectedPhoto(galleryPhotos[activeSlide])}
                          >
                            <img
                              src={galleryPhotos[activeSlide]}
                              alt={`Wedding gallery slide ${activeSlide + 1}`}
                              className="an-slider-img"
                            />
                            <div className="an-slider-overlay-caption">
                              <span className="an-slider-caption-title">
                                {galleryCaptions[activeSlide % galleryCaptions.length]?.title || `${brideName} & ${groomName}`}
                              </span>
                              <span className="an-slider-caption-sub">
                                {galleryCaptions[activeSlide % galleryCaptions.length]?.subtitle || "Cherished Moments"}
                              </span>
                            </div>
                          </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        {galleryPhotos.length > 1 && (
                          <>
                            <button
                              className="an-slider-nav-btn prev"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSlide((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
                              }}
                              aria-label="Previous slide"
                            >
                              <CaretLeft size={18} weight="bold" />
                            </button>
                            <button
                              className="an-slider-nav-btn next"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSlide((prev) => (prev + 1) % galleryPhotos.length);
                              }}
                              aria-label="Next slide"
                            >
                              <CaretRight size={18} weight="bold" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Pagination Dots & Slide Counter */}
                      {galleryPhotos.length > 1 && (
                        <div className="an-slider-controls">
                          <div className="an-slider-dots">
                            {galleryPhotos.map((_, dotIdx) => (
                              <button
                                key={dotIdx}
                                className={`an-slider-dot ${dotIdx === activeSlide ? "active" : ""}`}
                                onClick={() => setActiveSlide(dotIdx)}
                                aria-label={`Go to slide ${dotIdx + 1}`}
                              />
                            ))}
                          </div>
                          <span className="an-slider-counter">
                            {activeSlide + 1} / {galleryPhotos.length}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.section>
              )}

              {/* ── Guest Essentials ("Things to Know") ── */}
              <motion.section
                className="an-section an-essentials-section"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="an-section-corner-ornament top-left" aria-hidden="true" />
                <div className="an-section-corner-ornament top-right" aria-hidden="true" />
                <div className="an-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="an-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="text-center mb-6">
                  <span className="an-section-subtitle">GUEST ESSENTIALS</span>
                  <h2 className="an-section-title">Things to Know</h2>
                  <div className="text-[#DFB76C] text-sm my-2">✦ ✧ ✦</div>
                  <p className="text-xs text-[#94A3B8] max-w-md mx-auto mt-2">
                    Thoughtful arrangements to ensure your evening celebration at {venueName} is effortless and memorable.
                  </p>
                </div>

                <div className="an-essentials-grid">
                  {[
                    {
                      title: "Dress Code",
                      desc: data?.dressCodeText || "Midnight Blue, Sapphire & Celestial Gold royal formal. Modest evening elegance requested.",
                      icon: <Sparkle size={24} weight="fill" />,
                    },
                    {
                      title: "Valet & Arrival",
                      desc: data?.transportText || "Complimentary chauffeur valet service available at the Palm Crescent Grand Entrance.",
                      icon: <Compass size={24} weight="fill" />,
                    },
                    {
                      title: "Hospitality & Suites",
                      desc: "Guest hospitality lounges and private family preparation suites reserved at Starlight Hall.",
                      icon: <MapPin size={24} weight="fill" />,
                    },
                    {
                      title: "Celebration Hashtag",
                      desc: `Capture your starry memories and tag your photos with ${hashtag}.`,
                      icon: <Star size={24} weight="fill" />,
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={item.title}
                      className="an-essentials-card"
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.12 }}
                      whileHover={{ y: -8, transition: { duration: 0.25 } }}
                    >
                      <div className="an-essentials-icon-frame">
                        {item.icon}
                      </div>
                      <h3 className="an-essentials-card-title">{item.title}</h3>
                      <div className="an-essentials-rule" />
                      <p className="an-essentials-card-desc">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* ── Venue Destination (Split Map Card on Desktop) ── */}
              <motion.section
                className="an-section an-venue-box"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="an-section-corner-ornament top-left" aria-hidden="true" />
                <div className="an-section-corner-ornament top-right" aria-hidden="true" />
                <div className="an-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="an-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="an-venue-split-grid">
                  <div className="text-left space-y-3">
                    <span className="an-section-subtitle !text-left">THE WEDDING DESTINATION</span>
                    <h2 className="an-section-title !text-left">{venueName}</h2>
                    <p className="an-venue-addr !text-left">{venueAddress}</p>
                    <p className="text-[12.5px] text-[#94A3B8] leading-relaxed">
                      We warmly invite you to join us under the stars at this exquisite venue. Full royal banquet service, dedicated prayer rooms, and valet parking are arranged.
                    </p>
                    <div className="pt-2">
                      <motion.a
                        href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(venueName + " " + venueAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="an-map-cta-btn !w-fit"
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MapPin size={18} weight="bold" />
                        <span>Open Venue in Google Maps</span>
                        <ArrowSquareOut size={16} weight="bold" />
                      </motion.a>
                    </div>
                  </div>

                  {/* Stylized Interactive Map Preview Card */}
                  <div className="relative rounded-2xl overflow-hidden border border-[#DFB76C]/40 bg-[#050B14]/60 aspect-video lg:aspect-[4/3] flex flex-col items-center justify-center p-6 text-center shadow-xl">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="w-12 h-12 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8] flex items-center justify-center text-[#38BDF8] mb-3 shadow-lg shadow-sky-950/50">
                      <MapPin size={24} weight="fill" />
                    </div>
                    <h4 className="font-['Playfair_Display'] text-[#F0F6FF] font-bold text-base">{venueName}</h4>
                    <span className="text-[11px] text-[#94A3B8] mt-1">{venueAddress}</span>
                    <a
                      href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(venueName + " " + venueAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 px-4 py-2 bg-[#38BDF8]/20 hover:bg-[#38BDF8]/30 text-[#38BDF8] border border-[#38BDF8]/60 rounded-full text-xs font-['Cinzel'] font-semibold tracking-wider transition inline-flex items-center gap-1.5"
                    >
                      <span>Open Interactive GPS</span>
                      <ArrowSquareOut size={14} />
                    </a>
                  </div>
                </div>
              </motion.section>

              {/* ── RSVP CTA Card ── */}
              <motion.section
                className="an-section an-rsvp-banner"
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="an-section-corner-ornament top-left" aria-hidden="true" />
                <div className="an-section-corner-ornament top-right" aria-hidden="true" />
                <div className="an-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="an-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="an-rsvp-inner">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Heart size={44} className="text-[#38BDF8] mb-2" weight="fill" />
                  </motion.div>
                  <h2 className="an-rsvp-title">Your Presence is Our Honour</h2>
                  <p className="an-rsvp-sub">
                    Please honor us with your confirmed attendance and blessed prayers.
                  </p>
                  <motion.button
                    className="an-rsvp-open-btn"
                    onClick={() => setIsRsvpOpen(true)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>Confirm Your RSVP</span>

                  </motion.button>
                </div>
              </motion.section>

              {/* ── Footer ── */}
              <motion.footer
                className="an-footer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0 }}
              >
                <div className="an-footer-monogram">
                  {brideName[0]}&{groomName[0]}
                </div>
                <h3 className="an-footer-names">{brideName} & {groomName}</h3>
                <p className="an-footer-quote">
                  Bound in Starlight · United by Faith · Together Forever
                </p>

                {/* ── Marketing Content At End of Template Footer ── */}
                <div className="mt-8 text-left">
                  <TemplateMarketingFooter
                    templateId="azure-nikah"
                    templateName="Azure Nikah"
                    brideName={brideName}
                    groomName={groomName}
                  />
                </div>
              </motion.footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Fullscreen Lightbox Modal ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="an-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="an-lightbox-card"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="an-lightbox-close"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photo preview"
              >
                <X size={20} weight="bold" />
              </button>
              <img src={selectedPhoto} alt="Zoomed wedding moment" className="an-lightbox-img" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RSVP Modal ── */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="an-modal-overlay">
            <motion.div
              className="an-modal-container"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <button
                className="an-modal-close"
                onClick={() => setIsRsvpOpen(false)}
              >
                <X size={18} />
              </button>

              <div className="an-modal-header">
                <div className="an-modal-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                <h3 className="an-modal-title">Confirm Attendance</h3>
                <p className="an-modal-sub">For {brideName} & {groomName}&apos;s Celestial Nikah</p>
              </div>

              {isSubmitted ? (
                <div className="an-success-msg text-center">
                  <CheckCircle size={48} className="text-[#38BDF8] mb-3 mx-auto" weight="fill" />
                  <h4 className="text-lg font-serif text-[#38BDF8]">JazakAllah Khair!</h4>
                  <p className="text-xs text-[#E0F2FE] mt-1 leading-relaxed">
                    Thank you, <strong>{rsvpName || "Dear Guest"}</strong>! Your RSVP and sacred duas have been received with immense gratitude. <br className="hidden sm:inline" />
                    <span className="italic block mt-1 text-[#38BDF8] font-medium">Aapki duayein hamari nayi zindagi ke aaghaaz mein barkat ka sabab banengi.</span>
                  </p>

                  <div className="mt-4 pt-3 border-t border-[rgba(56,189,248,0.2)]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRsvpOpen(false);
                        setIsSubmitted(false);
                      }}
                      className="w-full py-2.5 bg-[#38BDF8] hover:bg-[#2baee8] text-[#051124] font-bold text-xs rounded-xl uppercase tracking-wider transition-all"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="an-rsvp-form">
                  <div className="an-form-group">
                    <label className="an-label">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bilal & Family"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="an-input"
                    />
                  </div>

                  <div className="an-form-group">
                    <label className="an-label">Will you be attending?</label>
                    <div className="an-radio-group">
                      <button
                        type="button"
                        className={`an-radio-btn ${rsvpAttending === "yes" ? "active" : ""}`}
                        onClick={() => setRsvpAttending("yes")}
                      >
                        Joyfully Accept
                      </button>
                      <button
                        type="button"
                        className={`an-radio-btn ${rsvpAttending === "no" ? "active" : ""}`}
                        onClick={() => setRsvpAttending("no")}
                      >
                        Regretfully Decline
                      </button>
                    </div>
                  </div>

                  {rsvpAttending === "yes" && (
                    <div className="an-form-group">
                      <label className="an-label">Number of Guests Attending</label>
                      <select
                        value={rsvpGuests}
                        onChange={(e) => setRsvpGuests(e.target.value)}
                        className="an-select"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="5+">5+ Persons (Family)</option>
                      </select>
                    </div>
                  )}

                  <div className="an-form-group">
                    <label className="an-label">Your Blessings / Dua for the Couple</label>
                    <textarea
                      rows={3}
                      placeholder="May Allah bless this celestial union with enduring peace and grace..."
                      value={rsvpDua}
                      onChange={(e) => setRsvpDua(e.target.value)}
                      className="an-textarea"
                    />
                  </div>

                  <button type="submit" className="an-submit-btn">
                    <span>Submit RSVP</span>
                    <Sparkle size={15} weight="fill" />
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
