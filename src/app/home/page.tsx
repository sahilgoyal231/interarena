import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, BookOpen, Code2, Flame, Clock, Target } from "lucide-react";

export default async function StudentDashboard() {
  // Securely fetch the logged-in user on the server
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-12 text-zinc-100">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Wireframe Header: Logo+Name & Streak + User Profile */}
        <header className="flex items-center justify-between pb-6 border-b border-zinc-800">
          <div className="text-2xl font-extrabold tracking-tight text-white">
            Inter<span className="text-purple-500">Arena</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-bold text-white">3</span>
            </div>
            {/* Clerk's pre-built profile avatar dropdown */}
            <UserButton
              appearance={{ elements: { avatarBox: "w-10 h-10" } }}
            />
          </div>
        </header>

        {/* Wireframe Hero Section */}
        <div className="text-left max-w-2xl pb-32 md:pb-40 -mt-4 md:-mt-6">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[1.1]">
            your <span className="text-purple-500">one-stop</span> solution for{" "}
            <span className="text-purple-500">interview OAs</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">
            master fundamentals, enhance your speed, and conquer online
            assessments with time-based practice and detailed explanations.
          </p>
        </div>

        {/* Wireframe Main Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Apt Arena Card */}
          <Link href="/aptitude" className="group block h-full outline-none">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-purple-500/50 hover:bg-purple-900/10 transition-all duration-300 flex flex-col h-full cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-2xl text-white">Apt-Arena</CardTitle>
                  <Brain className="w-10 h-10 text-purple-500 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardDescription className="text-zinc-400 mt-2 text-base leading-relaxed">
                  Full aptitude problems mix practice. Master all the foundational
                  topics grouped directly below the arena.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* VerbalLeague Card */}
          <Link href="/verbal" className="group block h-full outline-none">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-purple-500/50 hover:bg-purple-900/10 transition-all duration-300 flex flex-col h-full cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <CardTitle className="text-2xl text-white mb-3">Verbal-League</CardTitle>
                  </div>
                  <BookOpen className="w-10 h-10 text-purple-500 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardDescription className="text-zinc-400 mt-2 text-base leading-relaxed">
                  A mixed verbal practice with a modern UI. AI will
                  determine the mixed problems out of the available pool to
                  enhance your speed.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Code Sandbox Card */}
          <Link href="/coding" className="group block h-full outline-none">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-purple-500/50 hover:bg-purple-900/10 transition-all duration-300 flex flex-col h-full cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-2xl text-white">Code-Sandbox</CardTitle>
                  <Code2 className="w-10 h-10 text-purple-500 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="space-y-4 mt-2">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200 mb-1 flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-500" /> Debug the
                      Code
                    </h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      A place to travel through the journey of debugging and
                      finding incorrect syntax or statements to grasp
                      fundamentals.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200 mb-1 flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-500" /> Guess the
                      Output
                    </h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Practice output guessing or finding errors in pre-written
                      code snippets.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
