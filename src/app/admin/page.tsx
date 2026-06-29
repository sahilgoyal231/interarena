"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Comprehensive Mappings
const QUESTION_MAPPING = {
  DEBUG_CODE: {
    "C++": ["Arrays", "Pointers", "Memory Management", "STL"],
    Python: [
      "Lists & Tuples",
      "Decorators",
      "Generators",
      "Exception Handling",
    ],
    JavaScript: ["Async/Await", "Closures", "DOM Manipulation", "Event Loop"],
    Java: [
      "Collections Framework",
      "OOP Principles",
      "Multithreading",
      "Exception Handling",
    ],
  },
  APTITUDE: {
    Quantitative: [
      "Time & Work",
      "Profit & Loss",
      "Percentages",
      "Number Systems",
      "Probability",
    ],
    Logical: [
      "Blood Relations",
      "Seating Arrangement",
      "Coding-Decoding",
      "Syllogisms",
    ],
  },
  VERBAL: {
    Reading: ["Comprehension", "Contextual Usage", "Error Spotting"],
    Grammar: ["Synonyms", "Antonyms", "Tenses", "Voice & Speech"],
  },
  GUESS_OUTPUT: {
    "C++": [
      "Basic Syntax",
      "Control Flow",
      "Recursion",
      "Static/Dynamic Allocation",
    ],
    Python: ["Scope", "Operators", "Lambdas", "Modules"],
    JavaScript: ["Variable Hoisting", "Prototypes", "Promises"],
    Java: ["Access Modifiers", "Polymorphism", "Static Blocks"],
  },
};

// Helper object to easily clear text inputs
const emptyTextFields = {
  prompt: "",
  correctAnswer: "",
  explanation: "",
  options: "",
  boilerPlateCode: "",
  testCases: "",
};

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    type: "DEBUG_CODE",
    category: "",
    subTopic: "",
    ...emptyTextFields,
  });

  const [status, setStatus] = useState("");

  const handleTypeChange = (value: string | null) => {
    setFormData({
      ...formData,
      type: value || "",
      category: "",
      subTopic: "",
      ...emptyTextFields,
    });
  };

  const handleCategoryChange = (value: string | null) => {
    setFormData({
      ...formData,
      category: value || "",
      subTopic: "",
      ...emptyTextFields,
    });
  };

  const handleSubTopicChange = (value: string | null) => {
    setFormData({
      ...formData,
      subTopic: value || "",
      ...emptyTextFields,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      const payload = {
        ...formData,
        options:
          formData.type === "APTITUDE" || formData.type === "VERBAL"
            ? JSON.parse(formData.options || "[]")
            : null,
        testCases:
          formData.type === "DEBUG_CODE"
            ? JSON.parse(formData.testCases || "[]")
            : null,
      };

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("Question saved successfully!");
        setFormData({ ...formData, ...emptyTextFields });
      } else {
        setStatus("Failed to save question.");
      }
    } catch (error) {
      setStatus("Error: Invalid JSON format in Options or Test Cases.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-12 text-zinc-100">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-purple-500">
            Content Pipeline
          </h1>
          <p className="text-zinc-400">
            Generate, review, and push content to your database.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-2xl space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Question Type Select */}
            <div>
              <Label className="text-zinc-300">Question Type</Label>
              <Select onValueChange={handleTypeChange} value={formData.type}>
                <SelectTrigger className="bg-zinc-950 border-zinc-700 mt-2 text-white">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                  {Object.keys(QUESTION_MAPPING).map((t) => (
                    <SelectItem
                      key={t}
                      value={t}
                      className="text-zinc-100 focus:bg-purple-600 focus:text-white"
                    >
                      {t.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Select */}
            <div>
              <Label className="text-zinc-300">Category</Label>
              <Select
                onValueChange={handleCategoryChange}
                value={formData.category}
                disabled={!formData.type}
              >
                <SelectTrigger className="bg-zinc-950 border-zinc-700 mt-2 text-white">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                  {formData.type &&
                    Object.keys(
                      QUESTION_MAPPING[
                        formData.type as keyof typeof QUESTION_MAPPING
                      ],
                    ).map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="text-zinc-100 focus:bg-purple-600 focus:text-white"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub-Topic Select */}
            <div>
              <Label className="text-zinc-300">Sub-Topic</Label>
              <Select
                onValueChange={handleSubTopicChange}
                value={formData.subTopic}
                disabled={!formData.category}
              >
                <SelectTrigger className="bg-zinc-950 border-zinc-700 mt-2 text-white">
                  <SelectValue placeholder="Select Sub-Topic" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                  {formData.type &&
                    formData.category &&
                    (QUESTION_MAPPING[
                      formData.type as keyof typeof QUESTION_MAPPING
                    ] as Record<string, string[]>)[formData.category]?.map((sub) => (
                      <SelectItem
                        key={sub}
                        value={sub}
                        className="text-zinc-100 focus:bg-purple-600 focus:text-white"
                      >
                        {sub}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-zinc-300">Question Prompt</Label>
            <Textarea
              name="prompt"
              required
              value={formData.prompt}
              className="bg-zinc-950 border-zinc-700 mt-2 h-24 text-white"
              placeholder="Enter prompt..."
              onChange={handleChange}
            />
          </div>

          {(formData.type === "APTITUDE" || formData.type === "VERBAL") && (
            <div>
              <Label className="text-zinc-300">Options (JSON Array)</Label>
              <Textarea
                name="options"
                required
                value={formData.options}
                className="bg-zinc-950 border-zinc-700 mt-2 font-mono h-20 text-sm text-white"
                placeholder='["Option A", "Option B", "Option C", "Option D"]'
                onChange={handleChange}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* UPDATED: Dynamic Correct Answer Field */}
            <div>
              <Label className="text-zinc-300">Correct Answer</Label>
              {formData.type === "DEBUG_CODE" ? (
                <Textarea
                  name="correctAnswer"
                  required
                  value={formData.correctAnswer}
                  className="bg-zinc-950 border-zinc-700 mt-2 font-mono h-32 text-sm text-green-400"
                  placeholder="Provide the correct answer here..."
                  onChange={handleChange}
                />
              ) : (
                <Input
                  name="correctAnswer"
                  required
                  value={formData.correctAnswer}
                  className="bg-zinc-950 border-zinc-700 mt-2 text-white"
                  placeholder="Exact string or matching option..."
                  onChange={handleChange}
                />
              )}
            </div>

            {/* UPDATED: Changed to Textarea for longer text */}
            <div>
              <Label className="text-zinc-300">Explanation</Label>
              <Textarea
                name="explanation"
                required
                value={formData.explanation}
                className="bg-zinc-950 border-zinc-700 mt-2 h-32 text-white"
                placeholder="Explain why this is the correct answer..."
                onChange={handleChange}
              />
            </div>
          </div>

          {formData.type === "DEBUG_CODE" && (
            <>
              <div>
                <Label className="text-zinc-300">Boilerplate Code</Label>
                <Textarea
                  name="boilerPlateCode"
                  value={formData.boilerPlateCode}
                  className="bg-zinc-950 border-zinc-700 mt-2 font-mono h-32 text-sm text-purple-300"
                  placeholder="int main() { ... }"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className="text-zinc-300">
                  Hidden Test Cases (JSON Array)
                </Label>
                <Textarea
                  name="testCases"
                  value={formData.testCases}
                  className="bg-zinc-950 border-zinc-700 mt-2 font-mono h-24 text-sm text-white"
                  placeholder='[{"input": "5", "expectedOutput": "120"}]'
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 transition-colors"
          >
            Publish to Database
          </Button>
          {status && (
            <p
              className={`text-center font-medium ${status.includes("Error") || status.includes("Failed") ? "text-red-500" : "text-green-400"}`}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
