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
        data: body,
        skipDuplicates: true, // Prevents crashing if a duplicate ID accidentally slips in
      });
      return NextResponse.json({ message: `Successfully bulk inserted ${createdQuestions.count} questions.` }, { status: 201 });
    } else {
      // Otherwise, handle it as a Single Question Upload
      body = processQuestionData(rawBody);
    }

    const createdQuestion = await prisma.question.create({
      data: body,
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
      const totalCount = await prisma.question.count({ where: queryConditions });
      
      // Randomly pick `limit` number of questions if totalCount > limit
      if (totalCount > limit) {
        // Since Prisma doesn't natively support random ordering in findMany easily,
        // we use a strategy of fetching `limit * 3` items starting from a random skip,
        // then shuffle them and take `limit` items to ensure pseudo-randomization.
        const maxSkip = Math.max(0, totalCount - (limit * 3));
        const skip = Math.floor(Math.random() * maxSkip);
        
        const candidateQuestions = await prisma.question.findMany({
          where: queryConditions,
          skip: skip,
          take: limit * 3,
        });

        for (let i = candidateQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [candidateQuestions[i], candidateQuestions[j]] = [candidateQuestions[j], candidateQuestions[i]];
        }
        
        questions = candidateQuestions.slice(0, limit);
      } else {
        // If we have fewer than limit, just return what we have (shuffled)
        questions = await prisma.question.findMany({ where: queryConditions });
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
      }
    } else {
      questions = await prisma.question.findMany({
        where: queryConditions,
      });
    }

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "Failed to grab questions data." }, { status: 500 });
  }
}