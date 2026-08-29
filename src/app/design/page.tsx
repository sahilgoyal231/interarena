"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Layers,
  Database,
  Braces,
  ArrowRight,
  Server,
  Cloud,
  Network,
  Boxes
} from "lucide-react";
import { motion } from "framer-motion";
import { DesignDraftsLogo } from "@/components/ui/ModuleLogos";
import { ModuleHeader } from "@/components/ui/ModuleHeader";

export default function DesignHub() {
  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans relative overflow-hidden selection:bg-purple-500/30">
      <div className="absolute inset-0 bg-radial-[circle_800px_at_50%_50%] from-zinc-950/0 via-zinc-950/80 to-zinc-950 pointer-events-none" />

      {/* Floating ambient glows */}
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none z-0"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/20 blur-[150px] rounded-full pointer-events-none z-0"
      />

      <div className="max-w-7xl mx-auto px-6 py-12 md:p-12 relative z-10 flex flex-col h-full">
        <ModuleHeader
          title="Design-Drafts"
          description="Initialize your architecture simulation environment. Select a node in the system diagram below to begin modeling."
          logo={<DesignDraftsLogo className="w-12 h-12 md:w-16 md:h-16 text-purple-500 relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />}
        />

        {/* Full-Screen Horizontal Stack Environment */}
        <div className="flex-1 w-full max-w-[1800px] mx-auto py-8 md:py-12 flex flex-col gap-4 md:gap-6 relative z-10">
          
          {/* High Level Design Row */}
          <div className="group flex-1 w-full flex items-stretch gap-4 md:gap-6">
            <div className="w-1.5 rounded-full bg-purple-500 shadow-[0_0_30px_rgba(168,85,247,1)] scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" />
            <Link 
              href="/design/hld?mode=hld" 
              className="flex-1 relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-900/20 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:bg-zinc-900/40 group-hover:border-purple-500/30 group-hover:shadow-[0_0_80px_rgba(168,85,247,0.15)] flex items-center px-6 md:px-16"
            >
              {/* Rich Hover Background Sweep */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(168,85,247,0.1)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
              
              <div className="flex items-center justify-between w-full relative z-10">
                <div className="flex items-center gap-6 md:gap-16">
                  <div className="w-24 h-24 md:w-40 md:h-40 rounded-[2rem] bg-zinc-950 border border-white/5 shadow-2xl flex items-center justify-center shrink-0 overflow-hidden relative transition-all duration-700 ease-out group-hover:scale-105 group-hover:rotate-3 group-hover:border-purple-500/40 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <Image src="/3d-icons/hld.jpg" alt="HLD Architecture" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen grayscale group-hover:grayscale-0" />
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2 md:mb-4">
                      <Network className="w-5 h-5 md:w-6 md:h-6 text-zinc-600 group-hover:text-purple-400 group-hover:animate-pulse transition-colors duration-500" />
                      <span className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-zinc-600 group-hover:text-purple-300 transition-colors duration-500">Macro Architecture</span>
                    </div>
                    <h3 className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-700 group-hover:text-white tracking-tighter transition-colors duration-700 drop-shadow-sm">High Level</h3>
                    <p className="mt-4 text-zinc-500 text-lg md:text-xl max-w-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-out delay-100 hidden md:block">
                      Design distributed systems, load balancers, and scalable databases for millions of concurrent users.
                    </p>
                  </div>
                </div>
                
                <div className="hidden lg:flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out translate-x-12 group-hover:translate-x-0">
                  <span className="text-sm font-mono text-purple-400/70">~/design/hld</span>
                  <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.3)] group-hover:bg-purple-500/20 transition-colors duration-500">
                    <ArrowRight className="w-8 h-8 text-purple-300 -translate-x-1 group-hover:translate-x-1 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Low Level Design Row */}
          <div className="group flex-1 w-full flex items-stretch gap-4 md:gap-6">
            <div className="w-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,1)] scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" />
            <Link 
              href="/design/lld?mode=lld" 
              className="flex-1 relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-900/20 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:bg-zinc-900/40 group-hover:border-fuchsia-500/30 group-hover:shadow-[0_0_80px_rgba(217,70,239,0.15)] flex items-center px-6 md:px-16"
            >
              {/* Rich Hover Background Sweep */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(217,70,239,0.1)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
              
              <div className="flex items-center justify-between w-full relative z-10">
                <div className="flex items-center gap-6 md:gap-16">
                  <div className="w-24 h-24 md:w-40 md:h-40 rounded-[2rem] bg-zinc-950 border border-white/5 shadow-2xl flex items-center justify-center shrink-0 overflow-hidden relative transition-all duration-700 ease-out group-hover:scale-105 group-hover:-rotate-3 group-hover:border-fuchsia-500/40 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <Image src="/3d-icons/lld.jpg" alt="LLD Architecture" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen grayscale group-hover:grayscale-0" />
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2 md:mb-4">
                      <Layers className="w-5 h-5 md:w-6 md:h-6 text-zinc-600 group-hover:text-fuchsia-400 group-hover:animate-pulse transition-colors duration-500" />
                      <span className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-zinc-600 group-hover:text-fuchsia-300 transition-colors duration-500">Micro Components</span>
                    </div>
                    <h3 className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-700 group-hover:text-white tracking-tighter transition-colors duration-700 drop-shadow-sm">Low Level</h3>
                    <p className="mt-4 text-zinc-500 text-lg md:text-xl max-w-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-out delay-100 hidden md:block">
                      Implement design patterns, UML structures, and optimized object-oriented component architecture.
                    </p>
                  </div>
                </div>
                
                <div className="hidden lg:flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out translate-x-12 group-hover:translate-x-0">
                  <span className="text-sm font-mono text-fuchsia-400/70">~/design/lld</span>
                  <div className="w-20 h-20 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(217,70,239,0.3)] group-hover:bg-fuchsia-500/20 transition-colors duration-500">
                    <ArrowRight className="w-8 h-8 text-fuchsia-300 -translate-x-1 group-hover:translate-x-1 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
