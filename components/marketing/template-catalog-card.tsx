"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Eye, Heart } from "@phosphor-icons/react";
import { useTemplatePricing } from "@/lib/hooks/use-template-pricing";
import { useTemplateCatalog } from "@/lib/hooks/use-template-catalog";
import { getTemplateTrailerUrlOrEmpty } from "@/lib/template-trailer";
import Image from "next/image";
import { PriceText } from "@/components/ui/price-text";

export interface TemplateCatalogCardProps {
  id: string;
  name: string;
  categoryLabel: string;
  tag?: string;
  description: string;
  priceFallback: string;
  video?: string;
  isWishlisted?: boolean;
  onToggleWishlist?: (e: React.MouseEvent) => void;
  layoutId?: string;
}

function stopActionBubble(e: React.MouseEvent) {
  e.stopPropagation();
}

function TrailerMedia({ src, poster }: { src: string; poster: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [usePosterOnly, setUsePosterOnly] = React.useState(!src);

  useEffect(() => {
    setUsePosterOnly(!src);
  }, [src]);

  useEffect(() => {
    const root = containerRef.current;
    const video = videoRef.current;
    if (!root || !video || usePosterOnly) return;

    video.muted = true;
    video.defaultMuted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => setUsePosterOnly(true));
        } else {
          video.pause();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [src, usePosterOnly]);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-stone-900">
      {usePosterOnly ? (
        <Image
          src={poster}
          alt=""
          fill
          className="object-cover brightness-[0.9] transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 320px"
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover brightness-[0.9] transition-transform duration-700 group-hover:scale-105"
          onError={() => setUsePosterOnly(true)}
        />
      )}
    </div>
  );
}

export function TemplateCatalogCard({
  id,
  name,
  categoryLabel,
  tag,
  description,
  priceFallback,
  video,
  isWishlisted = false,
  onToggleWishlist,
  layoutId,
}: TemplateCatalogCardProps) {
  const { getPricingDetails } = useTemplatePricing();
  const { getCoverUrl, getTrailerUrl } = useTemplateCatalog();
  const pricing = getPricingDetails(id, priceFallback);
  const trailerForCard =
    getTrailerUrl(id) || getTemplateTrailerUrlOrEmpty(id, video);
  const posterSrc = getCoverUrl(id);
  const detailsHref = `/preview/${id}`;

  return (
      <motion.article
      layout={layoutId ? true : undefined}
      layoutId={layoutId}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35 }}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[#073D31]/10 bg-white p-3 shadow-sm transition-all duration-500 hover:border-[#073D31]/25 hover:shadow-xl"
    >
      <Link
        href={detailsHref}
        className="flex flex-col flex-1 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#C8A45E] focus-visible:ring-offset-2 cursor-pointer"
        aria-label={`View ${name} template details`}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-black/5 bg-stone-900">
          <TrailerMedia src={trailerForCard} poster={posterSrc} />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/35" />

            {pricing.isOnSale && (
            <div className="pointer-events-none absolute left-3 top-4 z-20 flex items-center gap-1.5">
              <span className="rounded-full border border-white/20 bg-emerald-600/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-md">
                {pricing.discountPercent}% OFF
              </span>
              {pricing.discountName && (
                <span className="hidden rounded-full border border-[#C8A45E]/30 bg-stone-950/80 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#E1C98E] backdrop-blur-md sm:inline-block">
                  {pricing.discountName}
                </span>
              )}
            </div>
          )}

          <div className="pointer-events-none absolute bottom-3 right-3 z-20">
            <div suppressHydrationWarning className="flex items-center gap-1.5">
              {pricing.isOnSale && (
                <PriceText className="text-[9px] font-normal text-stone-300/80 line-through">
                  {pricing.originalPriceFormatted}
                </PriceText>
              )}
              <PriceText className="text-[11px] text-white">{pricing.priceFormatted}</PriceText>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 p-3 pt-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A45E]">
              {categoryLabel}
            </span>
            {tag && (
              <span className="shrink-0 rounded-full bg-[#073D31]/8 px-2 py-0.5 text-[9px] font-semibold text-[#073D31]">
                {tag}
              </span>
            )}
          </div>

          <h3 className="font-serif text-lg font-bold text-[#18211E] transition-colors line-clamp-1 group-hover:text-[#073D31]">
            {name}
          </h3>

          <p className="text-xs leading-relaxed text-[#76766F] font-sans line-clamp-2">
            {description}
          </p>

          <div className="mt-0.5 flex items-baseline justify-between border-t border-[#073D31]/6 pt-1">
            <div className="flex items-baseline gap-2">
              <PriceText suppressHydrationWarning className="text-base text-[#18211E]">
                {pricing.priceFormatted}
              </PriceText>
              {pricing.isOnSale && (
                <PriceText suppressHydrationWarning className="text-xs font-normal text-stone-400 line-through">
                  {pricing.originalPriceFormatted}
                </PriceText>
              )}
            </div>
              {pricing.isOnSale && (
              <span
                suppressHydrationWarning
                className="rounded-full border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 font-sans"
              >
                Save <span className="price-font">{pricing.savingsFormatted}</span> ({pricing.discountPercent}% OFF)
                </span>
              )}
          </div>
        </div>
      </Link>

      {onToggleWishlist && (
        <button
          type="button"
          onClick={onToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
          className={`absolute right-6 top-6 z-30 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-transform active:scale-90 cursor-pointer ${
            isWishlisted
              ? "bg-rose-500 text-white shadow-md"
              : "bg-black/40 text-white/80 hover:bg-black/60 hover:text-white"
          }`}
        >
          <Heart size={14} weight={isWishlisted ? "fill" : "bold"} />
        </button>
      )}

      <div className="relative z-20 mt-0.5 flex flex-col gap-2 border-t border-[#073D31]/8 px-3 pb-1 pt-2.5 sm:flex-row sm:items-center">
        <Link
          href={`/customize/${id}`}
          onClick={stopActionBubble}
          className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#073D31] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#F7F4ED] font-sans transition-all hover:bg-[#032A23] group-hover:shadow-md"
        >
          <Eye size={13} weight="bold" className="text-[#E1C98E]" />
          <span>Edit &amp; Buy</span>
        </Link>

        <Link
          href={`/preview/${id}/interactive`}
          onClick={stopActionBubble}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full border border-[#073D31]/20 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#073D31] font-sans transition-all hover:bg-[#F7F4ED] sm:flex-none sm:px-3.5"
        >
          <span>View live demo</span>
          <ArrowUpRight size={14} weight="bold" />
        </Link>
        </div>
      </motion.article>
  );
}
