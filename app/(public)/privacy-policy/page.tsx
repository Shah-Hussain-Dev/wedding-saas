import React from "react";
import Link from "next/link";
import { Sparkle, ShieldCheck, LockKey, Database, UserCheck } from "@phosphor-icons/react/dist/ssr";

export default function PrivacyPolicyPage() {
  return (
    <div className="py-28 sm:py-36 bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#073D31] uppercase font-sans backdrop-blur-md">
            <ShieldCheck size={14} weight="fill" className="text-[#C8A45E]" />
            <span>Trust &amp; Data Security</span>
            <ShieldCheck size={14} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h1 className="font-serif text-3.5xl sm:text-5xl font-medium tracking-tight text-[#18211E]">
            Privacy Policy
          </h1>

          <p className="text-xs sm:text-sm text-[#76766F] font-sans">
            Last updated: March 2026 · Committed to protecting your wedding celebration data with strict privacy controls.
          </p>
        </div>

        {/* POLICY SECTIONS */}
        <div className="space-y-6 text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
          {/* Section 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <Database size={20} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                1. Data Collection &amp; Scope
              </h2>
            </div>
            <p>
              At Unfold, we collect strictly the information necessary to design, host, and manage your interactive digital wedding invitations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 pt-1 text-stone-700">
              <li>
                <strong>Couple &amp; Host Information:</strong> Account email, names, event venue locations, and ceremony schedules.
              </li>
              <li>
                <strong>Guest RSVP Responses:</strong> Guest names, headcount, attendance confirmation, dietary notes, and guestbook wishes.
              </li>
              <li>
                <strong>Media Assets:</strong> Photographs and custom audio files uploaded specifically for display in your invitation.
              </li>
            </ul>
            <p className="pt-2">
              We never sell, rent, or monetize your personal wedding data or guest lists with third-party advertisers.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <LockKey size={20} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                2. Secure Payment &amp; Cloud Infrastructure
              </h2>
            </div>
            <p>
              We partner with industry-leading providers to ensure bank-grade security for your data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 pt-1 text-stone-700">
              <li>
                <strong>Razorpay:</strong> All financial payments are encrypted via Razorpay’s PCI-DSS Level 1 compliant gateway. We do not store card details, UPI PINs, or CVVs.
              </li>
              <li>
                <strong>Cloud Storage:</strong> Media assets are stored on secure cloud buckets with end-to-end SSL encryption.
              </li>
              <li>
                <strong>Google Maps API:</strong> Integrated navigation routes are loaded dynamically to provide real-time venue guidance for your guests.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#073D31]">
              <UserCheck size={20} weight="fill" className="text-[#C8A45E]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
                3. Automatic Privacy &amp; 30-Day Expiry
              </h2>
            </div>
            <p>
              To protect personal family moments from permanent search engine indexing, active invitations remain public until 30 days after your wedding date. Following this 30-day grace period, the public URL is made private, while you retain lifetime read-only access inside your dashboard.
            </p>
            <p className="pt-1">
              You can request instant deletion of your account and uploaded data anytime by contacting our concierge at <a href="mailto:hello@unfoldwed.com" className="text-[#073D31] font-bold underline">hello@unfoldwed.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
