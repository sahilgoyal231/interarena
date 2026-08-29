const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.question.count();
  console.log("EXACT_COUNT:", count);
}

main().then(() => process.exit(0));
