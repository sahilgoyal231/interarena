"use client";

import { useState } from "react";
import { UploadCloud, FileJson, CheckCircle2, AlertCircle, ClipboardPaste } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Helper for resetting fields
const emptyTextFields = {
  prompt: "",
  correctAnswer: "",
  explanation: "",
  boilerPlateCode: "",
  testCases: "",
};

// The Expanded Categorization Mapping
const QUESTION_MAPPING: Record<string, Record<string, string[]>> = {
  APTITUDE: {
    "Quantitative Aptitude": [
      "Numbers", "LCM & HCF", "Ratio & Proportion", "Average", "Problem on Age",
      "Percentages", "Profit and Loss", "Mixture and Alligations", "Simple Interest",
      "Compound Interest", "Time, Speed & Distance", "Trains, Boats & Streams",
      "Race", "Work and Wages", "Pipes and Cistern", "Algebra", "Mensuration 2D",
      "Mensuration 3D", "Geometry", "Trigonometry & Distances", "Progressions",
      "Logarithms", "Permutation & Combination", "Probability", "Clocks", "Calendars",
      "Simplification & Approx", "Data Interpretation"
    ],
    "Logical Reasoning": [
      "Number Series", "Letter & Symbol Series", "Verbal Classification", "Analogies",
      "Logical Problems", "Course of Action", "Statement & Conclusion", "Theme Detection",
      "Blood Relations", "Directions", "Statement & Argument", "Logical Deduction",
      "Letter Series", "Coding Decoding", "Statement & Assumptions", "Logical Venn Diagram"
    ]
  },
  VERBAL: {
    "Verbal Ability": [
      "Synonyms", "Antonyms", "Sentence Error", "Sentence Correction",
      "Fill in the Blanks", "Comprehension", "Idioms and Phrases"
    ]
  },
  DEBUG_CODE: {
    "C++": ["Arrays", "Strings", "Pointers", "OOP", "STL", "Recursion", "Trees"],
    "Python": ["Lists & Tuples", "Dictionaries", "Functions", "OOP", "File Handling"],
    "JavaScript": ["DOM Manipulation", "Promises & Async", "Closures", "Arrays", "Objects"],
    "Java": ["OOP Concepts", "Multithreading", "Collections Framework", "Exception Handling"]
  },
  GUESS_OUTPUT: {
    "C++": ["Pointers", "References", "Macros", "Inheritance", "Loops"],
    "Python": ["Decorators", "List Comprehension", "Generators", "Scope"],
    "JavaScript": ["Hoisting", "Event Loop", "Type Coercion", "this Keyword"],
    "Java": ["Static Blocks", "Polymorphism", "String Pool", "Constructors"]
  }
};

export default function AdminDashboard() {
  // Navigation State
  const [uploadMode, setUploadMode] = useState<"single" | "bulk">("single");
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Bulk Upload Specific State
  const [rawJsonInput, setRawJsonInput] = useState("");

  // Single Entry State
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    subTopic: "",
    ...emptyTextFields,
  });

  // =========================================
  // SINGLE ENTRY LOGIC
  // =========================================
  const handleTypeChange = (value: string | null) => {
    setFormData({ type: value || "", category: "", subTopic: "", ...emptyTextFields });
  };

  const handleCategoryChange = (value: string | null) => {
    setFormData({ ...formData, category: value || "", subTopic: "", ...emptyTextFields });
  };

  const handleSubTopicChange = (value: string | null) => {
    setFormData({ ...formData, subTopic: value || "", ...emptyTextFields });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSingleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      const payload = { ...formData };
      if (formData.type === "DEBUG_CODE") {
        payload.testCases = JSON.parse(formData.testCases || "[]");
      }
      if (formData.type === "APTITUDE" || formData.type === "VERBAL") {
        // Assuming you add an options field to formData state later if needed
        // payload.options = JSON.parse(formData.options || "[]");
      }

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("Single question saved successfully!");
        setFormData({ ...formData, ...emptyTextFields }); // Reset text fields on success
      } else {
        setStatus("Failed to save question.");
      }
    } catch (error) {
      setStatus("Error: Invalid JSON format in Test Cases or Options.");
    }
  };

  // =========================================
  // BULK UPLOAD LOGIC
  // =========================================
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
      setStatus(data.message || `Successfully bulk inserted questions.`);
      setRawJsonInput(""); // clear textarea
    } else {
      setStatus("Database rejected the bulk upload. Check schema formatting.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("Reading file...");
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonContent = JSON.parse(event.target?.result as string);
        await executeBulkUpload(jsonContent);
      } catch (error) {
        setStatus("Error: Invalid JSON format. Please check your file.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleRawJsonSubmit = async () => {
    if (!rawJsonInput.trim()) return;
    setStatus("Parsing pasted JSON...");
    setIsUploading(true);
    try {
      const jsonContent = JSON.parse(rawJsonInput);
      await executeBulkUpload(jsonContent);
    } catch (error) {
      setStatus("Error: Invalid JSON format in pasted text.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans flex justify-center">
      <div className="w-full max-w-4xl space-y-8 pb-24">

        {/* Header & Mode Toggle */}
        <div className="space-y-6 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Content Pipeline</h1>
            <p className="text-zinc-500 text-sm mt-1">Generate and inject validated interview questions into PostgreSQL.</p>
          </div>

          <div className="flex bg-zinc-900 p-1 rounded-lg w-fit border border-zinc-800">
            <button
              onClick={() => { setUploadMode("single"); setStatus(""); }}
              className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${uploadMode === "single" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              Single Entry
            </button>
            <button
              onClick={() => { setUploadMode("bulk"); setStatus(""); }}
              className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${uploadMode === "bulk" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              Bulk JSON Upload
            </button>
          </div>
        </div>

        {/* Status Message Display */}
        {status && (
          <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${status.includes("Error") || status.includes("rejected") ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
            {status.includes("Error") || status.includes("rejected") ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            {status}
          </div>
        )}

        {/* =========================================
            MODE: BULK UPLOAD (File & Paste)
            ========================================= */}
        {uploadMode === "bulk" && (
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

              <textarea
                value={rawJsonInput}
                onChange={(e) => setRawJsonInput(e.target.value)}
                placeholder='[\n  {\n    "type": "APTITUDE",\n    "prompt": "..."\n  }\n]'
                className="w-full flex-1 min-h-37.5 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 focus:border-purple-500 outline-none resize-none"
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
        )}

        {/* =========================================
            MODE: SINGLE ENTRY (Cascading Form)
            ========================================= */}
        {uploadMode === "single" && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12">
            <form onSubmit={handleSingleSubmit} className="space-y-6">

              {/* Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-300">Question Type</label>
                <Select onValueChange={handleTypeChange} value={formData.type}>
                  <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 text-zinc-100">
                    <SelectValue placeholder="Select Type..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {Object.keys(QUESTION_MAPPING).map((type) => (
                      <SelectItem key={type} value={type} className="text-zinc-100 focus:bg-purple-600 focus:text-white cursor-pointer">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-300">Category</label>
                <Select onValueChange={handleCategoryChange} value={formData.category} disabled={!formData.type}>
                  <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 text-zinc-100 disabled:opacity-50">
                    <SelectValue placeholder="Select Category..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {formData.type && Object.keys(QUESTION_MAPPING[formData.type]).map((category) => (
                      <SelectItem key={category} value={category} className="text-zinc-100 focus:bg-purple-600 focus:text-white cursor-pointer">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sub-Topic Selection */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-300">Sub-Topic</label>
                <Select onValueChange={handleSubTopicChange} value={formData.subTopic} disabled={!formData.category}>
                  <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 text-zinc-100 disabled:opacity-50">
                    <SelectValue placeholder="Select Sub-Topic..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {formData.category && QUESTION_MAPPING[formData.type][formData.category].map((subTopic) => (
                      <SelectItem key={subTopic} value={subTopic} className="text-zinc-100 focus:bg-purple-600 focus:text-white cursor-pointer">
                        {subTopic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Render universal inputs only if the cascade is completed */}
              {formData.subTopic && (
                <div className="space-y-6 pt-6 border-t border-zinc-800">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300">Question Prompt</label>
                    <textarea
                      name="prompt"
                      required
                      value={formData.prompt}
                      onChange={handleChange}
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 min-h-25 focus:border-purple-500 outline-none"
                      placeholder="Enter the question text or snippet..."
                    />
                  </div>

                  {/* Render Code Specific Fields */}
                  {formData.type === "DEBUG_CODE" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-purple-400">Boilerplate Code</label>
                        <textarea
                          name="boilerPlateCode"
                          value={formData.boilerPlateCode}
                          onChange={handleChange}
                          className="w-full p-3 bg-zinc-950 border border-purple-500/30 rounded-xl text-purple-300 font-mono min-h-37.5 outline-none focus:border-purple-500"
                          placeholder="int main() { ... }"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-rose-400">Hidden Test Cases (JSON)</label>
                        <textarea
                          name="testCases"
                          value={formData.testCases}
                          onChange={handleChange}
                          className="w-full p-3 bg-zinc-950 border border-rose-500/30 rounded-xl text-rose-300 font-mono min-h-25 outline-none focus:border-rose-500"
                          placeholder='[{"input": "5", "expectedOutput": "120"}]'
                        />
                      </div>
                    </>
                  )}

                  {/* Answer Field (Textarea for code, Input for normal) */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-green-400">Correct Answer / Expected Output</label>
                    {formData.type === "DEBUG_CODE" ? (
                      <textarea
                        name="correctAnswer"
                        required
                        value={formData.correctAnswer}
                        onChange={handleChange}
                        className="w-full p-3 bg-zinc-950 border border-green-500/30 rounded-xl text-green-400 font-mono min-h-37.5 outline-none focus:border-green-500"
                        placeholder="Paste the correct code implementation here..."
                      />
                    ) : (
                      <input
                        type="text"
                        name="correctAnswer"
                        required
                        value={formData.correctAnswer}
                        onChange={handleChange}
                        className="w-full p-3 bg-zinc-950 border border-green-500/30 rounded-xl text-green-400 outline-none focus:border-green-500"
                        placeholder="e.g., 6 days"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300">Explanation</label>
                    <textarea
                      name="explanation"
                      required
                      value={formData.explanation}
                      onChange={handleChange}
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 min-h-30 outline-none focus:border-purple-500"
                      placeholder="Explain the solution clearly..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-zinc-100 hover:bg-zinc-300 text-zinc-950 py-3 rounded-xl font-black uppercase tracking-widest transition-colors shadow-lg"
                  >
                    Save to Database
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

      </div>
    </div>
  );
}