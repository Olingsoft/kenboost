"use client";

import Navigation from "@/components/Navigation";
import { PointsProvider } from "@/lib/points-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PointsProvider>
      <Navigation />
      {/* Main Content Area */}
      <main className="md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0 min-h-screen">
        <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
          {children}
        </div>
      </main>
    </PointsProvider>
  );
}
