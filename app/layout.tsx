import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OOP REVISE HUB",
  description: "Object-Oriented Programming Revision Guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <Analytics />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <footer style={{
          textAlign: "center",
          padding: "1.5rem",
          fontSize: "0.9rem",
          color: "rgba(255, 255, 255, 0.5)",
          borderTop: "1px solid rgba(59, 130, 246, 0.1)",
          marginTop: "auto",
          letterSpacing: "0.5px"
        }}>
          Created by <strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>Joshi Jay</strong> | Enrolment No: <strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>240470107070</strong>
        </footer>
      </body>
    </html>
  );
}
