"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Layers,
  ArrowRight,
  Network,
  Orbit,
  CircuitBoard
} from "lucide-react";
import {
  ScrollRevealStagger,
  ScrollRevealItem,
} from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";
import { DesignDraftsLogo } from "@/components/ui/ModuleLogos";
import { ModuleHeader } from "@/components/ui/ModuleHeader";

export default function DesignHub() {
  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-100 font-sans relative overflow-x-hidden selection:bg-purple-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_800px_at_50%_0%,rgba(24,24,27,0)_0%,rgba(9,9,11,1)_100%)] pointer-events-none" />

      {/* Floating ambient glows */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="fixed top-0 left-0 w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none z-0"
      />
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-fuchsia-600/10 blur-[150px] rounded-full pointer-events-none z-0"
      />

      <div className="max-w-7xl mx-auto px-6 py-12 md:p-12 relative z-10 flex flex-col h-full">
        <ModuleHeader
          title="Design-Drafts"
          description="Initialize your architecture simulation environment. Select a node in the system diagram below to begin modeling."
          logo={<DesignDraftsLogo className="w-12 h-12 md:w-16 md:h-16 text-purple-500 relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />}
        />

        {/* Unique Cyber-Portal Cards */}
        <ScrollRevealStagger className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 relative z-20 pt-12 pb-24">
          
          {/* High Level Design Portal */}
          <ScrollRevealItem>
            <Link href="/design/hld?mode=hld" className="group block relative w-full h-[550px] outline-none">
              {/* Outer Glowing Holographic Border wrapper */}
              <div className="absolute inset-0 rounded-[3rem] p-[2px] overflow-hidden shadow-2xl transition-all duration-700 group-hover:shadow-[0_0_80px_rgba(168,85,247,0.3)]">
                {/* Smooth Glowing Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-fuchsia-500/20 group-hover:from-purple-400/60 group-hover:via-purple-500/20 group-hover:to-fuchsia-400/60 opacity-60 group-hover:opacity-100 transition-all duration-700" />
                
                {/* Inner Card */}
                <div className="absolute inset-[2px] rounded-[3rem] bg-zinc-950/90 backdrop-blur-3xl overflow-hidden flex flex-col z-10 transition-all duration-700 group-hover:bg-zinc-900/80">
                  
                  {/* Atmospheric Inner Glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(168,85,247,0.15)_0%,transparent_60%)] opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all duration-1000" />
                  
                  {/* Cyber grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Portal Image Area */}
                  <div className="relative flex-1 w-full flex items-center justify-center pt-8">
                    {/* Concentric spinning orbit rings */}
                    <div className="absolute w-64 h-64 rounded-full border-[0.5px] border-purple-500/20 animate-[spin_10s_linear_infinite] group-hover:border-purple-400/60 group-hover:w-80 group-hover:h-80 transition-all duration-1000 ease-out flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#a855f7] absolute -top-1" />
                    </div>
                    <div className="absolute w-52 h-52 rounded-full border border-dashed border-purple-500/20 animate-[spin_15s_linear_infinite_reverse] group-hover:border-purple-300/40 group-hover:animate-[spin_8s_linear_infinite_reverse] transition-all duration-700 flex items-center justify-center">
                      <Orbit className="w-6 h-6 text-purple-400/30 absolute -left-3" />
                    </div>
                    
                    {/* The Core Image */}
                    <div className="relative w-44 h-44 rounded-full bg-zinc-950 border-2 border-purple-900/50 shadow-[0_0_30px_rgba(168,85,247,0.1)] flex items-center justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:border-purple-400 group-hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] z-20">
                      <Image src="/3d-icons/hld.jpg" alt="High Level Design" fill className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 mix-blend-screen grayscale group-hover:grayscale-0 scale-125 group-hover:scale-100" />
                      {/* Hexagonal overlay mask for cyber feel */}
                      <div className="absolute inset-0 bg-purple-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                  </div>

                  {/* Futuristic Data Panel */}
                  <div className="relative z-30 p-8 border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl group-hover:bg-purple-950/20 group-hover:border-purple-500/30 transition-all duration-700">
                    <div className="flex items-center gap-3 mb-4">
                      <Network className="w-5 h-5 text-zinc-500 group-hover:text-purple-400 group-hover:animate-pulse transition-colors duration-500" />
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-purple-300 transition-colors duration-500">Macro Level</span>
                    </div>
                    
                    <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-4 drop-shadow-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-300 transition-all duration-500">
                      High Level <br/> Design
                    </h3>
                    
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 group-hover:text-zinc-300 transition-colors duration-500">
                      Architect distributed systems, orchestrate load balancers, and scale databases for millions of concurrent users.
                    </p>

                    <div className="absolute top-0 right-8 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-10 transition-all duration-700 ease-out">
                      <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.6)] group-hover:rotate-[-45deg] transition-all duration-500">
                        <ArrowRight className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollRevealItem>

          {/* Low Level Design Portal */}
          <ScrollRevealItem>
            <Link href="/design/lld?mode=lld" className="group block relative w-full h-[550px] outline-none">
              {/* Outer Glowing Holographic Border wrapper */}
              <div className="absolute inset-0 rounded-[3rem] p-[2px] overflow-hidden shadow-2xl transition-all duration-700 group-hover:shadow-[0_0_80px_rgba(217,70,239,0.3)]">
                {/* Smooth Glowing Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 via-transparent to-purple-500/20 group-hover:from-fuchsia-400/60 group-hover:via-fuchsia-500/20 group-hover:to-purple-400/60 opacity-60 group-hover:opacity-100 transition-all duration-700" />
                
                {/* Inner Card */}
                <div className="absolute inset-[2px] rounded-[3rem] bg-zinc-950/90 backdrop-blur-3xl overflow-hidden flex flex-col z-10 transition-all duration-700 group-hover:bg-zinc-900/80">
                  
                  {/* Atmospheric Inner Glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(217,70,239,0.15)_0%,transparent_60%)] opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all duration-1000" />
                  
                  {/* Cyber grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Portal Image Area */}
                  <div className="relative flex-1 w-full flex items-center justify-center pt-8">
                    {/* Concentric spinning orbit rings */}
                    <div className="absolute w-64 h-64 rounded-full border-[0.5px] border-fuchsia-500/20 animate-[spin_10s_linear_infinite_reverse] group-hover:border-fuchsia-400/60 group-hover:w-80 group-hover:h-80 transition-all duration-1000 ease-out flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_10px_#d946ef] absolute -bottom-1" />
                    </div>
                    <div className="absolute w-52 h-52 rounded-full border border-dashed border-fuchsia-500/20 animate-[spin_15s_linear_infinite] group-hover:border-fuchsia-300/40 group-hover:animate-[spin_8s_linear_infinite] transition-all duration-700 flex items-center justify-center">
                      <CircuitBoard className="w-6 h-6 text-fuchsia-400/30 absolute -right-3" />
                    </div>
                    
                    {/* The Core Image */}
                    <div className="relative w-44 h-44 rounded-full bg-zinc-950 border-2 border-fuchsia-900/50 shadow-[0_0_30px_rgba(217,70,239,0.1)] flex items-center justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:border-fuchsia-400 group-hover:shadow-[0_0_50px_rgba(217,70,239,0.5)] z-20">
                      <Image src="/3d-icons/lld.jpg" alt="Low Level Design" fill className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 mix-blend-screen grayscale group-hover:grayscale-0 scale-125 group-hover:scale-100" />
                      {/* Hexagonal overlay mask for cyber feel */}
                      <div className="absolute inset-0 bg-fuchsia-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                  </div>

                  {/* Futuristic Data Panel */}
                  <div className="relative z-30 p-8 border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl group-hover:bg-fuchsia-950/20 group-hover:border-fuchsia-500/30 transition-all duration-700">
                    <div className="flex items-center gap-3 mb-4">
                      <Layers className="w-5 h-5 text-zinc-500 group-hover:text-fuchsia-400 group-hover:animate-pulse transition-colors duration-500" />
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-fuchsia-300 transition-colors duration-500">Micro Level</span>
                    </div>
                    
                    <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-4 drop-shadow-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-fuchsia-300 transition-all duration-500">
                      Low Level <br/> Design
                    </h3>
                    
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 group-hover:text-zinc-300 transition-colors duration-500">
                      Implement intricate design patterns, sculpt UML structures, and forge optimized object-oriented architectures.
                    </p>

                    <div className="absolute top-0 right-8 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-10 transition-all duration-700 ease-out">
                      <div className="w-16 h-16 rounded-full bg-fuchsia-600 flex items-center justify-center shadow-[0_0_30px_rgba(217,70,239,0.6)] group-hover:-rotate-45 transition-all duration-500">
                        <ArrowRight className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollRevealItem>

        </ScrollRevealStagger>
      </div>
    </div>
  );
}
