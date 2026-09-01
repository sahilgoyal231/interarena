import React from "react";
import { ScoreSummary } from "@/components/ui/ScoreSummary";
import { useAssessment } from "./AssessmentContext";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function AssessmentResult() {
  const { moaData, score, userAnswers } = useAssessment();
  const router = useRouter();

  if (!moaData) return null;

  const totalQs = moaData.sections.reduce((acc, sec) => acc + sec.questions.length, 0);
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = totalQs - answeredCount;
  const accuracy = totalQs > 0 ? Math.round((score / totalQs) * 100) : 0;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-sans p-6 text-center">
      <h2 className="text-4xl font-black text-white mb-2">{moaData.title}</h2>
      <p className="text-zinc-500 uppercase tracking-widest text-sm mb-12">Protocol Completed</p>
      <ScoreSummary 
        score={score} 
        totalQuestions={totalQs} 
        accuracy={accuracy} 
        unansweredCount={unansweredCount} 
      />
      <div className="mt-12">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
        >
          Return to Root <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
