import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Drafts | InterArena",
  description: "Architect infinitely scalable High Level and Low Level system constraints across massive distributed data environments.",
};

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
