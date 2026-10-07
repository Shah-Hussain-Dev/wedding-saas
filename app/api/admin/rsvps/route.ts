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

    try {
      const rsvps = await prisma.guestMessage.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          invitation: {
            select: {
              id: true,
              slug: true,
              brideName: true,
              groomName: true,
              templateId: true,
              user: {
                select: { email: true, name: true },
              },
            },
          },
        },
      });

      return NextResponse.json({ rsvps });
    } catch (dbError) {
      console.warn("Prisma query failed for admin RSVPs, returning fallback:", dbError);
      return NextResponse.json({ rsvps: [] });
    }
  } catch (err) {
    console.error("GET /api/admin/rsvps error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
