import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin";
import {
  getTemplateSettingsFromDb,
  getResolvedTemplateDefaults,
  updateTemplateSettings,
  type TemplateDefaultsJson,
  type TemplateMarketingJson,
  type TemplateSettingsUpdatePatch,
} from "@/lib/template-settings";
import { getTemplateMeta } from "@/lib/template-meta";
import {
  getTemplateCoverUrl,
  getTemplateTrailerUrlResolved,
} from "@/lib/template-settings";
import { getTemplatePricingConfig } from "@/lib/template-pricing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = { params: Promise<{ templateId: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { isAdmin } = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { templateId } = await context.params;
    const normalized = templateId.replace(/_/g, "-").toLowerCase();
    const meta = getTemplateMeta(normalized);
    const [settings, resolvedDefaults, pricing, coverImageUrl, trailerVideoUrl] =
      await Promise.all([
        getTemplateSettingsFromDb(normalized),
        getResolvedTemplateDefaults(normalized),
        getTemplatePricingConfig(normalized),
        getTemplateCoverUrl(normalized),
        getTemplateTrailerUrlResolved(normalized),
      ]);

    return NextResponse.json({
      success: true,
      templateId: normalized,
      meta: { id: meta.id, name: meta.name, style: meta.style, religion: meta.religion },
      settings: settings ?? {
        id: normalized,
        coverImageUrl: null,
        trailerVideoUrl: null,
        defaultMusicTrack: null,
        defaultsJson: {},
        marketingJson: {},
        updatedBy: null,
        updatedAt: null,
      },
      resolvedDefaults,
      coverImageUrl,
      trailerVideoUrl,
      pricing,
    });
  } catch (error: unknown) {
    console.error("Admin get template settings error:", error);
    return NextResponse.json({ error: "Failed to fetch template settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { isAdmin, email } = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { templateId } = await context.params;
    const normalized = templateId.replace(/_/g, "-").toLowerCase();
    const body = await req.json();

    const patch: TemplateSettingsUpdatePatch = {};

    if (body.coverImageUrl !== undefined) {
      patch.coverImageUrl =
        body.coverImageUrl === null || body.coverImageUrl === ""
          ? null
          : String(body.coverImageUrl);
    }
    if (body.trailerVideoUrl !== undefined) {
      patch.trailerVideoUrl =
        body.trailerVideoUrl === null || body.trailerVideoUrl === ""
          ? null
          : String(body.trailerVideoUrl);
    }
    if (body.defaultMusicTrack !== undefined) {
      patch.defaultMusicTrack =
        body.defaultMusicTrack === null || body.defaultMusicTrack === ""
          ? null
          : String(body.defaultMusicTrack);
    }
    if (body.defaultsJson !== undefined) {
      patch.defaultsJson = body.defaultsJson as TemplateDefaultsJson;
    }
    if (body.marketingJson !== undefined) {
      patch.marketingJson = body.marketingJson as TemplateMarketingJson;
    }

    const updated = await updateTemplateSettings(normalized, patch, email ?? undefined);
    const resolvedDefaults = await getResolvedTemplateDefaults(normalized);

    return NextResponse.json({
      success: true,
      message: "Template settings saved",
      settings: updated,
      resolvedDefaults,
    });
  } catch (error: unknown) {
    console.error("Admin update template settings error:", error);
    return NextResponse.json({ error: "Failed to update template settings" }, { status: 500 });
  }
}
