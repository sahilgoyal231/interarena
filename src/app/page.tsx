"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import NodeNetwork from "@/components/ui/NodeNetwork";
import InterArenaLogo from "@/components/ui/Logo";
import { ArrowRight, Code2, BrainCircuit, Target, Network, Play, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-x-hidden selection:bg-purple-500/30">
      {/* Background canvas layer */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none mix-blend-screen">
        <NodeNetwork />
      </div>

      <div className="relative z-10 w-full">
        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <InterArenaLogo className="w-40" />
          <Link 
            href="/home" 
            className="hidden md:flex items-center gap-2 text-sm font-bold text-zinc-300 hover:text-white transition-colors"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            <div className="absolute inset-0 bg-purple-600/30 blur-[100px] rounded-full z-0 animate-pulse" />
            <h1 style={{ fontFamily: "var(--font-bodoni-moda)" }} className="relative z-10 text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-8">
              Master the<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-fuchsia-500 to-purple-600">
                Interview Matrix
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-zinc-400 text-lg md:text-2xl max-w-2xl mb-12 font-light leading-relaxed"
          >
            Enter the ultimate arena for developers. Conquer real-time coding, system design, and GenAI gauntlets under pressure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Link 
              href="/home"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105 shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(217,70,239,0.6)]"
            >
              <div className="absolute inset-0 bg-linear-to-r from-purple-400 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 group-hover:text-white transition-colors flex items-center gap-2">
                Enter the Arena <Play className="w-5 h-5 fill-current" />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Infinite Marquee */}
        <div className="w-full bg-purple-900/10 border-y border-purple-500/20 py-4 overflow-hidden backdrop-blur-md relative z-20">
          <div className="flex whitespace-nowrap animate-marquee items-center text-sm md:text-base font-bold text-purple-300/80 uppercase tracking-[0.2em]">
            {/* Duplicated for smooth scrolling */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="mx-8">25,000+ Questions</span>
                <Sparkles className="w-4 h-4 mx-4 text-fuchsia-500" />
                <span className="mx-8">Real-Time Compilation</span>
                <Sparkles className="w-4 h-4 mx-4 text-fuchsia-500" />
                <span className="mx-8">System Design Architecture</span>
                <Sparkles className="w-4 h-4 mx-4 text-fuchsia-500" />
                <span className="mx-8">GenAI Latent Space</span>
                <Sparkles className="w-4 h-4 mx-4 text-fuchsia-500" />
                <span className="mx-8">Aptitude Sprints</span>
                <Sparkles className="w-4 h-4 mx-4 text-fuchsia-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Cell 1: Code Sandbox */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden group hover:border-purple-500/50 transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <div>
                  <Code2 className="w-12 h-12 text-purple-400 mb-6" />
                  <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Code Sandbox</h3>
                  <p className="text-zinc-400 text-lg">Live execution environment for debugging and output prediction.</p>
                </div>
                {/* Mock Code Block */}
                <div className="bg-black/50 border border-zinc-800 rounded-xl p-4 font-mono text-sm text-zinc-300 w-3/4 opacity-80 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 shadow-xl">
                  <div className="text-purple-400">function <span className="text-blue-400">execute</span>() {'{'}</div>
                  <div className="pl-4 text-green-400">return "Compilation Success";</div>
                  <div>{'}'}</div>
                </div>
              </div>
            </motion.div>

            {/* Cell 2: GenAI Gauntlets */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden group hover:border-fuchsia-500/50 transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-linear-to-br from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <div>
                  <BrainCircuit className="w-12 h-12 text-fuchsia-400 mb-6" />
                  <h3 className="text-3xl font-black text-white mb-2 tracking-tight">GenAI Gauntlets</h3>
                  <p className="text-zinc-400 text-lg">Master RAG and Prompt Engineering.</p>
                </div>
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-2xl group-hover:bg-fuchsia-500/40 transition-colors duration-500" />
              </div>
            </motion.div>

            {/* Cell 3: Design Drafts */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-colors duration-500"
            >
               <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <div>
                  <Network className="w-12 h-12 text-blue-400 mb-6" />
                  <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Design Drafts</h3>
                  <p className="text-zinc-400 text-lg">Architect scalable HLD and LLD systems.</p>
                </div>
              </div>
            </motion.div>

            {/* Cell 4: Aptitude & Verbal */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden group hover:border-emerald-500/50 transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <div>
                  <Target className="w-12 h-12 text-emerald-400 mb-6" />
                  <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Time-Based Sprints</h3>
                  <p className="text-zinc-400 text-lg">Push your cognitive limits with Aptitude and Verbal leagues.</p>
                </div>
                <div className="flex items-center gap-4 text-emerald-400 font-mono text-2xl group-hover:scale-110 transform origin-left transition-transform duration-500">
                  <span className="bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 shadow-inner">14:59</span>
                  <span className="text-sm font-sans uppercase tracking-widest text-emerald-500/60 font-bold">Time Remaining</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-800 py-8 text-center text-zinc-500 text-sm font-bold tracking-widest uppercase">
          <p>© 2026 InterArena. Master the Matrix.</p>
        </footer>
      </div>
    </div>
  );
}
