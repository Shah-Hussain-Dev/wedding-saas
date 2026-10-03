import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isUserAdmin } from "@/lib/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slug";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email || !isUserAdmin(email)) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 403 });
    }

    const search = req.nextUrl.searchParams.get("search")?.toLowerCase()?.trim();
    const status = req.nextUrl.searchParams.get("status"); // "paid" | "draft" | "all"
    const template = req.nextUrl.searchParams.get("template");

    try {
      const whereClause: any = {};

      if (status === "paid") {
        whereClause.isPublished = true;
      } else if (status === "draft") {
        whereClause.isPublished = false;
      }

      if (template && template !== "all") {
        whereClause.templateId = template;
      }

      if (search) {
        whereClause.OR = [
          { brideName: { contains: search, mode: "insensitive" } },
          { groomName: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
          { user: { email: { contains: search, mode: "insensitive" } } },
        ];
      }

      const invitations = await prisma.invitation.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, email: true, name: true, phone: true },
          },
          order: {
            select: { id: true, status: true, amountPaise: true, razorpayPaymentId: true },
          },
          _count: {
            select: { guestMessages: true },
          },
        },
      });

      return NextResponse.json({ invitations });
    } catch (dbError) {
      console.warn("Prisma query failed, returning fallback:", dbError);
      return NextResponse.json({ invitations: [] });
    }
  } catch (err) {
    console.error("GET /api/admin/invitations error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const adminEmail = session?.user?.email;

    if (process.env.NODE_ENV !== "development" && !isUserAdmin(adminEmail)) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 403 });
    }

    const body = await req.json();
    const {
      targetUserEmail,
      brideName = "Diya",
      groomName = "Shaan",
      templateId = "noor-e-nikah",
      weddingDate = "2026-12-22",
      weddingTime = "06:30 PM onwards",
      venueName = "The Ridgewood Grand Palace",
      venueAddress = "Fatehsagar Lake Road, Udaipur, Rajasthan",
      isPublished = false,
      heroImageUrl = "",
      slideshowImages = [],
      eventsJson = [],
    } = body;

    if (!targetUserEmail || !targetUserEmail.includes("@")) {
      return NextResponse.json({ error: "Valid target user email is required" }, { status: 400 });
    }

    const normalizedEmail = targetUserEmail.trim().toLowerCase();
    const uniqueSlug = await generateUniqueSlug(`${brideName}-${groomName}`);

    try {
      // Find or create target user
      let user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: normalizedEmail,
            name: `${brideName} & ${groomName}`,
          },
        });
      }

      // Create order
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          templateId,
          amountPaise: 149900,
          status: isPublished ? "paid" : "pending",
          razorpayPaymentId: isPublished ? `admin_comp_${Date.now()}` : null,
        },
      });

      const invitation = await prisma.invitation.create({
        data: {
          userId: user.id,
          orderId: order.id,
          templateId,
          slug: uniqueSlug,
          brideName,
          groomName,
          weddingDate: new Date(weddingDate),
          weddingTime,
          venueName,
          venueAddress,
          heroImageUrl: heroImageUrl || null,
          slideshowImages: slideshowImages || [],
          musicTrack: `/templates/${templateId}/music.mp3`,
          eventsJson: eventsJson || [],
          isPublished: Boolean(isPublished),
        },
        include: {
          user: {
            select: { id: true, email: true, name: true },
          },
        },
      });

      return NextResponse.json({ invitation, message: "Invitation created successfully for user!" }, { status: 201 });
    } catch (dbErr) {
      console.error("Prisma error in admin invitation creation:", dbErr);
      return NextResponse.json({ error: "Database error creating invitation" }, { status: 500 });
    }
  } catch (err) {
    console.error("POST /api/admin/invitations error:", err);
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
    const { id, isPublished, templateId, brideName, groomName, slug } = body;

    if (!id) {
      return NextResponse.json({ error: "Invitation ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof isPublished === "boolean") updateData.isPublished = isPublished;
    if (templateId) updateData.templateId = templateId;
    if (brideName) updateData.brideName = brideName;
    if (groomName) updateData.groomName = groomName;
    if (slug) updateData.slug = slug;

    const updated = await prisma.invitation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ invitation: updated, message: "Invitation updated successfully!" });
  } catch (err) {
    console.error("PUT /api/admin/invitations error:", err);
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
      return NextResponse.json({ error: "Invitation ID is required" }, { status: 400 });
    }

    await prisma.guestMessage.deleteMany({ where: { invitationId: id } });
    await prisma.invitation.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Invitation deleted permanently." });
  } catch (err) {
    console.error("DELETE /api/admin/invitations error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
