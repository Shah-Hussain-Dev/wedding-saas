// pdf/template-adapter.js
// Adapts web template data and IDs (all 17 templates) into the unified 2-3 page vector PDF studio format.
// Strictly non-destructive: does not modify or import internal template implementation files.

import { THEMES, LAYOUTS, FONT_SETS, initialState } from "./data.js";

/**
 * Detailed configuration mapping for all 17 templates in the SaaS platform.
 * Guarantees every template has its signature theme palette, border layout,
 * typography pairing, and 2-3 page structure.
 */
export const TEMPLATE_PDF_CONFIGS = {
  "sheesh-mahal": {
    templateId: "sheesh-mahal",
    name: "Sheesh Mahal Palace",
    themeId: "sheeshMahal",
    layout: "sheeshMirror",
    fontId: "classic",
    motif: "peacock",
    faith: "muslim",
    structure: "3-page",
    defaultPages: { cover: true, families: true, venue: true, combined: false },
  },
  "royal-majesty": {
    templateId: "royal-majesty",
    name: "Royal Majesty Ballroom",
    themeId: "royalMajesty",
    layout: "majestyBezel",
    fontId: "elegant",
    motif: "monogram",
    faith: "universal",
    structure: "2-page",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  "royal-lotus": {
    templateId: "royal-lotus",
    name: "Royal Lotus Mandapam",
    themeId: "royalLotus",
    layout: "lotusTemple",
    fontId: "classic",
    motif: "lotus",
    faith: "hindu",
    structure: "3-page",
    defaultPages: { cover: true, families: true, venue: true, combined: false },
  },
  "royal-heritage": {
    templateId: "royal-heritage",
    name: "Royal Heritage Rajputana",
    themeId: "royalHeritage",
    layout: "heritageSandstone",
    fontId: "romantic",
    motif: "peacock",
    faith: "hindu",
    structure: "3-page",
    defaultPages: { cover: true, families: true, venue: true, combined: false },
  },
  "royal-grace": {
    templateId: "royal-grace",
    name: "Royal Grace Sage",
    themeId: "royalGrace",
    layout: "graceMehndi",
    fontId: "rustic",
    motif: "olive",
    faith: "universal",
    structure: "2-page",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  "royal-elegance": {
    templateId: "royal-elegance",
    name: "Royal Elegance Crimson",
    themeId: "royalElegance",
    layout: "crimsonGoldCrest",
    fontId: "classic",
    motif: "knot",
    faith: "hindu",
    structure: "2-page",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  "rose-gold-blush": {
    templateId: "rose-gold-blush",
    name: "Rose Gold Twilight",
    themeId: "roseGoldBlush",
    layout: "twilightRose",
    fontId: "romantic",
    motif: "crescent",
    faith: "universal",
    structure: "2-page",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  "noor-e-nikah": {
    templateId: "noor-e-nikah",
    name: "Noor-e-Nikah Emerald",
    themeId: "emerald",
    layout: "palaceArch",
    fontId: "classic",
    motif: "star",
    faith: "muslim",
    structure: "3-page",
    defaultPages: { cover: true, families: true, venue: true, combined: false },
  },
  "azure-nikah": {
    templateId: "azure-nikah",
    name: "Azure Nikah Sapphire",
    themeId: "azureSkySandstone",
    layout: "arch",
    fontId: "elegant",
    motif: "star",
    faith: "muslim",
    structure: "2-page",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  "emerald-qasr": {
    templateId: "emerald-qasr",
    name: "Emerald Qasr Palace",
    themeId: "sheeshMahalDark",
    layout: "sheeshMirror",
    fontId: "classic",
    motif: "peacock",
    faith: "muslim",
    structure: "3-page",
    defaultPages: { cover: true, families: true, venue: true, combined: false },
  },
  "kitab-e-nikah": {
    templateId: "kitab-e-nikah",
    name: "Kitab-e-Nikah Parchment",
    themeId: "champagneOyster",
    layout: "baroque",
    fontId: "classic",
    motif: "knot",
    faith: "muslim",
    structure: "2-page",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  "gul-e-noor": {
    templateId: "gul-e-noor",
    name: "Gul-e-Noor Floral",
    themeId: "roseMarbleCream",
    layout: "scenicVeranda",
    fontId: "romantic",
    motif: "lotus",
    faith: "muslim",
    structure: "3-page",
    defaultPages: { cover: true, families: true, venue: true, combined: false },
  },
  "crimson-royale": {
    templateId: "crimson-royale",
    name: "Crimson Royale Velvet",
    themeId: "maroonGold",
    layout: "crimsonGoldCrest",
    fontId: "classic",
    motif: "monogram",
    faith: "hindu",
    structure: "2-page",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  "emerald-noir": {
    templateId: "emerald-noir",
    name: "Emerald Noir Art Deco",
    themeId: "artDecoNoir",
    layout: "artdeco",
    fontId: "artdeco",
    motif: "sunburst",
    faith: "universal",
    structure: "2-page",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  "modern-minimal": {
    templateId: "modern-minimal",
    name: "Modern Minimal Editorial",
    themeId: "mono",
    layout: "modernEdge",
    fontId: "modern",
    motif: "diamond",
    faith: "universal",
    structure: "2-page",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  "imperial-palace": {
    templateId: "imperial-palace",
    name: "Imperial Palace Gold",
    themeId: "templeGoldCrimson",
    layout: "palaceArch",
    fontId: "classic",
    motif: "peacock",
    faith: "hindu",
    structure: "3-page",
    defaultPages: { cover: true, families: true, venue: true, combined: false },
  },
  "celestial-rose": {
    templateId: "celestial-rose",
    name: "Celestial Rose Navy",
    themeId: "celestialMidnight",
    layout: "celestial",
    fontId: "elegant",
    motif: "crescent",
    faith: "universal",
    structure: "2-page",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
};

/**
 * Returns the matching PDF configuration for any template ID (with fallback).
 */
export function getPdfConfigForTemplate(templateId, requestedFaith) {
  const normalizedId = (templateId || "").trim().toLowerCase().replace(/_/g, "-");
  const baseConfig = TEMPLATE_PDF_CONFIGS[normalizedId] || {
    templateId: normalizedId || "universal-wedding",
    name: "Universal Wedding Stationery",
    themeId: "maroonGold",
    layout: "royal",
    fontId: "classic",
    motif: "monogram",
    faith: "universal",
    structure: "2-page",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  };

  if (requestedFaith) {
    return {
      ...baseConfig,
      faith: requestedFaith,
    };
  }
  return baseConfig;
}

/**
 * Formats a raw date string into human-friendly full date for stationery print.
 */
function formatStationeryDate(rawDate) {
  if (!rawDate) return "SUNDAY · 14 FEBRUARY 2027";
  if (typeof rawDate === "string" && (rawDate.includes("·") || rawDate.includes(","))) {
    return rawDate;
  }
  try {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
      const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
      return `${days[d.getDay()]} · ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
  } catch (_) {}
  return String(rawDate);
}

/**
 * Adapts template initial data into state ready for the Vector PDF Studio.
 * Excludes RSVP sections and enforces 2-3 pages max.
 */
export function adaptTemplateDataToPdfState(templateId, rawData = {}) {
  const faith = rawData.religion || rawData.faith;
  const config = getPdfConfigForTemplate(templateId, faith);

  const bride = (rawData.brideName || rawData.couple?.brideName || "Anaya").trim();
  const groom = (rawData.groomName || rawData.couple?.groomName || "Rohan").trim();

  // Sacred Invocations based on tradition or custom data
  let invocation = rawData.sacredInvocation;
  let invocationTrans = rawData.sacredTranslation || rawData.sacredVerse;

  if (!invocation) {
    if (config.faith === "muslim") {
      invocation = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
      invocationTrans = "In the name of Allah, Most Gracious, Most Merciful";
    } else if (config.faith === "hindu") {
      invocation = "॥ श्री गणेशाय नमः ॥";
      invocationTrans = "Om Shri Ganeshaya Namah";
    } else {
      invocation = "✦ Joined in love, united forever ✦";
      invocationTrans = "Two lives, two hearts, joined in friendship, united forever in love";
    }
  }

  // Parse raw events into stationery event cards - ALL user-added events are preserved
  const rawEvents = Array.isArray(rawData.events) && rawData.events.length > 0
    ? rawData.events
    : (Array.isArray(rawData.eventsJson) && rawData.eventsJson.length > 0 ? rawData.eventsJson : null);

  let events = [];
  if (rawEvents && rawEvents.length > 0) {
    events = rawEvents
      .filter((ev) => ev && ev.enabled !== false)
      .map((ev, idx) => ({
        id: ev.id ? String(ev.id) : `ev-${idx}-${Date.now()}`,
        title: ev.name || ev.title || `Celebration ${idx + 1}`,
        date: ev.date || rawData.weddingDate || "14 February 2027",
        time: ev.time || "6:30 PM",
        venue: ev.venue || rawData.venueName || "The Grand Pavilion",
        day: ev.day || "",
        note: ev.note || ev.description || ev.dressCode || "",
      }));
  } else {
    events = [
      {
        id: "ev-1",
        title: config.faith === "muslim" ? "The Sacred Nikah" : (config.faith === "hindu" ? "Shubh Vivah & Pheras" : "The Wedding Vows"),
        date: rawData.weddingDate ? formatStationeryDate(rawData.weddingDate) : "14 February 2027",
        time: rawData.weddingTime || "4:00 PM",
        venue: rawData.venueName || "The Grand Pavilion",
        day: "SUNDAY",
        note: "Auspicious ceremony with cherished blessings",
      },
      {
        id: "ev-2",
        title: config.faith === "muslim" ? "Dawat-e-Walima" : (config.faith === "hindu" ? "Grand Reception" : "Dinner & Reception"),
        date: rawData.weddingDate ? formatStationeryDate(rawData.weddingDate) : "14 February 2027",
        time: "6:30 PM",
        venue: rawData.venueName || "The Grand Pavilion & Resorts",
        day: "SUNDAY",
        note: "Celebration, music and dinner banquet",
      },
    ];
  }

  const weddingDateStr = formatStationeryDate(rawData.weddingDate);
  const venueAddress = rawData.venueAddress || "Heritage Lake Road, Civil Lines";
  const venueName = rawData.venueName || "The Grand Pavilion & Resort";
  const baseState = initialState();

  return {
    ...baseState,
    templateId: config.templateId,
    faith: config.faith,
    themeId: config.themeId,
    layout: config.layout,
    fontId: config.fontId,
    motif: config.motif,
    structure: config.structure,
    colors: {},
    // Page Selection (guaranteed 2 to 3 pages max)
    pages: { ...config.defaultPages },
    date: weddingDateStr,
    couple: {
      bride,
      groom,
      brideTitle: rawData.brideTitle || "",
      groomTitle: rawData.groomTitle || "",
      groomFirst: false,
      tagline: rawData.hostsLine || "Together with their cherished families",
    },
    venue: {
      title: config.faith === "muslim" ? "The Sacred Venue" : (config.faith === "hindu" ? "Shubh Sthal" : "The Wedding Venue"),
      name: venueName,
      address: venueAddress,
      mapUrl: rawData.mapUrl || (venueAddress ? `https://maps.google.com/?q=${encodeURIComponent(venueAddress)}` : ""),
      showQr: true,
      buttonText: "Open in Google Maps",
    },
    parents: {
      intro: "With the loving blessings of our ancestors and cherished families",
      bride: rawData.brideParents || "Mr. & Mrs. Sharma",
      groom: rawData.groomParents || "Mr. & Mrs. Verma",
      grandparentsBride: rawData.brideGrandparents || "",
      grandparentsGroom: rawData.groomGrandparents || "",
      warmWishes: rawData.complimentsText || "Warmly invited by all friends, family & loved ones",
    },
    invitationType: config.faith === "muslim" ? "NIKAH CEREMONY" : (config.faith === "hindu" ? "SHUBH VIVAH" : "WEDDING INVITATION"),
    headline: config.faith === "muslim" ? "DAWAT-E-WALIMA & NIKAH" : (config.faith === "hindu" ? "THE WEDDING CELEBRATION" : "THE WEDDING CELEBRATION"),
    invocation,
    invocationTrans,
    events,
    elements: [],
    // Flat convenience aliases
    bride,
    groom,
    venueName,
    venueAddress,
    weddingDate: weddingDateStr,
    mapUrl: rawData.mapUrl || (venueAddress ? `https://maps.google.com/?q=${encodeURIComponent(venueAddress)}` : ""),
  };
}
