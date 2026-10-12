"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Sparkle, CheckCircle, ShieldCheck, ArrowRight, Star } from "@phosphor-icons/react";

const INCLUDED_PERKS = [
  "Choice of any luxury masterwork template",
  "3D animated door reveals & live video openings",
  "High-interaction scratch-off Muhurat reveal",
  "Background music score with user audio toggle",
  "Real-time RSVP tracker & guestlist exports",
  "1-click Google Maps navigation & directions",
  "Unlimited edits & updates until your wedding day",
  "Dedicated couple dashboard & guest wishes wall",
  "Lifetime digital hosting with zero renewal fees",
];

export function PricingEditorial() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#F7F4ED] text-[#18211E] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#073D31] font-bold font-sans flex items-center justify-center gap-1.5">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            Transparent Luxury
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#18211E]">
            One simple price. <br className="hidden sm:inline" />
            Infinite celebration.
          </h2>
          <p className="text-sm sm:text-base text-[#76766F] font-sans">
            No tiered limitations, no per-guest costs. Everything you need for an unforgettable wedding experience.
          </p>
        </div>

        {/* Monumental Pricing Card */}
        <div className="max-w-3xl mx-auto rounded-[2.5rem] bg-white border-2 border-[#073D31]/12 p-8 sm:p-12 shadow-[0_25px_70px_rgba(7,61,49,0.08)] relative overflow-hidden">
          {/* Top Gold Badge */}
          <div className="absolute top-0 right-0 bg-[#073D31] text-[#F7F4ED] px-6 py-2 rounded-bl-3xl text-[10px] sm:text-xs font-bold font-sans tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
            <Star size={13} weight="fill" className="text-[#C8A45E]" />
            All-Inclusive Experience
          </div>

          <div className="space-y-8">
            {/* Price Row */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-stone-100 pb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#76766F] font-sans block">
                  Complete Digital Invitation Suite
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#18211E] mt-1">
                  Lifetime Pass
                </h3>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C8A45E]/20 text-[#073D31] text-[10px] font-bold font-sans tracking-wide uppercase">
                    Save 60% Today
                  </span>
                  <span className="text-stone-400 line-through text-base sm:text-lg font-sans">₹2,999</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-serif font-bold text-[#073D31]">
                    ₹1,199
                  </span>
                  <span className="text-xs text-[#76766F] font-sans font-medium">/ complete wedding</span>
                </div>
                <span className="text-[11px] text-[#A3753C] font-sans font-medium">
                  Costs less than courier postage for 10 paper cards
                </span>
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {INCLUDED_PERKS.map((perk) => (
                <div key={perk} className="flex items-start gap-2.5">
                  <CheckCircle size={18} weight="fill" className="text-[#073D31] flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-stone-700 font-sans leading-snug">
                    {perk}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button & Trust Badges */}
            <div className="pt-6 text-center space-y-3.5">
              <Link
                href="/templates"
                className="w-full py-4 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs sm:text-sm font-bold tracking-wider uppercase font-sans flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] cursor-pointer"
              >
                <span>Select Your Design · Customize Free</span>
                <ArrowRight size={15} weight="bold" />
              </Link>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-[#76766F] font-sans">
                <span className="flex items-center gap-1 text-emerald-800 font-medium">
                  <CheckCircle size={13} weight="fill" />
                  <span>Customize 100% Free First</span>
                </span>
                <span>•</span>
                <span>Pay only when ready to share</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-stone-700">
                  <ShieldCheck size={14} weight="fill" className="text-[#C8A45E]" />
                  <span>100% Concierge Support Guarantee</span>
                </span>
              </div>
              <div className="pt-1 text-[10px] text-stone-400 font-sans uppercase tracking-wider flex items-center justify-center gap-2">
                <span>🔒 Bank-Grade Security</span>
                <span>·</span>
                <span>Razorpay UPI / Cards / Netbanking</span>
                <span>·</span>
                <span>Instant Activation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
