require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

async function main() {
  const count = await prisma.question.count();
  console.log("EXACT_COUNT:", count);
}

main().then(() => {
  prisma.$disconnect();
  process.exit(0);
});
