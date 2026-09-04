import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormGroup } from "@/components/ui/form-group";
import { toast } from "sonner";

// Helper for resetting fields
const emptyTextFields = {
  prompt: "",
  correctAnswer: "",
  explanation: "",
  boilerPlateCode: "",
  testCases: "",
  options: "",
  difficulty: "MEDIUM",
  estimatedTimeSeconds: "60",
  language: "",
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
      "Coding Decoding", "Statement & Assumptions", "Logical Venn Diagram"
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
  },
  SYSTEM_DESIGN: {
    "General": ["Scalability", "Databases", "Microservices", "Caching"]
  },
  PROMPTING_AND_LLMS: {
    "General": ["Prompt Engineering", "Fine-Tuning", "RAG"]
  },
  GEN_AI: {
    "General": ["Architecture", "Transformers", "Stable Diffusion"]
  },
  TECH_SUITES: {
    "React": ["Hooks", "State Management", "Performance"],
    "Node.js": ["Event Loop", "Streams", "Express"]
  }
};

export function SingleEntryForm() {
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    subTopic: "",
    ...emptyTextFields,
  });

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

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Saving question...");
    
    try {
      const payload: any = { ...formData };
      if (formData.type === "DEBUG_CODE") {
        payload.testCases = JSON.parse(formData.testCases || "[]");
      }
      if (formData.type === "APTITUDE" || formData.type === "VERBAL" || formData.type === "GUESS_OUTPUT") {
        if (formData.options) {
          payload.options = JSON.parse(formData.options);
        }
      }
      payload.estimatedTimeSeconds = parseInt(formData.estimatedTimeSeconds as string, 10) || 60;

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Single question saved successfully!", { id: loadingToast });
        setFormData({ ...formData, ...emptyTextFields }); // Reset text fields on success
      } else {
        toast.error("Failed to save question.", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Error: Invalid JSON format in Test Cases or Options.", { id: loadingToast });
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12">
      <form onSubmit={handleSingleSubmit} className="space-y-6">

        <FormGroup label="Question Type">
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
        </FormGroup>

        <FormGroup label="Category">
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
        </FormGroup>

        <FormGroup label="Sub-Topic">
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
        </FormGroup>

        {/* Render universal inputs only if the cascade is completed */}
        {formData.subTopic && (
          <div className="space-y-6 pt-6 border-t border-zinc-800">
            <FormGroup label="Question Prompt" htmlFor="field-prompt">
              <Textarea
                id="field-prompt"
                name="prompt"
                required
                value={formData.prompt}
                onChange={handleChange}
                className="min-h-[100px] bg-zinc-950 border-zinc-800"
                placeholder="Enter the question text or snippet..."
              />
            </FormGroup>

            {/* Render Code Specific Fields */}
            {formData.type === "DEBUG_CODE" && (
              <>
                <FormGroup label="Boilerplate Code" labelClassName="text-purple-400" htmlFor="field-boilerplate">
                  <Textarea
                    id="field-boilerplate"
                    name="boilerPlateCode"
                    value={formData.boilerPlateCode}
                    onChange={handleChange}
                    className="min-h-[150px] bg-zinc-950 border-purple-500/30 text-purple-300 font-mono"
                    placeholder="int main() { ... }"
                  />
                </FormGroup>

                <FormGroup label="Hidden Test Cases (JSON)" labelClassName="text-rose-400" htmlFor="field-testcases">
                  <Textarea
                    id="field-testcases"
                    name="testCases"
                    value={formData.testCases}
                    onChange={handleChange}
                    className="min-h-[100px] bg-zinc-950 border-rose-500/30 text-rose-300 font-mono"
                    placeholder='[{"input": "5", "expectedOutput": "120"}]'
                  />
                </FormGroup>
              </>
            )}

            {/* Answer Field */}
            <FormGroup label="Correct Answer / Expected Output" labelClassName="text-green-400" htmlFor="field-correct-answer">
              {formData.type === "DEBUG_CODE" ? (
                <Textarea
                  id="field-correct-answer"
                  name="correctAnswer"
                  required
                  value={formData.correctAnswer}
                  onChange={handleChange}
                  className="min-h-[150px] bg-zinc-950 border-green-500/30 text-green-400 font-mono"
                  placeholder="Paste the correct code implementation here..."
                />
              ) : (
                <Input
                  id="field-correct-answer"
                  name="correctAnswer"
                  required
                  value={formData.correctAnswer}
                  onChange={handleChange}
                  className="bg-zinc-950 border-green-500/30 text-green-400"
                  placeholder="e.g., 6 days"
                />
              )}
            </FormGroup>

            <FormGroup label="Explanation" htmlFor="field-explanation">
              <Textarea
                id="field-explanation"
                name="explanation"
                required
                value={formData.explanation}
                onChange={handleChange}
                className="min-h-[120px] bg-zinc-950 border-zinc-800"
                placeholder="Explain the solution clearly..."
              />
            </FormGroup>

            {/* New fields for Schema matching */}
            <div className="grid grid-cols-2 gap-4">
              <FormGroup label="Difficulty" htmlFor="field-difficulty">
                <Select
                  onValueChange={(val) => setFormData({ ...formData, difficulty: val || "MEDIUM" })}
                  value={formData.difficulty}
                >
                  <SelectTrigger id="field-difficulty" className="w-full bg-zinc-950 border-zinc-800 text-zinc-100">
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="EASY" className="text-zinc-100 focus:bg-purple-600 focus:text-white cursor-pointer">EASY</SelectItem>
                    <SelectItem value="MEDIUM" className="text-zinc-100 focus:bg-purple-600 focus:text-white cursor-pointer">MEDIUM</SelectItem>
                    <SelectItem value="HARD" className="text-zinc-100 focus:bg-purple-600 focus:text-white cursor-pointer">HARD</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <FormGroup label="Est. Time (seconds)" htmlFor="field-est-time">
                <Input
                  id="field-est-time"
                  type="number"
                  name="estimatedTimeSeconds"
                  required
                  value={formData.estimatedTimeSeconds}
                  onChange={handleChange}
                  className="bg-zinc-950 border-zinc-800"
                />
              </FormGroup>
            </div>

            {(formData.type === "APTITUDE" || formData.type === "VERBAL") && (
              <FormGroup label="Options (JSON Array)" labelClassName="text-yellow-400" htmlFor="field-options">
                <Textarea
                  id="field-options"
                  name="options"
                  value={formData.options}
                  onChange={handleChange}
                  className="min-h-[100px] bg-zinc-950 border-yellow-500/30 text-yellow-300 font-mono"
                  placeholder='["Option A", "Option B", "Option C", "Option D"]'
                />
              </FormGroup>
            )}

            {(formData.type === "DEBUG_CODE" || formData.type === "GUESS_OUTPUT") && (
              <FormGroup label="Language" labelClassName="text-cyan-400" htmlFor="field-language">
                <Input
                  id="field-language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="bg-zinc-950 border-cyan-500/30 text-cyan-400"
                  placeholder="e.g., C++, Python, JavaScript"
                />
              </FormGroup>
            )}

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
  );
}
