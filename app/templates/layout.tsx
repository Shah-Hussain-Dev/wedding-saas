import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Luxury Digital Wedding Invitation Templates — 3D Living Stationery",
  description:
    "Explore our collection of 16 interactive digital wedding invitation templates. Featuring 3D carved palace doors, gold foil reveals, sacred Nikah designs, and instant WhatsApp RSVPs.",
  alternates: {
    canonical: "/templates",
  },
  openGraph: {
    title: `Digital Wedding Invitation Templates — ${siteConfig.name}`,
    description:
      "Explore 16 masterwork animated wedding invitation templates. Experience live demos with 3D doors, music scores, and RSVP tracking.",
    url: `${siteConfig.url}/templates`,
    images: [
      {
        url: "/images/hero-bg.png",
        width: 1200,
        height: 630,
        alt: "WedInvites Digital Wedding Invitation Templates",
      },
    ],
  },
  keywords: [
    "wedding invitation templates",
    "digital wedding card designs",
    "animated wedding invitation templates",
    "online wedding card maker",
    "royal palace wedding card",
    "nikah digital invite templates",
    "hindu wedding invitation video",
    "interactive wedding stationery",
  ],
};

const TEMPLATE_ITEMS = [
  { name: "Celestial Rose Dreamscape", slug: "celestial-rose", category: "Universal / Celestial" },
  { name: "Imperial Palace", slug: "imperial-palace", category: "Royal Heritage" },
  { name: "Noor-e-Nikah", slug: "noor-e-nikah", category: "Sacred Nikah" },
  { name: "Royal Majesty", slug: "royal-majesty", category: "French Château" },
  { name: "Rose Gold Blush", slug: "rose-gold-blush", category: "Romantic Modern" },
  { name: "Emerald Qasr", slug: "emerald-qasr", category: "Mughal Architecture" },
  { name: "Gul-e-Noor", slug: "gul-e-noor", category: "Floral Nikah" },
  { name: "Azure Nikah", slug: "azure-nikah", category: "Moroccan Mosaic" },
  { name: "Kitab-e-Nikah", slug: "kitab-e-nikah", category: "Classical Manuscript" },
  { name: "Crimson Royale", slug: "crimson-royale", category: "Traditional Hindu Royale" },
  { name: "Royal Lotus", slug: "royal-lotus", category: "Vedic Heritage" },
  { name: "Emerald Noir", slug: "emerald-noir", category: "Dark Luxury Minimal" },
  { name: "Royal Elegance", slug: "royal-elegance", category: "Regal Gold Filigree" },
  { name: "Modern Minimal", slug: "modern-minimal", category: "Contemporary Clean" },
  { name: "Royal Grace", slug: "royal-grace", category: "Pastel Elegance" },
  { name: "Royal Heritage", slug: "royal-heritage", category: "Jaipur Palace" },
];

const templatesStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "WedInvites Digital Wedding Invitation Templates Collection",
  description: "Curated collection of 16 interactive 3D digital wedding invitation templates.",
  numberOfItems: TEMPLATE_ITEMS.length,
  itemListElement: TEMPLATE_ITEMS.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    url: `${siteConfig.url}/preview/${item.slug}`,
  })),
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={templatesStructuredData} />
      {children}
    </>
  );
}
