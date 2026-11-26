'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Play,
  Pause,
  SpeakerHigh,
  SpeakerSlash,
  CornersOut,
  WhatsappLogo,
  Sparkle,
  Clock,
  CheckCircle,
} from '@phosphor-icons/react';
import { VideoInvitation, generateVideoWhatsAppUrl, WHATSAPP_CONTACT } from '@/data/video-invitations';

interface VideoPlayerModalProps {
  video: VideoInvitation | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPlayerModal({ video, isOpen, onClose }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync modal open state and handle ESC key
  useEffect(() => {
    if (!isOpen) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock scroll on background
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Autoplay on mount when modal opens (user initiated click)
  useEffect(() => {
    if (isOpen && videoRef.current) {
      setIsLoading(true);
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // If autoplay with sound is blocked, fallback muted
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
          });
      }
    }
  }, [video, isOpen]);

  if (!isOpen || !video || !mounted) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if ((videoRef.current as any).webkitRequestFullscreen) {
      (videoRef.current as any).webkitRequestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const whatsAppUrl = generateVideoWhatsAppUrl(video);

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-start md:justify-center p-2 pt-3 sm:p-4 md:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl flex flex-col md:flex-row bg-stone-900/98 border border-amber-500/30 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden mt-1 mb-4 md:my-auto"
      >
        {/* Floating Close Button - Solid and always reachable */}
        <button
          onClick={onClose}
          aria-label="Close video player modal"
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-50 p-2.5 rounded-full bg-black/80 hover:bg-black border border-white/20 text-white transition-all duration-200 shadow-2xl cursor-pointer"
        >
          <X size={20} weight="bold" />
        </button>

        {/* Video Player Section */}
        <div className="relative md:w-[48%] flex items-center justify-center bg-black p-2 sm:p-3 md:p-4">
          <div className="relative aspect-[9/16] w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] max-h-[50vh] sm:max-h-[58vh] md:max-h-[78vh] rounded-xl overflow-hidden shadow-2xl bg-black border border-stone-800 flex items-center justify-center group">
            {/* Native Video Element with Range-based Next.js API stream */}
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.posterUrl}
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onWaiting={() => setIsLoading(true)}
              onPlaying={() => setIsLoading(false)}
              onLoadedData={() => setIsLoading(false)}
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              className="w-full h-full object-contain cursor-pointer"
            />

            {/* Loading Spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                <div className="w-10 h-10 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              </div>
            )}

            {/* Play/Pause Large Center Overlay Indicator */}
            {!isPlaying && !isLoading && (
              <button
                onClick={togglePlay}
                aria-label="Play video"
                className="absolute z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500/95 text-stone-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <Play size={26} weight="fill" className="ml-1" />
              </button>
            )}

            {/* Custom On-Player Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2.5 sm:p-3 pt-6 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              {/* Progress Slider */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />

              <div className="flex items-center justify-between text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-1 text-stone-200 hover:text-amber-400 transition cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={15} weight="fill" /> : <Play size={15} weight="fill" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-1 text-stone-200 hover:text-amber-400 transition cursor-pointer"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <SpeakerSlash size={15} weight="bold" className="text-red-400" /> : <SpeakerHigh size={15} weight="bold" />}
                  </button>
                  <span className="font-mono text-[10.5px] text-stone-400">
                    {formatSeconds(currentTime)} / {video.durationFormatted}
                  </span>
                </div>

                <button
                  onClick={handleFullscreen}
                  className="p-1 text-stone-300 hover:text-amber-400 transition cursor-pointer"
                  aria-label="Fullscreen"
                >
                  <CornersOut size={15} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info & WhatsApp Action Section */}
        <div className="md:w-[52%] p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[38vh] sm:max-h-[40vh] md:max-h-[82vh] bg-stone-900">
          <div>
            {/* Category & Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold tracking-wide uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {video.categoryLabel}
              </span>
              {video.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {video.badge}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-400 ml-auto font-mono">
                <Clock size={13} weight="bold" className="text-stone-500" /> {video.durationFormatted}
              </span>
            </div>

            {/* Title & Subtitle */}
            <h2 id="video-modal-title" className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-stone-100 leading-tight">
              {video.title}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-amber-400/90 mt-1">{video.subtitle}</p>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-300/80 leading-relaxed mt-2.5 sm:mt-3">
              {video.description}
            </p>

            {/* Key Highlights */}
            <div className="mt-3.5 pt-2.5 sm:pt-3 border-t border-stone-800">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                <Sparkle size={13} weight="fill" className="text-amber-400" /> Features & Highlights
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs text-stone-300">
                {video.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle size={13} weight="fill" className="text-amber-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended For */}
            <div className="mt-2.5 text-xs text-stone-400">
              <span className="font-semibold text-stone-300">Recommended for:</span> {video.recommendedFor}
            </div>
          </div>

          {/* Action Call to Action */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-stone-800/80 flex flex-col gap-1.5">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 hover:shadow-emerald-900/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <WhatsappLogo size={18} weight="fill" />
              <span>Enquire on WhatsApp</span>
            </a>
            <p className="text-[10.5px] text-center text-stone-400">
              Direct enquiry to <strong className="text-stone-300">{WHATSAPP_CONTACT.displayNumber}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
