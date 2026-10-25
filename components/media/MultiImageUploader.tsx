"use client";

import { useState, useRef } from "react";
import {
  UploadSimple,
  X,
  Image as ImageIcon,
  Spinner,
  Plus,
  CheckCircle,
  Sparkle,
  Eye,
} from "@phosphor-icons/react";
import { GalleryImagePickerModal } from "./GalleryImagePickerModal";
import { CulturalTradition } from "@/lib/pdf-theme-tokens";

interface MultiImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  label?: string;
  folder?: string;
  tradition?: CulturalTradition | "all";
  enableLibrary?: boolean;
}

export function MultiImageUploader({
  images = [],
  onChange,
  maxImages = 6,
  label = "Gallery & Memories Photos",
  folder = "wedding-saas/gallery",
  tradition = "all",
  enableLibrary = true,
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`You can upload a maximum of ${maxImages} gallery photos.`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const newUploadedUrls: string[] = [];

      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} is larger than 10MB.`);
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.url) {
          throw new Error(data.error || "Image upload failed");
        }

        newUploadedUrls.push(data.url);
      }

      const updated = [...images, ...newUploadedUrls];
      onChange(updated);
    } catch (err: any) {
      console.error("Multi upload error:", err);
      setError(err.message || "Failed to upload one or more images.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleLibrarySelection = (newUrls: string[], mode: "append" | "replace") => {
    if (mode === "replace") {
      onChange(newUrls.slice(0, maxImages));
    } else {
      const combined = [...images, ...newUrls];
      // remove exact duplicates while preserving order
      const unique = Array.from(new Set(combined)).slice(0, maxImages);
      onChange(unique);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Header with Title and Dual Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
            {label} ({images.length}/{maxImages})
          </label>
          <p className="text-[11px] text-stone-500">
            Upload your couple photos or pick from our curated anime & cultural library
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {enableLibrary && (
            <button
              type="button"
              onClick={() => setIsLibraryOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-linear-to-r from-[#073D31] to-[#0A4D3E] hover:from-[#0A4D3E] hover:to-[#073D31] text-[#E1C98E] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer hover:shadow-sm hover:scale-102"
            >
              <Sparkle size={14} weight="fill" />
              <span>Choose from Library</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= maxImages}
            className="px-3 py-1.5 rounded-lg border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UploadSimple size={14} weight="bold" />
            <span>Upload Photos</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Grid of uploaded thumbnails + Add button */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((url, idx) => {
          const isLibraryImage = url.includes("/images/gallery-library/");

          return (
            <div
              key={idx}
              className="relative aspect-square rounded-xl overflow-hidden border-2 border-stone-200 bg-stone-100 group shadow-xs"
            >
              <img
                src={url}
                alt={`Gallery photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />

              {/* Action Buttons Top Overlay */}
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewPhotoUrl(url)}
                  className="h-6 w-6 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
                  title="Preview photo"
                >
                  <Eye size={12} weight="bold" />
                </button>

                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="h-6 w-6 rounded-full bg-stone-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
                  title="Remove photo"
                >
                  <X size={12} weight="bold" />
                </button>
              </div>

              {/* Number Badge */}
              <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold">
                #{idx + 1}
              </div>

              {/* Curated Library Badge */}
              {isLibraryImage && (
                <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-[#073D31]/90 border border-[#C8A45E]/40 text-[#E1C98E] text-[8px] font-bold tracking-wider flex items-center gap-0.5 shadow-xs">
                  <Sparkle size={9} weight="fill" />
                  <span>LIBRARY ART</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Add photo trigger tile (if under max) */}
        {images.length < maxImages && (
          <div className="aspect-square rounded-xl border-2 border-dashed border-stone-300 hover:border-amber-500 bg-stone-50/70 hover:bg-amber-50/40 text-stone-500 p-2 flex flex-col items-center justify-center gap-1.5 transition-all group">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Add More
            </span>
            <div className="flex flex-col sm:flex-row items-center gap-1.5 w-full px-1">
              {enableLibrary && (
                <button
                  type="button"
                  onClick={() => setIsLibraryOpen(true)}
                  className="w-full py-1.5 px-2 rounded-lg bg-[#073D31] text-[#E1C98E] text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs hover:bg-[#0A4D3E] cursor-pointer"
                >
                  <Sparkle size={12} weight="fill" />
                  <span>Library</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full py-1.5 px-2 rounded-lg bg-white border border-stone-200 text-stone-700 text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-stone-100 cursor-pointer"
              >
                {uploading ? (
                  <Spinner size={12} className="animate-spin text-amber-600" />
                ) : (
                  <>
                    <UploadSimple size={12} weight="bold" />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </div>
            <span className="text-[9px] text-stone-400">Max {maxImages} photos</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesSelected}
        className="hidden"
      />

      {/* Reusable Curated Gallery Library Modal */}
      <GalleryImagePickerModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectImages={handleLibrarySelection}
        currentGalleryCount={images.length}
        maxImages={maxImages}
        initialTradition={tradition}
      />

      {/* Individual Photo Preview Lightbox */}
      {previewPhotoUrl && (
        <div
          onClick={() => setPreviewPhotoUrl(null)}
          className="fixed inset-0 z-70 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl max-h-[85vh] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-white/20 p-2"
          >
            <button
              type="button"
              onClick={() => setPreviewPhotoUrl(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors z-10 cursor-pointer"
            >
              <X size={16} weight="bold" />
            </button>
            <img
              src={previewPhotoUrl}
              alt="Preview"
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
