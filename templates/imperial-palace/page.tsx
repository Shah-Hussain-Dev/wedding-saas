"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Crown,
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
  EnvelopeOpen,
  Envelope,
  MagnifyingGlassPlus,
  ArrowsClockwise,
  GlobeHemisphereWest,
  FlowerLotus,
  MoonStars,
  Eye,
  HandGrabbing,
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
    return "/templates/imperial-palace/music.mp3";
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
// SUB-COMPONENT: FLOATING BURGUNDY ROSE PETALS & GOLD DUST CANVAS
// ----------------------------------------------------
function ImperialPetalCanvas({ density = 18 }: { density?: number }) {
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

    // Rose petals and gold dust particles
    const colors = ["#551618", "#833624", "#2C0F0D", "#B89773", "#D5BA97"];
    const particles = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 12 + 6,
      speedY: Math.random() * 0.75 + 0.35,
      speedX: (Math.random() - 0.5) * 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.3,
      isGoldDust: Math.random() > 0.7,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.005) * 0.5 + p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.isGoldDust) {
          // Shimmering gold dust particle
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Curving rose petal shape
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.6, p.size * 0.35, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 opacity-75"
    />
  );
}

// ----------------------------------------------------
// SUB-COMPONENT: REALISTIC INTERACTIVE SCRATCH CARD (DATE REVEAL)
// ----------------------------------------------------
function RoyalScratchRevealCard({
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

    // Draw luxury antique gold & bronze metallic foil surface
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#B89773");
    gradient.addColorStop(0.3, "#D5BA97");
    gradient.addColorStop(0.6, "#986E47");
    gradient.addColorStop(1, "#593C28");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative embossed pattern on foil
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;
    for (let i = 20; i < width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 10);
      ctx.lineTo(i, height - 10);
      ctx.stroke();
    }

    // Foil text label
    ctx.fillStyle = "#2C0F0D";
    ctx.font = "bold 12px 'Montserrat', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✦ SCRATCH TO REVEAL DATE ✦", width / 2, height / 2 - 14);

    ctx.fillStyle = "#593C28";
    ctx.font = "italic 12px 'Cormorant Garamond', serif";
    ctx.fillText("Rub or swipe to unveil the royal wedding date", width / 2, height / 2 + 12);

    // Calculate scratched percentage
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

        if (pct > 50 && !isRevealed) {
          setIsRevealed(true);
          confetti({
            particleCount: 85,
            spread: 75,
            origin: { y: 0.6 },
            colors: ["#B89773", "#D5BA97", "#551618", "#E5D8C4", "#833624"],
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
      <div className="imperial-scratch-container relative w-full max-w-[420px] h-[260px] sm:h-[280px]">
        {/* Revealed Royal Date Content Behind the Foil */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#36281D] via-[#2C0F0D] to-[#36281D] p-5 sm:p-6 flex flex-col items-center justify-center text-center overflow-hidden border-2 border-[#B89773]/70">
          <div className="space-y-2 max-w-sm">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.25em] text-[#D5BA97] font-montserrat flex items-center justify-center gap-1.5">
              <Sparkle size={12} weight="fill" className="text-[#B89773]" />
              Official Wedding Date
              <Sparkle size={12} weight="fill" className="text-[#B89773]" />
            </span>

            <h4 className="font-great-vibes text-2xl sm:text-3xl text-[#E5D8C4] leading-tight">
              {groomName} &amp; {brideName}
            </h4>

            {/* Monumental Date Frame */}
            <div className="py-1 px-4 rounded-2xl bg-black/40 border border-[#B89773]/60 backdrop-blur-md shadow-lg space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D5BA97] font-montserrat">
                {dayStr}
              </p>
              <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white tracking-wide">
                {dateStr} {yearStr}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#AEA290] font-montserrat flex items-center justify-center gap-1">
                <Clock size={12} weight="bold" className="text-[#B89773]" />
                <span>{weddingTime}</span>
              </p>
            </div>

            <div className="pt-0.5 text-[10px] text-[#D5BA97]/90 font-montserrat flex items-center justify-center gap-1 truncate max-w-xs mx-auto">
              <MapPin size={12} weight="fill" className="text-[#B89773] flex-shrink-0" />
              <span className="truncate">{venueName.split("&")[0]?.trim() || venueName}</span>
            </div>
          </div>
        </div>

        {/* Scratchable Foil Canvas */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            className="imperial-scratch-canvas transition-opacity duration-700"
          />
        )}
      </div>

      {/* Progress & Micro-Helper */}
      <div className="mt-3 flex items-center justify-between w-full max-w-[420px] px-2 text-xs font-montserrat text-[#593C28]">
        <span className="text-[11px] font-semibold flex items-center gap-1 text-[#551618]">
          <HandGrabbing size={14} weight="bold" />
          {isRevealed ? "✦ Royal Date Unveiled!" : "Rub foil with finger or mouse"}
        </span>
        <span className="font-mono text-[11px] font-bold text-[#986E47]">
          {isRevealed ? "100%" : `${scratchProgress}%`}
        </span>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// MAIN TEMPLATE EXPORT: IMPERIAL PALACE
// ----------------------------------------------------
interface ImperialPalaceProps {
  data?: any;
}

export default function ImperialPalace({ data }: ImperialPalaceProps) {
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

  const videoUrl =
    data?.videoUrl || defaultData.videoUrl || "/videos/royal-elegance-royal.mp4";

  // Faith / Religion selection (Universal / Hindu / Muslim)
  const initialReligion = data?.religion || defaultData.religion || "universal";
  const [selectedReligion, setSelectedReligion] = useState<
    "universal" | "hindu" | "muslim"
  >(
    initialReligion === "hindu" || initialReligion === "muslim"
      ? initialReligion
      : "universal"
  );

  // Video Gate Timing & Content Reveal State
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [isContentRevealed, setIsContentRevealed] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Love Letter Envelope Open State
  const [isLetterOpened, setIsLetterOpened] = useState(false);

  // Active Chamber Tab for Events
  const [selectedChamberIdx, setSelectedChamberIdx] = useState(0);

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

  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contentSectionRef = useRef<HTMLDivElement | null>(null);
  const audioTrackUrl = resolveAudioTrack(
    data?.musicTrack || defaultData.musicTrack
  );

  // Lock body scroll until the gate opens and content is revealed
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

  // Video playback time listener to trigger content reveal at ~5.8s
  const handleVideoTimeUpdate = () => {
    if (!heroVideoRef.current || !isVideoStarted) return;
    const ct = heroVideoRef.current.currentTime;

    if (ct >= 5.8 && !isContentRevealed) {
      setIsContentRevealed(true);
      confetti({
        particleCount: 100,
        spread: 85,
        origin: { y: 0.55 },
        colors: ["#B89773", "#D5BA97", "#551618", "#E5D8C4", "#833624"],
      });
    }
  };

  // User click interaction to start video and music
  const handleStartExperience = () => {
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
        console.warn("Audio autoplay blocked on entrance click:", err);
      });
    }

    // Fallback timer at 6.2s in case timeupdate is delayed
    setTimeout(() => {
      setIsContentRevealed(true);
    }, 6200);
  };

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
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: data?.id || "preview",
          senderName: rsvpName || "Esteemed Dignitary",
          messageText: `[IMPERIAL RSVP - ${rsvpAttending.toUpperCase()}] Guests: ${rsvpGuests}. Phone: ${rsvpPhone}. Wishes: ${rsvpWishes}`,
        }),
      });
    } catch {
      // Fallback
    }

    setIsRsvpSubmitted(true);
    confetti({
      particleCount: 110,
      spread: 85,
      origin: { y: 0.65 },
      colors: ["#B89773", "#D5BA97", "#551618", "#E5D8C4", "#833624"],
    });
  };

  const handleReplayEntrance = () => {
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

  // Dual Faith Invocation Texts
  const getInvocation = () => {
    switch (selectedReligion) {
      case "hindu":
        return {
          title: "॥ श्री गणेशाय नमः ॥",
          arabicOrSanskrit:
            "मङ्गलम् भगवान विष्णुः मङ्गलम् गरुडध्वजः । मङ्गलम् पुण्डरीकाक्षः मङ्गलाय तनो हरिः ॥",
          english:
            "With the divine grace of the Almighty and cherished ancestors, we solicit the honour of your esteemed presence.",
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
          title: "Two Hearts · One Imperial Destiny",
          arabicOrSanskrit:
            "“Where there is profound love and sacred honour, miracles illuminate the palace skies.”",
          english: quote,
          tag: "Universal Imperial Proclamation",
        };
    }
  };

  // Scroll-linked Parallax Refs & Transforms
  const heroRef = useRef<HTMLDivElement | null>(null);
  const staircaseRef = useRef<HTMLDivElement | null>(null);
  const proclamationRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const letterRef = useRef<HTMLDivElement | null>(null);

  // Hero Scroll Parallax
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroVideoScale = useTransform(heroScroll, [0, 1], [1, 1.15]);
  const heroVideoY = useTransform(heroScroll, [0, 1], [0, 80]);
  const heroContentY = useTransform(heroScroll, [0, 1], [0, -60]);
  const heroContentOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  // Staircase Section Parallax
  const { scrollYProgress: staircaseScroll } = useScroll({
    target: staircaseRef,
    offset: ["start end", "end start"],
  });
  const staircaseBgY = useTransform(staircaseScroll, [0, 1], [-80, 80]);
  const staircaseBgScale = useTransform(staircaseScroll, [0, 1], [1.05, 1.18]);
  const groomCardY = useTransform(staircaseScroll, [0, 1], [50, -40]);
  const brideCardY = useTransform(staircaseScroll, [0, 1], [80, -20]);
  const chandelierY = useTransform(staircaseScroll, [0, 1], [-40, 50]);

  // Gallery Parallax
  const { scrollYProgress: galleryScroll } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"],
  });
  const galleryBgY = useTransform(galleryScroll, [0, 1], [-60, 60]);
  const galleryCard1Y = useTransform(galleryScroll, [0, 1], [30, -30]);
  const galleryCard2Y = useTransform(galleryScroll, [0, 1], [60, -50]);
  const galleryCard3Y = useTransform(galleryScroll, [0, 1], [20, -20]);

  // Proclamation Parallax
  const { scrollYProgress: proclamationScroll } = useScroll({
    target: proclamationRef,
    offset: ["start end", "end start"],
  });
  const proclamationCardScale = useTransform(proclamationScroll, [0, 0.5, 1], [0.94, 1, 0.98]);
  const proclamationCardY = useTransform(proclamationScroll, [0, 1], [40, -30]);

  const invocation = getInvocation();

  return (
    <div
      className={`imperial-template-root min-h-screen bg-[#E5D8C4] text-[#36281D] font-cormorant relative selection:bg-[#B89773]/40 selection:text-[#2C0F0D] ${
        !isContentRevealed
          ? "h-[100dvh] max-h-screen overflow-hidden touch-none"
          : "overflow-x-hidden"
      }`}
    >
      {/* Floating Rose Petals & Gold Dust System */}
      <ImperialPetalCanvas density={18} />

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
        <source src="/templates/imperial-palace/music.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Soundtrack Player */}
      <button
        type="button"
        onClick={toggleAudio}
        aria-label={isPlayingMusic ? "Mute royal soundtrack" : "Play royal soundtrack"}
        className="imperial-audio-pill"
      >
        {isPlayingMusic ? (
          <>
            <SpeakerHigh size={18} weight="fill" className="text-[#D5BA97]" />
            <span className="flex items-center gap-0.5">
              <span className="soundwave-bar" />
              <span className="soundwave-bar" />
              <span className="soundwave-bar" />
              <span className="soundwave-bar" />
            </span>
          </>
        ) : (
          <>
            <SpeakerSlash size={18} weight="fill" className="text-[#AEA290]" />
            <span>PLAY SOUNDTRACK</span>
          </>
        )}
      </button>

      {/* ====================================================
          SCENE 01: MONUMENTAL CINEMATIC PALACE GATE REVEAL (VIDEO)
          ==================================================== */}
      <section
        ref={heroRef}
        className="relative w-full h-screen min-h-[100dvh] overflow-hidden flex flex-col justify-between items-center text-center select-none bg-[#2C0F0D]"
      >
        {/* Full-Screen Hero Background Video with Scroll Parallax */}
        <motion.div
          style={{ scale: heroVideoScale, y: heroVideoY }}
          className="absolute inset-0 w-full h-full z-0"
        >
          <video
            ref={heroVideoRef}
            src={videoUrl}
            playsInline
            loop={false}
            muted={true}
            preload="auto"
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={() => setIsContentRevealed(true)}
            className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.04]"
          />
        </motion.div>

        {/* Subtle Ambient Vignette & Warm Royal Tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/75 z-[1] pointer-events-none" />

        {/* Top Header: Faith Switcher & Crest (Fluid Mobile Layout) */}
        <header className="relative z-20 w-full px-3 pt-3 sm:px-4 sm:pt-6 flex flex-wrap items-center justify-between gap-2 max-w-6xl mx-auto">
          <div className="flex items-center gap-1.5 text-[#D5BA97] font-cinzel text-[10px] sm:text-xs font-bold tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            <Crown size={15} weight="fill" className="flex-shrink-0" />
            <span>PALAIS IMPÉRIAL</span>
          </div>

          <div className="inline-flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-full bg-black/65 backdrop-blur-md border border-[#B89773]/40 shadow-md text-xs font-montserrat">
            <button
              onClick={() => setSelectedReligion("universal")}
              className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full transition-all text-[9px] sm:text-[11px] font-semibold flex items-center gap-1 ${
                selectedReligion === "universal"
                  ? "bg-[#B89773] text-[#2C0F0D] shadow-sm font-bold"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <GlobeHemisphereWest size={11} weight="bold" />
              Universal
            </button>
            <button
              onClick={() => setSelectedReligion("hindu")}
              className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full transition-all text-[9px] sm:text-[11px] font-semibold flex items-center gap-1 ${
                selectedReligion === "hindu"
                  ? "bg-[#B89773] text-[#2C0F0D] shadow-sm font-bold"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <FlowerLotus size={11} weight="bold" />
              Hindu
            </button>
            <button
              onClick={() => setSelectedReligion("muslim")}
              className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full transition-all text-[9px] sm:text-[11px] font-semibold flex items-center gap-1 ${
                selectedReligion === "muslim"
                  ? "bg-[#B89773] text-[#2C0F0D] shadow-sm font-bold"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <MoonStars size={11} weight="bold" />
              Muslim
            </button>
          </div>
        </header>

        {/* Full-Screen Tap Area When Video Has Not Started */}
        {!isVideoStarted && (
          <div
            onClick={handleStartExperience}
            className="absolute inset-0 z-15 cursor-pointer flex flex-col items-center justify-end pb-16 touch-manipulation"
          />
        )}

        {/* BEFORE USER CLICKS: Sleek, Unobstructed Floating "Tap to Enter Palace" Button */}
        <AnimatePresence>
          {!isVideoStarted && (
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 15, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={handleStartExperience}
              className="relative z-20 pb-16 sm:pb-24 flex flex-col items-center gap-2.5 cursor-pointer group px-4"
            >
              {/* Glowing Pulse Aura */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(184, 151, 115, 0.35)",
                    "0 0 35px rgba(213, 186, 151, 0.7)",
                    "0 0 15px rgba(184, 151, 115, 0.35)",
                  ],
                  scale: [1, 1.025, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: "easeInOut",
                }}
                className="rounded-full"
              >
                <button
                  type="button"
                  className="px-7 py-3.5 sm:px-10 sm:py-4.5 rounded-full bg-gradient-to-r from-[#B89773] via-[#D5BA97] to-[#B89773] text-[#2C0F0D] text-[11px] sm:text-sm font-bold font-montserrat tracking-[0.2em] uppercase shadow-2xl flex items-center gap-2.5 border border-white/50 group-hover:scale-105 transition-transform"
                >
                  <Sparkle size={15} weight="fill" className="text-[#551618] animate-spin-slow" />
                  <span>Tap to Enter Palace</span>
                  <Sparkle size={15} weight="fill" className="text-[#551618] animate-spin-slow" />
                </button>
              </motion.div>

              <span className="text-[9px] sm:text-[11px] tracking-[0.22em] text-[#D5BA97] font-montserrat uppercase font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                ✦ Royal Gates Await Your Presence ✦
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AFTER 5-6 SECONDS: CHOREOGRAPHED MONUMENTAL ROYAL CONTENT REVEAL */}
        <AnimatePresence>
          {isContentRevealed && (
            <motion.div
              key="palace-revealed-content"
              style={{ y: heroContentY, opacity: heroContentOpacity }}
              initial={{ opacity: 0, scale: 0.88, y: 35, filter: "blur(14px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 my-auto px-4 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-1 sm:space-y-2 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-[#D5BA97] text-base drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
              >
                👑
              </motion.div>

              <p className="font-alex-brush text-2xl sm:text-4xl md:text-5xl text-[#E5D8C4] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] tracking-wide font-normal">
                We cordially request your presence
              </p>

              <div className="text-[#B89773] text-[10px] sm:text-xs drop-shadow-md">
                ✦ ✦ ✦
              </div>

              {/* GROOM BLOCK */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="space-y-0.5 pt-0.5"
              >
                <h1 className="font-great-vibes text-4xl sm:text-6xl md:text-8xl text-[#E5D8C4] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] leading-tight font-normal">
                  {groomName}
                </h1>
                <p className="font-cormorant italic text-[11px] sm:text-sm text-stone-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-light max-w-xs sm:max-w-md mx-auto">
                  {groomParents}
                </p>
                {(groomEducation || groomProfession) && (
                  <p className="text-[10px] sm:text-xs text-[#D5BA97] font-montserrat drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-medium">
                    {groomEducation}
                    {groomEducation && groomProfession && " · "}
                    {groomProfession}
                  </p>
                )}
              </motion.div>

              {/* FLORAL / GOLD AMPERSAND WITH PULSE MOTION */}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="py-0"
              >
                <span className="font-great-vibes text-3xl sm:text-5xl text-[#D5BA97] drop-shadow-[0_3px_16px_rgba(0,0,0,0.95)] block">
                  &amp;
                </span>
              </motion.div>

              {/* BRIDE BLOCK */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.8 }}
                className="space-y-0.5"
              >
                <h1 className="font-great-vibes text-4xl sm:text-6xl md:text-8xl text-[#E5D8C4] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] leading-tight font-normal">
                  {brideName}
                </h1>
                <p className="font-cormorant italic text-[11px] sm:text-sm text-stone-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-light max-w-xs sm:max-w-md mx-auto">
                  {brideParents}
                </p>
                {(brideEducation || brideProfession) && (
                  <p className="text-[10px] sm:text-xs text-[#D5BA97] font-montserrat drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-medium">
                    {brideEducation}
                    {brideEducation && brideProfession && " · "}
                    {brideProfession}
                  </p>
                )}
              </motion.div>

              {/* WEDDING DATE & ESTATE CHIP */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="pt-2"
              >
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-black/65 backdrop-blur-md border border-[#B89773]/70 text-[#E5D8C4] text-[10px] sm:text-xs font-montserrat shadow-2xl max-w-[90vw] truncate">
                  <span className="text-[#D5BA97] font-bold">✦ {dayStr}, {dateStr} {yearStr}</span>
                  <span className="text-white/40">·</span>
                  <span className="text-stone-200 truncate">{venueName.split("&")[0]?.trim() || venueName}</span>
                </div>
              </motion.div>
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
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#E5D8C4] font-montserrat font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                Scroll to Explore Palace
              </span>
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              >
                <CaretDown size={20} weight="bold" className="text-[#D5BA97] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ====================================================
          PALACE INTERIOR SECTIONS (ACCESSIBLE UPON GATE OPENING)
          ==================================================== */}
      <main ref={contentSectionRef} className="relative z-10 overflow-hidden bg-[#E5D8C4]">

      {/* ====================================================
          SCENE 02: THE GRAND STAIRCASE & MULTI-PLANE SCROLL PARALLAX
          ==================================================== */}
      <section
        ref={staircaseRef}
        className="relative w-full min-h-[100vh] py-20 sm:py-28 px-4 bg-[#2C0F0D] text-[#E5D8C4] overflow-hidden flex items-center justify-center"
      >
        {/* Background Staircase Layer with Deep Vertical & Scale Parallax */}
        <motion.div
          style={{ y: staircaseBgY, scale: staircaseBgScale }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/templates/imperial-palace/staircase.jpg"
            alt="Monumental Staircase"
            className="w-full h-full object-cover filter brightness-[0.65] contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C0F0D] via-[#2C0F0D]/40 to-[#2C0F0D]" />
        </motion.div>

        {/* Floating Crystal Chandelier with Pendulum Sway Parallax */}
        <motion.div
          style={{ y: chandelierY }}
          animate={{ rotate: [-1.5, 1.5, -1.5] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-5 w-48 sm:w-64 opacity-70 pointer-events-none origin-top"
        >
          <div className="w-full h-24 bg-gradient-to-b from-[#D5BA97]/30 via-transparent to-transparent blur-xl" />
        </motion.div>

        {/* Foreground Multi-Plane Parallax Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#B89773]/60 text-[#D5BA97] text-[10px] sm:text-xs font-bold font-montserrat uppercase tracking-[0.25em] shadow-lg backdrop-blur-md">
              <Crown size={14} weight="fill" />
              <span>Act I · The Grand Staircase</span>
              <Crown size={14} weight="fill" />
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-bold text-[#E5D8C4] tracking-tight">
              A Love Ascending in Grandeur
            </h2>
            <p className="text-sm sm:text-lg text-[#AEA290] font-cormorant italic max-w-xl mx-auto">
              Beneath soaring gilded vaults and chandeliers suspended in time, two destinies intertwine forever.
            </p>
          </motion.div>

          {/* Symmetrical Parallax Pedestals with Differential Scroll Offsets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-left">
            {/* Groom Pedestal */}
            <motion.div
              style={{ y: groomCardY }}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-6 sm:p-8 rounded-3xl bg-[#36281D]/85 border border-[#B89773]/60 backdrop-blur-md space-y-2 shadow-2xl transition-shadow hover:shadow-[0_20px_50px_rgba(184,151,115,0.2)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D5BA97] font-montserrat block">
                  The Noble Groom
                </span>
                <Crown size={16} weight="fill" className="text-[#B89773]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-white">
                {groomName}
              </h3>
              <p className="text-xs sm:text-sm text-[#AEA290] font-cormorant italic leading-relaxed">
                {groomParents}
              </p>
              {(groomEducation || groomProfession) && (
                <div className="pt-2 border-t border-[#B89773]/30">
                  <p className="text-[11px] text-[#D5BA97] font-montserrat font-medium">
                    {groomEducation}
                    {groomEducation && groomProfession && " · "}
                    {groomProfession}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Bride Pedestal */}
            <motion.div
              style={{ y: brideCardY }}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-6 sm:p-8 rounded-3xl bg-[#36281D]/85 border border-[#B89773]/60 backdrop-blur-md space-y-2 shadow-2xl transition-shadow hover:shadow-[0_20px_50px_rgba(184,151,115,0.2)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D5BA97] font-montserrat block">
                  The Noble Bride
                </span>
                <Crown size={16} weight="fill" className="text-[#B89773]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-white">
                {brideName}
              </h3>
              <p className="text-xs sm:text-sm text-[#AEA290] font-cormorant italic leading-relaxed">
                {brideParents}
              </p>
              {(brideEducation || brideProfession) && (
                <div className="pt-2 border-t border-[#B89773]/30">
                  <p className="text-[11px] text-[#D5BA97] font-montserrat font-medium">
                    {brideEducation}
                    {brideEducation && brideProfession && " · "}
                    {brideProfession}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SCENE 03: THE ROYAL INVITATION PROCLAMATION (IVORY BREATHING SPACE)
          ==================================================== */}
      <section
        ref={proclamationRef}
        className="py-20 sm:py-32 px-4 bg-[#E5D8C4] text-[#36281D] relative z-10 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            style={{ scale: proclamationCardScale, y: proclamationCardY }}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9 }}
            className="imperial-stationery-card rounded-[2.5rem] p-8 sm:p-14 md:p-18 space-y-6 text-center"
          >
            {/* Ornamental Corner Filigree */}
            <div className="imperial-gold-corner-tl" />
            <div className="imperial-gold-corner-tr" />
            <div className="imperial-gold-corner-bl" />
            <div className="imperial-gold-corner-br" />

            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#B89773]/20 border border-[#B89773]/60 text-[#551618] text-xs font-bold font-montserrat uppercase tracking-[0.2em]">
              <Crown size={15} weight="fill" />
              <span>{invocation.tag}</span>
              <Crown size={15} weight="fill" />
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#551618] tracking-tight">
              {invocation.title}
            </h2>

            <p className="font-amiri text-lg sm:text-2xl md:text-3xl text-[#593C28] italic leading-relaxed whitespace-pre-line max-w-2xl mx-auto">
              {invocation.arabicOrSanskrit}
            </p>

            <div className="w-28 sm:w-36 h-[1.5px] bg-gradient-to-r from-transparent via-[#B89773] to-transparent mx-auto" />

            <p className="font-cormorant text-base sm:text-xl md:text-2xl text-[#36281D] leading-relaxed max-w-xl mx-auto font-medium">
              {invocation.english}
            </p>

            {/* Consecrated Matrimonial Muhurat & Date Callout */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#36281D] text-[#E5D8C4] text-xs font-montserrat font-bold shadow-md">
                <CalendarCheck size={16} weight="bold" className="text-[#D5BA97]" />
                <span>{dayStr}, {dateStr} {yearStr}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/70 border border-[#B89773] text-[#551618] text-xs font-montserrat font-bold shadow-sm">
                <Clock size={16} weight="bold" className="text-[#B89773]" />
                <span>{data?.weddingTime || defaultData.weddingTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================
          SCENE 04: THE ROYAL SCRATCH CARD EXPERIENCE
          ==================================================== */}
      <section className="py-16 sm:py-24 px-4 bg-[#AEA290]/30 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto space-y-3"
        >
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#551618] font-bold font-montserrat block">
            Interactive Imperial Reveal
          </span>
          <h2 className="text-2xl sm:text-4xl font-playfair font-bold text-[#2C0F0D]">
            The Sovereign Wedding Date
          </h2>
          <p className="text-xs sm:text-sm text-[#593C28] font-cormorant italic max-w-md mx-auto">
            Gently rub the antique gold metallic foil beneath to unveil the official wedding date and matrimonial muhurat
          </p>

          <div className="pt-4">
            <RoyalScratchRevealCard
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
          SCENE 05: OUR STORY AS THE PALACE ART GALLERY (WITH PARALLAX FRAMES)
          ==================================================== */}
      <section
        ref={galleryRef}
        className="py-20 sm:py-32 px-4 bg-[#2C0F0D] text-[#E5D8C4] relative z-10 overflow-hidden"
      >
        {/* Gallery Corridor Background with Parallax */}
        <motion.div
          style={{ y: galleryBgY }}
          className="absolute inset-0 z-0 opacity-25"
        >
          <img
            src="/templates/imperial-palace/art-gallery.jpg"
            alt="Art Gallery Corridor"
            className="w-full h-full object-cover filter brightness-[0.7]"
          />
        </motion.div>

        <div className="relative z-10 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#B89773]/60 text-[#D5BA97] text-xs font-bold font-montserrat uppercase tracking-[0.2em]">
              <Crown size={14} weight="fill" />
              <span>The Imperial Art Gallery</span>
              <Crown size={14} weight="fill" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-[#E5D8C4]">
              Memoirs in Gilded Gold
            </h2>
            <p className="text-xs sm:text-sm text-[#AEA290] font-cormorant italic max-w-md mx-auto">
              Step through our private palace collection commemorating milestones of our union
            </p>
          </div>

          {/* Grid of Gilded Picture Frames with Multi-plane Scroll Offsets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryImages.map((imgSrc, idx) => {
              const frameY = idx % 3 === 0 ? galleryCard1Y : idx % 3 === 1 ? galleryCard2Y : galleryCard3Y;
              return (
                <motion.div
                  key={idx}
                  style={{ y: frameY }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: (idx % 3) * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="imperial-art-frame group cursor-pointer"
                  onClick={() => handleOpenPhoto(imgSrc, idx)}
                >
                  <div className="relative h-80 sm:h-96 overflow-hidden rounded">
                    <img
                      src={imgSrc}
                      alt="Palace gallery photograph"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 border border-[#B89773] text-[#D5BA97] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <MagnifyingGlassPlus size={16} weight="bold" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================
          SCENE 06: WEDDING EVENTS AS PALACE CHAMBERS
          ==================================================== */}
      <section className="py-20 sm:py-32 px-4 bg-[#E5D8C4] text-[#36281D] relative z-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#551618] font-bold font-montserrat block">
              Palace Itinerary
            </span>
            <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-[#551618]">
              Chambers of Celebration
            </h2>
            <p className="text-xs sm:text-sm text-[#593C28] font-cormorant italic max-w-md mx-auto">
              Each ceremonial rite unfolds in a distinct architectural environment of our estate
            </p>

            {/* Chamber Selection Pills with Smooth Sliding Layout Pill */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {events.map((evt: any, idx: number) => {
                const isActive = selectedChamberIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedChamberIdx(idx)}
                    className={`relative px-4 py-2 rounded-full text-xs font-montserrat font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? "text-[#E5D8C4] shadow-lg scale-105"
                        : "bg-white/60 hover:bg-white text-[#593C28] border border-[#B89773]/50"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-chamber-indicator"
                        className="absolute inset-0 bg-[#551618] rounded-full z-0"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">0{idx + 1}</span>
                    <span className="relative z-10">{evt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chamber Card Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedChamberIdx}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="imperial-stationery-card rounded-3xl p-8 sm:p-12 space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#B89773]/30 pb-4">
                <span className="px-3.5 py-1 rounded-full bg-[#551618] text-[#E5D8C4] text-[10px] sm:text-xs font-bold font-montserrat uppercase tracking-wider">
                  {events[selectedChamberIdx]?.chamber || `Chamber 0${selectedChamberIdx + 1}`}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#551618] font-montserrat flex items-center gap-1.5">
                  <Clock size={15} weight="bold" />
                  {events[selectedChamberIdx]?.time}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-4xl font-playfair font-bold text-[#551618]">
                  {events[selectedChamberIdx]?.name}
                </h3>
                <p className="text-sm sm:text-base text-[#593C28] font-cormorant leading-relaxed">
                  {events[selectedChamberIdx]?.description}
                </p>
              </div>

              {/* Chamber Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/70 border border-[#B89773]/40 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#986E47] font-montserrat flex items-center gap-1">
                    <CalendarCheck size={14} weight="bold" /> Date &amp; Timing
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#36281D] font-cormorant">
                    {events[selectedChamberIdx]?.date} · {events[selectedChamberIdx]?.time}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/70 border border-[#B89773]/40 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#986E47] font-montserrat flex items-center gap-1">
                    <MapPin size={14} weight="bold" /> Ceremonial Venue
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#36281D] font-cormorant truncate">
                    {events[selectedChamberIdx]?.venue || venueName}
                  </p>
                </div>
              </div>

              {events[selectedChamberIdx]?.dress && (
                <div className="p-4 rounded-2xl bg-[#551618]/10 border border-[#B89773]/40 flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#551618] font-montserrat">
                    Dress Code:
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#36281D] font-cormorant">
                    {events[selectedChamberIdx]?.dress}
                  </span>
                </div>
              )}

              <div className="pt-2">
                <a
                  href={
                    venueMapUrl ||
                    `https://maps.google.com/?q=${encodeURIComponent(
                      events[selectedChamberIdx]?.venue || venueName
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full imperial-btn-gold text-xs font-bold font-montserrat shadow-lg cursor-pointer"
                >
                  <MapPin size={15} weight="bold" />
                  <span>Get Directions to {events[selectedChamberIdx]?.venue || venueName}</span>
                  <ArrowSquareOut size={14} />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ====================================================
          SCENE 07: THE ROYAL LOVE LETTER / IMPERIAL DECREE
          ==================================================== */}
      <section
        ref={letterRef}
        className="py-20 sm:py-32 px-4 bg-[#AEA290]/20 text-center relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#551618] font-bold font-montserrat block">
            Personal Imperial Vow
          </span>
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-[#2C0F0D]">
            The Sealed Royal Letter
          </h2>
          <p className="text-xs sm:text-sm text-[#593C28] font-cormorant italic max-w-md mx-auto">
            Tap the burgundy wax seal to unlock the personal letter written for our honoured guests
          </p>

          <div className="pt-4 flex justify-center">
            <div className="w-full max-w-md imperial-stationery-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              {/* Wax Seal Toggle with Ripple Animation */}
              <div className="flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setIsLetterOpened(!isLetterOpened)}
                  className="imperial-wax-seal cursor-pointer"
                  title="Click to toggle letter"
                >
                  <div className="imperial-wax-seal-inner font-cinzel text-xs font-bold">
                    {isLetterOpened ? <EnvelopeOpen size={18} /> : <Envelope size={18} />}
                  </div>
                </motion.div>
              </div>

              {/* Unfolded Letter Content with 3D Origin Flip */}
              <AnimatePresence>
                {isLetterOpened ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0, rotateX: -20 }}
                    animate={{ opacity: 1, height: "auto", rotateX: 0 }}
                    exit={{ opacity: 0, height: 0, rotateX: -20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4 pt-2 border-t border-[#B89773]/40"
                  >
                    <span className="font-alex-brush text-2xl text-[#551618] block">
                      Dearest Honoured Guests,
                    </span>
                    <p className="font-cormorant text-sm sm:text-base text-[#36281D] leading-relaxed italic">
                      &ldquo;It is with hearts overflowing with gratitude and reverence that we invite you to share in the consecration of our marriage. Each of you has shaped our lives, and your presence will forever illuminate the halls of our union.&rdquo;
                    </p>
                    <div className="pt-2 text-right">
                      <p className="font-great-vibes text-2xl text-[#551618]">
                        {groomName} &amp; {brideName}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-xs text-[#593C28] font-montserrat">
                    ✦ Tap wax seal to unfold imperial message ✦
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ====================================================
          SCENE 08: THE ESTATE & IMPERIAL PAVILION (VENUE REVEAL)
          ==================================================== */}
      <section className="py-20 sm:py-32 px-4 bg-[#E5D8C4] text-[#36281D] text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="imperial-stationery-card rounded-[2.5rem] p-8 sm:p-14 space-y-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
              className="w-16 h-16 rounded-full bg-[#551618] text-[#D5BA97] flex items-center justify-center mx-auto shadow-lg border border-[#B89773]"
            >
              <MapPin size={28} weight="fill" />
            </motion.div>

            <div className="space-y-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#986E47] font-bold font-montserrat">
                The Estate &amp; Grounds
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#551618]">
                {venueName}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[#593C28] max-w-lg mx-auto font-cormorant font-medium">
                {venueAddress}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full imperial-btn-gold text-xs font-bold font-montserrat flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <ArrowSquareOut size={16} weight="bold" />
                <span>Google Maps Navigation</span>
              </a>

              <button
                onClick={handleCopyAddress}
                className="px-6 py-3.5 rounded-full bg-white border border-[#B89773] hover:border-[#551618] text-[#36281D] text-xs font-bold font-montserrat flex items-center gap-2 cursor-pointer shadow-sm transition-all"
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
          SCENE 09: RSVP — THE ROYAL GUEST REGISTER
          ==================================================== */}
      <section className="py-20 sm:py-32 px-4 bg-[#2C0F0D] text-[#E5D8C4] text-center relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 sm:p-12 md:p-16 rounded-[2.5rem] bg-[#36281D] border border-[#B89773] shadow-2xl space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#551618] border border-[#B89773] flex items-center justify-center text-[#D5BA97] shadow-xl mx-auto">
              <Heart size={30} weight="fill" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#D5BA97] font-bold font-montserrat block">
                Your Gracious Presence
              </span>
              <h2 className="text-2xl sm:text-4xl font-playfair font-bold text-white">
                The Royal Guest Register
              </h2>
              <p className="text-xs sm:text-sm text-[#AEA290] max-w-md mx-auto font-cormorant italic leading-relaxed">
                Kindly confirm your attendance and transmit your blessings for the official palace guest ledger.
              </p>
            </div>

            <motion.button
              type="button"
              onClick={() => setIsRsvpOpen(true)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="imperial-btn-gold w-full sm:w-auto sm:min-w-[280px] mx-auto px-8 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 cursor-pointer font-montserrat"
            >
              <Sparkle size={18} weight="fill" />
              <span>✦ Sign Royal Guestbook ✦</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ====================================================
          FOOTER & REPLAY
          ==================================================== */}
      <footer className="py-14 bg-[#2C2019] border-t border-[#B89773]/30 text-center space-y-4 text-xs text-[#E5D8C4]/80">
        <p className="font-cormorant italic text-base text-[#E5D8C4]">
          With profound love and royal gratitude, <br />
          The Imperial &amp; De Valois Dynasties
        </p>
        <p className="text-[11px] font-montserrat tracking-widest text-[#D5BA97] font-semibold">
          {hashtag}
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={handleReplayEntrance}
            className="inline-flex items-center gap-1.5 text-xs text-[#D5BA97] hover:text-white font-semibold cursor-pointer transition-colors"
          >
            <ArrowsClockwise size={14} /> Replay Palace Entrance
          </button>
          <span>·</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 text-xs text-[#AEA290] hover:text-white font-semibold cursor-pointer transition-colors"
          >
            Back to Top
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
              className="max-w-4xl max-h-[82vh] rounded-2xl overflow-hidden shadow-2xl border border-[#B89773] relative"
            >
              <img
                src={
                  activePhotoSrc ||
                  (activePhotoIdx !== null && galleryImages[activePhotoIdx]
                    ? galleryImages[activePhotoIdx]
                    : galleryImages[0])
                }
                alt="Palace detail"
                className="w-full h-full object-contain max-h-[82vh]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================
          CRISP ROYAL RSVP MODAL (MOBILE SAFE & BEAUTIFULLY SPACED)
          ==================================================== */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setIsRsvpOpen(false)}
          >
            <motion.div
              className="w-full max-w-lg max-h-[88dvh] bg-[#E5D8C4] border-2 border-[#B89773] rounded-3xl shadow-2xl relative flex flex-col my-auto overflow-hidden text-[#36281D] font-montserrat"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-[#B89773]/30 flex items-center justify-between bg-[#E5D8C4]/90 sticky top-0 z-10">
                <div>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#986E47] font-bold block">
                    ✦ PALAIS IMPÉRIAL REGISTER ✦
                  </span>
                  <h3 className="text-xl sm:text-2xl font-playfair font-bold text-[#551618] leading-tight">
                    Confirm Your Presence
                  </h3>
                </div>

                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-[#551618] text-[#E5D8C4] flex items-center justify-center hover:bg-[#833624] transition-colors cursor-pointer flex-shrink-0 shadow-md border border-[#B89773]/50"
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
                    <div className="w-16 h-16 rounded-full bg-[#551618] text-[#D5BA97] flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle size={32} weight="fill" />
                    </div>
                    <h4 className="text-xl font-playfair font-bold text-[#551618]">
                      Blessings Recorded
                    </h4>
                    <p className="text-xs sm:text-sm text-[#593C28] font-cormorant italic leading-relaxed max-w-sm mx-auto">
                      Your attendance has been formally recorded in the sovereign ledger. We eagerly await your gracious company.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsRsvpOpen(false)}
                      className="mt-4 px-6 py-2.5 rounded-full bg-[#551618] text-[#E5D8C4] text-xs font-bold font-montserrat uppercase tracking-wider shadow-md"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-3.5 text-left">
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#551618] mb-1">
                        Honoured Guest Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        placeholder="e.g. Lord & Lady Montagu"
                        className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-[#B89773] text-xs sm:text-sm text-[#36281D] focus:outline-none focus:ring-2 focus:ring-[#551618]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#551618] mb-1">
                          Contact / Mobile
                        </label>
                        <input
                          type="tel"
                          value={rsvpPhone}
                          onChange={(e) => setRsvpPhone(e.target.value)}
                          placeholder="+44 7000 000000"
                          className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-[#B89773] text-xs sm:text-sm text-[#36281D] focus:outline-none focus:ring-2 focus:ring-[#551618]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#551618] mb-1">
                          Number of Guests
                        </label>
                        <select
                          value={rsvpGuests}
                          onChange={(e) => setRsvpGuests(e.target.value)}
                          className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-[#B89773] text-xs sm:text-sm text-[#36281D] focus:outline-none focus:ring-2 focus:ring-[#551618]"
                        >
                          <option value="1">1 Dignitary</option>
                          <option value="2">2 Dignitaries</option>
                          <option value="3">3 Dignitaries</option>
                          <option value="4">4+ Dignitaries</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#551618] mb-1">
                        Attendance Confirmation
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setRsvpAttending("yes")}
                          className={`py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            rsvpAttending === "yes"
                              ? "bg-[#551618] text-[#E5D8C4] shadow-md border-2 border-[#551618]"
                              : "bg-white border border-[#B89773] text-[#593C28]"
                          }`}
                        >
                          Joyfully Attend
                        </button>
                        <button
                          type="button"
                          onClick={() => setRsvpAttending("no")}
                          className={`py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            rsvpAttending === "no"
                              ? "bg-[#551618] text-[#E5D8C4] shadow-md border-2 border-[#551618]"
                              : "bg-white border border-[#B89773] text-[#593C28]"
                          }`}
                        >
                          Regretfully Decline
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#551618] mb-1">
                        Blessings &amp; Dietary Notes
                      </label>
                      <textarea
                        rows={2}
                        value={rsvpWishes}
                        onChange={(e) => setRsvpWishes(e.target.value)}
                        placeholder="Share your warm wishes with the couple..."
                        className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-white border border-[#B89773] text-xs sm:text-sm text-[#36281D] focus:outline-none focus:ring-2 focus:ring-[#551618]"
                      />
                    </div>

                    <div className="pt-2 pb-1">
                      <button
                        type="submit"
                        className="w-full py-3.5 sm:py-4 rounded-xl imperial-btn-gold text-xs font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkle size={16} weight="fill" />
                        <span>✦ Stamp &amp; Seal RSVP ✦</span>
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
