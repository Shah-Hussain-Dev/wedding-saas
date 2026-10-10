import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  ShieldCheck,
  LockKey,
  Database,
  TrashSimple,
  CheckCircle,
  EyeSlash,
  ArrowRight,
  Sparkle,
  HardDrives,
  UserCheck,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: `Privacy Policy & Data Security — ${siteConfig.name}`,
  description:
    `Learn how ${siteConfig.name} protects your wedding celebration data, enforces bank-grade security, and provides 1-click self-serve data deletion directly from your couple dashboard.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-24 sm:py-36 bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#073D31] uppercase font-sans backdrop-blur-md">
            <ShieldCheck size={14} weight="fill" className="text-[#C8A45E]" />
            <span>Trust &amp; Data Sovereignty</span>
            <ShieldCheck size={14} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h1 className="font-serif text-3.5xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#18211E] leading-[1.1]">
            Privacy Policy &amp; Data Security
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#76766F] font-sans max-w-xl mx-auto leading-relaxed">
            Last updated: October 2026 · Your celebration is sacred. You retain 100% unilateral ownership of your wedding memories, with instant self-serve data deletion directly from your dashboard.
          </p>
        </div>

        {/* HERO HIGHLIGHT: DATA DELETION GUARANTEE */}
        <div className="relative p-7 sm:p-10 rounded-3xl bg-gradient-to-br from-[#073D31] to-[#04241D] text-[#F7F4ED] shadow-xl border border-[#C8A45E]/30 overflow-hidden space-y-5">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[radial-gradient(circle,rgba(200,164,94,0.18)_0%,transparent_70%)] pointer-events-none" />

          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#E1C98E] tracking-widest font-bold">
            <TrashSimple size={16} weight="bold" />
            <span>Core Guarantee: Total Data Sovereignty</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white">
            Delete your wedding data anytime directly from your dashboard.
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed max-w-2xl">
            At WedInvites, we believe privacy is a fundamental human right. You are never locked in, and you never have to jump through hoops to remove your personal life from the internet. You can permanently delete your invitation webpage, high-resolution photographs, ceremony itineraries, and all guest RSVP submissions at any moment directly from your couple dashboard.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-sans">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1">
              <span className="font-bold text-[#E1C98E] block">1. 1-Click Self-Serve</span>
              <p className="text-[11px] text-stone-300 leading-snug">
                Click &ldquo;Delete&rdquo; next to any invitation in your dashboard for immediate permanent removal.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1">
              <span className="font-bold text-[#E1C98E] block">2. Complete Purge</span>
              <p className="text-[11px] text-stone-300 leading-snug">
                All guest telephone numbers, attendance logs, blessings, and images are wiped from our active databases.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1">
              <span className="font-bold text-[#E1C98E] block">3. Zero Selling</span>
              <p className="text-[11px] text-stone-300 leading-snug">
                We never monetize, broker, or share your couple data or guest lists with third-party advertisers.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8A45E] hover:bg-[#E1C98E] text-[#032A23] text-xs font-bold uppercase tracking-wider font-sans transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <span>Manage Data in Your Dashboard</span>
              <ArrowRight size={13} weight="bold" />
            </Link>
          </div>
        </div>

        {/* DETAILED POLICY CHAPTERS */}
        <div className="space-y-6 text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
          {/* Section 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <Database size={22} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                1. What Information We Collect &amp; Why
              </h2>
            </div>
            <p>
              WedInvites collects exclusively the minimal information required to render, host, and facilitate your interactive digital wedding invitations on <strong>wedinvites.in</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 pt-1 text-stone-700">
              <li>
                <strong>Couple &amp; Host Identity:</strong> Names of the bride, groom, host email address, phone contact, and event dates.
              </li>
              <li>
                <strong>Celebration Venues &amp; Schedules:</strong> Venue titles, addresses, Google Maps geo-coordinates, and multi-event schedules (e.g. Haldi, Mehendi, Sangeet, Nikah, Pheras, Reception).
              </li>
              <li>
                <strong>Guest RSVP Submissions:</strong> Guest names, headcount, attendance confirmations, dietary notes, and personal guestbook blessings.
              </li>
              <li>
                <strong>Media Assets:</strong> Photographs and custom audio tracks uploaded by the couple to display within their personalized invitation.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <LockKey size={22} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                2. Bank-Grade Payment Isolation &amp; Infrastructure Security
              </h2>
            </div>
            <p>
              We treat your security with the highest standards in modern cloud engineering:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 pt-1 text-stone-700">
              <li>
                <strong>Razorpay Payment Security:</strong> All financial transactions are processed directly through Razorpay&apos;s PCI-DSS Level 1 certified banking gateway. WedInvites does <em>not</em> store, process, or have access to your credit/debit card numbers, CVVs, net banking passwords, or UPI PINs.
              </li>
              <li>
                <strong>Encrypted Cloud Storage:</strong> All uploaded photos and soundscapes are transmitted via 256-bit TLS/SSL encryption and stored on secure cloud buckets.
              </li>
              <li>
                <strong>Isolated Database Access:</strong> User invitations and guest RSVP data are strictly isolated with automated authorization checks so only the authenticated couple can view their guest manifest.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <TrashSimple size={22} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                3. Step-by-Step: How to Delete Your Data from the Dashboard
              </h2>
            </div>
            <p>
              To ensure full compliance with international data privacy laws (GDPR, CCPA, and India&apos;s Digital Personal Data Protection Act), self-serve data purging is built directly into your workflow:
            </p>
            <ol className="list-decimal pl-5 space-y-2 pt-1 text-stone-700">
              <li>
                <strong>Sign in:</strong> Visit <Link href="/login" className="text-[#073D31] font-bold underline">wedinvites.in/login</Link> and enter your registered email.
              </li>
              <li>
                <strong>Navigate to Dashboard:</strong> Head to your <Link href="/dashboard" className="text-[#073D31] font-bold underline">Couple Dashboard</Link>.
              </li>
              <li>
                <strong>Select Delete:</strong> In the &ldquo;Active Invitations&rdquo; section, locate the invitation card you wish to remove and click the red <strong>Delete</strong> button.
              </li>
              <li>
                <strong>Instant Execution:</strong> Confirm the prompt. The invitation webpage, photos, itinerary, and all corresponding guest RSVPs will be permanently shredded and deleted from active database storage immediately.
              </li>
            </ol>
            <p className="pt-2 text-stone-500 text-xs">
              Need your entire user account and login credentials completely wiped? Simply send a one-line request from your registered email to <a href={`mailto:${siteConfig.email.support}`} className="text-[#073D31] font-bold underline">{siteConfig.email.support}</a>, and our team will hard-purge your profile within 24 hours.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <EyeSlash size={22} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                4. Zero Advertising, Zero Data Monetization
              </h2>
            </div>
            <p>
              {siteConfig.name} does not engage in advertising brokerage, cross-site behavior profiling, or lead selling. We do not sell couple telephone numbers, guest contact details, or wedding dates to catering services, photographers, or third-party marketing companies. Our business model is purely direct software craftsmanship supported by transparent one-time template purchases.
            </p>
          </div>

          {/* Section 5 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <UserCheck size={22} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                5. Guest Privacy Rights &amp; Access Controls
              </h2>
            </div>
            <p>
              Guests who submit their RSVP, headcount, and wishes through a couple&apos;s unique link may request deletion of their specific response at any time by asking the couple to delete the RSVP from the dashboard manifest, or by writing to <a href={`mailto:${siteConfig.email.support}`} className="text-[#073D31] font-bold underline">{siteConfig.email.support}</a> with the couple&apos;s wedding URL.
            </p>
          </div>

          {/* Section 6 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <Sparkle size={22} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                6. Contact the Data Protection Concierge
              </h2>
            </div>
            <p>
              If you have any questions regarding this policy, security audits, or data rights, reach our Data Protection team at:
            </p>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1 text-xs">
              <p><strong>{siteConfig.legalName}</strong></p>
              <p>Email: <a href={`mailto:${siteConfig.email.support}`} className="text-[#073D31] font-bold underline">{siteConfig.email.support}</a></p>
              <p>Platform: <a href={siteConfig.url} className="text-[#073D31] font-bold underline">{siteConfig.domain}</a></p>
              <p>Response SLA: Under 24 hours on all business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
