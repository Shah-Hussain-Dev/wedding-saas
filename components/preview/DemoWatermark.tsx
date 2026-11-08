"use client";

import { Sparkle, ShieldCheck, LockOpen } from "@phosphor-icons/react";

interface DemoWatermarkProps {
  slug?: string;
  brideName?: string;
  groomName?: string;
  templateName?: string;
  onUnlock?: () => void;
  priceFormatted?: string;
}

/**
 * DemoWatermark Component
 * Renders an authentic luxury watermark across the unpaid customized invitation.
 * Features:
 * - Subtle luxury diagonal watermark background repeating pattern (pointer-events-none)
 * - Prominent, floating "PREVIEW DEMO • WEDINVITES.IN" luxury seal pill
 * - Ensures 100% facial and content clearance according to Mobile-First rules
 */
export function DemoWatermark({
  slug,
  brideName,
  groomName,
  templateName,
  onUnlock,
  priceFormatted = "₹1,499",
}: DemoWatermarkProps) {
  return (
    <>
      {/* ── 1. Subtle, Luxury Tiled Watermark Text across background (pointer-events-none) ── */}
      <div
        className="fixed inset-0 z-[40] pointer-events-none select-none overflow-hidden opacity-[0.035] dark:opacity-[0.055]"
        aria-hidden="true"
      >
        <div className="absolute -inset-[100%] flex flex-wrap items-center justify-around gap-24 rotate-[-25deg] transform scale-110">
          {Array.from({ length: 48 }).map((_, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center font-serif text-lg sm:text-2xl font-bold tracking-widest text-[#C8A45E] whitespace-nowrap">
              <span>DEMO PREVIEW</span>
              <span className="text-[10px] sm:text-xs tracking-normal font-sans opacity-70">wedinvites.in/{slug || "preview"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. Top-Center Luxury Preview Watermark Pill (Under the top header, safe clearance) ── */}
      <aside
        aria-label="Demo preview watermark badge"
        className="fixed top-14 sm:top-16 inset-x-0 z-[45] flex justify-center pointer-events-none px-3"
      >
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-stone-950/85 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-amber-200 shadow-xl backdrop-blur-md transition-all hover:bg-stone-950/95">
          <Sparkle size={13} weight="fill" className="text-amber-400 shrink-0 animate-pulse" />
          <span className="uppercase tracking-wider font-bold text-amber-300">Preview Demo</span>
          <span className="text-white/30">•</span>
          <span className="text-stone-300">wedinvites.in</span>
          <span className="text-white/30">•</span>
          <span className="text-amber-100/90 font-medium hidden xs:inline">Unlock to remove watermark</span>
          {onUnlock && (
            <button
              type="button"
              onClick={onUnlock}
              className="ml-1 inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-0.5 text-[9px] font-bold text-amber-300 hover:bg-amber-400/30 transition-colors"
            >
              <LockOpen size={10} weight="bold" />
              <span>Unlock</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

