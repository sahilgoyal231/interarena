"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import {
  Cpu,
  ArrowRight,
  ChevronRight,
  DatabaseZap,
  Network,
  Binary,
  BrainCircuit,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export default function GenAIHub() {
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans relative overflow-x-hidden selection:bg-purple-500/30">
      
      {/* Dimensional Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-linears.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0" />
      
      {/* Central Latent Glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none z-0"
      />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Navigation Breadcrumb & Page Header */}
        <div className="border-b border-zinc-800/80 pb-8 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-purple-500 via-fuchsia-500 to-transparent"
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
              <Cpu className="w-12 h-12 md:w-16 md:h-16 text-purple-500 relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-purple-500 blur-xl opacity-50 z-0"
              />
            </div>
            GenAI-Gauntlets
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl mt-4 max-w-2xl leading-relaxed font-light"
          >
            Navigate the latent space. Select a multi-dimensional vector embedding path below to initiate your generative learning sequence.
          </motion.p>
        </div>

        {/* Isometric Vector Space Grid */}
        <div 
          className="w-full py-12 md:py-20"
          style={{ perspective: "2000px" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center justify-center max-w-5xl mx-auto" style={{ transformStyle: "preserve-3d" }}>
            
            {/* 
              LEFT ISOMETRIC PANEL (AI Basics) 
              Angles in: rotateY(25deg) rotateX(10deg)
            */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.23, 1, 0.32, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Link 
                href="/genai/basics?mode=basics" 
                className="group block outline-none h-[500px]"
                onMouseEnter={() => { if (leftCardRef.current) leftCardRef.current.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)"; }}
                onMouseLeave={() => { if (leftCardRef.current) leftCardRef.current.style.transform = "rotateY(25deg) rotateX(10deg) scale(0.95)"; }}
              >
                <div 
                  ref={leftCardRef}
                  className="relative w-full h-[500px] rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-[20px_20px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden flex flex-col group-hover:bg-zinc-900/60 group-hover:border-purple-500/40 group-hover:shadow-[0_0_80px_rgba(168,85,247,0.2)]"
                  style={{ transform: "rotateY(25deg) rotateX(10deg) scale(0.95)" }}
                >
                  {/* Laser Scan Line Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent h-[20%] w-full -translate-y-[100%] group-hover:animate-scan z-0" />
                  
                  {/* Neon Grid Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="p-10 flex flex-col h-full relative z-10">
                    <div className="flex justify-between items-start mb-auto">
                      <div className="w-24 h-24 rounded-2xl bg-purple-500/10 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0 overflow-hidden relative transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3">
                        <Image src="/3d-icons/basics.jpg" alt="AI Basics" fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity mix-blend-screen" />
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-purple-500/20">
                          Vector Node: Alpha
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono font-bold tracking-wider">
                          <Binary className="w-3.5 h-3.5" /> 256-Dim
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 group-hover:text-purple-200 transition-colors duration-500 flex items-center gap-3">
                        AI Basics
                        <ChevronRight className="w-8 h-8 text-purple-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                      </h3>
                      <p className="text-zinc-400 text-lg leading-relaxed font-light">
                        Core machine learning concepts, simple neural networks, and foundational deep learning architectures.
                      </p>
                    </div>

                    <div className="mt-8 flex items-center gap-4 text-xs font-mono font-bold tracking-widest uppercase text-zinc-500">
                      <div className="flex items-center gap-2 group-hover:text-purple-400 transition-colors duration-500">
                        <BrainCircuit className="w-4 h-4" /> ML Fundamentals
                      </div>
                      <div className="h-1 w-1 bg-zinc-700 rounded-full" />
                      <div className="flex items-center gap-2 group-hover:text-purple-400 transition-colors duration-500 delay-75">
                        <Network className="w-4 h-4" /> Deep Learning
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* 
              RIGHT ISOMETRIC PANEL (Advanced GenAI) 
              Angles in: rotateY(-25deg) rotateX(10deg)
            */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.23, 1, 0.32, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Link 
                href="/genai/advanced?mode=advanced" 
                className="group block outline-none h-[500px]"
                onMouseEnter={() => { if (rightCardRef.current) rightCardRef.current.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)"; }}
                onMouseLeave={() => { if (rightCardRef.current) rightCardRef.current.style.transform = "rotateY(-25deg) rotateX(10deg) scale(0.95)"; }}
              >
                <div 
                  ref={rightCardRef}
                  className="relative w-full h-[500px] rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-[-20px_20px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden flex flex-col group-hover:bg-zinc-900/60 group-hover:border-fuchsia-500/40 group-hover:shadow-[0_0_80px_rgba(217,70,239,0.2)]"
                  style={{ transform: "rotateY(-25deg) rotateX(10deg) scale(0.95)" }}
                >
                  {/* Laser Scan Line Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-500/20 to-transparent h-[20%] w-full -translate-y-[100%] group-hover:animate-scan z-0" />
                  
                  {/* Neon Grid Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="p-10 flex flex-col h-full relative z-10">
                    <div className="flex justify-between items-start mb-auto">
                      <div className="w-24 h-24 rounded-2xl bg-fuchsia-500/10 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0 overflow-hidden relative transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
                        <Image src="/3d-icons/advanced.jpg" alt="Advanced GenAI" fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity mix-blend-screen" />
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-fuchsia-500/20">
                          Vector Node: Omega
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono font-bold tracking-wider">
                          <Binary className="w-3.5 h-3.5" /> 1536-Dim
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 group-hover:text-fuchsia-200 transition-colors duration-500 flex items-center gap-3">
                        GenAI
                        <ChevronRight className="w-8 h-8 text-fuchsia-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                      </h3>
                      <p className="text-zinc-400 text-lg leading-relaxed font-light">
                        RAG architectures, vector databases, multi-modal embeddings, and fine-tuning mechanics.
                      </p>
                    </div>

                    <div className="mt-8 flex items-center gap-4 text-xs font-mono font-bold tracking-widest uppercase text-zinc-500">
                      <div className="flex items-center gap-2 group-hover:text-fuchsia-400 transition-colors duration-500">
                        <DatabaseZap className="w-4 h-4" /> Vector DBs
                      </div>
                      <div className="h-1 w-1 bg-zinc-700 rounded-full" />
                      <div className="flex items-center gap-2 group-hover:text-fuchsia-400 transition-colors duration-500 delay-75">
                        <Sparkles className="w-4 h-4" /> Embeddings
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
