"use client";

import { useState } from "react";


import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Bug,
  ArrowRight,
  Settings2,
  Braces,
  X,
  Timer,
  Flame,
  Zap,
  Gauge,
  Coffee,
  Cloud,
} from "lucide-react";
import {
  ScrollRevealStagger,
  ScrollRevealItem,
} from "@/components/ui/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { CodeSandboxLogo } from "@/components/ui/ModuleLogos";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
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
    { mins: 20, label: "Fast", desc: "1m / question", Icon: Flame, colorClass: "text-rose-500", borderClass: "group-hover:border-rose-500/50", bgClass: "group-hover:bg-rose-500/10", shadowClass: "hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]", accent: "bg-rose-500" },
    { mins: 30, label: "Medium", desc: "1.5m / question", Icon: Zap, colorClass: "text-orange-500", borderClass: "group-hover:border-orange-500/50", bgClass: "group-hover:bg-orange-500/10", shadowClass: "hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]", accent: "bg-orange-500" },
    { mins: 40, label: "Paced", desc: "2m / question", Icon: Gauge, colorClass: "text-amber-500", borderClass: "group-hover:border-amber-500/50", bgClass: "group-hover:bg-amber-500/10", shadowClass: "hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]", accent: "bg-amber-500" },
    { mins: 50, label: "Standard", desc: "2.5m / question", Icon: Coffee, colorClass: "text-cyan-500", borderClass: "group-hover:border-cyan-500/50", bgClass: "group-hover:bg-cyan-500/10", shadowClass: "hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]", accent: "bg-cyan-500" },
    { mins: 60, label: "Relaxed", desc: "3m / question", Icon: Cloud, colorClass: "text-purple-500", borderClass: "group-hover:border-purple-500/50", bgClass: "group-hover:bg-purple-500/10", shadowClass: "hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]", accent: "bg-purple-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden p-3 sm:p-4"
    >
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 sm:top-5 sm:right-5 text-zinc-500 hover:text-white z-50 transition-colors bg-white/5 p-1.5 rounded-full hover:bg-white/10"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <div className="absolute inset-0 bg-[url('https://grainy-linears.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-600/10 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-5 relative z-10 w-full"
      >
        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white shadow-lg shrink-0">
          <Timer className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-white/50 tracking-tight leading-tight">
            Set Time Limit
          </h2>
          <p className="text-zinc-400 text-[10px] sm:text-xs">
            Choose your pressure for <span className="text-white font-bold">{lang}</span>
          </p>
        </div>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full max-w-2xl relative z-10 px-1 sm:px-2">
        {options.map((opt, i) => (
          <motion.button
            key={opt.mins}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(opt.mins)}
            className={`group relative flex flex-col items-center justify-center p-3 sm:p-4 w-[calc(33.33%-0.5rem)] min-w-[100px] sm:min-w-[130px] bg-zinc-900/40 border border-white/5 rounded-2xl sm:rounded-3xl transition-all duration-500 overflow-hidden ${opt.borderClass} ${opt.bgClass} ${opt.shadowClass}`}
          >
            {/* Dynamic Accent Bar */}
            <div className={`absolute top-0 left-0 w-full h-1 ${opt.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/5 mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-500 shrink-0">
              <opt.Icon className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${opt.colorClass}`} />
            </div>

            <div className="flex flex-col items-center text-center w-full">
              <span className="text-xl sm:text-3xl font-black text-white tracking-tighter mb-0.5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-b group-hover:from-white group-hover:to-white/50 transition-all whitespace-nowrap">
                {opt.mins}
                <span className="text-[10px] sm:text-[13px] text-zinc-500 font-bold ml-1">M</span>
              </span>
              <span className={`font-black text-[8px] sm:text-[10px] tracking-[0.1em] sm:tracking-[0.2em] uppercase mb-0.5 transition-colors whitespace-nowrap ${opt.colorClass}`}>
                {opt.label}
              </span>
              <span className="text-[7.5px] sm:text-[9.5px] text-zinc-500 font-medium whitespace-nowrap hidden sm:block">
                {opt.desc}
              </span>
            </div>
            
            {/* Ambient Background Glow */}
            <div className={`absolute -inset-4 bg-[url('https://grainy-linears.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay transition-opacity duration-500 group-hover:opacity-10 pointer-events-none`} />
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
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans relative overflow-x-hidden selection:bg-purple-500/30">
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
        <ModuleHeader
          title="Code-Sandbox"
          description="A fully featured, live execution environment. Choose your specialized workflow below to either fix broken syntax or predict execution outputs under timed constraints."
          logo={<CodeSandboxLogo className="w-12 h-12 md:w-16 md:h-16 text-purple-500 relative z-10" />}
        />

        {/* Selection Cards */}
        <ScrollRevealStagger className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-20 pt-8">
          {/* Debug the Code Mode */}
          <ScrollRevealItem>
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="h-full min-h-[400px] relative"
            >
              <div
                className="group block h-full outline-none cursor-not-allowed opacity-60 relative"
              >
                <Card className="bg-zinc-950/80 backdrop-blur-xl border-zinc-800 rounded-[2.5rem] transition-all duration-500 flex flex-col h-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-600 to-fuchsia-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />

                  {/* Floating Elements Background */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl group-hover:bg-purple-500/40 transition-all duration-1000 ease-in-out" />
                  <Bug className="absolute -bottom-10 -right-10 w-64 h-64 text-purple-900/10 group-hover:text-purple-600/10 group-hover:rotate-12 transition-all duration-1000 ease-in-out pointer-events-none" />

                  <CardHeader className="space-y-6 p-10 relative z-10 h-full flex flex-col">
                    <div className="flex justify-between items-start w-full">
                      <CardTitle className="text-4xl text-white font-black tracking-tight">
                        Debug <br />
                        <span className="text-purple-400">the Code</span>
                      </CardTitle>
                      <div className="w-24 h-24 rounded-[2rem] bg-purple-500/10 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0 overflow-hidden relative transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
                        <Image src="/3d-icons/debug_code.jpg" alt="Debug Code" fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity mix-blend-screen" />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] uppercase font-black tracking-widest bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full border border-purple-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                        <Settings2 className="w-3.5 h-3.5" /> Syntax Resolution
                      </span>
                      <span className="text-[10px] uppercase font-black tracking-widest bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full border border-amber-500/20 flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Under Maintenance
                      </span>
                    </div>

                    <CardDescription className="text-zinc-400 text-lg leading-relaxed pt-2">
                      Travel through the journey of debugging. You will be
                      provided with broken syntax, logical errors, or infinite
                      loops. Fix the statements to pass all test cases.
                    </CardDescription>

                    <div className="pt-8 flex items-center text-sm font-bold text-zinc-500 uppercase tracking-widest group-hover:text-purple-400 transition-colors mt-auto">
                      Coming Soon
                      <motion.div
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                      >
                        <span className="ml-3 tracking-[0.3em]">...</span>
                      </motion.div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </motion.div>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <div className="h-full min-h-[400px] relative">
              <AnimatePresence mode="popLayout">
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
                              <div className="w-24 h-24 rounded-[2rem] bg-fuchsia-500/10 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0 overflow-hidden relative transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3">
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
