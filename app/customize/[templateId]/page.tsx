"use client";

import { use, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GlassNav } from "@/components/ui/glass-nav";
import { PremiumFooter } from "@/components/ui/premium-footer";
import { InvitationCustomizerWizard } from "@/components/customizer/InvitationCustomizerWizard";
import { Sparkle } from "@phosphor-icons/react";

interface CustomizePageProps {
  params: Promise<{ templateId: string }>;
}

function CustomizeTemplateContent({ templateId }: { templateId: string }) {
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("slug");
  const editId = searchParams.get("id");

  const [initialData, setInitialData] = useState<any | null>(null);
  const [demoDefaults, setDemoDefaults] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadExistingData() {
      const normalized = templateId.replace(/_/g, "-").toLowerCase();

      if (!editSlug && !editId) {
        try {
          const res = await fetch(`/api/templates/${normalized}/defaults`, { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (data.defaults) setDemoDefaults(data.defaults);
          }
        } catch (err) {
          console.warn("Could not load template demo defaults:", err);
        }
        setLoading(false);
        return;
      }

      // 1. Try localStorage first for instant load
      if (typeof window !== "undefined") {
        try {
          if (editSlug) {
            const stored = localStorage.getItem(`unfold_invitation_${editSlug}`);
            if (stored) {
              setInitialData(JSON.parse(stored));
              setLoading(false);
              return;
            }
          }
          if (editId) {
            const storedId = localStorage.getItem(`unfold_invitation_${editId}`);
            if (storedId) {
              setInitialData(JSON.parse(storedId));
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn("Could not read local cache:", e);
        }
      }

      // 2. Fetch from database API
      try {
        if (editId) {
          const res = await fetch(`/api/invitations/${editId}`);
          if (res.ok) {
            const data = await res.json();
            setInitialData(data);
            setLoading(false);
            return;
          }
        }
        if (editSlug) {
          const res = await fetch(`/api/invitations/public?slug=${encodeURIComponent(editSlug)}`);
          if (res.ok) {
            const data = await res.json();
            setInitialData(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Could not fetch invitation from API:", err);
      } finally {
        setLoading(false);
      }
    }

    loadExistingData();
  }, [editSlug, editId, templateId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-stone-900">
        <Sparkle className="h-8 w-8 text-amber-500 animate-spin-slow mb-2" />
        <span className="text-xs uppercase tracking-widest text-stone-400 font-bold">
          Loading Customizer...
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <InvitationCustomizerWizard
        templateId={initialData?.templateId || templateId}
        invitationId={editId || initialData?.id}
        initialData={initialData}
        isEditMode={Boolean(editSlug || editId)}
        demoDefaults={demoDefaults}
      />
    </div>
  );
}

export default function CustomizeTemplatePage({ params }: CustomizePageProps) {
  const { templateId } = use(params);

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
            <CustomizeTemplateContent templateId={templateId} />
          </Suspense>
        </div>
      </main>
      <div className="lg:hidden">
        <PremiumFooter />
      </div>
    </div>
  );
}
