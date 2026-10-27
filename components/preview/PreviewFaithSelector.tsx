"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Sparkle } from "@phosphor-icons/react";
import { PreviewFaith, FAITH_VARIANTS } from "@/lib/preview-faith-content";

export interface PreviewFaithSelectorProps {
  currentFaith: PreviewFaith;
  onSelectFaith: (faith: PreviewFaith) => void;
  isHeroTapped?: boolean;
  onToggleVisibility?: () => void;
  className?: string;
  isCompact?: boolean;
  topOffset?: string; // Kept for backwards compatibility
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

export function PreviewFaithSelector({
  currentFaith,
  onSelectFaith,
  isHeroTapped = false,
  className = "",
}: PreviewFaithSelectorProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const activeOption =
    FAITH_DETAILS.find((f) => f.id === currentFaith) || FAITH_DETAILS[0];

  const handleSelect = (faith: PreviewFaith) => {
    onSelectFaith(faith);
    setIsSheetOpen(false);
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. FLOATING TRADITION ICON BUTTON
          Positioned directly above the mute/unmute audio button on bottom-right
          ───────────────────────────────────────────────────────────── */}
      <div
        className={`fixed right-3.5 sm:right-4 z-[999] pointer-events-auto ${isHeroTapped ? "hidden sm:block" : "block"} transition-all duration-300 ${className}`}
        style={{
          bottom: "max(72px, calc(env(safe-area-inset-bottom, 0px) + 68px))",
        }}
      >
        <motion.button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label={`Tradition: ${activeOption.label} (${activeOption.sublabel}) - Tap to change`}
          aria-haspopup="dialog"
          aria-expanded={isSheetOpen}
          title={`Wedding Tradition: ${activeOption.label} (Tap to change)`}
          className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-stone-950/85 hover:bg-stone-900 backdrop-blur-xl border border-amber-400/40 text-amber-300 shadow-[0_8px_24px_rgba(0,0,0,0.65)] flex items-center justify-center cursor-pointer select-none transition-colors"
        >
          {/* Subtle gold glow aura */}
          <span className="absolute -inset-0.5 rounded-full bg-amber-500/20 blur-sm pointer-events-none" />

          {/* Active faith symbol */}
          <span className="text-base sm:text-lg leading-none select-none" aria-hidden="true">
            {activeOption.symbol}
          </span>

          {/* Tiny filter badge */}
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 text-[9px] font-bold flex items-center justify-center shadow-sm">
            <Sparkle size={9} weight="fill" />
          </span>
        </motion.button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. TRADITION BOTTOM SHEET MODAL
          Clean, elegant bottom drawer explaining all 3 traditions
          ───────────────────────────────────────────────────────────── */}
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
              className="absolute inset-0 bg-black/65 backdrop-blur-sm cursor-pointer"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-lg mx-auto rounded-t-[28px] border-t border-amber-400/30 bg-[#12100E]/98 backdrop-blur-2xl text-stone-100 shadow-[0_-20px_50px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden"
              style={{
                paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))",
              }}
            >
              {/* Drag Handle Pill */}
              <div className="flex justify-center pt-3 pb-1 cursor-grab">
                <div className="w-10 h-1.5 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                    <Sparkle size={18} weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-white tracking-wide">
                      Select Wedding Tradition
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Adapts sacred verses, ceremony titles &amp; cultural wording
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSheetOpen(false)}
                  aria-label="Close tradition selector"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* 3 Tradition Cards */}
              <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
                {FAITH_DETAILS.map((opt) => {
                  const isSelected = currentFaith === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelect(opt.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 active:scale-[0.98] ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/30"
                          : "bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20"
                      }`}
                    >
                      {/* Tradition Symbol Box */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform ${
                          isSelected
                            ? "bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-md scale-105"
                            : "bg-white/10 text-stone-200"
                        }`}
                      >
                        {opt.symbol}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-serif font-bold text-sm text-white truncate">
                              {opt.label}
                            </span>
                            <span
                              className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                                isSelected
                                  ? "bg-amber-400/25 text-amber-300 border border-amber-400/40"
                                  : "bg-white/10 text-stone-400"
                              }`}
                            >
                              {opt.sublabel}
                            </span>
                          </div>

                          {/* Selected Checkmark */}
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 shadow-sm">
                              <Check size={12} weight="bold" />
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-medium text-amber-200/90 mb-1">
                          {opt.headline}
                        </p>
                        <p className="text-[11px] text-stone-400 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Close / Done Action */}
              <div className="px-4 pt-1">
                <button
                  type="button"
                  onClick={() => setIsSheetOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg active:scale-98 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
