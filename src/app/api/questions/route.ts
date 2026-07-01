import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if the payload is an Array (Bulk Upload)
    if (Array.isArray(body)) {
      const createdQuestions = await prisma.question.createMany({
        data: body,
        skipDuplicates: true, // Prevents crashing if a duplicate ID accidentally slips in
      });
      return NextResponse.json({ message: `Successfully bulk inserted ${createdQuestions.count} questions.` }, { status: 201 });
    }

    // Otherwise, handle it as a Single Question Upload
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
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const subTopic = searchParams.get("subTopic");

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