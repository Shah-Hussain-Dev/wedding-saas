# WedInvites — Security Architecture & Data Protection Guide

> **Security Protocols, Payment Hardening, Privacy Controls & Defenses**  
> *Platform:* WedInvites (`wedinvites.in`) · *Classification:* Security & Compliance Standard

---

## 1. Threat Model & Overview

WedInvites handles couple personal data (names, wedding dates, family phone numbers, venue locations), guest RSVPs, and financial transactions. Our security posture addresses four primary vectors:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            THREAT LANDSCAPE                                 │
├──────────────────────────┬──────────────────────────┬───────────────────────┤
│ 1. Payment Tampering     │ 2. Couple Data Scraping  │ 3. Injection & XSS    │
│    Client modifying price│    Search engines        │    Malicious RSVP or  │
│    or forged callbacks   │    indexing invites      │    JSON-LD injection  │
├──────────────────────────┴──────────────────────────┴───────────────────────┤
│ 4. Unauthorized Administrative Access                                       │
│    Unauthenticated access to couple dashboards, metrics, or revenue data    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Payment Security & Razorpay Hardening

### 2.1 Server-Side Pricing Authority
- The client application **never** submits the transaction amount to the payment gateway.
- When checkout begins (`/api/payments/create-order`), the server fetches the verified template price from `lib/template-pricing.ts` (default: **₹1,199 = 119900 paise**) and communicates directly with Razorpay API using `RAZORPAY_KEY_SECRET`.

### 2.2 HMAC-SHA256 Cryptographic Verification
When Razorpay returns the payment response (`razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`), the backend must verify the signature before changing any order status:

```typescript
// lib/razorpay.ts
export function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: VerifyPaymentParams): boolean {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return generatedSignature === razorpaySignature;
}
```

If the signature does not match bit-for-bit, the request is immediately rejected with HTTP `400 Bad Request` and flagged as potential tampering.

### 2.3 Webhook Idempotency & State Machine
- Webhook payloads are verified against `RAZORPAY_WEBHOOK_SECRET`.
- Order transitions follow a strict one-way state machine: `pending` → `paid`. Repeated webhook deliveries for already-paid orders are acknowledged idempotently without duplicate record creation.

---

## 3. Couple & Guest Data Privacy

### 3.1 Search Engine Shielding (`noindex, nofollow`)
- Personal wedding invitations (`app/[slug]/layout.tsx`) contain private details (bride & groom contact numbers, family addresses, itinerary timings).
- **Mandatory Policy**: All dynamic `/[slug]` routes must output:
  ```typescript
  robots: {
    index: false,
    follow: false,
  }
  ```
- This ensures personal family celebrations never appear in public Google search results or web scrapers.

### 3.2 1-Click Self-Serve Data Deletion
- In accordance with global data protection laws (GDPR, India DPDP Act), couples can purge their invitation, all uploaded photo galleries, and guest RSVP entries directly from their dashboard.
- Database cascade rules (`onDelete: Cascade` in Prisma) ensure that when an invitation is deleted, all corresponding `GuestMessage` records are permanently expunged.

---

## 4. Input Validation & XSS Defenses

### 4.1 JSON-LD XSS Mitigation
Next.js server-rendered JSON-LD scripts can be vulnerable to XSS if user inputs contain unescaped `<` characters (e.g. `</script><script>alert(1)</script>`).
All structured data in WedInvites passes through:

```typescript
// components/seo/json-ld.tsx
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
```

### 4.2 Zod API Schema Validation
All POST/PUT API route handlers parse incoming JSON bodies with Zod schemas to reject unexpected fields, oversized payloads, or invalid data types before reaching application logic.

### 4.3 Parameterized Database Queries
Prisma automatically parameterizes all queries under the hood, completely mitigating SQL injection vulnerabilities.

---

## 5. Authentication & Access Control (RBAC)

### 5.1 NextAuth.js JWT Sessions
- Sessions use JSON Web Tokens (`strategy: "jwt"`) with SHA-256 signing and a 30-day rolling expiration window.
- Passwords are encrypted using `bcryptjs` with salt rounds = 10. Raw passwords are never logged or stored.

### 5.2 Super Admin Authorization
- Access to the `/admin` dashboard and `/api/admin/*` endpoints invokes `verifyAdminSession()`.
- Only email addresses verified against `getAdminEmails()` in `lib/admin-client.ts` are granted access. All other authenticated users receive `403 Forbidden`.

---

## 6. Media Storage Security (Cloudinary)

- File uploads are validated for valid image MIME types (`image/jpeg`, `image/png`, `image/webp`).
- Maximum upload size is capped at 10MB per image.
- Images are processed through Cloudinary transformations to strip EXIF location metadata before public CDN serving.
