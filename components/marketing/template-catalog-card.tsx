"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Eye } from "@phosphor-icons/react";
import { MiniPhoneMockup } from "@/components/marketing/mini-phone-mockup";
import { cardHover } from "@/components/ui/motion-primitives";
import { cn } from "@/lib/utils";
import { useTemplatePricing } from "@/lib/hooks/use-template-pricing";

export type TemplateTag = "Best Seller" | "New" | "Exclusive" | "Featured" | "Masterpiece" | "Awwwards Dreamscape";

export type TemplateCatalogItem = {
  id: string;
  name: string;
  description: string;
  tag: TemplateTag;
  gradient: string;
  leftScreen: "hero" | "curtain";
  accentClass?: string;
  religion?: ("hindu" | "muslim" | "universal")[];
  religionLabel?: string;
};

const TAG_STYLES: Record<TemplateTag, string> = {
  "Best Seller": "bg-primary text-white",
  New: "bg-[#2d6a6a] text-white",
  Exclusive: "bg-accent-gold text-white",
  Featured: "bg-[#8A6D3B] text-white",
  Masterpiece: "bg-[#551618] text-[#E5D8C4] border border-[#B89773]",
  "Awwwards Dreamscape": "bg-[#5898B8] text-[#F1E8E1] border border-[#E2B993]",
};

export function TemplateCatalogCard({ template }: { template: TemplateCatalogItem }) {
  const { getPricingDetails } = useTemplatePricing();
  const pricing = getPricingDetails(template.id, "₹1,199");

  return (
    <Link href={`/preview/${template.id}`} className="block h-full">
      <motion.article
        initial="rest"
        whileHover="hover"
        variants={cardHover}
        className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-black/[0.06] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
      >
        {/* Visual area */}
        <div className="relative flex aspect-[4/3.2] items-end justify-center gap-2 bg-[#ebe8e2] px-4 pb-5 pt-8 sm:gap-3 sm:px-5">
          <div className="absolute left-3 top-3 flex items-center gap-1.5 z-10 flex-wrap">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide",
                TAG_STYLES[template.tag]
              )}
            >
              {template.tag}
            </span>
            {pricing.isOnSale && (
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider shadow-xs">
                {pricing.discountPercent}% OFF
              </span>
            )}
            {template.religionLabel && (
              <span className="rounded-full bg-white/90 backdrop-blur-sm border border-black/[0.06] px-2 py-0.5 text-[9px] font-bold text-stone-700 uppercase tracking-wider">
                {template.religionLabel === "Hindu" ? "🕉️ Hindu" : template.religionLabel === "Muslim" ? "🌙 Muslim" : "✦ Universal"}
              </span>
            )}
          </div>

          <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.06] bg-white/90 text-stone-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            <Eye size={15} weight="light" />
          </span>

          <MiniPhoneMockup
            variant={template.leftScreen}
            templateName={template.name}
            accentClass={template.accentClass}
            bgGradient={template.gradient}
            className="-rotate-6 translate-y-1"
          />
          <MiniPhoneMockup
            variant="details"
            templateName={template.name}
            bgGradient="from-stone-50 to-stone-100"
            className="rotate-3 translate-y-3"
          />
        </div>

        {/* Content area */}
        <div className="flex flex-1 flex-col bg-white p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-serif text-xl text-[#1A1A1A]">{template.name}</h3>
          </div>
          <p className="mt-1 flex-1 text-sm leading-relaxed text-stone-500 line-clamp-2">
            {template.description}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-black/[0.05] pt-3">
            <div className="flex items-baseline gap-1.5">
              <span suppressHydrationWarning className="font-serif font-bold text-base text-primary">
                {pricing.priceFormatted}
              </span>
              {pricing.isOnSale && (
                <span suppressHydrationWarning className="text-xs text-stone-400 line-through font-mono">
                  {pricing.originalPriceFormatted}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors group-hover:text-accent-gold">
              {pricing.isOnSale && (
                <span suppressHydrationWarning className="rounded-full bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                  {pricing.discountPercent}% OFF
                </span>
              )}
              View theme
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
