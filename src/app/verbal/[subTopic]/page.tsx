"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { FormattedText } from "@/components/ui/FormattedText";
import { ScoreSummary } from "@/components/ui/ScoreSummary";
import { QuestionReviewCard, type Question } from "@/components/ui/QuestionReviewCard";
import { TimerBlock } from "@/components/ui/TimerBlock";

export default function ActiveVerbalSession({
  params,
}: {
  params: Promise<{ subTopic: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const subTopic = decodeURIComponent(resolvedParams.subTopic);

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

  // Timer State: 30 mins (1800s) default, or dynamic if "Mix Practice"
  const defaultTime =
    subTopic === "Mix Practice"
      ? parseInt(searchParams.get("duration") || "60") * 60
      : 1800; // 30 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(defaultTime);

  // 1. Fetch and Randomize Questions
  useEffect(() => {
    let ignore = false;
    async function loadQuestions() {
      try {
        // If it's a Mix Practice, omit the subTopic filter to fetch from all categories
        const endpoint =
          subTopic === "Mix Practice"
            ? `/api/questions?type=VERBAL`
            : `/api/questions?type=VERBAL&subTopic=${encodeURIComponent(subTopic)}`;

        const res = await fetch(endpoint);
        if (res.ok) {
          const data: Question[] = await res.json();
          let limit = 45;
          if (subTopic === "Mix Practice") {
            limit = Math.floor(defaultTime / 40);
          } else if (subTopic === "Reading Comprehension") {
            limit = 12;
          }
          let selectedQuestions: Question[] = [];

          if (subTopic === "Mix Practice") {
            // Maximum Diversity Algorithm
            // 1. Group questions by their subTopic
            const grouped = new Map<string, Question[]>();
            data.forEach(q => {
              if (!grouped.has(q.subTopic)) grouped.set(q.subTopic, []);
              grouped.get(q.subTopic)!.push(q);
            });

            // 2. Shuffle questions inside each group
            for (const group of grouped.values()) {
              for (let i = group.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [group[i], group[j]] = [group[j], group[i]];
              }
            }

            // 3. Shuffle the groups themselves
            const groups = Array.from(grouped.values());
            for (let i = groups.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [groups[i], groups[j]] = [groups[j], groups[i]];
            }

            // 4. Pick round-robin (one from each subTopic) until limit is reached
            let groupIndex = 0;
            while (selectedQuestions.length < limit && groups.length > 0) {
              const g = groups[groupIndex % groups.length];
              const q = g.pop();
              if (q) {
                selectedQuestions.push(q);
              } else {
                groups.splice(groupIndex % groups.length, 1);
                continue; // don't increment groupIndex so we check the new group at this index
              }
              groupIndex++;
            }

            // 5. Final shuffle of the selected questions
            for (let i = selectedQuestions.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [selectedQuestions[i], selectedQuestions[j]] = [selectedQuestions[j], selectedQuestions[i]];
            }
          } else {
            // True Random Shuffle using Fisher-Yates algorithm for unbiased distribution
            for (let i = data.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [data[i], data[j]] = [data[j], data[i]];
            }
            selectedQuestions = data.slice(0, limit);
          }

          if (!ignore) {
            setQuestions(selectedQuestions);
          }
        }
      } catch (err) {
        console.error("Data pipeline breakdown:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadQuestions();
    
    return () => {
      ignore = true;
    };
  }, [subTopic, defaultTime]);

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

  const handleCompleteAssessment = () => {
    setIsSubmitted(true);
    let calculatedScore = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) calculatedScore += 1;
    });
    setScore(calculatedScore);
    // Optional: Add logic here to POST the score to your Submission table
  };

  // =========================================
  // VIEW: LOADING
  // =========================================
  if (loading) {
    return (
      <div className="h-screen overflow-hidden bg-zinc-950 flex flex-col items-center justify-center font-mono text-purple-500 gap-4">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-sm tracking-widest uppercase">
          Initializing Secure Terminal...
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="h-screen overflow-hidden bg-zinc-950 flex flex-col items-center justify-center space-y-4 p-6">
        <AlertCircle className="w-12 h-12 text-zinc-600" />
        <p className="text-zinc-400 font-medium">
          No questions populated for {subTopic} yet.
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-zinc-800 text-white rounded-lg text-sm font-bold"
        >
          Go Back
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
      <div className="h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden flex flex-col">
        <div
          className="flex-1 overflow-y-auto p-6 md:p-12"
          data-lenis-prevent="true"
        >
          <div className="max-w-4xl mx-auto space-y-8 pb-24">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-black text-white">
                Assessment Complete
              </h1>
              <p className="text-zinc-400">
                Review your performance diagnostics for{" "}
                <span className="text-purple-400 font-bold">{subTopic}</span>
              </p>

              {/* Upgraded 3-Metric Summary Dashboard */}
              <ScoreSummary
                score={score}
                totalQuestions={questions.length}
                accuracy={accuracy}
                unansweredCount={unansweredCount}
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-4">
                Detailed Review
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
                onClick={() => router.push("/verbal")}
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
    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden relative z-0">
      {/* Global Ambient Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/verbal")}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              {subTopic} League
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-purple-400">
              {questions.length} Questions
            </p>
          </div>
        </div>

        {/* The Ticking Clock */}
        <TimerBlock timeLeft={timeLeft} defaultTime={defaultTime} />
      </header>

      {/* Sleek Progress Bar */}
      <div className="h-1 w-full bg-zinc-900 shrink-0">
        <div 
          className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane: Question & Options */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-6 md:p-12 relative"
          data-lenis-prevent="true"
        >
          <div className="max-w-3xl mx-auto pb-24 overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                  <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-purple-900/50">
                    {currentIndex + 1}
                  </span>
                  <span className="text-zinc-500 font-medium">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                </div>

            <h3 className="text-xl md:text-2xl text-zinc-100 font-semibold leading-relaxed pt-2">
              <FormattedText text={currentQuestion.prompt} />
            </h3>

            <div className="space-y-3 pt-4">
              {optionsList.map((opt, i) => {
                const isSelected = userAnswers[currentQuestion.id] === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(currentQuestion.id, opt)}
                    className={`group w-full flex items-center justify-between p-5 border rounded-2xl font-medium text-left transition-all duration-300 active:scale-[0.98] ${
                      isSelected
                        ? "border-purple-500 bg-purple-900/20 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/50"
                        : "border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-black/20"
                    }`}
                  >
                    <span className="pr-4">{opt}</span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${isSelected ? "border-purple-500 bg-purple-500/20" : "border-zinc-700 group-hover:border-zinc-500"}`}
                    >
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" 
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Inline Navigator Layout */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-zinc-800/50">
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
                  className="px-8 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2 text-sm transition-colors shadow-lg shadow-purple-900/20 active:scale-95"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-900/20 active:scale-95"
                >
                  Submit
                </button>
              )}
            </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Pane: Navigation Matrix & Submit */}
        <div className="w-80 border-l border-zinc-800 bg-zinc-950 flex flex-col shrink-0 lg:flex overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-purple-500" />
            <h3 className="font-bold text-white">Question Navigator</h3>
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
                  "border-zinc-800 text-zinc-500 hover:border-zinc-500";
                if (isAttempted)
                  tileStyle =
                    "border-purple-500/50 bg-purple-900/20 text-purple-400";
                if (isActive)
                  tileStyle =
                    "border-white bg-zinc-800 text-white ring-2 ring-zinc-800";

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

          <div className="p-6 border-t border-zinc-800 bg-zinc-950 space-y-4">
            <div className="flex justify-between text-xs font-medium text-zinc-400">
              <span>Attempted: {Object.keys(userAnswers).length}</span>
              <span>
                Pending: {questions.length - Object.keys(userAnswers).length}
              </span>
            </div>
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="w-full py-4 bg-zinc-100 hover:bg-zinc-300 text-zinc-950 font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Submit Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer Navigation (Since right pane is hidden on mobile) */}
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
            className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl flex items-center gap-2 text-sm"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-6 transform scale-100 animate-in fade-in zoom-in duration-200">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Submit Assessment?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                You have attempted <span className="text-purple-400 font-bold">{Object.keys(userAnswers).length}</span> out of <span className="text-white font-bold">{questions.length}</span> questions.
                <br /><br />
                Are you sure you want to submit and view your results?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirm(false);
                  handleCompleteAssessment();
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
