import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Genesis Living Memory OS",
  description: "Next-Generation Autonomous Multi-Agent AI System Sandbox Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-slate-950">
      {/* Strictly children component matrix without any injected sidebar duplicate elements */}
      <body className="antialiased w-full min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/20">
        {children}
      </body>
    </html>
  );
}
