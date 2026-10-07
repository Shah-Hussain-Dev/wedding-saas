import React from "react";
import Link from "next/link";
import { Sparkle, Warning, SealCheck, ArrowClockwise, CurrencyInr } from "@phosphor-icons/react/dist/ssr";

export default function RefundPolicyPage() {
  return (
    <div className="py-28 sm:py-36 bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#073D31] uppercase font-sans backdrop-blur-md">
            <SealCheck size={14} weight="fill" className="text-[#C8A45E]" />
            <span>Billing &amp; Assurance</span>
            <SealCheck size={14} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h1 className="font-serif text-3.5xl sm:text-5xl font-medium tracking-tight text-[#18211E]">
            Cancellation &amp; Refund Policy
          </h1>

          <p className="text-xs sm:text-sm text-[#76766F] font-sans">
            Last updated: March 2026 · Transparent terms regarding digital purchases and payment protections.
          </p>
        </div>

        {/* POLICY SECTIONS */}
        <div className="space-y-6 text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
              1. Nature of Customized Digital Services
            </h2>
            <p>
              Unfold generates personalized digital invitation webpages and real-time interactive portals. Because your unique invitation code, custom routes, and database assets are allocated immediately upon payment, all standard purchases are final.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
              2. Duplicate or Erroneous Transactions
            </h2>
            <p>
              If a duplicate charge occurs due to network interruptions during checkout, we will gladly investigate and process a 100% refund for the duplicate transaction within 5 to 7 business days directly to your original payment method.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
              3. Dedicated Support Resolution
            </h2>
            <p>
              If you experience any technical difficulty during customization or activation, our engineering team provides priority concierge resolution within 2 hours. Email your payment ID to <a href="mailto:contact@unfoldwed.com" className="text-[#073D31] font-bold underline">contact@unfoldwed.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
