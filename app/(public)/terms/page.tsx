import React from "react";
import Link from "next/link";
import { Sparkle, ShieldCheck, Scroll, SealCheck } from "@phosphor-icons/react/dist/ssr";

export default function TermsPage() {
  return (
    <div className="py-28 sm:py-36 bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#073D31] uppercase font-sans backdrop-blur-md">
            <Scroll size={14} weight="fill" className="text-[#C8A45E]" />
            <span>Legal Agreement</span>
            <Scroll size={14} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h1 className="font-serif text-3.5xl sm:text-5xl font-medium tracking-tight text-[#18211E]">
            Terms of Service
          </h1>

          <p className="text-xs sm:text-sm text-[#76766F] font-sans">
            Last updated: March 2026 · Standard terms governing your use of the Unfold digital stationery platform.
          </p>
        </div>

        {/* TERMS CHAPTERS */}
        <div className="space-y-6 text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
              1. Platform Services &amp; Digital Experience
            </h2>
            <p>
              Unfold provides personalized interactive digital wedding invitation webpages featuring 3D animations, music soundscapes, live count-downs, Google Maps venue links, and RSVP guestbooks. All invitations are delivered as a unique, shareable link accessible from any modern browser.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
              2. One-Time Payment &amp; Unlimited Revisions
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
              <li>
                <strong>One-Time Investment:</strong> Unfold operates on a single transparent fee (₹1,199). There are zero recurring subscriptions or hidden hosting fees.
              </li>
              <li>
                <strong>Unlimited Revisions:</strong> You may edit your wedding itinerary, dates, photos, and music unlimited times right up until your wedding day.
              </li>
              <li>
                <strong>Instant Activation:</strong> Once payment is confirmed via Razorpay, your couple dashboard and template customizer activate immediately.
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
              3. User Content &amp; Media Rights
            </h2>
            <p>
              You retain 100% ownership of your personal wedding photos, text, and guest information. By uploading content, you confirm that you have rights to use the photos and custom audio tracks. Unfold’s stock soundscapes are fully licensed for non-commercial celebration use.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
              4. Contact &amp; Concierge Assistance
            </h2>
            <p>
              For legal inquiries, enterprise integrations, or custom stationery commissions, reach our concierge team anytime at <a href="mailto:contact@unfoldwed.com" className="text-[#073D31] font-bold underline">contact@unfoldwed.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
