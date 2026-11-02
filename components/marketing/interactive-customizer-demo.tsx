"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Sparkle, ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { defaultCulturalTraditionForTemplate } from "@/lib/template-meta";
import { TemplatePreviewMockup } from "@/components/marketing/template-preview-mockup";

interface ThemePreset {
  id: string;
  name: string;
  tagline: string;
  religionLabel: string;
  bgImage: string;
  gradientOverlay: string;
  accentGold: string;
  ambientGlow: string;
  musicTrack: string;
  venueDefault: string;
  badge: string;
}

/** Landing studio: 2 Muslim, 2 Hindu, 1 universal — tradition locked per template. */
const LANDING_STUDIO_TEMPLATES: ThemePreset[] = [
  {
    id: "noor-e-nikah",
    name: "Noor-e-Nikah",
    tagline: "3D Embossed Floral Envelope & Gold Arch",
    religionLabel: "Muslim",
    bgImage: "/templates/noor-e-nikah/envelope-bg.jpg",
    gradientOverlay: "from-[#07241d]/90 via-[#0d3b30]/65 to-[#041612]/95",
    accentGold: "#C8A45E",
    ambientGlow: "rgba(200, 164, 94, 0.45)",
    musicTrack: "Ottoman Oud & Acoustic Serenade",
    venueDefault: "Emirates Palace Grand Ballroom, Abu Dhabi",
    badge: "Sacred Nikah",
  },
  {
    id: "emerald-qasr",
    name: "Emerald Qasr",
    tagline: "Ottoman Royale & Emerald Velvet",
    religionLabel: "Muslim",
    bgImage: "/templates/emerald-qasr/envelope-desktop.jpg",
    gradientOverlay: "from-[#0F382E]/92 via-[#1a5244]/70 to-[#082820]/95",
    accentGold: "#C8A45E",
    ambientGlow: "rgba(15, 56, 46, 0.45)",
    musicTrack: "Imperial Royal String Quartet",
    venueDefault: "The Grand Qasr, Istanbul",
    badge: "Cinematic Nikah",
  },
  {
    id: "crimson-royale",
    name: "Crimson Royale",
    tagline: "Velvet Doors & Marigold Courtyard",
    religionLabel: "Hindu",
    bgImage: "/templates/crimson-royale/bg-welcome-desktop.jpg",
    gradientOverlay: "from-[#4a0a0a]/90 via-[#6b1515]/65 to-[#2d0505]/95",
    accentGold: "#E1C98E",
    ambientGlow: "rgba(200, 100, 60, 0.35)",
    musicTrack: "Royal Shehnai & Tabla",
    venueDefault: "The Grand Umaid Bhawan, Jodhpur",
    badge: "Hindu Heritage",
  },
  {
    id: "royal-lotus",
    name: "Royal Lotus",
    tagline: "Rajasthani Haveli & Ivory Gold",
    religionLabel: "Hindu",
    bgImage: "/templates/imperial-palace/ballroom.jpg",
    gradientOverlay: "from-[#2b080c]/90 via-[#3d0f14]/65 to-[#1a0507]/95",
    accentGold: "#C8A45E",
    ambientGlow: "rgba(184, 151, 115, 0.4)",
    musicTrack: "Viennese Waltz in D Major",
    venueDefault: "The Taj Lake Palace, Udaipur",
    badge: "Auspicious Vivah",
  },
  {
    id: "celestial-rose",
    name: "Celestial Rose",
    tagline: "Starlight Terrace & Ethereal Dreamscape",
    religionLabel: "Universal",
    bgImage: "/templates/imperial-palace/art-gallery.jpg",
    gradientOverlay: "from-[#0d1b2a]/90 via-[#1b263b]/70 to-[#0d1b2a]/95",
    accentGold: "#E1C98E",
    ambientGlow: "rgba(88, 152, 184, 0.35)",
    musicTrack: "Celestial Starlight Harp Score",
    venueDefault: "The Starlight Observatory, Lake Como",
    badge: "Awwwards 3D",
  },
];

export function InteractiveCustomizerDemo() {
  const [groomName, setGroomName] = useState("Rohan");
  const [brideName, setBrideName] = useState("Pooja");
  const [weddingDate, setWeddingDate] = useState("November 28, 2026");
  const [weddingVenue, setWeddingVenue] = useState("The Taj Lake Palace, Udaipur");
  const [selectedPreset, setSelectedPreset] = useState<ThemePreset>(LANDING_STUDIO_TEMPLATES[3]);
  const [previewLoaded, setPreviewLoaded] = useState(false);

  const previewFaith = useMemo(
    () => defaultCulturalTraditionForTemplate(selectedPreset.id),
    [selectedPreset.id]
  );

  const interactivePreviewSrc = useMemo(
    () => `/preview/${selectedPreset.id}/interactive?embed=1&faith=${previewFaith}`,
    [selectedPreset.id, previewFaith]
  );

  useEffect(() => {
    setPreviewLoaded(false);
  }, [interactivePreviewSrc]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("unfold_active_invitations");
      if (stored) {
        const list = JSON.parse(stored);
        if (list && list.length > 0 && list[0]?.brideName && list[0]?.groomName) {
          setGroomName(list[0].groomName);
          setBrideName(list[0].brideName);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const groomInitial = (groomName.trim()[0] || "R").toUpperCase();
  const brideInitial = (brideName.trim()[0] || "P").toUpperCase();

  const handlePresetSelect = (preset: ThemePreset) => {
    setSelectedPreset(preset);
    setWeddingVenue(preset.venueDefault);
  };

  return (
    <section className="py-20 sm:py-28 md:py-32 bg-[#F7F4ED] border-y border-[#073D31]/10 relative overflow-hidden transition-colors duration-1000 select-none">
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none opacity-40 transition-all duration-1000"
        style={{ backgroundColor: selectedPreset.ambientGlow }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#C8A45E_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.12] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#073D31]/12 shadow-xs text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#073D31] font-bold font-sans backdrop-blur-md">
            <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
            <span>Live Interactive Studio</span>
            <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#18211E]">
            Watch your story transform in real time.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#76766F] font-sans leading-relaxed">
            Type your names, pick a template (Nikah, Vivah, or universal), and watch the preview update
            instantly — each design keeps its own sacred wording.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-[28px] bg-white/90 border border-[#073D31]/15 shadow-[0_20px_50px_rgba(7,61,49,0.08)] backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#073D31]/10">
              <div>
                <span className="text-[9.5px] font-bold tracking-widest text-[#C8A45E] uppercase font-sans">
                  Studio Configurator
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#073D31]">
                  Personalize Live Card
                </h3>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#073D31] text-[#E1C98E] font-serif text-xs font-bold flex items-center justify-center border border-[#C8A45E]/40 shadow-xs">
                {groomInitial}&amp;{brideInitial}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans">
                  Groom&apos;s Name
                </label>
                <input
                  type="text"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  placeholder="Groom"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-50/80 border border-stone-200 text-xs font-semibold text-[#18211E] outline-none focus:border-[#C8A45E] focus:bg-white focus:ring-2 focus:ring-[#C8A45E]/20 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans">
                  Bride&apos;s Name
                </label>
                <input
                  type="text"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  placeholder="Bride"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-50/80 border border-stone-200 text-xs font-semibold text-[#18211E] outline-none focus:border-[#C8A45E] focus:bg-white focus:ring-2 focus:ring-[#C8A45E]/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans">
                  Wedding Date
                </label>
                <input
                  type="text"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-50/80 border border-stone-200 text-xs font-semibold text-[#18211E] outline-none focus:border-[#C8A45E] focus:bg-white focus:ring-2 focus:ring-[#C8A45E]/20 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans">
                  Palace / Venue Destination
                </label>
                <input
                  type="text"
                  value={weddingVenue}
                  onChange={(e) => setWeddingVenue(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-50/80 border border-stone-200 text-xs font-semibold text-[#18211E] outline-none focus:border-[#C8A45E] focus:bg-white focus:ring-2 focus:ring-[#C8A45E]/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#76766F] font-sans">
                Choose a template
              </label>
              <p className="text-[10px] text-[#76766F] font-sans leading-snug">
                Sacred invocations match each design (Muslim Nikah, Hindu Vivah, or universal).
              </p>
              <div className="grid grid-cols-2 gap-2">
                {LANDING_STUDIO_TEMPLATES.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  const tradition = defaultCulturalTraditionForTemplate(preset.id);
                  const label =
                    tradition === "muslim" ? "Muslim" : tradition === "hindu" ? "Hindu" : "Universal";
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`min-h-[44px] p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between gap-1 ${
                        isSelected
                          ? "bg-[#073D31] text-[#F7F4ED] border-[#C8A45E]/70 shadow-md scale-[1.02]"
                          : "bg-stone-50/70 hover:bg-stone-100/90 text-stone-700 border-stone-200/80"
                      } ${preset.id === "celestial-rose" ? "col-span-2 sm:col-span-1" : ""}`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold font-serif leading-tight">{preset.name}</span>
                        {isSelected && (
                          <CheckCircle size={13} weight="fill" className="text-[#E1C98E] shrink-0" />
                        )}
                      </div>
                      <span
                        className={`text-[9px] font-sans truncate ${isSelected ? "text-stone-300" : "text-stone-500"}`}
                      >
                        {label} · {preset.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 space-y-2 text-center">
              <Link
                href={`/customize/${selectedPreset.id}`}
                className="group w-full min-h-[48px] py-3.5 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs font-bold tracking-wider uppercase font-sans flex items-center justify-center gap-2 transition-all shadow-[0_10px_25px_rgba(7,61,49,0.25)] hover:shadow-[0_15px_35px_rgba(7,61,49,0.38)] cursor-pointer"
              >
                <span className="roll">
                  <span className="roll__a">Customize This Design Free</span>
                  <span className="roll__b" aria-hidden="true">
                    Customize This Design Free
                  </span>
                </span>
                <ArrowRight
                  size={13}
                  weight="bold"
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <p className="text-[10.5px] text-[#76766F] font-sans">
                ✨ Free live sandbox · Zero payment required to customize
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col items-center gap-3">
            <TemplatePreviewMockup
              variant="phone"
              phoneSize="hero"
              src={interactivePreviewSrc}
              title={`${selectedPreset.name} live interactive preview`}
              loaded={previewLoaded}
              onLoad={() => setPreviewLoaded(true)}
            />
            <p className="max-w-xs text-center font-sans text-[10px] font-bold uppercase tracking-wider text-[#76766F]">
              Tap inside to open the invitation · scroll to explore · stays on this page
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
