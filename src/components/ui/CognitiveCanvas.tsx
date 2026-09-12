"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Code2, Cpu, Zap, Fingerprint, Database } from "lucide-react";

export function CognitiveCanvas() {
  return (
    <div className="relative w-full h-[550px] lg:h-[650px] rounded-[2rem] overflow-hidden flex flex-col font-sans md:translate-x-8 xl:translate-x-12">
      
      {/* Matte Noise Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-linears.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none z-0" />
      
      {/* Very subtle center ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Center: The Mathematical Wireframe Globe */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pb-12 lg:pb-24" style={{ perspective: '1000px' }}>
         <motion.div
            animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="relative w-[350px] h-[350px]"
            style={{ transformStyle: 'preserve-3d' }}
         >
            {/* Longitude lines */}
            {Array.from({ length: 12 }).map((_, i) => (
               <div 
                 key={`lon-${i}`}
                 className="absolute inset-0 rounded-full border border-white/[0.08]"
                 style={{ transform: `rotateY(${i * 15}deg)` }}
               />
            ))}
            
            {/* Latitude lines */}
            {Array.from({ length: 9 }).map((_, i) => {
               const angle = (i + 1) * 18 - 90; // -72 to 72
               const radius = Math.cos(angle * Math.PI / 180);
               const zPos = Math.sin(angle * Math.PI / 180) * 175; // Sphere radius is 175px (350/2)
               return (
                 <div 
                   key={`lat-${i}`}
                   className="absolute rounded-full border border-white/[0.08]"
                   style={{ 
                     top: '50%', left: '50%',
                     width: `${radius * 100}%`, 
                     height: `${radius * 100}%`,
                     transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${zPos}px)`
                   }}
                 />
               );
            })}
         </motion.div>
      </div>

      {/* Edge Fade Mask - creates depth and integrates globe into background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#09090b_70%)] pointer-events-none z-10" />

      {/* Foreground UI Layer */}
      <div className="relative z-20 w-full h-full p-6 lg:p-8 flex flex-col justify-between pointer-events-auto">
         
         {/* Top Bar */}
         <div className="flex justify-between items-start w-full">
            <div className="flex items-center gap-3">
               <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/[0.02]">
                  <Activity className="w-3.5 h-3.5 text-zinc-400" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase leading-none mb-1.5">Live Telemetry</span>
                  <span className="text-xs font-medium text-white tracking-tight leading-none">Global Mapping</span>
               </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.05] px-3 py-1.5 rounded-full backdrop-blur-md">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse shadow-[0_0_8px_#34d399]" />
               <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase">Synchronized</span>
            </div>
         </div>

         {/* Center-Left Floating Elements */}
         <div className="absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3">
            <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl backdrop-blur-md text-zinc-500 hover:text-white transition-colors cursor-pointer group">
               <Cpu className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl backdrop-blur-md text-zinc-500 hover:text-white transition-colors cursor-pointer group">
               <Activity className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl backdrop-blur-md text-zinc-500 hover:text-white transition-colors cursor-pointer group">
               <Database className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
         </div>

         {/* Bottom Data Modules (Borderless Readouts) */}
         <div className="flex flex-col md:flex-row justify-between items-end w-full gap-8 md:gap-4 px-2">
            
            {/* Readout 1 */}
            <div className="flex flex-col justify-end">
               <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-3.5 h-3.5 text-indigo-400/70" />
                  <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase">Global Latency</span>
               </div>
               <div>
                  <div className="text-3xl font-light text-white font-mono tracking-tight">1.04<span className="text-zinc-500 text-sm ml-1">ms</span></div>
                  <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">99.9% Optimal</div>
               </div>
            </div>

            {/* Readout 2 */}
            <div className="flex flex-col justify-end hidden sm:flex">
               <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-3.5 h-3.5 text-purple-400/70" />
                  <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase">Active Threads</span>
               </div>
               <div>
                  <div className="text-3xl font-light text-white font-mono tracking-tight">8,192</div>
                  <div className="text-[10px] text-emerald-400/70 mt-1 uppercase tracking-wider flex items-center gap-1">
                     <Activity className="w-3 h-3" />
                     +12% vs last hour
                  </div>
               </div>
            </div>

            {/* Readout 3 */}
            <div className="flex flex-col justify-end hidden md:flex text-right items-end">
               <div className="flex items-center justify-end gap-2 mb-3">
                  <Fingerprint className="w-3.5 h-3.5 text-emerald-400/70" />
                  <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase">Neural Auth</span>
               </div>
               <div>
                  <div className="text-3xl font-light text-white font-mono tracking-tight">Verified</div>
                  <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">Encrypted Payload</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
