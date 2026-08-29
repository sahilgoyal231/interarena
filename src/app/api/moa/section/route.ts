import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { QuestionType } from '@prisma/client';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as QuestionType;
  const language = searchParams.get('language');
  const difficulty = searchParams.get('difficulty');
  const limitStr = searchParams.get('limit');
  const limit = limitStr ? parseInt(limitStr) : 10;

  if (!type || !language) {
    return NextResponse.json({ error: 'type and language are required' }, { status: 400 });
  }

  try {
    const ids = await prisma.question.findMany({
      where: { 
        type, 
        ...(difficulty ? { difficulty: difficulty as 'EASY' | 'MEDIUM' | 'HARD' } : {}),
        category: {
            equals: language,
            mode: 'insensitive'
        }
      },
      select: { id: true },
    });
    
    if (ids.length === 0) {
       return NextResponse.json({ questions: [] });
    }
    
    const shuffledIds = shuffle(ids).slice(0, limit).map(q => q.id);
    const questions = await prisma.question.findMany({
      where: { id: { in: shuffledIds } },
    });
    
    return NextResponse.json({ questions: shuffle(questions) });

  } catch (error: any) {
    console.error("MOA Section Generation Error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
