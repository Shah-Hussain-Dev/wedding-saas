import { TemplateId } from "./template-meta";

export type CulturalTradition = "muslim" | "hindu" | "universal";

export interface PdfCardStyleTokens {
  // Page 1: Barat / Procession Card (Rich Velvet or Deep Theme)
  coverBg: string;
  coverBorderColor: string;
  coverBorderInner: string;
  coverGoldAccent: string;
  coverTextColor: string;
  coverSubtextColor: string;
  coverHighlight: string;
  coverFiligreeStyle: "islamic-arabesque" | "royal-haveli" | "palace-rococo" | "botanical-gold" | "celestial-stars";

  // Page 2: Reception / Formal Banquet Card (Ivory Textured Parchment)
  receptionBg: string;
  receptionBorderColor: string;
  receptionBorderInner: string;
  receptionPrimaryText: string;
  receptionSecondaryText: string;
  receptionGoldAccent: string;
  receptionDividerStyle: "arabesque" | "lotus" | "flourish" | "celestial";

  // Typography tokens (matching fonts in /fonts/fonts.css)
  coupleFont: string; // e.g. "Alex Brush", "Allura", "Great Vibes"
  headingFont: string; // e.g. "Amiri", "Playfair Display", "Cinzel"
  bodyFont: string; // e.g. "Amiri", "Cinzel", "Cormorant Garamond"

  // Cultural content defaults
  tradition: CulturalTradition;
  sacredInvocation: string;
  sacredTranslation?: string;
  baratEventTitle: string;
  receptionEventTitle: string;
}

export const PDF_THEME_TOKENS: Record<string, PdfCardStyleTokens> = {
  // ── Muslim Sacred Templates ──
  "noor-e-nikah": {
    coverBg: "linear-gradient(135deg, #073D31 0%, #05261E 50%, #031813 100%)",
    coverBorderColor: "#C8A45E",
    coverBorderInner: "rgba(200, 164, 94, 0.4)",
    coverGoldAccent: "#E5C887",
    coverTextColor: "#FAF8F5",
    coverSubtextColor: "#E1C98E",
    coverHighlight: "#F7E7C4",
    coverFiligreeStyle: "islamic-arabesque",

    receptionBg: "#FAF8F5",
    receptionBorderColor: "#C8A45E",
    receptionBorderInner: "rgba(200, 164, 94, 0.35)",
    receptionPrimaryText: "#073D31",
    receptionSecondaryText: "#3C4B45",
    receptionGoldAccent: "#B88E3E",
    receptionDividerStyle: "arabesque",

    coupleFont: "'Alex Brush', cursive",
    headingFont: "'Amiri', 'Playfair Display', serif",
    bodyFont: "'Amiri', serif",

    tradition: "muslim",
    sacredInvocation: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    sacredTranslation: "In the name of ALLAH the most gracious and most merciful",
    baratEventTitle: "The Sacred Nikah & Barat",
    receptionEventTitle: "Dawat-e-Walima",
  },

  "azure-nikah": {
    coverBg: "linear-gradient(135deg, #0B1E3B 0%, #061122 60%, #030812 100%)",
    coverBorderColor: "#C8A45E",
    coverBorderInner: "rgba(200, 164, 94, 0.4)",
    coverGoldAccent: "#F3D59B",
    coverTextColor: "#F0F4F8",
    coverSubtextColor: "#E1C98E",
    coverHighlight: "#FBF3DE",
    coverFiligreeStyle: "islamic-arabesque",

    receptionBg: "#F7F9FB",
    receptionBorderColor: "#C8A45E",
    receptionBorderInner: "rgba(200, 164, 94, 0.35)",
    receptionPrimaryText: "#0B1E3B",
    receptionSecondaryText: "#34455E",
    receptionGoldAccent: "#B88E3E",
    receptionDividerStyle: "arabesque",

    coupleFont: "'Allura', cursive",
    headingFont: "'Amiri', 'Playfair Display', serif",
    bodyFont: "'Amiri', serif",

    tradition: "muslim",
    sacredInvocation: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    sacredTranslation: "In the name of ALLAH the most gracious and most merciful",
    baratEventTitle: "The Sacred Nikah & Barat",
    receptionEventTitle: "Dawat-e-Walima",
  },

  "emerald-qasr": {
    coverBg: "linear-gradient(135deg, #06201B 0%, #03120F 70%, #010806 100%)",
    coverBorderColor: "#D4AF37",
    coverBorderInner: "rgba(212, 175, 55, 0.4)",
    coverGoldAccent: "#F2D888",
    coverTextColor: "#F9FBF9",
    coverSubtextColor: "#DFC16B",
    coverHighlight: "#FFF4CE",
    coverFiligreeStyle: "islamic-arabesque",

    receptionBg: "#FAF8F4",
    receptionBorderColor: "#D4AF37",
    receptionBorderInner: "rgba(212, 175, 55, 0.35)",
    receptionPrimaryText: "#06201B",
    receptionSecondaryText: "#364A44",
    receptionGoldAccent: "#B88E3E",
    receptionDividerStyle: "arabesque",

    coupleFont: "'Alex Brush', cursive",
    headingFont: "'Amiri', serif",
    bodyFont: "'Amiri', serif",

    tradition: "muslim",
    sacredInvocation: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    sacredTranslation: "In the name of ALLAH the most gracious and most merciful",
    baratEventTitle: "Royal Nikah & Barat Ceremony",
    receptionEventTitle: "Imperial Walima Banquet",
  },

  "kitab-e-nikah": {
    coverBg: "radial-gradient(ellipse at 50% 35%, #750B1E 0%, #520715 55%, #30030B 100%)",
    coverBorderColor: "#C8A45E",
    coverBorderInner: "rgba(200, 164, 94, 0.45)",
    coverGoldAccent: "#F4D284",
    coverTextColor: "#FAF6F7",
    coverSubtextColor: "#F1D59B",
    coverHighlight: "#FFF2D4",
    coverFiligreeStyle: "islamic-arabesque",

    receptionBg: "#FAF6F0",
    receptionBorderColor: "#C8A45E",
    receptionBorderInner: "rgba(200, 164, 94, 0.4)",
    receptionPrimaryText: "#650B1B",
    receptionSecondaryText: "#5E222D",
    receptionGoldAccent: "#C8A45E",
    receptionDividerStyle: "arabesque",

    coupleFont: "'Alex Brush', 'Great Vibes', cursive",
    headingFont: "'Amiri', 'Playfair Display', serif",
    bodyFont: "'Amiri', 'Cormorant Garamond', serif",

    tradition: "muslim",
    sacredInvocation: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    sacredTranslation: "In the name of ALLAH the most gracious and most merciful",
    baratEventTitle: "Dawat-e-Walima",
    receptionEventTitle: "Dawat-e-Walima",
  },

  "gul-e-noor": {
    coverBg: "linear-gradient(135deg, #4A1222 0%, #290812 60%, #150308 100%)",
    coverBorderColor: "#D4AF37",
    coverBorderInner: "rgba(212, 175, 55, 0.4)",
    coverGoldAccent: "#F3D59B",
    coverTextColor: "#FFF6F8",
    coverSubtextColor: "#E6B8C2",
    coverHighlight: "#FFF2F5",
    coverFiligreeStyle: "botanical-gold",

    receptionBg: "#FFF9FA",
    receptionBorderColor: "#D4AF37",
    receptionBorderInner: "rgba(212, 175, 55, 0.35)",
    receptionPrimaryText: "#4A1222",
    receptionSecondaryText: "#6A3845",
    receptionGoldAccent: "#B88E3E",
    receptionDividerStyle: "flourish",

    coupleFont: "'Allura', cursive",
    headingFont: "'Amiri', serif",
    bodyFont: "'Amiri', serif",

    tradition: "muslim",
    sacredInvocation: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    sacredTranslation: "In the name of ALLAH the most gracious and most merciful",
    baratEventTitle: "Jashn-e-Nikah & Barat",
    receptionEventTitle: "Walima Dawat",
  },

  // ── Hindu Royal & Vedic Templates ──
  "crimson-royale": {
    coverBg: "linear-gradient(135deg, #5A0E1A 0%, #38050D 60%, #1C0105 100%)",
    coverBorderColor: "#C8A45E",
    coverBorderInner: "rgba(200, 164, 94, 0.4)",
    coverGoldAccent: "#E5C887",
    coverTextColor: "#FCF8F5",
    coverSubtextColor: "#E1C98E",
    coverHighlight: "#FFF2DB",
    coverFiligreeStyle: "royal-haveli",

    receptionBg: "#FCF8F5",
    receptionBorderColor: "#C8A45E",
    receptionBorderInner: "rgba(200, 164, 94, 0.35)",
    receptionPrimaryText: "#5A0E1A",
    receptionSecondaryText: "#582B33",
    receptionGoldAccent: "#B88E3E",
    receptionDividerStyle: "lotus",

    coupleFont: "'Alex Brush', cursive",
    headingFont: "'Cinzel', 'Playfair Display', serif",
    bodyFont: "'Cormorant Garamond', serif",

    tradition: "hindu",
    sacredInvocation: "॥ श्री गणेशाय नमः ॥",
    sacredTranslation: "May Lord Ganesha Bless This Auspicious Union",
    baratEventTitle: "Shubh Vivah & Barat Procession",
    receptionEventTitle: "Preetibhoj & Grand Reception",
  },

  "royal-lotus": {
    coverBg: "linear-gradient(135deg, #4A121E 0%, #2A0810 60%, #140206 100%)",
    coverBorderColor: "#D4AF37",
    coverBorderInner: "rgba(212, 175, 55, 0.4)",
    coverGoldAccent: "#F2D888",
    coverTextColor: "#FCFBF7",
    coverSubtextColor: "#E1C98E",
    coverHighlight: "#FFF4CE",
    coverFiligreeStyle: "royal-haveli",

    receptionBg: "#FCFAF4",
    receptionBorderColor: "#D4AF37",
    receptionBorderInner: "rgba(212, 175, 55, 0.35)",
    receptionPrimaryText: "#54121F",
    receptionSecondaryText: "#5C313B",
    receptionGoldAccent: "#B88E3E",
    receptionDividerStyle: "lotus",

    coupleFont: "'Alex Brush', cursive",
    headingFont: "'Cinzel', 'Playfair Display', serif",
    bodyFont: "'Cormorant Garamond', serif",

    tradition: "hindu",
    sacredInvocation: "॥ श्री गणेशाय नमः ॥",
    sacredTranslation: "With the Divine Blessings of Lord Ganesha",
    baratEventTitle: "Shubh Vivah & Barat Swagat",
    receptionEventTitle: "Royal Reception & Preetibhoj",
  },

  "emerald-noir": {
    coverBg: "linear-gradient(135deg, #09211C 0%, #03110E 65%, #010705 100%)",
    coverBorderColor: "#D4AF37",
    coverBorderInner: "rgba(212, 175, 55, 0.4)",
    coverGoldAccent: "#F3D59B",
    coverTextColor: "#FAF8F5",
    coverSubtextColor: "#E1C98E",
    coverHighlight: "#FFF2DB",
    coverFiligreeStyle: "royal-haveli",

    receptionBg: "#FAF8F2",
    receptionBorderColor: "#D4AF37",
    receptionBorderInner: "rgba(212, 175, 55, 0.35)",
    receptionPrimaryText: "#09211C",
    receptionSecondaryText: "#374742",
    receptionGoldAccent: "#B88E3E",
    receptionDividerStyle: "lotus",

    coupleFont: "'Alex Brush', cursive",
    headingFont: "'Cinzel', 'Playfair Display', serif",
    bodyFont: "'Cormorant Garamond', serif",

    tradition: "hindu",
    sacredInvocation: "॥ श्री गणेशाय नमः ॥",
    sacredTranslation: "Two Souls Joined in Sacred Vedic Bond",
    baratEventTitle: "Vedic Vivah & Barat Ceremony",
    receptionEventTitle: "Royal Wedding Reception",
  },

  "royal-elegance": {
    coverBg: "linear-gradient(135deg, #5C1021 0%, #360712 60%, #1A0208 100%)",
    coverBorderColor: "#C8A45E",
    coverBorderInner: "rgba(200, 164, 94, 0.4)",
    coverGoldAccent: "#E5C887",
    coverTextColor: "#FDFBF7",
    coverSubtextColor: "#E1C98E",
    coverHighlight: "#FFF4CE",
    coverFiligreeStyle: "royal-haveli",

    receptionBg: "#FDFBF7",
    receptionBorderColor: "#C8A45E",
    receptionBorderInner: "rgba(200, 164, 94, 0.35)",
    receptionPrimaryText: "#5C1021",
    receptionSecondaryText: "#572C36",
    receptionGoldAccent: "#B88E3E",
    receptionDividerStyle: "lotus",

    coupleFont: "'Alex Brush', cursive",
    headingFont: "'Cinzel', serif",
    bodyFont: "'Cormorant Garamond', serif",

    tradition: "hindu",
    sacredInvocation: "॥ श्री गणेशाय नमः ॥",
    sacredTranslation: "Seeking the Auspicious Blessings of the Almighty",
    baratEventTitle: "Shubh Vivah & Barat",
    receptionEventTitle: "Grand Reception & Sangeet Feast",
  },

  "modern-minimal": {
    coverBg: "linear-gradient(135deg, #1C2220 0%, #121715 65%, #0B0E0D 100%)",
    coverBorderColor: "#C8A45E",
    coverBorderInner: "rgba(200, 164, 94, 0.3)",
    coverGoldAccent: "#E5C887",
    coverTextColor: "#F6F5F2",
    coverSubtextColor: "#D6C7A8",
    coverHighlight: "#FAF6ED",
    coverFiligreeStyle: "botanical-gold",

    receptionBg: "#F7F6F2",
    receptionBorderColor: "#C8A45E",
    receptionBorderInner: "rgba(200, 164, 94, 0.3)",
    receptionPrimaryText: "#1C2220",
    receptionSecondaryText: "#47524E",
    receptionGoldAccent: "#A68032",
    receptionDividerStyle: "flourish",

    coupleFont: "'Allura', cursive",
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Cormorant Garamond', serif",

    tradition: "universal",
    sacredInvocation: "✦ Together with Their Families ✦",
    sacredTranslation: "Request the pleasure of your company",
    baratEventTitle: "Wedding Ceremony & Nuptials",
    receptionEventTitle: "Evening Reception & Dinner",
  },

  // ── Universal & Luxury European / Celestial Masterpieces ──
  "celestial-rose": {
    coverBg: "linear-gradient(135deg, #101E33 0%, #08111F 60%, #03060C 100%)",
    coverBorderColor: "#E8B8B8",
    coverBorderInner: "rgba(200, 164, 94, 0.4)",
    coverGoldAccent: "#F3D59B",
    coverTextColor: "#F8F5F2",
    coverSubtextColor: "#E8C8C8",
    coverHighlight: "#FFF2E2",
    coverFiligreeStyle: "celestial-stars",

    receptionBg: "#FAF6F4",
    receptionBorderColor: "#C8A45E",
    receptionBorderInner: "rgba(232, 184, 184, 0.45)",
    receptionPrimaryText: "#101E33",
    receptionSecondaryText: "#445063",
    receptionGoldAccent: "#B88E3E",
    receptionDividerStyle: "celestial",

    coupleFont: "'Alex Brush', cursive",
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Cormorant Garamond', serif",

    tradition: "universal",
    sacredInvocation: "✦ Under the Celestial Stars ✦",
    sacredTranslation: "Two souls unite in love, eternity, and joy",
    baratEventTitle: "Wedding Procession & Ceremony",
    receptionEventTitle: "Starlight Gala & Reception",
  },

  "rose-gold-blush": {
    coverBg: "linear-gradient(135deg, #3D1C24 0%, #220B11 60%, #120408 100%)",
    coverBorderColor: "#E2B2A3",
    coverBorderInner: "rgba(212, 175, 55, 0.4)",
    coverGoldAccent: "#F5D4C8",
    coverTextColor: "#FCF8F7",
    coverSubtextColor: "#E2B2A3",
    coverHighlight: "#FFF1EC",
    coverFiligreeStyle: "botanical-gold",

    receptionBg: "#FBF7F5",
    receptionBorderColor: "#D4AF37",
    receptionBorderInner: "rgba(226, 178, 163, 0.4)",
    receptionPrimaryText: "#3D1C24",
    receptionSecondaryText: "#633C45",
    receptionGoldAccent: "#B88E3E",
    receptionDividerStyle: "flourish",

    coupleFont: "'Allura', cursive",
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Cormorant Garamond', serif",

    tradition: "universal",
    sacredInvocation: "✦ With Joyful Hearts & Families ✦",
    sacredTranslation: "Celebrate the union of two kindred spirits",
    baratEventTitle: "Wedding Ceremony & Procession",
    receptionEventTitle: "Rose Gold Reception & Banquet",
  },

  "royal-grace": {
    coverBg: "linear-gradient(135deg, #0E1A14 0%, #070F0B 65%, #030705 100%)",
    coverBorderColor: "#C8A45E",
    coverBorderInner: "rgba(200, 164, 94, 0.4)",
    coverGoldAccent: "#E5C887",
    coverTextColor: "#F9FAF9",
    coverSubtextColor: "#C8D9D0",
    coverHighlight: "#FBF3DE",
    coverFiligreeStyle: "botanical-gold",

    receptionBg: "#FAF9F5",
    receptionBorderColor: "#C8A45E",
    receptionBorderInner: "rgba(200, 164, 94, 0.35)",
    receptionPrimaryText: "#0E1A14",
    receptionSecondaryText: "#3D4E45",
    receptionGoldAccent: "#B88E3E",
    receptionDividerStyle: "flourish",

    coupleFont: "'Alex Brush', cursive",
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Cormorant Garamond', serif",

    tradition: "universal",
    sacredInvocation: "✦ An Enchanted Celebration ✦",
    sacredTranslation: "Request the pleasure of your presence",
    baratEventTitle: "Botanical Gate Wedding Ceremony",
    receptionEventTitle: "Royal Grace Reception Banquet",
  },

  "royal-heritage": {
    coverBg: "linear-gradient(135deg, #1C2E3D 0%, #0F1B24 60%, #070D12 100%)",
    coverBorderColor: "#D4AF37",
    coverBorderInner: "rgba(212, 175, 55, 0.4)",
    coverGoldAccent: "#F2D888",
    coverTextColor: "#FBFBFA",
    coverSubtextColor: "#CFDCE6",
    coverHighlight: "#FFF4CE",
    coverFiligreeStyle: "palace-rococo",

    receptionBg: "#FAF8F4",
    receptionBorderColor: "#D4AF37",
    receptionBorderInner: "rgba(212, 175, 55, 0.35)",
    receptionPrimaryText: "#1C2E3D",
    receptionSecondaryText: "#425666",
    receptionGoldAccent: "#B88E3E",
    receptionDividerStyle: "flourish",

    coupleFont: "'Allura', cursive",
    headingFont: "'Cinzel', serif",
    bodyFont: "'Cormorant Garamond', serif",

    tradition: "universal",
    sacredInvocation: "✦ In Honor of Their Union ✦",
    sacredTranslation: "Join in the celebration of timeless love",
    baratEventTitle: "Arched Portal Wedding Ceremony",
    receptionEventTitle: "Mediterranean Terrace Reception",
  },

  "royal-majesty": {
    coverBg: "linear-gradient(135deg, #1E2738 0%, #0F1521 65%, #07090F 100%)",
    coverBorderColor: "#C8A45E",
    coverBorderInner: "rgba(200, 164, 94, 0.4)",
    coverGoldAccent: "#F3D59B",
    coverTextColor: "#FAF9F6",
    coverSubtextColor: "#CFD7E4",
    coverHighlight: "#FBF3DE",
    coverFiligreeStyle: "palace-rococo",

    receptionBg: "#FBFBF9",
    receptionBorderColor: "#C8A45E",
    receptionBorderInner: "rgba(200, 164, 94, 0.35)",
    receptionPrimaryText: "#1E2738",
    receptionSecondaryText: "#455167",
    receptionGoldAccent: "#B88E3E",
    receptionDividerStyle: "flourish",

    coupleFont: "'Alex Brush', cursive",
    headingFont: "'Cinzel', serif",
    bodyFont: "'Cormorant Garamond', serif",

    tradition: "universal",
    sacredInvocation: "✦ The Grand Ballroom Celebration ✦",
    sacredTranslation: "Invite you to witness the beginning of forever",
    baratEventTitle: "Grand Regency Wedding Nuptials",
    receptionEventTitle: "Regency Ballroom Reception",
  },

  "imperial-palace": {
    coverBg: "linear-gradient(135deg, #4A1016 0%, #29060A 60%, #140204 100%)",
    coverBorderColor: "#D4AF37",
    coverBorderInner: "rgba(212, 175, 55, 0.4)",
    coverGoldAccent: "#F2D888",
    coverTextColor: "#FCFBF7",
    coverSubtextColor: "#E1C98E",
    coverHighlight: "#FFF4CE",
    coverFiligreeStyle: "palace-rococo",

    receptionBg: "#FCFAF6",
    receptionBorderColor: "#D4AF37",
    receptionBorderInner: "rgba(212, 175, 55, 0.35)",
    receptionPrimaryText: "#4A1016",
    receptionSecondaryText: "#5B2E33",
    receptionGoldAccent: "#B88E3E",
    receptionDividerStyle: "flourish",

    coupleFont: "'Alex Brush', cursive",
    headingFont: "'Cinzel', serif",
    bodyFont: "'Cormorant Garamond', serif",

    tradition: "universal",
    sacredInvocation: "✦ By Royal Proclamation & Honour ✦",
    sacredTranslation: "Request your esteemed presence on this royal day",
    baratEventTitle: "Imperial Palace Wedding Ceremony",
    receptionEventTitle: "Grand Ballroom Feast & Reception",
  },
};

export function getPdfThemeTokens(
  templateId: string,
  customReligion?: CulturalTradition
): PdfCardStyleTokens {
  const baseTokens = PDF_THEME_TOKENS[templateId] ?? PDF_THEME_TOKENS["noor-e-nikah"];

  if (!customReligion) {
    return baseTokens;
  }

  // If user selected a specific religion in customization, adapt the tradition, invocations, and event titles
  if (customReligion === "muslim") {
    return {
      ...baseTokens,
      tradition: "muslim",
      sacredInvocation: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      sacredTranslation: "In the name of ALLAH the most gracious and most merciful",
      baratEventTitle: "The Sacred Nikah & Barat",
      receptionEventTitle: "Dawat-e-Walima",
      receptionDividerStyle: "arabesque",
    };
  }

  if (customReligion === "hindu") {
    return {
      ...baseTokens,
      tradition: "hindu",
      sacredInvocation: "॥ श्री गणेशाय नमः ॥",
      sacredTranslation: "May Lord Ganesha Bless This Auspicious Union",
      baratEventTitle: "Shubh Vivah & Barat Procession",
      receptionEventTitle: "Preetibhoj & Grand Reception",
      receptionDividerStyle: "lotus",
    };
  }

  if (customReligion === "universal") {
    return {
      ...baseTokens,
      tradition: "universal",
      sacredInvocation: "✦ Two Hearts · One Journey ✦",
      sacredTranslation: "Invite you to witness the beginning of forever",
      baratEventTitle: "Wedding Procession & Ceremony",
      receptionEventTitle: "Grand Gala Dinner & Reception",
      receptionDividerStyle: "celestial",
    };
  }

  return baseTokens;
}
