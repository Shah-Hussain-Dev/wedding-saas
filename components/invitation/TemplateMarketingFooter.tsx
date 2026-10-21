"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Sparkle,
  ShieldCheck,
  WhatsappLogo,
  ArrowRight,
  CheckCircle,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { siteConfig } from "@/config/site";

export interface TemplateThemeConfig {
  isLight?: boolean;
  accentColor: string;
  accentSoft: string;
  headingColor: string;
  bodyColor: string;
  cardBg: string;
  cardBorder: string;
  cardHoverBorder: string;
  chipBg: string;
  chipBorder: string;
  chipText: string;
  secondaryBtnBg: string;
  secondaryBtnBorder: string;
  secondaryBtnText: string;
  trustTextColor: string;
  bottomTextColor: string;
  bottomBorderColor: string;
  logoVariant: "white" | "dark";
}

const TEMPLATE_THEMES: Record<string, Partial<TemplateThemeConfig>> = {
  "noor-e-nikah": {
    accentColor: "#D4AF37",
    accentSoft: "#E8D5B5",
    headingColor: "#FAF7F0",
    bodyColor: "#D8CEBC",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#D4AF37]/20",
    cardHoverBorder: "#D4AF37",
    chipBg: "bg-[#D4AF37]/10",
    chipBorder: "border-[#D4AF37]/35",
    chipText: "#E8D5B5",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#D4AF37]/30 hover:border-[#D4AF37]/60",
    secondaryBtnText: "#FAF7F0",
    trustTextColor: "#D8CEBC",
    bottomTextColor: "#A69988",
    bottomBorderColor: "rgba(212, 175, 55, 0.15)",
    logoVariant: "white",
  },
  "azure-nikah": {
    accentColor: "#D4AF37",
    accentSoft: "#93C5FD",
    headingColor: "#F0F6FF",
    bodyColor: "#CBD5E1",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#D4AF37]/20",
    cardHoverBorder: "#D4AF37",
    chipBg: "bg-white/10",
    chipBorder: "border-[#D4AF37]/35",
    chipText: "#D4AF37",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#D4AF37]/30 hover:border-[#D4AF37]/60",
    secondaryBtnText: "#F0F6FF",
    trustTextColor: "#CBD5E1",
    bottomTextColor: "#94A3B8",
    bottomBorderColor: "rgba(212, 175, 55, 0.15)",
    logoVariant: "white",
  },
  "crimson-royale": {
    accentColor: "#E2B86E",
    accentSoft: "#FDE8C8",
    headingColor: "#FFF5F5",
    bodyColor: "#E2CBD0",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#E2B86E]/20",
    cardHoverBorder: "#E2B86E",
    chipBg: "bg-white/10",
    chipBorder: "border-[#E2B86E]/35",
    chipText: "#E2B86E",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#E2B86E]/30 hover:border-[#E2B86E]/60",
    secondaryBtnText: "#FFF5F5",
    trustTextColor: "#E2CBD0",
    bottomTextColor: "#C4A4AD",
    bottomBorderColor: "rgba(226, 184, 110, 0.15)",
    logoVariant: "white",
  },
  "emerald-noir": {
    accentColor: "#D4AF37",
    accentSoft: "#E8D5B5",
    headingColor: "#F5FBF7",
    bodyColor: "#C5DDD3",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#D4AF37]/20",
    cardHoverBorder: "#D4AF37",
    chipBg: "bg-white/10",
    chipBorder: "border-[#D4AF37]/35",
    chipText: "#D4AF37",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#D4AF37]/30 hover:border-[#D4AF37]/60",
    secondaryBtnText: "#F5FBF7",
    trustTextColor: "#C5DDD3",
    bottomTextColor: "#8EAB9D",
    bottomBorderColor: "rgba(212, 175, 55, 0.15)",
    logoVariant: "white",
  },
  "emerald-qasr": {
    accentColor: "#D4AF37",
    accentSoft: "#E8D5B5",
    headingColor: "#F7FAF8",
    bodyColor: "#C5DDD3",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#D4AF37]/20",
    cardHoverBorder: "#D4AF37",
    chipBg: "bg-white/10",
    chipBorder: "border-[#D4AF37]/35",
    chipText: "#D4AF37",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#D4AF37]/30 hover:border-[#D4AF37]/60",
    secondaryBtnText: "#F7FAF8",
    trustTextColor: "#C5DDD3",
    bottomTextColor: "#8EAB9D",
    bottomBorderColor: "rgba(212, 175, 55, 0.15)",
    logoVariant: "white",
  },
  "gul-e-noor": {
    accentColor: "#E0A899",
    accentSoft: "#F7DDD4",
    headingColor: "#FDF8F7",
    bodyColor: "#DBC7C4",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#E0A899]/20",
    cardHoverBorder: "#E0A899",
    chipBg: "bg-white/10",
    chipBorder: "border-[#E0A899]/35",
    chipText: "#E0A899",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#E0A899]/30 hover:border-[#E0A899]/60",
    secondaryBtnText: "#FDF8F7",
    trustTextColor: "#DBC7C4",
    bottomTextColor: "#AF9894",
    bottomBorderColor: "rgba(224, 168, 153, 0.15)",
    logoVariant: "white",
  },
  "imperial-palace": {
    accentColor: "#B89773",
    accentSoft: "#E5D8C4",
    headingColor: "#FAF7F2",
    bodyColor: "#D5C8B6",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#B89773]/20",
    cardHoverBorder: "#B89773",
    chipBg: "bg-white/10",
    chipBorder: "border-[#B89773]/35",
    chipText: "#B89773",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#B89773]/30 hover:border-[#B89773]/60",
    secondaryBtnText: "#FAF7F2",
    trustTextColor: "#D5C8B6",
    bottomTextColor: "#A69784",
    bottomBorderColor: "rgba(184, 151, 115, 0.15)",
    logoVariant: "white",
  },
  "kitab-e-nikah": {
    accentColor: "#D4AF37",
    accentSoft: "#BAE6FD",
    headingColor: "#F8FAFC",
    bodyColor: "#CBD5E1",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#D4AF37]/20",
    cardHoverBorder: "#D4AF37",
    chipBg: "bg-white/10",
    chipBorder: "border-[#D4AF37]/35",
    chipText: "#D4AF37",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#D4AF37]/30 hover:border-[#D4AF37]/60",
    secondaryBtnText: "#F8FAFC",
    trustTextColor: "#CBD5E1",
    bottomTextColor: "#94A3B8",
    bottomBorderColor: "rgba(212, 175, 55, 0.15)",
    logoVariant: "white",
  },
  "modern-minimal": {
    isLight: true,
    accentColor: "#8C6D23",
    accentSoft: "#574A37",
    headingColor: "#1C1A17",
    bodyColor: "#524C44",
    cardBg: "bg-stone-900/[0.03]",
    cardBorder: "border-stone-900/10",
    cardHoverBorder: "#8C6D23",
    chipBg: "bg-stone-900/[0.05]",
    chipBorder: "border-[#8C6D23]/30",
    chipText: "#8C6D23",
    secondaryBtnBg: "bg-stone-900/[0.05] hover:bg-stone-900/[0.08]",
    secondaryBtnBorder: "border-stone-900/15 hover:border-[#8C6D23]/50",
    secondaryBtnText: "#1C1A17",
    trustTextColor: "#6B655B",
    bottomTextColor: "#8A8478",
    bottomBorderColor: "rgba(140, 109, 35, 0.15)",
    logoVariant: "dark",
  },
  "rose-gold-blush": {
    accentColor: "#D7B875",
    accentSoft: "#F5EFE3",
    headingColor: "#F5EFE3",
    bodyColor: "#CBD5E1",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#D7B875]/20",
    cardHoverBorder: "#D7B875",
    chipBg: "bg-white/10",
    chipBorder: "border-[#D7B875]/35",
    chipText: "#D7B875",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#D7B875]/30 hover:border-[#D7B875]/60",
    secondaryBtnText: "#F5EFE3",
    trustTextColor: "#CBD5E1",
    bottomTextColor: "#94A3B8",
    bottomBorderColor: "rgba(215, 184, 117, 0.15)",
    logoVariant: "white",
  },
  "royal-elegance": {
    accentColor: "#D4AF37",
    accentSoft: "#F3E5AB",
    headingColor: "#FAF8F5",
    bodyColor: "#CDC7BD",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#D4AF37]/20",
    cardHoverBorder: "#D4AF37",
    chipBg: "bg-white/10",
    chipBorder: "border-[#D4AF37]/35",
    chipText: "#D4AF37",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#D4AF37]/30 hover:border-[#D4AF37]/60",
    secondaryBtnText: "#FAF8F5",
    trustTextColor: "#CDC7BD",
    bottomTextColor: "#A39E95",
    bottomBorderColor: "rgba(212, 175, 55, 0.15)",
    logoVariant: "white",
  },
  "royal-grace": {
    accentColor: "#D4AF37",
    accentSoft: "#F3E5AB",
    headingColor: "#FAF8F5",
    bodyColor: "#CDC7BD",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#D4AF37]/20",
    cardHoverBorder: "#D4AF37",
    chipBg: "bg-white/10",
    chipBorder: "border-[#D4AF37]/35",
    chipText: "#D4AF37",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#D4AF37]/30 hover:border-[#D4AF37]/60",
    secondaryBtnText: "#FAF8F5",
    trustTextColor: "#CDC7BD",
    bottomTextColor: "#A39E95",
    bottomBorderColor: "rgba(212, 175, 55, 0.15)",
    logoVariant: "white",
  },
  "royal-heritage": {
    accentColor: "#D4AF37",
    accentSoft: "#F3E5AB",
    headingColor: "#FAF8F5",
    bodyColor: "#CDC7BD",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#D4AF37]/20",
    cardHoverBorder: "#D4AF37",
    chipBg: "bg-white/10",
    chipBorder: "border-[#D4AF37]/35",
    chipText: "#D4AF37",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#D4AF37]/30 hover:border-[#D4AF37]/60",
    secondaryBtnText: "#FAF8F5",
    trustTextColor: "#CDC7BD",
    bottomTextColor: "#A39E95",
    bottomBorderColor: "rgba(212, 175, 55, 0.15)",
    logoVariant: "white",
  },
  "royal-lotus": {
    accentColor: "#E2A855",
    accentSoft: "#FDE8C8",
    headingColor: "#FAF5F8",
    bodyColor: "#C5B6BF",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#E2A855]/20",
    cardHoverBorder: "#E2A855",
    chipBg: "bg-white/10",
    chipBorder: "border-[#E2A855]/35",
    chipText: "#E2A855",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#E2A855]/30 hover:border-[#E2A855]/60",
    secondaryBtnText: "#FAF5F8",
    trustTextColor: "#C5B6BF",
    bottomTextColor: "#9E8E98",
    bottomBorderColor: "rgba(226, 168, 85, 0.15)",
    logoVariant: "white",
  },
  "royal-majesty": {
    accentColor: "#D4AF37",
    accentSoft: "#E8D5B5",
    headingColor: "#FAF8F5",
    bodyColor: "#B0BAC9",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#D4AF37]/20",
    cardHoverBorder: "#D4AF37",
    chipBg: "bg-white/10",
    chipBorder: "border-[#D4AF37]/35",
    chipText: "#D4AF37",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#D4AF37]/30 hover:border-[#D4AF37]/60",
    secondaryBtnText: "#FAF8F5",
    trustTextColor: "#B0BAC9",
    bottomTextColor: "#8391A4",
    bottomBorderColor: "rgba(212, 175, 55, 0.15)",
    logoVariant: "white",
  },
  "celestial-rose": {
    accentColor: "#E0A899",
    accentSoft: "#FBEAE5",
    headingColor: "#FAF7F7",
    bodyColor: "#C4B5BA",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#E0A899]/20",
    cardHoverBorder: "#E0A899",
    chipBg: "bg-white/10",
    chipBorder: "border-[#E0A899]/35",
    chipText: "#E0A899",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#E0A899]/30 hover:border-[#E0A899]/60",
    secondaryBtnText: "#FAF7F7",
    trustTextColor: "#C4B5BA",
    bottomTextColor: "#9D8D94",
    bottomBorderColor: "rgba(224, 168, 153, 0.15)",
    logoVariant: "white",
  },
};

const DEFAULT_THEME: TemplateThemeConfig = {
  isLight: false,
  accentColor: "#D4AF37",
  accentSoft: "#E8D5B5",
  headingColor: "#FAF7F0",
  bodyColor: "#D8CEBC",
  cardBg: "bg-white/[0.04]",
  cardBorder: "border-[#D4AF37]/20",
  cardHoverBorder: "#D4AF37",
  chipBg: "bg-white/10",
  chipBorder: "border-[#D4AF37]/35",
  chipText: "#D4AF37",
  secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
  secondaryBtnBorder: "border-[#D4AF37]/30 hover:border-[#D4AF37]/60",
  secondaryBtnText: "#FAF7F0",
  trustTextColor: "#D8CEBC",
  bottomTextColor: "#A69988",
  bottomBorderColor: "rgba(212, 175, 55, 0.15)",
  logoVariant: "white",
};

export interface TemplateMarketingFooterProps {
  /** Optional ID of the current template being viewed (e.g. 'noor-e-nikah') */
  templateId?: string;
  /** Optional readable name of the template (e.g. 'Noor-e-Nikah') */
  templateName?: string;
  /** Optional bride name from current invitation data */
  brideName?: string;
  /** Optional groom name from current invitation data */
  groomName?: string;
  /** Optional custom CSS classes */
  className?: string;
  /** Optional force light theme */
  isLight?: boolean;
}

export function TemplateMarketingFooter({
  templateId,
  templateName,
  brideName,
  groomName,
  className = "",
  isLight,
}: TemplateMarketingFooterProps) {
  const hasCouple = Boolean(brideName?.trim() && groomName?.trim());
  const coupleDisplay = hasCouple ? `${brideName} & ${groomName}` : "";

  // Resolve theme configuration
  const matchedTheme = templateId ? TEMPLATE_THEMES[templateId] : undefined;
  const theme: TemplateThemeConfig = {
    ...DEFAULT_THEME,
    ...(matchedTheme || {}),
    ...(isLight !== undefined ? { isLight } : {}),
  };



  return (
    <section
      aria-label="WedInvites Wedding Website Atelier"
      className={`w-full relative py-12 sm:py-16 px-4 sm:px-6 md:px-8 bg-transparent text-inherit ${className}`}
    >
      {/* Ornamental Transition Motif */}
      <div className="flex items-center justify-center gap-3 pb-8 sm:pb-10" aria-hidden="true">
        <span
          className="h-px w-12 sm:w-24 bg-gradient-to-r from-transparent via-current to-transparent opacity-30"
          style={{ color: theme.accentColor }}
        />
        <span
          className="text-xs sm:text-sm tracking-[0.3em] font-serif select-none opacity-80"
          style={{ color: theme.accentColor }}
        >
          ✦ &nbsp; ❖ &nbsp; ✦
        </span>
        <span
          className="h-px w-12 sm:w-24 bg-gradient-to-r from-transparent via-current to-transparent opacity-30"
          style={{ color: theme.accentColor }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6 sm:space-y-8">
        {/* Top Eyebrow Chip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.chipBg} ${theme.chipBorder} text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase font-sans backdrop-blur-md shadow-sm`}
          style={{ color: theme.chipText }}
        >
          <Sparkle size={13} weight="fill" className="animate-pulse" style={{ color: theme.accentColor }} />
          <span>Inspired by this celebration?</span>
          <Sparkle size={13} weight="fill" className="animate-pulse" style={{ color: theme.accentColor }} />
        </motion.div>

        {/* High-Retention Catchy Headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-3"
        >
          <h2
            className="font-serif text-2xl sm:text-4xl md:text-5xl font-normal leading-[1.2] tracking-tight"
            style={{ color: theme.headingColor }}
          >
            {hasCouple ? (
              <>
                Loved <span className="font-medium" style={{ color: theme.accentColor }}>{coupleDisplay}&apos;s</span> wedding invitation? <br className="hidden sm:inline" />
                <span className="italic font-normal opacity-90">Create yours for your big day.</span>
              </>
            ) : (
              <>
                Want an unforgettable {templateName ? `${templateName} ` : ""}wedding website <br className="hidden sm:inline" />
                <span className="italic font-normal" style={{ color: theme.accentColor }}>just like this</span> for your big day?
              </>
            )}
          </h2>

          <p
            className="text-xs sm:text-sm md:text-base font-sans max-w-xl mx-auto leading-relaxed"
            style={{ color: theme.bodyColor }}
          >
            Ditch paper cards that end up discarded. Turn your wedding into an interactive 3D digital celebration with carved palace doors, royal music, venue maps &amp; instant WhatsApp RSVPs.
          </p>
        </motion.div>

        {/* 3 High-Retention Value Prop Cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left pt-2"
        >
          {/* Pillar 1 */}
          <div
            className={`p-4 rounded-2xl ${theme.cardBg} ${theme.cardBorder} backdrop-blur-md flex items-start gap-3 transition-colors duration-300 hover:border-opacity-60`}
          >
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{
                backgroundColor: `${theme.accentColor}18`,
                border: `1px solid ${theme.accentColor}35`,
                color: theme.accentColor,
              }}
            >
              <Sparkle size={18} weight="fill" />
            </div>
            <div>
              <span className="text-xs font-bold block" style={{ color: theme.headingColor }}>
                16+ Royal 3D Themes
              </span>
              <span className="text-[11px] leading-snug block mt-0.5" style={{ color: theme.bodyColor }}>
                Carved palace gates, wax seals &amp; classical soundscapes
              </span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div
            className={`p-4 rounded-2xl ${theme.cardBg} ${theme.cardBorder} backdrop-blur-md flex items-start gap-3 transition-colors duration-300 hover:border-emerald-500/40`}
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <WhatsappLogo size={18} weight="fill" />
            </div>
            <div>
              <span className="text-xs font-bold block" style={{ color: theme.headingColor }}>
                Instant WhatsApp Share
              </span>
              <span className="text-[11px] leading-snug block mt-0.5" style={{ color: theme.bodyColor }}>
                Zero courier wait · 1-click delivery to all guests worldwide
              </span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div
            className={`p-4 rounded-2xl ${theme.cardBg} ${theme.cardBorder} backdrop-blur-md flex items-start gap-3 transition-colors duration-300 hover:border-opacity-60`}
          >
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{
                backgroundColor: `${theme.accentColor}18`,
                border: `1px solid ${theme.accentColor}35`,
                color: theme.accentColor,
              }}
            >
              <ShieldCheck size={18} weight="fill" />
            </div>
            <div>
              <span className="text-xs font-bold block" style={{ color: theme.headingColor }}>
                Flat {siteConfig.startingPrice} All-Inclusive
              </span>
              <span className="text-[11px] leading-snug block mt-0.5" style={{ color: theme.bodyColor }}>
                100% Free to customize &amp; preview · Lifetime access
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Website Home CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-3 flex items-center justify-center w-full"
        >
          <Link
            href="/"
            className="group relative w-full sm:w-auto min-h-[48px] sm:min-h-[52px] inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-sans text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 hover:scale-[1.03] hover:brightness-110 active:scale-95 cursor-pointer shadow-lg hover:shadow-2xl overflow-hidden"
            style={{
              backgroundColor: theme.accentColor,
              color: theme.isLight ? "#FFFFFF" : "#1A1A1A",
              boxShadow: `0 10px 30px ${theme.accentColor}40`,
            }}
          >
            <span>Create Your Invitation</span>
            <ArrowRight
              size={17}
              weight="bold"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {/* Trust Badges Strip */}
        <div
          className="pt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs font-sans"
          style={{ color: theme.trustTextColor }}
        >
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle size={14} weight="fill" className="text-emerald-500" />
            100% Free to Customize First
          </span>
          <span className="hidden sm:inline opacity-30">·</span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle size={14} weight="fill" className="text-emerald-500" />
            No App Download Needed
          </span>
          <span className="hidden sm:inline opacity-30">·</span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle size={14} weight="fill" className="text-emerald-500" />
            Unlimited Revisions Until Wedding
          </span>
        </div>

        {/* Brand Bottom Lockup & Links */}
        <div
          className="pt-6 mt-2 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-sans"
          style={{
            borderColor: theme.bottomBorderColor,
            color: theme.bottomTextColor,
          }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
          >
            <Image
              src={theme.logoVariant === "dark" ? siteConfig.assets.logo : siteConfig.assets.logoWhite}
              alt={siteConfig.name}
              width={100}
              height={28}
              className="h-4 w-auto object-contain"
            />
            <span>• {siteConfig.domain}</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/templates"
              className="transition-colors flex items-center gap-1 hover:opacity-100"
              style={{ color: theme.bottomTextColor }}
            >
              <span>All 16 Templates</span>
              <ArrowUpRight size={11} />
            </Link>
            <span className="opacity-30">·</span>
            <Link
              href="/contact"
              className="transition-colors hover:opacity-100"
              style={{ color: theme.bottomTextColor }}
            >
              Support &amp; Help
            </Link>
            <span className="opacity-30">·</span>
            <Link
              href="/#pricing"
              className="transition-colors hover:opacity-100"
              style={{ color: theme.bottomTextColor }}
            >
              Pricing ({siteConfig.startingPrice})
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TemplateMarketingFooter;
