'use client';

import React from 'react';
import {
  TextT,
  Trash,
  Palette,
  AlignLeft,
  AlignRight,
  Sliders,
} from '@phosphor-icons/react';
import { useVideoEditorStore } from '@/video-studio/stores/useVideoEditorStore';
import { TextLayer, VideoStudioScene, VideoStudioLayer } from '@/video-studio/types';

export function StudioPropertiesPanel() {
  const { project, activeSceneId, selectedLayerId, updateLayer, removeLayer } = useVideoEditorStore();

  const activeScene = project.scenes.find((s: VideoStudioScene) => s.id === activeSceneId);
  const selectedLayer = activeScene?.layers.find((l: VideoStudioLayer) => l.id === selectedLayerId);

  if (!selectedLayer) {
    return (
      <aside className="w-72 bg-stone-900 border-l border-stone-800 p-4 flex flex-col items-center justify-center text-center text-stone-500 z-20 shrink-0 select-none">
        <Sliders size={28} weight="light" className="mb-2 text-stone-600" />
        <p className="text-xs">Select any text or element on the video canvas to customize its properties.</p>
      </aside>
    );
  }

  const isText = selectedLayer.type === 'text';
  const textLayer = selectedLayer as TextLayer;

  return (
    <aside className="w-72 bg-stone-900 border-l border-stone-800 flex flex-col z-20 shrink-0 select-none">
      <div className="p-3 border-b border-stone-800 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
          {selectedLayer.name}
        </span>
        <button
          onClick={() => removeLayer(activeSceneId, selectedLayer.id)}
          className="p-1 rounded text-stone-400 hover:text-red-400 hover:bg-stone-800 transition cursor-pointer"
          title="Delete layer"
        >
          <Trash size={15} weight="bold" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TEXT CONTENT EDITING */}
        {isText && (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-stone-400 block mb-1">Text Content</label>
              <textarea
                rows={2}
                value={textLayer.text}
                onChange={(e) => updateLayer(activeSceneId, selectedLayer.id, { text: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-white"
              />
            </div>

            {/* FONT SIZE & COLOR */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-stone-400 block mb-1">Font Size</label>
                <input
                  type="number"
                  value={textLayer.fontSize}
                  onChange={(e) => updateLayer(activeSceneId, selectedLayer.id, { fontSize: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-stone-950 border border-stone-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-400 block mb-1">Text Color</label>
                <div className="flex items-center gap-1.5 bg-stone-950 border border-stone-700 rounded-lg p-1">
                  <input
                    type="color"
                    value={textLayer.color}
                    onChange={(e) => updateLayer(activeSceneId, selectedLayer.id, { color: e.target.value })}
                    className="w-6 h-6 border-0 rounded cursor-pointer bg-transparent"
                  />
                  <span className="text-[10px] text-stone-300 font-mono">{textLayer.color}</span>
                </div>
              </div>
            </div>

            {/* ALIGNMENT */}
            <div>
              <label className="text-[11px] font-semibold text-stone-400 block mb-1">Text Alignment</label>
              <div className="flex bg-stone-950 border border-stone-700 rounded-lg p-0.5">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => updateLayer(activeSceneId, selectedLayer.id, { textAlign: align })}
                    className={`flex-1 py-1 rounded flex justify-center text-xs cursor-pointer ${
                      textLayer.textAlign === align ? 'bg-stone-800 text-amber-300' : 'text-stone-400'
                    }`}
                  >
                    {align === 'left' && <AlignLeft size={14} />}
                    {align === 'center' && <span>Center</span>}
                    {align === 'right' && <AlignRight size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* MOTION ANIMATION PRESET */}
            <div>
              <label className="text-[11px] font-semibold text-stone-400 block mb-1">Motion Animation</label>
              <select
                value={textLayer.animation}
                onChange={(e) => updateLayer(activeSceneId, selectedLayer.id, { animation: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-white"
              >
                <option value="none">None</option>
                <option value="fadeIn">Fade In</option>
                <option value="slideUp">Slide Up</option>
                <option value="slideDown">Slide Down</option>
                <option value="zoomIn">Zoom In</option>
                <option value="goldShimmer">Gold Shimmer</option>
                <option value="bounce">Bouncy Reveal</option>
              </select>
            </div>
          </div>
        )}

        {/* OPACITY & POSITION */}
        <div className="pt-2 border-t border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-stone-400">
            <span>Opacity</span>
            <span>{Math.round(selectedLayer.opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={selectedLayer.opacity}
            onChange={(e) => updateLayer(activeSceneId, selectedLayer.id, { opacity: Number(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>
    </aside>
  );
}
