import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@fontsource/mozilla-headline/400.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { cn } from "@/lib/utils";
import SmoothScrolling from "@/components/ui/SmoothScrolling";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InterArena | Advanced Mock Assessments",
  description: "Dynamic interview preparation platform with 44,795+ assessment questions.",
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
        theme: dark,
        variables: {
          colorPrimary: '#a855f7',
          colorBackground: '#18181b',
        },
        elements: {
          userButtonPopoverCard: "bg-zinc-950 border border-zinc-800",
          userButtonPopoverActionButton: "hover:bg-zinc-900",
          userButtonPopoverActionButtonText: "text-zinc-100",
          userButtonPopoverActionButtonIcon: "text-zinc-400",
          userPreviewMainIdentifier: "text-zinc-100 font-bold",
          userPreviewSecondaryIdentifier: "text-zinc-400",
        }
      }}
    >
      <html
        lang="en"
        className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, jetbrainsMono.variable, "font-sans")}
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
