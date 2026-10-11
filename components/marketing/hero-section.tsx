"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { LanguageMarquee } from "@/components/ui/language-marquee";
import { PremiumButton } from "@/components/ui/premium-button";
import { SectionBackdrop } from "@/components/decor/section-decor";
import { HeroMarqueeBackdrop } from "@/components/marketing/invitation-marquee";
import { HeroPhonePreview } from "@/components/marketing/hero-phone-preview";
import { fadeUp, staggerContainer } from "@/components/ui/motion-primitives";
import { ArrowRight } from "@phosphor-icons/react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden paper-texture min-h-[100dvh] flex flex-col">
      <SectionBackdrop preset="hero" />

      {/* ── Top copy ── */}
      <div className="relative z-20 pt-28 md:pt-32 pb-6 md:pb-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="page-container max-w-3xl mx-auto text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-[10px] uppercase tracking-[0.28em] font-bold text-stone-500 mb-5"
          >
            Ditch the paper. Elevate the narrative.
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-serif text-[1.85rem] sm:text-3xl md:text-4xl lg:text-[2.9rem] font-medium tracking-tight leading-[1.12] text-[#1A1A1A] mb-4"
          >
            <span className="block whitespace-nowrap">Turn Your Special Day</span>
            <span className="block whitespace-nowrap">Into a <span className="italic font-bold text-accent-gold">Magical Experience</span></span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-sm md:text-base text-stone-600 max-w-lg mx-auto leading-relaxed mb-5"
          >
            Choose from premium templates, personalize every detail, and share instantly with your loved ones — all in one place.
          </motion.p>

          <motion.div variants={fadeUp} className="mb-2">
            <LanguageMarquee />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Marquee + phone showcase ── */}
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[420px] sm:min-h-[480px] md:min-h-[520px] py-4">
        <HeroMarqueeBackdrop />

        <div className="relative z-10 flex items-center justify-center w-full px-4">
          <HeroPhonePreview />
        </div>
      </div>

      {/* ── CTAs ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 pb-16 md:pb-20 pt-8 text-center"
      >
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-4">
          <Link href="/templates">
            <PremiumButton>Start My Invitation</PremiumButton>
          </Link>
        </div>
        <Link
            href="/preview/emerald-noir"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-accent-gold transition-colors"
        >
          View our demos
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>
    </section>
  );
}
