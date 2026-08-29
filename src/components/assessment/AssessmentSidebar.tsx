import React from "react";
import { LayoutGrid, CheckCircle2 } from "lucide-react";
import { useAssessment } from "./AssessmentContext";

export function AssessmentSidebar() {
  const { 
    moaData, 
    currentSectionIndex, 
    currentIndex, 
    setCurrentIndex, 
    userAnswers, 
    setShowSubmitConfirm 
  } = useAssessment();

  if (!moaData) return null;

  return (
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
                      {Array.from({ length: sec.questions.length > 0 ? sec.questions.length : (sec.expectedQuestionCount || 0) }).map((_, idx) => {
                        const q = sec.questions[idx];
                        const isAttempted = q ? !!userAnswers[`${sIdx}-${q.id}`] : false;
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
          End Assessment
        </button>
      </div>
    </div>
  );
}
