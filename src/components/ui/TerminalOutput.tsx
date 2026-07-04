"use client";
import React from "react";
import { Terminal, Loader2 } from "lucide-react";

interface TerminalOutputProps {
  stdout: string;
  stderr: string;
  isExecuting: boolean;
  executionTime?: number;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({
  stdout,
  stderr,
  isExecuting,
  executionTime,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-l border-zinc-800 text-zinc-300 font-mono text-sm relative">
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-zinc-400" />
          <span className="font-bold text-xs uppercase tracking-wider text-zinc-400">
            Console Output
          </span>
        </div>
        {executionTime !== undefined && !isExecuting && (
          <span className="text-xs bg-zinc-800/50 text-zinc-400 px-2 py-1 rounded">
            Finished in {executionTime}ms
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isExecuting ? (
          <div className="flex items-center gap-3 text-purple-400 h-full justify-center opacity-80">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="animate-pulse">Executing code on secure container...</span>
          </div>
        ) : (
          <>
            {stdout && (
              <pre className="whitespace-pre-wrap break-words leading-relaxed">
                {stdout}
              </pre>
            )}
            {stderr && (
              <pre className="whitespace-pre-wrap break-words leading-relaxed text-red-400 font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {stderr}
              </pre>
            )}
            {!stdout && !stderr && !isExecuting && (
              <div className="flex items-center justify-center h-full text-zinc-600 italic">
                Run your code to see the output here.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
