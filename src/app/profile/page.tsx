import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import ProfileClient from "./ProfileClient";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const user = await currentUser();

  const sessions = await prisma.practiceSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Prepare data for the Activity Calendar
  // It expects [{ date: "YYYY-MM-DD", count: 0, level: 0 }]
  const activityMap = new Map<string, number>();
  sessions.forEach((s: any) => {
    // Basic date formatting to YYYY-MM-DD in UTC
    const dateStr = s.createdAt.toISOString().split("T")[0];
    activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
  });

  // To ensure the calendar has a full year of empty boxes (like github/leetcode),
  // react-activity-calendar handles the span automatically if we provide a start and end,
  // or we can just generate 365 days of empty data and merge it.
  const data = [];
  const today = new Date();
  const pastYear = new Date();
  pastYear.setFullYear(today.getFullYear() - 1);

  for (let d = new Date(pastYear); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const count = activityMap.get(dateStr) || 0;
    
    // Assign a level (0-4) based on count for the color scale
    let level = 0;
    if (count > 0 && count <= 2) level = 1;
    else if (count > 2 && count <= 5) level = 2;
    else if (count > 5 && count <= 8) level = 3;
    else if (count > 8) level = 4;

    data.push({
      date: dateStr,
      count,
      level,
    });
  }

  // Calculate Streak
  let currentStreak = 0;
  let checkDate = new Date();
  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0];
    if (activityMap.has(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If they haven't practiced today, check if they practiced yesterday to keep the streak alive visually
      if (currentStreak === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = checkDate.toISOString().split("T")[0];
        if (activityMap.has(yesterdayStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
      }
      break;
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-y-auto selection:bg-purple-500/30">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        
        {/* Header */}
        <div className="flex items-end justify-between border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Developer Profile</h1>
            <p className="text-zinc-400 mt-2">Track your progress, streaks, and account settings.</p>
          </div>
        </div>

        <ProfileClient 
          sessions={sessions} 
          activityData={data} 
          streak={currentStreak} 
          activeDays={activityMap.size}
        />
        
      </div>
    </div>
  );
}
