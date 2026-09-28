"use client";

import { motion } from "motion/react";
import { Sparkle, EnvelopeOpen, MapPinLine, ChatCircleText, ArrowRight } from "@phosphor-icons/react";

export function ContactPage() {
  return (
    <div className="py-24 sm:py-32 bg-[#F7F4ED] text-[#18211E]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-16">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#073D31]/10 text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#073D31] uppercase font-sans shadow-xs">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            Concierge Support
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#18211E]">
            We&apos;re here for your celebration.
          </h1>

          <p className="text-sm sm:text-base text-[#76766F] font-sans leading-relaxed max-w-xl mx-auto">
            Questions about templates, custom soundscapes, or creating your invitation? Our concierge team is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {[
              { icon: EnvelopeOpen, label: "Email Concierge", value: "hello@unfoldwed.com" },
              { icon: ChatCircleText, label: "WhatsApp Support", value: "+91 98765 43210" },
              { icon: MapPinLine, label: "Design Studio", value: "Cyber Plaza, Hitec City, Hyderabad 500081" },
            ].map((item) => (
              <div key={item.label} className="p-6 rounded-3xl bg-white border border-[#073D31]/10 shadow-xs flex items-center gap-4">
                <div className="h-11 w-11 rounded-2xl bg-[#073D31]/5 flex items-center justify-center text-[#073D31] shrink-0">
                  <item.icon size={22} weight="bold" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C8A45E] font-sans block">{item.label}</span>
                  <p className="text-sm font-semibold text-[#18211E] mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form (Right 7 Cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-[#073D31]/10 shadow-[0_20px_50px_rgba(7,61,49,0.06)] space-y-6">
            <h3 className="font-serif text-2xl font-bold text-[#18211E]">Send us a message</h3>
            <form className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-[#76766F] font-sans">Full Name</label>
                  <input type="text" placeholder="Aarav Sharma" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31]" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-[#76766F] font-sans">Email Address</label>
                  <input type="email" placeholder="aarav@gmail.com" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31]" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#76766F] font-sans">Wedding Date (Optional)</label>
                <input type="text" placeholder="e.g. December 2026" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31]" />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#76766F] font-sans">Message</label>
                <textarea rows={4} placeholder="How can we help you create your dream invitation?" className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31] resize-none" />
              </div>

              <button type="button" className="w-full py-4 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs font-bold tracking-wider uppercase font-sans transition-all shadow-md hover:scale-[1.01]">
                Submit Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
