"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, CircleCheck, AlertCircle, ArrowRight, ArrowLeft, Lightbulb, CheckCircle2, XCircle, LayoutGrid, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: string;
  prompt: string;
  options: string | string[]; // Stored as JSON string in DB
  correctAnswer: string;
  explanation: string;
}

// ResultCard Component for optimized rendering and rich UI
const ResultCard = ({ q, index, userAnswer }: { q: Question, index: number, userAnswer: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCorrect = userAnswer === q.correctAnswer;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
    >
      <Card className={`overflow-hidden border-zinc-800/80 rounded-2xl transition-all duration-300 ${isExpanded ? 'bg-zinc-900/50 shadow-lg shadow-purple-900/10' : 'bg-zinc-900/30 hover:bg-zinc-900/40'}`}>
        <div className="p-4 sm:p-6 space-y-2 sm:space-y-4">
          <div className="flex items-start justify-between gap-4 cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
            <p className="text-zinc-200 font-medium leading-relaxed"><span className="text-purple-500 font-bold mr-2">Q{index + 1}.</span>{q.prompt}</p>
            <div className="flex items-center gap-3 shrink-0 mt-1">
              {isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-rose-500" />}
              {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-500 transition-transform duration-300" /> : <ChevronDown className="w-5 h-5 text-zinc-500 transition-transform duration-300" />}
            </div>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-4 border-t border-zinc-800/50 mt-4">
                  <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50 space-y-2 text-sm">
                    <p><span className="text-zinc-500">Your Answer:</span> <span className={isCorrect ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>{userAnswer || "Skipped"}</span></p>
                    {!isCorrect && <p><span className="text-zinc-500">Correct Answer:</span> <span className="text-emerald-400 font-semibold">{q.correctAnswer}</span></p>}
                  </div>

                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Solution Explanation</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export default function ActiveAptitudeSession({ params }: { params: Promise<{ subTopic: string }> }) {
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

  // Timer State: 30 mins (1800s) default, or dynamic if "Mix Practice"
  const defaultTime = subTopic === "Mix Practice" 
    ? (parseInt(searchParams.get("duration") || "60") * 60) 
    : 1800; // 30 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(defaultTime);

  // 1. Fetch and Randomize Questions
  useEffect(() => {
    async function loadQuestions() {
      try {
        // If it's a Mix Practice, omit the subTopic filter to fetch from all categories
        const endpoint = subTopic === "Mix Practice" 
          ? `/api/questions?type=APTITUDE` 
          : `/api/questions?type=APTITUDE&subTopic=${encodeURIComponent(subTopic)}`;

        const res = await fetch(endpoint);
        if (res.ok) {
          const data: Question[] = await res.json();
          // Randomize / Shuffle the questions array
          const shuffled = data.sort(() => Math.random() - 0.5);
          
          // If Mix Practice, limit questions based on duration (e.g., 1.5 mins per question)
          const limit = subTopic === "Mix Practice" ? Math.floor(defaultTime / 90) : shuffled.length;
          setQuestions(shuffled.slice(0, limit));
        }
      } catch (err) {
        console.error("Data pipeline breakdown:", err);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isSubmitted]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 3. Selection & Submission Logic
  const handleSelectOption = (questionId: string, option: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleClearResponse = (questionId: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
  };

  const handleCompleteAssessment = () => {
    setIsSubmitted(true);
    let calculatedScore = 0;
    questions.forEach(q => {
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
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-mono text-purple-500 gap-4">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-sm tracking-widest uppercase">Initializing Secure Terminal...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4 p-6">
        <AlertCircle className="w-12 h-12 text-zinc-600" />
        <p className="text-zinc-400 font-medium">No questions populated for {subTopic} yet.</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-zinc-800 text-white rounded-lg text-sm font-bold">Go Back</button>
      </div>
    );
  }

  // =========================================
  // VIEW: RESULTS REPORT (POST-SUBMISSION)
  // =========================================
  if (isSubmitted) {
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans overflow-x-hidden"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.4 }}
            className="text-center space-y-4 mb-12"
          >
            <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-purple-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Assessment Complete</h1>
            <p className="text-zinc-400 text-lg">Review your performance diagnostics for <span className="text-purple-400 font-bold">{subTopic}</span></p>
            
            <div className="flex justify-center gap-6 mt-10">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-3xl w-44 shadow-xl shadow-black/50"
              >
                <p className="text-5xl font-black text-purple-400">{score}<span className="text-2xl text-zinc-600">/{questions.length}</span></p>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mt-3 font-bold">Score</p>
              </motion.div>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
                className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-3xl w-44 shadow-xl shadow-black/50"
              >
                <p className={`text-5xl font-black ${accuracy > 70 ? 'text-emerald-400' : accuracy > 40 ? 'text-amber-400' : 'text-rose-400'}`}>{accuracy}%</p>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mt-3 font-bold">Accuracy</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6 pt-8"
          >
            <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
              <LayoutGrid className="w-6 h-6 text-purple-500" />
              <h3 className="text-2xl font-bold text-white tracking-tight">Detailed Review</h3>
            </div>
            
            <div className="space-y-4">
              {questions.map((q, index) => (
                <ResultCard key={q.id} q={q} index={index} userAnswer={userAnswers[q.id]} />
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center pt-12 pb-12"
          >
            <button 
              onClick={() => router.push('/aptitude')} 
              className="px-8 py-4 bg-white text-black font-black rounded-full hover:bg-zinc-200 transition-all hover:scale-105 shadow-xl shadow-white/10 active:scale-95 text-lg"
            >
              Return to Dashboard
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // =========================================
  // VIEW: ACTIVE ASSESSMENT (SPLIT PANE)
  // =========================================
  const currentQuestion = questions[currentIndex];
  const rawOptions = currentQuestion.options;
  const optionsList: string[] = Array.isArray(rawOptions) ? rawOptions : JSON.parse(rawOptions as string || "[]");

  // The Dynamic Color-Graded Timer
  const timePercentage = (timeLeft / defaultTime) * 100;
  let timerStyle = "bg-zinc-900 border-zinc-800 text-zinc-300";
  if (timePercentage > 50) {
    timerStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
  } else if (timePercentage > 20) {
    timerStyle = "bg-amber-500/10 border-amber-500/30 text-amber-400";
  } else {
    timerStyle = "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]";
  }

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden">
      
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/aptitude')} className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">{subTopic} Sprint</h2>
            <p className="text-[10px] uppercase tracking-widest text-purple-400">{questions.length} Questions</p>
          </div>
        </div>

        {/* The Ticking Clock */}
        <div className={`flex items-center gap-2 font-mono font-bold text-sm px-4 py-1.5 rounded-full border ${timerStyle}`}>
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Pane: Question & Options */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 md:p-12 relative">
          <div className="max-w-3xl mx-auto space-y-8 pb-24">
            
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-purple-900/50">
                {currentIndex + 1}
              </span>
              <span className="text-zinc-500 font-medium">Question {currentIndex + 1} of {questions.length}</span>
            </div>

            <h3 className="text-xl md:text-2xl text-zinc-100 font-semibold leading-relaxed">
              {currentQuestion.prompt}
            </h3>

            <div className="space-y-3 pt-4">
              {optionsList.map((opt, i) => {
                const isSelected = userAnswers[currentQuestion.id] === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(currentQuestion.id, opt)}
                    className={`w-full flex items-center justify-between p-5 border rounded-2xl font-medium text-left transition-all duration-300 ${
                      isSelected 
                      ? "border-purple-500 bg-purple-950/20 text-purple-300 shadow-inner" 
                      : "border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900"
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? "border-purple-500" : "border-zinc-600"}`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full" />}
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
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="px-8 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2 text-sm transition-colors shadow-lg shadow-purple-900/20"
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
        <div className="w-80 border-l border-zinc-800 bg-zinc-950 flex flex-col shrink-0 hidden lg:flex">
          
          <div className="p-6 border-b border-zinc-800 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-purple-500" />
            <h3 className="font-bold text-white">Question Navigator</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-4 gap-3">
              {questions.map((q, idx) => {
                const isAttempted = !!userAnswers[q.id];
                const isActive = idx === currentIndex;
                
                let tileStyle = "border-zinc-800 text-zinc-500 hover:border-zinc-500";
                if (isAttempted) tileStyle = "border-purple-500/50 bg-purple-900/20 text-purple-400";
                if (isActive) tileStyle = "border-white bg-zinc-800 text-white ring-2 ring-zinc-800";

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
              <span>Pending: {questions.length - Object.keys(userAnswers).length}</span>
            </div>
            <button
              onClick={handleCompleteAssessment}
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
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        {currentIndex === questions.length - 1 ? (
           <button onClick={handleCompleteAssessment} className="px-6 py-3 bg-zinc-100 text-zinc-950 font-bold rounded-xl text-sm">Submit</button>
        ) : (
          <button 
            onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
            className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl flex items-center gap-2 text-sm"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}