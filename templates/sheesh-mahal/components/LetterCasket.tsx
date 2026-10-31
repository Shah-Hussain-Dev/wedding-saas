"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { SheeshMahalData } from "../types";
import { playSfx } from "./AudioDock";

export interface LetterCasketProps {
  data?: Partial<SheeshMahalData>;
  guestName?: string;
}

/**
 * Sanitizes query string or prop guest personalization against XSS
 */
function sanitizeGuestParam(input?: string): string {
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

export default function LetterCasket({ data, guestName: guestNameProp }: LetterCasketProps) {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [isPoppedUp, setIsPoppedUp] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSealStamped, setIsSealStamped] = useState(false);
  const [guestName, setGuestName] = useState("Family & Friends");
  const isTriggered = useRef(false);
  const casketRef = useRef<HTMLButtonElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Pre-load audio elements for zero latency instant playback
  const sfxOpenAudio = useRef<HTMLAudioElement | null>(null);
  const sfxLetterAudio = useRef<HTMLAudioElement | null>(null);
  const sfxSealAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const audioOpen = new Audio("/templates/sheesh-mahal/audio/sfx-open.mp3");
        audioOpen.preload = "auto";
        audioOpen.volume = 0.85;
        sfxOpenAudio.current = audioOpen;

        const audioLetter = new Audio("/templates/sheesh-mahal/audio/sfx-letter.mp3");
        audioLetter.preload = "auto";
        audioLetter.volume = 0.85;
        sfxLetterAudio.current = audioLetter;

        const audioSeal = new Audio("/templates/sheesh-mahal/audio/sfx-lock.mp3");
        audioSeal.preload = "auto";
        audioSeal.volume = 0.7;
        sfxSealAudio.current = audioSeal;
      } catch (_) {}
    }
  }, []);

  const groomName = data?.groomName || data?.couple?.groomName || "Zain";
  const brideName = data?.brideName || data?.couple?.brideName || "Anaya";
  const groomParents =
    data?.groomParents || data?.couple?.groomParents || "Mr & Mrs Imran Siddiqui";
  const brideParents =
    data?.brideParents || data?.couple?.brideParents || "Mr & Mrs Faisal Chaudhry";

  const quranArabic =
    data?.sacred?.quranArabic ||
    data?.sacred?.surahArRum ||
    "وَمِنْ ءَايَـٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً";
  const quranSurah = data?.sacred?.quranSurah || "Surah Ar-Rum · 30:21";
  const urduBlessing = data?.sacred?.urduBlessing || "آپ کی شرکت ہمارے لیے باعثِ مسرت ہوگی";

  // Resolve personalized guest name from prop or ?to= query parameter
  useEffect(() => {
    if (guestNameProp) {
      setGuestName(sanitizeGuestParam(guestNameProp));
      return;
    }
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const toParam = params.get("to") || params.get("g");
      if (toParam) {
        setGuestName(sanitizeGuestParam(toParam));
      }
    }
  }, [guestNameProp]);

  // Handle casket opening with choreographed multi-phase pop-up & unfold
  const handleToggleCasket = useCallback(() => {
    if (isTriggered.current || isOpen) return;
    isTriggered.current = true;

    // Phase 1: Play opening sound IMMEDIATELY upon tap (zero latency)
    try {
      if (sfxOpenAudio.current) {
        sfxOpenAudio.current.currentTime = 0;
        sfxOpenAudio.current.play().catch(() => {});
      } else {
        playSfx("/templates/sheesh-mahal/audio/sfx-open.mp3");
      }
    } catch (_) {}

    // Phase 2: Casket lid smoothly opens upright (reveals mirror & candles)
    setTimeout(() => {
      setIsBoxOpen(true);
    }, 80);

    // Phase 3: Folded royal letter pops up from the open casket cavity
    setTimeout(() => {
      setIsPoppedUp(true);
      try {
        if (sfxLetterAudio.current) {
          sfxLetterAudio.current.currentTime = 0;
          sfxLetterAudio.current.play().catch(() => {});
        } else {
          playSfx("/templates/sheesh-mahal/audio/sfx-letter.mp3");
        }
      } catch (_) {}
    }, 550);

    // Phase 4: Letter smoothly unfolds 3-panels (reveals Surah & invitation text)
    setTimeout(() => {
      setIsOpen(true);
    }, 950);

    // Phase 5: Monogram wax seal stamps firmly onto the bottom of the parchment
    setTimeout(() => {
      setIsSealStamped(true);
      try {
        if (sfxSealAudio.current) {
          sfxSealAudio.current.currentTime = 0;
          sfxSealAudio.current.play().catch(() => {});
        }
      } catch (_) {}
    }, 1850);
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggleCasket();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="letter"
      className="letter"
      data-section="letter"
      aria-labelledby="letterFor"
    >
      <div className="lt-band lt-band-top" aria-hidden="true" />

      <header className="lt-head">
        <p className="lt-kicker">A letter for</p>
        <h2 className="lt-for" id="letterFor">
          <span data-guest>{guestName}</span>
        </h2>
      </header>

      <div className="lt-stage">
        {/* Parchment Letter Slot */}
        <div className="lt-slot">
          <article
            className={`lt-letter ${isPoppedUp ? "is-popped" : ""} ${isOpen ? "is-open" : ""}`}
            id="letterSheet"
            aria-label="Your letter"
          >
            {/* Panel 1 (Top): Sacred Quranic Verse */}
            <div className="lt-panel lt-panel-top">
              <p className="lt-verse" lang="ar" dir="rtl">
                {quranArabic}
              </p>
              <p className="lt-verse-en">
                &ldquo;And of His signs is that He created for you from
                yourselves mates that you may find tranquillity in them; and He
                placed between you affection and mercy.&rdquo;
              </p>
              <p className="lt-verse-ref">{quranSurah}</p>
              <p className="lt-rule" aria-hidden="true">
                <i />
              </p>
            </div>

            {/* Panel 2 (Mid): Greeting & Formal Parent Invitation Formula */}
            <div className="lt-panel lt-panel-mid">
              <p className="lt-greeting">
                Dear <span data-guest>{guestName}</span>,
              </p>
              <div className="lt-parents">
                <p className="lp-mr" data-lp="host-mr">
                  Mr &amp; Mrs
                </p>
                <p className="lp-name" data-lp="host-name">
                  {groomParents.replace(/^Mr & Mrs\s*/i, "")}
                </p>
                <p className="lp-line">
                  invite you to the wedding ceremony of their beloved{" "}
                  <span data-lp="child">son</span>
                </p>
                <p className="lp-couple" data-lp="own">
                  {groomName}
                </p>
                <p className="lp-with">with</p>
                <p className="lp-couple" data-lp="other">
                  {brideName}
                </p>
                <p className="lp-line">
                  <span data-lp="other-child">daughter</span> of
                </p>
                <p className="lp-mr" data-lp="other-mr">
                  Mr &amp; Mrs
                </p>
                <p className="lp-name" data-lp="other-name">
                  {brideParents.replace(/^Mr & Mrs\s*/i, "")}
                </p>
              </div>
            </div>

            {/* Panel 3 (Bottom): Poetic Narrative, Urdu Couplet & Wax Seal */}
            <div className="lt-panel lt-panel-bottom">
              <p className="lt-msg">
                We are getting married! After all the love and prayers that
                brought us here, we would be honoured to have you beside us as we
                begin our life together.
              </p>
              <p className="lt-msg">
                Come and celebrate with us in the hall of mirrors, where every
                candle shines a thousand times over, as our joy will with you
                there.
              </p>
              <p className="lt-urdu" lang="ur" dir="rtl">
                {urduBlessing}
              </p>
              <p className="lt-urdu-en">Your presence will be our joy.</p>
              <p className="lt-closing">With love and duas,</p>
              <p className="lt-sign">
                {groomName} &amp; {brideName}
              </p>

              {/* Monogram Seal Stamped upon Unfold Completion */}
              <div
                className={`lt-seal ${isSealStamped ? "is-stamped" : ""}`}
                aria-hidden="true"
              >
                <span className="lt-mono">
                  {groomName.charAt(0)}
                  <i>&amp;</i>
                  {brideName.charAt(0)}
                </span>
              </div>
            </div>
          </article>
        </div>

        {/* Velvet-Lined Casket Controller Button */}
        <div className="lt-keep">
          <button
            ref={casketRef}
            className={`lt-casket ${isBoxOpen ? "is-box-open" : ""} ${isOpen ? "is-open" : ""}`}
            id="casket"
            type="button"
            aria-controls="letterSheet"
            aria-expanded={isOpen ? "true" : "false"}
            aria-label="Open your invitation letter casket"
            onClick={handleToggleCasket}
            onKeyDown={handleKeyDown}
            disabled={isOpen}
          >
            <span className="c-lid-open" aria-hidden="true">
              <i className="c-sheen" />
            </span>
            <span className="c-body" aria-hidden="true" />
            <span className="c-front" aria-hidden="true" />
            <span className={`c-lid ${isBoxOpen ? "is-open" : ""}`} aria-hidden="true">
              <i className="c-glint" />
            </span>
            <span className="lt-sr sr-only">Open your letter</span>
          </button>
          <p
            className="lt-hint"
            aria-hidden="true"
            onClick={!isOpen ? handleToggleCasket : undefined}
            style={{ cursor: isOpen ? "default" : "pointer" }}
          >
            {isOpen ? "Your royal letter is open" : "Tap the casket to open your letter"}
          </p>
        </div>
      </div>

      <div className="lt-band lt-band-bottom" aria-hidden="true" />

      <style jsx>{`
        .letter {
          position: relative;
          width: 100%;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: url("/templates/sheesh-mahal/assets/letter/marble.webp") center top / 100% auto repeat-y, #f2ede3;
          color: #0b3d31;
          padding: 56px 16px;
          box-sizing: border-box;
          overflow: hidden;
        }
        .lt-band {
          position: absolute;
          left: 0;
          right: 0;
          height: 18px;
          background-image: url("/templates/sheesh-mahal/assets/letter/band.webp");
          background-repeat: repeat-x;
          background-size: auto 18px;
          z-index: 5;
        }
        .lt-band-top {
          top: 0;
        }
        .lt-band-bottom {
          bottom: 0;
        }
        .lt-head {
          text-align: center;
          margin-bottom: 24px;
          z-index: 10;
        }
        .lt-kicker {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 13px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #86662a;
          margin: 0 0 6px 0;
          font-weight: 600;
        }
        .lt-for {
          font-family: "Alex Brush", cursive;
          font-size: clamp(44px, 12cqi, 68px);
          line-height: 1.15;
          color: #86662a;
          margin: 0;
          font-weight: 400;
          filter: drop-shadow(0 1px 1px rgba(255, 255, 255, 0.8)) drop-shadow(0 2px 4px rgba(60, 36, 6, 0.25));
        }
        .lt-stage {
          position: relative;
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }
        .lt-slot {
          position: relative;
          width: 100%;
          perspective: 1400px;
          z-index: 15;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .lt-letter {
          --pb: clamp(20px, 5.5cqi, 36px);
          position: relative;
          width: 100%;
          background-color: #fbf8f2;
          border: var(--pb) solid transparent;
          border-image: url("/templates/sheesh-mahal/assets/letter/paper.webp") 86 fill / var(--pb) round;
          color: #0b3d31;
          box-shadow: 0 4px 16px rgba(60, 40, 10, 0.16), 0 24px 50px -8px rgba(50, 35, 10, 0.4);
          padding: clamp(18px, 5cqi, 34px) clamp(14px, 4cqi, 28px);
          box-sizing: border-box;
          transform-style: preserve-3d;
          max-height: 0;
          opacity: 0;
          transform: translateY(80px) scale(0.65);
          overflow: hidden;
          margin-bottom: 20px;
          pointer-events: none;
          transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
            opacity 0.5s ease,
            max-height 1s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        /* Phase 1: Folded Letter Pops Up from inside the open casket */
        .lt-letter.is-popped {
          opacity: 1;
          max-height: 280px;
          transform: translateY(0) scale(0.92);
          overflow: hidden;
          pointer-events: auto;
        }
        /* Phase 2: Letter fully unfolds smoothly in 3D */
        .lt-letter.is-open {
          max-height: 2400px;
          opacity: 1;
          transform: translateY(0) scale(1);
          overflow: visible;
        }

        /* 3D Fold Panels */
        .lt-panel {
          text-align: center;
          margin-bottom: 20px;
          transform-style: preserve-3d;
        }
        .lt-panel-top {
          transform-origin: bottom center;
          transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
        }
        .lt-letter:not(.is-open) .lt-panel-top {
          transform: rotateX(-90deg);
          opacity: 0;
          max-height: 0;
          overflow: hidden;
          margin: 0;
        }
        .lt-letter.is-open .lt-panel-top {
          transform: rotateX(0deg);
          opacity: 1;
          max-height: 600px;
        }

        .lt-panel-mid {
          transition: opacity 0.5s ease;
        }

        .lt-panel-bottom {
          transform-origin: top center;
          transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, opacity 0.5s ease 0.25s;
        }
        .lt-letter:not(.is-open) .lt-panel-bottom {
          transform: rotateX(90deg);
          opacity: 0;
          max-height: 0;
          overflow: hidden;
          margin: 0;
        }
        .lt-letter.is-open .lt-panel-bottom {
          transform: rotateX(0deg);
          opacity: 1;
          max-height: 1200px;
        }

        .lt-verse {
          font-family: "Amiri", "Amiri Quran", serif;
          font-size: clamp(18px, 5.5cqi, 24px);
          line-height: 1.9;
          color: #0b4a3b;
          margin: 0 0 8px 0;
          direction: rtl;
        }
        .lt-verse-en {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(13px, 3.8cqi, 15px);
          font-style: italic;
          color: #0b3d31d1;
          line-height: 1.5;
          margin: 0 0 4px 0;
        }
        .lt-verse-ref {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #86662a;
          margin: 0 0 16px 0;
          font-weight: 600;
        }
        .lt-rule {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 0 16px 0;
        }
        .lt-rule i {
          width: 80px;
          height: 1px;
          background: linear-gradient(to right, transparent, #c9a45c, transparent);
        }
        .lt-greeting {
          font-family: "Alex Brush", cursive;
          font-size: clamp(28px, 8cqi, 38px);
          color: #0b4a3b;
          margin: 0 0 16px 0;
          font-weight: 400;
        }
        .lt-parents {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-family: "Cormorant Garamond", serif;
          margin-bottom: 20px;
        }
        .lp-mr {
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #86662a;
          margin: 0;
        }
        .lp-name {
          font-size: clamp(17px, 4.5vw, 21px);
          font-weight: 600;
          color: #0b3d31;
          margin: 0;
        }
        .lp-line {
          font-size: 13px;
          font-style: italic;
          color: #2b594b;
          margin: 4px 0;
        }
        .lp-couple {
          font-family: "Alex Brush", cursive;
          font-size: clamp(28px, 7vw, 38px);
          color: #86662a;
          margin: 2px 0;
          line-height: 1.1;
        }
        .lp-with {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #86662a;
          margin: 2px 0;
        }
        .lt-msg {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(14px, 3.6vw, 16px);
          line-height: 1.6;
          color: #1a4d3e;
          margin: 0 0 14px 0;
        }
        .lt-urdu {
          font-family: "Noto Nastaliq Urdu", serif;
          font-size: clamp(18px, 4.8vw, 24px);
          line-height: 2.2;
          color: #0b4a3b;
          margin: 16px 0 4px 0;
          direction: rtl;
        }
        .lt-urdu-en {
          font-family: "Cormorant Garamond", serif;
          font-size: 13px;
          font-style: italic;
          color: #86662a;
          margin: 0 0 16px 0;
        }
        .lt-closing {
          font-family: "Cormorant Garamond", serif;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #86662a;
          margin: 0 0 2px 0;
        }
        .lt-sign {
          font-family: "Alex Brush", cursive;
          font-size: clamp(26px, 6.5vw, 36px);
          color: #0b3d31;
          margin: 0 0 24px 0;
        }
        .lt-seal {
          position: relative;
          width: 64px;
          height: 64px;
          margin: 16px auto 0;
          background-image: url("/templates/sheesh-mahal/assets/letter/seal.webp");
          background-size: cover;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(0.6) rotate(-15deg);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
        }
        .lt-seal.is-stamped {
          transform: scale(1) rotate(0deg);
          opacity: 1;
        }
        .lt-mono {
          font-family: "Alex Brush", cursive;
          font-size: 20px;
          color: #f5efe2;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
          font-weight: 700;
        }
        .lt-mono i {
          font-size: 14px;
          font-style: normal;
          margin: 0 2px;
        }
        .lt-keep {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          z-index: 20;
        }
        .lt-casket,
        .lt-casket.is-open,
        .lt-casket.is-box-open {
          position: relative;
          width: min(88vw, 360px);
          aspect-ratio: 1000 / 869;
          background: transparent;
          border: none;
          cursor: pointer;
          perspective: 1200px;
          transform-style: preserve-3d;
          transform: none !important;
          min-width: 44px;
          min-height: 44px;
          padding: 0;
          display: block;
          margin: 0 auto;
        }
        .lt-casket.is-open {
          cursor: default;
        }
        .c-body {
          position: absolute;
          inset: 0;
          background-image: url("/templates/sheesh-mahal/assets/letter/casket-open.webp");
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.4));
          transition: clip-path 0.5s ease;
        }
        /* When closed: clip open mirror lid so only the lower velvet body is visible */
        .lt-casket:not(.is-box-open) .c-body {
          clip-path: inset(44% 0 0 0);
        }
        /* When open: full casket is unclipped and displayed in all its glory */
        .lt-casket.is-box-open .c-body {
          clip-path: inset(0 0 0 0);
        }

        .c-lid {
          position: absolute;
          inset: 0;
          background-image: url("/templates/sheesh-mahal/assets/letter/casket-lid.webp");
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          transform-origin: center 48.5%;
          transform-style: preserve-3d;
          transition: transform 0.85s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease;
          z-index: 5;
        }
        /* When box opens: closed lid swings open and fades into the upright mirror lid of c-body */
        .lt-casket.is-box-open .c-lid {
          transform: rotateX(-120deg);
          opacity: 0;
          pointer-events: none;
        }

        .c-glint {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.4) 50%, transparent 60%);
          animation: lt-sheen 5.2s ease-in-out infinite;
        }
        @keyframes lt-sheen {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .lt-hint {
          margin-top: 14px;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 13px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #86662a;
          font-weight: 600;
          opacity: 0.9;
          animation: lt-float 2.5s ease-in-out infinite;
        }
        @keyframes lt-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </section>
  );
}
