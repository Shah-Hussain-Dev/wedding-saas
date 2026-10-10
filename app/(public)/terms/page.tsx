import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  Scroll,
  ShieldCheck,
  Headset,
  TrashSimple,
  Sparkle,
  LockKey,
  Scales,
  FileText,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: `Terms of Service & Conditions — ${siteConfig.name}`,
  description:
    `Read the terms governing the use of ${siteConfig.name} interactive digital wedding stationery platform, digital licenses, no-refund policies, and couple data rights.`,
};

export default function TermsPage() {
  return (
    <div className="py-24 sm:py-36 bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#073D31] uppercase font-sans backdrop-blur-md">
            <Scroll size={14} weight="fill" className="text-[#C8A45E]" />
            <span>Legal Agreement</span>
            <Scroll size={14} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h1 className="font-serif text-3.5xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#18211E] leading-[1.1]">
            Terms of Service
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#76766F] font-sans max-w-xl mx-auto leading-relaxed">
            Last updated: October 2026 · Standard terms governing your use of {siteConfig.name} digital invitations, software engines, and hosted celebration portals on {siteConfig.domain}.
          </p>
        </div>

        {/* SUMMARY HIGHLIGHTS BAR */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-sans">
          <div className="space-y-1">
            <span className="font-bold text-[#073D31] uppercase tracking-wider text-[10.5px] block">
              1. One-Time Payment
            </span>
            <p className="text-stone-600">
              Clear one-time fee from ₹1,199. No hidden recurring subscriptions, storage bills, or monthly charges.
            </p>
          </div>
          <div className="space-y-1 sm:border-x border-stone-200 sm:px-4">
            <span className="font-bold text-[#073D31] uppercase tracking-wider text-[10.5px] block">
              2. No-Refund &amp; Full Support
            </span>
            <p className="text-stone-600">
              Digital goods are non-refundable once unlocked. Backed by dedicated 100% white-glove Concierge Support.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-[#073D31] uppercase tracking-wider text-[10.5px] block">
              3. Total Data Sovereignty
            </span>
            <p className="text-stone-600">
              You own all uploaded content. You can delete your invitations, media, and RSVP lists anytime from your dashboard.
            </p>
          </div>
        </div>

        {/* TERMS CHAPTERS */}
        <div className="space-y-6 text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
          {/* Chapter 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <FileText size={20} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                1. Acceptance of Terms &amp; Platform Scope
              </h2>
            </div>
            <p>
              By accessing, browsing, or purchasing services on <strong>{siteConfig.domain}</strong> (&ldquo;{siteConfig.name}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), you (&ldquo;User&rdquo;, &ldquo;Host&rdquo;, &ldquo;Couple&rdquo;) agree to be legally bound by these Terms of Service. {siteConfig.name} provides interactive digital wedding invitation webpages featuring 3D animations, wax seal mechanics, synchronized music, Google Maps venue links, and real-time guest RSVP portals.
            </p>
          </div>

          {/* Chapter 2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <Headset size={20} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                2. Fees, Digital Fulfillment &amp; No-Refund Policy
              </h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-stone-700">
              <li>
                <strong>One-Time Investment:</strong> Template access is granted on a transparent one-time purchase basis. Hosting and interactive guest access remain active for your wedding celebration without recurring monthly subscriptions.
              </li>
              <li>
                <strong>Instant Digital Delivery:</strong> Upon successful transaction via Razorpay, your couple dashboard, template editor, custom web slug, and cloud storage activate immediately.
              </li>
              <li>
                <strong>Strict No-Refund Policy:</strong> Because custom software codes, server allocations, and digital web assets are deployed instantaneously, all sales and purchases are strictly non-refundable and final once completed. Please read our full <Link href="/refund-policy" className="text-[#073D31] font-bold underline">Cancellation &amp; Refund Policy</Link>.
              </li>
              <li>
                <strong>Support Guarantee:</strong> While fees are non-refundable, {siteConfig.name} provides dedicated Concierge &amp; Engineering Support to resolve any technical hurdle, audio sync, or itinerary formatting concern until you are delighted.
              </li>
            </ul>
          </div>

          {/* Chapter 3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <Sparkle size={20} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                3. Unlimited Revisions &amp; Host Sovereignty
              </h2>
            </div>
            <p>
              Couples retain the freedom to edit their invitation details — including ceremony schedules, event timings, venue map locations, photo galleries, and audio tracks — an unlimited number of times leading up to their wedding day through their self-serve dashboard at zero additional cost.
            </p>
          </div>

          {/* Chapter 4 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <TrashSimple size={20} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                4. User Content Ownership &amp; Self-Serve Data Deletion
              </h2>
            </div>
            <p>
              You retain 100% copyright and intellectual ownership of all personal photographs, text, videos, and guest messages you upload. By uploading content, you grant {siteConfig.name} only the limited technical license necessary to display, host, and render your invitation webpage for your guests.
            </p>
            <p className="pt-1 font-semibold text-stone-800">
              In accordance with our Privacy Policy, you have the unilateral right to permanently delete your invitations, media assets, and guest RSVP manifests directly from your dashboard at any time, with immediate database purging.
            </p>
          </div>

          {/* Chapter 5 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <LockKey size={20} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                5. Intellectual Property of Platform &amp; Templates
              </h2>
            </div>
            <p>
              The 3D interactive graphics, custom shaders, palace door mechanics, proprietary software engines, design trademarks, and layout code of {siteConfig.name} are the exclusive intellectual property of {siteConfig.legalName}. Users may not copy, reverse-engineer, decompile, scrape, or resell template engines or code.
            </p>
          </div>

          {/* Chapter 6 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <Scales size={20} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                6. Service Availability &amp; Limitation of Liability
              </h2>
            </div>
            <p>
              We maintain high availability across globally distributed CDN edge networks. While we take every reasonable measure to ensure uninterrupted uptime, {siteConfig.name} is provided &ldquo;as is&rdquo; without warranties of error-free operation during third-party telecom disruptions. In no event shall {siteConfig.name}&apos;s aggregate liability exceed the total fee paid by the User for the specific invitation service.
            </p>
          </div>

          {/* Chapter 7 */}
          {/* <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <ShieldCheck size={20} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                7. Legal Notices &amp; Concierge Contact
              </h2>
            </div>
            <p>
              For legal inquiries, terms clarifications, or enterprise partnerships, reach out to our legal and concierge team:
            </p>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1 text-xs">
              <p><strong>WedInvites Technologies Legal Desk</strong></p>
              <p>Email: <a href="mailto:support@wedinvites.in" className="text-[#073D31] font-bold underline">support@wedinvites.in</a></p>
              <p>Website: <a href="https://wedinvites.in" className="text-[#073D31] font-bold underline">wedinvites.in</a></p>
              <p>Governing Law: Jurisdiction of Courts in Hyderabad, India</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
