"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sparkle, ShieldCheck, Heart, UsersThree, ArrowRight } from "@phosphor-icons/react";

const VALUES = [
  { icon: Sparkle, title: "Zero Paper Delay", desc: "No printing delays or shipping fees. Deliver an unforgettable personalized portal to hundreds of guests via WhatsApp instantly." },
  { icon: Heart, title: "High-Interaction Art", desc: "3D carved palace doors, real-time foil scratch reveals, living soundwaves, and interactive maps that guests remember forever." },
  { icon: UsersThree, title: "Effortless RSVP Logistics", desc: "Real-time guest tracking, dietary preferences, multi-event schedules (Haldi, Mehendi, Nikah, Pheras), and 1-click export." },
  { icon: ShieldCheck, title: "Couple-First Unlimited Edits", desc: "Unlimited revisions and date adjustments until your wedding day. Your invitation evolves seamlessly as your plans do." },
];

export function AboutPage() {
  return (
    <div className="py-24 sm:py-32 bg-[#F7F4ED] text-[#18211E]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#073D31]/10 text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#073D31] uppercase font-sans shadow-xs">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            Our Story &amp; Philosophy
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#18211E]">
            Modern craft, heritage roots.
          </h1>

          <p className="text-sm sm:text-base text-[#76766F] font-sans leading-relaxed max-w-xl mx-auto">
            Your wedding invitation should be as breathtaking as the celebration itself.
          </p>
        </div>

        {/* Manifesto Card */}
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-white border border-[#073D31]/10 shadow-[0_20px_50px_rgba(7,61,49,0.06)] space-y-4 text-left">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#073D31]">
            Reimagining the Wedding Invitation
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
            For decades, wedding invitations have been constrained by paper delays, lost couriers, and static PDFs that lack emotion. At Unfold, we craft interactive digital universes — combining high-end luxury editorial aesthetics with 3D opening reveals, synchronized romantic scores, and effortless WhatsApp sharing.
          </p>
          <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
            Every template is a dedicated digital sanctuary honoring diverse faiths and modern aesthetics, ensuring your guests are captivated from the very first tap.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VALUES.map((v) => {
            const IconComp = v.icon;
            return (
              <div
                key={v.title}
                className="p-7 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#073D31]/5 text-[#073D31] flex items-center justify-center">
                  <IconComp size={20} weight="bold" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#18211E]">{v.title}</h3>
                <p className="text-xs text-stone-600 font-sans leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs sm:text-sm font-bold tracking-wider uppercase font-sans transition-all shadow-md hover:scale-105"
          >
            <span>Explore Our Collection</span>
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
