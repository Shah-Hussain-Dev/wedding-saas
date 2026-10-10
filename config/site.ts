/**
 * Global Site & Brand Configuration
 * Central source of truth for branding, contact info, emails, URLs, and metadata.
 */

export const siteConfig = {
  name: "WedInvites",
  shortName: "wedinvites",
  legalName: "WedInvites Technologies",
  domain: "wedinvites.in",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://wedinvites.in",
  tagline: "Premium Animated Digital Wedding Invitations",
  description:
    "The premier interactive digital wedding invitation platform. Replacing static cards with living 3D experiences, orchestral soundscapes, and real-time RSVP portals on wedinvites.in.",

  // Primary Project Email - used project-wide
  email: {
    support: "support@wedinvites.in",
    contact: "support@wedinvites.in",
    privacy: "support@wedinvites.in",
    billing: "support@wedinvites.in",
    legal: "support@wedinvites.in",
    noreply: "support@wedinvites.in",
    admin: "support@wedinvites.in",
  },

  // Direct email address string for quick access
  supportEmail: "support@wedinvites.in",

  supportHours: "7 days a week, 9:00 AM – 10:00 PM IST",

  // Social & Branding handles
  social: {
    instagram: "https://instagram.com/wedinvites.in",
    instagramHandle: "@wedinvites.in",
  },

  // Logos and Media Assets
  assets: {
    logo: "/images/brand-logo.png",
    logoWhite: "/images/brand-logo-white.png",
    icon: "/images/logo.png",
    favicon: "/favicon.ico",
  },

  // Pricing entry point
  startingPrice: "₹1,199",

  // Standard Links
  links: {
    home: "/",
    templates: "/templates",
    howItWorks: "/#how-it-works",
    pricing: "/#pricing",
    dashboard: "/dashboard",
    contact: "/contact",
    privacyPolicy: "/privacy-policy",
    terms: "/terms",
    refundPolicy: "/refund-policy",
    shipping: "/shipping",
    faq: "/faq",
    affiliate: "/affiliate",
    about: "/about",
  },

  // Admin Credentials & Defaults
  admin: {
    email: "support@wedinvites.in",
    defaultEmails: [
      "support@wedinvites.in",
      "admin@wedinvites.in",
      "host@wedinvites.in",
      "admin@unfoldwed.com",
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;

export default siteConfig;
