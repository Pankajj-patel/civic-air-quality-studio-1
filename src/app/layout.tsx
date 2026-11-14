import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Civic Air Quality Briefing Studio | AI-Driven Civic Intelligence",
  description: "Turn raw and messy air quality data into actionable, role-tailored local interventions, traceable briefing notes, and multilingual citizen advisories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
        {children}
      </body>
    </html>
  );
}
