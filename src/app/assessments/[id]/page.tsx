"use client";

import { use } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { 
  AssessmentProvider, 
  useAssessment,
  AssessmentIntro,
  AssessmentSidebar,
  AssessmentBreak,
  AssessmentResult,
  ActiveQuestionPane
} from "@/components/assessment";

function AssessmentApp() {
  const { 
    moaData, 
    loading, 
    hasStarted, 
    isSubmitted, 
    isOnBreak,
    showSubmitConfirm,
    setShowSubmitConfirm,
    handleCompleteSection
  } = useAssessment();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-mono text-purple-500 gap-4">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="uppercase tracking-widest text-sm">Initializing Protocol...</p>
      </div>
    );
  }

  if (!moaData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-mono text-purple-500 gap-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="uppercase tracking-widest text-sm">Failed to load Assessment data.</p>
      </div>
    );
  }

  if (isSubmitted) {
    return <AssessmentResult />;
  }

  if (!hasStarted) {
    return <AssessmentIntro />;
  }

  if (isOnBreak) {
    return <AssessmentBreak />;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
            <h3 className="text-2xl font-black text-white">Confirm Submission</h3>
            <p className="text-zinc-400">Are you sure you want to end this assessment early? You cannot return to these questions, and remaining time will NOT carry over.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowSubmitConfirm(false)} className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors">
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowSubmitConfirm(false);
                  handleCompleteSection();
                }} 
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
              >
                End Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <AssessmentSidebar />
      <ActiveQuestionPane />
    </div>
  );
}

export default function MockAssessmentEngine({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const moaId = resolvedParams.id;

  return (
    <AssessmentProvider moaId={moaId}>
      <AssessmentApp />
    </AssessmentProvider>
  );
}
