"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Sparkle, Compass, Palette, PaperPlaneTilt, UsersThree, CheckCircle, ArrowRight } from "@phosphor-icons/react";

const STEPS = [
  {
    step: "01",
    title: "Choose Your World",
    subtitle: "Select from 16 curated architectural & celestial masterworks",
    description: "Whether an imperial Rajasthani palace, Ottoman qasr, French château ballroom, or celestial rose terrace — find the exact ambiance that echoes your love story.",
    icon: Compass,
    screenTag: "Step 01 · Template Portal",
    previewTitle: "Celestial Rose & Imperial Palaces",
    previewSubtitle: "3D Door Openings · Ambient Soundtracks",
    visualType: "portal",
    video: "/videos/royal-prestige.mp4",
  },
  {
    step: "02",
    title: "Make It Yours",
    subtitle: "Effortlessly add dates, events, itinerary & portraits",
    description: "Enter your names, ceremonial timings, venue directions, and dress code palettes. Select your background music and faith invocation with real-time live preview.",
    icon: Palette,
    screenTag: "Step 02 · Live Editor",
    previewTitle: "Kabir & Tara",
    previewSubtitle: "Saturday, November 28, 2026",
    visualType: "customize",
    gradient: "from-[#F1E8E1] via-[#E8B8B8]/40 to-[#F1E8E1]",
  },
  {
    step: "03",
    title: "Share The Moment",
    subtitle: "1-Click WhatsApp delivery with personalized previews",
    description: "No printing delays. Send personalized digital envelopes to hundreds of family and friends worldwide in seconds with zero app installs required.",
    icon: PaperPlaneTilt,
    screenTag: "Step 03 · WhatsApp Ready",
    previewTitle: "Invitation Delivered",
    previewSubtitle: "“You are cordially invited to celebrate with us”",
    visualType: "share",
    gradient: "from-[#073D31] via-[#0F382E] to-[#04120F]",
  },
  {
    step: "04",
    title: "Watch Guests Respond",
    subtitle: "Live RSVP guestlist & heartfelt celebratory wishes",
    description: "Track confirmed attendees, guest counts, dietary notes, and view sentimental messages arriving in real time on your dedicated couple dashboard.",
    icon: UsersThree,
    screenTag: "Step 04 · Real-time RSVP",
    previewTitle: "184 Confirmed RSVPs",
    previewSubtitle: "✦ Star added to celebration constellation",
    visualType: "rsvp",
    gradient: "from-[#18211E] via-[#36281D] to-[#18211E]",
  },
];

export function HowItWorksTransforming() {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const activeStep = STEPS[activeStepIdx];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[#EFE9DD]/50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 paper-texture opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#073D31] font-bold font-sans flex items-center justify-center gap-1.5">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            The Seamless Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#18211E]">
            From imagination to every guest&apos;s phone.
          </h2>
          <p className="text-sm sm:text-base text-[#76766F] font-sans">
            Crafting an unforgettable digital wedding invitation takes under 5 minutes.
          </p>
        </div>

        {/* 4-Step Interactive Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Interactive Step Selector */}
          <div className="lg:col-span-6 space-y-3">
            {STEPS.map((s, idx) => {
              const isActive = activeStepIdx === idx;
              const IconComp = s.icon;
              return (
                <div
                  key={s.step}
                  onClick={() => setActiveStepIdx(idx)}
                  className={`p-5 sm:p-6 rounded-3xl transition-all duration-300 cursor-pointer border ${
                    isActive
                      ? "bg-white border-[#073D31]/15 shadow-[0_15px_40px_rgba(7,61,49,0.08)] scale-[1.01]"
                      : "bg-white/40 border-transparent hover:bg-white/70 text-[#76766F]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive
                          ? "bg-[#073D31] text-[#F7F4ED]"
                          : "bg-[#073D31]/10 text-[#073D31]"
                      }`}
                    >
                      <IconComp size={20} weight={isActive ? "fill" : "bold"} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#C8A45E] font-sans">
                          STEP {s.step}
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                          {s.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#76766F] font-sans leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Transforming Mockup Device */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] rounded-[2.5rem] bg-[#18211E] p-3.5 border-4 border-stone-800 shadow-[0_30px_70px_rgba(0,0,0,0.25)]">
              {/* Phone Speaker Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/60 rounded-full z-20 backdrop-blur-md" />

              {/* Transforming Screen Content */}
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-stone-900 flex flex-col justify-between p-6 select-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStepIdx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full flex flex-col justify-between p-6"
                  >
                    {activeStep.video ? (
                      <video
                        src={activeStep.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover brightness-[0.85]"
                      />
                    ) : (
                      <div
                        className={`absolute inset-0 w-full h-full bg-gradient-to-br ${activeStep.gradient}`}
                      />
                    )}

                    <div className="absolute inset-0 bg-black/30 pointer-events-none" />

                    {/* Top Screen Badge */}
                    <div className="relative z-10 pt-6">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-bold tracking-widest text-[#073D31] uppercase">
                        {activeStep.screenTag}
                      </span>
                    </div>

                    {/* Bottom Screen Content */}
                    <div className="relative z-10 space-y-3 bg-black/55 backdrop-blur-xl p-5 rounded-2xl border border-white/20 text-white text-center">
                      <Sparkle size={18} weight="fill" className="text-[#E1C98E] mx-auto animate-twinkle" />
                      <h4 className="font-serif text-xl sm:text-2xl font-bold">
                        {activeStep.previewTitle}
                      </h4>
                      <p className="text-[11px] text-[#E1C98E] font-sans font-medium">
                        {activeStep.previewSubtitle}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Fast Track CTA */}
        <div className="pt-4 text-center">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs sm:text-sm font-semibold tracking-wider uppercase font-sans transition-all shadow-md hover:scale-105"
          >
            <span>Start Building in 2 Minutes</span>
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
