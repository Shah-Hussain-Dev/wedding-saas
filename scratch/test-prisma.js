const { PrismaClient } = require("@prisma/client");
try {
  const p = new PrismaClient();
  console.log("Standard PrismaClient instantiated successfully!");
} catch (e) {
  console.error("Standard PrismaClient error:", e);
}

try {
  const { PrismaPg } = require("@prisma/adapter-pg");
  const { Pool } = require("pg");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/test" });
  const adapter = new PrismaPg(pool);
  const p2 = new PrismaClient({ adapter });
  console.log("Adapter PrismaClient instantiated successfully!");
} catch (e) {
  console.error("Adapter PrismaClient error:", e.message);
}
