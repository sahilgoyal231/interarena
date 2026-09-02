import React from "react";
import { motion } from "framer-motion";
import { FormattedText } from "@/components/ui/FormattedText";

interface AssessmentOptionsProps {
  optionsList: string[];
  currentSectionIndex: number;
  questionId: string;
  userAnswers: Record<string, string>;
  handleSelectOption: (questionId: string, option: string) => void;
}

export function AssessmentOptions({
  optionsList,
  currentSectionIndex,
  questionId,
  userAnswers,
  handleSelectOption
}: AssessmentOptionsProps) {
  return (
    <div className="space-y-3">
      {optionsList.map((opt, oIdx) => {
        const isSelected = userAnswers[`${currentSectionIndex}-${questionId}`] === opt;
        return (
          <button
            key={oIdx}
            onClick={() => handleSelectOption(questionId, opt)}
            className={`group w-full flex items-center justify-between p-5 border rounded-2xl font-medium text-left transition-all duration-300 active:scale-[0.98] ${isSelected
                ? "border-purple-500 bg-purple-900/20 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/50"
                : "border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-black/20"
              }`}
          >
            <span className="pr-4"><FormattedText text={opt} /></span>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${isSelected ? "border-purple-500 bg-purple-500/20" : "border-zinc-700 group-hover:border-zinc-500"}`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
