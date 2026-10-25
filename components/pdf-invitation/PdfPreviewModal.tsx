"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  DownloadSimple,
  Sparkle,
  Pencil,
  Check,
  Eye,
  FilePdf,
  ShareNetwork,
  ArrowsInSimple,
} from "@phosphor-icons/react";
import { BaratCardRenderer, PdfCardInvitationData } from "./BaratCardRenderer";
import { ReceptionCardRenderer } from "./ReceptionCardRenderer";
import { downloadElementAsPdf } from "@/lib/pdf-generator";
import { getPdfThemeTokens } from "@/lib/pdf-theme-tokens";

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  initialData: PdfCardInvitationData;
}

export function PdfPreviewModal({
  isOpen,
  onClose,
  templateId,
  initialData,
}: PdfPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"barat" | "reception">("barat");
  const [data, setData] = useState<PdfCardInvitationData>(initialData);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Mobile optimization & Full Size focus mode
  const [isFullSize, setIsFullSize] = useState(false);
  const [isMobilePersonalizeOpen, setIsMobilePersonalizeOpen] = useState(false);

  const baratRef = useRef<HTMLDivElement | null>(null);
  const receptionRef = useRef<HTMLDivElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  // Dynamic Auto-Fit Scale: calculate exact scale so the 592px × 840px card fits cleanly
  const [fitScale, setFitScale] = useState<number>(0.46);

  const computeFitScale = React.useCallback(() => {
    if (!previewContainerRef.current) return;
    const { clientWidth, clientHeight } = previewContainerRef.current;
    if (!clientWidth || !clientHeight) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const paddingX = isMobile ? 12 : 24;
    const paddingY = isMobile ? 12 : 20;

    const availW = Math.max(clientWidth - paddingX, 160);
    const availH = Math.max(clientHeight - paddingY, 200);

    const scaleW = availW / 592;
    const scaleH = availH / 840;

    // Strict min ensures card fits completely in view
    const autoScale = Math.min(scaleW, scaleH);
    const clamped = Math.min(Math.max(autoScale, 0.28), 0.85);
    setFitScale(Number(clamped.toFixed(3)));
  }, []);

  // Compute Full Size scale: on mobile fill ~92% of screen width so text is large and clear; on desktop 0.88
  const fullSizeScale = React.useMemo(() => {
    if (typeof window === "undefined") return 0.85;
    if (window.innerWidth < 640) {
      const scaleByWidth = (window.innerWidth - 24) / 592;
      return Number(Math.min(Math.max(scaleByWidth, 0.58), 0.72).toFixed(3));
    }
    return 0.88;
  }, []);

  const activeScale = isFullSize ? fullSizeScale : fitScale;

  React.useEffect(() => {
    if (!isOpen) return;

    computeFitScale();
    const rafId = requestAnimationFrame(() => computeFitScale());
    const timer = setTimeout(computeFitScale, 80);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && previewContainerRef.current) {
      resizeObserver = new ResizeObserver(() => computeFitScale());
      resizeObserver.observe(previewContainerRef.current);
    }

    window.addEventListener("resize", computeFitScale);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", computeFitScale);
    };
  }, [isOpen, activeTab, isEditingDetails, isMobilePersonalizeOpen, isFullSize, computeFitScale]);

  // Sync initialData if updated externally
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const tokens = getPdfThemeTokens(templateId, data.religion);

  const handleWhatsAppShare = () => {
    const guestGreeting = data.recipientName
      ? `Respected ${data.recipientName}`
      : "Dear Family & Friends";
    const cityLine = data.recipientCity ? ` (${data.recipientCity})` : "";
    const text = encodeURIComponent(
      `Assalamu Alaikum / Greetings ${guestGreeting}${cityLine},\n\nWe cordially invite you to celebrate the wedding of *${data.groomName} & ${data.brideName}*.\n\n📅 Date: ${data.weddingDate}\n🏛️ Venue: ${data.venueName || "GOMTI LAWN"}\n\nPlease find the attached formal invitation card. We look forward to your gracious presence & blessings!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleSelectReligion = (rel: "muslim" | "hindu" | "universal") => {
    if (rel === "muslim") {
      setData({
        ...data,
        religion: "muslim",
        sacredInvocation: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        sacredTranslation: "In the name of ALLAH the most gracious and most merciful",
      });
    } else if (rel === "hindu") {
      setData({
        ...data,
        religion: "hindu",
        sacredInvocation: "॥ श्री गणेशाय नमः ॥",
        sacredTranslation: "May Lord Ganesha Bless This Auspicious Union",
      });
    } else {
      setData({
        ...data,
        religion: "universal",
        sacredInvocation: "✦ Two Hearts · One Journey ✦",
        sacredTranslation: "Invite you to witness the beginning of forever",
      });
    }
  };

  if (!isOpen) return null;

  const handleDownloadActive = async () => {
    setIsDownloading(true);
    setDownloadSuccess(null);

    try {
      const isBarat = activeTab === "barat";
      const targetElement = isBarat ? baratRef.current : receptionRef.current;

      if (!targetElement) {
        throw new Error("Card element not found for export");
      }

      const coupleSlug = `${data.groomName}-${data.brideName}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

      const fileName = isBarat
        ? `${coupleSlug}-barat-invitation.pdf`
        : `${coupleSlug}-reception-invitation.pdf`;

      // Temporarily reset preview transform to ensure 300 DPI native 592x840 capture
      const prevTransform = targetElement.style.transform;
      targetElement.style.transform = "none";

      try {
        await downloadElementAsPdf(targetElement, {
          fileName,
          scale: 2.5,
          quality: 0.96,
        });
      } finally {
        targetElement.style.transform = prevTransform;
      }

      setDownloadSuccess(
        isBarat ? "Barat PDF downloaded!" : "Reception PDF downloaded!"
      );
      setTimeout(() => setDownloadSuccess(null), 3500);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Unable to generate PDF right now. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadBoth = async () => {
    setIsDownloading(true);
    setDownloadSuccess(null);

    try {
      const coupleSlug = `${data.groomName}-${data.brideName}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

      if (baratRef.current) {
        const prevTransform = baratRef.current.style.transform;
        baratRef.current.style.transform = "none";
        try {
          await downloadElementAsPdf(baratRef.current, {
            fileName: `${coupleSlug}-barat-invitation.pdf`,
            scale: 2.5,
          });
        } finally {
          baratRef.current.style.transform = prevTransform;
        }
      }

      // Small pause between downloads for smooth browser file handling
      await new Promise((r) => setTimeout(r, 600));

      if (receptionRef.current) {
        const prevTransform = receptionRef.current.style.transform;
        receptionRef.current.style.transform = "none";
        try {
          await downloadElementAsPdf(receptionRef.current, {
            fileName: `${coupleSlug}-reception-invitation.pdf`,
            scale: 2.5,
          });
        } finally {
          receptionRef.current.style.transform = prevTransform;
        }
      }

      setDownloadSuccess("Both Barat & Reception PDFs downloaded!");
      setTimeout(() => setDownloadSuccess(null), 3500);
    } catch (err) {
      console.error("Batch download error:", err);
      alert("Unable to download both PDFs. Please try downloading one by one.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-hidden">
        {/* Backdrop click to close */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`relative z-10 w-full max-w-4xl bg-[#121614] border border-[#C8A45E]/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-[#F7F4ED] ${
            isFullSize ? "h-[98vh] sm:h-[92vh]" : "max-h-[94vh] sm:max-h-[90vh]"
          }`}
        >
          {/* ── Standard Mode Header (Hidden in Full Size) ── */}
          {!isFullSize && (
            <div className="flex-shrink-0 flex items-center justify-between px-3.5 sm:px-8 py-2.5 sm:py-4 border-b border-white/10 bg-[#0A0E0C]">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#C8A45E] animate-pulse flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-sm sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
                    <span>Wedding Stationery</span>
                    <span className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider bg-[#C8A45E]/20 text-[#E1C98E] px-1.5 sm:px-2 py-0.5 rounded-full border border-[#C8A45E]/40">
                      Print Ready A5
                    </span>
                  </h3>
                  <p className="text-[10px] sm:text-xs text-stone-400 font-sans hidden sm:block">
                    Two matching designs included free with your {data.groomName} &amp; {data.brideName} invitation.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer min-h-[36px] min-w-[36px]"
                aria-label="Close PDF Preview Modal"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
          )}

          {/* ── Mobile Compact Bar (Visible ONLY on Mobile < 640px in Standard View) ── */}
          {!isFullSize && (
            <div className="flex-shrink-0 block sm:hidden px-3 py-2 bg-gradient-to-r from-[#171C19] via-[#121614] to-[#171C19] border-b border-white/10">
              <div className="flex items-center justify-between gap-2">
                {/* Compact Segmented Switcher */}
                <div className="flex items-center p-0.5 bg-white/5 rounded-full border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("barat")}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold font-sans transition-all ${
                      activeTab === "barat"
                        ? "bg-[#C8A45E] text-[#032A23] shadow-sm"
                        : "text-stone-300 hover:text-white"
                    }`}
                  >
                    1. Barat
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("reception")}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold font-sans transition-all ${
                      activeTab === "reception"
                        ? "bg-[#C8A45E] text-[#032A23] shadow-sm"
                        : "text-stone-300 hover:text-white"
                    }`}
                  >
                    2. Reception
                  </button>
                </div>

                {/* Mobile Expand Toggle for Personalization & Faith */}
                <button
                  type="button"
                  onClick={() => setIsMobilePersonalizeOpen(!isMobilePersonalizeOpen)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sans font-semibold border transition-all cursor-pointer ${
                    isMobilePersonalizeOpen
                      ? "bg-[#C8A45E] text-[#032A23] border-[#C8A45E]"
                      : "bg-[#C8A45E]/10 text-[#E1C98E] border-[#C8A45E]/30"
                  }`}
                >
                  <Sparkle size={13} weight="fill" />
                  <span>{isMobilePersonalizeOpen ? "Hide Options" : "Personalize"}</span>
                </button>
              </div>

              {/* Expandable Mobile Personalization & Faith Drawer */}
              <AnimatePresence>
                {isMobilePersonalizeOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2.5 pb-1 space-y-2 border-t border-white/5 mt-2"
                  >
                    {/* Guest Name & WhatsApp */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={data.recipientName || ""}
                        placeholder="Guest Name (e.g. Janab Shah)"
                        onChange={(e) => setData({ ...data, recipientName: e.target.value })}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-black/60 border border-[#C8A45E]/40 text-white placeholder-stone-500 text-xs outline-none"
                      />
                      <input
                        type="text"
                        value={data.recipientCity || ""}
                        placeholder="City"
                        onChange={(e) => setData({ ...data, recipientCity: e.target.value })}
                        className="w-20 px-2 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white placeholder-stone-500 text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleWhatsAppShare}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-medium flex items-center gap-1 cursor-pointer flex-shrink-0"
                      >
                        <ShareNetwork size={13} weight="bold" />
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Tradition Selector on Mobile */}
                    <div className="flex items-center justify-between gap-1 text-[10px]">
                      <span className="text-stone-400 font-bold uppercase text-[9px]">Tradition:</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleSelectReligion("muslim")}
                          className={`px-2 py-0.5 rounded-full font-bold ${
                            (data.religion || tokens.tradition) === "muslim"
                              ? "bg-[#C8A45E] text-[#032A23]"
                              : "text-stone-400 bg-white/5"
                          }`}
                        >
                          ☪️ Muslim
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectReligion("hindu")}
                          className={`px-2 py-0.5 rounded-full font-bold ${
                            (data.religion || tokens.tradition) === "hindu"
                              ? "bg-[#C8A45E] text-[#032A23]"
                              : "text-stone-400 bg-white/5"
                          }`}
                        >
                          🕉️ Hindu
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectReligion("universal")}
                          className={`px-2 py-0.5 rounded-full font-bold ${
                            (data.religion || tokens.tradition) === "universal"
                              ? "bg-[#C8A45E] text-[#032A23]"
                              : "text-stone-400 bg-white/5"
                          }`}
                        >
                          💫 Universal
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── Desktop Guest Personalization & On-Demand Share Bar (Hidden in Full Size & Hidden on Mobile) ── */}
          {!isFullSize && (
            <div className="flex-shrink-0 hidden sm:flex px-6 sm:px-8 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#171C19] via-[#121614] to-[#171C19] border-b border-[#C8A45E]/30 flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#C8A45E]/20 text-[#E1C98E] flex items-center justify-center flex-shrink-0 border border-[#C8A45E]/40">
                  <Sparkle size={14} weight="fill" />
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-white text-xs flex items-center gap-2">
                    <span>Add Guest Name to Share</span>
                    <span className="text-[10px] bg-[#C8A45E]/15 text-[#E1C98E] px-1.5 py-0.2 rounded border border-[#C8A45E]/30 font-medium">
                      Live Sync
                    </span>
                  </span>
                  <span className="text-[11px] text-stone-400 hidden sm:inline">
                    Type any guest name to personalize &amp; share anytime, or clear to leave blank for handwriting.
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <div className="relative flex-1 sm:w-48 md:w-52">
                  <input
                    type="text"
                    value={data.recipientName || ""}
                    placeholder="Guest Name (e.g. Janab Shah Husian)"
                    onChange={(e) => setData({ ...data, recipientName: e.target.value })}
                    className="w-full pl-3 pr-7 py-1.5 rounded-lg bg-black/60 border border-[#C8A45E]/50 text-white placeholder-stone-500 text-xs focus:border-[#C8A45E] focus:ring-1 focus:ring-[#C8A45E] outline-none"
                  />
                  {data.recipientName && (
                    <button
                      type="button"
                      onClick={() => setData({ ...data, recipientName: "" })}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs p-0.5 cursor-pointer"
                      title="Clear name for handwritten/blank printing"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="relative w-28 sm:w-32">
                  <input
                    type="text"
                    value={data.recipientCity || ""}
                    placeholder="City (e.g. Lucknow)"
                    onChange={(e) => setData({ ...data, recipientCity: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white placeholder-stone-500 text-xs focus:border-[#C8A45E] outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs transition-all cursor-pointer shadow-sm flex-shrink-0"
                  title="Share customized invitation message on WhatsApp"
                >
                  <ShareNetwork size={14} weight="bold" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          )}

          {/* ── Desktop Top Tabs & Action Controls (Hidden in Full Size & Hidden on Mobile) ── */}
          {!isFullSize && (
            <div className="flex-shrink-0 hidden sm:flex flex-wrap md:flex-nowrap items-center justify-between gap-2.5 sm:gap-3 px-6 sm:px-8 py-2.5 sm:py-3 bg-black/40 border-b border-white/10">
              {/* Left: Card Tab Switcher */}
              <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-white/5 rounded-full border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab("barat")}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
                    activeTab === "barat"
                      ? "bg-[#C8A45E] text-[#032A23] shadow-md"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  <span>1. {tokens.baratEventTitle}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("reception")}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
                    activeTab === "reception"
                      ? "bg-[#C8A45E] text-[#032A23] shadow-md"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  <span>2. {tokens.receptionEventTitle}</span>
                </button>
              </div>

              {/* Center: Tradition / Faith Selector */}
              <div className="flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectReligion("muslim")}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-sans transition-all cursor-pointer ${
                    (data.religion || tokens.tradition) === "muslim"
                      ? "bg-[#C8A45E] text-[#032A23] shadow-sm"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  ☪️ Muslim
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectReligion("hindu")}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-sans transition-all cursor-pointer ${
                    (data.religion || tokens.tradition) === "hindu"
                      ? "bg-[#C8A45E] text-[#032A23] shadow-sm"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  🕉️ Hindu
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectReligion("universal")}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-sans transition-all cursor-pointer ${
                    (data.religion || tokens.tradition) === "universal"
                      ? "bg-[#C8A45E] text-[#032A23] shadow-sm"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  💫 Universal
                </button>
              </div>

              {/* Right: Edit Host & Full Details Toggle */}
              <button
                type="button"
                onClick={() => setIsEditingDetails(!isEditingDetails)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold text-[#E1C98E] bg-[#C8A45E]/10 hover:bg-[#C8A45E]/20 border border-[#C8A45E]/30 transition-all cursor-pointer w-fit"
              >
                <Pencil size={13} weight="bold" />
                <span>{isEditingDetails ? "Hide Ceremony Details" : "Edit Details"}</span>
              </button>
            </div>
          )}

          {/* ── Optional Full Ceremony Details Form (Desktop) ── */}
          <AnimatePresence>
            {!isFullSize && isEditingDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 bg-stone-900/95 border-b border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs max-h-48 overflow-y-auto"
              >
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                    Host Family Names
                  </label>
                  <input
                    type="text"
                    value={data.hostNames || ""}
                    placeholder="e.g. Mrs. & Mr. Hashmat Khan"
                    onChange={(e) => setData({ ...data, hostNames: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white focus:border-[#C8A45E] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                    Bride Parentage
                  </label>
                  <input
                    type="text"
                    value={data.parentageDetails || ""}
                    placeholder="e.g. D/o Mohd. Nizamuddin"
                    onChange={(e) => setData({ ...data, parentageDetails: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white focus:border-[#C8A45E] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={data.venueName || ""}
                    placeholder="e.g. GOMTI LAWN"
                    onChange={(e) => setData({ ...data, venueName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white focus:border-[#C8A45E] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                    Venue Address
                  </label>
                  <input
                    type="text"
                    value={data.venueAddress || ""}
                    placeholder="e.g. Opp. Shia P.G. College, Sitapur Road, Lucknow"
                    onChange={(e) => setData({ ...data, venueAddress: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white focus:border-[#C8A45E] outline-none text-xs"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Main Canvas Preview Display (Adaptive Auto-Fit / Full Size View) ── */}
          <div
            ref={previewContainerRef}
            className={`relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col items-center bg-[#070B09] overscroll-contain [scrollbar-width:thin] [scrollbar-color:#C8A45E40_transparent] ${
              isFullSize ? "p-2 sm:p-4 pt-16 pb-20 justify-start" : "p-2 sm:p-4 justify-center"
            }`}
          >
            {/* Visual background ambient glow */}
            <div className="absolute w-[400px] h-[400px] rounded-full bg-[#C8A45E]/5 blur-3xl pointer-events-none" />

            {/* ── Floating Controls in Full Size Mode (ONLY PDF is visible!) ── */}
            {isFullSize && (
              <div className="sticky top-1 z-30 w-full max-w-md mx-auto mb-3 flex items-center justify-between p-2 rounded-2xl bg-black/85 backdrop-blur-md border border-[#C8A45E]/30 shadow-2xl">
                <button
                  type="button"
                  onClick={() => setIsFullSize(false)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#E1C98E] text-xs font-bold font-sans transition-all cursor-pointer"
                >
                  <ArrowsInSimple size={14} weight="bold" />
                  <span>Exit Full Size</span>
                </button>

                {/* Quick Switcher */}
                <div className="flex items-center gap-1 p-0.5 bg-white/10 rounded-xl text-xs font-sans">
                  <button
                    type="button"
                    onClick={() => setActiveTab("barat")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      activeTab === "barat"
                        ? "bg-[#C8A45E] text-[#032A23] shadow-sm"
                        : "text-stone-300 hover:text-white"
                    }`}
                  >
                    Barat
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("reception")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      activeTab === "reception"
                        ? "bg-[#C8A45E] text-[#032A23] shadow-sm"
                        : "text-stone-300 hover:text-white"
                    }`}
                  >
                    Reception
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close"
                >
                  <X size={15} weight="bold" />
                </button>
              </div>
            )}

            {/* ── View Controls in Standard View: Fit View / Full Size Toggle ── */}
            {!isFullSize && (
              <div className="absolute top-2.5 right-3 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/15 rounded-full p-1 text-[11px] font-sans">
                <button
                  type="button"
                  onClick={() => {
                    setIsFullSize(false);
                    computeFitScale();
                  }}
                  className="px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer bg-[#C8A45E] text-[#032A23] shadow-sm"
                  title="Fit entire card into view"
                >
                  Fit View
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullSize(true)}
                  className="px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer text-stone-400 hover:text-white"
                  title="View full-size card (only PDF visible)"
                >
                  Full Size
                </button>
              </div>
            )}

            {/* TAB 1: Barat Card Renderer */}
            <div
              className={`transition-all duration-300 my-auto flex-shrink-0 relative shadow-2xl rounded-sm ${
                activeTab === "barat" ? "block" : "hidden"
              }`}
              style={{
                width: `${Math.round(592 * activeScale)}px`,
                height: `${Math.round(840 * activeScale)}px`,
              }}
            >
              <div
                ref={baratRef}
                className="absolute top-0 left-0"
                style={{
                  width: "592px",
                  height: "840px",
                  transform: `scale(${activeScale})`,
                  transformOrigin: "top left",
                }}
              >
                <BaratCardRenderer
                  templateId={templateId}
                  data={data}
                  scale={1}
                  editable={true}
                  onUpdateRecipient={(name, city) =>
                    setData({ ...data, recipientName: name, recipientCity: city })
                  }
                />
              </div>
            </div>

            {/* TAB 2: Reception Card Renderer */}
            <div
              className={`transition-all duration-300 my-auto flex-shrink-0 relative shadow-2xl rounded-sm ${
                activeTab === "reception" ? "block" : "hidden"
              }`}
              style={{
                width: `${Math.round(592 * activeScale)}px`,
                height: `${Math.round(840 * activeScale)}px`,
              }}
            >
              <div
                ref={receptionRef}
                className="absolute top-0 left-0"
                style={{
                  width: "592px",
                  height: "840px",
                  transform: `scale(${activeScale})`,
                  transformOrigin: "top left",
                }}
              >
                <ReceptionCardRenderer templateId={templateId} data={data} scale={1} />
              </div>
            </div>

            {/* ── Floating Download Action Bar in Full Size Mode ── */}
            {isFullSize && (
              <div className="sticky bottom-1 z-30 w-full max-w-md mx-auto mt-3 flex items-center justify-center gap-2 p-2 rounded-2xl bg-black/85 backdrop-blur-md border border-[#C8A45E]/30 shadow-2xl">
                <button
                  type="button"
                  onClick={handleDownloadActive}
                  disabled={isDownloading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#C8A45E] hover:bg-[#E1C98E] text-[#032A23] font-bold text-xs uppercase tracking-wider font-sans transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 min-h-[44px]"
                >
                  <DownloadSimple size={15} weight="bold" />
                  <span>
                    {isDownloading
                      ? "Generating..."
                      : `Download ${activeTab === "barat" ? "Barat" : "Reception"} PDF`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadBoth}
                  disabled={isDownloading}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider font-sans transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 border border-white/15 min-h-[44px]"
                >
                  <FilePdf size={15} weight="bold" />
                  <span>Both</span>
                </button>
              </div>
            )}
          </div>

          {/* ── Standard Modal Footer Controls (Hidden in Full Size Mode) ── */}
          {!isFullSize && (
            <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 px-3.5 sm:px-8 py-2.5 sm:py-4 bg-[#0A0E0C] border-t border-white/10 z-20 shadow-2xl">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <span className="text-[11px] sm:text-xs text-stone-400 font-sans truncate">
                  {activeTab === "barat"
                    ? `Active: ${tokens.baratEventTitle}`
                    : `Active: ${tokens.receptionEventTitle}`}
                </span>
                {downloadSuccess && (
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fade-in flex-shrink-0">
                    <Check size={13} weight="bold" />
                    <span>{downloadSuccess}</span>
                  </span>
                )}
              </div>

              {/* Download Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleDownloadActive}
                  disabled={isDownloading}
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-full bg-[#C8A45E] hover:bg-[#E1C98E] text-[#032A23] font-bold text-xs uppercase tracking-wider font-sans transition-all shadow-md hover:scale-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[44px]"
                >
                  <DownloadSimple size={16} weight="bold" />
                  <span>
                    {isDownloading
                      ? "Generating 300 DPI PDF..."
                      : `Download ${activeTab === "barat" ? "Barat" : "Reception"} PDF`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadBoth}
                  disabled={isDownloading}
                  className="px-3.5 sm:px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider font-sans transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-white/15 min-h-[44px]"
                >
                  <FilePdf size={16} weight="bold" />
                  <span>Both</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
