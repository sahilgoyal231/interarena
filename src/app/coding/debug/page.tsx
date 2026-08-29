"use client"

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Play, CheckCircle2, Circle, Send, Terminal, Loader2, SearchCode, Server, List, Flag, Trophy, Target, Sparkles, BookOpen } from "lucide-react";
import { CodeEditor } from "@/components/ui/CodeEditor";
import { TerminalOutput } from "@/components/ui/TerminalOutput";
import { motion, AnimatePresence } from "framer-motion";
import { FormattedText } from "@/components/ui/FormattedText";
import { SessionSetup } from "@/components/ui/SessionSetup";
import { GlobalTimer } from "@/components/ui/GlobalTimer";

const LANGUAGES = [
  { id: "python", name: "Python", defaultCode: "print('Hello, InterArena!')" },
  { id: "javascript", name: "JavaScript", defaultCode: "console.log('Hello, InterArena!');" },
  { id: "c++", name: "C++", defaultCode: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, InterArena!\" << std::endl;\n    return 0;\n}" },
  { id: "java", name: "Java", defaultCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, InterArena!\");\n    }\n}" },
];

function CodeDebugInner() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Record<string, any> | null>(null);
  
  const [language, setLanguage] = useState(LANGUAGES[0].id);
  const [code, setCode] = useState(LANGUAGES[0].defaultCode);
  
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [solvedQuestions, setSolvedQuestions] = useState<Set<string>>(new Set());
  const [sessionState, setSessionState] = useState<'setup' | 'active' | 'results'>('setup');
  const [sessionDuration, setSessionDuration] = useState<number | null>(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const handleSessionStart = async (lang: string, duration: number) => {
    setLoading(true);
    const mappedLang = LANGUAGES.find(l => l.id === lang) || LANGUAGES[0];
    setLanguage(mappedLang.id);
    setSessionDuration(duration);
    
    // Calculate limit based on duration (30m -> 6, 45m -> 9, 60m -> 12)
    const limit = duration === 30 ? 6 : duration === 45 ? 9 : 12;

    try {
      const res = await fetch(`/api/questions?type=DEBUG_CODE&category=${encodeURIComponent(mappedLang.id)}&limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
        if (data.length > 0) {
          setSelectedQuestion(data[0]);
          setCode(data[0].boilerPlateCode || mappedLang.defaultCode);
        } else {
          setCode(mappedLang.defaultCode);
        }
      }
    } catch (err) {
      console.error("Failed to fetch debug questions", err);
    } finally {
      setLoading(false);
      setSessionState('active');
    }
  };

  const handleEndSession = () => {
    setShowEndConfirm(true);
  };

  useEffect(() => {
    // Initial load complete
    setTimeout(() => setLoading(false), 0);
  }, []);

  const handleSelectQuestion = (q: Record<string, any>) => {
    setSelectedQuestion(q);
    const subTopic = typeof q.subTopic === 'string' ? q.subTopic.toLowerCase() : '';
    let mappedLang = LANGUAGES.find(l => l.id === subTopic || l.name.toLowerCase() === subTopic);
    if (!mappedLang) mappedLang = LANGUAGES[0];
    
    setLanguage(mappedLang.id);
    setCode(q.boilerPlateCode || mappedLang.defaultCode);
    setStdout("");
    setStderr("");
    setExecutionTime(undefined);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLangId = e.target.value;
    setLanguage(newLangId);
    
    const newLang = LANGUAGES.find((l) => l.id === newLangId);
    if (newLang && !selectedQuestion) {
      setCode(newLang.defaultCode);
    }
  };

  const executeCode = async (isSubmit: boolean) => {
    setIsExecuting(true);
    setStdout("Executing...");
    setStderr("");
    setExecutionTime(undefined);

    let rawTestCases: Record<string, any> | any[] | null = null;
    if (selectedQuestion && selectedQuestion.testCases) {
        try {
           rawTestCases = typeof selectedQuestion.testCases === 'string' ? JSON.parse(selectedQuestion.testCases) : selectedQuestion.testCases;
        } catch(e) {}
    }

    let testCasesToRun: Array<{ input: string, expectedOutput: string }> = [];
    
    // Support the new { example: [], hidden: [] } schema
    if (rawTestCases && !Array.isArray(rawTestCases)) {
       const typedRaw = rawTestCases as { hidden?: any[], example?: any[] };
       if (isSubmit) {
          testCasesToRun = typedRaw.hidden || [];
       } else {
          testCasesToRun = typedRaw.example || [];
       }
    } else if (Array.isArray(rawTestCases)) {
       // Fallback for old schema
       testCasesToRun = rawTestCases as Array<{ input: string, expectedOutput: string }>;
    }

    if (testCasesToRun.length === 0) {
        testCasesToRun = [{ input: "", expectedOutput: "" }];
    }

    try {
        let allPassed = true;
        let finalStdout = "";
        let finalStderr = "";
        let totalExecTime = 0;

        const testType = isSubmit ? "Hidden Test Case" : "Example Test Case";

        for (let i = 0; i < testCasesToRun.length; i++) {
            const tc = testCasesToRun[i];
            const res = await fetch("/api/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language,
                    code,
                    stdin: tc.input || ""
                })
            });

            if (!res.body) throw new Error("No response body");
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let tcStdout = "";
            let tcStderr = "";
            let tcTime = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                let boundary = buffer.indexOf("\n\n");
                
                while (boundary !== -1) {
                    const message = buffer.slice(0, boundary);
                    buffer = buffer.slice(boundary + 2);
                    
                    if (message.startsWith("data: ")) {
                        try {
                            const parsed = JSON.parse(message.substring(6));
                            if (parsed.type === "stdout") {
                                tcStdout += parsed.data;
                                setStdout(finalStdout + tcStdout);
                            } else if (parsed.type === "stderr") {
                                tcStderr += parsed.data;
                                setStderr(finalStderr + tcStderr);
                            } else if (parsed.type === "done") {
                                tcTime = parsed.executionTime;
                            }
                        } catch (e) {}
                    }
                    boundary = buffer.indexOf("\n\n");
                }
            }
            
            totalExecTime += tcTime || 0;
            
            if (tcStderr) {
                 finalStdout += `${testType} ${i+1} Failed!\n\n`;
                 finalStderr += `Stderr output: \n${tcStderr}\n\n`;
                 setStdout(finalStdout);
                 setStderr(finalStderr);
                 allPassed = false;
                 if (isSubmit) break;
            } else {
                 const actual = (tcStdout || "").trim();
                 const expected = (tc.expectedOutput || "").trim();
                 
                 if (actual !== expected) {
                     finalStdout += `${testType} ${i+1} Failed!\nExpected:\n${expected}\n\nActual:\n${actual}\n\n`;
                     setStdout(finalStdout);
                     allPassed = false;
                     if (isSubmit) break;
                 } else {
                     finalStdout += `${testType} ${i+1} Passed!\n\n`;
                     setStdout(finalStdout);
                 }
            }
        }

        setStdout(finalStdout);
        setStderr(finalStderr);
        setExecutionTime(totalExecTime);
        
        if (isSubmit && allPassed && testCasesToRun.length > 0 && !finalStderr) {
             setStdout(finalStdout + "\n\n🎉 All hidden test cases passed successfully! Problem Solved!");
             setSolvedQuestions(prev => new Set(prev).add(String(selectedQuestion?.id)));
        }

    } catch (error: any) {
        const msg = error instanceof Error ? error.message : String(error);
        setStderr("Failed to connect to execution engine: " + msg);
    } finally {
        setIsExecuting(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden relative z-0 selection:bg-purple-500/30">
      
      <AnimatePresence mode="popLayout">
        {sessionState === 'setup' && (
          <SessionSetup key="setup" onStart={handleSessionStart} />
        )}
      </AnimatePresence>

      {sessionState === 'active' && (
        <>
      {/* Top Navigation */}
      <motion.header 
        className="h-14 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between px-4 shrink-0 relative z-10"
      >
        <div className="flex items-center gap-4">
          <Link href="/coding" replace className="text-zinc-400 hover:text-purple-400 transition-colors bg-zinc-900 w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-800 hover:border-purple-500/50">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <SearchCode className="w-5 h-5 text-purple-500" />
            <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              Debug Mode <span className="text-purple-500 px-1.5 py-0.5 bg-purple-500/10 rounded text-[9px] uppercase border border-purple-500/20">Active</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {sessionDuration && <GlobalTimer initialMinutes={sessionDuration} />}
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 opacity-70 cursor-not-allowed">
            <Server className="w-3.5 h-3.5 text-purple-400" />
            <select
              value={language}
              disabled
              onChange={handleLanguageChange}
              className="bg-transparent text-xs font-bold text-zinc-200 outline-none w-24 focus:ring-0 appearance-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id} className="bg-zinc-900 text-zinc-300">
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => executeCode(false)}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-bold uppercase rounded-lg transition-colors disabled:opacity-50 border border-zinc-700"
          >
            {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            Run
          </button>

          <button
            onClick={() => executeCode(true)}
            disabled={isExecuting || !selectedQuestion}
            className="flex items-center gap-1.5 px-6 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
          >
            <Send className="w-3.5 h-3.5" />
            Submit
          </button>

          <button
            onClick={handleEndSession}
            className="flex items-center gap-1.5 ml-2 px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
          >
            <Flag className="w-3.5 h-3.5" />
            End Hunt
          </button>
        </div>
      </motion.header>

      {/* Main 3-Column Layout */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-[1px] bg-zinc-800/50 overflow-hidden relative z-10">
        
        {/* Left Panel: Problem Description */}
        <div className="bg-zinc-950 flex flex-col overflow-hidden min-h-0 flex-1 md:flex-none md:w-[40%] lg:w-[35%]">
          <div className="h-10 border-b border-zinc-800 bg-zinc-900/50 flex items-center px-4 shrink-0">
            <List className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Problem Description</span>
          </div>
          <div data-lenis-prevent="true" className="flex-1 overflow-y-auto h-0 p-6 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                 <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              </div>
            ) : selectedQuestion ? (
              <div className="prose prose-invert prose-purple max-w-none text-base md:text-lg leading-relaxed font-medium">
                <FormattedText text={selectedQuestion.prompt} />
              </div>
            ) : (
              <div className="text-zinc-500 text-sm flex items-center justify-center h-full">Select a question to begin.</div>
            )}
          </div>
        </div>

        {/* Center Panel: Editor and Terminal */}
        <div className="bg-zinc-950 flex flex-col overflow-hidden min-h-0 flex-1">
           <div className="flex-1 flex flex-col min-h-0 relative border-b border-zinc-800 bg-zinc-950">
             {/* Fake Code Editor Top Bar */}
             <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 shrink-0 justify-between">
               <div className="flex items-center gap-2">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                 </div>
               </div>
               <div className="text-xs font-mono text-zinc-400">
                 main.{language === 'python' ? 'py' : language === 'javascript' || language === 'node' ? 'js' : language === 'c++' || language === 'cpp' ? 'cpp' : 'java'}
               </div>
               <div className="flex items-center gap-3 text-zinc-500">
                 <Terminal className="w-4 h-4 hover:text-zinc-300 cursor-pointer transition-colors" />
               </div>
             </div>
             
             <div className="flex-1 relative overflow-hidden min-h-0 h-0">
               <CodeEditor
                 language={language === 'node' ? 'javascript' : language}
                 value={code}
                 onChange={(val) => setCode(val || "")}
                 readOnly={isExecuting}
               />
             </div>
           </div>
           <div className="h-64 shrink-0 relative bg-zinc-950 overflow-hidden">
             <TerminalOutput stdout={stdout} stderr={stderr} executionTime={executionTime} isExecuting={isExecuting} />
           </div>
        </div>

        {/* Right Panel: Question Navigator */}
        <div className="bg-zinc-950 flex flex-col overflow-hidden border-l border-zinc-800 hidden md:flex min-h-0 flex-none w-[300px]">
          <div className="h-10 border-b border-zinc-800 bg-zinc-900/50 flex items-center px-4 shrink-0">
            <SearchCode className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Navigator</span>
          </div>
          <div data-lenis-prevent="true" className="flex-1 overflow-y-auto h-0 p-6 custom-scrollbar">
            <div className="grid grid-cols-4 gap-3">
              {loading ? null : questions.map((q, idx) => {
                const isActive = selectedQuestion?.id === q.id;
                const isSolved = solvedQuestions.has(q.id);

                let tileStyle = "border-zinc-800 text-zinc-500 hover:border-zinc-500 bg-zinc-900/50";
                if (isSolved) {
                  tileStyle = "border-green-500/50 bg-green-900/20 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]";
                }
                if (isActive) {
                  tileStyle = "border-purple-500 bg-purple-900/20 text-purple-300 ring-2 ring-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleSelectQuestion(q)}
                    className={`w-12 h-12 mx-auto rounded-xl border flex items-center justify-center text-sm font-bold transition-all ${tileStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
      </div>
      </>
      )}
      
      {/* End Session Custom Confirmation Modal */}
      <AnimatePresence>
        {showEndConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEndConfirm(false)}
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
                    Are you sure you want to end this session? You will be taken to your results and won&apos;t be able to submit further answers.
                  </p>
               </div>
               {/* Modal Actions */}
               <div className="p-6 bg-zinc-900/50 flex items-center justify-end gap-3">
                  <button 
                    onClick={() => setShowEndConfirm(false)}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={async () => {
                      setShowEndConfirm(false);
                      try {
                        await fetch('/api/sessions/record', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            module: `Debug Code (${language})`,
                            score: solvedQuestions.size,
                            totalQuestions: questions.length
                          })
                        });
                      } catch (e) {
                        console.error("Failed to record session", e);
                      }
                      setSessionState('results');
                    }}
                    className="px-6 py-2 rounded-xl text-sm font-bold bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all"
                  >\n                    End Hunt\n                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {sessionState === 'results' && (
        <div data-lenis-prevent="true" className="absolute inset-0 z-50 overflow-y-auto custom-scrollbar bg-zinc-950 p-6 md:p-12">
          <div className="max-w-4xl mx-auto space-y-8 pb-24">
            
            {/* Top Dashboard Button */}
            <div className="flex items-center justify-between">
              <Link href="/home" replace>
                <button className="px-6 py-2.5 bg-zinc-900 text-zinc-300 font-bold uppercase tracking-widest rounded-xl hover:bg-purple-900/40 hover:text-purple-300 hover:border-purple-500/50 transition-all border border-zinc-800 flex items-center gap-2 text-xs shadow-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  <ArrowLeft className="w-4 h-4" /> Return to Root
                </button>
              </Link>
            </div>

            {/* Header & Score Summary */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                  <Trophy className="w-10 h-10 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white mb-2">Hunt Complete</h1>
                  <p className="text-zinc-400 text-lg">
                    You solved <span className="text-purple-400 font-bold">{solvedQuestions.size}</span> out of <span className="text-zinc-200 font-bold">{questions.length}</span> questions.
                  </p>
                </div>
              </div>
            </div>

            {/* Questions Review Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" /> Session Review
              </h2>
              
              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const isSolved = solvedQuestions.has(q.id);
                  return (
                    <div key={q.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                      {/* Question Header */}
                      <div className="px-6 py-4 bg-zinc-900/50 border-b border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {isSolved ? (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                              <Circle className="w-3.5 h-3.5" /> Unsolved
                            </div>
                          )}
                          <h3 className="font-bold text-zinc-200">Problem {idx + 1}</h3>
                        </div>
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{q.subTopic}</span>
                      </div>
                      
                      {/* Explanations & Details */}
                      <div className="p-6 space-y-6">
                        <div>
                          <h4 className="text-sm font-bold text-zinc-400 mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4 text-zinc-500" /> Prompt
                          </h4>
                          <div className="prose prose-invert prose-sm max-w-none text-zinc-300 bg-zinc-950 p-4 rounded-xl border border-zinc-800/50">
                            <FormattedText text={q.prompt} />
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-purple-500" /> Explanation
                          </h4>
                          <div className="prose prose-invert prose-purple prose-sm max-w-none text-zinc-200 bg-purple-500/5 p-4 rounded-xl border border-purple-500/20">
                            {q.explanation ? (
                              <FormattedText text={q.explanation} />
                            ) : (
                              <p className="text-zinc-500 italic m-0">No explanation available for this question.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Dashboard Button */}
            <div className="flex justify-center pt-8">
              <Link href="/home" replace>
                <button className="px-8 py-3 bg-zinc-100 text-zinc-950 font-bold uppercase tracking-widest rounded-xl hover:bg-purple-100 hover:text-purple-900 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  Return to Root
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CodeDebug() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CodeDebugInner />
    </Suspense>
  );
}
