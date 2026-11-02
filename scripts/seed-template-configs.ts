import prisma from "../lib/prisma";
import { TEMPLATE_META, type TemplateId } from "../lib/template-meta";
import { DEFAULT_PRICE_INR, DEFAULT_ORIGINAL_PRICE_INR, DEFAULT_DISCOUNT_NAME } from "../lib/template-pricing";

async function main() {
  const ids = Object.keys(TEMPLATE_META) as TemplateId[];

  for (const id of ids) {
    await prisma.templateConfig.upsert({
      where: { id },
      update: {},
      create: {
        id,
        priceInr: DEFAULT_PRICE_INR,
        originalPriceInr: DEFAULT_ORIGINAL_PRICE_INR,
        discountPercent: 60,
        discountName: DEFAULT_DISCOUNT_NAME,
        isActive: true,
        isPopular: false,
        defaultsJson: {},
        marketingJson: {},
      },
    });
  }

  console.log(`Seeded ${ids.length} template_configs rows.`);
}

main()
  .catch((e) => {
    console.error("Seed template configs error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
