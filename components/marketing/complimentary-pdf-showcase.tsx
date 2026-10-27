"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkle,
  ArrowRight,
  FilePdf,
  CheckCircle,
  Eye,
  Printer,
  Gift,
} from "@phosphor-icons/react";
import { PdfPreviewModal } from "@/components/pdf-invitation/PdfPreviewModal";

const SAMPLE_PDF_DATA = {
  brideName: "Heena",
  groomName: "Arshad",
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
  recipientCity: "",
  eventTitle: "Dawat-e-Walima",
  events: [
    { name: "Sacred Nikah & Barat", time: "05:00 PM", venue: "Gomti Lawn" },
    { name: "Dawat-e-Walima", time: "07:30 PM", venue: "Grand Banquet" },
  ],
};

export function ComplimentaryPdfShowcase() {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 bg-[#032A23] text-[#F7F4ED] overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#C8A45E]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-black/40 border border-[#C8A45E]/30 p-6 sm:p-8 md:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
          {/* Subtle top gold decorative line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C8A45E] to-transparent opacity-80" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Offer Details & Benefits (7 cols on desktop) */}
            <div className="lg:col-span-7 space-y-5 text-left">
              {/* Offer Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C8A45E]/15 border border-[#C8A45E]/40 text-[#E1C98E] text-[10.5px] sm:text-xs font-bold uppercase tracking-widest font-sans shadow-sm">
                <Gift size={14} weight="fill" className="text-[#C8A45E]" />
                <span>Complimentary Exclusive Offer · Valued at ₹2,500</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                One Wedding Website. <br />
                <span className="bg-gradient-to-r from-[#C8A45E] via-[#F3D59B] to-[#E1C98E] bg-clip-text text-transparent">
                  Two Matching Print PDFs Free.
                </span>
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed max-w-xl">
                Every digital invitation order includes <strong>two free, high-resolution (300 DPI) printable PDF stationery invitations</strong> — <strong>Ceremony / Barat</strong> and <strong>Reception / Walima</strong> — designed in 24K gold foil elegance to match your chosen wedding website theme.
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-stone-300 font-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[#C8A45E] shrink-0" />
                  <span>Standard A5 Size (148 × 210 mm)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[#C8A45E] shrink-0" />
                  <span>Crystal 300 DPI Print Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[#C8A45E] shrink-0" />
                  <span>Zero Graphic Designer Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[#C8A45E] shrink-0" />
                  <span>Instant Download in Dashboard</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/templates"
                  className="px-6 py-3 rounded-full bg-[#C8A45E] hover:bg-[#E1C98E] text-[#032A23] font-bold text-xs uppercase tracking-wider font-sans transition-all duration-300 shadow-xl hover:scale-102 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Select Template · Get 2 PDFs Free</span>
                  <ArrowRight size={14} weight="bold" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-stone-200 border border-white/15 text-xs font-bold font-sans tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye size={15} weight="bold" className="text-[#C8A45E]" />
                  <span>View Sample PDF Preview</span>
                </button>
              </div>
            </div>

            {/* Right Column: Visual Offer Cards Spotlight (5 cols on desktop) */}
            <div className="lg:col-span-5 relative flex justify-center py-4 lg:py-0">
              {/* Ambient radial glow under cards */}
              <div className="absolute inset-0 bg-[#C8A45E]/15 rounded-full blur-2xl pointer-events-none" />

              {/* Overlapping Presentation of the 2 PDFs */}
              <div className="relative w-full max-w-[340px] sm:max-w-[360px] h-[270px] sm:h-[300px]">
                {/* PDF Card 2: Reception / Formal Banquet (Back Layer, slightly tilted) */}
                <div className="absolute top-2 right-2 w-[72%] h-[92%] rounded-2xl bg-[#FCFAF6] text-[#18211E] border-2 border-[#C8A45E]/70 shadow-2xl p-4 flex flex-col justify-between transform rotate-3 hover:rotate-1 transition-transform duration-300">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C6D23] bg-[#EFE9DD] px-2 py-0.5 rounded-full">
                        PDF 02 · Reception
                      </span>
                      <Printer size={13} className="text-[#8C6D23]" weight="bold" />
                    </div>
                    <div className="border-b border-[#C8A45E]/30 pb-1 pt-1 text-center">
                      <p className="font-serif text-sm font-bold text-[#073D31] leading-tight">
                        Dawat-e-Walima
                      </p>
                      <p className="text-[9px] text-stone-500 font-sans">Formal Banquet Card</p>
                    </div>
                    <div className="space-y-1 text-[8.5px] text-stone-600 font-sans text-center">
                      <p className="italic text-[#8C6D23]">Mrs. &amp; Mr. Hashmat Khan</p>
                      <p>Cordially invite you to celebrate</p>
                      <p className="font-serif font-bold text-[#18211E] text-[10px]">Heena &amp; Arshad</p>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-stone-200 text-center">
                    <span className="text-[8px] font-mono text-stone-400 uppercase tracking-widest">
                      Print-Ready A5 · 300 DPI
                    </span>
                  </div>
                </div>

                {/* PDF Card 1: Barat / Ceremony (Front Layer, prominent) */}
                <div className="absolute bottom-2 left-2 w-[75%] h-[94%] rounded-2xl bg-gradient-to-br from-[#420F18] to-[#5E1A29] text-[#FCFAF6] border-2 border-[#C8A45E] shadow-[0_15px_35px_rgba(0,0,0,0.5)] p-4 flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#032A23] bg-[#C8A45E] px-2 py-0.5 rounded-full font-sans shadow-xs">
                        PDF 01 · Ceremony
                      </span>
                      <FilePdf size={14} className="text-[#E1C98E]" weight="bold" />
                    </div>
                    <div className="border-b border-[#C8A45E]/40 pb-1.5 pt-1 text-center">
                      <p className="font-serif text-sm sm:text-base font-bold text-[#E1C98E] leading-tight">
                        The Sacred Nikah
                      </p>
                      <p className="text-[9px] text-stone-300/80 font-sans">Gold Foil Procession Card</p>
                    </div>
                    <div className="space-y-1 text-[8.5px] text-stone-200/90 font-sans text-center">
                      <p className="text-[#E1C98E] font-arabic text-[10px]">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                      <p className="font-serif font-bold text-white text-[11px]">Heena &amp; Arshad</p>
                      <p className="text-stone-300 text-[8px]">Monday, 12 October 2026</p>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-[#C8A45E]/30 flex items-center justify-between text-[8px] text-[#E1C98E] font-sans">
                    <span>A5 Size (148 × 210 mm)</span>
                    <span className="font-bold">✓ Included Free</span>
                  </div>
                </div>

                {/* Floating Free Value Badge */}
                <div className="absolute -bottom-2 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-[#073D31] to-[#0A4D3E] border border-[#C8A45E] text-[#E1C98E] text-[10px] font-bold font-sans tracking-wide shadow-xl flex items-center gap-1 z-20">
                  <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
                  <span>100% Free Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Sample Preview Modal (Read-Only) */}
      <PdfPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        templateId="kitab-e-nikah"
        initialData={SAMPLE_PDF_DATA}
        isReadOnly={true}
      />
    </section>
  );
}
