# WedInvites — Testing, QA & Quality Verification Framework

> **Test Procedures, QA Checklists, Cross-Device Matrix & Automated Verification**  
> *Platform:* WedInvites (`wedinvites.in`) · *Classification:* Quality Assurance Standard

---

## 1. Testing Philosophy & Strategy

Our testing strategy encompasses four pillars:
1. **Type Safety & Static Analysis**: Zero-error TypeScript compilation (`tsc --noEmit`) and ESLint checks.
2. **Cross-Device Mobile QA**: Visual and touch ergonomics verification on physical iOS and Android devices.
3. **Interactive Gesture & Audio Validation**: Verifying browser autoplay policies across WebKit and Blink engines.
4. **Automated Smoke Testing**: CLI verification of HTTP status codes, redirects, sitemaps, and JSON-LD schemas.

---

## 2. Cross-Device & Browser Test Matrix

| Environment | Device / Browser | Target Resolution | Critical Validation Focus |
| :--- | :--- | :--- | :--- |
| **Mobile iOS (Primary)** | iPhone 14/15/16 (Safari) | 390px – 430px | WebKit audio gesture unlock, 60fps door animation, safe-area-inset-bottom |
| **Mobile Android** | Samsung Galaxy S22/S24, Pixel 8 (Chrome) | 384px – 412px | Background audio toggle, keyboard viewport resize, touch targets |
| **Compact Mobile** | iPhone SE, Galaxy A-series | 320px – 375px | Fluid clamp typography, zero horizontal scroll, facial clearance |
| **Tablet** | iPad Air / iPad Mini (Safari) | 768px – 820px | Responsive scaling from mobile layout to two-column desktop |
| **Desktop / Laptop** | macOS / Windows (Chrome, Safari, Firefox) | 1366px – 1920px | Two-line hero headline layout, custom cursor glow, mega menu navigation |

---

## 3. Manual QA Checklists

### 3.1 Door Animation & Ambient Soundscape
- [ ] Initial invitation load displays closed door/curtain with *"Tap to Open"* prompt.
- [ ] Tapping the screen synchronously begins the 3D unfolding animation and starts audio playback.
- [ ] Audio toggle button in header/floating bar allows 1-click mute and unmute.
- [ ] Switching browser tabs or receiving an incoming phone call pauses audio as expected.
- [ ] Custom uploaded audio files play without decoding errors.

### 3.2 Template Customizer & Live Preview
- [ ] Typing in Bride & Groom names updates live canvas without page flickering.
- [ ] Changing wedding date updates the countdown timer accurately with correct timezone handling.
- [ ] Adding multiple wedding ceremonies (e.g., Sangeet, Mehendi, Reception) displays cards with individual Google Maps venue links.
- [ ] Live preview drawer collapses smoothly on mobile viewports.

### 3.3 Payment Gateway & Checkout Flow (Razorpay Test Mode)
- [ ] Clicking checkout opens Razorpay Checkout modal with order total formatted as ₹1,199.
- [ ] **Successful Payment Test**: Using Razorpay test credentials completes order, marks status as `"paid"`, and provisions invitation.
- [ ] **Cancelled Payment Test**: Closing the modal without paying retains user in the customizer without state loss.
- [ ] **Failed Payment Test**: Simulating an OTP failure displays an inline error message and allows 1-click retry.

### 3.4 Guest RSVP & Wishes Wall
- [ ] Guest submits name, attendance status, guest count, and celebratory message.
- [ ] Form displays instant success confirmation modal with celebratory confetti animation.
- [ ] Couple dashboard reflects new RSVP entry in real-time.
- [ ] Export button downloads a valid UTF-8 CSV file containing all guest responses.

---

## 4. Performance & Core Web Vitals Targets

| Metric | Target | Rationale |
| :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | `< 2.5s` | Critical for guest first impressions on mobile networks |
| **INP (Interaction to Next Paint)** | `< 200ms` | Ensures smooth responsiveness during door taps and audio toggles |
| **CLS (Cumulative Layout Shift)** | `< 0.1` | Prevents layout jumping while web fonts and media load |

---

## 5. Automated Smoke Test Suite

Run these automated commands before any deployment or pull request:

```bash
# 1. Verify TypeScript type integrity across the entire project
npx tsc --noEmit

# 2. Run Next.js linter
npm run lint

# 3. Test SEO and Machine-Readable Endpoints
curl -s http://localhost:3000/robots.txt | grep "Sitemap:"
curl -s http://localhost:3000/sitemap.xml | grep "<loc>"
curl -s http://localhost:3000/manifest.webmanifest | grep "WedInvites"
curl -s http://localhost:3000/llms.txt | grep "WedInvites"

# 4. Verify Template Preview HTTP Response
curl -I -s http://localhost:3000/preview/celestial-rose | grep "HTTP/1.1 200"

# 5. Verify Legacy URL 307 Redirect (Prevents 404s)
curl -I -s http://localhost:3000/templates/celestial-rose | grep "307 Temporary Redirect"
```
