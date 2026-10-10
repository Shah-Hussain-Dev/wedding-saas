"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  PanInfo,
} from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";

interface LookbookFrame {
  id: string;
  templateId: string;
  chapter: string;
  title: string;
  couple: string;
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
    couple: "Maharaja Veer & Sunaina",
    tag: "3D Double Palace Doors",
    image: "/templates/imperial-palace/ballroom.jpg",
    description: "Ornate gold leaf arches, royal elephant procession, and regal velvet fanfare.",
    palette: ["#551618", "#C8A45E", "#E5D8C4"],
  },
  {
    id: "f2",
    templateId: "royal-majesty",
    chapter: "Royal Palaces",
    title: "Château de Versailles Ballroom",
    couple: "Lord Julian & Genevieve",
    tag: "Château Grandeur",
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
    couple: "Zayd & Mariam",
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
    couple: "Faris & Anaya",
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
    couple: "Armaan & Tara",
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
    couple: "Rohan & Meera",
    tag: "Petal Shower",
    video: "/videos/rose-gold-blush.mp4",
    image: "/templates/imperial-palace/ballroom.jpg",
    description: "Falling sakura petals, velvet gold foil typography, and synchronized orchestral harp.",
    palette: ["#DDA7A5", "#C8A45E", "#FFFDFB"],
  },
];

const CHAPTERS = ["Royal Palaces", "Sacred Nikahs", "Celestial Dreamscapes", "Modern Florals"];

export function PinnedLookbook() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(390);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const updateDims = () => {
      setViewportWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };
    updateDims();
    window.addEventListener("resize", updateDims);
    return () => window.removeEventListener("resize", updateDims);
  }, []);

  // Desktop on-scroll sticky tracking (unchanged as it was earlier)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const desktopTrackX = useTransform(scrollYProgress, [0, 1], ["0%", "-64%"]);
  const desktopProgressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isMobile) {
      const frameIndex = Math.min(
        Math.floor(latest * LOOKBOOK_FRAMES.length * 0.999),
        LOOKBOOK_FRAMES.length - 1
      );
      setActiveFrameIndex(frameIndex);
    }
  });

  // Mobile dedicated swiper dimensions & handlers
  const count = LOOKBOOK_FRAMES.length;
  const mobileCardWidth = Math.min(275, viewportWidth - 64);
  const mobileGap = 16;
  const mobileCardStep = mobileCardWidth + mobileGap;

  const handleMobilePanStart = () => {
    isDraggingRef.current = true;
  };

  const handleMobilePanEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 80);

    const threshold = 25;
    const velocityThreshold = 140;

    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      setMobileActiveIndex((prev) => (prev + 1) % count);
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      setMobileActiveIndex((prev) => (prev - 1 + count) % count);
    }
  };

  const goToMobileChapter = (chapter: string) => {
    const foundIdx = LOOKBOOK_FRAMES.findIndex((f) => f.chapter === chapter);
    if (foundIdx !== -1) {
      setMobileActiveIndex(foundIdx);
    }
  };

  // -------------------------------------------------------------
  // MOBILE VIEW: Standalone Dead-Center Infinite Touch Swiper
  // -------------------------------------------------------------
  if (isMobile) {
    const currentMobileFrame = LOOKBOOK_FRAMES[mobileActiveIndex];

    return (
      <section
        id="lookbook"
        className="relative w-full min-h-[100dvh] bg-[#032A23] text-[#F7F4ED] overflow-hidden flex flex-col justify-between pt-20 pb-6 px-4 select-none"
      >
        {/* Mobile Header: Eyebrow + Clickable Chapter Badges */}
        <div className="relative z-20 flex flex-col gap-2.5 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#C8A45E] animate-ping" />
            <h2 className="font-serif text-lg font-bold tracking-tight text-white uppercase">
              The Lookbook
            </h2>
            <span className="text-[9.5px] font-mono uppercase text-[#E1C98E] tracking-widest">
              Vol. 2026 Collection
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {CHAPTERS.map((ch) => {
              const isCurrentChapter = currentMobileFrame.chapter === ch;
              return (
                <button
                  key={ch}
                  type="button"
                  onClick={() => goToMobileChapter(ch)}
                  className={`relative py-1 px-2.5 rounded-full text-[10.5px] font-sans tracking-wide transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isCurrentChapter
                      ? "bg-white/15 text-white font-bold border border-[#C8A45E]/50 shadow-[0_0_12px_rgba(200,164,94,0.3)]"
                      : "text-white/40 border border-transparent hover:text-white/80"
                  }`}
                >
                  <span>{ch}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Swiper Stage (100% Dead-Center, Infinite Loop, Smooth Springs) */}
        <div className="relative z-10 w-full flex-1 my-auto flex items-center justify-center overflow-hidden py-4 touch-pan-y">
          <motion.div
            onPanStart={handleMobilePanStart}
            onPanEnd={handleMobilePanEnd}
            className="relative w-full h-[48dvh] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          >
            {LOOKBOOK_FRAMES.map((frame, idx) => {
              let diff = (idx - mobileActiveIndex + count) % count;
              if (diff > count / 2) diff -= count;

              const isFocused = diff === 0;
              const isPeek = Math.abs(diff) === 1;
              const isVisible = Math.abs(diff) <= 1;

              return (
                <motion.div
                  key={frame.id}
                  animate={{
                    x: diff * mobileCardStep,
                    scale: isFocused ? 1 : 0.88,
                    opacity: isFocused ? 1 : isPeek ? 0.6 : 0,
                    zIndex: isFocused ? 30 : 10,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 26,
                    mass: 0.8,
                  }}
                  onClick={() => {
                    if (isDraggingRef.current) return;
                    if (!isFocused) setMobileActiveIndex(idx);
                  }}
                  style={{
                    position: "absolute",
                    width: `${mobileCardWidth}px`,
                    pointerEvents: isVisible ? "auto" : "none",
                  }}
                  className={`h-[48dvh] rounded-2xl p-2.5 bg-black/50 border transition-colors duration-500 overflow-hidden cursor-pointer ${
                    isFocused
                      ? "border-[#C8A45E] shadow-[0_20px_50px_rgba(200,164,94,0.35)] ring-1 ring-[#C8A45E]/50"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Media Content */}
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-stone-900">
                    {frame.video ? (
                      <video
                        src={frame.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover brightness-[0.9]"
                      />
                    ) : (
                      <div
                        className="w-full h-full bg-cover bg-center brightness-[0.9]"
                        style={{ backgroundImage: `url(${frame.image})` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                    {/* Top Tag */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[8.5px] font-bold tracking-wider text-[#E1C98E] uppercase border border-[#C8A45E]/30">
                      {frame.tag}
                    </div>

                    {/* Bottom Card Title */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[#C8A45E]">
                        {frame.chapter}
                      </span>
                      <h3 className="font-serif text-base font-bold text-white leading-snug line-clamp-1">
                        {frame.title}
                      </h3>
                      <p className="text-[11px] text-stone-300 font-sans mt-0.5 line-clamp-1">
                        {frame.couple}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Mobile Bottom Bar: Metadata + Pagination + CTA */}
        <div className="relative z-20 flex flex-col gap-3 border-t border-white/10 pt-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9.5px] uppercase font-mono text-[#E1C98E] tracking-widest font-bold line-clamp-1">
                Viewing [{mobileActiveIndex + 1} / {count}] · {currentMobileFrame.title}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {LOOKBOOK_FRAMES.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setMobileActiveIndex(dotIdx)}
                    aria-label={`Jump to lookbook card ${dotIdx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      dotIdx === mobileActiveIndex
                        ? "w-4 bg-[#C8A45E]"
                        : "w-1.5 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-stone-300 font-sans line-clamp-1">
              {currentMobileFrame.description}
            </p>
          </div>

          <Link
            href={`/preview/${currentMobileFrame.templateId}`}
            className="w-full py-2.5 rounded-full bg-[#C8A45E] hover:bg-[#E1C98E] text-[#032A23] text-xs font-bold uppercase tracking-wider font-sans transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Experience</span>
            <ArrowRight size={13} weight="bold" />
          </Link>
        </div>

        {/* Mobile Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
          <motion.div
            animate={{ width: `${((mobileActiveIndex + 1) / count) * 100}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#C8A45E] to-[#E1C98E] shadow-[0_0_10px_rgba(200,164,94,0.8)]"
          />
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // DESKTOP VIEW: EXACT ORIGINAL ON-SCROLL PINNED 400VH FEATURE
  // -------------------------------------------------------------
  const currentDesktopFrame = LOOKBOOK_FRAMES[activeFrameIndex];

  return (
    <section
      ref={containerRef}
      id="lookbook"
      className="relative w-full h-[400vh] bg-[#032A23] text-[#F7F4ED]"
    >
      {/* Sticky Fullscreen Stage (100dvh + sticky top-0 pins securely across scroll) */}
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-between pt-20 sm:pt-24 pb-5 px-4 sm:px-8 lg:px-12 select-none bg-[#032A23]">
        {/* TOP HEADER: Eyebrow + Chapter Trackers */}
        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="w-2 h-2 rounded-full bg-[#C8A45E] animate-ping" />
            <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-white uppercase">
              The Lookbook
            </h2>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="text-[9.5px] sm:text-xs font-mono uppercase text-[#E1C98E] tracking-widest">
              Vol. 2026 Collection
            </span>
          </div>

          {/* Chapters Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar py-0.5">
            {CHAPTERS.map((ch) => {
              const isCurrentChapter = currentDesktopFrame.chapter === ch;
              return (
                <div
                  key={ch}
                  className={`relative py-1 px-2.5 sm:px-3 rounded-full text-[10.5px] sm:text-xs font-sans tracking-wide transition-all duration-300 whitespace-nowrap ${
                    isCurrentChapter
                      ? "bg-white/15 text-white font-bold border border-[#C8A45E]/50"
                      : "text-white/40 border border-transparent"
                  }`}
                >
                  <span>{ch}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER: SCROLL-SCRUBBED HORIZONTAL TRACK */}
        <div className="relative z-10 w-full flex-1 my-auto flex items-center overflow-hidden py-2">
          <motion.div
            style={{ x: desktopTrackX }}
            className="flex items-center gap-4 sm:gap-8 will-change-transform pl-2 sm:pl-6 pr-20"
          >
            {LOOKBOOK_FRAMES.map((frame, idx) => {
              const isFocused = idx === activeFrameIndex;
              return (
                <div
                  key={frame.id}
                  className={`relative shrink-0 w-[270px] sm:w-[360px] md:w-[410px] h-[48dvh] sm:h-[52vh] rounded-2xl sm:rounded-3xl p-2 sm:p-3 bg-black/50 border transition-all duration-500 overflow-hidden ${
                    isFocused
                      ? "border-[#C8A45E] shadow-[0_20px_50px_rgba(200,164,94,0.35)] scale-100 opacity-100 ring-1 ring-[#C8A45E]/50"
                      : "border-white/10 opacity-55 scale-95"
                  }`}
                >
                  {/* Media Content */}
                  <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-stone-900">
                    {frame.video ? (
                      <video
                        src={frame.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover brightness-[0.9]"
                      />
                    ) : (
                      <div
                        className="w-full h-full bg-cover bg-center brightness-[0.9]"
                        style={{ backgroundImage: `url(${frame.image})` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                    {/* Top Tag */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[8.5px] sm:text-[9px] font-bold tracking-wider text-[#E1C98E] uppercase border border-[#C8A45E]/30">
                      {frame.tag}
                    </div>

                    {/* Bottom Card Title */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#C8A45E]">
                        {frame.chapter}
                      </span>
                      <h3 className="font-serif text-base sm:text-xl font-bold text-white leading-snug line-clamp-1">
                        {frame.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-stone-300 font-sans mt-0.5 line-clamp-1">
                        {frame.couple}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* BOTTOM METADATA & COMPACT NON-WRAPPING CTA BUTTON */}
        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10 pt-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="text-[9.5px] sm:text-[10px] uppercase font-mono text-[#E1C98E] tracking-widest font-bold">
                Viewing [{activeFrameIndex + 1} / {LOOKBOOK_FRAMES.length}] · {currentDesktopFrame.title}
              </span>
              <div className="flex items-center gap-1">
                {currentDesktopFrame.palette.map((col, cIdx) => (
                  <span
                    key={cIdx}
                    className="w-2.5 h-2.5 rounded-full border border-white/30"
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-300 font-sans max-w-lg line-clamp-1">
              {currentDesktopFrame.description}
            </p>
          </div>

          {/* Clean 1-Line Action Button (Never Breaks or Overflows) */}
          <Link
            href={`/preview/${currentDesktopFrame.templateId}`}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#C8A45E] hover:bg-[#E1C98E] text-[#032A23] text-xs font-bold uppercase tracking-wider font-sans transition-all duration-300 shadow-md hover:scale-105 active:scale-98 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>View Experience</span>
            <ArrowRight size={13} weight="bold" />
          </Link>
        </div>

        {/* Gold Scrub Progress Bar at the very bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
          <motion.div
            style={{ width: desktopProgressWidth }}
            className="h-full bg-gradient-to-r from-[#C8A45E] to-[#E1C98E] shadow-[0_0_10px_rgba(200,164,94,0.8)]"
          />
        </div>
      </div>
    </section>
  );
}
