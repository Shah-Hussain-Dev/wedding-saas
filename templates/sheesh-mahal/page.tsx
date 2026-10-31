"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import defaultData from "./data.json";
import { SheeshMahalProps, SheeshMahalData } from "./types";
import "./style.css";

// 9 Modular Section Components
import EntranceGate from "./components/EntranceGate";
import AudioDock from "./components/AudioDock";
import HeroHall from "./components/HeroHall";
import LetterCasket from "./components/LetterCasket";
import FamilyLamps from "./components/FamilyLamps";
import EventWindows from "./components/EventWindows";
import AstrolabeCountdown from "./components/AstrolabeCountdown";
import BangleRsvp from "./components/BangleRsvp";
import ReflectingPool from "./components/ReflectingPool";
import { TemplateMarketingFooter } from "@/components/invitation/TemplateMarketingFooter";

/**
 * Robust deep merge helper to overlay incoming customized user data
 * over canonical fallback template data without losing nested structure.
 */
function deepMergeData(fallback: any, incoming: any): any {
  if (!incoming) return { ...fallback };
  const result = { ...fallback };
  for (const key of Object.keys(incoming)) {
    if (
      incoming[key] &&
      typeof incoming[key] === "object" &&
      !Array.isArray(incoming[key])
    ) {
      result[key] = deepMergeData(fallback[key] || {}, incoming[key]);
    } else if (incoming[key] !== undefined) {
      result[key] = incoming[key];
    }
  }
  return result;
}

/**
 * Sanitizes query string guest personalization against XSS
 */
function sanitizeGuestParam(input?: string | null): string {
  if (!input) return "Family & Friends";
  let cleaned = String(input).trim();
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, "");
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, "");
  cleaned = cleaned.replace(/<[^>]*>?/gm, "");
  cleaned = cleaned.replace(/["'<>]/g, "");
  if (cleaned.length > 60) {
    cleaned = cleaned.slice(0, 60).trim();
  }
  return cleaned.length > 0 ? cleaned : "Family & Friends";
}

export default function SheeshMahal({ data }: SheeshMahalProps) {
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [gateCycle, setGateCycle] = useState(0);
  const [urlGuestName, setUrlGuestName] = useState("Family & Friends");

  // Read guest from URL query parameter (?to= or ?g=)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const to = params.get("to") || params.get("g");
      if (to) {
        setUrlGuestName(sanitizeGuestParam(to));
      }
    }
  }, []);

  // Deep-merge incoming customized props over canonical fallback dataset
  const resolvedData: SheeshMahalData = useMemo(() => {
    return deepMergeData(defaultData, data);
  }, [data]);

  const brideName =
    resolvedData.brideName ||
    resolvedData.couple?.brideName ||
    "Anaya";
  const groomName =
    resolvedData.groomName ||
    resolvedData.couple?.groomName ||
    "Zain";

  const guestName = data?.guestName
    ? sanitizeGuestParam(data.guestName)
    : urlGuestName;

  // Resolve countdown target date from Baraat reception event or weddingDate
  const countdownTarget = useMemo(() => {
    const events = resolvedData.events || resolvedData.eventsJson || [];
    const baraat = events.find((e: any) => e.id === "baraat");
    return baraat?.isoTarget || resolvedData.weddingDate || "2026-12-12T20:00:00+05:00";
  }, [resolvedData]);

  // Entrance gate opening handler
  const handleOpenGate = useCallback(() => {
    setIsGateOpen(true);
  }, []);

  // Invitation replay handler: scrolls to top and re-engages the gate
  const handleReplay = useCallback(() => {
    setIsGateOpen(false);
    setGateCycle((prev) => prev + 1);
    if (typeof window !== "undefined") {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        window.scrollTo(0, 0);
      }
    }
  }, []);

  return (
    <main className="sheesh-mahal-root relative w-full min-h-[100dvh] flex flex-col bg-[#05140e] text-[#f5efe2]">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 01: 3D ENTRANCE GATE & MIRRORED DOORS (#gate)
          Starts locked in is-shut state; opens upon medallion trigger
          ───────────────────────────────────────────────────────────── */}
      <EntranceGate
        key={gateCycle}
        onOpen={handleOpenGate}
        isOpen={isGateOpen}
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 02: FLOATING AUDIO DOCK & SOUNDTRACK MANAGER
          Floating toggle in safe zone (>= 44x44px touch target)
          ───────────────────────────────────────────────────────────── */}
      <AudioDock
        audioSrc={resolvedData.musicTrack || "/templates/sheesh-mahal/audio/music.mp3"}
        isGateOpen={isGateOpen}
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 03: HERO PALACE HALL & SACRED ARCH APEX (#hero)
          Features Bismillah calligraphy, Alex Brush script names,
          60fps mirror reflection canvas, and guaranteed facial clearance
          ───────────────────────────────────────────────────────────── */}
      <HeroHall data={resolvedData} />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 04: VELVET LETTER CASKET & ROYAL SHEET (#letter)
          3D hinged casket lid, unfolding three-panel parchment,
          Surah Ar-Rum 30:21, personalized guest greeting, wax seal
          ───────────────────────────────────────────────────────────── */}
      <LetterCasket data={resolvedData} guestName={guestName} />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 05: FAMILY HANGING LAMPS & CONFLUENCE (#families)
          Dual brass lanterns for Siddiqui and Chaudhry families,
          lighting micro-interaction, SVG golden confluence threads
          ───────────────────────────────────────────────────────────── */}
      <FamilyLamps data={resolvedData} />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 06: MUGHAL JHAROKHA EVENT WINDOWS (#events)
          4 festive window cards (Mehndi, Nikah, Baraat, Walima)
          with 3D opening wooden shutters, directions, and .ics export
          ───────────────────────────────────────────────────────────── */}
      <EventWindows
        events={resolvedData.events || resolvedData.eventsJson}
        couple={{ brideName, groomName }}
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 07: CELESTIAL ASTROLABE COUNTDOWN (#countdown)
          Touch/mouse angular rotation dial with calendar rings,
          wedding date snap lock chime, 2D canvas flip-tile countdown
          ───────────────────────────────────────────────────────────── */}
      <AstrolabeCountdown targetDate={countdownTarget} />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 08: ROYAL POSTAL DESK BANGLE RSVP (#rsvp)
          Bangle attendance toggle switches, party size stepper,
          paper-roll and carrier dove flight submission animation
          ───────────────────────────────────────────────────────────── */}
      <BangleRsvp
        events={resolvedData.events || resolvedData.eventsJson}
        deadlineDate={resolvedData.rsvpDeadline || "2026-12-13T23:30:00+05:00"}
        guestNameDefault={guestName}
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 09: MIDNIGHT REFLECTING POOL & REPLAY (#closing)
          Floating brass diyas spawned on water click with ripple physics,
          sacred Baraka Allahu Lakuma closing dua, and replay CTA
          ───────────────────────────────────────────────────────────── */}
      <ReflectingPool
        sacred={resolvedData.sacred}
        onReplay={handleReplay}
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 10: ATELIER MARKETING FOOTER
          Platform template showcase and branding footer
          ───────────────────────────────────────────────────────────── */}
      <TemplateMarketingFooter templateId="sheesh-mahal" />
    </main>
  );
}
