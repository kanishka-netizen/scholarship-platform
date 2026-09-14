import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const testScholarshipNames = [
  "Women in Technology Scholarship",
  "Future Engineers Scholarship",
  "ABC Merit Scholarship",
];

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await prisma.scholarship.deleteMany({
    where: {
      name: { in: testScholarshipNames },
    },
  });

  console.log(`Removed ${result.count} named test scholarships.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });