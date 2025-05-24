// app/layout.tsx or app/layout.ts
import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";

// Import your LanguageProvider
import { LanguageProvider } from "@/contexts/language";

const baskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Speaker Platform",
  description: "Professional speaker booking and event management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${baskerville.variable} font-baskerville antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}