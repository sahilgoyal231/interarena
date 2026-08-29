import React from "react";
import { ShieldCheck, Clock, CheckCircle2, LayoutGrid } from "lucide-react";
import { useAssessment } from "./AssessmentContext";

export function AssessmentIntro() {
  const { moaData, setHasStarted, selectedLanguage, setSelectedLanguage } = useAssessment();

  if (!moaData) return null;

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
                  <span className="text-xs text-zinc-500">
                    {sec.questions.length > 0 ? sec.questions.length : (sec.expectedQuestionCount || 0)} Qs • {sec.durationSeconds / 60}m
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center pt-8 border-t border-zinc-800 gap-6">
          {moaData.sections.some(s => s.requiresLanguage) && (
            <div className="space-y-4 w-full max-w-md">
              <div className="flex items-center justify-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-sm">
                Select Execution Environment
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["python", "javascript", "java", "c++"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-4 py-3 rounded-lg border font-bold transition-all text-sm ${
                      selectedLanguage === lang
                        ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
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
