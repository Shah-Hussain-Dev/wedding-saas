/**
 * Homepage message hierarchy — single source for hero, CTAs, and trust lines.
 * Aligns with BRAND.md: promise → mechanism → proof → action.
 */

export const landingCopy = {
  metadata: {
    title: "Not a Card. An Interactive Wedding Invitation",
    description:
      "Send a living digital wedding invitation on WhatsApp—3D reveals, music, maps, and live RSVPs. One flat price from ₹1,199. No printing, no courier, no app install.",
    ogDescription:
      "Replace paper cards with interactive 3D invitations your guests open on WhatsApp. Customize, share, and track RSVPs from one dashboard.",
  },

  hero: {
    eyebrow: "Indian & NRI weddings · Share on WhatsApp",
    headlineLine1: "Not a card.",
    headlineLine2: "An experience.",
    headlineAccent: "experience.",
    subhead:
      "Skip courier runs and ₹25,000+ printing bills. Send a living invitation with 3D palace doors, your music, Google Maps, and live RSVPs—for one flat ₹1,199.",
    pdfBonus: "Free bonus: 2 print-ready PDFs (Barat & Reception)",
    primaryCta: "Choose my template",
    secondaryCta: "Watch a live preview",
    ctaMicrocopy: "Pay once · Edit anytime · No subscription",
    trustStrip: {
      templates: "16+ luxury templates",
      delivery: "Live in minutes",
      proof: "Loved by couples across India",
    },
    quote: {
      text: "Made our wedding announcement feel so special and personal!",
      attribution: "Ananya & Kabir, Mumbai",
    },
  },

  footerCta: {
    eyebrow: "Your celebration begins now",
    headline: "Make the invitation as unforgettable as the day.",
    subhead:
      "Pick a template, personalize every detail, and share one beautiful link with family on WhatsApp.",
    primaryCta: "Choose my template",
  },

  primaryCtaHref: "/templates" as const,
  stickyCtaLabel: "Choose my template",
} as const;

export const landingFaqs = [
  {
    q: "How do our guests open and experience the wedding invitation?",
    a: "You receive a personalized, private luxury webpage link. Simply share it via WhatsApp, SMS, or Instagram. When guests tap the link, the invitation immediately loads in their mobile browser with 3D door openings, soundtracks, and interactive maps — zero apps or downloads needed.",
  },
  {
    q: "Can we customize our background music score?",
    a: "Yes. Every template includes curated instrumental and traditional soundtrack tracks (shehnai, royal orchestral strings, acoustic guitar, piano). You can also provide any custom audio file of your choice.",
  },
  {
    q: "Can we make changes after sharing the invitation?",
    a: "Absolutely. You can edit event timings, add photos, change addresses, and update ceremony details at any time from your dashboard. All updates reflect instantly for every guest without re-sharing.",
  },
  {
    q: "How does the RSVP tracking system work?",
    a: "Guests tap 'RSVP' directly inside your invitation, enter their names, guest count, and celebratory wishes. All responses sync to your couple dashboard where you can export guest lists with 1 click.",
  },
  {
    q: "Does this support multi-event Indian weddings (Haldi, Mehendi, Sangeet, Nikah, Pheras)?",
    a: "Yes! Every template supports multi-event schedules with separate dates, timings, venues, Google Maps links, and dress code color palettes for each function.",
  },
  {
    q: "How do we pay, and is checkout secure?",
    a: "Checkout runs through Razorpay with UPI, cards, and net banking. You pay once for your invitation suite—no recurring subscription. Your dashboard and live link activate right after successful payment.",
  },
  {
    q: "How fast can we go live after choosing a template?",
    a: "Most couples publish the same day: pick a template, add names, dates, and venues in the editor, preview on your phone, then share your link on WhatsApp. Complex multi-event schedules usually take under an hour.",
  },
] as const;
