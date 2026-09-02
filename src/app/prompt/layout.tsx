import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Trials | InterArena",
  description: "Execute complex Zero-Shot and Chain-of-Thought directives to manipulate LLM outputs.",
};

export default function PromptLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
