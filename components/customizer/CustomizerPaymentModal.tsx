"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  LockOpen,
  ShieldCheck,
  Sparkle,
  Spinner,
  X,
  CreditCard,
  QrCode,
  DeviceMobile,
} from "@phosphor-icons/react";
import type { TemplatePricingDetail } from "@/lib/hooks/use-template-pricing";

interface CustomizerPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPay: () => Promise<void> | void;
  onSaveAsDraft: () => void;
  isPaying: boolean;
  coupleLabel: string;
  templateId: string;
  pricing: TemplatePricingDetail;
  slug?: string;
}

export function CustomizerPaymentModal({
  isOpen,
  onClose,
  onPay,
  onSaveAsDraft,
  isPaying,
  coupleLabel,
  templateId,
  pricing,
  slug,
}: CustomizerPaymentModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;

  const sellingPrice = pricing.priceFormatted || "₹1,499";
  const originalPrice = pricing.originalPriceFormatted || "₹2,999";
  const discountPercent = pricing.discountPercent || 50;

  return createPortal(
    <div
      className="fixed inset-0 z-[420] flex items-center justify-center bg-black/70 p-3 sm:p-5 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative my-auto w-full max-w-lg rounded-2xl border border-[#C8A45E]/40 bg-[#FCFBF7] p-5 sm:p-7 shadow-2xl text-[#18211E] max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="customizer-payment-title"
      >
        {/* Close button (min 44x44px touch target) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#76766F] hover:bg-[#073D31]/5 transition-colors"
          aria-label="Close"
        >
          <X size={18} weight="bold" />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C8A45E]/40 bg-[#C8A45E]/15 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-wider text-[#8B6914]">
            <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
            First Priority · Instant Activation
          </span>
        </div>

        <h2 id="customizer-payment-title" className="font-serif text-2xl sm:text-3xl font-medium leading-tight text-[#18211E]">
          Unlock {coupleLabel}&apos;s Invitation
        </h2>
        <p className="mt-1 font-sans text-xs sm:text-sm text-[#76766F] leading-relaxed">
          Complete your one-time payment to publish your permanent live link and unlock guest RSVPs.
        </p>

        {/* Pricing Card */}
        <div className="mt-4 rounded-xl border border-[#C8A45E]/30 bg-gradient-to-br from-[#FEFBF2] to-[#F7F2E7] p-4 text-left shadow-sm">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="font-serif text-3xl font-bold text-[#073D31]">
                {sellingPrice}
              </span>
              <span className="ml-2 font-sans text-xs text-[#76766F] line-through">
                {originalPrice}
              </span>
            </div>
            <span className="inline-flex rounded-full bg-emerald-600 px-2.5 py-0.5 font-sans text-[11px] font-bold text-white">
              {discountPercent}% OFF
            </span>
          </div>
          <p className="mt-1 font-sans text-[11px] font-medium text-[#8B6914]">
            One-time payment • Lifetime hosting • No monthly charges
          </p>
        </div>

        {/* What You Get Features List */}
        <div className="mt-4 space-y-2.5 rounded-xl border border-[#073D31]/10 bg-white/70 p-3.5 sm:p-4 text-left">
          <h3 className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#073D31]">
            Everything Included:
          </h3>
          <ul className="space-y-2 font-sans text-xs text-[#2C3834]">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} weight="fill" className="shrink-0 text-emerald-600 mt-0.5" />
              <span><strong>Permanent Custom Link:</strong> Never expires, share freely with guests</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} weight="fill" className="shrink-0 text-emerald-600 mt-0.5" />
              <span><strong>Real-Time Guest RSVPs:</strong> Track attendance & guest counts live</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} weight="fill" className="shrink-0 text-emerald-600 mt-0.5" />
              <span><strong>Luxury Audio Dock:</strong> Background music & romantic audio tracks</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} weight="fill" className="shrink-0 text-emerald-600 mt-0.5" />
              <span><strong>Instant WhatsApp Sharing:</strong> 1-tap pre-filled cards for wedding guests</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} weight="fill" className="shrink-0 text-emerald-600 mt-0.5" />
              <span><strong>Unlimited Edits:</strong> Update ceremonies, dates & photos anytime</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} weight="fill" className="shrink-0 text-emerald-600 mt-0.5" />
              <span><strong>100% Ad-Free Experience:</strong> Dedicated royal celebration for family</span>
            </li>
          </ul>
        </div>

        {/* Payment CTA Actions */}
        <div className="mt-5 space-y-2.5">
          <button
            type="button"
            onClick={onPay}
            disabled={isPaying}
            className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#073D31] px-4 font-sans text-sm font-bold text-[#F7F4ED] shadow-md transition-all hover:bg-[#032A23] active:scale-[0.99] disabled:opacity-60"
          >
            {isPaying ? (
              <>
                <Spinner size={18} className="animate-spin" />
                <span>Processing Payment…</span>
              </>
            ) : (
              <>
                <LockOpen size={18} weight="bold" className="text-[#C8A45E]" />
                <span>Pay &amp; Activate Live Website · {sellingPrice}</span>
              </>
            )}
          </button>

          {/* Supported Methods & Security */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center font-sans text-[11px] text-[#76766F] pt-1">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={14} weight="fill" className="text-emerald-600" />
              Secure 256-bit Razorpay Checkout
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <QrCode size={14} weight="bold" />
              UPI (GPay / PhonePe / Paytm)
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <CreditCard size={14} weight="bold" />
              Cards &amp; NetBanking
            </span>
          </div>

          {/* Secondary Save Draft Option */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onSaveAsDraft}
              disabled={isPaying}
              className="font-sans text-xs font-semibold text-[#76766F] hover:text-[#18211E] underline underline-offset-4 transition-colors"
            >
              Save as draft &amp; pay later
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

