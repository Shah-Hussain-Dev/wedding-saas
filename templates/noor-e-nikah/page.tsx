"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Lottie } from "lottie-react";
import confetti from "canvas-confetti";
import { ScratchCard } from "@/components/invitation/ScratchCard";
import { 
  SpeakerHigh, 
  SpeakerSlash, 
  CalendarBlank, 
  Clock, 
  MapPin, 
  Heart, 
  Check, 
  Sparkle, 
  ArrowSquareOut,
  CaretLeft,
  CaretRight,
  SquaresFour,
  FilmStrip,
  Copy,
  CheckCircle,
  ArrowUp,
  MoonStars,
  Compass,
  WhatsappLogo,
} from "@phosphor-icons/react";
import noorEnvelopeSeal from "@/public/lottie-icons/noor-envelope-seal.json";
import noorCrescentLantern from "@/public/lottie-icons/noor-crescent-lantern.json";
import defaultData from "./data.json";
import "./style.css";

interface EventItem {
  name?: string;
  title?: string;
  enabled?: boolean;
  venue?: string;
  location?: string;
  date?: string;
  time?: string;
  description?: string;
}

interface NoorNikahProps {
  data?: any;
}

export default function NoorNikah({ data }: NoorNikahProps) {
  // Merge incoming dynamic data with default static data.json
  const resolvedData = { ...defaultData, ...data };

  // Envelope opening progressive states
  const [isOpen, setIsOpen] = useState(false);
  const [isLighting, setIsLighting] = useState(false);
  const [isFlapOpen, setIsFlapOpen] = useState(false);
  const [isCardUp, setIsCardUp] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Audio Reference
  const audioRef = useRef<HTMLAudioElement>(null);

  // Gallery View Mode & Slider State
  const [galleryViewMode, setGalleryViewMode] = useState<"bento" | "slider">("bento");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Venue Address Copy state
  const [copiedAddress, setCopiedAddress] = useState(false);

  // RSVP Form state
  const [rsvpAttending, setRsvpAttending] = useState("yes");
  const [rsvpGuests, setRsvpGuests] = useState("2");
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpDua, setRsvpDua] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mount state for SSR hydration safety
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Parallax Scroll Tracking for Hero
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroBgY = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const heroBgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroPetalsY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroCardY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const heroCardOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.05]);

  // Template Data extraction with safe fallbacks from data.json
  const brideName = data?.brideName || data?.couple?.brideName || data?.bride_name || resolvedData.couple?.brideName || "Diya";
  const groomName = data?.groomName || data?.couple?.groomName || data?.groom_name || resolvedData.couple?.groomName || "Shaan";
  const rawDate = data?.weddingDate || data?.date || resolvedData.weddingDate;
  const weddingDate = new Date(rawDate);
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
    : "October 24";
  const revealDayName = !isNaN(weddingDate.getTime())
    ? weddingDate.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" })
    : "Friday";
  const revealYearStr = !isNaN(weddingDate.getTime())
    ? weddingDate.getFullYear().toString()
    : "2026";

  const islamicDate = data?.islamicDate || resolvedData.islamicDate || "13 Rabi' al-Thani 1448 AH";

  const venueName = data?.venueName || data?.venue?.name || resolvedData.venue?.name;
  const venueAddress = data?.venueAddress || data?.venue?.address || resolvedData.venue?.address;
  const venueMapUrl = data?.venueMapUrl || data?.venue?.mapUrl || resolvedData.venue?.mapUrl;

  // Events schedule from data.json or props
  const rawEvents = data?.events || data?.eventsJson;
  const events: EventItem[] =
    rawEvents && Array.isArray(rawEvents) && rawEvents.length > 0
      ? rawEvents.filter((e: EventItem) => e.enabled !== false)
      : resolvedData.events;

  // Dynamic Gallery Photos from uploaded custom images or template default
  const rawGallery = (data?.gallery && Array.isArray(data.gallery) && data.gallery.length > 0)
    ? data.gallery
    : (data?.slideshowImages && Array.isArray(data.slideshowImages) && data.slideshowImages.length > 0)
    ? data.slideshowImages
    : (data?.galleryImages && Array.isArray(data.galleryImages) && data.galleryImages.length > 0)
    ? data.galleryImages
    : data?.heroImageUrl
    ? [data.heroImageUrl]
    : resolvedData.gallery;

  const galleryImages: string[] = Array.isArray(rawGallery)
    ? rawGallery
        .map((g: any) => (typeof g === "string" ? g : g?.url || g?.src || ""))
        .filter(Boolean)
    : [];

  // Gallery captions metadata for bento
  const defaultGalleryCaptions = [
    { title: "Imperial Royal Couple", subtitle: "Mughal Palace Arch" },
    { title: "Sacred Ring Ceremony", subtitle: "A Promise of Forever" },
    { title: "Bridal Henna & Jewels", subtitle: "Intricate Royal Filigree" },
    { title: "Golden Courtyard Walk", subtitle: "Stardust & Smiles" },
    { title: "The Royal Entrance", subtitle: "Under the Golden Canopy" },
    { title: "Eternal Duas & Blessings", subtitle: "United by Destiny" },
  ];

  const galleryCaptions = Array.isArray(rawGallery)
    ? rawGallery.map((g: any, i: number) => {
        if (typeof g === "object" && g && (g.title || g.caption)) {
          return {
            title: g.title || g.caption || defaultGalleryCaptions[i % defaultGalleryCaptions.length].title,
            subtitle: g.subtitle || defaultGalleryCaptions[i % defaultGalleryCaptions.length].subtitle,
          };
        }
        return defaultGalleryCaptions[i % defaultGalleryCaptions.length];
      })
    : defaultGalleryCaptions;

  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState({
    days: 133,
    hours: 13,
    minutes: 11,
    seconds: 51,
  });

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

  // Slider navigation
  const nextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Copy Address to clipboard
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${venueName}, ${venueAddress}`);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2200);
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Progressive Slow & Ultra-Smooth Envelope Unfolding Sequence
  const handleOpenInvitation = () => {
    if (isLighting || isFlapOpen || isOpening) return;
    
    // 1. Slow golden energy radiance starts & music unlocks
    setIsLighting(true);

    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Audio autoplay restricted:", e));
    }

    // 2. Slow 3D Flap Unfolding (1.1s)
    setTimeout(() => {
      setIsFlapOpen(true);
    }, 1100);

    // 3. Inner Royal Gilded Invitation Card slides up majestically (2.0s)
    setTimeout(() => {
      setIsCardUp(true);
    }, 2000);

    // 4. Cinematic Envelope glow & portal expansion (3.4s)
    setTimeout(() => {
      setIsOpening(true);
    }, 3400);

    // 5. Unveil palace hero portal (4.2s)
    setTimeout(() => {
      setIsOpen(true);
    }, 4200);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Trigger golden stardust confetti
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#D4AF37", "#1B3D2F", "#FFF2CC", "#E8D5B5", "#FFD700"],
      });
    } catch {
      // safe fallback
    }



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

  return (
    <div className="tmpl-noor-nikah">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={
          data?.musicUrl ||
          data?.musicTrack ||
          "/templates/crimson-royale/music.mp3"
        }
        loop
        preload="auto"
      />

      {/* 1. Ultra-Realistic 3D Luxury Folded Islamic Wedding Envelope */}
      <AnimatePresence>
        {!isOpen && (
          <div className="noor-envelope-overlay">
            {/* Soft Ambient Backdrop Glow */}
            <div className="noor-env-backdrop-glow" />

            {/* Ambient Sparkles Container */}
            <div className="noor-env-ambient">
              {[...Array(16)].map((_, i) => (
                <span
                  key={i}
                  className="noor-env-sparkle"
                  style={{
                    left: `${(i * 6.2) + 2}%`,
                    animationDuration: `${4.5 + (i % 5) * 1.8}s`,
                    animationDelay: `${(i * 0.35) % 3}s`,
                    transform: `scale(${0.6 + (i % 4) * 0.25})`,
                  }}
                />
              ))}
            </div>

            <div className="noor-env-container">
              {/* Header Inscription */}
              <div className="noor-env-top-bar">
                <p className="noor-env-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                <p className="noor-env-sub">ROYAL NIKAH INVITATION</p>
              </div>

              {/* 3D Envelope Master Assembly */}
              <div
                className={`noor-envelope-scene ${isLighting ? "is-lighting" : ""} ${isFlapOpen ? "is-flap-open" : ""} ${isCardUp ? "is-card-up" : ""} ${isOpening ? "is-opening" : ""}`}
                onClick={handleOpenInvitation}
                role="button"
                tabIndex={0}
                aria-label="Open Luxury Wedding Invitation"
              >
                {/* Envelope Case Base */}
                <div className="noor-env-case">
                  {/* Deep Emerald Velvet / Silk Interior Lining */}
                  <div className="noor-env-interior">
                    <div className="noor-env-lining-pattern" />
                  </div>

                  {/* 3D Folding Top Flap (Hinged at top edge) */}
                  <div className="noor-env-flap-top">
                    {/* Front Flap Facet (Visible when closed) */}
                    <div className="noor-flap-top-front">
                      <svg className="noor-flap-svg" viewBox="0 0 380 210" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="flapPearlGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="45%" stopColor="#FAF7F0" />
                            <stop offset="85%" stopColor="#EFE5D3" />
                            <stop offset="100%" stopColor="#E4D5BC" />
                          </linearGradient>
                          <linearGradient id="flapGoldTrimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#B38926" />
                            <stop offset="25%" stopColor="#F5D77F" />
                            <stop offset="50%" stopColor="#FFF4C2" />
                            <stop offset="75%" stopColor="#D4AF37" />
                            <stop offset="100%" stopColor="#8C6618" />
                          </linearGradient>
                          <filter id="flapShadow" x="-10%" y="-10%" width="120%" height="140%">
                            <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#000000" floodOpacity="0.4" />
                          </filter>
                        </defs>

                        {/* Triangular Pointed Flap */}
                        <path
                          d="M 0 0 L 380 0 L 190 200 Z"
                          fill="url(#flapPearlGrad)"
                          filter="url(#flapShadow)"
                        />

                        {/* Gold Foil Trim on Flap Edge */}
                        <path
                          d="M 0 0 L 190 200 L 380 0"
                          fill="none"
                          stroke="url(#flapGoldTrimGrad)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Inner Dashed Gold Filigree */}
                        <path
                          d="M 18 12 L 190 184 L 362 12"
                          fill="none"
                          stroke="#D4AF37"
                          strokeWidth="1.2"
                          strokeDasharray="4 3"
                          opacity="0.8"
                        />

                        {/* Small Arabesque Top Center Crest */}
                        <circle cx="190" cy="50" r="2.5" fill="#D4AF37" opacity="0.75" />
                        <path
                          d="M 175 40 Q 190 30 205 40"
                          fill="none"
                          stroke="#D4AF37"
                          strokeWidth="1"
                          opacity="0.6"
                        />
                      </svg>
                    </div>

                    {/* Back Flap Facet (Visible when unfolded) */}
                    <div className="noor-flap-top-back">
                      <svg className="noor-flap-svg" viewBox="0 0 380 210" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="flapVelvetGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#081E13" />
                            <stop offset="50%" stopColor="#123B28" />
                            <stop offset="100%" stopColor="#0B261A" />
                          </linearGradient>
                        </defs>

                        <path
                          d="M 0 0 L 380 0 L 190 200 Z"
                          fill="url(#flapVelvetGrad)"
                        />

                        <path
                          d="M 0 0 L 190 200 L 380 0"
                          fill="none"
                          stroke="url(#flapGoldTrimGrad)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Arabesque Gold Star Accents on Flap Interior */}
                        <circle cx="190" cy="100" r="3.5" fill="#D4AF37" opacity="0.85" />
                        <circle cx="135" cy="65" r="2.5" fill="#D4AF37" opacity="0.65" />
                        <circle cx="245" cy="65" r="2.5" fill="#D4AF37" opacity="0.65" />
                        <path
                          d="M 155 85 Q 190 65 225 85"
                          fill="none"
                          stroke="#D4AF37"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                          opacity="0.6"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Inner Gilded Royal Invitation Card (Slides Up gracefully out of Pocket) */}
                  <div className="noor-env-card-insert">
                    <div className="noor-env-card-inner">
                      <div className="noor-card-content-wrap">
                        {/* Top Islamic Invocation */}
                        <div className="noor-card-arch-top">
                          <span className="noor-card-bismillah-mini">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                          <div className="noor-card-divider-line" />
                          <span className="noor-card-tagline">THE WEDDING CELEBRATION OF</span>
                        </div>

                        {/* Couple Names & Motifs */}
                        <div className="noor-card-center-content">
                          <h2 className="noor-card-couple-names">
                            {brideName} <span className="noor-ampersand">&</span> {groomName}
                          </h2>
                          <div className="noor-card-ornament">✦ ⚜ ✦</div>
                          <p className="noor-card-date">{formattedDate}</p>
                          <p className="noor-card-venue">{venueName}</p>
                        </div>

                        {/* Quranic Verse */}
                        <div className="noor-card-verse-box">
                          <p className="noor-card-quran-verse">
                            &ldquo;And We created you in pairs&rdquo; — Surah An-Naba
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Solid Front Pocket Assembly (With 3D Folded Wings & Gold Damask Motif) */}
                  <div className="noor-env-front-pocket">
                    <svg className="noor-pocket-svg" viewBox="0 0 380 270" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="pocketPearlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="35%" stopColor="#FAF7F0" />
                          <stop offset="80%" stopColor="#EFE5D3" />
                          <stop offset="100%" stopColor="#E2D2B8" />
                        </linearGradient>
                        <linearGradient id="pocketFoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#E6D7BF" />
                          <stop offset="50%" stopColor="#FAF7F0" />
                          <stop offset="100%" stopColor="#E6D7BF" />
                        </linearGradient>
                        <filter id="pocketInnerShad" x="-10%" y="-10%" width="120%" height="120%">
                          <feDropShadow dx="0" dy="-4" stdDeviation="6" floodColor="#000000" floodOpacity="0.3" />
                        </filter>
                      </defs>

                      {/* Pocket Base Polygon with Gentle V-Cut */}
                      <path
                        d="M 0 0 L 190 85 L 380 0 L 380 270 L 0 270 Z"
                        fill="url(#pocketPearlGrad)"
                        filter="url(#pocketInnerShad)"
                      />

                      {/* Left & Right Origami Fold Facets */}
                      <path
                        d="M 0 0 L 190 85 L 0 270 Z"
                        fill="url(#pocketFoldGrad)"
                        opacity="0.3"
                      />
                      <path
                        d="M 380 0 L 190 85 L 380 270 Z"
                        fill="url(#pocketFoldGrad)"
                        opacity="0.3"
                      />

                      {/* Gold Foil Geometric V-Trim */}
                      <path
                        d="M 0 0 L 190 85 L 380 0"
                        fill="none"
                        stroke="url(#flapGoldTrimGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Concentric Inner Hairline */}
                      <path
                        d="M 14 16 L 190 98 L 366 16"
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="1.2"
                        strokeDasharray="4 3"
                        opacity="0.75"
                      />

                      {/* Bottom Envelope Border Gold Trim */}
                      <rect
                        x="12"
                        y="256"
                        width="356"
                        height="2"
                        fill="url(#flapGoldTrimGrad)"
                        opacity="0.8"
                      />

                      {/* Arabesque Flourish on Pocket */}
                      <circle cx="190" cy="180" r="3" fill="#D4AF37" opacity="0.6" />
                      <circle cx="160" cy="180" r="1.5" fill="#D4AF37" opacity="0.4" />
                      <circle cx="220" cy="180" r="1.5" fill="#D4AF37" opacity="0.4" />
                      <path
                        d="M 140 180 Q 190 160 240 180 Q 190 200 140 180"
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="0.8"
                        opacity="0.5"
                      />
                    </svg>
                  </div>

                  {/* Golden Radiance Light Sweeper */}
                  <div className="noor-env-light-sweep" />
                  <div className="noor-env-gold-halo" />

                  {/* Central 24K Royal Gold Wax Seal Medallion */}
                  <div className="noor-wax-seal-anchor">
                    <div className="noor-wax-seal-body">
                      {/* Outer Golden Aura Ring */}
                      <div className="noor-seal-aura" />
                      
                      {/* 3D Beveled Wax Seal Medallion */}
                      <div className="noor-seal-lacquer">
                        <div className="noor-seal-bezel">
                          <span className="noor-seal-crown">👑</span>
                          <span className="noor-seal-monogram">
                            {brideName[0]}&{groomName[0]}
                          </span>
                          <span className="noor-seal-wreath">✦ ⚜ ✦</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Tap To Open Floating Pill */}
                    <div className="noor-tap-pill">
                      <Sparkle size={13} className="text-[#D4AF37]" weight="fill" />
                      <span className="noor-tap-pill-text">TAP TO OPEN</span>
                      <Sparkle size={13} className="text-[#D4AF37]" weight="fill" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Couple Names Footer */}
              <div className="noor-env-bottom-bar">
                <p className="noor-env-names">{brideName} & {groomName}</p>
                <p className="noor-env-hint">Touch the royal seal to unfold the invitation & music</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Ambient Music Control (Mobile First Ergonomics) */}
      {isOpen && (
        <button
          className="noor-music-toggle"
          onClick={toggleMusic}
          aria-label={isPlaying ? "Mute music" : "Play music"}
        >
          {isPlaying ? <SpeakerHigh size={20} weight="fill" /> : <SpeakerSlash size={20} weight="fill" />}
        </button>
      )}

      {/* =================================================================== */}
      {/* SECTION 1: HERO PORTAL (Regal Muslim Couple in Mughal Palace Arch)   */}
      {/* MOBILE-FIRST ARCHITECTURE: Leaves Couple Faces 100% Unobstructed     */}
      {/* =================================================================== */}
      <section ref={heroRef} className="noor-hero">
        {/* Animated Background with Ken Burns & Scroll Parallax */}
        <motion.div
          className="noor-hero-bg-wrapper"
          style={mounted ? { y: heroBgY, scale: heroBgScale } : undefined}
        >
          <picture className="noor-hero-picture">
            <source
              media="(min-width: 768px)"
              srcSet={data?.heroImageUrl && data.heroImageUrl.trim() ? data.heroImageUrl : "/templates/noor-e-nikah/hero-couple-desktop.jpg"}
            />
            <img
              src={data?.heroImageUrl && data.heroImageUrl.trim() ? data.heroImageUrl : "/templates/noor-e-nikah/hero-couple-mobile.jpg"}
              alt={`${brideName} & ${groomName} Wedding Portal`}
              className="noor-hero-img"
            />
          </picture>
        </motion.div>

        {/* Ambient Gradient Overlays */}
        <div className="noor-hero-overlay" />
        <div className="noor-hero-sunset-glow" />

        {/* Hanging Swaying Moroccan Lanterns */}
        <div className="noor-hero-lantern lantern-left">
          <div className="noor-lantern-cord" />
          <div className="noor-lantern-body">
            <div className="noor-lantern-flame" />
          </div>
        </div>
        <div className="noor-hero-lantern lantern-right">
          <div className="noor-lantern-cord" />
          <div className="noor-lantern-body">
            <div className="noor-lantern-flame" />
          </div>
        </div>

        {/* Floating Jasmine & Rose Petals Parallax Layer */}
        <motion.div
          className="noor-hero-petals-layer"
          style={mounted ? { y: heroPetalsY } : undefined}
        >
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className={`noor-hero-petal petal-${i % 4}`}
              style={{
                left: `${(i * 5.5) + 1.5}%`,
                animationDuration: `${6.5 + (i % 5) * 2}s`,
                animationDelay: `${(i * 0.45) % 4.5}s`,
                transform: `scale(${0.65 + (i % 4) * 0.2})`,
              }}
            />
          ))}
        </motion.div>

        {/* Top Arch Header Badge (Sacred Invocations - Compact & Non-Obtrusive on Mobile) */}
        <motion.div
          className="noor-hero-top-badge"
          style={mounted ? { y: heroCardY, opacity: heroCardOpacity } : undefined}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <p className="noor-hero-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <div className="noor-hero-top-divider">
            <span className="noor-card-divider-line" />
            <span className="noor-hero-eyebrow">THE ROYAL NIKAH CELEBRATION</span>
            <span className="noor-card-divider-line" />
          </div>
        </motion.div>

        {/* Bottom Floating Royal Card (Leaves Couple Faces 100% Unobstructed) */}
        <motion.div
          className="noor-hero-bottom-card"
          style={mounted ? { y: heroCardY, opacity: heroCardOpacity } : undefined}
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          <h1 className="noor-hero-names">
            {brideName} <span className="noor-hero-amp">&</span> {groomName}
          </h1>

          <div className="noor-hero-meta-row">
            <div className="noor-hero-date-badge">
              <CalendarBlank size={13} weight="fill" className="text-[#D4AF37]" />
              <span>{formattedDate}</span>
            </div>

            <p className="noor-hero-venue-tag">
              <MapPin size={12} weight="fill" className="text-[#D4AF37] inline mr-1" />
              {venueName}
            </p>
          </div>
        </motion.div>

        {/* Floating Scroll Cue */}
        <motion.div
          className="noor-hero-scroll-cue"
          style={mounted ? { opacity: heroCardOpacity } : undefined}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="noor-scroll-cue-text">✦ SCROLL TO DISCOVER ✦</span>
          <span className="noor-scroll-cue-arrow">↓</span>
        </motion.div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 2: BISMILLAH INVOCATION & MODERN BENTO COUNTDOWN           */}
      {/* =================================================================== */}
      <section className="noor-section noor-welcome-section">
        <motion.div 
          className="noor-welcome-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated Crescent Lantern */}
          <div className="noor-lantern-accent">
            <Lottie src={noorCrescentLantern} loop autoplay />
          </div>

          <p className="noor-bismillah-lg">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>

          <div className="noor-quote-lines">
            <p>Two Souls · One Destiny</p>
            <span className="noor-quote-written">
              A Lifetime written by Allah
            </span>
          </div>

          <p className="noor-welcome-msg">
            With the divine blessings of Almighty Allah and our beloved families, we invite you to grace our auspicious Nikah celebrations with your presence, duas, and love.
          </p>

          {/* Modern Bento Countdown Card */}
          <div className="noor-countdown-bento">
            <div className="noor-countdown-header">
              <Sparkle size={13} weight="fill" className="text-[#D4AF37]" />
              <span className="noor-countdown-eyebrow">COUNTDOWN TO OUR SACRED UNION</span>
              <Sparkle size={13} weight="fill" className="text-[#D4AF37]" />
            </div>

            <div className="noor-timer-grid">
              <div className="noor-timer-box">
                <span className="noor-timer-val">{timeLeft.days}</span>
                <span className="noor-timer-unit">DAYS</span>
              </div>
              <span className="noor-timer-sep">✦</span>
              <div className="noor-timer-box">
                <span className="noor-timer-val">{timeLeft.hours}</span>
                <span className="noor-timer-unit">HOURS</span>
              </div>
              <span className="noor-timer-sep">✦</span>
              <div className="noor-timer-box">
                <span className="noor-timer-val">{timeLeft.minutes}</span>
                <span className="noor-timer-unit">MINS</span>
              </div>
              <span className="noor-timer-sep">✦</span>
              <div className="noor-timer-box">
                <span className="noor-timer-val">{timeLeft.seconds}</span>
                <span className="noor-timer-unit">SECS</span>
              </div>
            </div>

            {/* Interactive Scratch-to-Reveal Date Foil */}
            <div className="noor-scratch-section">
              <div className="noor-scratch-header">
                <span className="noor-scratch-subtitle">INTERACTIVE INVITATION</span>
                <h3 className="noor-scratch-title">Scratch Gold Foil to Reveal Date</h3>
                <p className="noor-scratch-desc">Swipe across the 24K gold surface to unveil our sacred Nikah date</p>
              </div>
              <div className="noor-scratch-card-wrapper">
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
                        origin: { y: 0.65 },
                        colors: ["#D4AF37", "#FEF0C7", "#1E3A2F", "#FFFFFF"],
                      });
                    } catch (_) {}
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 3: CEREMONIES & NIKAH TIMELINE (Staggered Bento Grid)       */}
      {/* =================================================================== */}
      <section className="noor-section noor-timeline-section">
        <motion.div 
          className="noor-section-header text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="noor-hero-eyebrow">ROYAL ITINERARY</span>
          <h2 className="noor-section-title">Ceremonies & Celebrations</h2>
          <div className="noor-section-filigree">✦ ⚜ ✦</div>
        </motion.div>

        <div className="noor-events-bento-grid">
          {events.map((evt, idx) => (
            <motion.div 
              key={idx} 
              className={`noor-event-bento-card ${idx === 0 ? "noor-card-featured" : ""}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.75, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="noor-event-card-shell">
                <div className="noor-event-badge-row">
                  <span className="noor-event-badge">✦ PHASE {idx + 1} ✦</span>
                  {idx === 0 && <span className="noor-featured-pill">MAIN CEREMONY</span>}
                </div>

                <h3 className="noor-event-name">{evt.name || evt.title}</h3>

                <div className="noor-event-details-stack">
                  <div className="noor-event-meta-item">
                    <CalendarBlank size={16} weight="fill" className="text-[#D4AF37] shrink-0" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="noor-event-meta-item">
                    <Clock size={16} weight="fill" className="text-[#D4AF37] shrink-0" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="noor-event-meta-item">
                    <MapPin size={16} weight="fill" className="text-[#D4AF37] shrink-0" />
                    <span>{evt.venue || evt.location}</span>
                  </div>
                </div>

                {evt.description && (
                  <p className="noor-event-desc">{evt.description}</p>
                )}

                <div className="noor-event-card-footer">
                  <a
                    href={venueMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="noor-event-map-btn"
                  >
                    <span>View Venue Details</span>
                    <span className="noor-btn-circle-icon">
                      <ArrowSquareOut size={13} weight="bold" />
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 4: CURATED PHOTO GALLERY (Interactive Bento Grid & Slider)  */}
      {/* =================================================================== */}
      <section className="noor-section noor-gallery-section">
        <motion.div 
          className="noor-section-header text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="noor-hero-eyebrow">OUR MOMENTS IN TIME</span>
          <h2 className="noor-section-title">Cherished Memories</h2>
          <div className="noor-section-filigree">✦ ⚜ ✦</div>

          {/* Interactive View Mode Switcher Pills */}
          <div className="noor-gallery-toggle-wrap">
            <button
              className={`noor-toggle-btn ${galleryViewMode === "bento" ? "is-active" : ""}`}
              onClick={() => setGalleryViewMode("bento")}
              aria-label="Switch to Bento Grid layout"
            >
              <SquaresFour size={15} weight="fill" />
              <span>Bento Mosaic</span>
            </button>
            <button
              className={`noor-toggle-btn ${galleryViewMode === "slider" ? "is-active" : ""}`}
              onClick={() => setGalleryViewMode("slider")}
              aria-label="Switch to Cinematic Slider layout"
            >
              <FilmStrip size={15} weight="fill" />
              <span>Cinematic Slider</span>
            </button>
          </div>
        </motion.div>

        {/* 4A. ADAPTIVE BENTO / GRID VIEW */}
        {galleryViewMode === "bento" && (
          <motion.div 
            className={`noor-gallery-bento-grid ${galleryImages.length === 1 ? "is-single-photo" : galleryImages.length === 2 ? "is-two-photos" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {galleryImages.map((imgUrl, i) => {
              const meta = galleryCaptions[i % galleryCaptions.length];
              const isLarge = galleryImages.length >= 3 && i === 0;
              const isWide = galleryImages.length >= 4 && i === 3;
              return (
                <motion.div
                  key={i}
                  className={`noor-bento-item ${isLarge ? "bento-large" : ""} ${isWide ? "bento-wide" : ""}`}
                  onClick={() => setSelectedPhoto(imgUrl)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  whileHover={{ y: -6, scale: 1.015 }}
                >
                  <img
                    src={imgUrl}
                    alt={meta.title}
                    className="noor-bento-img"
                    loading="lazy"
                  />
                  <div className="noor-bento-glass-overlay">
                    <div className="noor-bento-caption">
                      <p className="noor-bento-title">
                        {galleryImages.length === 1 ? `${brideName} & ${groomName}` : meta.title}
                      </p>
                      <p className="noor-bento-sub">
                        {galleryImages.length === 1 ? "Cherished Wedding Moment" : meta.subtitle}
                      </p>
                    </div>
                    <span className="noor-bento-tap-icon">
                      <Sparkle size={14} weight="fill" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* 4B. CINEMATIC INTERACTIVE SLIDER VIEW */}
        {galleryViewMode === "slider" && (
          <motion.div 
            className="noor-gallery-slider-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="noor-slider-frame">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlideIndex}
                  className="noor-slider-active-slide"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setSelectedPhoto(galleryImages[activeSlideIndex])}
                >
                  <img
                    src={galleryImages[activeSlideIndex]}
                    alt={galleryCaptions[activeSlideIndex % galleryCaptions.length].title}
                    className="noor-slider-img"
                  />
                  <div className="noor-slider-caption-badge">
                    <p className="noor-slider-title">
                      {galleryCaptions[activeSlideIndex % galleryCaptions.length].title}
                    </p>
                    <p className="noor-slider-sub">
                      {galleryCaptions[activeSlideIndex % galleryCaptions.length].subtitle}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Navigation Buttons */}
              <button 
                className="noor-slider-nav-btn prev"
                onClick={prevSlide}
                aria-label="Previous photo"
              >
                <CaretLeft size={20} weight="bold" />
              </button>
              <button 
                className="noor-slider-nav-btn next"
                onClick={nextSlide}
                aria-label="Next photo"
              >
                <CaretRight size={20} weight="bold" />
              </button>
            </div>

            {/* Pagination Indicators */}
            <div className="noor-slider-dots-row">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  className={`noor-slider-dot ${idx === activeSlideIndex ? "is-active" : ""}`}
                  onClick={() => setActiveSlideIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
              <span className="noor-slider-count-label">
                {String(activeSlideIndex + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        )}
      </section>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="noor-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div 
              className="noor-lightbox-card"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto}
                alt="Enlarged celebration moment"
                className="noor-lightbox-img"
              />
              <button
                className="noor-lightbox-close-btn"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photo preview"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================================================================== */}
      {/* SECTION 5: VENUE & DRESS CODE CONCIERGE BENTO                      */}
      {/* =================================================================== */}
      <section className="noor-section noor-venue-section">
        <motion.div 
          className="noor-section-header text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="noor-hero-eyebrow">LOCATION & GUIDELINES</span>
          <h2 className="noor-section-title">The Grand Venue & Concierge</h2>
          <div className="noor-section-filigree">✦ ⚜ ✦</div>
        </motion.div>

        <div className="noor-venue-bento-grid">
          {/* Card 1: Palace Location & GPS Navigation */}
          <motion.div 
            className="noor-venue-card"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="noor-venue-card-inner">
              <div className="noor-card-icon-pill">
                <Compass size={22} weight="fill" className="text-[#D4AF37]" />
              </div>

              <span className="noor-event-badge">PALACE LOCATION</span>
              <h3 className="noor-venue-title">{venueName}</h3>
              <p className="noor-venue-address">{venueAddress}</p>

              <div className="noor-venue-actions-row">
                <a
                  href={venueMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="noor-btn-gold"
                >
                  <span>Open in Google Maps</span>
                  <ArrowSquareOut size={16} weight="bold" />
                </a>

                <button
                  type="button"
                  className="noor-btn-outline"
                  onClick={handleCopyAddress}
                  aria-label="Copy Address"
                >
                  {copiedAddress ? (
                    <>
                      <CheckCircle size={16} weight="fill" className="text-emerald-700" />
                      <span>Copied! ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} weight="fill" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Royal Dress Code & Harmony Palette */}
          <motion.div 
            className="noor-dresscode-card"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="noor-dresscode-inner">
              <div className="noor-card-icon-pill">
                <MoonStars size={22} weight="fill" className="text-[#D4AF37]" />
              </div>

              <span className="noor-event-badge">ATTIRE & HARMONY</span>
              <h3 className="noor-dresscode-title">Royal Traditional & Modest</h3>
              <p className="noor-dresscode-desc">
                {data?.dressCodeText ||
                  "Guests are graciously invited to don modest royal traditional attire in soft ivory, royal emerald, antique gold, or champagne tones."}
              </p>

              {/* Color Swatch Harmony Pills */}
              <div className="noor-swatch-palette">
                <div className="noor-swatch-item">
                  <span className="noor-swatch-circle" style={{ backgroundColor: "#FBF9F5", border: "1px solid #D4AF37" }} />
                  <span className="noor-swatch-label">Ivory</span>
                </div>
                <div className="noor-swatch-item">
                  <span className="noor-swatch-circle" style={{ backgroundColor: "#1B3D2F" }} />
                  <span className="noor-swatch-label">Emerald</span>
                </div>
                <div className="noor-swatch-item">
                  <span className="noor-swatch-circle" style={{ backgroundColor: "#D4AF37" }} />
                  <span className="noor-swatch-label">Antique Gold</span>
                </div>
                <div className="noor-swatch-item">
                  <span className="noor-swatch-circle" style={{ backgroundColor: "#EFE8DC" }} />
                  <span className="noor-swatch-label">Parchment</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 6: RSVP & SACRED DUAS PORTAL                               */}
      {/* =================================================================== */}
      <section className="noor-section noor-rsvp-section">
        <motion.div 
          className="noor-rsvp-box"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="noor-rsvp-box-inner">
            <div className="noor-section-header text-center mb-6">
              <span className="noor-hero-eyebrow">HONOR US WITH YOUR PRESENCE</span>
              <h2 className="noor-section-title">RSVP & Sacred Duas</h2>
              <div className="noor-section-filigree">✦ ⚜ ✦</div>
              <p className="noor-rsvp-intro">
                Please confirm your attendance so we may prepare the warmest welcome for you and your family.
              </p>
            </div>

            {isSubmitted ? (
              <motion.div 
                className="noor-rsvp-success-card text-center"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="noor-success-icon-wrap">
                  <Check size={28} weight="bold" />
                </div>
                <h3 className="noor-success-title">JazakAllah Khair!</h3>
                <p className="noor-success-sub">
                  Thank you, <strong>{rsvpName || "Dear Guest"}</strong>! Your response and beautiful duas have been saved with immense gratitude.
                </p>

                <div className="mt-5 pt-4 border-t border-[rgba(212,175,55,0.2)] flex flex-col gap-2.5 max-w-xs mx-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setRsvpName("");
                      setRsvpDua("");
                    }}
                    className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#122A1E] font-bold text-xs rounded-xl uppercase tracking-wider transition-all"
                  >
                    Done
                  </button>
                </div>

                <div className="noor-success-monogram mt-4">
                  {brideName} & {groomName}
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="noor-rsvp-form">
                {/* Full Name */}
                <div className="noor-form-group">
                  <label className="noor-form-label">Your Full Name / Family Name</label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="e.g., Tariq Al-Mansoor & Family"
                    className="noor-form-input"
                  />
                </div>

                {/* Attendance & Guest Count Grid */}
                <div className="noor-form-grid-2">
                  <div className="noor-form-group">
                    <label className="noor-form-label">Attendance</label>
                    <select
                      value={rsvpAttending}
                      onChange={(e) => setRsvpAttending(e.target.value)}
                      className="noor-form-select"
                    >
                      <option value="yes">✦ Joyfully Attending</option>
                      <option value="no">✕ Regretfully Declining</option>
                    </select>
                  </div>

                  <div className="noor-form-group">
                    <label className="noor-form-label">Number of Guests</label>
                    <select
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(e.target.value)}
                      className="noor-form-select"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Guests</option>
                    </select>
                  </div>
                </div>

                {/* Duas & Wishes */}
                <div className="noor-form-group">
                  <label className="noor-form-label">Your Sacred Duas & Wishes</label>
                  <textarea
                    rows={3}
                    value={rsvpDua}
                    onChange={(e) => setRsvpDua(e.target.value)}
                    placeholder="May Allah bless this union with eternal joy, barakah, and righteous companionship..."
                    className="noor-form-textarea"
                  />
                </div>

                <button type="submit" className="noor-btn-gold-submit">
                  <Heart size={18} weight="fill" />
                  <span>Send Blessings & RSVP</span>
                  <Sparkle size={16} weight="fill" />
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 7: REGAL FOOTER & MONOGRAM WATERMARK                        */}
      {/* =================================================================== */}
      <footer className="noor-footer">
        <div className="noor-footer-inner text-center">
          {/* Back to top smooth jump button */}
          <button 
            type="button" 
            className="noor-scroll-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
          >
            <ArrowUp size={16} weight="bold" />
            <span>Back to Top</span>
          </button>

          <div className="noor-footer-monogram-circle">
            <span className="noor-footer-monogram">{brideName[0]}&{groomName[0]}</span>
          </div>

          <h3 className="noor-footer-names">{brideName} & {groomName}</h3>
          <p className="noor-footer-date-venue">{formattedDate} · {venueName}</p>

          <div className="noor-footer-divider">
            <span>✦</span>
            <span className="noor-card-divider-line" />
            <span>✦</span>
          </div>

          <p className="noor-footer-signature">
            "And He has placed between you affection and mercy" — Surah Ar-Rum 30:21
          </p>

          <p className="noor-footer-credits">
            Crafted with love on WedInvites • wedinvites.in
          </p>
        </div>
      </footer>
    </div>
  );
}
