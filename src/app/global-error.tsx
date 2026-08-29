"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary Caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-sans p-6 text-center">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Critical Layout Fault</h2>
              <p className="text-zinc-400">The root layout encountered an unrecoverable state.</p>
            </div>
            
            <div className="bg-zinc-950 p-4 rounded-xl text-left overflow-x-auto border border-zinc-800">
              <code className="text-xs text-red-400 font-mono">
                {error.message || "Unknown global error"}
              </code>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => reset()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-black rounded-xl uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                <RefreshCcw className="w-4 h-4" /> Hard Reset
              </button>
              
              <Link 
                href="/home" 
                replace
                className="w-full flex items-center justify-center py-3 bg-zinc-950 text-zinc-300 hover:text-white font-bold rounded-xl uppercase tracking-widest text-sm border border-zinc-800 hover:border-purple-500/50 transition-all shadow-sm"
              >
                System Root
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
