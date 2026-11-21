"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  FilmStrip,
  Image as ImageIcon,
  Play,
  Pause,
  UploadSimple,
  Trash,
  ArrowCounterClockwise,
  Check,
  X,
  Sparkle,
  VideoCamera,
} from "@phosphor-icons/react";
import { ImageUploader } from "@/components/media/ImageUploader";
import {
  getTemplatePosterUrl,
  getTemplateTrailerUrlOrEmpty,
  TEMPLATE_POSTER_MAP,
} from "@/lib/template-trailer";

export interface CoverPresetItem {
  id: string;
  title: string;
  url: string;
  template: string;
}

export interface VideoPresetItem {
  id: string;
  title: string;
  url: string;
  tag: string;
  template: string;
}

export const CURATED_COVER_PRESETS: CoverPresetItem[] = [
  {
    id: "royal-heritage-arch",
    title: "Royal Heritage — Mediterranean Arch",
    url: "/templates/royal-heritage/couple-arch.jpg",
    template: "royal-heritage",
  },
  {
    id: "imperial-palace-doors",
    title: "Imperial Palace — Grand Staircase Doors",
    url: "/templates/imperial-palace/doors-hero.jpg",
    template: "imperial-palace",
  },
  {
    id: "sheesh-mahal-doors",
    title: "Sheesh Mahal — Mughal Palace of Mirrors",
    url: "/templates/sheesh-mahal/assets/cover/doors.webp",
    template: "sheesh-mahal",
  },
  {
    id: "celestial-rose-terrace",
    title: "Celestial Rose — Twilight Terrace",
    url: "/templates/celestial-rose/gallery-1.jpg",
    template: "celestial-rose",
  },
  {
    id: "imperial-ballroom",
    title: "Imperial Elegance — Gilded Ballroom",
    url: "/templates/imperial-palace/ballroom.jpg",
    template: "royal-elegance",
  },
  {
    id: "royal-majesty-terrace",
    title: "Royal Majesty — Regency Terrace",
    url: "/templates/royal-majesty/ballroom-terrace.jpg",
    template: "royal-majesty",
  },
  {
    id: "royal-grace-palace",
    title: "Royal Grace — Botanical Glasshouse",
    url: "/templates/royal-grace/botanical-palace.jpg",
    template: "royal-grace",
  },
  {
    id: "rose-gold-palace",
    title: "Rose Gold Blush — Palace Archway",
    url: "/templates/rose-gold-blush/palace-arch.jpg",
    template: "rose-gold-blush",
  },
  {
    id: "royal-lotus-farman",
    title: "Royal Lotus — Rajasthani Farman",
    url: "/templates/lotus-courtyard/farman-open.webp",
    template: "royal-lotus",
  },
  {
    id: "noor-nikah-envelope",
    title: "Noor-e-Nikah — Ivory Floral Envelope",
    url: "/templates/noor-e-nikah/envelope-bg.jpg",
    template: "noor-e-nikah",
  },
  {
    id: "emerald-qasr-poster",
    title: "Emerald Qasr — Ottoman Gold Filigree",
    url: "/templates/emerald-qasr/poster.png",
    template: "emerald-qasr",
  },
  {
    id: "azure-nikah-poster",
    title: "Azure Nikah — Celestial Sapphire",
    url: "/templates/azure-nikah/poster.png",
    template: "azure-nikah",
  },
  {
    id: "kitab-nikah-poster",
    title: "Kitab-e-Nikah — Arabesque Velvet Tome",
    url: "/templates/kitab-e-nikah/poster.png",
    template: "kitab-e-nikah",
  },
  {
    id: "gul-noor-poster",
    title: "Gul-e-Noor — Rose Velvet Pearl",
    url: "/templates/gul-e-noor/poster.png",
    template: "gul-e-noor",
  },
  {
    id: "crimson-court",
    title: "Crimson Royale — Royal Court Velvet",
    url: "/templates/crimson-royale/bg-welcome-desktop.jpg",
    template: "crimson-royale",
  },
  {
    id: "emerald-noir-haveli",
    title: "Emerald Noir — Haveli Royal Vivah",
    url: "/images/gallery-library/hindu/haveli-royal-vivah.webp",
    template: "emerald-noir",
  },
  {
    id: "modern-minimal-parchment",
    title: "Modern Minimal — Architectural Parchment",
    url: "/templates/noor-e-nikah/welcome-parchment.jpg",
    template: "modern-minimal",
  },
];

export const CURATED_TRAILER_VIDEOS: VideoPresetItem[] = [
  {
    id: "royal-heritage",
    title: "Royal Heritage — Mediterranean Arch Opening",
    url: "/videos/royal-heritage.mp4",
    tag: "Mediterranean Arch",
    template: "royal-heritage",
  },
  {
    id: "celestial-rose",
    title: "Celestial Rose — Royal Prestige Terrace",
    url: "/videos/royal-prestige.mp4",
    tag: "Awwwards Dreamscape",
    template: "celestial-rose",
  },
  {
    id: "imperial-palace",
    title: "Imperial Palace — Grand Palace Doors",
    url: "/videos/royal-elegance-royal.mp4",
    tag: "Living Palace Doors",
    template: "imperial-palace",
  },
  {
    id: "royal-majesty",
    title: "Royal Majesty — Ballroom Terrace & Lake",
    url: "/videos/royal-majesty.mp4",
    tag: "Regency Ballroom",
    template: "royal-majesty",
  },
  {
    id: "royal-grace",
    title: "Royal Grace — Botanical Glasshouse",
    url: "/videos/royal-grace.mp4",
    tag: "Botanical Velvet",
    template: "royal-grace",
  },
  {
    id: "rose-gold-blush",
    title: "Rose Gold Blush — Palace Archway",
    url: "/videos/rose-gold-blush.mp4",
    tag: "Romantic Blush",
    template: "rose-gold-blush",
  },
  {
    id: "emerald-qasr",
    title: "Emerald Qasr — Ottoman Palace Opening",
    url: "/templates/emerald-qasr/opening.mp4",
    tag: "Ottoman Royale",
    template: "emerald-qasr",
  },
  {
    id: "azure-nikah",
    title: "Azure Nikah — Midnight Sapphire Opening",
    url: "/templates/azure-nikah/opening.mp4",
    tag: "Midnight Sapphire",
    template: "azure-nikah",
  },
  {
    id: "kitab-e-nikah",
    title: "Kitab-e-Nikah — Velvet Tome Opening Book",
    url: "/templates/kitab-e-nikah/opening.mp4",
    tag: "Sacred Velvet Book",
    template: "kitab-e-nikah",
  },
  {
    id: "gul-e-noor",
    title: "Gul-e-Noor — Rose Velvet Floating Envelope",
    url: "/templates/gul-e-noor/opening.mp4",
    tag: "Blush Velvet",
    template: "gul-e-noor",
  },
  {
    id: "crimson-royale",
    title: "Crimson Royale — Crimson Court Love",
    url: "/templates/crimson-royale/bg-love.mp4",
    tag: "Regal Court",
    template: "crimson-royale",
  },
];

interface TemplateCoverPickerProps {
  selectedUrl: string;
  onChange: (url: string) => void;
  templateId: string;
}

export function TemplateCoverPicker({
  selectedUrl,
  onChange,
  templateId,
}: TemplateCoverPickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadMode, setIsUploadMode] = useState(false);
  const [filterTemplate, setFilterTemplate] = useState<string>("all");

  const defaultCoverUrl = getTemplatePosterUrl(templateId);
  const effectiveUrl = selectedUrl || defaultCoverUrl;

  const filteredPresets =
    filterTemplate === "all"
      ? CURATED_COVER_PRESETS
      : filterTemplate === "current"
      ? CURATED_COVER_PRESETS.filter((p) => p.template === templateId)
      : CURATED_COVER_PRESETS;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-sans text-xs font-bold text-[#18211E]">
          Cover image (cards & modals)
        </label>
        <button
          type="button"
          onClick={() => onChange(defaultCoverUrl)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#073D31] hover:underline cursor-pointer"
          title="Reset to template's authentic default cover"
        >
          <ArrowCounterClockwise size={13} weight="bold" />
          <span>Use default cover</span>
        </button>
      </div>

      {/* Active Cover Display Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[#073D31]/15 bg-stone-900/5 p-3">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative h-44 w-32 shrink-0 overflow-hidden rounded-xl border border-stone-200/80 bg-stone-900 shadow-md">
            {effectiveUrl ? (
              <img
                src={effectiveUrl}
                alt="Selected Cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-stone-400">
                <ImageIcon size={28} />
                <span className="text-[10px] mt-1 font-semibold">No Cover</span>
              </div>
            )}
            <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/75 px-1.5 py-0.5 text-[9px] font-bold text-amber-200 tracking-wider uppercase">
              3:4 Portrait
            </span>
          </div>

          <div className="min-w-0 flex-1 space-y-2.5">
            <div>
              <p className="text-xs font-bold text-stone-800 truncate">
                {CURATED_COVER_PRESETS.find((p) => p.url === selectedUrl)?.title ||
                  (selectedUrl.startsWith("http")
                    ? "Custom Uploaded Cover"
                    : selectedUrl
                    ? selectedUrl.split("/").pop()
                    : "Template Default Poster")}
              </p>
              <p className="text-[11px] text-stone-500 truncate mt-0.5">
                {selectedUrl || defaultCoverUrl}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsUploadMode(false);
                  setIsModalOpen(true);
                }}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#073D31] px-3.5 py-1.5 text-xs font-bold text-[#F7F4ED] hover:bg-[#073D31]/90 transition-colors cursor-pointer shadow-xs"
              >
                <ImageIcon size={15} weight="bold" />
                <span>Choose Cover Preset</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsUploadMode(true);
                  setIsModalOpen(true);
                }}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#073D31]/20 bg-white px-3.5 py-1.5 text-xs font-bold text-[#073D31] hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <UploadSimple size={15} weight="bold" />
                <span>Upload Custom</span>
              </button>

              {selectedUrl && selectedUrl !== defaultCoverUrl && (
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100/60 transition-colors cursor-pointer"
                  title="Clear custom cover and use default"
                >
                  <Trash size={14} weight="bold" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preset / Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative flex max-h-[88vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 bg-stone-50/80">
              <div className="flex items-center gap-2">
                <ImageIcon size={20} className="text-[#073D31]" weight="bold" />
                <h3 className="font-playfair text-base sm:text-lg font-bold text-stone-900">
                  Select Template Cover Photo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-stone-200 px-5 gap-3 bg-stone-50/40">
              <button
                type="button"
                onClick={() => setIsUploadMode(false)}
                className={`py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  !isUploadMode
                    ? "border-[#073D31] text-[#073D31]"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                Curated Presets ({CURATED_COVER_PRESETS.length})
              </button>
              <button
                type="button"
                onClick={() => setIsUploadMode(true)}
                className={`py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  isUploadMode
                    ? "border-[#073D31] text-[#073D31]"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                Upload File / Custom
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-5 min-h-[320px]">
              {!isUploadMode ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-stone-500">
                      Click any cover to assign it to this template:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(defaultCoverUrl);
                        setIsModalOpen(false);
                      }}
                      className="text-xs font-bold text-[#073D31] hover:underline cursor-pointer"
                    >
                      Use Template Default ({templateId})
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredPresets.map((preset) => {
                      const isSelected =
                        selectedUrl === preset.url ||
                        (!selectedUrl && preset.url === defaultCoverUrl);
                      return (
                        <div
                          key={preset.id}
                          onClick={() => {
                            onChange(preset.url);
                            setIsModalOpen(false);
                          }}
                          className={`group relative flex flex-col overflow-hidden rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#073D31] ring-2 ring-[#073D31] shadow-md"
                              : "border-stone-200 hover:border-amber-400 hover:shadow-sm"
                          }`}
                        >
                          <div className="relative aspect-[3/4] w-full bg-stone-900 overflow-hidden">
                            <img
                              src={preset.url}
                              alt={preset.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 rounded-full bg-[#073D31] text-white p-1 shadow-md">
                                <Check size={12} weight="bold" />
                              </div>
                            )}
                          </div>
                          <div className="p-2 bg-white">
                            <p className="text-[11px] font-bold text-stone-800 line-clamp-1">
                              {preset.title.split("—")[1]?.trim() || preset.title}
                            </p>
                            <p className="text-[9px] text-stone-400 uppercase tracking-wider font-semibold">
                              {preset.template}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-w-md mx-auto py-2">
                  <p className="text-xs text-stone-600">
                    Upload a high-resolution 3:4 portrait photo for this template&apos;s catalog cover:
                  </p>
                  <ImageUploader
                    initialUrl={selectedUrl}
                    onUploadSuccess={(url) => {
                      onChange(url);
                      setIsModalOpen(false);
                    }}
                    folder="wedding-saas/template-covers"
                    label="Upload Cover Photo"
                  />
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Or paste an image URL directly:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://... or /templates/..."
                        defaultValue={selectedUrl}
                        onBlur={(e) => {
                          if (e.target.value.trim()) {
                            onChange(e.target.value.trim());
                            setIsModalOpen(false);
                          }
                        }}
                        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-stone-200 px-5 py-3 bg-stone-50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface TemplateVideoPickerProps {
  selectedUrl: string;
  onChange: (url: string) => void;
  templateId: string;
}

export function TemplateVideoPicker({
  selectedUrl,
  onChange,
  templateId,
}: TemplateVideoPickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customInput, setCustomInput] = useState(selectedUrl);
  const defaultTrailerUrl = getTemplateTrailerUrlOrEmpty(templateId);
  const activeVideoUrl = selectedUrl.trim();

  useEffect(() => {
    setCustomInput(selectedUrl);
  }, [selectedUrl]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-sans text-xs font-bold text-[#18211E]">
          Trailer video (opening preview)
        </label>
        <button
          type="button"
          onClick={() => onChange(defaultTrailerUrl)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#073D31] hover:underline cursor-pointer"
          title="Reset to template's authentic default opening video"
        >
          <ArrowCounterClockwise size={13} weight="bold" />
          <span>Use default trailer</span>
        </button>
      </div>

      {/* Video Display Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[#073D31]/15 bg-stone-900/5 p-3.5 space-y-3">
        {activeVideoUrl ? (
          <div className="space-y-3">
            <div className="relative w-full aspect-video max-w-md mx-auto rounded-xl overflow-hidden bg-black shadow-md border border-stone-800">
              <video
                src={activeVideoUrl}
                controls
                playsInline
                muted
                preload="metadata"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-800 truncate">
                  {CURATED_TRAILER_VIDEOS.find((v) => v.url === activeVideoUrl)?.title ||
                    "Custom Trailer Video"}
                </p>
                <p className="text-[11px] text-stone-500 truncate">{activeVideoUrl}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[#073D31] px-3 py-1.5 text-xs font-bold text-[#F7F4ED] hover:bg-[#073D31]/90 transition-colors cursor-pointer"
                >
                  <VideoCamera size={15} weight="bold" />
                  <span>Change Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100/60 transition-colors cursor-pointer"
                  title="Disable trailer video and use static cover photo only"
                >
                  <Trash size={14} weight="bold" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2">
            <div className="flex items-center gap-2.5 text-stone-500">
              <FilmStrip size={24} className="text-stone-400" />
              <div>
                <p className="text-xs font-bold text-stone-700">No Trailer Video Selected</p>
                <p className="text-[11px] text-stone-500">
                  Template will display high-resolution static cover photo.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#073D31] px-4 py-2 text-xs font-bold text-[#F7F4ED] hover:bg-[#073D31]/90 transition-colors cursor-pointer shadow-xs"
            >
              <VideoCamera size={16} weight="bold" />
              <span>Select Trailer Video</span>
            </button>
          </div>
        )}
      </div>

      {/* Video Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative flex max-h-[88vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 bg-stone-50/80">
              <div className="flex items-center gap-2">
                <VideoCamera size={20} className="text-[#073D31]" weight="bold" />
                <h3 className="font-playfair text-base sm:text-lg font-bold text-stone-900">
                  Select Opening Trailer Video
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Quick Actions Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 px-5 py-3 bg-stone-50/40">
              <span className="text-xs text-stone-500">
                Choose a cinematic trailer video for opening animations:
              </span>
              <div className="flex items-center gap-2">
                {defaultTrailerUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange(defaultTrailerUrl);
                      setIsModalOpen(false);
                    }}
                    className="text-xs font-bold text-[#073D31] hover:underline cursor-pointer"
                  >
                    Template Default ({templateId})
                  </button>
                )}
                <span className="text-stone-300">·</span>
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setIsModalOpen(false);
                  }}
                  className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                >
                  None (Static Cover Only)
                </button>
              </div>
            </div>

            {/* Video Grid */}
            <div className="overflow-y-auto p-5 space-y-3 min-h-[320px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CURATED_TRAILER_VIDEOS.map((video) => {
                  const isSelected = activeVideoUrl === video.url;
                  return (
                    <div
                      key={video.id}
                      onClick={() => {
                        onChange(video.url);
                        setIsModalOpen(false);
                      }}
                      className={`group relative flex flex-col rounded-xl border p-3 transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#073D31] bg-[#073D31]/5 ring-2 ring-[#073D31] shadow-md"
                          : "border-stone-200 bg-white hover:border-amber-400 hover:shadow-sm"
                      }`}
                    >
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black mb-2">
                        <video
                          src={video.url}
                          muted
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white/80 group-hover:text-white">
                          <Play size={24} weight="fill" />
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 rounded-full bg-[#073D31] text-white p-1 shadow-md">
                            <Check size={12} weight="bold" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 line-clamp-1">
                            {video.title}
                          </p>
                          <span className="inline-block mt-0.5 rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-bold text-stone-600 uppercase tracking-wider">
                            {video.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom URL Option */}
              <div className="rounded-xl border border-dashed border-stone-300 p-4 space-y-2 mt-4 bg-stone-50/50">
                <label className="block text-xs font-bold text-stone-700">
                  Or enter custom video URL (Cloudinary / Hosted MP4):
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="https://res.cloudinary.com/.../opening.mp4"
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs bg-white text-stone-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customInput.trim()) {
                        onChange(customInput.trim());
                        setIsModalOpen(false);
                      }
                    }}
                    className="shrink-0 rounded-lg bg-[#073D31] px-4 py-2 text-xs font-bold text-[#F7F4ED] hover:bg-[#073D31]/90 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-stone-200 px-5 py-3 bg-stone-50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
