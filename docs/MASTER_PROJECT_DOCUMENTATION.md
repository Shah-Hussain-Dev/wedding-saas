# WedInvites — Master Project Documentation & Engineering Specification

> **The Definitive Engineering, Architectural, Security, Testing & Operational Manual**  
> *Platform:* WedInvites (`wedinvites.in`) · *Stack:* Next.js 16 (App Router) + React 19 + TypeScript + Prisma + PostgreSQL  
> *Classification:* Confidential & Core Project Architecture Specification · *Version:* 2.0.0

---

## 📑 Modular Documentation Guides

For focused, domain-specific deep dives, explore our modular documentation suite:

* 📐 **[Mandatory Rules & UX Standards (docs/RULES.md)](RULES.md)** — Mobile-first priority, facial clearance guarantee, 44x44px touch targets, audio autoplay gestures.
* 🛡️ **[Security Architecture & Privacy (docs/SECURITY.md)](SECURITY.md)** — Razorpay HMAC-SHA256 verification, couple privacy shielding (`noindex`), 1-click data purging, XSS & RBAC.
* 🧪 **[Testing & QA Framework (docs/TESTING.md)](TESTING.md)** — Cross-device mobile test matrix, manual QA checklists, automated smoke tests.
* 🔍 **[SEO & AI Search Optimization (docs/SEO_OPTIMIZATION.md)](SEO_OPTIMIZATION.md)** — JSON-LD structured schemas, dynamic Open Graph cards, sitemaps, robots rules, and `llms.txt`.
* 🏛️ **[System Architecture & Data Models (docs/ARCHITECTURE.md)](ARCHITECTURE.md)** — Next.js 16 App Router topology, Prisma ERD, template engine contracts.
* ⚙️ **[Backend Integration Guide (docs/BACKEND_INTEGRATION_GUIDE.md)](BACKEND_INTEGRATION_GUIDE.md)** — Supabase, Razorpay, Cloudinary & SMTP setup instructions.
* 🎨 **[Master Brand Identity (BRAND.md)](../BRAND.md)** — Visual identity tokens, color palettes, and AI prompting handbook.

---

## Table of Contents

1. [Executive Overview & Business Logic](#1-executive-overview--business-logic)
2. [Full Technology Stack & Architecture](#2-full-technology-stack--architecture)
3. [Directory & Routing Architecture](#3-directory--routing-architecture)
4. [Database & Data Modeling (Prisma ORM)](#4-database--data-modeling-prisma-orm)
5. [Mandatory Design Rules & Mobile-First Standards](#5-mandatory-design-rules--mobile-first-standards)
6. [Security Architecture & Data Privacy](#6-security-architecture--data-privacy)
7. [Testing, QA & Validation Framework](#7-testing-qa--validation-framework)
8. [SEO & AI Search (GEO/AEO) Strategy](#8-seo--ai-search-geoaeo-strategy)
9. [DevOps, Deployment & Operations Runbook](#9-devops-deployment--operations-runbook)
10. [Troubleshooting & Emergency Procedures](#10-troubleshooting--emergency-procedures)

---

## 1. Executive Overview & Business Logic

### 1.1 The Vision
**WedInvites** (`wedinvites.in`) is an atelier-grade interactive digital wedding stationery platform. It replaces slow, fragile physical paper wedding cards and static PDF files with living, responsive 3D web invitations delivered instantly via WhatsApp, SMS, and email.

### 1.2 Core Value Proposition
- **Living 3D Artistry**: Real-time 3D carved double doors opening, gold wax seal cracking, petal showers, and scratch-off auspicious Muhurat dates.
- **Curated Soundscapes**: Classical sitar, royal shehnai, violin, and orchestral scores with user audio toggles.
- **Frictionless Logistics**: 1-click Google Maps venue directions, multi-event itineraries (Haldi, Mehendi, Sangeet, Nikah, Pheras, Reception), and real-time RSVP guest tracking.
- **Economical & Ecological**: An all-inclusive flat fee of **₹1,199** for lifetime hosting and unlimited revisions, saving couples 70–90% compared to traditional printing (₹15,000–₹60,000+) while generating zero paper waste.

### 1.3 Core User Journey

```mermaid
graph LR
    A[Public Visitor] --> B[Browse 16 Templates /templates]
    B --> C[Interactive Sandbox Demo /preview/:id]
    C --> D[Customize Invitation /customize/:id]
    D --> E[Checkout via Razorpay ₹1,199]
    E --> F[Instant Provisioning & Webhook Sync]
    F --> G[Couple Live Portal /[slug]]
    G --> H[WhatsApp / SMS Distribution to Guests]
    H --> I[Guests View 3D Doors & Submit RSVPs]
    I --> J[Couple Dashboard: Real-time RSVPs & Edits]
```

---

## 2. Full Technology Stack & Architecture

| Layer | Technology | Version | Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js App Router | `16.2.9` | Hybrid SSR/SSG/ISR, streaming Server Components, optimal SEO and TTFB |
| **UI Runtime** | React | `19.2.4` | Modern concurrent features, Server Actions, ref cleanups |
| **Language** | TypeScript | `5.x` | Strict type safety, interface contracts, zero `any` tolerance |
| **Styling** | Tailwind CSS v4 | `4.x` | Modern CSS `@theme` tokens, native nesting, zero build-step overhead |
| **Animations** | Motion (Framer Motion) & GSAP | `12.42.0` / `3.15.0` | 3D physics-based doors, particle confetti, smooth scroll parallax |
| **Smooth Scroll** | Lenis | `1.3.25` | Momentum-based, buttery smooth scrolling synchronized with animations |
| **Database** | PostgreSQL | 15+ | Relational integrity for users, orders, invitations, and multi-event RSVPs |
| **ORM** | Prisma | `7.8.0` | Type-safe queries, migration management, schema synchronization |
| **Authentication** | NextAuth.js (Auth.js) | `4.24.14` | Secure JWT session management, Credentials + Google OAuth |
| **Payments** | Razorpay SDK | `2.9.6` | Domestic & international UPI, Netbanking, Cards, Webhooks with HMAC verification |
| **Media Storage** | Cloudinary | `2.10.0` | Automated WebP/AVIF transformation, CDN delivery, mobile bandwidth optimization |
| **Email Service** | Nodemailer | `7.0.13` | Transactional order receipts, magic links, concierge notifications |
| **Iconography** | Phosphor Icons | `2.1.10` | Lightweight SVG icons with SSR support (`@phosphor-icons/react/dist/ssr`) |

---

## 3. Directory & Routing Architecture

```
wedding-saas/
├── app/                                 # Next.js App Router Root
│   ├── (public)/                        # Public Content & Legal Route Group
│   │   ├── about/                       # Company story & values
│   │   ├── affiliate/                   # Partner program (20% commission)
│   │   ├── contact/                     # Concierge inquiries & support
│   │   ├── faq/                         # Knowledge base & FAQs
│   │   ├── privacy-policy/              # GDPR / DPDP data security policies
│   │   ├── refund-policy/               # Strict no-refund policy with support guarantee
│   │   ├── shipping/                    # Instant digital fulfillment statement
│   │   ├── terms/                       # Terms of service & licensing
│   │   └── layout.tsx                   # Public shell (GlassNav + PremiumFooter)
│   ├── [slug]/                          # Couple's Live Invitation URL (e.g. /priya-and-arjun)
│   │   ├── layout.tsx                   # Private invite layout (noindex, canonical, OG tags)
│   │   └── page.tsx                     # Dynamic template renderer with DoorAnimation & RSVP
│   ├── admin/                           # Super Admin Control Center (Metrics, Orders, Users)
│   ├── api/                             # API Route Handlers
│   │   ├── admin/                       # Admin management endpoints
│   │   ├── audio/                       # Audio asset streaming & proxies
│   │   ├── auth/                        # NextAuth route handlers
│   │   ├── invitations/                 # CRUD for invitations (save, publish, delete)
│   │   ├── messages/                    # Guest RSVP & celebratory messages
│   │   ├── payments/                    # Razorpay order creation & HMAC verification
│   │   ├── templates/                   # Template pricing & metadata endpoints
│   │   └── upload/                      # Cloudinary secure upload handler
│   ├── customize/                       # Couple customization studio
│   ├── dashboard/                       # Couple private portal (guestlists, edits, CSV export)
│   ├── login/ & signup/                 # Authentication pages
│   ├── preview/[templateId]/            # Interactive live template previewer
│   │   ├── layout.tsx                   # Dynamic template metadata & Product JSON-LD schema
│   │   └── page.tsx                     # Responsive mobile frame & customizer drawer
│   ├── templates/                       # Full catalogue of 16 invitation designs
│   │   ├── layout.tsx                   # ItemList schema & catalogue metadata
│   │   └── page.tsx                     # Filterable template grid (Universal, Hindu, Nikah)
│   ├── layout.tsx                       # Global Root Layout (Fonts, Lenis, Viewport, WebSite schema)
│   ├── page.tsx                         # Homepage (Server Component with rich JSON-LD & 12 scenes)
│   ├── manifest.ts                      # Web App Manifest (PWA)
│   ├── opengraph-image.tsx              # Dynamic 1200x630 Open Graph image generator
│   ├── robots.ts                        # Crawler rules & AI search bot permissions
│   └── sitemap.ts                       # Dynamic XML sitemap
├── components/                          # Reusable UI & Feature Components
│   ├── invitation/                      # DoorAnimation, MusicPlayer, LanguageToggle, RSVPForm
│   ├── marketing/                       # Homepage Scenes (Hero, Lookbook, Comparison, Pricing, FAQ)
│   ├── preview/                         # Device Frames, DemoBanner, CustomizerDrawer
│   ├── providers/                       # SessionProvider, LenisProvider
│   ├── seo/                             # JsonLd safe structured data component
│   └── ui/                              # GlassNav, PremiumFooter, LuxuryCursor, Buttons
├── config/                              # Global Site & Brand Config
│   └── site.ts                          # Single source of truth for URLs, emails, branding
├── lib/                                 # Core Utilities & Backend Modules
│   ├── admin.ts                         # Super Admin session verification
│   ├── auth.ts                          # NextAuth configuration & credentials provider
│   ├── cloudinary.ts                    # Cloudinary upload & media helpers
│   ├── email.ts                         # SMTP Nodemailer transport & templates
│   ├── prisma.ts                        # Singleton Prisma client instance
│   ├── razorpay.ts                      # Payment initialization & HMAC signature validator
│   ├── slug.ts                          # URL slug collision resolution & sanitization
│   └── template-meta.ts                 # Metadata for all 16 template masterworks
├── prisma/                              # Prisma ORM Schema & Migrations
│   └── schema.prisma                    # PostgreSQL database models
├── public/                              # Static Public Assets
│   ├── images/                          # Brand logos, hero backgrounds, avatars
│   ├── templates/                       # Static template assets (doors, textures, audio)
│   └── llms.txt                         # Standardized AI search & LLM citation file
└── templates/                           # 16 Self-Contained Template Engines
    ├── celestial-rose/                  # 3D Zero Gravity & Starlight Terrace
    ├── imperial-palace/                 # Monumental 3D Carved Double Doors
    ├── noor-e-nikah/                    # Sacred Nikah with Gold Embossed Envelope
    ├── royal-majesty/                   # French Château Regency Ballroom Waltz
    ├── rose-gold-blush/                 # Champagne Silk Drapes & Petal Shower
    └── ... (11 additional templates)
```

---

## 4. Database & Data Modeling (Prisma ORM)

### 4.1 Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Account : has
    User ||--o{ Session : has
    User ||--o{ Order : places
    User ||--o{ Invitation : creates
    Order ||--o{ Invitation : fulfills
    Invitation ||--o{ GuestMessage : receives

    User {
        uuid id PK
        string email UK
        string passwordHash
        string name
        string phone
        datetime createdAt
    }

    Order {
        uuid id PK
        uuid userId FK
        string templateId
        int amountPaise
        string currency
        string razorpayOrderId
        string razorpayPaymentId
        string status
        datetime createdAt
    }

    Invitation {
        uuid id PK
        uuid userId FK
        uuid orderId FK
        string templateId
        string slug UK
        string brideName
        string groomName
        date weddingDate
        string weddingTime
        string venueName
        string venueAddress
        decimal venueLat
        decimal venueLng
        string heroImageUrl
        json slideshowImages
        string musicTrack
        json eventsJson
        boolean showDressCode
        string dressCodeText
        boolean isPublished
        boolean isArchived
        datetime createdAt
        datetime updatedAt
    }

    GuestMessage {
        uuid id PK
        uuid invitationId FK
        string guestName
        string message
        json rsvpJson
        datetime createdAt
    }
```

### 4.2 Key Schema Rules
1. **Financial Precision**: All monetary values (`amountPaise`) are strictly stored as integers in **paise** (`₹1,199 = 119900 paise`). Floats are strictly prohibited for monetary transactions.
2. **Slug Uniqueness**: The `slug` field in `invitations` is globally unique. Slugs are formatted in lowercase alphanumeric kebab-case (e.g., `aarav-and-ananya-2026`).
3. **Data Integrity & Cascading**:
   - Deleting a `User` cascades deletions to their `Account`, `Session`, and `Invitation` records.
   - Deleting an `Invitation` cascades deletions to all associated `GuestMessage` entries.
   - `Order` records are retained for regulatory tax and financial accounting purposes.

---

## 5. Mandatory Design Rules & Mobile-First Standards

### 5.1 Rule 1: Strict Mobile-First Priority (360px – 430px)
- **Principle**: Over 95% of guests will open invitations on mobile devices via WhatsApp links.
- **Implementation**:
  - All layout classes and styles must be written for mobile portrait viewports (`360px` – `430px`) first.
  - Tablet (`min-width: 768px`) and Desktop (`min-width: 1024px`) must strictly be applied via media queries (`sm:`, `md:`, `lg:`).
  - Horizontal scroll must never occur (`overflow-x: hidden` / `overflow-x: clip`).

### 5.2 Rule 2: Facial Clearance & Visual Focal Protection
- **Problem**: Floating headline banners or buttons can occlude the faces of couples, bride/groom portraits, or sacred motifs (Bismillah calligraphy, Ganesha artwork).
- **Rule**:
  - The faces, crowns, jewelry, and expressions in portrait artworks must **NEVER** be obscured by floating cards.
  - **Tri-Tier Layout Standard**:
    - **Top (0–20%)**: Minimalist header arch or sacred invocation badge.
    - **Middle (20–75%)**: 100% unobstructed, crystal-clear view of the artwork and couple portrait.
    - **Bottom (75–100%)**: Frosted-glass floating pedestal card containing couple names, dates, and interactive CTAs.

### 5.3 Rule 3: Touch Target Ergonomics & Thumb Zone
- **Minimum Target**: Every interactive element (buttons, wax seals, sound toggles, RSVP options, map links) must have an absolute minimum touch target of **44×44px**.
- **Safe Area Insets**: Floating action buttons must account for mobile navigation home indicators using `env(safe-area-inset-bottom)`.

### 5.4 Rule 4: Audio Autoplay Policy & Tap-to-Unfold Gesture
- **Browser Constraint**: iOS Safari and Android Chrome prevent background audio from playing without an explicit user gesture.
- **Solution**:
  - Live invitation pages must launch with a closed curtain/door overlay requiring a single tap (`"Tap to Open"`).
  - That tap unlocks the `AudioContext` / `<audio>` element while simultaneously initiating the 3D door unfolding timeline.

---

## 6. Security Architecture & Data Privacy

### 6.1 Payment Security & Fraud Prevention

```mermaid
sequenceDiagram
    participant Client as Couple Browser
    participant API as /api/payments/create-order
    participant Razorpay as Razorpay API
    participant VerifyAPI as /api/payments/verify
    participant DB as PostgreSQL Database

    Client->>API: Request checkout for templateId
    API->>API: Validate template & set server price (119900 paise)
    API->>Razorpay: orders.create({ amount: 119900, currency: 'INR' })
    Razorpay-->>API: Returns razorpayOrderId
    API->>DB: Create Order (status: "pending")
    API-->>Client: Returns orderId & razorpayOrderId
    Client->>Razorpay: Open Razorpay Checkout modal & complete payment
    Razorpay-->>Client: Returns paymentId & signature
    Client->>VerifyAPI: Send { orderId, paymentId, signature }
    VerifyAPI->>VerifyAPI: Compute HMAC-SHA256(orderId + "|" + paymentId, SECRET)
    alt Signature Matches
        VerifyAPI->>DB: Update Order (status: "paid")
        VerifyAPI->>DB: Provision & Publish Invitation
        VerifyAPI-->>Client: 200 OK (Redirect to /dashboard or /[slug])
    else Signature Invalid
        VerifyAPI-->>Client: 400 Bad Request (Payment Tampering Detected)
    end
```

- **Server-Side Pricing Authority**: The client never passes the price. The price is strictly determined by the server (`lib/template-pricing.ts`).
- **HMAC SHA-256 Signature Verification**: Every transaction must verify `crypto.createHmac("sha256", RAZORPAY_KEY_SECRET)` before modifying database state.

### 6.2 Couple & Guest Data Privacy
- **Search Engine Blocking for Personal Invitations**:
  - All couple invitation URLs (`app/[slug]/layout.tsx`) are strictly set to:
    ```typescript
    robots: { index: false, follow: false }
    ```
  - This prevents private names, wedding dates, family phone numbers, and venue addresses from appearing in public Google search results.
- **1-Click Self-Serve Data Deletion**:
  - Couples have a permanent button in their dashboard to purge their invitation, media files, and guest RSVP records instantly.

### 6.3 Input Sanitization & XSS Defenses
- **Structured Data XSS Mitigation**: All JSON-LD output in [components/seo/json-ld.tsx](file:///Volumes/DATA/my-projects/business/wedding-saas/components/seo/json-ld.tsx) runs through `.replace(/</g, '\\u003c')` to prevent script tag injection attacks.
- **Zod Validation**: All API routes validate incoming JSON bodies against strict Zod schemas.
- **Prisma Parameterized Queries**: All database queries are executed via Prisma's parameterized engine, preventing SQL injection.

### 6.4 Role-Based Access Control (RBAC)
- **Super Admin Protection**:
  - The `/admin` routes and `/api/admin/*` endpoints invoke `verifyAdminSession()`.
  - Admin access is restricted to emails explicitly listed in `getAdminEmails()` (`lib/admin-client.ts`), rejecting unauthorized users with `403 Forbidden`.

---

## 7. Testing, QA & Validation Framework

### 7.1 Cross-Device & Browser Test Matrix

| Environment | Specific Devices / Browsers | Critical Validation Focus |
| :--- | :--- | :--- |
| **Mobile iOS** | iPhone 13, 14, 15, 16 (Safari & Chrome) | Safe area insets, WebKit audio unlock, 3D door frame rate (60fps) |
| **Mobile Android** | Samsung Galaxy S22/S24, Google Pixel 7/8/9 | Viewport height changes during keyboard popup, Chrome autoplay policy |
| **Small Mobile** | iPhone SE, Galaxy A-series (360px – 375px) | Zero text clipping, no horizontal overflow, button touch targets |
| **Desktop / Laptop**| Chrome, Safari, Firefox, Edge (1366px – 1920px) | Two-line hero headline alignment, vertical centering, cursor glow |

### 7.2 Core QA Checklist

#### A. Door Animation & Audio Score
- [ ] Tap-to-open gesture immediately triggers door animation and starts background music.
- [ ] Audio toggle button in header/floating bar allows 1-click mute and unmute.
- [ ] If user switches tabs or minimizes browser, audio pauses or respects OS policies.

#### B. Template Customizer & Live Preview
- [ ] Modifying bride/groom names instantly updates canvas without full page re-render.
- [ ] Date picker properly handles timezone offsets so wedding dates never shift by one day.
- [ ] Multi-event schedule additions (e.g. Sangeet + Haldi) appear with correct time and Google Maps URL.

#### C. Payment Flow
- [ ] Order creation generates valid Razorpay order ID.
- [ ] Modal displays exact formatted price (₹1,199).
- [ ] Successful payment triggers webhook and updates invitation to `isPublished: true`.
- [ ] Failed/cancelled payment does not lock user out from retrying.

#### D. RSVP & Guest Interaction
- [ ] Guests can submit name, attendance count, and celebratory message.
- [ ] Submissions immediately reflect in couple dashboard.
- [ ] CSV export from couple dashboard exports UTF-8 encoded text with correct columns.

### 7.3 Automated Smoke Test Commands

```bash
# 1. Type-check entire codebase (zero errors permitted)
npx tsc --noEmit

# 2. Run Next.js linter
npm run lint

# 3. Test SEO endpoints
curl -s http://localhost:3000/robots.txt | grep "Sitemap"
curl -s http://localhost:3000/sitemap.xml | grep "urlset"
curl -s http://localhost:3000/manifest.webmanifest | grep "WedInvites"
curl -s http://localhost:3000/llms.txt | grep "WedInvites"

# 4. Verify template preview HTTP response
curl -I -s http://localhost:3000/preview/celestial-rose | grep "HTTP/1.1 200"

# 5. Verify redirection of legacy routes
curl -I -s http://localhost:3000/templates/celestial-rose | grep "307 Temporary Redirect"
```

---

## 8. SEO & AI Search (GEO/AEO) Strategy

### 8.1 Technical Architecture
- **Dedicated Viewport Export**: Next.js App Router requirement implemented in `app/layout.tsx`.
- **Global `metadataBase`**: Configured to `siteConfig.url` for reliable relative URL resolution.
- **Dynamic Open Graph Images**: Built via Next.js `ImageResponse` (`app/opengraph-image.tsx`) generating 1200×630 luxury preview cards.
- **Canonical URLs**: Set across all indexable routes to prevent duplicate content penalties.

### 8.2 JSON-LD Schema Portfolio

| Schema Type | Location | Purpose & Consumer |
| :--- | :--- | :--- |
| **WebSite** | `app/layout.tsx` | Search box & site entity mapping for Google |
| **Organization** | `app/layout.tsx` | Brand authority, logos, social profiles, customer service contacts |
| **Product** | `app/page.tsx` & `/preview/[id]` | ₹1,199 pricing, INR currency, stock status, 4.9/5 star ratings |
| **ItemList** | `app/templates/layout.tsx` | Enumeration of all 16 template masterworks |
| **FAQPage** | `app/page.tsx` & `/faq` | Direct answer card extraction for Google & AI search engines |
| **AboutPage** | `app/(public)/about/layout.tsx` | E-E-A-T trust signals |
| **ContactPage**| `app/(public)/contact/layout.tsx`| Support hours, contact email, and concierge access |

### 8.3 AI Search Engine Optimization (GEO)
- **Standardized `llms.txt`**: Located at `/llms.txt` and formatted with extractable 40–60 word answer blocks.
- **Allowed AI Crawlers**: `robots.ts` explicitly grants crawling permissions to:
  - `GPTBot` (OpenAI ChatGPT)
  - `OAI-SearchBot` (SearchGPT)
  - `PerplexityBot` (Perplexity AI)
  - `ClaudeBot` (Anthropic Claude)
  - `Google-Extended` (Google Gemini)
  - `Applebot` (Apple Intelligence)

---

## 9. DevOps, Deployment & Operations Runbook

### 9.1 Environment Variables Reference (`.env`)

```bash
# ==============================================================================
# APP CORE CONFIGURATION
# ==============================================================================
NEXT_PUBLIC_APP_URL="https://wedinvites.in"
NEXT_PUBLIC_APP_NAME="WedInvites"

# ==============================================================================
# DATABASE (PostgreSQL / Supabase / Neon)
# ==============================================================================
DATABASE_URL="postgresql://postgres:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@host:5432/postgres"

# ==============================================================================
# AUTHENTICATION (NextAuth.js)
# ==============================================================================
# Generate via: openssl rand -base64 32
NEXTAUTH_SECRET="your-32-character-secret-key"
NEXTAUTH_URL="https://wedinvites.in/api/auth"

# Google OAuth (Optional in development, required in production)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# ==============================================================================
# TRANSACTIONAL EMAIL (Nodemailer / SMTP)
# ==============================================================================
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=587
SMTP_USER="smtp-username"
SMTP_PASSWORD="smtp-password"
EMAIL_FROM="support@wedinvites.in"

# ==============================================================================
# PAYMENT GATEWAY (Razorpay)
# ==============================================================================
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxxxxxx"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
RAZORPAY_WEBHOOK_SECRET="your-razorpay-webhook-secret"

# ==============================================================================
# MEDIA STORAGE (Cloudinary)
# ==============================================================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 9.2 Database Setup & Migration Workflow

```bash
# 1. Install all dependencies
npm install

# 2. Push schema changes directly to staging / dev database
npx prisma db push

# 3. Generate fresh Prisma Client types
npx prisma generate

# 4. For production environments, run formal migrations
npx prisma migrate deploy

# 5. Open Prisma Studio to inspect records locally
npx prisma studio
```

### 9.3 Production Deployment on Vercel
1. Link GitHub repository to Vercel.
2. In **Project Settings → Environment Variables**, populate all variables listed in Section 9.1.
3. Configure Build Command: `npx prisma generate && next build`.
4. Output Directory: `.next`.
5. Attach production domain: `wedinvites.in` and `www.wedinvites.in`.

---

## 10. Troubleshooting & Emergency Procedures

### 10.1 Webhook Signature Mismatch
- **Symptoms**: Customer completes payment on Razorpay, but invitation status remains `"pending"`.
- **Diagnosis**: The webhook payload signature did not match `RAZORPAY_WEBHOOK_SECRET`.
- **Resolution**:
  1. Check Razorpay Dashboard → Settings → Webhooks.
  2. Verify that the Secret in Razorpay matches `RAZORPAY_WEBHOOK_SECRET` in Vercel.
  3. Ensure the API handler receives the **raw body string** (not pre-parsed JSON) when calculating the HMAC digest.

### 10.2 Audio Failing to Play on Mobile
- **Symptoms**: Invitation opens, but music does not start.
- **Diagnosis**: iOS Low Power Mode, silent hardware switch enabled, or user did not tap the initial curtain.
- **Resolution**:
  1. Verify `AudioPlayer` is mounted inside the component tree.
  2. Ensure the first tap event fires `audio.play()` synchronously inside the native click event handler.
  3. Provide an intuitive floating sound toggle button with visual animated soundwave bars so guests can manually toggle sound anytime.

### 10.3 Database Connection Pool Exhaustion
- **Symptoms**: API endpoints return `504 Gateway Timeout` or `Can't reach database server`.
- **Diagnosis**: Direct connection exhausted by serverless function scaling.
- **Resolution**:
  1. Ensure `DATABASE_URL` uses the **PgBouncer pooled connection string** (port `6543`).
  2. Use `DIRECT_URL` (port `5432`) only for migrations.
  3. Verify `lib/prisma.ts` uses the global singleton pattern to prevent multiple Prisma instances in development.

---

> **Document Maintained By:** WedInvites Core Engineering Team  
> **Last Updated:** October 2026 · **Status:** Active Production Specification
