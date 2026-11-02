"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { TemplatePreviewMockup } from "@/components/marketing/template-preview-mockup";
import { getDefaultFaithForTemplate } from "@/lib/preview-faith-content";

interface TemplateDetailsLivePreviewProps {
  templateId: string;
  templateName: string;
  interactiveUrl: string;
}

export function TemplateDetailsLivePreview({
  templateId,
  templateName,
  interactiveUrl,
}: TemplateDetailsLivePreviewProps) {
  const [phoneLoaded, setPhoneLoaded] = useState(false);
  const [tabletLoaded, setTabletLoaded] = useState(false);
  const defaultFaith = getDefaultFaithForTemplate(templateId);
  const fullPreviewHref = `/preview/${templateId}/interactive?embed=1&faith=${defaultFaith}`;

  return (
    <section id="live-preview" className="border-t border-[#073D31]/8 bg-[#F7F4ED] py-10 sm:py-12">
      <div className="page-container">
        <div className="mx-auto mb-5 max-w-2xl text-center sm:mb-6">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#C8A45E]">
            Live preview
          </p>
          <h2 className="mt-2 font-serif text-2xl font-medium text-[#18211E] sm:text-3xl md:text-4xl">
            See it live before you choose
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[#76766F]">
            This is a real {templateName} experience with sample names and dates. Tap inside the frame to
            open doors, scroll sections, and hear the soundtrack.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#073D31]/10 bg-white shadow-[0_12px_40px_rgba(7,61,49,0.06)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#073D31]/8 px-3 py-2.5 sm:px-4">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#073D31]">
              Live preview
            </span>
            <Link
              href={fullPreviewHref}
              className="inline-flex min-h-[44px] items-center gap-1.5 font-sans text-xs font-semibold text-[#073D31] transition-colors hover:text-[#C8A45E]"
            >
              Open full preview
              <ArrowUpRight size={14} weight="bold" />
            </Link>
          </div>

          <div className="bg-[#FCFAF6] px-2 py-4 sm:px-4 sm:py-5">
            <div className="lg:hidden">
              <TemplatePreviewMockup
                variant="phone"
                loaded={phoneLoaded}
                onLoad={() => setPhoneLoaded(true)}
                src={interactiveUrl}
                title={`${templateName} mobile preview`}
              />
            </div>
            <div className="hidden lg:block">
              <TemplatePreviewMockup
                variant="tablet"
                loaded={tabletLoaded}
                onLoad={() => setTabletLoaded(true)}
                src={interactiveUrl}
                title={`${templateName} tablet preview`}
              />
            </div>
            <p className="mt-3 text-center font-sans text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Tap inside to interact · scroll to explore
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
