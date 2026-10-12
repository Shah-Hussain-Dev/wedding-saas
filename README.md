# WedInvites — Premium Interactive Digital Wedding Invitations

> **The premier interactive digital wedding invitation platform.**  
> Replacing static paper cards with living 3D experiences, orchestral soundscapes, and real-time WhatsApp RSVP portals.  
> **Official Website:** [wedinvites.in](https://wedinvites.in)

---

## ✨ Features at a Glance

* **🏛️ 16 Masterwork 3D Templates**: Living double carved palace doors, golden wax seals, floral envelopes, and celestial starlight terraces.
* **🎵 Ambient Soundscapes**: Royal sitar, shehnai, violin, and orchestral scores with custom audio upload capabilities.
* **💌 Real-Time WhatsApp RSVP**: Instant mobile distribution, multi-event attendance tracking (Haldi, Mehendi, Sangeet, Nikah, Pheras), and 1-click CSV guest exports.
* **✨ High-Interaction Reveals**: Auspicious Muhurat gold foil scratch cards, countdown timers, photo galleries, and interactive Google Maps venue navigation.
* **💎 Transparent Luxury**: Flat **₹1,199** all-inclusive lifetime pass with unlimited edits until wedding day and zero per-guest fees.
* **🛡️ Couple & Guest Privacy**: Bank-grade data protection, 1-click self-serve data purging, and `noindex` protections on private celebration links.
* **🤖 AI Search Optimized**: Structured schemas (`Product`, `WebSite`, `Organization`, `ItemList`, `FAQPage`) and standardized `llms.txt` for AI assistant citations.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core Framework** | [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS Tokens |
| **Animations & Motion** | [Motion (Framer Motion v12)](https://motion.dev/), [GSAP](https://gsap.com/), and [Lenis](https://lenis.darkroom.engineering/) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) & [Prisma ORM 7](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) (Credentials + Google OAuth) |
| **Payments** | [Razorpay SDK](https://razorpay.com/) (UPI, Cards, Netbanking with HMAC-SHA256 validation) |
| **Media Pipeline** | [Cloudinary](https://cloudinary.com/) (WebP/AVIF auto-optimization) |
| **Transactional Email** | [Nodemailer](https://nodemailer.com/) (SMTP with HTML receipts) |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: `v20.x` or higher recommended
- **npm**: `v10.x` or higher
- **PostgreSQL Database**: Local instance or hosted (Supabase, Neon)

### 2. Installation
```bash
# Clone and install dependencies
git clone <repo-url>
cd wedding-saas
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root:
```bash
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="WedInvites"

DATABASE_URL="postgresql://postgres:password@localhost:5432/wedding_saas"
NEXTAUTH_SECRET="your-32-byte-secret"
NEXTAUTH_URL="http://localhost:3000/api/auth"

RAZORPAY_KEY_ID="rzp_test_xxxxxx"
RAZORPAY_KEY_SECRET="your-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxx"

CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud"
```

### 4. Database Setup
```bash
# Push Prisma schema to your database
npx prisma db push

# Generate fresh Prisma Client
npx prisma generate
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📐 Mandatory Design Rules

1. **Mobile-First Foundation (360px – 430px)**: All template views, interactive components, and pages must be styled and tested for mobile portrait viewports before scaling up to desktop.
2. **Facial Clearance Guarantee**: In hero sections and portrait cards, bride, groom, character faces, crowns, and sacred calligraphy must **never** be occluded by floating text boxes or badges.
3. **Touch Targets (44×44px)**: All buttons, seals, and audio toggles must maintain minimum 44×44px touch targets.
4. **Audio Playback Protocol**: Background audio must be tied to the initial user tap (`Tap to Open` curtain gesture) to comply with iOS Safari and Android Chrome autoplay restrictions.

---

## 📚 Complete Project Documentation

For exhaustive architecture specifications, security guidelines, testing checklists, and operational runbooks, see:

* 📖 **[Master Project Documentation](docs/MASTER_PROJECT_DOCUMENTATION.md)** — The complete architectural blueprint, database ERD, security models, testing matrix, and deployment runbook.
* 📐 **[Mandatory Rules & UX Standards (docs/RULES.md)](docs/RULES.md)** — Mobile-first approach, facial clearance guarantee, 44×44px touch targets, audio autoplay protocol.
* 🛡️ **[Security Architecture & Privacy (docs/SECURITY.md)](docs/SECURITY.md)** — Razorpay HMAC-SHA256 verification, couple privacy shielding (`noindex`), 1-click data purging, XSS & RBAC.
* 🧪 **[Testing & QA Framework (docs/TESTING.md)](docs/TESTING.md)** — Cross-device mobile matrix, manual QA checklists, automated smoke tests.
* 🔍 **[SEO & AI Search Optimization (docs/SEO_OPTIMIZATION.md)](docs/SEO_OPTIMIZATION.md)** — Structured JSON-LD schemas, dynamic Open Graph cards, sitemaps, robots rules, and `llms.txt`.
* 🏛️ **[System Architecture & Data Models (docs/ARCHITECTURE.md)](docs/ARCHITECTURE.md)** — Next.js 16 App Router topology, Prisma ERD, and template engine contracts.
* 🎨 **[Master Brand Guide (BRAND.md)](BRAND.md)** — Visual identity, color palette tokens, typography scales, and generative asset prompting.
* 🤖 **[AI Search Knowledge (public/llms.txt)](public/llms.txt)** — Machine-readable summary for ChatGPT, Perplexity, and Claude citations.
* ⚙️ **[Backend Integration Guide (docs/BACKEND_INTEGRATION_GUIDE.md)](docs/BACKEND_INTEGRATION_GUIDE.md)** — Setup instructions for Supabase, Razorpay, Cloudinary, and Google OAuth.

---

## 🛡️ Security & Quality Verification

```bash
# Verify TypeScript types
npx tsc --noEmit

# Run Next.js linter
npm run lint

# Test SEO endpoints
curl -I http://localhost:3000/sitemap.xml
curl -I http://localhost:3000/robots.txt
curl -I http://localhost:3000/manifest.webmanifest
curl -I http://localhost:3000/llms.txt
```

---

© 2026 WedInvites Technologies. All rights reserved.
