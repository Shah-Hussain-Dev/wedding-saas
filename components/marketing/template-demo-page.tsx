"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GlassNav } from "@/components/ui/glass-nav";
import { PremiumFooter } from "@/components/ui/premium-footer";
import { getTemplateMeta, INCLUDED_FEATURES } from "@/lib/template-meta";
import { Check } from "@phosphor-icons/react";
import { useTemplatePricing } from "@/lib/hooks/use-template-pricing";
import { getTemplateDefaultData } from "@/templates";
import { getDefaultFaithForTemplate } from "@/lib/preview-faith-content";
import { TemplateDetailsHero } from "@/components/marketing/template-details-hero";
import { TemplateDetailsLivePreview } from "@/components/marketing/template-details-live-preview";
import { TemplateDetailsHowItWorks } from "@/components/marketing/template-details-how-it-works";
import { ComparisonSection } from "@/components/marketing/comparison-section";
import { FaqEditorial } from "@/components/marketing/faq-editorial";

interface TemplateDemoPageProps {
  templateId: string;
}

export function TemplateDemoPage({ templateId }: TemplateDemoPageProps) {
  const { getPriceFormatted, getPricingDetails } = useTemplatePricing();
  const normalizedId = (templateId || "").trim().replace(/_/g, "-").toLowerCase();
  const meta = getTemplateMeta(normalizedId);
  const templateDefault = getTemplateDefaultData(normalizedId);
  const fallbackTrack = templateDefault?.musicTrack || `/templates/${normalizedId}/music.mp3`;

  const [selectedTrackUrl, setSelectedTrackUrl] = useState<string>(fallbackTrack);
  const selectedFaith = getDefaultFaithForTemplate(normalizedId);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(`unfold_invitation_${normalizedId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.musicTrack) setSelectedTrackUrl(parsed.musicTrack);
        return;
      }
      const direct = localStorage.getItem(`unfold_preview_music_${normalizedId}`);
      if (direct) setSelectedTrackUrl(direct);
    } catch {
      /* ignore */
    }
  }, [normalizedId]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "PREVIEW_MUSIC_CHANGED" && e.data.trackUrl) {
        setSelectedTrackUrl(e.data.trackUrl);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const interactiveUrl = `/preview/${normalizedId}/interactive?embed=1&faith=${selectedFaith}&musicTrack=${encodeURIComponent(selectedTrackUrl)}`;
  const dynamicPriceNum = getPricingDetails(normalizedId, "₹1,199").priceInr;
  const dynamicPriceFormatted = getPriceFormatted(
    normalizedId,
    `₹${dynamicPriceNum.toLocaleString("en-IN")}`
  );
  const pricing = getPricingDetails(normalizedId, dynamicPriceFormatted);
  const customizeHref = `/customize/${normalizedId}?musicTrack=${encodeURIComponent(selectedTrackUrl)}`;

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#18211E] overflow-x-hidden">
      <GlassNav />

      <TemplateDetailsHero
        meta={meta}
        normalizedId={normalizedId}
        pricing={pricing}
        customizeHref={customizeHref}
        interactiveUrl={interactiveUrl}
      />

      <TemplateDetailsLivePreview
        templateId={normalizedId}
        templateName={meta.name}
        interactiveUrl={interactiveUrl}
      />

      <section className="border-t border-[#073D31]/8 bg-white py-12 sm:py-16">
        <div className="page-container">
          <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#18211E] mb-6">
            Everything included
          </h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED_FEATURES.map((feat) => (
              <li key={feat} className="flex items-start gap-2 text-sm text-[#76766F] font-sans">
                <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-[#073D31]" />
                {feat}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <TemplateDetailsHowItWorks />
      <ComparisonSection />
      <FaqEditorial />

      <PremiumFooter />

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-[#073D31]/10 bg-white/95 p-3 backdrop-blur-md pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans">
              {meta.name}
            </p>
            <p suppressHydrationWarning className="price-font text-lg text-[#073D31]">
              {pricing.priceFormatted}
            </p>
          </div>
          <Link
            href={customizeHref}
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full bg-[#073D31] px-5 text-xs font-bold text-[#F7F4ED] font-sans"
          >
            Customize
          </Link>
        </div>
      </div>

      {/* Spacer for sticky bar on mobile */}
      <div className="h-20 lg:hidden" aria-hidden />
    </div>
  );
}
