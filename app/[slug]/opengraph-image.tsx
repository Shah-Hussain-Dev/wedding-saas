import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 86400;
export const alt = "Wedding Celebration Invitation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function formatCoupleFromSlug(slug: string): { bride: string; groom: string } {
  try {
    const clean = decodeURIComponent(slug).replace(/[-_]/g, " ").trim();
    const words = clean.split(/\s+/);
    if (words.length >= 2) {
      const bride = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      const groom = words.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      return { bride, groom };
    }
    return {
      bride: clean.charAt(0).toUpperCase() + clean.slice(1),
      groom: "Wedding",
    };
  } catch {
    return { bride: "Wedding", groom: "Celebration" };
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let brideName = "";
  let groomName = "";
  let weddingDateStr = "";
  let venueName = "";

  try {
    const inv = await prisma.invitation.findUnique({
      where: { slug },
      select: {
        brideName: true,
        groomName: true,
        weddingDate: true,
        venueName: true,
      },
    });

    if (inv) {
      brideName = inv.brideName || "";
      groomName = inv.groomName || "";
      venueName = inv.venueName || "";
      if (inv.weddingDate) {
        weddingDateStr = new Date(inv.weddingDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    }
  } catch (err) {
    console.warn("Could not fetch invitation for OpenGraph image:", err);
  }

  // Fallback if not found in database (e.g. customized in local state)
  if (!brideName || !groomName) {
    const parsed = formatCoupleFromSlug(slug);
    brideName = brideName || parsed.bride;
    groomName = groomName || parsed.groom;
  }

  const coupleTitle = `${brideName} & ${groomName}`;
  const displayDateVenue = [weddingDateStr, venueName].filter(Boolean).join("  •  ");
  const nameFontSize =
    coupleTitle.length > 32
      ? "44px"
      : coupleTitle.length > 24
      ? "50px"
      : coupleTitle.length > 18
      ? "58px"
      : "64px";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1c070e",
          backgroundImage:
            "radial-gradient(circle at 50% 38%, #3e121e 0%, #20060e 55%, #120308 100%)",
          padding: "36px",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Outer 24K Gold Filigree Border */}
        <div
          style={{
            position: "absolute",
            inset: "16px",
            border: "3px solid rgba(212, 175, 55, 0.85)",
            borderRadius: "16px",
            display: "flex",
          }}
        />

        {/* Inner Delicate Gold Inset */}
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "1px dashed rgba(245, 220, 140, 0.45)",
            borderRadius: "10px",
            display: "flex",
          }}
        />

        {/* Sacred Sanskrit / Wedding Motif Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            color: "#F5D77F",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          <span>•</span>
          <span>A SACRED WEDDING CELEBRATION</span>
          <span>•</span>
        </div>

        {/* Auspicious Traditional Invocation */}
        <div
          style={{
            display: "flex",
            fontSize: "20px",
            color: "#E8C26E",
            fontWeight: 600,
            letterSpacing: "0.14em",
            marginBottom: "10px",
          }}
        >
          ॥ श्री गणेशाय नमः ॥
        </div>

        {/* Grand Royal Couple Headline */}
        <div
          style={{
            display: "flex",
            fontSize: nameFontSize,
            fontFamily: "serif",
            fontWeight: 700,
            color: "#FFF8EA",
            textAlign: "center",
            justifyContent: "center",
            lineHeight: 1.2,
            letterSpacing: "0.02em",
            marginBottom: "14px",
            maxWidth: "980px",
            textShadow: "0 4px 16px rgba(0, 0, 0, 0.8)",
            flexWrap: "wrap",
          }}
        >
          {coupleTitle}
        </div>

        {/* Invitation Prose */}
        <div
          style={{
            display: "flex",
            fontSize: "19px",
            fontFamily: "serif",
            fontStyle: "italic",
            color: "#E2CBB0",
            textAlign: "center",
            marginBottom: "22px",
            letterSpacing: "0.04em",
          }}
        >
          Together with their families cordially invite you to celebrate their sacred union
        </div>

        {/* Golden Date & Venue Badge */}
        {displayDateVenue ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(212, 175, 55, 0.16)",
              border: "1.5px solid rgba(245, 220, 140, 0.75)",
              borderRadius: "9999px",
              padding: "8px 28px",
              color: "#FBE6A2",
              fontSize: "17px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              marginBottom: "18px",
            }}
          >
            {displayDateVenue}
          </div>
        ) : null}

        {/* Tap to View Interactive Invitation Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#D4AF37",
            color: "#240810",
            padding: "8px 24px",
            borderRadius: "9999px",
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span>TAP TO OPEN 3D DIGITAL INVITATION</span>
          <span>-></span>
        </div>

        {/* Footer Brand Watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "26px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "rgba(245, 220, 140, 0.55)",
            fontSize: "12px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <span>wedinvites.in</span>
          <span>•</span>
          <span>Living 3D Wedding Invitations</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
