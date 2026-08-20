import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { QUANT_TOPICS, LOGICAL_TOPICS, MOA_CONFIGS } from '@/lib/constants';
import { QuestionType, Difficulty } from '@prisma/client';

// Fisher-Yates Shuffle
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fetch random questions helper
async function fetchRandomQuestions(whereClause: any, limit: number) {
  const ids = await prisma.question.findMany({
    where: whereClause,
    select: { id: true },
  });
  
  if (ids.length === 0) return [];
  
  const shuffledIds = shuffle(ids).slice(0, limit).map(q => q.id);
  const questions = await prisma.question.findMany({
    where: { id: { in: shuffledIds } },
  });
  
  // Re-shuffle because findMany with 'in' returns ordered by primary key
  return shuffle(questions);
}

// Generate dummy coding questions if database has none
function generateDummyCodingQuestions(type: QuestionType, limit: number) {
  return Array.from({ length: limit }).map((_, i) => ({
    id: `dummy-${type}-${i}`,
    type,
    category: 'Programming',
    subTopic: type === 'GUESS_OUTPUT' ? 'Output Guessing' : 'Debugging',
    prompt: type === 'GUESS_OUTPUT' 
      ? `What is the output of the following code snippet? (Dummy Question ${i+1})\n\n\`\`\`cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World ${i}";\n    return 0;\n}\n\`\`\``
      : `Identify the bug in the following code snippet. (Dummy Question ${i+1})\n\n\`\`\`cpp\nint sum(int a, int b) {\n    return a - b; // Bug here\n}\n\`\`\``,
    options: ["A) Hello World", "B) Compiler Error", "C) Runtime Error", "D) None of the above"],
    correctAnswer: "A",
    explanation: "This is a fallback generated dummy question because your database currently lacks coding questions.",
    difficulty: Difficulty.EASY,
    estimatedTimeSeconds: 120,
    boilerPlateCode: null,
    testCases: null,
    language: null
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const moaId = searchParams.get('moaId');
  
  if (!moaId) {
    return NextResponse.json({ error: 'moaId is required' }, { status: 400 });
  }

  const config = MOA_CONFIGS.find(c => c.id === moaId);
  if (!config) {
    return NextResponse.json({ error: 'Invalid moaId' }, { status: 404 });
  }

  try {
    const diff = config.diff; // 'EASY' | 'MEDIUM' | 'HARD'

    // Section A: Aptitude (Quant)
    const secA = {
      title: "Quantitative Aptitude",
      durationSeconds: 20 * 60, // 20 mins
      questions: await fetchRandomQuestions({ type: 'APTITUDE', subTopic: { in: QUANT_TOPICS } }, 15)
    };

    // Section B: Logical Aptitude
    const secB = {
      title: "Logical Reasoning",
      durationSeconds: 20 * 60, // 20 mins
      questions: await fetchRandomQuestions({ type: 'APTITUDE', subTopic: { in: LOGICAL_TOPICS } }, 12)
    };

    // Section C: Verbal Reasoning
    const secC = {
      title: "Verbal Reasoning",
      durationSeconds: 30 * 60, // 30 mins
      questions: await fetchRandomQuestions({ type: 'VERBAL' }, 25)
    };

    // Section D/E: Coding
    const sections: any[] = [secA, secB, secC];

    if (diff === 'EASY') {
      let q = await fetchRandomQuestions({ type: 'GUESS_OUTPUT' }, 15);
      if (q.length === 0) q = generateDummyCodingQuestions('GUESS_OUTPUT', 15);
      
      sections.push({
        title: "Code Output Prediction",
        durationSeconds: 50 * 60, // 50 mins
        questions: q
      });
    } else {
      // Medium / Hard: Split 50 mins into two 25-min sections
      let guessQ = await fetchRandomQuestions({ type: 'GUESS_OUTPUT' }, 7);
      if (guessQ.length === 0) guessQ = generateDummyCodingQuestions('GUESS_OUTPUT', 7);
      
      sections.push({
        title: "Code Output Prediction",
        durationSeconds: 25 * 60, // 25 mins
        questions: guessQ
      });

      let debugQ = await fetchRandomQuestions({ type: 'DEBUG_CODE' }, 7);
      if (debugQ.length === 0) debugQ = generateDummyCodingQuestions('DEBUG_CODE', 7);
      
      sections.push({
        title: "Code Debugging Audit",
        durationSeconds: 25 * 60, // 25 mins
        questions: debugQ
      });
    }

    return NextResponse.json({
      moaId,
      title: config.title,
      difficulty: config.diff,
      sections
    });

  } catch (error: any) {
    console.error("MOA Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
