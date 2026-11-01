import { NextResponse } from "next/server";
import { getResolvedTemplateDefaults } from "@/lib/template-settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = { params: Promise<{ templateId: string }> };

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { templateId } = await context.params;
    const normalized = templateId.replace(/_/g, "-").toLowerCase();
    const defaults = await getResolvedTemplateDefaults(normalized);
    return NextResponse.json(
      { success: true, templateId: normalized, defaults },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error: unknown) {
    console.error("Template defaults error:", error);
    return NextResponse.json({ error: "Failed to fetch template defaults" }, { status: 500 });
  }
}
