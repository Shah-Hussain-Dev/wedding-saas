import type {
  TemplateDefaultsCeremonies,
  TemplateDefaultsJson,
} from "@/lib/template-settings-types";

function normalizeId(templateId: string): string {
  return (templateId || "").trim().replace(/_/g, "-").toLowerCase();
}

/** Build customizer-shaped draft from admin form state for preview + save */
export function buildDefaultsJsonFromDraft(
  draft: Record<string, unknown>
): TemplateDefaultsJson {
  return {
    couple: {
      brideName: String(draft.brideName ?? ""),
      groomName: String(draft.groomName ?? ""),
      slug: typeof draft.slug === "string" ? draft.slug : undefined,
    },
    faith: {
      religion:
        draft.religion === "muslim" || draft.religion === "hindu" || draft.religion === "universal"
          ? draft.religion
          : undefined,
      sacredInvocation: String(draft.sacredInvocation ?? ""),
      sacredVerse: String(draft.sacredVerse ?? ""),
      sacredTranslation: String(draft.sacredTranslation ?? ""),
    },
    dateVenue: {
      weddingDate: String(draft.weddingDate ?? ""),
      weddingTime: String(draft.weddingTime ?? ""),
      venueName: String(draft.venueName ?? ""),
      venueAddress: String(draft.venueAddress ?? ""),
      venueLat: typeof draft.venueLat === "number" ? draft.venueLat : undefined,
      venueLng: typeof draft.venueLng === "number" ? draft.venueLng : undefined,
    },
    ceremonies: {
      eventsJson: Array.isArray(draft.eventsJson)
        ? (draft.eventsJson as TemplateDefaultsCeremonies["eventsJson"])
        : Array.isArray(draft.events)
          ? (draft.events as TemplateDefaultsCeremonies["eventsJson"])
          : [],
    },
    media: {
      heroImageUrl: String(draft.heroImageUrl ?? ""),
      slideshowImages: Array.isArray(draft.slideshowImages)
        ? (draft.slideshowImages as string[])
        : [],
      musicTrack: String(draft.musicTrack ?? ""),
    },
    optional: {
      showDressCode: Boolean(draft.showDressCode),
      dressCodeText: String(draft.dressCodeText ?? ""),
      showTransport: Boolean(draft.showTransport),
      transportText: String(draft.transportText ?? ""),
    },
  };
}

export function buildAdminPreviewPayload(
  templateId: string,
  draft: Record<string, unknown>
): Record<string, unknown> {
  const id = normalizeId(templateId);
  return {
    id: `admin-preview-${id}`,
    templateId: id,
    slug: draft.slug ?? "demo-couple",
    ...draft,
    updatedAt: new Date().toISOString(),
  };
}
