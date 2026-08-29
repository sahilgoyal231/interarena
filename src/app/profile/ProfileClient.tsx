"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@clerk/nextjs";
import { ActivityCalendar, ThemeInput } from "react-activity-calendar";
import { Calendar, LayoutDashboard, Settings } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface ProfileClientProps {
  sessions: { id: string, createdAt: string | Date, module: string, score: number, totalQuestions: number }[];
  activityData: any[];
  streak: number;
  activeDays: number;
}

export default function ProfileClient({ sessions, activityData, streak, activeDays }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  const theme: ThemeInput = {
    light: ["#18181b", "#3f1e5e", "#6b21a8", "#9333ea", "#c084fc"], // Doesn't matter, we force dark
    dark: ["#18181b", "#3f1e5e", "#6b21a8", "#9333ea", "#c084fc"],
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 space-y-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}
        >
          <Settings className="w-5 h-5" />
          Account Settings
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <p className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-2">Current Streak</p>
                <p className="text-4xl font-black text-white">{streak} <span className="text-lg text-purple-500">Days</span></p>
              </div>
              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <p className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-2">Active Days</p>
                <p className="text-4xl font-black text-white">{activeDays}</p>
              </div>
              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <p className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Sessions</p>
                <p className="text-4xl font-black text-white">{sessions.length}</p>
              </div>
              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <p className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-2">Avg Score</p>
                <p className="text-4xl font-black text-white">
                  {sessions.length > 0 ? Math.round((sessions.reduce((acc, s) => acc + (s.score / s.totalQuestions), 0) / sessions.length) * 100) : 0}%
                </p>
              </div>
            </div>

            {/* Heatmap Section */}
            <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-x-auto">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Activity Heatmap</h3>
              </div>
              <div className="min-w-[800px]">
                <ActivityCalendar 
                  data={activityData}
                  theme={theme}
                  colorScheme="dark"
                  labels={{
                    legend: {
                      less: "Less",
                      more: "More",
                    },
                    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    totalCount: "{{count}} activities in {{year}}",
                    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                  }}
                />
              </div>
            </div>

            {/* History Table */}
            <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-6">Recent Practice Sessions</h3>
              {sessions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Date</th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Module</th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Score</th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {sessions.slice(0, 20).map((session) => {
                        const accuracy = Math.round((session.score / session.totalQuestions) * 100);
                        return (
                          <tr key={session.id} className="hover:bg-zinc-900/50 transition-colors">
                            <td className="py-4 text-sm text-zinc-300">
                              {format(new Date(session.createdAt), 'MMM d, yyyy - h:mm a')}
                            </td>
                            <td className="py-4 text-sm font-semibold text-purple-400">
                              {session.module}
                            </td>
                            <td className="py-4 text-sm font-bold text-white">
                              {session.score} / {session.totalQuestions}
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${accuracy >= 80 ? 'bg-emerald-500/20 text-emerald-400' : accuracy >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                                {accuracy}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500">
                  <p>You haven&apos;t completed any practice sessions yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex justify-center">
            {/* We override Clerk's default UI with the 'dark' theme using the @clerk/themes package */}
            <UserProfile 
              routing="hash"
              appearance={{
                variables: {
                  colorPrimary: '#a855f7', // purple-500
                  colorBackground: '#18181b', // zinc-900
                  colorTextSecondary: '#a1a1aa',
                },
                elements: {
                  rootBox: "w-full",
                  card: "w-full shadow-none border border-zinc-800 bg-zinc-900/40",
                  headerTitle: "!text-zinc-100",
                  headerSubtitle: "!text-zinc-400",
                  profileSectionTitleText: "!text-zinc-100",
                  profileSectionPrimaryButton: "!text-zinc-300 hover:!bg-zinc-800",
                  accordionTriggerButton: "!text-zinc-100",
                  formFieldLabel: "!text-zinc-300",
                  formFieldInput: "!bg-zinc-900 !border-zinc-800 !text-zinc-100 focus:!ring-purple-500",
                  breadcrumbsItem: "!text-zinc-400 hover:!text-zinc-100",
                  activeDeviceIcon: "!text-zinc-100",
                  userPreviewMainIdentifier: "!text-zinc-100",
                  userPreviewSecondaryIdentifier: "!text-zinc-400",
                  badge: "!text-zinc-100 !bg-zinc-800",
                  navbarButton: "!text-zinc-400 hover:!text-zinc-100 hover:!bg-zinc-800",
                  pageScrollBox: "!text-zinc-100",
                  dividerLine: "!bg-zinc-800",
                  dividerText: "!text-zinc-500",
                  formButtonPrimary: "!bg-purple-600 hover:!bg-purple-700 !text-white",
                  formButtonReset: "!text-zinc-400 hover:!bg-zinc-800",
                  avatarImageActionsUpload: "!text-zinc-400",
                  menuItem: "!text-zinc-300 hover:!bg-zinc-800",
                  profilePage__security: "!text-zinc-100",
                  navbar: "!border-zinc-800",
                  scrollBox: "!bg-zinc-900/40 !text-zinc-100",
                }
              } as React.ComponentProps<typeof UserProfile>["appearance"]}
            />
          </div>
        )}
      </main>
    </div>
  );
}
