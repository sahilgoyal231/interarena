"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  LayoutGrid,
  Terminal,
  Flag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { FormattedText } from "@/components/ui/FormattedText";
import { CodeEditor } from "@/components/ui/CodeEditor";
import { ScoreSummary } from "@/components/ui/ScoreSummary";
import { QuestionReviewCard, type Question } from "@/components/ui/QuestionReviewCard";
import { TimerBlock } from "@/components/ui/TimerBlock";
import { checkAnswer } from "@/lib/utils";

function ActiveCodingSessionInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Scroll Container Ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Core State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Assessment Tracking State
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Timer State: 30 mins (1800s) default
  const defaultTime = parseInt(searchParams.get("duration") || "30") * 60;
  const [timeLeft, setTimeLeft] = useState(defaultTime);

  // 1. Fetch and Randomize Questions
  useEffect(() => {
    async function loadQuestions() {
      try {
        const lang = searchParams.get("lang");
        const endpoint = lang ? `/api/questions?type=GUESS_OUTPUT&category=${encodeURIComponent(lang)}&limit=20` : `/api/questions?type=GUESS_OUTPUT&limit=20`;
        const res = await fetch(endpoint);
        if (res.ok) {
          const data: Question[] = await res.json();
          setQuestions(data);
        }
      } catch (err) {
        console.error("Data pipeline breakdown:", err);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [defaultTime]);

  // 2. Global Countdown & Auto-Submit
  useEffect(() => {
    if (isSubmitted) return;

    if (timeLeft <= 0) {
      handleCompleteAssessment(); // Auto-submit when time hits 0
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isSubmitted]);

  // Reset scroll position when navigating to a new question
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [currentIndex]);

  // Smoothly scroll to top on submission without layout thrashing
  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSubmitted]);

  // 3. Selection & Submission Logic
  const handleSelectOption = (questionId: string, option: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleClearResponse = (questionId: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
  };

  const handleCompleteAssessment = async () => {
    setIsSubmitted(true);
    let calculatedScore = 0;
    questions.forEach((q) => {
      if (checkAnswer(userAnswers[q.id], q.correctAnswer)) calculatedScore += 1;
    });
    setScore(calculatedScore);

    try {
      const lang = searchParams.get("lang");
      await fetch('/api/sessions/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: lang ? `Guess Output (${lang})` : `Guess Output`,
          score: calculatedScore,
          totalQuestions: questions.length
        })
      });
    } catch (e) {
      console.error("Failed to record session", e);
    }
  };

  // =========================================
  // VIEW: LOADING
  // =========================================
  if (loading) {
    return (
      <div className="h-screen overflow-hidden bg-zinc-950 flex flex-col items-center justify-center font-sans text-fuchsia-500 gap-4 selection:bg-purple-500/30">
        <div className="w-10 h-10 border-4 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin" />
        <p className="text-sm tracking-widest uppercase font-black">
          Compiling Code Snippets...
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="h-screen overflow-hidden bg-zinc-950 flex flex-col items-center justify-center space-y-4 p-6 selection:bg-purple-500/30">
        <AlertCircle className="w-12 h-12 text-zinc-600" />
        <p className="text-zinc-400 font-medium">
          No coding questions populated yet.
        </p>
        <button
          onClick={() => router.push("/coding")}
          className="px-6 py-2 bg-zinc-800 text-white rounded-lg text-sm font-bold"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  // =========================================
  // VIEW: RESULTS REPORT (POST-SUBMISSION)
  // =========================================
  if (isSubmitted) {
    const accuracy = Math.round((score / questions.length) * 100);
    const attemptedCount = Object.keys(userAnswers).length;
    const unansweredCount = questions.length - attemptedCount;

    return (
      <div className="h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden flex flex-col selection:bg-purple-500/30">
        <div
          className="flex-1 overflow-y-auto p-6 md:p-12"
          data-lenis-prevent="true"
        >
          <div className="max-w-4xl mx-auto space-y-8 pb-24">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-black text-white">
                Execution Complete
              </h1>
              <p className="text-zinc-400">
                Review your output prediction diagnostics
              </p>

              <ScoreSummary
                score={score}
                totalQuestions={questions.length}
                accuracy={accuracy}
                unansweredCount={unansweredCount}
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-4">
                Detailed Compilation Log
              </h3>
              {questions.map((q, index) => (
                <QuestionReviewCard
                  key={q.id}
                  question={q}
                  index={index}
                  userAnswer={userAnswers[q.id]}
                />
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <button
                onClick={() => router.push("/coding")}
                className="px-8 py-3 bg-zinc-100 text-zinc-950 font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-300 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // VIEW: ACTIVE ASSESSMENT (SPLIT PANE)
  // =========================================
  const currentQuestion = questions[currentIndex];
  const rawOptions = currentQuestion.options;
  const optionsList: string[] = Array.isArray(rawOptions)
    ? rawOptions
    : JSON.parse((rawOptions as string) || "[]");

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden relative z-0 selection:bg-purple-500/30">
      {/* Global Ambient Glow */}
      <div className="absolute inset-0 bg-[url('https://grainy-linears.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay z-0" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/coding")}
            className="group flex items-center justify-center w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-purple-500/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-purple-400 group-hover:-translate-x-1 transition-all" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Hunt the Outputs
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-fuchsia-400 font-bold">
              {questions.length} Questions
            </p>
          </div>
        </div>

        {/* The Ticking Clock */}
        <TimerBlock timeLeft={timeLeft} defaultTime={defaultTime} />
      </header>

      {/* Main Split Layout */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left Pane: Question & Options */}
        <div className="flex-1 p-6 md:p-12 relative flex flex-col h-full overflow-hidden">
          <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4 shrink-0">
              <span className="w-8 h-8 rounded-full bg-fuchsia-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-fuchsia-900/50">
                {currentIndex + 1}
              </span>
              <span className="text-zinc-500 font-medium">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            {(() => {
              let textPart = "Analyze the code snippet below and predict its output:";
              let codePart = currentQuestion.prompt.trim();
              
              let urlLang = searchParams.get("lang")?.toLowerCase() || "javascript";
              if (urlLang === "c++") urlLang = "cpp";
              let langClass = urlLang;

              if (currentQuestion.prompt.includes("```")) {
                const parts = currentQuestion.prompt.split("```");
                if (parts.length >= 3) {
                  textPart = parts[0].trim() || textPart;
                  const codePartWithLang = parts[1].trim();
                  const firstNewline = codePartWithLang.indexOf('\n');
                  if (firstNewline !== -1) {
                    const parsedLang = codePartWithLang.substring(0, firstNewline).trim();
                    if (parsedLang) langClass = parsedLang;
                    codePart = codePartWithLang.substring(firstNewline + 1).trim();
                  } else {
                    codePart = codePartWithLang;
                  }
                }
              }
              
              // Clean up any conversational text that accidentally leaked into the code snippet
              codePart = codePart
                .replace(/what is the output of the following.*?(program|code|snippet)\s*[:?]?/gi, '')
                .replace(/what will be the output.*?\?/gi, '')
                .replace(/predict the output.*?\:/gi, '')
                .trim();
              return (
                <div className="flex flex-col flex-1 min-h-0 pt-4 gap-4">
                  <h3 className="text-xl text-zinc-100 font-semibold leading-relaxed shrink-0">
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
                      <div className="relative bg-transparent flex-1">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-6 shrink-0">
              {optionsList.map((opt, i) => {
                const isSelected = userAnswers[currentQuestion.id] === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(currentQuestion.id, opt)}
                    className={`group w-full flex items-center justify-between p-5 border rounded-2xl font-medium text-left transition-all duration-300 active:scale-[0.98] ${
                      isSelected
                        ? "border-fuchsia-500 bg-fuchsia-900/20 text-fuchsia-200 shadow-[0_0_20px_rgba(217,70,239,0.15)] ring-1 ring-fuchsia-500/50"
                        : "border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-black/20"
                    }`}
                  >
                    <span className="pr-4 font-mono text-sm"><FormattedText text={opt} /></span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${isSelected ? "border-fuchsia-500 bg-fuchsia-500/20" : "border-zinc-700 group-hover:border-zinc-500"}`}
                    >
                      {isSelected && (
                        <div className="w-3 h-3 bg-fuchsia-500 rounded-full shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Inline Navigator Layout */}
            <div className="flex items-center justify-between pt-6 mt-4 border-t border-zinc-800/50 shrink-0">
              <button
                onClick={() => handleClearResponse(currentQuestion.id)}
                disabled={!userAnswers[currentQuestion.id]}
                className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                Clear Response
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="px-8 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl flex items-center gap-2 text-sm transition-colors shadow-lg shadow-fuchsia-900/20"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleCompleteAssessment}
                  className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-900/20"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Pane: Navigation Matrix & Submit */}
        <div className="w-80 border-l border-zinc-800 bg-zinc-950/50 backdrop-blur-sm flex flex-col shrink-0 lg:flex overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-fuchsia-500" />
            <h3 className="font-bold text-white">Questions Navigator</h3>
          </div>

          <div
            className="flex-1 overflow-y-auto p-6 min-h-0"
            data-lenis-prevent="true"
          >
            <div className="grid grid-cols-4 gap-3">
              {questions.map((q, idx) => {
                const isAttempted = !!userAnswers[q.id];
                const isActive = idx === currentIndex;

                let tileStyle =
                  "border-zinc-800 text-zinc-500 hover:border-zinc-500 bg-zinc-900/50";
                if (isAttempted)
                  tileStyle =
                    "border-fuchsia-500/50 bg-fuchsia-900/20 text-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.1)]";
                if (isActive)
                  tileStyle =
                    "border-white bg-zinc-800 text-white ring-2 ring-zinc-800 shadow-xl shadow-black/50";

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center text-sm font-bold transition-all ${tileStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 border-t border-zinc-800 bg-zinc-950/80 space-y-4">
            <div className="flex justify-between text-xs font-medium text-zinc-400">
              <span>Predicted: {Object.keys(userAnswers).length}</span>
              <span>
                Pending: {questions.length - Object.keys(userAnswers).length}
              </span>
            </div>
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="w-full py-4 bg-zinc-100 hover:bg-zinc-300 text-zinc-950 font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Submit Practice
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 flex items-center justify-between z-50">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="px-6 py-3 bg-zinc-100 text-zinc-950 font-bold rounded-xl text-sm"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                Math.min(questions.length - 1, prev + 1),
              )
            }
            className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-fuchsia-900/20 transition-all"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* End Session Custom Confirmation Modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmitConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
            >
               {/* Modal Header */}
               <div className="p-6 border-b border-zinc-800">
                  <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                    <Flag className="w-6 h-6 text-red-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">End the hunt?</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    You have attempted <span className="text-purple-400 font-bold">{Object.keys(userAnswers).length}</span> out of <span className="text-white font-bold">{questions.length}</span> questions.
                    <br /><br />
                    Are you sure you want to end this hunt? You will be taken to your results and won't be able to submit further answers.
                  </p>
               </div>
               {/* Modal Actions */}
               <div className="p-6 bg-zinc-900/50 flex items-center justify-end gap-3">
                  <button 
                    onClick={() => setShowSubmitConfirm(false)}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setShowSubmitConfirm(false);
                      handleCompleteAssessment();
                    }}
                    className="px-6 py-2 rounded-xl text-sm font-bold bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all"
                  >
                    End Hunt
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ActiveCodingSession() {
  return (
    <Suspense fallback={<div className="h-screen bg-zinc-950 flex items-center justify-center font-mono text-purple-500">Loading...</div>}>
      <ActiveCodingSessionInner />
    </Suspense>
  );
}
