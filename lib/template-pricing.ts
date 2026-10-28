import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { TEMPLATE_META, TemplateId } from "@/lib/template-meta";

export interface TemplatePricingConfig {
  id: string;
  name: string;
  category: string;
  style: string;
  priceInr: number; // Selling / discounted price (e.g. 1199)
  originalPriceInr: number; // Original MRP / strikethrough price (e.g. 2999)
  discountPercent: number; // Calculated or explicit discount rate (e.g. 60)
  discountName: string; // Campaign / discount label (e.g. "Early Bird Launch")
  priceFormatted: string; // "₹1,199"
  originalPriceFormatted: string; // "₹2,999"
  savingsAmountInr: number; // 1800
  savingsFormatted: string; // "₹1,800"
  isOnSale: boolean; // true if originalPriceInr > priceInr
  isActive: boolean;
  isPopular?: boolean;
  tag?: string;
  gradient?: string;
}

export interface CachedTemplateConfig {
  priceInr: number;
  originalPriceInr?: number;
  discountPercent?: number;
  discountName?: string;
  isActive: boolean;
  isPopular?: boolean;
}

export const DEFAULT_PRICE_INR = 1199;
export const DEFAULT_ORIGINAL_PRICE_INR = 2999;
export const DEFAULT_DISCOUNT_NAME = "Wedding Season Offer";

// In-memory cache for fast reads
let memoryPriceCache: Record<string, CachedTemplateConfig> = {};
let isCacheLoaded = false;

const DATA_FILE_PATH = path.join(process.cwd(), "data", "template-prices.json");

function ensureDataDirectory() {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (_) {}
}

function loadPricesFromFile(): Record<string, CachedTemplateConfig> {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, "utf8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("Could not read template prices from file:", err);
  }
  return {};
}

function savePricesToFile(data: Record<string, CachedTemplateConfig>) {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not write template prices to file:", err);
  }
}

/**
 * Builds the full ecommerce pricing object with calculated discounts and formatted values
 */
export function buildTemplatePricingConfig(
  id: TemplateId | string,
  cached?: CachedTemplateConfig
): TemplatePricingConfig {
  const normalizedId = id.replace(/_/g, "-").toLowerCase();
  const meta = TEMPLATE_META[normalizedId as TemplateId] || {
    name: normalizedId,
    religionLabel: "Universal",
    style: "Luxury Wedding",
    tag: undefined,
    gradient: undefined,
  };

  const priceInr = cached?.priceInr !== undefined ? cached.priceInr : DEFAULT_PRICE_INR;
  
  // Resolve original price: if not explicitly set, default to 2999 or double the selling price
  const originalPriceInr =
    cached?.originalPriceInr && cached.originalPriceInr > 0
      ? cached.originalPriceInr
      : Math.max(DEFAULT_ORIGINAL_PRICE_INR, Math.round(priceInr * 2.2));

  // Auto-calculate discount percentage if original price > priceInr
  const computedPercent =
    originalPriceInr > priceInr
      ? Math.round(((originalPriceInr - priceInr) / originalPriceInr) * 100)
      : 0;

  const discountPercent =
    cached?.discountPercent !== undefined && cached.discountPercent >= 0
      ? cached.discountPercent
      : computedPercent;

  const discountName =
    cached?.discountName && cached.discountName.trim().length > 0
      ? cached.discountName
      : discountPercent > 0
      ? `${discountPercent}% OFF Launch Deal`
      : "Standard Price";

  const savingsAmountInr = Math.max(0, originalPriceInr - priceInr);
  const isOnSale = originalPriceInr > priceInr && priceInr > 0;
  const isActive = cached?.isActive ?? true;
  const isPopular = cached?.isPopular ?? (meta.tag === "Best Seller" || meta.tag === "Trending");

  return {
    id: normalizedId,
    name: meta.name,
    category: meta.religionLabel,
    style: meta.style,
    priceInr,
    originalPriceInr,
    discountPercent,
    discountName,
    priceFormatted: `₹${priceInr.toLocaleString("en-IN")}`,
    originalPriceFormatted: `₹${originalPriceInr.toLocaleString("en-IN")}`,
    savingsAmountInr,
    savingsFormatted: `₹${savingsAmountInr.toLocaleString("en-IN")}`,
    isOnSale,
    isActive,
    isPopular,
    tag: meta.tag,
    gradient: meta.gradient,
  };
}

export async function getAllTemplatesWithPricing(): Promise<TemplatePricingConfig[]> {
  // 1. Load from file backup first
  const fileData = loadPricesFromFile();
  memoryPriceCache = { ...fileData, ...memoryPriceCache };

  // 2. Query database for live persistent pricing (e.g. Supabase)
  try {
    if ((prisma as any).templateConfig) {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB query timed out")), 2500)
      );
      const dbConfigs = (await Promise.race([
        (prisma as any).templateConfig.findMany(),
        timeoutPromise,
      ]).catch(() => null)) as any[];

      if (Array.isArray(dbConfigs) && dbConfigs.length > 0) {
        dbConfigs.forEach((cfg: any) => {
          memoryPriceCache[cfg.id] = {
            priceInr: cfg.priceInr ?? DEFAULT_PRICE_INR,
            originalPriceInr: cfg.originalPriceInr ?? DEFAULT_ORIGINAL_PRICE_INR,
            discountPercent: cfg.discountPercent ?? 60,
            discountName: cfg.discountName ?? DEFAULT_DISCOUNT_NAME,
            isActive: cfg.isActive !== false,
            isPopular: cfg.isPopular || false,
          };
        });
        // Keep file backup in sync with database
        savePricesToFile(memoryPriceCache);
      }
    }
  } catch (err) {
    console.warn("Could not query templateConfig from DB, using file cache:", err);
  }

  isCacheLoaded = true;

  // 3. Map all templates from TEMPLATE_META
  const templateIds = Object.keys(TEMPLATE_META) as TemplateId[];

  return templateIds.map((id) => {
    const cached = memoryPriceCache[id];
    return buildTemplatePricingConfig(id, cached);
  });
}

export async function getTemplatePriceInr(templateId: string): Promise<number> {
  const normalizedId = templateId.replace(/_/g, "-").toLowerCase();
  
  // Try database lookup first for freshest price
  try {
    if ((prisma as any).templateConfig) {
      const cfg = await (prisma as any).templateConfig.findUnique({
        where: { id: normalizedId },
      });
      if (cfg && cfg.priceInr !== undefined && cfg.priceInr !== null) {
        memoryPriceCache[normalizedId] = {
          priceInr: cfg.priceInr,
          originalPriceInr: cfg.originalPriceInr ?? DEFAULT_ORIGINAL_PRICE_INR,
          discountPercent: cfg.discountPercent ?? 60,
          discountName: cfg.discountName ?? DEFAULT_DISCOUNT_NAME,
          isActive: cfg.isActive !== false,
          isPopular: cfg.isPopular || false,
        };
        return cfg.priceInr;
      }
    }
  } catch (_) {}

  if (memoryPriceCache[normalizedId]?.priceInr !== undefined) {
    return memoryPriceCache[normalizedId].priceInr;
  }

  const fileData = loadPricesFromFile();
  if (fileData[normalizedId]?.priceInr !== undefined) {
    memoryPriceCache[normalizedId] = fileData[normalizedId];
    return fileData[normalizedId].priceInr;
  }

  const all = await getAllTemplatesWithPricing();
  const found = all.find((t) => t.id === normalizedId);
  return found?.priceInr ?? DEFAULT_PRICE_INR;
}

export async function getTemplatePricingConfig(templateId: string): Promise<TemplatePricingConfig> {
  const normalizedId = templateId.replace(/_/g, "-").toLowerCase();
  if (!isCacheLoaded) {
    await getAllTemplatesWithPricing();
  }
  return buildTemplatePricingConfig(normalizedId, memoryPriceCache[normalizedId]);
}

export async function updateTemplatePrice(
  templateId: string,
  priceInr: number,
  options?: {
    originalPriceInr?: number;
    discountPercent?: number;
    discountName?: string;
    isActive?: boolean;
    isPopular?: boolean;
  }
): Promise<TemplatePricingConfig> {
  const normalizedId = templateId.replace(/_/g, "-").toLowerCase();
  const safePrice = Math.max(0, Math.round(Number(priceInr) ?? DEFAULT_PRICE_INR));

  const existing = memoryPriceCache[normalizedId] || {
    priceInr: DEFAULT_PRICE_INR,
    originalPriceInr: DEFAULT_ORIGINAL_PRICE_INR,
    discountPercent: 60,
    discountName: DEFAULT_DISCOUNT_NAME,
    isActive: true,
  };

  const safeOriginalPrice =
    options?.originalPriceInr !== undefined
      ? Math.max(0, Math.round(Number(options.originalPriceInr)))
      : (existing.originalPriceInr ?? DEFAULT_ORIGINAL_PRICE_INR);

  const computedDiscountPercent =
    safeOriginalPrice > safePrice
      ? Math.round(((safeOriginalPrice - safePrice) / safeOriginalPrice) * 100)
      : 0;

  const safeDiscountPercent =
    options?.discountPercent !== undefined
      ? Math.max(0, Math.min(100, Math.round(Number(options.discountPercent))))
      : (existing.discountPercent ?? computedDiscountPercent);

  const safeDiscountName =
    options?.discountName !== undefined
      ? options.discountName.trim()
      : (existing.discountName || DEFAULT_DISCOUNT_NAME);

  const updated: CachedTemplateConfig = {
    priceInr: safePrice,
    originalPriceInr: safeOriginalPrice,
    discountPercent: safeDiscountPercent,
    discountName: safeDiscountName,
    isActive: options?.isActive !== undefined ? options.isActive : existing.isActive,
    isPopular: options?.isPopular !== undefined ? options.isPopular : existing.isPopular,
  };

  // Update in-memory cache
  memoryPriceCache[normalizedId] = updated;

  // Save to file backup immediately
  savePricesToFile(memoryPriceCache);

  // Save to Supabase PostgreSQL database table (graceful async error handling)
  try {
    if ((prisma as any).templateConfig) {
      await (prisma as any).templateConfig.upsert({
        where: { id: normalizedId },
        update: {
          priceInr: safePrice,
          originalPriceInr: safeOriginalPrice,
          discountPercent: safeDiscountPercent,
          discountName: safeDiscountName,
          isActive: updated.isActive,
          isPopular: updated.isPopular,
        },
        create: {
          id: normalizedId,
          priceInr: safePrice,
          originalPriceInr: safeOriginalPrice,
          discountPercent: safeDiscountPercent,
          discountName: safeDiscountName,
          isActive: updated.isActive,
          isPopular: updated.isPopular,
        },
      });
      console.log(
        `[Pricing] Successfully persisted template ${normalizedId} (Selling: ₹${safePrice}, MRP: ₹${safeOriginalPrice}, ${safeDiscountPercent}% OFF "${safeDiscountName}")`
      );
    }
  } catch (dbErr) {
    console.warn("Could not save price to DB table (safely cached in memory & file):", dbErr);
  }

  return buildTemplatePricingConfig(normalizedId, updated);
}

export async function bulkUpdateTemplatePricing(options: {
  templateIds?: string[];
  priceInr?: number;
  originalPriceInr?: number;
  discountPercent?: number;
  discountName?: string;
  isActive?: boolean;
}): Promise<TemplatePricingConfig[]> {
  const allIds =
    options.templateIds && options.templateIds.length > 0
      ? options.templateIds
      : (Object.keys(TEMPLATE_META) as string[]);

  const results: TemplatePricingConfig[] = [];
  for (const rawId of allIds) {
    const id = rawId.replace(/_/g, "-").toLowerCase();
    const existing = memoryPriceCache[id] || {
      priceInr: DEFAULT_PRICE_INR,
      originalPriceInr: DEFAULT_ORIGINAL_PRICE_INR,
      discountPercent: 60,
      discountName: DEFAULT_DISCOUNT_NAME,
      isActive: true,
    };

    const effectiveOriginalPrice =
      options.originalPriceInr !== undefined
        ? options.originalPriceInr
        : (existing.originalPriceInr ?? DEFAULT_ORIGINAL_PRICE_INR);

    let effectivePrice = existing.priceInr;
    if (options.priceInr !== undefined) {
      effectivePrice = options.priceInr;
    } else if (options.discountPercent !== undefined) {
      effectivePrice = Math.round(effectiveOriginalPrice * (1 - options.discountPercent / 100));
    }

    const updated = await updateTemplatePrice(id, effectivePrice, {
      originalPriceInr: effectiveOriginalPrice,
      discountPercent: options.discountPercent,
      discountName: options.discountName,
      isActive: options.isActive,
    });
    results.push(updated);
  }

  return results;
}
