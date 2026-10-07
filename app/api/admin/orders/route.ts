import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isUserAdmin } from "@/lib/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email || !isUserAdmin(email)) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 403 });
    }

    const status = req.nextUrl.searchParams.get("status"); // "paid" | "pending" | "all"
    const search = req.nextUrl.searchParams.get("search")?.toLowerCase()?.trim();

    try {
      const whereClause: any = {};
      if (status && status !== "all") {
        whereClause.status = status;
      }
      if (search) {
        whereClause.OR = [
          { razorpayPaymentId: { contains: search, mode: "insensitive" } },
          { razorpayOrderId: { contains: search, mode: "insensitive" } },
          { user: { email: { contains: search, mode: "insensitive" } } },
          { user: { name: { contains: search, mode: "insensitive" } } },
        ];
      }

      const orders = await prisma.order.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, email: true, name: true, phone: true },
          },
          invitations: {
            select: { id: true, slug: true, brideName: true, groomName: true, templateId: true, isPublished: true },
          },
        },
      });

      return NextResponse.json({ orders });
    } catch (dbError) {
      console.warn("Prisma orders fetch failed, returning fallback:", dbError);
      return NextResponse.json({ orders: [] });
    }
  } catch (err) {
    console.error("GET /api/admin/orders error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const adminEmail = session?.user?.email;

    if (process.env.NODE_ENV !== "development" && !isUserAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 403 });
    }

    const body = await req.json();
    const { orderId, status, unlockLinkedInvitations } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status || "paid",
        razorpayPaymentId: status === "paid" ? `admin_manual_paid_${Date.now()}` : undefined,
      },
      include: {
        invitations: true,
      },
    });

    if (unlockLinkedInvitations && status === "paid") {
      await prisma.invitation.updateMany({
        where: { orderId },
        data: { isPublished: true },
      });
    }

    return NextResponse.json({ order: updated, message: "Order payment status updated successfully!" });
  } catch (err) {
    console.error("PUT /api/admin/orders error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
