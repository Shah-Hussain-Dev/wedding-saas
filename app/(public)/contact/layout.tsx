import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Contact Concierge & Support — Bespoke Wedding Inquiries",
  description:
    `Reach out to the ${siteConfig.name} concierge team for bespoke invitation designs, technical support, music customization, and celebration logistics. Available 7 days a week.`,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `Contact Concierge — ${siteConfig.name}`,
    description: "Get in touch with our wedding stationery engineers and design team.",
    url: `${siteConfig.url}/contact`,
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${siteConfig.name}`,
  url: `${siteConfig.url}/contact`,
  mainEntity: {
    "@type": "ContactPoint",
    email: siteConfig.supportEmail,
    contactType: "customer service",
    hoursAvailable: siteConfig.supportHours,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={contactJsonLd} />
      {children}
    </>
  );
}
