import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/json-ld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/**
 * Separate Viewport export required by Next.js App Router for optimal responsive & theme SEO
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCFBF7" },
    { media: "(prefers-color-scheme: dark)", color: "#073D31" },
  ],
};

/**
 * Comprehensive Root Metadata adhering to Next.js App Router & AI Search standards
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Premium Animated Digital Wedding Invitations`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Turn your wedding into an unforgettable digital celebration. Experience luxury 3D animated invitations, custom soundtracks, interactive RSVP tracking, and instant WhatsApp sharing.",
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.legalName,
  category: "Wedding Stationery & Digital Invitations",
  keywords: [
    "digital wedding invitation",
    "animated wedding invitation",
    "interactive wedding invitation card",
    "3D wedding invite website",
    "luxury digital wedding stationery",
    "indian wedding invitation online",
    "nikah digital invitation",
    "whatsapp wedding invitation",
    "wedding website with RSVP tracker",
    "paperless wedding invitations",
    "palace theme wedding invitation",
    "celestial wedding card online",
    "muhurat scratch card invitation",
    "wedding invitation video opening",
    "wedinvites",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Premium Animated Digital Wedding Invitations`,
    description:
      "Transform your special day with cinematic 3D digital wedding invitations, curated soundscapes, and real-time RSVP portals on wedinvites.in.",
    images: [
      {
        url: "/images/hero-bg.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Digital Wedding Invitations Preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Animated Digital Wedding Invitations`,
    description:
      "Living 3D experiences, orchestral soundscapes, and real-time RSVP portals for modern weddings.",
    images: ["/images/hero-bg.png"],
    creator: "@wedinvites",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: siteConfig.assets.icon, type: "image/png" },
      { url: siteConfig.assets.favicon, sizes: "any" },
    ],
    shortcut: siteConfig.assets.icon,
    apple: [{ url: siteConfig.assets.icon }],
  },
};

/**
 * Root Schema Graph (WebSite + Organization)
 */
const rootStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: "en-IN",
      publisher: {
        "@id": `${siteConfig.url}/#organization`,
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.assets.logo}`,
        caption: siteConfig.name,
      },
      sameAs: [
        siteConfig.social.instagram,
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: siteConfig.supportEmail,
        contactType: "customer service",
        availableLanguage: ["English", "Hindi"],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} light h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <head>
        <JsonLd data={rootStructuredData} />
      </head>
      <body className="min-h-full flex flex-col bg-[#FCFBF7] text-[#1A1A1A]">
        <SessionProvider>
          <LenisProvider>{children}</LenisProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
