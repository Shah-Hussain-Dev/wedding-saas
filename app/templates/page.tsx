"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { GlassNav } from "@/components/ui/glass-nav";
import { PremiumFooter } from "@/components/ui/premium-footer";
import { DoubleBezelCard } from "@/components/ui/double-bezel-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { PageHero } from "@/components/ui/page-hero";
import { staggerContainer, fadeUp, cardHover, viewportOnce } from "@/components/ui/motion-primitives";
import { ArrowUpRight } from "@phosphor-icons/react";

const FILTERS = ["All", "Hindu", "Muslim", "Best Sellers", "New"];

const TEMPLATES = [
  { id: "noor-e-nikah", name: "Noor-e-Nikah", style: "Sacred Elegance", tag: "Featured", religion: ["muslim"], religionLabel: "Muslim", colors: "Ivory + 24K Gold", opening: "3D Floral Envelope", desc: "Sacred Islamic wedding experience with 3D embossed floral envelope, slow-lighting gold wax seal, grand mosque archway portal, and Nikah timeline.", gradient: "from-[#FAF8F5] via-[#F3EDE2] to-[#E5DAC6]" },
  { id: "emerald-qasr", name: "Emerald Qasr", style: "Ottoman Royale", tag: "New", religion: ["muslim"], religionLabel: "Muslim", colors: "Emerald + 24K Gold", opening: "Cinematic Video Opening", desc: "Opulent Ottoman palace aesthetic with animated envelope opening video, gold filigree, Ayat Ar-Rum blessings, and scratch reveal.", gradient: "from-[#081F1A] via-[#0F382E] to-[#04120F]" },
  { id: "gul-e-noor", name: "Gul-e-Noor", style: "Blush Velvet & Rose", tag: "New", religion: ["muslim"], religionLabel: "Muslim", colors: "Pastel Rose + Pearl", opening: "Cinematic Video Opening", desc: "Dreamy blush pink & rose velvet celebration with floating floral envelope opening video, glowing pearl accents, and RSVP.", gradient: "from-[#FFF5F7] via-[#FCE8ED] to-[#F5D0DB]" },
  { id: "azure-nikah", name: "Azure Nikah", style: "Royal Sapphire", tag: "New", religion: ["muslim"], religionLabel: "Muslim", colors: "Midnight Sapphire + Gold", opening: "Cinematic Video Opening", desc: "Majestic midnight sapphire & celestial gold invitation with envelope opening video, crescent star motifs, and dual photo slider.", gradient: "from-[#0A1628] via-[#0F2342] to-[#060D18]" },
  { id: "kitab-e-nikah", name: "Kitab-e-Nikah", style: "Sacred Velvet & Gold", tag: "New", religion: ["muslim"], religionLabel: "Muslim", colors: "Velvet Burgundy + Gold", opening: "Cinematic Video Opening", desc: "Sacred illuminated Nikah book opening video, ivory parchment texture, gold arabesque borders, and ceremony guide.", gradient: "from-[#1F080F] via-[#2F0D17] to-[#120409]" },
  { id: "crimson-royale", name: "Crimson Royale", style: "Royal Court", tag: "Trending", religion: ["hindu"], religionLabel: "Hindu", colors: "Crimson Velvet + 24K Gold", opening: "3D Split Gate", desc: "Regal crimson velvet and 24K gold foil aesthetic with royal gate reveal, interactive scratch card, and shehnai background music.", gradient: "from-[#420f18] via-[#7c2c3b] to-[#20050a]" },
  { id: "royal-lotus", name: "Royal Lotus", style: "Royal Heritage", tag: "Best Seller", religion: ["hindu"], religionLabel: "Hindu", colors: "Ivory + 24K Gold + Maroon", opening: "3D Palace Gate", desc: "Grand Rajasthani palace with ivory canvas, 24K gold filigree, crimson accents, and floating lotus petals.", gradient: "from-[#FCF9F2] via-[#F5EFE0] to-[#EBDDC3]" },
  { id: "emerald-noir", name: "Emerald Noir", style: "Luxury Dark", tag: "Best Seller", religion: ["hindu", "universal"], religionLabel: "Hindu", colors: "Emerald + 24K Gold", opening: "3D Haveli Gate Reveal", desc: "Ornate 24K gold details on rich emerald canvas. 3D Haveli Gate reveal with glowing Ganesha seal, multi-layer parallax, and Muhurat scratch card.", gradient: "from-[#081F1A] via-[#0F382E] to-[#04120F]" },
  { id: "royal-elegance", name: "Royal Elegance", style: "Classic South Asian", tag: "Best Seller", religion: ["hindu", "universal"], religionLabel: "Hindu", colors: "Royal Crimson + Gold", opening: "Maharani Curtain Reveal", desc: "Traditional South Asian grandeur with 3D Maharani Silk Curtains, Royal Kundan Wax Seal, Gauri Ganesh blessings, and interactive scratch reveal.", gradient: "from-[#faf7f0] to-[#f0e8d8]" },
  { id: "modern-minimal", name: "Modern Minimal", style: "Contemporary Chic", tag: "New", religion: ["hindu", "universal"], religionLabel: "Hindu", colors: "Warm Champagne + Gold", opening: "3D Origami Envelope", desc: "Contemporary Vedic luxury with a 3D architectural origami envelope & pure gold monogram seal, multi-layer parallax, and gallery lightbox.", gradient: "from-stone-50 to-stone-200" },
];

export default function TemplatesPage() {
  const [filter, setFilter] = useState("All");
  const filtered = TEMPLATES.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Hindu") return t.religion.includes("hindu");
    if (filter === "Muslim") return t.religion.includes("muslim");
    if (filter === "Best Sellers") return t.tag === "Best Seller" || t.tag === "Trending";
    if (filter === "New") return t.tag === "New";
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF7] text-[#1A1A1A]">
      <GlassNav />
      <main className="flex-grow pt-28 pb-20">
        <div className="page-container">
          <PageHero eyebrow="Catalogue" title="Select your design" subtitle="Responsive animated invitations with audio, scratch reveals, and RSVP tracking." />

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {FILTERS.map((f) => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                  filter === f 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-white border border-black/[0.06] text-stone-500 hover:border-accent-gold/30 hover:text-stone-700"
                }`}
              >
                {f === "Hindu" ? "🕉️ Hindu Weddings" : f === "Muslim" ? "🌙 Muslim Weddings" : f}
              </button>
            ))}
          </div>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tpl) => (
              <motion.div key={tpl.id} variants={fadeUp}>
                <motion.div initial="rest" whileHover="hover" variants={cardHover}>
                  <DoubleBezelCard className="flex flex-col h-full">
                    <div className={`aspect-[4/3] rounded-xl bg-gradient-to-br ${tpl.gradient} flex items-center justify-center mb-5 relative`}>
                      <span className="font-serif text-2xl text-stone-700">{tpl.name}</span>
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="text-[9px] uppercase font-bold bg-white/90 text-stone-600 px-2.5 py-0.5 rounded-full shadow-sm">{tpl.tag}</span>
                        <span className="text-[9px] uppercase font-bold bg-white/90 text-stone-700 px-2 py-0.5 rounded-full shadow-sm">
                          {tpl.religionLabel === "Hindu" ? "🕉️ Hindu" : tpl.religionLabel === "Muslim" ? "🌙 Muslim" : "✦ Universal"}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-accent-gold">{tpl.style}</span>
                    <h3 className="text-xl font-serif mt-1 mb-2">{tpl.name}</h3>
                    <p className="text-sm text-stone-500 mb-4 flex-grow">{tpl.desc}</p>
                    <div className="text-xs text-stone-400 space-y-1 border-t border-stone-100 pt-4 mb-5">
                      <div className="flex justify-between"><span>Colors</span><span className="text-stone-600">{tpl.colors}</span></div>
                      <div className="flex justify-between"><span>Opening</span><span className="text-stone-600">{tpl.opening}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/preview/${tpl.id}`} className="flex-1">
                        <button className="w-full flex items-center justify-center gap-1 border border-black/[0.06] rounded-full py-2.5 text-xs font-semibold text-stone-700 hover:border-accent-gold/30 transition-colors">
                          Sample <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </Link>
                      <Link href={`/customize/${tpl.id}`} className="flex-1">
                        <PremiumButton className="w-full text-xs justify-center">Try Free</PremiumButton>
                      </Link>
                    </div>
                  </DoubleBezelCard>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      <PremiumFooter />
    </div>
  );
}
