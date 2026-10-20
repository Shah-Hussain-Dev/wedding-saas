import { NextResponse } from "next/server";
import { getAllTemplatesWithPricing } from "@/lib/template-pricing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
