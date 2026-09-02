import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptitude Sprints | InterArena",
  description: "Raw mathematical and geometric calculations pushing cognitive speed limits.",
};

export default function AptitudeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
