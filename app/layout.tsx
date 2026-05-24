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
          padding: "2rem",
          fontSize: "0.9rem",
          color: "var(--text-muted)",
          borderTop: "1px solid var(--divider-bg)",
          marginTop: "auto",
          letterSpacing: "0.5px",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          alignItems: "center"
        }}>
          <div>
            Created by <strong style={{ color: "var(--foreground)" }}>Joshi Jay</strong> | Enrolment No: <strong style={{ color: "var(--foreground)" }}>240470107070</strong>
          </div>
          
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <a href="https://wa.me/9106052826" target="_blank" rel="noopener noreferrer" style={{ color: "#4ade80", textDecoration: "none", fontWeight: 600, transition: "color 0.2s" }}>
              WhatsApp
            </a>
            <span style={{ opacity: 0.3 }}>|</span>
            <a href="https://www.linkedin.com/in/jayjoshi19" target="_blank" rel="noopener noreferrer" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: 600, transition: "color 0.2s" }}>
              LinkedIn
            </a>
          </div>

          <div style={{ marginTop: "0.25rem" }}>
            <a href="https://github.com/Joshijay1917/gtu-oops-revision" target="_blank" rel="noopener noreferrer" style={{ color: "var(--glow-blue-intense)", textDecoration: "none", fontSize: "0.85rem", opacity: 0.8 }}>
              Found a mistake? Contribute on GitHub!
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
