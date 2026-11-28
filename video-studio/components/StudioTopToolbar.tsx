'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowCounterClockwise,
  ArrowClockwise,
  Play,
  Pause,
  DownloadSimple,
  Sparkle,
  CheckCircle,
} from '@phosphor-icons/react';
import { useVideoEditorStore } from '@/video-studio/stores/useVideoEditorStore';

interface StudioTopToolbarProps {
  onOpenExport: () => void;
}

export function StudioTopToolbar({ onOpenExport }: StudioTopToolbarProps) {
  const {
    project,
    isPlaying,
    setIsPlaying,
    undo,
    redo,
    canUndo,
    canRedo,
    zoom,
    setZoom,
  } = useVideoEditorStore();

  return (
    <header className="h-14 bg-stone-900 border-b border-stone-800 px-4 flex items-center justify-between gap-3 text-stone-100 z-30 shrink-0">
      {/* Left: Logo & Project Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/videos"
          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
          title="Back to Video Gallery"
        >
          <ArrowLeft size={18} weight="bold" />
        </Link>

        <div>
          <span className="font-serif font-bold text-sm sm:text-base text-amber-300 flex items-center gap-1.5">
            <Sparkle size={14} weight="fill" className="text-amber-400" />
            WedInvites Video Studio
          </span>
          <span className="hidden sm:inline-block text-[11px] text-stone-400 truncate max-w-[200px]">
            {project.title}
          </span>
        </div>
      </div>

      {/* Center: Play/Pause, Undo/Redo & Zoom Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-1.5 rounded-lg hover:bg-stone-800 disabled:opacity-40 text-stone-300 transition cursor-pointer"
          title="Undo"
        >
          <ArrowCounterClockwise size={18} weight="bold" />
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-1.5 rounded-lg hover:bg-stone-800 disabled:opacity-40 text-stone-300 transition cursor-pointer"
          title="Redo"
        >
          <ArrowClockwise size={18} weight="bold" />
        </button>

        <div className="h-4 w-[1px] bg-stone-800 mx-1" />

        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          {isPlaying ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        {/* Zoom Selector */}
        <div className="hidden md:flex items-center gap-1 text-xs text-stone-400 pl-2">
          <span>Zoom:</span>
          <select
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="bg-stone-800 border border-stone-700 rounded px-1.5 py-0.5 text-xs text-stone-200"
          >
            <option value={75}>75%</option>
            <option value={100}>100%</option>
            <option value={125}>125%</option>
          </select>
        </div>
      </div>

      {/* Right: Export & Auto-Save Badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
          <CheckCircle size={12} weight="fill" />
          Auto-Saved
        </span>

        <button
          onClick={onOpenExport}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition active:scale-95 cursor-pointer"
        >
          <DownloadSimple size={16} weight="bold" />
          <span>Export MP4</span>
        </button>
      </div>
    </header>
  );
}
