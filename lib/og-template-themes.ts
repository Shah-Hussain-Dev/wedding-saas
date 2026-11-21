import { defaultCulturalTraditionForTemplate } from "./template-meta";

export interface OgTemplateTheme {
  id: string;
  name: string;
  bgGradient: string;
  primaryColor: string;
  accentGold: string;
  subtextColor: string;
  borderOuter: string;
  borderInner: string;
  badgeBg: string;
  badgeBorder: string;
  pillBg: string;
  pillText: string;
  tagline: string;
  motifIcon: string;
  watermark: string;
}

export const OG_TEMPLATE_THEMES: Record<string, OgTemplateTheme> = {
  "imperial-palace": {
    id: "imperial-palace",
    name: "Imperial Palace",
    bgGradient: "radial-gradient(circle at 50% 36%, #361114 0%, #20080A 55%, #0F0304 100%)",
    primaryColor: "#FFF8EA",
    accentGold: "#D5BA97",
    subtextColor: "#E2CBB0",
    borderOuter: "rgba(184, 151, 115, 0.85)",
    borderInner: "rgba(213, 186, 151, 0.45)",
    badgeBg: "rgba(184, 151, 115, 0.16)",
    badgeBorder: "rgba(213, 186, 151, 0.7)",
    pillBg: "#B89773",
    pillText: "#1F080A",
    tagline: "✦ LIVING 3D PALACE INVITATION ✦",
    motifIcon: "👑",
    watermark: "Imperial Living Palace Experience",
  },
  "sheesh-mahal": {
    id: "sheesh-mahal",
    name: "Sheesh Mahal",
    bgGradient: "radial-gradient(circle at 50% 36%, #0A382C 0%, #041C15 55%, #020C09 100%)",
    primaryColor: "#FAF8F5",
    accentGold: "#E5C378",
    subtextColor: "#D2E5DF",
    borderOuter: "rgba(212, 175, 55, 0.85)",
    borderInner: "rgba(229, 195, 120, 0.45)",
    badgeBg: "rgba(11, 74, 59, 0.35)",
    badgeBorder: "rgba(229, 195, 120, 0.65)",
    pillBg: "#D4AF37",
    pillText: "#041B15",
    tagline: "✦ MUGHAL PALACE OF MIRRORS ✦",
    motifIcon: "🌙",
    watermark: "Sheesh Mahal 3D Palace of Mirrors",
  },
  "royal-heritage": {
    id: "royal-heritage",
    name: "Royal Heritage",
    bgGradient: "radial-gradient(circle at 50% 36%, #13334C 0%, #0A1C2C 55%, #050E17 100%)",
    primaryColor: "#FDFBF7",
    accentGold: "#F0C88C",
    subtextColor: "#D6E4EE",
    borderOuter: "rgba(240, 200, 140, 0.85)",
    borderInner: "rgba(217, 81, 71, 0.45)",
    badgeBg: "rgba(19, 51, 76, 0.45)",
    badgeBorder: "rgba(240, 200, 140, 0.65)",
    pillBg: "#E5A872",
    pillText: "#0A1C2C",
    tagline: "✦ ROYAL ARCHITECTURAL HERITAGE ✦",
    motifIcon: "🏛️",
    watermark: "Mediterranean Living 3D Portal",
  },
  "celestial-rose": {
    id: "celestial-rose",
    name: "Celestial Rose",
    bgGradient: "radial-gradient(circle at 50% 36%, #281438 0%, #170924 55%, #0B0412 100%)",
    primaryColor: "#FFF0F3",
    accentGold: "#E8B8B8",
    subtextColor: "#E2D3E8",
    borderOuter: "rgba(232, 184, 184, 0.85)",
    borderInner: "rgba(197, 165, 216, 0.45)",
    badgeBg: "rgba(40, 20, 56, 0.45)",
    badgeBorder: "rgba(232, 184, 184, 0.65)",
    pillBg: "#E8B8B8",
    pillText: "#170924",
    tagline: "✦ CELESTIAL STARLIGHT DREAMSCAPE ✦",
    motifIcon: "✨",
    watermark: "Awwwards Living 3D Dreamscape",
  },
  "royal-lotus": {
    id: "royal-lotus",
    name: "Royal Lotus",
    bgGradient: "radial-gradient(circle at 50% 36%, #380F15 0%, #1F070A 55%, #100204 100%)",
    primaryColor: "#FCF9F2",
    accentGold: "#E6C687",
    subtextColor: "#EAD7BC",
    borderOuter: "rgba(230, 198, 135, 0.85)",
    borderInner: "rgba(212, 175, 55, 0.45)",
    badgeBg: "rgba(212, 175, 55, 0.16)",
    badgeBorder: "rgba(230, 198, 135, 0.65)",
    pillBg: "#D4AF37",
    pillText: "#1F070A",
    tagline: "✦ ROYAL RAJASTHANI PALACE ✦",
    motifIcon: "🪷",
    watermark: "Royal Lotus 3D Heritage Experience",
  },
  "crimson-royale": {
    id: "crimson-royale",
    name: "Crimson Royale",
    bgGradient: "radial-gradient(circle at 50% 36%, #4A0E18 0%, #26050C 55%, #120205 100%)",
    primaryColor: "#FFF5EB",
    accentGold: "#F0D48B",
    subtextColor: "#E5CAB4",
    borderOuter: "rgba(240, 212, 139, 0.85)",
    borderInner: "rgba(245, 220, 140, 0.45)",
    badgeBg: "rgba(74, 14, 24, 0.35)",
    badgeBorder: "rgba(240, 212, 139, 0.65)",
    pillBg: "#D4AF37",
    pillText: "#26050C",
    tagline: "✦ REGAL CRIMSON COURT ✦",
    motifIcon: "👑",
    watermark: "Crimson Royale Living 3D Gates",
  },
  "noor-e-nikah": {
    id: "noor-e-nikah",
    name: "Noor-e-Nikah",
    bgGradient: "radial-gradient(circle at 50% 36%, #2C2216 0%, #1C150D 55%, #0F0A06 100%)",
    primaryColor: "#FFFDF9",
    accentGold: "#DFBA73",
    subtextColor: "#EADDC6",
    borderOuter: "rgba(223, 186, 115, 0.85)",
    borderInner: "rgba(245, 220, 140, 0.45)",
    badgeBg: "rgba(223, 186, 115, 0.16)",
    badgeBorder: "rgba(223, 186, 115, 0.65)",
    pillBg: "#DFBA73",
    pillText: "#1C150D",
    tagline: "✦ SACRED ISLAMIC NIKAH ✦",
    motifIcon: "🕌",
    watermark: "Noor-e-Nikah 3D Mosque Portal",
  },
  "emerald-noir": {
    id: "emerald-noir",
    name: "Emerald Noir",
    bgGradient: "radial-gradient(circle at 50% 36%, #081F1A 0%, #04120F 55%, #020806 100%)",
    primaryColor: "#F7FAF8",
    accentGold: "#D4AF37",
    subtextColor: "#CAD8D3",
    borderOuter: "rgba(212, 175, 55, 0.85)",
    borderInner: "rgba(243, 229, 171, 0.45)",
    badgeBg: "rgba(8, 31, 26, 0.45)",
    badgeBorder: "rgba(212, 175, 55, 0.65)",
    pillBg: "#D4AF37",
    pillText: "#04120F",
    tagline: "✦ LUXURY DARK EMERALD & GOLD ✦",
    motifIcon: "✦",
    watermark: "Emerald Noir 3D Haveli Gates",
  },
  "emerald-qasr": {
    id: "emerald-qasr",
    name: "Emerald Qasr",
    bgGradient: "radial-gradient(circle at 50% 36%, #09261F 0%, #051612 55%, #020B09 100%)",
    primaryColor: "#F8FAF9",
    accentGold: "#E5C378",
    subtextColor: "#D0DDD9",
    borderOuter: "rgba(229, 195, 120, 0.85)",
    borderInner: "rgba(212, 175, 55, 0.45)",
    badgeBg: "rgba(9, 38, 31, 0.45)",
    badgeBorder: "rgba(229, 195, 120, 0.65)",
    pillBg: "#E5C378",
    pillText: "#051612",
    tagline: "✦ OTTOMAN PALACE ROYALE ✦",
    motifIcon: "🌙",
    watermark: "Emerald Qasr 3D Ottoman Experience",
  },
  "azure-nikah": {
    id: "azure-nikah",
    name: "Azure Nikah",
    bgGradient: "radial-gradient(circle at 50% 36%, #0C1D38 0%, #071224 55%, #030812 100%)",
    primaryColor: "#FAFBFD",
    accentGold: "#E0BD70",
    subtextColor: "#D0D9E7",
    borderOuter: "rgba(224, 189, 112, 0.85)",
    borderInner: "rgba(245, 220, 140, 0.45)",
    badgeBg: "rgba(12, 29, 56, 0.45)",
    badgeBorder: "rgba(224, 189, 112, 0.65)",
    pillBg: "#E0BD70",
    pillText: "#071224",
    tagline: "✦ MIDNIGHT SAPPHIRE & GOLD ✦",
    motifIcon: "🌙",
    watermark: "Azure Nikah 3D Celestial Gates",
  },
  "kitab-e-nikah": {
    id: "kitab-e-nikah",
    name: "Kitab-e-Nikah",
    bgGradient: "radial-gradient(circle at 50% 36%, #2B0C15 0%, #17050A 55%, #0C0205 100%)",
    primaryColor: "#FFF8EA",
    accentGold: "#E5C378",
    subtextColor: "#E2CBB0",
    borderOuter: "rgba(229, 195, 120, 0.85)",
    borderInner: "rgba(212, 175, 55, 0.45)",
    badgeBg: "rgba(43, 12, 21, 0.45)",
    badgeBorder: "rgba(229, 195, 120, 0.65)",
    pillBg: "#E5C378",
    pillText: "#17050A",
    tagline: "✦ SACRED VELVET TOME ✦",
    motifIcon: "📖",
    watermark: "Kitab-e-Nikah 3D Unfolding Tome",
  },
  "gul-e-noor": {
    id: "gul-e-noor",
    name: "Gul-e-Noor",
    bgGradient: "radial-gradient(circle at 50% 36%, #3A131F 0%, #210910 55%, #100307 100%)",
    primaryColor: "#FFF5F7",
    accentGold: "#F5D0DB",
    subtextColor: "#EAD0D8",
    borderOuter: "rgba(245, 208, 219, 0.85)",
    borderInner: "rgba(229, 195, 120, 0.45)",
    badgeBg: "rgba(58, 19, 31, 0.45)",
    badgeBorder: "rgba(245, 208, 219, 0.65)",
    pillBg: "#F5D0DB",
    pillText: "#210910",
    tagline: "✦ ROMANTIC BLUSH & ROSE VELVET ✦",
    motifIcon: "🌸",
    watermark: "Gul-e-Noor 3D Floral Experience",
  },
  "royal-grace": {
    id: "royal-grace",
    name: "Royal Grace",
    bgGradient: "radial-gradient(circle at 50% 36%, #182A20 0%, #0E1B14 55%, #070F0A 100%)",
    primaryColor: "#F8FAF8",
    accentGold: "#D5BA97",
    subtextColor: "#CED9D2",
    borderOuter: "rgba(213, 186, 151, 0.85)",
    borderInner: "rgba(184, 151, 115, 0.45)",
    badgeBg: "rgba(24, 42, 32, 0.45)",
    badgeBorder: "rgba(213, 186, 151, 0.65)",
    pillBg: "#D5BA97",
    pillText: "#0E1B14",
    tagline: "✦ BOTANICAL VELVET & GOLD ✦",
    motifIcon: "🌿",
    watermark: "Royal Grace 3D Glasshouse Palace",
  },
  "royal-elegance": {
    id: "royal-elegance",
    name: "Royal Elegance",
    bgGradient: "radial-gradient(circle at 50% 36%, #3D1016 0%, #23070C 55%, #120306 100%)",
    primaryColor: "#FAF7F0",
    accentGold: "#E5C378",
    subtextColor: "#E2CFB8",
    borderOuter: "rgba(229, 195, 120, 0.85)",
    borderInner: "rgba(212, 175, 55, 0.45)",
    badgeBg: "rgba(61, 16, 22, 0.45)",
    badgeBorder: "rgba(229, 195, 120, 0.65)",
    pillBg: "#E5C378",
    pillText: "#23070C",
    tagline: "✦ MAHARANI SILK & KUNDAN ✦",
    motifIcon: "👑",
    watermark: "Royal Elegance 3D Silk Curtains",
  },
  "modern-minimal": {
    id: "modern-minimal",
    name: "Modern Minimal",
    bgGradient: "radial-gradient(circle at 50% 36%, #282522 0%, #191715 55%, #0D0C0B 100%)",
    primaryColor: "#FAF9F6",
    accentGold: "#D5BA97",
    subtextColor: "#DDD7CD",
    borderOuter: "rgba(213, 186, 151, 0.85)",
    borderInner: "rgba(184, 151, 115, 0.45)",
    badgeBg: "rgba(40, 37, 34, 0.45)",
    badgeBorder: "rgba(213, 186, 151, 0.65)",
    pillBg: "#D5BA97",
    pillText: "#191715",
    tagline: "✦ CONTEMPORARY ARCHITECTURAL LUXURY ✦",
    motifIcon: "✦",
    watermark: "Modern Minimal 3D Origami Envelope",
  },
  "royal-majesty": {
    id: "royal-majesty",
    name: "Royal Majesty",
    bgGradient: "radial-gradient(circle at 50% 36%, #122338 0%, #0A1522 55%, #040910 100%)",
    primaryColor: "#FAFBFD",
    accentGold: "#D5BA97",
    subtextColor: "#D1DCE8",
    borderOuter: "rgba(213, 186, 151, 0.85)",
    borderInner: "rgba(169, 193, 208, 0.45)",
    badgeBg: "rgba(18, 35, 56, 0.45)",
    badgeBorder: "rgba(213, 186, 151, 0.65)",
    pillBg: "#D5BA97",
    pillText: "#0A1522",
    tagline: "✦ GRAND PALACE & REGENCY BALLROOM ✦",
    motifIcon: "👑",
    watermark: "Royal Majesty 3D Regency Horizon",
  },
  "rose-gold-blush": {
    id: "rose-gold-blush",
    name: "Rose Gold Blush",
    bgGradient: "radial-gradient(circle at 50% 36%, #2F1B1F 0%, #1B0E11 55%, #0E0608 100%)",
    primaryColor: "#FFF8F5",
    accentGold: "#E8B8B8",
    subtextColor: "#E2D0D0",
    borderOuter: "rgba(232, 184, 184, 0.85)",
    borderInner: "rgba(243, 233, 226, 0.45)",
    badgeBg: "rgba(47, 27, 31, 0.45)",
    badgeBorder: "rgba(232, 184, 184, 0.65)",
    pillBg: "#E8B8B8",
    pillText: "#1B0E11",
    tagline: "✦ DUAL-FAITH ROYAL CELEBRATION ✦",
    motifIcon: "✦",
    watermark: "Rose Gold Blush 3D Cinematic Reveal",
  },
};

export const DEFAULT_OG_THEME: OgTemplateTheme = OG_TEMPLATE_THEMES["imperial-palace"];

export function resolveSacredInvocation(
  religion: "muslim" | "hindu" | "universal",
  customInvocation?: string | null
): string {
  if (customInvocation && customInvocation.trim()) {
    return customInvocation.trim();
  }
  if (religion === "muslim") {
    return "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ";
  }
  if (religion === "hindu") {
    return "॥ श्री गणेशाय नमः ॥";
  }
  return "✦ A SACRED CELEBRATION OF LOVE ✦";
}

export function getOgThemeForTemplate(
  templateId?: string,
  userReligion?: string | null,
  customInvocation?: string | null
): {
  theme: OgTemplateTheme;
  sacredInvocation: string;
  religion: "muslim" | "hindu" | "universal";
} {
  const normalizedId = (templateId || "").replace(/_/g, "-").toLowerCase();
  const theme = OG_TEMPLATE_THEMES[normalizedId] || DEFAULT_OG_THEME;

  let religion: "muslim" | "hindu" | "universal" = "universal";
  if (userReligion === "muslim" || userReligion === "hindu" || userReligion === "universal") {
    religion = userReligion;
  } else {
    religion = defaultCulturalTraditionForTemplate(normalizedId);
  }

  const invocation = resolveSacredInvocation(religion, customInvocation);

  return {
    theme,
    sacredInvocation: invocation,
    religion,
  };
}
