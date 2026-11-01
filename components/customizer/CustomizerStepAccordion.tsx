"use client";

import { CaretDown, Check } from "@phosphor-icons/react";
import type { IconProps } from "@phosphor-icons/react";
import type { ComponentType, ReactNode } from "react";

export interface CustomizerStepDef {
  id: number;
  title: string;
  subtitle: string;
  icon: ComponentType<IconProps>;
}

interface CustomizerStepAccordionProps {
  step: CustomizerStepDef;
  isOpen: boolean;
  isComplete: boolean;
  canOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  sectionId: string;
}

function AccordionHeader({
  step,
  isOpen,
  isComplete,
  canOpen,
  onToggle,
}: Pick<
  CustomizerStepAccordionProps,
  "step" | "isOpen" | "isComplete" | "canOpen" | "onToggle"
>) {
  const StepIcon = step.icon;

  return (
    <button
      type="button"
      onClick={() => canOpen && onToggle()}
      disabled={!canOpen}
      aria-expanded={isOpen}
      className={`flex w-full min-h-[52px] items-center gap-3 px-4 py-3 text-left transition-colors ${
        canOpen ? "cursor-pointer hover:bg-[#073D31]/[0.03]" : "cursor-not-allowed opacity-50"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          isComplete
            ? "bg-emerald-600 text-white"
            : isOpen
              ? "bg-[#073D31] text-[#F7F4ED]"
              : "bg-[#073D31]/8 text-[#073D31]"
        }`}
      >
        {isComplete ? (
          <Check size={18} weight="bold" />
        ) : (
          <StepIcon size={18} weight={isOpen ? "fill" : "regular"} />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-sans text-sm font-bold text-[#18211E]">{step.title}</span>
        <span className="block truncate font-sans text-[11px] text-[#76766F]">{step.subtitle}</span>
      </span>

      <span className="shrink-0 font-sans text-[10px] font-bold uppercase tracking-wider text-[#C8A45E]">
        {isComplete ? "Done" : isOpen ? "Editing" : `${String(step.id).padStart(2, "0")}`}
      </span>

      <CaretDown
        size={16}
        weight="bold"
        className={`shrink-0 text-[#76766F] transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
}

export function CustomizerStepAccordion({
  step,
  isOpen,
  isComplete,
  canOpen,
  onToggle,
  children,
  sectionId,
}: CustomizerStepAccordionProps) {
  if (!isOpen) {
    return (
      <section
        id={sectionId}
        className="scroll-mt-3 overflow-hidden rounded-xl border border-[#073D31]/8 bg-white/90 shadow-sm"
      >
        <AccordionHeader
          step={step}
          isOpen={false}
          isComplete={isComplete}
          canOpen={canOpen}
          onToggle={onToggle}
        />
      </section>
    );
  }

  return (
    <section
      id={sectionId}
      className="scroll-mt-3 overflow-hidden rounded-xl border border-[#073D31]/15 bg-white shadow-sm"
    >
      <AccordionHeader
        step={step}
        isOpen
        isComplete={isComplete}
        canOpen={canOpen}
        onToggle={onToggle}
      />
      <div className="min-w-0 overflow-x-hidden border-t border-[#073D31]/8 px-2 pb-2 pt-1 sm:px-3">
        {children}
      </div>
    </section>
  );
}
