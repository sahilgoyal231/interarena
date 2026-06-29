import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const subTopic = searchParams.get("subTopic");

    // Dynamically assemble query logic based on student interaction params
    const queryConditions: any = {};
    if (type) queryConditions.type = type;
    if (subTopic) queryConditions.subTopic = subTopic;

    const questions = await prisma.question.findMany({
      where: queryConditions,
    });

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "Failed to grab questions data." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Extract fields based on your unified Question schema
    const {
      type,
      category,
      subTopic,
      prompt,
      correctAnswer,
      explanation,
      options,
      boilerPlateCode,
      testCases,
    } = body;

    // Save the data to PostgreSQL using Prisma
    const newQuestion = await prisma.question.create({
      data: {
        type,
        category,
        subTopic,
        prompt,
        correctAnswer,
        explanation,
        options: options ? options : null,
        boilerPlateCode: boilerPlateCode ? boilerPlateCode : null,
        testCases: testCases ? testCases : null,
      },
    });

    return NextResponse.json(
      {
        message: "Question saved successfully!",
        question: newQuestion,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving question:", error);
    return NextResponse.json(
      {
        error: "Failed to save the question to the database.",
      },
      { status: 500 },
    );
  }
}
