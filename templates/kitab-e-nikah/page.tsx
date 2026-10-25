"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
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

interface KitabENikahProps {
  data?: any;
}

export default function KitabENikah({ data }: KitabENikahProps) {
  const resolvedData = { ...defaultData, ...data };

  // Video & Playback State
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoOpened, setVideoOpened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isHeroRevealed, setIsHeroRevealed] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  // Gallery state: mode, slide index, lightbox
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
        setIsHeroRevealed(true);
        setIsUnlocked(true);
        setVideoOpened(true);
      }
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const { scrollY } = useScroll();
  const yHeroBg = useTransform(scrollY, [0, 600], [0, 70]);
  const yParticles = useTransform(scrollY, [0, 800], [0, -100]);

  // Immediate Flash celebration & transition into permanent royal hero on mobile
  const triggerGateOpeningReveal = () => {
    if (isHeroRevealed) return;
    if (!isDesktop) {
      setIsFlashing(true);
      try {
        confetti({
          particleCount: 95,
          spread: 90,
          origin: { y: 0.45 },
          colors: ["#E5B869", "#FEF0C7", "#991B1B", "#FFFDF8", "#D4AF37"],
        });
      } catch (_) {}
      setTimeout(() => setIsFlashing(false), 750);
    }
    setIsHeroRevealed(true);
    setIsUnlocked(true);
    setVideoOpened(true);
  };

  // RSVP Form State
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpAttending, setRsvpAttending] = useState("yes");
  const [rsvpGuests, setRsvpGuests] = useState("2");
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpDua, setRsvpDua] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Extract Props / Data
  const brideName = data?.brideName || data?.couple?.brideName || resolvedData.couple?.brideName || "Maryam";
  const groomName = data?.groomName || data?.couple?.groomName || resolvedData.couple?.groomName || "Ibrahim";
  const brideParents = data?.brideParents || resolvedData.brideParents || "Dr. & Mrs. Rashid Anwar Malik";
  const groomParents = data?.groomParents || resolvedData.groomParents || "Engr. & Mrs. Tahir Farooqi";
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
    : "May 09";
  const revealDayName = !isNaN(weddingDate.getTime())
    ? weddingDate.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" })
    : "Sunday";
  const revealYearStr = !isNaN(weddingDate.getTime())
    ? weddingDate.getFullYear().toString()
    : "2027";

  const venueName = data?.venueName || data?.venue?.name || resolvedData.venue?.name || "The Grand Ottoman Heritage Palace";
  const venueAddress = data?.venueAddress || data?.venue?.address || resolvedData.venue?.address || "Ciragan Caddesi, Besiktas, Istanbul";
  const venueMapUrl = data?.venueMapUrl || data?.venue?.mapUrl || resolvedData.venue?.mapUrl;
  const islamicDate = data?.islamicDate || resolvedData.islamicDate || "03 Dhu al-Qi'dah 1448 AH";

  // Background / Hero Custom Image
  const heroImageSrc = data?.heroImageUrl || data?.backgroundImage || resolvedData.heroImageUrl || "/templates/kitab-e-nikah/palace-hall.jpg";

  // Gallery Photos (from uploaded slideshowImages / gallery or template defaults)
  const rawGallery: any[] = Array.isArray(data?.slideshowImages) && data.slideshowImages.length > 0
    ? data.slideshowImages
    : Array.isArray(data?.gallery) && data.gallery.length > 0
    ? data.gallery
    : Array.isArray(data?.galleryImages) && data.galleryImages.length > 0
    ? data.galleryImages
    : resolvedData.gallery || [
        "/templates/kitab-e-nikah/poster.png",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
      ];
  const galleryPhotos: string[] = rawGallery
    .map((item: any) => (typeof item === "string" ? item : item?.url || item?.src || ""))
    .filter(Boolean);

  const galleryCaptions = resolvedData.galleryCaptions || [
    { title: "The Sacred Nikahnama", subtitle: "Written by Destiny" },
    { title: "Ottoman Palace Arch", subtitle: "A Timeless Heritage" },
    { title: "Golden Calligraphy", subtitle: "Duas from the Heart" },
    { title: "Bosphorus Starlight", subtitle: "A Journey of Forever" },
    { title: "The Royal Sultan Hall", subtitle: "Surrounded by Loved Ones" },
  ];

  const events: EventItem[] = (data?.events || data?.eventsJson || resolvedData.events || []).filter((e: any) => e.enabled !== false);

  const hashtag = data?.hashtag || resolvedData.hashtag || `#${brideName}Weds${groomName}`;
  const storyMessage = data?.storyMessage || resolvedData.storyMessage || "Like the illuminated verses of a sacred manuscript, our paths were written to intertwine. With gratitude to the Almighty and the prayers of our families, we step into the sacred covenant of Nikah.";

  // Deterministic falling gold leaf petals (Royal Lotus Parallax Engine)
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
  const [timeLeft, setTimeLeft] = useState({ days: 233, hours: 16, minutes: 10, seconds: 45 });
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
        .then(() => {
          // Gates open smoothly
        })
        .catch((err) => {
          console.log("Video play error:", err);
          triggerGateOpeningReveal();
        });
    } else {
      triggerGateOpeningReveal();
    }
  };

  const handleVideoEnded = () => {
    triggerGateOpeningReveal();
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHeroRevealed(false);
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
        colors: ["#E5B869", "#782233", "#FBF5E6", "#FFFFFF"],
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
    <div className="kitab-e-nikah-root">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src={resolvedData.audioTrack || "/audio/wedding-ambience.mp3"}
        loop
        preload="auto"
        onPlay={() => setIsPlayingMusic(true)}
        onPause={() => setIsPlayingMusic(false)}
      />

      {/* Royal Unlock Golden Amber Flash Burst Overlay */}
      {isFlashing && <div className="kn-unlock-flash-overlay" aria-hidden="true" />}

      {/* Ambient Floating Velvet Amber & Gold Particles with Parallax */}
      <motion.div className="kn-floating-particles" style={{ y: yParticles }} aria-hidden="true">
        <span className="kn-particle p1"></span>
        <span className="kn-particle p2"></span>
        <span className="kn-particle p3"></span>
        <span className="kn-particle p4"></span>
        <span className="kn-particle p5"></span>
        <span className="kn-particle p6"></span>
      </motion.div>

      {/* Floating Music Toggle with Dynamic Soundwave */}
      <motion.button
        className="kn-music-toggle"
        onClick={toggleMusic}
        aria-label={isPlayingMusic ? "Mute music" : "Play music"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {isPlayingMusic ? (
          <>
            <SpeakerHigh size={18} weight="fill" />
            <span className="kn-soundwave-bars">
              <span className="kn-bar bar-1"></span>
              <span className="kn-bar bar-2"></span>
              <span className="kn-bar bar-3"></span>
            </span>
          </>
        ) : (
          <SpeakerSlash size={18} weight="fill" />
        )}
      </motion.button>

      {/* Ambient Falling Golden Leaf Petals (Royal Lotus Parallax Engine) */}
      <div className="kn-petals-field" aria-hidden="true">
        {petals.map((p) => (
          <span
            key={p.id}
            className="kn-petal"
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

      <div className="kn-viewport-shell">
        {/* Top Sacred Header with Gentle Float */}
        <motion.header
          className="kn-header-arch kn-floating-element"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className="kn-arch-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <div className="kn-arch-tag">KITAB-E-NIKAH · THE ROYAL PALACE</div>
        </motion.header>

        {/* ── Grand Envelope Hero Stage (Centered on All Screen Sizes) ── */}
        <section className="kn-hero-stage-container">
          {/* Flanking Royal Hanging Lanterns & Floating Star Medallions */}
          <div className="kn-hero-floating-elements" aria-hidden="true">
            {/* Left Hanging Ottoman Lantern */}
            <div className="kn-floating-lantern kn-lantern-left">
              <div className="kn-lantern-chain" />
              <div className="kn-lantern-body">
                <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="kn-lantern-svg">
                  <circle cx="24" cy="6" r="4" stroke="#FEF0C7" strokeWidth="1.5" />
                  <path d="M16 12C16 12 20 8 24 8C28 8 32 12 32 12L36 18H12L16 12Z" fill="url(#knLanternGold)" />
                  <path d="M12 18L16 52H32L36 18H12Z" fill="rgba(229, 184, 105, 0.15)" stroke="#E5B869" strokeWidth="1.2" />
                  <path d="M24 18V52M18 20C18 36 24 48 24 48C24 48 30 36 30 20" stroke="#FEF0C7" strokeWidth="0.8" opacity="0.8" />
                  <circle cx="24" cy="36" r="4" fill="#FDE047" className="kn-lantern-flame" />
                  <path d="M16 52L24 64L32 52H16Z" fill="url(#knLanternGold)" />
                  <circle cx="24" cy="68" r="2" fill="#E5B869" />
                  <defs>
                    <linearGradient id="knLanternGold" x1="12" y1="8" x2="36" y2="64" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FEF0C7" />
                      <stop offset="0.5" stopColor="#E5B869" />
                      <stop offset="1" stopColor="#92400E" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="kn-lantern-light-glow" />
              </div>
            </div>

            {/* Right Hanging Ottoman Lantern */}
            <div className="kn-floating-lantern kn-lantern-right">
              <div className="kn-lantern-chain" />
              <div className="kn-lantern-body">
                <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="kn-lantern-svg">
                  <circle cx="24" cy="6" r="4" stroke="#FEF0C7" strokeWidth="1.5" />
                  <path d="M16 12C16 12 20 8 24 8C28 8 32 12 32 12L36 18H12L16 12Z" fill="url(#knLanternGoldR)" />
                  <path d="M12 18L16 52H32L36 18H12Z" fill="rgba(229, 184, 105, 0.15)" stroke="#E5B869" strokeWidth="1.2" />
                  <path d="M24 18V52M18 20C18 36 24 48 24 48C24 48 30 36 30 20" stroke="#FEF0C7" strokeWidth="0.8" opacity="0.8" />
                  <circle cx="24" cy="36" r="4" fill="#FDE047" className="kn-lantern-flame" />
                  <path d="M16 52L24 64L32 52H16Z" fill="url(#knLanternGoldR)" />
                  <circle cx="24" cy="68" r="2" fill="#E5B869" />
                  <defs>
                    <linearGradient id="knLanternGoldR" x1="12" y1="8" x2="36" y2="64" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FEF0C7" />
                      <stop offset="0.5" stopColor="#E5B869" />
                      <stop offset="1" stopColor="#92400E" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="kn-lantern-light-glow" />
              </div>
            </div>

            {/* Floating Celestial Starbursts & Geometry Motifs */}
            <div className="kn-floating-medallion star-1">
              <Sparkle size={20} weight="fill" />
            </div>
            <div className="kn-floating-medallion star-2">
              <Star size={16} weight="fill" />
            </div>
            <div className="kn-floating-medallion star-3">
              <Sparkle size={22} weight="fill" />
            </div>
            <div className="kn-floating-medallion star-4">
              <Star size={18} weight="fill" />
            </div>
          </div>

          {/* Central Hero Video Card / Unlocked Card */}
          <div className="w-full flex justify-center">
            <AnimatePresence mode="wait">
              {!isHeroRevealed ? (
                <motion.div
                  key="video-gate"
                  className="kn-video-hero-wrapper"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className={`kn-video-card ${videoOpened ? "kn-card-revealed" : ""}`}
                    onClick={!isPlayingVideo ? handleOpenInvitation : undefined}
                  >
                    {/* Desktop Specific High-Resolution 16:9 Envelope Preview */}
                    <img
                      src={resolvedData.videoOpening?.desktopPosterUrl || "/templates/kitab-e-nikah/envelope-desktop.jpg"}
                      alt="Kitab-e-Nikah Envelope"
                      className="kn-desktop-envelope-preview"
                    />

                    {/* The Opening Palace Gate Video */}
                    <video
                      ref={videoRef}
                      src={resolvedData.videoOpening.videoUrl}
                      playsInline
                      webkit-playsinline="true"
                      muted={false}
                      preload="auto"
                      className="kn-main-video"
                      onEnded={handleVideoEnded}
                      onTimeUpdate={() => {
                        if (
                          videoRef.current &&
                          videoRef.current.duration > 0 &&
                          videoRef.current.currentTime >= videoRef.current.duration - 0.25 &&
                          !isHeroRevealed
                        ) {
                          triggerGateOpeningReveal();
                        }
                      }}
                    />

                    {/* Tap Prompt Ribbon on Gate Doors */}
                    {!isPlayingVideo && (
                      <div className="kn-tap-prompt-ribbon">
                        <Sparkle size={11} className="text-[#E5B869]" weight="fill" />
                        <span>TAP TO OPEN PALACE GATES</span>
                        <Sparkle size={11} className="text-[#E5B869]" weight="fill" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* ── Permanent Palace Royal Hero Section with Parallax Background & Depth ── */
                <motion.div
                  key="permanent-hero"
                  className="kn-permanent-hero-card"
                  initial={{ opacity: 0, scale: 0.94, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Parallax Palace Background Image Layer */}
                  <motion.div
                    className="kn-hero-bg-layer"
                    style={{ y: yHeroBg }}
                    aria-hidden="true"
                  >
                    <img
                      src={heroImageSrc}
                      alt="Royal Palace Hallway"
                      className="kn-hero-bg-img"
                    />
                    <div className="kn-hero-bg-overlay" />
                    <div className="kn-hero-light-beam" />
                  </motion.div>

                  {/* Frosted Archway Frame Content */}
                  <div className="kn-hero-inner-frame">
                    {/* Decorative Ottoman Arch Crest */}
                    <motion.div
                      className="kn-hero-arch-crest"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.15 }}
                    >
                      <div className="kn-hero-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                      <span className="kn-hero-honor-tag">IN THE NAME OF ALLAH · THE MOST MERCIFUL</span>
                    </motion.div>

                    {/* Grand Couple Presentation */}
                    <motion.div
                      className="kn-hero-couple-block"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <p className="kn-hero-family-intro">TOGETHER WITH THEIR FAMILIES</p>
                      <h1 className="kn-hero-names">
                        <span className="kn-hero-bride">{brideName}</span>
                        <span className="kn-hero-amp">&amp;</span>
                        <span className="kn-hero-groom">{groomName}</span>
                      </h1>
                      <p className="kn-hero-subquote">
                        Request the honour of your presence &amp; prayers as they unite in the holy bond of Nikah
                      </p>
                    </motion.div>

                    {/* Badges: Date, Time, Venue */}
                    <motion.div
                      className="kn-hero-meta-badges"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.45 }}
                    >
                      <div className="kn-hero-meta-badge">
                        <CalendarBlank size={14} className="text-[#E5B869]" weight="fill" />
                        <span>{formattedDate}</span>
                      </div>

                      <div className="kn-hero-meta-badge">
                        <Clock size={14} className="text-[#E5B869]" weight="fill" />
                        <span>Nikah: 4:30 PM &nbsp;•&nbsp; Banquet: 7:30 PM</span>
                      </div>

                      <div className="kn-hero-meta-badge kn-hero-venue-badge">
                        <MapPin size={14} className="text-[#E5B869]" weight="fill" />
                        <span>{venueName}, {resolvedData.venue?.city || "Istanbul"}</span>
                      </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      className="kn-hero-actions-row"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.55 }}
                    >
                      <button
                        className="kn-hero-btn-primary"
                        onClick={() => setIsRsvpOpen(true)}
                      >
                        <EnvelopeSimpleOpen size={15} weight="bold" />
                        <span>Confirm RSVP</span>
                      </button>

                      <button
                        className="kn-hero-btn-secondary"
                        onClick={() => scrollToSection("kn-events-section")}
                      >
                        <Clock size={15} weight="bold" />
                        <span>Itinerary</span>
                      </button>

                      <button
                        className="kn-hero-btn-replay"
                        onClick={handleReplay}
                        title="Replay Palace Gates Opening"
                      >
                        <ArrowsClockwise size={15} weight="bold" />
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Scroll Down Indicator */}
        {isUnlocked && (
          <motion.div
            className="kn-scroll-cue"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => scrollToSection("kn-quran-section")}
          >
            <span>Scroll for ceremonies, gallery &amp; venue</span>
            <div className="kn-scroll-chevron">↓</div>
          </motion.div>
        )}

        {/* ── Unlocked Royal Invitation Sections (Accessible after Envelope Reveal & Flash) ── */}
        <AnimatePresence>
          {isUnlocked && (
            <motion.div
              className="kn-unlocked-flow"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              {/* ── Quranic Verse Section ── */}
              <motion.section
                id="kn-quran-section"
                className="kn-section kn-quran-card"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="kn-section-corner-ornament top-left" aria-hidden="true" />
                <div className="kn-section-corner-ornament top-right" aria-hidden="true" />
                <div className="kn-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="kn-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="kn-quran-glow-backdrop"></div>
                <p className="kn-arabic-verse">{resolvedData.verse?.arabic || "هُوَ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ وَجَعَلَ مِنْهَا زَوْجَهَا لِيَسْكُنَ إِلَيْهَا"}</p>
                <p className="kn-verse-translation">&ldquo;{resolvedData.verse?.translation || "It is He who created you from one soul and created from it its mate that he might dwell in security with her."}&rdquo;</p>
                <p className="kn-verse-ref">{resolvedData.verse?.reference || "Surah Al-A'raf · 7:189"}</p>

                {/* Prophetic Dua Banner */}
                <div className="kn-prophetic-dua-wrap mt-5 pt-4 border-t border-[rgba(229,184,105,0.25)] text-center">
                  <p className="font-serif text-base sm:text-xl text-[#F9E8B2] leading-relaxed tracking-wide font-medium">
                    بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#F5E6CC]/85 italic mt-1 max-w-md mx-auto">
                    &ldquo;May Allah bless you, shower His blessings upon you, and unite you both in goodness and eternal love.&rdquo;
                  </p>
                </div>
              </motion.section>

              {/* ── Elders' & Parents' Blessing Invitation Card ── */}
              <motion.section
                className="kn-section kn-elders-blessing-card text-center"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="kn-section-corner-ornament top-left" aria-hidden="true" />
                <div className="kn-section-corner-ornament top-right" aria-hidden="true" />
                <div className="kn-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="kn-section-corner-ornament bottom-right" aria-hidden="true" />
                <span className="kn-section-subtitle">WITH THE BLESSINGS OF OUR ELDERS</span>
                <h2 className="kn-section-title">Sacred Nikah Invitation</h2>
                <div className="text-[#E5B869] text-sm my-2">✦ ⚜ ✦</div>
                <p className="kn-couple-story-text max-w-xl mx-auto leading-relaxed">
                  With the divine grace of <strong>Almighty Allah (SWT)</strong> and the affectionate prayers of our beloved parents and elders:
                </p>
                <div className="my-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm sm:text-base font-serif font-bold text-[#E5B869]">
                  <span className="tracking-wide">{brideParents}</span>
                  <span className="text-[#C29B38] font-sans font-normal opacity-70 text-xs">❖ &amp; ❖</span>
                  <span className="tracking-wide">{groomParents}</span>
                </div>
                <p className="kn-couple-story-text max-w-xl mx-auto text-xs sm:text-sm text-[#F5E6CC]/90 leading-relaxed">
                  cordially invite you to celebrate the holy covenant of Nikah and grace us with your warm presence and heartfelt duas for our beloved children:
                </p>
                <p className="font-serif text-xl sm:text-3xl font-bold text-[#E5B869] mt-3 tracking-wide">
                  {brideName} <span className="text-[#F5E6CC] font-normal">&amp;</span> {groomName}
                </p>
                <p className="text-xs sm:text-sm text-[#E5B869] italic mt-3 font-medium opacity-90">
                  &ldquo;Aapki pur-khuloos shirkat aur duayein hamari khushiyon ko dobala karengi.&rdquo;
                </p>
              </motion.section>

              {/* ── Meet the Couple ("The Story of Two Souls") ── */}
              <motion.section
                className="kn-section kn-couple-story-box"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="kn-section-corner-ornament top-left" aria-hidden="true" />
                <div className="kn-section-corner-ornament top-right" aria-hidden="true" />
                <div className="kn-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="kn-section-corner-ornament bottom-right" aria-hidden="true" />
                <span className="kn-section-subtitle">THE SACRED STORY</span>
                <h2 className="kn-section-title">Meet the Couple</h2>
                <div className="text-[#E5B869] text-sm my-2">✦ ⚜ ✦</div>
                <p className="kn-couple-story-text">
                  {storyMessage}
                </p>
                <span className="kn-couple-hashtag">{hashtag}</span>
              </motion.section>

              {/* ── 2-Column Split Row: Countdown Box & Interactive Scratch Foil ── */}
              <div className="kn-grid-2col-row">
                {/* ── Live Countdown Box ── */}
                <motion.section
                  className="kn-section kn-countdown-box !mb-0 flex flex-col justify-center"
                  initial={{ opacity: 0, x: -35, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                >
                  <div className="kn-section-corner-ornament top-left" aria-hidden="true" />
                  <div className="kn-section-corner-ornament top-right" aria-hidden="true" />
                  <div className="kn-section-corner-ornament bottom-left" aria-hidden="true" />
                  <div className="kn-section-corner-ornament bottom-right" aria-hidden="true" />
                  <span className="kn-section-subtitle">COUNTING THE BLESSED DAYS</span>
                  <h2 className="kn-section-title">Until The Sacred Nikah</h2>
                  <div className="kn-countdown-grid">
                    {[
                      { val: timeLeft.days, lbl: "Days" },
                      { val: timeLeft.hours, lbl: "Hours" },
                      { val: timeLeft.minutes, lbl: "Mins" },
                      { val: timeLeft.seconds, lbl: "Secs" },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        className="kn-countdown-cell"
                        initial={{ opacity: 0, scale: 0.85, y: 15 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        whileHover={{ y: -4, scale: 1.05 }}
                      >
                        <span className="kn-time-val">{item.val}</span>
                        <span className="kn-time-lbl">{item.lbl}</span>
                      </motion.div>
                    ))}
                  </div>
                  <p className="kn-hijri-date">Islamic Date: {islamicDate}</p>
                </motion.section>

                {/* ── Interactive Scratch to Reveal Date ── */}
                <motion.section
                  className="kn-section kn-countdown-box !mb-0 flex flex-col justify-center"
                  initial={{ opacity: 0, x: 35, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                >
                  <div className="kn-section-corner-ornament top-left" aria-hidden="true" />
                  <div className="kn-section-corner-ornament top-right" aria-hidden="true" />
                  <div className="kn-section-corner-ornament bottom-left" aria-hidden="true" />
                  <div className="kn-section-corner-ornament bottom-right" aria-hidden="true" />
                  <div className="kn-scratch-section !mt-0 !pt-0 !border-0">
                    <div className="kn-scratch-header">
                      <span className="kn-scratch-subtitle">INTERACTIVE CEREMONY INVITATION</span>
                      <h3 className="kn-scratch-title">Scratch Gold Foil to Reveal Date</h3>
                      <p className="kn-scratch-desc">Swipe across the golden foil to uncover our sacred Nikah date</p>
                    </div>
                    <div className="kn-scratch-card-wrapper">
                      <ScratchCard
                        revealDate={revealMonthDay}
                        revealDay={revealDayName}
                        revealYear={revealYearStr}
                        islamicDate={islamicDate}
                        theme="amber"
                        onRevealComplete={() => {
                          try {
                            confetti({
                              particleCount: 70,
                              spread: 75,
                              origin: { y: 0.7 },
                              colors: ["#E5B869", "#FEF0C7", "#991B1B", "#D4AF37", "#FFFFFF"],
                            });
                          } catch (_) {}
                        }}
                      />
                    </div>
                  </div>
                </motion.section>
              </div>

              {/* ── Wedding Ceremonies Timeline (3-Column Desktop) ── */}
              <motion.section
                id="kn-events-section"
                className="kn-section kn-events-wrapper"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="kn-section-corner-ornament top-left" aria-hidden="true" />
                <div className="kn-section-corner-ornament top-right" aria-hidden="true" />
                <div className="kn-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="kn-section-corner-ornament bottom-right" aria-hidden="true" />
                <span className="kn-section-subtitle">CEREMONY &amp; RECEPTION</span>
                <h2 className="kn-section-title">Nikah Itinerary</h2>

                <div className="kn-events-list">
                  {events.map((evt, idx) => (
                    <motion.div
                      key={idx}
                      className="kn-event-card"
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.6, delay: idx * 0.12 }}
                      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
                    >
                      <div className="kn-event-card-header">
                        <span className="kn-event-num">0{idx + 1}</span>
                        <h3 className="kn-event-name">{evt.name}</h3>
                      </div>

                      <div className="kn-event-details">
                        <div className="kn-event-row">
                          <CalendarBlank size={16} className="text-[#E5B869]" weight="fill" />
                          <span>{evt.date}</span>
                        </div>
                        <div className="kn-event-row">
                          <Clock size={16} className="text-[#E5B869]" weight="fill" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="kn-event-row">
                          <MapPin size={16} className="text-[#E5B869]" weight="fill" />
                          <span>{evt.venue} — {evt.location}</span>
                        </div>
                      </div>

                      {evt.dressCode && (
                        <div className="kn-dress-pill">
                          <Sparkle size={12} className="text-[#E5B869]" weight="fill" />
                          <span>Dress Code: {evt.dressCode}</span>
                        </div>
                      )}

                      {evt.description && (
                        <p className="kn-event-desc">{evt.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* ── Curated Moments & Photo Gallery (Bento Grid & Animated Slider) ── */}
              {galleryPhotos.length > 0 && (
                <motion.section
                  className="kn-section kn-gallery-section"
                  initial={{ opacity: 0, y: 45, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="kn-section-corner-ornament top-left" aria-hidden="true" />
                  <div className="kn-section-corner-ornament top-right" aria-hidden="true" />
                  <div className="kn-section-corner-ornament bottom-left" aria-hidden="true" />
                  <div className="kn-section-corner-ornament bottom-right" aria-hidden="true" />
                  <span className="kn-section-subtitle">CHERISHED MOMENTS</span>
                  <h2 className="kn-section-title">Royal Photo Gallery</h2>

                  {/* Mode Selector Toggle */}
                  <div className="kn-gallery-mode-toggle">
                    <button
                      className={`kn-toggle-btn ${galleryMode === "bento" ? "active" : ""}`}
                      onClick={() => setGalleryMode("bento")}
                      aria-label="Switch to Bento Mosaic grid"
                    >
                      <SquaresFour size={15} weight="fill" />
                      <span>Bento Mosaic</span>
                    </button>
                    <button
                      className={`kn-toggle-btn ${galleryMode === "slider" ? "active" : ""}`}
                      onClick={() => setGalleryMode("slider")}
                      aria-label="Switch to Cinematic Slider"
                    >
                      <FilmStrip size={15} weight="fill" />
                      <span>Cinematic Slider</span>
                    </button>
                  </div>

                  {/* Bento Mosaic View */}
                  {galleryMode === "bento" && (
                    <motion.div
                      className="kn-bento-grid"
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
                            className={`kn-bento-card ${isFeatured ? "kn-bento-featured" : ""} ${isWide ? "kn-bento-wide" : ""}`}
                            onClick={() => setSelectedPhoto(imgUrl)}
                            whileHover={{ scale: 1.03, y: -6 }}
                            transition={{ duration: 0.3 }}
                          >
                            <img src={imgUrl} alt={meta?.title || `Gallery Photo ${i + 1}`} className="kn-bento-img" loading="lazy" />
                            <div className="kn-bento-overlay">
                              <div className="kn-bento-meta">
                                <span className="kn-bento-title">{meta?.title || `${brideName} & ${groomName}`}</span>
                                <span className="kn-bento-sub">{meta?.subtitle || "Sacred Memories"}</span>
                              </div>
                              <span className="kn-bento-zoom-icon">
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
                      className="kn-slider-stage"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="kn-slider-viewport">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeSlide}
                            className="kn-slide-item"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.04 }}
                            transition={{ duration: 0.55, ease: "easeOut" }}
                            onClick={() => setSelectedPhoto(galleryPhotos[activeSlide])}
                          >
                            <img
                              src={galleryPhotos[activeSlide]}
                              alt={`Wedding gallery slide ${activeSlide + 1}`}
                              className="kn-slider-img"
                            />
                            <div className="kn-slider-overlay-caption">
                              <span className="kn-slider-caption-title">
                                {galleryCaptions[activeSlide % galleryCaptions.length]?.title || `${brideName} & ${groomName}`}
                              </span>
                              <span className="kn-slider-caption-sub">
                                {galleryCaptions[activeSlide % galleryCaptions.length]?.subtitle || "Cherished Moments"}
                              </span>
                            </div>
                          </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        {galleryPhotos.length > 1 && (
                          <>
                            <button
                              className="kn-slider-nav-btn prev"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSlide((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
                              }}
                              aria-label="Previous slide"
                            >
                              <CaretLeft size={18} weight="bold" />
                            </button>
                            <button
                              className="kn-slider-nav-btn next"
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
                        <div className="kn-slider-controls">
                          <div className="kn-slider-dots">
                            {galleryPhotos.map((_, dotIdx) => (
                              <button
                                key={dotIdx}
                                className={`kn-slider-dot ${dotIdx === activeSlide ? "active" : ""}`}
                                onClick={() => setActiveSlide(dotIdx)}
                                aria-label={`Go to slide ${dotIdx + 1}`}
                              />
                            ))}
                          </div>
                          <span className="kn-slider-counter">
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
                className="kn-section kn-essentials-section"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="kn-section-corner-ornament top-left" aria-hidden="true" />
                <div className="kn-section-corner-ornament top-right" aria-hidden="true" />
                <div className="kn-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="kn-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="text-center mb-6">
                  <span className="kn-section-subtitle">GUEST ESSENTIALS</span>
                  <h2 className="kn-section-title">Things to Know</h2>
                  <div className="text-[#E5B869] text-sm my-2">✦ ⚜ ✦</div>
                  <p className="text-xs text-[#CDB3BC] max-w-md mx-auto mt-2">
                    A few thoughtful details to ensure your celebration at our Nikah is seamless and blessed.
                  </p>
                </div>

                <div className="kn-essentials-grid">
                  {[
                    {
                      title: "Dress Code",
                      desc: data?.dressCodeText || "Imperial Ottoman Formal / Traditional Sherwanis & Embroidered Sarees in Gold & Ruby.",
                      icon: <Sparkle size={24} weight="fill" />,
                    },
                    {
                      title: "Venue & Valet",
                      desc: data?.transportText || "Complimentary valet parking and chauffeured airport transfers arranged for all guests.",
                      icon: <Compass size={24} weight="fill" />,
                    },
                    {
                      title: "Hospitality & Stay",
                      desc: "Curated suites reserved at the Ottoman Palace Estate. Please contact our hospitality team.",
                      icon: <MapPin size={24} weight="fill" />,
                    },
                    {
                      title: "Wedding Hashtag",
                      desc: `Tag your moments and cherish memories with ${hashtag}.`,
                      icon: <Star size={24} weight="fill" />,
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={item.title}
                      className="kn-essentials-card"
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.12 }}
                      whileHover={{ y: -8, transition: { duration: 0.25 } }}
                    >
                      <div className="kn-essentials-icon-frame">
                        {item.icon}
                      </div>
                      <h3 className="kn-essentials-card-title">{item.title}</h3>
                      <div className="kn-essentials-rule" />
                      <p className="kn-essentials-card-desc">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* ── Venue Destination (Split Map Card on Desktop) ── */}
              <motion.section
                className="kn-section kn-venue-box"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="kn-section-corner-ornament top-left" aria-hidden="true" />
                <div className="kn-section-corner-ornament top-right" aria-hidden="true" />
                <div className="kn-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="kn-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="kn-venue-split-grid">
                  <div className="text-left space-y-3">
                    <span className="kn-section-subtitle !text-left">THE SACRED DESTINATION</span>
                    <h2 className="kn-section-title !text-left">{venueName}</h2>
                    <p className="kn-venue-addr !text-left">{venueAddress}</p>
                    <p className="text-[12.5px] text-[#CDB3BC] leading-relaxed">
                      We warmly invite you to share in the divine joy of our Nikah ceremony at this historic estate. Valet parking &amp; prayer amenities are arranged for all esteemed guests.
                    </p>
                    <div className="pt-2">
                      <motion.a
                        href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(venueName + " " + venueAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kn-map-cta-btn !w-fit"
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MapPin size={18} weight="bold" />
                        <span>Navigate in Google Maps</span>
                        <ArrowSquareOut size={16} weight="bold" />
                      </motion.a>
                    </div>
                  </div>

                  {/* Stylized Interactive Map Preview Card */}
                  <div className="relative rounded-2xl overflow-hidden border border-[#E5B869]/40 bg-[#140409]/60 aspect-video lg:aspect-[4/3] flex flex-col items-center justify-center p-6 text-center shadow-xl">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#E5B869_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="w-12 h-12 rounded-full bg-[#E5B869]/20 border border-[#E5B869] flex items-center justify-center text-[#E5B869] mb-3 shadow-lg shadow-amber-900/40">
                      <MapPin size={24} weight="fill" />
                    </div>
                    <h4 className="font-['Playfair_Display'] text-[#FDF1D6] font-bold text-base">{venueName}</h4>
                    <span className="text-[11px] text-[#CDB3BC] mt-1">{venueAddress}</span>
                    <a
                      href={venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent(venueName + " " + venueAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 px-4 py-2 bg-[#E5B869]/20 hover:bg-[#E5B869]/30 text-[#E5B869] border border-[#E5B869]/60 rounded-full text-xs font-['Cinzel'] font-semibold tracking-wider transition inline-flex items-center gap-1.5"
                    >
                      <span>Open Interactive GPS</span>
                      <ArrowSquareOut size={14} />
                    </a>
                  </div>
                </div>
              </motion.section>

              {/* ── RSVP CTA Card ── */}
              <motion.section
                className="kn-section kn-rsvp-banner"
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="kn-section-corner-ornament top-left" aria-hidden="true" />
                <div className="kn-section-corner-ornament top-right" aria-hidden="true" />
                <div className="kn-section-corner-ornament bottom-left" aria-hidden="true" />
                <div className="kn-section-corner-ornament bottom-right" aria-hidden="true" />
                <div className="kn-rsvp-inner">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Heart size={44} className="text-[#E5B869] mb-2" weight="fill" />
                  </motion.div>
                  <h2 className="kn-rsvp-title">Your Presence is Our Honour</h2>
                  <p className="kn-rsvp-sub">
                    Please honor us with your confirmed attendance and blessed prayers.
                  </p>
                  <motion.button
                    className="kn-rsvp-open-btn"
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
                className="kn-footer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0 }}
              >
                <div className="kn-footer-monogram">
                  {brideName[0]}&{groomName[0]}
                </div>
                <h3 className="kn-footer-names">{brideName} & {groomName}</h3>
                <p className="kn-footer-quote">
                  United in Sacred Covenant · Bound by Divine Mercy · Insha&apos;Allah Forever
                </p>

                {/* ── Marketing Content At End of Template Footer ── */}
                <div className="mt-8 text-left">
                  <TemplateMarketingFooter
                    templateId="kitab-e-nikah"
                    templateName="Kitab-e-Nikah"
                    brideName={brideName}
                    groomName={groomName}
                  />
                </div>
              </motion.footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Fullscreen Lightbox Modal for Photo Inspection ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="kn-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="kn-lightbox-card"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="kn-lightbox-close"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photo preview"
              >
                <X size={20} weight="bold" />
              </button>
              <img src={selectedPhoto} alt="Zoomed wedding moment" className="kn-lightbox-img" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RSVP Modal ── */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="kn-modal-overlay">
            <motion.div
              className="kn-modal-container"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <button
                className="kn-modal-close"
                onClick={() => setIsRsvpOpen(false)}
              >
                <X size={18} />
              </button>

              <div className="kn-modal-header">
                <div className="kn-modal-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                <h3 className="kn-modal-title">Confirm Attendance</h3>
                <p className="kn-modal-sub">For {brideName} & {groomName}&apos;s Nikah</p>
              </div>

              {isSubmitted ? (
                <div className="kn-success-msg text-center">
                  <CheckCircle size={48} className="text-[#E5B869] mb-3 mx-auto" weight="fill" />
                  <h4 className="text-lg font-serif text-[#E5B869]">JazakAllah Khair!</h4>
                  <p className="text-xs text-[#F5E6CC] mt-1 leading-relaxed">
                    Thank you, <strong>{rsvpName || "Dear Guest"}</strong>! Your RSVP and heartfelt duas have been received with deep gratitude. Aapki shirkat hamari khushiyon ko dobala karegi.
                  </p>

                  <div className="mt-4 pt-3 border-t border-[rgba(229,184,105,0.2)]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRsvpOpen(false);
                        setIsSubmitted(false);
                      }}
                      className="w-full py-2.5 bg-[#E5B869] hover:bg-[#d4a34e] text-[#2D1619] font-bold text-xs rounded-xl uppercase tracking-wider transition-all"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="kn-rsvp-form">
                  <div className="kn-form-group">
                    <label className="kn-label">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ibrahim & Family"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="kn-input"
                    />
                  </div>

                  <div className="kn-form-group">
                    <label className="kn-label">Will you be attending?</label>
                    <div className="kn-radio-group">
                      <button
                        type="button"
                        className={`kn-radio-btn ${rsvpAttending === "yes" ? "active" : ""}`}
                        onClick={() => setRsvpAttending("yes")}
                      >
                        Joyfully Accept
                      </button>
                      <button
                        type="button"
                        className={`kn-radio-btn ${rsvpAttending === "no" ? "active" : ""}`}
                        onClick={() => setRsvpAttending("no")}
                      >
                        Regretfully Decline
                      </button>
                    </div>
                  </div>

                  {rsvpAttending === "yes" && (
                    <div className="kn-form-group">
                      <label className="kn-label">Number of Guests Attending</label>
                      <select
                        value={rsvpGuests}
                        onChange={(e) => setRsvpGuests(e.target.value)}
                        className="kn-select"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="5+">5+ Persons (Family)</option>
                      </select>
                    </div>
                  )}

                  <div className="kn-form-group">
                    <label className="kn-label">Your Blessings / Dua for the Couple</label>
                    <textarea
                      rows={3}
                      placeholder="May Allah bless this union with love, mercy, and harmony..."
                      value={rsvpDua}
                      onChange={(e) => setRsvpDua(e.target.value)}
                      className="kn-textarea"
                    />
                  </div>

                  <button type="submit" className="kn-submit-btn">
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
