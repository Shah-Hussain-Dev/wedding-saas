"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, X } from "@phosphor-icons/react";
import {
  RELIGION_FILTER_TABS,
  filterTemplateIdsByReligion,
  getTemplateMeta,
  religionKeyFromFaith,
  type ReligionKey,
  type TemplateId,
} from "@/lib/template-meta";
import type { CulturalTradition } from "@/lib/pdf-theme-tokens";
import { useTemplatePricing } from "@/lib/hooks/use-template-pricing";
import { useTemplateCatalog } from "@/lib/hooks/use-template-catalog";
import { PriceText } from "@/components/ui/price-text";

const TEMPLATE_ORDER: TemplateId[] = [
  "kitab-e-nikah",
  "noor-e-nikah",
  "emerald-qasr",
  "gul-e-noor",
  "azure-nikah",
  "crimson-royale",
  "royal-lotus",
  "royal-majesty",
  "royal-elegance",
  "royal-heritage",
  "royal-grace",
  "imperial-palace",
  "celestial-rose",
  "rose-gold-blush",
  "emerald-noir",
  "modern-minimal",
];

interface CustomizerTemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateId: string;
  onSelectTemplate: (templateId: TemplateId) => void;
  /** Couple faith from the editor — sets the default religion tab when the modal opens. */
  activeReligion?: CulturalTradition;
}

export function CustomizerTemplatePickerModal({
  isOpen,
  onClose,
  currentTemplateId,
  onSelectTemplate,
  activeReligion = "universal",
}: CustomizerTemplatePickerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [religionTab, setReligionTab] = useState<ReligionKey>("all");
  const { getPriceFormatted } = useTemplatePricing();
  const { getCoverUrl } = useTemplateCatalog();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    let tab = religionKeyFromFaith(activeReligion);
    const currentMeta = getTemplateMeta(currentTemplateId);
    if (tab !== "all") {
      const inTab = filterTemplateIdsByReligion(TEMPLATE_ORDER, tab).some(
        (t) => t.id === currentTemplateId
      );
      if (!inTab) {
        if (currentMeta.religion.includes("muslim")) tab = "muslim";
        else if (currentMeta.religion.includes("hindu")) tab = "hindu";
        else tab = "all";
      }
    }
    setReligionTab(tab);
  }, [isOpen, activeReligion, currentTemplateId]);

  const templates = useMemo(
    () => filterTemplateIdsByReligion(TEMPLATE_ORDER, religionTab),
    [religionTab]
  );

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[420] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[min(92dvh,720px)] w-full max-w-3xl flex-col rounded-t-2xl border border-[#073D31]/10 bg-[#FCFBF7] shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-picker-title"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#073D31]/8 px-4 py-4 sm:px-5">
          <div>
            <h2 id="template-picker-title" className="font-serif text-xl font-medium text-[#18211E]">
              Change template
            </h2>
            <p className="mt-1 font-sans text-xs text-[#76766F]">
              Your names, dates, and details stay saved when you switch designs.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#76766F] hover:bg-[#073D31]/5"
            aria-label="Close"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <div
          className="flex shrink-0 gap-2 overflow-x-auto overscroll-x-contain border-b border-[#073D31]/8 px-4 py-3 sm:px-5"
          role="tablist"
          aria-label="Filter templates by tradition"
        >
          {RELIGION_FILTER_TABS.map((tab) => {
            const isTabActive = religionTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isTabActive}
                onClick={() => setReligionTab(tab.id)}
                className={`flex min-h-[44px] shrink-0 items-center rounded-full px-4 font-sans text-xs font-semibold tracking-wide transition-all ${
                  isTabActive
                    ? "border border-[#C8A45E]/40 bg-[#073D31] text-[#F7F4ED] shadow-sm"
                    : "border border-[#073D31]/10 bg-white text-[#76766F] hover:border-[#073D31]/20 hover:text-[#18211E]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-4 sm:px-5">
          {templates.length === 0 ? (
            <p className="py-8 text-center font-sans text-sm text-[#76766F]">
              No templates in this category yet. Try another tab.
            </p>
          ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {templates.map((tpl) => {
              const isActive = tpl.id === currentTemplateId;
              const poster = getCoverUrl(tpl.id);
              const price = getPriceFormatted(tpl.id, "₹1,199");

              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => onSelectTemplate(tpl.id)}
                  className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all ${
                    isActive
                      ? "border-[#C8A45E] ring-2 ring-[#C8A45E]/35"
                      : "border-[#073D31]/10 hover:border-[#073D31]/25"
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full bg-[#073D31]/5">
                    <Image
                      src={poster}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 45vw, 200px"
                    />
                    {isActive ? (
                      <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#073D31] px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wide text-[#F7F4ED]">
                        <Check size={12} weight="bold" className="text-[#C8A45E]" />
                        Current
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 p-2.5">
                    <span className="line-clamp-2 font-sans text-[11px] font-bold leading-snug text-[#18211E]">
                      {tpl.name}
                    </span>
                    <span className="line-clamp-1 font-sans text-[10px] text-[#76766F]">{tpl.style}</span>
                    <PriceText className="mt-1 font-sans text-[10px] font-semibold text-[#8B6914]">
                      {price}
                    </PriceText>
                  </div>
                </button>
              );
            })}
          </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
