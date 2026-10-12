# WedInvites — System Architecture & Data Engineering Blueprint

> **System Topology, Component Hierarchy, Database Models & Pipelines**  
> *Platform:* WedInvites (`wedinvites.in`) · *Stack:* Next.js 16 + React 19 + TypeScript + Prisma + PostgreSQL

---

## 1. System Topology Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYERS                                   │
│  Mobile Browsers (iOS Safari, Android Chrome) · Desktop Browsers            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / WSS
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    VERCEL EDGE & SERVERLESS RUNTIME                         │
│  Next.js 16 App Router · Server Components · Dynamic API Route Handlers     │
└──────────────┬───────────────────────┬───────────────────────┬──────────────┘
               │                       │                       │
      Prisma Connection       HMAC Signature Verify    Signed Media Upload
               │                       │                       │
┌──────────────▼────────┐   ┌──────────▼──────────┐ ┌──────────▼──────────┐
│   POSTGRESQL DATABASE │   │   RAZORPAY GATEWAY  │ │  CLOUDINARY STORAGE │
│  (Supabase / Neon)    │   │  UPI, Cards, Banks  │ │  Auto WebP / AVIF   │
│  Users, Orders, Invites│  │  Orders & Webhooks  │ │  CDN Delivery       │
└───────────────────────┘   └─────────────────────┘ └─────────────────────┘
```

---

## 2. Next.js App Router Architecture

### 2.1 Route Segments & Boundaries

- **`app/page.tsx`**: Static/Server-rendered homepage. Renders marketing scenes, JSON-LD schemas, and embeds client leaf components.
- **`app/(public)/*`**: Legal, informative, and support pages wrapped in a unified public navigation and footer shell.
- **`app/templates`**: Catalogue of 16 invitation designs with dynamic client filtering and `ItemList` schema.
- **`app/preview/[templateId]`**: Interactive responsive previewer wrapping the template in mobile viewport frames.
- **`app/[slug]`**: Couple's public invitation portal. Displays 3D door animation overlay and multi-event itinerary.
- **`app/customize/[templateId]`**: Real-time interactive sandbox where couples customize text, dates, venues, and colors.
- **`app/dashboard`**: Authenticated couple portal for real-time guestlist tracking, RSVP downloads, and ceremony edits.
- **`app/admin`**: Restricted dashboard for super admins to view revenue metrics and invitation statuses.

---

## 3. Database Schema & Data Models (Prisma)

### 3.1 Core Entity Definitions

```prisma
// Users
model User {
  id            String       @id @default(uuid()) @db.Uuid
  email         String       @unique
  passwordHash  String?      @map("password_hash")
  name          String?
  phone         String?
  createdAt     DateTime     @default(now()) @map("created_at") @db.Timestamptz
  orders        Order[]
  invitations   Invitation[]
}

// Orders & Payments
model Order {
  id                 String       @id @default(uuid()) @db.Uuid
  userId             String       @map("user_id") @db.Uuid
  templateId         String       @map("template_id")
  amountPaise        Int          @map("amount_paise") // 119900 paise = ₹1,199
  currency           String       @default("INR")
  razorpayOrderId    String?      @map("razorpay_order_id")
  razorpayPaymentId  String?      @map("razorpay_payment_id")
  status             String       @default("pending") // pending | paid | failed
  createdAt          DateTime     @default(now()) @map("created_at") @db.Timestamptz
  invitations        Invitation[]
}

// Digital Wedding Invitations
model Invitation {
  id                   String         @id @default(uuid()) @db.Uuid
  userId               String         @map("user_id") @db.Uuid
  orderId              String         @map("order_id") @db.Uuid
  templateId           String         @map("template_id")
  slug                 String         @unique
  brideName            String         @map("bride_name")
  groomName            String         @map("groom_name")
  weddingDate          DateTime       @map("wedding_date") @db.Date
  weddingTime          String         @map("wedding_time")
  venueName            String         @map("venue_name")
  venueAddress         String         @map("venue_address")
  heroImageUrl         String?        @map("hero_image_url")
  slideshowImages      Json           @default("[]") @map("slideshow_images")
  musicTrack           String         @default("track1") @map("music_track")
  eventsJson           Json           @default("[]") @map("events_json")
  isPublished          Boolean        @default(true) @map("is_published")
  guestMessages        GuestMessage[]
}

// Guest RSVPs & Messages
model GuestMessage {
  id           String     @id @default(uuid()) @db.Uuid
  invitationId String     @map("invitation_id") @db.Uuid
  guestName    String     @map("guest_name")
  message      String?
  rsvpJson     Json       @default("{}") @map("rsvp_json")
  createdAt    DateTime   @default(now()) @map("created_at") @db.Timestamptz
}
```

---

## 4. Template Engine Architecture

The platform houses **16 self-contained template engines** in `templates/`:

```
templates/
├── index.ts               # TEMPLATES_MAP registry & default fallback data
├── celestial-rose/        # 3D Zero Gravity & Starlight Terrace
├── imperial-palace/       # Monumental 3D Carved Double Doors
├── noor-e-nikah/          # Sacred Nikah with Gold Embossed Floral Envelope
├── royal-majesty/         # French Château Regency Ballroom Waltz
├── rose-gold-blush/       # Champagne Silk Drapes & Falling Petals
├── emerald-qasr/          # Mughal Jaali Lattice Arch & Shehnai
├── crimson-royale/        # Traditional Vedic Hindu Saat Phere Procession
└── ... (9 additional cultural & modern masterworks)
```

### 4.1 Interface Contract
Every template conforms to a unified component signature:
```typescript
interface TemplateProps {
  data: InvitationData;
}
```
If a couple has not yet customized specific fields, the template gracefully falls back to verified defaults provided by `getTemplateDefaultData(templateId)`.

---

## 5. Media & Audio Asset Pipeline

- **Images**: Uploaded via `/api/upload` to Cloudinary, which generates responsive WebP/AVIF images with automatic quality compression (`q_auto,f_auto`).
- **Soundtracks**: Pre-bundled high-bitrate MP3 instrumental tracks stored in `public/templates/[slug]/music.mp3` or streamed from Cloudinary CDN.
- **Audio Control**: Managed through a global audio store (`lib/audio-store.ts`) ensuring seamless play/pause state synchronization across the entire session.
