import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { TEMPLATE_META, TemplateId } from "@/lib/template-meta";

export interface TemplatePricingConfig {
  id: string;
  name: string;
  category: string;
  style: string;
  priceInr: number;
  priceFormatted: string;
  isActive: boolean;
  isPopular?: boolean;
  tag?: string;
  gradient?: string;
}

const DEFAULT_PRICE_INR = 1199;

// In-memory cache for fast reads
let memoryPriceCache: Record<string, { priceInr: number; isActive: boolean; isPopular?: boolean }> = {};
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

function loadPricesFromFile(): Record<string, { priceInr: number; isActive: boolean; isPopular?: boolean }> {
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

function savePricesToFile(data: Record<string, { priceInr: number; isActive: boolean; isPopular?: boolean }>) {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not write template prices to file:", err);
  }
}

export async function getAllTemplatesWithPricing(): Promise<TemplatePricingConfig[]> {
  // 1. Try to load from database or file
  if (!isCacheLoaded) {
    const fileData = loadPricesFromFile();
    memoryPriceCache = { ...fileData };

    try {
      if ((prisma as any).templateConfig) {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("DB query timed out")), 2000)
        );
        const dbConfigs = (await Promise.race([
          (prisma as any).templateConfig.findMany(),
          timeoutPromise,
        ]).catch(() => null)) as any[];

        if (Array.isArray(dbConfigs)) {
          dbConfigs.forEach((cfg: any) => {
            memoryPriceCache[cfg.id] = {
              priceInr: cfg.priceInr || DEFAULT_PRICE_INR,
              isActive: cfg.isActive !== false,
              isPopular: cfg.isPopular || false,
            };
          });
        }
      }
    } catch (_) {}

    isCacheLoaded = true;
  }

  // 2. Map all templates from TEMPLATE_META
  const templateIds = Object.keys(TEMPLATE_META) as TemplateId[];

  return templateIds.map((id) => {
    const meta = TEMPLATE_META[id];
    const cached = memoryPriceCache[id];
    const priceInr = cached?.priceInr ?? DEFAULT_PRICE_INR;
    const isActive = cached?.isActive ?? true;
    const isPopular = cached?.isPopular ?? (meta.tag === "Best Seller" || meta.tag === "Trending");

    return {
      id,
      name: meta.name,
      category: meta.religionLabel,
      style: meta.style,
      priceInr,
      priceFormatted: `₹${priceInr.toLocaleString("en-IN")}`,
      isActive,
      isPopular,
      tag: meta.tag,
      gradient: meta.gradient,
    };
  });
}

export async function getTemplatePriceInr(templateId: string): Promise<number> {
  const normalizedId = templateId.replace(/_/g, "-").toLowerCase();
  
  if (memoryPriceCache[normalizedId]?.priceInr) {
    return memoryPriceCache[normalizedId].priceInr;
  }

  const all = await getAllTemplatesWithPricing();
  const found = all.find((t) => t.id === normalizedId);
  return found?.priceInr ?? DEFAULT_PRICE_INR;
}

export async function updateTemplatePrice(
  templateId: string,
  priceInr: number,
  options?: { isActive?: boolean; isPopular?: boolean }
): Promise<TemplatePricingConfig> {
  const normalizedId = templateId.replace(/_/g, "-").toLowerCase();
  const safePrice = Math.max(0, Math.round(Number(priceInr) || DEFAULT_PRICE_INR));

  const existing = memoryPriceCache[normalizedId] || {
    priceInr: DEFAULT_PRICE_INR,
    isActive: true,
  };

  const updated = {
    priceInr: safePrice,
    isActive: options?.isActive !== undefined ? options.isActive : existing.isActive,
    isPopular: options?.isPopular !== undefined ? options.isPopular : existing.isPopular,
  };

  // Update in-memory cache
  memoryPriceCache[normalizedId] = updated;

  // Save to file for persistence across server restarts
  savePricesToFile(memoryPriceCache);

  // Try to update database if table exists with safety timeout
  try {
    if ((prisma as any).templateConfig) {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB save timed out")), 2000)
      );
      await Promise.race([
        (prisma as any).templateConfig.upsert({
          where: { id: normalizedId },
          update: {
            priceInr: safePrice,
            isActive: updated.isActive,
            isPopular: updated.isPopular,
          },
          create: {
            id: normalizedId,
            priceInr: safePrice,
            isActive: updated.isActive,
            isPopular: updated.isPopular,
          },
        }),
        timeoutPromise,
      ]).catch(() => null);
    }
  } catch (dbErr) {
    console.warn("Could not save price to DB table (using file backup):", dbErr);
  }

  const meta = TEMPLATE_META[normalizedId as TemplateId] || {
    name: normalizedId,
    religionLabel: "Universal",
    style: "Luxury Wedding",
  };

  return {
    id: normalizedId,
    name: meta.name,
    category: meta.religionLabel,
    style: meta.style,
    priceInr: safePrice,
    priceFormatted: `₹${safePrice.toLocaleString("en-IN")}`,
    isActive: updated.isActive,
    isPopular: updated.isPopular,
  };
}
