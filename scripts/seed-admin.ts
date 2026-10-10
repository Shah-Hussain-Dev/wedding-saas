import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { siteConfig } from "../config/site";

async function main() {
  const adminEmail = siteConfig.admin.email;
  const adminPassword = "AdminPassword@123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: hashedPassword,
      name: "Master Administrator",
    },
    create: {
      email: adminEmail,
      name: "Master Administrator",
      passwordHash: hashedPassword,
    },
  });

  console.log("Admin user seeded successfully:", admin.email);
  console.log("Credentials:");
  console.log(`  Email: ${adminEmail}`);
  console.log("  Password: AdminPassword@123");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
