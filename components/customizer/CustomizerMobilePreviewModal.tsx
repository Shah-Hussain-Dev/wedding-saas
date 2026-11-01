"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  X,
  ArrowsClockwise,
  ArrowUpRight,
  Eye,
} from "@phosphor-icons/react";
import type { CulturalTradition } from "@/lib/pdf-theme-tokens";

interface CustomizerMobilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  templateName: string;
  religion: CulturalTradition;
  musicTrack: string;
}

export function CustomizerMobilePreviewModal({
  isOpen,
  onClose,
  templateId,
  templateName,
  religion,
  musicTrack,
}: CustomizerMobilePreviewModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [isOpen]);

  const faith =
    religion === "muslim" ? "muslim" : religion === "hindu" ? "hindu" : "universal";

  const iframeSrc = useMemo(() => {
    const params = new URLSearchParams({
      embed: "1",
      customizer: "1",
      faith,
      musicTrack,
      t: String(reloadKey),
    });
    return `/preview/${templateId}/interactive?${params.toString()}`;
  }, [templateId, faith, musicTrack, reloadKey]);

  useEffect(() => {
    if (isOpen) {
      setLoaded(false);
    }
  }, [iframeSrc, isOpen]);

  const handleReload = useCallback(() => {
    setLoaded(false);
    setReloadKey((prev) => prev + 1);
  }, []);

  const fullPreviewHref = `/preview/${templateId}/interactive?customizer=1&faith=${faith}&musicTrack=${encodeURIComponent(musicTrack)}`;

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[500] flex flex-col bg-[#073D31] text-[#F7F4ED]"
      role="dialog"
      aria-modal="true"
      aria-label={`${templateName} Live Preview`}
    >
      {/* ── Top Safe-Area Header Bar (iOS notch & dynamic island safe) ── */}
      <header className="shrink-0 border-b border-white/10 bg-[#18211E] pt-[env(safe-area-inset-top,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
        <div className="flex min-h-[56px] items-center justify-between px-3 sm:px-4 py-1.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C8A45E]/20 text-[#C8A45E]">
              <Eye size={18} weight="bold" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-serif text-sm font-bold text-[#F7F4ED]">
                {templateName}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A45E]">
                Live Preview
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleReload}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white active:scale-95"
              title="Reload preview"
              aria-label="Reload preview"
            >
              <ArrowsClockwise size={18} weight="bold" />
            </button>

            <Link
              href={fullPreviewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white active:scale-95"
              title="Open in new tab"
              aria-label="Open in new tab"
            >
              <ArrowUpRight size={18} weight="bold" />
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95"
              aria-label="Close live preview"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Preview Viewport (Edge-to-Edge, strictly NO laptop/tablet/mobile device options) ── */}
      <div className="relative flex-1 w-full min-h-0 bg-[#082F27] overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#082F27] text-white">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C8A45E]/30 border-t-[#C8A45E]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[#E1C98E]">
              Loading Live Preview...
            </span>
          </div>
        )}
        <iframe
          key={iframeSrc}
          src={iframeSrc}
          title={`${templateName} live preview modal`}
          onLoad={() => setLoaded(true)}
          className="absolute inset-0 h-full w-full border-0 bg-[#082F27]"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        />
      </div>

      {/* ── Bottom Safe-Area Bar (iOS home indicator safe) ── */}
      <footer className="shrink-0 bg-[#18211E] px-4 py-2.5 text-center pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] border-t border-white/5">
        <p className="font-sans text-[10px] font-medium text-white/60">
          Showing real-time edits · Tap to test interactive invitations
        </p>
      </footer>
    </div>,
    document.body
  );
}

