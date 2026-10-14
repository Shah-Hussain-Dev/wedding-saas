import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About Us — The Art & Engineering of Digital Wedding Invitations",
  description:
    "Discover how WedInvites is redefining wedding stationery with living 3D experiences, zero paper waste, custom soundscapes, and frictionless WhatsApp RSVPs.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `About ${siteConfig.name} — Crafting Living Wedding Stationery`,
    description:
      "Replacing static cards with interactive 3D digital celebrations. Built for modern couples worldwide.",
    url: `${siteConfig.url}/about`,
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `About ${siteConfig.name}`,
  description: "The story, values, and engineering behind WedInvites digital wedding invitations.",
  url: `${siteConfig.url}/about`,
  mainEntity: {
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={aboutJsonLd} />
      {children}
    </>
  );
}
