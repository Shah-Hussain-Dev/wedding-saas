'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, WhatsappLogo, Clock, Sparkle, Sliders } from '@phosphor-icons/react';
import { VideoInvitation, generateVideoWhatsAppUrl } from '@/data/video-invitations';

interface VideoInvitationCardProps {
  video: VideoInvitation;
  onPreview: (video: VideoInvitation) => void;
}

export function VideoInvitationCard({ video, onPreview }: VideoInvitationCardProps) {
  const whatsAppUrl = generateVideoWhatsAppUrl(video);

  return (
    <div className="group relative flex flex-col rounded-2xl sm:rounded-3xl bg-stone-900/70 border border-stone-800/80 hover:border-amber-500/40 shadow-xl hover:shadow-2xl hover:shadow-amber-950/20 transition-all duration-300 overflow-hidden">
      {/* 9:16 Vertical Video Preview Container */}
      <div
        onClick={() => onPreview(video)}
        className="relative aspect-[9/16] w-full bg-stone-950 overflow-hidden cursor-pointer"
      >
        {/* Poster Image */}
        <Image
          src={video.posterUrl}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={video.id === 'royal-rajputana-heritage'}
        />

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-stone-950/30 opacity-70 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-stone-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 shadow-md">
            {video.categoryLabel}
          </span>
          {video.badge && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-amber-500 text-stone-950 shadow-md flex items-center gap-1">
              <Sparkle size={12} weight="fill" />
              {video.badge}
            </span>
          )}
        </div>

        {/* Duration Badge Bottom Right of Visual */}
        <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-stone-950/85 backdrop-blur-md text-stone-200 border border-stone-700/50 flex items-center gap-1 shadow-sm">
          <Clock size={13} weight="bold" className="text-amber-400" />
          {video.durationFormatted}
        </div>

        {/* Play Icon Trigger Button in Center */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500/90 text-stone-950 flex items-center justify-center shadow-xl transform scale-95 group-hover:scale-110 group-active:scale-90 transition-all duration-300">
            <Play size={24} weight="fill" className="ml-1" />
          </div>
        </div>

        {/* Hover Cue Banner */}
        <div className="absolute bottom-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-xs font-semibold text-amber-300 bg-black/75 px-2.5 py-1 rounded-md backdrop-blur-sm border border-amber-500/30">
            Click to Watch
          </span>
        </div>
      </div>

      {/* Card Information & Action Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3 bg-stone-900/90">
        <div>
          <h3
            onClick={() => onPreview(video)}
            className="text-base sm:text-lg font-serif font-bold text-stone-100 hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {video.title}
          </h3>
          <p className="text-xs text-amber-400/90 font-medium line-clamp-1 mt-0.5">
            {video.subtitle}
          </p>
          <p className="text-xs text-stone-400 line-clamp-2 mt-2 leading-relaxed">
            {video.description}
          </p>
        </div>

        {/* Action Buttons: Preview, Studio Edit & WhatsApp */}
        <div className="pt-2 border-t border-stone-800/80 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {/* Quick Preview Button */}
            <button
              onClick={() => onPreview(video)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700/70 hover:border-amber-500/40 transition-colors cursor-pointer"
            >
              <Play size={13} weight="fill" />
              <span>Watch</span>
            </button>

            {/* Customize in Video Studio */}
            <Link
              href="/studio"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition-colors cursor-pointer"
            >
              <Sliders size={13} weight="bold" />
              <span>Edit Video</span>
            </Link>
          </div>

          {/* WhatsApp CTA Button */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <WhatsappLogo size={15} weight="fill" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
