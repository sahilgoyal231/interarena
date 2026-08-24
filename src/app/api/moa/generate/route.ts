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
      
      sections.push({
        title: "Code Output Prediction",
        durationSeconds: 50 * 60, // 50 mins
        questions: q
      });
    } else {
      // Medium / Hard: Split 50 mins into two 25-min sections
      let guessQ = await fetchRandomQuestions({ type: 'GUESS_OUTPUT' }, 7);
      
      sections.push({
        title: "Code Output Prediction",
        durationSeconds: 25 * 60, // 25 mins
        questions: guessQ
      });

      let debugQ = await fetchRandomQuestions({ type: 'DEBUG_CODE' }, 7);
      
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
