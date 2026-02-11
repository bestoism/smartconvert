import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from '@/components/Toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartConvert | AI-Powered CRM",
  description: "Advanced Predictive Lead Scoring & Explainable AI (XAI) System for Banking Sales Optimization. Developed by Ryan Besto Saragih.",
  keywords: ["AI CRM", "Banking Analytics", "Lead Scoring", "Machine Learning", "XGBoost", "FastAPI", "Next.js"],
  authors: [{ name: "Ryan Besto Saragih" }],
  icons: {
    icon: "/favicon.ico", // Pastikan file favicon ada di folder public
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
