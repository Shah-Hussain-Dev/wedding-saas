import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { siteConfig } from "@/config/site";
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

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  icons: {
    icon: [
      { url: siteConfig.assets.icon, type: "image/png" },
      { url: siteConfig.assets.favicon, sizes: "any" },
    ],
    shortcut: siteConfig.assets.icon,
    apple: [
      { url: siteConfig.assets.icon },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} light h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-full flex flex-col bg-[#FCFBF7] text-[#1A1A1A]">
        <SessionProvider>
          <LenisProvider>{children}</LenisProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
