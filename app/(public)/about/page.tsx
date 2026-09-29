"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sparkle, ShieldCheck, Heart, UsersThree, ArrowRight, Crown, DeviceMobile } from "@phosphor-icons/react";

const VALUES = [
  {
    icon: Sparkle,
    title: "Zero Paper Delay & Friction",
    desc: "No printing turnaround, lost courier packets, or astronomical shipping fees. Deliver an unforgettable personalized portal to hundreds of guests via WhatsApp and SMS instantly.",
  },
  {
    icon: Heart,
    title: "High-Interaction Digital Art",
    desc: "3D carved palace doors, real-time gold foil scratch reveals, living soundwaves, and interactive maps that guests remember long after the wedding.",
  },
  {
    icon: UsersThree,
    title: "Effortless RSVP Logistics",
    desc: "Real-time guest tracking, dietary preferences, multi-event schedules (Haldi, Mehendi, Nikah, Pheras, Reception), and 1-click export directly to Google Sheets.",
  },
  {
    icon: ShieldCheck,
    title: "Couple-First Unlimited Edits",
    desc: "Unlimited revisions and date adjustments until your wedding day. Your invitation evolves seamlessly as your plans do.",
  },
];

export function AboutPage() {
  return (
    <div className="py-24 sm:py-36 bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20">
        {/* HERO SECTION */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#073D31] uppercase font-sans backdrop-blur-md">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            <span>Our Story &amp; Philosophy</span>
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#18211E] leading-[1.08]">
            Modern craft, <br className="hidden sm:inline" />
            <span className="italic text-[#073D31] font-normal underline decoration-[#C8A45E]/50 decoration-1 underline-offset-8">heritage roots</span>.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#76766F] font-sans leading-relaxed max-w-2xl mx-auto">
            Your wedding invitation is the very first chapter of your celebration. It should be as breathtaking as the day itself.
          </p>
        </div>

        {/* MANIFESTO CARD */}
        <div className="relative p-8 sm:p-14 rounded-[2.5rem] bg-white border border-[#073D31]/12 shadow-[0_20px_50px_rgba(7,61,49,0.06)] space-y-6 text-left overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(200,164,94,0.12)_0%,transparent_70%)] pointer-events-none" />

          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#C8A45E] tracking-widest font-bold">
            <Crown size={15} weight="fill" />
            <span>The Unfold Manifesto</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#073D31] leading-snug">
            Reimagining stationery for the modern generation.
          </h2>

          <div className="space-y-4 text-stone-600 font-sans text-sm sm:text-base leading-relaxed">
            <p>
              For generations, wedding stationery was confined to paper cards that took months to print, got delayed in courier transit, and ended up discarded after the wedding day. Static PDF cards lacked the music, emotion, and wonder of the actual ceremony.
            </p>
            <p>
              At <strong className="text-[#073D31]">Unfold</strong>, we craft interactive digital universes. We blend timeless physical craft — embossed ivory envelopes, 24K gold foil, slow-lighting wax seals — with cutting-edge 3D motion, synchronized orchestral audio, and one-touch WhatsApp guest delivery.
            </p>
            <p>
              Whether it is a royal palace waltz, a sacred Bismillah Nikah archway, or a zero-gravity starlight terrace, our masterworks are designed to make your guests feel the magic before the ceremony even begins.
            </p>
          </div>
        </div>

        {/* VALUES 4-GRID */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-mono uppercase text-[#073D31] tracking-widest font-semibold">
              The Architecture of Enchantment
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#18211E] mt-1">
              Built on four core commitments.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map((v) => {
              const IconComp = v.icon;
              return (
                <div
                  key={v.title}
                  className="p-7 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs hover:shadow-md hover:border-[#C8A45E]/50 transition-all duration-300 space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#073D31]/8 text-[#073D31] flex items-center justify-center">
                    <IconComp size={22} weight="fill" className="text-[#073D31]" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#18211E]">{v.title}</h3>
                  <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#073D31] text-[#F7F4ED] text-center space-y-4 shadow-xl">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Ready to design your wedding experience?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto font-sans leading-relaxed">
            Choose from 16 bespoke templates and preview your live personalized portal in minutes.
          </p>
          <div className="pt-2">
            <Link
              href="/templates"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#C8A45E] hover:bg-[#E1C98E] text-[#032A23] text-xs font-bold uppercase tracking-wider font-sans transition-all shadow-md hover:scale-105 cursor-pointer"
            >
              <span className="roll">
                <span className="roll__a">Explore All Masterpieces</span>
                <span className="roll__b" aria-hidden="true">Explore All Masterpieces</span>
              </span>
              <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
