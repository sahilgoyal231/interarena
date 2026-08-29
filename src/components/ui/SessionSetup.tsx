"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Code2,
  Clock,
  Play,
  Server,
  ChevronRight,
  MonitorPlay,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  {
    id: "c++",
    name: "C++",
    textColor: "text-blue-600",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
  },
  {
    id: "python",
    name: "Python",
    textColor: "text-sky-400",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  },
  {
    id: "javascript",
    name: "JavaScript",
    textColor: "text-yellow-400",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  },
  {
    id: "java",
    name: "Java",
    textColor: "text-red-500",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  },
];

const DURATIONS = [
  {
    id: 30,
    name: "30 Minutes",
    level: "Warmup",
    desc: "~6 Questions",
    linear: "from-cyan-400 via-blue-500 to-cyan-400",
    iconColor: "text-cyan-400",
  },
  {
    id: 45,
    name: "45 Minutes",
    level: "Standard",
    desc: "~9 Questions",
    linear: "from-fuchsia-400 via-purple-500 to-fuchsia-400",
    iconColor: "text-fuchsia-400",
  },
  {
    id: 60,
    name: "1 Hour",
    level: "Intense",
    desc: "~12 Questions",
    linear: "from-orange-400 via-red-500 to-orange-400",
    iconColor: "text-orange-400",
  },
];

interface SessionSetupProps {
  onStart: (language: string, duration: number) => void;
}

export function SessionSetup({ onStart }: SessionSetupProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const handleStart = () => {
    if (selectedLang && selectedDuration) {
      onStart(selectedLang, selectedDuration);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
          >
            <MonitorPlay className="w-8 h-8 text-purple-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-br from-white to-zinc-500 tracking-tight mb-4"
          >
            Debug Mode Setup
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg max-w-xl mx-auto"
          >
            Configure your environment and time constraints before you begin
            squashing bugs.
          </motion.p>
        </div>

        <AnimatePresence mode="popLayout">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="w-full max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold text-sm">
                  1
                </div>
                <h3 className="text-xl font-bold text-zinc-200">
                  Select Language
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLang === lang.id;
                  return (
                    <motion.button
                      key={lang.id}
                      aria-label={`Select ${lang.name}`}
                      aria-pressed={isSelected}
                      variants={itemVariants}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedLang(lang.id)}
                      className={cn(
                        "relative flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border transition-all duration-300 ease-out overflow-hidden group",
                        isSelected
                          ? "border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                          : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/40 hover:border-zinc-700/60 hover:shadow-xl hover:shadow-black/40",
                      )}
                    >
                      <Image
                        src={lang.icon}
                        alt={`${lang.name} logo`}
                        width={48}
                        height={48}
                        className={cn(
                          "w-12 h-12 transition-transform duration-300 ease-out",
                          isSelected
                            ? "scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                            : "opacity-90 group-hover:scale-105",
                        )}
                      />
                      <span
                        className={cn(
                          "text-lg font-bold transition-colors duration-300",
                          isSelected ? "text-white" : lang.textColor,
                        )}
                      >
                        {lang.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.div
                variants={itemVariants}
                className="mt-10 flex justify-end"
              >
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedLang}
                  className="flex items-center gap-2 px-8 py-3 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="w-full max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold text-sm">
                  2
                </div>
                <h3 className="text-xl font-bold text-zinc-200">
                  Practice Duration
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {DURATIONS.map((dur) => {
                  const isSelected = selectedDuration === dur.id;
                  return (
                    <motion.button
                      key={dur.id}
                      aria-label={`Select ${dur.name} duration`}
                      aria-pressed={isSelected}
                      variants={itemVariants}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDuration(dur.id)}
                      className="relative w-full flex flex-col items-center justify-center p-[1.5px] rounded-2xl transition-all duration-300 ease-out group outline-none"
                    >
                      {/* Ambient Background Glow */}
                      <motion.div
                        className={cn(
                          "absolute -inset-1.5 rounded-2xl blur-md transition-opacity duration-500 bg-linear-to-r",
                          dur.linear,
                          isSelected
                            ? "opacity-60"
                            : "opacity-0 group-hover:opacity-30",
                        )}
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{ backgroundSize: "200% 200%" }}
                      />

                      {/* Animated Gradient Border Layer */}
                      <div
                        className={cn(
                          "absolute inset-0 rounded-2xl transition-opacity duration-300 overflow-hidden",
                          isSelected
                            ? "opacity-100"
                            : "opacity-30 group-hover:opacity-100",
                        )}
                      >
                        <motion.div
                          className={cn(
                            "w-full h-full bg-linear-to-r",
                            dur.linear,
                          )}
                          animate={{
                            backgroundPosition: [
                              "0% 50%",
                              "100% 50%",
                              "0% 50%",
                            ],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          style={{ backgroundSize: "200% 200%" }}
                        />
                      </div>

                      {/* Inner Card Content */}
                      <div
                        className={cn(
                          "relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl h-full w-full transition-all duration-300",
                          isSelected
                            ? "bg-zinc-950"
                            : "bg-zinc-950/90 group-hover:bg-zinc-950/80 backdrop-blur-sm",
                        )}
                      >
                        <Clock
                          className={cn(
                            "w-8 h-8 transition-transform duration-300 ease-out",
                            isSelected
                              ? `${dur.iconColor} scale-110 drop-shadow-[0_0_10px_currentColor]`
                              : "text-zinc-500 group-hover:scale-105",
                          )}
                        />
                        <div className="text-center">
                          <span
                            className={cn(
                              "block text-xs font-bold uppercase tracking-wider mb-1 transition-all duration-300",
                              dur.iconColor,
                              isSelected
                                ? "opacity-100"
                                : "opacity-70 group-hover:opacity-100",
                            )}
                          >
                            {dur.level}
                          </span>
                          <span
                            className={cn(
                              "block text-lg font-bold transition-colors duration-300",
                              isSelected ? "text-white" : "text-zinc-300",
                            )}
                          >
                            {dur.name}
                          </span>
                          <span
                            className={cn(
                              "block text-xs mt-1 transition-colors duration-300",
                              isSelected
                                ? "text-zinc-300"
                                : "text-zinc-500 group-hover:text-zinc-400",
                            )}
                          >
                            {dur.desc}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <motion.div
                variants={itemVariants}
                className="mt-10 flex items-center justify-between"
              >
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-zinc-400 hover:text-white font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleStart}
                  aria-label="Start Session"
                  disabled={!selectedDuration}
                  className="relative flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-wide uppercase rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Session
                    <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
