"use client";

import Link from "next/link";
import { ArrowRight, DownloadSimple, PencilSimpleLine } from "@phosphor-icons/react";

interface ReelActionBarProps {
  customizeHref: string;
  downloadHref?: string;
  downloadAvailable: boolean;
}

export function ReelActionBar({
  customizeHref,
  downloadHref,
  downloadAvailable,
}: ReelActionBarProps) {
  return (
    <div className="flex flex-col gap-2 border-t border-[#073D31]/10 bg-[#FCFBF7]/95 px-4 py-3 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <Link
        href={customizeHref}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#073D31] px-4 text-xs font-bold uppercase tracking-wider text-[#F7F4ED] transition-colors hover:bg-[#032A23]"
      >
        <PencilSimpleLine size={16} weight="bold" className="text-[#E1C98E]" />
        Edit reel content
      </Link>

      {downloadAvailable && downloadHref ? (
        <a
          href={downloadHref}
          download
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[#C8A45E]/50 bg-[#C8A45E]/15 px-4 text-xs font-bold uppercase tracking-wider text-[#073D31]"
        >
          <DownloadSimple size={16} weight="bold" />
          Download reel video
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="flex min-h-[44px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-stone-200 bg-stone-100 px-4 text-xs font-semibold uppercase tracking-wider text-stone-400"
          title="Generate locally with HyperFrames render"
        >
          <DownloadSimple size={16} weight="bold" />
          Download — coming soon
        </button>
      )}

      <Link
        href="/reels"
        className="flex min-h-[44px] items-center justify-center gap-1 text-xs font-semibold text-[#76766F] hover:text-[#073D31]"
      >
        All reels
        <ArrowRight size={14} weight="bold" />
      </Link>
    </div>
  );
}
