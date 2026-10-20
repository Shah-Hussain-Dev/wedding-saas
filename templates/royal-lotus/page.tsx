"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Heart, Sparkle, CheckCircle, X, WhatsappLogo } from "@phosphor-icons/react";
import defaultData from "./data.json";
import { TemplateMarketingFooter } from "@/components/invitation/TemplateMarketingFooter";
import "./style.css";

interface EventItem {
  id?: string;
  name: string;
  date: string;
  time: string;
  venue?: string;
  location?: string;
  detail?: string;
  mapsUrl?: string;
  enabled?: boolean;
}

interface GalleryItem {
  url: string;
  caption?: string;
}

interface InvitationData {
  id?: string;
  brideName?: string;
  groomName?: string;
  weddingDate?: Date | string;
  weddingTime?: string;
  venueName?: string;
  venueAddress?: string;
  venueLat?: number | null;
  venueLng?: number | null;
  heroImageUrl?: string | null;
  slideshowImages?: string[];
  gallery?: GalleryItem[];
  showDressCode?: boolean;
  dressCodeText?: string | null;
  showTransport?: boolean;
  transportText?: string | null;
  eventsJson?: EventItem[];
  musicTrack?: string;
  storyMessage?: string;
  rsvpDeadline?: string;
}

interface RoyalLotusProps {
  data?: InvitationData;
}

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

// ─────────────────────────────────────────────────────────────────────────────
// INTRO: PALACE COURTYARD SCENE + TASSEL ROPE PULL + LIGHTING + BLOOMING LOTUS
// ─────────────────────────────────────────────────────────────────────────────
interface RoyalLotusIntroProps {
  onUnlock: () => void;
  brideName: string;
  groomName: string;
  weddingDateStr: string;
  venueName: string;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  setIsAudioPlaying: (val: boolean) => void;
}

function RoyalLotusIntro({
  onUnlock,
  brideName,
  groomName,
  weddingDateStr,
  venueName,
  audioRef,
  setIsAudioPlaying,
}: RoyalLotusIntroProps) {
  const [isLit, setIsLit] = useState(false);
  const [isFlash, setIsFlash] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isLotusOpen, setIsLotusOpen] = useState(false);
  const [reveals, setReveals] = useState({
    names: false,
    date: false,
    venue: false,
    lotus: false,
  });

  const ropeBtnRef = useRef<HTMLButtonElement | null>(null);
  const ropeImgRef = useRef<HTMLImageElement | null>(null);
  const haloRef = useRef<HTMLSpanElement | null>(null);
  const isTriggeredRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const startYRef = useRef(0);
  const thresholdRef = useRef(100);

  useEffect(() => {
    thresholdRef.current = clamp(Math.round(0.12 * window.innerHeight), 80, 120);
  }, []);

  const resetRopeTransforms = useCallback(() => {
    if (ropeBtnRef.current) {
      ropeBtnRef.current.style.transition = "";
      ropeBtnRef.current.style.transform = "";
    }
    if (ropeImgRef.current) {
      ropeImgRef.current.style.transition = "";
      ropeImgRef.current.style.transform = "";
    }
    if (haloRef.current) {
      haloRef.current.style.transition = "";
      haloRef.current.style.opacity = "";
      haloRef.current.style.transform = "";
    }
  }, []);

  const handlePointerUpOrCancel = useCallback(() => {
    isPointerDownRef.current = false;
    setIsDragging(false);
    if (!isTriggeredRef.current) {
      if (ropeBtnRef.current) {
        ropeBtnRef.current.style.transition = "transform 520ms cubic-bezier(.34,1.56,.64,1)";
        ropeBtnRef.current.style.transform = "translateX(-50%)";
      }
      if (ropeImgRef.current) {
        ropeImgRef.current.style.transition = "transform 520ms cubic-bezier(.34,1.56,.64,1)";
        ropeImgRef.current.style.transform = "scaleY(1)";
      }
      if (haloRef.current) {
        haloRef.current.style.transition = "opacity 400ms ease, transform 500ms ease";
        haloRef.current.style.opacity = "0";
        haloRef.current.style.transform = "translateX(-50%) scale(1)";
      }
      window.setTimeout(resetRopeTransforms, 560);
    }
  }, [resetRopeTransforms]);

  const triggerLighting = useCallback(() => {
    if (isTriggeredRef.current) return;
    isTriggeredRef.current = true;
    isPointerDownRef.current = false;
    setIsDragging(false);
    setIsLit(true);

    if (audioRef.current) {
      audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
    }

    if (navigator.vibrate) {
      try {
        navigator.vibrate([14, 22, 88]);
      } catch {}
    }

    const btn = ropeBtnRef.current;
    const img = ropeImgRef.current;
    if (btn && img) {
      btn.style.transition = "transform 85ms cubic-bezier(.18,0,.6,1)";
      btn.style.transform = "translateX(-50%) rotate(5deg)";
      img.style.transition = "transform 85ms ease";
      img.style.transform = "scaleY(1.66)";

      window.setTimeout(() => {
        btn.style.transition = "transform 680ms cubic-bezier(.2,.92,.22,1)";
        btn.style.transform = "translateX(-50%) rotate(-2.2deg)";
        img.style.transition = "transform 680ms cubic-bezier(.2,.92,.22,1)";
        img.style.transform = "scaleY(1.16)";
      }, 85);
    }

    window.setTimeout(() => setIsFlash(true), 140);
    window.setTimeout(() => setIsFlash(false), 1440);

    window.setTimeout(() => setReveals((prev) => ({ ...prev, names: true })), 1000);
    window.setTimeout(() => setReveals((prev) => ({ ...prev, date: true })), 1800);
    window.setTimeout(() => setReveals((prev) => ({ ...prev, venue: true })), 2200);
    window.setTimeout(() => setReveals((prev) => ({ ...prev, lotus: true })), 2700);
  }, [audioRef, setIsAudioPlaying]);

  const handleSkip = () => {
    if (!isTriggeredRef.current) {
      isTriggeredRef.current = true;
      setIsLit(true);
      setReveals({ names: true, date: true, venue: true, lotus: true });
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
      }
    }
    if (!isLeaving) {
      setIsLeaving(true);
      window.setTimeout(onUnlock, 600);
    }
  };

  const handleLotusClick = () => {
    setIsLotusOpen(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
    }
    window.setTimeout(() => {
      setIsLeaving(true);
      window.setTimeout(onUnlock, 700);
    }, 450);
  };

  return (
    <div
      className={`intro ${isLit ? "intro--lit" : ""} ${isLeaving ? "intro--leaving" : ""}`}
      aria-hidden={isLeaving}
    >
      <div className="intro__scene">
        <img
          className="intro__bg intro__bg--dark"
          src="/templates/lotus-courtyard/hero-bg-dark.webp"
          alt="Palace Courtyard Night"
        />
        <img
          className={`intro__bg intro__bg--lit ${isLit ? "intro__bg--flicker" : ""}`}
          src="/templates/lotus-courtyard/hero-bg-lit.webp"
          alt="Palace Courtyard Lit"
        />
      </div>

      <div className="intro__scrim" aria-hidden="true" />
      {isFlash && <div className="intro__flash" />}

      <button className="intro__skip" onClick={handleSkip} type="button">
        skip intro
      </button>

      <button
        ref={ropeBtnRef}
        className={`intro__rope ${isDragging ? "intro__rope--dragging" : "intro__rope--idle"}`}
        onPointerDown={(e) => {
          if (isTriggeredRef.current) return;
          e.preventDefault();
          isPointerDownRef.current = true;
          setIsDragging(true);
          startYRef.current = e.clientY;
          resetRopeTransforms();
          ropeBtnRef.current?.setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!isPointerDownRef.current || isTriggeredRef.current) return;
          const rawDelta = Math.max(0, e.clientY - startYRef.current);
          const limit = thresholdRef.current;
          const springK1 = 0.38 * limit;
          const springK2 = 0.82 * limit;

          const smoothY =
            rawDelta <= springK1
              ? 0.92 * rawDelta
              : rawDelta <= springK2
              ? 0.92 * springK1 + (rawDelta - springK1) * 0.58
              : 0.92 * springK1 + (springK2 - springK1) * 0.58 + (rawDelta - springK2) * 0.3;

          const progress = Math.min(rawDelta / limit, 1);
          const rotation = clamp((smoothY / limit) * 12, -13, 13);
          const scaleY = 1 + clamp(smoothY / (1.45 * limit), 0, 0.66);

          if (ropeBtnRef.current) {
            ropeBtnRef.current.style.transform = `translateX(-50%) rotate(${rotation.toFixed(2)}deg)`;
          }
          if (ropeImgRef.current) {
            ropeImgRef.current.style.transform = `scaleY(${scaleY.toFixed(3)})`;
          }
          if (haloRef.current) {
            haloRef.current.style.opacity = String(0.24 + 0.72 * progress);
            haloRef.current.style.transform = `translateX(-50%) translateY(${(0.28 * smoothY).toFixed(2)}px) scale(${(1 + 0.76 * progress).toFixed(3)})`;
          }

          if (rawDelta >= limit) {
            triggerLighting();
          }
        }}
        onPointerUp={handlePointerUpOrCancel}
        onPointerCancel={handlePointerUpOrCancel}
        aria-label="Pull the rope to light our celebration"
        type="button"
      >
        <span ref={haloRef} className="intro__rope-halo" aria-hidden="true" />
        <img
          ref={ropeImgRef}
          src="/templates/lotus-courtyard/rope-pull.webp"
          alt=""
          draggable="false"
        />
      </button>

      <div className="intro__content">
        <div className="intro__reveal">
          <div className={`intro__reveal-item ${reveals.names ? "is-visible" : ""}`}>
            <h1 className="intro__names script">
              {brideName} <span className="intro__amp">&</span> {groomName}
            </h1>
          </div>

          <div className={`intro__reveal-item ${reveals.date ? "is-visible" : ""}`}>
            <p className="intro__date eyebrow">{weddingDateStr}</p>
          </div>

          <div className={`intro__reveal-item ${reveals.venue ? "is-visible" : ""}`}>
            <p className="intro__venue">{venueName}</p>
          </div>

          {reveals.lotus && (
            <div className="intro__reveal-item is-visible mt-4">
              <button
                className="intro__lotus-btn cursor-pointer"
                onClick={handleLotusClick}
                type="button"
                aria-label="Enter invitation"
              >
                <span className="intro__lotus-glow" aria-hidden="true" />
                <img
                  className="intro__lotus-img intro__lotus-img--closed"
                  style={{ opacity: isLotusOpen ? 0 : 1 }}
                  src="/templates/lotus-courtyard/lotus-closed.webp"
                  alt=""
                />
                <img
                  className="intro__lotus-img intro__lotus-img--open"
                  style={{ opacity: isLotusOpen ? 1 : 0 }}
                  src="/templates/lotus-courtyard/lotus-open.webp"
                  alt=""
                />
              </button>
              <p className="intro__hint">Tap the lotus to join us</p>
            </div>
          )}
        </div>

        {!reveals.lotus && !isLit && (
          <p className="intro__hint intro__hint--pull">
            Pull the rope to light our celebration
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN TEMPLATE: COMPLETE ROYAL LOTUS INVITATION
// ─────────────────────────────────────────────────────────────────────────────
export default function RoyalLotus({ data }: RoyalLotusProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

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
        colors: ["#FF9933", "#FFD700", "#138808", "#FFFFFF", "#D4AF37"],
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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const brideName = data?.brideName || "Siya";
  const groomName = data?.groomName || "Kabir";
  const weddingDateRaw = data?.weddingDate ? new Date(data.weddingDate) : new Date("2026-12-14T18:30:00");
  const venueName = data?.venueName || "The Maharaja Palace";
  const venueAddress = data?.venueAddress || "Lake Pichola Road, Udaipur, Rajasthan";
  const hashtag = `#${brideName}Weds${groomName}`;

  const dateDay = weddingDateRaw.getDate();
  const dateMonth = weddingDateRaw.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
  const dateYear = weddingDateRaw.getFullYear();
  const dateWeekday = weddingDateRaw.toLocaleDateString("en-IN", { weekday: "long" });
  const formattedDateString = `${dateDay} ${weddingDateRaw.toLocaleDateString("en-IN", { month: "long" })} ${dateYear}`;

  const events: EventItem[] = data?.eventsJson && data.eventsJson.length > 0
    ? data.eventsJson
    : [
        { id: "mehendi", name: "Mehendi", date: "12 December 2026", time: "4:00 PM", location: "Lotus Courtyard", detail: "Adorn yourself in fresh greens & blooms", mapsUrl: "https://maps.google.com/?q=Lake+Pichola+Udaipur" },
        { id: "haldi", name: "Haldi", date: "13 December 2026", time: "10:00 AM", location: "Poolside Courtyard", detail: "Come aglow in sunlit yellows & ivory", mapsUrl: "https://maps.google.com/?q=Lake+Pichola+Udaipur" },
        { id: "sangeet", name: "Sangeet", date: "13 December 2026", time: "7:30 PM", location: "Royal Ballroom", detail: "A night of music, dance & merriment", mapsUrl: "https://maps.google.com/?q=Lake+Pichola+Udaipur" },
        { id: "shaadi", name: "Shaadi", date: "14 December 2026", time: "6:30 PM", location: "Lake Mandap", detail: "Traditional attire, for our sacred vows", mapsUrl: "https://maps.google.com/?q=Lake+Pichola+Udaipur" },
        { id: "reception", name: "Reception", date: "14 December 2026", time: "9:00 PM", location: "Palace Lawns", detail: "An evening of feasting under candlelight", mapsUrl: "https://maps.google.com/?q=Lake+Pichola+Udaipur" },
        { id: "vidaai", name: "Vidaai", date: "15 December 2026", time: "9:00 AM", location: "Main Courtyard", detail: "A tender farewell, wrapped in blessings", mapsUrl: "https://maps.google.com/?q=Lake+Pichola+Udaipur" },
      ];

  // Authentic 6-item gallery photos from live template
  const rawLotusGallery = data?.gallery && data.gallery.length > 0 ? data.gallery : null;
  const galleryItems: GalleryItem[] = rawLotusGallery
    ? rawLotusGallery
        .map((item: any, idx: number) => {
          if (typeof item === "string") {
            return { url: item, caption: `Wedding Moment ${idx + 1}` };
          }
          return {
            url: item?.url || item?.src || "",
            caption: item?.caption || item?.title || `Wedding Moment ${idx + 1}`,
          };
        })
        .filter((item: GalleryItem) => Boolean(item.url))
    : [
        { url: "/templates/crimson-royale/gallery-1.webp", caption: "The Royal Palace Courtyard" },
        { url: "/templates/crimson-royale/gallery-2.webp", caption: "Intricate Bridal Mehendi" },
        { url: "/templates/crimson-royale/gallery-3.webp", caption: "A Promise of Togetherness" },
        { url: "/templates/crimson-royale/gallery-4.webp", caption: "Sunset at the Lake Palace" },
        { url: "/templates/crimson-royale/gallery-5.webp", caption: "Celebrations and Joy" },
        { url: "/templates/crimson-royale/gallery-6.webp", caption: "Everlasting Love" },
      ];

  // Deterministic floating petals to guarantee 100% hydration match between SSR and client
  const petals = [
    { id: 0, left: "4.5%", size: 14, duration: 12.5, delay: 0.2, drift: 12, rotate: 210 },
    { id: 1, left: "11.2%", size: 18, duration: 15.0, delay: 3.4, drift: -18, rotate: 280 },
    { id: 2, left: "18.0%", size: 12, duration: 11.2, delay: 1.8, drift: 24, rotate: 195 },
    { id: 3, left: "24.5%", size: 16, duration: 14.2, delay: 5.1, drift: -12, rotate: 320 },
    { id: 4, left: "31.0%", size: 20, duration: 16.5, delay: 2.2, drift: 15, rotate: 240 },
    { id: 5, left: "37.5%", size: 13, duration: 10.8, delay: 6.0, drift: -22, rotate: 360 },
    { id: 6, left: "44.0%", size: 17, duration: 13.6, delay: 0.9, drift: 18, rotate: 205 },
    { id: 7, left: "50.5%", size: 15, duration: 12.0, delay: 4.5, drift: -14, rotate: 310 },
    { id: 8, left: "57.0%", size: 19, duration: 15.8, delay: 2.7, drift: 20, rotate: 225 },
    { id: 9, left: "63.5%", size: 11, duration: 11.5, delay: 6.8, drift: -16, rotate: 340 },
    { id: 10, left: "70.0%", size: 16, duration: 14.0, delay: 1.4, drift: 25, rotate: 190 },
    { id: 11, left: "76.5%", size: 14, duration: 13.2, delay: 4.0, drift: -20, rotate: 275 },
    { id: 12, left: "83.0%", size: 18, duration: 16.0, delay: 2.9, drift: 14, rotate: 215 },
    { id: 13, left: "89.5%", size: 12, duration: 10.5, delay: 5.5, drift: -10, rotate: 330 },
    { id: 14, left: "94.0%", size: 15, duration: 12.8, delay: 3.1, drift: 22, rotate: 250 },
    { id: 15, left: "97.5%", size: 17, duration: 14.6, delay: 0.5, drift: -15, rotate: 300 },
  ];

  const getEventIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("mehendi")) return "/templates/lotus-courtyard/motif-peacock.webp";
    if (lower.includes("haldi")) return "/templates/lotus-courtyard/banaleaf.webp";
    if (lower.includes("sangeet")) return "/templates/lotus-courtyard/motif-chhatri.webp";
    if (lower.includes("shaadi") || lower.includes("wedding")) return "/templates/lotus-courtyard/motif-elephant.webp";
    if (lower.includes("reception")) return "/templates/lotus-courtyard/motif-cow.webp";
    if (lower.includes("vidaai")) return "/templates/lotus-courtyard/motif-diya-glow.webp";
    return "/templates/lotus-courtyard/motif-lotus.webp";
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
    }
  };

  return (
    <div className="tmpl-lotus-courtyard relative bg-[#FAF7F0] text-[#3D141C] selection:bg-[#D4AF37] selection:text-[#3D141C] min-h-screen">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src={data?.musicTrack || "/templates/lotus-courtyard/music.mp3"}
        loop
        preload="auto"
      />

      {/* STAGE 1: INTRO GATE */}
      {!unlocked && (
        <RoyalLotusIntro
          onUnlock={() => setUnlocked(true)}
          brideName={brideName}
          groomName={groomName}
          weddingDateStr={formattedDateString}
          venueName={venueName}
          audioRef={audioRef}
          setIsAudioPlaying={setIsAudioPlaying}
        />
      )}

      {/* FLOATING AUDIO TOGGLE */}
      {unlocked && (
        <button
          onClick={toggleAudio}
          type="button"
          className={`music-toggle ${isAudioPlaying ? "music-toggle--playing" : ""}`}
          aria-label={isAudioPlaying ? "Mute audio" : "Play audio"}
        >
          <img src="/templates/lotus-courtyard/music-icon.webp" alt="" />
        </button>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 1: HERO SECTION (ROYAL PEACOCK MEDALLION)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="invite" id="hero">
        <img
          className="invite__bg"
          src="/templates/lotus-courtyard/peacock-medallion.webp"
          alt="Royal Peacock Medallion"
          aria-hidden="true"
        />
        <div className="invite__bg-tint" />

        {/* Falling Petals Particle System */}
        <div className="invite__petals" aria-hidden="true">
          {petals.map((p) => (
            <span
              key={p.id}
              className="invite__petal"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            >
              <svg viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 1c4.5 3 6 6.5 6 9 0 3.87-2.69 9-6 9s-6-5.13-6-9c0-2.5 1.5-6 6-9z"
                  fill="currentColor"
                />
              </svg>
            </span>
          ))}
        </div>

        <motion.div
          className="invite__content z-10"
          initial="hidden"
          animate={unlocked ? "show" : "hidden"}
          variants={{
            show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
          }}
        >
          <motion.h1
            className="invite__names script"
            variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {brideName}
          </motion.h1>

          <motion.h1
            className="invite__names script"
            variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {groomName}
          </motion.h1>

          <motion.p
            className="invite__status eyebrow"
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          >
            Are Getting Married
          </motion.p>

          <motion.div
            className="invite__date-row"
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
          >
            <span className="invite__date-unit font-bold">{dateMonth}</span>
            <span className="invite__date-day font-bold">{dateDay}</span>
            <span className="invite__date-sep" />
            <span className="invite__date-unit font-bold">{dateYear}</span>
          </motion.div>

          <motion.p
            className="invite__weekday script"
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          >
            {dateWeekday}
          </motion.p>

          <motion.div
            className="invite__venue-strip"
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
          >
            <p className="invite__venue-name">{venueName}</p>
          </motion.div>

          <motion.div
            className="invite__ctas"
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
          >
            <a className="invite__btn invite__btn--solid" href="#rsvp">
              RSVP Now
            </a>
            <a className="invite__btn invite__btn--outline" href="#events">
              View Events
            </a>
          </motion.div>
        </motion.div>

        <a className="invite__scroll-cue" href="#events" aria-label="Scroll down">
          <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
            <path d="M1 1.5 9 9.5 17 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 2: CELEBRATION JOURNEY ("OUR EVENTS" — ROYAL FARMAN SCROLLS)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="section events" id="events">
        <div
          className="events__bg"
          style={{ backgroundImage: "url(/templates/lotus-courtyard/bg-events.webp)" }}
          aria-hidden="true"
        />
        <div className="events__bg-tint" aria-hidden="true" />
        <img
          className="events__banaleaf"
          src="/templates/lotus-courtyard/banaleaf.webp"
          alt=""
          aria-hidden="true"
        />

        <div className="section-inner">
          <p className="eyebrow">Celebration Journey</p>
          <h2 className="events__title">Our Events</h2>
          <img
            className="events__divider"
            src="/templates/lotus-courtyard/events-divider.webp"
            alt=""
            aria-hidden="true"
          />

          <ol className="events__list" aria-label="Wedding ceremonies itinerary">
            {events.map((event, idx) => (
              <li key={event.id || idx} className="events__stop events__stop--open">
                <div className="events__card">
                  <div className="events__open-wrap">
                    <img
                      className="events__parchment-img"
                      src="/templates/lotus-courtyard/farman-open.webp"
                      alt=""
                      aria-hidden="true"
                    />

                    <div className="events__content" aria-label={`${event.name} ceremony details`}>
                      <img
                        className="events__icon"
                        src={getEventIcon(event.name)}
                        alt=""
                        aria-hidden="true"
                      />
                      <h3 className="events__name script">{event.name}</h3>
                      <div className="events__rule" aria-hidden="true" />
                      <p className="events__when eyebrow">{event.date}</p>
                      <p className="events__time">{event.time}</p>
                      <p className="events__location">{event.location || event.venue || venueName}</p>
                      {event.detail && (
                        <p className="events__detail">{event.detail}</p>
                      )}
                      <a
                        className="events__map-link"
                        href={event.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent((event.location || venueName) + " " + venueAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M12 21s7-6.2 7-11.5a7 7 0 10-14 0C5 14.8 12 21 12 21z" stroke="currentColor" strokeWidth="1.6" />
                          <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                        <span>View on Map</span>
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 3: "MEET THE COUPLE" (ENCHANTED PALACE GARDEN)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="section couple" id="couple">
        <div
          className="couple__bg"
          style={{ backgroundImage: "url(/templates/lotus-courtyard/bg-couple.webp)" }}
          aria-hidden="true"
        />
        <div className="couple__bg-tint" aria-hidden="true" />
        <motion.img
          className="couple__tree couple__tree--left"
          src="/templates/lotus-courtyard/tree-left.webp"
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, x: -60, y: -20 }}
          whileInView={{ opacity: 0.85, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        <motion.img
          className="couple__tree couple__tree--right"
          src="/templates/lotus-courtyard/tree-right.webp"
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, x: 60, y: -20 }}
          whileInView={{ opacity: 0.85, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />

        <div className="section-inner">
          <p className="eyebrow">When It All Began</p>
          <h2 className="couple__title">Meet the Couple</h2>
          <div className="divider" />
          <p className="couple__story">
            {data?.storyMessage ||
              "A monsoon evening in Udaipur, a marigold archway, and a girl laughing in the rain — that was all it took. Three years, countless chai mornings, and one nervous rooftop proposal later, we are ready to begin our most beautiful chapter yet."}
          </p>
          <p className="couple__hashtag script">{hashtag}</p>
          <img
            className="couple__peacock"
            src="/templates/lotus-courtyard/motif-peacock.webp"
            alt=""
            aria-hidden="true"
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 4: "GALLERY WALL" (MEMORIES)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="section gallery" id="gallery">
        <div
          className="gallery__bg"
          style={{ backgroundImage: "url(/templates/lotus-courtyard/bg-gallery.webp)" }}
          aria-hidden="true"
        />
        <div className="gallery__bg-tint" aria-hidden="true" />

        <div className="section-inner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6 }}
          >
            <p className="eyebrow">Memories</p>
            <h2 className="gallery__title">Gallery Wall</h2>
            <div className="divider" />
          </motion.div>

          <div className="gallery__mosaic" aria-label="Photo gallery">
            {galleryItems.map((item, idx) => (
              <figure
                key={idx}
                className="gallery__item cursor-pointer"
                onClick={() => setLightboxImg(item.url)}
              >
                <img className="gallery__img" src={item.url} alt={item.caption || `Wedding moment ${idx + 1}`} />
                {item.caption && <figcaption className="gallery__caption">{item.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 5: "THINGS TO KNOW" (GUEST ESSENTIALS)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="section essentials" id="things">
        <div
          className="essentials__bg"
          style={{ backgroundImage: "url(/templates/lotus-courtyard/bg-essentials.webp)" }}
          aria-hidden="true"
        />
        <div className="essentials__bg-tint" aria-hidden="true" />
        <motion.img
          className="essentials__corner essentials__corner--left"
          src="/templates/lotus-courtyard/corner-left.webp"
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, x: -30, y: -20 }}
          whileInView={{ opacity: 0.6, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9 }}
        />
        <motion.img
          className="essentials__corner essentials__corner--right"
          src="/templates/lotus-courtyard/corner-right.webp"
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, x: 30, y: -20 }}
          whileInView={{ opacity: 0.6, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9 }}
        />

        <div className="section-inner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            <img
              className="essentials__jharokha"
              src="/templates/lotus-courtyard/motif-chhatri.webp"
              alt=""
              aria-hidden="true"
            />
            <p className="eyebrow">Guest Essentials</p>
            <h2 className="essentials__title">Things to Know</h2>
            <div className="divider" />
            <p className="essentials__subtitle">
              A few thoughtful details to help you celebrate in ease.
            </p>
          </motion.div>

          <ul className="essentials__grid" aria-label="Guest information cards">
            {[
              {
                title: "Dress Code",
                detail: data?.dressCodeText || "Royal Traditional Indian. Pastel lehengas, silk sarees, sherwanis, or bandhgalas.",
                icon: "/templates/lotus-courtyard/icon-dress-code.webp",
              },
              {
                title: "Venue & Parking",
                detail: data?.transportText || "Valet parking available at the main palace porch. Dedicated airport shuttles arranged.",
                icon: "/templates/lotus-courtyard/icon-venue.webp",
              },
              {
                title: "Stay Options",
                detail: "A curated block of rooms has been reserved at the palace — please contact our guest team.",
                icon: "/templates/lotus-courtyard/icon-stay-options.webp",
              },
              {
                title: "Wedding Hashtag",
                detail: `Share your favourite moments with ${hashtag}.`,
                icon: "/templates/lotus-courtyard/icon-hashtag.webp",
              },
            ].map((item, idx) => (
              <motion.li
                key={item.title}
                className="essentials__card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: 0.08 * idx }}
              >
                <div className="essentials__icon-frame">
                  <img className="essentials__icon" src={item.icon} alt="" aria-hidden="true" />
                </div>
                <h3>{item.title}</h3>
                <div className="essentials__rule" aria-hidden="true" />
                <p>{item.detail}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 6: INTERACTIVE RSVP PEDESTAL BANNER
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="section rsvp" id="rsvp">
        <div
          className="rsvp__bg"
          style={{ backgroundImage: "url(/templates/lotus-courtyard/bg-rsvp.webp)" }}
          aria-hidden="true"
        />
        <div className="rsvp__bg-tint" aria-hidden="true" />

        <motion.div
          className="section-inner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
        >
          <div className="rl-rsvp-banner-card">
            <div className="rl-rsvp-banner-icon">
              <Heart size={36} weight="fill" className="text-[#D4AF37] animate-pulse" />
            </div>
            <p className="eyebrow" style={{ color: "var(--color-primary-light)" }}>Join The Celebration</p>
            <h2 className="rsvp__title script">Your Gracious Presence is Awaited</h2>
            <div className="essentials__rule" style={{ margin: "0.8rem auto" }} aria-hidden="true" />
            <p className="rsvp__body">
              {data?.rsvpDeadline || "Kindly confirm your presence by 15th November 2026. We've saved you a seat — just let us know you're coming."}
            </p>
            <motion.button
              type="button"
              className="rl-rsvp-open-btn"
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

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 7: ROYAL HERITAGE FOOTER (KAMADHENU COW & ELEPHANT MOTIFS)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="section closing">
        <div
          className="closing__bg"
          style={{ backgroundImage: "url(/templates/lotus-courtyard/bg-footer.webp)" }}
          aria-hidden="true"
        />
        <div className="closing__bg-tint" aria-hidden="true" />

        <motion.img
          className="closing__cow"
          src="/templates/lotus-courtyard/motif-cow.webp"
          alt=""
          aria-hidden="true"
          style={{ scaleX: -1 }}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 0.5, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
        />
        <motion.img
          className="closing__elephant"
          src="/templates/lotus-courtyard/motif-elephant.webp"
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 0.5, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.1 }}
        />

        <motion.div
          className="section-inner"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
        >
          <img
            className="closing__lotus"
            src="/templates/lotus-courtyard/motif-lotus.webp"
            alt=""
            aria-hidden="true"
          />
          <p className="eyebrow">With All Our Love</p>
          <h2 className="closing__title script">
            {brideName} & {groomName}
          </h2>
          <p className="closing__names">You make this moment complete.</p>
          <img
            className="closing__diya"
            src="/templates/lotus-courtyard/diya.webp"
            alt=""
            aria-hidden="true"
          />
          <p className="closing__date eyebrow">{formattedDateString.replace(/ /g, " · ")}</p>
        </motion.div>

        {/* ── Marketing Content At End of Template Footer ── */}
        <div className="w-full relative z-10 text-left">
          <TemplateMarketingFooter
            templateId="royal-lotus"
            templateName="Royal Lotus"
            brideName={brideName}
            groomName={groomName}
          />
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={lightboxImg}
            alt=""
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain border border-[#D4AF37]/40"
          />
        </div>
      )}

      {/* ── Interactive RSVP Modal Dialog ── */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="rl-modal-overlay">
            <motion.div
              className="rl-modal-container"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <button
                type="button"
                className="rl-modal-close"
                onClick={() => setIsRsvpOpen(false)}
                aria-label="Close RSVP modal"
              >
                <X size={18} weight="bold" />
              </button>

              <div className="rl-modal-header">
                <div className="rl-modal-tag">✦ SHUBH VIVAH RSVP ✦</div>
                <h3 className="rl-modal-title">Confirm Attendance</h3>
                <p className="rl-modal-sub">For {brideName} & {groomName}&apos;s Royal Celebration</p>
              </div>

              {isRsvpSubmitted ? (
                <div className="rl-success-msg">
                  <CheckCircle size={48} className="text-[#D4AF37] mb-3 mx-auto" weight="fill" />
                  <h4 className="text-xl font-serif text-[#D4AF37]">Graciously Received!</h4>
                  <p className="text-xs text-[#F5E5A3] mt-1.5 leading-relaxed">
                    Thank you, <strong>{rsvpName || "Dear Guest"}</strong>! Your RSVP and blessings have been saved. We look forward to celebrating with you!
                  </p>

                  <div className="mt-4 pt-3 border-t border-[rgba(212,175,55,0.2)]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRsvpOpen(false);
                        setIsRsvpSubmitted(false);
                      }}
                      className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#1c1508] font-bold text-xs rounded-xl uppercase tracking-wider transition-all"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="rl-rsvp-form">
                  <div className="rl-form-group">
                    <label className="rl-label">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya & Family"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="rl-input"
                    />
                  </div>

                  <div className="rl-form-group">
                    <label className="rl-label">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      className="rl-input"
                    />
                  </div>

                  <div className="rl-form-group">
                    <label className="rl-label">Will you be attending?</label>
                    <div className="rl-radio-group">
                      <button
                        type="button"
                        className={`rl-radio-btn ${rsvpAttending === "yes" ? "active" : ""}`}
                        onClick={() => setRsvpAttending("yes")}
                      >
                        Joyfully Accept
                      </button>
                      <button
                        type="button"
                        className={`rl-radio-btn ${rsvpAttending === "no" ? "active" : ""}`}
                        onClick={() => setRsvpAttending("no")}
                      >
                        Regretfully Decline
                      </button>
                    </div>
                  </div>

                  {rsvpAttending === "yes" && (
                    <div className="rl-form-group">
                      <label className="rl-label">Number of Guests Attending</label>
                      <select
                        value={rsvpGuests}
                        onChange={(e) => setRsvpGuests(e.target.value)}
                        className="rl-select"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="5+">5+ Persons (Family)</option>
                      </select>
                    </div>
                  )}

                  <div className="rl-form-group">
                    <label className="rl-label">Warm Wishes & Blessings for the Couple</label>
                    <textarea
                      rows={3}
                      placeholder="Leave your heartfelt blessings for the bride & groom..."
                      value={rsvpWishes}
                      onChange={(e) => setRsvpWishes(e.target.value)}
                      className="rl-textarea"
                    />
                  </div>

                  <button type="submit" className="rl-submit-btn">
                    <span>Send Royal RSVP</span>
                    <Sparkle size={16} weight="fill" />
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
