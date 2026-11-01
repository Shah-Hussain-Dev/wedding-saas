"use client";

import { useEffect, useState, useCallback } from "react";
import type { TemplateCatalogEntry } from "@/lib/template-settings";
import { getTemplatePosterUrl } from "@/lib/template-trailer";
import { getTemplateTrailerUrlOrEmpty } from "@/lib/template-trailer";

const STORAGE_KEY = "unfold_template_catalog";

export function useTemplateCatalog() {
  const [catalogMap, setCatalogMap] = useState<Record<string, TemplateCatalogEntry>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCatalogMap(JSON.parse(stored));
      }
    } catch (_) {}

    let active = true;

    async function load() {
      try {
        const res = await fetch(`/api/templates/catalog?_t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (active && data.catalog) {
            setCatalogMap(data.catalog);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data.catalog));
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn("Could not load template catalog:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  const getCoverUrl = useCallback(
    (templateId: string): string => {
      const id = templateId.replace(/_/g, "-").toLowerCase();
      const entry = catalogMap[id];
      if (entry?.coverImageUrl) return entry.coverImageUrl;
      return getTemplatePosterUrl(id);
    },
    [catalogMap]
  );

  const getTrailerUrl = useCallback(
    (templateId: string): string => {
      const id = templateId.replace(/_/g, "-").toLowerCase();
      const entry = catalogMap[id];
      if (entry?.trailerVideoUrl) return entry.trailerVideoUrl;
      return getTemplateTrailerUrlOrEmpty(id);
    },
    [catalogMap]
  );

  const getDefaultMusicTrack = useCallback(
    (templateId: string, fallback: string): string => {
      const id = templateId.replace(/_/g, "-").toLowerCase();
      const entry = catalogMap[id];
      if (entry?.defaultMusicTrack) return entry.defaultMusicTrack;
      return fallback;
    },
    [catalogMap]
  );

  const getCatalogEntry = useCallback(
    (templateId: string): TemplateCatalogEntry | null => {
      const id = templateId.replace(/_/g, "-").toLowerCase();
      return catalogMap[id] ?? null;
    },
    [catalogMap]
  );

  return {
    catalogMap,
    loading,
    getCoverUrl,
    getTrailerUrl,
    getDefaultMusicTrack,
    getCatalogEntry,
  };
}
