import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@fontsource/mozilla-headline/400.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import { ui } from "@clerk/ui";
import { cn } from "@/lib/utils";
import SmoothScrolling from "@/components/ui/SmoothScrolling";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://interarena.com"),
  title: "InterArena | Advanced Mock Assessments",
  description: "Dynamic interview preparation platform with 44,795+ assessment questions.",
  keywords: ["Interview Preparation", "Mock Assessments", "Coding Challenges", "System Design", "Aptitude Tests"],
  verification: {
    google: "google-site-verification-code", // Replace with actual Google verification code
  },
  openGraph: {
    title: "InterArena | Advanced Mock Assessments",
    description: "Dynamic interview preparation platform with 44,795+ assessment questions.",
    url: "https://interarena.com",
    siteName: "InterArena",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InterArena | Advanced Mock Assessments",
    description: "Dynamic interview preparation platform with 44,795+ assessment questions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        // @ts-expect-error - Clerk v7 types mismatch with themes v2
        baseTheme: dark,
        variables: {
          colorPrimary: '#a855f7',
        },
        elements: {
          card: 'bg-zinc-950 border border-zinc-800 shadow-xl',
          headerTitle: 'text-zinc-100',
          headerSubtitle: 'text-zinc-400',
          socialButtonsBlockButton: 'text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100',
          socialButtonsBlockButtonText: 'text-zinc-300 font-semibold',
          dividerLine: 'bg-zinc-800',
          dividerText: 'text-zinc-500',
          formFieldLabel: 'text-zinc-300',
          formFieldInput: 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500',
          footerActionText: 'text-zinc-400',
          footerActionLink: 'text-purple-500 hover:text-purple-400',
          identityPreviewText: 'text-zinc-300',
          identityPreviewEditButtonIcon: 'text-purple-500',
          formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white font-semibold',
        }
      }}
      ui={ui}
    >
      <html
        lang="en"
        className={cn("dark", "h-full", "antialiased", geistSans.variable, geistMono.variable, jetbrainsMono.variable, "font-sans")}
      >
        <body className="min-h-full flex flex-col selection:bg-purple-500/30 selection:text-purple-50">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-zinc-900 focus:text-purple-400 focus:font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-br-lg">
            Skip to main content
          </a>
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </body>
      </html>
    </ClerkProvider>
  );
}
