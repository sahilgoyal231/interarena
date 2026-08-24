import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkAnswer(userAnswer: string | undefined | null, correctAnswer: string): boolean {
  if (!userAnswer || !correctAnswer) return false;
  
  // Direct match (e.g. if correctAnswer is the full string or they match exactly)
  if (userAnswer === correctAnswer) return true;
  
  const answerTrimmed = userAnswer.trim();
  const correctTrimmed = correctAnswer.trim();
  
  // If correctAnswer is a single letter like "A", "B", "C", "D"
  // And the user answer is something like "A) Option" or "A. Option"
  if (correctTrimmed.length === 1) {
    const regex = new RegExp(`^${correctTrimmed}[\\)\\.\\-:\\s]`, 'i');
    if (regex.test(answerTrimmed)) return true;
  }
  
  // Fallback: if the user answer strictly starts with the correct answer 
  // e.g. "O(n log n)" starts with "O(n log n)"
  if (answerTrimmed.startsWith(correctTrimmed)) {
    return true;
  }
  
  // Edge case: if correct answer has the format "A) Text" and matches user answer
  if (correctTrimmed.startsWith(answerTrimmed)) {
      return true;
  }

  // Edge case: if user answer has "A) Text" but correct answer is just "Text"
  if (answerTrimmed.endsWith(correctTrimmed) || answerTrimmed.includes(correctTrimmed)) {
      // Be slightly careful with includes, but for MCQs it's usually sufficient if the text matches exactly
      // Let's strip the potential prefix (e.g. "A) ", "B. ") and compare
      const strippedAnswer = answerTrimmed.replace(/^[a-d][\)\.\-:\s]+\s*/i, '');
      if (strippedAnswer === correctTrimmed) {
          return true;
      }
      // If it still doesn't strictly match but includes it, and it's long enough to avoid false positives
      if (correctTrimmed.length > 3 && answerTrimmed.includes(correctTrimmed)) {
          return true;
      }
  }

  return false;
}
