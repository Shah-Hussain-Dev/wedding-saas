import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/json-ld";

const TEMPLATE_METADATA_MAP: Record<
  string,
  { name: string; style: string; description: string; image?: string }
> = {
  "celestial-rose": {
    name: "Celestial Rose Dreamscape",
    style: "3D Zero Gravity & Starlight Terrace",
    description: "An ethereal 3D celestial dreamscape wedding invitation with starlight terrace video, scratch-the-stars reveal, and orchestral waltz soundtrack.",
    image: "/templates/imperial-palace/ballroom.jpg",
  },
  "imperial-palace": {
    name: "Imperial Palace",
    style: "Monumental 3D Carved Double Doors",
    description: "Monumental 3D carved double palace doors opening into a grand ballroom with crystal chandeliers, velvet transitions, and royal itinerary.",
    image: "/templates/imperial-palace/doors-hero.jpg",
  },
  "noor-e-nikah": {
    name: "Noor-e-Nikah",
    style: "Sacred Nikah & Gold Foil Envelope",
    description: "Sacred Islamic wedding invitation featuring 3D embossed floral envelope opening, Bismillah calligraphy, Ayat-ul-Mawaddah, and RSVP.",
    image: "/templates/noor-e-nikah/envelope-bg.jpg",
  },
  "royal-majesty": {
    name: "Royal Majesty",
    style: "French Château & Regency Ballroom",
    description: "Royal European château ballroom wedding invitation with grand waltz animations, lake terrace views, and VIP seating portals.",
    image: "/templates/royal-majesty/ballroom-terrace.jpg",
  },
  "rose-gold-blush": {
    name: "Rose Gold Blush",
    style: "Romantic Champagne Silk & Petals",
    description: "Romantic modern wedding invitation with shimmering champagne silk drape animations, falling rose petals, and pastel floral typography.",
    image: "/templates/rose-gold-blush/palace-arch.jpg",
  },
  "emerald-qasr": {
    name: "Emerald Qasr",
    style: "Mughal Jaali Arch & Royal Emeralds",
    description: "Majestic Mughal palace architecture wedding invitation with handcrafted jaali lattice arches, emerald gold foil, and live shehnai score.",
  },
  "gul-e-noor": {
    name: "Gul-e-Noor",
    style: "Persian Garden of Light",
    description: "Luminous floral garden wedding invitation featuring Persian rose motifs, pastel watercolor animations, and sacred vows.",
  },
  "azure-nikah": {
    name: "Azure Nikah",
    style: "Moroccan Mosaic & Royal Blue",
    description: "Vibrant Mediterranean and Moroccan tile arch nikah invitation with royal blue accents, Quranic verses, and digital RSVP.",
  },
  "kitab-e-nikah": {
    name: "Kitab-e-Nikah",
    style: "Royal Illuminated Manuscript",
    description: "Traditional illuminated manuscript wedding invitation with turning parchment pages, calligraphy headers, and multi-day itinerary.",
  },
  "crimson-royale": {
    name: "Crimson Royale",
    style: "Vedic Hindu Royal Procession",
    description: "Traditional Hindu wedding invitation featuring royal crimson silk, Ganesh invocation, 7 Vows (Saat Phere) timeline, and interactive map.",
  },
  "royal-lotus": {
    name: "Royal Lotus",
    style: "Sacred Temple Pond & Lotus Arches",
    description: "Sacred Hindu temple wedding invitation with floating lotus petals, gold temple bells, auspicious Muhurat reveal, and guest wishes wall.",
  },
  "emerald-noir": {
    name: "Emerald Noir",
    style: "Dark Mode Emerald & Gold Elegance",
    description: "Ultra-luxurious dark mode wedding invitation featuring velvet green gradients, metallic gold accents, and contemporary minimalist typography.",
  },
  "royal-elegance": {
    name: "Royal Elegance",
    style: "Regal Gold Filigree & Velvet",
    description: "Opulent regal wedding invitation with intricate gold filigree borders, wax seal interaction, and multi-event schedule cards.",
  },
  "modern-minimal": {
    name: "Modern Minimal",
    style: "Editorial High Fashion & Clean Lines",
    description: "Clean editorial wedding invitation for modern couples with architectural typography, curated photo galleries, and frictionless RSVP.",
  },
  "royal-grace": {
    name: "Royal Grace",
    style: "Pastel Heritage & Palace Courtyard",
    description: "Delicate pastel palace wedding invitation featuring marble arches, fountain animations, and soothing instrumental strings.",
  },
  "royal-heritage": {
    name: "Royal Heritage",
    style: "Jaipur Haveli & Royal Forts",
    description: "Authentic Rajasthani haveli wedding invitation with jharokha balconies, peacock feathers, royal bugle fanfare, and guest directions.",
  },
};

interface PreviewLayoutProps {
  children: React.ReactNode;
  params: Promise<{ templateId: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ templateId: string }>;
}): Promise<Metadata> {
  const { templateId } = await params;
  const normalizedId = (templateId || "").trim().replace(/_/g, "-").toLowerCase();
  const template = TEMPLATE_METADATA_MAP[normalizedId] || {
    name: templateId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    style: "Luxury Digital Wedding Invitation",
    description: `Experience the ${templateId} interactive digital wedding invitation template with 3D animation, music, and instant RSVP.`,
  };

  const title = `${template.name} — Interactive Wedding Invitation Demo`;
  const description = `${template.description} Starting at ${siteConfig.startingPrice} on ${siteConfig.name}.`;
  const url = `${siteConfig.url}/preview/${normalizedId}`;
  const imageUrl = template.image ? `${siteConfig.url}${template.image}` : `${siteConfig.url}/images/hero-bg.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${template.name} | ${siteConfig.name}`,
      description,
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${template.name} Wedding Invitation Demo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    keywords: [
      `${template.name} wedding invitation`,
      `${template.style}`,
      "digital wedding invitation demo",
      "interactive wedding card online",
      "animated wedding invite with RSVP",
      siteConfig.name,
    ],
  };
}

export default async function PreviewLayout({
  children,
  params,
}: PreviewLayoutProps) {
  const { templateId } = await params;
  const normalizedId = (templateId || "").trim().replace(/_/g, "-").toLowerCase();
  const template = TEMPLATE_METADATA_MAP[normalizedId];

  const productJsonLd = template
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${template.name} Digital Wedding Invitation Template`,
        description: template.description,
        brand: {
          "@type": "Brand",
          name: siteConfig.name,
        },
        offers: {
          "@type": "Offer",
          price: "1199",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `${siteConfig.url}/preview/${normalizedId}`,
          priceValidUntil: "2027-12-31",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "94",
          bestRating: "5",
        },
      }
    : null;

  return (
    <>
      {productJsonLd && <JsonLd data={productJsonLd} />}
      {children}
    </>
  );
}
