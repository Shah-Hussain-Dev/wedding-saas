"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SectionHeader } from "@/components/ui/section-header";
import { DecorSection, HeaderDecor } from "@/components/decor/section-decor";
import { DoubleBezelCard } from "@/components/ui/double-bezel-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { fadeUp, viewportOnce } from "@/components/ui/motion-primitives";
import { Check, Lock, Crown, Sparkle } from "@phosphor-icons/react";

const CLASSIC_FEATURES = [
  "6 Premium Animated Templates",
  "1 Invitation Webpage Link",
  "Unlimited Edits Until Wedding",
  "Guest RSVP Inbox",
  "Music, Photos & Uploads",
  "Google Maps & Multi-Language",
  "Free Animated Envelope Reveal",
];

const ROYAL_FEATURES = [
  "ALL Classic + Royal Templates",
  "3D Door & Curtain Reveals",
  "Cinematic Hero Backgrounds",
  "Premium Motion Storytelling",
];

function PricingCard({
  title,
  description,
  price,
  features,
  featureVariant,
  headerLabel,
  headerAccent,
  cta,
  ctaVariant,
  featured,
}: {
  title: string;
  description: string;
  price: string;
  features: string[];
  featureVariant: "emerald" | "gold";
  headerLabel: string;
  headerAccent: string;
  cta: string;
  ctaVariant: "primary" | "royal" | "outline";
  featured?: boolean;
}) {
  const checkColor = featureVariant === "gold" ? "text-accent-gold" : "text-emerald-600";

  return (
    <DoubleBezelCard
      fullHeight
      className={`relative flex h-full flex-col !p-0 overflow-hidden ${
        featured
          ? "border-2 border-accent-gold/25 bg-gradient-to-b from-accent-gold-light/40 via-white to-white shadow-[0_8px_40px_-12px_rgba(184,151,48,0.25)]"
          : "bg-white"
      }`}
    >
      {featured && (
        <>
          <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-accent-gold/10 blur-3xl" aria-hidden />
          <div className="absolute top-4 right-4">
            <Crown size={22} weight="fill" className="text-accent-gold/35" />
          </div>
        </>
      )}

      <div className="flex flex-1 flex-col p-6 md:p-8">
        {/* Header block — fixed min height for alignment */}
        <div className={`min-h-[108px] ${!featured ? "pt-8" : ""}`}>
          {featured && (
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-gold">
              <Sparkle size={12} weight="fill" />
              Most popular
            </span>
          )}
          <span className={`text-[10px] uppercase tracking-wider font-bold ${headerAccent}`}>
            {headerLabel}
          </span>
          <h3 className="mt-2 font-serif text-2xl text-[#1A1A1A]">{title}</h3>
          <p className="mt-1 text-sm text-stone-500">{description}</p>
        </div>

        {/* Price block — fixed min height */}
        <div className="min-h-[72px] border-b border-black/[0.05] py-5">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-4xl font-bold tracking-tight text-primary">{price}</span>
            <span className="text-xs text-stone-400">one-time</span>
          </div>
        </div>

        {/* Features — grows to fill, pushes CTA down */}
        <ul
          className={`flex-1 space-y-3 py-6 text-sm text-stone-600 ${
            featured ? "border-accent-gold/10" : "border-stone-100"
          }`}
        >
          {featured && (
            <li className="pb-1 text-xs font-semibold uppercase tracking-wide text-accent-gold">
              Everything in Classic, plus:
            </li>
          )}
          {features.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <Check className={`mt-0.5 h-4 w-4 shrink-0 ${checkColor}`} weight="bold" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* CTA pinned to bottom */}
        <div className="mt-auto pt-2">
          <Link href="/templates" className="block">
            <PremiumButton variant={ctaVariant} className="w-full justify-center">
              {cta}
            </PremiumButton>
          </Link>
        </div>
      </div>
    </DoubleBezelCard>
  );
}

export function PricingSection() {
  return (
    <DecorSection id="pricing" preset="pricing" className="section-padding bg-surface-muted">
      <div className="page-container max-w-4xl">
        <SectionHeader
          eyebrow="Choose your plan"
          title="We have a plan for every couple"
          subtitle="Elegant classic invitations or immersive cinematic luxury experiences."
        />
        <HeaderDecor preset="pricing" />

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-8">
          <motion.div
            className="h-full"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            <PricingCard
              headerLabel="Classic"
              headerAccent="text-stone-400"
              title="WedInvites Classic"
              description="Elegant animated invitations."
              price="₹1,199"
              features={CLASSIC_FEATURES}
              featureVariant="emerald"
              cta="Start with Classic"
              ctaVariant="primary"
            />
          </motion.div>

          <motion.div
            className="h-full"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ delay: 0.08 }}
          >
            <PricingCard
              featured
              headerLabel="Royal · Premium"
              headerAccent="text-accent-gold"
              title="WedInvites Royal"
              description="Cinematic luxury motion experiences."
              price="₹1,499"
              features={ROYAL_FEATURES}
              featureVariant="gold"
              cta="Unlock Royal Experience"
              ctaVariant="royal"
            />
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-8 rounded-2xl border border-black/[0.04] bg-white px-5 py-4 text-center text-sm text-stone-500 shadow-sm"
        >
          Already have Classic?{" "}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 font-semibold text-accent-gold hover:underline"
          >
            <Lock size={13} /> Upgrade to Royal
          </Link>
        </motion.div>
        <p className="mt-4 text-center text-xs text-stone-400">
          Secure Razorpay checkout · 100% money-back within 7 days
        </p>
      </div>
    </DecorSection>
  );
}
