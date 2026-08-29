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

    const sections: any[] = [];

    if (config.tags.includes("Quant")) {
      sections.push({
        title: "Quantitative Aptitude",
        durationSeconds: 20 * 60,
        questions: await fetchRandomQuestions({ type: 'APTITUDE', subTopic: { in: QUANT_TOPICS }, difficulty: config.diff }, 15)
      });
    }
    
    if (config.tags.includes("Logic")) {
      sections.push({
        title: "Logical Reasoning",
        durationSeconds: 20 * 60,
        questions: await fetchRandomQuestions({ type: 'APTITUDE', subTopic: { in: LOGICAL_TOPICS }, difficulty: config.diff }, 15)
      });
    }

    if (config.tags.includes("Verbal")) {
      sections.push({
        title: "Verbal Reasoning",
        durationSeconds: 20 * 60,
        questions: await fetchRandomQuestions({ type: 'VERBAL', difficulty: config.diff }, 20)
      });
    }

    if (config.tags.includes("Code")) {
      sections.push({
        title: "Code Output Prediction",
        durationSeconds: 25 * 60,
        requiresLanguage: true,
        expectedQuestionCount: 10,
        questions: []
      });
    }

    if (config.tags.includes("Debug")) {
      sections.push({
        title: "Code Debugging",
        durationSeconds: 25 * 60,
        requiresLanguage: true,
        expectedQuestionCount: 10,
        questions: []
      });
    }

    if (config.tags.includes("Tech Suites")) {
      sections.push({
        title: "Tech Suites",
        durationSeconds: 30 * 60,
        questions: await fetchRandomQuestions({ type: 'TECH_SUITES', difficulty: config.diff }, 15)
      });
    }

    if (config.tags.includes("Design")) {
      sections.push({
        title: "System Design",
        durationSeconds: 40 * 60,
        questions: await fetchRandomQuestions({ type: 'SYSTEM_DESIGN', difficulty: config.diff }, 8)
      });
    }

    if (config.tags.includes("GenAI")) {
      sections.push({
        title: "GenAI Vectors",
        durationSeconds: 25 * 60,
        questions: await fetchRandomQuestions({ type: 'GEN_AI', difficulty: config.diff }, 12)
      });
    }

    if (config.tags.includes("Prompting")) {
      sections.push({
        title: "Prompt Trials",
        durationSeconds: 20 * 60,
        questions: await fetchRandomQuestions({ type: 'PROMPTING_AND_LLMS', difficulty: config.diff }, 15)
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
