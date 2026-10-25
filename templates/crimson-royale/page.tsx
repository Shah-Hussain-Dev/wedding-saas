"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import confetti from "canvas-confetti";
import { Lottie } from "lottie-react";
import {
  CalendarBlank,
  Clock,
  MapPin,
  Heart,
  Sparkle,
  CaretRight,
  CaretLeft,
  X,
  CheckCircle,
  Compass,
  Palette,
  Images,
  Eye,
  WhatsappLogo
} from "@phosphor-icons/react";
import defaultData from "./data.json";
import { TemplateMarketingFooter } from "@/components/invitation/TemplateMarketingFooter";
import "./style.css";

// Theme-tailored Lottie Animations
import crimsonRoyalSeal from "@/public/lottie-icons/crimson-royal-seal.json";
import crimsonGoldDiya from "@/public/lottie-icons/crimson-gold-diya.json";
import crimsonWeddingRings from "@/public/lottie-icons/crimson-wedding-rings.json";
import crimsonRoyalFloral from "@/public/lottie-icons/crimson-royal-floral.json";
import paperPlaneHeart from "@/public/lottie-icons/Paper Plane Heart.json";

export interface EventItem {
  id?: string;
  title?: string;
  name?: string;
  date: string;
  time: string;
  location?: string;
  venue?: string;
  description?: string;
  detail?: string;
  mapsUrl?: string;
}

export interface CrimsonRoyaleData {
  id?: string;
  brideName?: string;
  groomName?: string;
  couple?: {
    brideName?: string;
    groomName?: string;
    brideParents?: string;
    groomParents?: string;
  };
  brideParents?: string;
  groomParents?: string;
  sacred?: {
    invocation?: string;
    shloka?: string;
    shlokaTranslation?: string;
    [key: string]: any;
  };
  welcomeMessage?: string;
  weddingDate?: Date | string;
  date?: Date | string;
  weddingTime?: string;
  venueName?: string;
  venueAddress?: string;
  venue?: {
    name?: string;
    address?: string;
    mapUrl?: string;
  };
  events?: EventItem[];
  eventsJson?: EventItem[];
  gallery?: any[];
  slideshowImages?: any[];
  galleryImages?: any[];
  musicUrl?: string;
  musicTrack?: string;
  [key: string]: any;
}

export interface CrimsonRoyaleProps {
  data?: CrimsonRoyaleData;
  siteId?: string;
  isPreview?: boolean;
  initialVariant?: "default" | "lantern" | "love" | "hinduism";
}

export interface BgVariantDefinition {
  id: "default" | "lantern" | "love" | "hinduism";
  name: string;
  type: "image" | "video";
  preview: string;
  desktopUrl: string;
  tabletUrl?: string;
  mobileUrl?: string;
}

export const BG_VARIANTS: BgVariantDefinition[] = [
  {
    id: "default",
    name: "Default",
    preview: "/templates/crimson-royale/bg-default.webp",
    type: "image",
    desktopUrl: "/templates/crimson-royale/bg-default.webp",
    tabletUrl: "/templates/crimson-royale/bg-default.webp",
    mobileUrl: "/templates/crimson-royale/bg-default-mobile.jpg"
  },
  {
    id: "lantern",
    name: "Lantern",
    preview: "/templates/crimson-royale/bg-lantern.webp",
    type: "image",
    desktopUrl: "/templates/crimson-royale/bg-lantern.webp",
    tabletUrl: "/templates/crimson-royale/bg-lantern-tablet.webp",
    mobileUrl: "/templates/crimson-royale/bg-lantern-mobile.webp"
  },
  {
    id: "love",
    name: "Love",
    preview: "/templates/crimson-royale/bg-love.mp4",
    type: "video",
    desktopUrl: "/templates/crimson-royale/bg-love.mp4",
    tabletUrl: "/templates/crimson-royale/bg-love-tablet.mp4",
    mobileUrl: "/templates/crimson-royale/bg-love-mobile.mp4"
  },
  {
    id: "hinduism",
    name: "Hinduism",
    preview: "/templates/crimson-royale/bg-hinduism.webp",
    type: "image",
    desktopUrl: "/templates/crimson-royale/bg-hinduism.webp",
    tabletUrl: "/templates/crimson-royale/bg-hinduism-tablet.webp",
    mobileUrl: "/templates/crimson-royale/bg-hinduism-mobile.webp"
  },
];

const GALLERY_TITLES = [
  "The Proposal",
  "Forever & Always",
  "Udaipur Whispers",
  "Pre-Wedding Elegance",
  "Sacred Vows",
  "Eternal Bond"
];

export default function CrimsonRoyale({
  data,
  siteId,
  isPreview = false,
  initialVariant = "default"
}: CrimsonRoyaleProps) {
  const [selectedVariant, setSelectedVariant] = useState<"default" | "lantern" | "love" | "hinduism">(initialVariant);
  const [hasPickedBg, setHasPickedBg] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const [showPaletteMenu, setShowPaletteMenu] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parallax Section Refs for Odd (Media) Sections
  const heroRef = useRef<HTMLDivElement>(null);
  const scratchSectionRef = useRef<HTMLDivElement>(null);
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const venueSectionRef = useRef<HTMLDivElement>(null);

  // Parallax Scroll Tracking - Multi-layer silky smooth transforms
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroBgY = useTransform(heroProgress, [0, 1], ["0%", "22%"]);
  const heroBgScale = useTransform(heroProgress, [0, 1], [1, 1.16]);
  const heroCardY = useTransform(heroProgress, [0, 1], ["0px", "45px"]);
  const heroCardOpacity = useTransform(heroProgress, [0, 0.85], [1, 0.15]);

  const { scrollYProgress: scratchProgress } = useScroll({ target: scratchSectionRef, offset: ["start end", "end start"] });
  const scratchBgY = useTransform(scratchProgress, [0, 1], ["-12%", "12%"]);
  const scratchBgScale = useTransform(scratchProgress, [0, 1], [1.04, 1.16]);
  const scratchDecorY1 = useTransform(scratchProgress, [0, 1], ["-50px", "50px"]);
  const scratchDecorY2 = useTransform(scratchProgress, [0, 1], ["60px", "-60px"]);
  const scratchCardY = useTransform(scratchProgress, [0, 1], ["25px", "-25px"]);

  const { scrollYProgress: galleryProgress } = useScroll({ target: gallerySectionRef, offset: ["start end", "end start"] });
  const galleryBgY = useTransform(galleryProgress, [0, 1], ["-14%", "14%"]);
  const galleryBgScale = useTransform(galleryProgress, [0, 1], [1.04, 1.16]);
  // Staggered column parallax for 3D salon wall depth
  const galleryCol1Y = useTransform(galleryProgress, [0, 1], ["30px", "-30px"]);
  const galleryCol2Y = useTransform(galleryProgress, [0, 1], ["-25px", "25px"]);
  const galleryCol3Y = useTransform(galleryProgress, [0, 1], ["20px", "-20px"]);

  const { scrollYProgress: venueProgress } = useScroll({ target: venueSectionRef, offset: ["start end", "end start"] });
  const venueBgY = useTransform(venueProgress, [0, 1], ["-12%", "12%"]);
  const venueBgScale = useTransform(venueProgress, [0, 1], [1.04, 1.16]);
  const venueDecorRotate = useTransform(venueProgress, [0, 1], [0, 45]);
  const venueCardY = useTransform(venueProgress, [0, 1], ["25px", "-25px"]);

  // Couple Data normalization
  const brideName = data?.brideName || data?.couple?.brideName || defaultData.couple?.brideName || "Ananya";
  const groomName = data?.groomName || data?.couple?.groomName || defaultData.couple?.groomName || "Shubham";
  const brideParents = data?.brideParents || data?.couple?.brideParents || defaultData.couple?.brideParents || "Mrs. Radhika & Mr. Harshvardhan Singhania";
  const groomParents = data?.groomParents || data?.couple?.groomParents || defaultData.couple?.groomParents || "Mrs. Anuradha & Mr. Yashwant Rathore";
  const vedicShloka = data?.sacred?.shloka || defaultData.sacred?.shloka || "|| मङ्गलम् भगवान विष्णुः मङ्गलम् गरुडध्वजः | मङ्गलम् पुण्डरीकाक्षः मङ्गलाय तनो हरिः ||";
  const shlokaTranslation = data?.sacred?.shlokaTranslation || defaultData.sacred?.shlokaTranslation || "All auspiciousness to Lord Vishnu, the lotus-eyed Supreme, and may the Divine grace this holy marriage with lifelong harmony and peace.";

  const rawDate = data?.weddingDate || data?.date || defaultData.weddingDate || "2026-12-22T17:00:00";
  const weddingDate = new Date(rawDate);
  const formattedDate = !isNaN(weddingDate.getTime())
    ? weddingDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "Tuesday, December 22, 2026";

  // RSVP Form State & Handlers
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpAttending, setRsvpAttending] = useState("yes");
  const [rsvpGuests, setRsvpGuests] = useState("2");
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpWishes, setRsvpWishes] = useState("");
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRsvpSubmitted(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#9E2A2B", "#F5E5A3", "#FFFFFF"],
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
          message: rsvpWishes,
          rsvpJson: {
            phone: rsvpPhone,
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

  const venueName = data?.venueName || data?.venue?.name || "The Ridgewood Estate";
  const venueAddress = data?.venueAddress || data?.venue?.address || "Fatehsagar Lake Road, Udaipur, Rajasthan 313001";
  const venueMapUrl = data?.venue?.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(venueName + " " + venueAddress)}`;

  const rawEvents = data?.events || data?.eventsJson;
  const events: EventItem[] = (rawEvents && rawEvents.length > 0)
    ? rawEvents
    : [
      {
        id: "1",
        title: "Haldi",
        date: "Dec 21, 2026",
        time: "10:00 AM",
        location: "Courtyard Garden",
        description: "An auspicious morning filled with golden turmeric, laughter, and blessings.",
      },
      {
        id: "2",
        title: "Mehendi",
        date: "Dec 21, 2026",
        time: "03:00 PM",
        location: "Royal Banquet Hall",
        description: "An enchanting afternoon of intricate henna artistry and traditional folk songs.",
      },
      {
        id: "3",
        title: "Sangeet",
        date: "Dec 21, 2026",
        time: "07:30 PM",
        location: "Grand Ballroom",
        description: "A night of rhythmic beats, musical performances, and spirited dance celebration.",
      },
      {
        id: "4",
        title: "Wedding Ceremony",
        date: "Dec 22, 2026",
        time: "04:30 PM",
        location: "Lakeside Mandap",
        description: "The sacred nuptial vows as we unite in the presence of the holy fire under starry skies.",
      },
      {
        id: "5",
        title: "Reception",
        date: "Dec 22, 2026",
        time: "08:00 PM",
        location: "The Ridgewood Grand Ballroom",
        description: "Join us for a royal dinner feast, champagne toasts, and midnight celebrations.",
      },
    ];

  const rawGallery = data?.gallery || data?.slideshowImages || data?.galleryImages;
  const galleryImages: string[] = (rawGallery && Array.isArray(rawGallery) && rawGallery.length > 0)
    ? rawGallery.map((g: any) => (typeof g === "string" ? g : g?.url || g?.src || "")).filter(Boolean)
    : [
      "/templates/crimson-royale/gallery-1.webp",
      "/templates/crimson-royale/gallery-2.webp",
      "/templates/crimson-royale/gallery-3.webp",
      "/templates/crimson-royale/gallery-4.webp",
      "/templates/crimson-royale/gallery-5.webp",
      "/templates/crimson-royale/gallery-6.webp",
    ];

  // Handle Invitation Opening
  const handleOpenInvitation = () => {
    if (isOpening) return;
    setIsOpening(true);

    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.log("Audio autoplay restricted:", e);
      });
    }

    setTimeout(() => {
      setIsOpen(true);
    }, 1300);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const currentBgObj = BG_VARIANTS.find(v => v.id === selectedVariant) || BG_VARIANTS[0];

  return (
    <div className="tmpl-crimson-royale" data-variant={selectedVariant}>
      {/* Floating Ambient Stardust Particles */}
      <div className="ambient-particles" aria-hidden="true">
        {[...Array(16)].map((_, i) => (
          <span
            key={i}
            className="ambient-particle"
            style={{
              width: `${(i % 3) * 2 + 3}px`,
              height: `${(i % 3) * 2 + 3}px`,
              left: `${(i * 6.25) + 1}%`,
              animationDuration: `${12 + (i % 6) * 3}s`,
              animationDelay: `${(i * 1.2) % 8}s`,
            }}
          />
        ))}
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={data?.musicUrl || data?.musicTrack || "/templates/crimson-royale/music.mp3"}
        loop
        preload="auto"
      />

      {/* 0. Initial Hero Background Picker Screen (Modal) */}
      <AnimatePresence>
        {!hasPickedBg && (
          <motion.div
            className="bg-picker-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <p className="bg-picker-eyebrow">BEFORE YOU PREVIEW</p>
            <h2 className="bg-picker-title">Choose your hero background</h2>
            <p className="bg-picker-desc">
              This is the very first thing your guests will see. Pick one to preview the template with it — you (or your couple) can always change it later in the editor.
            </p>

            <div className="bg-picker-grid">
              {BG_VARIANTS.map((v) => (
                <div
                  key={v.id}
                  className="bg-picker-card"
                  onClick={() => {
                    setSelectedVariant(v.id);
                    setHasPickedBg(true);
                  }}
                >
                  {v.type === "video" ? (
                    <video autoPlay loop muted playsInline src={v.preview} />
                  ) : (
                    <img src={v.preview} alt={v.name} />
                  )}
                  <span className="bg-picker-card-label">{v.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Royal Dual Split-Door Gate Opening Overlay */}
      <AnimatePresence>
        {hasPickedBg && !isOpen && (
          <div className={`gate ${isOpening ? "gate--opening" : ""}`}>
            <div className="gate__door gate__door--left">
              <div className="gate__panel-border" />
              <div className="gate__seam-glow" />
            </div>

            <div className="gate__door gate__door--right">
              <div className="gate__panel-border" />
              <div className="gate__seam-glow" />
            </div>

            <div className="gate__center">
              {/* Auspicious Royal Header */}
              <div className="gate__header">
                <span className="gate__emblem">✦ ⚜ ✦</span>
                <p className="gate__eyebrow">THE WEDDING CELEBRATION OF</p>
                <h1 className="gate__names">
                  {brideName} <span className="gate__amp">&</span> {groomName}
                </h1>
                <p className="gate__invitation-text">Cordially invite you to celebrate our union</p>
              </div>

              {/* Royal Wax Seal Tap Interaction */}
              <div className="gate__seal-wrapper">
                <button
                  className="gate__seal-btn"
                  onClick={handleOpenInvitation}
                  aria-label="Open the wedding invitation"
                  type="button"
                >
                  <div className="gate__seal-lottie-container">
                    <Lottie src={crimsonRoyalSeal} loop autoplay />
                  </div>
                  <div className="gate__seal-pill">
                    <span className="gate__seal-sparkle">✦</span>
                    <span className="gate__seal-pill-text">TAP TO OPEN</span>
                    <span className="gate__seal-sparkle">✦</span>
                  </div>
                </button>
              </div>

              {/* Date & Tap hint */}
              <div className="gate__footer-hint">
                <p className="gate__date-text">{formattedDate}</p>
                <p className="gate__subhint">Touch royal seal to unfold the invitation & music</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Controls */}
      {isOpen && (
        <>
          {/* Music Equalizer Button */}
          <button
            className={`music-toggle ${isPlaying ? "music-toggle--playing" : ""}`}
            onClick={toggleMusic}
            aria-label={isPlaying ? "Pause background music" : "Play background music"}
            title="Music Toggle"
          >
            <span className="music-toggle__bar" />
            <span className="music-toggle__bar" />
            <span className="music-toggle__bar" />
          </button>

          {/* Floating Theme Background Selector */}
          <div style={{ position: "fixed", bottom: "2rem", left: "2rem", zIndex: 900 }}>
            <button
              onClick={() => setShowPaletteMenu(!showPaletteMenu)}
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "var(--maroon-deep)",
                border: "1px solid var(--gold)",
                color: "var(--gold-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
              }}
              title="Change Royal Theme Background"
            >
              <Palette size={22} weight="fill" />
            </button>

            {showPaletteMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  position: "absolute",
                  bottom: "3.8rem",
                  left: 0,
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "16px",
                  padding: "0.85rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                  boxShadow: "0 14px 40px rgba(0,0,0,0.4)",
                  minWidth: "190px",
                  backdropFilter: "blur(14px)"
                }}
              >
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--gold-deep)", fontWeight: 700, paddingBottom: "4px", borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
                  Hero Backgrounds (4)
                </div>
                {BG_VARIANTS.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant.id);
                      setShowPaletteMenu(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      padding: "0.5rem 0.6rem",
                      borderRadius: "10px",
                      border: "none",
                      background: selectedVariant === variant.id ? "rgba(212,175,55,0.25)" : "transparent",
                      color: "var(--ink)",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: selectedVariant === variant.id ? 600 : 400,
                      textAlign: "left"
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "4px",
                        border: "1px solid var(--gold)",
                        background: variant.id === "love" ? "#6b1424" : variant.id === "lantern" ? "#8c2032" : variant.id === "hinduism" ? "#b86214" : "#420f18"
                      }}
                    />
                    <span>{variant.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* Main Content Sections (ODD: Image Media + Parallax | EVEN: Color Gradient) */}
      <main>
        {/* SECTION 1 (ODD): Hero (Dedicated Hero Background Media with Parallax) */}
        <section ref={heroRef} className="hero">
          <div className="section__bg-wrap">
            <motion.div style={{ y: heroBgY, scale: heroBgScale, width: "100%", height: "100%", position: "absolute", inset: 0 }}>
              {currentBgObj.type === "video" ? (
                <video
                  key={currentBgObj.id}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="section__bg-media"
                >
                  {currentBgObj.mobileUrl && (
                    <source src={currentBgObj.mobileUrl} media="(max-width: 768px)" type="video/mp4" />
                  )}
                  {currentBgObj.tabletUrl && (
                    <source src={currentBgObj.tabletUrl} media="(max-width: 1024px)" type="video/mp4" />
                  )}
                  <source src={currentBgObj.desktopUrl} type="video/mp4" />
                </video>
              ) : (
                <picture>
                  {currentBgObj.mobileUrl && (
                    <source srcSet={currentBgObj.mobileUrl} media="(max-width: 768px)" />
                  )}
                  {currentBgObj.tabletUrl && (
                    <source srcSet={currentBgObj.tabletUrl} media="(max-width: 1024px)" />
                  )}
                  <img
                    key={currentBgObj.id}
                    src={currentBgObj.desktopUrl}
                    alt="Royal Palace Background"
                    className="section__bg-media"
                  />
                </picture>
              )}
            </motion.div>
            <div className="section__bg-overlay" />
            <div className="section__bottom-fade" />
          </div>

          <motion.div
            className="hero__content"
            style={{ y: heroCardY, opacity: heroCardOpacity }}
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={isOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 35, scale: 0.96 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="eyebrow">The Wedding Of</p>
            <h1 className="hero__names">
              <span>{brideName}</span>
              <span className="hero__amp">&</span>
              <span>{groomName}</span>
            </h1>
            <div className="divider">✦</div>
            <p className="hero__date">{formattedDate}</p>
            <p className="hero__sub script">Together with their families</p>
          </motion.div>
        </section>

        {/* SECTION 2 (EVEN): Sacred Invocation & Elders' Blessing (Rich Royal Velvet Color Gradient) */}
        <section className="section section--welcome">
          <motion.div
            className="section-inner"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="royal-card" style={{ maxWidth: 740 }}>
              <div style={{ width: "clamp(260px, 45vw, 360px)", height: "115px", margin: "0 auto 0.5rem auto" }}>
                <Lottie src={crimsonRoyalFloral} loop autoplay />
              </div>
              <div className="inline-block px-4 py-1 rounded-full bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.35)] text-[var(--gold)] font-bold text-xs tracking-widest mb-3">
                || श्री गणेशाय नमः ||
              </div>
              <p className="font-serif text-lg sm:text-xl font-bold text-[var(--gold)] leading-relaxed tracking-wide my-2 px-4">
                {vedicShloka}
              </p>
              <p className="text-xs sm:text-sm text-[#F5E5A3]/90 italic max-w-lg mx-auto mb-4 px-4">
                &ldquo;{shlokaTranslation}&rdquo;
              </p>

              <div className="divider">✦ ⚜ ✦</div>

              <p className="eyebrow" style={{ marginBottom: "0.4rem" }}>WITH THE BLESSINGS OF OUR ELDERS</p>
              <h2 className="welcome__title">Royal Shubh Vivah Invitation</h2>

              <p className="welcome__body leading-relaxed max-w-xl mx-auto mt-2">
                With the divine grace of <strong>Lord Ganesha</strong> and the affectionate prayers of our beloved parents and elders:
              </p>

              <div className="my-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 font-serif font-bold text-base sm:text-lg text-[var(--gold)]">
                <span>{brideParents}</span>
                <span className="text-[var(--gold-soft)] text-xs opacity-70">❖ &amp; ❖</span>
                <span>{groomParents}</span>
              </div>

              <p className="welcome__body text-xs sm:text-sm text-[#FAF7F2]/90 max-w-xl mx-auto leading-relaxed">
                cordially invite you to celebrate the sacred union and shower your warm blessings upon their beloved children:
              </p>

              <p className="font-serif text-2xl sm:text-3xl font-bold text-[var(--gold)] mt-3 tracking-wide">
                {brideName} <span className="text-[#FAF7F2] font-normal">&amp;</span> {groomName}
              </p>

              <p className="text-xs sm:text-sm text-[var(--gold-soft)] italic font-medium mt-3">
                &ldquo;Aapki upasthiti aur aashirwad hamare is vivah utsav ko mangalmay banayenge.&rdquo;
              </p>
            </div>
          </motion.div>
        </section>

        {/* SECTION 3 (ODD): Save The Date Scratch Card (Palace Courtyard Image Media + Parallax) */}
        <section ref={scratchSectionRef} className="section section--scratch">
          <div className="section__bg-wrap">
            <motion.div style={{ y: scratchBgY, scale: scratchBgScale, width: "100%", height: "100%", position: "absolute", inset: 0 }}>
              <picture>
                <source srcSet="/templates/crimson-royale/bg-welcome-mobile.jpg" media="(max-width: 768px)" />
                <img
                  src="/templates/crimson-royale/bg-welcome-desktop.jpg"
                  alt="Palace Courtyard with Candlelight"
                  className="section__bg-media"
                  loading="lazy"
                />
              </picture>
            </motion.div>

            {/* Floating Ambient Parallax Motifs */}
            <motion.div
              style={{ y: scratchDecorY1, position: "absolute", top: "15%", left: "8%", pointerEvents: "none", opacity: 0.35 }}
              className="parallax-decor-orb"
            >
              <Sparkle size={48} color="var(--gold)" weight="fill" />
            </motion.div>
            <motion.div
              style={{ y: scratchDecorY2, position: "absolute", bottom: "18%", right: "8%", pointerEvents: "none", opacity: 0.35 }}
              className="parallax-decor-orb"
            >
              <Sparkle size={64} color="var(--gold-soft)" weight="fill" />
            </motion.div>

            <div className="section__bg-overlay" style={{ background: "radial-gradient(circle at center, rgba(14, 2, 4, 0.62) 0%, rgba(8, 1, 3, 0.88) 85%, rgba(6, 1, 2, 0.98) 100%)" }} />
            <div className="section__top-fade" />
            <div className="section__bottom-fade" />
          </div>

          <motion.div
            className="section-inner"
            style={{ y: scratchCardY }}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="royal-card" style={{ maxWidth: 680 }}>
              <div style={{ width: 100, height: 100, margin: "0 auto 0.2rem auto" }}>
                <Lottie src={crimsonGoldDiya} loop autoplay />
              </div>
              <h2 className="scratch__title" style={{ marginTop: "0.2rem" }}>Save The Date</h2>
              <ScratchCard
                dayName={!isNaN(weddingDate.getTime()) ? weddingDate.toLocaleDateString("en-US", { weekday: "long" }) : "Tuesday"}
                fullDate={!isNaN(weddingDate.getTime()) ? weddingDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "December 22, 2026"}
                time="Auspicious Muhurat · 05:00 PM"
              />
              <p className="scratch__cta script">Scratch the gold foil to reveal our wedding date</p>
            </div>
          </motion.div>
        </section>

        {/* SECTION 4 (EVEN): Live Countdown (Midnight Palace Arch Color Gradient) */}
        <section className="section section--countdown">
          <motion.div
            className="section-inner"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="royal-card" style={{ maxWidth: 750 }}>
              <div style={{ width: "clamp(180px, 32vw, 240px)", height: "150px", margin: "0 auto 0.3rem auto" }}>
                <Lottie src={crimsonWeddingRings} loop autoplay />
              </div>
              <h2 className="countdown__title" style={{ marginTop: "0.2rem" }}>Counting Down To Forever</h2>
              <CountdownTimer targetDate={weddingDate} />
            </div>
          </motion.div>
        </section>

        {/* SECTION 5 (ODD): Moments of Love (Royal Portrait Salon Gallery Image Media + Parallax) */}
        <section ref={gallerySectionRef} className="section section--gallery">
          <div className="section__bg-wrap">
            <motion.div style={{ y: galleryBgY, scale: galleryBgScale, width: "100%", height: "100%", position: "absolute", inset: 0 }}>
              <picture>
                <source srcSet="/templates/crimson-royale/bg-gallery-mobile.jpg" media="(max-width: 768px)" />
                <img
                  src="/templates/crimson-royale/bg-gallery-desktop.jpg"
                  alt="Palace Portrait Gallery Wall"
                  className="section__bg-media"
                  loading="lazy"
                />
              </picture>
            </motion.div>
            <div className="section__bg-overlay" style={{ background: "radial-gradient(circle at center, rgba(14, 2, 4, 0.58) 0%, rgba(8, 1, 3, 0.86) 85%, rgba(6, 1, 2, 0.98) 100%)" }} />
            <div className="section__top-fade" />
            <div className="section__bottom-fade" />
          </div>

          <motion.div
            className="section-inner"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="gallery__card-wrap">
              <p className="eyebrow" style={{ color: "var(--gold-soft)" }}>PORTRAIT SALON</p>
              <h2 className="gallery__title">Moments of Love</h2>
              <p className="gallery__subtitle script">Memories cherished through our journey</p>

              <div className="gallery__salon-grid">
                {galleryImages.map((src: string, idx: number) => {
                  const colParallax = idx % 3 === 0 ? galleryCol1Y : idx % 3 === 1 ? galleryCol2Y : galleryCol3Y;
                  return (
                    <motion.div
                      key={idx}
                      className="gallery__portrait-frame"
                      style={{ y: colParallax }}
                      onClick={() => setActivePhotoIdx(idx)}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                    >
                      <div className="gallery__portrait-inner">
                        <img src={src} alt={GALLERY_TITLES[idx] || `Couple Moment ${idx + 1}`} loading="lazy" />
                      </div>
                      <div className="gallery__plaque">
                        <span>{GALLERY_TITLES[idx] || `Portrait ${idx + 1}`}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 6 (EVEN): Events Timeline (Grand Ballroom Maroon Color Gradient) */}
        <section className="section section--timeline">
          <motion.div
            className="section-inner"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <h2 className="timeline__title">Ceremony & Events</h2>
            <div className="timeline__list">
              {events.map((event: EventItem, idx: number) => (
                <motion.div
                  key={event.id || idx}
                  className="timeline__row"
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -25 : 25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.12 }}
                >
                  <div className="timeline__mark">
                    <span className="timeline__dot" />
                  </div>
                  <div className="timeline__body">
                    <span className="timeline__when">{event.date} · {event.time}</span>
                    <h3 className="timeline__event">{event.title || event.name}</h3>
                    {(event.description || event.detail) && (
                      <p className="timeline__detail">{event.description || event.detail}</p>
                    )}
                    {(event.location || event.venue) && (
                      <p className="timeline__location">
                        <MapPin size={18} color="var(--gold)" weight="fill" />
                        <span>{event.location || event.venue}</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* SECTION 7 (ODD): Venue Card (Lakeside Twilight Palace Image Media + Parallax) */}
        <section ref={venueSectionRef} className="section section--venue">
          <div className="section__bg-wrap">
            <motion.div style={{ y: venueBgY, scale: venueBgScale, width: "100%", height: "100%", position: "absolute", inset: 0 }}>
              <picture>
                <source srcSet="/templates/crimson-royale/bg-venue-mobile.jpg" media="(max-width: 768px)" />
                <img
                  src="/templates/crimson-royale/bg-venue-desktop.jpg"
                  alt="Fatehsagar Lake Palace Twilight"
                  className="section__bg-media"
                  loading="lazy"
                />
              </picture>
            </motion.div>

            {/* Floating Ambient Parallax Compass Rose */}
            <motion.div
              style={{ rotate: venueDecorRotate, position: "absolute", top: "12%", right: "10%", pointerEvents: "none", opacity: 0.3 }}
              className="parallax-decor-orb"
            >
              <Compass size={80} color="var(--gold-soft)" weight="thin" />
            </motion.div>

            <div className="section__bg-overlay" style={{ background: "radial-gradient(circle at center, rgba(14, 2, 4, 0.58) 0%, rgba(8, 1, 3, 0.86) 85%, rgba(6, 1, 2, 0.98) 100%)" }} />
            <div className="section__top-fade" />
            <div className="section__bottom-fade" />
          </div>

          <motion.div
            className="section-inner"
            style={{ y: venueCardY }}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="royal-card" style={{ maxWidth: 700 }}>
              <h2 className="venue__title">The Destination</h2>
              <div className="divider">✦</div>
              <h3 className="venue__name">{venueName}</h3>
              <p className="venue__address">{venueAddress}</p>
              <a
                href={venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="venue__button"
              >
                <Compass size={20} weight="bold" />
                <span>GET DIRECTIONS</span>
              </a>
            </div>
          </motion.div>
        </section>

        {/* SECTION 8 (EVEN): RSVP Form (Velvet Wine & Gold Seal Color Gradient) */}
        <section className="section section--contact" id="rsvp">
          <motion.div
            className="section-inner"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="royal-card cr-rsvp-banner-card" style={{ maxWidth: 680 }}>
              <div style={{ width: 80, height: 80, margin: "0 auto -2px auto" }}>
                <Lottie src={paperPlaneHeart} loop autoplay />
              </div>
              <h2 className="script contact__title">Your Gracious Presence is Awaited</h2>
              <p className="eyebrow" style={{ color: "var(--maroon)" }}>
                {data?.rsvpDeadline || "Kindly confirm your presence by Dec 10, 2026"}
              </p>
              <div className="divider">✦</div>
              <p style={{ color: "var(--ink-soft)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 1.5rem auto" }}>
                We eagerly await your blessings and look forward to celebrating this royal union together. Please let us know if you will be joining us.
              </p>
              <motion.button
                type="button"
                className="cr-rsvp-open-btn"
                onClick={() => setIsRsvpOpen(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Confirm Your RSVP</span>
                <Sparkle size={18} weight="fill" />
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* SECTION 9 (EVEN): Closing Footer (Deep Midnight Crimson Heartbeat Gradient) */}
        <section className="section section--closing pb-0">
          <motion.div
            className="section-inner pb-10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <span className="closing__heart">❤</span>
            <h2 className="closing__title script">We can't wait to celebrate with you</h2>
            <p className="closing__names eyebrow">{brideName} & {groomName}</p>
          </motion.div>

          {/* ── Marketing Content At End of Template Footer ── */}
          <div className="w-full text-left">
            <TemplateMarketingFooter
              templateId="crimson-royale"
              templateName="Crimson Royale"
              brideName={brideName}
              groomName={groomName}
            />
          </div>
        </section>
      </main>

      {/* Lightbox Modal for Photo Gallery */}
      <AnimatePresence>
        {activePhotoIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              background: "rgba(10, 2, 4, 0.94)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem"
            }}
            onClick={() => setActivePhotoIdx(null)}
          >
            <button
              onClick={() => setActivePhotoIdx(null)}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "transparent",
                border: "none",
                color: "var(--gold-soft)",
                cursor: "pointer",
                zIndex: 2010
              }}
              aria-label="Close photo preview"
            >
              <X size={32} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIdx((prev) => (prev! > 0 ? prev! - 1 : galleryImages.length - 1));
              }}
              style={{
                position: "absolute",
                left: "1.5rem",
                background: "rgba(0,0,0,0.5)",
                border: "1px solid var(--gold)",
                borderRadius: "50%",
                width: 48,
                height: 48,
                color: "var(--gold-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
              aria-label="Previous photo"
            >
              <CaretLeft size={28} />
            </button>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem", maxWidth: "90vw", maxHeight: "88vh" }} onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={activePhotoIdx}
                src={galleryImages[activePhotoIdx]}
                alt="Gallery Preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "78vh",
                  borderRadius: "12px",
                  border: "2px solid var(--gold)",
                  objectFit: "contain",
                  boxShadow: "0 0 35px rgba(212, 175, 55, 0.4)"
                }}
              />
              <span style={{ color: "var(--gold-soft)", fontFamily: "var(--font-display)", fontSize: "1.2rem", letterSpacing: "0.08em" }}>
                {GALLERY_TITLES[activePhotoIdx] || `Portrait ${activePhotoIdx + 1}`}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIdx((prev) => (prev! < galleryImages.length - 1 ? prev! + 1 : 0));
              }}
              style={{
                position: "absolute",
                right: "1.5rem",
                background: "rgba(0,0,0,0.5)",
                border: "1px solid var(--gold)",
                borderRadius: "50%",
                width: 48,
                height: 48,
                color: "var(--gold-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
              aria-label="Next photo"
            >
              <CaretRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Interactive RSVP Modal Dialog ── */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="cr-modal-overlay">
            <motion.div
              className="cr-modal-container"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <button
                type="button"
                className="cr-modal-close"
                onClick={() => setIsRsvpOpen(false)}
                aria-label="Close RSVP modal"
              >
                <X size={18} weight="bold" />
              </button>

              <div className="cr-modal-header">
                <div className="cr-modal-tag">✦ SHUBH VIVAH RSVP ✦</div>
                <h3 className="cr-modal-title">Confirm Attendance</h3>
                <p className="cr-modal-sub">For {brideName} & {groomName}&apos;s Royal Celebration</p>
              </div>

              {isRsvpSubmitted ? (
                <div className="cr-success-msg">
                  <CheckCircle size={48} className="text-[#D4AF37] mb-3 mx-auto" weight="fill" />
                  <h4 className="text-xl font-serif text-[#D4AF37]">Dhanyawad!</h4>
                  <p className="text-xs text-[#F5E5A3] mt-1.5 leading-relaxed">
                    Thank you, <strong>{rsvpName || "Dear Guest"}</strong>! Your RSVP and heartfelt blessings have been received with love. Aapki upasthiti hamare utsav ko mangalmay banayegi.
                  </p>

                  <div className="mt-4 pt-3 border-t border-[rgba(212,175,55,0.2)]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRsvpOpen(false);
                        setIsRsvpSubmitted(false);
                      }}
                      className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#4A0E17] font-bold text-xs rounded-xl uppercase tracking-wider transition-all"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="cr-rsvp-form">
                  <div className="cr-form-group">
                    <label className="cr-label">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya & Family"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="cr-input"
                    />
                  </div>

                  <div className="cr-form-group">
                    <label className="cr-label">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      className="cr-input"
                    />
                  </div>

                  <div className="cr-form-group">
                    <label className="cr-label">Will you be attending?</label>
                    <div className="cr-radio-group">
                      <button
                        type="button"
                        className={`cr-radio-btn ${rsvpAttending === "yes" ? "active" : ""}`}
                        onClick={() => setRsvpAttending("yes")}
                      >
                        Joyfully Accept
                      </button>
                      <button
                        type="button"
                        className={`cr-radio-btn ${rsvpAttending === "no" ? "active" : ""}`}
                        onClick={() => setRsvpAttending("no")}
                      >
                        Regretfully Decline
                      </button>
                    </div>
                  </div>

                  {rsvpAttending === "yes" && (
                    <div className="cr-form-group">
                      <label className="cr-label">Number of Guests Attending</label>
                      <select
                        value={rsvpGuests}
                        onChange={(e) => setRsvpGuests(e.target.value)}
                        className="cr-select"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="5+">5+ Persons (Family)</option>
                      </select>
                    </div>
                  )}

                  <div className="cr-form-group">
                    <label className="cr-label">Warm Wishes & Blessings for the Couple</label>
                    <textarea
                      rows={3}
                      placeholder="Leave your heartfelt blessings for the bride & groom..."
                      value={rsvpWishes}
                      onChange={(e) => setRsvpWishes(e.target.value)}
                      className="cr-textarea"
                    />
                  </div>

                  <button type="submit" className="cr-submit-btn">
                    <span>Send Royal RSVP</span>

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

// ----------------------------------------------------
// Subcomponent: Live Countdown Timer
// ----------------------------------------------------
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="countdown__grid">
      <div className="countdown__unit">
        <span className="countdown__value">{timeLeft.days}</span>
        <span className="countdown__label">Days</span>
      </div>
      <div className="countdown__unit">
        <span className="countdown__value">{timeLeft.hours}</span>
        <span className="countdown__label">Hours</span>
      </div>
      <div className="countdown__unit">
        <span className="countdown__value">{timeLeft.minutes}</span>
        <span className="countdown__label">Mins</span>
      </div>
      <div className="countdown__unit">
        <span className="countdown__value">{timeLeft.seconds}</span>
        <span className="countdown__label">Secs</span>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Subcomponent: Interactive Gold Foil Scratch Card with Confetti
// ----------------------------------------------------
function ScratchCard({
  dayName,
  fullDate,
  time,
}: {
  dayName: string;
  fullDate: string;
  time: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const isDrawingRef = useRef(false);
  const scratchedPixelsRef = useRef(0);
  const confettiFiredRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fill with gold gradient foil
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#e8c988");
    grad.addColorStop(0.3, "#c9a15a");
    grad.addColorStop(0.6, "#9d7838");
    grad.addColorStop(1, "#d4af37");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative stars & text on top of scratch surface
    ctx.fillStyle = "#3b1118";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ SCRATCH TO REVEAL ✦", canvas.width / 2, canvas.height / 2);
  }, []);

  const triggerCelebration = () => {
    if (confettiFiredRef.current) return;
    confettiFiredRef.current = true;

    // Fire luxurious gold & royal crimson confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#d4af37", "#f1dfb8", "#7c2c3b", "#a85f68", "#ffffff", "#ffd700"],
      shapes: ["circle", "square"],
      scalar: 1.1,
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#d4af37", "#f1dfb8", "#7c2c3b"],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#d4af37", "#f1dfb8", "#7c2c3b"],
      });
    }, 200);
  };

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
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    scratchedPixelsRef.current += 1;
    if (scratchedPixelsRef.current > 18 && !confettiFiredRef.current) {
      triggerCelebration();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDrawingRef.current = true;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div className="scratch__card">
      <div className="scratch__reveal-content">
        <span className="scratch__day">{dayName}</span>
        <h3 className="scratch__date">{fullDate}</h3>
        <p className="scratch__time">{time}</p>
      </div>
      {!isScratched && (
        <canvas
          ref={canvasRef}
          className="scratch__canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        />
      )}
    </div>
  );
}
