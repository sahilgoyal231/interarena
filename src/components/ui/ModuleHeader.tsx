"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ModuleHeaderProps {
    title: string;
    description: React.ReactNode;
    logo: React.ReactNode;
}

export function ModuleHeader({ title, description, logo }: ModuleHeaderProps) {
    return (
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
                System Root
            </Link>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black text-white mt-6 tracking-tighter flex items-center gap-4"
            >
                <div className="relative">
                    {logo}
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-purple-500 blur-xl opacity-50 z-0 pointer-events-none"
                    />
                </div>
                {title}
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-zinc-400 text-lg md:text-xl mt-4 max-w-2xl leading-relaxed"
            >
                {description}
            </motion.p>
        </div>
    );
}
