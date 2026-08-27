"use client";
import React from "react";
import { motion } from "framer-motion";
import { Code2, Network, Target } from "lucide-react";

export function CognitiveCanvas() {
  return (
    <div className="relative w-full aspect-square md:aspect-video lg:h-[500px] rounded-[2rem] overflow-hidden bg-zinc-950/40 border border-white/5 shadow-2xl backdrop-blur-md">
      {/* Fine Dot Grid Background */}
      <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#a855f7 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Deep Glows */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-purple-600/20 blur-[100px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-fuchsia-600/10 blur-[100px] rounded-full mix-blend-screen" />

      {/* Sweeping Laser Scanner */}
      <motion.div 
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_20px_rgba(168,85,247,1)]"
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 8, ease: "linear", repeat: Infinity }}
      />
      <motion.div 
        className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none"
        animate={{ top: ["-20%", "100%", "-20%"] }}
        transition={{ duration: 8, ease: "linear", repeat: Infinity }}
      />

      {/* SVG Connecting Splines (Using 0-100 coordinates) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ filter: "drop-shadow(0 0 4px rgba(168,85,247,0.8))" }}>
        {/* Node 1 (25, 25) to Node 2 (75, 45) */}
        <motion.path 
          d="M 25 25 Q 50 15 75 45" 
          fill="none" stroke="rgba(168,85,247,0.4)" strokeWidth="0.5" strokeDasharray="1 2"
        />
        <motion.circle r="1" fill="#d946ef">
          <animateMotion dur="4s" repeatCount="indefinite" path="M 25 25 Q 50 15 75 45" />
        </motion.circle>

        {/* Node 2 (75, 45) to Node 3 (45, 80) */}
        <motion.path 
          d="M 75 45 Q 80 70 45 80" 
          fill="none" stroke="rgba(168,85,247,0.4)" strokeWidth="0.5" strokeDasharray="1 2"
        />
        <motion.circle r="1" fill="#d946ef">
          <animateMotion dur="5s" repeatCount="indefinite" path="M 75 45 Q 80 70 45 80" />
        </motion.circle>

        {/* Node 3 (45, 80) to Node 1 (25, 25) */}
        <motion.path 
          d="M 45 80 Q 15 60 25 25" 
          fill="none" stroke="rgba(168,85,247,0.4)" strokeWidth="0.5" strokeDasharray="1 2"
        />
        <motion.circle r="1" fill="#d946ef">
          <animateMotion dur="6s" repeatCount="indefinite" path="M 45 80 Q 15 60 25 25" />
        </motion.circle>
      </svg>

      {/* Node 1: Logic */}
      <motion.div 
        className="absolute left-[25%] top-[25%] -translate-x-1/2 -translate-y-1/2 bg-zinc-950/80 backdrop-blur-xl border border-purple-500/20 p-3 rounded-2xl shadow-2xl flex items-center gap-3 whitespace-nowrap z-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="bg-purple-500/10 p-2 rounded-xl border border-purple-500/30">
           <Code2 className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Node 01</p>
          <p className="text-xs font-black text-white">Algorithmic Core</p>
        </div>
      </motion.div>

      {/* Node 2: Design */}
      <motion.div 
        className="absolute left-[75%] top-[45%] -translate-x-1/2 -translate-y-1/2 bg-zinc-950/80 backdrop-blur-xl border border-blue-500/20 p-3 rounded-2xl shadow-2xl flex items-center gap-3 whitespace-nowrap z-10"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div className="bg-blue-500/10 p-2 rounded-xl border border-blue-500/30">
           <Network className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Node 02</p>
          <p className="text-xs font-black text-white">Distributed Systems</p>
        </div>
      </motion.div>

      {/* Node 3: Execution */}
      <motion.div 
        className="absolute left-[45%] top-[80%] -translate-x-1/2 -translate-y-1/2 bg-zinc-950/80 backdrop-blur-xl border border-emerald-500/20 p-3 rounded-2xl shadow-2xl flex items-center gap-3 whitespace-nowrap z-10"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/30">
           <Target className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Node 03</p>
          <p className="text-xs font-black text-white">Pressure Testing</p>
        </div>
      </motion.div>

      {/* Minimal Floating Terminal Output */}
      <motion.div 
        className="absolute right-6 bottom-6 opacity-60 font-mono text-[9px] md:text-[10px] text-purple-300 leading-loose pointer-events-none text-right"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <p>{">"} alloc_matrix(8096)</p>
        <p>{">"} latency: 0.8ms</p>
        <p>{">"} synapse_link: OK</p>
      </motion.div>
    </div>
  );
}
