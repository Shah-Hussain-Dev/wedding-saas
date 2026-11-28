'use client';

import React, { useState } from 'react';
import {
  TextT,
  Sparkle,
  MusicNotes,
  SquaresFour,
  FilmSlate,
  Eye,
  EyeSlash,
  CaretUp,
  CaretDown,
  Trash,
  Plus,
  ArrowClockwise,
  Check,
} from '@phosphor-icons/react';
import { useVideoEditorStore } from '@/video-studio/stores/useVideoEditorStore';
import { VIDEO_STUDIO_TEMPLATES, getStudioTemplateProject } from '@/video-studio/templates';
import { VideoStudioTemplateMetadata, VideoStudioScene } from '@/video-studio/types';

const WEBSITE_TEMPLATES_LIST = [
  { id: 'imperial-palace', name: 'Imperial Palace', style: 'Royal Heritage' },
  { id: 'noor-e-nikah', name: 'Noor-e-Nikah', style: 'Sacred Nikah' },
  { id: 'celestial-rose', name: 'Celestial Rose', style: 'Awwwards 3D' },
  { id: 'gul-e-noor', name: 'Gul-e-Noor', style: 'Mughal Garden' },
  { id: 'crimson-royale', name: 'Crimson Royale', style: 'Velvet Heritage' },
  { id: 'emerald-qasr', name: 'Emerald Qasr', style: 'Ottoman Royale' },
  { id: 'sheesh-mahal', name: 'Sheesh Mahal', style: 'Mirror Palace' },
  { id: 'royal-heritage', name: 'Royal Heritage', style: 'Traditional Vivah' },
];

export function StudioLeftSidebar() {
  const [activeTab, setActiveTab] = useState<'sections' | 'wedding' | 'text' | 'audio' | 'templates'>('sections');
  const {
    project,
    setProject,
    activeSceneId,
    setActiveSceneId,
    addLayer,
    applyWeddingData,
    updateAudio,
    toggleScene,
    removeScene,
    reorderScenes,
    updateScene,
    addScene,
    loadFromWebsiteTemplate,
  } = useVideoEditorStore();

  const handleAddText = (type: 'heading' | 'subheading' | 'body') => {
    const textPresets = {
      heading: { text: 'Sacred Vivah Ceremony', fontSize: 64, fontWeight: 700 },
      subheading: { text: 'Sunday, 14 February 2027', fontSize: 32, fontWeight: 600 },
      body: { text: 'Together with our families, we invite you', fontSize: 22, fontWeight: 400 },
    };

    const preset = textPresets[type];
    addLayer(activeSceneId, {
      id: `text-${Date.now()}`,
      type: 'text',
      name: `${type.toUpperCase()} Layer`,
      text: preset.text,
      fontFamily: 'serif',
      fontSize: preset.fontSize,
      fontWeight: preset.fontWeight,
      color: '#F7F4ED',
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: 2,
      x: 50,
      y: 50,
      width: 700,
      height: 70,
      rotation: 0,
      opacity: 1,
      zIndex: 10,
      animation: 'fadeIn',
      animationDurationFrames: 30,
    });
  };

  const handleAdjustDuration = (sceneId: string, currentFrames: number, deltaSeconds: number) => {
    const newFrames = Math.max(project.fps * 2, currentFrames + Math.round(deltaSeconds * project.fps));
    updateScene(sceneId, { durationFrames: newFrames });
  };

  return (
    <aside className="w-80 bg-stone-900 border-r border-stone-800 flex flex-col z-20 shrink-0 select-none">
      {/* Tab Navigation Icons */}
      <div className="flex border-b border-stone-800 bg-stone-950/70 p-1">
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 py-2 text-[11px] font-semibold rounded-lg flex flex-col items-center gap-1 transition cursor-pointer ${
            activeTab === 'sections' ? 'bg-stone-800 text-amber-300' : 'text-stone-400 hover:text-stone-200'
          }`}
          title="Manage & Toggle Video Sections"
        >
          <FilmSlate size={17} weight="bold" />
          <span>Sections</span>
        </button>

        <button
          onClick={() => setActiveTab('wedding')}
          className={`flex-1 py-2 text-[11px] font-semibold rounded-lg flex flex-col items-center gap-1 transition cursor-pointer ${
            activeTab === 'wedding' ? 'bg-stone-800 text-amber-300' : 'text-stone-400 hover:text-stone-200'
          }`}
          title="Couple & Event Details"
        >
          <Sparkle size={17} weight="bold" />
          <span>Wedding</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2 text-[11px] font-semibold rounded-lg flex flex-col items-center gap-1 transition cursor-pointer ${
            activeTab === 'text' ? 'bg-stone-800 text-amber-300' : 'text-stone-400 hover:text-stone-200'
          }`}
          title="Add Typography"
        >
          <TextT size={17} weight="bold" />
          <span>Text</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`flex-1 py-2 text-[11px] font-semibold rounded-lg flex flex-col items-center gap-1 transition cursor-pointer ${
            activeTab === 'audio' ? 'bg-stone-800 text-amber-300' : 'text-stone-400 hover:text-stone-200'
          }`}
          title="Soundtrack & Music"
        >
          <MusicNotes size={17} weight="bold" />
          <span>Audio</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-2 text-[11px] font-semibold rounded-lg flex flex-col items-center gap-1 transition cursor-pointer ${
            activeTab === 'templates' ? 'bg-stone-800 text-amber-300' : 'text-stone-400 hover:text-stone-200'
          }`}
          title="Themes & Templates"
        >
          <SquaresFour size={17} weight="bold" />
          <span>Themes</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {/* ========================================================= */}
        {/* 1. SECTIONS MANAGER TAB (Toggle & Remove Unneeded Sections) */}
        {/* ========================================================= */}
        {activeTab === 'sections' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-200">Video Sections</h3>
                <p className="text-[10px] text-stone-400">Toggle or remove scenes to customize your reel</p>
              </div>
              <button
                onClick={() => addScene(activeSceneId)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-amber-300 text-[10.5px] font-semibold transition cursor-pointer"
              >
                <Plus size={12} weight="bold" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2 mt-2">
              {project.scenes.map((scene: VideoStudioScene, idx: number) => {
                const isEnabled = scene.enabled !== false;
                const isSelected = scene.id === activeSceneId;
                const durationSec = (scene.durationFrames / project.fps).toFixed(1);

                return (
                  <div
                    key={scene.id}
                    onClick={() => setActiveSceneId(scene.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/60 shadow-md'
                        : isEnabled
                        ? 'bg-stone-950/80 border-stone-800 hover:border-stone-700'
                        : 'bg-stone-900/40 border-stone-800/50 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      {/* Toggle Active Checkbox */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleScene(scene.id, !isEnabled);
                        }}
                        className={`w-6 h-6 rounded flex items-center justify-center border transition cursor-pointer shrink-0 ${
                          isEnabled
                            ? 'bg-amber-500 border-amber-400 text-stone-950'
                            : 'bg-stone-800 border-stone-700 text-stone-500'
                        }`}
                        title={isEnabled ? 'Click to exclude from video' : 'Click to include in video'}
                      >
                        {isEnabled ? <Check size={14} weight="bold" /> : <EyeSlash size={14} />}
                      </button>

                      {/* Scene Title */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono text-stone-400">#{idx + 1}</span>
                          <span
                            className={`text-xs font-bold truncate ${
                              isEnabled ? 'text-stone-100' : 'line-through text-stone-500'
                            }`}
                          >
                            {scene.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[10.5px] text-stone-400">
                          <span>{durationSec}s</span>
                          <span>·</span>
                          <span>{scene.layers.length} layers</span>
                        </div>
                      </div>

                      {/* Actions: Reorder & Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            reorderScenes(idx, idx - 1);
                          }}
                          className="p-1 rounded text-stone-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <CaretUp size={13} weight="bold" />
                        </button>
                        <button
                          disabled={idx === project.scenes.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            reorderScenes(idx, idx + 1);
                          }}
                          className="p-1 rounded text-stone-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <CaretDown size={13} weight="bold" />
                        </button>
                        {project.scenes.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeScene(scene.id);
                            }}
                            className="p-1 rounded text-stone-400 hover:text-red-400 cursor-pointer"
                            title="Remove section permanently"
                          >
                            <Trash size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quick Duration Tweaker (when selected) */}
                    {isSelected && (
                      <div className="mt-2.5 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                        <span>Duration:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdjustDuration(scene.id, scene.durationFrames, -0.5);
                            }}
                            className="px-1.5 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
                          >
                            -0.5s
                          </button>
                          <span className="font-mono text-amber-300 font-semibold">{durationSec}s</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdjustDuration(scene.id, scene.durationFrames, 0.5);
                            }}
                            className="px-1.5 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
                          >
                            +0.5s
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. WEDDING DATA AUTO-POPULATION TAB */}
        {/* ========================================================= */}
        {activeTab === 'wedding' && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Sparkle size={14} weight="fill" />
              <span>Personalize Details</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Edits made here apply directly to your video text layers without touching your live website.
            </p>

            <div>
              <label className="text-[11px] font-semibold text-stone-400 block mb-1">Bride Name</label>
              <input
                type="text"
                value={project.weddingData.brideName}
                onChange={(e) => applyWeddingData({ brideName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-400 block mb-1">Groom Name</label>
              <input
                type="text"
                value={project.weddingData.groomName}
                onChange={(e) => applyWeddingData({ groomName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-400 block mb-1">Wedding Date</label>
              <input
                type="text"
                value={project.weddingData.weddingDate}
                onChange={(e) => applyWeddingData({ weddingDate: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-400 block mb-1">Venue Name</label>
              <input
                type="text"
                value={project.weddingData.venueName}
                onChange={(e) => applyWeddingData({ venueName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. TEXT TAB */}
        {/* ========================================================= */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Add Typography</h3>
            <button
              onClick={() => handleAddText('heading')}
              className="w-full py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-left text-sm font-serif font-bold text-white border border-stone-700 transition cursor-pointer"
            >
              Add Event Title (Headline)
            </button>
            <button
              onClick={() => handleAddText('subheading')}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-left text-xs font-serif text-amber-300 border border-stone-700 transition cursor-pointer"
            >
              Add Date &amp; Time (Subheading)
            </button>
            <button
              onClick={() => handleAddText('body')}
              className="w-full py-2 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-left text-xs font-sans text-stone-300 border border-stone-700 transition cursor-pointer"
            >
              Add Family Blessings (Body Text)
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. AUDIO TRACK TAB */}
        {/* ========================================================= */}
        {activeTab === 'audio' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Background Music</h3>
            <div className="space-y-2">
              {[
                { name: 'Royal Indian Sitar Shehnai', url: '/api/videos/royal-rajputana-heritage' },
                { name: 'Midnight Sufi Flute Serenade', url: '/api/videos/noor-e-nikah-sufi' },
                { name: 'Celestial Cosmos Piano Symphony', url: '/api/videos/celestial-harmony' },
                { name: 'Acoustic Romantic Strings', url: '/api/videos/rose-gold-blush-floral' },
              ].map((t) => (
                <div
                  key={t.name}
                  onClick={() => updateAudio({ trackUrl: t.url })}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    project.audio.trackUrl === t.url
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                      : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <span className="text-xs font-medium">{t.name}</span>
                  <MusicNotes size={14} weight="bold" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. TEMPLATES & WEBSITE CONVERTER TAB */}
        {/* ========================================================= */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            {/* Convert from Website Templates */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                <ArrowClockwise size={14} weight="bold" />
                <span>Convert Website to Video</span>
              </div>
              <p className="text-[11px] text-stone-400 mb-3">
                Load any wedding website design as an editable 5-scene video reel.
              </p>
              <div className="grid grid-cols-1 gap-2">
                {WEBSITE_TEMPLATES_LIST.map((wt) => (
                  <button
                    key={wt.id}
                    onClick={() => loadFromWebsiteTemplate(wt.id)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      project.templateId === wt.id
                        ? 'border-amber-500 bg-amber-500/15'
                        : 'border-stone-800 bg-stone-950 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-100">{wt.name}</div>
                      <div className="text-[10.5px] text-amber-400/80">{wt.style}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-medium">
                      Load Video
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ready Video Studio Templates */}
            <div className="pt-3 border-t border-stone-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Master Studio Compositions
              </h3>
              <div className="space-y-2">
                {VIDEO_STUDIO_TEMPLATES.map((tmpl: VideoStudioTemplateMetadata) => (
                  <div
                    key={tmpl.id}
                    onClick={() => setProject(getStudioTemplateProject(tmpl.id))}
                    className={`p-2 rounded-xl border cursor-pointer transition ${
                      project.templateId === tmpl.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-stone-800 bg-stone-950 hover:border-stone-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-100">{tmpl.name}</div>
                    <div className="text-[11px] text-amber-400/80 mt-0.5">{tmpl.theme}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
