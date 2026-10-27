"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  X,
  DownloadSimple,
  Sparkle,
  Pencil,
  Check,
  FilePdf,
  ShareNetwork,
  ArrowsInSimple,
  Gift,
  ArrowRight,
} from "@phosphor-icons/react";
import { BaratCardRenderer, PdfCardInvitationData } from "./BaratCardRenderer";
import { ReceptionCardRenderer } from "./ReceptionCardRenderer";
import { downloadElementAsPdf } from "@/lib/pdf-generator";
import { getPdfThemeTokens, CulturalTradition } from "@/lib/pdf-theme-tokens";

const READONLY_SAMPLE_TRADITIONS: Record<CulturalTradition, Partial<PdfCardInvitationData>> = {
  muslim: {
    religion: "muslim",
    brideName: "Heena",
    groomName: "Arshad",
    eventTitle: "Dawat-e-Walima",
    weddingDate: "2026-10-12",
    weddingTime: "7:30 p.m.",
    venueName: "Gomti Lawn",
    venueAddress: "Sitapur Road, Lucknow",
    hostNames: "Mrs. & Mr. Hashmat Khan",
    hostRelation: "of their Son",
    parentageDetails: "D/o Mohd. Nizamuddin",
    rsvpContact: "Khan Family & Relatives",
    complimentsText: "With Best Compliments from All Friends",
    recipientName: "Respected Guests & Family",
    recipientCity: "Lucknow",
    sacredInvocation: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    sacredTranslation: "In the name of ALLAH the most gracious and most merciful",
  },
  hindu: {
    religion: "hindu",
    brideName: "Ananya",
    groomName: "Aarav",
    eventTitle: "Shubh Vivah",
    weddingDate: "2026-11-28",
    weddingTime: "7:00 p.m.",
    venueName: "The Grand Palace",
    venueAddress: "Heritage Road, Civil Lines, Jaipur",
    hostNames: "Mrs. & Mr. Rajesh Sharma",
    hostRelation: "of their Son",
    parentageDetails: "D/o Shri Alok Verma",
    rsvpContact: "Sharma Family & Relatives",
    complimentsText: "With Warm Compliments from All Friends & Family",
    recipientName: "Respected Guests & Family",
    recipientCity: "Jaipur",
    sacredInvocation: "॥ श्री गणेशाय नमः ॥",
    sacredTranslation: "May Lord Ganesha Bless This Auspicious Union",
  },
  universal: {
    religion: "universal",
    brideName: "Meera",
    groomName: "Kabir",
    eventTitle: "Wedding Celebration",
    weddingDate: "2026-12-18",
    weddingTime: "6:30 p.m.",
    venueName: "The Oberoi Grand Ballroom",
    venueAddress: "Marine Drive, Nariman Point, Mumbai",
    hostNames: "Mrs. & Mr. Vikram Malhotra",
    hostRelation: "of their Son",
    parentageDetails: "D/o Mr. Arvind Kapoor",
    rsvpContact: "Malhotra & Kapoor Families",
    complimentsText: "Warmly Invited by All Friends & Loved Ones",
    recipientName: "Respected Guests & Family",
    recipientCity: "Mumbai",
    sacredInvocation: "✦ Two Hearts · One Journey ✦",
    sacredTranslation: "Invite you to witness the beginning of forever",
  },
};

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  initialData: PdfCardInvitationData;
  isReadOnly?: boolean;
}

export function PdfPreviewModal({
  isOpen,
  onClose,
  templateId,
  initialData,
  isReadOnly = false,
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
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Lock background scroll when modal is open to ensure pure native app feel
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [isOpen]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);


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
    if (isReadOnly) {
      setData((prev) => ({
        ...prev,
        ...READONLY_SAMPLE_TRADITIONS[rel],
      }));
      return;
    }

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

        {/* ── Native Mobile App Sheet / Desktop Window ── */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`relative z-10 w-full max-w-4xl bg-[#121614] border border-[#C8A45E]/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-[#F7F4ED] ${isFullSize ? "h-[98vh] sm:h-[92vh]" : "max-h-[94vh] sm:max-h-[90vh]"
            }`}
        >
          {/* ── Standard Mode Header (Hidden in Full Size) ── */}
          {/* ── Standard Mode Header (Hidden in Full Size) ── */}
          {!isFullSize && (
            <div className="flex-shrink-0 flex items-center justify-between px-3.5 sm:px-8 py-2.5 sm:py-3.5 border-b border-white/10 bg-[#0A0E0C]">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#C8A45E] animate-pulse flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-sm sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
                    <span>{isReadOnly ? "Complimentary Wedding Stationery" : "Wedding Stationery"}</span>
                    <span className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider bg-[#C8A45E]/20 text-[#E1C98E] px-1.5 sm:px-2 py-0.5 rounded-full border border-[#C8A45E]/40">
                      {isReadOnly ? "Free With Website" : "Print Ready A5"}
                    </span>
                  </h3>
                  <p className="text-[10px] sm:text-xs text-stone-400 font-sans hidden sm:block">
                    {isReadOnly
                      ? "Two matching 300 DPI print designs included free with your wedding invitation website."
                      : `Two matching designs included free with your ${data.groomName} & ${data.brideName} invitation.`}
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

          {/* ── Mobile Compact Bar for Read-Only Showcase Mode (< 640px) ── */}
          {!isFullSize && isReadOnly && (
            <div className="flex-shrink-0 block sm:hidden px-3 py-2 bg-gradient-to-r from-[#171C19] via-[#121614] to-[#171C19] border-b border-white/10 space-y-2">
              <div className="flex items-center justify-between gap-2">
                {/* Compact Segmented Switcher */}
                <div className="flex items-center p-0.5 bg-white/5 rounded-full border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("barat")}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold font-sans transition-all cursor-pointer ${
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
                    className={`px-3 py-1 rounded-full text-[11px] font-bold font-sans transition-all cursor-pointer ${
                      activeTab === "reception"
                        ? "bg-[#C8A45E] text-[#032A23] shadow-sm"
                        : "text-stone-300 hover:text-white"
                    }`}
                  >
                    2. Reception
                  </button>
                </div>

                {/* Free Included Badge */}
                <span className="text-[10px] font-bold text-[#E1C98E] bg-[#C8A45E]/15 border border-[#C8A45E]/30 px-2 py-0.5 rounded-full font-sans">
                  Included Free
                </span>
              </div>

              {/* Tradition Pills on Mobile */}
              <div className="flex items-center justify-center gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => handleSelectReligion("muslim")}
                  className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold font-sans transition-all cursor-pointer ${
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
                  className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold font-sans transition-all cursor-pointer ${
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
                  className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold font-sans transition-all cursor-pointer ${
                    (data.religion || tokens.tradition) === "universal"
                      ? "bg-[#C8A45E] text-[#032A23]"
                      : "text-stone-400 bg-white/5"
                  }`}
                >
                  💫 Universal
                </button>
              </div>
            </div>
          )}

          {/* ── Mobile Compact Bar for Editable Mode (< 640px) ── */}
          {!isFullSize && !isReadOnly && (
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

          {/* ── Desktop Guest Personalization Bar (Editable Mode Only) ── */}
          {!isFullSize && !isReadOnly && (
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

          {/* ── Desktop Top Controls for Read-Only Showcase Mode (Hidden in Full Size & Hidden on Mobile) ── */}
          {!isFullSize && isReadOnly && (
            <div className="flex-shrink-0 hidden sm:flex items-center justify-between gap-3 px-6 sm:px-8 py-2.5 sm:py-3 bg-black/40 border-b border-white/10">
              {/* Left: Card Tab Switcher */}
              <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-white/5 rounded-full border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab("barat")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
                    activeTab === "reception"
                      ? "bg-[#C8A45E] text-[#032A23] shadow-md"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  <span>2. {tokens.receptionEventTitle}</span>
                </button>
              </div>

              {/* Center: Cultural Tradition Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-sans">
                  Cultural Theme:
                </span>
                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSelectReligion("muslim")}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold font-sans transition-all cursor-pointer ${
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
                    className={`px-3 py-1 rounded-full text-[11px] font-bold font-sans transition-all cursor-pointer ${
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
                    className={`px-3 py-1 rounded-full text-[11px] font-bold font-sans transition-all cursor-pointer ${
                      (data.religion || tokens.tradition) === "universal"
                        ? "bg-[#C8A45E] text-[#032A23] shadow-sm"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    💫 Universal
                  </button>
                </div>
              </div>

              {/* Right: Premium Badge */}
              <div className="flex items-center gap-1.5 text-[11px] text-[#E1C98E] font-sans bg-[#C8A45E]/10 border border-[#C8A45E]/30 px-3 py-1.5 rounded-full">
                <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
                <span className="font-semibold">Matching Pair · 100% Free</span>
              </div>
            </div>
          )}

          {/* ── Desktop Top Tabs & Action Controls (Editable Mode Only) ── */}
          {!isFullSize && !isReadOnly && (
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

          {/* ── Optional Full Ceremony Details Form (Editable Mode Only) ── */}
          <AnimatePresence>
            {!isFullSize && !isReadOnly && isEditingDetails && (
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
                    placeholder={
                      data.religion === "hindu"
                        ? "e.g. Mrs. & Mr. Alok Verma"
                        : data.religion === "universal"
                        ? "e.g. Mrs. & Mr. Vikram Malhotra"
                        : "e.g. Mrs. & Mr. Hashmat Khan"
                    }
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
                    placeholder={
                      data.religion === "hindu"
                        ? "e.g. D/o Shri Rajesh Sharma"
                        : data.religion === "universal"
                        ? "e.g. D/o Mr. Arvind Kapoor"
                        : "e.g. D/o Mohd. Nizamuddin"
                    }
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
            className={`relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col items-center bg-[#070B09] overscroll-contain [scrollbar-width:thin] [scrollbar-color:#C8A45E40_transparent] ${isFullSize ? "p-2 sm:p-4 pt-16 pb-20 justify-start" : "p-2 sm:p-4 justify-center"
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
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${activeTab === "barat"
                        ? "bg-[#C8A45E] text-[#032A23] shadow-sm"
                        : "text-stone-300 hover:text-white"
                      }`}
                  >
                    Barat
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("reception")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${activeTab === "reception"
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
                  title="View full-size card"
                >
                  Full Size
                </button>
              </div>
            )}

            {/* Read-Only Sample Stationery Watermark / Chip */}
            {!isFullSize && isReadOnly && (
              <div className="absolute top-2.5 left-3 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#C8A45E]/30 text-[10.5px] font-sans text-[#E1C98E]">
                <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
                <span>Sample Stationery · Print-Ready 300 DPI</span>
              </div>
            )}

            {/* TAB 1: Barat Card Renderer */}
            <div
              className={`transition-all duration-300 my-auto flex-shrink-0 relative shadow-2xl rounded-sm ${activeTab === "barat" ? "block" : "hidden"
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
                  editable={!isReadOnly}
                  onUpdateRecipient={(name, city) =>
                    setData({ ...data, recipientName: name, recipientCity: city })
                  }
                />
              </div>
            </div>

            {/* TAB 2: Reception Card Renderer */}
            <div
              className={`transition-all duration-300 my-auto flex-shrink-0 relative shadow-2xl rounded-sm ${activeTab === "reception" ? "block" : "hidden"
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

            {/* ── Floating Action Bar in Full Size Mode (Editable Mode) ── */}
            {isFullSize && !isReadOnly && (
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

            {/* ── Floating Conversion Bar in Full Size Mode (Read-Only Showcase) ── */}
            {isFullSize && isReadOnly && (
              <div className="sticky bottom-2 z-30 w-full max-w-lg mx-auto mt-3 flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-black/90 backdrop-blur-md border border-[#C8A45E]/40 shadow-2xl">
                <div className="pl-2 leading-tight hidden xs:block">
                  <p className="text-[11px] font-bold text-[#E1C98E] flex items-center gap-1">
                    <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
                    <span>Included Free (Valued at ₹2,500)</span>
                  </p>
                  <p className="text-[9.5px] text-stone-400 font-sans">Print PDFs included with every website</p>
                </div>
                <div className="flex items-center gap-2 ml-auto w-full xs:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsFullSize(false)}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-sans font-medium transition-all cursor-pointer min-h-[40px]"
                  >
                    Exit Full Size
                  </button>
                  <Link
                    href="/templates"
                    onClick={onClose}
                    className="flex-1 xs:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8A45E] to-[#E1C98E] hover:from-[#E1C98E] hover:to-[#C8A45E] text-[#032A23] font-bold text-xs uppercase tracking-wider font-sans transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer min-h-[40px]"
                  >
                    <span>Select Template</span>
                    <ArrowRight size={13} weight="bold" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ── Standard Modal Footer Controls (Read-Only Showcase Mode) ── */}
          {!isFullSize && isReadOnly && (
            <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-8 py-3 sm:py-4 bg-[#0A0E0C] border-t border-[#C8A45E]/25 z-20 shadow-2xl">
              {/* Offer Callout */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C8A45E]/15 border border-[#C8A45E]/30 flex items-center justify-center text-[#E1C98E] shrink-0">
                  <Gift size={16} weight="fill" className="text-[#C8A45E]" />
                </div>
                <div className="leading-tight">
                  <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>Valued at ₹2,500 · 100% Free with Every Invitation</span>
                  </p>
                  <p className="text-[10.5px] sm:text-xs text-stone-400 font-sans">
                    Both cards are personalized with your couple names, wedding schedule &amp; venue upon selecting any template.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-stone-300 hover:text-white font-sans text-xs font-semibold transition-all cursor-pointer min-h-[44px]"
                >
                  Close Preview
                </button>
                <Link
                  href="/templates"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C8A45E] via-[#F3D59B] to-[#E1C98E] hover:from-[#E1C98E] hover:to-[#C8A45E] text-[#032A23] font-bold text-xs uppercase tracking-wider font-sans transition-all duration-300 shadow-xl hover:scale-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <span>Select Template · Get 2 Free PDFs</span>
                  <ArrowRight size={14} weight="bold" />
                </Link>
              </div>
            </div>
          )}

          {/* ── Standard Modal Footer Controls (Editable Mode) ── */}
          {!isFullSize && !isReadOnly && (
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
                  className="px-3.5 py-4 sm:px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider font-sans transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-white/15 min-h-[44px]"
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
