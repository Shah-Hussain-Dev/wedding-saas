"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getTemplateDefaultData } from "@/templates";
import { CUSTOMIZER_DRAFT_EVENT, readCustomizerDraft } from "@/lib/customizer-preview-sync";
import {
  getDefaultFaithForTemplate,
  getFaithAdjustedTemplateData,
  type PreviewFaith,
} from "@/lib/preview-faith-content";

export function usePreviewTemplateData(templateId: string) {
  const normalizedId = templateId.trim().replace(/_/g, "-").toLowerCase();
  const codeTemplateDefault = getTemplateDefaultData(normalizedId);
  const [resolvedDemoDefaults, setResolvedDemoDefaults] = useState<Record<string, unknown> | null>(
    null
  );
  const [liveDraft, setLiveDraft] = useState<Record<string, unknown> | null>(() =>
    readCustomizerDraft(normalizedId)
  );
  const [selectedFaith, setSelectedFaith] = useState<PreviewFaith>(() =>
    getDefaultFaithForTemplate(normalizedId)
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

  const readDraft = useCallback(() => {
    const parsed = readCustomizerDraft(normalizedId);
    if (parsed) setLiveDraft(parsed);
    if (
      parsed?.religion === "universal" ||
      parsed?.religion === "hindu" ||
      parsed?.religion === "muslim"
    ) {
      setSelectedFaith(parsed.religion);
    }
  }, [normalizedId]);

  useEffect(() => {
    readDraft();
    window.addEventListener(CUSTOMIZER_DRAFT_EVENT, readDraft);
    return () => window.removeEventListener(CUSTOMIZER_DRAFT_EVENT, readDraft);
  }, [readDraft]);

  const templateDefault = resolvedDemoDefaults
    ? { ...codeTemplateDefault, ...resolvedDemoDefaults }
    : codeTemplateDefault;

  const sampleData = useMemo(() => {
    const draft = liveDraft || {};
    const defaultBride =
      templateDefault?.brideName ||
      templateDefault?.couple?.brideName ||
      "Anaya";
    const defaultGroom =
      templateDefault?.groomName ||
      templateDefault?.couple?.groomName ||
      "Ishaan";
    const draftBride =
      (typeof draft.brideName === "string" && draft.brideName.trim()) || defaultBride;
    const draftGroom =
      (typeof draft.groomName === "string" && draft.groomName.trim()) || defaultGroom;

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
      gallery: Array.isArray(draft.gallery)
        ? draft.gallery
        : templateDefault?.gallery,
      eventsJson: Array.isArray(draft.eventsJson)
        ? draft.eventsJson
        : Array.isArray(draft.events)
          ? draft.events
          : templateDefault?.eventsJson ?? templateDefault?.events,
      musicTrack:
        (typeof draft.musicTrack === "string" && draft.musicTrack) || templateDefault?.musicTrack,
      couple: {
        ...templateDefault?.couple,
        brideName: draftBride,
        groomName: draftGroom,
      },
      hideReligionSwitcher: true,
      religion: selectedFaith,
    };

    const isNameCustomized =
      (draftBride !== defaultBride && draftBride.trim().length > 0) ||
      (draftGroom !== defaultGroom && draftGroom.trim().length > 0);

    return getFaithAdjustedTemplateData(
      baseSampleData,
      selectedFaith,
      normalizedId,
      isNameCustomized ? { bride: draftBride, groom: draftGroom } : undefined
    );
  }, [liveDraft, normalizedId, selectedFaith, templateDefault]);

  const eventsForBeats = useMemo(() => {
    const ev = sampleData?.eventsJson ?? sampleData?.events;
    return Array.isArray(ev) ? ev : null;
  }, [sampleData]);

  return {
    normalizedId,
    sampleData,
    eventsForBeats,
    selectedFaith,
  };
}
