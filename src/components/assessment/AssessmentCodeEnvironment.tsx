import React, { useState } from "react";
import { Terminal, Code2 } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<'code' | 'console'>('code');
  const extension = language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'cpp' ? 'cpp' : 'java';
  
  return (
    <div className="flex-1 flex flex-col min-h-0 relative bg-zinc-950 md:border-l border-zinc-800">
      {/* Mobile Tabs */}
      <div className="md:hidden flex h-12 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <button 
          onClick={() => setActiveTab('code')}
          className={`flex-1 flex items-center justify-center gap-2 font-bold text-sm transition-colors ${activeTab === 'code' ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-900/10' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Code2 className="w-4 h-4" /> Code
        </button>
        <button 
          onClick={() => setActiveTab('console')}
          className={`flex-1 flex items-center justify-center gap-2 font-bold text-sm transition-colors ${activeTab === 'console' ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-900/10' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Terminal className="w-4 h-4" /> Console
        </button>
      </div>

      {/* Fake Code Editor Top Bar (Desktop) */}
      <div className="hidden md:flex h-10 bg-zinc-900 border-b border-zinc-800 items-center px-4 shrink-0 justify-between">
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
      
      <div className={`relative overflow-hidden min-h-0 ${activeTab === 'code' ? 'flex-1 flex flex-col' : 'hidden md:flex flex-1 flex-col'}`}>
        <CodeEditor 
          language={language}
          value={codeValue}
          onChange={(v) => onCodeChange(v || "")}
          readOnly={isExecuting}
        />
      </div>
      
      <div className={`relative bg-zinc-950 overflow-hidden md:border-t border-zinc-800 ${activeTab === 'console' ? 'flex-1 flex flex-col' : 'hidden md:block md:h-64 shrink-0'}`}>
        <TerminalOutput stdout={stdout} stderr={stderr} executionTime={executionTime} isExecuting={isExecuting} />
      </div>
    </div>
  );
}
