"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Copy,
  Check,
  CheckCircle,
  ShareNetwork,
  WhatsappLogo,
  InstagramLogo,
  ChatText,
  QrCode,
  ArrowSquareOut,
  Sparkle,
  DownloadSimple,
  Link as LinkIcon,
  EnvelopeSimple,
  DeviceMobile,
} from "@phosphor-icons/react";
import { siteConfig } from "@/config/site";

export interface ShareInvitationData {
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

interface ShareInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  invite: ShareInvitationData | null;
}

export function ShareInvitationModal({
  isOpen,
  onClose,
  invite,
}: ShareInvitationModalProps) {
  const [copiedType, setCopiedType] = useState<"link" | "message" | "story" | "sms" | "qr-image" | null>(null);
  const [activeTab, setActiveTab] = useState<"apps" | "qr" | "preview">("apps");
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [canShareFiles, setCanShareFiles] = useState(false);
  const [isDownloadingQr, setIsDownloadingQr] = useState(false);
  const [isSharingQr, setIsSharingQr] = useState(false);
  const [isCopyingQr, setIsCopyingQr] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      if (typeof navigator.share === "function") {
        setCanNativeShare(true);
      }
      if (typeof navigator.canShare === "function") {
        setCanShareFiles(true);
      }
    }
  }, []);

  // Reset scroll to top whenever active tab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  // Coordinate with Lenis smooth scroll and lock body scroll while modal is active
  useEffect(() => {
    if (!isOpen) return;

    // Pause Lenis so it does not intercept scroll events from this modal
    if (typeof window !== "undefined") {
      const lenisInstance = (window as any).__lenis || (window as any).lenis;
      lenisInstance?.stop();
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
      if (typeof window !== "undefined") {
        const lenisInstance = (window as any).__lenis || (window as any).lenis;
        lenisInstance?.start();
      }
    };
  }, [isOpen]);

  if (!isOpen || !invite) return null;

  // Resolve absolute URL
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : siteConfig.url;
  const inviteUrl = `${origin}/${invite.slug}`;
  const displayUrl = `${siteConfig.domain}/${invite.slug}`;

  // Format wedding date nicely
  const formattedDate = invite.weddingDate
    ? new Date(invite.weddingDate).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Celebration Date to be Announced";

  // Formatted message for WhatsApp & group messaging
  const fullWhatsAppMessage = `✨ *You Are Cordially Invited!* ✨

Together with our families, we joyfully invite you to celebrate the wedding of
💍 *${invite.brideName} & ${invite.groomName}* 💍

📅 *Date:* ${formattedDate}
${invite.venueName ? `📍 *Venue:* ${invite.venueName}\n` : ""}
💌 *View Interactive Invitation & RSVP:*
${inviteUrl}

We look forward to celebrating this special day with you! 🥂`;

  // Formatted message for SMS / iMessage (clean text without markdown symbols)
  const fullSmsMessage = `You are cordially invited to celebrate the wedding of ${invite.brideName} & ${invite.groomName}!

Date: ${formattedDate}${invite.venueName ? `\nVenue: ${invite.venueName}` : ""}

View interactive invitation & RSVP here:
${inviteUrl}`;

  // Short caption for Instagram Story / Bio
  const instagramStoryCaption = `We're getting married! 💍 View our wedding invitation & RSVP: ${inviteUrl} ✨ #WeddingCelebration`;

  // Handlers for copying text
  const handleCopy = async (text: string, type: "link" | "message" | "story" | "sms") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // WhatsApp share action
  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullWhatsAppMessage)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  // Instagram share action
  const handleInstagramShare = async () => {
    await handleCopy(inviteUrl, "link");
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  // Native share sheet (for link & text)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Wedding of ${invite.brideName} & ${invite.groomName}`,
          text: `You're cordially invited to celebrate the wedding of ${invite.brideName} & ${invite.groomName}!`,
          url: inviteUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Native share error:", err);
        }
      }
    }
  };

  // QR code image URL (high-res with margin and brand color)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encodeURIComponent(
    inviteUrl
  )}&color=073D31&bgcolor=FFFFFF&margin=12`;

  const getCleanQrFilename = () =>
    `${invite.brideName}-${invite.groomName}-wedding-qr.png`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

  // Share QR code directly via Web Share API (File support) or fallback
  const handleShareQr = async () => {
    setIsSharingQr(true);
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const filename = getCleanQrFilename();
      const file = new File([blob], filename, { type: "image/png" });

      // Check if native file sharing is supported on this device
      if (
        typeof navigator !== "undefined" &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: `Wedding Invitation QR — ${invite.brideName} & ${invite.groomName}`,
          text: `Scan this QR code to view our wedding invitation & RSVP: ${inviteUrl}`,
        });
        return;
      }

      // If native sharing is supported for URL & text only
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: `Wedding Invitation QR — ${invite.brideName} & ${invite.groomName}`,
          text: `Scan or click our wedding invitation QR code & RSVP: ${inviteUrl}`,
          url: inviteUrl,
        });
        return;
      }

      // Fallback: Copy QR image or download
      await handleCopyQrImage();
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.error("Failed to share QR code:", err);
        // Fallback: download
        handleDownloadQr();
      }
    } finally {
      setIsSharingQr(false);
    }
  };

  // Copy QR Code image directly to clipboard
  const handleCopyQrImage = async () => {
    setIsCopyingQr(true);
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();

      if (
        typeof ClipboardItem !== "undefined" &&
        navigator.clipboard &&
        navigator.clipboard.write
      ) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        setCopiedType("qr-image");
        setTimeout(() => setCopiedType(null), 2500);
        return;
      }

      // Fallback: copy link
      await handleCopy(inviteUrl, "link");
    } catch (err) {
      console.error("Failed to copy QR image, fallback to link copy:", err);
      await handleCopy(inviteUrl, "link");
    } finally {
      setIsCopyingQr(false);
    }
  };

  // Download QR code image
  const handleDownloadQr = async () => {
    try {
      setIsDownloadingQr(true);
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = getCleanQrFilename();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download QR code:", err);
      window.open(qrCodeUrl, "_blank");
    } finally {
      setIsDownloadingQr(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window: constrained height, flex-col so header & footer never cut off */}
        <motion.div
          data-lenis-prevent="true"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg max-h-[88dvh] sm:max-h-[85dvh] flex flex-col bg-[#FCFBF7] rounded-3xl border border-[#C8A45E]/30 shadow-2xl overflow-hidden z-10 text-stone-900"
        >
          {/* Top Decorative Gold Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#073D31] via-[#C8A45E] to-[#073D31] shrink-0" />

          {/* Header (Always Visible & Compact) */}
          <div className="p-4 sm:p-5 pb-3 border-b border-stone-200/80 bg-white/80 backdrop-blur-md shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/70 text-[9px] font-bold text-amber-900 uppercase tracking-wider">
                  <Sparkle size={11} weight="fill" className="text-[#C8A45E]" />
                  <span>Share Invitation</span>
                </div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-950 tracking-tight truncate mt-0.5">
                  {invite.brideName} &amp; {invite.groomName}
                </h2>
              </div>

              {/* Close Button - min 44x44px touch target */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close share dialog"
                className="w-11 h-11 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-3 gap-1 mt-3 p-1 rounded-2xl bg-stone-100/90 border border-stone-200/70">
              <button
                type="button"
                onClick={() => setActiveTab("apps")}
                className={`py-2 px-1 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 min-h-[38px] cursor-pointer ${
                  activeTab === "apps"
                    ? "bg-white text-stone-950 shadow-xs border border-stone-200/80"
                    : "text-stone-600 hover:text-stone-950 hover:bg-white/50"
                }`}
              >
                <ShareNetwork size={14} weight="bold" className="text-amber-600 shrink-0" />
                <span className="truncate">Share Apps</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("qr")}
                className={`py-2 px-1 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 min-h-[38px] cursor-pointer ${
                  activeTab === "qr"
                    ? "bg-white text-stone-950 shadow-xs border border-stone-200/80"
                    : "text-stone-600 hover:text-stone-950 hover:bg-white/50"
                }`}
              >
                <QrCode size={14} weight="bold" className="text-amber-600 shrink-0" />
                <span className="truncate">QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`py-2 px-1 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 min-h-[38px] cursor-pointer ${
                  activeTab === "preview"
                    ? "bg-white text-stone-950 shadow-xs border border-stone-200/80"
                    : "text-stone-600 hover:text-stone-950 hover:bg-white/50"
                }`}
              >
                <EnvelopeSimple size={14} weight="bold" className="text-amber-600 shrink-0" />
                <span className="truncate">Message</span>
              </button>
            </div>
          </div>

          {/* Modal Content Body - Scrollable Area with lenis prevent & touch scrolling */}
          <div
            ref={scrollContainerRef}
            data-lenis-prevent="true"
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 pb-10 space-y-3.5"
            style={{
              maxHeight: "calc(88dvh - 165px)",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-y",
              overscrollBehavior: "contain",
            }}
          >
            {/* TAB 1: SOCIAL APPS & CHANNELS */}
            {activeTab === "apps" && (
              <div className="space-y-3">
                {/* Compact Copy Link Bar */}
                <div className="p-3 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex items-center justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                      <LinkIcon size={12} weight="bold" className="text-amber-600" />
                      <span>Invitation Link</span>
                    </div>
                    <p className="font-mono text-xs text-stone-800 truncate mt-0.5 select-all">
                      {displayUrl}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(inviteUrl, "link")}
                    className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 min-h-[40px] ${
                      copiedType === "link"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-[#073D31] hover:bg-[#094d3f] text-white shadow-xs active:scale-95"
                    }`}
                  >
                    {copiedType === "link" ? (
                      <>
                        <CheckCircle size={15} weight="fill" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={15} weight="bold" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-1 pt-0.5">
                  Choose a platform to share:
                </p>

                {/* 1. WHATSAPP */}
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200/90 hover:border-emerald-300 transition-all shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#25D366] flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                      <WhatsappLogo size={24} weight="fill" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-stone-900">WhatsApp</h4>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full uppercase">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 leading-snug">
                        Send pre-written invite with date, venue &amp; RSVP link directly to chats or groups.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer min-h-[44px] shrink-0"
                  >
                    <WhatsappLogo size={16} weight="fill" />
                    <span>Share to WhatsApp</span>
                    <ArrowSquareOut size={13} weight="bold" />
                  </button>
                </div>

                {/* 2. INSTAGRAM */}
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200/90 hover:border-pink-300 transition-all shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <InstagramLogo size={22} weight="bold" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-stone-900">Instagram</h4>
                        <span className="text-[9px] bg-pink-50 text-pink-700 font-bold px-1.5 py-0.2 rounded-full uppercase border border-pink-100">
                          Story &amp; Bio
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 leading-snug">
                        Copy link to add a <strong>Link Sticker</strong> in your Story, send in DMs, or bio.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleInstagramShare}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer min-h-[44px] shrink-0"
                  >
                    <InstagramLogo size={15} weight="bold" />
                    <span>{copiedType === "link" ? "Link Copied! Opening..." : "Copy & Open Instagram"}</span>
                    <ArrowSquareOut size={13} weight="bold" />
                  </button>
                </div>

                {/* 3. SMS / iMESSAGE */}
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200/90 hover:border-blue-300 transition-all shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
                      <ChatText size={22} weight="fill" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-stone-900">SMS &amp; iMessage</h4>
                        <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.2 rounded-full uppercase border border-blue-100">
                          Direct Text
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 leading-snug">
                        Open your device Messages app with invitation and RSVP details ready.
                      </p>
                    </div>
                  </div>

                  <a
                    href={`sms:?&body=${encodeURIComponent(fullSmsMessage)}`}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer min-h-[44px] shrink-0"
                  >
                    <ChatText size={15} weight="bold" />
                    <span>Send SMS</span>
                    <ArrowSquareOut size={13} weight="bold" />
                  </a>
                </div>

                {/* 4. MORE APPS / NATIVE SHARE */}
                {canNativeShare && (
                  <div className="p-3.5 rounded-2xl bg-white border border-stone-200/90 hover:border-amber-300 transition-all shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-105 transition-transform">
                        <ShareNetwork size={22} weight="fill" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-stone-900">More Apps</h4>
                        <p className="text-xs text-stone-500 mt-0.5 leading-snug">
                          Share via Telegram, Facebook Messenger, AirDrop, Signal, or Email.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer min-h-[44px] shrink-0"
                    >
                      <ShareNetwork size={15} weight="bold" />
                      <span>Share via Device...</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: QR CODE WITH COMPLETE SHARE & DOWNLOAD OPTIONS */}
            {activeTab === "qr" && (
              <div className="w-full p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex flex-col items-center justify-center text-center space-y-3.5 mx-auto">
                <div className="space-y-0.5 text-center mx-auto">
                  <h4 className="font-serif text-sm sm:text-base font-bold text-stone-950 text-center">
                    Scan, Share, or Print Invitation QR Code
                  </h4>
                  <p className="text-xs text-stone-500 max-w-xs sm:max-w-sm leading-relaxed text-center mx-auto">
                    Share directly with guests, or print on welcome standees, gift hampers &amp; stationery.
                  </p>
                </div>

                {/* QR Code Container - Perfectly Centered */}
                <div className="flex flex-col items-center justify-center text-center mx-auto p-3 bg-white rounded-2xl border-2 border-[#C8A45E]/40 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeUrl}
                    alt={`${invite.brideName} & ${invite.groomName} Wedding Invitation QR Code`}
                    width={160}
                    height={160}
                    className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-lg block mx-auto"
                  />
                  <div className="text-[10px] font-mono text-stone-400 mt-1 truncate max-w-[180px] text-center mx-auto">
                    {displayUrl}
                  </div>
                </div>

                {/* Primary QR Sharing & Action Controls - Centered */}
                <div className="w-full space-y-2 pt-1 max-w-sm mx-auto flex flex-col items-center">
                  {/* Row 1: Direct Share QR Code (Native Web Share with File / Image) */}
                  <button
                    type="button"
                    onClick={handleShareQr}
                    disabled={isSharingQr}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#073D31] hover:bg-[#094d3f] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer min-h-[44px] active:scale-98 disabled:opacity-50"
                  >
                    <ShareNetwork size={16} weight="bold" className="text-[#C8A45E]" />
                    <span>{isSharingQr ? "Preparing QR..." : "Share QR Code to Apps"}</span>
                  </button>

                  {/* Row 2: Secondary Actions (Download + Copy QR Image) */}
                  <div className="w-full grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadQr}
                      disabled={isDownloadingQr}
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200/80 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[44px] disabled:opacity-50"
                    >
                      <DownloadSimple size={15} weight="bold" className="text-amber-700" />
                      <span>{isDownloadingQr ? "Saving..." : "Download QR"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyQrImage}
                      disabled={isCopyingQr}
                      className={`w-full py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[44px] ${
                        copiedType === "qr-image"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200"
                      }`}
                    >
                      {copiedType === "qr-image" ? (
                        <>
                          <CheckCircle size={15} weight="fill" />
                          <span>QR Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={15} weight="bold" className="text-stone-600" />
                          <span>{isCopyingQr ? "Copying..." : "Copy Image"}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Row 3: Quick Preview Live Invitation */}
                  <a
                    href={inviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-transparent hover:bg-stone-100 text-stone-600 hover:text-stone-900 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[38px] text-center"
                  >
                    <ArrowSquareOut size={14} weight="bold" />
                    <span>Preview Live Page</span>
                  </a>
                </div>
              </div>
            )}

            {/* TAB 3: MESSAGE TEXT PREVIEW */}
            {activeTab === "preview" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Pre-Written Invitation Text:
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(fullWhatsAppMessage, "message")}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer min-h-[32px] px-2 py-1 rounded-lg hover:bg-amber-50"
                  >
                    {copiedType === "message" ? (
                      <>
                        <Check size={14} weight="bold" className="text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} weight="bold" />
                        <span>Copy All Text</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-stone-200/90 font-mono text-xs text-stone-800 whitespace-pre-line leading-relaxed shadow-2xs select-all max-h-56 overflow-y-auto">
                  {fullWhatsAppMessage}
                </div>

                {/* Instagram Story Caption Option */}
                <div className="p-3 rounded-2xl bg-pink-50/60 border border-pink-200/60 flex items-center justify-between gap-2.5">
                  <div className="text-xs text-pink-950 min-w-0 flex-1">
                    <span className="font-bold block">Story Caption:</span>
                    <span className="text-[11px] text-pink-800 truncate block">{instagramStoryCaption}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(instagramStoryCaption, "story")}
                    className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shrink-0 cursor-pointer transition min-h-[36px]"
                  >
                    {copiedType === "story" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer (Always Visible & Anchored) */}
          <div className="p-3 sm:p-4 border-t border-stone-200/80 bg-stone-50/90 flex items-center justify-between text-xs text-stone-500 shrink-0">
            <span className="font-mono text-[11px] truncate max-w-[180px] sm:max-w-[240px]">
              /{invite.slug}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-200/80 hover:bg-stone-300 text-stone-800 font-bold transition cursor-pointer min-h-[40px]"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
