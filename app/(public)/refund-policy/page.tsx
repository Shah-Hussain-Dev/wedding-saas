import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  SealCheck,
  Headset,
  WarningCircle,
  ArrowRight,
  WhatsappLogo,
  EnvelopeSimple,
  Sparkle,
  ArrowsClockwise,
  ShieldCheck,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: `Cancellation & Refund Policy — ${siteConfig.name}`,
  description:
    `${siteConfig.name} digital purchase policy: all sales are final and non-refundable, fully backed by our 100% white-glove Concierge Help and Support Guarantee.`,
};

export default function RefundPolicyPage() {
  return (
    <div className="py-24 sm:py-36 bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#073D31] uppercase font-sans backdrop-blur-md">
            <SealCheck size={14} weight="fill" className="text-[#C8A45E]" />
            <span>Fair Terms &amp; Support Guarantee</span>
            <SealCheck size={14} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h1 className="font-serif text-3.5xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#18211E] leading-[1.1]">
            Cancellation &amp; Refund Policy
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#76766F] font-sans max-w-xl mx-auto leading-relaxed">
            Last updated: October 2026 · Transparent terms regarding digital purchases and our unwavering commitment to couple support.
          </p>
        </div>

        {/* HERO BANNER: NO REFUND POLICY + 100% SUPPORT COMMITMENT */}
        <div className="relative p-7 sm:p-10 rounded-3xl bg-gradient-to-br from-[#073D31] to-[#04241D] text-[#F7F4ED] shadow-xl border border-[#C8A45E]/30 overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(200,164,94,0.18)_0%,transparent_70%)] pointer-events-none" />

          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#E1C98E] tracking-widest font-bold">
            <Headset size={16} weight="fill" />
            <span>Purchase Policy &amp; Concierge Promise</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white">
            No Refund Policy on Purchases — Backed by 100% Dedicated Help &amp; Support.
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-stone-300 font-sans leading-relaxed max-w-2xl">
            <p>
              Because WedInvites provides <strong>instant digital fulfillment</strong> — immediately provisioning your custom template code, dedicated vanity domain slug, high-speed cloud CDN hosting, and RSVP collection engines upon checkout — <strong>all sales and purchases are strictly non-refundable and final once completed</strong>.
            </p>
            <p>
              However, you are never on your own. We stand firmly behind every couple with our <strong>100% Concierge Help &amp; Technical Support Guarantee</strong>. If you experience any challenge, confusion, or need custom adjustments, our support engineers will actively step in to assist and resolve it until your wedding invitation is completely flawless.
            </p>
          </div>

          {/* 3 SUPPORT PROMISES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-sans">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1">
              <span className="font-bold text-[#E1C98E] block">Unlimited Revisions</span>
              <p className="text-[11px] text-stone-300 leading-snug">
                Event dates, itineraries, venues, and audio tracks can be edited unlimited times until your wedding day at zero cost.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1">
              <span className="font-bold text-[#E1C98E] block">White-Glove Help</span>
              <p className="text-[11px] text-stone-300 leading-snug">
                Stuck on formatting or audio? Our concierge team will directly format and tune your invitation for you.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1">
              <span className="font-bold text-[#E1C98E] block">Rapid Concierge SLA</span>
              <p className="text-[11px] text-stone-300 leading-snug">
                Priority email support with average response times under 2 hours.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8A45E] hover:bg-[#E1C98E] text-[#032A23] text-xs font-bold tracking-wider font-sans transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <span>Contact Support Team</span>
              <ArrowRight size={13} weight="bold" />
            </Link>
          </div>
        </div>

        {/* POLICY CHAPTERS */}
        <div className="space-y-6 text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
          {/* Section 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <WarningCircle size={22} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                1. Nature of Instant Digital Goods &amp; Non-Refundability
              </h2>
            </div>
            <p>
              WedInvites creates personalized, software-driven digital celebration portals. When a payment is completed:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 pt-1 text-stone-700">
              <li>Your unique web URL slug (e.g. <code>wedinvites.in/your-name</code>) is permanently registered and locked for your celebration.</li>
              <li>High-availability cloud media buckets, PostgreSQL database rows, and edge servers are provisioned immediately.</li>
              <li>Proprietary 3D animation code, shaders, and licensed soundtrack engines become accessible for immediate distribution to your guests.</li>
            </ul>
            <p className="pt-2">
              Because these digital assets cannot be &ldquo;returned&rdquo; like physical goods, <strong>we do not offer refunds, partial refunds, or chargebacks once an order is placed and digital access is unlocked</strong>.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <Headset size={22} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                2. How We Support You if You Encounter Any Issues
              </h2>
            </div>
            <p>
              While purchases are non-refundable, our team guarantees that no couple is left dissatisfied. If you run into any hurdle, our engineering and concierge team provides active resolution:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 pt-1 text-stone-700">
              <li>
                <strong>Date &amp; Venue Postponements:</strong> If your wedding schedule or location changes due to unforeseen events, you do not need to buy a new invitation. Simply update your dates and venue details in your dashboard, or ask our concierge to update it for you free of charge.
              </li>
              <li>
                <strong>Custom Audio Tuning:</strong> If you want a specific family song, qawwali, or instrumental piece synced to your page, send us the file and our audio team will balance and link it.
              </li>
              <li>
                <strong>Layout &amp; Device Compatibility:</strong> If an older device or guest browser experiences rendering issues, our frontend engineering team will test and resolve the compatibility issue.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <ArrowsClockwise size={22} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                3. Erroneous Duplicate Payment Protection
              </h2>
            </div>
            <p>
              In the rare event that you are charged twice due to a network interruption, bank glitch, or accidental double-click during Razorpay checkout:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 pt-1 text-stone-700">
              <li>We will gladly verify the duplicate transaction record against our payment logs.</li>
              <li>100% of the duplicate transaction amount will be refunded directly to your original payment method (bank account, credit card, or UPI) within <strong>5 to 7 business days</strong>.</li>
            </ul>
            <p className="pt-2">
              To request a duplicate charge verification, email your transaction details to <a href={`mailto:${siteConfig.email.support}`} className="text-[#073D31] font-bold underline">{siteConfig.email.support}</a> with subject &ldquo;Duplicate Charge Verification&rdquo;.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <EnvelopeSimple size={22} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                4. Contact Concierge &amp; Priority Help Desk
              </h2>
            </div>
            <p>
              We are committed to making your celebration magical. Reach our support desk through any of the following channels:
            </p>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2 text-xs">
              <p><strong>{siteConfig.name} Support &amp; Concierge Sanctuary</strong></p>
              <p>General Support Email: <a href={`mailto:${siteConfig.email.support}`} className="text-[#073D31] font-bold underline">{siteConfig.email.support}</a></p>
              <p>Billing Inquiries: <a href={`mailto:${siteConfig.email.support}`} className="text-[#073D31] font-bold underline">{siteConfig.email.support}</a></p>
              <p>Support Hours: {siteConfig.supportHours}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
