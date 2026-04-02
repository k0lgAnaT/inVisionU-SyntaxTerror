import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'inVision U — AI Candidate Intelligence Platform',
  description: 'AI-powered admissions intelligence system for inVision U. Transparent, fair, and explainable candidate scoring for the admissions committee.',
  keywords: ['inVision U', 'admissions', 'AI scoring', 'candidate evaluation', 'hackathon', 'Kazakhstan'],
  openGraph: {
    title: 'inVision U — AI Candidate Intelligence Platform',
    description: 'Intelligent, explainable candidate scoring for inVision U admissions committee.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-background text-slate-800 antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
