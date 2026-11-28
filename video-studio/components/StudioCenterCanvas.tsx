'use client';

import React, { useRef, useEffect } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { useVideoEditorStore } from '@/video-studio/stores/useVideoEditorStore';
import { WeddingVideoComposition } from '@/video-studio/engine/WeddingVideoComposition';
import { VideoStudioScene, VideoStudioLayer } from '@/video-studio/types';

export function StudioCenterCanvas() {
  const playerRef = useRef<PlayerRef>(null);
  const {
    project,
    isPlaying,
    setIsPlaying,
    selectedLayerId,
    setSelectedLayerId,
    activeSceneId,
    zoom,
  } = useVideoEditorStore();

  const totalFrames = project.scenes
    .filter((s: VideoStudioScene) => s.enabled !== false)
    .reduce((acc: number, s: VideoStudioScene) => acc + s.durationFrames, 0);

  // Sync isPlaying with Player
  useEffect(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
  }, [isPlaying]);

  const activeScene =
    project.scenes.find((s: VideoStudioScene) => s.id === activeSceneId) || project.scenes[0];

  return (
    <div className="relative flex-1 bg-stone-950 flex items-center justify-center overflow-hidden p-4 select-none">
      {/* 9:16 Canvas Frame */}
      <div
        style={{
          transform: `scale(${zoom / 100})`,
          transition: 'transform 0.15s ease-out',
        }}
        className="relative aspect-[9/16] h-[65vh] sm:h-[72vh] max-h-[820px] rounded-2xl overflow-hidden shadow-2xl border border-stone-800 bg-black flex items-center justify-center group"
      >
        {/* Remotion Interactive Player */}
        <Player
          ref={playerRef}
          component={WeddingVideoComposition}
          inputProps={{ project }}
          durationInFrames={totalFrames || 300}
          compositionWidth={project.width}
          compositionHeight={project.height}
          fps={project.fps}
          style={{
            width: '100%',
            height: '100%',
          }}
          controls={false}
          loop
        />

        {/* Selection Bounding Overlays */}
        {activeScene?.layers.map((layer: VideoStudioLayer) => {
          const isSelected = selectedLayerId === layer.id;
          return (
            <div
              key={layer.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLayerId(layer.id);
              }}
              style={{
                position: 'absolute',
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                transform: 'translate(-50%, -50%)',
                width: `${layer.width * 0.32}px`, // scaled to viewport
                height: layer.height ? `${layer.height * 0.32}px` : '32px',
                zIndex: 20,
              }}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'border-2 border-amber-400 bg-amber-400/10 ring-4 ring-amber-400/20 rounded-md'
                  : 'hover:border hover:border-dashed hover:border-white/40'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-6 left-0 bg-amber-500 text-stone-950 font-bold text-[9px] px-1.5 py-0.5 rounded shadow">
                  {layer.name}
                </div>
              )}
            </div>
          );
        })}

        {/* 9:16 Safe Guides */}
        <div className="pointer-events-none absolute inset-x-4 inset-y-8 border border-white/10 border-dashed rounded-lg opacity-40" />
      </div>
    </div>
  );
}
