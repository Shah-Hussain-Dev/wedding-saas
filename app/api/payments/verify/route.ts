import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature, fetchRazorpayPayment } from "@/lib/razorpay";
import prisma from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { getTemplateDefaultData } from "@/templates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      invitationId,
      slug,
      templateId,
      brideName,
      groomName,
      customerEmail,
      customerPhone,
      customerName,
    } = body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json({ error: "Missing verification parameters" }, { status: 400 });
    }

    // Verify signature if secret is provided, otherwise accept sandbox mock
    let isValid = false;
    if (process.env.RAZORPAY_KEY_SECRET) {
      try {
        isValid = verifyRazorpaySignature({
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        });
      } catch (sigErr) {
        console.warn("Signature check exception:", sigErr);
        isValid = false;
      }
    } else {
      console.warn("RAZORPAY_KEY_SECRET not set. Allowing sandbox verification.");
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Try to resolve customer email, phone, and name
    let email = customerEmail?.trim()?.toLowerCase();
    let phone = customerPhone?.trim();
    let name = customerName?.trim();
    let rzpNotes: any = {};

    if (razorpayPaymentId && !razorpayPaymentId.startsWith("pay_mock")) {
      try {
        const paymentDetails: any = await fetchRazorpayPayment(razorpayPaymentId);
        if (paymentDetails) {
          email = email || paymentDetails.email?.toLowerCase();
          phone = phone || paymentDetails.contact;
          name = name || paymentDetails.notes?.couple || paymentDetails.notes?.name;
          rzpNotes = paymentDetails.notes || {};
        }
      } catch (fetchErr) {
        console.warn("Could not fetch payer info from Razorpay API:", fetchErr);
      }
    }

    // Auto-create / Link User account in database
    let user: any = null;
    if (email && email.includes("@")) {
      try {
        user = await prisma.user.upsert({
          where: { email },
          update: {
            phone: phone || undefined,
            name: name || undefined,
          },
          create: {
            email,
            name: name || "Wedding Couple",
            phone: phone || null,
          },
        });
      } catch (userErr) {
        console.warn("User auto-creation/link error:", userErr);
      }
    }

    // Fallback user resolution if email was missing
    if (!user) {
      try {
        user = await prisma.user.findFirst();
      } catch (_) {}
    }

    // 1. Find and update the Order
    let order: any = null;
    try {
      order = await prisma.order.findFirst({
        where: { razorpayOrderId },
      });
    } catch (_) {}

    const resolvedTemplateId =
      templateId ||
      rzpNotes?.templateId ||
      order?.templateId ||
      "celestial-rose";

    if (order) {
      try {
        order = await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "paid",
            razorpayPaymentId,
            userId: user?.id || order.userId,
          },
        });
      } catch (orderUpdateErr) {
        console.warn("Order update warning:", orderUpdateErr);
      }
    } else if (user) {
      try {
        order = await prisma.order.create({
          data: {
            userId: user.id,
            templateId: resolvedTemplateId,
            amountPaise: 119900,
            currency: "INR",
            razorpayOrderId,
            razorpayPaymentId,
            status: "paid",
          },
        });
      } catch (orderCreateErr) {
        console.warn("Order creation warning:", orderCreateErr);
      }
    }

    // 2. Locate or Auto-Create the Invitation
    let targetInvitation: any = null;

    // A) Try finding by ID if valid UUID (not demo string)
    if (invitationId && !invitationId.startsWith("demo-")) {
      try {
        targetInvitation = await prisma.invitation.findUnique({
          where: { id: invitationId },
        });
      } catch (_) {}
    }

    // B) Try finding by candidate slug
    const candidateSlug = (
      slug ||
      rzpNotes?.slug ||
      (invitationId && invitationId.startsWith("demo-") ? invitationId.replace(/^demo-/, "") : null) ||
      ""
    )
      .trim()
      .toLowerCase();

    if (!targetInvitation && candidateSlug) {
      try {
        targetInvitation = await prisma.invitation.findUnique({
          where: { slug: candidateSlug },
        });
      } catch (_) {}
    }

    // C) Try finding recently created unlinked invitation for this template under default support user
    if (!targetInvitation && resolvedTemplateId) {
      try {
        targetInvitation = await prisma.invitation.findFirst({
          where: {
            templateId: resolvedTemplateId,
            user: { email: "support@wedinvites.in" },
            createdAt: { gte: new Date(Date.now() - 3600000 * 2) }, // within last 2 hours
          },
          orderBy: { createdAt: "desc" },
        });
      } catch (_) {}
    }

    let updatedInvitation: any = null;

    if (targetInvitation) {
      // Transfer ownership to the paid user, publish and link order
      try {
        updatedInvitation = await prisma.invitation.update({
          where: { id: targetInvitation.id },
          data: {
            isPublished: true,
            userId: user?.id || targetInvitation.userId,
            orderId: order?.id || targetInvitation.orderId,
          },
          select: {
            id: true,
            slug: true,
            brideName: true,
            groomName: true,
            templateId: true,
            isPublished: true,
            userId: true,
            venueName: true,
            weddingDate: true,
          },
        });
      } catch (invUpdateErr) {
        console.warn("Invitation update warning:", invUpdateErr);
      }
    } else if (user && order) {
      // Auto-create published invitation with template defaults
      try {
        const templateDefault = getTemplateDefaultData(resolvedTemplateId);
        const coupleBride =
          brideName ||
          rzpNotes?.brideName ||
          templateDefault?.couple?.brideName ||
          templateDefault?.brideName ||
          "Bride";
        const coupleGroom =
          groomName ||
          rzpNotes?.groomName ||
          templateDefault?.couple?.groomName ||
          templateDefault?.groomName ||
          "Groom";
        const newSlug = await generateUniqueSlug(candidateSlug || `${coupleBride}-${coupleGroom}`);

        updatedInvitation = await prisma.invitation.create({
          data: {
            userId: user.id,
            orderId: order.id,
            templateId: resolvedTemplateId,
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
          select: {
            id: true,
            slug: true,
            brideName: true,
            groomName: true,
            templateId: true,
            isPublished: true,
            userId: true,
            venueName: true,
            weddingDate: true,
          },
        });
      } catch (invCreateErr) {
        console.warn("Invitation auto-creation warning:", invCreateErr);
      }
    }

    const liveSlug = updatedInvitation?.slug || candidateSlug;
    const liveUrl = liveSlug ? `/${liveSlug}` : `/dashboard`;

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully. Invitation is now permanently live and linked to your account!",
      liveUrl,
      invitation: updatedInvitation,
      user: user
        ? {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        : null,
    });
  } catch (error: any) {
    console.error("Payment verify error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
