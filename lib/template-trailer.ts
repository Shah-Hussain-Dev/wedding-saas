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
};

/** Static hero/card fallback when trailer video is missing or fails to load */
const TEMPLATE_POSTER_MAP: Record<string, string> = {
  "noor-e-nikah": "/templates/noor-e-nikah/envelope-bg.jpg",
  "crimson-royale": "/templates/crimson-royale/bg-welcome-desktop.jpg",
  "royal-lotus": "/templates/imperial-palace/staircase.jpg",
  "royal-elegance": "/templates/imperial-palace/doors-hero.jpg",
};

export function getTemplatePosterUrl(templateId: string): string {
  const normalized = (templateId || "").trim().replace(/_/g, "-").toLowerCase();
  return (
    TEMPLATE_POSTER_MAP[normalized] ||
    `/templates/${normalized}/hero-couple-mobile.jpg`
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
