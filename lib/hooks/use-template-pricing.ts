"use client";

import { useState, useEffect } from "react";

export interface TemplatePricingDetail {
  id: string;
  name?: string;
  priceInr: number; // Selling price
  originalPriceInr: number; // Strikethrough MRP
  discountPercent: number; // e.g. 60
  discountName: string; // e.g. "Early Bird Launch"
  priceFormatted: string; // "₹1,199"
  originalPriceFormatted: string; // "₹2,999"
  savingsAmountInr: number; // 1800
  savingsFormatted: string; // "₹1,800"
  isOnSale: boolean;
  isActive?: boolean;
  isPopular?: boolean;
}

export function useTemplatePricing() {
  const [pricingMap, setPricingMap] = useState<Record<string, number>>({});
  const [detailsMap, setDetailsMap] = useState<Record<string, TemplatePricingDetail>>({});
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    // 1. Read cached prices & discount details from localStorage on client mount
    try {
      const storedMap = localStorage.getItem("unfold_template_pricing");
      if (storedMap) {
        setPricingMap(JSON.parse(storedMap));
      }
      const storedDetails = localStorage.getItem("unfold_template_pricing_details");
      if (storedDetails) {
        setDetailsMap(JSON.parse(storedDetails));
      }
    } catch (_) {}

    let isSubscribed = true;

    async function fetchPricing() {
      try {
        const res = await fetch(`/api/templates/pricing?_t=${Date.now()}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (isSubscribed) {
            if (data.pricingMap) {
              setPricingMap(data.pricingMap);
              try {
                localStorage.setItem("unfold_template_pricing", JSON.stringify(data.pricingMap));
              } catch (_) {}
            }
            if (data.pricingDetailsMap) {
              setDetailsMap(data.pricingDetailsMap);
              try {
                localStorage.setItem("unfold_template_pricing_details", JSON.stringify(data.pricingDetailsMap));
              } catch (_) {}
            }
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic template prices:", err);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    }

    fetchPricing();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const getPricingDetails = (
    templateId: string,
    fallbackPrice?: number | string
  ): TemplatePricingDetail => {
    const normalized = templateId.replace(/_/g, "-").toLowerCase();
    const detail = detailsMap[normalized];
    if (detail) return detail;

    let fallbackNum = 1199;
    if (typeof fallbackPrice === "number") {
      fallbackNum = fallbackPrice;
    } else if (typeof fallbackPrice === "string") {
      const parsed = parseInt(fallbackPrice.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(parsed) && parsed > 0) {
        fallbackNum = parsed;
      }
    }

    const priceInr = pricingMap[normalized] !== undefined ? pricingMap[normalized] : fallbackNum;
    const originalPriceInr = Math.max(2999, Math.round(priceInr * 2.2));
    const discountPercent =
      originalPriceInr > priceInr
        ? Math.round(((originalPriceInr - priceInr) / originalPriceInr) * 100)
        : 0;

    return {
      id: normalized,
      priceInr,
      originalPriceInr,
      discountPercent,
      discountName: discountPercent > 0 ? `${discountPercent}% OFF Launch Deal` : "Standard Price",
      priceFormatted: `₹${priceInr.toLocaleString("en-IN")}`,
      originalPriceFormatted: `₹${originalPriceInr.toLocaleString("en-IN")}`,
      savingsAmountInr: Math.max(0, originalPriceInr - priceInr),
      savingsFormatted: `₹${Math.max(0, originalPriceInr - priceInr).toLocaleString("en-IN")}`,
      isOnSale: originalPriceInr > priceInr && priceInr > 0,
    };
  };

  const getPriceFormatted = (templateId: string, fallback = "₹1,199"): string => {
    const details = getPricingDetails(templateId);
    return details.priceFormatted || fallback;
  };

  const getPriceNumber = (templateId: string, fallback = 1199): number => {
    const details = getPricingDetails(templateId);
    return details.priceInr !== undefined ? details.priceInr : fallback;
  };

  const getOriginalPriceFormatted = (templateId: string, fallback = "₹2,999"): string => {
    const details = getPricingDetails(templateId);
    return details.originalPriceFormatted || fallback;
  };

  const getOriginalPriceNumber = (templateId: string, fallback = 2999): number => {
    const details = getPricingDetails(templateId);
    return details.originalPriceInr !== undefined ? details.originalPriceInr : fallback;
  };

  const getDiscountPercent = (templateId: string, fallback = 60): number => {
    const details = getPricingDetails(templateId);
    return details.discountPercent !== undefined ? details.discountPercent : fallback;
  };

  const getDiscountName = (templateId: string, fallback = "Launch Offer"): string => {
    const details = getPricingDetails(templateId);
    return details.discountName || fallback;
  };

  const getSavingsFormatted = (templateId: string, fallback = "₹1,800"): string => {
    const details = getPricingDetails(templateId);
    return details.savingsFormatted || fallback;
  };

  const isOnSale = (templateId: string): boolean => {
    const details = getPricingDetails(templateId);
    return details.isOnSale;
  };

  return {
    pricingMap,
    detailsMap,
    isMounted,
    loading,
    getPriceFormatted,
    getPriceNumber,
    getOriginalPriceFormatted,
    getOriginalPriceNumber,
    getDiscountPercent,
    getDiscountName,
    getSavingsFormatted,
    getPricingDetails,
    isOnSale,
  };
}
