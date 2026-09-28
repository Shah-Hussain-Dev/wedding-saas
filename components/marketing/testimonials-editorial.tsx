"use client";

import React from "react";
import { motion } from "motion/react";
import { Sparkle, Quotes, Star } from "@phosphor-icons/react";

const REVIEWS = [
  {
    couple: "Rohan & Meera",
    city: "Udaipur & Mumbai",
    template: "Imperial Palace",
    quote:
      "Our guests called us in tears saying they had never experienced anything like this. The double palace doors opening with the shehnai soundtrack set the tone for our entire wedding.",
  },
  {
    couple: "Zain & Ayesha",
    city: "Hyderabad & London",
    template: "Celestial Rose Dreamscape",
    quote:
      "The constellation story and scratch card reveal were magical. Over 280 family members across three continents RSVP'd within 24 hours on WhatsApp.",
  },
  {
    couple: "Aditya & Sanjana",
    city: "Bengaluru",
    template: "Modern Minimal",
    quote:
      "Ditching physical cards saved us ₹45,000 and 3 weeks of courier stress. The Google Maps integration meant not a single guest got lost during the pheras.",
  },
];

export function TestimonialsEditorial() {
  return (
    <section className="py-24 md:py-32 bg-[#EFE9DD]/50 border-t border-[#073D31]/10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-16">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#073D31] font-bold font-sans flex items-center justify-center gap-1.5">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            Couples in Love
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#18211E]">
            Unforgettable memories, shared across the world.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.couple}
              className="p-7 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex gap-1 text-[#C8A45E]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} weight="fill" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 font-sans italic leading-relaxed">
                  “{rev.quote}”
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-serif font-bold text-[#18211E]">{rev.couple}</h4>
                  <span className="text-[10px] text-[#76766F]">{rev.city}</span>
                </div>
                <span className="text-[9px] px-2.5 py-1 rounded-full bg-[#073D31]/5 text-[#073D31] font-semibold font-sans">
                  {rev.template}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
