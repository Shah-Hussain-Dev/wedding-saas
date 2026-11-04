"use client";

import React, { useState, useEffect, useRef } from "react";
import { SheeshMahalEvent } from "../types";
import { playSfx as triggerSfx } from "./AudioDock";

export interface EventWindowsProps {
  events?: SheeshMahalEvent[];
  couple?: {
    brideName?: string;
    groomName?: string;
  };
  onPlaySfx?: (sfxName: string) => void;
}

const DEFAULT_EVENTS: SheeshMahalEvent[] = [
  {
    id: "mehndi",
    name: "Mehndi",
    date: "Thursday · 10 December 2026",
    time: "7:30 pm onwards",
    venue: "Gul Bahar Lawn, Clifton, Karachi",
    address: "Gul Bahar Lawn, Clifton, Karachi, Pakistan",
    dressCode: "Yellow, green & marigold",
    mapUrl: "https://maps.google.com/?q=Gul+Bahar+Lawn+Clifton+Karachi",
    description: "An enchanting evening of intricate henna artistry, fragrant floral garlands, soulful melodies, and vibrant celebration."
  },
  {
    id: "nikah",
    name: "Nikah",
    date: "Friday · 11 December 2026",
    time: "4:30 pm, after Asr",
    venue: "Masjid-e-Rahmat, DHA Phase 6, Karachi",
    address: "Masjid-e-Rahmat, DHA Phase 6, Karachi, Pakistan",
    dressCode: "Soft pastels & ivory",
    mapUrl: "https://maps.google.com/?q=Masjid-e-Rahmat+DHA+Phase+6+Karachi",
    description: "Solemnization of marriage vows and Khutbah-e-Nikah under the sacred celestial arches, sealed with heartfelt duas and blessings."
  },
  {
    id: "baraat",
    name: "Baraat",
    date: "Saturday · 12 December 2026",
    time: "8:00 pm onwards",
    venue: "Qasr-e-Aina Banquet Hall, Shahrah-e-Faisal, Karachi",
    address: "Qasr-e-Aina Banquet Hall, Shahrah-e-Faisal, Karachi, Pakistan",
    dressCode: "Formal eastern, in reds & golds",
    isoTarget: "2026-12-12T20:00:00+05:00",
    mapUrl: "https://maps.google.com/?q=Qasr-e-Aina+Banquet+Hall+Shahrah-e-Faisal+Karachi",
    description: "The grand imperial wedding procession, welcoming the groom and celebrating the eternal union with royal Mughal splendor."
  },
  {
    id: "walima",
    name: "Walima",
    date: "Sunday · 13 December 2026",
    time: "8:30 pm onwards",
    venue: "The Pearl Marquee, Karsaz, Karachi",
    address: "The Pearl Marquee, Karsaz, Karachi, Pakistan",
    dressCode: "Silver, pearl & pastels",
    mapUrl: "https://maps.google.com/?q=The+Pearl+Marquee+Karsaz+Karachi",
    description: "Tender parental blessings followed by an opulent Mughal banquet reception celebrating eternal love with gourmet delicacies."
  }
];

const EVENT_ARTWORK: Record<string, string> = {
  mehndi: "/templates/sheesh-mahal/assets/events/mehndi.webp",
  nikah: "/templates/sheesh-mahal/assets/events/nikah.webp",
  baraat: "/templates/sheesh-mahal/assets/events/baraat.webp",
  walima: "/templates/sheesh-mahal/assets/events/walima.webp"
};

const EVENT_TONES: Record<string, { color: string; ink: string; glow: string; gem: string }> = {
  mehndi: { color: "#c9a45c", ink: "#86662a", glow: "rgba(255, 185, 50, 0.45)", gem: "#c9a45c" },
  nikah: { color: "#d98297", ink: "#913b52", glow: "rgba(240, 130, 160, 0.45)", gem: "#ec93a8" },
  baraat: { color: "#c23043", ink: "#841527", glow: "rgba(215, 36, 62, 0.4)", gem: "#d3283f" },
  walima: { color: "#6a829e", ink: "#3c4d5f", glow: "rgba(170, 190, 220, 0.5)", gem: "#8aa2be" }
};

/**
 * Standard RFC 5545 iCalendar (.ics) generator compliant with E2E specification
 */
function generateICalendarEvent(
  event: SheeshMahalEvent,
  couple?: { brideName?: string; groomName?: string }
): string {
  const groom = couple?.groomName || "Zain";
  const bride = couple?.brideName || "Anaya";
  const uid = `sheesh-mahal-${event.id}-${Date.now()}@wedinvites.com`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WedInvites//Sheesh Mahal Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `SUMMARY:${groom} & ${bride} - ${event.name}`,
    `DESCRIPTION:${event.name} celebration of ${groom} & ${bride}. Dress code: ${event.dressCode || ""}.`,
    `LOCATION:${event.venue}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

export default function EventWindows({
  events = DEFAULT_EVENTS,
  couple = { brideName: "Anaya", groomName: "Zain" },
  onPlaySfx
}: EventWindowsProps) {
  // All gates/shutters start closed initially
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({
    mehndi: false,
    nikah: false,
    baraat: false,
    walima: false
  });

  const sectionRef = useRef<HTMLElement | null>(null);

  const playSfx = (name: string) => {
    if (onPlaySfx) {
      onPlaySfx(name);
      return;
    }
    triggerSfx(name);
  };

  // Preload sound effects on mount for zero-latency audio
  useEffect(() => {
    try {
      const audio = new Audio("/templates/sheesh-mahal/audio/sfx-window-open.mp3");
      audio.preload = "auto";
    } catch {}
  }, []);

  // Automatic scroll-triggered gate opening - only opens when window comes into COMPLETE VIEW
  useEffect(() => {
    const rows = document.querySelectorAll<HTMLElement>(".ev-row");
    if (!rows.length) return;

    const timers: Record<string, NodeJS.Timeout> = {};
    const observers: IntersectionObserver[] = [];

    rows.forEach((row) => {
      const id = row.getAttribute("data-event-id");
      const winEl = row.querySelector<HTMLElement>(".ev-win");
      const targetEl = winEl || row;
      if (!id) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Only trigger when the window comes into complete view (>= 75% visible inside root margins)
            if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
              if (!timers[id]) {
                timers[id] = setTimeout(() => {
                  setOpenStates((prev) => {
                    if (!prev[id]) {
                      playSfx("sfx-window-open.mp3");
                      return { ...prev, [id]: true };
                    }
                    return prev;
                  });
                }, 280); // Brief settle pause so user sees the closed gate in full view before it opens
              }
            } else if (!entry.isIntersecting || entry.intersectionRatio < 0.4) {
              // Cancel pending timer if user scrolls past quickly before complete view settle
              if (timers[id]) {
                clearTimeout(timers[id]);
                delete timers[id];
              }
            }
          });
        },
        {
          threshold: [0, 0.25, 0.5, 0.75, 0.85, 1.0],
          rootMargin: "-4% 0px -12% 0px"
        }
      );

      observer.observe(targetEl);
      observers.push(observer);
    });

    return () => {
      Object.values(timers).forEach((t) => clearTimeout(t));
      observers.forEach((obs) => obs.disconnect());
    };
  }, [events]);

  // Direct tap-to-toggle window shutters with audio feedback
  const toggleWindow = (id: string) => {
    setOpenStates((prev) => {
      const nextState = !prev[id];
      playSfx("sfx-window-open.mp3");
      return { ...prev, [id]: nextState };
    });
  };

  const handleDownloadIcs = (event: SheeshMahalEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    const icsContent = generateICalendarEvent(event, couple);
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.id}-sheesh-mahal.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to split date into Day and Date
  const parseDate = (dateStr: string) => {
    const parts = dateStr.split("·").map((p) => p.trim());
    if (parts.length >= 2) {
      return { day: parts[0].toUpperCase(), date: parts[1] };
    }
    return { day: "", date: dateStr };
  };

  // Helper to split venue into main name and locality
  const parseVenue = (venueStr: string) => {
    const parts = venueStr.split(",").map((p) => p.trim());
    if (parts.length >= 2) {
      return { name: parts[0], location: parts.slice(1).join(", ") };
    }
    return { name: venueStr, location: "" };
  };

  const activeEvents = events && events.length > 0 ? events : DEFAULT_EVENTS;

  return (
    <section
      ref={sectionRef}
      id="events"
      className="sheesh-mahal-events relative w-full py-16 px-4 flex flex-col items-center text-[#0b3d31]"
      style={{
        background:
          "url(/templates/sheesh-mahal/assets/letter/marble.webp) center top / 100% auto repeat-y, #f6f2ea",
        overflowX: "clip"
      }}
    >
      {/* Top and Bottom Mughal Gold Bands */}
      <div
        className="absolute top-0 inset-x-0 h-[18px] bg-[url('/templates/sheesh-mahal/assets/letter/band.webp')] bg-repeat-x bg-[length:auto_18px] z-10 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 inset-x-0 h-[18px] bg-[url('/templates/sheesh-mahal/assets/letter/band.webp')] bg-repeat-x bg-[length:auto_18px] z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Section Header: Please join us for / The Festivities */}
      <div className="text-center max-w-lg mb-10 z-10">
        <p className="ev-kicker text-xs uppercase tracking-[0.24em] text-[#86662a] mb-1.5 font-serif font-bold">
          PLEASE JOIN US FOR
        </p>
        <h2
          className="ev-title text-5xl sm:text-6xl font-normal leading-tight"
          style={{
            fontFamily: "'Alex Brush', cursive",
            color: "#9b7635",
            textShadow: "0 1px 0 rgba(255,255,255,0.9), 0 2px 6px rgba(60,36,6,0.22)"
          }}
        >
          The Festivities
        </h2>
      </div>

      {/* Alternating Zigzag Event Windows Container */}
      <div className="w-full max-w-[460px] flex flex-col gap-12 sm:gap-16 items-center z-10">
        {activeEvents.map((event, index) => {
          const isOpen = Boolean(openStates[event.id]);
          const isEven = index % 2 === 0; // Even: Window on Left, Odd: Window on Right
          const eventKeys = ["mehndi", "nikah", "baraat", "walima"];
          const matchedKey =
            eventKeys.find((k) => event.id?.toLowerCase().includes(k) || event.name?.toLowerCase().includes(k)) ||
            eventKeys[index % eventKeys.length];
          const artworkUrl = EVENT_ARTWORK[event.id] || EVENT_ARTWORK[matchedKey] || "/templates/sheesh-mahal/assets/events/arch.webp";
          const tones = EVENT_TONES[event.id] || EVENT_TONES[matchedKey] || {
            color: "#c9a45c",
            ink: "#86662a",
            glow: "rgba(201, 164, 92, 0.4)",
            gem: "#c9a45c"
          };
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            event.venue
          )}`;

          const dateInfo = parseDate(event.date);
          const venueInfo = parseVenue(event.venue);

          return (
            <article
              key={event.id}
              data-event-id={event.id}
              className={`ev-row relative w-full flex items-center justify-between gap-3 sm:gap-6 ${
                isEven ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {/* Jharokha Window Unit (3D Carved Shutters, Arch, & Artwork) */}
              <div className="ev-col-win flex justify-center items-center flex-shrink-0">
                <button
                  type="button"
                  className="ev-win relative block p-0 border-0 bg-transparent cursor-pointer select-none focus:outline-none transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    width: "clamp(138px, 39vw, 175px)",
                    aspectRatio: "560 / 1181",
                    perspective: "800px"
                  }}
                  onClick={() => toggleWindow(event.id)}
                  aria-expanded={isOpen}
                  aria-label={`${event.name} Jharokha Window. Tap to toggle wooden shutters.`}
                >
                  {/* Tone Light Glow Flare behind window */}
                  <span
                    className={`ev-light absolute inset-[-12%] rounded-full transition-opacity duration-700 pointer-events-none ${
                      isOpen ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ background: `radial-gradient(circle, ${tones.glow}, transparent 70%)` }}
                    aria-hidden="true"
                  />

                  {/* Miniature Ceremony Artwork Painting */}
                  <span
                    className="ev-scene absolute overflow-hidden pointer-events-none rounded-t-full"
                    style={{
                      left: "20.494%",
                      top: "28.627%",
                      width: "59.218%",
                      height: "49.634%",
                      background: "#1a0f08"
                    }}
                    aria-hidden="true"
                  >
                    <img
                      src={artworkUrl}
                      alt=""
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isOpen ? "filter-none scale-105" : "brightness-[0.45] saturate-75"
                      }`}
                    />
                  </span>

                  {/* Green Diamond-Quilted Lattice Side Curtains */}
                  <span
                    className="ev-arch-trim absolute inset-0 pointer-events-none bg-no-repeat bg-[length:100%_100%]"
                    style={{
                      backgroundImage: "url(/templates/sheesh-mahal/assets/events/arch-cutout.webp)"
                    }}
                    aria-hidden="true"
                  />

                  {/* Left 3D Carved Wooden Shutter Leaf */}
                  <span
                    className={`ev-leaf ev-leaf-l win-leaf-l absolute inset-0 pointer-events-none transition-transform duration-700 ease-out ${
                      isOpen ? "is-open" : ""
                    }`}
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "20.494% 50%",
                      clipPath: "inset(0 50.05% 0 0)",
                      transform: isOpen
                        ? "perspective(800px) rotateY(-85deg)"
                        : "perspective(800px) rotateY(0deg)"
                    }}
                    aria-hidden="true"
                  >
                    <i
                      className="absolute inset-0 bg-no-repeat bg-[length:100%_100%]"
                      style={{
                        backgroundImage: "url(/templates/sheesh-mahal/assets/events/shutters.webp)",
                        filter: isOpen ? "none" : "drop-shadow(2px 0 4px rgba(0,0,0,0.4))"
                      }}
                    />
                  </span>

                  {/* Right 3D Carved Wooden Shutter Leaf */}
                  <span
                    className={`ev-leaf ev-leaf-r win-leaf-r absolute inset-0 pointer-events-none transition-transform duration-700 ease-out ${
                      isOpen ? "is-open" : ""
                    }`}
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "79.712% 50%",
                      clipPath: "inset(0 0 0 49.95%)",
                      transform: isOpen
                        ? "perspective(800px) rotateY(85deg)"
                        : "perspective(800px) rotateY(0deg)"
                    }}
                    aria-hidden="true"
                  >
                    <i
                      className="absolute inset-0 bg-no-repeat bg-[length:100%_100%]"
                      style={{
                        backgroundImage: "url(/templates/sheesh-mahal/assets/events/shutters.webp)",
                        filter: isOpen ? "none" : "drop-shadow(-2px 0 4px rgba(0,0,0,0.4))"
                      }}
                    />
                  </span>

                  {/* Carved Marble Arch Frame (Sits on top of shutters) */}
                  <span
                    className="ev-frame absolute inset-0 pointer-events-none bg-no-repeat bg-[length:100%_100%] drop-shadow-[0_8px_16px_rgba(60,40,10,0.25)]"
                    style={{
                      backgroundImage: "url(/templates/sheesh-mahal/assets/events/frame.webp)"
                    }}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {/* Ceremony Details Column (Zigzag Animated Content) */}
              <div
                className={`ev-col-content flex-1 flex flex-col items-center text-center transition-all duration-700 ease-out ${
                  isOpen
                    ? "opacity-100 translate-x-0"
                    : isEven
                    ? "opacity-0 translate-x-4 pointer-events-none"
                    : "opacity-0 -translate-x-4 pointer-events-none"
                }`}
              >
                {/* Event Name in Royal Cursive */}
                <h3
                  className="ev-name text-4xl sm:text-5xl font-normal leading-tight mb-1"
                  style={{
                    fontFamily: "'Alex Brush', cursive",
                    color: "#9b7635",
                    textShadow: "0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(60,36,6,0.2)"
                  }}
                >
                  {event.name}
                </h3>

                {/* Golden Diamond Divider */}
                <div className="w-24 h-3 flex items-center justify-center my-1">
                  <span className="w-full h-px bg-gradient-to-r from-transparent via-[#c9a45c]/80 to-transparent" />
                  <span
                    className="absolute w-2 h-2 rotate-45 border border-[#c9a45c]"
                    style={{ backgroundColor: tones.gem }}
                  />
                </div>

                {/* Date & Time Block */}
                <div className="my-1.5 flex flex-col items-center">
                  {dateInfo.day && (
                    <span className="text-[11px] sm:text-xs tracking-[0.2em] font-serif font-bold text-[#86662a] uppercase">
                      {dateInfo.day}
                    </span>
                  )}
                  <span className="text-xs sm:text-sm tracking-[0.14em] font-serif font-semibold text-[#0b3d31] uppercase mt-0.5">
                    {dateInfo.date}
                  </span>
                  <span className="text-xs sm:text-sm font-serif italic text-[#0b3d31]/90 mt-0.5">
                    {event.time}
                  </span>
                </div>

                {/* Venue Details */}
                <div className="my-1.5 flex flex-col items-center">
                  <span className="text-sm sm:text-base font-serif font-bold text-[#0b3d31] leading-snug">
                    {venueInfo.name}
                  </span>
                  {venueInfo.location && (
                    <span className="text-xs sm:text-sm font-serif italic text-[#0b3d31]/85">
                      {venueInfo.location}
                    </span>
                  )}
                </div>

                {/* Dress Code */}
                {event.dressCode && (
                  <div className="my-1.5 flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.18em] font-serif font-bold text-[#86662a]">
                      DRESS CODE
                    </span>
                    <span className="text-xs sm:text-sm font-serif italic text-[#0b3d31]/90">
                      {event.dressCode}
                    </span>
                  </div>
                )}

                {/* Action Buttons: Directions & Add to Calendar */}
                <div className="w-full max-w-[200px] flex flex-col gap-2 mt-2.5">
                  {/* Google Maps Directions */}
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ev-btn-dir w-full min-h-[40px] px-3.5 py-1.5 rounded-full border border-[#c9a45c]/80 bg-[#fffdfa] hover:bg-[#fff9ed] text-[#0b3d31] hover:text-[#86662a] text-xs font-serif font-semibold tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                    aria-label={`View directions to ${event.venue} on Google Maps`}
                  >
                    <svg
                      className="w-3.5 h-3.5 flex-shrink-0 text-[#86662a]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Directions</span>
                  </a>

                  {/* Add to Calendar (.ICS) */}
                  <button
                    type="button"
                    onClick={(e) => handleDownloadIcs(event, e)}
                    className="ev-btn-cal w-full min-h-[40px] px-3.5 py-1.5 rounded-full border border-[#c9a45c]/80 bg-[#fffdfa] hover:bg-[#fff9ed] text-[#0b3d31] hover:text-[#86662a] text-xs font-serif font-semibold tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                    aria-label={`Download .ics calendar event for ${event.name}`}
                  >
                    <svg
                      className="w-3.5 h-3.5 flex-shrink-0 text-[#86662a]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Add to calendar</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
