"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Play, Pause } from "@phosphor-icons/react";

/** Drop your hero video at public/videos/hero-preview.mp4 */
const VIDEO_SRC = "/videos/hero-preview.mp4";
/** Optional poster at public/images/hero-poster.jpg */
const POSTER_SRC = "/images/hero-poster.jpg";

export function HeroPhonePreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v || !videoReady) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const showFallback = videoError || !videoReady;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1], delay: 0.3 }}
      className="relative z-20 mx-auto w-[240px] sm:w-[270px] md:w-[300px]"
    >
      <div className="absolute -inset-10 bg-gradient-to-b from-accent-gold/12 via-primary/4 to-transparent rounded-full blur-3xl -z-10" />

      <div className="relative rounded-[2.75rem] border-[5px] border-[#1a1a1a] bg-[#1a1a1a] shadow-[0_25px_80px_rgba(8,47,39,0.22)] p-[3px]">
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[28%] h-[22px] bg-[#1a1a1a] rounded-full z-30 pointer-events-none" />

        <div className="relative rounded-[2.4rem] overflow-hidden aspect-[9/19.5] bg-[#082F27]">
          {!videoError && (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster={POSTER_SRC}
              onLoadedData={() => setVideoReady(true)}
              onError={() => setVideoError(true)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                videoReady ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <source src={VIDEO_SRC} type="video/mp4" />
            </video>
          )}

          {showFallback && <HeroPreviewFallback />}

          {videoReady && (
            <button
              onClick={togglePlay}
              className="absolute bottom-4 right-4 z-30 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-primary hover:scale-105 transition-transform"
              aria-label={isPlaying ? "Pause preview" : "Play preview"}
            >
              {isPlaying ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
            </button>
          )}

          <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none z-20" />
        </div>
      </div>

      <Link
        href={`/preview/emerald-noir/interactive`}
        className="block text-center mt-5 text-[10px] uppercase tracking-wider font-bold text-stone-400 hover:text-accent-gold transition-colors"
      >
        Tap to open full demo →
      </Link>
    </motion.div>
  );
}

function HeroPreviewFallback() {
  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-[#0a352b] via-[#082F27] to-[#061c17] z-[5]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(184,151,48,0.18)_0%,transparent_50%)]" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="mb-5"
        >
          <svg viewBox="0 0 88 64" className="w-24 h-18 drop-shadow-lg" fill="none">
            <rect x="6" y="14" width="76" height="46" rx="5" fill="#F5EDD8" stroke="#B89730" strokeWidth="1.5" />
            <path d="M6 18 L44 42 L82 18" stroke="#B89730" strokeWidth="1.5" />
            <circle cx="44" cy="38" r="10" fill="#B89730" opacity="0.25" />
            <text x="44" y="42" textAnchor="middle" fill="#082F27" fontSize="9" fontFamily="Georgia, serif">A&R</text>
          </svg>
        </motion.div>

        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[9px] uppercase tracking-[0.3em] text-accent-gold mb-2"
        >
          Tap to Open
        </motion.span>
        <h3 className="font-serif text-2xl text-white leading-tight">
          Aisha <span className="text-accent-gold italic text-lg">&amp;</span> Rohan
        </h3>
        <p className="text-[10px] text-stone-300 tracking-widest mt-1">14 · February · 2026</p>

        <div className="flex gap-[3px] items-end h-5 mt-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="w-[3px] bg-accent-gold/70 rounded-full"
              animate={{ height: ["6px", "18px", "8px", "14px", "6px"] }}
              transition={{ repeat: Infinity, duration: 1.1, delay: i * 0.12, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>

      <p className="py-3 text-[7px] font-mono tracking-[0.3em] text-accent-gold/40 text-center border-t border-white/5">
        VIDEO PREVIEW COMING SOON
      </p>
    </div>
  );
}
