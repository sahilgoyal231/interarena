import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Target, AlertCircle, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FormattedText } from "@/components/ui/FormattedText";
import { CodeEditor } from "@/components/ui/CodeEditor";
import { useAssessment } from "./AssessmentContext";
import { AssessmentHeader } from "./AssessmentHeader";
import { AssessmentOptions } from "./AssessmentOptions";
import { AssessmentCodeEnvironment } from "./AssessmentCodeEnvironment";

export function ActiveQuestionPane() {
  const { 
    moaData, 
    currentSectionIndex, 
    currentIndex, 
    setCurrentIndex, 
    userAnswers, 
    userCodes, 
    setUserCodes, 
    handleSelectOption, 
    handleClearResponse, 
    handleCompleteSection,
    globalTimeLeft,
    sectionTimeLeft
  } = useAssessment();

  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | undefined>();

  if (!moaData) return null;

  const currentSection = moaData.sections[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="flex-1 overflow-hidden bg-zinc-950 flex flex-col items-center justify-center font-mono text-purple-500 gap-4 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-white">Data Missing</h2>
        <p className="text-zinc-400 max-w-md mb-4">No questions found for this configuration in the dataset. This can happen if the database isn&apos;t fully populated for the selected language.</p>
        <button onClick={handleCompleteSection} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          Skip Section
        </button>
      </div>
    );
  }

  let optionsList: string[] = [];
  try {
    const parsed = Array.isArray(currentQuestion.options)
      ? currentQuestion.options
      : JSON.parse((currentQuestion.options as string) || "[]");
    
    // Ensure it's an array and deeply map objects to strings if any sneaked in
    optionsList = (Array.isArray(parsed) ? parsed : Object.values(parsed)).map(opt => 
      typeof opt === 'string' ? opt : JSON.stringify(opt)
    );
  } catch (e) {
    optionsList = ["Option A", "Option B", "Option C", "Option D"];
  }

  const isCodingSection = currentSection.title === "Code Debugging Audit" || currentSection.title === "Code Debugging";
  const getMappedLanguage = (category: string) => {
    const c = category?.toLowerCase();
    if (c === "python") return "python";
    if (c === "javascript") return "javascript";
    if (c === "java") return "java";
    if (c === "c++") return "cpp";
    return "python";
  };

  const executeCode = async (isSubmit: boolean) => {
    setIsExecuting(true);
    setStdout("");
    setStderr("");
    setExecutionTime(undefined);
    try {
      const codeToRun = userCodes[`${currentSectionIndex}-${currentQuestion.id}`] || currentQuestion.boilerPlateCode || "";
      const lang = getMappedLanguage(currentQuestion.category);
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeToRun, language: lang, isSubmit }),
      });
      
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finalStdout = "";
      let finalStderr = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        let boundary = buffer.indexOf("\n\n");
        
        while (boundary !== -1) {
          const message = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);
          
          if (message.startsWith("data: ")) {
            try {
              const data = JSON.parse(message.substring(6));
              if (data.type === "stdout") {
                finalStdout += data.data;
                setStdout(finalStdout);
              } else if (data.type === "stderr") {
                finalStderr += data.data;
                setStderr(finalStderr);
              } else if (data.type === "done") {
                setExecutionTime(data.executionTime);
              }
            } catch (e) {
              console.error("Failed to parse SSE message", message);
            }
          }
          boundary = buffer.indexOf("\n\n");
        }
      }
    } catch (e) {
      setStderr("Execution failed: Network or Server Error");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 z-10 order-1 lg:order-2">
      <AssessmentHeader
        title={moaData.title}
        globalTimeLeft={globalTimeLeft}
        sectionTimeLeft={sectionTimeLeft}
        isCodingSection={isCodingSection}
        isExecuting={isExecuting}
        executeCode={executeCode}
      />

      <div className={`flex-1 flex overflow-hidden min-h-0 ${isCodingSection ? "flex-col lg:flex-row" : "flex-col"}`}>
        
        {/* Left/Top Content (Prompt & Options) */}
        {isCodingSection ? (
          <div className="bg-zinc-950 flex flex-col overflow-hidden min-h-0 flex-1 md:flex-none lg:w-[40%] border-b lg:border-b-0 lg:border-r border-zinc-800">
            <div className="h-10 border-b border-zinc-800 bg-zinc-900/50 flex items-center px-4 shrink-0">
              <Target className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Problem Description</span>
            </div>
            <div data-lenis-prevent="true" className="flex-1 overflow-y-auto h-0 p-6 custom-scrollbar">
              <div className="prose prose-invert prose-purple max-w-none text-base md:text-lg leading-relaxed font-medium">
                <FormattedText text={currentQuestion.prompt} />
              </div>
              
              <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 text-sm text-zinc-400 mt-6 space-y-4">
                <h4 className="font-bold text-white uppercase tracking-widest text-xs">Execution Constraints</h4>
                <p>Ensure your solution executes within {currentQuestion.estimatedTimeSeconds} seconds. Standard input and output must be used for testing.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-y-auto min-h-0 w-full items-center" data-lenis-prevent="true">
            <div className="p-8 md:p-12 w-full max-w-4xl">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-purple-900/50">
                        {currentIndex + 1}
                      </span>
                      <span className="text-zinc-500 font-medium">
                        Question {currentIndex + 1} of {currentSection.questions.length}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 border border-purple-500/30 bg-purple-900/10 px-3 py-1 rounded-full hidden md:inline-block">
                      {currentQuestion.category} • {currentQuestion.difficulty}
                    </span>
                  </div>

                  {(() => {
                    let textPart = currentSection.title.includes("Prediction") ? "Analyze the code snippet below and predict its output:" : currentQuestion.prompt.trim();
                    let codePart = "";
                    let langClass = getMappedLanguage(currentQuestion.category);

                    if (currentSection.title.includes("Prediction")) {
                        codePart = currentQuestion.prompt.trim();
                        if (currentQuestion.prompt.includes("```")) {
                          const parts = currentQuestion.prompt.split("```");
                          if (parts.length >= 3) {
                            textPart = parts[0].trim() || textPart;
                            const codePartWithLang = parts[1].trim();
                            const firstNewline = codePartWithLang.indexOf('\n');
                            if (firstNewline !== -1) {
                              const parsedLang = codePartWithLang.substring(0, firstNewline).trim();
                              if (parsedLang) langClass = parsedLang;
                              codePart = codePartWithLang.substring(firstNewline + 1).trim();
                            } else {
                              codePart = codePartWithLang;
                            }
                          }
                        }
                        codePart = codePart
                          .replace(/what\s+is\s+the\s+output\s+of\s+the\s+following.*?(program|code\s+snippet|code|snippet)\s*[:?]?/gi, '')
                          .replace(/what\s+will\s+be\s+the\s+output.*?\?/gi, '')
                          .replace(/predict\s+the\s+output.*?\:/gi, '')
                          .replace(/^snippet\s*[:?]?\s*/gi, '')
                          .trim();
                    }
                    
                    return (
                      <div className="flex flex-col flex-1 min-h-0 pt-2 gap-4">
                        <h3 className="text-xl md:text-2xl text-zinc-100 font-semibold leading-relaxed shrink-0">
                          <FormattedText text={textPart} />
                        </h3>
                        {codePart && (
                          <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-2xl flex flex-col relative group mt-4">
                            {/* Simple Header Bar */}
                            <div className="h-10 bg-zinc-950/50 border-b border-zinc-800 flex items-center justify-between px-4 relative z-20 select-none shrink-0">
                              <div className="flex items-center gap-3">
                                <Terminal className="w-4 h-4 text-zinc-500" />
                                <span className="text-xs font-mono font-semibold text-zinc-400 tracking-widest uppercase">
                                  {langClass || "Code Snippet"}
                                </span>
                              </div>
                              <div className="text-[10px] font-medium text-zinc-500 flex items-center gap-2 uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" /> Read Only
                              </div>
                            </div>
                            
                            {/* Editor Container */}
                            <div className="relative bg-transparent h-[250px]" data-lenis-prevent="true">
                              <CodeEditor 
                                language={langClass || "javascript"} 
                                value={codePart} 
                                readOnly={true} 
                                onChange={() => {}} 
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {!isCodingSection && (
                    <AssessmentOptions
                      optionsList={optionsList}
                      currentSectionIndex={currentSectionIndex}
                      questionId={currentQuestion.id}
                      userAnswers={userAnswers}
                      handleSelectOption={handleSelectOption}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Right/Bottom Content (Code Editor for Coding Sections) */}
        {isCodingSection && (
          <AssessmentCodeEnvironment
            language={getMappedLanguage(currentQuestion.category)}
            codeValue={userCodes[`${currentSectionIndex}-${currentQuestion.id}`] || currentQuestion.boilerPlateCode || ""}
            onCodeChange={(v) => setUserCodes((prev) => ({ ...prev, [`${currentSectionIndex}-${currentQuestion.id}`]: v || "" }))}
            isExecuting={isExecuting}
            stdout={stdout}
            stderr={stderr}
            executionTime={executionTime}
          />
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="h-20 shrink-0 border-t border-zinc-800 bg-zinc-950 px-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleClearResponse(currentQuestion.id)}
            className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Clear Response
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              if (currentIndex < currentSection.questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
              } else {
                handleCompleteSection();
              }
            }}
            className="px-8 h-12 rounded-xl bg-white text-zinc-950 font-black flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all hover:scale-105 uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {currentIndex === currentSection.questions.length - 1 ? 'Finish Section' : 'Next'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
