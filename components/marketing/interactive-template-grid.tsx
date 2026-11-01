"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import { ArrowRight, Sparkle } from "@phosphor-icons/react";
import { TemplateCatalogCard } from "@/components/marketing/template-catalog-card";

interface TemplateItem {
  id: string;
  name: string;
  category: "all" | "royal" | "muslim" | "hindu" | "celestial" | "modern";
  categoryLabel: string;
  description: string;
  price: string;
  tag: string;
  video?: string;
}

/** Homepage showcase: 9 featured templates (full collection on /templates). */
const CATALOGUE_TEMPLATES: TemplateItem[] = [
  {
    id: "celestial-rose",
    name: "Celestial Rose Dreamscape",
    category: "celestial",
    categoryLabel: "Universal",
    description:
      "Starlight terrace video, constellation story, scratch-the-stars reveal, and wish-upon-a-star RSVP flight.",
    price: "₹1,199",
    tag: "Awwwards Dreamscape",
    video: "/videos/royal-prestige.mp4",
  },
  {
    id: "imperial-palace",
    name: "Imperial Palace",
    category: "royal",
    categoryLabel: "Royal Indian & European",
    description:
      "Monumental 3D palace doors, gold inlay ballroom, royal procession itinerary, and wax seal reveal.",
    price: "₹1,199",
    tag: "Signature Royale",
  },
  {
    id: "noor-e-nikah",
    name: "Noor-e-Nikah",
    category: "muslim",
    categoryLabel: "Islamic",
    description:
      "Embossed ivory envelope, 24K Bismillah archway, sacred Nikah timeline, and instant WhatsApp RSVP.",
    price: "₹1,199",
    tag: "Sacred Nikah",
  },
  {
    id: "royal-majesty",
    name: "Royal Majesty",
    category: "royal",
    categoryLabel: "Regency & Heritage",
    description:
      "Grand ballroom and lakeside terrace trailer with crystal chandeliers and live guestbook flights.",
    price: "₹1,199",
    tag: "Luxury Heritage",
    video: "/videos/royal-majesty.mp4",
  },
  {
    id: "rose-gold-blush",
    name: "Rose Gold Blush",
    category: "modern",
    categoryLabel: "Modern Floral",
    description:
      "Champagne silk, falling petal shower, gold foil typography, and synchronized harp score.",
    price: "₹1,199",
    tag: "Romantic Modern",
    video: "/videos/rose-gold-blush.mp4",
  },
  {
    id: "crimson-royale",
    name: "Crimson Royale",
    category: "hindu",
    categoryLabel: "Hinduism",
    description:
      "Traditional velvet doors, Ganesh Vandana, marigold courtyard, and multi-event Hindu itinerary.",
    price: "₹1,199",
    tag: "Hindu Heritage",
    video: "/templates/crimson-royale/bg-love.mp4",
  },
  {
    id: "royal-heritage",
    name: "Royal Heritage",
    category: "royal",
    categoryLabel: "Universal",
    description:
      "Mediterranean archway and coral bougainvillea cinematic reveal with panoramic photo horizon.",
    price: "₹1,199",
    tag: "New",
    video: "/videos/royal-heritage.mp4",
  },
  {
    id: "emerald-qasr",
    name: "Emerald Qasr",
    category: "muslim",
    categoryLabel: "Islamic",
    description:
      "Ottoman palace envelope opening, 24K gold filigree, Ayat blessings, and multi-event Nikah itinerary.",
    price: "₹1,199",
    tag: "Cinematic Video",
    video: "/templates/emerald-qasr/opening.mp4",
  },
  {
    id: "royal-elegance",
    name: "Royal Elegance",
    category: "hindu",
    categoryLabel: "Hinduism",
    description:
      "Maharani crimson silk curtains, royal Kundan wax seal, Gauri Ganesh blessings, and gallery lightbox.",
    price: "₹1,199",
    tag: "Best Seller",
    video: "/videos/royal-elegance-royal.mp4",
  },
];

const HOMEPAGE_CARD_COUNT = 9;

const CATEGORY_TABS = [
  { id: "all", label: "All Masterpieces" },
  { id: "royal", label: "Royal Palaces" },
  { id: "muslim", label: "Muslim Nikah" },
  { id: "hindu", label: "Hindu Heritage" },
  { id: "celestial", label: "Celestial" },
  { id: "modern", label: "Modern Floral" },
];

export function InteractiveTemplateGrid() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});

  const filtered =
    activeTab === "all"
      ? CATALOGUE_TEMPLATES
      : CATALOGUE_TEMPLATES.filter((t) => t.category === activeTab);

  const visibleCards = filtered.slice(0, HOMEPAGE_CARD_COUNT);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="showcase" className="relative w-full py-20 sm:py-28 bg-[#F7F4ED] text-[#18211E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#073D31]/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C8A45E]/35 bg-[#C8A45E]/10 px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#073D31] font-sans mb-3">
              <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
              <span>See the real demo before you buy</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#18211E]">
              Select your wedding world.
            </h2>
            <p className="text-xs sm:text-sm text-[#76766F] font-sans mt-2 max-w-lg">
              Every card autoplays its cinematic trailer — tap for template details, open the live demo when you&apos;re
              ready, then checkout with confidence. Includes{" "}
              <strong>2 complimentary matching PDFs</strong> (Barat &amp; Reception).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-6">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[44px] sm:min-h-0 flex items-center ${
                  isActive
                    ? "bg-[#073D31] text-white shadow-md border border-[#C8A45E]/40"
                    : "bg-white/80 text-stone-600 hover:text-[#18211E] hover:bg-white border border-[#073D31]/10"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {visibleCards.map((item) => (
              <TemplateCatalogCard
                key={item.id}
                layoutId={item.id}
                id={item.id}
                name={item.name}
                categoryLabel={item.categoryLabel}
                tag={item.tag}
                description={item.description}
                priceFallback={item.price}
                video={item.video}
                isWishlisted={wishlisted[item.id]}
                onToggleWishlist={(e) => toggleWishlist(item.id, e)}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-center gap-3">
          <Link
            href="/templates"
            className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-[#073D31]/20 bg-[#073D31] px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F7F4ED] font-sans shadow-md transition-all hover:bg-[#032A23] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>See All Templates</span>
            <ArrowRight size={16} weight="bold" />
          </Link>
          <p className="text-[11px] text-[#76766F] font-sans text-center max-w-md">
            Browse all 16 masterpieces — see the real demo on any template before you buy
          </p>
        </div>
      </div>
    </section>
  );
}
