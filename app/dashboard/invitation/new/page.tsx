"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GlassNav } from "@/components/ui/glass-nav";
import { PremiumFooter } from "@/components/ui/premium-footer";
import { InvitationCustomizerWizard } from "@/components/customizer/InvitationCustomizerWizard";
import { Sparkle } from "@phosphor-icons/react";

function NewInvitationContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template") || "noor-e-nikah";

  return <InvitationCustomizerWizard templateId={templateId} isEditMode={false} />;
}

export default function NewInvitationPage() {
  return (
    <div
      data-lenis-prevent
      className="flex min-h-screen flex-col bg-[#FCFBF7] text-[#1A1A1A] lg:h-[100dvh] lg:max-h-[100dvh] lg:overflow-hidden lg:bg-[#E8E4DC]"
    >
      <div className="lg:hidden">
        <GlassNav />
      </div>

      <main className="flex min-h-0 flex-1 flex-col pt-28 pb-20 lg:h-full lg:overflow-hidden lg:pt-0 lg:pb-0">
        <div className="flex min-h-0 flex-1 flex-col lg:h-full">
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-stone-900">
                <Sparkle className="h-8 w-8 text-amber-500 animate-spin-slow mb-2" />
                <span className="text-xs uppercase tracking-widest text-stone-400 font-bold">
                  Loading Customizer...
                </span>
              </div>
            }
          >
            <NewInvitationContent />
          </Suspense>
        </div>
      </main>
      <div className="lg:hidden">
        <PremiumFooter />
      </div>
    </div>
  );
}
