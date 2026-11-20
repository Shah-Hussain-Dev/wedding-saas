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
  "sheesh-mahal": {
    accentColor: "#c9a45c",
    accentSoft: "#e6cf98",
    headingColor: "#f5efe2",
    bodyColor: "#eef3f0",
    cardBg: "bg-white/[0.04]",
    cardBorder: "border-[#c9a45c]/20",
    cardHoverBorder: "#c9a45c",
    chipBg: "bg-[#0b4a3b]/40",
    chipBorder: "border-[#c9a45c]/35",
    chipText: "#e6cf98",
    secondaryBtnBg: "bg-white/[0.07] hover:bg-white/[0.12]",
    secondaryBtnBorder: "border-[#c9a45c]/30 hover:border-[#c9a45c]/60",
    secondaryBtnText: "#f5efe2",
    trustTextColor: "#eef3f0",
    bottomTextColor: "#c9a45c",
    bottomBorderColor: "rgba(201, 164, 92, 0.15)",
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
      className={`w-full relative py-6 sm:py-8 px-3 sm:px-6 bg-transparent text-inherit ${className}`}
    >
      {/* Ornamental Transition Motif */}
      <div className="flex items-center justify-center gap-2.5 pb-4 sm:pb-5 opacity-40" aria-hidden="true">
        <span
          className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent via-current to-transparent"
          style={{ color: theme.accentColor }}
        />
        <span
          className="text-[10px] tracking-[0.25em] font-serif select-none"
          style={{ color: theme.accentColor }}
        >
          ✦ ❖ ✦
        </span>
        <span
          className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent via-current to-transparent"
          style={{ color: theme.accentColor }}
        />
      </div>

      <div className="max-w-xl mx-auto relative z-10 text-center">
        {/* Sleek, Compact Frosted Glass Atelier Plaque */}
        <div
          className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 ${theme.cardBg} ${theme.cardBorder} backdrop-blur-xl border shadow-xl relative overflow-hidden space-y-3.5`}
        >
          {/* Subtle Ambient Radial Highlight */}
          <div
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-2xl pointer-events-none opacity-20"
            style={{ backgroundColor: theme.accentColor }}
            aria-hidden="true"
          />

          {/* Minimal Eyebrow */}
          <div className="flex items-center justify-center">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${theme.chipBg} ${theme.chipBorder} text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.18em] uppercase font-sans`}
              style={{ color: theme.chipText }}
            >
              <Sparkle size={11} weight="fill" style={{ color: theme.accentColor }} />
              <span>WedInvites Atelier</span>
              <Sparkle size={11} weight="fill" style={{ color: theme.accentColor }} />
            </span>
          </div>

          {/* Precise & Elegant Headline */}
          <div className="space-y-1">
            <h3
              className="font-serif text-lg sm:text-2xl font-normal leading-snug tracking-tight"
              style={{ color: theme.headingColor }}
            >
              {hasCouple ? (
                <>
                  Loved this celebration?{" "}
                  <span className="italic opacity-90 block sm:inline" style={{ color: theme.accentColor }}>
                    Create yours for your special day.
                  </span>
                </>
              ) : (
                <>
                  Create an unforgettable 3D wedding website
                </>
              )}
            </h3>
            <p
              className="text-[11px] sm:text-xs font-sans max-w-md mx-auto leading-relaxed opacity-85"
              style={{ color: theme.bodyColor }}
            >
              Interactive 3D palace gates, royal soundscapes &amp; instant WhatsApp RSVPs.
            </p>
          </div>

          {/* Sleek Feature Micro-Chips (replaces bulky stacked cards) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-0.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] sm:text-[11px] font-medium ${theme.chipBg} border ${theme.cardBorder}`}
              style={{ color: theme.headingColor }}
            >
              <Sparkle size={12} weight="fill" style={{ color: theme.accentColor }} />
              <span>16+ Royal Themes</span>
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] sm:text-[11px] font-medium ${theme.chipBg} border ${theme.cardBorder}`}
              style={{ color: theme.headingColor }}
            >
              <WhatsappLogo size={12} weight="fill" className="text-emerald-400" />
              <span>1-Click WhatsApp Share</span>
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] sm:text-[11px] font-medium ${theme.chipBg} border ${theme.cardBorder}`}
              style={{ color: theme.headingColor }}
            >
              <ShieldCheck size={12} weight="fill" style={{ color: theme.accentColor }} />
              <span>Flat {siteConfig.startingPrice} · Lifetime</span>
            </span>
          </div>

          {/* Refined Luxury CTA Button */}
          <div className="pt-0.5 flex items-center justify-center">
            <Link
              href="/"
              className="group relative w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-full font-sans text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-95 cursor-pointer shadow-md overflow-hidden"
              style={{
                backgroundColor: theme.accentColor,
                color: theme.isLight ? "#FFFFFF" : "#1A1A1A",
                boxShadow: `0 8px 24px ${theme.accentColor}35`,
              }}
            >
              <span>Create Your Invitation</span>
              <ArrowRight
                size={14}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Compact Trust Micro-Row */}
          <div
            className="flex items-center justify-center gap-2 text-[10.5px] font-sans opacity-75"
            style={{ color: theme.trustTextColor }}
          >
            <CheckCircle size={12} weight="fill" className="text-emerald-400 shrink-0" />
            <span>100% Free to customize first</span>
            <span className="opacity-40">·</span>
            <span>No app download needed</span>
          </div>

          {/* Streamlined Brand Footer Bar */}
          <div
            className="pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] font-sans opacity-70"
            style={{
              borderColor: theme.bottomBorderColor,
              color: theme.bottomTextColor,
            }}
          >
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:opacity-100 transition-opacity"
            >
              <Image
                src={theme.logoVariant === "dark" ? siteConfig.assets.logo : siteConfig.assets.logoWhite}
                alt={siteConfig.name}
                width={70}
                height={20}
                className="h-3.5 w-auto object-contain"
              />
              <span>• {siteConfig.domain}</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/templates"
                className="hover:opacity-100 transition-opacity flex items-center gap-0.5"
              >
                <span>Templates</span>
                <ArrowUpRight size={10} />
              </Link>
              <span className="opacity-40">·</span>
              <Link href="/contact" className="hover:opacity-100 transition-opacity">
                Support
              </Link>
              <span className="opacity-40">·</span>
              <Link href="/#pricing" className="hover:opacity-100 transition-opacity">
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TemplateMarketingFooter;
