import { Metadata } from "next";
import Link from "next/link";
import { currentUser, auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Dashboard | InterArena",
  description: "Track your progress, view your performance analytics, and access mock online assessments for tech interviews.",
};
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, BookOpen, Code2, Clock, Target, CircleCheck, Terminal, Trophy, Timer, Activity, ShieldAlert, Layers, MessageSquare, Cpu, BrainCircuit, Network, Boxes, Server } from "lucide-react";
import NodeNetwork from "@/components/ui/NodeNetwork";
import InterArenaLogo from "@/components/ui/Logo";
import { AptSprintsLogo, VerbalLeaguesLogo, CodeSandboxLogo, DesignDraftsLogo, GenAIVectorsLogo, PromptTrialsLogo } from "@/components/ui/ModuleLogos";
import { TechSuitesLogo } from "@/components/ui/TechSuitesLogo";
import { MOA_CONFIGS } from "@/lib/constants";
import { HeroNexus } from "@/components/ui/HeroNexus";
import { ScrollReveal, ScrollRevealStagger, ScrollRevealItem } from "@/components/ui/ScrollReveal";
import prisma from "@/lib/prisma";
import { UserNav } from "@/components/ui/UserNav";
import { CyberFlame } from "@/components/ui/CyberFlame";

export default async function StudentDashboard() {
  const { userId } = await auth();
  await currentUser(); // Fetch current user for auth side-effects or cache

  let currentStreak = 0;
  if (userId) {
    const sessions = await prisma.practiceSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    
    const activityMap = new Set<string>();
    sessions.forEach((s: any) => activityMap.add(s.createdAt.toISOString().split("T")[0]));
    
    const checkDate = new Date();
    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];
      if (activityMap.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
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
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-x-hidden">

      {/* Background canvas layer */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <NodeNetwork />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-16 w-full p-6 md:p-12 grow">
        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-zinc-800">
          <Link href="/home">
            <InterArenaLogo className="w-48 hover:opacity-90 transition-opacity" />
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 shadow-sm">
              <CyberFlame className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-bold text-white">{currentStreak}</span>
            </div>
            <UserNav />
          </div>
        </header>

        {/* Hero Section */}
        <ScrollReveal className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1.3fr_0.7fr] gap-8 items-center pb-8 -mt-4 md:-mt-6">
          <div className="text-left space-y-6 md:space-y-8">
            <h1 style={{ fontFamily: "var(--font-bodoni-moda)" }} className="text-8xl md:text-8xl xl:text-8xl font-bold tracking-tighter text-white leading-[1.1]">
              <span className="whitespace-nowrap">your <span className="text-purple-500">one-stop</span></span> solution for{" "}
              <span className="text-purple-500">interview OAs</span>
            </h1>
            <p className="text-zinc-400 text-base md:text-xl font-medium leading-relaxed max-w-xl">
              master fundamentals, enhance your speed, and conquer online
              assessments with time-based practice and detailed explanations.
            </p>
          </div>

          {/* Right Side Layout: Abstract Intelligence Nexus */}
          <HeroNexus />
        </ScrollReveal>

        {/* UPDATED: Main Modules Grid with Oval Corners (rounded-3xl) and Glow Shadows */}
        <ScrollRevealStagger className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20">

          <ScrollRevealItem>
            <Link href="/aptitude" className="group block h-full outline-none">
              {/* Added rounded-3xl, enhanced border-zinc-700/60, and hover:shadow-purple-900/20 */}
              <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700/60 rounded-3xl hover:border-purple-400 hover:bg-purple-500/5 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-500 flex flex-col h-full cursor-pointer overflow-hidden">
                <CardHeader className="space-y-4 p-8">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-white font-bold">Apt-Sprints</CardTitle>
                    <AptSprintsLogo className="w-10 h-10 text-purple-500 shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
                  </div>
                  <div className="flex items-center gap-1.5 self-start text-[11px] font-bold bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-full border border-purple-500/20 shadow-inner">
                    <Clock className="w-3 h-3" /> Time Based Session
                  </div>
                  <CardDescription className="text-zinc-400 text-base leading-relaxed pt-2">
                    Full aptitude problems mix practice. Master all the foundational topics grouped directly below the arena under strict evaluation conditions.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <Link href="/verbal" className="group block h-full outline-none">
              <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700/60 rounded-3xl hover:border-purple-400 hover:bg-purple-500/5 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-500 flex flex-col h-full cursor-pointer overflow-hidden">
                <CardHeader className="space-y-4 p-8">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-white font-bold">Verbal-Leagues</CardTitle>
                    <VerbalLeaguesLogo className="w-10 h-10 text-purple-500 shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
                  </div>
                  <div className="flex items-center gap-1.5 self-start text-[11px] font-bold bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-full border border-purple-500/20 shadow-inner">
                    <Clock className="w-3 h-3" /> Time Based Session
                  </div>
                  <CardDescription className="text-zinc-400 text-base leading-relaxed pt-2">
                    A mixed verbal practice with a modern UI. AI will determine the mixed problems out of the available pool to enhance your context conversion velocity.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <Link href="/coding" className="group block h-full outline-none">
              <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700/60 rounded-3xl hover:border-purple-400 hover:bg-purple-500/5 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-500 flex flex-col h-full cursor-pointer overflow-hidden">
                <CardHeader className="space-y-4 p-8">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-white font-bold">Code-Sandbox</CardTitle>
                    <CodeSandboxLogo className="w-10 h-10 text-purple-500 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                  </div>
                  <div className="flex items-center gap-1.5 self-start text-[11px] font-bold bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-full border border-purple-500/20 shadow-inner">
                    <Clock className="w-3 h-3" /> Time Based Session
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="group/item">
                      <h4 className="text-sm font-bold text-zinc-200 mb-1 flex items-center gap-2 group-hover/item:text-purple-400 transition-colors">
                        <Target className="w-4 h-4 text-purple-500" /> Debug the Code
                      </h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Travel through the journey of debugging and finding incorrect syntax or statements to grasp fundamentals.
                      </p>
                    </div>
                    <div className="group/item">
                      <h4 className="text-sm font-bold text-zinc-200 mb-1 flex items-center gap-2 group-hover/item:text-purple-400 transition-colors">
                        <Target className="w-4 h-4 text-purple-500" /> Guess the Output
                      </h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Practice output guessing or finding errors in pre-written code snippets under timed pressure.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <Link href="/design" className="group block h-full outline-none">
              <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700/60 rounded-3xl hover:border-purple-400 hover:bg-purple-500/5 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-500 flex flex-col h-full cursor-pointer overflow-hidden">
                <CardHeader className="space-y-4 p-8">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-white font-bold">Design-Drafts</CardTitle>
                    <DesignDraftsLogo className="w-10 h-10 text-purple-500 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                  </div>
                  <div className="flex items-center gap-1.5 self-start text-[11px] font-bold bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-full border border-purple-500/20 shadow-inner">
                    <Clock className="w-3 h-3" /> Time Based Session
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="group/item">
                      <h4 className="text-sm font-bold text-zinc-200 mb-1 flex items-center gap-2 group-hover/item:text-purple-400 transition-colors">
                        <Target className="w-4 h-4 text-purple-500" /> High Level Design
                      </h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Master high level architectural patterns, scalability and distributed system design concepts.
                      </p>
                    </div>
                    <div className="group/item">
                      <h4 className="text-sm font-bold text-zinc-200 mb-1 flex items-center gap-2 group-hover/item:text-purple-400 transition-colors">
                        <Target className="w-4 h-4 text-purple-500" /> Low Level Design
                      </h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Practice object-oriented design patterns and low level component implementation.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <Link href="/prompt" className="group block h-full outline-none">
              <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700/60 rounded-3xl hover:border-purple-400 hover:bg-purple-500/5 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-500 flex flex-col h-full cursor-pointer overflow-hidden">
                <CardHeader className="space-y-4 p-8">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-white font-bold">Prompt-Trials</CardTitle>
                    <PromptTrialsLogo className="w-10 h-10 text-purple-500 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                  </div>
                  <div className="flex items-center gap-1.5 self-start text-[11px] font-bold bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-full border border-purple-500/20 shadow-inner">
                    <Clock className="w-3 h-3" /> Time Based Session
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="group/item">
                      <h4 className="text-sm font-bold text-zinc-200 mb-1 flex items-center gap-2 group-hover/item:text-purple-400 transition-colors">
                        <Target className="w-4 h-4 text-purple-500" /> Prompt Engineering
                      </h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Craft optimal prompts, zero-shot/few-shot techniques, and reasoning extraction strategies.
                      </p>
                    </div>
                    <div className="group/item">
                      <h4 className="text-sm font-bold text-zinc-200 mb-1 flex items-center gap-2 group-hover/item:text-purple-400 transition-colors">
                        <Target className="w-4 h-4 text-purple-500" /> LLM Fundamentals
                      </h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Understand attention mechanisms, tokenization boundaries, and context window utilization.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <Link href="/genai" className="group block h-full outline-none">
              <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700/60 rounded-3xl hover:border-purple-400 hover:bg-purple-500/5 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-500 flex flex-col h-full cursor-pointer overflow-hidden">
                <CardHeader className="space-y-4 p-8">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-white font-bold">GenAI-Vectors</CardTitle>
                    <GenAIVectorsLogo className="w-10 h-10 text-purple-500 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                  </div>
                  <div className="flex items-center gap-1.5 self-start text-[11px] font-bold bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-full border border-purple-500/20 shadow-inner">
                    <Clock className="w-3 h-3" /> Time Based Session
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="group/item">
                      <h4 className="text-sm font-bold text-zinc-200 mb-1 flex items-center gap-2 group-hover/item:text-purple-400 transition-colors">
                        <Target className="w-4 h-4 text-purple-500" /> AI Basics
                      </h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Solidify core concepts of machine learning, deep learning algorithms, and neural networks.
                      </p>
                    </div>
                    <div className="group/item">
                      <h4 className="text-sm font-bold text-zinc-200 mb-1 flex items-center gap-2 group-hover/item:text-purple-400 transition-colors">
                        <Target className="w-4 h-4 text-purple-500" /> Advanced GenAI
                      </h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Master RAG architectures, multi-modal embeddings, fine-tuning, and vector databases.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <Link href="/tech-suites" className="group block h-full outline-none">
              <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700/60 rounded-3xl hover:border-purple-500/80 hover:bg-purple-500/5 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-500 flex flex-col h-full cursor-pointer overflow-hidden">
                <CardHeader className="space-y-4 p-8">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-white font-bold">Tech-suites</CardTitle>
                    <TechSuitesLogo className="w-10 h-10 text-purple-500 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                  </div>
                  <div className="flex items-center gap-1.5 self-start text-[11px] font-bold bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-full border border-purple-500/20 shadow-inner">
                    <Clock className="w-3 h-3" /> Time Based Session
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="group/item">
                      <h4 className="text-sm font-bold text-zinc-200 mb-1 flex items-center gap-2 group-hover/item:text-purple-400 transition-colors">
                        <Target className="w-4 h-4 text-purple-500" /> CS-Core
                      </h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Master the absolute fundamentals of OS, Networking, and Databases.
                      </p>
                    </div>
                    <div className="group/item">
                      <h4 className="text-sm font-bold text-zinc-200 mb-1 flex items-center gap-2 group-hover/item:text-purple-400 transition-colors">
                        <Target className="w-4 h-4 text-purple-500" /> Programming Fundas
                      </h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Deep dive into OOP, SQL, Memory, and core coding paradigms.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </ScrollRevealItem>

        </ScrollRevealStagger>
      </div>

      {/* =========================================
            PRO PROFESSIONAL MOA SECTION
            ========================================= */}
      <div className="relative pt-24 pb-16 w-full mt-12">
        {/* Ambient Background Glow for emphasis */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-150 bg-purple-900/10 blur-[150px] rounded-full pointer-events-none z-0" />

        <ScrollReveal className="relative z-10 text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-4">
            <Trophy className="w-10 h-10 text-purple-500" />
            Mock Online Assessments <span className="text-purple-500">(MOAs)</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-medium">
            The ultimate 3-hour gauntlet. Experience the exact pressure, time constraints, and multi-disciplinary structure of real Tier-1 placement OAs.
          </p>
        </ScrollReveal>

        {/* ALIGNED BENTO GRID: Enhanced Professional Styling */}
        <ScrollRevealStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {(() => {
            const moaConfigs = {
              Easy: {
                icon: <CircleCheck className="w-3.5 h-3.5" />,
                badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                borderHover: "hover:border-purple-500/50",
                glowHover: "hover:shadow-purple-500/20",
                bgHover: "hover:bg-purple-900/10",
                linear: "from-purple-900/10 to-emerald-900/20"
              },
              Medium: {
                icon: <Activity className="w-3.5 h-3.5" />,
                badge: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                borderHover: "hover:border-purple-500/50",
                glowHover: "hover:shadow-purple-500/20",
                bgHover: "hover:bg-purple-900/10",
                linear: "from-purple-900/10 to-amber-900/20"
              },
              Hard: {
                icon: <ShieldAlert className="w-3.5 h-3.5" />,
                badge: "text-rose-400 bg-rose-500/10 border-rose-500/30",
                borderHover: "hover:border-purple-500/50",
                glowHover: "hover:shadow-purple-500/20",
                bgHover: "hover:bg-purple-900/10",
                linear: "from-purple-900/10 to-rose-900/20"
              }
            };

            return MOA_CONFIGS.map((moa) => {
              const theme = moaConfigs[moa.diff === 'EASY' ? 'Easy' : moa.diff === 'MEDIUM' ? 'Medium' : 'Hard'];
              return (
                <ScrollRevealItem key={moa.id}>
                  <div
                    className={`group relative flex flex-col justify-between h-full p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-3xl ${theme.borderHover} ${theme.bgHover} hover:shadow-2xl ${theme.glowHover} transition-all duration-500 cursor-pointer overflow-hidden isolate`}
                  >
                    {/* Subtle linear background for each card mixing purple USP and difficulty theme */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 bg-linear-to-br ${theme.linear}`} />

                    <div>
                      <div className="flex justify-between items-center mb-5">
                        <span className={`flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full border ${theme.badge} shadow-inner`}>
                          {theme.icon} {moa.diff}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono font-bold tracking-wider bg-zinc-950/50 px-2.5 py-1 rounded-md border border-zinc-800/50">
                          <Timer className="w-3 h-3" /> 120m
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-100 group-hover:text-purple-300 mb-2 transition-colors">{moa.title}</h3>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {moa.tags?.map((tag) => (
                          <span key={tag} className="text-[9px] font-bold text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded uppercase tracking-wider">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <Link href={`/assessments/${moa.id}`} className="mt-6">
                      <div className={`w-full text-xs font-bold py-2.5 border border-zinc-700 text-zinc-400 group-hover:text-white group-hover:border-purple-500/70 group-hover:bg-purple-600/20 hover:bg-purple-600! transition-all rounded-xl uppercase tracking-widest text-center flex justify-center items-center gap-2 group/btn`}>
                        Initiate <Target className="w-3.5 h-3.5 opacity-50 group-hover/btn:opacity-100 group-hover/btn:scale-110 transition-all" />
                      </div>
                    </Link>
                  </div>
                </ScrollRevealItem>
              );
            });
          })()}
        </ScrollRevealStagger>
      </div>

      {/* Professional Footer with Custom Native SVGs */}
      <footer className="relative z-20 border-t border-zinc-800 bg-[#09090b] pt-16 pb-8 mt-12 w-full">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">

            {/* Column 1: Company Logo & Info */}
            <div className="space-y-4 pr-4">
              <div className="text-2xl font-extrabold tracking-tight text-white mb-6">
                Inter<span className="text-purple-500">Arena</span>
              </div>
              <ul className="space-y-3 text-sm text-zinc-400 font-medium">
                <li><Link href="#" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">About us</Link></li>
                <li><Link href="#" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Investor Relations</Link></li>
                <li><Link href="#" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Terms & conditions</Link></li>
                <li><Link href="#" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Privacy policy</Link></li>
                <li><Link href="#" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Anti-discrimination policy</Link></li>
                <li><Link href="#" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Careers</Link></li>
              </ul>
            </div>

            {/* Column 2: For Students */}
            <div className="space-y-6">
              <h4 className="text-white font-semibold text-lg">For Students</h4>
              <ul className="space-y-3 text-sm text-zinc-400 font-medium">
                <li><Link href="/aptitude" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Aptitude Sprints</Link></li>
                <li><Link href="/verbal" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Verbal Leagues</Link></li>
                <li><Link href="/coding" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Code Sandbox</Link></li>
                <li><Link href="/design" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Design Drafts</Link></li>
                <li><Link href="/prompt" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Prompt Trials</Link></li>
                <li><Link href="/genai" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">GenAI Vectors</Link></li>
                <li><Link href="/tech-suites" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Tech Suites</Link></li>
                <li><Link href="/assessments" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Mock Assessments</Link></li>
              </ul>
            </div>

            {/* Column 3: For Universities */}
            <div className="space-y-6">
              <h4 className="text-white font-semibold text-lg">For Universities</h4>
              <ul className="space-y-3 text-sm text-zinc-400 font-medium">
                <li><Link href="#" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Partner with us</Link></li>
                <li><Link href="#" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Campus Placements</Link></li>
                <li><Link href="#" className="relative inline-block text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Contact sales</Link></li>
              </ul>
            </div>

            {/* Column 4: Social links with Custom SVG Replacements */}
            <div className="space-y-6">
              <h4 className="text-white font-semibold text-lg">Social links</h4>
              <div className="flex gap-3">
                <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-100 hover:border-zinc-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                </a>
                <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-100 hover:border-zinc-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
                <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-100 hover:border-zinc-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-100 hover:border-zinc-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom Line */}
          <div className="border-t border-zinc-800/80 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center gap-6 w-full">
            <p className="text-zinc-500 text-xs font-medium text-center md:text-left tracking-wide">
              * As on June 30, {new Date().getFullYear()}
            </p>

            <p className="text-zinc-500 text-xs font-medium text-center md:text-right tracking-wide">
              © Copyright {new Date().getFullYear()} InterArena Technologies Limited. All rights reserved.
            </p>
          </div>
        </ScrollReveal>
      </footer>

    </div>
  );
}