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

  const baratRef = useRef<HTMLDivElement | null>(null);
  const receptionRef = useRef<HTMLDivElement | null>(null);

  // Sync initialData if updated externally
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const tokens = getPdfThemeTokens(templateId, data.religion);

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

      await downloadElementAsPdf(targetElement, {
        fileName,
        scale: 2.5,
        quality: 0.96,
      });

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
        await downloadElementAsPdf(baratRef.current, {
          fileName: `${coupleSlug}-barat-invitation.pdf`,
          scale: 2.5,
        });
      }

      // Small pause between downloads for smooth browser file handling
      await new Promise((r) => setTimeout(r, 600));

      if (receptionRef.current) {
        await downloadElementAsPdf(receptionRef.current, {
          fileName: `${coupleSlug}-reception-invitation.pdf`,
          scale: 2.5,
        });
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        {/* Backdrop click to close */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl bg-[#121614] border border-[#C8A45E]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto text-[#F7F4ED]"
        >
          {/* ── Modal Top Header ── */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10 bg-[#0A0E0C]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8A45E] animate-pulse" />
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Complimentary Wedding Stationery</span>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-[#C8A45E]/20 text-[#E1C98E] px-2 py-0.5 rounded-full border border-[#C8A45E]/40">
                    Print Ready A5
                  </span>
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-400 font-sans">
                  Two matching designs included free with your {data.groomName} &amp; {data.brideName} invitation.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close PDF Preview Modal"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* ── Guest Personalization & On-Demand Share Bar (Matching User Request) ── */}
          <div className="px-5 sm:px-8 py-3.5 bg-gradient-to-r from-[#171C19] via-[#121614] to-[#171C19] border-b border-[#C8A45E]/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#C8A45E]/20 text-[#E1C98E] flex items-center justify-center flex-shrink-0 border border-[#C8A45E]/40">
                <Sparkle size={14} weight="fill" />
              </div>
              <div>
                <span className="font-bold text-white text-xs block flex items-center gap-2">
                  <span>Add Guest Name to Share</span>
                  <span className="text-[10px] bg-[#C8A45E]/15 text-[#E1C98E] px-1.5 py-0.2 rounded border border-[#C8A45E]/30">
                    Live Sync
                  </span>
                </span>
                <span className="text-[11px] text-stone-400">
                  Type any guest name to personalize &amp; share anytime, or clear to leave blank for handwriting.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 sm:w-52">
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
                onClick={() => {
                  const guestGreeting = data.recipientName
                    ? `Respected ${data.recipientName}`
                    : "Dear Family & Friends";
                  const cityLine = data.recipientCity ? ` (${data.recipientCity})` : "";
                  const text = encodeURIComponent(
                    `Assalamu Alaikum / Greetings ${guestGreeting}${cityLine},\n\nWe cordially invite you to celebrate the wedding of *${data.groomName} & ${data.brideName}*.\n\n📅 Date: ${data.weddingDate}\n🏛️ Venue: ${data.venueName || "GOMTI LAWN"}\n\nPlease find the attached formal invitation card. We look forward to your gracious presence & blessings!`
                  );
                  window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs transition-all cursor-pointer shadow-sm"
                title="Share customized invitation message on WhatsApp"
              >
                <ShareNetwork size={14} weight="bold" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* ── Top Tabs & Action Controls ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-5 sm:px-8 py-3 bg-black/40 border-b border-white/10">
            {/* Left: Card Tab Switcher */}
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-full border border-white/10">
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

            {/* Center: Tradition / Faith Selector (Muslim Duas / Hindu Mantras / Universal Quotes) */}
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/10 text-xs">
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    religion: "muslim",
                    sacredInvocation: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
                    sacredTranslation: "In the name of ALLAH the most gracious and most merciful",
                  })
                }
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
                onClick={() =>
                  setData({
                    ...data,
                    religion: "hindu",
                    sacredInvocation: "॥ श्री गणेशाय नमः ॥",
                    sacredTranslation: "May Lord Ganesha Bless This Auspicious Union",
                  })
                }
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
                onClick={() =>
                  setData({
                    ...data,
                    religion: "universal",
                    sacredInvocation: "✦ Two Hearts · One Journey ✦",
                    sacredTranslation: "Invite you to witness the beginning of forever",
                  })
                }
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

          {/* ── Optional Full Ceremony Details Form ── */}
          <AnimatePresence>
            {isEditingDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-5 sm:px-8 py-4 bg-stone-900/90 border-b border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs"
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

          {/* ── Main Canvas Preview Display ── */}
          <div className="relative p-6 sm:p-10 flex items-center justify-center bg-[#070B09] overflow-hidden min-h-[520px]">
            {/* Visual background ambient glow */}
            <div className="absolute w-[400px] h-[400px] rounded-full bg-[#C8A45E]/5 blur-3xl pointer-events-none" />

            {/* TAB 1: Barat Card Renderer */}
            <div
              className={`transition-all duration-300 ${
                activeTab === "barat" ? "block" : "hidden"
              }`}
            >
              <div
                ref={baratRef}
                className="transform transition-transform origin-center"
                style={{
                  // Adaptive scale for preview display
                  transform: "scale(0.68)",
                  margin: "-130px 0",
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
              className={`transition-all duration-300 ${
                activeTab === "reception" ? "block" : "hidden"
              }`}
            >
              <div
                ref={receptionRef}
                className="transform transition-transform origin-center"
                style={{
                  transform: "scale(0.68)",
                  margin: "-130px 0",
                }}
              >
                <ReceptionCardRenderer templateId={templateId} data={data} scale={1} />
              </div>
            </div>
          </div>

          {/* ── Modal Footer Controls & Download Trigger ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-8 py-4 bg-[#0A0E0C] border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-sans">
                {activeTab === "barat"
                  ? `Active Card: ${tokens.baratEventTitle}`
                  : `Active Card: ${tokens.receptionEventTitle}`}
              </span>
              {downloadSuccess && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fade-in">
                  <Check size={14} weight="bold" />
                  <span>{downloadSuccess}</span>
                </span>
              )}
            </div>

            {/* Download Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleDownloadActive}
                disabled={isDownloading}
                className="px-5 py-2.5 rounded-full bg-[#C8A45E] hover:bg-[#E1C98E] text-[#032A23] font-bold text-xs uppercase tracking-wider font-sans transition-all shadow-md hover:scale-105 active:scale-98 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <DownloadSimple size={15} weight="bold" />
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
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider font-sans transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 border border-white/15"
              >
                <FilePdf size={15} weight="bold" />
                <span>Download Both</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
