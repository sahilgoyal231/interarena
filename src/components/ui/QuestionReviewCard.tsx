import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, CircleMinus, Lightbulb } from "lucide-react";
import { FormattedText } from "./FormattedText";

import { checkAnswer } from "@/lib/utils";

export interface Question {
  id: string;
  prompt: string;
  options: string | string[]; // Stored as JSON string in DB
  correctAnswer: string;
  explanation: string;
  subTopic: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  estimatedTimeSeconds?: number;
  boilerPlateCode?: string;
  testCases?: any;
}

export const QuestionReviewCard = ({
  question,
  index,
  userAnswer
}: {
  question: Question;
  index: number;
  userAnswer?: string;
}) => {
  const isUnanswered = !userAnswer;
  const isCorrect = checkAnswer(userAnswer, question.correctAnswer);
  const isWrong = !isUnanswered && !isCorrect;

  return (
    <Card
      className={`bg-zinc-900/30 border-zinc-800/80 rounded-2xl p-6 space-y-4 ${
        isUnanswered ? "opacity-80" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {question.difficulty && (
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${
                question.difficulty === 'EASY' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                question.difficulty === 'HARD' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              }`}>
                {question.difficulty}
              </span>
              {question.estimatedTimeSeconds && (
                <span className="text-[10px] text-zinc-500 font-mono">~{question.estimatedTimeSeconds}s</span>
              )}
            </div>
          )}
          <p className="text-zinc-200 font-medium">
            <span className="text-purple-500 font-bold mr-2">Q{index + 1}.</span>
            {question.prompt}
          </p>
        </div>

        {/* Dynamic Status Icon */}
        {isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />}
        {isWrong && <XCircle className="w-6 h-6 text-rose-500 shrink-0" />}
        {isUnanswered && <CircleMinus className="w-6 h-6 text-zinc-500 shrink-0" />}
      </div>

      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-sm">
        {/* Dynamic Answer Display */}
        {isUnanswered ? (
          <p>
            <span className="text-zinc-500">Your Answer:</span>{" "}
            <span className="text-zinc-500 font-semibold italic">Not Answered</span>
          </p>
        ) : (
          <p>
            <span className="text-zinc-500">Your Answer:</span>{" "}
            <span className={isCorrect ? "text-green-400 font-semibold" : "text-rose-400 font-semibold"}>
              {userAnswer}
            </span>
          </p>
        )}

        {/* Always show the correct answer if they got it wrong or skipped it */}
        {!isCorrect && (
          <p>
            <span className="text-zinc-500">Correct Answer:</span>{" "}
            <span className="text-green-400 font-semibold">{question.correctAnswer}</span>
          </p>
        )}
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4">
        <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" /> Solution Explanation
        </p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          {question.explanation}
        </p>
      </div>
    </Card>
  );
};
