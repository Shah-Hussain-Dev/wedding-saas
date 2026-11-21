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

  let templateId = "";
  let brideName = "";
  let groomName = "";
  let weddingDateStr = "";
  let venueName = "";
  let heroImage = "";

  try {
    const inv = await prisma.invitation.findUnique({
      where: { slug },
      select: {
        templateId: true,
        brideName: true,
        groomName: true,
        weddingDate: true,
        venueName: true,
        heroImageUrl: true,
        translations: true,
      },
    });

    if (inv) {
      templateId = inv.templateId || "";
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
  const title = `${coupleTitle} — Wedding Celebration Invitation`;
  const description = `${coupleTitle} cordially invite you to celebrate their wedding${
    weddingDateStr ? ` on ${weddingDateStr}` : ""
  }${venueName ? ` at ${venueName}` : ""}. Open your interactive 3D invitation.`;

  // Always use the lightweight, optimized 1200x630 OG image (<120KB) so WhatsApp & social scrapers never fail the 300KB limit
  const ogImageUrl = `${siteConfig.url}/${slug}/opengraph-image`;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${slug}`,
      siteName: siteConfig.name,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: `${coupleTitle} Wedding Invitation`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    other: {
      "og:image:secure_url": ogImageUrl,
      "og:image:type": "image/png",
      "og:image:width": "1200",
      "og:image:height": "630",
      image: ogImageUrl,
      thumbnail: ogImageUrl,
      "link:image_src": ogImageUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SlugLayout({ children, params }: SlugLayoutProps) {
  const { slug } = await params;
  const ogImageUrl = `${siteConfig.url}/${slug}/opengraph-image`;
  return (
    <>
      <link rel="image_src" href={ogImageUrl} />
      {children}
    </>
  );
}
