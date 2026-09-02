"use client";

import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SingleEntryForm } from "./SingleEntryForm";
import { BulkUploadForm } from "./BulkUploadForm";

export default function AdminDashboard() {
  const [uploadMode, setUploadMode] = useState<"single" | "bulk">("single");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans flex justify-center">
      <Toaster theme="dark" richColors position="top-right" />
      <div className="w-full max-w-4xl space-y-8 pb-24">
        {/* Header & Mode Toggle */}
        <div className="space-y-6 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Content Pipeline</h1>
            <p className="text-zinc-500 text-sm mt-1">Generate and inject validated interview questions into PostgreSQL.</p>
          </div>

          <div className="flex bg-zinc-900 p-1 rounded-lg w-fit border border-zinc-800">
            <button
              onClick={() => setUploadMode("single")}
              className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${uploadMode === "single" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              Single Entry
            </button>
            <button
              onClick={() => setUploadMode("bulk")}
              className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${uploadMode === "bulk" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              Bulk JSON Upload
            </button>
          </div>
        </div>

        {uploadMode === "bulk" ? <BulkUploadForm /> : <SingleEntryForm />}
      </div>
    </div>
  );
}