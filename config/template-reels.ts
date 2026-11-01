import { TEMPLATE_META, type TemplateId } from "@/lib/template-meta";
import {
  buildRoseGoldBlushReelBeats,
  buildRoseGoldBlushReelBeatsFromEvents,
} from "@/lib/reel-content/rose-gold-blush-beats";

export interface ReelBeat {
  id: string;
  beatKey: string;
  label: string;
  durationMs: number;
  /** CSS selector within reel scroll root */
  scrollTarget: string;
  /** Hero beat: extend until content revealed or timeout */
  waitForHeroReveal?: boolean;
  autoRevealScratch?: boolean;
  /** Grid chapter thumbnail (template art) */
  thumbnailPoster?: string;
}

export interface TemplateReelDefinition {
  templateId: TemplateId;
  name: string;
  tagline: string;
  description: string;
  tag?: string;
  beats: ReelBeat[];
  previewHref: string;
  customizeHref: string;
  linkedTemplateId: TemplateId;
  downloadVideoPath?: string;
  published: boolean;
  pricingStatus: "included-with-template" | "coming-soon";
  /** Catalog poster */
  posterUrl: string;
}

const ROSE_GOLD_BLUSH_ID = "rose-gold-blush" as const;

const ROSE_GOLD_BLUSH_REEL: TemplateReelDefinition = {
  templateId: ROSE_GOLD_BLUSH_ID,
  name: `${TEMPLATE_META[ROSE_GOLD_BLUSH_ID].name} · Reel`,
  tagline: "Autoplay mobile invitation · same customize flow",
  description:
    "Watch your Rose Gold Blush Royal invitation play like a social reel—gate reveal, animated chapters, every ceremony, gallery, venue, and RSVP. Edit all content in Customize; MP4 export coming soon.",
  tag: TEMPLATE_META[ROSE_GOLD_BLUSH_ID].tag,
  previewHref: `/preview/${ROSE_GOLD_BLUSH_ID}/interactive`,
  customizeHref: `/customize/${ROSE_GOLD_BLUSH_ID}`,
  linkedTemplateId: ROSE_GOLD_BLUSH_ID,
  downloadVideoPath: "/reels/rose-gold-blush.mp4",
  published: true,
  pricingStatus: "included-with-template",
  posterUrl: "/templates/rose-gold-blush/palace-arch.jpg",
  beats: buildRoseGoldBlushReelBeats(),
};

const REEL_REGISTRY: TemplateReelDefinition[] = [ROSE_GOLD_BLUSH_REEL];

export function getReelCatalog(): TemplateReelDefinition[] {
  return REEL_REGISTRY.filter((r) => r.published);
}

export function getReelByTemplateId(templateId: string): TemplateReelDefinition | null {
  const normalized = templateId.trim().replace(/_/g, "-").toLowerCase();
  return REEL_REGISTRY.find((r) => r.templateId === normalized && r.published) ?? null;
}

export function isReelPublished(templateId: string): boolean {
  return getReelByTemplateId(templateId) !== null;
}

export function getReelDownloadPath(reel: TemplateReelDefinition): string | undefined {
  return reel.downloadVideoPath;
}

export function resolveReelBeatsForTemplate(
  templateId: string,
  events?: unknown[] | null
): ReelBeat[] {
  const normalized = templateId.trim().replace(/_/g, "-").toLowerCase();
  if (normalized === ROSE_GOLD_BLUSH_ID) {
    return buildRoseGoldBlushReelBeatsFromEvents(events);
  }
  const reel = getReelByTemplateId(normalized);
  return reel?.beats ?? [];
}

/** @deprecated Use beats — kept for metadata fallbacks */
export function getReelBeatCount(reel: TemplateReelDefinition): number {
  return reel.beats.length;
}
