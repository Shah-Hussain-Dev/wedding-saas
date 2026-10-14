import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { siteConfig } from "@/config/site";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email")?.toLowerCase()?.trim();

    // If no email is provided, do NOT leak other users' invitations
    if (!email) {
      return NextResponse.json({
        invitations: [],
        messages: [],
      });
    }

    try {
      const invitations = await prisma.invitation.findMany({
        where: {
          user: {
            email: email,
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          guestMessages: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      const allMessages = invitations.flatMap((inv) =>
        inv.guestMessages.map((msg) => ({
          ...msg,
          invitationSlug: inv.slug,
          invitationCouple: `${inv.brideName} & ${inv.groomName}`,
        }))
      );

      const enrichedInvitations = invitations.map((inv) => {
        const trans = (inv.translations as any) || {};
        return {
          ...inv,
          religion: trans.religion || "universal",
          sacredInvocation: trans.sacredInvocation || null,
          sacredVerse: trans.sacredVerse || null,
          sacredTranslation: trans.sacredTranslation || null,
        };
      });

      return NextResponse.json({
        invitations: enrichedInvitations,
        messages: allMessages,
      });
    } catch (dbError) {
      console.warn("DB offline or unconfigured. Returning empty list for client fallback.", dbError);
      return NextResponse.json({ error: "Database offline" }, { status: 503 });
    }
  } catch (err) {
    console.error("GET /api/invitations error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      brideName,
      groomName,
      weddingDate,
      weddingTime,
      venueName,
      venueAddress,
      venueLat,
      venueLng,
      slug,
      heroImageUrl,
      slideshowImages,
      musicTrack,
      showDressCode,
      dressCodeText,
      showTransport,
      transportText,
      eventsJson,
      templateId,
      email,
      userEmail,
      religion,
      sacredInvocation,
      sacredVerse,
      sacredTranslation,
    } = body;

    const targetEmail = (userEmail || email || siteConfig.email.support).toLowerCase().trim();

    // Generate collision-free unique slug
    const uniqueSlug = await generateUniqueSlug(slug || `${brideName}-${groomName}`);

    const resolvedReligion = religion || "universal";
    const translationsData = {
      ...(body.translations || {}),
      religion: resolvedReligion,
      sacredInvocation: sacredInvocation || null,
      sacredVerse: sacredVerse || null,
      sacredTranslation: sacredTranslation || null,
    };

    try {
      // Find or create user account to link ownership
      let user = await prisma.user.findUnique({
        where: { email: targetEmail },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: targetEmail,
            name: `${brideName} & ${groomName}`,
          },
        });
      }

      // Find or create order for this template
      let order = await prisma.order.findFirst({
        where: { userId: user.id, templateId: templateId || "royal-lotus" },
      });

      if (!order) {
        order = await prisma.order.create({
          data: {
            userId: user.id,
            templateId: templateId || "royal-lotus",
            amountPaise: 149900,
            status: "pending",
          },
        });
      }

      const invitation = await prisma.invitation.create({
        data: {
          userId: user.id,
          orderId: order.id,
          templateId: templateId || "royal-lotus",
          slug: uniqueSlug,
          brideName,
          groomName,
          weddingDate: new Date(weddingDate),
          weddingTime: weddingTime || "7:00 PM onwards",
          venueName: venueName || "The Grand Palace",
          venueAddress: venueAddress || "Rajasthan, India",
          venueLat: venueLat || null,
          venueLng: venueLng || null,
          heroImageUrl: heroImageUrl || null,
          slideshowImages: slideshowImages || [],
          musicTrack: musicTrack || "track1",
          showDressCode: Boolean(showDressCode),
          dressCodeText: dressCodeText || null,
          showTransport: Boolean(showTransport),
          transportText: transportText || null,
          eventsJson: eventsJson || [],
          translations: translationsData,
        },
      });

      const enrichedCreated = {
        ...invitation,
        religion: resolvedReligion,
        sacredInvocation: sacredInvocation || null,
        sacredVerse: sacredVerse || null,
        sacredTranslation: sacredTranslation || null,
      };

      return NextResponse.json(enrichedCreated, { status: 201 });
    } catch (dbError) {
      console.warn("Prisma create failed. Returning mock response for frontend.", dbError);
      return NextResponse.json(
        {
          id: `mock-${Date.now()}`,
          slug: uniqueSlug,
          brideName,
          groomName,
          templateId: templateId || "royal-lotus",
          weddingDate,
          weddingTime,
          venueName,
          venueAddress,
          eventsJson,
          slideshowImages,
          religion: resolvedReligion,
          sacredInvocation: sacredInvocation || null,
          sacredVerse: sacredVerse || null,
          sacredTranslation: sacredTranslation || null,
          translations: translationsData,
        },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("POST /api/invitations error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
