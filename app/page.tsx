"use client";

import React from "react";
import { GlassNav } from "@/components/ui/glass-nav";
import { LuxuryCursor } from "@/components/ui/luxury-cursor";
import { HeroExperience } from "@/components/marketing/hero-experience";
import { BrandStatement } from "@/components/marketing/brand-statement";
import { PinnedLookbook } from "@/components/marketing/pinned-lookbook";
import { InteractiveTemplateGrid } from "@/components/marketing/interactive-template-grid";
import { CinematicFilmCanvas } from "@/components/marketing/cinematic-film-canvas";
import { InteractiveCustomizerDemo } from "@/components/marketing/interactive-customizer-demo";
import { InfiniteReelsTicker } from "@/components/marketing/infinite-reels-ticker";
import { PricingEditorial } from "@/components/marketing/pricing-editorial";
import { ValuePropsMinimal } from "@/components/marketing/value-props-minimal";
import { FaqEditorial } from "@/components/marketing/faq-editorial";
import { PremiumFooter } from "@/components/ui/premium-footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
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

        {/* Scene 8: Transparent Luxury Pricing */}
        <PricingEditorial />

        {/* Scene 9: Minimalist Value Props */}
        <ValuePropsMinimal />

        {/* Scene 10: Frequently Asked Questions */}
        <FaqEditorial />
      </main>

      {/* Scene 11: Grand Finale Call to Action & Converging Footer */}
      <PremiumFooter />
    </div>
  );
}
