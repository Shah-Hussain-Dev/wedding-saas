import prisma from "../lib/prisma";
import { TEMPLATE_META, type TemplateId } from "../lib/template-meta";
import {
  DEFAULT_PRICE_INR,
  DEFAULT_ORIGINAL_PRICE_INR,
  DEFAULT_DISCOUNT_NAME,
  DEFAULT_TEMPLATE_SORT_ORDER,
  DEFAULT_TEMPLATE_RELEASE_DATES,
} from "../lib/template-pricing";
import { TEMPLATE_POSTER_MAP } from "../lib/template-trailer";

async function main() {
  const ids = Object.keys(TEMPLATE_META) as TemplateId[];

  for (const id of ids) {
    const meta = TEMPLATE_META[id];
    const isPopular =
      meta.tag === "Best Seller" ||
      meta.tag === "Trending" ||
      meta.tag === "Awwwards Dreamscape" ||
      meta.tag === "Imperial Royale" ||
      id === "sheesh-mahal" ||
      id === "noor-e-nikah";

    const sortOrder = DEFAULT_TEMPLATE_SORT_ORDER[id] ?? 99;
    const coverImageUrl = TEMPLATE_POSTER_MAP[id] || `/templates/${id}/envelope-desktop.jpg`;
    const createdAt = new Date(DEFAULT_TEMPLATE_RELEASE_DATES[id] || "2026-01-01T00:00:00.000Z");

    await prisma.templateConfig.upsert({
      where: { id },
      update: {
        sortOrder,
        isPopular,
        coverImageUrl,
        createdAt,
      },
      create: {
        id,
        priceInr: DEFAULT_PRICE_INR,
        originalPriceInr: DEFAULT_ORIGINAL_PRICE_INR,
        discountPercent: 60,
        discountName: DEFAULT_DISCOUNT_NAME,
        isActive: true,
        isPopular,
        sortOrder,
        coverImageUrl,
        defaultsJson: {},
        marketingJson: {},
        createdAt,
      },
    });
  }

  console.log(`Successfully seeded/updated ${ids.length} template_configs in database.`);
}

main()
  .catch((e) => {
    console.error("Seed template configs error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
