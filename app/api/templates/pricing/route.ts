import { NextResponse } from "next/server";
import { getAllTemplatesWithPricing, TemplatePricingConfig } from "@/lib/template-pricing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const templates = await getAllTemplatesWithPricing();

    // 1. Backward-compatible simple map: { "celestial-rose": 1199, ... }
    const pricingMap: Record<string, number> = {};
    // 2. Comprehensive details map: { "celestial-rose": { priceInr, originalPriceInr, discountPercent, ... } }
    const pricingDetailsMap: Record<string, TemplatePricingConfig> = {};

    templates.forEach((t) => {
      pricingMap[t.id] = t.priceInr;
      pricingDetailsMap[t.id] = t;
    });

    return NextResponse.json(
      {
        success: true,
        templates,
        pricingMap,
        pricingDetailsMap,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        },
      }
    );
  } catch (error: any) {
    console.error("Public get template pricing error:", error);
    return NextResponse.json(
      { error: "Failed to fetch template pricing" },
      { status: 500 }
    );
  }
}
