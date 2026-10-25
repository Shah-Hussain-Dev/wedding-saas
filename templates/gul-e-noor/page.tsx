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

interface GulENoorProps {
  data?: any;
}

export default function GulENoor({ data }: GulENoorProps) {
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
            colors: ["#D4849A", "#FADEB8", "#E5A9B8", "#FFFDF8"],
          });
        } catch (_) {}
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
  const brideName = data?.brideName || data?.couple?.brideName || resolvedData.couple?.brideName || "Areesha";
  const groomName = data?.groomName || data?.couple?.groomName || resolvedData.couple?.groomName || "Hamza";
  const brideParents = data?.brideParents || data?.couple?.brideParents || resolvedData.couple?.brideParents || "Mr. & Mrs. Shakeel Ahmed Siddiqui";
  const groomParents = data?.groomParents || data?.couple?.groomParents || resolvedData.couple?.groomParents || "Mr. & Mrs. Rafiq Usman Memon";
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
    : "March 21";
  const revealDayName = !isNaN(weddingDate.getTime())
    ? weddingDate.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" })
    : "Sunday";
  const revealYearStr = !isNaN(weddingDate.getTime())
    ? weddingDate.getFullYear().toString()
    : "2027";

  const venueName = data?.venueName || data?.venue?.name || resolvedData.venue?.name || "The Rosewood Palace Estate";
  const venueAddress = data?.venueAddress || data?.venue?.address || resolvedData.venue?.address || "Al Barari, Jasmine Avenue, Dubai";
  const venueMapUrl = data?.venueMapUrl || data?.venue?.mapUrl || resolvedData.venue?.mapUrl;
  const islamicDate = data?.islamicDate || resolvedData.islamicDate || "12 Ramadan 1448 AH";

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
        "/templates/gul-e-noor/poster.png",
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop",
      ];
  const galleryPhotos: string[] = rawGallery
    .map((item: any) => (typeof item === "string" ? item : item?.url || item?.src || ""))
    .filter(Boolean);

  const galleryCaptions = resolvedData.galleryCaptions || [
    { title: "A Garden of Roses", subtitle: "Our Fairytale Unfolds" },
    { title: "Sacred Ring Ceremony", subtitle: "With Faith & Grace" },
    { title: "Soft Rose Petals", subtitle: "Blessings of Love" },
    { title: "The Golden Hour", subtitle: "A Lifetime Together" },
    { title: "The Grand Celebration", subtitle: "Surrounded by Loved Ones" },
  ];

  const events: EventItem[] = (data?.events || data?.eventsJson || resolvedData.events || []).filter((e: any) => e.enabled !== false);

  const hashtag = data?.hashtag || resolvedData.hashtag || `#${brideName}Weds${groomName}`;
  const storyMessage = data?.storyMessage || resolvedData.storyMessage || "In a garden of blooming roses and fragrant jasmine, our story blossomed with eternal grace. With the heartfelt blessings of our elders, we joyfully unite in the sacred bond of Nikah.";

  // Deterministic falling rose petals (Royal Lotus Parallax Engine)
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
  const [timeLeft, setTimeLeft] = useState({ days: 184, hours: 12, minutes: 45, seconds: 15 });
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
        .then(() => {})
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
        colors: ["#D4849A", "#FADEB8", "#E5A9B8", "#FFFDF8"],
      });
    } catch (_) {}



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

  const inkContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.22,
        delayChildren: 0.35,
      },
    },
  };

  const inkItemVariants: Variants = {
    hidden: { opacity: 0, y: 12, filter: "blur(2px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="gul-e-noor-root">
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
      <div className="gn-parallax-bg" aria-hidden="true" />

      {/* Royal Unlock Golden Flash Burst Overlay */}
      {isFlashing && <div className="gn-unlock-flash-overlay" aria-hidden="true" />}

      {/* Ambient Floating Rose-Gold Petal & Sparkle Particles */}
      <div className="gn-floating-particles" aria-hidden="true">
        <span className="gn-particle p1"></span>
        <span className="gn-particle p2"></span>
        <span className="gn-particle p3"></span>
        <span className="gn-particle p4"></span>
        <span className="gn-particle p5"></span>
        <span className="gn-particle p6"></span>
      </div>

      {/* Ambient Falling Rose Petals (Royal Lotus Parallax Engine) */}
      <div className="gn-petals-field" aria-hidden="true">
        {petals.map((p) => (
          <span
            key={p.id}
            className="gn-petal"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.5 6 3 11 3 15.5C3 19.1 5.9 22 9.5 22C11.5 22 13.5 20.8 14.8 19C17.5 15.5 18 10 12 2Z" />
            </svg>
          </span>
        ))}
      </div>

      {/* Flanking Rose Motifs for Desktop Parallax Depth */}
      <motion.div
        className="gn-flanking-motif left"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 0.85, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="gn-flanking-motif right"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 0.85, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        aria-hidden="true"
      />

      {/* Floating Music Toggle with Soundwave */}
      <motion.button
        className="gn-music-toggle"
        onClick={toggleMusic}
        aria-label={isPlayingMusic ? "Mute music" : "Play music"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {isPlayingMusic ? (
          <>
            <SpeakerHigh size={18} weight="fill" />
            <span className="gn-soundwave-bars">
              <span className="gn-bar bar-1"></span>
              <span className="gn-bar bar-2"></span>
              <span className="gn-bar bar-3"></span>
            </span>
          </>
        ) : (
          <SpeakerSlash size={18} weight="fill" />
        )}
      </motion.button>

      <div className="gn-viewport-shell">
        {/* Top Sacred Arch Inscription with Gentle Float */}
        <motion.header
          className="gn-header-arch gn-floating-element"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className="gn-arch-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <div className="gn-arch-tag">SACRED NIKAH INVITATION · GUL-E-NOOR</div>
        </motion.header>

        {/* ── Grand Envelope Hero Stage (Centered on All Screen Sizes) ── */}
        <section className="gn-hero-stage-container">
          {/* Floating Atmospheric Royal Elements (Lanterns & Medallions) */}
          <div className="gn-hero-floating-elements" aria-hidden="true">
            {/* Left Hanging Rose-Gold Lantern */}
            <div className="gn-floating-lantern gn-lantern-left">
              <div className="gn-lantern-chain" />
              <div className="gn-lantern-body">
                <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="gn-lantern-svg">
                  <circle cx="24" cy="6" r="4" stroke="#FCE7F3" strokeWidth="1.5" />
                  <path d="M16 12C16 12 20 8 24 8C28 8 32 12 32 12L36 18H12L16 12Z" fill="url(#gnLanternGold)" />
                  <path d="M12 18L16 52H32L36 18H12Z" fill="rgba(217, 119, 144, 0.15)" stroke="#D97790" strokeWidth="1.2" />
                  <path d="M24 18V52M18 20C18 36 24 48 24 48C24 48 30 36 30 20" stroke="#FDE2E4" strokeWidth="0.8" opacity="0.8" />
                  <circle cx="24" cy="36" r="4" fill="#FDE2E4" className="gn-lantern-flame" />
                  <path d="M16 52L24 64L32 52H16Z" fill="url(#gnLanternGold)" />
                  <circle cx="24" cy="68" r="2" fill="#D97790" />
                  <defs>
                    <linearGradient id="gnLanternGold" x1="12" y1="8" x2="36" y2="64" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FDE2E4" />
                      <stop offset="0.5" stopColor="#D97790" />
                      <stop offset="1" stopColor="#831843" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="gn-lantern-light-glow" />
              </div>
            </div>

            {/* Right Hanging Rose-Gold Lantern */}
            <div className="gn-floating-lantern gn-lantern-right">
              <div className="gn-lantern-chain" />
              <div className="gn-lantern-body">
                <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="gn-lantern-svg">
                  <circle cx="24" cy="6" r="4" stroke="#FCE7F3" strokeWidth="1.5" />
                  <path d="M16 12C16 12 20 8 24 8C28 8 32 12 32 12L36 18H12L16 12Z" fill="url(#gnLanternGoldR)" />
                  <path d="M12 18L16 52H32L36 18H12Z" fill="rgba(217, 119, 144, 0.15)" stroke="#D97790" strokeWidth="1.2" />
                  <path d="M24 18V52M18 20C18 36 24 48 24 48C24 48 30 36 30 20" stroke="#FDE2E4" strokeWidth="0.8" opacity="0.8" />
                  <circle cx="24" cy="36" r="4" fill="#FDE2E4" className="gn-lantern-flame" />
                  <path d="M16 52L24 64L32 52H16Z" fill="url(#gnLanternGoldR)" />
                  <circle cx="24" cy="68" r="2" fill="#D97790" />
                  <defs>
                    <linearGradient id="gnLanternGoldR" x1="12" y1="8" x2="36" y2="64" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FDE2E4" />
                      <stop offset="0.5" stopColor="#D97790" />
                      <stop offset="1" stopColor="#831843" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="gn-lantern-light-glow" />
              </div>
            </div>

            {/* Floating Rose Medallions & Starbursts */}
            <div className="gn-floating-medallion star-1">
              <Sparkle size={20} weight="fill" />
            </div>
            <div className="gn-floating-medallion star-2">
              <Star size={16} weight="fill" />
            </div>
            <div className="gn-floating-medallion star-3">
              <Sparkle size={18} weight="fill" />
            </div>
            <div className="gn-floating-medallion star-4">
              <Star size={14} weight="fill" />
            </div>
          </div>

          {/* Center Envelope Hero */}
          <div className="w-full flex justify-center">
            <div className="gn-video-hero-wrapper !mb-0">
              <div
                className={`gn-video-card ${videoOpened ? "gn-card-revealed" : ""}`}
                onClick={!isPlayingVideo ? handleOpenInvitation : undefined}
              >
                {/* Desktop Specific High-Resolution 16:9 Envelope Preview */}
                <img
                  src={resolvedData.videoOpening?.desktopPosterUrl || "/templates/gul-e-noor/envelope-desktop.jpg"}
                  alt="Gul-e-Noor Wedding Envelope"
                  className="gn-desktop-envelope-preview"
                />

                {/* The Opening Envelope Video */}
                <video
                  ref={videoRef}
                  src={resolvedData.videoOpening.videoUrl}
                  playsInline
                  webkit-playsinline="true"
                  muted={false}
                  preload="auto"
                  className="gn-main-video"
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
                  <div className={`gn-seal-monogram-anchor ${isPlayingVideo ? "gn-seal-lifting" : ""}`}>
                    <div className="gn-wax-initials-ring">
                      <span className="gn-wax-initials">
                        {brideName[0]}&amp;{groomName[0]}
                      </span>
                    </div>
                  </div>
                )}

                {/* Tap prompt ribbon (Mobile Only) */}
                {!isPlayingVideo && !isDesktop && (
                  <div className="gn-tap-prompt-ribbon">
                    <Sparkle size={11} className="text-[#D4849A]" weight="fill" />
                    <span>TAP TO OPEN INVITATION</span>
                    <Sparkle size={11} className="text-[#D4849A]" weight="fill" />
                  </div>
                )}

                {/* Seamless Paper Print Overlay directly filling the Card */}
                <AnimatePresence>
                  {(videoOpened || isDesktop) && (
                    <motion.div
                      className="gn-blank-card-overlay"
                      variants={inkContainerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="gn-paper-print-content">
                        {/* Top Sacred Header */}
                        <motion.div className="gn-print-header-group" variants={inkItemVariants}>
                          <div className="gn-print-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                          <p className="gn-print-honor">TOGETHER WITH THEIR FAMILIES</p>
                        </motion.div>

                        {/* Grand Couple Presentation */}
                        <motion.div className="gn-print-couple-group" variants={inkItemVariants}>
                          <h1 className="gn-print-couple-names">
                            <span className="gn-couple-bride">{brideName}</span>
                            <span className="gn-print-amp">&amp;</span>
                            <span className="gn-couple-groom">{groomName}</span>
                          </h1>
                          <p className="gn-print-subtext">
                            Invite you to celebrate their union and Nikah
                          </p>
                        </motion.div>

                        {/* Auspicious Ceremony Timings & Venue Details */}
                        <motion.div className="gn-print-details-group" variants={inkItemVariants}>
                          <div className="gn-print-date-badge">
                            <CalendarBlank size={13} className="text-[#A34360]" weight="fill" />
                            <span>{formattedDate}</span>
                          </div>

                          <div className="gn-print-venue-badge">
                            <MapPin size={12} className="text-[#A34360]" weight="fill" />
                            <span>{venueName}, {resolvedData.venue?.city || "Dubai"}</span>
                          </div>

                          <div className="gn-print-time-text">
                            <Clock size={12} className="text-[#A34360]" weight="fill" />
                            <span>Nikah: 4:00 PM &nbsp;•&nbsp; Reception: 7:00 PM</span>
                          </div>
                        </motion.div>

                        {/* Envelope Center Action Controls */}
                        <motion.div
                          className="gn-envelope-actions-bar"
                          variants={inkItemVariants}
                        >
                          <button
                            className="gn-print-btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsRsvpOpen(true);
                            }}
                          >
                            <EnvelopeSimpleOpen size={14} weight="bold" />
                            <span>RSVP</span>
                          </button>

                          <button
                            className="gn-print-btn-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              scrollToSection("gn-events-section");
                            }}
                          >
                            <Clock size={14} weight="bold" />
                            <span>Itinerary</span>
                          </button>

                          {!isDesktop && (
                            <button
                              className="gn-print-btn-replay"
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
          </div>
        </section>

        {/* Scroll Down Indicator */}
        {isUnlocked && (
          <motion.div
            className="gn-scroll-cue"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => scrollToSection("gn-quran-section")}
          >
            <span>Scroll for ceremonies, gallery &amp; details</span>
            <div className="gn-scroll-chevron">↓</div>
          </motion.div>
        )}

        {/* ── Optional Custom Hero / Couple Portrait Banner (if uploaded by user) ── */}
        {isUnlocked && heroImageSrc && (
          <motion.div
            className="gn-custom-hero-banner"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="gn-custom-hero-frame">
              <img src={heroImageSrc} alt={`${brideName} & ${groomName}`} className="gn-custom-hero-img" />
              <div className="gn-custom-hero-gradient" />
              <div className="gn-custom-hero-badge">
                <span className="gn-custom-hero-tag">ROYAL COUPLE</span>
                <span className="gn-custom-hero-names">{brideName} &amp; {groomName}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Unlocked Royal Invitation Sections ── */}
        <AnimatePresence>
          {isUnlocked && (
            <motion.div
              className="gn-unlocked-flow"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              {/* ── Quranic Verse Section ── */}
              <motion.section
                id="gn-quran-section"
                className="gn-section gn-quran-card"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="gn-section-corner-ornament top-left" aria-hidden="true" />
                <div className="gn-section-corner-ornament top-right" aria-hidden="true" />
                <div className="gn-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="gn-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="gn-quran-glow-backdrop"></div>
                <p className="gn-arabic-verse">{resolvedData.verse?.arabic || "وَخَلَقْنَاكُمْ أَزْوَاجًا"}</p>
                <p className="gn-verse-translation">&ldquo;{resolvedData.verse?.translation || "And We created you in pairs."}&rdquo;</p>
                <p className="gn-verse-ref">{resolvedData.verse?.reference || "Surah An-Naba · 78:8"}</p>

                {/* Prophetic Dua Banner */}
                <div className="gn-prophetic-dua-wrap mt-5 pt-4 border-t border-[rgba(215,184,117,0.3)] text-center">
                  <p className="font-serif text-base sm:text-xl text-[#FADEB8] leading-relaxed tracking-wide font-medium">
                    بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
                  </p>
                  <p className="text-[11px] sm:text-xs text-rose-100/85 italic mt-1 max-w-md mx-auto">
                    &ldquo;May Allah bless you, shower His blessings upon you, and unite you both in goodness and eternal love.&rdquo;
                  </p>
                </div>
              </motion.section>

              {/* ── 1A. Elders' & Parents' Blessing Invitation Card ── */}
              <motion.section
                className="gn-section gn-elders-blessing-card text-center"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="gn-section-corner-ornament top-left" aria-hidden="true" />
                <div className="gn-section-corner-ornament top-right" aria-hidden="true" />
                <div className="gn-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="gn-section-corner-ornament bottom-right" aria-hidden="true" />
                <span className="gn-section-subtitle">WITH THE BLESSINGS OF OUR ELDERS</span>
                <h2 className="gn-section-title">Royal Nikah Invitation</h2>
                <div className="gn-section-ornament">✦ ⚜ ✦</div>
                <p className="gn-couple-story-text max-w-xl mx-auto leading-relaxed">
                  With the divine grace of <strong>Almighty Allah (SWT)</strong> and the heartfelt prayers of our beloved parents and elders:
                </p>
                <div className="my-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm sm:text-base font-serif font-bold text-[#FADEB8]">
                  <span className="tracking-wide">{brideParents}</span>
                  <span className="text-[#D4849A] font-sans font-normal opacity-70 text-xs">❖ &amp; ❖</span>
                  <span className="tracking-wide">{groomParents}</span>
                </div>
                <p className="gn-couple-story-text max-w-xl mx-auto text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                  cordially request the honour of your gracious presence, prayers, and blessings to celebrate the auspicious Nikah union of their beloved children:
                </p>
                <p className="font-serif text-xl sm:text-3xl font-bold text-[#FADEB8] mt-3 tracking-wide">
                  {brideName} <span className="text-[#D4849A] font-normal">&amp;</span> {groomName}
                </p>
                <p className="text-xs sm:text-sm text-[#FADEB8] italic mt-3 font-medium opacity-90">
                  &ldquo;Aapki pur-khuloos shirkat aur duayein hamari khushiyon ko dobala karengi.&rdquo;
                </p>
              </motion.section>

              {/* ── 1B. Meet the Couple ("The Story of Two Souls") ── */}
              <motion.section
                className="gn-section gn-couple-story-box"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="gn-section-corner-ornament top-left" aria-hidden="true" />
                <div className="gn-section-corner-ornament top-right" aria-hidden="true" />
                <div className="gn-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="gn-section-corner-ornament bottom-right" aria-hidden="true" />
                <span className="gn-section-subtitle">THE STORY OF TWO SOULS</span>
                <h2 className="gn-section-title">Meet the Couple</h2>
                <div className="gn-section-ornament">✦ ❀ ✦</div>
                <p className="gn-couple-story-text">
                  {storyMessage}
                </p>
                <span className="gn-couple-hashtag">{hashtag}</span>
              </motion.section>

              {/* ── 2-Column Split Row: Countdown Box & Interactive Scratch Foil ── */}
              <div className="gn-grid-2col-row">
                {/* ── Live Countdown Box ── */}
                <motion.section
                  className="gn-section gn-countdown-box !mb-0 flex flex-col justify-center"
                  initial={{ opacity: 0, x: -35, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                >
                  <div className="gn-section-corner-ornament top-left" aria-hidden="true" />
                  <div className="gn-section-corner-ornament top-right" aria-hidden="true" />
                  <div className="gn-section-corner-ornament bottom-left" aria-hidden="true" />
                  <div className="gn-section-corner-ornament bottom-right" aria-hidden="true" />
                  <span className="gn-section-subtitle">WITH FAITH &amp; LOVE</span>
                  <h2 className="gn-section-title">Counting The Days</h2>
                  <div className="gn-countdown-grid">
                    {[
                      { val: timeLeft.days, lbl: "Days" },
                      { val: timeLeft.hours, lbl: "Hours" },
                      { val: timeLeft.minutes, lbl: "Mins" },
                      { val: timeLeft.seconds, lbl: "Secs" },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        className="gn-countdown-cell"
                        initial={{ opacity: 0, scale: 0.85, y: 15 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        whileHover={{ y: -4, scale: 1.05 }}
                      >
                        <span className="gn-time-val">{item.val}</span>
                        <span className="gn-time-lbl">{item.lbl}</span>
                      </motion.div>
                    ))}
                  </div>
                  <p className="gn-hijri-date">Islamic Date: {islamicDate}</p>
                </motion.section>

                {/* ── Interactive Scratch to Reveal Date ── */}
                <motion.section
                  className="gn-section gn-countdown-box !mb-0 flex flex-col justify-center"
                  initial={{ opacity: 0, x: 35, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                >
                  <div className="gn-section-corner-ornament top-left" aria-hidden="true" />
                  <div className="gn-section-corner-ornament top-right" aria-hidden="true" />
                  <div className="gn-section-corner-ornament bottom-left" aria-hidden="true" />
                  <div className="gn-section-corner-ornament bottom-right" aria-hidden="true" />
                  <div className="gn-scratch-section !mt-0 !pt-0 !border-0">
                    <div className="gn-scratch-header">
                      <span className="gn-scratch-subtitle">INTERACTIVE INVITATION</span>
                      <h3 className="gn-scratch-title">Scratch Rose Gold Foil to Reveal Date</h3>
                      <p className="gn-scratch-desc">Swipe across the foil to uncover our sacred wedding date</p>
                    </div>
                    <div className="gn-scratch-card-wrapper">
                      <ScratchCard
                        revealDate={revealMonthDay}
                        revealDay={revealDayName}
                        revealYear={revealYearStr}
                        islamicDate={islamicDate}
                        theme="rose"
                        onRevealComplete={() => {
                          try {
                            confetti({
                              particleCount: 70,
                              spread: 75,
                              origin: { y: 0.7 },
                              colors: ["#D4849A", "#FADEB8", "#E5A9B8", "#FFFDF8"],
                            });
                          } catch (_) {}
                        }}
                      />
                    </div>
                  </div>
                </motion.section>
              </div>

              {/* ── Event Timeline (3-Column Desktop) ── */}
              <motion.section
                id="gn-events-section"
                className="gn-section gn-events-wrapper"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="gn-section-corner-ornament top-left" aria-hidden="true" />
                <div className="gn-section-corner-ornament top-right" aria-hidden="true" />
                <div className="gn-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="gn-section-corner-ornament bottom-right" aria-hidden="true" />
                <span className="gn-section-subtitle">PROGRAM OF CELEBRATION</span>
                <h2 className="gn-section-title">Wedding Itinerary</h2>

                <div className="gn-events-list">
                  {events.map((evt, idx) => (
                    <motion.div
                      key={idx}
                      className="gn-event-card"
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.6, delay: idx * 0.12 }}
                      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
                    >
                      <div className="gn-event-card-header">
                        <span className="gn-event-num">0{idx + 1}</span>
                        <h3 className="gn-event-name">{evt.name}</h3>
                      </div>

                      <div className="gn-event-details">
                        <div className="gn-event-row">
                          <CalendarBlank size={16} className="text-[#D4849A]" weight="fill" />
                          <span>{evt.date}</span>
                        </div>
                        <div className="gn-event-row">
                          <Clock size={16} className="text-[#D4849A]" weight="fill" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="gn-event-row">
                          <MapPin size={16} className="text-[#D4849A]" weight="fill" />
                          <span>{evt.venue} — {evt.location}</span>
                        </div>
                      </div>

                      {evt.dressCode && (
                        <div className="gn-dress-pill">
                          <Sparkle size={12} className="text-[#D4849A]" weight="fill" />
                          <span>Dress Code: {evt.dressCode}</span>
                        </div>
                      )}

                      {evt.description && (
                        <p className="gn-event-desc">{evt.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* ── Curated Photo Gallery Section (Bento Grid & Animated Slider) ── */}
              {galleryPhotos.length > 0 && (
                <motion.section
                  className="gn-section gn-gallery-section"
                  initial={{ opacity: 0, y: 45, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="gn-section-corner-ornament top-left" aria-hidden="true" />
                  <div className="gn-section-corner-ornament top-right" aria-hidden="true" />
                  <div className="gn-section-corner-ornament bottom-left" aria-hidden="true" />
                  <div className="gn-section-corner-ornament bottom-right" aria-hidden="true" />
                  <span className="gn-section-subtitle">OUR CHERISHED MOMENTS</span>
                  <h2 className="gn-section-title">Rose &amp; Gold Gallery</h2>

                  {/* Mode Selector */}
                  <div className="gn-gallery-mode-toggle">
                    <button
                      className={`gn-toggle-btn ${galleryMode === "bento" ? "active" : ""}`}
                      onClick={() => setGalleryMode("bento")}
                      aria-label="Switch to Bento Mosaic grid"
                    >
                      <SquaresFour size={15} weight="fill" />
                      <span>Bento Mosaic</span>
                    </button>
                    <button
                      className={`gn-toggle-btn ${galleryMode === "slider" ? "active" : ""}`}
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
                      className="gn-bento-grid"
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
                            className={`gn-bento-card ${isFeatured ? "gn-bento-featured" : ""} ${isWide ? "gn-bento-wide" : ""}`}
                            onClick={() => setSelectedPhoto(imgUrl)}
                            whileHover={{ scale: 1.03, y: -6 }}
                            transition={{ duration: 0.3 }}
                          >
                            <img src={imgUrl} alt={meta?.title || `Gallery Photo ${i + 1}`} className="gn-bento-img" loading="lazy" />
                            <div className="gn-bento-overlay">
                              <div className="gn-bento-meta">
                                <span className="gn-bento-title">{meta?.title || `${brideName} & ${groomName}`}</span>
                                <span className="gn-bento-sub">{meta?.subtitle || "Cherished Moments"}</span>
                              </div>
                              <span className="gn-bento-zoom-icon">
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
                      className="gn-slider-stage"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="gn-slider-viewport">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeSlide}
                            className="gn-slide-item"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.04 }}
                            transition={{ duration: 0.55, ease: "easeOut" }}
                            onClick={() => setSelectedPhoto(galleryPhotos[activeSlide])}
                          >
                            <img
                              src={galleryPhotos[activeSlide]}
                              alt={`Wedding gallery slide ${activeSlide + 1}`}
                              className="gn-slider-img"
                            />
                            <div className="gn-slider-overlay-caption">
                              <span className="gn-slider-caption-title">
                                {galleryCaptions[activeSlide % galleryCaptions.length]?.title || `${brideName} & ${groomName}`}
                              </span>
                              <span className="gn-slider-caption-sub">
                                {galleryCaptions[activeSlide % galleryCaptions.length]?.subtitle || "Cherished Moments"}
                              </span>
                            </div>
                          </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        {galleryPhotos.length > 1 && (
                          <>
                            <button
                              className="gn-slider-nav-btn prev"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSlide((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
                              }}
                              aria-label="Previous slide"
                            >
                              <CaretLeft size={18} weight="bold" />
                            </button>
                            <button
                              className="gn-slider-nav-btn next"
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
                        <div className="gn-slider-controls">
                          <div className="gn-slider-dots">
                            {galleryPhotos.map((_, dotIdx) => (
                              <button
                                key={dotIdx}
                                className={`gn-slider-dot ${dotIdx === activeSlide ? "active" : ""}`}
                                onClick={() => setActiveSlide(dotIdx)}
                                aria-label={`Go to slide ${dotIdx + 1}`}
                              />
                            ))}
                          </div>
                          <span className="gn-slider-counter">
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
                className="gn-section gn-essentials-section"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="gn-section-corner-ornament top-left" aria-hidden="true" />
                <div className="gn-section-corner-ornament top-right" aria-hidden="true" />
                <div className="gn-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="gn-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="text-center mb-6">
                  <span className="gn-section-subtitle">GUEST ESSENTIALS</span>
                  <h2 className="gn-section-title">Things to Know</h2>
                  <div className="gn-section-ornament">✦ ❀ ✦</div>
                  <p className="text-xs text-[#D1B3BC] max-w-md mx-auto mt-2">
                    Thoughtful arrangements to ensure your celebration at {venueName} is effortless and memorable.
                  </p>
                </div>

                <div className="gn-essentials-grid">
                  {[
                    {
                      title: "Dress Code",
                      desc: data?.dressCodeText || "Pastel formal & traditional blush velvet attire. Modest elegance requested.",
                      icon: <Sparkle size={24} weight="fill" />,
                    },
                    {
                      title: "Valet & Parking",
                      desc: data?.transportText || "Complimentary chauffeur valet service available at the main garden gate entrance.",
                      icon: <Compass size={24} weight="fill" />,
                    },
                    {
                      title: "Hospitality & Stay",
                      desc: "Guest hospitality suites and family lounge rooms arranged at The Rosewood Estate.",
                      icon: <MapPin size={24} weight="fill" />,
                    },
                    {
                      title: "Celebration Hashtag",
                      desc: `Capture your cherished memories and tag your photos with ${hashtag}.`,
                      icon: <Star size={24} weight="fill" />,
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={item.title}
                      className="gn-essentials-card"
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.12 }}
                      whileHover={{ y: -8, transition: { duration: 0.25 } }}
                    >
                      <div className="gn-essentials-icon-frame">
                        {item.icon}
                      </div>
                      <h3 className="gn-essentials-card-title">{item.title}</h3>
                      <div className="gn-essentials-rule" />
                      <p className="gn-essentials-card-desc">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* ── Venue Destination (Split Map Card on Desktop) ── */}
              <motion.section
                className="gn-section gn-venue-box"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="gn-section-corner-ornament top-left" aria-hidden="true" />
                <div className="gn-section-corner-ornament top-right" aria-hidden="true" />
                <div className="gn-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="gn-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="gn-venue-split-grid">
                  <div className="text-left space-y-3">
                    <span className="gn-section-subtitle !text-left">THE WEDDING DESTINATION</span>
                    <h2 className="gn-section-title !text-left">{venueName}</h2>
                    <p className="gn-venue-addr !text-left">{venueAddress}</p>
                    <p className="text-[12.5px] text-[#D1B3BC] leading-relaxed">
                      We warmly invite you to join us on our most cherished day at this breathtaking venue. Full reception hospitality, prayer facilities, and parking assistance are arranged.
                    </p>
                    <div className="pt-2">
                      <motion.a
                        href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(venueName + " " + venueAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gn-map-cta-btn !w-fit"
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
                  <div className="relative rounded-2xl overflow-hidden border border-[#D4849A]/40 bg-[#1A0B10]/60 aspect-video lg:aspect-[4/3] flex flex-col items-center justify-center p-6 text-center shadow-xl">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D4849A_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="w-12 h-12 rounded-full bg-[#D4849A]/20 border border-[#D4849A] flex items-center justify-center text-[#D4849A] mb-3 shadow-lg shadow-rose-950/40">
                      <MapPin size={24} weight="fill" />
                    </div>
                    <h4 className="font-['Playfair_Display'] text-[#FFF0F4] font-bold text-base">{venueName}</h4>
                    <span className="text-[11px] text-[#D1B3BC] mt-1">{venueAddress}</span>
                    <a
                      href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(venueName + " " + venueAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 px-4 py-2 bg-[#D4849A]/20 hover:bg-[#D4849A]/30 text-[#D4849A] border border-[#D4849A]/60 rounded-full text-xs font-['Cormorant_Garamond'] font-bold tracking-wider transition inline-flex items-center gap-1.5"
                    >
                      <span>Open Interactive GPS</span>
                      <ArrowSquareOut size={14} />
                    </a>
                  </div>
                </div>
              </motion.section>

              {/* ── RSVP CTA Card ── */}
              <motion.section
                className="gn-section gn-rsvp-banner"
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="gn-section-corner-ornament top-left" aria-hidden="true" />
                <div className="gn-section-corner-ornament top-right" aria-hidden="true" />
                <div className="gn-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="gn-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="gn-rsvp-inner">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Heart size={44} className="text-[#D4849A] mb-2" weight="fill" />
                  </motion.div>
                  <h2 className="gn-rsvp-title">Your Presence is Our Blessing</h2>
                  <p className="gn-rsvp-sub">
                    Please honor us with your confirmed attendance and warm prayers.
                  </p>
                  <motion.button
                    className="gn-rsvp-open-btn"
                    onClick={() => setIsRsvpOpen(true)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>Confirm Your RSVP</span>
                    <Sparkle size={16} weight="fill" />
                  </motion.button>
                </div>
              </motion.section>

              {/* ── Footer ── */}
              <motion.footer
                className="gn-footer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0 }}
              >
                <div className="gn-footer-monogram">
                  {brideName[0]}&{groomName[0]}
                </div>
                <h3 className="gn-footer-names">{brideName} & {groomName}</h3>
                <p className="gn-footer-quote">
                  Bound by Love · Guided by Faith · Together Forever
                </p>

                {/* ── Marketing Content At End of Template Footer ── */}
                <div className="mt-8 text-left">
                  <TemplateMarketingFooter
                    templateId="gul-e-noor"
                    templateName="Gul-e-Noor"
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
            className="gn-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="gn-lightbox-card"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="gn-lightbox-close"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photo preview"
              >
                <X size={20} weight="bold" />
              </button>
              <img src={selectedPhoto} alt="Zoomed wedding moment" className="gn-lightbox-img" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RSVP Modal ── */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="gn-modal-overlay">
            <motion.div
              className="gn-modal-container"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <button
                className="gn-modal-close"
                onClick={() => setIsRsvpOpen(false)}
              >
                <X size={18} />
              </button>

              <div className="gn-modal-header">
                <div className="gn-modal-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                <h3 className="gn-modal-title">Confirm Attendance</h3>
                <p className="gn-modal-sub">For {brideName} & {groomName}&apos;s Celebration</p>
              </div>

              {isSubmitted ? (
                <div className="gn-success-msg text-center">
                  <CheckCircle size={48} className="text-[#D4849A] mb-3 mx-auto" weight="fill" />
                  <h4 className="text-lg font-serif text-[#D4849A]">JazakAllah Khair!</h4>
                  <p className="text-xs text-[#FCE7F3] mt-1 leading-relaxed">
                    Thank you, <strong>{rsvpName || "Dear Guest"}</strong>! Your RSVP and sacred duas have been received with immense gratitude. <br className="hidden sm:inline" />
                    <span className="italic block mt-1 text-[#FADEB8] font-medium">Aapki duayein hamari nayi zindagi ke aaghaaz mein barkat ka sabab banengi.</span>
                  </p>

                  <div className="mt-4 pt-3 border-t border-[rgba(212,132,154,0.2)]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRsvpOpen(false);
                        setIsSubmitted(false);
                      }}
                      className="w-full py-2.5 bg-[#D4849A] hover:bg-[#c37389] text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="gn-rsvp-form">
                  <div className="gn-form-group">
                    <label className="gn-label">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq & Family"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="gn-input"
                    />
                  </div>

                  <div className="gn-form-group">
                    <label className="gn-label">Will you be attending?</label>
                    <div className="gn-radio-group">
                      <button
                        type="button"
                        className={`gn-radio-btn ${rsvpAttending === "yes" ? "active" : ""}`}
                        onClick={() => setRsvpAttending("yes")}
                      >
                        Joyfully Accept
                      </button>
                      <button
                        type="button"
                        className={`gn-radio-btn ${rsvpAttending === "no" ? "active" : ""}`}
                        onClick={() => setRsvpAttending("no")}
                      >
                        Regretfully Decline
                      </button>
                    </div>
                  </div>

                  {rsvpAttending === "yes" && (
                    <div className="gn-form-group">
                      <label className="gn-label">Number of Guests Attending</label>
                      <select
                        value={rsvpGuests}
                        onChange={(e) => setRsvpGuests(e.target.value)}
                        className="gn-select"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="5+">5+ Persons (Family)</option>
                      </select>
                    </div>
                  )}

                  <div className="gn-form-group">
                    <label className="gn-label">Your Blessings / Dua for the Couple</label>
                    <textarea
                      rows={3}
                      placeholder="May Allah bless your lives together with love, joy, and peace..."
                      value={rsvpDua}
                      onChange={(e) => setRsvpDua(e.target.value)}
                      className="gn-textarea"
                    />
                  </div>

                  <button type="submit" className="gn-submit-btn">
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
