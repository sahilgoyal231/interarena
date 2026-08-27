"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import NodeNetwork from "@/components/ui/NodeNetwork";
import InterArenaLogo from "@/components/ui/Logo";
import { ArrowRight, Play, Terminal, Database, Activity, Zap } from "lucide-react";
import { CognitiveCanvas } from "@/components/ui/CognitiveCanvas";
import { 
  AptSprintsLogo, 
  VerbalLeaguesLogo, 
  CodeSandboxLogo, 
  DesignDraftsLogo, 
  PromptTrialsLogo, 
  GenAIVectorsLogo 
} from "@/components/ui/ModuleLogos";

const ObsidianCard = ({ title, subtitle, Logo, href, delay }: { title: string, subtitle: string, Logo: any, href: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
    className="h-full"
  >
    <Link href={href} className="group relative block h-full bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-8 overflow-hidden hover:border-purple-500/50 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(168,85,247,0.2)] transition-all duration-700">
      {/* Laser reveals */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Giant faded watermark */}
      <div className="absolute -right-12 -bottom-12 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
         <Logo className="w-80 h-80 text-purple-200" />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <Logo className="w-14 h-14 text-purple-500 mb-8 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-110 transition-transform duration-700 origin-left" />
          <h3 className="text-2xl lg:text-3xl font-black text-white mb-3 tracking-tighter">{title}</h3>
          <p className="text-zinc-400 font-light leading-relaxed">{subtitle}</p>
        </div>
        <div className="mt-12 flex items-center gap-2 text-xs font-bold text-zinc-600 group-hover:text-purple-400 transition-colors uppercase tracking-widest">
          Initiate Protocol <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-x-hidden selection:bg-purple-500/30 font-sans">
      {/* Background canvas layer */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
        <NodeNetwork />
      </div>

      <div className="relative z-10 w-full">
        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <InterArenaLogo className="w-40" />
          <Link 
            href="/home" 
            className="hidden md:flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
          >
            System Login <ArrowRight className="w-4 h-4" />
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 xl:grid-cols-2 gap-12 items-center min-h-[85vh]">
          
          {/* Left Text Content */}
          <div className="flex flex-col items-start text-left relative z-10 order-2 xl:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
                <span className="text-purple-400 font-mono text-sm uppercase tracking-widest font-bold">Arena Protocols Online</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-white">
                ENTER THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-600 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                  COGNITIVE MATRIX
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-zinc-400 text-lg md:text-xl max-w-lg mb-12 font-light leading-relaxed border-l-2 border-purple-500/30 pl-6"
            >
              The ultimate high-pressure environment for elite engineers. Master algorithmic execution, scalable architecture, and raw neural intuition.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link 
                href="/home"
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-zinc-900 border border-zinc-700 text-white rounded-full font-bold text-sm tracking-widest uppercase overflow-hidden transition-all hover:scale-[1.02] hover:border-purple-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-3">
                  Initialize Sandbox <Play className="w-4 h-4 fill-purple-400 text-purple-400" />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Right CognitiveCanvas Element */}
          <motion.div 
            className="relative z-10 w-full h-full flex items-center justify-center order-1 xl:order-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <CognitiveCanvas />
          </motion.div>
        </div>

        {/* Telemetry HUD */}
        <div className="w-full border-y border-zinc-800/80 bg-zinc-950/90 backdrop-blur-2xl relative z-20 py-4 shadow-2xl shadow-purple-900/10">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center font-mono text-[10px] md:text-xs text-zinc-500 gap-6">
             <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-500/70" />
                <span>SCENARIOS: 25,241+</span>
             </div>
             <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-500/70" />
                <span>COMPILATION LATENCY: &lt;1.2ms</span>
             </div>
             <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-500/70" />
                <span>EVALUATION ENGINE: ACTIVE</span>
             </div>
             <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500/70" />
                <span className="text-purple-400 font-bold animate-pulse">SYNAPSE CONNECTION STABLE</span>
             </div>
          </div>
        </div>

        {/* The Obsidian Grid */}
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Core Architecture</h2>
            <p className="text-zinc-500 max-w-2xl text-lg">Every module is a monolithic challenge designed to stress-test specific engineering competencies under real-world pressure constraints.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[340px]">
            {/* Row 1 */}
            <div className="md:col-span-2">
              <ObsidianCard 
                title="Code Sandbox" 
                subtitle="Live execution environment for debugging, algorithms, and deep undefined behavior analysis."
                Logo={CodeSandboxLogo}
                href="/coding"
                delay={0.1}
              />
            </div>
            <div className="md:col-span-1">
              <ObsidianCard 
                title="GenAI Vectors" 
                subtitle="Master RAG pipelines, fine-tuning principles, and deep neural embeddings."
                Logo={GenAIVectorsLogo}
                href="/genai"
                delay={0.2}
              />
            </div>

            {/* Row 2 */}
            <div className="md:col-span-1 lg:col-span-3">
               <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="h-full"
              >
                <Link href="/design" className="group relative block h-full bg-zinc-950/90 border border-zinc-800/80 rounded-3xl p-8 overflow-hidden hover:border-purple-500/50 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(168,85,247,0.2)] transition-all duration-700">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  <div className="absolute -right-20 -bottom-20 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-700 pointer-events-none">
                     <DesignDraftsLogo className="w-[500px] h-[500px] text-purple-200" />
                  </div>

                  <div className="relative z-10 flex flex-col justify-center items-center h-full text-center">
                    <DesignDraftsLogo className="w-24 h-24 text-purple-500 mb-8 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] group-hover:scale-110 transition-transform duration-700" />
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">Design Drafts</h3>
                    <p className="text-zinc-400 font-light max-w-xl text-lg mb-8">Architect infinitely scalable High Level and Low Level system constraints across massive distributed data environments.</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-500 group-hover:text-purple-400 transition-colors uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-full">
                      Access Schematics <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Row 3 */}
            <div className="md:col-span-1">
              <ObsidianCard 
                title="Prompt Trials" 
                subtitle="Execute complex Zero-Shot and Chain-of-Thought directives to manipulate LLM outputs."
                Logo={PromptTrialsLogo}
                href="/prompt"
                delay={0.4}
              />
            </div>
            <div className="md:col-span-1">
              <ObsidianCard 
                title="Verbal Leagues" 
                subtitle="Extreme reading comprehension and logic deductions evaluated under strict time protocols."
                Logo={VerbalLeaguesLogo}
                href="/verbal"
                delay={0.5}
              />
            </div>
            <div className="md:col-span-1">
              <ObsidianCard 
                title="Aptitude Sprints" 
                subtitle="Raw mathematical and geometric calculations pushing cognitive speed limits."
                Logo={AptSprintsLogo}
                href="/aptitude"
                delay={0.6}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-800/50 py-12 text-center text-zinc-600 text-xs font-mono tracking-widest uppercase">
          <p>© 2026 InterArena. End of Line.</p>
        </footer>
      </div>
    </div>
  );
}
