"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, ArrowUpRight, InstagramLogo } from "@phosphor-icons/react";
import { siteConfig } from "@/config/site";

interface ReelItem {
  id: string;
  title: string;
  templateId: string;
  video?: string;
  image?: string;
}

const REELS_DATA: ReelItem[] = [
  {
    id: "r1",
    title: "Château Ballroom Waltz",
    templateId: "royal-majesty",
    video: "/videos/royal-majesty.mp4",
  },
  {
    id: "r2",
    title: "Falling Petal Shower",
    templateId: "rose-gold-blush",
    video: "/videos/rose-gold-blush.mp4",
  },
  {
    id: "r3",
    title: "Starlight Terrace Flight",
    templateId: "celestial-rose",
    video: "/videos/royal-prestige.mp4",
  },
  {
    id: "r4",
    title: "24K Gold Archway Portal",
    templateId: "noor-e-nikah",
    image: "/templates/noor-e-nikah/envelope-bg.jpg",
  },
  {
    id: "r5",
    title: "Double Palace Door Opening",
    templateId: "imperial-palace",
    image: "/templates/imperial-palace/ballroom.jpg",
  },
  {
    id: "r6",
    title: "Instant WhatsApp RSVP",
    templateId: "celestial-rose",
    video: "/videos/royal-prestige.mp4",
  },
];

export function InfiniteReelsTicker() {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate for infinite seamless scroll
  const displayReels = [...REELS_DATA, ...REELS_DATA];

  return (
    <section className="relative w-full py-16 sm:py-24 bg-[#EFE9DD] text-[#18211E] overflow-hidden">
      {/* SECTION HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#073D31] font-semibold">
            Live in Guest Hands
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-[#18211E] mt-1">
            Experienced everywhere.
          </h2>
          <p className="text-xs sm:text-sm text-[#76766F] font-sans mt-1">
            Real moments from couples and guests experiencing their digital invitations worldwide.
          </p>
        </div>

        <Link
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#073D31] uppercase tracking-wider font-sans hover:text-[#C8A45E] transition-colors shrink-0"
        >
          <InstagramLogo size={16} weight="bold" />
          <span className="roll">
            <span className="roll__a">Follow {siteConfig.social.instagramHandle}</span>
            <span className="roll__b" aria-hidden="true">Follow {siteConfig.social.instagramHandle}</span>
          </span>
          <ArrowUpRight size={14} weight="bold" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* INFINITE MARQUEE STRIP */}
      <div
        className="relative w-full flex overflow-hidden mask-linear"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex gap-4 sm:gap-6 shrink-0 ${
            isPaused ? "animate-none" : "animate-[marquee_35s_linear_infinite]"
          }`}
        >
          {displayReels.map((reel, idx) => (
            <Link
              key={`${reel.id}-${idx}`}
              href={`/preview/${reel.templateId}`}
              className="group relative shrink-0 w-[180px] sm:w-[220px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 border border-[#073D31]/10 shadow-sm hover:shadow-xl hover:border-[#C8A45E]/60 transition-all duration-500 cursor-pointer"
            >
              {/* Media */}
              {reel.video ? (
                <video
                  src={reel.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover brightness-[0.88] group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div
                  className="w-full h-full bg-cover bg-center brightness-[0.88] group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url(${reel.image})` }}
                />
              )}

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />

              {/* Play Badge */}
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 backdrop-blur-md text-[#E1C98E] flex items-center justify-center border border-white/20 group-hover:bg-[#073D31] group-hover:text-white transition-colors">
                <Play size={11} weight="fill" />
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20">
                <h4 className="font-serif text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-[#E1C98E] transition-colors">
                  {reel.title}
                </h4>
                <span className="text-[9px] font-sans text-stone-300 uppercase tracking-wider">
                  Tap to watch
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
