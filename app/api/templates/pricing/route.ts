import { NextResponse } from "next/server";
import { getAllTemplatesWithPricing } from "@/lib/template-pricing";

export async function GET() {
  try {
    const templates = await getAllTemplatesWithPricing();
    
    // Create a simple map for fast lookups: { "celestial-rose": 1199, ... }
    const pricingMap: Record<string, number> = {};
    templates.forEach((t) => {
      pricingMap[t.id] = t.priceInr;
    });

    return NextResponse.json(
      {
        success: true,
        templates,
        pricingMap,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
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
