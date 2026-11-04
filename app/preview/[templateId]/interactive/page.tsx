"use client";

import { use, useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sliders, ArrowLeft, CreditCard } from "@phosphor-icons/react";
import { TEMPLATES_MAP, getTemplateDefaultData, NoorNikah } from "@/templates";
import { PreviewControlsDock } from "@/components/preview/PreviewControlsDock";
import {
  PreviewFaith,
  getDefaultFaithForTemplate,
  getFaithAdjustedTemplateData,
} from "@/lib/preview-faith-content";
import {
  CUSTOMIZER_DRAFT_EVENT,
  customizerDraftKey,
} from "@/lib/customizer-preview-sync";
import { CustomizerSubmitFlow } from "@/components/customizer/CustomizerSubmitFlow";

interface InteractivePreviewProps {
  templateId: string;
}

const ALL_16_TEMPLATES = [
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
  "sheesh-mahal",
];

function InteractivePreviewInner({ templateId }: InteractivePreviewProps) {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get("embed") === "1";
  const isCustomizerEmbed = searchParams.get("customizer") === "1";
  const hideFaithSelector = isEmbed || isCustomizerEmbed;
  const isAdminPreview = searchParams.get("adminPreview") === "1";
  const queryMusicTrack = searchParams.get("musicTrack");
  const queryFaith = searchParams.get("faith") as PreviewFaith | null;

  // Normalize underscores to hyphens
  const normalizedId = (templateId || "").trim().replace(/_/g, "-").toLowerCase();

  const codeTemplateDefault = getTemplateDefaultData(normalizedId);
  const [resolvedDemoDefaults, setResolvedDemoDefaults] = useState<Record<string, unknown> | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    async function loadResolved() {
      try {
        const res = await fetch(`/api/templates/${normalizedId}/defaults`, { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (!cancelled && data.defaults) setResolvedDemoDefaults(data.defaults);
      } catch {
        /* ignore */
      }
    }
    void loadResolved();
    return () => {
      cancelled = true;
    };
  }, [normalizedId]);

  const templateDefault = resolvedDemoDefaults
    ? { ...codeTemplateDefault, ...resolvedDemoDefaults }
    : codeTemplateDefault;
  const fallbackTrack =
    (typeof templateDefault?.musicTrack === "string" && templateDefault.musicTrack) ||
    `/templates/${normalizedId}/music.mp3`;

  // Dynamic preview faith selection (Universal, Hindu, Muslim)
  const [selectedFaith, setSelectedFaith] = useState<PreviewFaith>(() => {
    if (queryFaith === "universal" || queryFaith === "hindu" || queryFaith === "muslim") {
      return queryFaith;
    }
    return getDefaultFaithForTemplate(normalizedId);
  });
  const [isHeroTapped, setIsHeroTapped] = useState(false);

  useEffect(() => {
    if (queryFaith && (queryFaith === "universal" || queryFaith === "hindu" || queryFaith === "muslim")) {
      setSelectedFaith(queryFaith);
    }
  }, [queryFaith]);

  // Sync bidirectional faith message with parent window
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "PREVIEW_FAITH_CHANGED" && e.data.faith) {
        setSelectedFaith(e.data.faith);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleFaithChange = (newFaith: PreviewFaith) => {
    if (hideFaithSelector) return;
    setSelectedFaith(newFaith);
    if (typeof window !== "undefined" && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "PREVIEW_FAITH_CHANGED", faith: newFaith }, "*");
    }
  };

  const [musicTrack, setMusicTrack] = useState<string>(() => {
    if (queryMusicTrack) return queryMusicTrack;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`unfold_invitation_${normalizedId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.musicTrack) return parsed.musicTrack;
        }
        const direct = localStorage.getItem(`unfold_preview_music_${normalizedId}`);
        if (direct) return direct;
      } catch (_) {}
    }
    return fallbackTrack;
  });

  useEffect(() => {
    if (queryMusicTrack) {
      setMusicTrack(queryMusicTrack);
    }
  }, [queryMusicTrack]);

  const handleTrackChange = (newUrl: string) => {
    setMusicTrack(newUrl);
    if (typeof window !== "undefined" && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "PREVIEW_MUSIC_CHANGED", trackUrl: newUrl }, "*");
    }
  };

  const defaultBride =
    templateDefault?.brideName ||
    templateDefault?.couple?.brideName ||
    (normalizedId.includes("nikah") || normalizedId === "emerald-qasr" || normalizedId === "gul-e-noor" ? "Diya" : "Ananya");
  const defaultGroom =
    templateDefault?.groomName ||
    templateDefault?.couple?.groomName ||
    (normalizedId.includes("nikah") || normalizedId === "emerald-qasr" || normalizedId === "gul-e-noor" ? "Shaan" : "Shubham");

  const [brideName, setBrideName] = useState(defaultBride);
  const [groomName, setGroomName] = useState(defaultGroom);
  const [liveDraft, setLiveDraft] = useState<Record<string, unknown> | null>(null);
  const [isOpenPanel, setIsOpenPanel] = useState(!isEmbed);
  const [submitValidationError, setSubmitValidationError] = useState<string | null>(null);
  const showCustomizerSubmitChrome = isCustomizerEmbed && !isEmbed && !isAdminPreview;

  useEffect(() => {
    if (!isCustomizerEmbed) return;

    const readDraft = () => {
      try {
        const stored = localStorage.getItem(customizerDraftKey(normalizedId));
        if (!stored) return;
        const parsed = JSON.parse(stored) as Record<string, unknown>;
        setLiveDraft(parsed);
        if (typeof parsed.brideName === "string" && parsed.brideName.trim()) {
          setBrideName(parsed.brideName);
        }
        if (typeof parsed.groomName === "string" && parsed.groomName.trim()) {
          setGroomName(parsed.groomName);
        }
        if (typeof parsed.musicTrack === "string" && parsed.musicTrack.trim()) {
          setMusicTrack(parsed.musicTrack);
        }
        if (
          parsed.religion === "universal" ||
          parsed.religion === "hindu" ||
          parsed.religion === "muslim"
        ) {
          setSelectedFaith(parsed.religion);
        }
      } catch {
        /* ignore */
      }
    };

    readDraft();
    window.addEventListener(CUSTOMIZER_DRAFT_EVENT, readDraft);
    return () => window.removeEventListener(CUSTOMIZER_DRAFT_EVENT, readDraft);
  }, [isCustomizerEmbed, normalizedId]);

  const SelectedTemplate = TEMPLATES_MAP[normalizedId] || NoorNikah;
  const activeGroom = groomName || defaultGroom;
  const activeBride = brideName || defaultBride;
  const draft = liveDraft || {};
  const draftBride =
    (typeof draft.brideName === "string" && draft.brideName.trim()) || activeBride;
  const draftGroom =
    (typeof draft.groomName === "string" && draft.groomName.trim()) || activeGroom;

  const baseSampleData = {
    ...templateDefault,
    ...draft,
    templateId: normalizedId,
    brideName: draftBride,
    groomName: draftGroom,
    weddingDate:
      (typeof draft.weddingDate === "string" && draft.weddingDate) ||
      templateDefault?.weddingDate,
    weddingTime:
      (typeof draft.weddingTime === "string" && draft.weddingTime) ||
      templateDefault?.weddingTime,
    venueName:
      (typeof draft.venueName === "string" && draft.venueName) || templateDefault?.venueName,
    venueAddress:
      (typeof draft.venueAddress === "string" && draft.venueAddress) ||
      templateDefault?.venueAddress,
    heroImageUrl:
      (typeof draft.heroImageUrl === "string" && draft.heroImageUrl) ||
      templateDefault?.heroImageUrl,
    slideshowImages: Array.isArray(draft.slideshowImages)
      ? (draft.slideshowImages as string[])
      : templateDefault?.slideshowImages,
    eventsJson: Array.isArray(draft.eventsJson)
      ? draft.eventsJson
      : Array.isArray(draft.events)
        ? draft.events
        : (templateDefault?.eventsJson || templateDefault?.events),
    events: Array.isArray(draft.events)
      ? draft.events
      : Array.isArray(draft.eventsJson)
        ? draft.eventsJson
        : (templateDefault?.events || templateDefault?.eventsJson),
    sacred: {
      ...(templateDefault?.sacred || {}),
      invocation:
        (typeof draft.sacredInvocation === "string" && draft.sacredInvocation) ||
        templateDefault?.sacred?.invocation,
      mantra:
        (typeof draft.sacredVerse === "string" && draft.sacredVerse) ||
        templateDefault?.sacred?.mantra,
      shlokaTranslation:
        (typeof draft.sacredTranslation === "string" && draft.sacredTranslation) ||
        templateDefault?.sacred?.shlokaTranslation,
    },
    hashtag:
      draftGroom && draftBride
        ? `#${draftGroom}And${draftBride}`.replace(/[\s&]+/g, "")
        : "",
    musicTrack:
      (typeof draft.musicTrack === "string" && draft.musicTrack) || musicTrack,
    couple: {
      ...templateDefault?.couple,
      brideName: draftBride,
      groomName: draftGroom,
    },
  };

  const isNameCustomized =
    (draftBride !== defaultBride && draftBride.trim().length > 0) ||
    (draftGroom !== defaultGroom && draftGroom.trim().length > 0);

  const sampleData = {
    ...getFaithAdjustedTemplateData(
      baseSampleData,
      selectedFaith,
      normalizedId,
      isNameCustomized ? { bride: draftBride, groom: draftGroom } : undefined
    ),
    hideReligionSwitcher: true,
  };

  useEffect(() => {
    const handleCapturePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target?.closest("#preview-music-selector-btn") ||
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
    if (target?.closest(".preview-faith-selector-wrapper")) return;
    setIsHeroTapped(true);
  };

  const getDraftForSubmit = useCallback((): Record<string, unknown> => {
    try {
      const stored = localStorage.getItem(customizerDraftKey(normalizedId));
      if (stored) {
        return JSON.parse(stored) as Record<string, unknown>;
      }
    } catch {
      /* ignore */
    }
    return {
      ...(liveDraft || {}),
      templateId: normalizedId,
      brideName: draftBride,
      groomName: draftGroom,
      religion: selectedFaith,
      musicTrack,
    };
  }, [liveDraft, normalizedId, draftBride, draftGroom, selectedFaith, musicTrack]);

  const customizeBackHref = `/customize/${normalizedId}?musicTrack=${encodeURIComponent(musicTrack)}`;

  return (
    <div
      className={`relative min-h-[100dvh] bg-[#380D17] overflow-x-hidden no-scrollbar ${isEmbed ? "overflow-y-auto" : ""}`}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        html, body, div, * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        ::-webkit-scrollbar, *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        /* Suppress inconsistent template-native audio buttons so only the unified Mute/Unmute dock button is shown */
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
        .sheesh-audio-pill,
        .sm-music-toggle,
        .luxury-audio-dock {
          display: none !important;
        }
      `}</style>

      {/* Hero-tappable Template Wrapper */}
      <div
        onPointerDown={handleHeroPointerDown}
        onClick={handleHeroPointerDown}
        className="relative w-full"
      >
        <SelectedTemplate data={sampleData} />
      </div>

      {/* Unified Invitation Controls Dock: Floating Mute/Unmute + Floating Controls Button that opens bottom sheet */}
      <PreviewControlsDock
        templateId={normalizedId}
        templateName={normalizedId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
        templateDefaultUrl={fallbackTrack}
        currentTrackUrl={musicTrack}
        onSelectTrack={handleTrackChange}
        currentFaith={selectedFaith}
        onSelectFaith={handleFaithChange}
        hideFaithSelector={hideFaithSelector}
        isHeroTapped={isHeroTapped}
      />

      {showCustomizerSubmitChrome ? (
        <>
          <CustomizerSubmitFlow
            templateId={normalizedId}
            getDraft={getDraftForSubmit}
            customizeHref={customizeBackHref}
            onValidationError={(message) => setSubmitValidationError(message)}
          />
          {submitValidationError ? (
            <div
              className="fixed bottom-24 left-3 z-[997] max-w-[11.5rem] rounded-lg border border-[#073D31]/10 bg-[#FAFAF8]/95 px-2 py-1.5 font-sans text-[9px] font-semibold leading-snug text-[#18211E] shadow-md backdrop-blur-sm sm:left-4"
              style={{ bottom: "max(96px, calc(env(safe-area-inset-bottom, 0px) + 88px))" }}
            >
              {submitValidationError}{" "}
              <Link href={customizeBackHref} className="font-bold text-[#073D31] underline underline-offset-2">
                Editor
              </Link>
            </div>
          ) : null}
        </>
      ) : null}

      {!isEmbed && (
        <>
          {/* Top-Left: Back navigation */}
          <div
            className="fixed top-2.5 sm:top-4 left-3 sm:left-6 z-[999] pointer-events-auto"
            style={{ top: "max(10px, env(safe-area-inset-top, 10px))" }}
          >
            <Link
              href={showCustomizerSubmitChrome ? customizeBackHref : "/templates"}
              id="interactive-back-to-templates"
              aria-label={showCustomizerSubmitChrome ? "Back to editor" : "Back to templates"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 min-h-[38px] sm:min-h-[42px] rounded-full bg-stone-950/90 hover:bg-stone-900 text-stone-200 hover:text-amber-300 backdrop-blur-xl border border-white/20 hover:border-amber-400/50 text-[11px] sm:text-xs font-bold shadow-2xl transition-all active:scale-95 whitespace-nowrap cursor-pointer group"
            >
              <ArrowLeft size={14} weight="bold" className="group-hover:-translate-x-0.5 transition-transform text-amber-400" />
              <span className="hidden sm:inline">
                {showCustomizerSubmitChrome ? "Back to editor" : "Back to Templates"}
              </span>
              <span className="sm:hidden">{showCustomizerSubmitChrome ? "Editor" : "Templates"}</span>
            </Link>
          </div>

          {!showCustomizerSubmitChrome ? (
          <>
          <div
            className={`fixed bottom-6 left-6 z-50 transition-all duration-300 max-w-sm w-[90%] md:w-80 ${
              isOpenPanel ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
            }`}
          >
            <div className="bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-white shadow-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Sliders className="h-4 w-4" weight="bold" />
                  <span className="text-xs uppercase font-bold tracking-widest">Sandbox</span>
                </div>
                <button onClick={() => setIsOpenPanel(false)} className="text-[10px] text-white/50 hover:text-white uppercase font-bold cursor-pointer">
                  Hide
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-white/40 font-bold mb-1">Bride</label>
                  <input
                    type="text"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-400 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-white/40 font-bold mb-1">Groom</label>
                  <input
                    type="text"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-400 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {ALL_16_TEMPLATES.map((id) => (
                    <Link href={`/preview/${id}/interactive`} key={id}>
                      <button
                        className={`w-full py-1 text-[8px] uppercase font-bold rounded cursor-pointer ${
                          normalizedId === id ? "bg-amber-400 text-black" : "bg-white/5 text-white/80 hover:bg-white/10"
                        }`}
                      >
                        {id.replace(/-/g, " ")}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Link href={`/preview/${normalizedId}`} className="flex-1">
                  <button className="w-full border border-white/20 text-white text-xs font-semibold py-2.5 rounded-full flex items-center justify-center gap-1 cursor-pointer hover:bg-white/5">
                    <ArrowLeft className="h-3 w-3" /> Demo page
                  </button>
                </Link>
                <Link href={`/customize/${normalizedId}?musicTrack=${encodeURIComponent(musicTrack)}`} className="flex-1">
                  <button className="w-full bg-amber-400 text-black text-xs font-bold py-2.5 rounded-full flex items-center justify-center gap-1 cursor-pointer hover:bg-amber-300">
                    <CreditCard className="h-3 w-3" /> Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {!isOpenPanel && (
            <button
              onClick={() => setIsOpenPanel(true)}
              className="fixed bottom-6 left-6 z-50 bg-[#073D31] border border-[#C8A45E]/40 text-white p-3 rounded-full shadow-2xl flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer"
            >
              <Sliders className="h-4 w-4 text-[#C8A45E]" weight="bold" />
              <span className="text-[10px] font-bold tracking-widest uppercase pr-1">Customize</span>
            </button>
          )}
          </>
          ) : null}
        </>
      )}
    </div>
  );
}

export default function InteractivePreviewPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = use(params);

  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-900" />}>
      <InteractivePreviewInner templateId={templateId} />
    </Suspense>
  );
}
