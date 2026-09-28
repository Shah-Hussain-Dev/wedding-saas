"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Sparkle,
  MusicNotes,
  UsersThree,
  MapPin,
  HandGrabbing,
  Image,
  GlobeHemisphereWest,
  DeviceMobile,
  CheckCircle,
} from "@phosphor-icons/react";

const FEATURES = [
  {
    icon: Sparkle,
    title: "3D Monumental Door Reveals",
    desc: "Carved double walnut gates, silk curtains, and botanical arches that swing open upon guest arrival.",
    tag: "Signature Tech",
  },
  {
    icon: MusicNotes,
    title: "Synchronized Soundtracks",
    desc: "Auto-fading romantic orchestral & acoustic background scores with soundwave equalizer bars.",
    tag: "Atmospheric",
  },
  {
    icon: UsersThree,
    title: "Multi-Event RSVP Tracking",
    desc: "Guest confirmations, plus-ones, and dietary preferences synced to your live couple dashboard.",
    tag: "Smart Logistics",
  },
  {
    icon: MapPin,
    title: "1-Click Maps & Directions",
    desc: "Google Maps navigation and instant venue address clipboard copying to eliminate lost guests.",
    tag: "Effortless",
  },
  {
    icon: HandGrabbing,
    title: "Celestial Scratch Muhurat",
    desc: "Metallic gold and pearl foil scratch cards revealing wedding dates with real stardust particles.",
    tag: "Interactive",
  },
  {
    icon: Image,
    title: "3D Spatial Photo Lightbox",
    desc: "Zero-gravity couple portrait sequences, spatial memory reels, and fullscreen zoom lightbox.",
    tag: "Editorial",
  },
  {
    icon: GlobeHemisphereWest,
    title: "Multi-Faith Blessings",
    desc: "Vedic Sanskrit slokas, sacred Quranic Ayat Ar-Rum, and secular starlit invocations in 1 click.",
    tag: "Inclusive",
  },
  {
    icon: DeviceMobile,
    title: "Zero App Downloads",
    desc: "Runs natively in Mobile Safari, Chrome, and WhatsApp in-app browser with instant loading.",
    tag: "Universal",
  },
];

export function FeaturesConstellation() {
  return (
    <section className="py-24 md:py-32 bg-[#F7F4ED] text-[#18211E] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#073D31] font-bold font-sans flex items-center justify-center gap-1.5">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            Architecture of Enchantment
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#18211E]">
            Everything crafted to delight your guests.
          </h2>
          <p className="text-sm sm:text-base text-[#76766F] font-sans">
            Every feature is engineered for high interaction, effortless RSVPs, and unforgettable first impressions.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="p-6 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs hover:shadow-[0_15px_35px_rgba(7,61,49,0.08)] hover:border-[#C8A45E]/50 transition-all duration-300 space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-[#073D31]/5 group-hover:bg-[#073D31] text-[#073D31] group-hover:text-[#F7F4ED] flex items-center justify-center transition-colors duration-300">
                    <IconComp size={22} weight="bold" />
                  </div>
                  <span className="text-[9px] font-bold tracking-widest text-[#C8A45E] uppercase font-sans">
                    {feat.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif text-lg font-bold text-[#18211E] group-hover:text-[#073D31] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#76766F] font-sans leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
