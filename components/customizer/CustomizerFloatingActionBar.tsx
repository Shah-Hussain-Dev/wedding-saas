"use client";

import { ArrowRight, Eye, FloppyDisk, SignIn } from "@phosphor-icons/react";

interface CustomizerFloatingActionBarProps {
  isFormComplete: boolean;
  isLoggedIn: boolean;
  isEdit: boolean;
  isSubmitting: boolean;
  activeStep: number;
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
  onSaveContinue,
  onPreview,
  onPrimaryAction,
}: CustomizerFloatingActionBarProps) {
  const saveContinueLabel =
    activeStep >= 5 ? "Review sections" : "Save & continue";

  const primaryLabel = !isLoggedIn ? "Log in & Finish" : "Finish & Submit";

  return (
    <div className="pointer-events-none sticky bottom-0 z-20 mt-4 border-t border-[#073D31]/10 bg-[#FAFAF8]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom,1rem))] pt-4 backdrop-blur-md sm:px-5">
      <div className="pointer-events-auto mx-auto flex w-full max-w-3xl flex-col gap-3 lg:max-w-none">
        <button
          type="button"
          onClick={onSaveContinue}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-[#073D31]/15 bg-white px-4 font-sans text-xs font-bold text-[#073D31] transition-colors hover:border-[#073D31]/30"
        >
          {saveContinueLabel}
          <ArrowRight size={14} weight="bold" />
        </button>

        {isFormComplete ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onPreview}
              className="flex min-h-[48px] min-w-0 w-full items-center justify-center gap-2 rounded-xl border border-[#073D31]/15 bg-white px-3 font-sans text-[11px] font-bold text-[#073D31] transition-colors hover:border-[#073D31]/30 sm:px-4 sm:text-xs"
            >
              <Eye size={16} weight="bold" className="shrink-0" />
              <span className="truncate">Preview</span>
            </button>
            <button
              type="button"
              onClick={onPrimaryAction}
              disabled={isSubmitting}
              className="flex min-h-[48px] min-w-0 w-full items-center justify-center gap-2 rounded-xl bg-[#073D31] px-3 font-sans text-[11px] font-bold text-[#F7F4ED] shadow-sm transition-colors hover:bg-[#032A23] disabled:opacity-60 sm:px-4 sm:text-xs"
            >
              {!isLoggedIn ? (
                <SignIn size={16} weight="bold" className="shrink-0 text-[#C8A45E]" />
              ) : (
                <FloppyDisk size={16} weight="bold" className="shrink-0" />
              )}
              <span className="truncate">{isSubmitting ? "Saving…" : primaryLabel}</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
