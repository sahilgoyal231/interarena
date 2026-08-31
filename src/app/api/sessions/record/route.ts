import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { module, score, totalQuestions } = await request.json();

    if (!module || typeof score !== 'number' || typeof totalQuestions !== 'number') {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure user exists in our DB to satisfy foreign key constraints
    const clerkUser = await currentUser();
    const primaryEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || `${userId}@placeholder.com`;
    const userName = clerkUser?.firstName || "Anonymous";

    try {
      await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email: primaryEmail,
          name: userName
        }
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        // Unique constraint failed, likely because this email belongs to an old/deleted Clerk account.
        // We'll create the user with a guaranteed unique placeholder email so they can still proceed.
        await prisma.user.upsert({
          where: { id: userId },
          update: {},
          create: {
            id: userId,
            email: `${userId}@placeholder.com`,
            name: userName
          }
        });
      } else {
        throw e;
      }
    }

    const session = await prisma.practiceSession.create({
      data: {
        userId,
        module,
        score,
        totalQuestions,
      }
    });

    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    console.error("Error recording session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
