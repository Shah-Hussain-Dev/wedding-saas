import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Partner & Affiliate Program — Earn 20% on Every Invitation",
  description:
    `Join the ${siteConfig.name} Creator & Wedding Planner Affiliate Program. Earn 20% commission on every luxury digital invitation ordered through your referral link.`,
  alternates: {
    canonical: "/affiliate",
  },
  openGraph: {
    title: `Partner & Affiliate Program — ${siteConfig.name}`,
    description: "Earn 20% commission partnering with India's premier digital wedding stationery platform.",
    url: `${siteConfig.url}/affiliate`,
  },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
