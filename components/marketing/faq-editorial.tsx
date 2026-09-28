"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkle, CaretDown } from "@phosphor-icons/react";

const FAQS = [
  {
    q: "How do our guests open and experience the wedding invitation?",
    a: "You receive a personalized, private luxury webpage link. Simply share it via WhatsApp, SMS, or Instagram. When guests tap the link, the invitation immediately loads in their mobile browser with 3D door openings, soundtracks, and interactive maps — zero apps or downloads needed.",
  },
  {
    q: "Can we customize our background music score?",
    a: "Yes. Every template includes curated instrumental and traditional soundtrack tracks (shehnai, royal orchestral strings, acoustic guitar, piano). You can also provide any custom audio file of your choice.",
  },
  {
    q: "Can we make changes after sharing the invitation?",
    a: "Absolutely. You can edit event timings, add photos, change addresses, and update ceremony details at any time from your dashboard. All updates reflect instantly for every guest without re-sharing.",
  },
  {
    q: "How does the RSVP tracking system work?",
    a: "Guests tap 'RSVP' directly inside your invitation, enter their names, guest count, and celebratory wishes. All responses sync to your couple dashboard where you can export guest lists with 1 click.",
  },
  {
    q: "Does this support multi-event Indian weddings (Haldi, Mehendi, Sangeet, Nikah, Pheras)?",
    a: "Yes! Every template supports multi-event schedules with separate dates, timings, venues, Google Maps links, and dress code color palettes for each function.",
  },
];

export function FaqEditorial() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-32 bg-[#F7F4ED] text-[#18211E] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#073D31] font-bold font-sans flex items-center justify-center gap-1.5">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            Frequently Asked Questions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#18211E]">
            Everything you need to know.
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = expandedIdx === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-white border border-[#073D31]/10 overflow-hidden transition-all duration-300 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#18211E]">
                    {faq.q}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-1.5 rounded-full bg-[#073D31]/5 text-[#073D31] flex-shrink-0"
                  >
                    <CaretDown size={14} weight="bold" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#76766F] font-sans leading-relaxed border-t border-stone-100 pt-3">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
