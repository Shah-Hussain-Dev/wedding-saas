"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  Sliders,
  SpeakerHigh,
  SpeakerSlash,
  Play,
  Pause,
  X,
  Check,
  Sparkle,
  MusicNotes,
  CaretLeft,
  CaretRight,
  PencilSimple,
  ArrowLeft,
} from "@phosphor-icons/react";
import {
  CURATED_AUDIO_TRACKS,
  AudioTrackItem,
} from "@/lib/audio-tracks";
import { PreviewFaith } from "@/lib/preview-faith-content";

export interface PreviewControlsDockProps {
  templateId: string;
  templateName?: string;
  templateDefaultUrl?: string;
  currentTrackUrl: string;
  onSelectTrack: (trackUrl: string) => void;
  currentFaith: PreviewFaith;
  onSelectFaith: (faith: PreviewFaith) => void;
  slug?: string;
  isHeroTapped?: boolean;
  className?: string;
}

const FAITH_DETAILS: Array<{
  id: PreviewFaith;
  label: string;
  sublabel: string;
  symbol: string;
  headline: string;
  description: string;
  tag: string;
}> = [
  {
    id: "universal",
    label: "Universal",
    sublabel: "Wedding",
    symbol: "✦",
    headline: "Contemporary & Elegant",
    description: "Universal ceremonies, romantic vows, ring exchange, dinner & celebration.",
    tag: "Modern & Inclusive",
  },
  {
    id: "hindu",
    label: "Hindu",
    sublabel: "Vivah",
    symbol: "🕉️",
    headline: "Vedic & Traditional",
    description: "Ganesh Vandana invocation, 7 Sacred Pheras, Haldi, Sangeet & elder Ashirwad.",
    tag: "Vedic Vivah",
  },
  {
    id: "muslim",
    label: "Muslim",
    sublabel: "Nikah",
    symbol: "☪️",
    headline: "Islamic & Graceful",
    description: "Bismillah calligraphy, Surah Ar-Rum verse, Ijab-o-Qubool, Walima & Dua-e-Khair.",
    tag: "Sacred Nikah",
  },
];

export function PreviewControlsDock({
  templateId,
  templateName = "Template",
  templateDefaultUrl,
  currentTrackUrl,
  onSelectTrack,
  currentFaith,
  onSelectFaith,
  slug,
  isHeroTapped = false,
  className = "",
}: PreviewControlsDockProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tradition" | "soundtrack">("tradition");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const fallbackDefaultUrl = templateDefaultUrl || `/templates/${templateId}/music.mp3`;

  // Build the complete song list: original template theme + curated library
  const allTracks: AudioTrackItem[] = useMemo(() => {
    const originalTrack: AudioTrackItem = {
      id: "template-original-soundtrack",
      title: `${templateName} Original Theme`,
      artist: "Royale Signature Soundtrack",
      category: "universal",
      categoryLabel: "Original Theme",
      flag: "✦",
      tag: "Original",
      duration: "Full Theme",
      url: fallbackDefaultUrl,
      description: `The authentic signature soundtrack composed specifically for ${templateName}.`,
    };

    const filteredCurated = CURATED_AUDIO_TRACKS.filter(
      (t) => t.url !== fallbackDefaultUrl
    );

    return [originalTrack, ...filteredCurated];
  }, [templateId, templateName, fallbackDefaultUrl]);

  // Determine active track item metadata
  const currentTrackItem = useMemo(() => {
    return (
      allTracks.find(
        (t) =>
          t.url === currentTrackUrl ||
          t.url.toLowerCase() === currentTrackUrl?.toLowerCase()
      ) ||
      allTracks.find((t) => t.id === "template-original-soundtrack") ||
      allTracks[0]
    );
  }, [allTracks, currentTrackUrl]);

  // Active tradition metadata
  const activeFaithOption = useMemo(() => {
    return FAITH_DETAILS.find((f) => f.id === currentFaith) || FAITH_DETAILS[0];
  }, [currentFaith]);

  // ─────────────────────────────────────────────────────────────
  // AUDIO SYNCHRONIZATION WITH TEMPLATE'S <audio> TAG
  // ─────────────────────────────────────────────────────────────
  const getTemplateAudio = (): HTMLAudioElement | null => {
    if (typeof document === "undefined") return null;
    return document.querySelector("audio");
  };

  useEffect(() => {
    const audio = getTemplateAudio();
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleVolume = () => {
      if (audio.muted) setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("volumechange", handleVolume);

    setIsPlaying(!audio.paused && !audio.muted);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("volumechange", handleVolume);
    };
  }, [currentTrackUrl]);

  // Toggle Mute / Play-Pause on the template audio
  const handleToggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = getTemplateAudio();
    if (!audio) return;

    if (audio.paused || audio.muted) {
      audio.muted = false;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio play prevented:", err);
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // Preview / Play specific song from sheet
  const handlePlayPreview = (track: AudioTrackItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const audio = getTemplateAudio();
    if (!audio) return;

    const isThisTrackLoaded = audio.src.endsWith(track.url) || audio.src === track.url;

    if (isThisTrackLoaded) {
      if (audio.paused) {
        audio.muted = false;
        audio.play().then(() => setIsPlaying(true)).catch(console.warn);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      audio.src = track.url;
      audio.muted = false;
      audio.load();
      audio.play().then(() => setIsPlaying(true)).catch(console.warn);
      onSelectTrack(track.url);
      persistSongSelection(track.url);
    }
  };

  // Select song and apply to invitation
  const handleSelectSong = (track: AudioTrackItem) => {
    const audio = getTemplateAudio();
    if (audio) {
      const isAlreadyThisTrack = audio.src.endsWith(track.url) || audio.src === track.url;
      if (!isAlreadyThisTrack) {
        audio.src = track.url;
        audio.muted = false;
        audio.load();
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
    onSelectTrack(track.url);
    persistSongSelection(track.url);
  };

  const persistSongSelection = (url: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`unfold_preview_music_${templateId}`, url);
      const stored = localStorage.getItem(`unfold_invitation_${templateId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.musicTrack = url;
        localStorage.setItem(`unfold_invitation_${templateId}`, JSON.stringify(parsed));
      }
    } catch (_) {}
  };

  const handleSelectFaith = (faith: PreviewFaith) => {
    onSelectFaith(faith);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`unfold_preview_faith_${templateId}`, faith);
      } catch (_) {}
    }
  };

  // Close sheet on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSheetOpen) {
        setIsSheetOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSheetOpen]);

  // Categories
  const categories = [
    { id: "all", label: "All Songs" },
    { id: "original", label: "Original" },
    { id: "indian", label: "Trending Indian" },
    { id: "pakistani", label: "Pakistani & Coke Studio" },
    { id: "sufi", label: "Sacred Nikah & Sufi" },
    { id: "classical", label: "Vedic Classical" },
    { id: "universal", label: "Orchestral" },
  ];

  const filteredTracks = useMemo(() => {
    if (activeCategory === "all") return allTracks;
    if (activeCategory === "original") {
      return allTracks.filter((t) => t.id === "template-original-soundtrack");
    }
    return allTracks.filter((t) => t.category === activeCategory);
  }, [allTracks, activeCategory]);

  // Category horizontal scroll controls
  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollState = () => {
    if (!tabsRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  useEffect(() => {
    if (isSheetOpen && activeTab === "soundtrack") {
      const timer = setTimeout(checkScrollState, 250);
      return () => clearTimeout(timer);
    }
  }, [isSheetOpen, activeTab]);

  const scrollTabs = (direction: "left" | "right") => {
    if (!tabsRef.current) return;
    const scrollAmount = direction === "left" ? -180 : 180;
    tabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // ─────────────────────────────────────────────────────────────
  // CURSOR DRAG-TO-SCROLL (FOR MOUSE / CURSOR ON THE LIST)
  // ─────────────────────────────────────────────────────────────
  const songListRef = useRef<HTMLDivElement>(null);
  const isDraggingListRef = useRef(false);
  const startYRef = useRef(0);
  const scrollTopRef = useRef(0);
  const hasMovedRef = useRef(0);
  const [isCursorDragging, setIsCursorDragging] = useState(false);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingListRef.current || !songListRef.current) return;
      const deltaY = e.clientY - startYRef.current;
      hasMovedRef.current += Math.abs(deltaY);
      songListRef.current.scrollTop = scrollTopRef.current - deltaY;
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingListRef.current) {
        isDraggingListRef.current = false;
        setIsCursorDragging(false);
        setTimeout(() => {
          hasMovedRef.current = 0;
        }, 80);
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  const handleSongListMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.closest("button")) return;
    isDraggingListRef.current = true;
    setIsCursorDragging(true);
    startYRef.current = e.clientY;
    scrollTopRef.current = songListRef.current ? songListRef.current.scrollTop : 0;
    hasMovedRef.current = 0;
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. FLOATING CONTROL DOCK (BOTTOM-RIGHT)
          Two stacked luxury 44×44px buttons:
          - Top: Controls Button (Opens Unified Bottom Sheet with Faith & Music)
          - Bottom: Mute/Unmute Button (Always visible across all states)
          ───────────────────────────────────────────────────────────── */}
      <div
        className={`fixed right-3.5 sm:right-5 z-[9999] pointer-events-auto flex flex-col items-center gap-2.5 ${className}`}
        style={{
          bottom: "max(14px, env(safe-area-inset-bottom, 14px))",
        }}
      >
        {/* A. Controls Button (Sliders icon + Active tradition badge) - Hides on Tap to Open */}
        {!isHeroTapped && (
          <motion.button
            type="button"
            id="preview-controls-btn"
            aria-label="Invitation Controls: Religion filter, soundtrack selector and options"
            aria-haspopup="dialog"
            aria-expanded={isSheetOpen}
            onClick={(e) => {
              e.stopPropagation();
              setIsSheetOpen(true);
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            title="Invitation Controls (Tradition & Soundtrack)"
            className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-stone-950/85 hover:bg-stone-900 backdrop-blur-xl border border-amber-400/40 text-amber-300 shadow-[0_8px_24px_rgba(0,0,0,0.65)] flex items-center justify-center cursor-pointer select-none transition-colors"
          >
            {/* Subtle gold glow aura */}
            <span className="absolute -inset-0.5 rounded-full bg-amber-500/20 blur-sm pointer-events-none" />

            <Sliders size={19} weight="bold" />

            {/* Tiny active tradition badge */}
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 text-[10px] font-bold flex items-center justify-center shadow-sm select-none">
              {activeFaithOption.symbol}
            </span>
          </motion.button>
        )}

        {/* B. Mute / Unmute Button (Always visible on all cases) */}
        <motion.button
          type="button"
          id="preview-mute-unmute-btn"
          aria-label={isPlaying ? "Mute invitation soundtrack" : "Play invitation soundtrack"}
          onClick={handleToggleAudio}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          title={isPlaying ? "Mute soundtrack" : "Play soundtrack"}
          className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-stone-950/85 hover:bg-stone-900 backdrop-blur-xl border border-amber-400/40 text-amber-300 shadow-[0_8px_24px_rgba(0,0,0,0.65)] flex items-center justify-center cursor-pointer select-none transition-colors"
        >
          {/* Subtle gold glow aura */}
          <span className="absolute -inset-0.5 rounded-full bg-amber-500/20 blur-sm pointer-events-none" />

          {isPlaying ? (
            <div className="flex items-center justify-center gap-1">
              <SpeakerHigh size={19} weight="fill" className="text-amber-300" />
              {/* Pulsing micro soundwave bars */}
              <span className="flex items-center gap-0.5 h-3">
                <span className="w-[2px] h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="w-[2px] h-3 bg-amber-300 rounded-full animate-pulse delay-75" />
                <span className="w-[2px] h-1.5 bg-amber-400 rounded-full animate-pulse delay-150" />
              </span>
            </div>
          ) : (
            <SpeakerSlash size={19} weight="fill" className="text-stone-400" />
          )}
        </motion.button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. UNIFIED CONTROLS BOTTOM SHEET
          Houses both Religion Filter and Soundtrack Selector in one sleek UI
          ───────────────────────────────────────────────────────────── */}
      <style jsx global>{`
        .custom-song-scrollbar {
          scrollbar-width: thin !important;
          scrollbar-color: rgba(245, 158, 11, 0.4) transparent !important;
          -webkit-overflow-scrolling: touch !important;
        }
        .custom-song-scrollbar::-webkit-scrollbar {
          width: 4px !important;
          display: block !important;
        }
        .custom-song-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.04) !important;
          border-radius: 4px !important;
        }
        .custom-song-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.4) !important;
          border-radius: 4px !important;
        }
        .custom-song-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.7) !important;
        }
      `}</style>

      <AnimatePresence>
        {isSheetOpen && (
          <div className="fixed inset-0 z-[10001] flex flex-col justify-end pointer-events-auto">
            {/* Soft Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSheetOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              role="dialog"
              aria-modal="true"
              id="preview-controls-bottom-sheet"
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-lg mx-auto rounded-t-[28px] border-t border-amber-400/30 bg-[#12100E]/98 backdrop-blur-2xl text-stone-100 shadow-[0_-20px_50px_rgba(0,0,0,0.95)] flex flex-col h-[82vh] max-h-[82dvh] overflow-hidden"
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-1 cursor-grab shrink-0">
                <div className="w-10 h-1.5 rounded-full bg-white/20" />
              </div>

              {/* Sheet Header */}
              <div className="px-5 pt-2 pb-3 flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Sliders size={16} weight="bold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-100 tracking-wide font-montserrat">
                      Invitation Controls
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Customize wedding tradition & background soundtrack
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSheetOpen(false)}
                  className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-white/5 hover:bg-white/10 active:scale-95 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close controls"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Tab Selector: Tradition vs Soundtrack */}
              <div className="px-5 pt-3 pb-2 flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("tradition")}
                  className={`flex-1 py-2.5 px-3 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 ${
                    activeTab === "tradition"
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md"
                      : "bg-white/5 hover:bg-white/10 text-stone-300"
                  }`}
                >
                  <span className="text-sm">{activeFaithOption.symbol}</span>
                  <span>Tradition</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      activeTab === "tradition"
                        ? "bg-stone-950/20 text-stone-950"
                        : "bg-white/10 text-stone-400"
                    }`}
                  >
                    {activeFaithOption.label}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("soundtrack")}
                  className={`flex-1 py-2.5 px-3 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 ${
                    activeTab === "soundtrack"
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md"
                      : "bg-white/5 hover:bg-white/10 text-stone-300"
                  }`}
                >
                  <MusicNotes size={14} weight="bold" />
                  <span>Soundtrack</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold max-w-[80px] truncate ${
                      activeTab === "soundtrack"
                        ? "bg-stone-950/20 text-stone-950"
                        : "bg-white/10 text-stone-400"
                    }`}
                  >
                    {currentTrackItem.title}
                  </span>
                </button>
              </div>

              {/* TAB 1: TRADITION / RELIGION FILTER */}
              {activeTab === "tradition" && (
                <div
                  onWheel={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex-1 min-h-0 overflow-y-auto px-5 py-3 space-y-2.5 overscroll-contain touch-pan-y custom-song-scrollbar"
                  style={{
                    WebkitOverflowScrolling: "touch",
                    touchAction: "pan-y",
                  }}
                >
                  <div className="flex items-center justify-between text-xs text-stone-400 px-1">
                    <span>Choose ritual & wording style:</span>
                    <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                      Instant Preview
                    </span>
                  </div>

                  {FAITH_DETAILS.map((opt) => {
                    const isSelected = currentFaith === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          if (hasMovedRef.current > 5) return;
                          handleSelectFaith(opt.id);
                        }}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer select-none active:scale-[0.99] ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                            : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]"
                        }`}
                      >
                        {/* Faith Symbol Circle */}
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors ${
                            isSelected
                              ? "bg-amber-400 text-stone-950 font-bold shadow-md"
                              : "bg-white/5 border border-white/10 text-stone-300"
                          }`}
                        >
                          {opt.symbol}
                        </div>

                        {/* Text Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-stone-100 font-montserrat">
                                {opt.label} {opt.sublabel}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                  isSelected
                                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                                    : "bg-white/5 text-stone-400"
                                }`}
                              >
                                {opt.tag}
                              </span>
                            </div>

                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shrink-0">
                                <Check size={12} weight="bold" />
                              </div>
                            )}
                          </div>

                          <p className="text-xs text-amber-200/90 font-medium mt-0.5">
                            {opt.headline}
                          </p>

                          <p className="text-[11px] text-stone-400 leading-relaxed mt-1">
                            {opt.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: SOUNDTRACK SELECTOR */}
              {activeTab === "soundtrack" && (
                <div className="flex-1 min-h-0 flex flex-col px-5 py-2 overflow-hidden">
                  {/* Current Playing Bar */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/30 flex items-center justify-between gap-3 mb-2 shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                        <MusicNotes size={18} weight="fill" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                            Now Selected
                          </span>
                          {isPlaying && (
                            <span className="inline-flex items-center gap-0.5">
                              <span className="w-1 h-2 bg-amber-400 rounded-full animate-pulse" />
                              <span className="w-1 h-3 bg-amber-300 rounded-full animate-pulse delay-75" />
                              <span className="w-1 h-1.5 bg-amber-400 rounded-full animate-pulse delay-150" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-stone-100 truncate">
                          {currentTrackItem.title}
                        </p>
                        <p className="text-[10px] text-stone-400 truncate">
                          {currentTrackItem.artist}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handlePlayPreview(currentTrackItem, e)}
                      className="px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer shrink-0"
                    >
                      {isPlaying ? (
                        <>
                          <Pause size={12} weight="fill" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play size={12} weight="fill" />
                          <span>Play</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Category Filter Pills (Horizontal Scroll) */}
                  <div className="relative mb-2 shrink-0">
                    {canScrollLeft && (
                      <button
                        type="button"
                        onClick={() => scrollTabs("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-stone-950/90 text-stone-300 flex items-center justify-center shadow-md border border-white/10"
                      >
                        <CaretLeft size={12} />
                      </button>
                    )}
                    <div
                      ref={tabsRef}
                      onScroll={checkScrollState}
                      className="flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1 py-1"
                      style={{
                        WebkitOverflowScrolling: "touch",
                        touchAction: "pan-x",
                      }}
                    >
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setActiveCategory(c.id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                            activeCategory === c.id
                              ? "bg-amber-400 text-stone-950 shadow-sm font-bold"
                              : "bg-white/5 hover:bg-white/10 text-stone-400 hover:text-stone-200 border border-white/5"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                    {canScrollRight && (
                      <button
                        type="button"
                        onClick={() => scrollTabs("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-stone-950/90 text-stone-300 flex items-center justify-center shadow-md border border-white/10"
                      >
                        <CaretRight size={12} />
                      </button>
                    )}
                  </div>

                  {/* Scrollable Song List - Strict Flex child with cursor drag-to-scroll, wheel, and touch-pan-y */}
                  <div
                    ref={songListRef}
                    onMouseDown={handleSongListMouseDown}
                    onWheel={(e) => {
                      e.stopPropagation();
                    }}
                    className={`flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 overscroll-contain touch-pan-y custom-song-scrollbar pb-3 select-none ${
                      isCursorDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    style={{
                      WebkitOverflowScrolling: "touch",
                      touchAction: "pan-y",
                    }}
                  >
                    {filteredTracks.map((track) => {
                      const isSelected =
                        track.url === currentTrackUrl ||
                        (track.id === "template-original-soundtrack" &&
                          currentTrackUrl === fallbackDefaultUrl);
                      const isLoadedInAudio =
                        getTemplateAudio()?.src.endsWith(track.url) ||
                        getTemplateAudio()?.src === track.url;
                      const isCurrentlyPlayingThis = isLoadedInAudio && isPlaying;

                      return (
                        <div
                          key={track.id}
                          onClick={() => {
                            if (hasMovedRef.current > 5) return;
                            handleSelectSong(track);
                          }}
                          className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer select-none active:scale-[0.99] ${
                            isSelected
                              ? "bg-amber-500/10 border-amber-400/60 shadow-sm"
                              : "bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Play/Pause Audition Button */}
                            <button
                              type="button"
                              onClick={(e) => handlePlayPreview(track, e)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                isCurrentlyPlayingThis
                                  ? "bg-amber-400 text-stone-950 font-bold"
                                  : "bg-white/10 hover:bg-white/20 text-stone-300"
                              }`}
                              title={isCurrentlyPlayingThis ? "Pause preview" : "Play preview"}
                            >
                              {isCurrentlyPlayingThis ? (
                                <Pause size={11} weight="fill" />
                              ) : (
                                <Play size={11} weight="fill" className="ml-0.5" />
                              )}
                            </button>

                            <div className="min-w-0">
                              <p className="text-xs font-bold text-stone-100 truncate">
                                {track.title}
                              </p>
                              <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                                <span className="truncate">{track.artist}</span>
                                <span>•</span>
                                <span className="text-amber-400/80">{track.tag || track.categoryLabel}</span>
                              </div>
                            </div>
                          </div>

                          {/* Select Checkmark or Apply button */}
                          <div className="shrink-0">
                            {isSelected ? (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full">
                                <Check size={11} weight="bold" />
                                <span>Active</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectSong(track);
                                }}
                                className="text-[10px] font-bold text-stone-400 hover:text-white px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                              >
                                Select
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom Quick Actions Footer */}
              <div
                className="px-5 pt-3 pb-2 border-t border-white/10 flex items-center justify-between gap-3 shrink-0"
                style={{
                  paddingBottom: "max(18px, calc(env(safe-area-inset-bottom, 0px) + 12px))",
                }}
              >
                <Link
                  href="/templates"
                  className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-amber-300 transition-colors"
                  title="Back to all templates"
                >
                  <ArrowLeft size={13} weight="bold" className="text-amber-400" />
                  <span>Back to Templates</span>
                </Link>

                <div className="flex items-center gap-2.5">
                  <Link
                    href={`/customize/${templateId}${slug ? `?slug=${slug}` : ""}`}
                    className="flex items-center gap-1 text-xs font-semibold text-stone-400 hover:text-amber-300 transition-colors"
                  >
                    <PencilSimple size={13} />
                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsSheetOpen(false)}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
