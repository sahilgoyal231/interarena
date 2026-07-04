"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { BookOpen, Shuffle, ArrowRight, Library, Settings2, PenTool, Type, FileText } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const BASIC_GRAMMAR = [
    "Change of Voice", "Change of Speech", "Articles", "Idioms and Phrases", 
    "Preposition", "Selecting Words", "Spellings", "Conjunctions"
];

const SYNONYMS_ANTONYMS = [
    "Synonyms", "Antonyms", "One Word Substitutes"
];

const SENTENCES = [
    "Sentence Formation", "Spotting Errors", "Vocabulary", "Ordering of Words", 
    "Sentence Completion", "Sentence Correction", "Sentence Improvement", "Ordering of Sentences"
];

const PARAGRAPHS = [
    "CLoze Test", "Paragraph Formation", "Reading Comprehension", 
    "Verbal Analogies", "Adjectives", "Para Jumbles"
];

export default function VerbalHub() {
    const [mixDuration, setMixDuration] = useState(30);
    const estimatedQuestions = Math.floor(mixDuration / 0.75); // Verbal is faster, ~45s per question

    const renderGrid = (title: string, icon: React.ReactNode, topics: string[]) => (
        <div className="pt-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-3 mb-6 flex items-center gap-2">
                {icon} {title}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {topics.map((topic, i) => (
                    <ScrollReveal key={topic} delay={0.02 * (i % 10)}>
                        <Link href={`/verbal/${encodeURIComponent(topic)}`} prefetch={false} className="group block h-full">
                            <Card className="relative h-full min-h-36 flex flex-col justify-between bg-zinc-900/40 border-zinc-800/80 rounded-2xl p-5 hover:-translate-y-1 hover:border-purple-500/80 hover:bg-purple-950/20 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                
                                <h4 className="relative z-10 text-base md:text-lg font-bold text-zinc-300 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                                    {topic}
                                </h4>

                                <div className="relative z-10 flex justify-between items-end mt-6">
                                    <div className="w-8 h-8 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-purple-400 group-hover:border-purple-500/40 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all duration-300 shrink-0">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-purple-400 transition-colors">
                                        Sprint →
                                    </span>
                                </div>
                            </Card>
                        </Link>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans relative overflow-x-hidden">
            <div className="absolute top-0 right-0 w-125 h-125 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                <div className="border-b border-zinc-800 pb-6">
                    <Link href="/home" className="text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-white mt-4 tracking-tight flex items-center gap-3">
                        <Library className="w-10 h-10 text-purple-500" /> Verbal-Leagues
                    </h1>
                    <p className="text-zinc-500 text-base mt-2 max-w-2xl">
                        Master the foundations of the English language. Configure a dynamic mixed session or target specific grammatical topics to enhance your comprehension and vocabulary.
                    </p>
                </div>

                <ScrollReveal delay={0.05} yOffset={20}>
                    <div className="relative overflow-hidden rounded-3xl border border-purple-500/40 bg-zinc-900/40 backdrop-blur-md p-8 md:p-10 transition-all duration-500 shadow-2xl shadow-purple-900/10">
                        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-center">
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
                                    The Verbal Gauntlet
                                </h2>
                                <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
                                    Simulate unpredictable tier-1 placement assessments. The engine will dynamically pull questions across all Grammar, Vocabulary, and Comprehension domains based on the timeframe you authorize.
                                </p>
                            </div>

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

                                <input
                                    type="range"
                                    min="10"
                                    max="180"
                                    step="10"
                                    value={mixDuration}
                                    onChange={(e) => setMixDuration(parseInt(e.target.value))}
                                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500 mb-6"
                                />

                                <Link href={`/verbal/Mix%20Practice?duration=${mixDuration}`} className="block w-full outline-none">
                                    <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 uppercase tracking-wider">
                                        Initiate Custom Sprint <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {renderGrid("Basic Grammar", <PenTool className="w-5 h-5 text-purple-500" />, BASIC_GRAMMAR)}
                {renderGrid("Synonyms & Antonyms", <Type className="w-5 h-5 text-purple-500" />, SYNONYMS_ANTONYMS)}
                {renderGrid("Sentences", <Type className="w-5 h-5 text-purple-500" />, SENTENCES)}
                {renderGrid("Paragraphs", <FileText className="w-5 h-5 text-purple-500" />, PARAGRAPHS)}
            </div>
        </div>
    );
}
