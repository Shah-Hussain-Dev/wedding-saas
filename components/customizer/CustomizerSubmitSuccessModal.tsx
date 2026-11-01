"use client";

import confetti from "canvas-confetti";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import {
  ArrowSquareOut,
  CheckCircle,
  Copy,
  House,
  ShareNetwork,
  Sparkle,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";
import { siteConfig } from "@/config/site";

export interface CustomizerSuccessInvite {
  id: string;
  slug: string;
  brideName: string;
  groomName: string;
  weddingDate?: string;
  weddingTime?: string;
  venueName?: string;
  venueAddress?: string;
  templateId?: string;
}

interface CustomizerSubmitSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  invite: CustomizerSuccessInvite | null;
  onShare: () => void;
  onOpenFullscreenPreview?: () => void;
  hidePreviewAction?: boolean;
}

export function CustomizerSubmitSuccessModal({
  isOpen,
  onClose,
  invite,
  onShare,
  onOpenFullscreenPreview,
  hidePreviewAction = false,
}: CustomizerSubmitSuccessModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    try {
      confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.45 },
        colors: ["#D4AF37", "#10B981", "#FEF0C7", "#073D31", "#FFFFFF"],
      });
    } catch {
      /* ignore */
    }
  }, [isOpen]);

  if (!isOpen || !mounted || !invite) return null;

  const path = invite.slug.startsWith("/") ? invite.slug : `/${invite.slug}`;
  const fullUrl =
    typeof window !== "undefined" && window.location.origin
      ? `${window.location.origin}${path}`
      : `${siteConfig.url}${path}`;

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[410] flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-sm"
      role="presentation"
    >
      <div
        className="relative my-auto w-full max-w-md rounded-2xl border border-[#C8A45E]/30 bg-[#FCFBF7] p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#76766F] hover:bg-[#073D31]/5"
          aria-label="Close"
        >
          <X size={18} weight="bold" />
        </button>

        <div className="space-y-3 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-emerald-600" weight="fill" />
          <h2 className="font-serif text-2xl font-medium text-[#18211E]">You&apos;re all set!</h2>
          <p className="text-sm leading-relaxed text-[#76766F]">
            {invite.brideName} &amp; {invite.groomName} is saved to your dashboard. Change any detail
            whenever you like—your link stays the same until you publish for guests.
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3 text-left">
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Shareable link
            </span>
            <span className="block truncate font-mono text-xs font-semibold text-stone-900">
              {siteConfig.domain}{path}
            </span>
          </div>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#C8A45E] px-3 py-1.5 text-xs font-bold text-stone-950"
          >
            {copied ? <CheckCircle size={14} weight="fill" /> : <Copy size={14} weight="bold" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={onShare}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700"
          >
            <ShareNetwork size={18} weight="bold" />
            Share invitation
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `You're invited to celebrate ${invite.brideName} & ${invite.groomName}! View details: ${fullUrl}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-900"
          >
            <WhatsappLogo size={18} weight="fill" />
            WhatsApp
          </a>
          {!hidePreviewAction && onOpenFullscreenPreview ? (
            <button
              type="button"
              onClick={onOpenFullscreenPreview}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#073D31] text-xs font-bold text-[#F7F4ED]"
            >
              <Sparkle size={16} weight="fill" className="text-[#C8A45E]" />
              Open full preview
              <ArrowSquareOut size={16} />
            </button>
          ) : null}
          <Link
            href="/dashboard"
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[#073D31]/15 bg-white text-xs font-bold text-[#073D31]"
          >
            <House size={16} weight="bold" />
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
