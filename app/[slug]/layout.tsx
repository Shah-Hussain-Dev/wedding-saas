import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";

interface SlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let brideName = "";
  let groomName = "";
  let weddingDateStr = "";
  let venueName = "";
  let heroImage = "";

  try {
    const inv = await prisma.invitation.findUnique({
      where: { slug },
      select: {
        brideName: true,
        groomName: true,
        weddingDate: true,
        venueName: true,
        heroImageUrl: true,
      },
    });

    if (inv) {
      brideName = inv.brideName || "";
      groomName = inv.groomName || "";
      venueName = inv.venueName || "";
      heroImage = inv.heroImageUrl || "";
      if (inv.weddingDate) {
        weddingDateStr = new Date(inv.weddingDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    }
  } catch (err) {
    console.warn("generateMetadata DB lookup error:", err);
  }

  // Fallback if not saved to DB yet
  if (!brideName || !groomName) {
    const parsed = formatCoupleFromSlug(slug);
    brideName = brideName || parsed.bride;
    groomName = groomName || parsed.groom;
  }

  const coupleTitle = `${brideName} & ${groomName}`;
  const title = `${coupleTitle} — Wedding Celebration Invitation | ${siteConfig.name}`;
  const description = `You are cordially invited to celebrate the sacred wedding of ${coupleTitle}${
    weddingDateStr ? ` on ${weddingDateStr}` : ""
  }${venueName ? ` at ${venueName}` : ""}. View interactive 3D ceremonies, venue directions, and RSVP online.`;

  const ogImageUrl = heroImage && heroImage.startsWith("http")
    ? heroImage
    : `${siteConfig.url}/${slug}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${slug}`,
    },
    openGraph: {
      title: `${coupleTitle} — Wedding Celebration Invitation`,
      description,
      url: `${siteConfig.url}/${slug}`,
      siteName: siteConfig.name,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: `${coupleTitle} Wedding Invitation`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${coupleTitle} — Wedding Celebration Invitation`,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function SlugLayout({ children }: SlugLayoutProps) {
  return <>{children}</>;
}
