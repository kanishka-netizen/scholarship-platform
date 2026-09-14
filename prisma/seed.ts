import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.scholarship.count();
  if (count > 0) {
    console.log(`Skipping seed; ${count} scholarships already exist.`);
    return;
  }

  await prisma.scholarship.createMany({
    data: [
      {
        name: "National Merit Scheme",
        provider: "Ministry of Education",
        description: "Merit-based scholarship listed on the National Scholarship Portal.",
        amount: 50000,
        deadline: new Date("2026-10-31"),
        educationLevel: "Undergraduate",
        course: "Engineering",
        state: "All India",
        applicationUrl: "https://scholarships.gov.in/All-Scholarships",
        source: "https://scholarships.gov.in/All-Scholarships",
        verified: true,
        active: true,
      },
    ],
  });

  console.log("Inserted fallback scholarship seed data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
