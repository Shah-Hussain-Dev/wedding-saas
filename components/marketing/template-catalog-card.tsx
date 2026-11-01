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
          sizes="(max-width: 640px) 328px, (max-width: 1024px) 50vw, 320px"
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
      className="group relative mx-auto flex h-full w-full max-w-[min(100%,20.5rem)] flex-col justify-between overflow-hidden rounded-2xl border border-[#073D31]/10 bg-white p-2.5 shadow-sm transition-all duration-500 sm:mx-0 sm:max-w-none sm:rounded-3xl sm:p-3 hover:border-[#073D31]/25 hover:shadow-xl"
    >
      <Link
        href={detailsHref}
        className="flex flex-col flex-1 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#C8A45E] focus-visible:ring-offset-2 cursor-pointer"
        aria-label={`View ${name} template details`}
      >
        <div className="relative aspect-[5/6] max-h-[min(72vw,19.5rem)] overflow-hidden rounded-xl border border-black/5 bg-stone-900 sm:aspect-[4/5] sm:max-h-none sm:rounded-2xl">
          <TrailerMedia src={trailerForCard} poster={posterSrc} />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/35" />

            {pricing.isOnSale && (
            <div className="pointer-events-none absolute left-2 top-2 z-20 flex items-center gap-1 sm:left-3 sm:top-4">
              <span className="rounded-full border border-white/20 bg-emerald-600/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[10px]">
                {pricing.discountPercent}% OFF
              </span>
              {pricing.discountName && (
                <span className="hidden rounded-full border border-[#C8A45E]/30 bg-stone-950/80 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#E1C98E] backdrop-blur-md sm:inline-block">
                  {pricing.discountName}
                </span>
              )}
            </div>
          )}

          <div className="pointer-events-none absolute bottom-2 right-2 z-20 sm:bottom-3 sm:right-3">
            <div suppressHydrationWarning className="flex items-center gap-1 sm:gap-1.5">
              {pricing.isOnSale && (
                <PriceText className="text-[8px] font-normal text-stone-300/80 line-through sm:text-[9px]">
                  {pricing.originalPriceFormatted}
                </PriceText>
              )}
              <PriceText className="text-[10px] text-white sm:text-[11px]">{pricing.priceFormatted}</PriceText>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 p-2 pt-2.5 sm:gap-1.5 sm:p-3 sm:pt-4">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#C8A45E] sm:text-[10px]">
              {categoryLabel}
            </span>
            {tag && (
              <span className="shrink-0 rounded-full bg-[#073D31]/8 px-2 py-0.5 text-[9px] font-semibold text-[#073D31] line-clamp-1 max-w-[45%]">
                {tag}
              </span>
            )}
          </div>

          <h3 className="font-serif text-base font-bold leading-snug text-[#18211E] transition-colors line-clamp-2 sm:text-lg sm:line-clamp-1 group-hover:text-[#073D31]">
            {name}
          </h3>

          <p className="text-[11px] leading-relaxed text-[#76766F] font-sans line-clamp-2 sm:text-xs">
            {description}
          </p>

          <div className="mt-0.5 hidden items-baseline justify-between border-t border-[#073D31]/6 pt-1 sm:flex">
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
          className={`absolute right-2 top-2 z-30 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-transform active:scale-90 cursor-pointer sm:right-6 sm:top-6 sm:h-8 sm:w-8 ${
            isWishlisted
              ? "bg-rose-500 text-white shadow-md"
              : "bg-black/40 text-white/80 hover:bg-black/60 hover:text-white"
          }`}
        >
          <Heart size={14} weight={isWishlisted ? "fill" : "bold"} />
        </button>
      )}

      <div className="relative z-20 mt-0.5 flex flex-col gap-1 border-t border-[#073D31]/8 px-2 pb-0.5 pt-1 sm:flex-row sm:items-center sm:gap-2 sm:px-3 sm:pb-1 sm:pt-2.5">
        <Link
          href={`/customize/${id}`}
          onClick={stopActionBubble}
          className="flex min-h-[44px] w-full min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#073D31] px-3 py-1 text-[11px] font-bold uppercase leading-tight tracking-wider text-[#F7F4ED] font-sans transition-all hover:bg-[#032A23] group-hover:shadow-md sm:px-4 sm:py-2"
        >
          <Eye size={13} weight="bold" className="shrink-0 text-[#E1C98E]" />
          <span className="text-center">Edit &amp; Buy</span>
        </Link>

        <Link
          href={`/preview/${id}/interactive`}
          onClick={stopActionBubble}
          className="inline-flex min-h-[44px] w-full min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border border-[#073D31]/20 bg-white px-3 py-1 text-[11px] font-bold uppercase leading-tight tracking-wider text-[#073D31] font-sans transition-all hover:bg-[#F7F4ED] sm:flex-none sm:px-3.5 sm:py-2"
        >
          <span className="text-center">View live demo</span>
          <ArrowUpRight size={14} weight="bold" className="shrink-0" />
        </Link>
        </div>
      </motion.article>
  );
}
