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

    const search = req.nextUrl.searchParams.get("search")?.toLowerCase()?.trim();

    try {
      const whereClause: any = {};
      if (search) {
        whereClause.OR = [
          { email: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ];
      }

      const users = await prisma.user.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          invitations: {
            select: { id: true, slug: true, brideName: true, groomName: true, templateId: true, isPublished: true, createdAt: true },
          },
          orders: {
            select: { id: true, status: true, amountPaise: true, razorpayPaymentId: true, createdAt: true },
          },
        },
      });

      const formatted = users.map((u) => {
        const paidOrders = u.orders.filter((o) => o.status === "paid");
        const totalSpendINR = paidOrders.reduce((sum, o) => sum + (o.amountPaise || 149900) / 100, 0);

        return {
          id: u.id,
          email: u.email,
          name: u.name || "Customer",
          phone: u.phone,
          createdAt: u.createdAt,
          invitationsCount: u.invitations.length,
          paidInvitationsCount: u.invitations.filter((i) => i.isPublished).length,
          totalSpendINR,
          invitations: u.invitations,
          orders: u.orders,
        };
      });

      return NextResponse.json({ users: formatted });
    } catch (dbError) {
      console.warn("Prisma users fetch failed, returning fallback:", dbError);
      return NextResponse.json({ users: [] });
    }
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const adminEmail = session?.user?.email;

    if (process.env.NODE_ENV !== "development" && !isUserAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 403 });
    }

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "User deleted permanently." });
  } catch (err) {
    console.error("DELETE /api/admin/users error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
