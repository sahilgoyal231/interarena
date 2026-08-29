import React from "react";
import { Clock, Terminal, ArrowRight, Loader2 } from "lucide-react";
import { useAssessment } from "./AssessmentContext";

export function AssessmentBreak() {
  const { 
    moaData, 
    currentSectionIndex, 
    breakTimeLeft, 
    selectedLanguage, 
    setSelectedLanguage, 
    handleEndBreak, 
    isFetchingSection 
  } = useAssessment();

  if (!moaData) return null;
  const nextSec = currentSectionIndex + 1;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full font-bold text-sm uppercase tracking-widest animate-pulse">
          <Clock className="w-4 h-4" /> System Calibration Pause
        </div>
        
        <h2 className="text-4xl font-black text-white">Section {String.fromCharCode(65 + currentSectionIndex)} Complete</h2>
        
        {nextSec < moaData.sections.length && (
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-left space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Next Protocol</h3>
            <p className="text-2xl font-bold text-white">Section {String.fromCharCode(65 + nextSec)}: {moaData.sections[nextSec].title}</p>
            <p className="text-zinc-400">Time Allocation: {moaData.sections[nextSec].durationSeconds / 60} Minutes</p>
          </div>
        )}
        
        <div className="pt-8 flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center">
            <div className="text-6xl font-black text-purple-200 tabular-nums drop-shadow-[0_0_30px_rgba(168,85,247,0.6)] z-10 relative">
              00:{breakTimeLeft < 10 ? '0' : ''}{breakTimeLeft}
            </div>
            <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full scale-[2] z-0 pointer-events-none"></div>
          </div>
          <button 
            onClick={handleEndBreak}
            disabled={isFetchingSection}
            className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-zinc-200 text-zinc-950 font-black rounded-xl uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:hover:scale-100"
          >
            {isFetchingSection ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Provisioning Environment...</>
            ) : (
              <>Initiate Protocol <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
