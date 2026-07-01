"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Brain, Clock, Shuffle, ArrowRight, Zap, Settings2, Calculator, Lightbulb } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

// Extracted and categorized topics from your provided syllabus
const QUANT_TOPICS = [
    "Numbers", "LCM and HCF", "Ratio & Proportion", "Average", "Problem on Age",
    "Percentages", "Profit and Loss", "Mixture and Alligations", "Simple Interest",
    "Compound Interest", "Time, Speed & Distance", "Trains, Boats & Streams",
    "Race", "Work and Wages", "Pipes and Cistern", "Algebra", "Mensuration 2D",
    "Mensuration 3D", "Geometry", "Trigonometry & Distances", "Progressions",
    "Logarithms", "Permutation & Combination", "Probability", "Clocks", "Calendars",
    "Simplification & Approx", "Data Interpretation"
];

const LOGICAL_TOPICS = [
    "Number Series", "Letter & Symbol Series", "Verbal Classification", "Analogies",
    "Logical Problems", "Course of Action", "Statement & Conclusion", "Theme Detection",
    "Blood Relations", "Directions", "Statement & Argument", "Logical Deduction",
    "Letter Series", "Coding Decoding", "Statement & Assumptions", "Logical Venn Diagram"
];

export default function AptitudeHub() {
    // State for the customizable Mix Practice duration (10 to 180 minutes)
    const [mixDuration, setMixDuration] = useState(60);

    // Auto-calculate the number of questions based on typical 1.5 min/question aptitude pacing
    const estimatedQuestions = Math.floor(mixDuration / 1.5);

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans relative overflow-x-hidden">

            {/* Background Subtle Gradient Aura for the USP Section */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">

                {/* Navigation Breadcrumb & Page Header */}
                <div className="border-b border-zinc-800 pb-6">
                    <Link href="/home" className="text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-white mt-4 tracking-tight flex items-center gap-3">
                        <Zap className="w-10 h-10 text-purple-500" /> Apt-Sprints
                    </h1>
                    <p className="text-zinc-500 text-base mt-2 max-w-2xl">
                        Build procedural velocity and logical precision. Configure a dynamic mixed session or target specific foundational topics under strict time constraints.
                    </p>
                </div>

                {/* =========================================
            THE HIGHLIGHTED USP: CUSTOM MIX PRACTICE
            ========================================= */}
                <ScrollReveal delay={0.05} yOffset={20}>
                    <div className="relative overflow-hidden rounded-3xl border border-purple-500/40 bg-zinc-900/40 backdrop-blur-md p-8 md:p-10 transition-all duration-500 shadow-2xl shadow-purple-900/10">
                        {/* Internal Accent Glow Element */}
                        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-center">

                            {/* Left Side: USP Info */}
                            <div className="lg:col-span-7 space-y-4">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 shadow-inner flex items-center gap-1">
                                        <Shuffle className="w-3 h-3" /> Adaptive Mix
                                    </span>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-300 bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700 flex items-center gap-1">
                                        <Settings2 className="w-3 h-3" /> Configurable
                                    </span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                                    The Ultimate Endurance Gauntlet
                                </h2>
                                <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
                                    Simulate unpredictable tier-1 placement assessments. The engine will dynamically pull questions across all Quantitative and Logical domains based on the timeframe you authorize below.
                                </p>
                            </div>

                            {/* Right Side: The Configuration Interface */}
                            <div className="lg:col-span-5 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-6 shadow-inner">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Target Duration</label>
                                        <div className="text-3xl font-black text-white flex items-baseline gap-1">
                                            {mixDuration} <span className="text-sm text-zinc-500 font-medium">Minutes</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Volume</label>
                                        <div className="text-xl font-bold text-purple-400">
                                            ~{estimatedQuestions} <span className="text-sm text-zinc-500 font-medium">Questions</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Range Slider */}
                                <input
                                    type="range"
                                    min="10"
                                    max="180"
                                    step="10"
                                    value={mixDuration}
                                    onChange={(e) => setMixDuration(parseInt(e.target.value))}
                                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500 mb-6"
                                />

                                {/* Pass the duration dynamically as a URL query parameter */}
                                <Link href={`/aptitude/Mix%20Practice?duration=${mixDuration}`} className="block w-full outline-none">
                                    <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 uppercase tracking-wider">
                                        Initiate Custom Sprint <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>

                        </div>
                    </div>
                </ScrollReveal>

                {/* =========================================
            QUANTITATIVE APTITUDE GRID
            ========================================= */}
                <div className="pt-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-3 mb-6 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-purple-500" /> Quantitative Aptitude
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {QUANT_TOPICS.map((topic, i) => (
                            <ScrollReveal key={topic} delay={0.02 * (i % 10)}>
                                <Link href={`/aptitude/${encodeURIComponent(topic)}`} className="group block h-full">
                                    {/* Fixed strict layout for absolute geometric equilibrium */}
                                    <Card className="h-full min-h-[140px] flex flex-col justify-between bg-zinc-900/40 border-zinc-800/80 rounded-2xl p-4 hover:border-purple-500/60 hover:bg-purple-900/10 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer">
                                        <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors line-clamp-2">
                                            {topic}
                                        </h4>

                                        <div className="flex justify-between items-end mt-4">
                                            <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-purple-400 group-hover:border-purple-500/40 transition-colors shrink-0">
                                                <Brain className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-purple-400 transition-colors">
                                                Sprint →
                                            </span>
                                        </div>
                                    </Card>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>

                {/* =========================================
            LOGICAL REASONING GRID
            ========================================= */}
                <div className="pt-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-3 mb-6 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-purple-500" /> Logical Reasoning
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {LOGICAL_TOPICS.map((topic, i) => (
                            <ScrollReveal key={topic} delay={0.02 * (i % 10)}>
                                <Link href={`/aptitude/${encodeURIComponent(topic)}`} className="group block h-full">
                                    <Card className="h-full min-h-[140px] flex flex-col justify-between bg-zinc-900/40 border-zinc-800/80 rounded-2xl p-4 hover:border-purple-500/60 hover:bg-purple-900/10 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer">
                                        <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors line-clamp-2">
                                            {topic}
                                        </h4>

                                        <div className="flex justify-between items-end mt-4">
                                            <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-purple-400 group-hover:border-purple-500/40 transition-colors shrink-0">
                                                <Brain className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-purple-400 transition-colors">
                                                Sprint →
                                            </span>
                                        </div>
                                    </Card>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}