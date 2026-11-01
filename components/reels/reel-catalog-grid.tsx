"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Sparkle, FilmStrip } from "@phosphor-icons/react";
import type { TemplateReelDefinition } from "@/config/template-reels";
import { ReelPhoneMockup } from "@/components/reels/reel-phone-mockup";
import { ReelPreviewModal } from "@/components/reels/reel-preview-modal";

interface ReelCatalogGridProps {
  published: TemplateReelDefinition[];
  comingSoonNames?: string[];
}

export function ReelCatalogGrid({ published, comingSoonNames = [] }: ReelCatalogGridProps) {
  const router = useRouter();
  const [previewReel, setPreviewReel] = useState<TemplateReelDefinition | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-2xl mx-auto">
        {published.map((reel) => {
          const poster = reel.posterUrl ?? "/images/hero-bg.png";
          return (
            <article
              key={reel.templateId}
              className="flex flex-col items-center gap-3"
            >
              <button
                type="button"
                onClick={() => router.push(`/reels/${reel.templateId}`)}
                className="group w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#073D31]"
              >
                <ReelPhoneMockup label={`${reel.name} reel`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={poster}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-[center_28%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  <div className="absolute inset-x-0 top-10 flex justify-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#E1C98E]">
                      <FilmStrip size={10} weight="fill" />
                      Video preview
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 z-10">
                    {reel.tag ? (
                      <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#E1C98E]">
                        <Sparkle size={10} weight="fill" />
                        {reel.tag}
                      </span>
                    ) : null}
                    <h2 className="font-serif text-base font-semibold text-white group-hover:text-[#E1C98E] transition-colors">
                      {reel.name}
                    </h2>
                    <p className="mt-0.5 text-[11px] text-stone-300 line-clamp-2">{reel.tagline}</p>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-[#C8A45E]">
                      Tap to watch · customize like a template
                    </p>
                  </div>
                </ReelPhoneMockup>
              </button>

              <button
                type="button"
                onClick={() => setPreviewReel(reel)}
                className="flex min-h-[44px] w-full max-w-[280px] items-center justify-center gap-2 rounded-full border border-[#073D31]/15 bg-white text-xs font-bold uppercase tracking-wider text-[#073D31] hover:border-[#C8A45E]/50 hover:bg-[#F7F4ED]"
              >
                <Eye size={16} weight="bold" />
                Quick preview
              </button>
            </article>
          );
        })}

        {comingSoonNames.map((name) => (
          <div
            key={name}
            className="flex flex-col items-center gap-2 opacity-70"
            aria-hidden
          >
            <ReelPhoneMockup poster="/templates/rose-gold-blush/palace-arch.jpg" label={name}>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#EFE9DD]/90 p-4 text-center">
                <Sparkle size={24} className="text-[#C8A45E]/60 mb-2" weight="fill" />
                <p className="font-serif text-sm text-[#76766F]">{name}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#C8A45E] mt-1">Coming soon</p>
              </div>
            </ReelPhoneMockup>
          </div>
        ))}
      </div>

      <ReelPreviewModal reel={previewReel} onClose={() => setPreviewReel(null)} />
    </>
  );
}
