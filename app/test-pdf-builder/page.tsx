"use client";

import React, { useState } from "react";
import Link from "next/link";
import WeddingInvitationBuilder from "@/pdf/WeddingInvitationBuilder";
import {
  ArrowLeft,
  FilePdf,
  Info,
  Sparkle,
  Printer,
  CheckCircle,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";

export default function TestPdfBuilderPage() {
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F7FA] text-stone-900 flex flex-col">
      {/* Top Test Banner / Navigation Bar (Hidden during print) */}
      <header className="print:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-2.5 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Branding & Back Navigation */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/templates"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              <ArrowLeft size={14} weight="bold" />
              <span>Back to Admin</span>
            </Link>

            <div className="h-4 w-px bg-stone-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-amber-500/10 text-amber-700">
                <FilePdf size={18} weight="fill" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-stone-900 tracking-tight">
                    Universal PDF Invitation Studio
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    21 Styles · All Faiths
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 hidden md:block">
                  Universal &amp; cultural A5 portrait invitations with 18 luxury palettes, 12 vector frames, and auto-fit
                </p>
              </div>
            </div>
          </div>

          {/* Right: Info / Print Tips toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200/80 transition-colors"
            >
              <Info size={15} weight="bold" className="text-amber-600" />
              <span>Print &amp; PDF Tips</span>
              {showTips ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />}
            </button>

            <Link
              href="/"
              className="text-xs font-medium text-stone-500 hover:text-stone-800 px-2 py-1 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>

        {/* Collapsible Tips Drawer */}
        {showTips && (
          <div className="max-w-7xl mx-auto mt-2.5 p-3 sm:p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 transition-all">
            <div className="flex items-start gap-2.5">
              <Sparkle size={18} weight="fill" className="text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">How to test and export the PDF invitation:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-stone-700">
                  <li>
                    <strong>Customize:</strong> Switch templates across Hindu, Muslim, Christian, Sikh, or Interfaith traditions, edit ceremony times, families, and color themes in the left sidebar.
                  </li>
                  <li>
                    <strong>Auto-Fit:</strong> Notice how the live A5 stage dynamically fits long family lists and itinerary items without overflowing page margins.
                  </li>
                  <li>
                    <strong>Export to PDF:</strong> Click the <span className="font-semibold text-stone-900">“Save as PDF”</span> button in the top-right toolbar.
                  </li>
                  <li>
                    <strong>Print Dialog Settings:</strong> In the browser dialog, set Destination to <span className="font-semibold text-stone-900">“Save as PDF”</span>, Paper Size to <span className="font-semibold text-stone-900">“A5”</span>, and Margins to <span className="font-semibold text-stone-900">“None”</span> (or “Default”) with “Background graphics” checked.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Builder Container */}
      <main className="flex-1 w-full overflow-hidden">
        <WeddingInvitationBuilder />
      </main>
    </div>
  );
}
