import { NextResponse } from "next/server";
import { getAllTemplateCatalogEntries } from "@/lib/template-settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const catalog = await getAllTemplateCatalogEntries();
    return NextResponse.json(
      { success: true, catalog },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Public template catalog error:", error);
    return NextResponse.json({ error: "Failed to fetch template catalog" }, { status: 500 });
  }
}
