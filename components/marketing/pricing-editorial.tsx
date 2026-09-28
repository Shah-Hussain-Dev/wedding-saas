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

              <div className="flex items-baseline gap-2">
                <span className="text-stone-400 line-through text-lg font-sans">₹2,999</span>
                <span className="text-4xl sm:text-5xl font-serif font-bold text-[#073D31]">
                  ₹1,199
                </span>
                <span className="text-xs text-[#76766F] font-sans font-medium">/ wedding</span>
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

            {/* CTA Button */}
            <div className="pt-6 text-center space-y-3">
              <Link
                href="/templates"
                className="w-full py-4 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs sm:text-sm font-bold tracking-wider uppercase font-sans flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-[1.01]"
              >
                <span>Select Your Design · Start for Free</span>
                <ArrowRight size={15} weight="bold" />
              </Link>
              <p className="text-[11px] text-[#76766F] font-sans">
                Customize free first. Pay only when you are completely in love and ready to publish.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
