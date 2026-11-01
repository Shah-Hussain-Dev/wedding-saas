import roseGoldData from "@/templates/rose-gold-blush/data.json";
import type { ReelBeat } from "@/config/template-reels";

const POSTERS = {
  arch: "/templates/rose-gold-blush/palace-arch.jpg",
  mandala: "/templates/rose-gold-blush/gold-mandala.jpg",
  lanterns: "/templates/rose-gold-blush/palace-lanterns.jpg",
} as const;

/** Playback beats for Rose Gold Blush — maps to `data-reel-beat` / DOM selectors in the template. */
export function buildRoseGoldBlushReelBeats(eventCount?: number): ReelBeat[] {
  const rawEvents = roseGoldData.events;
  const count = eventCount ?? rawEvents.length;

  const beats: ReelBeat[] = [
    {
      id: "hero_gate",
      beatKey: "hero_gate",
      label: "Cinematic hero",
      durationMs: 7500,
      scrollTarget: '[data-reel-beat="hero_gate"]',
      waitForHeroReveal: true,
      thumbnailPoster: POSTERS.arch,
    },
    {
      id: "sacred_blessings",
      beatKey: "sacred_blessings",
      label: "Sacred blessings",
      durationMs: 5500,
      scrollTarget: '[data-reel-beat="sacred_blessings"]',
      thumbnailPoster: POSTERS.mandala,
    },
    {
      id: "muhurat",
      beatKey: "muhurat",
      label: "Muhurat",
      durationMs: 5000,
      scrollTarget: '[data-reel-beat="muhurat"]',
      autoRevealScratch: true,
      thumbnailPoster: POSTERS.lanterns,
    },
    {
      id: "countdown",
      beatKey: "countdown",
      label: "Countdown",
      durationMs: 4500,
      scrollTarget: '[data-reel-beat="countdown"]',
      thumbnailPoster: POSTERS.arch,
    },
    {
      id: "ceremony_intro",
      beatKey: "ceremony_intro",
      label: "Ceremonies",
      durationMs: 4200,
      scrollTarget: '[data-reel-beat="ceremony_intro"]',
      thumbnailPoster: POSTERS.lanterns,
    },
  ];

  for (let i = 0; i < count; i++) {
    beats.push({
      id: `ceremony_event_${i}`,
      beatKey: `ceremony_event_${i}`,
      label: rawEvents[i]?.name?.split(" ")[0] ?? `Event ${i + 1}`,
      durationMs: 4800,
      scrollTarget: `#ceremony-chapter-${i}`,
      thumbnailPoster: i % 2 === 0 ? POSTERS.lanterns : POSTERS.mandala,
    });
  }

  beats.push(
    {
      id: "gallery",
      beatKey: "gallery",
      label: "Gallery",
      durationMs: 5500,
      scrollTarget: '[data-reel-beat="gallery"]',
      thumbnailPoster: roseGoldData.gallery[0] ?? POSTERS.mandala,
    },
    {
      id: "venue",
      beatKey: "venue",
      label: "Venue",
      durationMs: 5500,
      scrollTarget: '[data-reel-beat="venue"]',
      thumbnailPoster: POSTERS.arch,
    },
    {
      id: "rsvp",
      beatKey: "rsvp",
      label: "RSVP",
      durationMs: 4800,
      scrollTarget: '[data-reel-beat="rsvp"]',
      thumbnailPoster: POSTERS.lanterns,
    },
    {
      id: "footer",
      beatKey: "footer",
      label: "Share",
      durationMs: 4500,
      scrollTarget: '[data-reel-beat="footer"]',
      thumbnailPoster: POSTERS.arch,
    }
  );

  return beats;
}

/** Rebuild beats when event count changes (customizer draft). */
export function buildRoseGoldBlushReelBeatsFromEvents(
  events: unknown[] | undefined | null
): ReelBeat[] {
  const len = Array.isArray(events) && events.length > 0 ? events.length : roseGoldData.events.length;
  return buildRoseGoldBlushReelBeats(len);
}
