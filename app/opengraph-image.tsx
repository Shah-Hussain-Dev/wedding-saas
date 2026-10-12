import { ImageResponse } from "next/og";

export const alt = "WedInvites — Premium Animated Digital Wedding Invitations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          backgroundColor: "#073D31",
          backgroundImage: "radial-gradient(circle at 50% 35%, #0D5646 0%, #052D24 100%)",
          padding: "50px",
          color: "#FCFBF7",
          border: "12px solid #C8A45E",
          boxSizing: "border-box",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "20px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#ECC985",
            fontWeight: 700,
            marginBottom: "18px",
          }}
        >
          ✦ WEDINVITES • DIGITAL WEDDING INVITATIONS ✦
        </div>

        {/* Main Headline */}
        <div
          style={{
            display: "flex",
            fontSize: "52px",
            fontWeight: 800,
            textAlign: "center",
            color: "#FCFBF7",
            lineHeight: 1.18,
            marginBottom: "16px",
            maxWidth: "920px",
          }}
        >
          Turn Your Special Day Into a Magical Experience
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: "22px",
            color: "#DFD8C8",
            textAlign: "center",
            maxWidth: "880px",
            lineHeight: 1.4,
            marginBottom: "32px",
          }}
        >
          Cinematic 3D Door Reveals • Curated Soundtracks • Instant WhatsApp RSVP Portals
        </div>

        {/* Pricing Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#C8A45E",
            color: "#073D31",
            padding: "12px 36px",
            borderRadius: "9999px",
            fontSize: "19px",
            fontWeight: 800,
            letterSpacing: "0.08em",
          }}
        >
          LIFETIME INVITATION SUITE • ₹1,199
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
