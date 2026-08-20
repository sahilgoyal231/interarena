import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local' });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { processQuestionData } from '../src/lib/data-cleaner';

let prisma: PrismaClient;

async function main() {
  // Ensure Pool uses the loaded environment variables
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });

  console.log('Starting data cleanup...');
  
  const batchSize = 500;
  let skip = 0;
  let totalProcessed = 0;
  let totalUpdated = 0;

  while (true) {
    const questions = await prisma.question.findMany({
      skip,
      take: batchSize,
    });

    if (questions.length === 0) {
      break;
    }

    console.log(`Processing batch of ${questions.length} questions (skip: ${skip})...`);

    const updatePromises = [];

    for (const q of questions) {
      const originalData = {
        prompt: q.prompt,
        explanation: q.explanation,
        options: q.options,
      };

      const cleanedData = processQuestionData(originalData);

      const promptChanged = originalData.prompt !== cleanedData.prompt;
      const explanationChanged = originalData.explanation !== cleanedData.explanation;
      const optionsChanged = JSON.stringify(originalData.options) !== JSON.stringify(cleanedData.options);

      if (promptChanged || explanationChanged || optionsChanged) {
        updatePromises.push(
          prisma.question.update({
            where: { id: q.id },
            data: {
              prompt: cleanedData.prompt,
              explanation: cleanedData.explanation,
              options: cleanedData.options ? (Array.isArray(cleanedData.options) ? cleanedData.options : JSON.stringify(cleanedData.options)) : null,
            },
          })
        );
      }
    }

    if (updatePromises.length > 0) {
      console.log(`Updating ${updatePromises.length} records in this batch...`);
      await Promise.all(updatePromises);
      totalUpdated += updatePromises.length;
    }

    totalProcessed += questions.length;
    skip += batchSize;
  }

  console.log(`\nCleanup complete!`);
  console.log(`Total questions processed: ${totalProcessed}`);
  console.log(`Total questions updated: ${totalUpdated}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });
