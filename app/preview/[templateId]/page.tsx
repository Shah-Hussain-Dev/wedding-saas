"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TemplateDemoPage } from "@/components/marketing/template-demo-page";
import { TEMPLATES_MAP, NoorNikah, getTemplateDefaultData } from "@/templates";
import { DemoBanner } from "@/components/preview/DemoBanner";
import { PreviewControlsDock } from "@/components/preview/PreviewControlsDock";
import {
  PreviewFaith,
  getDefaultFaithForTemplate,
  getFaithAdjustedTemplateData,
} from "@/lib/preview-faith-content";
import { Sparkle } from "@phosphor-icons/react";

interface PreviewPageProps {
  params: Promise<{ templateId: string }>;
}

const KNOWN_TEMPLATE_IDS = [
  "celestial-rose",
  "imperial-palace",
  "royal-majesty",
  "royal-heritage",
  "royal-grace",
  "rose-gold-blush",
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

interface CustomizedInvitationPreviewProps {
  customData: any;
  normalizedId: string;
  isKnownTemplate: boolean;
}

function CustomizedInvitationPreview({
  customData,
  normalizedId,
  isKnownTemplate,
}: CustomizedInvitationPreviewProps) {
  const activeTemplateId = customData?.templateId || (isKnownTemplate ? normalizedId : "noor-e-nikah");
  const templateDefault = getTemplateDefaultData(activeTemplateId);
  const SelectedTemplate = TEMPLATES_MAP[activeTemplateId] || NoorNikah;

  const isCustomized = Boolean(
    customData?.brideName ||
    customData?.groomName ||
    customData?.slug
  );

  const dynamicHashtag = (customData?.groomName && customData?.brideName)
    ? `#${customData.groomName}And${customData.brideName}`.replace(/[\s&]+/g, "")
    : undefined;

  const isPaid = Boolean(
    customData?.isPaid === true ||
    customData?.order?.status === "paid" ||
    customData?.orderStatus === "paid"
  );

  const isEffectivePublished = Boolean(customData?.isPublished && isPaid);

  const baseInvitationData = customData
    ? {
        ...templateDefault,
        ...(isCustomized ? {
          hashtag: dynamicHashtag,
          couple: {
            ...templateDefault.couple,
            brideName: customData.brideName,
            groomName: customData.groomName,
            brideParents: customData.brideParents || "",
            groomParents: customData.groomParents || "",
            brideEducation: customData.brideEducation || "",
            groomEducation: customData.groomEducation || "",
            brideProfession: customData.brideProfession || "",
            groomProfession: customData.groomProfession || "",
          },
        } : {}),
        ...customData,
        isPaid,
        isPublished: isEffectivePublished,
        events: customData.events && customData.events.length > 0 ? customData.events : templateDefault.events,
      }
    : {
        ...templateDefault,
        id: `demo-${normalizedId}`,
        slug: normalizedId,
        templateId: activeTemplateId,
        brideName: templateDefault?.couple?.brideName || templateDefault?.brideName || (templateDefault?.religion === "muslim" ? "Diya" : "Ananya"),
        groomName: templateDefault?.couple?.groomName || templateDefault?.groomName || (templateDefault?.religion === "muslim" ? "Shaan" : "Shubham"),
        isPaid: false,
        isPublished: false,
      };

  const [selectedFaith, setSelectedFaith] = useState<PreviewFaith>(() => {
    if (customData?.religion && (customData.religion === "universal" || customData.religion === "hindu" || customData.religion === "muslim")) {
      return customData.religion;
    }
    return getDefaultFaithForTemplate(activeTemplateId);
  });
  const [isHeroTapped, setIsHeroTapped] = useState(false);

  const invitationData = getFaithAdjustedTemplateData(
    baseInvitationData,
    selectedFaith,
    activeTemplateId,
    isCustomized ? { bride: customData.brideName, groom: customData.groomName } : undefined
  );

  const fallbackTrack = templateDefault?.musicTrack || `/templates/${activeTemplateId}/music.mp3`;
  const [previewMusicTrack, setPreviewMusicTrack] = useState<string>(() => {
    return invitationData.musicTrack || fallbackTrack;
  });

  const handleSelectMusic = (newUrl: string) => {
    setPreviewMusicTrack(newUrl);
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`unfold_invitation_${normalizedId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.musicTrack = newUrl;
          localStorage.setItem(`unfold_invitation_${normalizedId}`, JSON.stringify(parsed));
        }
      } catch (_) {}
    }
  };

  useEffect(() => {
    const handleCapturePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target?.closest("#preview-controls-btn") ||
        target?.closest("#preview-mute-unmute-btn") ||
        target?.closest("#preview-controls-bottom-sheet") ||
        target?.closest(".razorpay-checkout-button") ||
        target?.closest("dialog") ||
        target?.closest("[role='dialog']")
      ) {
        return;
      }
      setIsHeroTapped(true);
    };

    window.addEventListener("pointerdown", handleCapturePointerDown, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", handleCapturePointerDown, { capture: true });
    };
  }, []);

  const handleHeroPointerDown = (e: React.PointerEvent | React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target?.closest("#preview-controls-btn") ||
      target?.closest("#preview-mute-unmute-btn") ||
      target?.closest("#preview-controls-bottom-sheet") ||
      target?.closest(".razorpay-checkout-button")
    ) {
      return;
    }
    setIsHeroTapped(true);
  };

  return (
    <div className="relative min-h-screen no-scrollbar" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
      {/* Suppress inconsistent template-native audio buttons so only the unified Mute/Unmute dock button is shown */}
      <style jsx global>{`
        [id$="music-toggle"],
        [id$="music-toggle-btn"],
        .an-music-toggle,
        .gn-music-toggle,
        .kn-music-toggle,
        .eq-music-toggle,
        .music-toggle,
        .noor-music-toggle,
        .grace-music-toggle,
        .heritage-music-toggle,
        .majesty-music-toggle,
        .rgb-music-toggle,
        .celestial-audio-pill,
        .imperial-audio-pill,
        .luxury-audio-dock {
          display: none !important;
        }
      `}</style>

      {/* Demo Banner with Timer & Razorpay Checkout */}
      <DemoBanner
        invitationId={invitationData.id}
        slug={invitationData.slug || normalizedId}
        templateId={activeTemplateId}
        templateName={invitationData.brideName ? `${invitationData.brideName} & ${invitationData.groomName}` : undefined}
        brideName={invitationData.brideName}
        groomName={invitationData.groomName}
        amountPaise={customData?.amountPaise}
        isPublished={isEffectivePublished}
        isPaid={isPaid}
        expiresInSeconds={900} // 15-minute interactive demo session
        isHeroTapped={isHeroTapped}
      />

      {/* Render Self-Contained Template */}
      <div
        onPointerDown={handleHeroPointerDown}
        onClick={handleHeroPointerDown}
        className="relative w-full"
      >
        <SelectedTemplate data={{ ...invitationData, musicTrack: previewMusicTrack, hideReligionSwitcher: true }} />
      </div>

      {/* Unified Invitation Controls Dock: Floating Mute/Unmute + Floating Controls Button that opens bottom sheet */}
      <PreviewControlsDock
        templateId={activeTemplateId}
        templateName={invitationData.brideName ? `${invitationData.brideName} & ${invitationData.groomName}` : activeTemplateId}
        templateDefaultUrl={fallbackTrack}
        currentTrackUrl={previewMusicTrack}
        onSelectTrack={handleSelectMusic}
        currentFaith={selectedFaith}
        onSelectFaith={(f) => setSelectedFaith(f)}
        slug={invitationData.slug || normalizedId}
        isHeroTapped={isHeroTapped}
      />
    </div>
  );
}

function PreviewContent({ templateId }: { templateId: string }) {
  const searchParams = useSearchParams();
  const isCustomParam = searchParams.get("custom") === "1";

  // Normalize underscores or case (e.g. emerald_noir -> emerald-noir)
  const normalizedId = (templateId || "").trim().replace(/_/g, "-").toLowerCase();
  const isKnownTemplate = KNOWN_TEMPLATE_IDS.includes(normalizedId);

  const [customData, setCustomData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkData() {
      let localItem: any = null;
      if (typeof window !== "undefined") {
        try {
          const storedSingle =
            localStorage.getItem(`unfold_invitation_${normalizedId}`) ||
            localStorage.getItem(`unfold_invitation_${templateId}`);
          if (storedSingle) {
            localItem = JSON.parse(storedSingle);
          } else {
            const storedList = localStorage.getItem("unfold_active_invitations");
            if (storedList) {
              const list = JSON.parse(storedList);
              localItem = list.find(
                (item: any) =>
                  item.slug === normalizedId ||
                  item.slug === templateId ||
                  item.id === normalizedId ||
                  item.id === templateId
              );
            }
          }
        } catch (e) {
          console.warn("Storage check:", e);
        }
      }

      // Check DB if slug is not a base template or if custom
      let dbItem: any = null;
      if (!isKnownTemplate || isCustomParam) {
        try {
          const res = await fetch(`/api/invitations/public?slug=${encodeURIComponent(normalizedId)}`);
          if (res.ok) {
            dbItem = await res.json();
          }
        } catch (err) {
          console.warn("API check offline");
        }
      }

      const merged = dbItem ? { ...localItem, ...dbItem } : localItem;

      if (merged) {
        // Enforce payment status ground truth: unpaid invitations are NEVER paid or published
        const isPaid = Boolean(
          merged.isPaid === true ||
          merged.order?.status === "paid" ||
          merged.orderStatus === "paid"
        );
        merged.isPaid = isPaid;
        merged.isPublished = Boolean(merged.isPublished && isPaid);

        // Sanitize corrupted localStorage cache if it was mistakenly marked isPublished
        if (!isPaid && typeof window !== "undefined") {
          try {
            localStorage.setItem(`unfold_invitation_${normalizedId}`, JSON.stringify(merged));
          } catch (_) {}
        }

        setCustomData(merged);
        setLoading(false);
        return;
      }

      setLoading(false);
    }

    checkData();
  }, [templateId, normalizedId, isKnownTemplate, isCustomParam]);

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
    return <TemplateDemoPage templateId={normalizedId} />;
  }

  // Otherwise, render the customized live preview wrapped in the DemoBanner
  return (
    <CustomizedInvitationPreview
      customData={customData}
      normalizedId={normalizedId}
      isKnownTemplate={isKnownTemplate}
    />
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
