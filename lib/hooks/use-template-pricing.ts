"use client";

import { useState, useEffect } from "react";

export function useTemplatePricing() {
  const [pricingMap, setPricingMap] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("unfold_template_pricing");
        if (stored) return JSON.parse(stored);
      } catch (_) {}
    }
    return {};
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchPricing() {
      try {
        const res = await fetch(`/api/templates/pricing?_t=${Date.now()}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.pricingMap) {
            setPricingMap(data.pricingMap);
            try {
              localStorage.setItem("unfold_template_pricing", JSON.stringify(data.pricingMap));
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic template prices:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPricing();

    return () => {
      isMounted = false;
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
    loading,
    getPriceFormatted,
    getPriceNumber,
  };
}
