import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { processQuestionData } from "@/lib/data-cleaner";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await request.json();
    let body;

    // Check if the payload is an Array (Bulk Upload)
    if (Array.isArray(rawBody)) {
      body = rawBody.map(q => processQuestionData(q));
      const createdQuestions = await prisma.question.createMany({
        data: body as any,
        skipDuplicates: true, // Prevents crashing if a duplicate ID accidentally slips in
      });
      return NextResponse.json({ message: `Successfully bulk inserted ${createdQuestions.count} questions.` }, { status: 201 });
    } else {
      // Otherwise, handle it as a Single Question Upload
      body = processQuestionData(rawBody);
    }

    const createdQuestion = await prisma.question.create({
      data: body as any,
    });
    return NextResponse.json(createdQuestion, { status: 201 });

  } catch (error) {
    console.error("Database Save Error:", error);
    return NextResponse.json({ error: "Failed to save question(s) to the database." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const subTopic = searchParams.get("subTopic");
    const category = searchParams.get("category");
    const limitParam = searchParams.get("limit");

    const queryConditions: any = {};
    if (type) queryConditions.type = type;
    if (subTopic) queryConditions.subTopic = subTopic;
    if (category) {
      queryConditions.category = {
        equals: category,
        mode: "insensitive",
      };
    }

    let questions;
    
    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      const totalCount = await prisma.question.count({ where: queryConditions as any });
      
      // Randomly pick `limit` number of questions if totalCount > limit
      if (totalCount > limit) {
        // Fetch all IDs for the matching conditions to guarantee perfect randomness
        const allQuestionIds = await prisma.question.findMany({
          where: queryConditions as any,
          select: { id: true },
        });

        // Shuffle the IDs
        for (let i = allQuestionIds.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allQuestionIds[i], allQuestionIds[j]] = [allQuestionIds[j], allQuestionIds[i]];
        }

        // Take the first 'limit' IDs
        const selectedIds = allQuestionIds.slice(0, limit).map(q => q.id);

        // Fetch the full question data for these specific IDs
        questions = await prisma.question.findMany({
          where: {
            id: { in: selectedIds },
          },
        });

        // Re-shuffle because Prisma might return them in order of DB layout
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
      } else {
        // If we have fewer than limit, just return what we have (shuffled)
        questions = await prisma.question.findMany({ where: queryConditions as any });
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
      }
    } else {
      questions = await prisma.question.findMany({
        where: queryConditions as any,
      });
    }

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "Failed to grab questions data." }, { status: 500 });
  }
}