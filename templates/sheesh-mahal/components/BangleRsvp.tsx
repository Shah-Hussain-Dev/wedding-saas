"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SheeshMahalEvent } from "../types";
import { playSfx as triggerSfx } from "./AudioDock";

export interface BangleRsvpProps {
  events?: SheeshMahalEvent[];
  deadlineDate?: string;
  guestNameDefault?: string;
  maxSeats?: number;
  onSubmit?: (payload: RsvpSubmission) => Promise<boolean> | void;
  onPlaySfx?: (sfxName: string) => void;
}

export interface RsvpSubmission {
  guestName: string;
  attendingCount: number;
  events: string[];
  wishes?: string;
  timestamp: number;
}

const DEFAULT_RSVP_EVENTS: Array<{
  id: string;
  name: string;
  bangleImg: string;
  colorHint: string;
  dayText: string;
  dateText: string;
}> = [
  {
    id: "mehndi",
    name: "Mehndi",
    bangleImg: "/templates/sheesh-mahal/assets/rsvp/bangle-mehndi.webp",
    colorHint: "Yellow & Green Glass",
    dayText: "Thursday, 10",
    dateText: "December"
  },
  {
    id: "nikah",
    name: "Nikah",
    bangleImg: "/templates/sheesh-mahal/assets/rsvp/bangle-nikah.webp",
    colorHint: "Ivory & Pearl Lac",
    dayText: "Friday, 11",
    dateText: "December"
  },
  {
    id: "baraat",
    name: "Baraat",
    bangleImg: "/templates/sheesh-mahal/assets/rsvp/bangle-baraat.webp",
    colorHint: "Ruby & Gold Kangan",
    dayText: "Saturday, 12",
    dateText: "December"
  },
  {
    id: "walima",
    name: "Walima",
    bangleImg: "/templates/sheesh-mahal/assets/rsvp/bangle-walima.webp",
    colorHint: "Silver & Turquoise Glass",
    dayText: "Sunday, 13",
    dateText: "December"
  }
];

export default function BangleRsvp({
  events,
  deadlineDate = "2026-12-13T23:30:00+05:00",
  guestNameDefault = "",
  maxSeats = 5,
  onSubmit,
  onPlaySfx
}: BangleRsvpProps) {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [guestName, setGuestName] = useState<string>(guestNameDefault);
  const [wishes, setWishes] = useState<string>("");
  const [honeypot, setHoneypot] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // States: 'form' | 'submitting' | 'confirmed'
  const [rsvpState, setRsvpState] = useState<"form" | "submitting" | "confirmed">("form");
  const [lastSubmission, setLastSubmission] = useState<RsvpSubmission | null>(null);
  const [isPastDeadline, setIsPastDeadline] = useState<boolean>(false);

  const playSfx = useCallback(
    (name: string) => {
      if (onPlaySfx) {
        onPlaySfx(name);
        return;
      }
      triggerSfx(name);
    },
    [onPlaySfx]
  );

  // Check deadline & restore saved RSVP from localStorage on mount
  useEffect(() => {
    try {
      const deadline = new Date(deadlineDate).getTime();
      if (!isNaN(deadline) && Date.now() > deadline) {
        setIsPastDeadline(true);
      }
    } catch {}

    try {
      const saved = localStorage.getItem("sm:rsvp");
      if (saved) {
        const parsed = JSON.parse(saved) as RsvpSubmission;
        if (parsed && parsed.guestName) {
          setLastSubmission(parsed);
          setGuestName(parsed.guestName);
          setGuestCount(parsed.attendingCount || 2);
          setSelectedEvents(parsed.events || []);
          setWishes(parsed.wishes || "");
          setRsvpState("confirmed");
        }
      }
    } catch {}
  }, [deadlineDate]);

  // Sync default guest name if provided
  useEffect(() => {
    if (guestNameDefault && !guestName) {
      setGuestName(guestNameDefault);
    }
  }, [guestNameDefault, guestName]);

  // Toggle bangle attendance with tactile audio
  const toggleEvent = (eventId: string) => {
    playSfx("sfx-bangle.mp3");
    setSelectedEvents((prev) => {
      if (prev.includes(eventId)) {
        return prev.filter((id) => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
    setErrorMessage(null);
  };

  // Stepper handlers with defensive clamping
  const handleDecrement = () => {
    setGuestCount((prev) => Math.max(1, prev - 1));
    playSfx("sfx-bangle.mp3");
  };

  const handleIncrement = () => {
    setGuestCount((prev) => Math.min(maxSeats, prev + 1));
    playSfx("sfx-bangle.mp3");
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Spam honeypot check
    if (honeypot && honeypot.trim().length > 0) {
      return;
    }

    // 2. Name validation
    if (!guestName || guestName.trim().length === 0) {
      setErrorMessage("Please enter your name");
      return;
    }

    // 3. Events selection check (unless sending regrets)
    const isSendingRegrets = selectedEvents.length === 0;
    if (selectedEvents.length === 0 && !isSendingRegrets) {
      setErrorMessage("Please select at least one celebration to attend");
      return;
    }

    setErrorMessage(null);
    setRsvpState("submitting");

    // Audio sequence: paper roll + carrier dove flight
    playSfx("sfx-roll.mp3");
    setTimeout(() => {
      playSfx("sfx-dove.mp3");
    }, 400);

    const submission: RsvpSubmission = {
      guestName: guestName.trim(),
      attendingCount: Math.min(maxSeats, Math.max(1, guestCount)),
      events: selectedEvents.length > 0 ? selectedEvents : ["regrets"],
      wishes: wishes.trim(),
      timestamp: Date.now()
    };

    try {
      localStorage.setItem("sm:rsvp", JSON.stringify(submission));
    } catch {}

    if (onSubmit) {
      try {
        await onSubmit(submission);
      } catch {}
    }

    setLastSubmission(submission);

    // Transition to Shukriya confirmation card after dove flight completes
    setTimeout(() => {
      setRsvpState("confirmed");
    }, 1500);
  };

  // Change reply handler
  const handleChangeReply = () => {
    setRsvpState("form");
    setErrorMessage(null);
  };

  const eventConfigs = DEFAULT_RSVP_EVENTS.map((de, idx) => {
    const matched = events?.find((e) => e.id?.toLowerCase() === de.id) || events?.[idx];
    return {
      ...de,
      name: matched?.name || de.name
    };
  });

  return (
    <section
      id="rsvp"
      className="rsvp relative w-full py-16 sm:py-24 px-3 sm:px-6 flex flex-col items-center overflow-hidden"
      style={{
        backgroundImage: "url('/templates/sheesh-mahal/assets/letter/marble.webp')",
        backgroundRepeat: "repeat",
        backgroundSize: "400px auto"
      }}
    >
      {/* Top Ornamental Gold Band Border */}
      <div
        className="absolute top-0 left-0 right-0 h-4 bg-repeat-x bg-contain bg-top z-10 pointer-events-none"
        style={{
          backgroundImage: "url('/templates/sheesh-mahal/assets/letter/band.webp')",
          backgroundSize: "auto 16px"
        }}
        aria-hidden="true"
      />

      {/* Royal Postal Desk Section Header */}
      <div className="relative z-10 w-full max-w-xl mx-auto text-center mb-6 sm:mb-8">
        <p className="font-serif text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#86662a] font-semibold mb-1">
          KINDLY REPLY
        </p>
        <h2
          className="font-script text-3xl sm:text-4xl lg:text-5xl text-[#c9a45c] text-center my-1 filter drop-shadow-[0_2px_4px_rgba(201,164,92,0.3)]"
          style={{ fontFamily: "'Alex Brush', cursive" }}
        >
          Will You Be There?
        </h2>
        <p className="font-serif italic text-xs sm:text-sm text-[#61523f]">
          by the 15th of November, 2026
        </p>
      </div>

      {/* Postal Desk Parchment Card with Sliced Floral Border Frame */}
      <div
        className="rs-paper-frame relative z-10 w-full max-w-xl mx-auto rounded-none p-5 sm:p-9 shadow-[0_12px_40px_rgba(40,30,15,0.18)]"
        style={{
          borderStyle: "solid",
          borderWidth: "clamp(18px, 4.5vw, 28px)",
          borderImageSource: "url('/templates/sheesh-mahal/assets/rsvp/paper.webp')",
          borderImageSlice: "78 fill",
          borderImageWidth: "clamp(18px, 4.5vw, 28px)",
          borderImageRepeat: "round",
          backgroundColor: "#f7f2e7"
        }}
      >
        {/* Perched Carrier Dove on Top-Right Corner of Border Frame */}
        <div
          className="rs-dove-perch absolute -top-12 sm:-top-16 right-2 sm:right-6 w-16 h-16 sm:w-20 sm:h-20 pointer-events-none z-20"
          aria-hidden="true"
        >
          <img
            src="/templates/sheesh-mahal/assets/rsvp/dove.webp"
            alt=""
            className="w-full h-full object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]"
          />
        </div>

        {/* PAST DEADLINE STATE */}
        {isPastDeadline ? (
          <div className="rs-closed text-center py-10 px-4">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-[#c9a45c] bg-[#e6cf98]/30 flex items-center justify-center text-[#86662a] text-xl">
              ✦
            </div>
            <h3 className="text-2xl font-serif text-[#0b3d31] font-semibold mb-3">
              Replies Have Concluded
            </h3>
            <p className="text-sm font-serif text-[#0b3d31]/80 leading-relaxed max-w-md mx-auto">
              Replies have closed. Thank you for your love and your heartfelt duas. We eagerly await celebrating with you in spirit and person.
            </p>
          </div>
        ) : rsvpState === "confirmed" && lastSubmission ? (
          /* SHUKRIYA CONFIRMATION CARD (.rs-thanks) */
          <div className="rs-thanks text-center py-6 px-2 sm:px-6 animate-fadeIn">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full border-2 border-[#c9a45c] bg-[#e6cf98]/40 flex items-center justify-center text-[#0b3d31] text-2xl font-serif">
              ✓
            </div>
            <h3 className="text-3xl font-serif text-[#0b3d31] font-bold mb-2">
              Shukriya!
            </h3>
            <p className="text-sm font-serif text-[#86662a] italic mb-6">
              {lastSubmission.events.includes("regrets")
                ? "Your warm wishes and regrets have been received with love."
                : "Your gracious reply has been received with deep joy and gratitude."}
            </p>

            <div className="bg-white/60 rounded-xl p-5 border border-[#c9a45c]/40 text-left mb-6 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-[#86662a] font-semibold mb-1">
                Guest Details
              </p>
              <p className="text-base font-serif font-bold text-[#0b3d31] mb-2">
                {lastSubmission.guestName}
              </p>
              {!lastSubmission.events.includes("regrets") && (
                <p className="text-xs text-[#0b3d31]/90 mb-3">
                  <span className="font-semibold">Party Size:</span> {lastSubmission.attendingCount}{" "}
                  {lastSubmission.attendingCount === 1 ? "Guest" : "Guests"}
                </p>
              )}
              <p className="text-xs uppercase tracking-wider text-[#86662a] font-semibold mb-1">
                Celebrations
              </p>
              <div className="flex flex-wrap gap-2">
                {lastSubmission.events.includes("regrets") ? (
                  <span className="px-3 py-1 rounded-full text-xs font-serif font-semibold border border-[#c9a45c] bg-[#e6cf98]/50 text-[#0b3d31]">
                    Sending heartfelt blessings from afar
                  </span>
                ) : (
                  lastSubmission.events.map((evtId) => {
                    const evName =
                      eventConfigs.find((c) => c.id === evtId)?.name ||
                      evtId.charAt(0).toUpperCase() + evtId.slice(1);
                    return (
                      <span
                        key={evtId}
                        className="px-3 py-1 rounded-full text-xs font-serif font-semibold border border-[#c9a45c] bg-[#e6cf98]/50 text-[#0b3d31]"
                      >
                        {evName}
                      </span>
                    );
                  })
                )}
              </div>
            </div>

            {/* Change my reply CTA Button (>= 44x44px touch target) */}
            <button
              type="button"
              onClick={handleChangeReply}
              className="rs-change min-h-[44px] min-w-[44px] px-8 py-2.5 rounded-full border border-[#86662a] bg-[#0b4a3b] text-[#f5efe2] text-xs uppercase tracking-widest font-serif font-semibold hover:bg-[#062a21] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Change My Reply
            </button>
          </div>
        ) : rsvpState === "submitting" ? (
          /* SUBMITTING ANIMATION (Parchment Roll & Carrier Dove Flight) */
          <div className="text-center py-12 flex flex-col items-center justify-center">
            {/* Rolled Parchment (.rs-roll) */}
            <div
              className="rs-roll w-24 h-24 bg-contain bg-center bg-no-repeat mb-4 animate-bounce"
              style={{
                backgroundImage: "url(/templates/sheesh-mahal/assets/rsvp/roll.webp)"
              }}
              aria-hidden="true"
            />
            {/* Carrier Dove Flight (.rs-flyer) */}
            <div
              className="rs-flyer w-20 h-20 bg-contain bg-center bg-no-repeat mb-4"
              style={{
                backgroundImage: "url(/templates/sheesh-mahal/assets/rsvp/dove-fly.webp)"
              }}
              aria-hidden="true"
            />
            <h4 className="text-xl font-serif text-[#0b3d31] font-semibold mb-1">
              Rolling Your Royal Parchment...
            </h4>
            <p className="text-xs text-[#86662a] italic font-serif">
              Dispatching the carrier dove to the palace
            </p>
          </div>
        ) : (
          /* RSVP FORM VIEW */
          <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
            {/* Hidden Spam Honeypot Field */}
            <input
              type="text"
              name="bot_field"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* The favour of your reply */}
            <p className="font-serif italic text-center text-[#735d3d] text-sm sm:text-base mb-5">
              The favour of your reply
            </p>

            {/* Guest Name Underline Input */}
            <div className="w-full max-w-md mx-auto mb-5">
              <label
                htmlFor="rs-name"
                className="block text-center text-[11px] sm:text-xs tracking-[0.2em] font-serif uppercase text-[#86662a] font-semibold mb-1"
              >
                YOUR NAME
              </label>
              <input
                id="rs-name"
                type="text"
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="as you would sign a card"
                className="w-full text-center bg-transparent border-b border-[#c9a45c]/70 pb-2 text-[#0b3d31] font-serif text-base sm:text-lg placeholder:italic placeholder:text-[#8a7a65]/60 focus:outline-none focus:border-[#0b3d31] transition-colors"
                required
              />
            </div>

            {/* Subtle Party Size Stepper (.rs-stepper) */}
            <div className="w-full max-w-md mx-auto flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/40 border border-[#c9a45c]/30 mb-5">
              <div className="text-left">
                <label className="block text-[11px] uppercase tracking-wider text-[#86662a] font-serif font-semibold">
                  Number of Guests
                </label>
                <p className="text-[10px] text-[#61523f]/80 font-serif italic">
                  Allocated seats reserved in your honor
                </p>
              </div>

              <div className="rs-stepper flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={guestCount <= 1}
                  className="rs-step min-h-[44px] min-w-[44px] w-11 h-11 rounded-full border border-[#c9a45c]/60 bg-white/90 text-[#0b3d31] font-bold text-base flex items-center justify-center hover:bg-[#e6cf98]/40 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                  aria-label="Decrease guest count"
                >
                  −
                </button>

                <span className="rs-count text-base font-serif font-bold text-[#0b3d31] min-w-[1.75rem] text-center tabular-nums">
                  {guestCount}
                </span>

                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={guestCount >= maxSeats}
                  className="rs-step min-h-[44px] min-w-[44px] w-11 h-11 rounded-full border border-[#c9a45c]/60 bg-white/90 text-[#0b3d31] font-bold text-base flex items-center justify-center hover:bg-[#e6cf98]/40 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                  aria-label="Increase guest count"
                >
                  +
                </button>
              </div>
            </div>

            {/* 4 Interactive Bangle Stand Columns */}
            <div className="w-full max-w-md mx-auto mb-6">
              <h3 className="text-center font-serif text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#86662a] font-semibold mb-0.5">
                WHICH CELEBRATIONS WILL YOU JOIN?
              </h3>
              <p className="text-center font-serif italic text-xs text-[#61523f] mb-4">
                Slip on the bangle for each one you will be at
              </p>

              <div className="grid grid-cols-4 gap-1 sm:gap-2 items-end">
                {eventConfigs.map((evt) => {
                  const isSelected = selectedEvents.includes(evt.id);

                  return (
                    <div
                      key={evt.id}
                      role="switch"
                      aria-checked={isSelected}
                      aria-label={`${evt.name} Attendance Bangle`}
                      tabIndex={0}
                      onClick={() => toggleEvent(evt.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleEvent(evt.id);
                        }
                      }}
                      className="rs-toggle group flex flex-col items-center cursor-pointer select-none focus:outline-none transition-transform active:scale-95"
                    >
                      {/* 3D Stand and Bangle Visual Area */}
                      <div className="relative w-full max-w-[68px] sm:max-w-[80px] h-[78px] sm:h-[90px] flex items-end justify-center mb-1.5">
                        {/* Brass Stand Asset */}
                        <img
                          src="/templates/sheesh-mahal/assets/rsvp/stand.webp"
                          alt=""
                          aria-hidden="true"
                          className="absolute bottom-1 w-[28px] sm:w-[34px] aspect-[180/375] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)] pointer-events-none"
                        />

                        {/* Bangle Asset Encircling Stand Dome Base */}
                        <img
                          src={evt.bangleImg}
                          alt={`${evt.name} bangle`}
                          className={`rs-bangle relative z-10 w-[46px] sm:w-[54px] aspect-[300/162] object-contain transition-all duration-300 pointer-events-none ${
                            isSelected
                              ? "translate-y-0 scale-105 drop-shadow-[0_4px_10px_rgba(11,74,59,0.45)]"
                              : "translate-y-0 opacity-85 hover:opacity-100"
                          }`}
                        />
                      </div>

                      {/* Cursive Event Name in Alex Brush */}
                      <span
                        className="font-script text-xl sm:text-2xl text-[#0b3d31] leading-none mb-1 text-center"
                        style={{ fontFamily: "'Alex Brush', cursive" }}
                      >
                        {evt.name}
                      </span>

                      {/* Date Subtitle */}
                      <span className="block text-[10px] sm:text-[11px] font-serif text-[#61523f] leading-tight text-center">
                        {evt.dayText}
                      </span>
                      <span className="block text-[10px] sm:text-[11px] font-serif text-[#61523f] leading-tight text-center mb-1">
                        {evt.dateText}
                      </span>

                      {/* Attendance Hint / Status */}
                      <span
                        className={`block text-[10px] sm:text-[11px] font-serif text-center transition-colors ${
                          isSelected
                            ? "text-[#0b3d31] font-semibold"
                            : "text-[#7a623d] italic"
                        }`}
                      >
                        {isSelected ? "Attending ✓" : "Tap to attend"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Heartfelt Wishes Textarea */}
            <div className="w-full max-w-md mx-auto mb-5">
              <label
                htmlFor="rs-wishes"
                className="block text-center text-[11px] sm:text-xs tracking-[0.18em] font-serif uppercase text-[#86662a] font-semibold mb-0.5"
              >
                A NOTE OR DUA FOR ZAIN &amp; ANAYA
              </label>
              <span className="block text-center text-[10px] sm:text-[11px] italic font-serif text-[#86662a]/80 mb-2">
                (optional)
              </span>
              <textarea
                id="rs-wishes"
                rows={3}
                value={wishes}
                onChange={(e) => setWishes(e.target.value)}
                placeholder="Send your prayers, blessings & joyful wishes to the couple..."
                className="w-full px-4 py-3 rounded-xl border border-[#c9a45c]/50 bg-[#faf7f0] text-[#0b3d31] text-xs sm:text-sm font-serif placeholder:italic placeholder:text-[#8a7a65]/50 focus:outline-none focus:ring-1 focus:ring-[#0b4a3b] transition-all resize-none shadow-inner"
              />
            </div>

            {/* Validation Error Message */}
            {errorMessage && (
              <div className="rs-error w-full max-w-md mx-auto text-xs text-red-700 font-serif font-semibold text-center bg-red-100/80 py-2 px-3 rounded-lg border border-red-300 mb-4">
                {errorMessage}
              </div>
            )}

            {/* Dynamic CTA Submit Button (.rs-send) */}
            <div className="flex justify-center mt-2">
              <button
                type="submit"
                className="rs-send min-h-[44px] min-w-[44px] px-8 py-3 rounded-full border border-[#c9a45c]/40 bg-[#0d4837] text-[#f5efe2] text-xs sm:text-sm font-serif font-semibold tracking-wider shadow-[0_8px_20px_rgba(13,72,55,0.35)] hover:bg-[#073024] active:scale-95 transition-all cursor-pointer"
              >
                {selectedEvents.length === 0 ? "Send my regrets" : "Accept with pleasure"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
