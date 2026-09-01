"use client";

import { useEffect, useState, use, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, ArrowLeft, Brain, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { FormattedText } from "@/components/ui/FormattedText";
import { checkAnswer } from "@/lib/utils";
import { TimerBlock } from "@/components/ui/TimerBlock";
import { useCallback } from "react";

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface Question {
  id: string;
  prompt: string;
  options: string | string[];
  correctAnswer: string;
  explanation: string;
  subTopic: string;
  difficulty: Difficulty;
  estimatedTimeSeconds: number;
}

function AdaptiveAptitudeSessionContent() {
  const router = useRouter();
  
  const search = useSearchParams();
  const subTopic = search.get('subTopic') || 'Mix Practice';
  
  // Core State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pools, setPools] = useState<{ EASY: Question[], MEDIUM: Question[], HARD: Question[] }>({ EASY: [], MEDIUM: [], HARD: [] });
  const [loading, setLoading] = useState(true);

  // Adaptive State
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('MEDIUM');
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  
  // Assessment Tracking
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [scoreTrajectory, setScoreTrajectory] = useState<{ difficulty: Difficulty, correct: boolean }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // Settings
  const durationMinutes = parseInt(search.get('duration') || '30');
  const targetBudgetSeconds = durationMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(targetBudgetSeconds);
  const [accumulatedTime, setAccumulatedTime] = useState(0);

  // 1. Fetch & Bucket Questions
  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    async function loadQuestions() {
      try {
        const endpoint = subTopic === "Mix Practice" 
          ? `/api/questions?type=VERBAL&limit=100` 
          : `/api/questions?type=VERBAL&subTopic=${encodeURIComponent(subTopic)}&limit=100`;
          
        const res = await fetch(endpoint);
        if (res.ok) {
          const data: Question[] = await res.json();
          
          // Shuffle function
          const shuffle = (arr: Question[]) => [...arr].sort(() => Math.random() - 0.5);
          
          const easy = shuffle(data.filter(q => q.difficulty === 'EASY'));
          const medium = shuffle(data.filter(q => q.difficulty === 'MEDIUM' || !q.difficulty)); // Fallback
          const hard = shuffle(data.filter(q => q.difficulty === 'HARD'));
          
          setPools({ EASY: easy, MEDIUM: medium, HARD: hard });
          setQuestions(data);
        }
      } catch (err) {
        console.error("Data pipeline breakdown:", err);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [subTopic]);

  const pickNextQuestion = useCallback((targetDifficulty: Difficulty) => {
    const pool = pools[targetDifficulty];
    const available = pool.filter(q => !usedQuestionIds.has(q.id));
    
    // Fallbacks if we run out of questions in a specific difficulty
    let finalAvailable = available;
    if (finalAvailable.length === 0) {
      if (targetDifficulty === 'HARD') finalAvailable = pools['MEDIUM'].filter(q => !usedQuestionIds.has(q.id));
      if (targetDifficulty === 'EASY') finalAvailable = pools['MEDIUM'].filter(q => !usedQuestionIds.has(q.id));
      if (finalAvailable.length === 0) finalAvailable = questions.filter(q => !usedQuestionIds.has(q.id));
    }
    
    if (finalAvailable.length === 0) {
      setTimeout(() => setIsFinished(true), 0);
      return;
    }
    
    const nextQ = finalAvailable[0];
    setCurrentQuestion(nextQ);
    setCurrentDifficulty(nextQ.difficulty || 'MEDIUM');
    setUsedQuestionIds(prev => new Set(prev).add(nextQ.id));
    setSelectedOption(null);
    setIsAnswerRevealed(false);
  }, [pools, usedQuestionIds, questions]);

  // 2. Initial Question Selection
  useEffect(() => {
    if (!loading && questions.length > 0 && !currentQuestion && !isFinished) {
      setTimeout(() => pickNextQuestion('MEDIUM'), 0);
    }
  }, [loading, questions, currentQuestion, isFinished, pickNextQuestion]);


  // 3. Global Timer
  useEffect(() => {
    if (isFinished || loading) return;
    if (timeLeft <= 0) {
      setTimeout(() => setIsFinished(true), 0);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isFinished, loading]);

  const handleSubmit = () => {
    if (!selectedOption || !currentQuestion) return;
    
    const isCorrect = checkAnswer(selectedOption, currentQuestion.correctAnswer);
    
    setScoreTrajectory(prev => [...prev, { difficulty: currentDifficulty, correct: isCorrect }]);
    setIsAnswerRevealed(true);
  };

  const handleNext = () => {
    if (!currentQuestion || !selectedOption) return;
    
    const isCorrect = checkAnswer(selectedOption, currentQuestion.correctAnswer);
    
    const timeSpentOnThisQuestion = currentQuestion.estimatedTimeSeconds || 40;
    const newAccumulated = accumulatedTime + timeSpentOnThisQuestion;
    
    if (newAccumulated >= targetBudgetSeconds) {
      setIsFinished(true);
      return;
    }
    
    setAccumulatedTime(newAccumulated);
    setQuestionsAttempted(prev => prev + 1);
    
    // Adaptive Logic
    let nextDiff: Difficulty = 'MEDIUM';
    if (isCorrect) {
      nextDiff = currentDifficulty === 'EASY' ? 'MEDIUM' : 'HARD';
    } else {
      nextDiff = currentDifficulty === 'HARD' ? 'MEDIUM' : 'EASY';
    }
    
    pickNextQuestion(nextDiff);
  };

  // Calculate Scaled Score (Max 800)
  const calculateScaledScore = () => {
    let base = 200; // Minimum score
    scoreTrajectory.forEach(t => {
      if (t.correct) {
        if (t.difficulty === 'HARD') base += 50;
        else if (t.difficulty === 'MEDIUM') base += 35;
        else base += 20;
      } else {
        if (t.difficulty === 'EASY') base -= 20;
        else if (t.difficulty === 'MEDIUM') base -= 10;
        else base -= 0; // No penalty for getting a hard question wrong
      }
    });
    return Math.min(800, Math.max(200, Math.round(base)));
  };

  useEffect(() => {
    if (isFinished) {
      const finalScore = calculateScaledScore();
      const correctCount = scoreTrajectory.filter(t => t.correct).length;
      fetch('/api/sessions/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: `Verbal Adaptive (${subTopic}) | Scaled: ${finalScore}`,
          score: correctCount,
          totalQuestions: scoreTrajectory.length
        })
      }).catch(e => console.error("Failed to record adaptive session", e));
    }
  }, [isFinished, scoreTrajectory.length, subTopic]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll removed per user request

  if (!loading && questions.length === 0) {
    return (
      <div className="h-[100dvh] bg-zinc-950 flex flex-col items-center justify-center font-mono text-purple-500 gap-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
        <p className="text-sm tracking-widest uppercase text-rose-400">Failed to load questions. Please check the API.</p>
        <button onClick={() => router.replace("/home")} className="mt-4 px-6 py-2 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors">Return Home</button>
      </div>
    );
  }

  // =========================================
  // VIEW: LOADING
  // =========================================
  if (loading) {
    return (
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center font-mono text-purple-500 gap-4">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-sm tracking-widest uppercase">Initializing Adaptive Engine...</p>
      </div>
    );
  }

  // =========================================
  // VIEW: RESULTS
  // =========================================
  if (isFinished) {
    const finalScore = calculateScaledScore();
    const correctCount = scoreTrajectory.filter(t => t.correct).length;
    
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 flex flex-col items-center">
        <div className="max-w-2xl w-full flex items-center justify-between">
          <button onClick={() => router.replace("/home")} className="px-6 py-2.5 bg-zinc-900 text-zinc-300 font-bold uppercase tracking-widest rounded-xl hover:bg-purple-900/40 hover:text-purple-300 hover:border-purple-500/50 transition-all border border-zinc-800 flex items-center gap-2 text-xs shadow-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <ArrowLeft className="w-4 h-4" /> Return to Root
              </button>
        </div>
        <div className="max-w-2xl w-full space-y-8 text-center pt-12">
          <Brain className="w-20 h-20 text-purple-500 mx-auto mb-6" />
          <h1 className="text-4xl font-black text-white uppercase tracking-tight">Adaptive League Complete</h1>
          <p className="text-zinc-400 text-lg">Your calibrated GMAT-style scaled score is ready.</p>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-violet-500/10" />
            <h2 className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-violet-400 relative z-10">
              {finalScore}
            </h2>
            <p className="text-zinc-500 font-bold tracking-widest mt-4 uppercase relative z-10">Out of 800</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-1">Accuracy</p>
              <p className="text-3xl font-black text-white">{correctCount} <span className="text-base text-zinc-500 font-medium">/ {scoreTrajectory.length}</span></p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-1">Final Difficulty</p>
              <p className={`text-3xl font-black ${
                currentDifficulty === 'HARD' ? 'text-rose-400' :
                currentDifficulty === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
              }`}>{currentDifficulty}</p>
            </div>
          </div>

          <button onClick={() => router.replace("/home")} className="mt-8 px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-purple-100 hover:text-purple-900 transition-all shadow-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                Return to Root
              </button>
        </div>
      </div>
    );
  }

  // =========================================
  // VIEW: ACTIVE ADAPTIVE PLAYER
  // =========================================
  if (!currentQuestion) return null;

  const rawOptions = currentQuestion.options;
  const optionsList: string[] = Array.isArray(rawOptions) ? rawOptions : JSON.parse((rawOptions as string) || "[]");

  return (
    <div className="h-[100dvh] bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden relative z-0">
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.replace("/verbal")} className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" /> Adaptive Mode
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-purple-400">{subTopic}</p>
          </div>
        </div>
        <TimerBlock timeLeft={timeLeft} defaultTime={durationMinutes * 60} />
      </header>

      <div ref={scrollContainerRef} data-lenis-prevent className="flex-1 min-h-0 overflow-y-auto p-6 md:p-12">
        <div className="max-w-3xl mx-auto space-y-8 pb-32">
          
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-violet-900/50">
                {questionsAttempted + 1}
              </span>
              <span className="text-zinc-500 font-medium">Question {questionsAttempted + 1}</span>
            </div>
            
            {/* Real-time difficulty indicator (HIDDEN PER USER REQUEST) */}
          </div>

          <h3 className="text-xl md:text-2xl text-zinc-100 font-semibold leading-relaxed pt-2">
            <FormattedText text={currentQuestion.prompt} />
          </h3>

          <div className="space-y-3 pt-4">
            {optionsList.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isCorrectOpt = checkAnswer(opt, currentQuestion.correctAnswer);
              
              let btnStyle = "border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/50";
              
              if (isSelected && !isAnswerRevealed) {
                btnStyle = "border-violet-500 bg-violet-900/20 text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.15)] ring-1 ring-violet-500/50";
              } else if (isAnswerRevealed) {
                if (isCorrectOpt && isSelected) {
                  btnStyle = "border-green-500 bg-green-900/20 text-green-300 ring-1 ring-green-500/50";
                } else if (isSelected && !isCorrectOpt) {
                  btnStyle = "border-rose-500 bg-rose-900/20 text-rose-300 ring-1 ring-rose-500/50";
                } else {
                  btnStyle = "border-zinc-800/50 bg-zinc-900/10 text-zinc-600 opacity-50";
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswerRevealed}
                  onClick={() => setSelectedOption(opt)}
                  className={`group w-full flex items-center justify-between p-5 border rounded-2xl font-medium text-left transition-all duration-300 ${btnStyle}`}
                >
                  <span className="pr-4">{opt}</span>
                </button>
              );
            })}
          </div>

          {isAnswerRevealed && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/80 border border-zinc-700/50 rounded-2xl p-6 mt-6"
            >
              <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-2">Explanation</h4>
              <p className="text-zinc-400 leading-relaxed text-sm">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-6 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 flex justify-center shrink-0 z-10">
        <div className="flex gap-4">
          {!isAnswerRevealed ? (
            <button
              disabled={!selectedOption}
              onClick={handleSubmit}
              className="px-12 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-20 shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:shadow-none"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-12 py-4 bg-violet-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-violet-500 transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)] flex items-center gap-2"
            >
              Next Question <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}



export default function AdaptiveAptitudeSession() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center font-mono text-purple-500 gap-4">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-sm tracking-widest uppercase">Initializing Adaptive Engine...</p>
      </div>
    }>
      <AdaptiveAptitudeSessionContent />
    </Suspense>
  );
}
