"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CURATED_AUDIO_TRACKS,
  AudioTrackItem,
} from "@/lib/audio-tracks";
import {
  MusicNotes,
  Play,
  Pause,
  X,
  Check,
  CheckCircle,
  Sparkle,
  Sliders,
  CaretDown,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";

export interface PreviewMusicSelectorProps {
  templateId: string;
  templateName?: string;
  templateDefaultUrl?: string;
  currentTrackUrl: string;
  onSelectTrack: (trackUrl: string) => void;
  className?: string;
  placement?: "responsive-dock" | "bottom-left" | "bottom-right";
}

export function PreviewMusicSelector({
  templateId,
  templateName = "Template",
  templateDefaultUrl,
  currentTrackUrl,
  onSelectTrack,
  className = "",
  placement = "responsive-dock",
}: PreviewMusicSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAudioSrc, setActiveAudioSrc] = useState<string>(currentTrackUrl);

  // Category horizontal scroll controls
  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const checkScrollState = () => {
    if (!tabsRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(checkScrollState, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleTabsScroll = () => {
    checkScrollState();
  };

  const scrollTabs = (direction: "left" | "right") => {
    if (!tabsRef.current) return;
    const scrollAmount = direction === "left" ? -180 : 180;
    tabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabsRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tabsRef.current.offsetLeft);
    setScrollLeftPos(tabsRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !tabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    tabsRef.current.scrollLeft = scrollLeftPos - walk;
    checkScrollState();
  };

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

    // Filter duplicates if any curated track has the same URL
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

  // ─────────────────────────────────────────────────────────────
  // SINGLE SOURCE OF TRUTH AUDIO SYNC WITH TEMPLATE'S <audio>
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
    const handleSourceChange = () => {
      if (audio.src) {
        setActiveAudioSrc(audio.src);
      }
    };

    // Initial sync
    setIsPlaying(!audio.paused);
    if (audio.src) {
      setActiveAudioSrc(audio.src);
    }

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadeddata", handleSourceChange);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadeddata", handleSourceChange);
    };
  }, [currentTrackUrl]);

  // Switch or Play/Pause audio safely through the template's audio element
  const handleTogglePlayTrack = (track: AudioTrackItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const audio = getTemplateAudio();
    if (!audio) return;

    // Check if the clicked track is currently loaded in the audio player
    const isThisTrackLoaded =
      audio.src.endsWith(track.url) ||
      audio.src === track.url ||
      (currentTrackUrl === track.url && !audio.src.includes("blob:"));

    if (isThisTrackLoaded) {
      if (audio.paused) {
        audio.muted = false;
        audio.play().then(() => setIsPlaying(true)).catch((err) => {
          console.warn("Audio playback gesture required:", err);
        });
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      // Switch track and play immediately
      audio.src = track.url;
      audio.muted = false;
      audio.load();
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Audio play blocked or loading:", err);
        });

      // Update selection in parent preview & storage
      onSelectTrack(track.url);
      persistSongSelection(track.url);
    }
  };

  // Select a song and apply to invitation
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

      // Also sync into existing draft or saved invitation in localStorage if present
      const stored = localStorage.getItem(`unfold_invitation_${templateId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.musicTrack = url;
        localStorage.setItem(`unfold_invitation_${templateId}`, JSON.stringify(parsed));
      }
    } catch (_) {}
  };

  // Keyboard accessibility: close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

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

  const placementClass =
    placement === "bottom-left"
      ? "left-4 right-auto"
      : placement === "bottom-right"
      ? "right-[72px] left-auto"
      : "left-4 right-auto md:left-auto md:right-[72px]";

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. FLOATING THUMB-ZONE MUSIC BADGE (Trigger)
          Positioned bottom-left on mobile; docked next to speaker on desktop
          to ensure left-side Customize button & Sandbox panel are 100% visible
          ───────────────────────────────────────────────────────────── */}
      <div
        className={`fixed z-[9998] pointer-events-auto ${placementClass} ${className}`}
        style={{
          bottom: "max(18px, env(safe-area-inset-bottom, 18px))",
        }}
      >
        <motion.button
          type="button"
          id="preview-music-selector-btn"
          aria-label="Change invitation soundtrack"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-2.5 h-[44px] pl-3 pr-3.5 rounded-full bg-stone-950/85 backdrop-blur-xl border border-amber-400/35 text-white shadow-[0_10px_30px_rgba(0,0,0,0.65)] hover:border-amber-400/60 transition-all select-none cursor-pointer"
        >
          {/* Pulsing glow aura when music is playing */}
          {isPlaying && (
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-300/20 blur-sm animate-pulse pointer-events-none" />
          )}

          {/* Equalizer Wave / Music Note */}
          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/15 text-amber-300 shrink-0">
            {isPlaying ? (
              <span className="flex items-end gap-[2px] h-3">
                <span className="w-[2.5px] bg-amber-400 rounded-full animate-[soundwave_0.8s_ease-in-out_infinite]" />
                <span className="w-[2.5px] bg-amber-300 rounded-full animate-[soundwave_0.8s_ease-in-out_0.2s_infinite]" />
                <span className="w-[2.5px] bg-amber-400 rounded-full animate-[soundwave_0.8s_ease-in-out_0.4s_infinite]" />
              </span>
            ) : (
              <MusicNotes size={14} weight="bold" />
            )}
          </div>

          {/* Track Name */}
          <div className="flex flex-col text-left leading-tight pr-1">
            <span className="text-[9px] uppercase tracking-wider text-amber-300/80 font-bold">
              Soundtrack
            </span>
            <span className="text-xs font-semibold text-stone-100 truncate max-w-[110px] sm:max-w-[145px]">
              {currentTrackItem.title}
            </span>
          </div>

          {/* Change Pill */}
          <div className="flex items-center gap-0.5 pl-1.5 border-l border-white/15 text-amber-400 text-[11px] font-bold tracking-wide">
            <span>Change</span>
            <CaretDown size={11} weight="bold" />
          </div>
        </motion.button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. ELEGANT BOTTOM SHEET DRAWER (Non-Obstructive Preview)
          Constrained to max-h-[60vh] to preserve wedding couple portrait
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10000] flex flex-col justify-end pointer-events-auto">
            {/* Soft Backdrop: Click to dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Bottom Sheet Modal Container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-xl mx-auto h-[62vh] sm:h-[65vh] max-h-[680px] flex flex-col rounded-t-[28px] border-t border-amber-400/25 bg-[#12100E]/95 backdrop-blur-2xl text-stone-100 shadow-[0_-20px_50px_rgba(0,0,0,0.85)] overflow-hidden"
              style={{
                paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))",
              }}
            >
              {/* Drag Pill Handle */}
              <div className="flex justify-center pt-3 pb-1 cursor-grab">
                <div className="w-10 h-1.5 rounded-full bg-white/20" />
              </div>

              {/* Header Bar */}
              <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                    <MusicNotes size={18} weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-white tracking-wide">
                      Choose Your Music
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Tap play to preview with your live invitation
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close music selector"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Category Filter Pills (Fully Scrollable with Wheel, Drag & Chevrons) */}
              <div className="relative border-b border-white/10 shrink-0 bg-[#0E0C0B]/60">
                {/* Scroll Left Button */}
                {canScrollLeft && (
                  <button
                    type="button"
                    onClick={() => scrollTabs("left")}
                    aria-label="Scroll categories left"
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-stone-900/90 hover:bg-stone-800 border border-amber-400/30 text-amber-300 flex items-center justify-center shadow-lg cursor-pointer backdrop-blur-md transition-all active:scale-95"
                  >
                    <CaretLeft size={14} weight="bold" />
                  </button>
                )}

                {/* Left fade gradient when scrollable */}
                {canScrollLeft && (
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#12100E] to-transparent pointer-events-none z-[5]" />
                )}

                {/* Scrollable Tabs Track */}
                <div
                  ref={tabsRef}
                  onScroll={handleTabsScroll}
                  onWheel={(e) => {
                    if (e.deltaY !== 0 && tabsRef.current) {
                      e.currentTarget.scrollLeft += e.deltaY;
                    }
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  className="px-5 py-2.5 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-1.5 cursor-grab active:cursor-grabbing select-none"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={(e) => {
                          setActiveCategory(cat.id);
                          (e.currentTarget as HTMLElement).scrollIntoView({
                            behavior: "smooth",
                            inline: "center",
                            block: "nearest",
                          });
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                          isActive
                            ? "bg-amber-400 text-stone-950 shadow-md font-bold"
                            : "bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                  {/* End spacer so last tab ("Orchestral") is never clipped */}
                  <div className="w-8 shrink-0" aria-hidden="true" />
                </div>

                {/* Right fade gradient when scrollable */}
                {canScrollRight && (
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#12100E] to-transparent pointer-events-none z-[5]" />
                )}

                {/* Scroll Right Button */}
                {canScrollRight && (
                  <button
                    type="button"
                    onClick={() => scrollTabs("right")}
                    aria-label="Scroll categories right"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-stone-900/90 hover:bg-stone-800 border border-amber-400/30 text-amber-300 flex items-center justify-center shadow-lg cursor-pointer backdrop-blur-md transition-all active:scale-95"
                  >
                    <CaretRight size={14} weight="bold" />
                  </button>
                )}
              </div>

              {/* Scrollable Song List */}
              <div
                className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-2 overscroll-contain scroll-smooth"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(245, 158, 11, 0.35) transparent",
                  WebkitOverflowScrolling: "touch",
                  touchAction: "pan-y",
                }}
              >
                {filteredTracks.map((track) => {
                  const isSelected = currentTrackUrl === track.url;
                  const isCurrentPlaying = isPlaying && isSelected;

                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectSong(track)}
                      className={`group relative rounded-2xl p-3 flex items-center justify-between gap-3 transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                          : "bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20"
                      }`}
                    >
                      {/* Left: Play/Pause button + Track Info */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Play / Pause circular button (44x44px ergonomic touch target) */}
                        <button
                          type="button"
                          aria-label={
                            isCurrentPlaying
                              ? `Pause ${track.title}`
                              : `Preview ${track.title}`
                          }
                          onClick={(e) => handleTogglePlayTrack(track, e)}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer shadow-md ${
                            isCurrentPlaying
                              ? "bg-gradient-to-br from-amber-400 to-amber-500 text-stone-950 font-bold"
                              : "bg-white/10 hover:bg-white/20 text-stone-200"
                          }`}
                        >
                          {isCurrentPlaying ? (
                            <Pause size={18} weight="fill" />
                          ) : (
                            <Play size={18} weight="fill" className="ml-0.5" />
                          )}
                        </button>

                        {/* Title, Artist & Tag */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-stone-100 truncate group-hover:text-amber-200 transition-colors">
                              {track.title}
                            </span>
                            {track.tag && (
                              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-400/15 text-amber-300 font-bold shrink-0">
                                {track.tag}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5 truncate">
                            <span className="truncate">{track.artist}</span>
                            <span className="text-stone-600">•</span>
                            <span className="shrink-0">{track.duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Selected Status Pill / Checkmark */}
                      <div className="shrink-0 pl-1 flex items-center">
                        {isSelected ? (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-stone-950 font-bold text-xs shadow-sm">
                            <Check size={14} weight="bold" />
                            <span className="hidden sm:inline">Active</span>
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full border border-white/20 group-hover:border-amber-400/40 flex items-center justify-center text-stone-500 group-hover:text-amber-300 transition-colors">
                            <Check size={14} weight="bold" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {/* Bottom clearance spacer */}
                <div className="h-4 shrink-0" aria-hidden="true" />
              </div>

              {/* Sticky "Now Playing" Bottom Bar inside the Sheet */}
              <div className="px-5 pt-3 pb-1 border-t border-white/10 bg-[#0E0C0B] flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                    <MusicNotes size={16} weight="fill" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-amber-400 block">
                      {isPlaying ? "Now Playing" : "Selected Track"}
                    </span>
                    <span className="text-xs font-semibold text-stone-200 truncate block max-w-[180px] sm:max-w-xs">
                      {currentTrackItem.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleTogglePlayTrack(currentTrackItem, e)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause size={14} weight="fill" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={14} weight="fill" />
                        <span>Play</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold transition-all shadow-md cursor-pointer"
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
