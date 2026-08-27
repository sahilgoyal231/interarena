"use client";
import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Cpu, Activity } from "lucide-react";

export function HeroNexus() {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center pointer-events-none perspective-[1200px]">
      {/* Ambient Deep Core Glow */}
      <div className="absolute w-[60%] h-[60%] bg-purple-900/20 blur-[100px] rounded-full z-0 animate-[pulse_6s_ease-in-out_infinite]" />
      
      {/* Central Monolith Orb */}
      <motion.div 
        className="absolute z-10 w-28 h-28 rounded-full border border-purple-500/20 bg-zinc-950/90 backdrop-blur-2xl flex items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.3)] overflow-hidden"
        animate={{ rotateZ: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-16 h-16 rounded-full bg-linear-to-tr from-purple-600/40 to-indigo-500/10 blur-[12px] opacity-80 animate-pulse" />
        <div className="absolute inset-1 border border-zinc-800/80 rounded-full border-t-purple-500/50 rotate-45" />
        <div className="absolute inset-3 border border-zinc-800/80 rounded-full border-b-purple-500/50 -rotate-45" />
        <div className="absolute inset-5 border border-zinc-800/80 rounded-full border-l-purple-500/50 rotate-90" />
      </motion.div>

      {/* 3D Orbital Rings */}
      <motion.div
        className="absolute z-0 w-64 h-64 rounded-full border border-zinc-800/50 border-r-purple-500/30 border-t-purple-500/30"
        style={{ rotateX: 65, rotateY: 25 }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute z-0 w-80 h-80 rounded-full border border-zinc-800/50 border-l-purple-500/20 border-b-purple-500/20"
        style={{ rotateX: -55, rotateY: 45 }}
        animate={{ rotateZ: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute z-0 w-96 h-96 rounded-full border border-zinc-800/50 border-r-purple-500/10 border-t-purple-500/10"
        style={{ rotateX: 75, rotateY: -15 }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Obsidian Stat Cards */}
      
      {/* Top Right Card: Cognitive Load */}
      <motion.div 
        className="absolute top-12 right-0 lg:-right-8 z-20 bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/60 p-4 rounded-2xl shadow-2xl shadow-purple-900/20 w-48"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-xl bg-purple-950/40 flex items-center justify-center border border-purple-500/20 shadow-inner">
            <BrainCircuit className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Cognitive Load</p>
            <p className="text-sm font-black text-zinc-200">Optimized</p>
          </div>
        </div>
        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"
            initial={{ width: "20%" }}
            animate={{ width: ["20%", "85%", "40%", "90%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Bottom Left Card: Neural Latency */}
      <motion.div 
        className="absolute bottom-16 left-0 lg:-left-8 z-30 bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/60 p-4 rounded-2xl shadow-2xl shadow-purple-900/20 w-56"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <Cpu className="w-3 h-3" /> Neural Latency
          </p>
          <span className="text-[9px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-black border border-purple-500/20">
            2.4ms
          </span>
        </div>
        {/* Fake wave graph */}
        <div className="flex items-end gap-1 h-8">
          {[40, 70, 45, 90, 60, 85, 30, 50, 100, 60, 40, 80].map((h, i) => (
            <motion.div 
              key={i} 
              className="w-full bg-purple-500/40 rounded-t-sm" 
              initial={{ height: `${h}%` }}
              animate={{ height: [`${h}%`, `${h * 0.4}%`, `${h}%`] }}
              transition={{ duration: 2 + i * 0.15, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom Right Card: Status Indicator */}
      <motion.div 
        className="absolute bottom-28 right-4 lg:right-2 z-20 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/60 p-3 px-4 rounded-xl shadow-2xl shadow-purple-900/20 flex items-center gap-3"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
        </div>
        <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Live Synapse</p>
      </motion.div>
      
      {/* Top Left Card: Performance Metrics */}
      <motion.div 
        className="absolute top-20 left-4 lg:left-0 z-20 bg-zinc-950/80 backdrop-blur-xl border border-purple-500/30 p-3 rounded-xl shadow-2xl shadow-purple-900/20 flex items-center gap-3"
        animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
           <Activity className="w-3 h-3 text-purple-400" />
        </div>
        <div>
          <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Global Rank</p>
          <p className="text-xs font-black text-purple-300 tracking-wide">Top 1%</p>
        </div>
      </motion.div>

    </div>
  );
}
