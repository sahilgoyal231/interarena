"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  LayoutGrid,
  Flag,
  Target,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { FormattedText } from "@/components/ui/FormattedText";
import { CodeEditor } from "@/components/ui/CodeEditor";
import { ScoreSummary } from "@/components/ui/ScoreSummary";
import { QuestionReviewCard, type Question } from "@/components/ui/QuestionReviewCard";
import { TimerBlock } from "@/components/ui/TimerBlock";

type SectionData = {
  title: string;
  durationSeconds: number;
  questions: Question[];
};

type MoaData = {
  moaId: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  sections: SectionData[];
};

export default function MockAssessmentEngine({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const moaId = resolvedParams.id;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // States
  const [moaData, setMoaData] = useState<MoaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Section Navigation
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0); // Question index inside section
  
  // Break state
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(60);

  // Answers and Tracking (keyed by `${sectionIndex}-${questionId}`)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [visitedCounts, setVisitedCounts] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Global and Section Timers
  const [globalTimeLeft, setGlobalTimeLeft] = useState(120 * 60); // 120 mins
  const [sectionTimeLeft, setSectionTimeLeft] = useState(0);

  // 1. Fetch MOA Data
  useEffect(() => {
    async function loadMoa() {
      try {
        const res = await fetch(`/api/moa/generate?moaId=${moaId}`);
        if (res.ok) {
          const data: MoaData = await res.json();
          setMoaData(data);
          if (data.sections && data.sections.length > 0) {
            setSectionTimeLeft(data.sections[0].durationSeconds);
          }
        }
      } catch (err) {
        console.error("MOA Loading Failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMoa();
  }, [moaId]);

  // 2. Timers Logic
  useEffect(() => {
    if (!hasStarted || isSubmitted || loading) return;

    // Handle Break Timer
    if (isOnBreak) {
      if (breakTimeLeft <= 0) {
        // End break, move to next section automatically
        handleEndBreak();
        return;
      }
      const timer = setTimeout(() => setBreakTimeLeft(breakTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }

    // Handle Assessment Timers
    if (globalTimeLeft <= 0) {
      handleCompleteMoa();
      return;
    }

    if (sectionTimeLeft <= 0) {
      handleCompleteSection();
      return;
    }

    const timer = setTimeout(() => {
      setGlobalTimeLeft(g => g - 1);
      setSectionTimeLeft(s => s - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasStarted, isSubmitted, loading, globalTimeLeft, sectionTimeLeft, isOnBreak, breakTimeLeft]);

  // Handle Complete Section
  const handleCompleteSection = () => {
    if (!moaData) return;
    if (currentSectionIndex >= moaData.sections.length - 1) {
      handleCompleteMoa();
    } else {
      setIsOnBreak(true);
      setBreakTimeLeft(60);
    }
  };

  const handleEndBreak = () => {
    if (!moaData) return;
    setIsOnBreak(false);
    const nextSec = currentSectionIndex + 1;
    setCurrentSectionIndex(nextSec);
    setCurrentIndex(0);
    setSectionTimeLeft(moaData.sections[nextSec].durationSeconds);
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTo(0, 0);
  };

  const handleCompleteMoa = () => {
    if (!moaData) return;
    setIsSubmitted(true);
    let calculatedScore = 0;
    moaData.sections.forEach((sec, sIdx) => {
      sec.questions.forEach((q) => {
        const uAnswer = userAnswers[`${sIdx}-${q.id}`];
        if (
          uAnswer === q.correctAnswer ||
          (typeof uAnswer === "string" && uAnswer.startsWith(q.correctAnswer + ")"))
        ) {
          calculatedScore += 1;
        }
      });
    });
    setScore(calculatedScore);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (isSubmitted || isOnBreak) return;
    setUserAnswers((prev) => ({ ...prev, [`${currentSectionIndex}-${questionId}`]: option }));
  };

  const handleClearResponse = (questionId: string) => {
    if (isSubmitted || isOnBreak) return;
    setUserAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[`${currentSectionIndex}-${questionId}`];
      return newAnswers;
    });
  };

  // =========================================
  // VIEW: LOADING
  // =========================================
  if (loading) {
    return (
      <div className="h-screen overflow-hidden bg-zinc-950 flex flex-col items-center justify-center font-mono text-purple-500 gap-4">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-sm tracking-widest uppercase">Initializing MOA Engine...</p>
      </div>
    );
  }

  if (!moaData || moaData.sections.length === 0) {
    return (
      <div className="h-screen overflow-hidden bg-zinc-950 flex flex-col items-center justify-center space-y-4 p-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-zinc-400 font-medium">Failed to construct Mock Assessment.</p>
        <button onClick={() => router.push("/home")} className="px-6 py-2 bg-zinc-800 text-white rounded-lg text-sm font-bold">Go Back</button>
      </div>
    );
  }

  // =========================================
  // VIEW: INSTRUCTIONS (PRE-START)
  // =========================================
  if (!hasStarted && !isSubmitted) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 md:p-12 relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-4xl w-full space-y-12">
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4" /> Official Evaluation
            </span>
            <h1 className="text-5xl font-black text-white">{moaData.title}</h1>
            <p className="text-xl text-zinc-400 font-medium">Difficulty Level: {moaData.difficulty}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-2"><Clock className="w-5 h-5 text-purple-500"/> Structure</h3>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Total Time: 2 Hours (120 Mins) strict limit.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> You must complete sections in order.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> A 1-minute break occurs between sections automatically.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Early submission does NOT carry over time to the next section.</li>
              </ul>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-2"><LayoutGrid className="w-5 h-5 text-purple-500"/> Sections</h3>
              <ul className="space-y-2 text-sm text-zinc-300">
                {moaData.sections.map((sec, i) => (
                  <li key={i} className="flex justify-between items-center bg-zinc-950/50 px-3 py-2 rounded-lg border border-zinc-800/50">
                    <span className="font-bold">Section {String.fromCharCode(65 + i)}: {sec.title}</span>
                    <span className="text-xs text-zinc-500">{sec.questions.length} Qs • {sec.durationSeconds / 60}m</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-center pt-8 border-t border-zinc-800">
            <button
              onClick={() => setHasStarted(true)}
              className="px-12 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest text-lg rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all hover:scale-105"
            >
              Initialize Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // VIEW: POST-SUBMISSION RESULTS
  // =========================================
  if (isSubmitted) {
    const totalQ = moaData.sections.reduce((acc, sec) => acc + sec.questions.length, 0);
    const accuracy = Math.round((score / totalQ) * 100);
    const attemptedCount = Object.keys(userAnswers).length;
    const unansweredCount = totalQ - attemptedCount;

    return (
      <div className="h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 md:p-12" data-lenis-prevent="true">
          <div className="max-w-4xl mx-auto space-y-8 pb-24">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-black text-white">Assessment Complete</h1>
              <p className="text-zinc-400">Detailed Report for <span className="text-purple-400 font-bold">{moaData.title}</span></p>
              <ScoreSummary score={score} totalQuestions={totalQ} accuracy={accuracy} unansweredCount={unansweredCount} />
            </div>

            {moaData.sections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-6">
                <h3 className="text-2xl font-black text-white border-b-2 border-zinc-800 pb-4 mt-12">
                  Section {String.fromCharCode(65 + sIdx)}: {sec.title}
                </h3>
                {sec.questions.map((q, index) => (
                  <QuestionReviewCard key={q.id} question={q} index={index} userAnswer={userAnswers[`${sIdx}-${q.id}`]} />
                ))}
              </div>
            ))}

            <div className="flex justify-center pt-8">
              <button onClick={() => router.push("/home")} className="px-8 py-3 bg-zinc-100 text-zinc-950 font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-300 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // VIEW: 1 MINUTE BREAK OVERLAY
  // =========================================
  if (isOnBreak) {
    return (
      <div className="h-screen overflow-hidden bg-zinc-950 flex flex-col items-center justify-center font-mono gap-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
        
        <h2 className="text-3xl font-black text-white tracking-widest">SECTION COMPLETE</h2>
        <p className="text-zinc-400 font-sans max-w-md text-center">
          Take a moment to reset. The next section will begin automatically in exactly:
        </p>
        
        <div className="text-7xl font-bold text-purple-400 tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
          00:{breakTimeLeft < 10 ? `0${breakTimeLeft}` : breakTimeLeft}
        </div>

        <button 
          onClick={handleEndBreak}
          className="mt-8 px-8 py-3 border border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-900 transition-colors font-sans font-bold"
        >
          Skip Break & Continue
        </button>
      </div>
    );
  }

  // =========================================
  // VIEW: ACTIVE ASSESSMENT
  // =========================================
  const currentSection = moaData.sections[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentIndex];
  
  let optionsList: string[] = [];
  try {
    optionsList = Array.isArray(currentQuestion.options)
      ? currentQuestion.options
      : JSON.parse((currentQuestion.options as string) || "[]");
  } catch (e) {
    optionsList = ["Option A", "Option B", "Option C", "Option D"];
  }

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden relative z-0">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight uppercase tracking-wider">{moaData.title}</h2>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">
              Total Time Remaining: {Math.floor(globalTimeLeft / 60)}:{globalTimeLeft % 60 < 10 ? '0' : ''}{globalTimeLeft % 60}
            </p>
          </div>
        </div>

        {/* Local Section Timer */}
        <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full">
          <Clock className="w-4 h-4 text-red-400" />
          <span className="text-sm font-black text-red-500 tabular-nums">
            {Math.floor(sectionTimeLeft / 60)}:{sectionTimeLeft % 60 < 10 ? '0' : ''}{sectionTimeLeft % 60}
          </span>
        </div>
      </header>

      {/* Main Split Layout: Navigator on Left, Question on Right */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        
        {/* Left Pane: Vertical Sections & Navigator */}
        <div className="w-full lg:w-80 border-r border-zinc-800 bg-zinc-950 flex flex-col shrink-0 z-10 order-2 lg:order-1">
          
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-purple-500" />
              <h3 className="font-bold text-white">Assessment Overview</h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0" data-lenis-prevent="true">
            <div className="flex flex-col">
              {moaData.sections.map((sec, sIdx) => {
                const isPast = sIdx < currentSectionIndex;
                const isActiveSection = sIdx === currentSectionIndex;
                const isFuture = sIdx > currentSectionIndex;
                
                return (
                  <div key={sIdx} className={`border-b border-zinc-800/50 flex flex-col transition-colors ${isActiveSection ? "bg-zinc-900/30" : ""}`}>
                    {/* Section Header */}
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <div className={`text-xs font-bold uppercase tracking-widest ${isActiveSection ? "text-purple-400" : isPast ? "text-emerald-500" : "text-zinc-600"}`}>
                          Section {String.fromCharCode(65 + sIdx)}
                        </div>
                        <div className={`text-sm font-semibold mt-1 ${isActiveSection || isPast ? "text-white" : "text-zinc-500"}`}>
                          {sec.title}
                        </div>
                      </div>
                      
                      {isPast && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    </div>

                    {/* Section Grid */}
                    <div className="px-6 pb-6">
                        <div className="grid grid-cols-5 gap-2 pt-2">
                          {Array.from({ length: sec.questions.length }).map((_, idx) => {
                            const q = sec.questions[idx];
                            const isAttempted = !!userAnswers[`${sIdx}-${q.id}`];
                            const isActiveQuestion = isActiveSection && idx === currentIndex;
                            
                            let tileStyle = "border-zinc-800 text-zinc-500 hover:border-zinc-500 bg-zinc-950 cursor-pointer";
                            
                            if (isPast) {
                                tileStyle = isAttempted 
                                  ? "border-emerald-500/30 bg-emerald-900/10 text-emerald-500/50 cursor-not-allowed"
                                  : "border-zinc-800/50 bg-zinc-950/50 text-zinc-600 cursor-not-allowed";
                            } else if (isFuture) {
                                tileStyle = "border-zinc-900 text-zinc-700 bg-zinc-950/30 cursor-not-allowed";
                            } else {
                                // Active Section Logic
                                if (isActiveQuestion) {
                                  tileStyle = "border-white bg-zinc-800 text-white ring-2 ring-zinc-800 shadow-[0_0_15px_rgba(255,255,255,0.2)]";
                                } else if (isAttempted) {
                                  tileStyle = "border-purple-500/30 bg-purple-900/10 text-purple-500/80";
                                }
                            }

                            return (
                              <button
                                key={idx}
                                disabled={!isActiveSection}
                                onClick={() => setCurrentIndex(idx)}
                                className={`aspect-square rounded-lg border flex items-center justify-center text-xs font-bold transition-all ${tileStyle}`}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 border-t border-zinc-800 bg-zinc-950">
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="w-full py-4 bg-zinc-100 hover:bg-zinc-300 text-zinc-950 font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Submit Section
            </button>
          </div>
        </div>

        {/* Right Pane: Question & Options */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 md:p-12 relative order-1 lg:order-2" data-lenis-prevent="true">
          <div className="max-w-3xl mx-auto space-y-8 pb-24">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <span className="text-zinc-500 font-medium">
                Section {String.fromCharCode(65 + currentSectionIndex)} • Question {currentIndex + 1} of {currentSection.questions.length}
              </span>
            </div>

            {(() => {
              const parts = currentQuestion.prompt.split("```");
              let textPart = currentQuestion.prompt;
              let codePart = "";
              let langClass = "";
              if (parts.length >= 3) {
                textPart = parts[0].trim();
                const codePartWithLang = parts[1].trim();
                const firstNewline = codePartWithLang.indexOf('\n');
                if (firstNewline !== -1) {
                  langClass = codePartWithLang.substring(0, firstNewline).trim();
                  codePart = codePartWithLang.substring(firstNewline + 1).trim();
                } else {
                  codePart = codePartWithLang;
                }
              }
              return (
                <div className="flex flex-col flex-1 min-h-0 pt-4 gap-4">
                  <h3 className="text-xl md:text-2xl text-zinc-100 font-semibold leading-relaxed shrink-0">
                    <FormattedText text={textPart} />
                  </h3>
                  {codePart && (
                    <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-2xl flex flex-col flex-1 min-h-[100px] relative group">
                      {/* Simple Header Bar */}
                      <div className="h-10 bg-zinc-950/50 border-b border-zinc-800 flex items-center justify-between px-4 relative z-20 select-none shrink-0">
                        <div className="flex items-center gap-3">
                          <Terminal className="w-4 h-4 text-zinc-500" />
                          <span className="text-xs font-mono font-semibold text-zinc-400 tracking-widest uppercase">
                            {langClass || "Code Snippet"}
                          </span>
                        </div>
                        <div className="text-[10px] font-medium text-zinc-500 flex items-center gap-2 uppercase tracking-widest">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" /> Read Only
                        </div>
                      </div>
                      
                      {/* Editor Container */}
                      <div className="relative bg-transparent flex-1 h-[250px] md:h-[350px]">
                        <CodeEditor 
                          language={langClass || "javascript"} 
                          value={codePart} 
                          readOnly={true} 
                          onChange={() => {}} 
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="space-y-3 pt-4">
              {optionsList.map((opt, i) => {
                const isSelected = userAnswers[`${currentSectionIndex}-${currentQuestion.id}`] === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(currentQuestion.id, opt)}
                    className={`group w-full flex items-center justify-between p-5 border rounded-2xl font-medium text-left transition-all duration-300 active:scale-[0.98] ${
                      isSelected
                        ? "border-purple-500 bg-purple-900/20 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/50"
                        : "border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/50"
                    }`}
                  >
                    <span className="pr-4">{opt}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${isSelected ? "border-purple-500 bg-purple-500/20" : "border-zinc-700"}`}>
                      {isSelected && <div className="w-3 h-3 bg-purple-500 rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-8 mt-8 border-t border-zinc-800/50">
              <button
                onClick={() => handleClearResponse(currentQuestion.id)}
                disabled={!userAnswers[`${currentSectionIndex}-${currentQuestion.id}`]}
                className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Clear Response
              </button>

              {currentIndex < currentSection.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(c => c + 1)}
                  className="px-8 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2 text-sm transition-colors shadow-lg shadow-purple-900/20"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-900/20"
                >
                  Save Section
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSubmitConfirm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                  <Flag className="w-6 h-6 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Submit Section {String.fromCharCode(65 + currentSectionIndex)}?</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  You are about to submit the <strong>{currentSection.title}</strong> section. 
                  Any remaining time will NOT carry over. You cannot return to this section once submitted.
                </p>
              </div>
              <div className="p-6 bg-zinc-900/50 flex items-center justify-end gap-3">
                <button onClick={() => setShowSubmitConfirm(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-300 hover:text-white hover:bg-zinc-800">Cancel</button>
                <button onClick={() => { setShowSubmitConfirm(false); handleCompleteSection(); }} className="px-6 py-2 rounded-xl text-sm font-bold bg-red-500 hover:bg-red-600 text-white">
                  Confirm Submission
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
