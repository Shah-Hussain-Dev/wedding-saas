"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkle,
  ArrowRight,
  DeviceMobile,
  FilePdf,
  CheckCircle,
  Eye,
} from "@phosphor-icons/react";
import { BaratCardRenderer } from "@/components/pdf-invitation/BaratCardRenderer";
import { ReceptionCardRenderer } from "@/components/pdf-invitation/ReceptionCardRenderer";
import { PdfPreviewModal } from "@/components/pdf-invitation/PdfPreviewModal";

const SHOWCASE_THEMES = [
  {
    id: "kitab-e-nikah",
    name: "Dawat-e-Walima Royale",
    style: "Deep Maroon & 24K Gold Foil",
    tag: "Muslim Tradition (Walima & Barat)",
    couple: { bride: "Heena", groom: "Arshad" },
    date: "2026-10-12",
    time: "7:30 p.m.",
    venue: "GOMTI LAWN",
    venueAddress: "Opp. Shia P.G. College, Sitapur Road, Lucknow",
    host: "Mrs. & Mr. Hashmat Khan",
    hostRelation: "of their Son",
    parentage: "D/o Mohd. Nizamuddin",
    baratTitle: "Dawat-e-Walima",
    receptionTitle: "Dawat-e-Walima",
    rsvp: "Peer Khan, Suhail Khan, Mohd, Kajf Khan\nMohd. Arif Khan, Mohd. Asif Khan, Anas Khan",
    compliments: "W.B.C.F.: All Relatives & Friends",
    defaultRecipient: "Mr. Hashmat Husain",
    defaultCity: "Lucknow",
  },
  {
    id: "crimson-royale",
    name: "Crimson Royale",
    style: "Regal Velvet & 24K Gold",
    tag: "Hindu Tradition",
    couple: { bride: "Ananya", groom: "Ishaan" },
    date: "2026-12-22",
    time: "06:30 PM onwards",
    venue: "The Ridgewood Grand Palace, Udaipur",
    venueAddress: "Lake Pichola Road, Udaipur",
    host: "Mrs. & Mr. Sharma",
    hostRelation: "of their Son",
    parentage: "D/o Mr. & Mrs. Verma",
    baratTitle: "Shubh Vivah & Barat Swagat",
    receptionTitle: "Preetibhoj & Grand Reception",
    rsvp: "Sharma & Verma Family",
    compliments: "With Best Compliments from Relatives & Friends",
    defaultRecipient: "Respected Sharma Family",
    defaultCity: "Jaipur",
  },
  {
    id: "celestial-rose",
    name: "Celestial Rose",
    style: "Ethereal Starlight Dreamscape",
    tag: "Universal & Contemporary",
    couple: { bride: "Tara", groom: "Armaan" },
    date: "2026-11-18",
    time: "06:00 PM onwards",
    venue: "Starlight Terrace & Lake Ballroom",
    venueAddress: "Marina Boulevard, Lake City",
    host: "Mrs. & Mr. Kapoor",
    hostRelation: "of their Son",
    parentage: "D/o Mr. & Mrs. Singhania",
    baratTitle: "Wedding Procession & Ceremony",
    receptionTitle: "Starlight Gala Dinner & Reception",
    rsvp: "Kapoor Family & Friends",
    compliments: "Warmest Wishes from All Friends",
    defaultRecipient: "Dear Friends & Family",
    defaultCity: "Mumbai",
  },
];

export function ComplimentaryPdfShowcase() {
  const [activeThemeIndex, setActiveThemeIndex] = useState(0);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [guestName, setGuestName] = useState("Mr. Hashmat Hussain");
  const [guestCity, setGuestCity] = useState("Lucknow");

  const currentTheme = SHOWCASE_THEMES[activeThemeIndex];

  const showcaseData = {
    brideName: currentTheme.couple.bride,
    groomName: currentTheme.couple.groom,
    weddingDate: currentTheme.date,
    weddingTime: currentTheme.time,
    venueName: currentTheme.venue,
    venueAddress: currentTheme.venueAddress,
    hostNames: currentTheme.host,
    hostRelation: currentTheme.hostRelation,
    parentageDetails: currentTheme.parentage,
    rsvpContact: currentTheme.rsvp,
    complimentsText: currentTheme.compliments,
    recipientName: guestName,
    recipientCity: guestCity,
    eventTitle: currentTheme.baratTitle,
    events: [
      { name: currentTheme.baratTitle, time: currentTheme.time, venue: currentTheme.venue },
      { name: currentTheme.receptionTitle, time: currentTheme.time, venue: currentTheme.venue },
    ],
  };

  return (
    <section className="relative w-full py-20 sm:py-28 bg-[#032A23] text-[#F7F4ED] overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C8A45E]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        {/* ── Section Header ── */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C8A45E]/15 border border-[#C8A45E]/40 text-[#E1C98E] text-[10.5px] sm:text-xs font-bold uppercase tracking-widest font-sans shadow-sm">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            <span>Exclusive Complimentary USP</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            One Wedding Website. <br />
            <span className="bg-gradient-to-r from-[#C8A45E] via-[#F3D59B] to-[#E1C98E] bg-clip-text text-transparent">
              Two Beautiful Matching Invitations.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-stone-300 font-sans leading-relaxed max-w-2xl mx-auto">
            Your digital wedding invitation comes with two personalized, printable PDF invitations designed to match your wedding theme — <strong>Barat and Reception</strong> — so every celebration feels beautifully connected.
          </p>

          {/* Theme Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-2">
            {SHOWCASE_THEMES.map((theme, idx) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  setActiveThemeIndex(idx);
                  if (theme.defaultRecipient) setGuestName(theme.defaultRecipient);
                  if (theme.defaultCity) setGuestCity(theme.defaultCity);
                }}
                className={`px-4 py-2 rounded-full text-xs font-sans font-bold transition-all duration-300 cursor-pointer ${activeThemeIndex === idx
                  ? "bg-[#C8A45E] text-[#032A23] shadow-lg shadow-[#C8A45E]/30 scale-105"
                  : "bg-white/10 hover:bg-white/15 text-stone-300 border border-white/10"
                  }`}
              >
                <span>{theme.name}</span>
                <span className="opacity-70 text-[10px] ml-1.5 hidden sm:inline">({theme.tag})</span>
              </button>
            ))}
          </div>

          {/* Live Personalizer: Type any guest name in real time */}
          <div className="pt-3 max-w-lg mx-auto">
            <div className="bg-black/50 border border-[#C8A45E]/40 rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-center gap-2 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-2 text-left w-full sm:w-auto px-1">
                <span className="w-2 h-2 rounded-full bg-[#C8A45E] animate-pulse" />
                <span className="text-[11px] font-bold text-[#E1C98E] uppercase tracking-wider font-sans whitespace-nowrap">
                  Add Guest Name:
                </span>
              </div>
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={guestName}
                  placeholder="Type any guest name..."
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 text-xs focus:border-[#C8A45E] outline-none"
                />
                <input
                  type="text"
                  value={guestCity}
                  placeholder="City"
                  onChange={(e) => setGuestCity(e.target.value)}
                  className="w-28 px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 text-xs focus:border-[#C8A45E] outline-none"
                />
              </div>
            </div>
            <p className="text-[11px] text-stone-300 font-sans mt-1.5 text-center">
              Watch the card update live below with metallic gold calligraphy and underline guides!
            </p>
          </div>
        </div>

        {/* ── Trio Showcase Composition (Digital Phone + Barat Card + Reception Card) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center max-w-6xl mx-auto">
          {/* Card 1: Interactive Phone Digital Website Mockup */}
          <div className="relative rounded-3xl bg-black/40 border border-white/15 p-6 backdrop-blur-md flex flex-col justify-between h-[480px] shadow-2xl overflow-hidden group hover:border-[#C8A45E]/50 transition-all duration-500">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A45E] flex items-center gap-1.5 font-sans">
                  <DeviceMobile size={15} weight="bold" />
                  <span>The Digital Website</span>
                </span>
                <span className="text-[10px] font-mono text-stone-400">Live on WhatsApp</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
                Interactive Invitation
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                3D doors open with synchronized audio, live countdown, photo gallery, Google Maps, and instant RSVP tracking.
              </p>
            </div>

            {/* Inner Phone Visual Frame */}
            <div className="relative w-full h-[240px] rounded-2xl overflow-hidden border border-white/20 bg-stone-950 flex flex-col items-center justify-center text-center p-4 shadow-inner">
              <div className="w-12 h-12 rounded-full bg-[#C8A45E]/20 flex items-center justify-center text-[#E1C98E] mb-3">
                <DeviceMobile size={24} weight="fill" />
              </div>
              <h4 className="font-serif text-lg font-bold text-white leading-tight">
                {currentTheme.couple.groom} &amp; {currentTheme.couple.bride}
              </h4>
              <p className="text-[11px] text-[#C8A45E] font-sans mt-1">
                {currentTheme.style}
              </p>
              <div className="mt-3 px-3 py-1 rounded-full bg-white/10 text-[10px] text-stone-300 font-mono">
                wedinvites.com/{currentTheme.couple.groom.toLowerCase()}-{currentTheme.couple.bride.toLowerCase()}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-stone-400 font-sans border-t border-white/10">
              <span>Unlimited Guest RSVPs</span>
              <span className="text-emerald-400 font-bold">✓ Included</span>
            </div>
          </div>

          {/* Card 2: Complimentary PDF 1 — Barat / Procession Card */}
          <div className="relative rounded-3xl bg-black/40 border-2 border-[#C8A45E]/60 p-6 backdrop-blur-md flex flex-col justify-between h-[510px] shadow-2xl overflow-hidden group hover:shadow-[0_0_30px_rgba(200,164,94,0.3)] transition-all duration-500 scale-100 md:scale-105">
            {/* Top Pill Badge */}
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#C8A45E] text-[#032A23] text-[9.5px] font-bold uppercase tracking-wider font-sans shadow-sm">
              Complimentary 01
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A45E] flex items-center gap-1.5 font-sans mb-2">
                <FilePdf size={15} weight="bold" />
                <span>Print-Ready A5 Card</span>
              </span>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                {currentTheme.baratTitle}
              </h3>
              <p className="text-xs text-stone-300 font-sans line-clamp-2">
                Personalized wedding procession card with gold filigree corners, couple calligraphy, and venue details.
              </p>
            </div>

            {/* Scaled Preview Thumbnail (Generous, crisp, and zooms IN on hover) */}
            <div className="relative w-full h-[280px] rounded-2xl overflow-hidden border border-white/20 flex items-center justify-center bg-black/70 shadow-lg">
              <div className="transition-transform duration-500 ease-out group-hover:scale-105">
                <div
                  style={{
                    width: "592px",
                    height: "840px",
                    transform: "scale(0.33)",
                    transformOrigin: "center center",
                  }}
                  className="pointer-events-none select-none shadow-2xl"
                >
                  <BaratCardRenderer templateId={currentTheme.id} data={showcaseData} />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="w-full py-2.5 rounded-full bg-white/15 hover:bg-[#C8A45E] hover:text-[#032A23] text-white text-xs font-bold font-sans tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye size={14} weight="bold" />
              <span>Full Screen 300 DPI Preview</span>
            </button>
          </div>

          {/* Card 3: Complimentary PDF 2 — Reception / Walima Card */}
          <div className="relative rounded-3xl bg-black/40 border border-white/15 p-6 backdrop-blur-md flex flex-col justify-between h-[510px] shadow-2xl overflow-hidden group hover:border-[#C8A45E]/50 transition-all duration-500">
            {/* Top Pill Badge */}
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/20 text-[#E1C98E] text-[9.5px] font-bold uppercase tracking-wider font-sans">
              Complimentary 02
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A45E] flex items-center gap-1.5 font-sans mb-2">
                <FilePdf size={15} weight="bold" />
                <span>Print-Ready A5 Card</span>
              </span>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                {currentTheme.receptionTitle}
              </h3>
              <p className="text-xs text-stone-300 font-sans line-clamp-2">
                Ivory textured parchment with formal host lineage, parentage, timing, and RSVP compliments.
              </p>
            </div>

            {/* Scaled Preview Thumbnail (Generous, crisp, and zooms IN on hover) */}
            <div className="relative w-full h-[280px] rounded-2xl overflow-hidden border border-white/20 flex items-center justify-center bg-black/70 shadow-lg">
              <div className="transition-transform duration-500 ease-out group-hover:scale-105">
                <div
                  style={{
                    width: "592px",
                    height: "840px",
                    transform: "scale(0.33)",
                    transformOrigin: "center center",
                  }}
                  className="pointer-events-none select-none shadow-2xl"
                >
                  <ReceptionCardRenderer templateId={currentTheme.id} data={showcaseData} />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="w-full py-2.5 rounded-full bg-white/15 hover:bg-[#C8A45E] hover:text-[#032A23] text-white text-xs font-bold font-sans tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye size={14} weight="bold" />
              <span>Full Screen 300 DPI Preview</span>
            </button>
          </div>
        </div>

        {/* ── Section Bottom Features & Primary CTA ── */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 font-sans">
            <span className="flex items-center gap-1.5">
              <CheckCircle size={16} weight="fill" className="text-[#C8A45E]" />
              <span>Standard A5 Size (148 × 210 mm)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={16} weight="fill" className="text-[#C8A45E]" />
              <span>Crystal 300 DPI Print Quality</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={16} weight="fill" className="text-[#C8A45E]" />
              <span>Zero Graphic Designer Fees</span>
            </span>
          </div>

          <Link
            href="/templates"
            className="px-8 py-3.5 rounded-full bg-[#C8A45E] hover:bg-[#E1C98E] text-[#032A23] font-bold text-xs uppercase tracking-wider font-sans transition-all duration-300 shadow-xl hover:scale-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Select Your Template · Get 2 Matching PDFs Free</span>
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>

      {/* ── Fullscreen Interactive Preview Modal ── */}
      <PdfPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        templateId={currentTheme.id}
        initialData={showcaseData}
      />
    </section>
  );
}
