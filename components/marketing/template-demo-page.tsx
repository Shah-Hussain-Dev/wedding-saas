"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { GlassNav } from "@/components/ui/glass-nav";
import { PremiumFooter } from "@/components/ui/premium-footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { SectionFloral } from "@/components/ui/floral-decor";
import {
  getTemplateMeta,
  INCLUDED_FEATURES,
  DEMO_STEPS,
  type TemplateId,
} from "@/lib/template-meta";
import {
  Sparkle,
  ArrowUpRight,
  ArrowLeft,
  Flower,
  Crown,
  Check,
  DeviceMobile,
} from "@phosphor-icons/react";
import { fadeUp, viewportOnce } from "@/components/ui/motion-primitives";
import { useTemplatePricing } from "@/lib/hooks/use-template-pricing";
import { TEMPLATES_MAP, getTemplateDefaultData, NoorNikah } from "@/templates";

interface TemplateDemoPageProps {
  templateId: string;
}

export function TemplateDemoPage({ templateId }: TemplateDemoPageProps) {
  const { getPriceFormatted, getPriceNumber } = useTemplatePricing();
  const normalizedId = (templateId || "").trim().replace(/_/g, "-").toLowerCase();
  const meta = getTemplateMeta(normalizedId);
  const interactiveUrl = `/preview/${normalizedId}/interactive?embed=1`;
  const dynamicPriceFormatted = getPriceFormatted(normalizedId, "₹1,199");
  const dynamicPriceNum = getPriceNumber(normalizedId, 1199);
  const royalPriceFormatted = `₹${(dynamicPriceNum + 300).toLocaleString("en-IN")}`;

  // Direct template rendering data for mobile view
  const templateDefault = getTemplateDefaultData(normalizedId);
  const SelectedTemplate = TEMPLATES_MAP[normalizedId] || NoorNikah;
  const sampleData = {
    ...templateDefault,
    id: `demo-${normalizedId}`,
    slug: normalizedId,
    templateId: normalizedId,
    brideName: templateDefault?.couple?.brideName || templateDefault?.brideName || "Diya",
    groomName: templateDefault?.couple?.groomName || templateDefault?.groomName || "Shaan",
    couple: {
      ...templateDefault?.couple,
      brideName: templateDefault?.couple?.brideName || templateDefault?.brideName || "Diya",
      groomName: templateDefault?.couple?.groomName || templateDefault?.groomName || "Shaan",
    },
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-[#1A1A1A]">
      {/* ─────────────────────────────────────────────────────────────
          1. MOBILE EXPERIENCE (< lg): DIRECT FULLSCREEN PREVIEW & CLEAN FLOW
          ───────────────────────────────────────────────────────────── */}
      <div className="block lg:hidden relative min-h-[100dvh] w-full bg-[#0E1513]">
        {/* Sticky Mobile Top Navigation Bar (In normal flow, never overlaps template tabs) */}
        <header className="sticky top-0 inset-x-0 z-50 bg-[#0E1513]/95 backdrop-blur-md border-b border-white/10 px-3 py-2.5 flex items-center justify-between text-white shadow-lg">
          <Link
            href="/templates"
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Templates</span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 min-w-0 px-2">
            <Sparkle size={12} weight="fill" className="text-amber-400 shrink-0" />
            <span className="truncate max-w-[130px]">{meta.name}</span>
          </div>

          <Link
            href={`/customize/${normalizedId}`}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md flex items-center gap-1 active:scale-95 transition-transform shrink-0"
          >
            <span>Customize</span>
            <ArrowUpRight size={13} weight="bold" />
          </Link>
        </header>

        {/* Direct Mobile Template Render (Full clearance for tabs, envelope seal & audio button) */}
        <div className="relative w-full min-h-[100dvh]">
          <SelectedTemplate data={sampleData} />
        </div>

        {/* End of Preview Call to Action */}
        <div className="p-5 bg-stone-950 text-white border-t border-white/10 text-center space-y-3 pb-[max(24px,env(safe-area-inset-bottom))]">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
            <Sparkle size={13} weight="fill" />
            <span>Ready to make this invitation yours?</span>
          </div>
          <p className="text-stone-300 text-xs max-w-xs mx-auto leading-relaxed">
            Personalize names, dates, events, venue location, soundtrack, and guest RSVP tracking in 2 minutes.
          </p>
          <Link
            href={`/customize/${normalizedId}`}
            className="block w-full py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm shadow-xl active:scale-98 transition-transform"
          >
            Customize This Design — {dynamicPriceFormatted}
          </Link>
          <div className="flex items-center justify-center gap-4 text-[11px] text-stone-400 pt-1">
            <span>✓ Instant Live Link</span>
            <span>✓ WhatsApp RSVP</span>
            <span>✓ 100% Free to Try</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. DESKTOP EXPERIENCE (>= lg): EXISTING SPLIT VIEW & DETAILS
          ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block">
        <GlassNav />

        {/* ── Hero split ── */}
        <section className="relative pt-28 pb-16 md:pb-20 overflow-hidden">
          <SectionFloral variant="minimal" />

          <div className="page-container relative z-[1]">
            <Link
              href="/templates"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-accent-gold transition-colors mb-8"
            >
              <ArrowLeft size={14} />
              Back to templates
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Phone mockup */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                className="flex justify-center lg:justify-end lg:sticky lg:top-28"
              >
                <DemoPhoneFrame src={interactiveUrl} templateName={meta.name} />
              </motion.div>

              {/* Product info */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
                className="max-w-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkle size={14} weight="fill" className="text-accent-gold" />
                  <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-stone-400">
                    Try the interactive demo
                  </span>
                </div>

                {meta.tag && (
                  <span className="inline-block text-[9px] uppercase tracking-wider font-bold bg-accent-gold/10 text-accent-gold px-2.5 py-1 rounded-full mb-3">
                    {meta.tag}
                  </span>
                )}

                <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] leading-[1.08] mb-4">
                  {meta.name}
                </h1>

                <p className="text-sm md:text-base text-stone-500 leading-relaxed mb-8">
                  {meta.description}
                </p>

                {/* Primary Try-Before-You-Buy Action */}
                <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold uppercase tracking-wider mb-0.5">
                      <Sparkle size={14} weight="fill" className="text-amber-600" />
                      <span>Try Before You Buy — 100% Free</span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Input your real names, dates &amp; ceremonies to see your live invitation demo right now.
                    </p>
                  </div>
                  <Link href={`/customize/${normalizedId}`} className="w-full sm:w-auto shrink-0">
                    <PremiumButton className="w-full justify-center !py-2.5 !px-5 text-xs font-bold shadow-md hover:scale-105">
                      Enter Details Free
                    </PremiumButton>
                  </Link>
                </div>

                {/* Single All-Inclusive Admin Updated Price Card */}
                <div className="rounded-2xl border border-accent-gold/35 bg-gradient-to-br from-[#FCFAF6] via-white to-accent-gold-light/20 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/15">
                        <Crown size={22} weight="fill" className="text-[#073D31]" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-accent-gold block mb-0.5">
                          Complete Digital Invitation
                        </span>
                        <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">{meta.name}</h3>
                        <p className="text-xs text-stone-500 mt-0.5">Full animated motion, RSVP, music &amp; map</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-[#073D31] block">
                        {dynamicPriceFormatted}
                      </span>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                        One-Time Payment
                      </span>
                    </div>
                  </div>

                  <Link href={`/customize/${normalizedId}`} className="block">
                    <PremiumButton className="w-full justify-center !py-3 text-sm font-semibold shadow-md hover:scale-[1.01] active:scale-[0.99]">
                      <span>Customize This Design</span>
                      <ArrowUpRight size={15} weight="bold" />
                    </PremiumButton>
                  </Link>

                  <div className="mt-4 pt-3.5 border-t border-black/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 font-sans">
                    <span className="flex items-center gap-1">
                      <Check size={13} weight="bold" className="text-emerald-600" /> Unlimited Guests
                    </span>
                    <span className="flex items-center gap-1">
                      <Check size={13} weight="bold" className="text-emerald-600" /> WhatsApp Ready
                    </span>
                    <span className="flex items-center gap-1">
                      <Check size={13} weight="bold" className="text-emerald-600" /> Instant Digital Delivery
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <Link
                    href={`/preview/${normalizedId}/interactive`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent-gold transition-colors"
                  >
                    <DeviceMobile size={16} />
                    Open sample preview
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Included + How it works ── */}
        <section className="relative border-t border-black/[0.05] bg-white py-16 md:py-20">
          <SectionFloral variant="corners" />
          <div className="page-container relative z-[1]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
                <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] mb-6">
                  Everything included in your invitation
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {INCLUDED_FEATURES.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-stone-600">
                      <Check size={16} weight="bold" className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
                <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] mb-6">How it works</h2>
                <div className="space-y-6">
                  {DEMO_STEPS.map((step) => (
                    <div key={step.num} className="flex gap-4">
                      <span className="shrink-0 h-8 w-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                        {step.num}
                      </span>
                      <div>
                        <h3 className="font-semibold text-[#1A1A1A] text-sm">{step.title}</h3>
                        <p className="text-sm text-stone-500 mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Other templates ── */}
        <section className="py-16 bg-[#FCFBF7] border-t border-black/[0.04]">
          <div className="page-container text-center">
            <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400 mb-4">Explore more</p>
            <div className="flex flex-wrap justify-center gap-3">
              {(["emerald-noir", "royal-elegance", "modern-minimal"] as TemplateId[]).map((id) => {
                const t = getTemplateMeta(id);
                if (id === normalizedId) return null;
                return (
                  <Link
                    key={id}
                    href={`/preview/${id}`}
                    className="px-5 py-2.5 rounded-full border border-black/[0.06] bg-white text-sm font-medium text-stone-600 hover:border-accent-gold/30 hover:text-accent-gold transition-all"
                  >
                    {t.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <PremiumFooter />
      </div>
    </div>
  );
}

function DemoPhoneFrame({ src, templateName }: { src: string; templateName: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-[280px] sm:w-[300px] md:w-[320px]">
      <div className="absolute -inset-6 bg-gradient-to-b from-accent-gold/10 via-transparent to-primary/5 rounded-full blur-2xl -z-10" />

      <div className="rounded-[2.75rem] border-[5px] border-[#1a1a1a] bg-[#1a1a1a] shadow-[0_30px_80px_rgba(8,47,39,0.18)] p-[3px]">
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[28%] h-[22px] bg-[#1a1a1a] rounded-full z-20 pointer-events-none" />

        <div className="relative rounded-[2.4rem] overflow-hidden aspect-[9/19.5] bg-[#082F27]">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FCFBF7] z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="h-8 w-8 rounded-full border-2 border-accent-gold/30 border-t-accent-gold mb-3"
              />
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Loading demo…</span>
            </div>
          )}

          <iframe
            src={src}
            title={`${templateName} interactive demo`}
            onLoad={() => setLoaded(true)}
            className="absolute inset-0 w-full h-full border-0 bg-white"
            allow="autoplay"
          />
        </div>
      </div>

      <p className="text-center text-[10px] uppercase tracking-wider text-stone-400 font-bold mt-5">
        Tap inside to interact · scroll to explore
      </p>
    </div>
  );
}

function PlanCard({
  icon: Icon,
  label,
  subtitle,
  price,
  priceNote,
  badge,
  highlighted,
  href,
  cta,
}: {
  icon: typeof Flower;
  label: string;
  subtitle: string;
  price: string;
  priceNote: string;
  badge?: string;
  highlighted?: boolean;
  href: string;
  cta: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-shadow hover:shadow-md ${
        highlighted
          ? "border-accent-gold/25 bg-gradient-to-br from-accent-gold-light/40 to-white"
          : "border-black/[0.06] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${highlighted ? "bg-accent-gold/15 text-accent-gold" : "bg-primary/5 text-primary"}`}>
            <Icon size={20} weight="light" />
          </div>
          <div>
            {badge && (
              <span className="text-[8px] uppercase tracking-wider font-bold text-accent-gold block mb-0.5">{badge}</span>
            )}
            <h3 className="font-serif text-lg text-[#1A1A1A]">{label}</h3>
            <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="font-serif text-xl font-bold text-primary block">{price}</span>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider">{priceNote}</span>
        </div>
      </div>
      <Link href={href}>
        <PremiumButton className={`w-full justify-center text-sm ${highlighted ? "" : "bg-primary"}`}>
          {cta}
        </PremiumButton>
      </Link>
    </div>
  );
}
