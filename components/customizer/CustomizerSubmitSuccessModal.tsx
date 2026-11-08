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
  LockOpen,
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
  alreadySaved?: boolean;
  isPaid?: boolean;
}

interface CustomizerSubmitSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  invite: CustomizerSuccessInvite | null;
  onShare: () => void;
  onOpenFullscreenPreview?: () => void;
  hidePreviewAction?: boolean;
  onPay?: () => void;
  priceFormatted?: string;
}

export function CustomizerSubmitSuccessModal({
  isOpen,
  onClose,
  invite,
  onShare,
  onOpenFullscreenPreview,
  hidePreviewAction = false,
  onPay,
  priceFormatted = "₹1,499",
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
          {invite.isPaid ? (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle size={32} weight="fill" className="text-emerald-600" />
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
                Live Website Activated
              </div>
              <h2 className="font-serif text-2xl font-medium text-[#18211E]">Invitation is Live &amp; Published!</h2>
              <p className="text-sm leading-relaxed text-[#76766F]">
                {invite.brideName} &amp; {invite.groomName} is published and ready to share.
                Your link is permanent and guests can now RSVP in real time.
              </p>
            </>
          ) : invite.alreadySaved ? (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <CheckCircle size={32} weight="fill" className="text-amber-600" />
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-800">
                <Sparkle size={12} weight="fill" className="text-amber-600" />
                Already Saved in Dashboard
              </div>
              <h2 className="font-serif text-2xl font-medium text-[#18211E]">Template Already Saved</h2>
              <p className="text-sm leading-relaxed text-[#76766F]">
                {invite.brideName} &amp; {invite.groomName} is saved in your dashboard.
                Your latest customizations have been updated while keeping your original clean link.
                This preview is in free demo mode with preview timer and watermark. Complete payment anytime to unlock your permanent live website.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <Sparkle size={28} weight="fill" className="text-amber-600" />
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-800">
                <Sparkle size={12} weight="fill" className="text-amber-600" />
                Free Demo Preview · Unpaid Draft
              </div>
              <h2 className="font-serif text-2xl font-medium text-[#18211E]">Your Free Demo Link is Ready!</h2>
              <p className="text-sm leading-relaxed text-[#76766F]">
                {invite.brideName} &amp; {invite.groomName} is saved to your dashboard as a free live demo. Complete
                payment anytime to remove the demo watermark and activate real guest RSVPs.
              </p>
            </>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3 text-left">
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
              {invite.isPaid ? "Shareable link" : "Demo preview link"}
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
          {invite.isPaid ? (
            <>
              <button
                type="button"
                onClick={onShare}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
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
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-900 transition-colors"
              >
                <WhatsappLogo size={18} weight="fill" />
                WhatsApp
              </a>
              {!hidePreviewAction && onOpenFullscreenPreview ? (
                <button
                  type="button"
                  onClick={onOpenFullscreenPreview}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#073D31] text-xs font-bold text-[#F7F4ED] hover:bg-[#032A23] transition-colors"
                >
                  <Sparkle size={16} weight="fill" className="text-[#C8A45E]" />
                  Open live website
                  <ArrowSquareOut size={16} />
                </button>
              ) : null}
            </>
          ) : (
            <>
              {onPay && (
                <button
                  type="button"
                  onClick={onPay}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-[#073D31] text-xs font-bold text-white shadow-lg hover:from-emerald-700 hover:to-[#032A23] transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <LockOpen size={18} weight="bold" className="text-[#C8A45E]" />
                  <span>Pay &amp; Unlock Official Website · {priceFormatted}</span>
                </button>
              )}
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[#073D31]/20 bg-white text-xs font-bold text-[#073D31] hover:bg-stone-50 transition-colors"
              >
                <Sparkle size={16} weight="fill" className="text-[#C8A45E]" />
                <span>View Demo Preview Link</span>
                <ArrowSquareOut size={16} />
              </a>
            </>
          )}

          <Link
            href="/dashboard"
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[#073D31]/15 bg-white text-xs font-bold text-[#073D31] hover:bg-stone-50 transition-colors"
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
