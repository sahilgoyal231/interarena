import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verbal Leagues | InterArena",
  description: "Extreme reading comprehension and logic deductions evaluated under strict time protocols.",
};

export default function VerbalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
