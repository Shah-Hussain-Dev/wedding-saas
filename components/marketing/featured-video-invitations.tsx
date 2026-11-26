'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkle,
  ArrowRight,
  Play,
  WhatsappLogo,
  FilmSlate,
  Clock,
  DeviceMobile,
  CheckCircle,
} from '@phosphor-icons/react';
import { VIDEO_INVITATIONS, VideoInvitation, generateVideoWhatsAppUrl } from '@/data/video-invitations';
import { VideoPlayerModal } from '@/components/media/VideoPlayerModal';

export function FeaturedVideoInvitations() {
  const [activeVideo, setActiveVideo] = useState<VideoInvitation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Feature top 3 high-impact distinct styles
  const featuredVideos = VIDEO_INVITATIONS.slice(0, 3);

  const handleOpenPreview = (video: VideoInvitation) => {
    setActiveVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section
      id="video-invitations"
      className="relative py-20 sm:py-28 bg-[#032A23] text-[#F7F4ED] overflow-hidden select-none border-t border-[#C8A45E]/20"
    >
      {/* Background Ambience Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(200,164,94,0.18)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[radial-gradient(circle,rgba(7,61,49,0.5)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#C8A45E]/40 text-[#E1C98E] text-[11px] font-bold tracking-[0.25em] uppercase font-sans backdrop-blur-md mb-4 shadow-sm">
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
            New Feature · Video Invitations
            <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-5xl font-normal leading-[1.15] tracking-tight text-[#F7F4ED]">
            Make Your Wedding Invitation <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#E1C98E]">Unforgettable!</span>
          </h2>

          <p className="mt-4 text-xs sm:text-base text-stone-300 font-sans max-w-2xl mx-auto leading-relaxed">
            Beyond interactive web pages and printable PDFs, surprise your family &amp; friends with cinematic 9:16 mobile video invitations ready for WhatsApp status &amp; Instagram Reels.
          </p>
        </div>

        {/* Featured Video Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {featuredVideos.map((video) => {
            const whatsAppUrl = generateVideoWhatsAppUrl(video);
            return (
              <div
                key={video.id}
                className="group relative flex flex-col rounded-2xl sm:rounded-3xl bg-[#021A15]/80 border border-[#C8A45E]/30 hover:border-[#E1C98E]/70 shadow-2xl hover:shadow-[0_20px_50px_rgba(200,164,94,0.15)] transition-all duration-300 overflow-hidden"
              >
                {/* 9:16 Visual Poster Container */}
                <div
                  onClick={() => handleOpenPreview(video)}
                  className="relative aspect-[9/16] w-full bg-black/80 overflow-hidden cursor-pointer"
                >
                  <Image
                    src={video.posterUrl}
                    alt={video.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient Shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021A15] via-transparent to-black/40 opacity-80 group-hover:opacity-50 transition-opacity duration-300" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold tracking-wider uppercase bg-[#032A23]/90 backdrop-blur-md text-[#E1C98E] border border-[#C8A45E]/40 shadow-md">
                      {video.categoryLabel}
                    </span>
                    {video.badge && (
                      <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold tracking-wider bg-[#C8A45E] text-[#032A23] shadow-md flex items-center gap-1">
                        <Sparkle size={11} weight="fill" />
                        {video.badge}
                      </span>
                    )}
                  </div>

                  {/* Duration Badge Bottom Right */}
                  <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-black/80 backdrop-blur-md text-[#F7F4ED] border border-white/15 flex items-center gap-1 shadow-sm">
                    <Clock size={12} weight="bold" className="text-[#E1C98E]" />
                    {video.durationFormatted}
                  </div>

                  {/* Big Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#C8A45E] to-[#E1C98E] text-[#032A23] flex items-center justify-center shadow-2xl transform scale-95 group-hover:scale-110 group-active:scale-95 transition-all duration-300">
                      <Play size={24} weight="fill" className="ml-1" />
                    </div>
                  </div>

                  {/* Click To Watch Tip */}
                  <div className="absolute bottom-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-[11px] font-bold text-[#032A23] bg-[#E1C98E] px-2.5 py-1 rounded-md shadow-md">
                      Watch Video
                    </span>
                  </div>
                </div>

                {/* Video Info Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3 bg-[#032A23]/90">
                  <div>
                    <h3
                      onClick={() => handleOpenPreview(video)}
                      className="text-base sm:text-lg font-serif font-bold text-[#F7F4ED] hover:text-[#E1C98E] transition-colors line-clamp-1 cursor-pointer"
                    >
                      {video.title}
                    </h3>
                    <p className="text-xs text-[#E1C98E] font-medium line-clamp-1 mt-0.5">
                      {video.subtitle}
                    </p>
                    <p className="text-xs text-stone-300 line-clamp-2 mt-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* Action CTA Buttons */}
                  <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      onClick={() => handleOpenPreview(video)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-[#F7F4ED] border border-white/15 hover:border-[#C8A45E]/40 transition-colors cursor-pointer"
                    >
                      <Play size={13} weight="fill" />
                      <span>Watch Preview</span>
                    </button>

                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] text-stone-950 shadow-md shadow-black/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                    >
                      <WhatsappLogo size={16} weight="fill" />
                      <span>Enquire</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore All Gallery CTA Link */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href="/videos"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#C8A45E] via-[#E1C98E] to-[#C8A45E] hover:from-[#E1C98E] hover:to-[#C8A45E] text-[#032A23] text-xs sm:text-sm font-bold tracking-widest uppercase font-sans transition-all duration-300 shadow-[0_15px_40px_rgba(200,164,94,0.3)] hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            <span>Explore All Invitation Videos ({VIDEO_INVITATIONS.length})</span>
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>

      {/* Video Preview Modal */}
      <VideoPlayerModal
        video={activeVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
