"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeader } from "@/components/ui/section-header";
import { DecorSection, HeaderDecor } from "@/components/decor/section-decor";
import { DoubleBezelCard } from "@/components/ui/double-bezel-card";
import { slideInLeft, slideInRight, viewportOnce, EASE_FLUID } from "@/components/ui/motion-primitives";
import {
  Sparkle,
  MusicNotes,
  Image as ImageIcon,
  Play,
  Pause,
} from "@phosphor-icons/react";

const STEPS = [
  {
    num: "01",
    title: "Choose your template & plan",
    desc: "Browse our curated collection of animated invitation designs. Pick Classic or Royal.",
  },
  {
    num: "02",
    title: "Share your wedding details",
    desc: "Add names, dates, venues, music, and photos. Watch your invite come alive in real time.",
  },
  {
    num: "03",
    title: "Share in one tap",
    desc: "Send your live link via WhatsApp, email, or social media. Track RSVPs instantly.",
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [brideName, setBrideName] = useState("Aisha");
  const [groomName, setGroomName] = useState("Rohan");
  const [weddingDate, setWeddingDate] = useState("14 · February · 2026");
  const [venueName, setVenueName] = useState("The Leela Palace, Udaipur");
  const [musicTrack, setMusicTrack] = useState("Royal Shehnai");
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <DecorSection id="how-it-works" preset="standard" className="section-padding bg-white border-y border-black/[0.04]">
      <div className="page-container">
      <SectionHeader
        eyebrow="How it works"
        title="How we create magic together"
        subtitle="Fill in your wedding details and watch your premium invitation render in real time."
      />
      <HeaderDecor preset="standard" />

      {/* Step tabs — desktop */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-4 mb-16">
        {STEPS.map((step, i) => (
          <motion.button
            key={step.num}
            onClick={() => setActiveStep(i)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={slideInLeft}
            transition={{ delay: i * 0.1 }}
            className={`text-left p-6 rounded-2xl border transition-all duration-500 ${
              activeStep === i
                ? "border-accent-gold/40 bg-accent-gold/[0.04] shadow-sm"
                : "border-black/[0.04] bg-white/50 hover:border-black/[0.08]"
            }`}
          >
            <span className="text-[10px] font-mono text-accent-gold font-bold">Step {i + 1} — {step.num}</span>
            <h3 className="font-serif text-xl mt-2 text-foreground">{step.title}</h3>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">{step.desc}</p>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={slideInLeft}
          className="lg:col-span-7"
        >
          <DoubleBezelCard className="bg-white">
            <div className="flex items-center gap-2 mb-6 border-b border-stone-100 pb-4">
              <div className="h-2 w-2 rounded-full bg-red-400" />
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 font-mono ml-2">
                {STEPS[activeStep].title}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASE_FLUID }}
                className="space-y-4"
              >
                {activeStep < 2 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1.5">Bride&apos;s Name</label>
                        <input
                          type="text"
                          value={brideName}
                          onChange={(e) => setBrideName(e.target.value)}
                          className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 focus:outline-none focus:border-accent-gold text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1.5">Groom&apos;s Name</label>
                        <input
                          type="text"
                          value={groomName}
                          onChange={(e) => setGroomName(e.target.value)}
                          className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 focus:outline-none focus:border-accent-gold text-foreground"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1.5">Wedding Date</label>
                      <input
                        type="text"
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 focus:outline-none focus:border-accent-gold text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1.5">Venue</label>
                      <input
                        type="text"
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 focus:outline-none focus:border-accent-gold text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1.5">Background Music</label>
                      <select
                        value={musicTrack}
                        onChange={(e) => setMusicTrack(e.target.value)}
                        className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 focus:outline-none focus:border-accent-gold text-foreground"
                      >
                        <option>Royal Shehnai</option>
                        <option>Sitar Melodies</option>
                        <option>Flute Harmony</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1.5">Couple Photo</label>
                      <div className="border border-dashed border-stone-200 rounded-xl p-6 text-center bg-stone-50/50 flex flex-col items-center cursor-pointer hover:border-accent-gold/40 transition-colors">
                        <ImageIcon className="h-6 w-6 text-stone-400 mb-2" weight="light" />
                        <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Drag & drop photo</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <div className="inline-flex items-center gap-3 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 px-6 py-4">
                      <span className="text-2xl">💬</span>
                      <div className="text-left">
                        <p className="text-sm font-bold text-foreground">Share via WhatsApp</p>
                        <p className="text-xs text-stone-500">One link, unlimited guests — no paper, no waiting.</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </DoubleBezelCard>
        </motion.div>

        {/* Phone preview */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={slideInRight}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative w-full max-w-[300px] animate-float">
            <div className="relative w-full aspect-[9/18.5] rounded-[2.75rem] border-[6px] border-stone-800 bg-primary shadow-2xl p-1 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-stone-800 rounded-b-xl z-20" />
              <div className="w-full h-full bg-primary rounded-[2.25rem] overflow-hidden relative flex flex-col justify-between py-10 px-4 text-center text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,155,39,0.08)_0%,transparent_75%)]" />
                <div className="flex justify-center items-center gap-1.5 opacity-60 relative z-10">
                  <div className="h-px w-5 bg-gradient-to-r from-transparent to-accent-gold" />
                  <Sparkle className="h-3 w-3 text-accent-gold" weight="fill" />
                  <div className="h-px w-5 bg-gradient-to-l from-transparent to-accent-gold" />
                </div>
                <div className="my-auto space-y-5 relative z-10">
                  <span className="text-[8px] uppercase tracking-[0.25em] text-accent-gold">The Wedding of</span>
                  <h3 className="font-serif text-2xl leading-[1.1]">
                    {brideName} <br />
                    <span className="text-xs italic text-accent-gold/80 font-sans">and</span> <br />
                    {groomName}
                  </h3>
                  <div>
                    <span className="text-[10px] text-accent-gold block">{weddingDate}</span>
                    <span className="text-[9px] text-stone-300 block mt-1">{venueName}</span>
                  </div>
                  <div className="rounded-xl bg-black/30 border border-white/5 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="h-7 w-7 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold"
                      >
                        {isPlaying ? <Pause size={12} weight="fill" /> : <Play size={12} weight="fill" />}
                      </button>
                      <div className="text-left">
                        <MusicNotes className="h-3 w-3 text-accent-gold mb-0.5" />
                        <span className="text-[8px] text-stone-300">{musicTrack}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-[7px] font-mono tracking-widest text-accent-gold/60 relative z-10">WEDINVITES</span>
              </div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-tr from-accent-gold/10 to-transparent rounded-[3rem] blur-2xl -z-10" />
          </div>
        </motion.div>
      </div>
      </div>
    </DecorSection>
  );
}
