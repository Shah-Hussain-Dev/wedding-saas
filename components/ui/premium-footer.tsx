"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Sparkle, ArrowRight, Heart } from "@phosphor-icons/react";

export function PremiumFooter() {
  return (
    <footer className="relative bg-[#032A23] text-[#F7F4ED] overflow-hidden pt-24 pb-12 select-none border-t border-[#C8A45E]/30">
      {/* Subtle Background Radial Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(200,164,94,0.18)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-20">
        {/* Grand Finale Call to Action */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#C8A45E]/40 text-[#E1C98E] text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase font-sans backdrop-blur-md">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            Your Celebration Begins Now
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal leading-tight tracking-tight text-[#F7F4ED]">
            Make the invitation as <br />
            <span className="italic font-normal text-[#E1C98E]">unforgettable</span> as the day.
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-stone-300 font-sans max-w-xl mx-auto leading-relaxed">
            Join hundreds of modern couples who turned their wedding invitation into an interactive digital masterpiece.
          </p>

          <div className="pt-3">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#C8A45E] to-[#E1C98E] hover:from-[#E1C98E] hover:to-[#C8A45E] text-[#032A23] text-xs sm:text-sm font-bold tracking-widest uppercase font-sans transition-all duration-300 shadow-[0_15px_40px_rgba(200,164,94,0.35)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Start My Invitation · From ₹1,199</span>
              <ArrowRight size={15} weight="bold" />
            </Link>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12 border-t border-white/10 text-xs font-sans">
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-[#E1C98E] lowercase">unfold</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Premium Awwwards-level interactive digital wedding invitations.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E1C98E] block">
              Discover
            </span>
            <ul className="space-y-1.5 text-stone-300">
              <li><Link href="/templates" className="hover:text-white transition-colors">All Templates</Link></li>
              <li><Link href="/preview/celestial-rose" className="hover:text-white transition-colors">Celestial Rose</Link></li>
              <li><Link href="/preview/imperial-palace" className="hover:text-white transition-colors">Imperial Palace</Link></li>
              <li><Link href="/preview/noor-e-nikah" className="hover:text-white transition-colors">Noor-e-Nikah</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E1C98E] block">
              Company
            </span>
            <ul className="space-y-1.5 text-stone-300">
              <li><Link href="/about" className="hover:text-white transition-colors">About Story</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="/affiliate" className="hover:text-white transition-colors">Affiliate Partners</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E1C98E] block">
              Legal &amp; Trust
            </span>
            <ul className="space-y-1.5 text-stone-300">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400 font-sans">
          <span>© {new Date().getFullYear()} Unfold Wedding Technologies. All rights reserved.</span>
          <span className="flex items-center gap-1 text-stone-400">
            Crafted with <Heart size={13} weight="fill" className="text-rose-400" /> for celebrations worldwide
          </span>
        </div>
      </div>
    </footer>
  );
}
