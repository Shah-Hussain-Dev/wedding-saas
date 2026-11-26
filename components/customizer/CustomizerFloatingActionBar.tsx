"use client";

import { ArrowRight, Eye, FloppyDisk, LockOpen, SignIn } from "@phosphor-icons/react";

interface CustomizerFloatingActionBarProps {
  isFormComplete: boolean;
  isLoggedIn: boolean;
  isEdit: boolean;
  isSubmitting: boolean;
  activeStep: number;
  isPaid?: boolean;
  priceFormatted?: string;
  onSaveContinue: () => void;
  onPreview: () => void;
  onPrimaryAction: () => void;
}

export function CustomizerFloatingActionBar({
  isFormComplete,
  isLoggedIn,
  isEdit,
  isSubmitting,
  activeStep,
  isPaid = false,
  priceFormatted,
  onSaveContinue,
  onPreview,
  onPrimaryAction,
}: CustomizerFloatingActionBarProps) {
  const saveContinueLabel =
    activeStep >= 5 ? "Review sections" : "Save & continue";

  let primaryLabel = !isLoggedIn
    ? priceFormatted
      ? `Log in & Unlock · ${priceFormatted}`
      : "Log in & Unlock"
    : isEdit || isPaid
      ? "Save & Update"
      : priceFormatted
        ? `Pay & Unlock · ${priceFormatted}`
        : "Pay & Unlock";

  return (
    <div className="sticky bottom-0 z-30 mt-4 border-t border-[#073D31]/10 bg-[#FAFAF8]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom,1rem))] pt-3.5 backdrop-blur-md sm:px-5 shadow-[0_-8px_20px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2.5 lg:max-w-none">
        <button
          type="button"
          onClick={onSaveContinue}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-[#073D31]/15 bg-white px-4 font-sans text-xs font-bold text-[#073D31] transition-all hover:border-[#073D31]/30 active:scale-[0.98] cursor-pointer touch-manipulation select-none"
        >
          {saveContinueLabel}
          <ArrowRight size={14} weight="bold" />
        </button>

        <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onPreview}
              className="flex min-h-[48px] min-w-0 w-full items-center justify-center gap-2 rounded-xl border border-[#073D31]/15 bg-white px-3 font-sans text-[11px] font-bold text-[#073D31] transition-all hover:border-[#073D31]/30 active:scale-[0.98] sm:px-4 sm:text-xs cursor-pointer touch-manipulation select-none"
            >
              <Eye size={16} weight="bold" className="shrink-0" />
              <span className="truncate">Preview</span>
            </button>
            <button
              type="button"
              onClick={onPrimaryAction}
              disabled={isSubmitting}
              className="flex min-h-[48px] min-w-0 w-full items-center justify-center gap-2 rounded-xl bg-[#073D31] px-3 font-sans text-[11px] font-bold text-[#F7F4ED] shadow-sm transition-all hover:bg-[#032A23] active:scale-[0.98] disabled:opacity-60 sm:px-4 sm:text-xs cursor-pointer touch-manipulation select-none"
            >
              {!isLoggedIn ? (
                <LockOpen size={16} weight="bold" className="shrink-0 text-[#C8A45E]" />
              ) : !isPaid && !isEdit ? (
                <LockOpen size={16} weight="bold" className="shrink-0 text-[#C8A45E]" />
              ) : (
                <FloppyDisk size={16} weight="bold" className="shrink-0" />
              )}
              <span className="truncate">{isSubmitting ? "Processing…" : primaryLabel}</span>
            </button>
          </div>
      </div>
    </div>
  );
}
