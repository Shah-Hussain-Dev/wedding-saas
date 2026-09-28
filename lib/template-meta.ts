export type TemplateId =
  | "noor-e-nikah"
  | "crimson-royale"
  | "royal-lotus"
  | "emerald-noir"
  | "royal-elegance"
  | "modern-minimal"
  | "emerald-qasr"
  | "gul-e-noor"
  | "azure-nikah"
  | "kitab-e-nikah"
  | "rose-gold-blush"
  | "royal-grace"
  | "royal-heritage"
  | "royal-majesty";

export type ReligionKey = "all" | "hindu" | "muslim";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  style: string;
  description: string;
  tag?: string;
  gradient: string;
  religion: ("hindu" | "muslim" | "universal")[];
  religionLabel: string;
}

export const TEMPLATE_META: Record<TemplateId, TemplateMeta> = {
  "noor-e-nikah": {
    id: "noor-e-nikah",
    name: "Noor-e-Nikah",
    style: "Sacred Elegance",
    tag: "Featured",
    religion: ["muslim"],
    religionLabel: "Muslim",
    description:
      "A sacred Islamic wedding experience with a 3D embossed ivory floral envelope, slow-lighting gold wax seal, grand mosque archway portal, Bismillah blessing, and Nikah timeline.",
    gradient: "from-[#FAF8F5] via-[#F3EDE2] to-[#E5DAC6]",
  },
  "emerald-qasr": {
    id: "emerald-qasr",
    name: "Emerald Qasr",
    style: "Ottoman Royale",
    tag: "Cinematic Video",
    religion: ["muslim"],
    religionLabel: "Muslim",
    description:
      "An opulent Ottoman palace experience with a live animated cinematic envelope opening video, 24K gold filigree, Ayat Ar-Rum blessings, interactive scratch reveal, and multi-event Nikah itinerary.",
    gradient: "from-[#081F1A] via-[#0F382E] to-[#04120F]",
  },
  "gul-e-noor": {
    id: "gul-e-noor",
    name: "Gul-e-Noor",
    style: "Blush Velvet & Rose",
    tag: "Romantic Video",
    religion: ["muslim"],
    religionLabel: "Muslim",
    description:
      "A dreamy blush pink & rose velvet celebration with a floating floral envelope animation video, glowing pearl accents, Quranic blessings, live countdown, and interactive RSVP.",
    gradient: "from-[#FFF5F7] via-[#FCE8ED] to-[#F5D0DB]",
  },
  "azure-nikah": {
    id: "azure-nikah",
    name: "Azure Nikah",
    style: "Royal Sapphire & Celestial Gold",
    tag: "Royal Video",
    religion: ["muslim"],
    religionLabel: "Muslim",
    description:
      "A majestic midnight sapphire and 24K celestial gold invitation featuring a high-definition envelope opening video, crescent star motifs, dual photo slider, and wedding timeline.",
    gradient: "from-[#0A1628] via-[#0F2342] to-[#060D18]",
  },
  "kitab-e-nikah": {
    id: "kitab-e-nikah",
    name: "Kitab-e-Nikah",
    style: "Sacred Velvet & Arabesque Gold",
    tag: "Luxury Video",
    religion: ["muslim"],
    religionLabel: "Muslim",
    description:
      "A sacred velvet tome unfolding invitation featuring a cinematic opening book video, ivory parchment texture, gold arabesque motifs, and an interactive Nikah ceremony guide.",
    gradient: "from-[#1F080F] via-[#2F0D17] to-[#120409]",
  },
  "crimson-royale": {
    id: "crimson-royale",
    name: "Crimson Royale",
    style: "Royal Court",
    tag: "Trending",
    religion: ["hindu"],
    religionLabel: "Hindu",
    description:
      "Regal crimson velvet and 24K gold foil aesthetic. Features an interactive royal gate opening, gold foil scratch reveal date card, 4 switchable royal background presets, and shehnai background symphony.",
    gradient: "from-[#420f18] via-[#7c2c3b] to-[#20050a]",
  },
  "royal-lotus": {
    id: "royal-lotus",
    name: "Royal Lotus",
    style: "Royal Heritage",
    tag: "Auspicious",
    religion: ["hindu"],
    religionLabel: "Hindu",
    description:
      "A grand Rajasthani palace experience with ivory canvas, 24K antique gold filigree, deep crimson accents, floating lotus petals, and a 3D royal palace gate reveal.",
    gradient: "from-[#FCF9F2] via-[#F5EFE0] to-[#EBDDC3]",
  },
  "emerald-noir": {
    id: "emerald-noir",
    name: "Emerald Noir",
    style: "Luxury Dark & Gold",
    tag: "Best Seller",
    religion: ["hindu", "universal"],
    religionLabel: "Hindu",
    description:
      "Ornate 24K gold details on rich emerald canvas. Features a 3D Royal Haveli Gate reveal with glowing Ganesha seal, multi-layer parallax, Vedic rituals, interactive scratch reveal card, and photo gallery.",
    gradient: "from-[#081F1A] via-[#0F382E] to-[#04120F]",
  },
  "royal-elegance": {
    id: "royal-elegance",
    name: "Royal Elegance",
    style: "Classic South Asian",
    tag: "Best Seller",
    religion: ["hindu", "universal"],
    religionLabel: "Hindu",
    description:
      "Traditional South Asian grandeur featuring 3D Maharani Crimson Silk Curtains with Royal Kundan Wax Seal, Gauri Ganesh blessings, multi-layer parallax, interactive scratch card, and gallery lightbox.",
    gradient: "from-[#faf7f0] to-[#f0e8d8]",
  },
  "modern-minimal": {
    id: "modern-minimal",
    name: "Modern Minimal",
    style: "Contemporary Chic",
    tag: "New",
    religion: ["hindu", "universal"],
    religionLabel: "Hindu",
    description:
      "Contemporary Vedic luxury with a 3D architectural origami envelope & pure gold monogram seal, multi-layer parallax, interactive Muhurat scratch card, and photo lightbox gallery.",
    gradient: "from-stone-50 to-stone-200",
  },
  "rose-gold-blush": {
    id: "rose-gold-blush",
    name: "Rose Gold Blush Royal",
    style: "Rose Gold & Blush Parchment",
    tag: "Cinematic Video",
    religion: ["hindu", "muslim", "universal"],
    religionLabel: "Hindu & Muslim",
    description:
      "A timeless dual-faith royal wedding celebration featuring Ishaan & Anaya with an ultra-smooth cinematic local video opening, switchable Vedic & Islamic blessings, rose-gold shaped scratch card, and modern luxury aesthetics.",
    gradient: "from-[#F7EEE9] via-[#F3E9E2] to-[#E2DACF]",
  },
  "royal-grace": {
    id: "royal-grace",
    name: "Royal Grace",
    style: "Botanical Velvet & Antique Gold",
    tag: "Cinematic Gate",
    religion: ["hindu", "muslim", "universal"],
    religionLabel: "Universal Royale",
    description:
      "An enchanted botanical velvet gate & golden curtain reveal video synchronized at 6s, featuring deep sage & olive tones, antique gold filigree, multi-axis parallax botanical glasshouse palace, scratch date reveal, and a 3D scattered card memory reel.",
    gradient: "from-[#0e1713] via-[#1b2d24] to-[#121c17]",
  },
  "royal-heritage": {
    id: "royal-heritage",
    name: "Royal Heritage",
    style: "Powder Blue & Coral Floral Arch",
    tag: "Universal Royale",
    religion: ["hindu", "muslim", "universal"],
    religionLabel: "Universal Heritage",
    description:
      "A sun-kissed Mediterranean arched portal & blooming coral bougainvillea cinematic video reveal. Featuring powder-blue architectural doorways, warm ivory terraces, 3D panoramic arch photo horizon, and floating ceremony portals.",
    gradient: "from-[#77A3AE] via-[#E8E3D9] to-[#D95147]",
  },
  "royal-majesty": {
    id: "royal-majesty",
    name: "Royal Majesty",
    style: "French Château & Regency Ballroom",
    tag: "Imperial Royale",
    religion: ["hindu", "muslim", "universal"],
    religionLabel: "Universal Regency",
    description:
      "An enchanted French Château ballroom & starlit lakeside video reveal with shimmering crystal chandeliers, powder-blue hydrangea garlands, muted champagne gold accents, and 3D Rococo horizon gallery.",
    gradient: "from-[#A9C1D0] via-[#EBECE8] to-[#B7A16E]",
  },
};

export const INCLUDED_FEATURES = [
  "Animated envelope or door reveal",
  "Custom names, dates & venues",
  "Background music with mute control",
  "Live countdown timer",
  "Scratch-to-reveal wedding date",
  "Photo slideshow gallery",
  "Google Maps navigation",
  "Multi-event RSVP (Sangeet, Wedding, Reception)",
  "Guest message inbox",
  "Multi-language support (Hindi, English & more)",
  "Unlimited edits until wedding day",
  "WhatsApp one-tap sharing",
];

export const DEMO_STEPS = [
  { num: "1", title: "Choose your plan", desc: "Pick Classic or Royal based on the motion experience you want." },
  { num: "2", title: "Personalize details", desc: "Add names, dates, venues, music, photos, and event schedule." },
  { num: "3", title: "Share instantly", desc: "Send your live link via WhatsApp. Track RSVPs in your dashboard." },
];

export function getTemplateMeta(templateId: string): TemplateMeta {
  return TEMPLATE_META[templateId as TemplateId] ?? TEMPLATE_META["noor-e-nikah"];
}

export function getMockInvitationData(brideName = "Diya", groomName = "Shaan") {
  return {
    id: "preview-id",
    brideName,
    groomName,
    weddingDate: "2027-01-24",
    weddingTime: "4:30 PM onwards",
    venueName: "The Grand Qasr Al-Noor",
    venueAddress: "Al-Noor Palace Estate, Emirates Palace Road, Abu Dhabi, UAE",
    venueLat: 24.4617,
    venueLng: 54.3173,
    heroImageUrl:
      "/templates/noor-e-nikah/hero-palace-mobile.jpg",
    slideshowImages: [
      "/templates/noor-e-nikah/hero-palace-mobile.jpg",
      "/templates/noor-e-nikah/hero-palace-desktop.jpg",
      "/templates/noor-e-nikah/welcome-parchment.jpg",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=500&auto=format&fit=crop",
    ],
    showDressCode: true,
    dressCodeText:
      "Royal Traditional & Modest \nWomen: Pastel Gold Lehengas / Abayas with embroidery \nMen: Sherwanis / Traditional Suits",
    showTransport: true,
    transportText:
      "Shuttle services will be available from Abu Dhabi International Airport. Valet parking is fully operational at the grand entrance.",
    eventsJson: [
      { name: "Manjha (Haldi)", enabled: true, venue: "Courtyard Garden, Al-Noor", date: "Saturday, 23 January", time: "11:00 AM" },
      { name: "Mehendi Night", enabled: true, venue: "The Jasmine Terrace", date: "Saturday, 23 January", time: "6:30 PM" },
      { name: "Nikah Ceremony", enabled: true, venue: "Grand Mosque Courtyard", date: "Sunday, 24 January", time: "4:30 PM" },
      { name: "Walima Reception", enabled: true, venue: "Royal Crystal Ballroom", date: "Sunday, 24 January", time: "8:00 PM" },
    ],
  };
}

export const TEMPLATE_COMPONENTS = {
  "noor-e-nikah": () => import("@/templates/noor-e-nikah"),
  "crimson-royale": () => import("@/templates/crimson-royale"),
  "royal-lotus": () => import("@/templates/royal-lotus"),
  "emerald-noir": () => import("@/templates/emerald-noir"),
  "royal-elegance": () => import("@/templates/royal-elegance"),
  "modern-minimal": () => import("@/templates/modern-minimal"),
  "emerald-qasr": () => import("@/templates/emerald-qasr"),
  "gul-e-noor": () => import("@/templates/gul-e-noor"),
  "azure-nikah": () => import("@/templates/azure-nikah"),
  "kitab-e-nikah": () => import("@/templates/kitab-e-nikah"),
  "rose-gold-blush": () => import("@/templates/rose-gold-blush"),
  "royal-grace": () => import("@/templates/royal-grace"),
  "royal-heritage": () => import("@/templates/royal-heritage"),
  "royal-majesty": () => import("@/templates/royal-majesty"),
} as const;
