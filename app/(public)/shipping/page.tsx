import React from "react";
import Link from "next/link";
import { Sparkle, Lightning, QrCode, CheckCircle } from "@phosphor-icons/react/dist/ssr";

export default function ShippingPage() {
  return (
    <div className="py-28 sm:py-36 bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#073D31] uppercase font-sans backdrop-blur-md">
            <Lightning size={14} weight="fill" className="text-[#C8A45E]" />
            <span>Delivery Policy</span>
            <Lightning size={14} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h1 className="font-serif text-3.5xl sm:text-5xl font-medium tracking-tight text-[#18211E]">
            Instant Digital Delivery
          </h1>

          <p className="text-xs sm:text-sm text-[#76766F] font-sans">
            Zero physical shipping delays. Your invitation portal is live within seconds of payment.
          </p>
        </div>

        {/* POLICY SECTIONS */}
        <div className="space-y-6 text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
              1. 100% Digital Architecture
            </h2>
            <p>
              Unfold is an eco-friendly digital software platform. We do not ship physical paper wedding cards by default, eliminating courier transit losses, carbon footprint, and printing delays.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 pt-1 text-stone-700">
              <li>
                <strong>Instant Account Provisioning:</strong> Immediately upon Razorpay checkout confirmation, your customizer dashboard unlocks.
              </li>
              <li>
                <strong>Delivery Coordinates:</strong> Your live invitation URL, QR codes, and guest tracking tools are instantly available inside your account and emailed to you.
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18211E]">
              2. Vector QR Standee Assets (Print-Ready)
            </h2>
            <p>
              If your plan includes the printable QR Standee package, a high-resolution 300 DPI vector PDF tailored to your chosen template design is generated directly in your dashboard for instant local physical printing on acrylic or cardstock for your wedding reception tables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
