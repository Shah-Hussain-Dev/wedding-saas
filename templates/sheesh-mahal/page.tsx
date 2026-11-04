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
 * Safely resolves platform audio track identifiers or URLs
 */
function resolveAudioTrack(track?: string | null): string {
  if (!track || track === "track1" || track === "track2" || track === "track3" || track === "default" || track.trim() === "") {
    return "/templates/sheesh-mahal/audio/music.mp3";
  }
  if (track.startsWith("/") || track.startsWith("http://") || track.startsWith("https://") || track.startsWith("blob:")) {
    return track;
  }
  return `/audio/${track}.mp3`;
}

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
    const merged = deepMergeData(defaultData, data);

    const bName =
      data?.brideName ||
      data?.couple?.brideName ||
      merged.brideName ||
      merged.couple?.brideName ||
      "Anaya";

    const gName =
      data?.groomName ||
      data?.couple?.groomName ||
      merged.groomName ||
      merged.couple?.groomName ||
      "Zain";

    const bParents =
      data?.brideParents ||
      data?.couple?.brideParents ||
      merged.brideParents ||
      merged.couple?.brideParents ||
      "Mr & Mrs Faisal Chaudhry";

    const gParents =
      data?.groomParents ||
      data?.couple?.groomParents ||
      merged.groomParents ||
      merged.couple?.groomParents ||
      "Mr & Mrs Imran Siddiqui";

    const vName =
      data?.venueName ||
      data?.venue?.name ||
      merged.venue?.name ||
      "Qasr-e-Aina Banquet Hall";

    const vAddress =
      data?.venueAddress ||
      data?.venue?.address ||
      merged.venue?.address ||
      "Shahrah-e-Faisal, Karachi, Pakistan";

    const vMap =
      data?.venue?.mapUrl ||
      merged.venue?.mapUrl ||
      `https://maps.google.com/?q=${encodeURIComponent(`${vName} ${vAddress}`)}`;

    const invocation =
      data?.sacredInvocation ||
      data?.bismillah ||
      data?.sacred?.bismillah ||
      data?.sacred?.invocation ||
      merged.sacred?.bismillah ||
      "﷽";

    const verseText =
      data?.sacredVerse ||
      data?.sacred?.surahArRum ||
      data?.sacred?.mantra ||
      data?.sacred?.shloka ||
      data?.verse?.translation ||
      merged.sacred?.surahArRum ||
      "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.";

    const verseArabic =
      data?.sacred?.quranArabic ||
      data?.verse?.arabic ||
      merged.sacred?.quranArabic ||
      "وَمِنْ ءَايَٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً";

    const translation =
      data?.sacredTranslation ||
      data?.sacred?.bismillahTranslation ||
      data?.sacred?.shlokaTranslation ||
      data?.verse?.propheticDuaTranslation ||
      merged.sacred?.bismillahTranslation ||
      "In the name of Allah, the Most Gracious, the Most Merciful";

    const rawEvents = data?.events || data?.eventsJson || merged.events || merged.eventsJson;
    const resolvedEvents = (Array.isArray(rawEvents) && rawEvents.length > 0)
      ? rawEvents.map((ev: any, idx: number) => {
          const fallbackEv = defaultData.events[idx] || defaultData.events[0];
          const eventKeys = ["mehndi", "nikah", "baraat", "walima"];
          const id = ev.id || eventKeys[idx % eventKeys.length];
          return {
            id,
            name: ev.name || fallbackEv.name,
            date: ev.date || fallbackEv.date,
            time: ev.time || fallbackEv.time,
            venue: ev.venue || fallbackEv.venue,
            address: ev.address || ev.location || fallbackEv.address,
            dressCode: ev.dressCode || ev.dress || fallbackEv.dressCode,
            mapUrl: ev.mapUrl || fallbackEv.mapUrl || `https://maps.google.com/?q=${encodeURIComponent((ev.venue || fallbackEv.venue) + " " + (ev.address || ev.location || fallbackEv.address))}`,
            isoTarget: ev.isoTarget || fallbackEv.isoTarget,
            description: ev.description || ev.detail || fallbackEv.description,
            enabled: ev.enabled !== false,
          };
        })
      : merged.events;

    return {
      ...merged,
      brideName: bName,
      groomName: gName,
      brideParents: bParents,
      groomParents: gParents,
      hashtag:
        data?.hashtag ||
        merged.hashtag ||
        `#${gName}And${bName}`.replace(/[\s&]+/g, ""),
      couple: {
        ...merged.couple,
        brideName: bName,
        groomName: gName,
        brideParents: bParents,
        groomParents: gParents,
        fullTitle: `${gName} & ${bName}`,
      },
      venue: {
        ...merged.venue,
        name: vName,
        address: vAddress,
        mapUrl: vMap,
      },
      sacred: {
        ...merged.sacred,
        bismillah: invocation,
        bismillahTranslation: translation,
        surahArRum: verseText,
        quranArabic: verseArabic,
      },
      events: resolvedEvents,
      eventsJson: resolvedEvents,
      musicTrack: resolveAudioTrack(data?.musicTrack || merged.musicTrack),
    };
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
    const isCustomDate = data?.weddingDate && data.weddingDate !== defaultData.weddingDate;
    if (isCustomDate) {
      return data.weddingDate.includes("T") ? data.weddingDate : `${data.weddingDate}T20:00:00+05:00`;
    }
    const events = resolvedData.events || resolvedData.eventsJson || [];
    const baraat = events.find((e: any) => e.id === "baraat");
    return baraat?.isoTarget || resolvedData.weddingDate || "2026-12-12T20:00:00+05:00";
  }, [data?.weddingDate, resolvedData]);

  // Submit RSVP to platform API (/api/messages)
  const handleRsvpSubmit = useCallback(async (submission: any) => {
    try {
      const targetSlug =
        resolvedData.slug ||
        (typeof window !== "undefined" ? window.location.pathname.split("/").filter(Boolean).pop() : undefined);
      const targetId = resolvedData.id;
      if (typeof window !== "undefined" && (targetId || targetSlug)) {
        await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invitationId: targetId,
            slug: targetSlug,
            guestName: submission.guestName,
            message: submission.wishes || "",
            rsvpJson: {
              attending: submission.events && !submission.events.includes("regrets"),
              events: submission.events,
              guests: submission.attendingCount,
            },
          }),
        });
      }
      return true;
    } catch (_) {
      // Non-blocking: localStorage already safely saved the submission
      return true;
    }
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

  // Smooth scroll controller: when user scrolls at the hero section,
  // glide completely and smoothly to the letter casket section (#letter)
  useEffect(() => {
    let isTransitioning = false;
    let touchStartY = 0;
    let touchStartX = 0;

    const scrollToLetter = () => {
      // Do not trigger while transitioning or while gate is locked shut
      if (isTransitioning) return;
      if (typeof document !== "undefined" && document.documentElement.classList.contains("is-shut")) {
        return;
      }

      const letterEl = document.getElementById("letter");
      if (!letterEl) return;

      isTransitioning = true;

      // 1. Native smooth scrollIntoView (standard spec)
      try {
        letterEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (_) {}

      // 2. Direct window.scrollTo calculation for broad mobile browser compatibility
      try {
        const docScrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0;
        const rectTop = letterEl.getBoundingClientRect().top;
        const targetY = rectTop + docScrollTop;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      } catch (_) {}

      // 3. Fallback for scrollable parent containers (like embed iframes / preview frames)
      try {
        let parent = letterEl.parentElement;
        while (parent) {
          if (parent.scrollHeight > parent.clientHeight && parent.clientHeight > 0) {
            const overflowY = window.getComputedStyle(parent).overflowY;
            if (overflowY === "auto" || overflowY === "scroll") {
              parent.scrollTo({ top: letterEl.offsetTop, behavior: "smooth" });
              break;
            }
          }
          parent = parent.parentElement;
        }
      } catch (_) {}

      setTimeout(() => {
        isTransitioning = false;
      }, 950);
    };

    // Helper: checks if user is currently viewing the Hero section
    const isAtHero = () => {
      const heroEl = document.getElementById("hero");
      if (!heroEl) return false;
      const rect = heroEl.getBoundingClientRect();
      // Hero top is near screen top and bottom is still meaningfully visible
      return rect.top >= -80 && rect.bottom > 120;
    };

    // 1. Mouse wheel downward scroll
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 8 && isAtHero()) {
        scrollToLetter();
      }
    };

    // 2. Mobile Touch Swipe Upward
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches || !e.touches[0]) return;
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = touchStartY - currentY; // Positive = swipe UP (scrolling DOWN)
      const deltaX = Math.abs(currentX - touchStartX);

      // Vertical swipe upward with greater vertical than horizontal movement
      if (deltaY > 25 && deltaY > deltaX && isAtHero()) {
        scrollToLetter();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      const currentY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - currentY;
      if (deltaY > 25 && isAtHero()) {
        scrollToLetter();
      }
    };

    // 3. Direct Click / Tap on scroll guide indicator (.h-scroll)
    let removeGuideListeners: (() => void) | undefined;
    const timer = setTimeout(() => {
      const scrollGuide = document.querySelector(".h-scroll");
      if (scrollGuide) {
        const handleGuideTrigger = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          scrollToLetter();
        };
        scrollGuide.addEventListener("click", handleGuideTrigger);
        scrollGuide.addEventListener("touchend", handleGuideTrigger);
        removeGuideListeners = () => {
          scrollGuide.removeEventListener("click", handleGuideTrigger);
          scrollGuide.removeEventListener("touchend", handleGuideTrigger);
        };
      }
    }, 100);

    // Attach listeners on window and document
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      if (removeGuideListeners) removeGuideListeners();
    };
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
      <HeroHall data={resolvedData} isGateOpen={isGateOpen} />

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
        onSubmit={handleRsvpSubmit}
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 09: MIDNIGHT REFLECTING POOL & REPLAY (#closing)
          Floating brass diyas spawned on water click with ripple physics,
          sacred Baraka Allahu Lakuma closing dua, and replay CTA
          ───────────────────────────────────────────────────────────── */}
      <ReflectingPool
        sacred={resolvedData.sacred}
        familySignoff={
          resolvedData.brideParents && resolvedData.groomParents && (resolvedData.brideParents !== defaultData.couple.brideParents || resolvedData.groomParents !== defaultData.couple.groomParents)
            ? `the ${resolvedData.groomParents.replace(/^Mr\s*(?:&|and)\s*Mrs\.?\s*/i, "").split(" ").pop()} & ${resolvedData.brideParents.replace(/^Mr\s*(?:&|and)\s*Mrs\.?\s*/i, "").split(" ").pop()} families`
            : undefined
        }
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
