"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Sparkle, X } from "@phosphor-icons/react";

interface CustomizerSubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  coupleLabel: string;
}

export function CustomizerSubmitConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  coupleLabel,
}: CustomizerSubmitConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-[#073D31]/10 bg-[#FCFBF7] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="customizer-confirm-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#76766F] hover:bg-[#073D31]/5"
          aria-label="Close"
        >
          <X size={18} weight="bold" />
        </button>

        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#C8A45E]/15 text-[#8B6914]">
          <Sparkle size={22} weight="fill" />
        </div>

        <h2 id="customizer-confirm-title" className="font-serif text-xl font-medium text-[#18211E]">
          Save {coupleLabel}&apos;s invitation?
        </h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-[#76766F]">
          We&apos;ll save your free live demo to your dashboard. You can edit names, dates, photos,
          and ceremonies anytime before you share with guests—nothing is locked in stone.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="min-h-[44px] flex-1 rounded-xl border border-[#073D31]/15 bg-white font-sans text-xs font-bold text-[#073D31]"
          >
            Not yet
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="min-h-[44px] flex-1 rounded-xl bg-[#073D31] font-sans text-xs font-bold text-[#F7F4ED] hover:bg-[#032A23] disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : "Save my invitation"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
