import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Suites | InterArena",
  description: "Master the absolute fundamentals of OS, Networking, Databases, OOP, and more.",
};

export default function TechSuitesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
