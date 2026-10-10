import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  Lightning,
  Sparkle,
  QrCode,
  CheckCircle,
  ShareNetwork,
  Clock,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: `Instant Digital Delivery Policy — ${siteConfig.name}`,
  description:
    `Learn about ${siteConfig.name} 100% digital fulfillment architecture: zero shipping delays, zero paper waste, and instant live invitation link delivery within seconds of checkout.`,
};

export default function ShippingPage() {
  return (
    <div className="py-24 sm:py-36 bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#073D31] uppercase font-sans backdrop-blur-md">
            <Lightning size={14} weight="fill" className="text-[#C8A45E]" />
            <span>Fulfillment &amp; Delivery Policy</span>
            <Lightning size={14} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h1 className="font-serif text-3.5xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#18211E] leading-[1.1]">
            Instant Digital Delivery
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#76766F] font-sans max-w-xl mx-auto leading-relaxed">
            Zero physical courier delays or transit losses. Your interactive invitation portal is live and accessible globally within seconds of payment verification.
          </p>
        </div>

        {/* DELIVERY HIGHLIGHT STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-6 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-2">
            <Clock size={24} weight="fill" className="text-[#C8A45E] mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-[#18211E]">0 Seconds</h3>
            <p className="text-xs text-stone-600 font-sans">
              Instantaneous automated cloud provisioning upon Razorpay payment.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-2">
            <ShareNetwork size={24} weight="fill" className="text-[#C8A45E] mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-[#18211E]">1-Click Delivery</h3>
            <p className="text-xs text-stone-600 font-sans">
              Share directly with hundreds of wedding guests via WhatsApp, SMS, or QR code.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-2">
            <QrCode size={24} weight="fill" className="text-[#C8A45E] mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-[#18211E]">300 DPI Vector</h3>
            <p className="text-xs text-stone-600 font-sans">
              Print-ready high-resolution QR graphics for wedding reception table standees.
            </p>
          </div>
        </div>

        {/* POLICY CHAPTERS */}
        <div className="space-y-6 text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
          {/* Section 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
              1. 100% Digital Architecture &amp; Zero Physical Courier Delays
            </h2>
            <p>
              WedInvites is an eco-friendly digital software platform. We do not manufacture or ship physical paper invitation boxes or printed cards. By operating completely digitally:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 pt-1 text-stone-700">
              <li>You avoid expensive paper printing costs (averaging ₹25,000 to ₹80,000) and multi-week print shop delays.</li>
              <li>You eliminate lost postal packages and high domestic/international courier transit fees.</li>
              <li>Guests across the globe in Mumbai, London, Dubai, or New York receive their invitation at the exact same instant with zero shipping wait.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
              2. How Delivery Works Step-by-Step
            </h2>
            <ol className="list-decimal pl-5 space-y-2 pt-1 text-stone-700">
              <li>
                <strong>Immediate Activation:</strong> The instant your payment is confirmed, your couple dashboard unlocks with your selected template design.
              </li>
              <li>
                <strong>Live URL Provisioning:</strong> A personalized vanity web address (e.g. <code>{siteConfig.domain}/your-name</code>) is created and hosted on edge servers.
              </li>
              <li>
                <strong>Confirmation Email:</strong> A receipt with your dashboard login credentials and direct link coordinates is dispatched to your registered email.
              </li>
              <li>
                <strong>Guest Sharing:</strong> Use the built-in 1-click &ldquo;Share Link&rdquo; button or WhatsApp generator in your dashboard to send your invitation to your guests immediately.
              </li>
            </ol>
          </div>

          {/* Section 3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
              3. Printable QR Standee Package (Digital Assets)
            </h2>
            <p>
              If your plan includes the printable QR Standee feature, high-resolution vector PDF files (300 DPI) customized with your template&apos;s motif, couple names, and wedding hashtag are generated inside your dashboard. These files can be downloaded instantly and sent to your local print shop for printing on acrylic stands, gold-edged cardstock, or welcome easels.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
              4. Delivery Inquiries &amp; Support Assistance
            </h2>
            <p>
              Did not receive your confirmation email or cannot access your dashboard after payment? Contact our concierge team for immediate activation:
            </p>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1 text-xs">
              <p>Email: <a href={`mailto:${siteConfig.email.support}`} className="text-[#073D31] font-bold underline">{siteConfig.email.support}</a></p>
              <p>Resolution Time: Under 15 minutes for access recovery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
