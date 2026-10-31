"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface AudioDockProps {
  audioSrc?: string;
  isGateOpen?: boolean;
}

/**
 * Universal sound effect trigger helper.
 * Plays short interaction SFX respecting query suppression.
 */
export function playSfx(sfxPath: string) {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const nomusic = params.get("nomusic");
    if (nomusic === "" || nomusic === "1" || nomusic === "true") return;

    const fullPath = sfxPath.startsWith("/") ? sfxPath : `/templates/sheesh-mahal/audio/${sfxPath}`;
    const audio = new Audio(fullPath);
    audio.volume = 0.8;
    audio.play().catch(() => {});
  } catch {
    // Graceful fallback for environments blocking audio
  }
}

export default function AudioDock({
  audioSrc = "/templates/sheesh-mahal/audio/music.mp3",
  isGateOpen = false,
}: AudioDockProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSuppressed, setIsSuppressed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const rampIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasUserGestured = useRef(false);

  // Check URL query suppression flag (?nomusic)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const nomusic = params.get("nomusic");
      if (nomusic === "" || nomusic === "1" || nomusic === "true") {
        setIsSuppressed(true);
      }
    }
  }, []);

  // Initialize audio elements and context
  useEffect(() => {
    if (isSuppressed || typeof window === "undefined") return;

    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    // Check stored preference
    let savedPref: string | null = null;
    try {
      savedPref = localStorage.getItem("sm:music");
    } catch {}

    const shouldPlayByDefault = savedPref !== "off";

    // Setup Web Audio API gain node if available for smooth 2.5s ramp
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const source = ctx.createMediaElementSource(audio);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        source.connect(gain);
        gain.connect(ctx.destination);
        audioCtxRef.current = ctx;
        gainNodeRef.current = gain;
      }
    } catch {
      // Audio element fallback
    }

    // Tab visibility handling: fade out on hide, resume on refocus
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlayingRef.current && audioRef.current) {
          audioRef.current.pause();
        }
      } else {
        if (isPlayingRef.current && audioRef.current && hasUserGestured.current) {
          if (audioCtxRef.current?.state === "suspended") {
            audioCtxRef.current.resume().catch(() => {});
          }
          audioRef.current.play().catch(() => {});
        }
      }
    };

    // Listen to custom sound effect events
    const handleCustomSfx = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        playSfx(customEvent.detail);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("sm:sfx", handleCustomSfx);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("sm:sfx", handleCustomSfx);
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [audioSrc, isSuppressed]);

  /**
   * Executes smooth 2.5s volume gain ramp to target volume (0.6)
   */
  const rampVolume = useCallback((targetVol: number, durationSec: number = 2.5) => {
    if (audioCtxRef.current && gainNodeRef.current) {
      try {
        const ctx = audioCtxRef.current;
        const gain = gainNodeRef.current;
        const now = ctx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(targetVol, now + durationSec);
        return;
      } catch {}
    }

    // Fallback stepwise volume ramp for HTMLAudioElement
    if (!audioRef.current) return;
    if (rampIntervalRef.current) clearInterval(rampIntervalRef.current);

    const audio = audioRef.current;
    const startVol = audio.volume;
    const steps = 25;
    const stepTime = (durationSec * 1000) / steps;
    const volDelta = (targetVol - startVol) / steps;
    let stepCount = 0;

    rampIntervalRef.current = setInterval(() => {
      stepCount++;
      const nextVol = Math.max(0, Math.min(1, startVol + volDelta * stepCount));
      audio.volume = nextVol;
      if (stepCount >= steps) {
        audio.volume = targetVol;
        if (rampIntervalRef.current) clearInterval(rampIntervalRef.current);
      }
    }, stepTime);
  }, []);

  /**
   * Starts background audio on user gesture
   */
  const startAudio = useCallback(() => {
    if (isSuppressed || !audioRef.current) return;
    hasUserGestured.current = true;

    // Check localStorage
    try {
      if (localStorage.getItem("sm:music") === "off") return;
    } catch {}

    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }

    audioRef.current
      .play()
      .then(() => {
        isPlayingRef.current = true;
        setIsPlaying(true);
        rampVolume(0.6, 2.5);
        try {
          localStorage.setItem("sm:music", "on");
        } catch {}
      })
      .catch(() => {});
  }, [isSuppressed, rampVolume]);

  /**
   * Responsive trigger when gate opens
   */
  useEffect(() => {
    if (isGateOpen && !hasUserGestured.current) {
      startAudio();
    }
  }, [isGateOpen, startAudio]);

  /**
   * Manual toggle handler
   */
  const toggleAudio = () => {
    if (isSuppressed || !audioRef.current) return;
    hasUserGestured.current = true;

    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }

    if (isPlayingRef.current) {
      // Fade out and pause
      rampVolume(0, 0.5);
      isPlayingRef.current = false;
      fadeTimeoutRef.current = setTimeout(() => {
        audioRef.current?.pause();
        setIsPlaying(false);
        try {
          localStorage.setItem("sm:music", "off");
        } catch {}
        fadeTimeoutRef.current = null;
      }, 500);
    } else {
      isPlayingRef.current = true;
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().catch(() => {});
      }
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          rampVolume(0.6, 2.5);
          try {
            localStorage.setItem("sm:music", "on");
          } catch {}
        })
        .catch(() => {
          isPlayingRef.current = false;
          setIsPlaying(false);
        });
    }
  };

  if (isSuppressed) return null;

  return (
    <>
      <button
        id="soundToggle"
        type="button"
        className="sound-toggle music-toggle sm-music-toggle"
        aria-pressed={isPlaying ? "true" : "false"}
        aria-label={isPlaying ? "Sound is on" : "Sound is muted"}
        onClick={toggleAudio}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
        >
          {/* Speaker body */}
          <path className="spk" d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" />
          {/* Waves when playing */}
          {isPlaying ? (
            <path
              className="wave"
              d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          ) : (
            <path
              className="mute"
              d="M16 9.5l5 5M21 9.5l-5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      <style jsx>{`
        .sm-music-toggle {
          position: fixed;
          top: max(16px, env(safe-area-inset-top, 16px));
          right: max(16px, env(safe-area-inset-right, 16px));
          z-index: 100;
          width: 44px;
          height: 44px;
          min-width: 44px;
          min-height: 44px;
          border-radius: 9999px;
          background: rgba(3, 23, 15, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(230, 207, 152, 0.4);
          color: #e6cf98;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }
        .sm-music-toggle:hover {
          transform: scale(1.06);
          background: rgba(6, 42, 33, 0.85);
          border-color: #c9a45c;
        }
        .sm-music-toggle:active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
}
