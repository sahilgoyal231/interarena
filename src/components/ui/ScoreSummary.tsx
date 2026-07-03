export const ScoreSummary = ({ 
  score, 
  totalQuestions, 
  accuracy, 
  unansweredCount 
}: { 
  score: number;
  totalQuestions: number;
  accuracy: number;
  unansweredCount: number;
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-8">
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl w-36 md:w-40 flex flex-col items-center">
        <p className="text-3xl md:text-4xl font-black text-purple-400">
          {score}
          <span className="text-lg md:text-xl text-zinc-500">
            /{totalQuestions}
          </span>
        </p>
        <p className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 mt-2 text-center">
          Score
        </p>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl w-36 md:w-40 flex flex-col items-center">
        <p
          className={`text-3xl md:text-4xl font-black ${
            accuracy >= 70 ? "text-green-400" : accuracy >= 40 ? "text-amber-400" : "text-rose-400"
          }`}
        >
          {accuracy}%
        </p>
        <p className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 mt-2 text-center">
          Accuracy
        </p>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl w-36 md:w-40 flex flex-col items-center">
        <p className="text-3xl md:text-4xl font-black text-zinc-400">
          {unansweredCount}
        </p>
        <p className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 mt-2 text-center">
          Skipped
        </p>
      </div>
    </div>
  );
};
