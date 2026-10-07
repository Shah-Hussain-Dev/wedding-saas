import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import prisma from "@/lib/prisma";
import { getTemplatePriceInr } from "@/lib/template-pricing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invitationId, templateId } = body;

    if (!invitationId) {
      return NextResponse.json({ error: "Missing invitationId" }, { status: 400 });
    }

    // Dynamic price lookup from admin configuration or body override
    const configuredPrice = templateId ? await getTemplatePriceInr(templateId) : 1199;
    const resolvedAmount = body.amount !== undefined ? Number(body.amount) : configuredPrice;

    const amountPaise = resolvedAmount * 100;
    const receipt = `rcpt_${invitationId.slice(0, 10)}_${Date.now().toString().slice(-6)}`;

    // Create order on Razorpay
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

    // Try to find user from invitation or fallback
    let userId: string | null = null;
    try {
      const inv = await prisma.invitation.findUnique({
        where: { id: invitationId },
        select: { userId: true },
      });
      userId = inv?.userId || null;
    } catch (_) {}

    if (!userId) {
      try {
        const defaultUser = await prisma.user.findFirst();
        userId = defaultUser?.id || null;
      } catch (_) {}
    }

    // Save or update pending order in database
    let dbOrder: any = null;
    if (userId) {
      try {
        dbOrder = await prisma.order.create({
          data: {
            userId,
            templateId: templateId || "kitab-e-nikah",
            amountPaise,
            currency: "INR",
            razorpayOrderId: razorpayOrder.id,
            status: "pending",
          },
        });

        // Link invitation to this order
        await prisma.invitation.update({
          where: { id: invitationId },
          data: { orderId: dbOrder.id },
        });
      } catch (dbErr) {
        console.warn("DB record creation warning:", dbErr);
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
