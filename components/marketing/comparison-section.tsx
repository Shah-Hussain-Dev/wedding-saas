"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Sparkle,
  CheckCircle,
  XCircle,
  CurrencyInr,
  Clock,
  MusicNotes,
  MapPin,
  ArrowsClockwise,
  Plant,
  ArrowRight,
  ShieldCheck,
  WhatsappLogo,
  DeviceMobile,
  Star,
} from "@phosphor-icons/react";

interface ComparisonItem {
  id: string;
  category: "all" | "value" | "experience";
  feature: string;
  icon: React.ElementType;
  paper: {
    title: string;
    description: string;
    subtext?: string;
  };
  digital: {
    title: string;
    description: string;
    subtext?: string;
    highlight?: boolean;
  };
}

const COMPARISON_ITEMS: ComparisonItem[] = [
  {
    id: "cost",
    category: "value",
    feature: "Total Cost & Investment",
    icon: CurrencyInr,
    paper: {
      title: "₹25,000 – ₹75,000+",
      description: "Minimum 300-500 copies required + custom dies + ₹50–₹150 courier per card.",
      subtext: "Expensive per-card printing",
    },
    digital: {
      title: "₹1,199 Flat All-Inclusive",
      description: "One single lifetime fee. Invite 50 or 5,000 guests with zero extra charges.",
      subtext: "Save ₹30,000+ instantly",
      highlight: true,
    },
  },
  {
    id: "speed",
    category: "value",
    feature: "Delivery & Turnaround",
    icon: Clock,
    paper: {
      title: "3 to 5 Weeks Wait",
      description: "Sample proofs, press printing delays, packing, and courier delivery transit.",
      subtext: "Risk of delayed or lost parcels",
    },
    digital: {
      title: "Instant (5-Min Setup)",
      description: "Customize live and deliver instantly to all guests via WhatsApp and SMS.",
      subtext: "Zero delivery wait",
      highlight: true,
    },
  },
  {
    id: "interaction",
    category: "experience",
    feature: "Guest Immersion & Reveal",
    icon: Sparkle,
    paper: {
      title: "Flat Static Card / PDF",
      description: "Read once in 10 seconds and typically placed in a drawer or thrown away.",
      subtext: "Discarded after event",
    },
    digital: {
      title: "3D Cinematic Reveal",
      description: "Monumental carved palace doors, wax seals, scratch-to-reveal Muhurat & confetti.",
      subtext: "Keepsake web experience",
      highlight: true,
    },
  },
  {
    id: "music",
    category: "experience",
    feature: "Emotional Music & Audio",
    icon: MusicNotes,
    paper: {
      title: "Completely Silent",
      description: "No music or emotional ambiance. Traditional text without sound.",
      subtext: "No audio possible",
    },
    digital: {
      title: "Orchestral Acoustic Scores",
      description: "Synchronized classical Shehnai, Sitar, & Violin with guest audio toggle.",
      subtext: "Studio master soundtrack",
      highlight: true,
    },
  },
  {
    id: "rsvp",
    category: "value",
    feature: "RSVP & Headcount Tracking",
    icon: CheckCircle,
    paper: {
      title: "Manual Calls & Guesswork",
      description: "Chasing guests over frantic phone calls, lost headcounts & catering waste.",
      subtext: "High stress & uncertainty",
    },
    digital: {
      title: "Automated Live Dashboard",
      description: "Real-time guest attendance, dietary preferences, and blessings in your portal.",
      subtext: "Export guestlist in 1 click",
      highlight: true,
    },
  },
  {
    id: "maps",
    category: "experience",
    feature: "Venue Directions & GPS",
    icon: MapPin,
    paper: {
      title: "Tiny Printed Address",
      description: "Guests get lost and call the groom or bride's family for directions on the wedding day.",
      subtext: "Repeated phone calls",
    },
    digital: {
      title: "1-Click Google Maps & Uber",
      description: "Direct GPS navigation pins to each event venue with turn-by-turn guidance.",
      subtext: "Zero guest navigation calls",
      highlight: true,
    },
  },
  {
    id: "edits",
    category: "value",
    feature: "Changes & Last-Minute Updates",
    icon: ArrowsClockwise,
    paper: {
      title: "Costly Re-Print Required",
      description: "Any timing or venue change requires re-printing everything or awkward WhatsApp apology texts.",
      subtext: "Locked once printed",
    },
    digital: {
      title: "Unlimited Free Edits",
      description: "Update schedules, venue details, or ceremony times anytime from your dashboard.",
      subtext: "Live updates instantly reflected",
      highlight: true,
    },
  },
  {
    id: "eco",
    category: "experience",
    feature: "Environmental Footprint",
    icon: Plant,
    paper: {
      title: "Heavy Paper & Plastic Waste",
      description: "Hundreds of cards, chemical foil stamping & courier envelopes end up in landfills.",
      subtext: "Hundreds of cards discarded",
    },
    digital: {
      title: "100% Eco-Friendly & Sustainable",
      description: "Zero paper, zero carbon transit, zero waste. A modern green wedding choice.",
      subtext: "Save trees & zero waste",
      highlight: true,
    },
  },
];

export function ComparisonSection() {
  const [filter, setFilter] = useState<"all" | "value" | "experience">("all");

  const filteredItems = COMPARISON_ITEMS.filter((item) => {
    if (filter === "all") return true;
    return item.category === filter;
  });

  return (
    <section
      id="comparison"
      className="relative w-full py-20 sm:py-28 md:py-32 bg-[#FCFAF6] text-[#18211E] overflow-hidden border-y border-[#073D31]/10 selection:bg-[#C8A45E]/30 selection:text-[#073D31]"
    >
      {/* Ambient Lighting & Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(200,164,94,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[450px] h-[300px] bg-[radial-gradient(circle,rgba(7,61,49,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#073D31]/8 border border-[#073D31]/15 text-[#073D31] text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase font-sans backdrop-blur-md">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            The Honest Comparison
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4.5xl md:text-5xl font-medium tracking-tight text-[#18211E] leading-[1.14]">
            Physical Wedding Cards <br />
            <span className="italic font-normal text-[#073D31]">vs. WedInvites Digital Atelier</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#76766F] font-sans leading-relaxed">
            See why modern couples are bidding farewell to expensive printing delays, courier chaos, and silent paper cards in favor of living 3D interactive experiences.
          </p>
        </div>

        {/* Impact Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-[#073D31]/10 shadow-2xs backdrop-blur-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#073D31] flex items-center justify-center shrink-0 border border-emerald-600/10">
              <CurrencyInr size={20} weight="bold" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-serif font-bold text-[#073D31]">₹35,000+ Average Saved</div>
              <div className="text-[11px] text-[#76766F] font-sans">Zero minimums & courier bills</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-[#073D31]/10 shadow-2xs backdrop-blur-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C8A45E] flex items-center justify-center shrink-0 border border-amber-600/10">
              <Clock size={20} weight="bold" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-serif font-bold text-[#18211E]">3 Weeks Time Saved</div>
              <div className="text-[11px] text-[#76766F] font-sans">Delivered in 5 minutes flat</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-[#073D31]/10 shadow-2xs backdrop-blur-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-600/10">
              <Plant size={20} weight="bold" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-serif font-bold text-[#18211E]">100% Zero Paper Waste</div>
              <div className="text-[11px] text-[#76766F] font-sans">Eco-friendly digital keepsake</div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {(
            [
              { id: "all", label: "All Comparisons" },
              { id: "value", label: "Cost & Logistics" },
              { id: "experience", label: "Guest Experience" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold font-sans uppercase tracking-wider transition-all cursor-pointer ${
                filter === tab.id
                  ? "bg-[#073D31] text-[#F7F4ED] shadow-sm scale-102"
                  : "bg-white/80 text-[#76766F] hover:text-[#073D31] hover:bg-white border border-[#073D31]/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DESKTOP MATRIX TABLE (Hidden on small mobile, visible on md+) */}
        <div className="hidden md:block rounded-3xl bg-white border border-[#073D31]/12 shadow-[0_20px_60px_rgba(7,61,49,0.06)] overflow-hidden">
          {/* Table Column Headers */}
          <div className="grid grid-cols-12 border-b border-stone-200/80 bg-[#FCFAF6] text-xs font-sans font-bold uppercase tracking-wider">
            <div className="col-span-4 p-5 sm:p-6 text-[#76766F] flex items-center">
              Comparison Dimension
            </div>
            <div className="col-span-4 p-5 sm:p-6 text-stone-500 bg-stone-100/60 border-x border-stone-200/80 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-stone-400" />
                Traditional Physical Card
              </span>
              <span className="text-[10px] text-stone-400 font-normal">Paper Stationery</span>
            </div>
            <div className="col-span-4 p-5 sm:p-6 text-[#073D31] bg-[#073D31]/5 flex items-center justify-between relative">
              <span className="flex items-center gap-2 font-bold">
                <Sparkle size={14} weight="fill" className="text-[#C8A45E]" />
                WedInvites Digital
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#073D31] text-[#F7F4ED] text-[9px] font-bold tracking-widest uppercase">
                Winner
              </span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-stone-100">
            {filteredItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 transition-colors hover:bg-stone-50/60 ${
                    idx % 2 === 1 ? "bg-[#FCFAF6]/30" : "bg-white"
                  }`}
                >
                  {/* Feature Label Col */}
                  <div className="col-span-4 p-5 sm:p-6 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#073D31]/8 text-[#073D31] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={17} weight="bold" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#18211E] font-sans">
                        {item.feature}
                      </div>
                    </div>
                  </div>

                  {/* Physical Card Col */}
                  <div className="col-span-4 p-5 sm:p-6 bg-stone-100/40 border-x border-stone-200/80 space-y-1">
                    <div className="flex items-center gap-2">
                      <XCircle size={16} weight="fill" className="text-rose-500/80 shrink-0" />
                      <span className="text-sm font-semibold text-stone-700 font-sans">
                        {item.paper.title}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-sans leading-relaxed pl-6">
                      {item.paper.description}
                    </p>
                    {item.paper.subtext && (
                      <span className="inline-block text-[10px] text-stone-400 font-sans pl-6 italic">
                        {item.paper.subtext}
                      </span>
                    )}
                  </div>

                  {/* WedInvites Digital Col (Elevated Winner) */}
                  <div className="col-span-4 p-5 sm:p-6 bg-[#073D31]/[0.03] space-y-1 relative">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={17} weight="fill" className="text-[#073D31] shrink-0" />
                      <span className="text-sm font-bold text-[#073D31] font-sans">
                        {item.digital.title}
                      </span>
                    </div>
                    <p className="text-xs text-[#18211E]/80 font-sans leading-relaxed pl-6">
                      {item.digital.description}
                    </p>
                    {item.digital.subtext && (
                      <span className="inline-block text-[10px] font-semibold text-[#C8A45E] bg-[#C8A45E]/10 px-2 py-0.5 rounded-md ml-6">
                        {item.digital.subtext}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE STACKED CARDS (Optimized for 360px - 430px viewports) */}
        <div className="md:hidden space-y-4">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-[#073D31]/12 p-4 shadow-2xs space-y-3.5"
              >
                {/* Feature Header */}
                <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
                  <div className="w-7 h-7 rounded-lg bg-[#073D31]/8 text-[#073D31] flex items-center justify-center shrink-0">
                    <Icon size={16} weight="bold" />
                  </div>
                  <h3 className="text-sm font-bold text-[#18211E] font-sans">
                    {item.feature}
                  </h3>
                </div>

                {/* WedInvites First on Mobile (Hero Solution) */}
                <div className="p-3.5 rounded-xl bg-[#073D31]/[0.05] border border-[#073D31]/15 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#073D31] flex items-center gap-1 font-sans">
                      <Sparkle size={11} weight="fill" className="text-[#C8A45E]" />
                      WedInvites Digital
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#073D31] text-white">
                      Recommended
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <CheckCircle size={16} weight="fill" className="text-[#073D31] shrink-0" />
                    <span className="text-xs font-bold text-[#073D31] font-sans">
                      {item.digital.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-700 font-sans leading-relaxed pl-5">
                    {item.digital.description}
                  </p>
                  {item.digital.subtext && (
                    <span className="inline-block text-[10px] font-semibold text-[#073D31] bg-white/80 px-2 py-0.5 rounded-md ml-5 border border-[#073D31]/10">
                      {item.digital.subtext}
                    </span>
                  )}
                </div>

                {/* Traditional Paper Alternative */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 font-sans block">
                    Traditional Paper Card
                  </span>
                  <div className="flex items-center gap-1.5">
                    <XCircle size={15} weight="fill" className="text-rose-500/80 shrink-0" />
                    <span className="text-xs font-medium text-stone-600 font-sans">
                      {item.paper.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-sans leading-relaxed pl-5">
                    {item.paper.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl relative text-[#F7F4ED] p-6 sm:p-10 text-center  shadow-[0_20px_50px_rgba(7,61,49,0.25)] border border-[#C8A45E]/35 overflow-hidden">
          {/* CTA Background Image Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <Image
              src="/images/cta-bg.png"
              alt=""
              fill
              priority={false}
              sizes="(max-width: 1024px) 100vw, 1152px"
              className="object-cover object-center opacity-45 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#073D31]/90 via-[#032A23]/80 to-[#073D31]/90" />
            <div className="absolute top-0 right-1/4 w-[300px] h-[200px] bg-[radial-gradient(circle,rgba(200,164,94,0.25)_0%,transparent_70%)]" />
            <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#E1C98E] to-transparent opacity-80" />
          </div>

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#E1C98E] font-sans inline-flex items-center gap-1.5">
              <Star size={13} weight="fill" />
              Smarter Wedding Stationery
              <Star size={13} weight="fill" />
            </span>

            <h3 className="font-serif text-2xl sm:text-3.5xl md:text-4xl font-normal leading-snug text-[#F7F4ED]">
              Why spend ₹40,000 on cards that get thrown away?
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 font-sans max-w-lg mx-auto">
              Give your wedding guests an unforgettable 3D interactive entrance they’ll talk about forever — for just ₹1,199 one-time.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <Link
              href="/templates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#C8A45E] to-[#E1C98E] hover:from-[#E1C98E] hover:to-[#C8A45E] text-[#032A23] text-xs sm:text-sm font-bold uppercase tracking-wider font-sans shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Explore Templates · Try Free</span>
              <ArrowRight size={15} weight="bold" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-medium tracking-wide font-sans backdrop-blur-md transition-all cursor-pointer"
            >
              <Sparkle size={16} weight="fill" className="text-[#E1C98E]" />
              <span>Talk to Concierge Team</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
