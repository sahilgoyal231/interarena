import React from "react";
import { Target, Loader2, Play, Send, Clock } from "lucide-react";

interface AssessmentHeaderProps {
  title: string;
  globalTimeLeft: number;
  sectionTimeLeft: number;
  isCodingSection: boolean;
  isExecuting: boolean;
  executeCode: (isSubmit: boolean) => void;
}

export function AssessmentHeader({
  title,
  globalTimeLeft,
  sectionTimeLeft,
  isCodingSection,
  isExecuting,
  executeCode
}: AssessmentHeaderProps) {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
          <Target className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white leading-tight uppercase tracking-wider">{title}</h2>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">
            Total Time Remaining: <span className="font-mono tabular-nums">{Math.floor(globalTimeLeft / 60)}:{globalTimeLeft % 60 < 10 ? '0' : ''}{globalTimeLeft % 60}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isCodingSection && (
          <>
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
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-6 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Code
            </button>
          </>
        )}
        
        <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full">
          <Clock className="w-4 h-4 text-red-400" />
          <span className="text-sm font-black text-red-500 font-mono tabular-nums">
            {Math.floor(sectionTimeLeft / 60)}:{sectionTimeLeft % 60 < 10 ? '0' : ''}{sectionTimeLeft % 60}
          </span>
        </div>
      </div>
    </header>
  );
}
