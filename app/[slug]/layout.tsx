import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface SlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Wedding Celebration Invitation | ${siteConfig.name}`,
    description: `You are cordially invited to celebrate our wedding. View ceremony schedule, venue directions, and RSVP online.`,
    alternates: {
      canonical: `${siteConfig.url}/${slug}`,
    },
    openGraph: {
      title: `Wedding Celebration Invitation`,
      description: `You are cordially invited to celebrate our wedding. View ceremony schedule, venue directions, and RSVP online.`,
      url: `${siteConfig.url}/${slug}`,
      images: [
        {
          url: `${siteConfig.url}/images/hero-bg.png`,
          width: 1200,
          height: 630,
          alt: "Wedding Invitation",
        },
      ],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function SlugLayout({ children }: SlugLayoutProps) {
  return <>{children}</>;
}
