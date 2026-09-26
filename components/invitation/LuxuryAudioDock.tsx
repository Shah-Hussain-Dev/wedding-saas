"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Play,
  Pause,
  SpeakerSimpleHigh,
  SpeakerSimpleSlash,
  MusicNote,
} from "@phosphor-icons/react";

interface LuxuryAudioDockProps {
  isPlaying: boolean;
  onToggle: () => void;
  trackTitle?: string;
  theme?: "emerald" | "crimson" | "champagne";
  className?: string;
}

export function LuxuryAudioDock({
  isPlaying,
  onToggle,
  trackTitle = "Royal Shehnai Symphony",
  theme = "emerald",
  className = "",
}: LuxuryAudioDockProps) {
  const getThemeStyles = () => {
    switch (theme) {
      case "crimson":
        return {
          pill: "bg-[#2a060d]/90 border-[#d4af37]/40 text-[#fdf8f2] shadow-[0_10px_30px_rgba(42,6,13,0.5)]",
          btn: "bg-[#d4af37] text-[#2a060d] hover:bg-[#ebd28a]",
          bar: "bg-[#d4af37]",
          accent: "text-[#d4af37]",
        };
      case "champagne":
        return {
          pill: "bg-[#ffffff]/90 border-[#d4af37]/35 text-[#1c1a17] shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
          btn: "bg-[#1c1a17] text-[#faf9f5] hover:bg-[#333333]",
          bar: "bg-[#b8860b]",
          accent: "text-[#b8860b]",
        };
      case "emerald":
      default:
        return {
          pill: "bg-[#061c15]/90 border-[#d4af37]/40 text-[#f3f9f6] shadow-[0_10px_30px_rgba(6,28,21,0.6)]",
          btn: "bg-[#d4af37] text-[#061c15] hover:bg-[#e6ca65]",
          bar: "bg-[#d4af37]",
          accent: "text-[#d4af37]",
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-3.5 py-2 rounded-full backdrop-blur-xl border ${styles.pill} ${className}`}
      style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
    >
      {/* Animated Equalizer Waveform */}
      <div className="flex items-center gap-0.5 h-4 px-1">
        {[0.4, 0.9, 0.6, 1, 0.5].map((scale, i) => (
          <motion.div
            key={i}
            className={`w-[2.5px] rounded-full ${styles.bar}`}
            animate={{
              height: isPlaying ? [4, 16 * scale, 6, 14 * scale, 4] : 4,
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Track Label (Hidden on super small screens) */}
      <div className="hidden sm:flex flex-col pr-1">
        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-400 opacity-80 leading-none">
          Audio Experience
        </span>
        <span className="text-[11px] font-semibold tracking-wide truncate max-w-[130px]">
          {trackTitle}
        </span>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={onToggle}
        aria-label={isPlaying ? "Pause Music" : "Play Music"}
        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-transform active:scale-90 shadow-md ${styles.btn}`}
      >
        {isPlaying ? (
          <Pause size={14} weight="fill" />
        ) : (
          <Play size={14} weight="fill" className="ml-0.5" />
        )}
      </button>
    </motion.div>
  );
}
