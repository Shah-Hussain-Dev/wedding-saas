/** Shared types for template settings — safe to import from client components. */

export interface TemplateDefaultsCouple {
  brideName?: string;
  groomName?: string;
  slug?: string;
}

export interface TemplateDefaultsFaith {
  religion?: "muslim" | "hindu" | "universal";
  sacredInvocation?: string;
  sacredVerse?: string;
  sacredTranslation?: string;
}

export interface TemplateDefaultsDateVenue {
  weddingDate?: string;
  weddingTime?: string;
  venueName?: string;
  venueAddress?: string;
  venueLat?: number;
  venueLng?: number;
}

export interface TemplateDefaultsCeremonies {
  eventsJson?: Array<{
    name: string;
    enabled: boolean;
    venue: string;
    date: string;
    time: string;
  }>;
}

export interface TemplateDefaultsMedia {
  heroImageUrl?: string;
  slideshowImages?: string[];
  musicTrack?: string;
}

export interface TemplateDefaultsOptional {
  showDressCode?: boolean;
  dressCodeText?: string;
  showTransport?: boolean;
  transportText?: string;
}

export interface TemplateDefaultsJson {
  couple?: TemplateDefaultsCouple;
  faith?: TemplateDefaultsFaith;
  dateVenue?: TemplateDefaultsDateVenue;
  ceremonies?: TemplateDefaultsCeremonies;
  media?: TemplateDefaultsMedia;
  optional?: TemplateDefaultsOptional;
  advanced?: Record<string, unknown>;
}

export interface TemplateMarketingJson {
  descriptionOverride?: string;
  sortWeight?: number;
  isFeatured?: boolean;
}

export interface TemplateSettingsRecord {
  id: string;
  coverImageUrl: string | null;
  trailerVideoUrl: string | null;
  defaultMusicTrack: string | null;
  defaultsJson: TemplateDefaultsJson;
  marketingJson: TemplateMarketingJson;
  updatedBy: string | null;
  updatedAt: string | null;
}

export interface TemplateCatalogEntry {
  id: string;
  name: string;
  style: string;
  coverImageUrl: string;
  trailerVideoUrl: string;
  defaultMusicTrack: string;
  hasCustomDefaults: boolean;
  priceInr: number;
  priceFormatted: string;
  originalPriceFormatted: string;
  isActive: boolean;
}
