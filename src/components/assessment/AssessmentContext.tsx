"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { MoaData } from "./types";
import { checkAnswer } from "@/lib/utils";

type AssessmentContextType = {
  moaId: string;
  moaData: MoaData | null;
  loading: boolean;
  hasStarted: boolean;
  setHasStarted: (v: boolean) => void;
  
  currentSectionIndex: number;
  setCurrentSectionIndex: (idx: number) => void;
  currentIndex: number;
  setCurrentIndex: (idx: number) => void;
  
  isOnBreak: boolean;
  setIsOnBreak: (v: boolean) => void;
  breakTimeLeft: number;
  setBreakTimeLeft: (v: number) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  isFetchingSection: boolean;
  setIsFetchingSection: (v: boolean) => void;
  
  userAnswers: Record<string, string>;
  setUserAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  visitedCounts: Record<string, number>;
  setVisitedCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  
  isSubmitted: boolean;
  score: number;
  showSubmitConfirm: boolean;
  setShowSubmitConfirm: (v: boolean) => void;
  
  userCodes: Record<string, string>;
  setUserCodes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  
  globalTimeLeft: number;
  sectionTimeLeft: number;
  
  handleCompleteSection: () => void;
  handleEndBreak: () => void;
  handleCompleteMoa: () => void;
  handleSelectOption: (questionId: string, option: string) => void;
  handleClearResponse: (questionId: string) => void;
  setMoaData: React.Dispatch<React.SetStateAction<MoaData | null>>;
};

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children, moaId }: { children: React.ReactNode; moaId: string }) {
  const [moaData, setMoaData] = useState<MoaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(60);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [isFetchingSection, setIsFetchingSection] = useState(false);

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [visitedCounts, setVisitedCounts] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const [userCodes, setUserCodes] = useState<Record<string, string>>({});

  const [globalTimeLeft, setGlobalTimeLeft] = useState(120 * 60);
  const [sectionTimeLeft, setSectionTimeLeft] = useState(0);

  // 1. Fetch MOA Data
  useEffect(() => {
    async function loadMoa() {
      try {
        const res = await fetch(`/api/moa/generate?moaId=${moaId}`);
        if (res.ok) {
          const data: MoaData = await res.json();
          setMoaData(data);
          if (data.sections && data.sections.length > 0) {
            setSectionTimeLeft(data.sections[0].durationSeconds);
          }
        }
      } catch (err) {
        console.error("MOA Loading Failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMoa();
  }, [moaId]);

  const handleCompleteMoa = useCallback(async () => {
    if (!moaData) return;
    setIsSubmitted(true);
    let calculatedScore = 0;
    let totalQs = 0;
    moaData.sections.forEach((sec, sIdx) => {
      totalQs += sec.questions.length;
      sec.questions.forEach((q) => {
        const uAnswer = userAnswers[`${sIdx}-${q.id}`];
        if (checkAnswer(uAnswer, q.correctAnswer)) {
          calculatedScore += 1;
        }
      });
    });
    setScore(calculatedScore);
    
    try {
      await fetch('/api/sessions/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: `Assessment (${moaData.title})`,
          score: calculatedScore,
          totalQuestions: totalQs
        })
      });
    } catch (e) {
      console.error("Failed to record session", e);
    }
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [moaData, userAnswers]);

  const preloadSection = useCallback(async (nextSec: number) => {
    if (!moaData) return;
    setIsFetchingSection(true);
    try {
      const sectionType = moaData.sections[nextSec].title === "Code Debugging Audit" || moaData.sections[nextSec].title === "Code Debugging" ? "DEBUG_CODE" : "GUESS_OUTPUT";
      const limit = moaData.sections[nextSec].expectedQuestionCount || 10;
      const res = await fetch(`/api/moa/section?type=${sectionType}&language=${encodeURIComponent(selectedLanguage)}&limit=${limit}&difficulty=${moaData.difficulty}`);
      if (res.ok) {
        const data = await res.json();
        setMoaData(prev => {
          if (!prev) return prev;
          const newMoa = { ...prev };
          newMoa.sections[nextSec].questions = data.questions;
          return newMoa;
        });
      }
    } catch (err) {
      console.error("Failed to fetch language-specific questions", err);
    } finally {
      setIsFetchingSection(false);
    }
  }, [moaData, selectedLanguage]);

  const handleCompleteSection = useCallback(() => {
    if (!moaData) return;
    if (currentSectionIndex >= moaData.sections.length - 1) {
      handleCompleteMoa();
    } else {
      setIsOnBreak(true);
      setBreakTimeLeft(60);
      
      const nextSec = currentSectionIndex + 1;
      if (moaData.sections[nextSec].requiresLanguage && (!moaData.sections[nextSec].questions || moaData.sections[nextSec].questions.length === 0)) {
        preloadSection(nextSec);
      }
    }
  }, [moaData, currentSectionIndex, handleCompleteMoa, preloadSection]);

  const handleEndBreak = useCallback(async () => {
    if (!moaData) return;
    const nextSec = currentSectionIndex + 1;
    
    if (isFetchingSection) return;

    setIsOnBreak(false);
    setCurrentSectionIndex(nextSec);
    setCurrentIndex(0);
    setSectionTimeLeft(moaData.sections[nextSec].durationSeconds);
  }, [moaData, currentSectionIndex, isFetchingSection]);

  // 2. Timers Logic
  useEffect(() => {
    if (!hasStarted || isSubmitted || loading) return;

    if (isOnBreak) {
      if (breakTimeLeft <= 0) {
        setTimeout(() => handleEndBreak(), 0);
        return;
      }
      const timer = setTimeout(() => setBreakTimeLeft(breakTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (globalTimeLeft <= 0) {
      setTimeout(() => handleCompleteMoa(), 0);
      return;
    }

    if (sectionTimeLeft <= 0) {
      setTimeout(() => handleCompleteSection(), 0);
      return;
    }

    const timer = setTimeout(() => {
      setGlobalTimeLeft(g => g - 1);
      setSectionTimeLeft(s => s - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasStarted, isSubmitted, loading, globalTimeLeft, sectionTimeLeft, isOnBreak, breakTimeLeft, handleEndBreak, handleCompleteMoa, handleCompleteSection]);

  const handleSelectOption = useCallback((questionId: string, option: string) => {
    if (isSubmitted || isOnBreak) return;
    setUserAnswers((prev) => ({ ...prev, [`${currentSectionIndex}-${questionId}`]: option }));
  }, [isSubmitted, isOnBreak, currentSectionIndex]);

  const handleClearResponse = useCallback((questionId: string) => {
    if (isSubmitted || isOnBreak) return;
    setUserAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[`${currentSectionIndex}-${questionId}`];
      return newAnswers;
    });
  }, [isSubmitted, isOnBreak, currentSectionIndex]);


  return (
    <AssessmentContext.Provider value={{
      moaId, moaData, setMoaData, loading, hasStarted, setHasStarted,
      currentSectionIndex, setCurrentSectionIndex, currentIndex, setCurrentIndex,
      isOnBreak, setIsOnBreak, breakTimeLeft, setBreakTimeLeft,
      selectedLanguage, setSelectedLanguage, isFetchingSection, setIsFetchingSection,
      userAnswers, setUserAnswers, visitedCounts, setVisitedCounts,
      isSubmitted, score, showSubmitConfirm, setShowSubmitConfirm,
      userCodes, setUserCodes, globalTimeLeft, sectionTimeLeft,
      handleCompleteSection, handleEndBreak, handleCompleteMoa,
      handleSelectOption, handleClearResponse
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
}
