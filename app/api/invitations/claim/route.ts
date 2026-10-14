import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, draft } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Find or create user
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: "Wedding Host",
        },
      });
    }

    // 2. If a single guest draft was provided, create an invitation exclusively for this user
    if (draft && draft.templateId) {
      const baseSlug = draft.slug || `${draft.brideName || "Bride"}-${draft.groomName || "Groom"}`;
      
      // Check if user already owns an invitation with this template or slug
      const alreadyOwned = await prisma.invitation.findFirst({
        where: {
          userId: user.id,
          OR: [
            { slug: draft.slug || baseSlug },
            { templateId: draft.templateId, brideName: draft.brideName, groomName: draft.groomName },
          ],
        },
      });

      if (!alreadyOwned) {
        // Generate a new unique slug for this user
        const uniqueSlug = await generateUniqueSlug(baseSlug);

        // Find or create pending order
        let order = await prisma.order.findFirst({
          where: { userId: user.id, templateId: draft.templateId },
        });

        if (!order) {
          order = await prisma.order.create({
            data: {
              userId: user.id,
              templateId: draft.templateId,
              amountPaise: 149900,
              status: "pending",
            },
          });
        }

        await prisma.invitation.create({
          data: {
            userId: user.id,
            orderId: order.id,
            templateId: draft.templateId,
            slug: uniqueSlug,
            brideName: draft.brideName || "Bride",
            groomName: draft.groomName || "Groom",
            weddingDate: draft.weddingDate ? new Date(draft.weddingDate) : new Date(Date.now() + 90 * 86400000),
            weddingTime: draft.weddingTime || "7:00 PM onwards",
            venueName: draft.venueName || "Grand Palace",
            venueAddress: draft.venueAddress || "Rajasthan, India",
            heroImageUrl: draft.heroImageUrl || null,
            slideshowImages: draft.slideshowImages || [],
            musicTrack: draft.musicTrack || "track1",
            eventsJson: draft.eventsJson || draft.events || [],
            isPublished: false,
            translations: {
              ...(draft.translations || {}),
              religion: draft.religion || "universal",
              sacredInvocation: draft.sacredInvocation || null,
              sacredVerse: draft.sacredVerse || null,
              sacredTranslation: draft.sacredTranslation || null,
            },
          },
        });
      }
    }

    // 3. Return ONLY the invitations strictly owned by this user
    const userInvitations = await prisma.invitation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        guestMessages: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const enrichedInvitations = userInvitations.map((inv) => {
      const trans = (inv.translations as any) || {};
      return {
        ...inv,
        religion: trans.religion || "universal",
        sacredInvocation: trans.sacredInvocation || null,
        sacredVerse: trans.sacredVerse || null,
        sacredTranslation: trans.sacredTranslation || null,
      };
    });

    const allMessages = userInvitations.flatMap((inv) => inv.guestMessages);

    return NextResponse.json({
      success: true,
      invitations: enrichedInvitations,
      messages: allMessages,
    });
  } catch (err: any) {
    console.error("Claim invitation error:", err);
    return NextResponse.json({ error: err?.message || "Failed to claim invitation" }, { status: 500 });
  }
}
