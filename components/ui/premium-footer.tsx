"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Sparkle, ArrowRight, Heart, ShieldCheck, WhatsappLogo, EnvelopeSimple, PaperPlaneTilt, CheckCircle } from "@phosphor-icons/react";

export function PremiumFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="relative bg-[#032A23] text-[#F7F4ED] overflow-hidden pt-20 sm:pt-28 pb-12 select-none border-t border-[#C8A45E]/30 selection:bg-[#C8A45E]/40 selection:text-white">
      {/* Ambient Radial Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(200,164,94,0.18)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-[radial-gradient(circle,rgba(7,61,49,0.4)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-16 sm:space-y-20">
        {/* Grand Finale Call to Action */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#C8A45E]/40 text-[#E1C98E] text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase font-sans backdrop-blur-md">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            Your Celebration Begins Now
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h2 className="font-serif text-3.5xl sm:text-5xl md:text-6xl font-normal leading-[1.12] tracking-tight text-[#F7F4ED]">
            Make the invitation as <br />
            <span className="italic font-normal text-[#E1C98E]">unforgettable</span> as the day.
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-stone-300 font-sans max-w-xl mx-auto leading-relaxed">
            Join hundreds of modern couples who turned their wedding stationery into an interactive 3D digital masterpiece.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/templates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#C8A45E] to-[#E1C98E] hover:from-[#E1C98E] hover:to-[#C8A45E] text-[#032A23] text-xs sm:text-sm font-bold tracking-widest uppercase font-sans transition-all duration-300 shadow-[0_15px_40px_rgba(200,164,94,0.35)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className="roll">
                <span className="roll__a">Start My Invitation · From ₹1,199</span>
                <span className="roll__b" aria-hidden="true">Start My Invitation · From ₹1,199</span>
              </span>
              <ArrowRight size={15} weight="bold" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-semibold tracking-wider font-sans backdrop-blur-md transition-all cursor-pointer"
            >
              <WhatsappLogo size={16} weight="fill" className="text-emerald-400" />
              <span>Talk to Concierge</span>
            </Link>
          </div>
        </div>

        {/* TRUST PILLARS STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 pb-4 border-y border-white/10 text-center">
          <div className="flex items-center justify-center gap-3 p-3">
            <Sparkle size={18} weight="fill" className="text-[#E1C98E] shrink-0" />
            <div className="text-left">
              <span className="text-xs font-bold text-white block">3D Interactive Art</span>
              <span className="text-[10px] text-stone-400">Carved doors, wax seals & audio</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-3 border-t sm:border-t-0 sm:border-x border-white/10">
            <ShieldCheck size={18} weight="fill" className="text-[#E1C98E] shrink-0" />
            <div className="text-left">
              <span className="text-xs font-bold text-white block">Unlimited Revisions</span>
              <span className="text-[10px] text-stone-400">Edit details anytime until wedding</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-3 border-t sm:border-t-0 border-white/10">
            <WhatsappLogo size={18} weight="fill" className="text-emerald-400 shrink-0" />
            <div className="text-left">
              <span className="text-xs font-bold text-white block">Instant WhatsApp Share</span>
              <span className="text-[10px] text-stone-400">Zero courier wait, 1-click delivery</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 text-xs font-sans">
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="font-serif text-2xl font-bold text-white lowercase tracking-tight inline-flex items-center gap-1.5 cursor-pointer">
              <span>unfold</span>
              <span className="w-2 h-2 rounded-full bg-[#C8A45E]" />
            </Link>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              The premier interactive digital wedding invitation platform. Replacing static cards with living 3D experiences, orchestral soundscapes, and real-time RSVP portals.
            </p>

            {/* Newsletter VIP Box */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E1C98E] block mb-2">
                Join VIP Wedding Showcase
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 border border-emerald-500/40 text-emerald-300 text-xs">
                  <CheckCircle size={15} weight="fill" />
                  <span>Welcome! We’ll send luxury invitation inspiration.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white/10 border border-white/15 rounded-full px-4 py-2.5 text-xs text-white placeholder:text-stone-400 outline-none focus:border-[#C8A45E] transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="p-2.5 rounded-full bg-[#C8A45E] hover:bg-[#E1C98E] text-[#032A23] font-bold transition-transform active:scale-95 cursor-pointer shrink-0"
                  >
                    <PaperPlaneTilt size={14} weight="bold" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Masterpieces */}
          <div className="space-y-3">
            <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#E1C98E] block">
              Masterpieces
            </span>
            <ul className="space-y-2 text-stone-300">
              <li>
                <Link href="/templates" className="hover:text-[#E1C98E] transition-colors">
                  Showroom Collection
                </Link>
              </li>
              <li>
                <Link href="/preview/celestial-rose" className="hover:text-[#E1C98E] transition-colors">
                  Celestial Rose Dreamscape
                </Link>
              </li>
              <li>
                <Link href="/preview/imperial-palace" className="hover:text-[#E1C98E] transition-colors">
                  Imperial Palace Royale
                </Link>
              </li>
              <li>
                <Link href="/preview/noor-e-nikah" className="hover:text-[#E1C98E] transition-colors">
                  Noor-e-Nikah Ivory
                </Link>
              </li>
              <li>
                <Link href="/preview/royal-majesty" className="hover:text-[#E1C98E] transition-colors">
                  Royal Majesty Château
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Company */}
          <div className="space-y-3">
            <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#E1C98E] block">
              Company
            </span>
            <ul className="space-y-2 text-stone-300">
              <li>
                <Link href="/about" className="hover:text-[#E1C98E] transition-colors">
                  About Story &amp; Craft
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-[#E1C98E] transition-colors">
                  Pricing Plans (₹1,199)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E1C98E] transition-colors">
                  Concierge Support
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="hover:text-[#E1C98E] transition-colors">
                  Affiliate Partner Program
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#E1C98E] transition-colors">
                  Couple Dashboard Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#E1C98E] block">
              Legal &amp; Trust
            </span>
            <ul className="space-y-2 text-stone-300">
              <li>
                <Link href="/privacy-policy" className="hover:text-[#E1C98E] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#E1C98E] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#E1C98E] transition-colors">
                  Cancellation &amp; Refund
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#E1C98E] transition-colors">
                  Instant Digital Delivery
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400 font-sans">
          <span>© {new Date().getFullYear()} Unfold Wedding Technologies. All rights reserved.</span>
          <span className="flex items-center gap-1.5 text-stone-300">
            <span>Crafted with</span>
            <Heart size={13} weight="fill" className="text-rose-400" />
            <span>for unforgettable celebrations worldwide</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
