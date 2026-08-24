import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local' });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

function cleanString(str: string | null): string | null {
  if (!str) return str;
  return str
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
    .replace(/\*(.*?)\*/g, '$1')     // Remove markdown italic
    .replace(/__(.*?)__/g, '$1')     // Remove markdown underline (bold)
    .replace(/_(.*?)_/g, '$1')       // Remove markdown italic
    .replace(/`/g, '')               // Remove stray backticks
    .replace(/\\n/g, '\n')           // Fix literal \n
    .replace(/\\t/g, '\t')           // Fix literal \t
    // Convert common LaTeX into plain text format
    .replace(/\\log/g, 'log')
    .replace(/\\ln/g, 'ln')
    .replace(/\\cdot/g, '*')
    .replace(/\\dots/g, '...')
    .replace(/\\times/g, 'x')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)')
    .replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\left/g, '')
    .replace(/\\right/g, '')
    .replace(/\\pi/g, 'π')
    .replace(/\\theta/g, 'θ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\infty/g, '∞')
    .replace(/\\approx/g, '≈')
    .replace(/\\neq/g, '≠')
    .replace(/\\leq?/g, '≤')
    .replace(/\\geq?/g, '≥')
    .replace(/\\pm/g, '±')
    .replace(/\\text\{([^}]+)\}/g, '$1');
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Fetching all questions...");
  const questions = await prisma.question.findMany();
  
  console.log(`Found ${questions.length} questions. Sanitizing...`);
  let updatedCount = 0;
  
  const BATCH_SIZE = 50;
  
  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);
    
    const updatePromises = batch.map(async (q) => {
      const cleanedPrompt = cleanString(q.prompt);
      const cleanedExplanation = cleanString(q.explanation);
      const cleanedOptions = Array.isArray(q.options) 
        ? q.options.map(opt => cleanString(opt as string) as string)
        : q.options;
      
      if (
        cleanedPrompt !== q.prompt || 
        cleanedExplanation !== q.explanation ||
        JSON.stringify(cleanedOptions) !== JSON.stringify(q.options)
      ) {
        await prisma.question.update({
          where: { id: q.id },
          data: {
            prompt: cleanedPrompt as string,
            explanation: cleanedExplanation as string,
            options: cleanedOptions as any,
          }
        });
        return 1;
      }
      return 0;
    });

    const results = await Promise.all(updatePromises);
    let batchUpdated = 0;
    for (const r of results) {
      batchUpdated += r;
    }
    updatedCount += batchUpdated;

    if (i % 500 === 0 && i > 0) {
      console.log(`Processed ${i} / ${questions.length} questions... (Updated: ${updatedCount})`);
    }
  }

  console.log(`✅ Sanitize complete. Processed ${questions.length} questions. Updated ${updatedCount} questions.`);
  await prisma.$disconnect();
}

main().catch(console.error);
