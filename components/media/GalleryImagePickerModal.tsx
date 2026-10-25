"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Check,
  Sparkle,
  MagnifyingGlass,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  ArrowsClockwise,
  Heart,
  Plus,
} from "@phosphor-icons/react";
import {
  CURATED_GALLERY_LIBRARY,
  GALLERY_COLLECTIONS,
  GALLERY_TRADITION_FILTERS,
  GalleryLibraryItem,
  filterGalleryArtwork,
} from "@/lib/gallery-library";
import { CulturalTradition } from "@/lib/pdf-theme-tokens";

export interface GalleryImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImages: (selectedUrls: string[], mode: "append" | "replace") => void;
  currentGalleryCount?: number;
  maxImages?: number;
  initialTradition?: CulturalTradition | "all";
}

export function GalleryImagePickerModal({
  isOpen,
  onClose,
  onSelectImages,
  currentGalleryCount = 0,
  maxImages = 6,
  initialTradition = "all",
}: GalleryImagePickerModalProps) {
  // State
  const [selectedTradition, setSelectedTradition] = useState<CulturalTradition | "all">(
    initialTradition || "all"
  );
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItemUrls, setSelectedItemUrls] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<"append" | "replace">("append");
  const [inspectItem, setInspectItem] = useState<GalleryLibraryItem | null>(null);

  // Sync initialTradition whenever modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialTradition) {
        setSelectedTradition(initialTradition);
      }
      setSelectedItemUrls([]);
      setInspectItem(null);
    }
  }, [isOpen, initialTradition]);

  // Remaining selection slots allowed
  const availableSlots = useMemo(() => {
    if (selectionMode === "replace") {
      return maxImages;
    }
    return Math.max(0, maxImages - currentGalleryCount);
  }, [selectionMode, maxImages, currentGalleryCount]);

  // Filtered images
  const filteredImages = useMemo(() => {
    return filterGalleryArtwork(selectedTradition, selectedCollection, searchQuery);
  }, [selectedTradition, selectedCollection, searchQuery]);

  // Toggle selection of an image
  const handleToggleSelect = (url: string) => {
    if (selectedItemUrls.includes(url)) {
      setSelectedItemUrls((prev) => prev.filter((u) => u !== url));
    } else {
      if (selectedItemUrls.length >= availableSlots) {
        return; // hit limit
      }
      setSelectedItemUrls((prev) => [...prev, url]);
    }
  };

  // Confirm selection
  const handleConfirm = () => {
    if (selectedItemUrls.length === 0) return;
    onSelectImages(selectedItemUrls, selectionMode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/75 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-[#FCFAF6] text-stone-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#C8A45E]/30 flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="relative px-4 sm:px-6 py-4 bg-linear-to-r from-[#073D31] to-[#0A4D3E] text-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-[#C8A45E]/20 border border-[#C8A45E]/50 flex items-center justify-center text-[#E1C98E]">
                  <Sparkle size={18} weight="fill" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#FCFAF6] flex items-center gap-2">
                    <span>Curated Wedding Gallery Library</span>
                  </h3>
                  <p className="text-[11px] text-[#E1C98E]/85">
                    Select original anime & cultural artwork for your wedding gallery
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close library modal"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Cultural Tradition Switcher */}
            <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs select-none">
              <span className="text-[10px] uppercase font-bold text-[#E1C98E]/75 tracking-wider mr-1 shrink-0 hidden sm:inline">
                Tradition:
              </span>
              {GALLERY_TRADITION_FILTERS.map((trad) => {
                const isActive = selectedTradition === trad.id;
                return (
                  <button
                    key={trad.id}
                    type="button"
                    onClick={() => setSelectedTradition(trad.id)}
                    className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer text-xs ${
                      isActive
                        ? "bg-[#C8A45E] text-[#073D31] font-bold shadow-xs scale-102"
                        : "bg-white/10 hover:bg-white/20 text-stone-200"
                    }`}
                  >
                    <span>{trad.icon}</span>
                    <span>{trad.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subheader: Category Chips + Search Bar */}
          <div className="px-4 sm:px-6 py-3 bg-[#F7F4ED] border-b border-stone-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 select-none">
              {GALLERY_COLLECTIONS.map((col) => {
                const isActive = selectedCollection === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedCollection(col.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-[#073D31] text-[#E1C98E] shadow-xs"
                        : "bg-stone-200/70 hover:bg-stone-300/80 text-stone-700"
                    }`}
                  >
                    <span className="mr-1">{col.icon}</span>
                    <span>{col.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search Input */}
            <div className="relative min-w-[180px] sm:w-56 shrink-0">
              <MagnifyingGlass
                size={14}
                weight="bold"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artwork, tags..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#073D31]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X size={12} weight="bold" />
                </button>
              )}
            </div>
          </div>

          {/* Image Grid Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
            {filteredImages.length === 0 ? (
              <div className="py-16 text-center text-stone-500">
                <Sparkle size={32} className="mx-auto text-amber-500 mb-2 opacity-60" />
                <p className="font-serif text-lg font-bold text-stone-700">No artwork found</p>
                <p className="text-xs text-stone-500 mt-1">Try selecting another tradition or category filter above.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTradition("all");
                    setSelectedCollection("all");
                    setSearchQuery("");
                  }}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {filteredImages.map((item) => {
                  const isSelected = selectedItemUrls.includes(item.url);
                  const selectionIndex = selectedItemUrls.indexOf(item.url);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleSelect(item.url)}
                      className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all cursor-pointer select-none bg-stone-100 ${
                        isSelected
                          ? "border-[#C8A45E] ring-2 ring-[#C8A45E]/40 shadow-md scale-[1.01]"
                          : "border-stone-200 hover:border-amber-400/80 hover:shadow-xs"
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                      />

                      {/* Top Badges: Tradition & Selection Checkbox */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-semibold text-white/95 flex items-center gap-1 shadow-xs">
                          <span>{item.traditionIcon}</span>
                          <span className="capitalize">{item.religion}</span>
                        </span>

                        {/* Selection Checkmark Indicator */}
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                            isSelected
                              ? "bg-[#C8A45E] text-[#073D31] scale-110 ring-2 ring-white"
                              : "bg-black/40 text-transparent border border-white/60 group-hover:border-white"
                          }`}
                        >
                          {isSelected ? (
                            <span className="text-[11px] font-extrabold">{selectionIndex + 1}</span>
                          ) : (
                            <Check size={11} weight="bold" />
                          )}
                        </div>
                      </div>

                      {/* Bottom Info Overlay with Facial Clearance (occupies bottom 28% max) */}
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/55 to-transparent p-2.5 pt-6 text-white flex items-end justify-between">
                        <div className="min-w-0 pr-2">
                          <p className="font-serif text-xs font-bold leading-tight truncate text-[#FCFAF6]">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-stone-300/90 truncate">
                            {item.subtitle}
                          </p>
                        </div>

                        {/* Quick Inspect Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectItem(item);
                          }}
                          className="h-7 w-7 rounded-full bg-white/20 hover:bg-[#C8A45E] hover:text-[#073D31] text-white flex items-center justify-center shrink-0 transition-colors shadow-xs"
                          title="Inspect full image"
                        >
                          <Eye size={13} weight="bold" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="px-4 sm:px-6 py-3.5 bg-[#F7F4ED] border-t border-stone-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
            {/* Status & Options */}
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-800">
                  Selected: {selectedItemUrls.length}{" "}
                  <span className="text-stone-500 font-normal">
                    (limit {availableSlots} photos)
                  </span>
                </span>
                {selectedItemUrls.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedItemUrls([])}
                    className="text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Append vs Replace switch (only if existing gallery has photos) */}
              {currentGalleryCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <label className="text-[11px] text-stone-500 font-medium">Mode:</label>
                  <select
                    value={selectionMode}
                    onChange={(e) => setSelectionMode(e.target.value as any)}
                    className="text-xs font-semibold bg-white border border-stone-300 rounded-md px-2 py-1 text-stone-800 focus:outline-none focus:border-[#073D31]"
                  >
                    <option value="append">Add to existing (+{currentGalleryCount})</option>
                    <option value="replace">Replace all photos</option>
                  </select>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-200/70 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={selectedItemUrls.length === 0}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                  selectedItemUrls.length > 0
                    ? "bg-linear-to-r from-[#073D31] to-[#0A4D3E] text-[#E1C98E] hover:from-[#0A4D3E] hover:to-[#073D31] hover:shadow-lg scale-102"
                    : "bg-stone-300 text-stone-500 cursor-not-allowed opacity-60"
                }`}
              >
                <Sparkle size={14} weight="fill" />
                <span>
                  Add {selectedItemUrls.length > 0 ? `${selectedItemUrls.length} Photos` : "Selected Photos"}
                </span>
              </button>
            </div>
          </div>

          {/* Quick-Inspect Fullscreen Lightbox Modal */}
          {inspectItem && (
            <div className="absolute inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 text-white border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-base">{inspectItem.traditionIcon}</span>
                  <div>
                    <h4 className="font-serif text-base font-bold text-white leading-tight">
                      {inspectItem.title}
                    </h4>
                    <p className="text-[11px] text-stone-300">{inspectItem.subtitle}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectItem(null)}
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>

              {/* Main Image View */}
              <div className="flex-1 flex items-center justify-center py-3 overflow-hidden">
                <img
                  src={inspectItem.url}
                  alt={inspectItem.title}
                  className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-white/20"
                />
              </div>

              {/* Inspect Details & Toggle Select */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white shrink-0">
                <div className="text-xs text-stone-300 max-w-md">
                  <p className="line-clamp-2">{inspectItem.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {inspectItem.tags.map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-stone-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleSelect(inspectItem.url);
                      setInspectItem(null);
                    }}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedItemUrls.includes(inspectItem.url)
                        ? "bg-rose-600 hover:bg-rose-700 text-white"
                        : "bg-[#C8A45E] hover:bg-[#b8954e] text-[#073D31]"
                    }`}
                  >
                    {selectedItemUrls.includes(inspectItem.url) ? (
                      <>
                        <X size={14} weight="bold" />
                        <span>Remove from Selection</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} weight="bold" />
                        <span>Select this Artwork</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
