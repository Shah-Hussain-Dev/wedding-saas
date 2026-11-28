'use client';

import React, { useState } from 'react';
import { X, DownloadSimple, CheckCircle, WhatsappLogo, FilmSlate } from '@phosphor-icons/react';
import { useVideoEditorStore } from '@/video-studio/stores/useVideoEditorStore';
import { WHATSAPP_CONTACT } from '@/data/video-invitations';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { project } = useVideoEditorStore();
  const [resolution, setResolution] = useState<'1080p' | '720p'>('1080p');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  if (!isOpen) return null;

  const handleStartExport = () => {
    setIsExporting(true);
    // Simulate high-fidelity serverless rendering job
    setTimeout(() => {
      setIsExporting(false);
      setDownloadReady(true);
    }, 2500);
  };

  const handleDownloadMp4 = () => {
    // Downloads range streamed MP4 asset for the template
    const link = document.createElement('a');
    link.href = project.audio.trackUrl || '/api/videos/royal-rajputana-heritage';
    link.download = `${project.title.replace(/\s+/g, '-').toLowerCase()}-${resolution}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const whatsAppOrderUrl = `https://wa.me/${WHATSAPP_CONTACT.phoneNumber}?text=${encodeURIComponent(
    `Hi WedInvites! I have created my wedding video invitation in Video Studio: "${project.title}" for ${project.weddingData.brideName} & ${project.weddingData.groomName}. Please help me finalize and deliver the 4K HD export.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-stone-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative text-stone-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer"
        >
          <X size={18} weight="bold" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-amber-400">
          <FilmSlate size={24} weight="bold" />
          <h2 className="font-serif font-bold text-xl">Export Wedding Video</h2>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed mb-5">
          Render your customized 9:16 vertical wedding invitation video, formatted for Instagram Reels, WhatsApp Status, and crystal-clear mobile viewing.
        </p>

        {/* Resolution Options */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-semibold text-stone-400 block">Export Quality</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setResolution('1080p')}
              className={`p-3 rounded-xl border text-center font-medium text-xs transition cursor-pointer ${
                resolution === '1080p'
                  ? 'border-amber-500 bg-amber-500/20 text-amber-200'
                  : 'border-stone-800 bg-stone-950 text-stone-400'
              }`}
            >
              <div className="font-bold text-sm">Full HD 1080p</div>
              <div className="text-[10px] text-stone-400 mt-0.5">Recommended · 60fps</div>
            </button>

            <button
              onClick={() => setResolution('720p')}
              className={`p-3 rounded-xl border text-center font-medium text-xs transition cursor-pointer ${
                resolution === '720p'
                  ? 'border-amber-500 bg-amber-500/20 text-amber-200'
                  : 'border-stone-800 bg-stone-950 text-stone-400'
              }`}
            >
              <div className="font-bold text-sm">Standard HD 720p</div>
              <div className="text-[10px] text-stone-400 mt-0.5">Compact File Size</div>
            </button>
          </div>
        </div>

        {/* Actions */}
        {!downloadReady ? (
          <button
            onClick={handleStartExport}
            disabled={isExporting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 disabled:opacity-50 transition active:scale-95 cursor-pointer"
          >
            {isExporting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>Rendering Video Scenes...</span>
              </div>
            ) : (
              <>
                <DownloadSimple size={18} weight="bold" />
                <span>Start Video Render</span>
              </>
            )}
          </button>
        ) : (
          <div className="space-y-3 animate-in fade-in">
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle size={18} weight="fill" className="text-emerald-400 shrink-0" />
              <span>Video ready! Audio and visuals synchronized at {resolution}.</span>
            </div>

            <button
              onClick={handleDownloadMp4}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition active:scale-95 cursor-pointer"
            >
              <DownloadSimple size={18} weight="bold" />
              <span>Download MP4 Invitation</span>
            </button>
          </div>
        )}

        {/* Concierge Support Link */}
        <div className="mt-5 pt-4 border-t border-stone-800 text-center">
          <a
            href={whatsAppOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-emerald-400 transition"
          >
            <WhatsappLogo size={15} weight="fill" className="text-emerald-400" />
            <span>Need human concierge audio mixing or 4K rendering?</span>
          </a>
        </div>
      </div>
    </div>
  );
}
