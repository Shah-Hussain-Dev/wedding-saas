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

const DEFAULT_RSVP_EVENTS: Array<{ id: string; name: string; bangleImg: string; colorHint: string }> = [
  {
    id: "mehndi",
    name: "Mehndi",
    bangleImg: "/templates/sheesh-mahal/assets/rsvp/bangle-mehndi.webp",
    colorHint: "Yellow & Green Glass"
  },
  {
    id: "nikah",
    name: "Nikah",
    bangleImg: "/templates/sheesh-mahal/assets/rsvp/bangle-nikah.webp",
    colorHint: "Ivory & Pearl Lac"
  },
  {
    id: "baraat",
    name: "Baraat",
    bangleImg: "/templates/sheesh-mahal/assets/rsvp/bangle-baraat.webp",
    colorHint: "Ruby & Gold Kangan"
  },
  {
    id: "walima",
    name: "Walima",
    bangleImg: "/templates/sheesh-mahal/assets/rsvp/bangle-walima.webp",
    colorHint: "Silver & Turquoise Glass"
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
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["baraat", "walima"]);
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

  // Toggle bangle attendance
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

  // Stepper handlers
  const handleDecrement = () => {
    setGuestCount((prev) => Math.max(1, prev - 1));
    playSfx("sfx-bangle.mp3");
  };

  const handleIncrement = () => {
    setGuestCount((prev) => Math.min(maxSeats, prev + 1));
    playSfx("sfx-bangle.mp3");
  };

  // Form submission
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

    // 3. Events selection check
    if (selectedEvents.length === 0) {
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
      events: selectedEvents,
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

  const eventConfigs = DEFAULT_RSVP_EVENTS.map((de) => {
    const matched = events?.find((e) => e.id.toLowerCase() === de.id);
    return {
      ...de,
      name: matched?.name || de.name
    };
  });

  return (
    <section
      id="rsvp"
      className="rsvp relative w-full py-16 px-4 sm:px-6 flex flex-col items-center bg-[#05140e] text-[#0b3d31]"
    >
      {/* Background Section Glow */}
      <div className="absolute inset-0 bg-radial from-[#0b4a3b]/20 via-transparent to-transparent pointer-events-none" />

      {/* Postal Desk Parchment Card */}
      <div
        className="relative z-10 w-full max-w-xl rounded-3xl p-6 sm:p-10 border border-[#c9a45c]/50 bg-[#f5efe2] shadow-[0_20px_60px_rgba(3,23,15,0.45)] overflow-hidden"
        style={{
          backgroundImage: "url(/templates/sheesh-mahal/assets/rsvp/paper.webp)",
          backgroundSize: "cover"
        }}
      >
        {/* Ornate Gold Border Accent */}
        <div className="absolute inset-3 border border-[#c9a45c]/30 rounded-2xl pointer-events-none" />

        {/* Perched Dove Ornament Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="rs-dove w-16 h-16 bg-contain bg-center bg-no-repeat mb-2"
            style={{
              backgroundImage: "url(/templates/sheesh-mahal/assets/rsvp/dove.webp)"
            }}
            aria-hidden="true"
          />
          <p className="text-xs uppercase tracking-[0.25em] text-[#86662a] font-serif font-semibold mb-1">
            Royal Postal Desk
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#0b3d31] font-semibold mb-2">
            The Bangle Stand RSVP
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#c9a45c] to-transparent mb-2" />
          <p className="text-xs sm:text-sm text-[#0b3d31]/80 font-serif italic max-w-sm">
            Kindly slip your chosen bangles onto the velvet stand to confirm your gracious attendance
          </p>
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
              Your gracious reply has been received with deep joy and gratitude.
            </p>

            <div className="bg-white/60 rounded-xl p-5 border border-[#c9a45c]/40 text-left mb-6 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-[#86662a] font-semibold mb-1">
                Guest Details
              </p>
              <p className="text-base font-serif font-bold text-[#0b3d31] mb-2">
                {lastSubmission.guestName}
              </p>
              <p className="text-xs text-[#0b3d31]/90 mb-3">
                <span className="font-semibold">Party Size:</span> {lastSubmission.attendingCount}{" "}
                {lastSubmission.attendingCount === 1 ? "Guest" : "Guests"}
              </p>
              <p className="text-xs uppercase tracking-wider text-[#86662a] font-semibold mb-1">
                Attending Celebrations
              </p>
              <div className="flex flex-wrap gap-2">
                {lastSubmission.events.map((evtId) => {
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
                })}
              </div>
            </div>

            {/* Change my reply CTA Button (>= 44x44px touch target) */}
            <button
              type="button"
              onClick={handleChangeReply}
              className="rs-change min-h-[44px] min-w-[44px] px-6 py-2.5 rounded-xl border border-[#86662a] bg-[#0b4a3b] text-[#f5efe2] text-xs uppercase tracking-widest font-serif font-semibold hover:bg-[#062a21] active:scale-95 transition-all shadow-md cursor-pointer"
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
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

            {/* 4 Interactive Bangle Stand Switches */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#86662a] font-serif font-semibold mb-3 text-center sm:text-left">
                Select Your Celebrations (Slip Bangle on Stand)
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                      className={`rs-toggle min-h-[44px] min-w-[44px] relative p-3 rounded-2xl border flex flex-col items-center justify-between cursor-pointer select-none transition-all duration-300 ${
                        isSelected
                          ? "border-[#c9a45c] bg-[#e6cf98]/40 shadow-[0_6px_20px_rgba(201,164,92,0.3)] scale-[1.02]"
                          : "border-[#c9a45c]/30 bg-white/40 hover:bg-white/60 opacity-80"
                      }`}
                    >
                      {/* Bangle Ring Graphic (.rs-bangle) */}
                      <div
                        className={`rs-bangle w-16 h-16 sm:w-20 sm:h-20 bg-contain bg-center bg-no-repeat transition-transform duration-500 ${
                          isSelected ? "translate-y-1 scale-105 rotate-3" : "translate-y-0 opacity-70"
                        }`}
                        style={{ backgroundImage: `url(${evt.bangleImg})` }}
                        aria-hidden="true"
                      />

                      <div className="text-center mt-2">
                        <span className="block text-sm font-serif font-bold text-[#0b3d31]">
                          {evt.name}
                        </span>
                        <span className="text-[10px] text-[#86662a] block font-serif">
                          {isSelected ? "Attending ✓" : "Tap to Slip On"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Party Size Stepper (.rs-stepper) */}
            <div className="bg-white/50 p-4 rounded-2xl border border-[#c9a45c]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#86662a] font-serif font-semibold">
                  Number of Guests
                </label>
                <p className="text-[11px] text-[#0b3d31]/70 font-serif">
                  Allocated seats reserved in your honor
                </p>
              </div>

              <div className="rs-stepper flex items-center gap-3">
                {/* Decrement Button (-) */}
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={guestCount <= 1}
                  className="rs-step min-h-[44px] min-w-[44px] w-11 h-11 rounded-full border border-[#c9a45c] bg-white text-[#0b3d31] font-bold text-lg flex items-center justify-center hover:bg-[#e6cf98]/40 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                  aria-label="Decrease guest count"
                >
                  −
                </button>

                {/* Count Display (.rs-count) */}
                <span className="rs-count text-xl font-serif font-bold text-[#0b3d31] min-w-[2.5rem] text-center tabular-nums">
                  {guestCount}
                </span>

                {/* Increment Button (+) */}
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={guestCount >= maxSeats}
                  className="rs-step min-h-[44px] min-w-[44px] w-11 h-11 rounded-full border border-[#c9a45c] bg-white text-[#0b3d31] font-bold text-lg flex items-center justify-center hover:bg-[#e6cf98]/40 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                  aria-label="Increase guest count"
                >
                  +
                </button>
              </div>
            </div>

            {/* Guest Name Input */}
            <div>
              <label
                htmlFor="rs-name"
                className="block text-xs uppercase tracking-wider text-[#86662a] font-serif font-semibold mb-1"
              >
                Honored Guest Name(s) *
              </label>
              <input
                id="rs-name"
                type="text"
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="e.g. Mr & Mrs Tariq Siddiqui"
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#c9a45c]/60 bg-white/80 text-[#0b3d31] text-sm font-serif placeholder-[#0b3d31]/40 focus:outline-none focus:ring-2 focus:ring-[#c9a45c] transition-all"
                required
              />
            </div>

            {/* Heartfelt Wishes Textarea */}
            <div>
              <label
                htmlFor="rs-wishes"
                className="block text-xs uppercase tracking-wider text-[#86662a] font-serif font-semibold mb-1"
              >
                Heartfelt Duas &amp; Wishes (Optional)
              </label>
              <textarea
                id="rs-wishes"
                rows={3}
                value={wishes}
                onChange={(e) => setWishes(e.target.value)}
                placeholder="Send your prayers, blessings & joyful wishes to the couple..."
                className="w-full px-4 py-3 rounded-xl border border-[#c9a45c]/60 bg-white/80 text-[#0b3d31] text-sm font-serif placeholder-[#0b3d31]/40 focus:outline-none focus:ring-2 focus:ring-[#c9a45c] transition-all resize-none"
              />
            </div>

            {/* Validation Error Message */}
            {errorMessage && (
              <div className="rs-error text-xs text-red-700 font-serif font-semibold text-center bg-red-100/80 py-2 px-3 rounded-lg border border-red-300">
                {errorMessage}
              </div>
            )}

            {/* Submit Button (.rs-send) */}
            <button
              type="submit"
              className="rs-send min-h-[44px] min-w-[44px] w-full py-3.5 px-6 rounded-xl border border-[#86662a] bg-[#0b4a3b] text-[#f5efe2] text-sm uppercase tracking-widest font-serif font-bold shadow-[0_8px_24px_rgba(11,74,59,0.35)] hover:bg-[#062a21] active:scale-95 transition-all cursor-pointer"
            >
              Send Royal Reply
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
