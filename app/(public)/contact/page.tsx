"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Sparkle, EnvelopeOpen, MapPinLine, ChatCircleText, ArrowRight, CheckCircle } from "@phosphor-icons/react";

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", date: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-24 sm:py-36 bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-16">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#073D31] uppercase font-sans backdrop-blur-md">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            <span>Concierge Service</span>
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#18211E] leading-[1.08]">
            We&apos;re here for your celebration.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#76766F] font-sans leading-relaxed max-w-xl mx-auto">
            Questions about templates, custom soundscapes, or creating your invitation? Our concierge team is at your service.
          </p>
        </div>

        {/* MAIN CONCIERGE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {[
              {
                icon: ChatCircleText,
                label: "WhatsApp Concierge (Fastest)",
                value: "+91 98765 43210",
                desc: "Instant live chat with our stationery design team",
                href: "https://wa.me/919876543210",
              },
              {
                icon: EnvelopeOpen,
                label: "Email Concierge",
                value: "hello@unfoldwed.com",
                desc: "Average response time: under 2 hours",
                href: "mailto:hello@unfoldwed.com",
              },
              {
                icon: MapPinLine,
                label: "Design Sanctuary",
                value: "Cyber Plaza, Hitec City, Hyderabad 500081",
                desc: "Crafted with love for couples worldwide",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-6 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs hover:shadow-md hover:border-[#C8A45E]/50 transition-all duration-300 flex items-start gap-4"
              >
                <div className="h-11 w-11 rounded-2xl bg-[#073D31]/8 flex items-center justify-center text-[#073D31] shrink-0 mt-0.5">
                  <item.icon size={22} weight="fill" className="text-[#073D31]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C8A45E] font-sans block">
                    {item.label}
                  </span>
                  <p className="text-sm font-bold text-[#18211E] mt-0.5">{item.value}</p>
                  <p className="text-xs text-[#76766F] font-sans mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form (Right 7 Cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-white border border-[#073D31]/10 shadow-[0_20px_50px_rgba(7,61,49,0.06)] space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#18211E]">
              Send us a direct note
            </h3>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-[#073D31]/5 border border-[#073D31]/15 text-center space-y-3">
                <CheckCircle size={40} weight="fill" className="text-[#073D31] mx-auto" />
                <h4 className="font-serif text-xl font-bold text-[#073D31]">
                  Thank you for reaching out!
                </h4>
                <p className="text-xs sm:text-sm text-[#76766F] font-sans">
                  Our concierge team has received your note and will respond within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] uppercase font-bold tracking-wider text-[#76766F] font-sans">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Aarav Sharma"
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31] transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] uppercase font-bold tracking-wider text-[#76766F] font-sans">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="aarav@gmail.com"
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] uppercase font-bold tracking-wider text-[#76766F] font-sans">
                    Wedding Date / Event Timeline
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. December 2026 / Winter Season"
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] uppercase font-bold tracking-wider text-[#76766F] font-sans">
                    Message or Customization Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your wedding vision, template questions, or special requests..."
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-4 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31] resize-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs font-bold tracking-wider uppercase font-sans transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="roll">
                    <span className="roll__a">Send Note to Concierge</span>
                    <span className="roll__b" aria-hidden="true">Send Note to Concierge</span>
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

export default ContactPage;
