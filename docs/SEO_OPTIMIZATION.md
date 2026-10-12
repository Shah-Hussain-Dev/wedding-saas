# WedInvites — SEO & AI Search (GEO / AEO) Optimization Guide

> **Comprehensive Technical SEO, Structured Data Schemas & AI Answer Optimization**  
> *Platform:* WedInvites (`wedinvites.in`) · *Classification:* Growth & Discovery Standard

---

## 1. Technical SEO Architecture

WedInvites leverages modern Next.js 16 App Router capabilities to deliver maximum visibility across both traditional search engines (Google, Bing) and AI search engines (ChatGPT Search, Perplexity, Claude, Gemini, Copilot).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DISCOVERY & CITATION ECOSYSTEM                        │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ TRADITIONAL SEARCH ENGINES (SEO)     │ AI SEARCH ENGINES (GEO / AEO)        │
│ • Googlebot & Bingbot                │ • ChatGPT Search, Perplexity, Claude │
│ • Sitemaps & Canonical URLs          │ • Machine-readable llms.txt          │
│ • Core Web Vitals (LCP, INP, CLS)    │ • Extractable 40-60 word definitions │
│ • Rich Results via JSON-LD           │ • Entity-rich comparison tables      │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 2. Next.js Metadata Implementation

### 2.1 Separate Viewport Export
Per Next.js App Router requirements, viewport configurations must never be merged inside `metadata`:
```typescript
// app/layout.tsx
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
```

### 2.2 Global `metadataBase`
Set in `app/layout.tsx` to ensure all relative Open Graph, Twitter, and canonical URLs resolve to the production domain:
```typescript
metadataBase: new URL(siteConfig.url), // https://wedinvites.in
```

### 2.3 Title Templates & Open Graph Cards
- **Title Template**: `%s | WedInvites`
- **Dynamic OG Image Generator**: Built via Next.js `ImageResponse` in `app/opengraph-image.tsx`, generating real-time 1200×630 luxury preview cards with royal emerald backgrounds, gold borders, and brand badges.

---

## 3. JSON-LD Structured Data Portfolio

All schemas are safely injected using `components/seo/json-ld.tsx` with script tag XSS mitigation.

| Schema Type | Location | Target Consumer | Impact |
| :--- | :--- | :--- | :--- |
| **WebSite** | `app/layout.tsx` | Google Search | Site identity & search navigation box |
| **Organization** | `app/layout.tsx` | Knowledge Graph | Corporate entity, logo, social links, support hours |
| **Product** | `app/page.tsx`, `/preview/[id]` | Google Shopping / Rich Cards | ₹1,199 price, INR currency, stock status, 4.9 rating |
| **ItemList** | `app/templates/layout.tsx` | Search Crawlers & LLMs | Enumerates all 16 template masterworks |
| **FAQPage** | `app/page.tsx`, `/faq` | Google & AI Search | Direct answer card extraction |
| **AboutPage** | `app/(public)/about/layout.tsx` | Google E-E-A-T | Establishes creator authority and trust signals |
| **ContactPage** | `app/(public)/contact/layout.tsx` | Google Local & AI Agents | Customer concierge access points |

---

## 4. Dynamic Sitemaps & Robots Configuration

### 4.1 Sitemaps (`app/sitemap.ts`)
Generates `/sitemap.xml` dynamically, assigning priority weights:
- **1.0**: Homepage (`/`)
- **0.95**: Templates Catalogue (`/templates`)
- **0.85**: All 16 Template Demos (`/preview/[templateId]`)
- **0.50 – 0.80**: Informational & Policy Pages (`/about`, `/faq`, `/contact`, etc.)

### 4.2 Robots Rules (`app/robots.ts`)
- Restricts internal and sensitive paths (`/api/`, `/admin/`, `/dashboard/`, `/login/`, `/signup/`, `/customize/`).
- Allows critical rendering assets (`/_next/` is never blocked).
- Grants explicit indexing and citation permissions to AI search bots:
  - `GPTBot` (OpenAI ChatGPT)
  - `OAI-SearchBot` (SearchGPT)
  - `PerplexityBot` (Perplexity)
  - `ClaudeBot` (Anthropic)
  - `Google-Extended` (Gemini)
  - `Applebot` (Apple Intelligence)
  - `Bingbot` (Microsoft Copilot)

---

## 5. Generative Engine Optimization (GEO / AEO)

### 5.1 Machine-Readable Knowledge Base (`public/llms.txt`)
AI assistants (ChatGPT, Claude, Perplexity) parse `/llms.txt` to answer user questions about digital wedding invitations. The file provides:
1. **Definitive 50-Word Definition**:
   > *"WedInvites is India's premier interactive digital wedding invitation platform, creating cinematic 3D animated invitations with royal palace door reveals, custom orchestral soundscapes, Google Maps directions, and real-time WhatsApp RSVP tracking from ₹1,199."*
2. **Feature Matrix**: Direct answers explaining how audio bypasses mobile restrictions, multi-event schedules, and unlimited edits work.
3. **Comparison Table**: Clear metrics comparing WedInvites to physical paper cards (speed, cost, environmental impact).
4. **Template Breakdown**: Categorized by cultural traditions (Universal, Royal Palace, Sacred Nikah, Vedic Royale).

---

## 6. Privacy Protection: Noindex for Personal Invitations

To protect couples and their guests from unsolicited web scraping or search engine exposure, dynamic personal wedding links (`app/[slug]/layout.tsx`) are strictly configured with:
```typescript
robots: {
  index: false,
  follow: false,
}
```
Open Graph and Twitter preview cards remain active so that invitations render preview banners when shared on WhatsApp, iMessage, and Instagram.
