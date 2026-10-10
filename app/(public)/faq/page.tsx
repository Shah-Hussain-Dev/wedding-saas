"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  Question,
  CaretDown,
  Sparkle,
  ShieldCheck,
  Headset,
  TrashSimple,
  ArrowRight,
  WhatsappLogo,
  CurrencyInr,
  CheckCircle,
} from "@phosphor-icons/react";

interface FaqItem {
  question: string;
  answer: React.ReactNode;
  category: "billing" | "privacy" | "customization" | "sharing";
}

const FAQS: FaqItem[] = [
  {
    category: "billing",
    question: "What is your refund policy if I purchase an invitation?",
    answer: (
      <div className="space-y-2">
        <p>
          {siteConfig.name} maintains a <strong>strict No-Refund Policy</strong> on all digital invitation purchases. Because your custom code, database rows, cloud hosting, and unique link are provisioned instantaneously upon checkout, purchases cannot be canceled or refunded.
        </p>
        <p>
          However, our team guarantees <strong>100% white-glove Concierge Help &amp; Support</strong>. If you encounter any technical glitch, date change, music adjustment, or formatting issue, our engineers will actively assist and resolve it until your invitation is exactly how you envisioned it.
        </p>
      </div>
    ),
  },
  {
    category: "privacy",
    question: "Can I delete my data and photos from the dashboard anytime?",
    answer: (
      <div className="space-y-2">
        <p>
          <strong>Yes, absolutely.</strong> You have complete sovereignty over your wedding celebration data. You can delete your invitation, photos, and guest RSVP records directly from your Couple Dashboard at any time with a single click.
        </p>
        <p>
          When deleted, all corresponding photos, guest messages, and database records are immediately purged from our active databases and cloud storage. For complete account deletion, you can also email{" "}
          <a href={`mailto:${siteConfig.email.support}`} className="text-[#073D31] font-bold underline">
            {siteConfig.email.support}
          </a>
          .
        </p>
      </div>
    ),
  },
  {
    category: "customization",
    question: "Can I make edits after publishing my invitation?",
    answer: (
      <p>
        Yes! You enjoy <strong>unlimited free revisions</strong> right up until your wedding day. You can update dates, change venues, edit ceremony itineraries, swap photos, or change background music anytime in your dashboard without paying anything extra.
      </p>
    ),
  },
  {
    category: "sharing",
    question: "How do guests open and experience the invitation?",
    answer: (
      <p>
        Guests do not need to download any apps. You receive a personalized, elegant web link (e.g. <code>{siteConfig.domain}/your-names</code>) that you can send via WhatsApp, SMS, or email. When tapped, it opens smoothly in any mobile or desktop browser with interactive 3D reveals, music, and RSVP buttons.
      </p>
    ),
  },
  {
    category: "billing",
    question: "Are there any recurring monthly subscription fees?",
    answer: (
      <p>
        No. {siteConfig.name} operates on a transparent, one-time investment (from {siteConfig.startingPrice}). There are zero recurring monthly bills, zero hidden hosting fees, and zero renewal charges for your wedding event.
      </p>
    ),
  },
  {
    category: "privacy",
    question: "Do you sell our guest telephone numbers or personal photos to third parties?",
    answer: (
      <p>
        <strong>Never.</strong> We never sell, rent, or broker your personal information or guest data to third-party advertisers, vendors, or marketing firms. All payment transactions are isolated through Razorpay&apos;s PCI-DSS Level 1 certified banking gateway.
      </p>
    ),
  },
  {
    category: "customization",
    question: "Can I use custom regional or Bollywood music tracks?",
    answer: (
      <p>
        Yes! You can choose from our curated library of orchestral, sufi, shehnai, and classical soundscapes, or upload your own favorite custom MP3 audio track directly into your invitation.
      </p>
    ),
  },
  {
    category: "sharing",
    question: "How do I track and export guest RSVP responses?",
    answer: (
      <p>
        Whenever a guest confirms attendance or leaves a blessing, it instantly appears in your real-time Guest Manifest inside your dashboard. You can view headcounts, dietary requirements, phone numbers, and export the entire list to an Excel/CSV spreadsheet with 1 click.
      </p>
    ),
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs =
    activeCategory === "all"
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory);

  return (
    <div className="py-24 sm:py-36 bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#073D31] uppercase font-sans backdrop-blur-md">
            <Sparkle size={14} weight="fill" className="text-[#C8A45E]" />
            <span>Help &amp; Knowledge Base</span>
            <Sparkle size={14} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h1 className="font-serif text-3.5xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#18211E] leading-[1.1]">
            Frequently Asked Questions
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#76766F] font-sans max-w-xl mx-auto leading-relaxed">
            Everything you need to know about our digital wedding invitations, no-refund policy, concierge support, and dashboard data deletion rights.
          </p>
        </div>

        {/* CATEGORY SELECTOR PILLS */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-sans">
          {[
            { id: "all", label: "All Questions" },
            { id: "billing", label: "Billing & No-Refund" },
            { id: "privacy", label: "Data Deletion & Privacy" },
            { id: "customization", label: "Customization & Edits" },
            { id: "sharing", label: "WhatsApp & RSVPs" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#073D31] text-[#F7F4ED] shadow-sm scale-105"
                  : "bg-white border border-[#073D31]/10 text-stone-600 hover:text-stone-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ACCORDION FAQS */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-3xl bg-white border border-[#073D31]/10 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-[#18211E]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-[#073D31]/8 text-[#073D31] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#C8A45E] text-[#032A23]" : ""
                    }`}
                  >
                    <CaretDown size={16} weight="bold" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-xs sm:text-sm text-stone-600 font-sans leading-relaxed border-t border-stone-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* NEED ASSISTANCE CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#073D31] text-[#F7F4ED] text-center space-y-4 shadow-xl">
          <Headset size={36} weight="fill" className="text-[#C8A45E] mx-auto" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Still have questions or need custom assistance?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto font-sans leading-relaxed">
            Our concierge team is available 7 days a week via email to assist you with every aspect of your wedding stationery.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${siteConfig.email.support}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8A45E] hover:bg-[#E1C98E] text-[#032A23] text-xs font-bold uppercase tracking-wider font-sans transition-all shadow-md hover:scale-105"
            >
              <span>Email Support Team</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-wider font-sans transition-all"
            >
              <span>Visit Contact Page</span>
              <ArrowRight size={13} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
