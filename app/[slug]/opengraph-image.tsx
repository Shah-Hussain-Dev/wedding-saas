import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";
import { getOgThemeForTemplate } from "@/lib/og-template-themes";

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

  let templateId = "";
  let brideName = "";
  let groomName = "";
  let weddingDateStr = "";
  let venueName = "";
  let userReligion: string | null = null;
  let customSacredInvocation: string | null = null;

  try {
    const inv = await prisma.invitation.findUnique({
      where: { slug },
      select: {
        templateId: true,
        brideName: true,
        groomName: true,
        weddingDate: true,
        venueName: true,
        translations: true,
      },
    });

    if (inv) {
      templateId = inv.templateId || "";
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
      const trans = (inv.translations as any) || {};
      userReligion = trans.religion || null;
      customSacredInvocation = trans.sacredInvocation || null;
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

  // Fallback templateId if slug itself matches a known template
  if (!templateId) {
    const cleanSlug = slug.toLowerCase();
    if (cleanSlug.includes("sheesh-mahal")) templateId = "sheesh-mahal";
    else if (cleanSlug.includes("imperial-palace")) templateId = "imperial-palace";
    else if (cleanSlug.includes("royal-heritage")) templateId = "royal-heritage";
    else if (cleanSlug.includes("celestial-rose")) templateId = "celestial-rose";
    else if (cleanSlug.includes("royal-lotus")) templateId = "royal-lotus";
    else if (cleanSlug.includes("noor-e-nikah")) templateId = "noor-e-nikah";
    else templateId = "imperial-palace";
  }

  const { theme, sacredInvocation, religion } = getOgThemeForTemplate(
    templateId,
    userReligion,
    customSacredInvocation
  );

  const coupleTitle = `${brideName} & ${groomName}`;
  const displayDateVenue = [weddingDateStr, venueName].filter(Boolean).join("  •  ");
  const nameFontSize =
    coupleTitle.length > 32
      ? "44px"
      : coupleTitle.length > 24
      ? "50px"
      : coupleTitle.length > 18
      ? "56px"
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
          backgroundColor: "#0d0305",
          backgroundImage: theme.bgGradient,
          padding: "36px",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Outer 3D Gold Filigree Border */}
        <div
          style={{
            position: "absolute",
            inset: "16px",
            border: `3px solid ${theme.borderOuter}`,
            borderRadius: "16px",
            display: "flex",
          }}
        />

        {/* Inner Delicate Dashed Border */}
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: `1px dashed ${theme.borderInner}`,
            borderRadius: "10px",
            display: "flex",
          }}
        />

        {/* Corner Diamond Ornaments */}
        <div
          style={{
            position: "absolute",
            top: "17px",
            left: "20px",
            color: theme.accentGold,
            fontSize: "14px",
            display: "flex",
          }}
        >
          ✦
        </div>
        <div
          style={{
            position: "absolute",
            top: "17px",
            right: "20px",
            color: theme.accentGold,
            fontSize: "14px",
            display: "flex",
          }}
        >
          ✦
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "17px",
            left: "20px",
            color: theme.accentGold,
            fontSize: "14px",
            display: "flex",
          }}
        >
          ✦
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "17px",
            right: "20px",
            color: theme.accentGold,
            fontSize: "14px",
            display: "flex",
          }}
        >
          ✦
        </div>

        {/* 3D Crest & Template Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            color: theme.accentGold,
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          <span>{theme.motifIcon}</span>
          <span>{theme.tagline}</span>
          <span>{theme.motifIcon}</span>
        </div>

        {/* Auspicious Sacred Invocation (Dynamic by faith/tradition) */}
        <div
          style={{
            display: "flex",
            fontSize: religion === "muslim" ? "22px" : "18px",
            color: theme.accentGold,
            fontWeight: 600,
            letterSpacing: "0.12em",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          {sacredInvocation}
        </div>

        {/* Grand Royal Couple Headline */}
        <div
          style={{
            display: "flex",
            fontSize: nameFontSize,
            fontFamily: "serif",
            fontWeight: 700,
            color: theme.primaryColor,
            textAlign: "center",
            justifyContent: "center",
            lineHeight: 1.18,
            letterSpacing: "0.02em",
            marginBottom: "12px",
            maxWidth: "980px",
            textShadow: "0 4px 18px rgba(0, 0, 0, 0.85)",
            flexWrap: "wrap",
          }}
        >
          {coupleTitle}
        </div>

        {/* Invitation Prose */}
        <div
          style={{
            display: "flex",
            fontSize: "18px",
            fontFamily: "serif",
            fontStyle: "italic",
            color: theme.subtextColor,
            textAlign: "center",
            marginBottom: "18px",
            letterSpacing: "0.03em",
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
              backgroundColor: theme.badgeBg,
              border: `1.5px solid ${theme.badgeBorder}`,
              borderRadius: "9999px",
              padding: "7px 26px",
              color: theme.primaryColor,
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              marginBottom: "16px",
              maxWidth: "920px",
              textAlign: "center",
            }}
          >
            {displayDateVenue}
          </div>
        ) : null}

        {/* Tap to View 3D Invitation Action Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: theme.pillBg,
            color: theme.pillText,
            padding: "9px 26px",
            borderRadius: "9999px",
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
          }}
        >
          <span>TAP TO OPEN 3D DIGITAL INVITATION</span>
          <span>➔</span>
        </div>

        {/* Footer Brand Watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: theme.borderInner,
            fontSize: "12px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <span>wedinvites.in</span>
          <span>•</span>
          <span>{theme.watermark}</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
