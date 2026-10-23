import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { siteConfig } from "@/config/site";
import { getTemplateDefaultData } from "@/templates";

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
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        // Self-healing check: ensure any paid orders have an active invitation linked to this user
        try {
          const paidOrders = await prisma.order.findMany({
            where: { userId: user.id, status: "paid" },
            include: { invitations: true },
          });

          for (const po of paidOrders) {
            if (po.invitations.length === 0) {
              // 1. Check if an unlinked invitation for this template was saved under support user
              const unlinked = await prisma.invitation.findFirst({
                where: {
                  templateId: po.templateId,
                  user: { email: siteConfig.email.support },
                },
                orderBy: { createdAt: "desc" },
              });

              if (unlinked) {
                await prisma.invitation.update({
                  where: { id: unlinked.id },
                  data: {
                    userId: user.id,
                    orderId: po.id,
                    isPublished: true,
                  },
                });
              } else {
                // 2. Auto-generate invitation from template defaults
                const templateDefault = getTemplateDefaultData(po.templateId);
                const coupleBride =
                  templateDefault?.couple?.brideName ||
                  templateDefault?.brideName ||
                  user.name?.split("&")?.[0]?.trim() ||
                  "Bride";
                const coupleGroom =
                  templateDefault?.couple?.groomName ||
                  templateDefault?.groomName ||
                  user.name?.split("&")?.[1]?.trim() ||
                  "Groom";
                const newSlug = await generateUniqueSlug(`${coupleBride}-${coupleGroom}`);

                await prisma.invitation.create({
                  data: {
                    userId: user.id,
                    orderId: po.id,
                    templateId: po.templateId,
                    slug: newSlug,
                    brideName: coupleBride,
                    groomName: coupleGroom,
                    weddingDate: new Date(Date.now() + 90 * 86400000),
                    weddingTime: "7:00 PM onwards",
                    venueName: templateDefault?.venue?.name || templateDefault?.venueName || "The Grand Palace",
                    venueAddress: templateDefault?.venue?.address || templateDefault?.venueAddress || "Rajasthan, India",
                    heroImageUrl: templateDefault?.heroImage || templateDefault?.heroImageUrl || null,
                    slideshowImages: templateDefault?.gallery || templateDefault?.slideshowImages || [],
                    musicTrack: "track1",
                    eventsJson: templateDefault?.events || templateDefault?.eventsJson || [],
                    isPublished: true,
                    translations: {
                      religion: "universal",
                    },
                  },
                });
              }
            }
          }
        } catch (healErr) {
          console.warn("Self-healing paid invitations check non-fatal error:", healErr);
        }
      }

      const invitations = await prisma.invitation.findMany({
        where: {
          user: {
            email: email,
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          order: true,
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
        const isPaid = inv.order?.status === "paid";
        const orderStatus = inv.order?.status || (isPaid ? "paid" : "pending");
        const orderAmount = inv.order?.amountPaise
          ? Math.floor(inv.order.amountPaise / 100)
          : 1199;

        return {
          ...inv,
          isPaid,
          isPublished: Boolean(inv.isPublished && isPaid),
          orderStatus,
          orderAmount,
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

      const isPaid = order.status === "paid";
      const isPublished = Boolean(body.isPublished && isPaid);

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
          isPublished,
        },
      });

      const enrichedCreated = {
        ...invitation,
        isPublished,
        isPaid,
        orderStatus: order.status,
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
          isPublished: false,
          isPaid: false,
          orderStatus: "pending",
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
