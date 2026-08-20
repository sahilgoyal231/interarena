import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@fontsource/mozilla-headline/400.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import SmoothScrolling from "@/components/ui/SmoothScrolling";
import { GlobalErrorSuppressor } from "@/components/ui/GlobalErrorSuppressor";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InterArena - Master Your Interviews",
  description: "Dynamic interview preparation platform with 25,000+ assessment questions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, jetbrainsMono.variable, "font-sans")}
      >
        <body className="min-h-full flex flex-col selection:bg-purple-500/30 selection:text-purple-50">
          <GlobalErrorSuppressor />
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </body>
      </html>
    </ClerkProvider>
  );
}
