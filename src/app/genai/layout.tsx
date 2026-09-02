import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GenAI Vectors | InterArena",
  description: "Master RAG pipelines, fine-tuning principles, and deep neural embeddings.",
};

export default function GenAILayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
