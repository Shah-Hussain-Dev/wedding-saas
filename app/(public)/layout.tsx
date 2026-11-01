import React from "react";
import { GlassNav } from "@/components/ui/glass-nav";
import { PremiumFooter } from "@/components/ui/premium-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF7] text-[#1A1A1A] font-sans">
      <GlassNav />
      <main id="main-content" tabIndex={-1} className="flex-grow scroll-mt-24">
        {children}
      </main>
      <PremiumFooter />
    </div>
  );
}
