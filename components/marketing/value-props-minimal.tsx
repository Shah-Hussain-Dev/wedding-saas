"use client";

import React from "react";
import { ShieldCheck, MusicNotes, EnvelopeSimple, DeviceMobile, Sparkle, Heart } from "@phosphor-icons/react";

const VALUES = [
  {
    icon: DeviceMobile,
    title: "No App Install Required",
    text: "Opens instantly in any browser on iPhone, Android, or desktop with 60fps smoothness.",
  },
  {
    icon: EnvelopeSimple,
    title: "1-Click WhatsApp Delivery",
    text: "Share personalized invitation links directly with family and friends across WhatsApp and SMS.",
  },
  {
    icon: MusicNotes,
    title: "Studio-Grade Soundtracks",
    text: "Synchronized emotional audio scores that play automatically as guests open their invitation.",
  },
  {
    icon: Sparkle,
    title: "Instant Live RSVP Tracking",
    text: "Watch guest responses, meal choices, and heartfelt blessings arrive live in your dashboard.",
  },
];

export function ValuePropsMinimal() {
  return (
    <section className="relative w-full py-16 sm:py-20 bg-[#F7F4ED] text-[#18211E] border-t border-[#073D31]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="flex flex-col gap-2 p-5 rounded-2xl bg-white/70 border border-[#073D31]/10 hover:border-[#C8A45E]/60 hover:bg-white transition-all duration-300 shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#073D31]/8 text-[#073D31] flex items-center justify-center">
                  <Icon size={20} weight="fill" className="text-[#073D31]" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#18211E] mt-1">
                  {val.title}
                </h3>
                <p className="text-xs text-[#76766F] font-sans leading-relaxed">
                  {val.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
