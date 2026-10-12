import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/json-ld";
import { GlassNav } from "@/components/ui/glass-nav";
import { LuxuryCursor } from "@/components/ui/luxury-cursor";
import { HeroExperience } from "@/components/marketing/hero-experience";
import { BrandStatement } from "@/components/marketing/brand-statement";
import { PinnedLookbook } from "@/components/marketing/pinned-lookbook";
import { InteractiveTemplateGrid } from "@/components/marketing/interactive-template-grid";
import { CinematicFilmCanvas } from "@/components/marketing/cinematic-film-canvas";
import { InteractiveCustomizerDemo } from "@/components/marketing/interactive-customizer-demo";
import { InfiniteReelsTicker } from "@/components/marketing/infinite-reels-ticker";
import { ComparisonSection } from "@/components/marketing/comparison-section";
import { PricingEditorial } from "@/components/marketing/pricing-editorial";
import { ValuePropsMinimal } from "@/components/marketing/value-props-minimal";
import { FaqEditorial } from "@/components/marketing/faq-editorial";
import { PremiumFooter } from "@/components/ui/premium-footer";

export const metadata: Metadata = {
  title: "Turn Your Special Day Into a Magical Experience",
  description:
    "India's premier interactive digital wedding invitation platform. 3D animated cards, personalized soundtracks, WhatsApp RSVP tracking, and instant guest sharing from ₹1,199.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.name} — Turn Your Special Day Into a Magical Experience`,
    description:
      "Craft bespoke digital wedding invitations with 3D opening doors, audio soundscapes, and real-time RSVP portals. Zero paper waste, instant delivery.",
    url: siteConfig.url,
  },
};

/**
 * Rich Structured Data for Home Page (Product / WebApplication + FAQPage)
 */
const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "@id": `${siteConfig.url}/#product`,
      name: "WedInvites Digital Wedding Invitation Suite",
      description:
        "All-inclusive interactive digital wedding invitation suite featuring 3D animated reveals, custom music score, RSVP tracker, and instant WhatsApp sharing.",
      image: [`${siteConfig.url}/images/hero-bg.png`],
      brand: {
        "@type": "Brand",
        name: siteConfig.name,
      },
      offers: {
        "@type": "Offer",
        price: "1199",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: `${siteConfig.url}/#pricing`,
        priceValidUntil: "2027-12-31",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "480",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteConfig.url}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "How do our guests open and experience the wedding invitation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You receive a personalized, private luxury webpage link. Simply share it via WhatsApp, SMS, or Instagram. When guests tap the link, the invitation immediately loads in their mobile browser with 3D door openings, soundtracks, and interactive maps — zero apps or downloads needed.",
          },
        },
        {
          "@type": "Question",
          name: "Can we customize our background music score?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Every template includes curated instrumental and traditional soundtrack tracks (shehnai, royal orchestral strings, acoustic guitar, piano). You can also provide any custom audio file of your choice.",
          },
        },
        {
          "@type": "Question",
          name: "Can we make changes after sharing the invitation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. You can edit event timings, add photos, change addresses, and update ceremony details at any time from your dashboard. All updates reflect instantly for every guest without re-sharing.",
          },
        },
        {
          "@type": "Question",
          name: "How does the RSVP tracking system work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Guests tap 'RSVP' directly inside your invitation, enter their names, guest count, and celebratory wishes. All responses sync to your couple dashboard where you can export guest lists with 1 click.",
          },
        },
        {
          "@type": "Question",
          name: "Does this support multi-event Indian weddings (Haldi, Mehendi, Sangeet, Nikah, Pheras)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! Every template supports multi-event schedules with separate dates, timings, venues, Google Maps links, and dress code color palettes for each function.",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <JsonLd data={homeStructuredData} />

      {/* Desktop Magnetic Custom Cursor & Pointer Glow */}
      <LuxuryCursor />

      {/* Floating Luxury Navigation */}
      <GlassNav />

      {/* Main Experience Stream */}
      <main className="flex-grow">
        {/* Scene 1: The Showroom Runway Hero (Scroll & Drag Parallax Depth with Floating Capsule) */}
        <HeroExperience />

        {/* Scene 2: Kinetic Editorial Brand Statement */}
        <BrandStatement />

        {/* Scene 3: The Pinned Lookbook with Active Chapter Trackers & Gold Progress Scrub */}
        <PinnedLookbook />

        {/* Scene 4: Multi-Scene Template Scrubber Catalogue */}
        <InteractiveTemplateGrid />

        {/* Scene 5: Cinematic Ambient Film Canvas */}
        <CinematicFilmCanvas />

        {/* Scene 6: Live Real-Time Interactive Customization Playground */}
        <InteractiveCustomizerDemo />

        {/* Scene 7: Infinite Motion Reels Ticker (Live in Guest Hands) */}
        <InfiniteReelsTicker />

        {/* Scene 8: The Honest Comparison (Physical Paper Cards vs. WedInvites Digital) */}
        <ComparisonSection />

        {/* Scene 9: Transparent Luxury Pricing */}
        <PricingEditorial />

        {/* Scene 10: Minimalist Value Props */}
        <ValuePropsMinimal />

        {/* Scene 11: Frequently Asked Questions */}
        <FaqEditorial />
      </main>

      {/* Scene 12: Grand Finale Call to Action & Converging Footer */}
      <PremiumFooter />
    </div>
  );
}
