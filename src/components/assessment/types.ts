import { Question } from "@/components/ui/QuestionReviewCard";

export const LANGUAGES = [
  { id: "python", name: "Python", defaultCode: "print('Hello, InterArena!')" },
  { id: "javascript", name: "JavaScript", defaultCode: "console.log('Hello, InterArena!');" },
  { id: "c++", name: "C++", defaultCode: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, InterArena!\" << std::endl;\n    return 0;\n}" },
  { id: "java", name: "Java", defaultCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, InterArena!\");\n    }\n}" },
];

export type SectionData = {
  title: string;
  durationSeconds: number;
  questions: Question[];
  requiresLanguage?: boolean;
  expectedQuestionCount?: number;
};

export type MoaData = {
  moaId: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  sections: SectionData[];
};
