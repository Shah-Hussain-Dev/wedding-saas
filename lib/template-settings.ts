import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { getTemplateDefaultData } from "@/templates";
import {
  getTemplatePosterUrl,
  getTemplateTrailerUrlOrEmpty,
} from "@/lib/template-trailer";
import { TEMPLATE_META, type TemplateId } from "@/lib/template-meta";
import {
  buildTemplatePricingConfig,
  getAllTemplatesWithPricing,
  type TemplatePricingConfig,
} from "@/lib/template-pricing";

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

const DATA_FILE_PATH = path.join(process.cwd(), "data", "template-settings.json");

let memorySettingsCache: Record<string, TemplateSettingsRecord> = {};
let isSettingsCacheLoaded = false;

function normalizeId(templateId: string): string {
  return (templateId || "").trim().replace(/_/g, "-").toLowerCase();
}

function ensureDataDirectory() {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (_) {}
}

function loadSettingsFromFile(): Record<string, TemplateSettingsRecord> {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, "utf8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("Could not read template settings from file:", err);
  }
  return {};
}

function saveSettingsToFile(data: Record<string, TemplateSettingsRecord>) {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not write template settings to file:", err);
  }
}

function hasMeaningfulDefaults(defaultsJson: TemplateDefaultsJson): boolean {
  if (!defaultsJson || typeof defaultsJson !== "object") return false;
  return Object.keys(defaultsJson).some((key) => {
    const val = (defaultsJson as Record<string, unknown>)[key];
    if (val == null) return false;
    if (typeof val === "object" && !Array.isArray(val)) {
      return Object.keys(val as object).length > 0;
    }
    return true;
  });
}

function mapCodeDefaultToFlat(codeDefault: Record<string, unknown>): Record<string, unknown> {
  const couple = codeDefault.couple as Record<string, string> | undefined;
  const venue = codeDefault.venue as Record<string, string> | undefined;
  const sacred = codeDefault.sacred as Record<string, string> | undefined;
  const events = codeDefault.events as Array<Record<string, unknown>> | undefined;

  const weddingDateRaw = codeDefault.weddingDate;
  let weddingDate = "2026-12-22";
  if (typeof weddingDateRaw === "string") {
    weddingDate = weddingDateRaw.split("T")[0];
  }

  const religionRaw = codeDefault.religion;
  const religion =
    religionRaw === "muslim" || religionRaw === "hindu" || religionRaw === "universal"
      ? religionRaw
      : "universal";

  const eventsJson = Array.isArray(events)
    ? events.map((ev) => ({
        name: String(ev.name ?? "Event"),
        enabled: ev.enabled !== false,
        venue: String(ev.venue ?? ""),
        date: String(ev.date ?? ""),
        time: String(ev.time ?? ""),
      }))
    : [];

  const dressCode = codeDefault.dressCode as Record<string, unknown> | undefined;

  return {
    templateId: codeDefault.templateId,
    brideName: codeDefault.brideName ?? couple?.brideName ?? "",
    groomName: codeDefault.groomName ?? couple?.groomName ?? "",
    weddingDate,
    weddingTime: String(codeDefault.weddingTime ?? "06:30 PM onwards"),
    venueName: codeDefault.venueName ?? venue?.name ?? "",
    venueAddress: codeDefault.venueAddress ?? venue?.address ?? "",
    religion,
    sacredInvocation:
      codeDefault.sacredInvocation ??
      sacred?.bismillah ??
      sacred?.invocation ??
      "",
    sacredVerse: codeDefault.sacredVerse ?? sacred?.surahArRum ?? sacred?.surahVerse ?? "",
    sacredTranslation:
      codeDefault.sacredTranslation ??
      sacred?.bismillahTranslation ??
      sacred?.propheticDuaTranslation ??
      "",
    heroImageUrl: String(codeDefault.heroImageUrl ?? ""),
    slideshowImages: Array.isArray(codeDefault.slideshowImages)
      ? codeDefault.slideshowImages
      : Array.isArray(codeDefault.gallery)
        ? codeDefault.gallery
        : [],
    musicTrack:
      String(codeDefault.musicTrack ?? "") ||
      `/templates/${String(codeDefault.templateId ?? "noor-e-nikah")}/music.mp3`,
    eventsJson,
    events: eventsJson,
    showDressCode: Boolean(codeDefault.showDressCode ?? dressCode),
    dressCodeText: String(codeDefault.dressCodeText ?? dressCode?.description ?? ""),
    showTransport: Boolean(codeDefault.showTransport),
    transportText: String(codeDefault.transportText ?? ""),
  };
}

function applyDefaultsJson(
  base: Record<string, unknown>,
  defaultsJson: TemplateDefaultsJson,
  defaultMusicTrack: string | null
): Record<string, unknown> {
  const out = { ...base };

  if (defaultsJson.couple) {
    if (defaultsJson.couple.brideName) out.brideName = defaultsJson.couple.brideName;
    if (defaultsJson.couple.groomName) out.groomName = defaultsJson.couple.groomName;
    if (defaultsJson.couple.slug) out.slug = defaultsJson.couple.slug;
  }

  if (defaultsJson.faith) {
    if (defaultsJson.faith.religion) out.religion = defaultsJson.faith.religion;
    if (defaultsJson.faith.sacredInvocation !== undefined) {
      out.sacredInvocation = defaultsJson.faith.sacredInvocation;
    }
    if (defaultsJson.faith.sacredVerse !== undefined) out.sacredVerse = defaultsJson.faith.sacredVerse;
    if (defaultsJson.faith.sacredTranslation !== undefined) {
      out.sacredTranslation = defaultsJson.faith.sacredTranslation;
    }
  }

  if (defaultsJson.dateVenue) {
    const dv = defaultsJson.dateVenue;
    if (dv.weddingDate) out.weddingDate = dv.weddingDate.split("T")[0];
    if (dv.weddingTime) out.weddingTime = dv.weddingTime;
    if (dv.venueName) out.venueName = dv.venueName;
    if (dv.venueAddress) out.venueAddress = dv.venueAddress;
    if (dv.venueLat !== undefined) out.venueLat = dv.venueLat;
    if (dv.venueLng !== undefined) out.venueLng = dv.venueLng;
  }

  if (defaultsJson.ceremonies?.eventsJson?.length) {
    out.eventsJson = defaultsJson.ceremonies.eventsJson;
    out.events = defaultsJson.ceremonies.eventsJson;
  }

  if (defaultsJson.media) {
    if (defaultsJson.media.heroImageUrl !== undefined) out.heroImageUrl = defaultsJson.media.heroImageUrl;
    if (defaultsJson.media.slideshowImages) {
      out.slideshowImages = defaultsJson.media.slideshowImages;
      out.gallery = defaultsJson.media.slideshowImages;
    }
    if (defaultsJson.media.musicTrack) out.musicTrack = defaultsJson.media.musicTrack;
  }

  const music =
    defaultMusicTrack?.trim() ||
    defaultsJson.media?.musicTrack?.trim() ||
    String(out.musicTrack ?? "");
  if (music) out.musicTrack = music;

  if (defaultsJson.optional) {
    const opt = defaultsJson.optional;
    if (opt.showDressCode !== undefined) out.showDressCode = opt.showDressCode;
    if (opt.dressCodeText !== undefined) out.dressCodeText = opt.dressCodeText;
    if (opt.showTransport !== undefined) out.showTransport = opt.showTransport;
    if (opt.transportText !== undefined) out.transportText = opt.transportText;
  }

  if (defaultsJson.advanced && typeof defaultsJson.advanced === "object") {
    Object.assign(out, defaultsJson.advanced);
  }

  return out;
}

function dbRowToSettings(row: {
  id: string;
  coverImageUrl?: string | null;
  trailerVideoUrl?: string | null;
  defaultMusicTrack?: string | null;
  defaultsJson?: unknown;
  marketingJson?: unknown;
  updatedBy?: string | null;
  updatedAt?: Date;
}): TemplateSettingsRecord {
  return {
    id: row.id,
    coverImageUrl: row.coverImageUrl ?? null,
    trailerVideoUrl: row.trailerVideoUrl ?? null,
    defaultMusicTrack: row.defaultMusicTrack ?? null,
    defaultsJson: (row.defaultsJson as TemplateDefaultsJson) ?? {},
    marketingJson: (row.marketingJson as TemplateMarketingJson) ?? {},
    updatedBy: row.updatedBy ?? null,
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
  };
}

export async function loadAllTemplateSettings(): Promise<Record<string, TemplateSettingsRecord>> {
  if (isSettingsCacheLoaded && Object.keys(memorySettingsCache).length > 0) {
    return memorySettingsCache;
  }

  const fileData = loadSettingsFromFile();
  memorySettingsCache = { ...fileData };

  try {
    const rows = await prisma.templateConfig.findMany({
      select: {
        id: true,
        coverImageUrl: true,
        trailerVideoUrl: true,
        defaultMusicTrack: true,
        defaultsJson: true,
        marketingJson: true,
        updatedBy: true,
        updatedAt: true,
      },
    });
    rows.forEach((row) => {
      memorySettingsCache[row.id] = dbRowToSettings(row);
    });
    saveSettingsToFile(memorySettingsCache);
  } catch (err) {
    console.warn("Could not load template settings from DB:", err);
  }

  isSettingsCacheLoaded = true;
  return memorySettingsCache;
}

export function invalidateTemplateSettingsCache() {
  isSettingsCacheLoaded = false;
  memorySettingsCache = {};
}

export async function getTemplateSettingsFromDb(
  templateId: string
): Promise<TemplateSettingsRecord | null> {
  const id = normalizeId(templateId);
  const all = await loadAllTemplateSettings();
  return all[id] ?? null;
}

export function getTemplateCoverUrlSync(templateId: string): string {
  const id = normalizeId(templateId);
  const cached = memorySettingsCache[id];
  if (cached?.coverImageUrl?.trim()) return cached.coverImageUrl.trim();
  return getTemplatePosterUrl(id);
}

export async function getTemplateCoverUrl(templateId: string): Promise<string> {
  await loadAllTemplateSettings();
  return getTemplateCoverUrlSync(templateId);
}

export async function getTemplateTrailerUrlResolved(templateId: string): Promise<string> {
  const id = normalizeId(templateId);
  await loadAllTemplateSettings();
  const cached = memorySettingsCache[id];
  if (cached?.trailerVideoUrl?.trim()) return cached.trailerVideoUrl.trim();
  return getTemplateTrailerUrlOrEmpty(id);
}

export async function getResolvedTemplateDefaults(
  templateId: string
): Promise<Record<string, unknown>> {
  const id = normalizeId(templateId);
  const codeDefault = getTemplateDefaultData(id) as Record<string, unknown>;
  const base = mapCodeDefaultToFlat(codeDefault);
  base.templateId = id;

  const settings = await getTemplateSettingsFromDb(id);
  if (!settings) return base;

  return applyDefaultsJson(base, settings.defaultsJson ?? {}, settings.defaultMusicTrack);
}

export async function getAllTemplateCatalogEntries(): Promise<Record<string, TemplateCatalogEntry>> {
  const [settingsMap, pricingList] = await Promise.all([
    loadAllTemplateSettings(),
    getAllTemplatesWithPricing(),
  ]);

  const pricingById = pricingList.reduce(
    (acc, p) => {
      acc[p.id] = p;
      return acc;
    },
    {} as Record<string, TemplatePricingConfig>
  );

  const ids = Object.keys(TEMPLATE_META) as TemplateId[];
  const catalog: Record<string, TemplateCatalogEntry> = {};

  for (const id of ids) {
    const meta = TEMPLATE_META[id];
    const settings = settingsMap[id];
    const pricing = pricingById[id];
    const coverImageUrl = settings?.coverImageUrl?.trim() || getTemplatePosterUrl(id);
    const trailerVideoUrl =
      settings?.trailerVideoUrl?.trim() || getTemplateTrailerUrlOrEmpty(id);
    const defaultMusicTrack =
      settings?.defaultMusicTrack?.trim() ||
      String(getTemplateDefaultData(id)?.musicTrack ?? `/templates/${id}/music.mp3`);

    catalog[id] = {
      id,
      name: meta.name,
      style: meta.style,
      coverImageUrl,
      trailerVideoUrl,
      defaultMusicTrack,
      hasCustomDefaults: hasMeaningfulDefaults(settings?.defaultsJson ?? {}),
      priceInr: pricing?.priceInr ?? 1199,
      priceFormatted: pricing?.priceFormatted ?? "₹1,199",
      originalPriceFormatted: pricing?.originalPriceFormatted ?? "₹2,999",
      isActive: pricing?.isActive ?? true,
    };
  }

  return catalog;
}

export interface TemplateSettingsUpdatePatch {
  coverImageUrl?: string | null;
  trailerVideoUrl?: string | null;
  defaultMusicTrack?: string | null;
  defaultsJson?: TemplateDefaultsJson;
  marketingJson?: TemplateMarketingJson;
}

export async function updateTemplateSettings(
  templateId: string,
  patch: TemplateSettingsUpdatePatch,
  adminEmail?: string
): Promise<TemplateSettingsRecord> {
  const id = normalizeId(templateId);
  const existing = (await getTemplateSettingsFromDb(id)) ?? {
    id,
    coverImageUrl: null,
    trailerVideoUrl: null,
    defaultMusicTrack: null,
    defaultsJson: {},
    marketingJson: {},
    updatedBy: null,
    updatedAt: null,
  };

  const merged: TemplateSettingsRecord = {
    ...existing,
    coverImageUrl:
      patch.coverImageUrl !== undefined ? patch.coverImageUrl : existing.coverImageUrl,
    trailerVideoUrl:
      patch.trailerVideoUrl !== undefined ? patch.trailerVideoUrl : existing.trailerVideoUrl,
    defaultMusicTrack:
      patch.defaultMusicTrack !== undefined ? patch.defaultMusicTrack : existing.defaultMusicTrack,
    defaultsJson: patch.defaultsJson ?? existing.defaultsJson,
    marketingJson: patch.marketingJson ?? existing.marketingJson,
    updatedBy: adminEmail ?? existing.updatedBy,
    updatedAt: new Date().toISOString(),
  };

  memorySettingsCache[id] = merged;
  saveSettingsToFile(memorySettingsCache);
  invalidateTemplateSettingsCache();
  memorySettingsCache[id] = merged;
  isSettingsCacheLoaded = true;

  try {
    await prisma.templateConfig.upsert({
      where: { id },
      update: {
        coverImageUrl: merged.coverImageUrl,
        trailerVideoUrl: merged.trailerVideoUrl,
        defaultMusicTrack: merged.defaultMusicTrack,
        defaultsJson: merged.defaultsJson as object,
        marketingJson: merged.marketingJson as object,
        updatedBy: merged.updatedBy,
      },
      create: {
        id,
        priceInr: 1199,
        originalPriceInr: 2999,
        discountPercent: 60,
        discountName: "Launch Offer",
        isActive: true,
        coverImageUrl: merged.coverImageUrl,
        trailerVideoUrl: merged.trailerVideoUrl,
        defaultMusicTrack: merged.defaultMusicTrack,
        defaultsJson: merged.defaultsJson as object,
        marketingJson: merged.marketingJson as object,
        updatedBy: merged.updatedBy,
      },
    });
  } catch (err) {
    console.warn("Could not persist template settings to DB:", err);
  }

  return merged;
}

/** Build customizer-shaped draft from admin form state for preview + save */
export function buildDefaultsJsonFromDraft(draft: Record<string, unknown>): TemplateDefaultsJson {
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
