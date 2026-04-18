/**
 * @module layout
 * @description Root layout for the AI Crowd Pilot application.
 * Configures global font, metadata, SEO tags, and accessibility features.
 */
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/** @type {import("next").Metadata} */
export const metadata = {
  title: "AI Crowd Pilot — Smart Crowd & Navigation",
  description:
    "AI-powered stadium assistant for real-time crowd monitoring, smart navigation, queue management, and personalized guidance. Built for PromptWars Hackathon.",
  keywords: ["stadium", "crowd management", "AI", "navigation", "queue", "real-time", "hackathon"],
  authors: [{ name: "AI Crowd Pilot Team" }],
  openGraph: {
    title: "AI Crowd Pilot — Smart Crowd & Navigation",
    description: "AI-powered stadium assistant for real-time crowd monitoring and smart navigation.",
    type: "website",
  },
};

/**
 * Root layout component wrapping all pages.
 * @param {{ children: import("react").ReactNode }} props
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {/* Skip to main content link for keyboard/screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100]
                   focus:px-4 focus:py-2 focus:bg-blue-500 focus:text-white focus:rounded-lg
                   focus:text-sm focus:font-medium focus:shadow-lg"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
