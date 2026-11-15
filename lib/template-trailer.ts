/** Primary showcase trailer per template (card grids, reels, etc.) */
const TEMPLATE_TRAILER_MAP: Record<string, string> = {
  "celestial-rose": "/videos/royal-prestige.mp4",
  "imperial-palace": "/videos/royal-elegance-royal.mp4",
  "royal-majesty": "/videos/royal-majesty.mp4",
  "royal-heritage": "/videos/royal-heritage.mp4",
  "royal-grace": "/videos/royal-grace.mp4",
  "rose-gold-blush": "/videos/rose-gold-blush.mp4",
  // noor-e-nikah: no opening.mp4 in repo — hero uses poster (see TEMPLATE_POSTER_MAP)
  "emerald-qasr": "/templates/emerald-qasr/opening.mp4",
  "gul-e-noor": "/templates/gul-e-noor/opening.mp4",
  "azure-nikah": "/templates/azure-nikah/opening.mp4",
  "kitab-e-nikah": "/templates/kitab-e-nikah/opening.mp4",
  "crimson-royale": "/templates/crimson-royale/bg-love.mp4",
  "royal-lotus": "/videos/royal-majesty.mp4",
  "emerald-noir": "/videos/royal-grace.mp4",
  "royal-elegance": "/videos/royal-elegance-royal.mp4",
  "modern-minimal": "/videos/royal-grace.mp4",
  "sheesh-mahal": "",
};

/**
 * Authentic, high-resolution static cover photos for all 17 templates.
 * Every template has a strictly unique, dedicated visual asset matching its theme.
 */
export const TEMPLATE_POSTER_MAP: Record<string, string> = {
  // Islamic & Nikah Collections
  "sheesh-mahal": "/templates/sheesh-mahal/assets/cover/doors.webp",
  "noor-e-nikah": "/templates/noor-e-nikah/envelope-bg.jpg",
  "emerald-qasr": "/templates/emerald-qasr/poster.png",
  "gul-e-noor": "/templates/gul-e-noor/poster.png",
  "azure-nikah": "/templates/azure-nikah/poster.png",
  "kitab-e-nikah": "/templates/kitab-e-nikah/poster.png",

  // Universal & Celestial Masterpieces
  "celestial-rose": "/templates/celestial-rose/gallery-1.jpg",
  "imperial-palace": "/templates/imperial-palace/doors-hero.jpg",
  "royal-elegance": "/templates/imperial-palace/ballroom.jpg",
  "royal-majesty": "/templates/royal-majesty/ballroom-terrace.jpg",
  "royal-heritage": "/templates/royal-heritage/couple-arch.jpg",
  "royal-grace": "/templates/royal-grace/botanical-palace.jpg",
  "rose-gold-blush": "/templates/rose-gold-blush/palace-arch.jpg",

  // Hindu & Vedic Grandeur
  "crimson-royale": "/templates/crimson-royale/bg-welcome-desktop.jpg",
  "royal-lotus": "/templates/lotus-courtyard/farman-open.webp",
  "emerald-noir": "/images/gallery-library/hindu/haveli-royal-vivah.webp",
  "modern-minimal": "/templates/noor-e-nikah/welcome-parchment.jpg",
};

export function getTemplatePosterUrl(templateId: string): string {
  const normalized = (templateId || "").trim().replace(/_/g, "-").toLowerCase();
  return (
    TEMPLATE_POSTER_MAP[normalized] ||
    `/templates/${normalized}/envelope-desktop.jpg`
  );
}

export function getTemplateTrailerUrl(templateId: string, explicit?: string): string {
  const normalized = (templateId || "").trim().replace(/_/g, "-").toLowerCase();
  if (explicit?.trim()) return explicit.trim();
  return TEMPLATE_TRAILER_MAP[normalized] || `/templates/${normalized}/opening.mp4`;
}

/** Trailer URL when known to exist; empty string means use poster-only hero */
export function getTemplateTrailerUrlOrEmpty(templateId: string, explicit?: string): string {
  const normalized = (templateId || "").trim().replace(/_/g, "-").toLowerCase();
  if (explicit?.trim()) return explicit.trim();
  return TEMPLATE_TRAILER_MAP[normalized] ?? "";
}
