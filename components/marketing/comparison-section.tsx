"use client";

import { motion } from "motion/react";
import { DecorSection, HeaderDecor } from "@/components/decor/section-decor";
import { SectionHeader } from "@/components/ui/section-header";
import { fadeUp, viewportOnce } from "@/components/ui/motion-primitives";
import { siteConfig } from "@/config/site";

const ROWS = [
  { name: "Estimated Cost", paper: "₹5,000 – ₹50,000+", digital: "₹1,199 One-Time", highlight: true },
  { name: "Delivery", paper: "2 – 4 Weeks", digital: "Instant / 5 Mins", highlight: true },
  { name: "Interactive Features", paper: "None", digital: "Scratch, Countdown, RSVP" },
  { name: "Live RSVPs", paper: "Manual Calls", digital: "Automatic Tracking" },
  { name: "Editable", paper: "Reprint Required", digital: "Unlimited Updates" },
  { name: "Music", paper: "Not Available", digital: "Embedded Instrumentals" },
  { name: "Navigation", paper: "Printed Address", digital: "Google Maps" },
  { name: "Sharing", paper: "Physical Courier", digital: "WhatsApp & Social" },
];

export function ComparisonSection() {
  return (
    <DecorSection preset="minimal" className="section-padding bg-white border-y border-black/[0.04]">
      <div className="page-container max-w-4xl">
        <SectionHeader eyebrow="Why go digital?" title={`Paper vs ${siteConfig.name} digital`} />
        <HeaderDecor preset="minimal" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="rounded-2xl border border-black/[0.06] overflow-hidden bg-white shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[540px]">
              <thead>
                <tr className="border-b border-stone-100 bg-[#FCFBF7] text-xs uppercase tracking-wider font-bold text-stone-400">
                  <th className="py-3.5 px-5">Feature</th>
                  <th className="py-3.5 px-5">Paper</th>
                  <th className="py-3.5 px-5 text-accent-gold">{siteConfig.name}</th>
                </tr>
              </thead>
              <tbody className="text-sm text-stone-600 divide-y divide-stone-50">
                {ROWS.map((row) => (
                  <tr key={row.name} className="hover:bg-[#FCFBF7]/50">
                    <td className="py-3.5 px-5 font-medium text-[#1A1A1A]">{row.name}</td>
                    <td className="py-3.5 px-5 text-stone-400">{row.paper}</td>
                    <td className="py-3.5 px-5 font-semibold text-accent-gold bg-accent-gold/[0.03]">
                      {row.highlight ? (
                        <span className="bg-accent-gold/10 px-2 py-0.5 rounded-lg">{row.digital}</span>
                      ) : (
                        row.digital
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DecorSection>
  );
}
