/**
 * Standalone, Client-Safe Template Sort Order & Release Timeline
 * Zero dependencies — safe for Turbopack, SSR, and Client Component bundles.
 */

export const DEFAULT_TEMPLATE_SORT_ORDER: Record<string, number> = {
  "sheesh-mahal": 1,
  "noor-e-nikah": 2,
  "celestial-rose": 3,
  "emerald-qasr": 4,
  "gul-e-noor": 5,
  "azure-nikah": 6,
  "kitab-e-nikah": 7,
  "crimson-royale": 8,
  "royal-lotus": 9,
  "emerald-noir": 10,
  "royal-elegance": 11,
  "imperial-palace": 12,
  "royal-majesty": 13,
  "royal-heritage": 14,
  "royal-grace": 15,
  "rose-gold-blush": 16,
  "modern-minimal": 17,
};

export const DEFAULT_TEMPLATE_RELEASE_DATES: Record<string, string> = {
  "sheesh-mahal": "2026-11-01T00:00:00.000Z",
  "celestial-rose": "2026-10-15T00:00:00.000Z",
  "royal-majesty": "2026-10-01T00:00:00.000Z",
  "royal-heritage": "2026-09-20T00:00:00.000Z",
  "emerald-qasr": "2026-09-10T00:00:00.000Z",
  "gul-e-noor": "2026-09-01T00:00:00.000Z",
  "azure-nikah": "2026-08-20T00:00:00.000Z",
  "kitab-e-nikah": "2026-08-10T00:00:00.000Z",
  "rose-gold-blush": "2026-08-01T00:00:00.000Z",
  "royal-grace": "2026-07-20T00:00:00.000Z",
  "imperial-palace": "2026-07-01T00:00:00.000Z",
  "crimson-royale": "2026-06-15T00:00:00.000Z",
  "noor-e-nikah": "2026-06-01T00:00:00.000Z",
  "royal-lotus": "2026-05-15T00:00:00.000Z",
  "emerald-noir": "2026-05-01T00:00:00.000Z",
  "royal-elegance": "2026-04-15T00:00:00.000Z",
  "modern-minimal": "2026-04-01T00:00:00.000Z",
};

export function getTemplateSortRank(id?: string): number {
  if (!id) return 99;
  return DEFAULT_TEMPLATE_SORT_ORDER[id.toLowerCase()] ?? 99;
}

export function getTemplateReleaseDate(id?: string): string {
  if (!id) return "2026-01-01T00:00:00.000Z";
  return DEFAULT_TEMPLATE_RELEASE_DATES[id.toLowerCase()] || "2026-01-01T00:00:00.000Z";
}
