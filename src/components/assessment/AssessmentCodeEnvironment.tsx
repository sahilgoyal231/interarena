import React from "react";
import { Terminal } from "lucide-react";
import { CodeEditor } from "@/components/ui/CodeEditor";
import { TerminalOutput } from "@/components/ui/TerminalOutput";

interface AssessmentCodeEnvironmentProps {
  language: string;
  codeValue: string;
  onCodeChange: (value: string) => void;
  isExecuting: boolean;
  stdout: string;
  stderr: string;
  executionTime?: number;
}

export function AssessmentCodeEnvironment({
  language,
  codeValue,
  onCodeChange,
  isExecuting,
  stdout,
  stderr,
  executionTime
}: AssessmentCodeEnvironmentProps) {
  const extension = language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'cpp' ? 'cpp' : 'java';
  
  return (
    <div className="flex-1 flex flex-col min-h-0 relative bg-zinc-950 border-l border-zinc-800">
      {/* Fake Code Editor Top Bar */}
      <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 shrink-0 justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          main.{extension}
        </div>
        <div className="flex items-center gap-3 text-zinc-500">
          <Terminal className="w-4 h-4 transition-colors" />
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden min-h-0 h-0">
        <CodeEditor 
          language={language}
          value={codeValue}
          onChange={(v) => onCodeChange(v || "")}
          readOnly={isExecuting}
        />
      </div>
      
      <div className="h-64 shrink-0 relative bg-zinc-950 overflow-hidden border-t border-zinc-800">
        <TerminalOutput stdout={stdout} stderr={stderr} executionTime={executionTime} isExecuting={isExecuting} />
      </div>
    </div>
  );
}
