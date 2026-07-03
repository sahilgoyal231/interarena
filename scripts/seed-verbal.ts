import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fs from 'fs';
import readline from 'readline';
import path from 'path';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function loadJSONL(filePath: string): Promise<Prisma.QuestionCreateManyInput[]> {
    const creations: Prisma.QuestionCreateManyInput[] = [];
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return creations;
    }
    
    console.log(`Loading questions from ${filePath}...`);
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (!line.trim()) continue;
        try {
            const data = JSON.parse(line);
            creations.push({
                prompt: data.prompt || data.question,
                options: JSON.stringify(data.options),
                correctAnswer: data.correctAnswer || data.correct,
                explanation: data.explanation || data.rationale || `The correct answer is ${data.correctAnswer || data.correct}.`,
                category: "Verbal Ability",
                subTopic: data.subTopic,
                type: "VERBAL"
            });
        } catch (e) {
            // Ignore parse errors
        }
    }
    console.log(`Loaded ${creations.length} questions from ${path.basename(filePath)}.`);
    return creations;
}

async function main() {
    console.log("Starting High-Quality Dataset Seeding for Verbal Section...");
    
    console.log("Deleting old Verbal Ability questions...");
    await prisma.question.deleteMany({
        where: { category: "Verbal Ability" }
    });
    console.log("Old questions deleted.");

    const hfData = await loadJSONL(path.join(process.cwd(), 'data', 'verbal.jsonl'));
    const nlpData = await loadJSONL(path.join(process.cwd(), 'data', 'verbal-nlp.jsonl'));
    const staticData = await loadJSONL(path.join(process.cwd(), 'data', 'verbal-static.jsonl'));

    // Create a unique set of questions based on exact prompt to avoid any possible duplicates across files
    const uniqueQuestions = new Map<string, Prisma.QuestionCreateManyInput>();
    
    for (const q of [...hfData, ...nlpData, ...staticData]) {
        const uniqueKey = `${q.prompt}_${q.options}`;
        if (!uniqueQuestions.has(uniqueKey)) {
            uniqueQuestions.set(uniqueKey, q);
        }
    }

    const finalCreations = Array.from(uniqueQuestions.values());
    console.log(`Inserting ${finalCreations.length} unique questions into the database...`);
    
    // Insert in batches
    const BATCH_SIZE = 1000;
    let totalInserted = 0;
    
    for (let i = 0; i < finalCreations.length; i += BATCH_SIZE) {
        const batch = finalCreations.slice(i, i + BATCH_SIZE);
        await prisma.question.createMany({
            data: batch,
            skipDuplicates: true
        });
        totalInserted += batch.length;
        console.log(`Inserted ${totalInserted} / ${finalCreations.length}`);
    }
    
    console.log(`🎉 HIGH QUALITY VERBAL DATABASE FULLY SEEDED! Total unique questions inserted: ${totalInserted}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
