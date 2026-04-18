import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "AI Crowd Pilot — Smart Crowd & Navigation",
  description:
    "AI-powered stadium assistant for real-time crowd monitoring, smart navigation, queue management, and personalized guidance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#0a0a1a] text-[#e8e8f0] font-sans">
        {children}
      </body>
    </html>
  );
}
