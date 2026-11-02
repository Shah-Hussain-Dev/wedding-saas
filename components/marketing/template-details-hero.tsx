"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Sparkle,
} from "@phosphor-icons/react";
import type { TemplateMeta } from "@/lib/template-meta";
import type { TemplatePricingDetail } from "@/lib/hooks/use-template-pricing";
import { useEffect, useState } from "react";
import { TemplatePreviewMockup } from "@/components/marketing/template-preview-mockup";

interface TemplateDetailsHeroProps {
  meta: TemplateMeta;
  normalizedId: string;
  pricing: TemplatePricingDetail;
  customizeHref: string;
  interactiveUrl: string;
}

export function TemplateDetailsHero({
  meta,
  normalizedId,
  pricing,
  customizeHref,
  interactiveUrl,
}: TemplateDetailsHeroProps) {
  const [heroPreviewLoaded, setHeroPreviewLoaded] = useState(false);

  useEffect(() => {
    setHeroPreviewLoaded(false);
  }, [interactiveUrl]);

  return (
    <section className="relative border-b border-[#073D31]/8 bg-[#F7F4ED] pt-24 pb-10 sm:pt-28 sm:pb-14 lg:pb-16">
      <div className="page-container">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[#76766F] font-sans">
          <Link href="/" className="hover:text-[#073D31] transition-colors">
            Home
          </Link>
          <span aria-hidden className="text-stone-300">
            ›
          </span>
          <Link href="/templates" className="hover:text-[#073D31] transition-colors">
            Templates
          </Link>
          <span aria-hidden className="text-stone-300">
            ›
          </span>
          <span className="text-[#18211E]">{meta.name}</span>
        </nav>

        <Link
          href="/templates"
          className="mb-8 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#073D31]/15 bg-white px-4 py-2 text-xs font-bold text-[#073D31] shadow-sm transition-all hover:border-[#C8A45E]/40 active:scale-[0.98] font-sans lg:hidden"
        >
          <ArrowLeft size={14} weight="bold" className="text-[#C8A45E]" />
          Back to all templates
        </Link>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="order-1 lg:order-none lg:sticky lg:top-28"
          >
            <div className="flex flex-col items-center lg:items-end">
              <TemplatePreviewMockup
                variant="phone"
                phoneSize="hero"
                src={interactiveUrl}
                title={`${meta.name} live preview`}
                loaded={heroPreviewLoaded}
                onLoad={() => setHeroPreviewLoaded(true)}
              />
              <p className="mt-4 text-center font-sans text-[10px] font-bold uppercase tracking-wider text-stone-400 lg:text-right">
                Tap inside to interact · scroll to explore
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="order-2 max-w-xl"
          >
            <Link
              href="/templates"
              className="mb-6 hidden min-h-[44px] items-center gap-2 rounded-full border border-[#073D31]/15 bg-white px-4 py-2 text-xs font-bold text-[#073D31] shadow-sm transition-all hover:border-[#C8A45E]/40 lg:inline-flex font-sans"
            >
              <ArrowLeft size={14} weight="bold" className="text-[#C8A45E]" />
              Back to all templates
            </Link>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#76766F] font-sans">
              {meta.style} · {meta.religionLabel}
            </p>

            {meta.tag && (
              <span className="mt-3 inline-block rounded-full bg-[#C8A45E]/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#8B6914] font-sans">
                {meta.tag}
              </span>
            )}

            <h1 className="mt-3 font-serif text-3xl font-medium leading-[1.1] text-[#18211E] sm:text-4xl md:text-[2.75rem]">
              {meta.name}
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-[#76766F] font-sans sm:text-base">
              {meta.description.length > 220 ? `${meta.description.slice(0, 220).trim()}…` : meta.description}
            </p>

            <p className="mt-4 flex items-start gap-2 text-sm text-[#073D31] font-sans">
              <Sparkle size={16} weight="fill" className="mt-0.5 shrink-0 text-[#C8A45E]" />
              <span>
                See the real demo before you buy — preview motion, music, and RSVP flow with sample content below.
              </span>
            </p>

            <div className="mt-8 flex flex-wrap items-end gap-3 border-y border-[#073D31]/8 py-6">
              {pricing.isOnSale && (
                <span className="price-font text-lg text-stone-400 line-through decoration-stone-400/80">
                  {pricing.originalPriceFormatted}
                </span>
              )}
              <span suppressHydrationWarning className="price-font text-3xl text-[#18211E] sm:text-4xl">
                {pricing.priceFormatted}
              </span>
              {pricing.isOnSale && (
                <span className="rounded border border-[#C8A45E]/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8B6914] font-sans">
                  Limited offer
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#live-preview"
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#073D31]/20 bg-white px-6 text-sm font-bold text-[#073D31] transition-all hover:border-[#073D31]/40 active:scale-[0.98] font-sans sm:flex-none sm:min-w-[160px]"
              >
                See live demo
              </a>
              <Link
                href={customizeHref}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-[#073D31] px-6 text-sm font-bold text-[#F7F4ED] shadow-[0_8px_24px_rgba(7,61,49,0.2)] transition-all hover:bg-[#032A23] active:scale-[0.98] font-sans sm:flex-none sm:min-w-[180px]"
              >
                Customize this design
                <ArrowUpRight size={16} weight="bold" className="text-[#E1C98E]" />
              </Link>
            </div>

            <ul className="mt-6 space-y-2.5 font-sans">
              {[
                "Personalize names, dates, venues & photos in minutes",
                "Share on WhatsApp with one live link",
                "Try the full interactive demo before you pay",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm text-[#76766F]">
                  <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-[#073D31]" />
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { title: "No design skills needed", desc: "Guided editor with live preview." },
                { title: "Nothing to install", desc: "Works in any mobile browser." },
                { title: "Edit anytime", desc: "Update details even after sharing." },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="text-sm font-bold text-[#18211E] font-sans">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#76766F] font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
