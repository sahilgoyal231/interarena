"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, TerminalSquare, Network, Cpu, Database } from "lucide-react";
import { motion } from "framer-motion";
import { PromptTrialsLogo } from "@/components/ui/ModuleLogos";
import { ModuleHeader } from "@/components/ui/ModuleHeader";

// ==========================================
// SCRAMBLE TEXT CYPHER HOOK
// ==========================================
const useScrambleText = (text: string, isHovered: boolean) => {
    const [displayText, setDisplayText] = useState(text);
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

    useEffect(() => {
        if (!isHovered) {
            setTimeout(() => setDisplayText(text), 0);
            return;
        }

        let iteration = 0;
        let interval: NodeJS.Timeout;

        const startScramble = () => {
            clearInterval(interval);
            interval = setInterval(() => {
                setDisplayText( 
                    text.split("").map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return characters[Math.floor(Math.random() * characters.length)];
                    }).join("")
                );

                if (iteration >= text.length) {
                    clearInterval(interval);
                }
                iteration += 1 / 3; 
            }, 30);
        };

        startScramble();

        return () => clearInterval(interval);
    }, [isHovered, text]);

    return displayText;
};


// ==========================================
// CYBERNETIC TERMINAL HUD
// ==========================================
interface PanelData {
    id: number;
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
}

function CyberTerminal({ panel }: { panel: PanelData }) {
    const [isHovered, setIsHovered] = useState(false);
    const scrambledTitle = useScrambleText(panel.title, isHovered);

    return (
        <Link 
            href={panel.href} 
            className="group relative w-full h-[36rem] block outline-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* The Bounding Box / Corner Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-zinc-700 group-hover:border-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300 z-20" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-zinc-700 group-hover:border-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300 z-20" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-zinc-700 group-hover:border-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300 z-20" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-zinc-700 group-hover:border-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300 z-20" />
            
            {/* Main Terminal Screen */}
            <div className="absolute inset-1 border border-white/[0.03] bg-zinc-950/40 backdrop-blur-md overflow-hidden flex flex-col z-10 transition-colors duration-500 group-hover:bg-purple-950/10">
                
                {/* HUD Scanning Laser */}
                <motion.div 
                    animate={{ 
                        top: isHovered ? ["0%", "100%", "0%"] : "0%", 
                        opacity: isHovered ? [0, 1, 0, 1, 0] : 0 
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,1)] z-30 pointer-events-none"
                />

                {/* Animated Grid Background */}
                <div 
                    className="absolute inset-0 z-0 opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.2) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Content Area */}
                <div className="relative z-20 h-full flex flex-col p-10 font-mono justify-between">
                    
                    {/* Top Status Bar */}
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                        <div className="flex items-center gap-3 text-xs text-zinc-500 group-hover:text-purple-400 transition-colors duration-300">
                            <span className="w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-purple-500 group-hover:animate-pulse" />
                            <span>SYS.NODE.{panel.id.toString().padStart(3, '0')}</span>
                        </div>
                        <div className="text-xs font-bold text-zinc-600 group-hover:text-purple-400 transition-colors duration-300">
                            {isHovered ? "[ ONLINE ]" : "[ OFFLINE ]"}
                        </div>
                    </div>

                    {/* Middle Content */}
                    <div className="my-auto">
                        <div className="w-16 h-16 border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-600 mb-8 group-hover:border-purple-500/50 group-hover:text-purple-400 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-500">
                            <panel.icon className="w-8 h-8" />
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest mb-6 break-words">
                            {scrambledTitle}
                            <motion.span 
                                animate={{ opacity: [1, 0, 1] }} 
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="inline-block w-4 h-8 bg-purple-500 ml-2 align-middle"
                            />
                        </h2>
                        
                        <p className="text-zinc-400 font-sans text-lg max-w-sm leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                            {panel.description}
                        </p>
                    </div>

                    {/* Bottom Execution Bar */}
                    <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-auto">
                        <div className="flex items-center gap-3">
                            <span className="bg-zinc-800 text-zinc-400 px-3 py-1 text-xs font-bold group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors duration-300">
                                CMD
                            </span>
                            <span className="text-xs text-zinc-600 group-hover:text-purple-300 transition-colors duration-300">
                                EXECUTE /INITIATE
                            </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-zinc-700 group-hover:text-purple-400 group-hover:translate-x-2 transition-all duration-300" />
                    </div>

                </div>
            </div>
        </Link>
    );
}

export default function PromptHub() {
    const panels = [
        {
            id: 1,
            title: "Prompt Engineering",
            description: "Master deterministic logic extraction, advanced context manipulation, and few-shot conditioning algorithms.",
            href: "/prompt/engineering?mode=pe",
            icon: TerminalSquare,
        },
        {
            id: 2,
            title: "LLMs Architecture",
            description: "Deconstruct the Transformer. Deep dive into embeddings, self-attention layers, and latent space physics.",
            href: "/prompt/fundamentals?mode=fundamentals",
            icon: Network,
        }
    ];

    return (
        <div className="h-screen bg-[#020202] text-zinc-100 font-sans relative overflow-hidden selection:bg-purple-500/30 flex flex-col">
            
            {/* Ambient Background & Noise */}
            <div className="absolute inset-0 bg-[url('https://grainy-linears.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none mix-blend-overlay z-0" />
            
            {/* Subtle central glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-6 py-8 md:p-12 relative z-10 flex flex-col h-full w-full">
                
                <ModuleHeader
                    title="Prompt-Trials"
                    description="Command the terminal. Master the art of communicating with Large Language Models and engineering optimal outputs."
                    logo={<PromptTrialsLogo className="w-12 h-12 md:w-16 md:h-16 text-purple-500 relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />}
                />

                {/* The Cybernetic Terminals Container */}
                <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 pt-10 relative z-10 min-h-0 pb-8 items-center">
                    {panels.map((panel) => (
                        <CyberTerminal key={panel.id} panel={panel} />
                    ))}
                </div>
            </div>
        </div>
    );
}
