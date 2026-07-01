import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, BookOpen, Code2, Flame, Clock, Target, CircleCheck, Terminal, Trophy, Timer, Zap, ShieldAlert } from "lucide-react";
import NodeNetwork from "@/components/ui/NodeNetwork";
import InterArenaLogo from "@/components/ui/Logo";
import { ScrollReveal, ScrollRevealStagger, ScrollRevealItem } from "@/components/ui/ScrollReveal";

export default async function StudentDashboard() {
  await currentUser(); // Fetch current user for auth side-effects or cache

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-x-hidden">

      {/* Background canvas layer */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <NodeNetwork />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-16 w-full p-6 md:p-12 flex-grow">
        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-zinc-800">
          <Link href="/home">
            <InterArenaLogo className="w-48 hover:opacity-90 transition-opacity" />
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 shadow-sm">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-bold text-white">3</span>
            </div>
            <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
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

          {/* Right Side Layout: Realistic Live OA Environment Mockup */}
          <div className="relative w-full h-[350px] lg:h-[450px] flex items-center justify-center pointer-events-none perspective-[1000px]">
            {/* Glowing Aura Behind the IDE */}
            <div className="absolute w-[80%] h-[70%] bg-purple-600/20 blur-[100px] rounded-full z-10 animate-pulse" />

            {/* The Realistic IDE Window */}
            <div className="relative z-20 w-full max-w-lg bg-[#0d1117] border border-zinc-700 rounded-2xl shadow-2xl shadow-purple-900/40 overflow-hidden transform transition-transform duration-700 hover:scale-105 hover:rotate-1">

              {/* IDE Top Bar (macOS style) */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-zinc-800">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>two_sum.cpp</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold font-mono bg-red-400/10 px-2 py-1 rounded">
                  <Clock className="w-3.5 h-3.5" />
                  14:59
                </div>
              </div>

              {/* IDE Code Editor Area */}
              <div className="p-5 font-mono text-[13px] leading-relaxed text-zinc-300">
                <div className="flex"><span className="text-zinc-600 w-8 select-none">1</span><span><span className="text-purple-400">#include</span> <span className="text-green-400">&lt;vector&gt;</span></span></div>
                <div className="flex"><span className="text-zinc-600 w-8 select-none">2</span><span><span className="text-purple-400">#include</span> <span className="text-green-400">&lt;unordered_map&gt;</span></span></div>
                <div className="flex"><span className="text-zinc-600 w-8 select-none">3</span></div>
                <div className="flex"><span className="text-zinc-600 w-8 select-none">4</span><span><span className="text-blue-400">std::vector</span>&lt;<span className="text-purple-400">int</span>&gt; <span className="text-yellow-200">twoSum</span>(<span className="text-blue-400">std::vector</span>&lt;<span className="text-purple-400">int</span>&gt;&amp; nums, <span className="text-purple-400">int</span> target) {'{'}</span></div>
                <div className="flex"><span className="text-zinc-600 w-8 select-none">5</span><span className="pl-4"><span className="text-blue-400">std::unordered_map</span>&lt;<span className="text-purple-400">int</span>, <span className="text-purple-400">int</span>&gt; numMap;</span></div>
                <div className="flex"><span className="text-zinc-600 w-8 select-none">6</span><span className="pl-4"><span className="text-purple-400">for</span> (<span className="text-purple-400">int</span> i = <span className="text-orange-400">0</span>; i &lt; nums.size(); i++) {'{'}</span></div>
                <div className="flex"><span className="text-zinc-600 w-8 select-none">7</span><span className="pl-8"><span className="text-purple-400">int</span> complement = target - nums[i];</span></div>
                <div className="flex"><span className="text-zinc-600 w-8 select-none">8</span><span className="pl-8"><span className="text-purple-400">if</span> (numMap.count(complement)) {'{'}</span></div>
                <div className="flex"><span className="text-zinc-600 w-8 select-none">9</span><span className="pl-12 text-zinc-500 italic">{"// Found the solution"}</span></div>
                <div className="flex"><span className="text-zinc-600 w-8 select-none">10</span><span className="pl-12"><span className="text-purple-400">return</span> {'{'}numMap[complement], i{'}'};</span></div>
              </div>

              {/* Console / Test Cases Output Area */}
              <div className="bg-black/50 border-t border-zinc-800 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Test Execution</span>
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">Passed</span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span><span className="text-green-500 mr-2">✓</span>Test Case 1</span><span className="text-zinc-500">2ms</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-300">
                    <span><span className="text-green-500 mr-2">✓</span>Test Case 2 (Hidden)</span><span className="text-zinc-500">3ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping Floating Success Badge */}
            <div className="absolute -bottom-6 -right-6 md:right-0 z-30 bg-zinc-900 border border-zinc-700 p-4 rounded-2xl shadow-2xl shadow-purple-900/50 flex items-center gap-4 animate-[bounce_5s_infinite]">
              <div className="bg-purple-500/20 p-2 rounded-full border border-purple-500/30">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Top 1% Score</p>
                <p className="text-xs text-zinc-400">Assessment Passed</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* UPDATED: Main Modules Grid with Oval Corners (rounded-3xl) and Glow Shadows */}
        <ScrollRevealStagger className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20">

          <ScrollRevealItem>
            <Link href="/aptitude" className="group block h-full outline-none">
              {/* Added rounded-3xl, enhanced border-zinc-700/60, and hover:shadow-purple-900/20 */}
              <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700/60 rounded-3xl hover:border-purple-500/70 hover:bg-purple-900/10 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 flex flex-col h-full cursor-pointer overflow-hidden">
                <CardHeader className="space-y-4 p-8">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-white font-bold">Apt-Sprint</CardTitle>
                    <Brain className="w-10 h-10 text-purple-500 shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
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
              <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700/60 rounded-3xl hover:border-purple-500/70 hover:bg-purple-900/10 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 flex flex-col h-full cursor-pointer overflow-hidden">
                <CardHeader className="space-y-4 p-8">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-white font-bold">Verbal-League</CardTitle>
                    <BookOpen className="w-10 h-10 text-purple-500 shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
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
              <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700/60 rounded-3xl hover:border-purple-500/70 hover:bg-purple-900/10 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 flex flex-col h-full cursor-pointer overflow-hidden">
                <CardHeader className="space-y-4 p-8">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-white font-bold">Code-Sandbox</CardTitle>
                    <Code2 className="w-10 h-10 text-purple-500 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
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

        </ScrollRevealStagger>
      </div>

      {/* =========================================
            PRO PROFESSIONAL MOA SECTION
            ========================================= */}
      <div className="relative pt-24 pb-16 w-full mt-12">
        {/* Ambient Background Glow for emphasis */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[600px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none z-0" />

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
                gradient: "from-purple-900/10 to-emerald-900/20"
              },
              Medium: {
                icon: <Zap className="w-3.5 h-3.5" />,
                badge: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                borderHover: "hover:border-purple-500/50",
                glowHover: "hover:shadow-purple-500/20",
                bgHover: "hover:bg-purple-900/10",
                gradient: "from-purple-900/10 to-amber-900/20"
              },
              Hard: {
                icon: <ShieldAlert className="w-3.5 h-3.5" />,
                badge: "text-rose-400 bg-rose-500/10 border-rose-500/30",
                borderHover: "hover:border-purple-500/50",
                glowHover: "hover:shadow-purple-500/20",
                bgHover: "hover:bg-purple-900/10",
                gradient: "from-purple-900/10 to-rose-900/20"
              }
            };

            return [
              { id: 1, title: "Core Baseline", diff: "Easy" as const },
              { id: 2, title: "Logic Gateway", diff: "Easy" as const },
              { id: 3, title: "Syntax Matrix", diff: "Easy" as const },
              { id: 4, title: "Algorithm Protocol", diff: "Medium" as const },
              { id: 5, title: "Optimization Audit", diff: "Medium" as const },
              { id: 6, title: "System Calibration", diff: "Medium" as const },
              { id: 7, title: "Data Nexus", diff: "Medium" as const },
              { id: 8, title: "Proving Grounds", diff: "Medium" as const },
              { id: 9, title: "Architect's Crucible", diff: "Hard" as const },
              { id: 10, title: "Elite Capstone", diff: "Hard" as const },
            ].map((moa) => {
              const theme = moaConfigs[moa.diff];
              return (
                <ScrollRevealItem key={moa.id}>
                  <div
                    className={`group relative flex flex-col justify-between h-full p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-3xl ${theme.borderHover} ${theme.bgHover} hover:shadow-2xl ${theme.glowHover} transition-all duration-500 cursor-pointer overflow-hidden isolate`}
                  >
                    {/* Subtle gradient background for each card mixing purple USP and difficulty theme */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 bg-gradient-to-br ${theme.gradient}`} />

                    <div>
                      <div className="flex justify-between items-center mb-5">
                        <span className={`flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full border ${theme.badge} shadow-inner`}>
                          {theme.icon} {moa.diff}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono font-bold tracking-wider bg-zinc-950/50 px-2.5 py-1 rounded-md border border-zinc-800/50">
                          <Timer className="w-3 h-3" /> 180m
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-100 group-hover:text-purple-300 mb-2 transition-colors">{moa.title}</h3>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="text-[9px] font-bold text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded uppercase tracking-wider">Quant</span>
                        <span className="text-[9px] font-bold text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded uppercase tracking-wider">Verbal</span>
                        <span className="text-[9px] font-bold text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded uppercase tracking-wider">Code</span>
                      </div>
                    </div>

                    <Link href={`/assessments/${moa.id}`} className="mt-6">
                      <div className={`w-full text-xs font-bold py-2.5 border border-zinc-700 text-zinc-400 group-hover:text-white group-hover:border-purple-500/70 group-hover:bg-purple-600/20 hover:!bg-purple-600 transition-all rounded-xl uppercase tracking-widest text-center flex justify-center items-center gap-2 group/btn`}>
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
                <li><Link href="#" className="hover:text-white transition-colors">About us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Investor Relations</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms & conditions</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Anti-discrimination policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>

            {/* Column 2: For Students */}
            <div className="space-y-6">
              <h4 className="text-white font-semibold text-lg">For Students</h4>
              <ul className="space-y-3 text-sm text-zinc-400 font-medium">
                <li><Link href="/aptitude" className="hover:text-white transition-colors">Aptitude Arena</Link></li>
                <li><Link href="/verbal" className="hover:text-white transition-colors">Verbal League</Link></li>
                <li><Link href="/coding" className="hover:text-white transition-colors">Code Sandbox</Link></li>
                <li><Link href="/assessments" className="hover:text-white transition-colors">Mock Assessments</Link></li>
              </ul>
            </div>

            {/* Column 3: For Universities */}
            <div className="space-y-6">
              <h4 className="text-white font-semibold text-lg">For Universities</h4>
              <ul className="space-y-3 text-sm text-zinc-400 font-medium">
                <li><Link href="#" className="hover:text-white transition-colors">Partner with us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Campus Placements</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact sales</Link></li>
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