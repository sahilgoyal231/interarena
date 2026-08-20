"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  TerminalSquare,
  Sparkles,
  Cpu,
  BrainCircuit,
  Zap,
  Activity,
  Layers,
  Network
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PromptHub() {
  const [hoveredBlock, setHoveredBlock] = useState<"pe" | "fundamentals" | null>(null);

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans relative overflow-hidden selection:bg-purple-500/30">
      {/* Subtle Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500/10 via-transparent to-transparent transition-opacity duration-1000 ${hoveredBlock === 'pe' ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b from-fuchsia-500/10 via-transparent to-transparent transition-opacity duration-1000 ${hoveredBlock === 'fundamentals' ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:p-12 relative z-10 flex flex-col h-full">
        {/* Header Section */}
        <div className="border-b border-zinc-800/80 pb-8 relative shrink-0">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute bottom-0 left-0 h-px bg-linear-to-r from-purple-500 via-fuchsia-500 to-transparent"
          />
          <Link
            href="/home"
            className="text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 group w-max"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white mt-6 tracking-tighter flex items-center gap-4"
          >
            <div className="relative">
              <BrainCircuit className="w-12 h-12 md:w-16 md:h-16 text-purple-500 relative z-10" />
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-purple-500 blur-xl opacity-50 z-0"
              />
            </div>
            Prompt-Trials
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl mt-4 max-w-2xl leading-relaxed font-light"
          >
            Command the terminal. Master the art of communicating with Large Language Models and engineering optimal outputs.
          </motion.p>
        </div>

        {/* Dual-Hemisphere Vertical Pillar Architecture */}
        <div className="flex-1 w-full max-w-[1800px] mx-auto py-8 md:py-12 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 relative z-10 items-stretch">
          
          {/* Left Hemisphere: Prompt Engineering */}
          <Link 
            href="/prompt/engineering?mode=pe"
            onMouseEnter={() => setHoveredBlock("pe")}
            onMouseLeave={() => setHoveredBlock(null)}
            className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-900/20 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-zinc-900/40 hover:border-purple-500/30 hover:shadow-[0_0_80px_rgba(168,85,247,0.15)] flex flex-col"
          >
            {/* Rich Hover Sweep */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(168,85,247,0.1)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
            
            {/* Top Core (Image, Title, Desc) */}
            <div className="p-8 md:p-12 flex-1 flex flex-col relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-purple-500/10 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0 overflow-hidden relative group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-700">
                  <Image src="/3d-icons/pe.jpg" alt="Prompt Engineering" fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity mix-blend-screen" />
                </div>
                <div className="bg-purple-500/10 text-purple-400 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border border-purple-500/20">
                  Zero-Shot / Few-Shot
                </div>
              </div>
              
              <div className="mt-auto">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-6 group-hover:text-purple-200 transition-colors duration-500">Prompt Eng.</h2>
                <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-lg font-light">Master techniques for optimal token usage, structural control, and extracting advanced reasoning from foundational models.</p>
              </div>
            </div>

            {/* Bottom Embedded Telemetry Console */}
            <div className="bg-zinc-950/60 p-8 md:p-12 border-t border-white/5 relative z-10 transition-colors duration-700 group-hover:bg-purple-950/20">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 text-zinc-500 font-mono text-sm uppercase tracking-widest shrink-0">
                  <Activity className="w-5 h-5 text-purple-500/50 group-hover:text-purple-400 transition-colors duration-500" /> Token Telemetry
                </div>
                <div className="flex items-center gap-2 text-purple-400 font-bold tracking-widest text-sm uppercase opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  Initialize <ArrowRight className="w-5 h-5" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-mono font-bold tracking-wider">
                    <span className="text-zinc-400">Completion</span>
                    <span className="text-zinc-500 group-hover:text-purple-300 transition-colors">842 / 2048</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-zinc-700 group-hover:w-[40%] group-hover:bg-purple-500 group-hover:shadow-[0_0_15px_rgba(168,85,247,1)] rounded-full transition-all duration-1000 ease-out" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-mono font-bold tracking-wider">
                    <span className="text-zinc-400">Context Window</span>
                    <span className="text-zinc-500 group-hover:text-purple-300 transition-colors">12k / 128k</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-zinc-700 group-hover:w-[15%] group-hover:bg-purple-400 group-hover:shadow-[0_0_15px_rgba(192,132,252,1)] rounded-full transition-all duration-1000 delay-100 ease-out" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Right Hemisphere: LLM Fundamentals */}
          <Link 
            href="/prompt/fundamentals?mode=fundamentals"
            onMouseEnter={() => setHoveredBlock("fundamentals")}
            onMouseLeave={() => setHoveredBlock(null)}
            className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-900/20 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-zinc-900/40 hover:border-fuchsia-500/30 hover:shadow-[0_0_80px_rgba(217,70,239,0.15)] flex flex-col"
          >
            {/* Rich Hover Sweep */}
            <div className="absolute inset-0 bg-[linear-gradient(225deg,rgba(217,70,239,0.1)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
            
            {/* Top Core (Image, Title, Desc) */}
            <div className="p-8 md:p-12 flex-1 flex flex-col relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-fuchsia-500/10 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0 overflow-hidden relative group-hover:scale-105 group-hover:rotate-3 transition-transform duration-700">
                  <Image src="/3d-icons/fundamentals.jpg" alt="LLM Fundamentals" fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity mix-blend-screen" />
                </div>
                <div className="bg-fuchsia-500/10 text-fuchsia-400 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border border-fuchsia-500/20">
                  Architecture
                </div>
              </div>
              
              <div className="mt-auto">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-6 group-hover:text-fuchsia-300 transition-colors duration-500">LLMs</h2>
                <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-lg font-light">Explore tokenization, multi-head attention mechanisms, and the deep inner workings of the Transformer architecture.</p>
              </div>
            </div>

            {/* Bottom Embedded Neural Matrix */}
            <div className="bg-zinc-950/60 p-8 md:p-12 border-t border-white/5 relative z-10 transition-colors duration-700 group-hover:bg-fuchsia-950/20">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 text-zinc-500 font-mono text-sm uppercase tracking-widest shrink-0">
                  <Network className="w-5 h-5 text-fuchsia-500/50 group-hover:text-fuchsia-400 transition-colors duration-500" /> Neural Matrix
                </div>
                <div className="flex items-center gap-2 text-fuchsia-400 font-bold tracking-widest text-sm uppercase opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  Initialize <ArrowRight className="w-5 h-5" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-center justify-between p-4 md:p-5 rounded-2xl border bg-zinc-900/50 border-white/5 group-hover:bg-fuchsia-500/10 group-hover:border-fuchsia-500/30 group-hover:shadow-[0_4px_20px_rgba(217,70,239,0.1)] transition-all duration-700">
                  <div className="flex items-center gap-4">
                    <Layers className="w-6 h-6 text-zinc-600 group-hover:text-fuchsia-400 transition-colors" />
                    <span className="font-mono text-xs md:text-sm font-bold tracking-wide text-zinc-500 group-hover:text-zinc-200 transition-colors">Attention Heads</span>
                  </div>
                  <span className="font-mono text-xl md:text-2xl font-black text-zinc-600 group-hover:text-fuchsia-400 group-hover:drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] transition-all">96</span>
                </div>
                
                <div className="flex items-center justify-between p-4 md:p-5 rounded-2xl border bg-zinc-900/50 border-white/5 group-hover:bg-fuchsia-500/10 group-hover:border-fuchsia-500/30 group-hover:shadow-[0_4px_20px_rgba(217,70,239,0.1)] transition-all duration-700">
                  <div className="flex items-center gap-4">
                    <Cpu className="w-6 h-6 text-zinc-600 group-hover:text-fuchsia-400 transition-colors" />
                    <span className="font-mono text-xs md:text-sm font-bold tracking-wide text-zinc-500 group-hover:text-zinc-200 transition-colors">Hidden Layers</span>
                  </div>
                  <span className="font-mono text-xl md:text-2xl font-black text-zinc-600 group-hover:text-fuchsia-400 group-hover:drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] transition-all">12k</span>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
