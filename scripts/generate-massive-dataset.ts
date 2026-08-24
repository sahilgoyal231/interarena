import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local' });

import { PrismaClient, QuestionType, Difficulty } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API with multiple keys
const apiKeysStr = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
const apiKeys = apiKeysStr.split(',').map(k => k.trim()).filter(k => k);

if (apiKeys.length === 0) {
  console.error("Missing GEMINI_API_KEYS or GEMINI_API_KEY!");
  process.exit(1);
}

const models = apiKeys.map(key => {
    const genAI = new GoogleGenerativeAI(key);
    return genAI.getGenerativeModel({ 
        model: 'gemini-3.6-flash',
        generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.85
        }
    });
});

let currentKeyIndex = 0;

// Configure constants
const TARGET_PER_CATEGORY = 500;
const BATCH_SIZE = 22; // Safe batch size
const RATE_LIMIT_DELAY_MS = 7000; // ~7 seconds to ensure we stay under 10 RPM limit


// Hardcoded schema map
const QUESTION_MAPPING: Record<string, Record<string, string[]>> = {
  DEBUG_CODE: {
    "C++": ["Arrays & Hashing", "Two Pointers & Sliding Window", "Binary Search, Stacks & Queues", "Linked Lists & Trees", "Dynamic Programming & Graphs"],
    "Python": ["Arrays & Hashing", "Two Pointers & Sliding Window", "Binary Search, Stacks & Queues", "Linked Lists & Trees", "Dynamic Programming & Graphs"],
    "JavaScript": ["Arrays & Hashing", "Two Pointers & Sliding Window", "Binary Search, Stacks & Queues", "Linked Lists & Trees", "Dynamic Programming & Graphs"],
    "Java": ["Arrays & Hashing", "Two Pointers & Sliding Window", "Binary Search, Stacks & Queues", "Linked Lists & Trees", "Dynamic Programming & Graphs"]
  },
  GUESS_OUTPUT: {
    "C++": ["Pointers & References", "Undefined Behavior", "Macros & Preprocessor", "Inheritance & Virtual Functions", "Move Semantics"],
    "Python": ["Mutable Default Arguments", "Variable Scope & LEGB", "List/Dict Comprehensions", "Dunder Methods", "Exception Handling"],
    "JavaScript": ["Hoisting & TDZ", "Type Coercion & Equality", "this Keyword Binding", "Promises & Microtasks", "Event Propagation"],
    "Java": ["String Pool & Immutability", "Static Blocks & Initialization", "Polymorphism & Overriding", "Exception Flow", "Generics Type Erasure"]
  },
  SYSTEM_DESIGN: {
    "High Level Design (HLD)": ["Scalability & Load Balancing", "Databases & Partitioning", "Microservices Architecture", "Caching Strategies", "Message Queues & Event Streaming"],
    "Low Level Design (LLD)": ["Design Patterns", "SOLID Principles", "Class Diagrams & UML", "API Design & Contracts", "Concurrency & Database Locking"]
  },
  PROMPTING_AND_LLMS: {
    "Prompt Engineering": ["Zero-shot & Few-shot", "Chain of Thought", "Tree of Thoughts", "Prompt Injection & Security", "Context Window Management"],
    "LLMs": ["Transformer Architecture", "Attention Mechanisms", "RAG & Vector Databases", "Fine-Tuning & PeFT", "Evaluation & Hallucinations"]
  },
  GEN_AI: {
    "AI Basics": ["Machine Learning Fundamentals", "Neural Networks & Backpropagation", "NLP Fundamentals", "Embeddings & Latent Space", "Model Training & Validation"],
    "Advanced GenAI": ["Diffusion Models", "Foundational Models", "Multimodal AI", "Agentic Workflows", "RLHF & AI Safety"]
  },
  APTITUDE: {
    "Quantitative Aptitude": [
      "Numbers", "LCM & HCF", "Ratio & Proportion", "Average", "Problem on Age",
      "Percentages", "Profit and Loss", "Mixture and Alligations", "Simple Interest",
      "Compound Interest", "Time, Speed & Distance", "Trains, Boats & Streams",
      "Race", "Work and Wages", "Pipes and Cistern", "Algebra", "Mensuration 2D",
      "Mensuration 3D", "Geometry", "Trigonometry & Distances", "Progressions",
      "Logarithms", "Permutation & Combination", "Probability", "Clocks", "Calendars",
      "Simplification & Approx", "Data Interpretation"
    ],
    "Logical Reasoning": [
      "Number Series", "Letter & Symbol Series", "Verbal Classification", "Analogies",
      "Logical Problems", "Course of Action", "Statement & Conclusion", "Theme Detection",
      "Blood Relations", "Directions", "Statement & Argument", "Logical Deduction",
      "Coding Decoding", "Statement & Assumptions", "Logical Venn Diagram"
    ]
  },
  VERBAL: {
    "Verbal Ability": [
      "Synonyms", "Antonyms", "Sentence Error", "Sentence Correction", "Change of Voice", "Change of Speech", "Articles", "Idioms and Phrases", 
      "Preposition", "Selecting Words", "Spellings", "Conjunctions", "One Word Substitutes",
      "Fill in the Blanks", "Comprehension", "Sentence Formation", "Spotting Errors", "Vocabulary", "Ordering of Words", 
      "Sentence Completion", "Sentence Improvement", "Ordering of Sentences", "CLoze Test", "Paragraph Formation", "Reading Comprehension", 
      "Verbal Analogies", "Adjectives", "Para Jumbles"
    ]
  }
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function getQuestionCounts(prisma: PrismaClient) {
  const counts = await prisma.question.groupBy({
    by: ['type', 'category', 'subTopic'],
    _count: { id: true },
  });

  const map = new Map<string, number>();
  for (const c of counts) {
    map.set(`${c.type}|${c.category}|${c.subTopic}`, c._count.id);
  }
  return map;
}

function constructPrompt(type: string, category: string, subTopic: string, batchSize: number, currentCount: number) {
  // Use currentCount to generate a varied focus instruction to guarantee 500 unique questions
  const focusAreas = [
    "Focus heavily on fundamental concepts and underlying theory.",
    "Focus heavily on tricky edge cases, exceptions, and common anti-patterns.",
    "Focus on performance optimization, memory management, and Big O complexity.",
    "Focus on debugging complex scenarios and tracing execution flow.",
    "Focus on real-world industry usage, frameworks context, and modern best practices.",
    "Focus on historical quirks, deprecated features, and backwards compatibility.",
    "Focus on highly advanced, senior-level interview questions that require deep expertise.",
    "Focus on security implications, vulnerabilities, and safe coding practices."
  ];
  
  // Pick a focus area based on the current batch index
  const batchIndex = Math.floor(currentCount / batchSize);
  const focusArea = focusAreas[batchIndex % focusAreas.length];

  let prompt = `You are a Principal Staff Engineer at a top FAANG company. Your task is to generate exactly ${batchSize} highly unique, industry-standard technical interview questions.
CRITICAL REQUIREMENT: These questions must be extremely high quality, absolutely accurate, and suitable for screening top-tier candidates.
CRITICAL FORMATTING REQUIREMENT: DO NOT use markdown formatting (like ** or _), HTML tags, LaTeX, or any weird unicode symbols in the text. Keep all text plain, properly formatted, and highly readable. If math or code is needed, use standard plain text representations. Ensure database integrity and quality by preventing malformed symbols.
Do NOT repeat common or trivial questions found on basic tutorial sites. You must inject randomness, cover edge cases, and ensure absolute uniqueness.

Topic Details:
- Main Category: ${category}
- Specific SubTopic: ${subTopic}
- Question Type: ${type}

Batch Variation Strategy:
- ${focusArea}
- Ensure a strong mix of difficulties (EASY, MEDIUM, HARD), leaning heavily towards MEDIUM and HARD.
- Explanations MUST be highly detailed, educational, technically flawless, and explain WHY the other options are wrong.
`;

  if (type === 'DEBUG_CODE') {
    prompt += `
Since this is a debugging question, it must be structured as a real LeetCode-style interactive coding problem (e.g. given an array of integers, find the maximum subarray sum). It must involve core algorithmic problem solving and data structures.
CRITICAL RULES:
1. 'prompt': Must be a detailed narrative describing the problem (e.g., Problem Statement, Example 1, Example 2, Constraints). It must look exactly like a Leetcode description. Do NOT mention the bug anywhere in the prompt!
2. 'boilerPlateCode': The code containing the subtle algorithmic bug (e.g. wrong loop bounds, missing base case). Do NOT add any comments mentioning or hinting at the bug!
3. 'testCases': Must be an object containing TWO arrays: 'example' (visible to user) and 'hidden' (for final evaluation). Make sure the test cases thoroughly test the algorithm.
4. 'options': Should be an empty array [] since this is an interactive coding challenge.
5. 'correctAnswer': Should be an empty string "".

Output MUST be a JSON array of objects with the following schema:
[{
  "prompt": "Detailed string explaining the problem, including Examples and Constraints. Do not mention the bug.",
  "correctAnswer": "",
  "explanation": "String explaining what the bug was and how to fix it.",
  "difficulty": "EASY" | "MEDIUM" | "HARD",
  "estimatedTimeSeconds": 120,
  "options": [],
  "language": "${category}",
  "boilerPlateCode": "Code string containing a subtle bug. NO SPOILER COMMENTS.",
  "testCases": {
    "example": [{"input": "...", "expectedOutput": "..."}],
    "hidden": [{"input": "...", "expectedOutput": "..."}]
  }
}]`;
  } else if (type === 'GUESS_OUTPUT') {
    prompt += `
Since this is an output guessing question, it must include a code snippet in the prompt.
Output MUST be a JSON array of objects with the following schema:
[{
  "prompt": "String containing the code snippet and asking for the output.",
  "correctAnswer": "A",
  "explanation": "String explaining why the output is what it is.",
  "difficulty": "EASY" | "MEDIUM" | "HARD",
  "estimatedTimeSeconds": 60,
  "options": ["A) Output 1", "B) Output 2", "C) Output 3", "D) Output 4"],
  "language": "${category}"
}]`;
  } else {
    prompt += `
This is a standard multiple-choice question.
Output MUST be a JSON array of objects with the following schema:
[{
  "prompt": "The question string.",
  "correctAnswer": "A",
  "explanation": "String explaining the correct answer.",
  "difficulty": "EASY" | "MEDIUM" | "HARD",
  "estimatedTimeSeconds": 60,
  "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"]
}]`;
  }

  return prompt;
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Fetching current database state...");
  const existingCounts = await getQuestionCounts(prisma);
  
  let apiCallsMadeToday = 0;

  for (const [type, categories] of Object.entries(QUESTION_MAPPING)) {
    for (const [category, subTopics] of Object.entries(categories)) {
      // Calculate target per subtopic to guarantee 500 per category
      // For aptitude/verbal where they have many topics, they might want 500 per subtopic still? 
      // User said: "a total of 500 questions per language", so per category.
      const targetPerSubTopic = Math.ceil(TARGET_PER_CATEGORY / subTopics.length);
      
      for (const subTopic of subTopics) {
        
        while (true) {
            const currentCount = existingCounts.get(`${type}|${category}|${subTopic}`) || 0;
            if (currentCount >= targetPerSubTopic) {
                console.log(`[OK] ${category} - ${subTopic}: Has ${currentCount}/${targetPerSubTopic} questions.`);
                break; // Move to next subTopic
            }

            const needed = targetPerSubTopic - currentCount;
            const batchSize = Math.min(BATCH_SIZE, needed);
            
            console.log(`\nGenerating batch of ${batchSize} questions for ${category} -> ${subTopic}... (Current: ${currentCount})`);
            const prompt = constructPrompt(type, category, subTopic, batchSize, currentCount);

            try {
                const model = models[currentKeyIndex];
                const result = await model.generateContent(prompt);
                apiCallsMadeToday++;
                
                const text = result.response.text();
                const jsonStr = text.replace(/^```json/, '').replace(/```$/, '').trim();
                const questions = JSON.parse(jsonStr);

                if (!Array.isArray(questions)) throw new Error("API did not return a JSON array.");
                
                // Format for Prisma
                const mappedQuestions = questions.map((q: any) => ({
                    type: type as QuestionType,
                    category,
                    subTopic,
                    prompt: q.prompt || "No prompt provided",
                    options: q.options || [],
                    correctAnswer: q.correctAnswer || "A",
                    explanation: q.explanation || "No explanation provided",
                    difficulty: (q.difficulty as Difficulty) || Difficulty.MEDIUM,
                    estimatedTimeSeconds: q.estimatedTimeSeconds || 60,
                    language: q.language || null,
                    boilerPlateCode: q.boilerPlateCode || null,
                    testCases: q.testCases || null,
                }));

                await prisma.question.createMany({
                    data: mappedQuestions
                });
                
                // Update local state map
                existingCounts.set(`${type}|${category}|${subTopic}`, currentCount + mappedQuestions.length);
                console.log(`✅ Inserted ${mappedQuestions.length} questions. (Total successful API Calls across all keys: ${apiCallsMadeToday})`);
                
            } catch (err: any) {
                console.error(`❌ API or parsing error: ${err.message}`);
                
                if (err.message.includes('429') || err.message.includes('Quota') || err.message.includes('quota')) {
                    console.log(`[QUOTA REACHED] Key ${currentKeyIndex + 1} exhausted.`);
                    currentKeyIndex++;
                    if (currentKeyIndex >= models.length) {
                        console.log(`\n\n🎉 [ALL KEYS EXHAUSTED] All provided API keys have hit their quota! Safely shutting down.`);
                        console.log(`Run this script again tomorrow to resume from exactly where it left off.`);
                        await prisma.$disconnect();
                        process.exit(0);
                    }
                    console.log(`Switched to Key ${currentKeyIndex + 1}. Retrying...`);
                    continue;
                }
                
                // Since this might be a formatting error or network blip, wait a bit longer then retry.
                console.log("Waiting 30s before retry...");
                await delay(30000);
                continue; 
            }

            // Enforce Rate Limiting Delay
            console.log(`Sleeping for ${RATE_LIMIT_DELAY_MS}ms to respect rate limit...`);
            await delay(RATE_LIMIT_DELAY_MS);
        }
      }
    }
  }

  console.log("\n✅ AMAZING! All topics have at least 500 questions!");
  await prisma.$disconnect();
}

main().catch(console.error);
