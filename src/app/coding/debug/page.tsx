"use client"

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Play, Code2, Settings2, Sparkles } from "lucide-react";
import { CodeEditor } from "@/components/ui/CodeEditor";
import { TerminalOutput } from "@/components/ui/TerminalOutput";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
  { id: "python", name: "Python", defaultCode: "print('Hello, InterArena!')" },
  { id: "javascript", name: "JavaScript", defaultCode: "console.log('Hello, InterArena!');" },
  { id: "c++", name: "C++", defaultCode: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, InterArena!\" << std::endl;\n    return 0;\n}" },
  { id: "java", name: "Java", defaultCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, InterArena!\");\n    }\n}" },
];

function CodeDebugInner() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const displayTitle = mode === "debug" ? "Debug the Code" : mode === "guess" ? "Guess the Output" : "Code Debug";

  const [language, setLanguage] = useState(LANGUAGES[0].id);
  const [code, setCode] = useState(LANGUAGES[0].defaultCode);
  
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | undefined>();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLangId = e.target.value;
    setLanguage(newLangId);
    
    // Auto-update to default code if the user hasn't typed anything meaningful
    const newLang = LANGUAGES.find((l) => l.id === newLangId);
    if (newLang) {
      setCode(newLang.defaultCode);
    }
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    setStdout("");
    setStderr("");
    setExecutionTime(undefined);

    const startTime = performance.now();

    try {
      if (language === "javascript") {
        // Safe-ish local execution for JavaScript
        const oldLog = console.log;
        const oldError = console.error;
        let output = "";
        let errOutput = "";

        console.log = (...args) => {
          output += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        };
        console.error = (...args) => {
          errOutput += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        };

        try {
          // eslint-disable-next-line no-eval
          eval(code);
          setStdout(output);
          setStderr(errOutput);
        } catch (err: any) {
          setStderr(errOutput + '\n' + String(err));
        } finally {
          console.log = oldLog;
          console.error = oldError;
        }
      } else {
        // Mock backend for non-JS languages
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (code.includes("Hello, InterArena")) {
          setStdout("Hello, InterArena!\n");
        } else {
          setStdout("Code executed successfully.\n(This is a simulated backend response for " + language + ")");
        }
      }

      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime));
    } catch (error: any) {
      setStderr(error.message || "Failed to execute code.");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden relative z-0 selection:bg-purple-500/30">
      
      {/* Insane Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px]" />
      
      {/* Top Navigation */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 relative z-10 shadow-lg shadow-purple-900/10"
      >
        <div className="flex items-center gap-6">
          <Link href="/coding" className="group text-zinc-400 hover:text-purple-400 transition-colors flex items-center justify-center bg-zinc-900 w-10 h-10 rounded-xl border border-zinc-800 hover:border-purple-500/50">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Code2 className="w-6 h-6 text-purple-500 relative z-10" />
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-purple-500 blur-md opacity-50 z-0" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {displayTitle} <span className="text-purple-500 px-2 py-0.5 bg-purple-500/10 rounded-md text-[10px] uppercase tracking-widest border border-purple-500/20">Active</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2 hover:border-zinc-700 transition-colors backdrop-blur-md">
            <Settings2 className="w-4 h-4 text-purple-400" />
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-transparent text-sm font-bold text-zinc-200 outline-none cursor-pointer w-28 focus:ring-0"
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id} className="bg-zinc-900 text-zinc-300">
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRunCode}
            disabled={isExecuting}
            className="group relative flex items-center gap-2 px-8 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            {isExecuting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Settings2 className="w-4 h-4" />
              </motion.div>
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            {isExecuting ? "Executing..." : "Run Code"}
          </motion.button>
        </div>
      </motion.header>

      {/* Main Split Layout */}
      <div className="flex flex-1 overflow-hidden relative z-10 p-4 gap-4">
        {/* Left Pane: Editor */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex-1 relative rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl shadow-purple-900/10 group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <CodeEditor
            language={language}
            value={code}
            onChange={(val) => setCode(val || "")}
          />
        </motion.div>

        {/* Right Pane: Terminal Output */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="w-[40%] xl:w-[35%] shrink-0 rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl shadow-purple-900/10 flex flex-col relative group bg-zinc-950"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <TerminalOutput
            stdout={stdout}
            stderr={stderr}
            isExecuting={isExecuting}
            executionTime={executionTime}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default function CodeDebug() {
  return (
    <Suspense fallback={<div className="h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Loading workspace...</div>}>
      <CodeDebugInner />
    </Suspense>
  );
}
