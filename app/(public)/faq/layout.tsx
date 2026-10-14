import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Digital Wedding Invitations Guide",
  description:
    "Everything you need to know about digital wedding invitations: pricing, music customization, real-time RSVP portals, WhatsApp distribution, and refund policies.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: `FAQ — ${siteConfig.name} Digital Wedding Invitations`,
    description:
      "Answers to top questions regarding animated wedding invites, WhatsApp sharing, guest list tracking, and music customizations.",
    url: `${siteConfig.url}/faq`,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is your refund policy if I purchase an invitation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WedInvites maintains a strict No-Refund Policy because your unique digital portal and cloud resources are provisioned instantaneously upon checkout. However, our concierge engineering team provides 100% white-glove assistance for any adjustments or customizations.",
      },
    },
    {
      "@type": "Question",
      name: "How do guests open and view the invitation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Guests simply tap the link sent via WhatsApp, SMS, or email. The invitation opens instantly in any mobile browser with 3D door reveals, audio soundscapes, and map navigation with zero app downloads required.",
      },
    },
    {
      "@type": "Question",
      name: "Can we make changes to dates, venues, or photos after purchasing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you have unlimited free updates from your couple dashboard until your wedding day. Changes update immediately for all guests.",
      },
    },
    {
      "@type": "Question",
      name: "How does the RSVP system work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Guests submit their attendance and wishes directly on the page, and the data automatically updates on your private dashboard with 1-click spreadsheet export.",
      },
    },
  ],
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
