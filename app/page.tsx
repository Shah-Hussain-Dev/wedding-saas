import React from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/json-ld";
import { GlassNav } from "@/components/ui/glass-nav";
import { HeroExperience } from "@/components/marketing/hero-experience";
import { BrandStatement } from "@/components/marketing/brand-statement";
import { LandingSectionPlaceholder } from "@/components/marketing/landing-section-placeholder";
import { PremiumFooter } from "@/components/ui/premium-footer";
import { NavigationSpeculationRules } from "@/components/seo/navigation-speculation-rules";

const InteractiveTemplateGrid = dynamic(
  () =>
    import("@/components/marketing/interactive-template-grid").then(
      (m) => m.InteractiveTemplateGrid
    ),
  { loading: () => <LandingSectionPlaceholder className="min-h-[36rem]" /> }
);

const InfiniteReelsTicker = dynamic(
  () =>
    import("@/components/marketing/infinite-reels-ticker").then(
      (m) => m.InfiniteReelsTicker
    ),
  { loading: () => <LandingSectionPlaceholder className="min-h-[22rem]" /> }
);

const HowItWorksEditorial = dynamic(
  () =>
    import("@/components/marketing/how-it-works-editorial").then(
      (m) => m.HowItWorksEditorial
    ),
  { loading: () => <LandingSectionPlaceholder className="min-h-[28rem]" /> }
);

const InteractiveCustomizerDemo = dynamic(
  () =>
    import("@/components/marketing/interactive-customizer-demo").then(
      (m) => m.InteractiveCustomizerDemo
    ),
  { loading: () => <LandingSectionPlaceholder className="min-h-[32rem]" /> }
);

const ComplimentaryPdfShowcase = dynamic(
  () =>
    import("@/components/marketing/complimentary-pdf-showcase").then(
      (m) => m.ComplimentaryPdfShowcase
    ),
  { loading: () => <LandingSectionPlaceholder className="min-h-[28rem]" /> }
);

const ValuePropsMinimal = dynamic(
  () =>
    import("@/components/marketing/value-props-minimal").then(
      (m) => m.ValuePropsMinimal
    ),
  { loading: () => <LandingSectionPlaceholder className="min-h-[24rem]" /> }
);

const PinnedLookbook = dynamic(
  () =>
    import("@/components/marketing/pinned-lookbook").then(
      (m) => m.PinnedLookbook
    ),
  { loading: () => <LandingSectionPlaceholder className="min-h-[40rem]" /> }
);

const ComparisonSection = dynamic(
  () =>
    import("@/components/marketing/comparison-section").then(
      (m) => m.ComparisonSection
    ),
  { loading: () => <LandingSectionPlaceholder className="min-h-[28rem]" /> }
);

const CinematicFilmCanvas = dynamic(
  () =>
    import("@/components/marketing/cinematic-film-canvas").then(
      (m) => m.CinematicFilmCanvas
    ),
  { loading: () => <LandingSectionPlaceholder className="min-h-[70vh]" /> }
);

const PricingEditorial = dynamic(
  () =>
    import("@/components/marketing/pricing-editorial").then(
      (m) => m.PricingEditorial
    ),
  { loading: () => <LandingSectionPlaceholder className="min-h-[32rem]" /> }
);

const FaqEditorial = dynamic(
  () =>
    import("@/components/marketing/faq-editorial").then((m) => m.FaqEditorial),
  { loading: () => <LandingSectionPlaceholder className="min-h-[28rem]" /> }
);

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

/**
 * Landing section order (digital product / PLG SaaS):
 * 1 Hero → 2 Positioning → 3 Product catalog → 4 Social proof → 5 How it works
 * → 6 Live demo → 7 Differentiator → 8 Feature grid → 9 Collections
 * → 10 Comparison → 11 Brand film → 12 Pricing → 13 FAQ → Footer CTA
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <link
        rel="preload"
        href="/images/palace-hero-bg.jpg"
        as="image"
        fetchPriority="high"
      />
      <link
        rel="preload"
        href="/templates/imperial-palace/ballroom.jpg"
        as="image"
        fetchPriority="high"
      />
      <NavigationSpeculationRules />
      <JsonLd data={homeStructuredData} />

      <GlassNav />

      <main id="main-content" tabIndex={-1} className="flex-grow scroll-mt-24">
        {/* 1. Above the fold — outcome, primary CTA */}
        <HeroExperience />

        {/* 2. Positioning — what you get (lightweight trust marquee) */}
        <BrandStatement />

        {/* 3. Product — template catalog (#showcase) */}
        <div className="landing-section-deferred">
          <InteractiveTemplateGrid />
        </div>

        {/* 4. Social proof — invitations in the wild */}
        <div className="landing-section-deferred">
          <InfiniteReelsTicker />
        </div>

        {/* 5. Process — nav #how-it-works */}
        <div className="landing-section-deferred">
          <HowItWorksEditorial showBrowseCta />
        </div>

        {/* 6. Product-led growth — try the editor */}
        <div className="landing-section-deferred">
          <InteractiveCustomizerDemo />
        </div>

        {/* 7. Key differentiator — website + matching PDF */}
        <div className="landing-section-deferred">
          <ComplimentaryPdfShowcase />
        </div>

        {/* 8. Feature benefits — before price decision */}
        <div className="landing-section-deferred">
          <ValuePropsMinimal />
        </div>

        {/* 9. Deeper catalog — nav #lookbook */}
        <div className="landing-section-deferred">
          <PinnedLookbook />
        </div>

        {/* 10. Objection handling — nav #comparison */}
        <div className="landing-section-deferred">
          <ComparisonSection />
        </div>

        {/* 11. Emotional brand moment (heavy media, below fold) */}
        <div className="landing-section-deferred">
          <CinematicFilmCanvas />
        </div>

        {/* 12. Pricing — nav #pricing */}
        <div className="landing-section-deferred">
          <PricingEditorial />
        </div>

        {/* 13. FAQ — schema #faq */}
        <div className="landing-section-deferred">
          <FaqEditorial />
        </div>
      </main>

      <PremiumFooter />
    </div>
  );
}
