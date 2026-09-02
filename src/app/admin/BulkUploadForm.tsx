import React, { useState } from "react";
import { UploadCloud, ClipboardPaste } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function BulkUploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [rawJsonInput, setRawJsonInput] = useState("");

  const executeBulkUpload = async (jsonContent: any) => {
    if (!Array.isArray(jsonContent)) {
      throw new Error("Uploaded JSON must be an array of objects.");
    }
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonContent),
    });

    if (response.ok) {
      const data = await response.json();
      toast.success(data.message || `Successfully bulk inserted questions.`);
      setRawJsonInput(""); // clear textarea
    } else {
      toast.error("Database rejected the bulk upload. Check schema formatting.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading("Reading and injecting file...");
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonContent = JSON.parse(event.target?.result as string);
        await executeBulkUpload(jsonContent);
        toast.dismiss(loadingToast);
      } catch (error) {
        toast.error("Error: Invalid JSON format. Please check your file.", { id: loadingToast });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleRawJsonSubmit = async () => {
    if (!rawJsonInput.trim()) return;
    
    const loadingToast = toast.loading("Parsing pasted JSON...");
    setIsUploading(true);
    try {
      const jsonContent = JSON.parse(rawJsonInput);
      await executeBulkUpload(jsonContent);
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.error("Error: Invalid JSON format in pasted text.", { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Option 1: File Upload */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 flex flex-col justify-center">
        <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto text-purple-500 mb-2">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Upload .json File</h2>
          <p className="text-zinc-500 text-xs mt-2">Upload a raw .json file containing an array of questions.</p>
        </div>
        <div className="relative mt-4">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="bg-zinc-950 border border-dashed border-zinc-700 rounded-xl p-6 hover:bg-zinc-900 transition-colors flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-zinc-300">
              {isUploading ? "Injecting..." : "Click or Drag File"}
            </span>
          </div>
        </div>
      </div>

      {/* Option 2: Paste Raw JSON */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-6 flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center text-blue-500">
            <ClipboardPaste className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Paste Raw JSON</h2>
            <p className="text-zinc-500 text-xs">Directly paste AI-generated JSON arrays.</p>
          </div>
        </div>

        <Textarea
          value={rawJsonInput}
          onChange={(e) => setRawJsonInput(e.target.value)}
          placeholder='[\n  {\n    "type": "APTITUDE",\n    "prompt": "..."\n  }\n]'
          className="w-full flex-1 min-h-[150px] bg-zinc-950 border-zinc-800 font-mono text-xs text-zinc-300"
        />

        <button
          onClick={handleRawJsonSubmit}
          disabled={isUploading || !rawJsonInput.trim()}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3 rounded-xl transition-all text-sm"
        >
          {isUploading ? "Injecting Data..." : "Inject Pasted JSON"}
        </button>
      </div>
    </div>
  );
}
