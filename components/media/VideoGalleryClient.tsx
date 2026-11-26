'use client';

import React, { useState, useMemo } from 'react';
import { Play, Sparkle, WhatsappLogo, FilmSlate, CheckCircle, DeviceMobile } from '@phosphor-icons/react';
import { VIDEO_INVITATIONS, VIDEO_CATEGORIES, VideoInvitation, generateGenericWhatsAppUrl, WHATSAPP_CONTACT } from '@/data/video-invitations';
import { VideoInvitationCard } from '@/components/media/VideoInvitationCard';
import { VideoPlayerModal } from '@/components/media/VideoPlayerModal';

export function VideoGalleryClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeVideo, setActiveVideo] = useState<VideoInvitation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'all') {
      return VIDEO_INVITATIONS;
    }
    return VIDEO_INVITATIONS.filter((video) => video.category === selectedCategory);
  }, [selectedCategory]);

  const handleOpenPreview = (video: VideoInvitation) => {
    setActiveVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const genericWhatsAppUrl = generateGenericWhatsAppUrl();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Decorative Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full" />
        <div className="absolute top-[35%] right-0 w-[450px] h-[450px] bg-rose-500/5 blur-[130px] rounded-full" />
        <div className="absolute top-[65%] left-0 w-[500px] h-[500px] bg-amber-600/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium mb-5 shadow-sm">
            <Sparkle size={14} weight="fill" className="text-amber-400" />
            <span>Cinematic Mobile Video Invitations</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-stone-100 leading-tight">
            Make Your Wedding Invitation <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">Unforgettable!</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-stone-300/80 leading-relaxed max-w-2xl mx-auto">
            Beautifully crafted wedding invitation videos to make your special moments even more memorable. Designed for Instagram Reels, WhatsApp status, and high-impact guest sharing.
          </p>

          {/* Quick CTA Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="#explore-videos"
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-950/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              Explore Invitation Videos
            </a>

            <a
              href={genericWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 hover:border-emerald-500/40 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <WhatsappLogo size={18} weight="fill" className="text-emerald-400" />
              <span>Custom Video Enquiry</span>
            </a>
          </div>

          {/* Value Props Row */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs text-stone-400">
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-stone-900/40 border border-stone-800/60">
              <DeviceMobile size={16} weight="bold" className="text-amber-400" />
              <span>9:16 Mobile-Optimized</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-stone-900/40 border border-stone-800/60">
              <FilmSlate size={16} weight="bold" className="text-amber-400" />
              <span>Full HD 1080p Quality</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 p-2.5 rounded-lg bg-stone-900/40 border border-stone-800/60">
              <CheckCircle size={16} weight="fill" className="text-emerald-400" />
              <span>Ready in 24 Hours</span>
            </div>
          </div>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div id="explore-videos" className="scroll-mt-24 mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-stone-800/80 pb-4">
            <div className="flex items-center gap-2 text-stone-300 font-serif text-lg">
              <FilmSlate size={20} weight="bold" className="text-amber-400" />
              <span>Video Collections ({filteredVideos.length})</span>
            </div>

            {/* Horizontal Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-thin">
              {VIDEO_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-950/30'
                        : 'bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* VIDEO PRODUCT CARDS GRID */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredVideos.map((video) => (
              <VideoInvitationCard
                key={video.id}
                video={video}
                onPreview={handleOpenPreview}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-stone-900/30 rounded-3xl border border-stone-800/80 p-8">
            <p className="text-stone-400 text-sm">No videos found for this collection.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition cursor-pointer"
            >
              View All Collections
            </button>
          </div>
        )}

        {/* BOTTOM WHATSAPP CUSTOMIZATION BANNER */}
        <div className="mt-20 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900/90 to-stone-900 border border-amber-500/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
              Need a Bespoke Video Invitation or Custom Song?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300/80 mt-2 leading-relaxed">
              We customize any video invitation with your love story photos, couple animations, preferred background music, and multi-lingual text in English, Hindi, Urdu, Gujarati, and more.
            </p>
          </div>

          <a
            href={genericWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shrink-0 cursor-pointer"
          >
            <WhatsappLogo size={20} weight="fill" />
            <span>Chat on WhatsApp: {WHATSAPP_CONTACT.displayNumber}</span>
          </a>
        </div>
      </div>

      {/* VIDEO PREVIEW MODAL */}
      <VideoPlayerModal
        video={activeVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
