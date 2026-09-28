"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "motion/react";
import confetti from "canvas-confetti";
import {
  Sparkle,
  Heart,
  MapPin,
  Clock,
  CalendarCheck,
  Copy,
  CheckCircle,
  ArrowSquareOut,
  SpeakerHigh,
  SpeakerSlash,
  X,
  CaretDown,
  CaretRight,
  CaretLeft,
  MagnifyingGlassPlus,
  ArrowsClockwise,
  GlobeHemisphereWest,
  FlowerLotus,
  MoonStars,
  Star,
  HandGrabbing,
  Compass,
} from "@phosphor-icons/react";
import defaultData from "./data.json";
import "./style.css";

// Helper to safely resolve audio track URLs
function resolveAudioTrack(track?: string | null): string {
  if (
    !track ||
    track === "track1" ||
    track === "track2" ||
    track === "track3" ||
    track === "default" ||
    track.trim() === ""
  ) {
    return "/templates/celestial-rose/music.mp3";
  }
  if (
    track.startsWith("/") ||
    track.startsWith("http://") ||
    track.startsWith("https://") ||
    track.startsWith("blob:")
  ) {
    return track;
  }
  return `/audio/${track}.mp3`;
}

// ----------------------------------------------------
// 1. FLOATING PETAL PHYSICS CANVAS (3 DEPTH LAYERS)
// ----------------------------------------------------
function CelestialPetalCanvas({ density = 22 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const colors = ["#E8B8B8", "#C89898", "#E2B993", "#F1E8E1", "#5898B8"];
    // 3 depth layers: 0 = background (tiny, slow), 1 = midground (sharp), 2 = foreground (large, fast, blurred)
    const petals = Array.from({ length: density }, () => {
      const depthGroup = Math.random() < 0.25 ? 2 : Math.random() < 0.7 ? 1 : 0;
      return {
        depthGroup,
        x: Math.random() * width,
        y: Math.random() * height,
        size: depthGroup === 2 ? Math.random() * 12 + 18 : depthGroup === 1 ? Math.random() * 8 + 10 : Math.random() * 5 + 4,
        speedY: depthGroup === 2 ? Math.random() * 1.2 + 0.8 : depthGroup === 1 ? Math.random() * 0.7 + 0.35 : Math.random() * 0.35 + 0.15,
        speedX: (Math.random() - 0.5) * (depthGroup === 2 ? 0.9 : 0.4),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.025,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: depthGroup === 2 ? 0.55 : depthGroup === 1 ? 0.75 : 0.4,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.y += p.speedY;
        p.wobble += p.wobbleSpeed;
        p.x += Math.sin(p.wobble) * 0.6 + p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 40) {
          p.y = -30;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.depthGroup === 2) {
          // Foreground blurred petal
          ctx.filter = "blur(2.5px)";
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.6, p.size * 0.35, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 opacity-80"
    />
  );
}

// ----------------------------------------------------
// 2. STARDUST & TWINKLING CELESTIAL CANVAS
// ----------------------------------------------------
function CelestialStardustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const stars = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.75,
      alpha: Math.random() * 0.8 + 0.2,
      alphaSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      color: Math.random() > 0.5 ? "#E2B993" : "#F1E8E1",
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((s) => {
        s.alpha += s.alphaSpeed;
        if (s.alpha > 0.95 || s.alpha < 0.15) {
          s.alphaSpeed = -s.alphaSpeed;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle 4-point star sparkle for larger stars
        if (s.size > 1.8) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - s.size * 2, s.y);
          ctx.lineTo(s.x + s.size * 2, s.y);
          ctx.moveTo(s.x, s.y - s.size * 2);
          ctx.lineTo(s.x, s.y + s.size * 2);
          ctx.stroke();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-70"
    />
  );
}

// ----------------------------------------------------
// 3. DESKTOP STARDUST CURSOR & LIGHT FIELD (DESKTOP ONLY)
// ----------------------------------------------------
function DesktopStardustCursor() {
  const [coords, setCoords] = useState({ x: -100, y: -100 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (isTouchDevice) return null;

  return (
    <div
      className="fixed pointer-events-none z-40 transition-transform duration-75 ease-out"
      style={{
        left: coords.x,
        top: coords.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Soft Ambient Cursor Light Field */}
      <div className="w-48 h-48 rounded-full bg-gradient-to-r from-[#E2B993]/20 via-[#5898B8]/15 to-transparent blur-2xl" />
      {/* Tiny Center Stardust Spark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#E2B993] shadow-[0_0_8px_#E2B993]" />
    </div>
  );
}

// ----------------------------------------------------
// 4. CELESTIAL ORBIT COUNTDOWN COMPONENT
// ----------------------------------------------------
function CelestialOrbitCountdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calc = () => {
      const diff = +new Date(targetDate) - +new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="relative py-12 px-4 flex flex-col items-center justify-center text-center">
      {/* Orbital Moon Ring */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-[#C9A46E]/40 flex items-center justify-center shadow-[0_0_40px_rgba(88,152,184,0.15)] bg-gradient-to-b from-[#F1E8E1]/80 to-[#E8B8B8]/30 backdrop-blur-md">
        {/* Revolving Orbit Satellite Star */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="w-3 h-3 rounded-full bg-[#C9A46E] shadow-[0_0_12px_#E2B993] absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
            <Sparkle size={10} weight="fill" className="text-white" />
          </div>
        </motion.div>

        {/* Center Celestial Moon Emblem & Live Values */}
        <div className="space-y-3 z-10">
          <div className="flex items-center justify-center gap-1 text-[#C9A46E]">
            <MoonStars size={26} weight="fill" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#5898B8] font-montserrat block">
            Celestial Countdown
          </span>
          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center px-4">
            <div className="space-y-0.5">
              <span className="font-playfair text-xl sm:text-2xl font-bold text-[#685868]">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <p className="text-[8px] uppercase tracking-widest text-[#788898] font-montserrat">Days</p>
            </div>
            <div className="space-y-0.5">
              <span className="font-playfair text-xl sm:text-2xl font-bold text-[#685868]">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <p className="text-[8px] uppercase tracking-widest text-[#788898] font-montserrat">Hours</p>
            </div>
            <div className="space-y-0.5">
              <span className="font-playfair text-xl sm:text-2xl font-bold text-[#685868]">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <p className="text-[8px] uppercase tracking-widest text-[#788898] font-montserrat">Mins</p>
            </div>
            <div className="space-y-0.5">
              <span className="font-playfair text-xl sm:text-2xl font-bold text-[#C9A46E]">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <p className="text-[8px] uppercase tracking-widest text-[#788898] font-montserrat">Secs</p>
            </div>
          </div>
          <p className="text-[9px] text-[#A87878] font-cormorant italic">
            Until two stars align forever
          </p>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. SCRATCH THE STARS (INTERACTIVE CELESTIAL FOIL)
// ----------------------------------------------------
function ScratchTheStarsCard({
  brideName,
  groomName,
  dayStr,
  dateStr,
  yearStr,
  weddingTime,
  venueName,
}: {
  brideName: string;
  groomName: string;
  dayStr: string;
  dateStr: string;
  yearStr: string;
  weddingTime: string;
  venueName: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth || 380);
    const height = (canvas.height = canvas.offsetHeight || 260);

    // Metallic Pearl-Blue & Stardust Night Foil
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#4888A8");
    gradient.addColorStop(0.4, "#5898B8");
    gradient.addColorStop(0.7, "#685868");
    gradient.addColorStop(1, "#36281D");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Stippled Stardust Specs on the foil surface
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? "#E2B993" : "#F1E8E1";
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Foil text label
    ctx.fillStyle = "#F1E8E1";
    ctx.font = "bold 12px 'Montserrat', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✦ SCRATCH THE STARS ✦", width / 2, height / 2 - 12);

    ctx.fillStyle = "#E2B993";
    ctx.font = "italic 11px 'Cormorant Garamond', serif";
    ctx.fillText("Rub foil to unveil the celestial wedding date", width / 2, height / 2 + 12);

    const calculateProgress = () => {
      try {
        const imgData = ctx.getImageData(0, 0, width, height);
        const pixels = imgData.data;
        let transparentCount = 0;
        for (let i = 3; i < pixels.length; i += 16) {
          if (pixels[i] === 0) transparentCount++;
        }
        const totalSampled = pixels.length / 16;
        const pct = Math.round((transparentCount / totalSampled) * 100);
        setScratchProgress(pct);

        if (pct > 55 && !isRevealed) {
          setIsRevealed(true);
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ["#E2B993", "#C9A46E", "#5898B8", "#E8B8B8", "#F1E8E1"],
          });
        }
      } catch {
        // Fallback
      }
    };

    const erase = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();

      calculateProgress();
    };

    const onMouseDown = (e: MouseEvent) => {
      isDrawingRef.current = true;
      erase(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawingRef.current) return;
      erase(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      isDrawingRef.current = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDrawingRef.current = true;
        erase(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDrawingRef.current || e.touches.length === 0) return;
      erase(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onTouchEnd = () => {
      isDrawingRef.current = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isRevealed]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="celestial-scratch-container relative w-full max-w-[420px] h-[260px] sm:h-[280px]">
        {/* Revealed Secret Content */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F1E8E1] via-[#E8B8B8]/40 to-[#F1E8E1] p-5 sm:p-6 flex flex-col items-center justify-center text-center overflow-hidden border-2 border-[#C9A46E]/60 shadow-xl">
          <div className="space-y-2 max-w-sm">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.25em] text-[#5898B8] font-montserrat flex items-center justify-center gap-1.5">
              <Sparkle size={12} weight="fill" className="text-[#C9A46E]" />
              Concurrence of Destiny
              <Sparkle size={12} weight="fill" className="text-[#C9A46E]" />
            </span>

            <h4 className="font-great-vibes text-2xl sm:text-3xl text-[#685868] leading-tight">
              {groomName} &amp; {brideName}
            </h4>

            <div className="py-1.5 px-4 rounded-2xl bg-white/70 border border-[#C9A46E]/50 backdrop-blur-md shadow-sm space-y-0.5">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A46E] font-montserrat">
                {dayStr}
              </p>
              <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#36281D] tracking-wide">
                {dateStr} {yearStr}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#5898B8] font-montserrat flex items-center justify-center gap-1">
                <Clock size={12} weight="bold" className="text-[#C9A46E]" />
                <span>{weddingTime}</span>
              </p>
            </div>

            <div className="pt-0.5 text-[10px] text-[#685868] font-montserrat flex items-center justify-center gap-1 truncate max-w-xs mx-auto">
              <MapPin size={12} weight="fill" className="text-[#C9A46E] flex-shrink-0" />
              <span className="truncate">{venueName.split("&")[0]?.trim() || venueName}</span>
            </div>
          </div>
        </div>

        {/* Scratchable Foil Canvas */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            className="celestial-scratch-canvas transition-opacity duration-700"
          />
        )}
      </div>

      <div className="mt-3 flex items-center justify-between w-full max-w-[420px] px-2 text-xs font-montserrat text-[#788898]">
        <span className="text-[11px] font-semibold flex items-center gap-1 text-[#5898B8]">
          <HandGrabbing size={14} weight="bold" />
          {isRevealed ? "✦ Celestial Secret Unveiled!" : "Rub foil to reveal"}
        </span>
        <span className="font-mono text-[11px] font-bold text-[#C9A46E]">
          {isRevealed ? "100%" : `${scratchProgress}%`}
        </span>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// MAIN TEMPLATE: CELESTIAL ROSE DREAMSCAPE
// ----------------------------------------------------
interface CelestialRoseProps {
  data?: any;
}

export default function CelestialRose({ data }: CelestialRoseProps) {
  const brideName =
    data?.brideName || data?.couple?.brideName || defaultData.couple.brideName;
  const groomName =
    data?.groomName || data?.couple?.groomName || defaultData.couple.groomName;
  const groomParents =
    data?.groomParents ||
    data?.couple?.groomParents ||
    defaultData.couple.groomParents;
  const groomEducation =
    data?.groomEducation ||
    data?.couple?.groomEducation ||
    defaultData.couple.groomEducation;
  const groomProfession =
    data?.groomProfession ||
    data?.couple?.groomProfession ||
    defaultData.couple.groomProfession;
  const brideParents =
    data?.brideParents ||
    data?.couple?.brideParents ||
    defaultData.couple.brideParents;
  const brideEducation =
    data?.brideEducation ||
    data?.couple?.brideEducation ||
    defaultData.couple.brideEducation;
  const brideProfession =
    data?.brideProfession ||
    data?.couple?.brideProfession ||
    defaultData.couple.brideProfession;

  const rawDate = data?.weddingDate || defaultData.weddingDate;
  const weddingDateObj = new Date(rawDate);
  const dayStr = weddingDateObj.toLocaleDateString("en-IN", { weekday: "long" });
  const dateStr = weddingDateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
  });
  const yearStr = weddingDateObj.getFullYear().toString();
  const hashtag =
    data?.hashtag ||
    defaultData.hashtag ||
    `#${groomName}And${brideName}`.replace(/\s+/g, "");

  const venueName =
    data?.venueName || data?.venue?.name || defaultData.venue.name;
  const venueAddress =
    data?.venueAddress || data?.venue?.address || defaultData.venue.address;
  const venueMapUrl =
    data?.venue?.mapUrl ||
    defaultData.venue.mapUrl ||
    `https://maps.google.com/?q=${encodeURIComponent(
      venueName + " " + venueAddress
    )}`;

  const quote = data?.quote || defaultData.quote;
  const galleryImages: string[] =
    data?.gallery && data.gallery.length > 0 ? data.gallery : defaultData.gallery;

  const rawEvents = data?.events || data?.eventsJson;
  const events =
    rawEvents && rawEvents.length > 0 ? rawEvents : defaultData.events;
  const milestones = defaultData.milestones || [];

  const videoUrl =
    data?.videoUrl || defaultData.videoUrl || "/videos/royal-prestige.mp4";

  // Faith / Religion selection (Universal / Hindu / Muslim)
  const initialReligion = data?.religion || defaultData.religion || "universal";
  const [selectedReligion, setSelectedReligion] = useState<
    "universal" | "hindu" | "muslim"
  >(
    initialReligion === "hindu" || initialReligion === "muslim"
      ? initialReligion
      : "universal"
  );

  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [selectedEventIdx, setSelectedEventIdx] = useState(0);

  // Cinematic 5.5s Video Intro & Scroll-Lock State
  const [hasStarted, setHasStarted] = useState(false);
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  // Lock scroll until intro completes
  useEffect(() => {
    if (!isIntroComplete) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isIntroComplete]);

  // 5.5s Video Intro Timer (runs once user clicks hero to start)
  useEffect(() => {
    if (!hasStarted || isIntroComplete) return;

    const timer = setTimeout(() => {
      setIsIntroComplete(true);
    }, 5500);

    return () => clearTimeout(timer);
  }, [hasStarted, isIntroComplete]);

  // Handler when user clicks to enter dreamscape and play video
  const handleStartExperience = () => {
    setHasStarted(true);
    if (heroVideoRef.current) {
      heroVideoRef.current.play().catch(() => {});
    }
    if (audioRef.current && !isPlayingMusic) {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  // Lightbox Modal State
  const [activePhotoSrc, setActivePhotoSrc] = useState<string | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  // RSVP Modal & Submission State
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpAttending, setRsvpAttending] = useState("yes");
  const [rsvpGuests, setRsvpGuests] = useState("1");
  const [rsvpWishes, setRsvpWishes] = useState("");
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);
  const [starAscending, setStarAscending] = useState(false);

  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contentSectionRef = useRef<HTMLDivElement | null>(null);
  const audioTrackUrl = resolveAudioTrack(
    data?.musicTrack || defaultData.musicTrack
  );

  // Pointer Parallax Lerp Values for Hero Scene
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const textParallaxX = useTransform(smoothMouseX, [-300, 300], [-12, 12]);
  const textParallaxY = useTransform(smoothMouseY, [-300, 300], [-8, 8]);
  const curtainParallaxX = useTransform(smoothMouseX, [-300, 300], [20, -20]);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  // Scroll Parallax References
  const heroContainerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroContainerRef,
    offset: ["start start", "end start"],
  });

  const heroVideoScale = useTransform(heroScroll, [0, 1], [1, 1.09]);
  const heroVideoY = useTransform(heroScroll, [0, 1], [0, 60]);
  const heroTypographyY = useTransform(heroScroll, [0, 1], [0, -90]);
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0]);

  const storySectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: storyScroll } = useScroll({
    target: storySectionRef,
    offset: ["start end", "end start"],
  });
  const constellationPathLength = useTransform(storyScroll, [0.1, 0.8], [0, 1]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${venueName}, ${venueAddress}`);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleOpenPhoto = (src: string, idx: number) => {
    setActivePhotoSrc(src);
    setActivePhotoIdx(idx);
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStarAscending(true);
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: data?.id || "preview",
          senderName: rsvpName || "Honoured Guest",
          messageText: `[CELESTIAL RSVP - ${rsvpAttending.toUpperCase()}] Guests: ${rsvpGuests}. Phone: ${rsvpPhone}. Wishes: ${rsvpWishes}`,
        }),
      });
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setIsRsvpSubmitted(true);
      setStarAscending(false);
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#E2B993", "#C9A46E", "#5898B8", "#E8B8B8", "#F1E8E1"],
      });
    }, 1200);
  };

  const scrollToContent = () => {
    if (contentSectionRef.current) {
      contentSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Faith Invocations
  const getInvocation = () => {
    switch (selectedReligion) {
      case "hindu":
        return {
          title: "॥ ॐ श्री गणेशाय नमः ॥",
          arabicOrSanskrit:
            "मांगल्यं तनोतु मे । कल्याणानां निधानं सकलजगदिदं संपदामेकहेतुः ॥",
          english:
            "With the divine grace of the Almighty and cherished ancestors, we invite you to share our sacred wedding vows.",
          tag: "Vedic Auspicious Blessing",
        };
      case "muslim":
        return {
          title: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
          arabicOrSanskrit:
            "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
          english:
            "“And among His signs is that He created for you mates from among yourselves, that you may dwell in peace and tranquility.” (Surah Ar-Rum 30:21)",
          tag: "Sacred Nikah Blessing",
        };
      default:
        return {
          title: "Two Destinies · One Infinite Sky",
          arabicOrSanskrit:
            "“Under the quiet blessing of the crescent moon and starlit skies, two souls intertwine into an infinite dream.”",
          english: quote,
          tag: "Celestial Proclamation",
        };
    }
  };

  const invocation = getInvocation();

  return (
    <div className="celestial-template-root min-h-screen bg-[#F1E8E1] text-[#685868] font-cormorant relative selection:bg-[#E2B993]/40 selection:text-[#36281D]">
      {/* Floating Petals Physics Canvas (3 Depth Layers) */}
      <CelestialPetalCanvas density={24} />

      {/* Twinkling Stardust Background Canvas */}
      <CelestialStardustCanvas />

      {/* Desktop Stardust Cursor Light */}
      <DesktopStardustCursor />

      {/* Audio Element */}
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
        <source src="/templates/celestial-rose/music.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Soundtrack Player */}
      <button
        type="button"
        onClick={toggleAudio}
        aria-label={isPlayingMusic ? "Mute celestial soundtrack" : "Play celestial soundtrack"}
        className="celestial-audio-pill"
      >
        {isPlayingMusic ? (
          <>
            <SpeakerHigh size={18} weight="fill" className="text-[#E2B993]" />
            <span className="flex items-center gap-0.5">
              <span className="soundwave-bar-celestial" />
              <span className="soundwave-bar-celestial" />
              <span className="soundwave-bar-celestial" />
              <span className="soundwave-bar-celestial" />
            </span>
          </>
        ) : (
          <>
            <SpeakerSlash size={18} weight="fill" className="text-[#788898]" />
            <span>PLAY SOUNDTRACK</span>
          </>
        )}
      </button>

      {/* ====================================================
          SCENE 01: HERO — THE CELESTIAL ROSE TERRACE (VIDEO WITH MULTI-LAYER STACK & POINTER PARALLAX)
          ==================================================== */}
      <section
        ref={heroContainerRef}
        onMouseMove={handleHeroMouseMove}
        onClick={!hasStarted ? handleStartExperience : undefined}
        className={`relative w-full h-[100svh] min-h-[100dvh] overflow-hidden flex flex-col justify-between items-center text-center select-none bg-[#36281D] ${
          !hasStarted ? "cursor-pointer" : ""
        }`}
      >
        {/* Layer 0: Background Video with Scroll Scaling (No Autoplay, No Loop - Plays once on User Click) */}
        <motion.div
          style={{ scale: heroVideoScale, y: heroVideoY }}
          className="absolute inset-0 w-full h-full z-0"
        >
          <video
            ref={heroVideoRef}
            src={videoUrl}
            playsInline
            muted
            preload="auto"
            className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.03]"
          />
        </motion.div>

        {/* Layer 1: Atmospheric Light Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/65 z-[1] pointer-events-none" />

        {/* Top Header: Faith Switcher & Celestial Crest */}
        <header className="relative z-20 w-full px-3 pt-3 sm:px-6 sm:pt-6 flex flex-wrap items-center justify-between gap-2 max-w-6xl mx-auto">
          <div className="flex items-center gap-1.5 text-[#E2B993] font-cinzel text-[10px] sm:text-xs font-bold tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            <MoonStars size={16} weight="fill" className="text-[#C9A46E]" />
            <span>CELESTIAL ROSE DREAMSCAPE</span>
          </div>

          <div className="inline-flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-full bg-black/60 backdrop-blur-md border border-[#E2B993]/40 shadow-md text-xs font-montserrat">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReligion("universal");
              }}
              className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full transition-all text-[9px] sm:text-[11px] font-semibold flex items-center gap-1 ${
                selectedReligion === "universal"
                  ? "bg-[#C9A46E] text-[#36281D] shadow-sm font-bold"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <GlobeHemisphereWest size={11} weight="bold" />
              Universal
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReligion("hindu");
              }}
              className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full transition-all text-[9px] sm:text-[11px] font-semibold flex items-center gap-1 ${
                selectedReligion === "hindu"
                  ? "bg-[#C9A46E] text-[#36281D] shadow-sm font-bold"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <FlowerLotus size={11} weight="bold" />
              Hindu
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReligion("muslim");
              }}
              className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full transition-all text-[9px] sm:text-[11px] font-semibold flex items-center gap-1 ${
                selectedReligion === "muslim"
                  ? "bg-[#C9A46E] text-[#36281D] shadow-sm font-bold"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <MoonStars size={11} weight="bold" />
              Muslim
            </button>
          </div>
        </header>

        {/* AnimatePresence for Unveiled Invitation Content After 5.5s */}
        <AnimatePresence>
          {isIntroComplete && (
            /* Unveiled State: Monumental Editorial Typography & Scroll Activation */
            <React.Fragment key="unveiled-content">
              {/* Layer 3: Monumental Editorial Couple Typography with Pointer & Scroll Parallax */}
              <motion.div
                key="hero-typography"
                style={{
                  x: textParallaxX,
                  y: textParallaxY,
                  translateY: heroTypographyY,
                  opacity: heroOpacity,
                }}
                initial={{ opacity: 0, scale: 0.94, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 my-auto px-4 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-1 sm:space-y-2 text-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.9 }}
                  className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-black/40 border border-[#E2B993]/50 backdrop-blur-md text-[#E2B993] text-[9px] sm:text-[11px] font-montserrat uppercase tracking-[0.28em] font-semibold shadow-xl"
                >
                  <Sparkle size={12} weight="fill" className="text-[#C9A46E]" />
                  <span>TOGETHER UNDER THE SAME MOON</span>
                  <Sparkle size={12} weight="fill" className="text-[#C9A46E]" />
                </motion.div>

                {/* GROOM NAME */}
                <motion.h1
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 1 }}
                  className="font-great-vibes text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#F1E8E1] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] leading-tight font-normal"
                >
                  {groomName}
                </motion.h1>

                {/* FLORAL CELESTIAL AMPERSAND */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="py-0"
                >
                  <span className="font-great-vibes text-3xl sm:text-5xl text-[#E2B993] drop-shadow-[0_3px_20px_rgba(0,0,0,0.95)] block">
                    &amp;
                  </span>
                </motion.div>

                {/* BRIDE NAME */}
                <motion.h1
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35, duration: 1 }}
                  className="font-great-vibes text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#F1E8E1] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] leading-tight font-normal"
                >
                  {brideName}
                </motion.h1>

                {/* WEDDING DATE CHIP */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="pt-2"
                >
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/60 backdrop-blur-md border border-[#E2B993]/70 text-[#F1E8E1] text-[10px] sm:text-xs font-montserrat shadow-2xl max-w-[90vw] truncate">
                    <span className="text-[#E2B993] font-bold">✦ {dayStr}, {dateStr} {yearStr}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-stone-200 truncate">{venueName.split("&")[0]?.trim() || venueName}</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div
                key="hero-scroll-indicator"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.8 }}
                className="relative z-20 pb-6 md:pb-8 flex flex-col items-center gap-1 cursor-pointer"
                onClick={scrollToContent}
              >
                <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.3em] text-[#F1E8E1] font-montserrat font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Scroll to Enter Dream
                </span>
                <motion.div
                  animate={{ y: [0, 7, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                >
                  <CaretDown size={20} weight="bold" className="text-[#E2B993] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]" />
                </motion.div>
              </motion.div>
            </React.Fragment>
          )}
        </AnimatePresence>
      </section>

      {/* ====================================================
          SEAMLESS BLEND MIST & PETAL TRANSITION
          ==================================================== */}
      <main ref={contentSectionRef} className="relative z-10 overflow-hidden bg-[#F1E8E1]">

      {/* ====================================================
          SCENE 02: CELESTIAL ORBIT COUNTDOWN & SACRED PROCLAMATION
          ==================================================== */}
      <section className="py-20 sm:py-28 px-4 bg-gradient-to-b from-[#F1E8E1] via-[#E8B8B8]/20 to-[#F1E8E1] text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Orbital Countdown Ring */}
          <CelestialOrbitCountdown targetDate={rawDate} />

          {/* Consecrated Sacred Blessings Card */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9 }}
            className="celestial-stationery-card rounded-[2.5rem] p-8 sm:p-14 space-y-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#E2B993]/25 border border-[#C9A46E]/60 text-[#685868] text-xs font-bold font-montserrat uppercase tracking-[0.2em]">
              <Sparkle size={14} weight="fill" className="text-[#C9A46E]" />
              <span>{invocation.tag}</span>
              <Sparkle size={14} weight="fill" className="text-[#C9A46E]" />
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#685868] tracking-tight">
              {invocation.title}
            </h2>

            <p className="font-amiri text-lg sm:text-2xl md:text-3xl text-[#5898B8] italic leading-relaxed whitespace-pre-line max-w-2xl mx-auto">
              {invocation.arabicOrSanskrit}
            </p>

            <div className="w-28 sm:w-36 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A46E] to-transparent mx-auto" />

            <p className="font-cormorant text-base sm:text-xl md:text-2xl text-[#685868] leading-relaxed max-w-xl mx-auto font-medium">
              {invocation.english}
            </p>

            {/* Groom & Bride Pedestals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 text-left">
              {/* Groom */}
              <div className="p-6 rounded-3xl bg-white/70 border border-[#C9A46E]/40 backdrop-blur-md space-y-2 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5898B8] font-montserrat block">
                  The Groom
                </span>
                <h3 className="text-2xl font-playfair font-bold text-[#685868]">
                  {groomName}
                </h3>
                <p className="text-xs sm:text-sm text-[#788898] font-cormorant italic">
                  {groomParents}
                </p>
                {(groomEducation || groomProfession) && (
                  <p className="text-[11px] text-[#C9A46E] font-montserrat pt-1 font-medium">
                    {groomEducation} · {groomProfession}
                  </p>
                )}
              </div>

              {/* Bride */}
              <div className="p-6 rounded-3xl bg-white/70 border border-[#C9A46E]/40 backdrop-blur-md space-y-2 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5898B8] font-montserrat block">
                  The Bride
                </span>
                <h3 className="text-2xl font-playfair font-bold text-[#685868]">
                  {brideName}
                </h3>
                <p className="text-xs sm:text-sm text-[#788898] font-cormorant italic">
                  {brideParents}
                </p>
                {(brideEducation || brideProfession) && (
                  <p className="text-[11px] text-[#C9A46E] font-montserrat pt-1 font-medium">
                    {brideEducation} · {brideProfession}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================
          SCENE 03: CONSTELLATION STORY (PINNED SCROLL-CONNECTED STARS)
          ==================================================== */}
      <section
        ref={storySectionRef}
        className="py-24 sm:py-32 px-4 bg-gradient-to-b from-[#685868] via-[#4888A8] to-[#36281D] text-[#F1E8E1] relative z-10 overflow-hidden"
      >
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#E2B993]/50 text-[#E2B993] text-xs font-bold font-montserrat uppercase tracking-[0.25em] backdrop-blur-md">
              <Star size={14} weight="fill" />
              <span>Written in the Stars</span>
              <Star size={14} weight="fill" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-[#F1E8E1]">
              The Constellation of Our Love
            </h2>
            <p className="text-xs sm:text-sm text-[#E8B8B8] font-cormorant italic max-w-md mx-auto">
              Every milestone is a star that guided us toward this celestial union
            </p>
          </div>

          {/* Connected Constellation Timeline Milestones */}
          <div className="relative border-l-2 border-[#C9A46E]/40 ml-4 sm:ml-32 space-y-12 pl-6 sm:pl-10">
            {milestones.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="relative space-y-3"
              >
                {/* Glowing Star Node */}
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-[#C9A46E] border-2 border-white shadow-[0_0_15px_#E2B993] flex items-center justify-center">
                  <Star size={12} weight="fill" className="text-[#36281D]" />
                </div>

                <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#E2B993] text-[11px] font-montserrat font-bold uppercase tracking-widest">
                  {item.year}
                </div>

                <h3 className="text-xl sm:text-2xl font-playfair font-bold text-[#F1E8E1]">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#F1E8E1]/85 font-cormorant italic max-w-lg leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          SCENE 04: 3D ZERO-GRAVITY MEMORIES GALLERY
          ==================================================== */}
      <section className="py-24 sm:py-32 px-4 bg-[#F1E8E1] text-[#685868] relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#5898B8] font-bold font-montserrat block">
              Ethereal Keepsakes
            </span>
            <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-[#685868]">
              Memories in Zero-Gravity
            </h2>
            <p className="text-xs sm:text-sm text-[#788898] font-cormorant italic max-w-md mx-auto">
              Moments suspended in time, floating under the soft glow of celestial skies
            </p>
          </div>

          {/* Grid of 3D Spatial Gallery Frames */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryImages.map((imgSrc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: (idx % 3) * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer rounded-3xl overflow-hidden border border-[#C9A46E]/50 shadow-xl bg-white p-3.5 transition-shadow hover:shadow-[0_20px_50px_rgba(88,152,184,0.25)]"
                onClick={() => handleOpenPhoto(imgSrc, idx)}
              >
                <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden">
                  <img
                    src={imgSrc}
                    alt="Celestial gallery photograph"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/65 border border-[#E2B993] text-[#E2B993] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <MagnifyingGlassPlus size={16} weight="bold" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          SCENE 05: SCRATCH THE STARS (INTERACTIVE CELESTIAL FOIL REVEAL)
          ==================================================== */}
      <section className="py-20 sm:py-28 px-4 bg-gradient-to-b from-[#F1E8E1] via-[#5898B8]/15 to-[#F1E8E1] text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto space-y-3"
        >
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#5898B8] font-bold font-montserrat block">
            Celestial Discovery
          </span>
          <h2 className="text-2xl sm:text-4xl font-playfair font-bold text-[#685868]">
            Scratch the Stars
          </h2>
          <p className="text-xs sm:text-sm text-[#788898] font-cormorant italic max-w-md mx-auto">
            Gently rub the starlit metallic surface to unveil our official wedding date and muhurat
          </p>

          <div className="pt-4">
            <ScratchTheStarsCard
              brideName={brideName}
              groomName={groomName}
              dayStr={dayStr}
              dateStr={dateStr}
              yearStr={yearStr}
              weddingTime={data?.weddingTime || defaultData.weddingTime}
              venueName={venueName}
            />
          </div>
        </motion.div>
      </section>

      {/* ====================================================
          SCENE 06: WATER RIPPLE TRANSITION & FLOATING DREAM WORLDS (COLLAPSIBLE ACCORDION ITINERARY)
          ==================================================== */}
      <section className="py-16 sm:py-28 px-3 sm:px-4 bg-[#F1E8E1] text-[#685868] relative z-10 celestial-marble-reflection">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
          <div className="text-center space-y-2 sm:space-y-3">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#5898B8] font-bold font-montserrat block">
              Celebration Itinerary
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#685868]">
              Floating Dream Worlds
            </h2>
            <p className="text-xs sm:text-sm text-[#788898] font-cormorant italic max-w-md mx-auto">
              Tap any ceremonial rite to unveil its atmospheric realm and details
            </p>
          </div>

          {/* Collapsible Accordion Event Cards */}
          <div className="space-y-3.5 sm:space-y-4">
            {events.map((evt: any, idx: number) => {
              const isExpanded = selectedEventIdx === idx;
              return (
                <div
                  key={idx}
                  className={`celestial-stationery-card rounded-2xl sm:rounded-3xl transition-all duration-300 overflow-hidden border ${
                    isExpanded
                      ? "border-[#5898B8]/80 shadow-[0_12px_35px_rgba(88,152,184,0.2)]"
                      : "border-[#C9A46E]/40 hover:border-[#C9A46E]/80 shadow-sm"
                  }`}
                >
                  {/* Accordion Header Bar */}
                  <button
                    type="button"
                    onClick={() => setSelectedEventIdx(isExpanded ? -1 : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                      <span
                        className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold font-montserrat transition-all ${
                          isExpanded
                            ? "bg-[#5898B8] text-[#F1E8E1] shadow-sm"
                            : "bg-[#5898B8]/15 text-[#5898B8]"
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-xl font-playfair font-bold text-[#685868] truncate">
                          {evt.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-[#788898] font-montserrat flex items-center gap-1.5 mt-0.5">
                          <Clock size={12} weight="bold" className="text-[#C9A46E]" />
                          <span>{evt.time}</span>
                          {evt.chamber && (
                            <>
                              <span className="text-[#C9A46E]/60">·</span>
                              <span className="text-[#5898B8] font-medium truncate">{evt.chamber}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-shrink-0 p-1.5 rounded-full bg-white/70 border border-[#C9A46E]/30 text-[#685868]"
                    >
                      <CaretDown size={16} weight="bold" />
                    </motion.div>
                  </button>

                  {/* Expanded Accordion Body */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-5 pt-1 sm:px-6 sm:pb-6 space-y-3.5 border-t border-[#C9A46E]/20">
                          {evt.description && (
                            <p className="text-xs sm:text-sm text-[#788898] font-cormorant leading-relaxed pt-2">
                              {evt.description}
                            </p>
                          )}

                          {/* Date & Location Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            <div className="p-3 rounded-xl bg-white/85 border border-[#C9A46E]/35 space-y-0.5">
                              <span className="text-[9px] uppercase font-bold tracking-wider text-[#5898B8] font-montserrat flex items-center gap-1">
                                <CalendarCheck size={12} weight="bold" /> Date &amp; Timing
                              </span>
                              <p className="text-xs sm:text-sm font-bold text-[#36281D] font-cormorant">
                                {evt.date} · {evt.time}
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-white/85 border border-[#C9A46E]/35 space-y-0.5">
                              <span className="text-[9px] uppercase font-bold tracking-wider text-[#5898B8] font-montserrat flex items-center gap-1">
                                <MapPin size={12} weight="bold" /> Location
                              </span>
                              <p className="text-xs sm:text-sm font-bold text-[#36281D] font-cormorant truncate">
                                {evt.venue || venueName}
                              </p>
                            </div>
                          </div>

                          {evt.dress && (
                            <div className="p-3 rounded-xl bg-[#5898B8]/10 border border-[#C9A46E]/30 flex items-center justify-between gap-2 text-left">
                              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-[#5898B8] font-montserrat">
                                Attire &amp; Palette:
                              </span>
                              <span className="text-xs sm:text-sm font-bold text-[#685868] font-cormorant">
                                {evt.dress}
                              </span>
                            </div>
                          )}

                          {/* CTA Get Directions */}
                          <div className="pt-1 text-center">
                            <a
                              href={
                                venueMapUrl ||
                                `https://maps.google.com/?q=${encodeURIComponent(
                                  evt.venue || venueName
                                )}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full celestial-btn-champagne text-[11px] font-bold font-montserrat shadow-md cursor-pointer"
                            >
                              <MapPin size={13} weight="bold" />
                              <span>Get Directions</span>
                              <ArrowSquareOut size={12} />
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
        </div>
      </section>

      {/* ====================================================
          SCENE 07: THE CELESTIAL ESTATE & GROUNDS (VENUE FLY-IN)
          ==================================================== */}
      <section className="py-20 sm:py-32 px-4 bg-[#F1E8E1] text-[#685868] text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="celestial-stationery-card rounded-[2.5rem] p-8 sm:p-14 space-y-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
              className="w-16 h-16 rounded-full bg-[#5898B8] text-[#F1E8E1] flex items-center justify-center mx-auto shadow-lg border border-[#C9A46E]"
            >
              <Compass size={28} weight="fill" />
            </motion.div>

            <div className="space-y-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C9A46E] font-bold font-montserrat">
                The Celestial Estate
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#685868]">
                {venueName}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[#788898] max-w-lg mx-auto font-cormorant font-medium">
                {venueAddress}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full celestial-btn-champagne text-xs font-bold font-montserrat flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <ArrowSquareOut size={16} weight="bold" />
                <span>Google Maps Navigation</span>
              </a>

              <button
                onClick={handleCopyAddress}
                className="px-6 py-3.5 rounded-full bg-white border border-[#C9A46E] hover:border-[#5898B8] text-[#685868] text-xs font-bold font-montserrat flex items-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                {copiedAddress ? (
                  <>
                    <CheckCircle size={16} weight="fill" className="text-emerald-700" />
                    <span>Address Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} weight="bold" />
                    <span>Copy Estate Address</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================
          SCENE 08: RSVP — WISH UPON A STAR
          ==================================================== */}
      <section className="py-20 sm:py-32 px-4 bg-gradient-to-b from-[#4888A8] via-[#5898B8] to-[#36281D] text-[#F1E8E1] text-center relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 sm:p-12 rounded-[2.5rem] bg-black/40 border border-[#E2B993]/60 backdrop-blur-md shadow-2xl space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#E2B993] text-[#36281D] flex items-center justify-center shadow-xl mx-auto border border-white">
              <Star size={30} weight="fill" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#E2B993] font-bold font-montserrat block">
                Celebrate With Us
              </span>
              <h2 className="text-2xl sm:text-4xl font-playfair font-bold text-white">
                Your Presence Is Our Honour
              </h2>
              <p className="text-xs sm:text-sm text-[#F1E8E1]/80 max-w-md mx-auto font-cormorant italic leading-relaxed">
                Kindly confirm your gracious presence under the stars.
              </p>
            </div>

            <motion.button
              type="button"
              onClick={() => setIsRsvpOpen(true)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="celestial-btn-champagne w-full sm:w-auto sm:min-w-[280px] mx-auto px-8 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 cursor-pointer font-montserrat"
            >
              <Sparkle size={18} weight="fill" />
              <span>✦ Wish Upon a Star (RSVP) ✦</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ====================================================
          FOOTER & REPLAY
          ==================================================== */}
      <footer className="py-14 bg-[#2C2019] border-t border-[#C9A46E]/30 text-center space-y-4 text-xs text-[#F1E8E1]/80">
        <p className="font-cormorant italic text-base text-[#F1E8E1]">
          Two hearts united under the eternal canopy of stars, <br />
          {groomName} &amp; {brideName}
        </p>
        <p className="text-[11px] font-montserrat tracking-widest text-[#E2B993] font-semibold">
          {hashtag}
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 text-xs text-[#E2B993] hover:text-white font-semibold cursor-pointer transition-colors"
          >
            <ArrowsClockwise size={14} /> Back to Top
          </button>
        </div>
      </footer>
      </main>

      {/* ====================================================
          FULLSCREEN PHOTO LIGHTBOX MODAL
          ==================================================== */}
      <AnimatePresence>
        {(activePhotoSrc !== null || activePhotoIdx !== null) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
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
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer z-50 shadow-lg border border-white/20"
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
                setActivePhotoSrc(galleryImages[newIdx]);
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer z-50 shadow-lg border border-white/20"
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
                setActivePhotoSrc(galleryImages[newIdx]);
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer z-50 shadow-lg border border-white/20"
              aria-label="Next photo"
            >
              <CaretRight size={24} weight="bold" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[82vh] rounded-2xl overflow-hidden shadow-2xl border border-[#E2B993] relative"
            >
              <img
                src={
                  activePhotoSrc ||
                  (activePhotoIdx !== null && galleryImages[activePhotoIdx]
                    ? galleryImages[activePhotoIdx]
                    : galleryImages[0])
                }
                alt="Celestial memory"
                className="w-full h-full object-contain max-h-[82vh]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================
          RSVP MODAL (STAR-FLIGHT CONFIRMATION)
          ==================================================== */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setIsRsvpOpen(false)}
          >
            <motion.div
              className="w-full max-w-lg max-h-[88dvh] bg-[#F1E8E1] border-2 border-[#C9A46E] rounded-3xl shadow-2xl relative flex flex-col my-auto overflow-hidden text-[#685868] font-montserrat"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-[#C9A46E]/30 flex items-center justify-between bg-[#F1E8E1]/95 sticky top-0 z-10">
                <div>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#5898B8] font-bold block">
                    ✦ CELESTIAL GUEST REGISTER ✦
                  </span>
                  <h3 className="text-xl sm:text-2xl font-playfair font-bold text-[#685868] leading-tight">
                    Confirm Your Presence
                  </h3>
                </div>

                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-[#5898B8] text-[#F1E8E1] flex items-center justify-center hover:bg-[#4888A8] transition-colors cursor-pointer flex-shrink-0 shadow-md border border-white/40"
                  onClick={() => setIsRsvpOpen(false)}
                  aria-label="Close RSVP form"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain">
                {isRsvpSubmitted ? (
                  <div className="text-center py-6 space-y-3">
                    <motion.div
                      initial={{ scale: 0, y: 30 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-16 h-16 rounded-full bg-[#C9A46E] text-[#36281D] flex items-center justify-center mx-auto shadow-md"
                    >
                      <Star size={32} weight="fill" />
                    </motion.div>
                    <h4 className="text-xl font-playfair font-bold text-[#685868]">
                      Your star has joined our celebration!
                    </h4>
                    <p className="text-xs sm:text-sm text-[#788898] font-cormorant italic leading-relaxed max-w-sm mx-auto">
                      Your presence has been recorded in the celestial ledger. We eagerly anticipate celebrating under the stars with you.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsRsvpOpen(false)}
                      className="mt-4 px-6 py-2.5 rounded-full bg-[#5898B8] text-[#F1E8E1] text-xs font-bold font-montserrat uppercase tracking-wider shadow-md"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-3.5 text-left">
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#5898B8] mb-1">
                        Honoured Guest Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        placeholder="e.g. Liam & Sophia"
                        className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-[#C9A46E] text-xs sm:text-sm text-[#36281D] focus:outline-none focus:ring-2 focus:ring-[#5898B8]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#5898B8] mb-1">
                          Contact / Mobile
                        </label>
                        <input
                          type="tel"
                          value={rsvpPhone}
                          onChange={(e) => setRsvpPhone(e.target.value)}
                          placeholder="+91 98000 00000"
                          className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-[#C9A46E] text-xs sm:text-sm text-[#36281D] focus:outline-none focus:ring-2 focus:ring-[#5898B8]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#5898B8] mb-1">
                          Number of Guests
                        </label>
                        <select
                          value={rsvpGuests}
                          onChange={(e) => setRsvpGuests(e.target.value)}
                          className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-[#C9A46E] text-xs sm:text-sm text-[#36281D] focus:outline-none focus:ring-2 focus:ring-[#5898B8]"
                        >
                          <option value="1">1 Guest</option>
                          <option value="2">2 Guests</option>
                          <option value="3">3 Guests</option>
                          <option value="4">4+ Guests</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#5898B8] mb-1">
                        Attendance Confirmation
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setRsvpAttending("yes")}
                          className={`py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            rsvpAttending === "yes"
                              ? "bg-[#5898B8] text-white shadow-md border-2 border-[#5898B8]"
                              : "bg-white border border-[#C9A46E] text-[#685868]"
                          }`}
                        >
                          Joyfully Attend
                        </button>
                        <button
                          type="button"
                          onClick={() => setRsvpAttending("no")}
                          className={`py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            rsvpAttending === "no"
                              ? "bg-[#5898B8] text-white shadow-md border-2 border-[#5898B8]"
                              : "bg-white border border-[#C9A46E] text-[#685868]"
                          }`}
                        >
                          Regretfully Decline
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#5898B8] mb-1">
                        Warm Wishes &amp; Notes
                      </label>
                      <textarea
                        rows={2}
                        value={rsvpWishes}
                        onChange={(e) => setRsvpWishes(e.target.value)}
                        placeholder="Share your celestial wishes with the couple..."
                        className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-white border border-[#C9A46E] text-xs sm:text-sm text-[#36281D] focus:outline-none focus:ring-2 focus:ring-[#5898B8]"
                      />
                    </div>

                    <div className="pt-2 pb-1">
                      <button
                        type="submit"
                        disabled={starAscending}
                        className="w-full py-3.5 sm:py-4 rounded-xl celestial-btn-champagne text-xs font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkle size={16} weight="fill" />
                        <span>{starAscending ? "Transmitting Star..." : "✦ Send Wishes to the Stars ✦"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
