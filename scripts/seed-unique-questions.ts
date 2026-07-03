import 'dotenv/config';
import fs from 'fs';
import readline from 'readline';
import path from 'path';
import stringSimilarity from 'string-similarity';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DATA_FILE_AQUA = path.join(process.cwd(), 'data', 'aqua.jsonl');
const DATA_FILE_LOGICAL = path.join(process.cwd(), 'data', 'logical.jsonl');
const DATA_FILE_MISSING = path.join(process.cwd(), 'data', 'missing.jsonl');
const MAX_PER_SUBTOPIC = 500;
const SIMILARITY_THRESHOLD = 0.65; // slightly higher to allow more matches since we need to fill 44 categories

const categorize = (question: string): { category: string; subTopic: string } => {
  const q = question.toLowerCase();

  // Logical Reasoning (16)
  if (q.match(/\b(blood relation|father|mother|brother|sister|uncle|aunt|nephew|niece|cousin|son|daughter)\b/s)) return { category: 'Logical Reasoning', subTopic: 'Blood Relations' };
  if (q.match(/\b(north|south|east|west|direction|walk.*turn|left.*right.*turn)\b/s)) return { category: 'Logical Reasoning', subTopic: 'Directions' };
  if (q.match(/\b(code|decode|written as|coded as)\b/s)) return { category: 'Logical Reasoning', subTopic: 'Coding Decoding' };
  if (q.match(/\b(statements?.*conclusions?)\b/s)) return { category: 'Logical Reasoning', subTopic: 'Statement & Conclusion' };
  if (q.match(/\b(venn|diagram|some.*are|all.*are|no.*is)\b/s)) return { category: 'Logical Reasoning', subTopic: 'Logical Venn Diagram' };
  if (q.match(/\b(statements?.*assumptions?)\b/s)) return { category: 'Logical Reasoning', subTopic: 'Statement & Assumptions' };
  if (q.match(/\b(statements?.*arguments?)\b/s)) return { category: 'Logical Reasoning', subTopic: 'Statement & Argument' };
  if (q.match(/\bcourses? of action\b/s)) return { category: 'Logical Reasoning', subTopic: 'Course of Action' };
  if (q.match(/\btheme detection\b/s)) return { category: 'Logical Reasoning', subTopic: 'Theme Detection' };
  if (q.match(/\b(analogy|is to)\b/s)) return { category: 'Logical Reasoning', subTopic: 'Analogies' };
  if (q.match(/\b(odd one out|classify)\b/s)) return { category: 'Logical Reasoning', subTopic: 'Verbal Classification' };
  if (q.match(/\blogical deduction\b/s)) return { category: 'Logical Reasoning', subTopic: 'Logical Deduction' };
  if (q.match(/\b(number series|next number|missing number)\b/s)) return { category: 'Logical Reasoning', subTopic: 'Number Series' };
  if (q.match(/\b(letter series|symbol series|alphabet)\b/s)) return { category: 'Logical Reasoning', subTopic: 'Letter & Symbol Series' };
  if (q.match(/\blogical problem\b/s)) return { category: 'Logical Reasoning', subTopic: 'Logical Problems' };
  
  // Quantitative Aptitude (28)
  if (q.match(/\b(clock|hands of a clock|hour hand|minute hand)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Clocks' };
  if (q.match(/\b(calendar|day of the week|leap year)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Calendars' };
  if (q.match(/\b(probability|dice|coin|card|random)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Probability' };
  if (q.match(/\b(permutation|combination|arrange|ways to|select|choose|committee)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Permutation & Combination' };
  if (q.match(/\b(logarithm|log)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Logarithms' };
  if (q.match(/\b(arithmetic progression|geometric progression|ap|gp|sequence|series)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Progressions' };
  if (q.match(/\b(sin|cos|tan|elevation|angle of elevation)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Trigonometry & Distances' };
  if (q.match(/\b(geometry|intersecting|parallel|chord|tangent)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Geometry' };
  if (q.match(/\b(volume|surface area|cylinder|cone|sphere|cube|cuboid)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Mensuration 3D' };
  if (q.match(/\b(area|perimeter|square|rectangle|circle|triangle|diagonal)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Mensuration 2D' };
  if (q.match(/\b(algebra|equation|polynomial|quadratic)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Algebra' };
  if (q.match(/\b(pipe|cistern|tank.*fill|tank.*empty|leak)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Pipes and Cistern' };
  if (q.match(/\b(wage|earn|payment)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Work and Wages' };
  if (q.match(/\b(work|days.*complete|men|women|hours)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Work and Wages' };
  if (q.match(/\b(race|run.*beat|start)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Race' };
  if (q.match(/\b(train|boat|stream|downstream|upstream|platform|tunnel)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Trains, Boats & Streams' };
  if (q.match(/\b(speed|distance|kmph|m\/s|travel|journey|walk)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Time, Speed & Distance' };
  if (q.match(/\b(compound interest|compounded)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Compound Interest' };
  if (q.match(/\b(simple interest|rate of interest|principal sum|p\.a\.)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Simple Interest' };
  if (q.match(/\b(mixture|milk|water|alcohol|alloy|blended)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Mixture and Alligations' };
  if (q.match(/\b(profit|loss|cost price|selling price|discount)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Profit and Loss' };
  if (q.match(/\bpercent\b|%/s)) return { category: 'Quantitative Aptitude', subTopic: 'Percentages' };
  if (q.match(/\b(age|older|younger|years old)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Problem on Age' };
  if (q.match(/\b(average|mean)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Average' };
  if (q.match(/\b(ratio|proportion)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Ratio & Proportion' };
  if (q.match(/\b(lcm|hcf|least common multiple|highest common factor)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'LCM & HCF' };
  if (q.match(/\b(simplify|approximate|evaluate|square root|cube root|fraction)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Simplification & Approx' };
  if (q.match(/\b(chart|table|pie|graph|data)\b/s)) return { category: 'Quantitative Aptitude', subTopic: 'Data Interpretation' };
  
  // Fallback
  return { category: 'Quantitative Aptitude', subTopic: 'Numbers' };
};

const ALL_SUBTOPICS = [
  "Numbers", "LCM & HCF", "Ratio & Proportion", "Average", "Problem on Age",
  "Percentages", "Profit and Loss", "Mixture and Alligations", "Simple Interest",
  "Compound Interest", "Time, Speed & Distance", "Trains, Boats & Streams",
  "Race", "Work and Wages", "Pipes and Cistern", "Algebra", "Mensuration 2D",
  "Mensuration 3D", "Geometry", "Trigonometry & Distances", "Progressions",
  "Logarithms", "Permutation & Combination", "Probability", "Clocks", "Calendars",
  "Simplification & Approx", "Data Interpretation",
  "Number Series", "Letter & Symbol Series", "Verbal Classification", "Analogies",
  "Logical Problems", "Course of Action", "Statement & Conclusion", "Theme Detection",
  "Blood Relations", "Directions", "Statement & Argument", "Logical Deduction",
  "Coding Decoding", "Statement & Assumptions", "Logical Venn Diagram"
];

async function main() {
  console.log('Connecting to database and clearing existing APTITUDE questions...');
  await prisma.question.deleteMany({
    where: { type: 'APTITUDE' },
  });
  console.log('Existing APTITUDE questions cleared.');

  const questionsBySubtopic: Record<string, any[]> = {};
  const normalizedQuestions: Record<string, Set<string>> = {};
  for (const st of ALL_SUBTOPICS) {
    questionsBySubtopic[st] = [];
    normalizedQuestions[st] = new Set();
  }
  
  async function processFile(filePath: string, skipSimilarityCheck: boolean = false) {
    console.log(`\nStreaming dataset: ${filePath}...`);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${filePath} (Not found)`);
      return;
    }
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    
    let lineCount = 0;
    for await (const line of rl) {
      lineCount++;
      if (lineCount % 10000 === 0) {
        console.log(`Processed ${lineCount} lines...`);
      }

      if (!line.trim()) continue;
      let data;
      try {
        data = JSON.parse(line);
      } catch (e) {
        continue;
      }

      let category = '';
      let subTopic = '';
      if (data.subTopic) {
        subTopic = data.subTopic;
        category = subTopic === 'Trigonometry & Distances' || subTopic === 'Geometry' || subTopic === 'Logarithms' || subTopic === 'LCM & HCF' || subTopic === 'Calendars' || subTopic === 'Data Interpretation' ? 'Quantitative Aptitude' : 'Logical Reasoning';
      } else {
        const cat = categorize(data.question);
        category = cat.category;
        subTopic = cat.subTopic;
      }
      
      // Safety check just in case mapping fails
      if (!questionsBySubtopic[subTopic]) {
        questionsBySubtopic[subTopic] = [];
      }

      if (questionsBySubtopic[subTopic].length >= MAX_PER_SUBTOPIC) {
        continue; // Skip if we already have enough questions for this subtopic
      }

      // Check for similarity across all gathered questions (global uniqueness)
      const normalizedQ = data.question.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normalizedQuestions[subTopic].has(normalizedQ)) {
        continue;
      }

      questionsBySubtopic[subTopic].push({
        type: 'APTITUDE',
        category,
        subTopic,
        prompt: data.question,
        options: data.options,
        correctAnswer: data.correct,
        explanation: data.rationale,
      });
      normalizedQuestions[subTopic].add(normalizedQ);
    }
  }

  // Process Logical first to ensure our strictly generated ones get priority
  await processFile(DATA_FILE_LOGICAL, true); // skip similarity check for synthetic templates
  await processFile(DATA_FILE_MISSING, true); // skip similarity check to ensure all missing topics are added
  await processFile(DATA_FILE_AQUA, false);

  console.log('\nData processing complete. Inserting into database...');

  const allQuestionsToInsert = [];
  let totalCount = 0;
  console.log('--- Questions Count per Subtopic ---');
  for (const subTopic of ALL_SUBTOPICS) {
    const count = questionsBySubtopic[subTopic]?.length || 0;
    console.log(`- ${subTopic}: ${count} questions`);
    totalCount += count;
    if (count > 0) {
      allQuestionsToInsert.push(...questionsBySubtopic[subTopic]);
    }
  }
  console.log(`\nTotal questions gathered: ${totalCount}`);

  // Batch insert due to large amount of questions
  const BATCH_SIZE = 500;
  for (let i = 0; i < allQuestionsToInsert.length; i += BATCH_SIZE) {
    const batch = allQuestionsToInsert.slice(i, i + BATCH_SIZE);
    await prisma.question.createMany({
      data: batch,
    });
    console.log(`Inserted batch ${i / BATCH_SIZE + 1}...`);
  }

  console.log(`Successfully inserted all ${totalCount} questions into the DB.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
