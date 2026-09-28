"use client";

import React from "react";
import { GlassNav } from "@/components/ui/glass-nav";
import { LuxuryCursor } from "@/components/ui/luxury-cursor";
import { HeroExperience } from "@/components/marketing/hero-experience";
import { BrandStatement } from "@/components/marketing/brand-statement";
import { FeaturedShowcaseHorizontal } from "@/components/marketing/featured-showcase-horizontal";
import { HowItWorksTransforming } from "@/components/marketing/how-it-works-transforming";
import { InteractiveCustomizerDemo } from "@/components/marketing/interactive-customizer-demo";
import { FeaturesConstellation } from "@/components/marketing/features-constellation";
import { PricingEditorial } from "@/components/marketing/pricing-editorial";
import { TestimonialsEditorial } from "@/components/marketing/testimonials-editorial";
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
        {/* Scene 1: Monumental Hero with 3D Floating Invitation Universe */}
        <HeroExperience />

        {/* Scene 2: Kinetic Editorial Brand Statement */}
        <BrandStatement />

        {/* Scene 3: Horizontal Cinematic Template Exploration with Ambient Color Bleed */}
        <FeaturedShowcaseHorizontal />

        {/* Scene 4: Transforming 4-Chapter "How It Works" Story with Sticky Mockup */}
        <HowItWorksTransforming />

        {/* Scene 5: Live Real-Time Customization Playground */}
        <InteractiveCustomizerDemo />

        {/* Scene 6: Architecture of Enchantment Feature Nodes */}
        <FeaturesConstellation />

        {/* Scene 7: Transparent Luxury Pricing */}
        <PricingEditorial />

        {/* Scene 8: Couples in Love & Real Guest Reactions */}
        <TestimonialsEditorial />

        {/* Scene 9: Frequently Asked Questions */}
        <FaqEditorial />
      </main>

      {/* Scene 10: Grand Finale Call to Action & Converging Footer */}
      <PremiumFooter />
    </div>
  );
}
