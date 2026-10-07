"use client";

import { use, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sliders, ArrowLeft, CreditCard } from "@phosphor-icons/react";
import { TEMPLATES_MAP, getTemplateDefaultData, NoorNikah } from "@/templates";

interface InteractivePreviewProps {
  templateId: string;
}

const ALL_16_TEMPLATES = [
  "celestial-rose",
  "imperial-palace",
  "royal-majesty",
  "royal-heritage",
  "royal-grace",
  "rose-gold-blush",
  "noor-e-nikah",
  "emerald-qasr",
  "gul-e-noor",
  "azure-nikah",
  "kitab-e-nikah",
  "crimson-royale",
  "royal-lotus",
  "emerald-noir",
  "royal-elegance",
  "modern-minimal",
];

function InteractivePreviewInner({ templateId }: InteractivePreviewProps) {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get("embed") === "1";

  // Normalize underscores to hyphens
  const normalizedId = (templateId || "").trim().replace(/_/g, "-").toLowerCase();

  const templateDefault = getTemplateDefaultData(normalizedId);
  const defaultBride =
    templateDefault?.brideName ||
    templateDefault?.couple?.brideName ||
    (normalizedId.includes("nikah") || normalizedId.includes("emerald") || normalizedId.includes("gul") ? "Diya" : "Ananya");
  const defaultGroom =
    templateDefault?.groomName ||
    templateDefault?.couple?.groomName ||
    (normalizedId.includes("nikah") || normalizedId.includes("emerald") || normalizedId.includes("gul") ? "Shaan" : "Shubham");

  const [brideName, setBrideName] = useState(defaultBride);
  const [groomName, setGroomName] = useState(defaultGroom);
  const [isOpenPanel, setIsOpenPanel] = useState(!isEmbed);

  const SelectedTemplate = TEMPLATES_MAP[normalizedId] || NoorNikah;
  const sampleData = {
    ...templateDefault,
    templateId: normalizedId,
    brideName: brideName || defaultBride,
    groomName: groomName || defaultGroom,
    couple: {
      ...templateDefault?.couple,
      brideName: brideName || defaultBride,
      groomName: groomName || defaultGroom,
    },
  };

  return (
    <div className={`relative min-h-[100dvh] bg-[#380D17] overflow-x-hidden ${isEmbed ? "overflow-y-auto" : ""}`}>
      {/* Self-contained template render */}
      <SelectedTemplate data={sampleData} />

      {!isEmbed && (
        <>
          <div
            className={`fixed bottom-6 left-6 z-50 transition-all duration-300 max-w-sm w-[90%] md:w-80 ${
              isOpenPanel ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
            }`}
          >
            <div className="bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-white shadow-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Sliders className="h-4 w-4" weight="bold" />
                  <span className="text-xs uppercase font-bold tracking-widest">Sandbox</span>
                </div>
                <button onClick={() => setIsOpenPanel(false)} className="text-[10px] text-white/50 hover:text-white uppercase font-bold cursor-pointer">
                  Hide
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-white/40 font-bold mb-1">Bride</label>
                  <input
                    type="text"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-400 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-white/40 font-bold mb-1">Groom</label>
                  <input
                    type="text"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-400 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {ALL_16_TEMPLATES.map((id) => (
                    <Link href={`/preview/${id}/interactive`} key={id}>
                      <button
                        className={`w-full py-1 text-[8px] uppercase font-bold rounded cursor-pointer ${
                          normalizedId === id ? "bg-amber-400 text-black" : "bg-white/5 text-white/80 hover:bg-white/10"
                        }`}
                      >
                        {id.replace(/-/g, " ")}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Link href={`/preview/${normalizedId}`} className="flex-1">
                  <button className="w-full border border-white/20 text-white text-xs font-semibold py-2.5 rounded-full flex items-center justify-center gap-1 cursor-pointer hover:bg-white/5">
                    <ArrowLeft className="h-3 w-3" /> Demo page
                  </button>
                </Link>
                <Link href={`/customize/${normalizedId}`} className="flex-1">
                  <button className="w-full bg-amber-400 text-black text-xs font-bold py-2.5 rounded-full flex items-center justify-center gap-1 cursor-pointer hover:bg-amber-300">
                    <CreditCard className="h-3 w-3" /> Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {!isOpenPanel && (
            <button
              onClick={() => setIsOpenPanel(true)}
              className="fixed bottom-6 left-6 z-50 bg-[#073D31] border border-[#C8A45E]/40 text-white p-3 rounded-full shadow-2xl flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer"
            >
              <Sliders className="h-4 w-4 text-[#C8A45E]" weight="bold" />
              <span className="text-[10px] font-bold tracking-widest uppercase pr-1">Customize</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default function InteractivePreviewPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = use(params);

  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-900" />}>
      <InteractivePreviewInner templateId={templateId} />
    </Suspense>
  );
}
