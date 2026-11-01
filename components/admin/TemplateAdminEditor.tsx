"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Crown,
  FloppyDisk,
  Heart,
  Image as ImageIcon,
  Info,
  MusicNotes,
  Sparkle,
  Tag,
} from "@phosphor-icons/react";
import { getTemplateMeta } from "@/lib/template-meta";
import { CustomizerStepAccordion } from "@/components/customizer/CustomizerStepAccordion";
import { CustomizerLivePreviewPanel } from "@/components/customizer/CustomizerLivePreviewPanel";
import { TemplateEditorSidebarShell } from "@/components/template-editor/TemplateEditorSidebarShell";
import { ImageUploader } from "@/components/media/ImageUploader";
import { MultiImageUploader } from "@/components/media/MultiImageUploader";
import { AudioTrackSelector } from "@/components/media/AudioTrackSelector";
import {
  RELIGION_PRESETS,
  type EventItem,
} from "@/components/customizer/InvitationCustomizerWizard";
import type { CulturalTradition } from "@/lib/pdf-theme-tokens";
import {
  buildAdminPreviewPayload,
  buildDefaultsJsonFromDraft,
} from "@/lib/template-settings-draft";
import { writeCustomizerDraft } from "@/lib/customizer-preview-sync";

const ADMIN_STEPS = [
  { id: 1, title: "Catalog & media", subtitle: "Cover, trailer, copy", icon: Tag },
  { id: 2, title: "The couple", subtitle: "Demo names & faith", icon: Heart },
  { id: 3, title: "Sacred copy", subtitle: "Invocation & verses", icon: Sparkle },
  { id: 4, title: "Date & venue", subtitle: "Demo schedule", icon: Calendar },
  { id: 5, title: "Ceremonies", subtitle: "Default events", icon: Clock },
  { id: 6, title: "Photo & audio", subtitle: "Hero, gallery, music", icon: ImageIcon },
  { id: 7, title: "Optional sections", subtitle: "Dress code & transport", icon: Info },
  { id: 8, title: "Commerce", subtitle: "Pricing overview", icon: Crown },
];

interface TemplateAdminEditorProps {
  templateId: string;
}

export function TemplateAdminEditor({ templateId }: TemplateAdminEditorProps) {
  const normalizedId = templateId.replace(/_/g, "-").toLowerCase();
  const meta = getTemplateMeta(normalizedId);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [openSteps, setOpenSteps] = useState<number[]>([1]);
  const [pricing, setPricing] = useState<{
    priceFormatted: string;
    originalPriceFormatted: string;
    discountName: string;
  } | null>(null);

  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [trailerVideoUrl, setTrailerVideoUrl] = useState("");
  const [descriptionOverride, setDescriptionOverride] = useState("");

  const [brideName, setBrideName] = useState("Diya");
  const [groomName, setGroomName] = useState("Shaan");
  const [religion, setReligion] = useState<CulturalTradition>("universal");
  const [sacredInvocation, setSacredInvocation] = useState("");
  const [sacredVerse, setSacredVerse] = useState("");
  const [sacredTranslation, setSacredTranslation] = useState("");

  const [weddingDate, setWeddingDate] = useState("2026-12-22");
  const [weddingTime, setWeddingTime] = useState("06:30 PM onwards");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");

  const [events, setEvents] = useState<EventItem[]>([]);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [slideshowImages, setSlideshowImages] = useState<string[]>([]);
  const [musicTrack, setMusicTrack] = useState(`/templates/${normalizedId}/music.mp3`);

  const [showDressCode, setShowDressCode] = useState(false);
  const [dressCodeText, setDressCodeText] = useState("");
  const [showTransport, setShowTransport] = useState(false);
  const [transportText, setTransportText] = useState("");

  const buildDraft = useCallback(() => {
    return buildAdminPreviewPayload(normalizedId, {
      brideName,
      groomName,
      slug: `${brideName}-${groomName}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      weddingDate,
      weddingTime,
      venueName,
      venueAddress,
      religion,
      sacredInvocation,
      sacredVerse,
      sacredTranslation,
      heroImageUrl,
      slideshowImages,
      gallery: slideshowImages,
      musicTrack,
      eventsJson: events,
      events,
      showDressCode,
      dressCodeText,
      showTransport,
      transportText,
    });
  }, [
    normalizedId,
    brideName,
    groomName,
    weddingDate,
    weddingTime,
    venueName,
    venueAddress,
    religion,
    sacredInvocation,
    sacredVerse,
    sacredTranslation,
    heroImageUrl,
    slideshowImages,
    musicTrack,
    events,
    showDressCode,
    dressCodeText,
    showTransport,
    transportText,
  ]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/templates/${normalizedId}/settings`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        const d = data.resolvedDefaults ?? {};
        const settings = data.settings ?? {};

        setCoverImageUrl(settings.coverImageUrl ?? "");
        setTrailerVideoUrl(settings.trailerVideoUrl ?? "");
        setDescriptionOverride(settings.marketingJson?.descriptionOverride ?? "");

        if (d.brideName) setBrideName(String(d.brideName));
        if (d.groomName) setGroomName(String(d.groomName));
        if (d.religion === "muslim" || d.religion === "hindu" || d.religion === "universal") {
          setReligion(d.religion);
        }
        if (d.sacredInvocation) setSacredInvocation(String(d.sacredInvocation));
        if (d.sacredVerse) setSacredVerse(String(d.sacredVerse));
        if (d.sacredTranslation) setSacredTranslation(String(d.sacredTranslation));
        if (d.weddingDate) setWeddingDate(String(d.weddingDate).split("T")[0]);
        if (d.weddingTime) setWeddingTime(String(d.weddingTime));
        if (d.venueName) setVenueName(String(d.venueName));
        if (d.venueAddress) setVenueAddress(String(d.venueAddress));
        if (Array.isArray(d.eventsJson)) setEvents(d.eventsJson as EventItem[]);
        if (d.heroImageUrl) setHeroImageUrl(String(d.heroImageUrl));
        if (Array.isArray(d.slideshowImages)) setSlideshowImages(d.slideshowImages as string[]);
        if (d.musicTrack) setMusicTrack(String(d.musicTrack));
        if (d.showDressCode !== undefined) setShowDressCode(Boolean(d.showDressCode));
        if (d.dressCodeText) setDressCodeText(String(d.dressCodeText));
        if (d.showTransport !== undefined) setShowTransport(Boolean(d.showTransport));
        if (d.transportText) setTransportText(String(d.transportText));

        if (data.pricing) {
          setPricing({
            priceFormatted: data.pricing.priceFormatted,
            originalPriceFormatted: data.pricing.originalPriceFormatted,
            discountName: data.pricing.discountName,
          });
        }
      } catch (err) {
        console.error(err);
        setToast("Could not load template settings.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [normalizedId]);

  useEffect(() => {
    if (loading) return;
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      writeCustomizerDraft(normalizedId, buildDraft());
    }, 280);
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [buildDraft, loading, normalizedId]);

  const toggleStep = (stepId: number) => {
    setOpenSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const handleSelectReligion = (rel: CulturalTradition) => {
    setReligion(rel);
    const preset = RELIGION_PRESETS[rel];
    setSacredInvocation(preset.sacredInvocation);
    setSacredVerse(preset.sacredVerse);
    setSacredTranslation(preset.sacredTranslation);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const draft = buildDraft();
      const res = await fetch(`/api/admin/templates/${normalizedId}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coverImageUrl: coverImageUrl.trim() || null,
          trailerVideoUrl: trailerVideoUrl.trim() || null,
          defaultMusicTrack: musicTrack.trim() || null,
          defaultsJson: buildDefaultsJsonFromDraft(draft),
          marketingJson: {
            descriptionOverride: descriptionOverride.trim() || undefined,
          },
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      setToast("Template settings saved.");
      writeCustomizerDraft(normalizedId, draft);
    } catch (err: unknown) {
      setToast(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const previewPanel = useMemo(
    () => (
      <CustomizerLivePreviewPanel
        templateId={normalizedId}
        templateName={meta.name}
        religion={religion}
        musicTrack={musicTrack}
        adminPreview
      />
    ),
    [normalizedId, meta.name, religion, musicTrack]
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center font-sans text-sm text-[#76766F]">
        Loading template settings…
      </div>
    );
  }

  const sidebar = (
    <>
      <div className="shrink-0 border-b border-[#073D31]/8 px-3 pt-5 pb-4 sm:px-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/admin"
            className="inline-flex min-h-[44px] items-center gap-1.5 font-sans text-xs font-semibold text-[#76766F] hover:text-[#18211E]"
          >
            <ArrowLeft className="h-4 w-4" />
            Admin
          </Link>
          <span className="rounded-full border border-[#C8A45E]/30 bg-[#C8A45E]/10 px-3 py-1 text-[11px] font-bold text-[#8B6914]">
            {meta.name}
          </span>
        </div>
        <h1 className="font-serif text-2xl font-medium text-[#18211E]">Template settings</h1>
        <p className="mt-1 font-sans text-xs text-[#76766F]">
          Demo defaults for catalog, preview, and new customize sessions.
        </p>
        {toast ? (
          <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
            {toast}
          </p>
        ) : null}
      </div>

      <div className="mx-auto w-full max-w-3xl shrink-0 px-3 pb-28 pt-2 sm:px-4 lg:mx-0 lg:max-w-none lg:px-4">
        {ADMIN_STEPS.map((step) => (
          <CustomizerStepAccordion
            key={step.id}
            step={step}
            sectionId={`admin-step-${step.id}`}
            isOpen={openSteps.includes(step.id)}
            isComplete
            canOpen
            onToggle={() => toggleStep(step.id)}
          >
            {step.id === 1 ? (
              <div className="space-y-4">
                <div>
                  <p className="mb-2 font-sans text-xs font-bold text-[#18211E]">Cover image (cards & modals)</p>
                  <ImageUploader
                    initialUrl={coverImageUrl}
                    onUploadSuccess={setCoverImageUrl}
                    folder="wedding-saas/template-covers"
                    label="Upload cover (3:4 portrait)"
                  />
                </div>
                <label className="block">
                  <span className="font-sans text-xs font-bold text-[#18211E]">Trailer video URL</span>
                  <input
                    type="url"
                    value={trailerVideoUrl}
                    onChange={(e) => setTrailerVideoUrl(e.target.value)}
                    placeholder="/templates/…/opening.mp4"
                    className="mt-1 w-full rounded-xl border border-[#073D31]/15 px-3 py-2.5 font-sans text-sm"
                  />
                </label>
                <label className="block">
                  <span className="font-sans text-xs font-bold text-[#18211E]">Short description override</span>
                  <textarea
                    value={descriptionOverride}
                    onChange={(e) => setDescriptionOverride(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-[#073D31]/15 px-3 py-2.5 font-sans text-sm"
                  />
                </label>
              </div>
            ) : null}

            {step.id === 2 ? (
              <div className="space-y-3">
                <input
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  placeholder="Bride demo name"
                  className="w-full rounded-xl border border-[#073D31]/15 px-3 py-2.5 text-sm"
                />
                <input
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  placeholder="Groom demo name"
                  className="w-full rounded-xl border border-[#073D31]/15 px-3 py-2.5 text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  {(["muslim", "hindu", "universal"] as CulturalTradition[]).map((rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => handleSelectReligion(rel)}
                      className={`min-h-[44px] rounded-full px-4 text-xs font-bold capitalize ${
                        religion === rel
                          ? "bg-[#073D31] text-[#F7F4ED]"
                          : "border border-[#073D31]/15 bg-white text-[#073D31]"
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step.id === 3 ? (
              <div className="space-y-3">
                <textarea
                  value={sacredInvocation}
                  onChange={(e) => setSacredInvocation(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-[#073D31]/15 px-3 py-2.5 text-sm"
                />
                <textarea
                  value={sacredVerse}
                  onChange={(e) => setSacredVerse(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-[#073D31]/15 px-3 py-2.5 text-sm"
                />
                <textarea
                  value={sacredTranslation}
                  onChange={(e) => setSacredTranslation(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-[#073D31]/15 px-3 py-2.5 text-sm"
                />
              </div>
            ) : null}

            {step.id === 4 ? (
              <div className="space-y-3">
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full rounded-xl border border-[#073D31]/15 px-3 py-2.5 text-sm"
                />
                <input
                  value={weddingTime}
                  onChange={(e) => setWeddingTime(e.target.value)}
                  className="w-full rounded-xl border border-[#073D31]/15 px-3 py-2.5 text-sm"
                />
                <input
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="Venue name"
                  className="w-full rounded-xl border border-[#073D31]/15 px-3 py-2.5 text-sm"
                />
                <textarea
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="Venue address"
                  rows={2}
                  className="w-full rounded-xl border border-[#073D31]/15 px-3 py-2.5 text-sm"
                />
              </div>
            ) : null}

            {step.id === 5 ? (
              <div className="space-y-3">
                {events.map((ev, idx) => (
                  <div key={idx} className="rounded-xl border border-[#073D31]/10 p-3 space-y-2">
                    <input
                      value={ev.name}
                      onChange={(e) => {
                        const next = [...events];
                        next[idx] = { ...next[idx], name: e.target.value };
                        setEvents(next);
                      }}
                      className="w-full rounded-lg border border-[#073D31]/10 px-2 py-1.5 text-sm"
                    />
                    <input
                      value={ev.venue}
                      onChange={(e) => {
                        const next = [...events];
                        next[idx] = { ...next[idx], venue: e.target.value };
                        setEvents(next);
                      }}
                      className="w-full rounded-lg border border-[#073D31]/10 px-2 py-1.5 text-sm"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setEvents([
                      ...events,
                      {
                        name: "Special Ceremony",
                        enabled: true,
                        venue: "",
                        date: weddingDate,
                        time: "11:00 AM",
                      },
                    ])
                  }
                  className="min-h-[44px] rounded-full border border-[#073D31]/15 px-4 text-xs font-bold text-[#073D31]"
                >
                  Add event
                </button>
              </div>
            ) : null}

            {step.id === 6 ? (
              <div className="space-y-4">
                <ImageUploader
                  initialUrl={heroImageUrl}
                  onUploadSuccess={setHeroImageUrl}
                  label="Default hero portrait"
                />
                <MultiImageUploader
                  images={slideshowImages}
                  onChange={setSlideshowImages}
                  maxImages={6}
                  label="Default gallery"
                />
                <div className="flex items-center gap-2 font-sans text-xs font-bold text-[#18211E]">
                  <MusicNotes size={16} />
                  Default music
                </div>
                <AudioTrackSelector
                  selectedTrackUrl={musicTrack}
                  onChange={(url) => setMusicTrack(url)}
                  templateDefaultUrl={`/templates/${normalizedId}/music.mp3`}
                />
              </div>
            ) : null}

            {step.id === 7 ? (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showDressCode}
                    onChange={(e) => setShowDressCode(e.target.checked)}
                  />
                  Show dress code section
                </label>
                <textarea
                  value={dressCodeText}
                  onChange={(e) => setDressCodeText(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-[#073D31]/15 px-3 py-2.5 text-sm"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showTransport}
                    onChange={(e) => setShowTransport(e.target.checked)}
                  />
                  Show transport section
                </label>
                <textarea
                  value={transportText}
                  onChange={(e) => setTransportText(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-[#073D31]/15 px-3 py-2.5 text-sm"
                />
              </div>
            ) : null}

            {step.id === 8 && pricing ? (
              <div className="space-y-2 font-sans text-sm text-[#18211E]">
                <p>
                  Selling: <strong>{pricing.priceFormatted}</strong> · MRP{" "}
                  <span className="line-through text-[#76766F]">{pricing.originalPriceFormatted}</span>
                </p>
                <p className="text-xs text-[#76766F]">{pricing.discountName}</p>
                <Link
                  href="/admin"
                  className="inline-flex min-h-[44px] items-center text-xs font-bold text-[#073D31] underline"
                >
                  Edit pricing on Admin → Templates tab
                </Link>
              </div>
            ) : null}
          </CustomizerStepAccordion>
        ))}
      </div>

      <div className="pointer-events-none sticky bottom-0 z-20 border-t border-[#073D31]/10 bg-[#FAFAF8]/95 px-4 py-3 backdrop-blur-md">
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="pointer-events-auto flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#073D31] font-sans text-xs font-bold text-[#F7F4ED] disabled:opacity-60"
        >
          <FloppyDisk size={16} weight="bold" />
          {saving ? "Saving…" : "Save template settings"}
        </button>
      </div>
    </>
  );

  return <TemplateEditorSidebarShell sidebar={sidebar} preview={previewPanel} />;
}
