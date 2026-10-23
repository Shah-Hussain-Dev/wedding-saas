"use client";

import { useState, useEffect } from "react";

export function useTemplatePricing() {
  const [pricingMap, setPricingMap] = useState<Record<string, number>>({});
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    // 1. Immediately read cached prices from localStorage on client mount (safe after hydration)
    try {
      const stored = localStorage.getItem("unfold_template_pricing");
      if (stored) {
        setPricingMap(JSON.parse(stored));
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
          if (isSubscribed && data.pricingMap) {
            setPricingMap(data.pricingMap);
            try {
              localStorage.setItem("unfold_template_pricing", JSON.stringify(data.pricingMap));
            } catch (_) {}
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

  const getPriceFormatted = (templateId: string, fallback = "₹1,199"): string => {
    const normalized = templateId.replace(/_/g, "-").toLowerCase();
    const priceNum = pricingMap[normalized];
    if (priceNum !== undefined) {
      return `₹${priceNum.toLocaleString("en-IN")}`;
    }
    return fallback;
  };

  const getPriceNumber = (templateId: string, fallback = 1199): number => {
    const normalized = templateId.replace(/_/g, "-").toLowerCase();
    const priceNum = pricingMap[normalized];
    return priceNum !== undefined ? priceNum : fallback;
  };

  return {
    pricingMap,
    isMounted,
    loading,
    getPriceFormatted,
    getPriceNumber,
  };
}
