"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Server, ArrowRight, Code, Binary } from "lucide-react";
import { motion } from "framer-motion";
import { TechSuitesLogo } from "@/components/ui/TechSuitesLogo";

function TiltCard({ children, href }: { children: React.ReactNode, href: string }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0, px: 50, py: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        setMousePos({ x, y, px, py });
    };

    return (
        <Link href={href} className="block h-full group outline-none" style={{ perspective: "1500px" }}>
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0, px: 50, py: 50 }); }}
                animate={{
                    rotateY: isHovered ? mousePos.x * 12 : 0,
                    rotateX: isHovered ? -mousePos.y * 12 : 0,
                    scale: isHovered ? 1.02 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
                style={{ transformStyle: "preserve-3d" }}
                className="h-full relative rounded-[2.5rem] bg-[#030303] border border-white/[0.04] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:border-purple-500/40 transition-colors duration-500 flex flex-col justify-between p-8 md:p-12"
            >
                {/* Glare Sheen Effect - Subtle & Professional */}
                <motion.div 
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay"
                    style={{
                        background: `radial-gradient(circle at ${mousePos.px}% ${mousePos.py}%, rgba(255,255,255,0.08) 0%, transparent 60%)`
                    }}
                />
                
                {/* Spotlight / Accent background - Deep & Rich */}
                <motion.div 
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at ${mousePos.px}% ${mousePos.py}%, rgba(168, 85, 247, 0.12) 0%, transparent 70%)`
                    }}
                />

                <div className="relative z-10 flex flex-col h-full pointer-events-none" style={{ transform: "translateZ(40px)" }}>
                    {children}
                </div>
            </motion.div>
        </Link>
    );
}

export default function TechSuitesObsidian() {
    return (
        <div className="h-screen bg-zinc-950 text-zinc-100 font-sans relative overflow-hidden selection:bg-purple-500/30 flex flex-col">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-linears.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0" />
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.1, 0.03] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 blur-[200px] rounded-full pointer-events-none z-0"
            />

            <div className="max-w-7xl mx-auto px-6 py-8 md:p-12 relative z-10 flex flex-col h-full w-full">
                
                {/* Standard Header Section */}
                <div className="border-b border-zinc-800/80 pb-8 relative shrink-0">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute bottom-0 left-0 h-px bg-linear-to-r from-purple-500 via-purple-400 to-transparent"
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
                            <TechSuitesLogo className="w-12 h-12 md:w-16 md:h-16 text-purple-500 relative z-10" />
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-purple-500 blur-xl opacity-50 z-0"
                            />
                        </div>
                        Tech-Suites
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 text-lg md:text-xl mt-4 max-w-2xl leading-relaxed"
                    >
                        Master the foundational principles of computer science and software design through rigorous, dynamically generated assessments.
                    </motion.p>
                </div>

                {/* The "Obsidian Monolith" Cards Container */}
                <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 pt-10 relative z-10 min-h-0 pb-8">
                    
                    {/* CS-Core Monolith */}
                    <TiltCard href="/tech-suites/CS-Core">
                        {/* Massive Abstract Watermark - Deep & Subtle */}
                        <Binary className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] text-white/[0.02] group-hover:text-purple-500/[0.08] group-hover:-rotate-12 transition-all duration-1000 ease-out" />

                        {/* Top Section */}
                        <div className="flex justify-between items-start pointer-events-auto">
                            <span className="text-zinc-700 font-mono text-2xl font-black tracking-[0.2em] group-hover:text-purple-500 transition-colors duration-500">
                                01
                            </span>
                            <div className="w-14 h-14 rounded-full border border-white/[0.05] flex items-center justify-center group-hover:bg-purple-500/10 group-hover:border-purple-500/40 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500">
                                <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-purple-400 group-hover:-rotate-45 transition-all duration-500" />
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="mt-auto pointer-events-auto">
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-zinc-300 tracking-tighter mb-6 group-hover:text-white transition-colors duration-500">
                                CS-Core
                            </h2>
                            <p className="text-zinc-500 text-lg md:text-xl font-light leading-relaxed max-w-sm group-hover:text-zinc-400 transition-colors duration-500">
                                Foundation of system architectures. Master operating systems, networking models, and data persistence.
                            </p>
                        </div>
                    </TiltCard>

                    {/* Programming Fundas Monolith */}
                    <TiltCard href="/tech-suites/Prog-Fundas">
                        {/* Massive Abstract Watermark - Deep & Subtle */}
                        <Code className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] text-white/[0.02] group-hover:text-purple-500/[0.08] group-hover:rotate-12 transition-all duration-1000 ease-out" />

                        {/* Top Section */}
                        <div className="flex justify-between items-start pointer-events-auto">
                            <span className="text-zinc-700 font-mono text-2xl font-black tracking-[0.2em] group-hover:text-purple-500 transition-colors duration-500">
                                02
                            </span>
                            <div className="w-14 h-14 rounded-full border border-white/[0.05] flex items-center justify-center group-hover:bg-purple-500/10 group-hover:border-purple-500/40 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500">
                                <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-purple-400 group-hover:-rotate-45 transition-all duration-500" />
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="mt-auto pointer-events-auto">
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-zinc-300 tracking-tighter mb-6 group-hover:text-white transition-colors duration-500">
                                Programming <br className="hidden lg:block" /> Fundas
                            </h2>
                            <p className="text-zinc-500 text-lg md:text-xl font-light leading-relaxed max-w-sm group-hover:text-zinc-400 transition-colors duration-500">
                                Software implementation paradigms. Master object-oriented design, execution environments, and clean code.
                            </p>
                        </div>
                    </TiltCard>

                </div>
            </div>
        </div>
    );
}
