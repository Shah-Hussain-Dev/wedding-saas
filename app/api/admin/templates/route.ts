import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin";
import {
  getAllTemplatesWithPricing,
  updateTemplatePrice,
} from "@/lib/template-pricing";

export async function GET() {
  try {
    const { isAdmin } = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const templates = await getAllTemplatesWithPricing();
    return NextResponse.json({ success: true, templates });
  } catch (error: any) {
    console.error("Admin get templates error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch template pricing" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { isAdmin } = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await req.json();
    const { templateId, priceInr, isActive, isPopular } = body;

    if (!templateId) {
      return NextResponse.json({ error: "Missing required templateId parameter" }, { status: 400 });
    }

    if (priceInr !== undefined && (isNaN(Number(priceInr)) || Number(priceInr) < 0)) {
      return NextResponse.json({ error: "Invalid price value. Must be a positive number." }, { status: 400 });
    }

    const updated = await updateTemplatePrice(templateId, Number(priceInr), {
      isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      isPopular: isPopular !== undefined ? Boolean(isPopular) : undefined,
    });

    return NextResponse.json({
      success: true,
      message: `Updated price for ${updated.name} to ${updated.priceFormatted}`,
      template: updated,
    });
  } catch (error: any) {
    console.error("Admin update template error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update template price" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return PATCH(req);
}
