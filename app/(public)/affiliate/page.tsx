"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Sparkle,
  ArrowRight,
  CurrencyInr,
  Percent,
  Clock,
  ChartLineUp,
  CheckCircle,
  WhatsappLogo,
  ShieldCheck,
  UserCheck,
} from "@phosphor-icons/react";

const PERKS = [
  {
    icon: Percent,
    title: "20% Instant Commission",
    desc: "Earn up to ₹260 on every verified invitation created through your custom partner link with zero caps.",
  },
  {
    icon: ChartLineUp,
    title: "Dedicated Partner Portal",
    desc: "Track link clicks, real-time conversions, visitor heatmaps, and pending payout balances in high definition.",
  },
  {
    icon: Clock,
    title: "Guaranteed 5th-of-Month Payouts",
    desc: "Direct automated UPI or bank transfers straight to your account on the 5th of every month without delays.",
  },
  {
    icon: ShieldCheck,
    title: "60-Day Cookie Window",
    desc: "Even if your client takes up to 60 days to customize and purchase their template, the commission stays yours.",
  },
];

export default function AffiliatePage() {
  const [invitesCount, setInvitesCount] = useState<number>(25);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    profession: "Wedding Planner",
    email: "",
    phone: "",
    portfolio: "",
  });

  const estimatedEarnings = invitesCount * 240;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-28 sm:py-36 bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24">
        {/* HERO SECTION */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#073D31] uppercase font-sans backdrop-blur-md">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            <span>Creative Partner Program</span>
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h1 className="font-serif text-3.5xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#18211E] leading-[1.08]">
            Partner with Unfold. <br className="hidden sm:inline" />
            <span className="italic text-[#073D31] font-normal underline decoration-[#C8A45E]/50 decoration-1 underline-offset-8">Earn 20% on every celebration</span>.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#76766F] font-sans leading-relaxed max-w-2xl mx-auto">
            Are you a wedding photographer, event planner, makeup artist, or creator? Elevate your clients’ wedding experience with interactive 3D stationery while earning generous commissions.
          </p>
        </div>

        {/* EARNINGS SIMULATOR */}
        <div className="relative p-8 sm:p-12 rounded-[2.5rem] bg-[#073D31] text-[#F7F4ED] shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(200,164,94,0.2)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#E1C98E] font-bold">
                Interactive Income Calculator
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
                How much can you earn with Unfold?
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed max-w-md">
                Slide to estimate your monthly earnings based on client referrals. Every couple you introduce gets priority VIP support.
              </p>

              {/* Range Slider */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold font-sans">
                  <span>Referred Couples per Month:</span>
                  <span className="text-[#E1C98E] text-lg font-mono">{invitesCount} Couples</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={invitesCount}
                  onChange={(e) => setInvitesCount(Number(e.target.value))}
                  className="w-full accent-[#C8A45E] h-2 bg-white/20 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>5 couples</span>
                  <span>50 couples</span>
                  <span>100+ couples</span>
                </div>
              </div>
            </div>

            {/* Simulated Payout Metric Box */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-xl text-center space-y-3 shadow-xl">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#E1C98E] block">
                Estimated Monthly Earnings
              </span>
              <div className="font-serif text-4xl sm:text-5xl font-bold text-white font-mono flex items-center justify-center">
                <span>₹{estimatedEarnings.toLocaleString("en-IN")}</span>
              </div>
              <span className="text-[11px] text-stone-300 block">
                Paid directly via automated UPI / IMPS on the 5th
              </span>
              <div className="pt-2">
                <a
                  href="#apply-form"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8A45E] hover:bg-[#E1C98E] text-[#032A23] text-xs font-bold uppercase tracking-wider font-sans transition-all shadow-md hover:scale-105"
                >
                  <span>Apply to Become a Partner</span>
                  <ArrowRight size={13} weight="bold" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4 BENEFITS GRID */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-mono uppercase text-[#073D31] tracking-widest font-semibold">
              Partner Advantages
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#18211E] mt-1">
              Built for high-end wedding professionals.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="p-6 sm:p-7 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs hover:shadow-md hover:border-[#C8A45E]/50 transition-all duration-300 space-y-3 flex flex-col justify-between"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#073D31]/8 text-[#073D31] flex items-center justify-center">
                    <Icon size={22} weight="fill" className="text-[#073D31]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-lg font-bold text-[#18211E]">{p.title}</h3>
                    <p className="text-xs text-[#76766F] font-sans leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PARTNER APPLICATION FORM */}
        <div id="apply-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-8 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C8A45E] block">
                Partner Concierge
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#18211E]">
                Have questions before joining?
              </h3>
              <p className="text-xs text-[#76766F] font-sans leading-relaxed">
                Connect directly with our head of partner relationships for custom wholesale rates or agency integrations.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold font-sans transition-colors"
                >
                  <WhatsappLogo size={16} weight="fill" className="text-emerald-600" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-white border border-[#073D31]/10 shadow-[0_20px_50px_rgba(7,61,49,0.06)] space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#18211E]">
              Apply for Partnership
            </h3>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-[#073D31]/5 border border-[#073D31]/15 text-center space-y-3">
                <CheckCircle size={42} weight="fill" className="text-[#073D31] mx-auto" />
                <h4 className="font-serif text-xl font-bold text-[#073D31]">
                  Application Received!
                </h4>
                <p className="text-xs sm:text-sm text-[#76766F] font-sans">
                  We will review your portfolio and send your custom partner link & dashboard credentials within 4 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] uppercase font-bold tracking-wider text-[#76766F] font-sans">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Vikram Sharma"
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31] transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] uppercase font-bold tracking-wider text-[#76766F] font-sans">
                      Profession / Business
                    </label>
                    <select
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31] transition-colors"
                    >
                      <option>Wedding Planner</option>
                      <option>Wedding Photographer / Filmmaker</option>
                      <option>Makeup Artist / Stylist</option>
                      <option>Wedding Venue Manager</option>
                      <option>Digital Creator / Influencer</option>
                      <option>Stationery Designer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] uppercase font-bold tracking-wider text-[#76766F] font-sans">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="vikram@studio.com"
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31] transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] uppercase font-bold tracking-wider text-[#76766F] font-sans">
                      WhatsApp / Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] uppercase font-bold tracking-wider text-[#76766F] font-sans">
                    Instagram or Portfolio Website
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    placeholder="instagram.com/vikramweddings or https://vikramfilms.com"
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs font-bold tracking-wider uppercase font-sans transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="roll">
                    <span className="roll__a">Submit Partner Application</span>
                    <span className="roll__b" aria-hidden="true">Submit Partner Application</span>
                  </span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
