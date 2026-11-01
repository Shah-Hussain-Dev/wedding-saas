"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, PanInfo, useReducedMotion } from "motion/react";
import { ArrowRight, CaretLeft, CaretRight, Eye } from "@phosphor-icons/react";
import { formatDemoCoupleLabel } from "@/lib/template-demo-couples";

interface LookbookFrame {
  id: string;
  templateId: string;
  chapter: string;
  title: string;
  couple?: string;
  tag: string;
  image: string;
  video?: string;
  description: string;
  palette: string[];
}

const LOOKBOOK_FRAMES: LookbookFrame[] = [
  {
    id: "f1",
    templateId: "imperial-palace",
    chapter: "Royal Palaces",
    title: "Imperial Palace Grand Ballroom",
    tag: "3D Double Palace Doors",
    image: "/templates/imperial-palace/ballroom.jpg",
    video: "/videos/royal-prestige.mp4",
    description: "Ornate gold leaf arches, royal elephant procession, and regal velvet fanfare.",
    palette: ["#551618", "#C8A45E", "#E5D8C4"],
  },
  {
    id: "f2",
    templateId: "royal-majesty",
    chapter: "Royal Palaces",
    title: "Regal Ballroom & Lakeside Terrace",
    tag: "Regal Grandeur",
    video: "/videos/royal-majesty.mp4",
    image: "/templates/imperial-palace/ballroom.jpg",
    description: "Crystal chandeliers swinging in parallax with live guestbook flights.",
    palette: ["#7A92A3", "#C8A45E", "#FCFAF6"],
  },
  {
    id: "f3",
    templateId: "noor-e-nikah",
    chapter: "Sacred Nikahs",
    title: "Noor-e-Nikah Sacred Archway",
    tag: "24K Gold Bismillah",
    image: "/templates/noor-e-nikah/envelope-bg.jpg",
    description: "Embossed ivory floral envelope, slow-lighting wax seal, and sacred Ayah calligraphy.",
    palette: ["#073D31", "#C8A45E", "#FAF8F5"],
  },
  {
    id: "f4",
    templateId: "azure-nikah",
    chapter: "Sacred Nikahs",
    title: "Azure Nikah Mosque Courtyard",
    tag: "Persian Sapphire",
    image: "/templates/noor-e-nikah/envelope-bg.jpg",
    description: "Persian sapphire tilework with celestial moonrise animations.",
    palette: ["#1D4E89", "#C8A45E", "#F0F4F8"],
  },
  {
    id: "f5",
    templateId: "celestial-rose",
    chapter: "Celestial Dreamscapes",
    title: "Celestial Rose & Starlight Terrace",
    tag: "Awwwards 3D",
    video: "/videos/royal-prestige.mp4",
    image: "/templates/imperial-palace/ballroom.jpg",
    description: "Zero-gravity memories, constellation wish flight, and starlight scratches.",
    palette: ["#5898B8", "#E8B8B8", "#F1E8E1"],
  },
  {
    id: "f6",
    templateId: "rose-gold-blush",
    chapter: "Modern Florals",
    title: "Rose Gold Blush & Champagne Silk",
    tag: "Petal Shower",
    video: "/videos/rose-gold-blush.mp4",
    image: "/templates/imperial-palace/ballroom.jpg",
    description: "Falling sakura petals, velvet gold foil typography, and synchronized orchestral harp.",
    palette: ["#DDA7A5", "#C8A45E", "#FFFDFB"],
  },
];

const CHAPTERS = ["Royal Palaces", "Sacred Nikahs", "Celestial Dreamscapes", "Modern Florals"];
const AUTO_ADVANCE_MS = 5500;

function stopNavBubble(e: React.MouseEvent | React.PointerEvent) {
  e.stopPropagation();
}

function CardMedia({
  frame,
  isActive,
}: {
  frame: LookbookFrame;
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !frame.video) return;

    el.defaultMuted = true;
    el.muted = true;

    if (isActive) {
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [frame.video, isActive]);

  if (frame.video) {
    return (
      <div className="relative w-full h-full bg-black overflow-hidden">
        <img
          src={frame.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <video
          ref={videoRef}
          src={frame.video}
          poster={frame.image}
          autoPlay={isActive}
          loop
          muted
          playsInline
          preload={isActive ? "auto" : "metadata"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isActive ? "opacity-100 brightness-[0.92]" : "opacity-0"
          }`}
        />
      </div>
    );
  }

  return (
    <div
      className="w-full h-full bg-cover bg-center brightness-[0.92]"
      style={{ backgroundImage: `url(${frame.image})` }}
    />
  );
}

interface LookbookCardProps {
  frame: LookbookFrame;
  coupleLabel: string;
  isFocused: boolean;
  cardWidth: number;
  diff: number;
  cardStep: number;
  isDraggingRef: React.MutableRefObject<boolean>;
  onSelectSide: () => void;
  onPanStart: () => void;
  onPanEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
}

function LookbookCard({
  frame,
  coupleLabel,
  isFocused,
  cardWidth,
  diff,
  cardStep,
  isDraggingRef,
  onSelectSide,
  onPanStart,
  onPanEnd,
}: LookbookCardProps) {
  const detailsHref = `/preview/${frame.templateId}`;
  const livePreviewHref = `/preview/${frame.templateId}/interactive`;

  return (
    <motion.article
      onPanStart={onPanStart}
      onPanEnd={onPanEnd}
      animate={{
        x: diff * cardStep,
        scale: isFocused ? 1 : 0.88,
        opacity: isFocused ? 1 : Math.abs(diff) === 1 ? 0.62 : 0,
        zIndex: isFocused ? 30 : 10,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 28,
        mass: 0.85,
      }}
      onClick={() => {
        if (isDraggingRef.current) return;
        if (!isFocused) {
          onSelectSide();
        }
      }}
      style={{
        position: "absolute",
        width: `${cardWidth}px`,
        pointerEvents: Math.abs(diff) <= 1 ? "auto" : "none",
      }}
      className={`h-[clamp(320px,49dvh,440px)] sm:h-[56dvh] sm:min-h-[380px] sm:max-h-[580px] rounded-[1.4rem] sm:rounded-[1.75rem] p-1.5 sm:p-3 bg-gradient-to-b from-white/[0.1] to-black/40 border backdrop-blur-sm transition-colors duration-500 overflow-hidden touch-none ${
        isFocused
          ? "border-[#C8A45E] shadow-[0_24px_60px_rgba(200,164,94,0.38)] ring-1 ring-[#C8A45E]/55 cursor-grab active:cursor-grabbing"
          : "border-white/15 shadow-lg cursor-grab active:cursor-grabbing hover:border-white/30"
      }`}
    >
      <div className="relative w-full h-full rounded-[1.15rem] sm:rounded-2xl overflow-hidden bg-stone-900">
        <CardMedia frame={frame} isActive={isFocused} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 via-35% to-transparent pointer-events-none" />

        <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-auto px-2.5 py-1 sm:px-2.5 sm:py-1 rounded-full bg-black/70 backdrop-blur-md text-[8.5px] sm:text-[9px] font-bold tracking-[0.14em] text-[#E1C98E] uppercase border border-[#C8A45E]/35 pointer-events-none w-fit max-w-full truncate">
          {frame.tag}
        </div>

        <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 z-20 space-y-2 sm:space-y-2.5">
          <div className="pointer-events-none">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-[#C8A45E] line-clamp-1">
              {frame.chapter}
            </span>
            <h3 className="font-serif text-[clamp(1.05rem,4.6vw,1.35rem)] sm:text-2xl font-bold text-white leading-[1.15] line-clamp-2 mt-1 [text-shadow:0_2px_14px_rgba(0,0,0,0.55)]">
              {frame.title}
            </h3>
            <p className="text-[11.5px] sm:text-xs text-stone-200/90 font-sans mt-1 line-clamp-1">
              {coupleLabel}
            </p>
          </div>

          {isFocused && (
            <div className="flex flex-row items-stretch gap-2 pt-0.5 sm:pt-1">
              <Link
                href={livePreviewHref}
                onPointerDown={stopNavBubble}
                onClick={stopNavBubble}
                className="flex-1 min-h-[44px] min-w-0 px-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-[10px] sm:text-[11px] font-bold tracking-wide sm:tracking-wider uppercase font-sans flex items-center justify-center gap-1.5 border border-white/25 transition-colors"
              >
                <Eye size={14} weight="bold" className="text-[#E1C98E] shrink-0" />
                <span className="truncate">Preview</span>
              </Link>
              <Link
                href={detailsHref}
                onPointerDown={stopNavBubble}
                onClick={stopNavBubble}
                className="flex-1 min-h-[44px] min-w-0 px-3 rounded-full bg-[#C8A45E] hover:bg-[#E1C98E] text-[#032A23] text-[10px] sm:text-[11px] font-bold tracking-wide sm:tracking-wider uppercase font-sans flex items-center justify-center gap-1.5 transition-colors shadow-[0_6px_18px_rgba(200,164,94,0.28)]"
              >
                <span className="truncate">Explore</span>
                <ArrowRight size={13} weight="bold" className="shrink-0" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function PinnedLookbook() {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(390);
  const [isHovered, setIsHovered] = useState(false);
  const [autoProgress, setAutoProgress] = useState(0);
  const isDraggingRef = useRef(false);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressStartRef = useRef(Date.now());

  const [activeInvitations, setActiveInvitations] = useState<
    { templateId?: string; brideName?: string; groomName?: string }[]
  >([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("unfold_active_invitations");
      if (stored) {
        setActiveInvitations(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const getDynamicCouple = useCallback(
    (templateId: string) => {
      const custom = activeInvitations.find((item) => item.templateId === templateId);
      if (custom?.brideName && custom?.groomName) {
        return `${custom.groomName} & ${custom.brideName}`;
      }
      return formatDemoCoupleLabel(templateId) ?? "Wedding Celebration";
    },
    [activeInvitations]
  );

  useEffect(() => {
    const updateDims = () => setViewportWidth(window.innerWidth);
    updateDims();
    window.addEventListener("resize", updateDims);
    return () => window.removeEventListener("resize", updateDims);
  }, []);

  const count = LOOKBOOK_FRAMES.length;
  const currentFrame = LOOKBOOK_FRAMES[activeIndex];

  const cardWidth =
    viewportWidth < 640
      ? Math.min(Math.round(viewportWidth * 0.8), viewportWidth - 40)
      : viewportWidth < 1024
        ? 340
        : 400;
  const cardGap = viewportWidth < 640 ? 12 : 28;
  const cardStep = cardWidth + cardGap;

  const goToIndex = useCallback((index: number) => {
    setActiveIndex((index + count) % count);
    progressStartRef.current = Date.now();
    setAutoProgress(0);
  }, [count]);

  const goNext = useCallback(() => {
    goToIndex(activeIndex + 1);
  }, [activeIndex, goToIndex]);

  const goPrev = useCallback(() => {
    goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  const goToChapter = (chapter: string) => {
    const foundIdx = LOOKBOOK_FRAMES.findIndex((f) => f.chapter === chapter);
    if (foundIdx !== -1) {
      goToIndex(foundIdx);
    }
  };

  useEffect(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    if (!isHovered && !prefersReducedMotion) {
      autoplayTimerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % count);
        progressStartRef.current = Date.now();
        setAutoProgress(0);
      }, AUTO_ADVANCE_MS);
    }
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [isHovered, count, prefersReducedMotion]);

  useEffect(() => {
    progressStartRef.current = Date.now();
    setAutoProgress(0);
  }, [activeIndex]);

  useEffect(() => {
    if (isHovered || prefersReducedMotion) return;

    const tickMs = 40;
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - progressStartRef.current;
      setAutoProgress(Math.min(100, (elapsed / AUTO_ADVANCE_MS) * 100));
    }, tickMs);

    return () => window.clearInterval(timer);
  }, [isHovered, activeIndex, prefersReducedMotion]);

  const handlePanStart = () => {
    isDraggingRef.current = true;
  };

  const handlePanEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);

    const threshold = 30;
    const velocityThreshold = 180;

    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      goNext();
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      goPrev();
    }
  };

  return (
    <section
      id="lookbook"
      className="scroll-mt-24 sm:scroll-mt-28 relative w-full overflow-x-hidden bg-[#032A23] text-[#F7F4ED] py-12 sm:py-20 px-3 sm:px-8 lg:px-12"
    >
      <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4 mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 sm:gap-3 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#C8A45E] animate-ping shrink-0" />
          <h2 className="font-serif text-xl sm:text-3xl font-bold tracking-tight text-white">
            Featured Collections
          </h2>
        </div>

        <div className="relative w-full min-w-0 sm:w-auto">
          <div className="-mx-1 flex max-w-full items-center gap-1 overflow-x-auto no-scrollbar px-1 sm:gap-2">
            {CHAPTERS.map((ch) => {
              const isCurrentChapter = currentFrame.chapter === ch;
              return (
                <button
                  key={ch}
                  type="button"
                  onClick={() => goToChapter(ch)}
                  aria-pressed={isCurrentChapter}
                  className="relative flex min-h-11 shrink-0 items-center justify-center sm:min-h-0"
                >
                  <span
                    className={`whitespace-nowrap rounded-full text-[10px] sm:text-xs font-sans tracking-wide transition-all duration-300 px-3 py-1.5 sm:py-1 border ${
                      isCurrentChapter
                        ? "bg-white/15 text-white font-bold border-[#C8A45E]/50 shadow-[0_0_12px_rgba(200,164,94,0.25)]"
                        : "text-white/50 border-transparent hover:text-white/85 hover:border-white/15"
                    }`}
                  >
                    {ch}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#032A23] via-[#032A23]/85 to-transparent sm:hidden" />
        </div>
      </div>

      <div
        className="relative z-10 w-full max-w-6xl mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous collection slide"
          className="absolute -left-1 sm:-left-5 lg:-left-8 top-1/2 -translate-y-1/2 z-40 hidden sm:flex w-12 h-12 rounded-full bg-[#F7F4ED]/95 hover:bg-white text-[#032A23] border border-[#C8A45E]/60 shadow-[0_10px_28px_rgba(0,0,0,0.35)] backdrop-blur-md items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          <CaretLeft size={20} weight="bold" className="text-[#8C6D23] -ml-0.5" />
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next collection slide"
          className="absolute -right-1 sm:-right-5 lg:-right-8 top-1/2 -translate-y-1/2 z-40 hidden sm:flex w-12 h-12 rounded-full bg-[#F7F4ED]/95 hover:bg-white text-[#032A23] border border-[#C8A45E]/60 shadow-[0_10px_28px_rgba(0,0,0,0.35)] backdrop-blur-md items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          <CaretRight size={20} weight="bold" className="text-[#8C6D23] -mr-0.5" />
        </button>

        <div className="relative w-full h-[clamp(320px,49dvh,440px)] sm:h-[56dvh] sm:min-h-[380px] sm:max-h-[580px] flex items-center justify-center select-none">
          {LOOKBOOK_FRAMES.map((frame, idx) => {
            let diff = (idx - activeIndex + count) % count;
            if (diff > count / 2) diff -= count;

            return (
              <LookbookCard
                key={frame.id}
                frame={frame}
                coupleLabel={getDynamicCouple(frame.templateId)}
                isFocused={diff === 0}
                cardWidth={cardWidth}
                diff={diff}
                cardStep={cardStep}
                isDraggingRef={isDraggingRef}
                onSelectSide={() => goToIndex(idx)}
                onPanStart={handlePanStart}
                onPanEnd={handlePanEnd}
              />
            );
          })}
        </div>

        <div
          role="group"
          aria-label="Collection slides"
          className="mt-3 sm:mt-5 flex items-center justify-center"
        >
          {LOOKBOOK_FRAMES.map((_, dotIdx) => {
            const isActive = dotIdx === activeIndex;
            return (
              <button
                key={dotIdx}
                type="button"
                onClick={() => goToIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex h-11 min-w-11 items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-1.5 w-4 sm:w-5 bg-[#C8A45E] shadow-[0_0_8px_rgba(200,164,94,0.65)]"
                      : "h-1.5 w-1.5 bg-white/25 group-hover:bg-white/50"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {!prefersReducedMotion && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 pointer-events-none">
          <motion.div
            animate={{ width: `${autoProgress}%` }}
            transition={{ duration: 0.08, ease: "linear" }}
            className="h-full bg-gradient-to-r from-[#C8A45E] to-[#E1C98E] shadow-[0_0_10px_rgba(200,164,94,0.8)]"
          />
        </div>
      )}
    </section>
  );
}
