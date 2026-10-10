require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set in .env");
    return;
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const adminEmail = "support@wedinvites.in";
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

  console.log("------------------------------------------");
  console.log("Admin account configured successfully!");
  console.log("Email:    support@wedinvites.in");
  console.log("Password: AdminPassword@123");
  console.log("User ID: ", admin.id);
  console.log("------------------------------------------");

  await prisma.$disconnect();
  await pool.end();
}

main().catch((err) => {
  console.error("Seed error:", err);
});
