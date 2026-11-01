"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, ArrowRight } from "@phosphor-icons/react";
import type { TemplateReelDefinition } from "@/config/template-reels";
import { ReelPlaybackProvider } from "@/components/reels/reel-playback-context";
import { ReelTemplatePlayback } from "@/components/reels/reel-template-playback";

interface ReelPreviewModalProps {
  reel: TemplateReelDefinition | null;
  onClose: () => void;
}

export function ReelPreviewModal({ reel, onClose }: ReelPreviewModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (reel) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [reel]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 z-[200] m-0 flex max-h-[100dvh] w-full max-w-none items-end justify-center border-0 bg-transparent p-0 backdrop:bg-black/60 sm:items-center sm:p-4"
      aria-labelledby={reel ? "reel-preview-title" : undefined}
    >
      {reel ? (
        <ReelPlaybackProvider reel={reel} pauseWhenHidden={false}>
          <div className="flex max-h-[96dvh] w-full max-w-md flex-col rounded-t-3xl bg-[#FCFBF7] shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-[#073D31]/8 px-4 py-3">
              <h2 id="reel-preview-title" className="font-serif text-base font-medium text-[#18211E]">
                {reel.name}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white text-[#073D31] shadow-sm"
                aria-label="Close preview"
              >
                <X size={20} weight="bold" />
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-5">
              <ReelTemplatePlayback size="default" />
              <Link
                href={`/reels/${reel.templateId}`}
                onClick={onClose}
                className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#073D31] text-xs font-bold uppercase tracking-wider text-[#F7F4ED]"
              >
                Full reel page
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>
        </ReelPlaybackProvider>
      ) : null}
    </dialog>
  );
}
