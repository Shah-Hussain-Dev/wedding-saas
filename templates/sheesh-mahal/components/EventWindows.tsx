"use client";

import React, { useState } from "react";
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

const EVENT_TONES: Record<string, { color: string; ink: string; glow: string; bg: string }> = {
  mehndi: { color: "#f3a623", ink: "#8a5606", glow: "rgba(255, 170, 40, 0.45)", bg: "#fff9ee" },
  nikah: { color: "#ec93a8", ink: "#9b3c56", glow: "rgba(240, 130, 160, 0.45)", bg: "#fff1f4" },
  baraat: { color: "#d3283f", ink: "#911428", glow: "rgba(215, 36, 62, 0.4)", bg: "#fff0f2" },
  walima: { color: "#5a718b", ink: "#3b4d61", glow: "rgba(170, 190, 220, 0.55)", bg: "#f1f5f9" }
};

/**
 * Standard RFC 5545 iCalendar (.ics) generator compliant with E2E specification
 */
function generateICalendarEvent(event: SheeshMahalEvent, couple?: { brideName?: string; groomName?: string }): string {
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
  // Track open state per event window card - all start closed, tap to open
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({
    mehndi: false,
    nikah: false,
    baraat: false,
    walima: false
  });

  const playSfx = (name: string) => {
    if (onPlaySfx) {
      onPlaySfx(name);
      return;
    }
    triggerSfx(name);
  };

  const toggleWindow = (id: string) => {
    const nextState = !openStates[id];
    setOpenStates((prev) => ({ ...prev, [id]: nextState }));
    if (nextState) {
      playSfx("sfx-window-open.mp3");
    }
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

  const handleOpenGoogleCalendar = (event: SheeshMahalEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    const groom = couple?.groomName || "Zain";
    const bride = couple?.brideName || "Anaya";
    const title = `${groom} & ${bride} - ${event.name}`;
    const details = `${event.name} Celebration. Dress code: ${event.dressCode || ""}.\n${event.description || ""}`;
    const location = event.venue;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const activeEvents = events && events.length > 0 ? events : DEFAULT_EVENTS;

  return (
    <section
      id="events"
      className="sheesh-mahal-events relative w-full py-20 px-4 flex flex-col items-center text-[#0b3d31]"
      style={{
        background: "url(/templates/sheesh-mahal/assets/letter/marble.webp) center top / 100% auto repeat-y, #f2ede3",
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

      {/* Section Header */}
      <div className="text-center max-w-lg mb-12 z-10">
        <p className="ev-kicker text-xs uppercase tracking-[0.28em] text-[#86662a] mb-2 font-serif font-bold">
          ✦ Mughal Celebrations &amp; Festivities ✦
        </p>
        <h2
          className="ev-title text-5xl sm:text-6xl mb-2 font-normal"
          style={{
            fontFamily: "'Alex Brush', cursive",
            color: "#86662a",
            textShadow: "0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(60,36,6,0.3)"
          }}
        >
          Jharokha Windows
        </h2>
        <div className="relative w-28 h-3 mx-auto my-3 flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#86662a]/70 to-transparent" />
          <div className="absolute w-2.5 h-2.5 rotate-45 border border-[#c9a45c] bg-[#86662a] shadow-sm" />
        </div>
        <p className="text-sm sm:text-base text-[#0b3d31]/85 italic font-serif max-w-md mx-auto leading-relaxed">
          Tap each carved palace window to swing open the royal wooden shutters and reveal the ceremonies
        </p>
      </div>

      {/* 4 Jharokha Window Cards Stack */}
      <div className="w-full max-w-[480px] flex flex-col gap-10 items-center z-10">
        {activeEvents.map((event) => {
          const isOpen = Boolean(openStates[event.id]);
          const artworkUrl = EVENT_ARTWORK[event.id] || "/templates/sheesh-mahal/assets/events/arch.webp";
          const tones = EVENT_TONES[event.id] || {
            color: "#c9a45c",
            ink: "#86662a",
            glow: "rgba(201, 164, 92, 0.4)",
            bg: "#fffdf8"
          };
          const mapsUrl =
            event.mapUrl ||
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}`;

          return (
            <article
              key={event.id}
              className={`ev-card relative w-full rounded-3xl p-6 border border-[#c9a45c]/50 bg-[#fffcf5]/95 shadow-[0_14px_40px_rgba(60,40,10,0.15)] backdrop-blur-sm transition-all duration-500 flex flex-col items-center ${
                isOpen ? "ring-2 ring-[#c9a45c]/60 shadow-[0_18px_48px_rgba(60,40,10,0.22)]" : ""
              }`}
            >
              {/* Jharokha Window Button Trigger */}
              <div className="w-full flex justify-center mb-6">
                <button
                  type="button"
                  className="ev-win relative block p-0 border-0 bg-transparent cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#86662a] rounded-t-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    width: "190px",
                    aspectRatio: "0.47435",
                    perspective: "800px"
                  }}
                  onClick={() => toggleWindow(event.id)}
                  aria-expanded={isOpen}
                  aria-label={`${event.name} Jharokha Window. Tap to toggle wooden shutters.`}
                >
                  {/* Tone Light Glow Flare */}
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

                  {/* Left 3D Carved Wooden Shutter Leaf */}
                  <span
                    className="ev-leaf ev-leaf-l absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "20.494% 50%",
                      clipPath: "inset(0 50.05% 0 0)",
                      transform: isOpen ? "perspective(800px) rotateY(-85deg)" : "perspective(800px) rotateY(0deg)"
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
                    className="ev-leaf ev-leaf-r absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "79.712% 50%",
                      clipPath: "inset(0 0 0 49.95%)",
                      transform: isOpen ? "perspective(800px) rotateY(85deg)" : "perspective(800px) rotateY(0deg)"
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
                    className="ev-frame absolute inset-0 pointer-events-none bg-no-repeat bg-[length:100%_100%] drop-shadow-[0_8px_16px_rgba(60,40,10,0.3)]"
                    style={{
                      backgroundImage: "url(/templates/sheesh-mahal/assets/events/frame.webp)"
                    }}
                    aria-hidden="true"
                  />

                  {/* Latch Badge */}
                  <span className="absolute inset-x-0 bottom-3 z-30 flex justify-center pointer-events-none">
                    <span className="px-3.5 py-1 rounded-full bg-[#03170f]/85 border border-[#c9a45c] text-[#e6cf98] text-[10px] font-serif uppercase tracking-wider backdrop-blur-md shadow-md">
                      {isOpen ? "✦ Shutters Open ✦" : "✦ Tap Window to Open ✦"}
                    </span>
                  </span>
                </button>
              </div>

              {/* Event Details Content Card */}
              <div className="w-full text-center flex flex-col items-center">
                {/* Event Category Badge */}
                <span
                  className="inline-block px-3.5 py-1 rounded-full text-[11px] font-serif uppercase tracking-[0.2em] font-bold border mb-2 shadow-xs"
                  style={{
                    backgroundColor: tones.bg,
                    color: tones.ink,
                    borderColor: tones.color
                  }}
                >
                  ✦ {event.name} Ceremony ✦
                </span>

                {/* Event Name in Alex Brush Script */}
                <h3
                  className="text-4xl sm:text-5xl font-normal mb-2"
                  style={{
                    fontFamily: "'Alex Brush', cursive",
                    color: tones.ink
                  }}
                >
                  {event.name}
                </h3>

                {/* Date & Time */}
                <div className="mb-3">
                  <p className="text-sm uppercase tracking-[0.15em] text-[#86662a] font-serif font-bold">
                    {event.date}
                  </p>
                  <p className="text-base text-[#0b3d31] font-serif italic mt-0.5">
                    {event.time}
                  </p>
                </div>

                {/* Venue & Dress Code */}
                <div className="w-full max-w-sm border-t border-b border-[#c9a45c]/30 py-3 mb-4 space-y-1.5">
                  <p className="text-sm text-[#0b3d31] font-serif font-semibold">
                    <span className="text-[#86662a]">Venue: </span>
                    {event.venue}
                  </p>
                  {event.address && (
                    <p className="text-xs text-[#0b3d31]/80 font-serif italic">
                      {event.address}
                    </p>
                  )}
                  {event.dressCode && (
                    <p className="text-xs text-[#0b3d31] font-serif pt-1">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-[#86662a]">Dress Code: </span>
                      <span className="italic">{event.dressCode}</span>
                    </p>
                  )}
                </div>

                {event.description && (
                  <p className="text-xs text-[#0b3d31]/80 italic font-serif leading-relaxed mb-5 max-w-sm">
                    &ldquo;{event.description}&rdquo;
                  </p>
                )}

                {/* Action Buttons with min 44x44px touch targets */}
                <div className="w-full max-w-sm grid grid-cols-2 gap-3 pt-1">
                  {/* Google Maps Link */}
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ev-btn min-h-[44px] min-w-[44px] px-3 py-2 rounded-full border border-[#86662a]/60 bg-[#fffcf4] text-[#0b3d31] hover:text-[#86662a] hover:border-[#86662a] text-xs font-serif font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                    aria-label={`View directions to ${event.venue} on Google Maps`}
                  >
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-[#86662a]"
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

                  {/* Add to Calendar (.ICS) Download Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDownloadIcs(event, e)}
                    className="ev-btn-cal min-h-[44px] min-w-[44px] px-3 py-2 rounded-full border border-[#86662a]/60 bg-[#fffcf4] text-[#0b3d31] hover:text-[#86662a] hover:border-[#86662a] text-xs font-serif font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                    aria-label={`Download .ics calendar event for ${event.name}`}
                  >
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-[#86662a]"
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
                    <span>.ICS Calendar</span>
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
