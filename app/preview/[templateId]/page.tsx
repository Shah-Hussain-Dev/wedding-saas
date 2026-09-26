"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TemplateDemoPage } from "@/components/marketing/template-demo-page";
import { TEMPLATES_MAP, NoorNikah, getTemplateDefaultData } from "@/templates";
import { DemoBanner } from "@/components/preview/DemoBanner";
import { DoorAnimation } from "@/components/invitation/DoorAnimation";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { Sparkle } from "@phosphor-icons/react";

interface PreviewPageProps {
  params: Promise<{ templateId: string }>;
}

const KNOWN_TEMPLATE_IDS = [
  "noor-e-nikah",
  "emerald-qasr",
  "gul-e-noor",
  "azure-nikah",
  "kitab-e-nikah",
  "crimson-royale",
  "royal-lotus",
  "emerald-noir",
  "royal-elegance",
  "modern-minimal",
];

function PreviewContent({ templateId }: { templateId: string }) {
  const searchParams = useSearchParams();
  const isCustomParam = searchParams.get("custom") === "1";

  const isKnownTemplate = KNOWN_TEMPLATE_IDS.includes(templateId);

  // If it's a known template and NOT explicitly flagged as a customized slug, check if custom data exists
  const [customData, setCustomData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasOpenedDoors, setHasOpenedDoors] = useState(false);

  useEffect(() => {
    async function checkData() {
      if (typeof window !== "undefined") {
        try {
          const storedSingle = localStorage.getItem(`unfold_invitation_${templateId}`);
          if (storedSingle) {
            setCustomData(JSON.parse(storedSingle));
            setLoading(false);
            return;
          }

          const storedList = localStorage.getItem("unfold_active_invitations");
          if (storedList) {
            const list = JSON.parse(storedList);
            const found = list.find((item: any) => item.slug === templateId || item.id === templateId);
            if (found) {
              setCustomData(found);
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn("Storage check:", e);
        }
      }

      // If not in storage and not a known template, attempt DB lookup
      if (!isKnownTemplate) {
        try {
          const res = await fetch(`/api/invitations/public?slug=${templateId}`);
          if (res.ok) {
            const data = await res.json();
            setCustomData(data);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn("API check offline");
        }
      }

      setLoading(false);
    }

    checkData();
  }, [templateId, isKnownTemplate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-white">
        <Sparkle className="h-8 w-8 text-amber-400 animate-spin-slow mb-3" />
        <span className="text-xs uppercase tracking-widest text-white/70">Loading live preview...</span>
      </div>
    );
  }

  // If it's a known template ID and not explicitly flagged as custom, render the template overview demo page
  if (isKnownTemplate && !isCustomParam) {
    return <TemplateDemoPage templateId={templateId} />;
  }

  // Otherwise, render the customized live preview wrapped in the DemoBanner
  const activeTemplateId = customData?.templateId || (isKnownTemplate ? templateId : "noor-e-nikah");
  const templateDefault = getTemplateDefaultData(activeTemplateId);
  const SelectedTemplate = TEMPLATES_MAP[activeTemplateId] || NoorNikah;

  const invitationData = customData
    ? {
        ...templateDefault,
        ...customData,
        events: customData.events && customData.events.length > 0 ? customData.events : templateDefault.events,
      }
    : {
        ...templateDefault,
        id: `demo-${templateId}`,
        slug: templateId,
        templateId: activeTemplateId,
        brideName: templateDefault?.couple?.brideName || "Diya",
        groomName: templateDefault?.couple?.groomName || "Shaan",
      };

  return (
    <div className="relative min-h-screen">
      {/* Demo Banner with Timer & Razorpay Checkout */}
      <DemoBanner
        invitationId={invitationData.id}
        slug={invitationData.slug || templateId}
        templateId={activeTemplateId}
        templateName={invitationData.brideName ? `${invitationData.brideName} & ${invitationData.groomName}` : undefined}
        amountPaise={149900}
        isPublished={invitationData.isPublished}
        expiresInSeconds={900} // 15-minute interactive demo session
      />

      {/* Render Self-Contained Template */}
      <SelectedTemplate data={invitationData} />
    </div>
  );
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { templateId } = use(params);

  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-950" />}>
      <PreviewContent templateId={templateId} />
    </Suspense>
  );
}
