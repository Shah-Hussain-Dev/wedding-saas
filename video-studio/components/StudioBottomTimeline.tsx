'use client';

import React from 'react';
import { Plus, Copy, Trash, FilmSlate } from '@phosphor-icons/react';
import { useVideoEditorStore } from '@/video-studio/stores/useVideoEditorStore';
import { VideoStudioScene } from '@/video-studio/types';

export function StudioBottomTimeline() {
  const { project, activeSceneId, setActiveSceneId, addScene, duplicateScene, removeScene } =
    useVideoEditorStore();

  const activeScenes = project.scenes.filter((s: VideoStudioScene) => s.enabled !== false);
  const totalFrames = activeScenes.reduce(
    (acc: number, s: VideoStudioScene) => acc + s.durationFrames,
    0
  );

  return (
    <footer className="h-28 bg-stone-900 border-t border-stone-800 px-4 py-2 flex flex-col justify-between shrink-0 select-none z-20">
      {/* Timeline Controls Header */}
      <div className="flex items-center justify-between text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <FilmSlate size={16} weight="bold" className="text-amber-400" />
          <span className="font-semibold text-stone-200">
            Active Scenes ({activeScenes.length}/{project.scenes.length}) · {Math.round(totalFrames / project.fps)}s Total
          </span>
        </div>

        <button
          onClick={() => addScene(activeSceneId)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-[11px] transition cursor-pointer"
        >
          <Plus size={13} weight="bold" />
          <span>Add Scene</span>
        </button>
      </div>

      {/* Horizontal Scenes Track */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
        {project.scenes.map((scene: VideoStudioScene, idx: number) => {
          const isActive = scene.id === activeSceneId;
          const durationSeconds = (scene.durationFrames / project.fps).toFixed(1);

          const isEnabled = scene.enabled !== false;

          return (
            <div
              key={scene.id}
              onClick={() => setActiveSceneId(scene.id)}
              className={`relative flex-shrink-0 w-36 h-14 rounded-xl border p-2 flex flex-col justify-between cursor-pointer transition ${
                !isEnabled
                  ? 'opacity-40 border-stone-800 bg-stone-900/50 grayscale'
                  : isActive
                  ? 'border-amber-400 bg-amber-500/15 shadow-md shadow-amber-950/40'
                  : 'border-stone-800 bg-stone-950/80 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold truncate ${!isEnabled ? 'line-through text-stone-500' : 'text-stone-200'}`}>
                  {idx + 1}. {scene.title}
                </span>

                <div className="flex items-center gap-1 opacity-70 hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateScene(scene.id);
                    }}
                    title="Duplicate scene"
                    className="p-0.5 text-stone-400 hover:text-white cursor-pointer"
                  >
                    <Copy size={11} />
                  </button>
                  {project.scenes.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeScene(scene.id);
                      }}
                      title="Delete scene"
                      className="p-0.5 text-stone-400 hover:text-red-400 cursor-pointer"
                    >
                      <Trash size={11} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                <span>{durationSeconds}s</span>
                <span className="text-amber-400/80 uppercase">{scene.transition}</span>
              </div>
            </div>
          );
        })}
      </div>
    </footer>
  );
}
