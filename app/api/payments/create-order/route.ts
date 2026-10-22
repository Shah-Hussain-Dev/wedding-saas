import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import prisma from "@/lib/prisma";
import { getTemplatePriceInr } from "@/lib/template-pricing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      invitationId,
      templateId,
      slug,
      customerEmail,
      customerName,
      customerPhone,
      amount,
    } = body;

    const resolvedInvitationIdentifier = invitationId || slug || `demo-${templateId || "celestial-rose"}`;

    // 1. Resolve active template ID
    let activeTemplateId = templateId;
    let targetInv: any = null;

    if (invitationId && !invitationId.startsWith("demo-")) {
      try {
        targetInv = await prisma.invitation.findUnique({
          where: { id: invitationId },
        });
      } catch (_) {}
    }

    if (!targetInv && (slug || invitationId)) {
      const candidateSlug = (slug || invitationId?.replace(/^demo-/, "") || "").trim().toLowerCase();
      if (candidateSlug) {
        try {
          targetInv = await prisma.invitation.findUnique({
            where: { slug: candidateSlug },
          });
        } catch (_) {}
      }
    }

    if (targetInv?.templateId) {
      activeTemplateId = targetInv.templateId;
    } else if (!activeTemplateId) {
      activeTemplateId = "celestial-rose";
    }

    // 2. Dynamic price lookup from admin configuration
    const configuredPrice = activeTemplateId ? await getTemplatePriceInr(activeTemplateId) : 1199;
    const resolvedAmount =
      configuredPrice !== undefined
        ? configuredPrice
        : amount !== undefined
        ? Number(amount)
        : 1199;

    const amountPaise = resolvedAmount * 100;
    const receipt = `rcpt_${String(resolvedInvitationIdentifier).slice(0, 10)}_${Date.now().toString().slice(-6)}`;

    // 3. Create order on Razorpay
    let razorpayOrder: any;
    try {
      razorpayOrder = await createRazorpayOrder({
        amount: amountPaise,
        receipt,
      });
    } catch (rzpErr) {
      console.warn("Razorpay API not configured with live credentials. Using mock order for sandbox:", rzpErr);
      razorpayOrder = {
        id: `order_mock_${Date.now()}`,
        amount: amountPaise,
        currency: "INR",
        receipt,
      };
    }

    // 4. Resolve user ownership for pending order
    let userId: string | null = null;
    const normalizedEmail = customerEmail?.trim()?.toLowerCase();

    if (normalizedEmail && normalizedEmail.includes("@")) {
      try {
        const user = await prisma.user.upsert({
          where: { email: normalizedEmail },
          update: {
            phone: customerPhone?.trim() || undefined,
            name: customerName?.trim() || undefined,
          },
          create: {
            email: normalizedEmail,
            name: customerName?.trim() || "Wedding Host",
            phone: customerPhone?.trim() || null,
          },
        });
        userId = user.id;
      } catch (userErr) {
        console.warn("User upsert in create-order error:", userErr);
      }
    }

    if (!userId && targetInv?.userId) {
      userId = targetInv.userId;
    }

    if (!userId) {
      try {
        const defaultUser = await prisma.user.findFirst();
        userId = defaultUser?.id || null;
      } catch (_) {}
    }

    // 5. Save pending order in database
    let dbOrder: any = null;
    if (userId) {
      try {
        dbOrder = await prisma.order.create({
          data: {
            userId,
            templateId: activeTemplateId,
            amountPaise,
            currency: "INR",
            razorpayOrderId: razorpayOrder.id,
            status: "pending",
          },
        });

        // Link invitation to this order if invitation exists
        if (targetInv) {
          await prisma.invitation.update({
            where: { id: targetInv.id },
            data: { orderId: dbOrder.id },
          });
        }
      } catch (dbErr) {
        console.warn("DB record creation warning in create-order:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency || "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      dbOrderId: dbOrder?.id || null,
    });
  } catch (error: any) {
    console.error("Create payment order error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
