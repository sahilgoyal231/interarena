"use client";

import { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Code2,
  Bug,
  Eye,
  ArrowRight,
  Settings2,
  Sparkles,
  SearchCode,
  Brain,
  Terminal,
  Braces,
  X,
  Timer,
} from "lucide-react";
import {
  ScrollReveal,
  ScrollRevealStagger,
  ScrollRevealItem,
} from "@/components/ui/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { CodeSandboxLogo } from "@/components/ui/ModuleLogos";
import { useRouter } from "next/navigation";

const BubbleSelector = ({
  languages,
  onSelect,
  onCancel,
}: {
  languages: string[];
  onSelect: (l: string) => void;
  onCancel: () => void;
}) => {
  const [poppedLang, setPoppedLang] = useState<string | null>(null);

  // Define 4 destination points relative to a 400x400 SVG box
  const points = [
    { x: 60, y: 150 },
    { x: 130, y: 60 },
    { x: 230, y: 60 },
    { x: 300, y: 150 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-zinc-950/90 backdrop-blur-xl rounded-[2.5rem] border border-fuchsia-500/30 overflow-hidden"
    >
      <button
        onClick={onCancel}
        className="absolute top-8 right-8 text-zinc-500 hover:text-white z-50"
      >
        <X className="w-6 h-6" />
      </button>

      {/* SVG Thread Container */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="threadGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#d946ef" stopOpacity="0" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {points.map((p, i) => (
          <motion.path
            key={i}
            d={`M 200 400 C 200 250, ${p.x} 300, ${p.x} ${p.y}`}
            fill="none"
            stroke="url(#threadGradient)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </svg>

      {/* Bubbles */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {languages.map((lang, i) => {
          const isPopped = poppedLang === lang;
          const p = points[i];
          return (
            <motion.div
              key={lang}
              className="absolute pointer-events-auto flex items-center justify-center cursor-pointer"
              style={{
                left: `${(p.x / 400) * 100}%`,
                top: `${(p.y / 400) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isPopped
                  ? { scale: 2, opacity: 0 }
                  : { scale: 1, opacity: 1, y: [0, -15, 0] }
              }
              transition={
                isPopped
                  ? { duration: 0.3, ease: "circOut" }
                  : {
                      scale: {
                        delay: 1 + i * 0.15,
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      },
                      y: {
                        duration: 4 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2,
                      },
                    }
              }
              onClick={() => {
                if (!poppedLang) {
                  setPoppedLang(lang);
                  onSelect(lang);
                }
              }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Realistic Bubble Styling */}
              <div
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(217,70,239,0.05) 40%, rgba(217,70,239,0.3) 100%)",
                  boxShadow:
                    "inset 0 0 15px rgba(255,255,255,0.4), inset 10px 0 20px rgba(217,70,239,0.4), inset -10px 0 20px rgba(168,85,247,0.4), 0 10px 20px rgba(0,0,0,0.3)",
                }}
              >
                {/* Bubble highlight reflection */}
                <div className="absolute top-3 left-4 w-6 h-3 bg-white/70 rounded-[100%] -rotate-45 blur-[1px]" />
                <div className="absolute bottom-3 right-4 w-4 h-2 bg-purple-400/50 rounded-[100%] -rotate-45 blur-[2px]" />

                <span className="text-white font-black text-xs sm:text-sm tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] z-10 px-2 text-center leading-tight">
                  {lang}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 text-zinc-400 text-sm font-medium tracking-widest uppercase bg-zinc-950/50 px-6 py-2 rounded-full border border-zinc-800"
      >
        Pop a bubble to begin
      </motion.div>
    </motion.div>
  );
};

const TimerSelector = ({
  lang,
  onSelect,
  onCancel,
}: {
  lang: string;
  onSelect: (minutes: number) => void;
  onCancel: () => void;
}) => {
  const options = [
    { mins: 20, label: "Fast", desc: "1m / question" },
    { mins: 30, label: "Medium", desc: "1.5m / question" },
    { mins: 40, label: "Paced", desc: "2m / question" },
    { mins: 50, label: "Standard", desc: "2.5m / question" },
    { mins: 60, label: "Relaxed", desc: "3m / question" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-xl rounded-[2.5rem] border border-fuchsia-500/30 overflow-hidden p-6"
    >
      <button
        onClick={onCancel}
        className="absolute top-6 right-6 text-zinc-500 hover:text-white z-50 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="absolute inset-0 bg-[url('https://grainy-linears.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl bg-fuchsia-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-6 relative z-10"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-400 mb-4 shadow-[0_0_30px_rgba(217,70,239,0.3)]">
          <Timer className="w-6 h-6" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
          Set Time Limit
        </h2>
        <p className="text-zinc-400 text-sm">
          Choose your pressure for {lang}
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-3 w-full max-w-md relative z-10">
        {options.map((opt, i) => (
          <motion.button
            key={opt.mins}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            onClick={() => onSelect(opt.mins)}
            className="group relative flex flex-col items-center p-4 w-[calc(33.33%-0.5rem)] min-w-[100px] bg-zinc-900/50 hover:bg-fuchsia-950/40 border border-zinc-800 hover:border-fuchsia-500/50 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(217,70,239,0.15)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-b from-fuchsia-500/0 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-2xl font-black text-white mb-1 tracking-tighter">
              {opt.mins}
              <span className="text-xs text-zinc-500 font-bold ml-1">M</span>
            </span>
            <span className="text-fuchsia-400 font-bold text-[10px] tracking-widest uppercase mb-1">
              {opt.label}
            </span>
            <span className="text-[9px] text-zinc-500 font-medium">
              {opt.desc}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default function CodingHub() {
  const router = useRouter();
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const languages = ["C++", "Python", "Java", "JavaScript"];
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans relative overflow-x-hidden selection:bg-purple-500/30">
      {/* Insane Animated Background Layers */}
      <div className="absolute inset-0 bg-[url('https://grainy-linears.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0" />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1/4 -right-1/4 w-200 h-200 bg-purple-600/10 blur-[150px] rounded-full pointer-events-none z-0"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -100, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 -left-1/4 w-150 h-150 bg-fuchsia-600/10 blur-[150px] rounded-full pointer-events-none z-0"
      />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Navigation Breadcrumb & Page Header */}
        <div className="border-b border-zinc-800/80 pb-8 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute bottom-0 left-0 h-px bg-linear-to-r from-purple-500 via-fuchsia-500 to-transparent"
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
              <CodeSandboxLogo className="w-12 h-12 md:w-16 md:h-16 text-purple-500 relative z-10" />
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-purple-500 blur-xl opacity-50 z-0"
              />
            </div>
            Code-Sandbox
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl mt-4 max-w-2xl leading-relaxed"
          >
            A fully featured, live execution environment. Choose your
            specialized workflow below to either fix broken syntax or predict
            execution outputs under timed constraints.
          </motion.p>
        </div>

        {/* Selection Cards */}
        <ScrollRevealStagger className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-20 pt-8">
          {/* Debug the Code Mode */}
          <ScrollRevealItem>
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="h-full"
            >
              <Link
                href="/coding/debug?mode=debug"
                className="group block h-full outline-none"
              >
                <Card className="bg-zinc-950/80 backdrop-blur-xl border-zinc-800 rounded-[2.5rem] hover:border-purple-500 hover:bg-purple-950/30 hover:shadow-[0_0_50px_rgba(168,85,247,0.2)] transition-all duration-500 flex flex-col h-full cursor-pointer overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-600 to-fuchsia-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />

                  {/* Floating Elements Background */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl group-hover:bg-purple-500/40 transition-all duration-1000 ease-in-out" />
                  <Bug className="absolute -bottom-10 -right-10 w-64 h-64 text-purple-900/10 group-hover:text-purple-600/10 group-hover:rotate-12 transition-all duration-1000 ease-in-out pointer-events-none" />

                  <CardHeader className="space-y-6 p-10 relative z-10">
                    <div className="flex justify-between items-start w-full">
                      <CardTitle className="text-4xl text-white font-black tracking-tight">
                        Debug <br />
                        <span className="text-purple-400">the Code</span>
                      </CardTitle>
                      <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0 overflow-hidden relative transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
                        <Image src="/3d-icons/debug_code.jpg" alt="Debug Code" fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity mix-blend-screen" />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase font-black tracking-widest bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full border border-purple-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                        <Settings2 className="w-3.5 h-3.5" /> Syntax Resolution
                      </span>
                    </div>

                    <CardDescription className="text-zinc-400 text-lg leading-relaxed pt-2">
                      Travel through the journey of debugging. You will be
                      provided with broken syntax, logical errors, or infinite
                      loops. Fix the statements to pass all test cases.
                    </CardDescription>

                    <div className="pt-8 flex items-center text-sm font-bold text-zinc-500 uppercase tracking-widest group-hover:text-purple-400 transition-colors mt-auto">
                      Initialize Environment
                      <motion.div
                        initial={{ x: 0 }}
                        whileInView={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </motion.div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <div className="h-full min-h-100 relative">
              <AnimatePresence mode="wait">
                {!isConfiguring ? (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    transition={{ duration: 0.4 }}
                    className="h-full"
                  >
                    <motion.div
                      whileHover={{ y: -10, scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="h-full"
                    >
                      <button
                        onClick={() => setIsConfiguring(true)}
                        className="group block h-full w-full outline-none text-left"
                      >
                        <Card className="bg-zinc-950/80 backdrop-blur-xl border-zinc-800 rounded-[2.5rem] hover:border-fuchsia-500 hover:bg-fuchsia-950/20 hover:shadow-[0_0_50px_rgba(217,70,239,0.15)] transition-all duration-500 flex flex-col h-full overflow-hidden relative">
                          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-fuchsia-600 to-purple-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />

                          {/* Floating Elements Background */}
                          <div className="absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-600/20 rounded-full blur-3xl group-hover:bg-purple-500/40 transition-all duration-1000 ease-in-out" />
                          <Braces className="absolute -bottom-10 -right-10 w-64 h-64 text-fuchsia-900/10 group-hover:text-purple-600/10 group-hover:-rotate-12 transition-all duration-1000 ease-in-out pointer-events-none" />

                          <CardHeader className="space-y-6 p-10 relative z-10 h-full flex flex-col">
                            <div className="flex justify-between items-start w-full">
                              <CardTitle className="text-4xl text-white font-black tracking-tight">
                                Guess <br />
                                <span className="text-fuchsia-400">
                                  the Output
                                </span>
                              </CardTitle>
                              <div className="w-20 h-20 rounded-2xl bg-fuchsia-500/10 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0 overflow-hidden relative transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3">
                                <Image src="/3d-icons/guess_output.jpg" alt="Guess Output" fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity mix-blend-screen" />
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] uppercase font-black tracking-widest bg-fuchsia-500/20 text-fuchsia-300 px-4 py-2 rounded-full border border-fuchsia-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                                <Braces className="w-3.5 h-3.5" /> Output
                                Compilation
                              </span>
                            </div>

                            <CardDescription className="text-zinc-400 text-lg leading-relaxed pt-2">
                              Enhance your ability to read and compile code
                              mentally. You will be provided with intricate code
                              blocks and must predict the standard output before
                              time runs out.
                            </CardDescription>

                            <div className="pt-8 flex items-center text-sm font-bold text-zinc-500 uppercase tracking-widest group-hover:text-fuchsia-400 transition-colors mt-auto relative z-20 w-max">
                              Configure Environment
                              <motion.div
                                initial={{ x: 0 }}
                                whileInView={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <ArrowRight className="w-5 h-5 ml-3" />
                              </motion.div>
                            </div>
                          </CardHeader>
                        </Card>
                      </button>
                    </motion.div>
                  </motion.div>
                ) : !selectedLang ? (
                  <BubbleSelector
                    key="bubbles"
                    languages={languages}
                    onSelect={(lang) => {
                      setTimeout(() => {
                        setSelectedLang(lang);
                      }, 250);
                    }}
                    onCancel={() => setIsConfiguring(false)}
                  />
                ) : (
                  <TimerSelector
                    key="timer"
                    lang={selectedLang}
                    onSelect={(mins) => {
                      router.push(
                        `/coding/guess?lang=${encodeURIComponent(selectedLang)}&duration=${mins}`
                      );
                    }}
                    onCancel={() => setSelectedLang(null)}
                  />
                )}
              </AnimatePresence>
            </div>
          </ScrollRevealItem>
        </ScrollRevealStagger>
      </div>
    </div>
  );
}
