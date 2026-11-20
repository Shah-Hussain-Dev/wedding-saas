import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required." }, { status: 400 });
    }

    try {
      const invitation = await prisma.invitation.findUnique({
        where: { slug },
        include: {
          order: true,
          guestMessages: {
            orderBy: { createdAt: "desc" },
            take: 20,
          }
        }
      });

      if (!invitation) {
        return NextResponse.json({ error: "Invitation not found." }, { status: 404 });
      }

      const transObj = (invitation.translations as any) || {};
      const isPaid = invitation.order?.status === "paid";
      const rawSlideshow = Array.isArray(invitation.slideshowImages) ? invitation.slideshowImages : [];
      const enrichedInvitation = {
        ...invitation,
        isPaid,
        isPublished: Boolean(invitation.isPublished && isPaid),
        religion: transObj.religion || "universal",
        sacredInvocation: transObj.sacredInvocation || null,
        sacredVerse: transObj.sacredVerse || null,
        sacredTranslation: transObj.sacredTranslation || null,
        brideParents: transObj.brideParents || null,
        groomParents: transObj.groomParents || null,
        slideshowImages: rawSlideshow,
        gallery: rawSlideshow,
        galleryImages: rawSlideshow,
      };

      return NextResponse.json(enrichedInvitation, {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      });
    } catch (dbError) {
      console.warn("Public Invitation DB fetch failed. Relying on client-side demo fallback.", dbError);
      return NextResponse.json({ error: "Database offline" }, { status: 503 });
    }
  } catch (error) {
    console.error("API public invitation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
