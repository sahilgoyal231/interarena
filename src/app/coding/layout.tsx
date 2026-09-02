import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Sandbox | InterArena",
  description: "Live execution environment for debugging, algorithms, and deep undefined behavior analysis.",
};

export default function CodingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
