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

interface EmeraldQasrProps {
  data?: any;
}

export default function EmeraldQasr({ data }: EmeraldQasrProps) {
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
            particleCount: 75,
            spread: 80,
            origin: { y: 0.55 },
            colors: ["#D4AF37", "#F5E5A3", "#10B981", "#FFFDF8"],
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
  const brideName = data?.brideName || data?.couple?.brideName || resolvedData.couple?.brideName || "Zoya";
  const groomName = data?.groomName || data?.couple?.groomName || resolvedData.couple?.groomName || "Farhan";
  const brideParents = data?.brideParents || data?.couple?.brideParents || resolvedData.couple?.brideParents || "Mr. & Mrs. Tariq Anwar Khan";
  const groomParents = data?.groomParents || data?.couple?.groomParents || resolvedData.couple?.groomParents || "Mr. & Mrs. Imran Ahmed Qureshi";
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
    : "September 18";
  const revealDayName = !isNaN(weddingDate.getTime())
    ? weddingDate.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" })
    : "Friday";
  const revealYearStr = !isNaN(weddingDate.getTime())
    ? weddingDate.getFullYear().toString()
    : "2026";

  const venueName = data?.venueName || data?.venue?.name || resolvedData.venue?.name || "The Emerald Palace Estate";
  const venueAddress = data?.venueAddress || data?.venue?.address || resolvedData.venue?.address || "Corniche Road, West Bay, Abu Dhabi";
  const venueMapUrl = data?.venueMapUrl || data?.venue?.mapUrl || resolvedData.venue?.mapUrl;
  const islamicDate = data?.islamicDate || resolvedData.islamicDate || "07 Sha'ban 1448 AH";

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
        "/templates/emerald-qasr/poster.png",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
      ];
  const galleryPhotos: string[] = rawGallery
    .map((item: any) => (typeof item === "string" ? item : item?.url || item?.src || ""))
    .filter(Boolean);

  const galleryCaptions = resolvedData.galleryCaptions || [
    { title: "Ottoman Emerald Palace", subtitle: "Grandeur & Grace" },
    { title: "Sacred Nikahnama", subtitle: "Blessed by Divine Grace" },
    { title: "Courtyard of Whispers", subtitle: "Moments of Serenity" },
    { title: "Starlight Banquet", subtitle: "Celebration with Loved Ones" },
    { title: "Golden Filigree Arch", subtitle: "A Royal Heritage" },
  ];

  const events: EventItem[] = (data?.events || data?.eventsJson || resolvedData.events || []).filter((e: any) => e.enabled !== false);

  const hashtag = data?.hashtag || resolvedData.hashtag || `#${brideName}Weds${groomName}`;
  const storyMessage = data?.storyMessage || resolvedData.storyMessage || "Under the serene starlight of Abu Dhabi, amidst the fragrant amber and emerald arches, two souls found tranquility in one another. With the blessings of our beloved elders, we begin our sacred eternal covenant of Nikah.";

  // Deterministic falling gold petals (Royal Lotus Parallax Engine)
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
  const [timeLeft, setTimeLeft] = useState({ days: 148, hours: 16, minutes: 22, seconds: 40 });
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
          console.log("Video play prevented:", err);
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
        colors: ["#D4AF37", "#10B981", "#F59E0B", "#FDFBF7"],
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

  return (
    <div className="emerald-qasr-root">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src={resolvedData.audioTrack || "/audio/wedding-ambience.mp3"}
        loop
        preload="auto"
        onPlay={() => setIsPlayingMusic(true)}
        onPause={() => setIsPlayingMusic(false)}
      />

      {/* Royal Unlock Golden Flash Burst Overlay */}
      {isFlashing && <div className="eq-unlock-flash-overlay" aria-hidden="true" />}

      {/* Ambient Floating Gold Dust Particles */}
      <div className="eq-floating-particles" aria-hidden="true">
        <span className="eq-particle p1"></span>
        <span className="eq-particle p2"></span>
        <span className="eq-particle p3"></span>
        <span className="eq-particle p4"></span>
        <span className="eq-particle p5"></span>
        <span className="eq-particle p6"></span>
      </div>

      {/* Ambient Falling Golden Petals (Royal Lotus Parallax Engine) */}
      <div className="eq-petals-field" aria-hidden="true">
        {petals.map((p) => (
          <span
            key={p.id}
            className="eq-petal"
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

      {/* Floating Music Button with Dynamic Soundwave */}
      <motion.button
        className="eq-music-toggle"
        onClick={toggleMusic}
        aria-label={isPlayingMusic ? "Mute soundtrack" : "Play soundtrack"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {isPlayingMusic ? (
          <>
            <SpeakerHigh size={18} weight="fill" />
            <span className="eq-soundwave-bars">
              <span className="eq-bar bar-1"></span>
              <span className="eq-bar bar-2"></span>
              <span className="eq-bar bar-3"></span>
            </span>
          </>
        ) : (
          <SpeakerSlash size={18} weight="fill" />
        )}
      </motion.button>

      {/* Main Luxury Container */}
      <div className="eq-viewport-shell">
        {/* Top Sacred Arch Header */}
        <motion.header
          className="eq-header-arch eq-floating-element"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className="eq-arch-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <div className="eq-arch-tag">THE ROYAL OTTOMAN NIKAH CELEBRATION · EMERALD QASR</div>
        </motion.header>

        {/* ── Grand Envelope Hero Stage (Centered on All Screen Sizes) ── */}
        <section className="eq-hero-stage-container">
          {/* Flanking Royal Hanging Lanterns & Floating Star Medallions */}
          <div className="eq-hero-floating-elements" aria-hidden="true">
            {/* Left Hanging Ottoman Lantern */}
            <div className="eq-floating-lantern eq-lantern-left">
              <div className="eq-lantern-chain" />
              <div className="eq-lantern-body">
                <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="eq-lantern-svg">
                  <circle cx="24" cy="6" r="4" stroke="#F5E5A3" strokeWidth="1.5" />
                  <path d="M16 12C16 12 20 8 24 8C28 8 32 12 32 12L36 18H12L16 12Z" fill="url(#eqLanternGold)" />
                  <path d="M12 18L16 52H32L36 18H12Z" fill="rgba(212, 175, 55, 0.15)" stroke="#D4AF37" strokeWidth="1.2" />
                  <path d="M24 18V52M18 20C18 36 24 48 24 48C24 48 30 36 30 20" stroke="#F5E5A3" strokeWidth="0.8" opacity="0.8" />
                  <circle cx="24" cy="36" r="4" fill="#FFE082" className="eq-lantern-flame" />
                  <path d="M16 52L24 64L32 52H16Z" fill="url(#eqLanternGold)" />
                  <circle cx="24" cy="68" r="2" fill="#D4AF37" />
                  <defs>
                    <linearGradient id="eqLanternGold" x1="12" y1="8" x2="36" y2="64" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F5E5A3" />
                      <stop offset="0.5" stopColor="#D4AF37" />
                      <stop offset="1" stopColor="#8A661C" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="eq-lantern-light-glow" />
              </div>
            </div>

            {/* Right Hanging Ottoman Lantern */}
            <div className="eq-floating-lantern eq-lantern-right">
              <div className="eq-lantern-chain" />
              <div className="eq-lantern-body">
                <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="eq-lantern-svg">
                  <circle cx="24" cy="6" r="4" stroke="#F5E5A3" strokeWidth="1.5" />
                  <path d="M16 12C16 12 20 8 24 8C28 8 32 12 32 12L36 18H12L16 12Z" fill="url(#eqLanternGoldR)" />
                  <path d="M12 18L16 52H32L36 18H12Z" fill="rgba(212, 175, 55, 0.15)" stroke="#D4AF37" strokeWidth="1.2" />
                  <path d="M24 18V52M18 20C18 36 24 48 24 48C24 48 30 36 30 20" stroke="#F5E5A3" strokeWidth="0.8" opacity="0.8" />
                  <circle cx="24" cy="36" r="4" fill="#FFE082" className="eq-lantern-flame" />
                  <path d="M16 52L24 64L32 52H16Z" fill="url(#eqLanternGoldR)" />
                  <circle cx="24" cy="68" r="2" fill="#D4AF37" />
                  <defs>
                    <linearGradient id="eqLanternGoldR" x1="12" y1="8" x2="36" y2="64" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F5E5A3" />
                      <stop offset="0.5" stopColor="#D4AF37" />
                      <stop offset="1" stopColor="#8A661C" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="eq-lantern-light-glow" />
              </div>
            </div>

            {/* Floating Celestial Starbursts & Geometry Motifs */}
            <div className="eq-floating-medallion star-1">
              <Sparkle size={20} weight="fill" />
            </div>
            <div className="eq-floating-medallion star-2">
              <Star size={16} weight="fill" />
            </div>
            <div className="eq-floating-medallion star-3">
              <Sparkle size={22} weight="fill" />
            </div>
            <div className="eq-floating-medallion star-4">
              <Star size={18} weight="fill" />
            </div>
          </div>

          <div className="eq-video-hero-wrapper">
            <div
              className={`eq-video-card ${videoOpened ? "eq-card-revealed" : ""}`}
              onClick={!isPlayingVideo ? handleOpenInvitation : undefined}
            >
              {/* Desktop Specific High-Resolution 16:9 Envelope Preview */}
              <img
                src={resolvedData.videoOpening?.desktopPosterUrl || "/templates/emerald-qasr/envelope-desktop.jpg"}
                alt="Emerald Ottoman Wedding Envelope"
                className="eq-desktop-envelope-preview"
              />

              {/* The Mobile Video Element */}
              <video
                ref={videoRef}
                src={resolvedData.videoOpening.videoUrl}
                playsInline
                webkit-playsinline="true"
                muted={false}
                preload="auto"
                className="eq-main-video"
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
                <div className={`eq-seal-monogram-anchor ${isPlayingVideo ? "eq-seal-lifting" : ""}`}>
                  <div className="eq-wax-initials-ring">
                    <span className="eq-wax-initials">
                      {brideName[0]}&amp;{groomName[0]}
                    </span>
                  </div>
                </div>
              )}

              {/* Tap to Open Prompt Ribbon (Mobile Only) */}
              {!isPlayingVideo && !isDesktop && (
                <div className="eq-tap-prompt-ribbon">
                  <Sparkle size={11} className="text-[#D4AF37]" weight="fill" />
                  <span>TAP TO UNVEIL INVITATION</span>
                  <Sparkle size={11} className="text-[#D4AF37]" weight="fill" />
                </div>
              )}

              {/* Seamless Paper Print Overlay directly filling the Card */}
              <AnimatePresence>
                {(videoOpened || isDesktop) && (
                  <motion.div
                    className="eq-blank-card-overlay"
                    variants={inkContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="eq-paper-print-content">
                      {/* Top Sacred Header */}
                      <motion.div className="eq-print-header-group" variants={inkItemVariants}>
                        <div className="eq-print-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                        <p className="eq-print-honor">TOGETHER WITH THEIR FAMILIES</p>
                      </motion.div>

                      {/* Grand Couple Presentation */}
                      <motion.div className="eq-print-couple-group" variants={inkItemVariants}>
                        <h1 className="eq-print-couple-names">
                          <span className="eq-couple-bride">{brideName}</span>
                          <span className="eq-print-amp">&amp;</span>
                          <span className="eq-couple-groom">{groomName}</span>
                        </h1>
                        <p className="eq-print-subtext">
                          Request the honour of your esteemed presence &amp; blessings at their Nikah celebration
                        </p>
                      </motion.div>

                      {/* Auspicious Ceremony Timings & Venue Details */}
                      <motion.div className="eq-print-details-group" variants={inkItemVariants}>
                        <div className="eq-print-date-badge">
                          <CalendarBlank size={13} className="text-[#8A661C]" weight="fill" />
                          <span>{formattedDate}</span>
                        </div>

                        <div className="eq-print-venue-badge">
                          <MapPin size={12} className="text-[#8A661C]" weight="fill" />
                          <span>{venueName}, {resolvedData.venue?.city || "Abu Dhabi"}</span>
                        </div>

                        <div className="eq-print-time-text">
                          <Clock size={12} className="text-[#8A661C]" weight="fill" />
                          <span>Nikah: 4:30 PM &nbsp;•&nbsp; Walima: 7:30 PM</span>
                        </div>
                      </motion.div>

                      {/* Envelope Center Action Controls */}
                      <motion.div
                        className="eq-envelope-actions-bar"
                        variants={inkItemVariants}
                      >
                        <button
                          className="eq-print-btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsRsvpOpen(true);
                          }}
                        >
                          <EnvelopeSimpleOpen size={14} weight="bold" />
                          <span>RSVP</span>
                        </button>

                        <button
                          className="eq-print-btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToSection("eq-events-section");
                          }}
                        >
                          <Clock size={14} weight="bold" />
                          <span>Itinerary</span>
                        </button>

                        {!isDesktop && (
                          <button
                            className="eq-print-btn-replay"
                            onClick={handleReplay}
                            title="Replay Envelope Opening"
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

        {/* Scroll Cue Indicator */}
        {isUnlocked && (
          <motion.div
            className="eq-scroll-cue"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => scrollToSection("eq-quran-section")}
          >
            <span>Scroll to explore ceremonies, gallery & venue</span>
            <div className="eq-scroll-chevron">↓</div>
          </motion.div>
        )}

        {/* ── Optional Custom Hero / Couple Portrait Banner (if uploaded by user) ── */}
        {isUnlocked && heroImageSrc && (
          <motion.div
            className="eq-custom-hero-banner"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="eq-custom-hero-frame">
              <img src={heroImageSrc} alt={`${brideName} & ${groomName}`} className="eq-custom-hero-img" />
              <div className="eq-custom-hero-gradient" />
              <div className="eq-custom-hero-badge">
                <span className="eq-custom-hero-tag">ROYAL OTTOMAN COUPLE</span>
                <span className="eq-custom-hero-names">{brideName} & {groomName}</span>
                <p className="eq-custom-hero-sub">United in Faith, Love, and Eternal Grace</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Unlocked Royal Content Flow (Multi-Column Desktop Architecture) ── */}
        <AnimatePresence>
          {isUnlocked && (
            <motion.div
              className="eq-unlocked-flow"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              {/* ── 1. Quranic Verse Section (Wide Illuminated Parchment) ── */}
              <motion.section
                id="eq-quran-section"
                className="eq-section eq-quran-card"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="eq-quran-glow-backdrop"></div>
                <div className="eq-section-corner-ornament top-left" aria-hidden="true" />
                <div className="eq-section-corner-ornament top-right" aria-hidden="true" />
                <div className="eq-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="eq-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="eq-quran-filigree">✦ ⚜ ✦</div>
                <p className="eq-arabic-verse">{resolvedData.verse?.arabic || "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"}</p>
                <p className="eq-verse-translation">&ldquo;{resolvedData.verse?.translation || "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy."}&rdquo;</p>
                <p className="eq-verse-ref">{resolvedData.verse?.reference || "Surah Ar-Rum · 30:21"}</p>

                {/* Prophetic Dua Banner */}
                <div className="eq-prophetic-dua-wrap mt-5 pt-4 border-t border-[rgba(212,175,55,0.25)] text-center">
                  <p className="font-serif text-base sm:text-xl text-[#F5E5A3] leading-relaxed tracking-wide font-medium">
                    بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
                  </p>
                  <p className="text-[11px] sm:text-xs text-emerald-200/85 italic mt-1 max-w-md mx-auto">
                    &ldquo;May Allah bless you, shower His blessings upon you, and unite you both in goodness and eternal love.&rdquo;
                  </p>
                </div>
              </motion.section>

              {/* ── 1A. Elders' & Parents' Blessing Invitation Card ── */}
              <motion.section
                className="eq-section eq-elders-blessing-card text-center"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="eq-section-corner-ornament top-left" aria-hidden="true" />
                <div className="eq-section-corner-ornament top-right" aria-hidden="true" />
                <div className="eq-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="eq-section-corner-ornament bottom-right" aria-hidden="true" />
                <span className="eq-section-subtitle">WITH THE BLESSINGS OF OUR ELDERS</span>
                <h2 className="eq-section-title">Royal Nikah Invitation</h2>
                <div className="eq-section-ornament">✦ ⚜ ✦</div>
                <p className="eq-couple-story-text max-w-xl mx-auto leading-relaxed">
                  With the divine grace of <strong>Almighty Allah (SWT)</strong> and the heartfelt prayers of our beloved parents and elders:
                </p>
                <div className="my-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm sm:text-base font-serif font-bold text-[#F5E5A3]">
                  <span className="tracking-wide">{brideParents}</span>
                  <span className="text-[#D4AF37] font-sans font-normal opacity-70 text-xs">❖ &amp; ❖</span>
                  <span className="tracking-wide">{groomParents}</span>
                </div>
                <p className="eq-couple-story-text max-w-xl mx-auto text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  cordially request the honour of your gracious presence, prayers, and blessings to celebrate the auspicious Nikah union of their beloved children:
                </p>
                <p className="font-serif text-xl sm:text-3xl font-bold text-[#F5E5A3] mt-3 tracking-wide">
                  {brideName} <span className="text-[#D4AF37] font-normal">&amp;</span> {groomName}
                </p>
                <p className="text-xs sm:text-sm text-[#F5E5A3] italic mt-3 font-medium opacity-90">
                  &ldquo;Aapki pur-khuloos shirkat aur duayein hamari khushiyon ko dobala karengi.&rdquo;
                </p>
              </motion.section>

              {/* ── 1B. Meet the Couple ("The Royal Covenant of Two Souls") ── */}
              <motion.section
                className="eq-section eq-couple-story-box"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="eq-section-corner-ornament top-left" aria-hidden="true" />
                <div className="eq-section-corner-ornament top-right" aria-hidden="true" />
                <div className="eq-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="eq-section-corner-ornament bottom-right" aria-hidden="true" />
                <span className="eq-section-subtitle">THE STORY OF TWO SOULS</span>
                <h2 className="eq-section-title">Meet the Couple</h2>
                <div className="eq-section-ornament">✦ ⚜ ✦</div>
                <p className="eq-couple-story-text">
                  {storyMessage}
                </p>
                <span className="eq-couple-hashtag">{hashtag}</span>
              </motion.section>

              {/* ── 2. Live Countdown & Scratch-to-Reveal (Desktop 2-Column Split Row) ── */}
              <div className="eq-grid-2col-row">
                {/* 2A. Live Countdown Box */}
                <motion.section
                  className="eq-section eq-countdown-box"
                  initial={{ opacity: 0, x: -35, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                >
                  <div className="eq-section-corner-ornament top-left" aria-hidden="true" />
                  <div className="eq-section-corner-ornament top-right" aria-hidden="true" />
                  <div className="eq-section-corner-ornament bottom-left" aria-hidden="true" />
                  <div className="eq-section-corner-ornament bottom-right" aria-hidden="true" />
                  <span className="eq-section-subtitle">COUNTING THE BLESSED DAYS</span>
                  <h2 className="eq-section-title">Until The Grand Union</h2>
                  <div className="eq-countdown-grid">
                    {[
                      { val: timeLeft.days, lbl: "Days" },
                      { val: timeLeft.hours, lbl: "Hours" },
                      { val: timeLeft.minutes, lbl: "Mins" },
                      { val: timeLeft.seconds, lbl: "Secs" },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        className="eq-countdown-cell"
                        initial={{ opacity: 0, scale: 0.85, y: 15 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        whileHover={{ y: -4, scale: 1.05 }}
                      >
                        <span className="eq-time-val">{item.val}</span>
                        <span className="eq-time-lbl">{item.lbl}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="eq-hijri-pill">
                    <Compass size={14} className="text-[#D4AF37]" weight="fill" />
                    <span>Islamic Date: {islamicDate}</span>
                  </div>
                </motion.section>

                {/* 2B. Interactive Scratch Card Box */}
                <motion.section
                  className="eq-section eq-scratch-box"
                  initial={{ opacity: 0, x: 35, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                >
                  <div className="eq-section-corner-ornament top-left" aria-hidden="true" />
                  <div className="eq-section-corner-ornament top-right" aria-hidden="true" />
                  <div className="eq-section-corner-ornament bottom-left" aria-hidden="true" />
                  <div className="eq-section-corner-ornament bottom-right" aria-hidden="true" />
                  <span className="eq-section-subtitle">INTERACTIVE CEREMONY UNVEIL</span>
                  <h2 className="eq-section-title">Scratch Gold Foil</h2>
                  <p className="eq-scratch-desc">Swipe across the 24K gold foil to reveal our auspicious Nikah date</p>
                  <div className="eq-scratch-card-wrapper">
                    <ScratchCard
                      revealDate={revealMonthDay}
                      revealDay={revealDayName}
                      revealYear={revealYearStr}
                      islamicDate={islamicDate}
                      theme="gold"
                      onRevealComplete={() => {
                        try {
                          confetti({
                            particleCount: 75,
                            spread: 80,
                            origin: { y: 0.7 },
                            colors: ["#D4AF37", "#10B981", "#F5E5A3", "#FFFFFF"],
                          });
                        } catch (_) {}
                      }}
                    />
                  </div>
                </motion.section>
              </div>

              {/* ── 3. Wedding Ceremonies & Itinerary (Desktop 3-Column Architectural Cards) ── */}
              <motion.section
                id="eq-events-section"
                className="eq-section eq-events-wrapper"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="eq-section-corner-ornament top-left" aria-hidden="true" />
                <div className="eq-section-corner-ornament top-right" aria-hidden="true" />
                <div className="eq-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="eq-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="text-center mb-6">
                  <span className="eq-section-subtitle">CEREMONIES & FESTIVITIES</span>
                  <h2 className="eq-section-title">Palace Itinerary</h2>
                  <div className="eq-section-ornament">✦ ⚜ ✦</div>
                </div>

                <div className="eq-events-list">
                  {events.map((evt, idx) => (
                    <motion.div
                      key={idx}
                      className="eq-event-card"
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.6, delay: idx * 0.12 }}
                      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
                    >
                      <div className="eq-event-card-header">
                        <span className="eq-event-num">0{idx + 1}</span>
                        <div className="eq-event-header-titles">
                          <span className="eq-event-phase">PHASE 0{idx + 1}</span>
                          <h3 className="eq-event-name">{evt.name}</h3>
                        </div>
                      </div>

                      <div className="eq-event-details">
                        <div className="eq-event-row">
                          <CalendarBlank size={16} className="text-[#D4AF37] shrink-0" weight="fill" />
                          <span>{evt.date}</span>
                        </div>
                        <div className="eq-event-row">
                          <Clock size={16} className="text-[#D4AF37] shrink-0" weight="fill" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="eq-event-row">
                          <MapPin size={16} className="text-[#D4AF37] shrink-0" weight="fill" />
                          <span>{evt.venue} — {evt.location}</span>
                        </div>
                      </div>

                      {evt.dressCode && (
                        <div className="eq-dress-pill">
                          <Sparkle size={12} className="text-[#D4AF37]" weight="fill" />
                          <span>Dress Code: {evt.dressCode}</span>
                        </div>
                      )}

                      {evt.description && (
                        <p className="eq-event-desc">{evt.description}</p>
                      )}

                      <div className="eq-event-card-footer">
                        <a
                          href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent((evt.venue || venueName) + " " + (evt.location || venueAddress))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="eq-event-map-link"
                        >
                          <span>Directions & Location</span>
                          <ArrowSquareOut size={13} weight="bold" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* ── 4. Curated Photo Gallery Section (Bento Mosaic & Panoramic Slider) ── */}
              {galleryPhotos.length > 0 && (
                <motion.section
                  className="eq-section eq-gallery-section"
                  initial={{ opacity: 0, y: 45, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="eq-section-corner-ornament top-left" aria-hidden="true" />
                  <div className="eq-section-corner-ornament top-right" aria-hidden="true" />
                  <div className="eq-section-corner-ornament bottom-left" aria-hidden="true" />
                  <div className="eq-section-corner-ornament bottom-right" aria-hidden="true" />
                  <div className="text-center mb-6">
                    <span className="eq-section-subtitle">CHERISHED MOMENTS</span>
                    <h2 className="eq-section-title">Emerald & 24K Gold Gallery</h2>
                    <div className="eq-section-ornament">✦ ⚜ ✦</div>

                    {/* Mode Selector Toggle */}
                    <div className="eq-gallery-mode-toggle">
                      <button
                        className={`eq-toggle-btn ${galleryMode === "bento" ? "active" : ""}`}
                        onClick={() => setGalleryMode("bento")}
                        aria-label="Switch to Bento Mosaic grid"
                      >
                        <SquaresFour size={16} weight="fill" />
                        <span>Bento Mosaic</span>
                      </button>
                      <button
                        className={`eq-toggle-btn ${galleryMode === "slider" ? "active" : ""}`}
                        onClick={() => setGalleryMode("slider")}
                        aria-label="Switch to Cinematic Slider"
                      >
                        <FilmStrip size={16} weight="fill" />
                        <span>Cinematic Slider</span>
                      </button>
                    </div>
                  </div>

                  {/* Bento Mosaic Grid */}
                  {galleryMode === "bento" && (
                    <motion.div
                      className="eq-bento-grid"
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
                            className={`eq-bento-card ${isFeatured ? "eq-bento-featured" : ""} ${isWide ? "eq-bento-wide" : ""}`}
                            onClick={() => setSelectedPhoto(imgUrl)}
                            whileHover={{ scale: 1.03, y: -6 }}
                            transition={{ duration: 0.3 }}
                          >
                            <img src={imgUrl} alt={meta?.title || `Gallery Photo ${i + 1}`} className="eq-bento-img" loading="lazy" />
                            <div className="eq-bento-overlay">
                              <div className="eq-bento-meta">
                                <span className="eq-bento-title">{meta?.title || `${brideName} & ${groomName}`}</span>
                                <span className="eq-bento-sub">{meta?.subtitle || "Sacred Memories"}</span>
                              </div>
                              <span className="eq-bento-zoom-icon">
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
                      className="eq-slider-stage"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="eq-slider-viewport">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeSlide}
                            className="eq-slide-item"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.04 }}
                            transition={{ duration: 0.55, ease: "easeOut" }}
                            onClick={() => setSelectedPhoto(galleryPhotos[activeSlide])}
                          >
                            <img
                              src={galleryPhotos[activeSlide]}
                              alt={`Wedding gallery slide ${activeSlide + 1}`}
                              className="eq-slider-img"
                            />
                            <div className="eq-slider-overlay-caption">
                              <span className="eq-slider-caption-title">
                                {galleryCaptions[activeSlide % galleryCaptions.length]?.title || `${brideName} & ${groomName}`}
                              </span>
                              <span className="eq-slider-caption-sub">
                                {galleryCaptions[activeSlide % galleryCaptions.length]?.subtitle || "Cherished Moments"}
                              </span>
                            </div>
                          </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        {galleryPhotos.length > 1 && (
                          <>
                            <button
                              className="eq-slider-nav-btn prev"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSlide((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
                              }}
                              aria-label="Previous slide"
                            >
                              <CaretLeft size={20} weight="bold" />
                            </button>
                            <button
                              className="eq-slider-nav-btn next"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSlide((prev) => (prev + 1) % galleryPhotos.length);
                              }}
                              aria-label="Next slide"
                            >
                              <CaretRight size={20} weight="bold" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Pagination Dots & Slide Counter */}
                      {galleryPhotos.length > 1 && (
                        <div className="eq-slider-controls">
                          <div className="eq-slider-dots">
                            {galleryPhotos.map((_, dotIdx) => (
                              <button
                                key={dotIdx}
                                className={`eq-slider-dot ${dotIdx === activeSlide ? "active" : ""}`}
                                onClick={() => setActiveSlide(dotIdx)}
                                aria-label={`Go to slide ${dotIdx + 1}`}
                              />
                            ))}
                          </div>
                          <span className="eq-slider-counter">
                            {activeSlide + 1} / {galleryPhotos.length}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.section>
              )}

              {/* ── 4B. Guest Essentials ("Things to Know") ── */}
              <motion.section
                className="eq-section eq-essentials-section"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="eq-section-corner-ornament top-left" aria-hidden="true" />
                <div className="eq-section-corner-ornament top-right" aria-hidden="true" />
                <div className="eq-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="eq-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="text-center mb-6">
                  <span className="eq-section-subtitle">GUEST ESSENTIALS</span>
                  <h2 className="eq-section-title">Things to Know</h2>
                  <div className="eq-section-ornament">✦ ⚜ ✦</div>
                  <p className="text-xs text-[#B8CCC5] max-w-md mx-auto mt-2">
                    Thoughtful arrangements to ensure your celebration at The Emerald Palace is effortless and memorable.
                  </p>
                </div>

                <div className="eq-essentials-grid">
                  {[
                    {
                      title: "Dress Code",
                      desc: data?.dressCodeText || "Regal Modest Formal / Sherwanis & Embroidered Lehengas in Emerald & Gold hues.",
                      icon: <Sparkle size={24} weight="fill" />,
                    },
                    {
                      title: "Palace Valet & Parking",
                      desc: data?.transportText || "Complimentary imperial valet service at the Grand Arch entrance with dedicated airport shuttles.",
                      icon: <Compass size={24} weight="fill" />,
                    },
                    {
                      title: "Palace Guest Guide & Stay",
                      desc: "Curated royal suites reserved at The Emerald Palace. Please contact our hospitality team for bookings.",
                      icon: <MapPin size={24} weight="fill" />,
                    },
                    {
                      title: "Royal Celebration Hashtag",
                      desc: `Capture your blessed memories and tag your photos with ${hashtag}.`,
                      icon: <Star size={24} weight="fill" />,
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={item.title}
                      className="eq-essentials-card"
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.12 }}
                      whileHover={{ y: -8, transition: { duration: 0.25 } }}
                    >
                      <div className="eq-essentials-icon-frame">
                        {item.icon}
                      </div>
                      <h3 className="eq-essentials-card-title">{item.title}</h3>
                      <div className="eq-essentials-rule" />
                      <p className="eq-essentials-card-desc">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* ── 5. Venue & Location Destination (Desktop 2-Column Split Row) ── */}
              <motion.section
                className="eq-section eq-venue-section"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="eq-section-corner-ornament top-left" aria-hidden="true" />
                <div className="eq-section-corner-ornament top-right" aria-hidden="true" />
                <div className="eq-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="eq-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="eq-venue-split-grid">
                  <div className="eq-venue-info-card">
                    <span className="eq-section-subtitle">THE SACRED DESTINATION</span>
                    <h2 className="eq-section-title text-left">{venueName}</h2>
                    <p className="eq-venue-addr">{venueAddress}</p>
                    <p className="eq-venue-notes">
                      Valet parking and imperial greeting reception will be arranged at the Grand Arch entrance. Guests are warmly requested to arrive 15 minutes prior to Nikah solemnization.
                    </p>

                    <motion.a
                      href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(venueName + " " + venueAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="eq-map-cta-btn"
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <MapPin size={18} weight="bold" />
                      <span>Open in Google Maps</span>
                      <ArrowSquareOut size={16} weight="bold" />
                    </motion.a>
                  </div>

                  <div className="eq-venue-visual-card">
                    <div className="eq-venue-visual-frame">
                      <img
                        src="/templates/emerald-qasr/poster.png"
                        alt={venueName}
                        className="eq-venue-visual-img"
                      />
                      <div className="eq-venue-visual-overlay">
                        <div className="eq-venue-badge-pill">
                          <Compass size={14} className="text-[#D4AF37]" weight="fill" />
                          <span>{data?.venueCity || data?.venue?.city || resolvedData.venue?.city || "Hyderabad, India"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* ── 6. RSVP CTA Pedestal Banner ── */}
              <motion.section
                className="eq-section eq-rsvp-banner"
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="eq-section-corner-ornament top-left" aria-hidden="true" />
                <div className="eq-section-corner-ornament top-right" aria-hidden="true" />
                <div className="eq-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="eq-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="eq-rsvp-inner">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Heart size={44} className="text-[#D4AF37] mb-2" weight="fill" />
                  </motion.div>
                  <h2 className="eq-rsvp-title">Your Presence is Our Honour</h2>
                  <p className="eq-rsvp-sub">
                    Please honor us with your confirmed attendance and blessed prayers as we embark on this sacred journey of marriage.
                  </p>
                  <motion.button
                    className="eq-rsvp-open-btn"
                    onClick={() => setIsRsvpOpen(true)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>Confirm Your RSVP</span>
                    <Sparkle size={18} weight="fill" />
                  </motion.button>
                </div>
              </motion.section>

              {/* ── 7. Footer ── */}
              <motion.footer
                className="eq-footer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0 }}
              >
                <div className="eq-footer-monogram">
                  {brideName[0]}&{groomName[0]}
                </div>
                <h3 className="eq-footer-names">{brideName} & {groomName}</h3>
                <p className="eq-footer-quote">
                  United in Sacred Covenant · Guided by Divine Mercy · Insha&apos;Allah Forever
                </p>

                {/* ── Marketing Content At End of Template Footer ── */}
                <div className="mt-8 text-left">
                  <TemplateMarketingFooter
                    templateId="emerald-qasr"
                    templateName="Emerald Qasr"
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
            className="eq-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="eq-lightbox-card"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="eq-lightbox-close"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photo preview"
              >
                <X size={20} weight="bold" />
              </button>
              <img src={selectedPhoto} alt="Zoomed wedding moment" className="eq-lightbox-img" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RSVP Modal ── */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="eq-modal-overlay">
            <motion.div
              className="eq-modal-container"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <button
                className="eq-modal-close"
                onClick={() => setIsRsvpOpen(false)}
              >
                <X size={18} />
              </button>

              <div className="eq-modal-header">
                <div className="eq-modal-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                <h3 className="eq-modal-title">Confirm Attendance</h3>
                <p className="eq-modal-sub">For {brideName} & {groomName}&apos;s Royal Celebration</p>
              </div>

              {isSubmitted ? (
                <div className="eq-success-msg text-center">
                  <CheckCircle size={48} className="text-[#D4AF37] mb-3 mx-auto" weight="fill" />
                  <h4 className="text-lg font-serif text-[#D4AF37]">JazakAllah Khair!</h4>
                  <p className="text-xs text-[#F5E5A3] mt-1 leading-relaxed">
                    Thank you, <strong>{rsvpName || "Dear Guest"}</strong>! Your RSVP and sacred duas have been received with immense gratitude. <br className="hidden sm:inline" />
                    <span className="italic block mt-1 text-[#F5E5A3]/90 font-medium">Aapki duayein hamari nayi zindagi ke aaghaaz mein barkat ka sabab banengi.</span>
                  </p>

                  <div className="mt-4 pt-3 border-t border-[rgba(212,175,55,0.2)]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRsvpOpen(false);
                        setIsSubmitted(false);
                      }}
                      className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#061A14] font-bold text-xs rounded-xl uppercase tracking-wider transition-all"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="eq-rsvp-form">
                  <div className="eq-form-group">
                    <label className="eq-label">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Farooq & Family"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="eq-input"
                    />
                  </div>

                  <div className="eq-form-group">
                    <label className="eq-label">Will you be attending?</label>
                    <div className="eq-radio-group">
                      <button
                        type="button"
                        className={`eq-radio-btn ${rsvpAttending === "yes" ? "active" : ""}`}
                        onClick={() => setRsvpAttending("yes")}
                      >
                        Joyfully Accept
                      </button>
                      <button
                        type="button"
                        className={`eq-radio-btn ${rsvpAttending === "no" ? "active" : ""}`}
                        onClick={() => setRsvpAttending("no")}
                      >
                        Regretfully Decline
                      </button>
                    </div>
                  </div>

                  {rsvpAttending === "yes" && (
                    <div className="eq-form-group">
                      <label className="eq-label">Number of Guests Attending</label>
                      <select
                        value={rsvpGuests}
                        onChange={(e) => setRsvpGuests(e.target.value)}
                        className="eq-select"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="5+">5+ Persons (Family)</option>
                      </select>
                    </div>
                  )}

                  <div className="eq-form-group">
                    <label className="eq-label">Your Blessings / Dua for the Couple</label>
                    <textarea
                      rows={3}
                      placeholder="May Allah bless this union with love, mercy, and harmony..."
                      value={rsvpDua}
                      onChange={(e) => setRsvpDua(e.target.value)}
                      className="eq-textarea"
                    />
                  </div>

                  <button type="submit" className="eq-submit-btn">
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
