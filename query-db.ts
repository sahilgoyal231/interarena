import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local' });

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const categories = await prisma.question.groupBy({
    by: ['type', 'category'],
    _count: {
      id: true,
    },
  });
  console.log("Categories in DB:");
  console.log(categories);
  await prisma.$disconnect();
}
main();
