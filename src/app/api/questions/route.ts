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

    let questions = await prisma.question.findMany({
      where: queryConditions,
    });

    // Fallback mock data for manual testing if DB is empty
    if (questions.length === 0) {
      questions = [
        {
          id: "mock-1",
          type: type || "APTITUDE",
          category: "Quantitative",
          subTopic: subTopic || "Time & Work",
          prompt: "If 5 workers can build a wall in 10 days, how many days would it take 10 workers to build the same wall?",
          options: JSON.stringify(["5 days", "10 days", "2 days", "20 days"]),
          correctAnswer: "5 days",
          explanation: "This is a classic time and work problem. Since the number of workers is inversely proportional to the time taken, doubling the workers halves the time. 10 / 2 = 5 days.",
          boilerPlateCode: null,
          testCases: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "mock-2",
          type: type || "APTITUDE",
          category: "Quantitative",
          subTopic: subTopic || "Time & Work",
          prompt: "A pipe can fill a tank in 4 hours, and another can empty it in 6 hours. If both are opened together, how long will it take to fill the tank?",
          options: JSON.stringify(["10 hours", "12 hours", "8 hours", "2.4 hours"]),
          correctAnswer: "12 hours",
          explanation: "The first pipe fills 1/4 of the tank per hour. The second empties 1/6 per hour. Together they fill (1/4 - 1/6) = (3 - 2) / 12 = 1/12 of the tank per hour. Therefore, it takes 12 hours.",
          boilerPlateCode: null,
          testCases: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "mock-3",
          type: type || "APTITUDE",
          category: "Logical",
          subTopic: subTopic || "Number Series",
          prompt: "What is the next number in the series: 2, 6, 12, 20, ...?",
          options: JSON.stringify(["30", "28", "24", "32"]),
          correctAnswer: "30",
          explanation: "The differences between the numbers are 4 (6-2), 6 (12-6), and 8 (20-12). The next difference will be 10, so 20 + 10 = 30.",
          boilerPlateCode: null,
          testCases: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ] as any;
    }

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
