import React from 'react';
import { Composition, Sequence, Audio, Img } from 'remotion';
import { VideoStudioProject, VideoStudioScene, VideoStudioLayer } from '../types';
import { AnimatedLayer } from './AnimatedLayer';

interface WeddingVideoCompositionProps {
  project: VideoStudioProject;
}

function SceneLayerRenderer({ layer }: { layer: VideoStudioLayer }) {
  const commonPositionStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${layer.x}%`,
    top: `${layer.y}%`,
    transform: 'translate(-50%, -50%)',
    width: `${layer.width}px`,
    height: layer.height ? `${layer.height}px` : 'auto',
    rotate: `${layer.rotation}deg`,
    zIndex: layer.zIndex,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  switch (layer.type) {
    case 'text':
      return (
        <AnimatedLayer
          animation={layer.animation}
          durationFrames={layer.animationDurationFrames}
          style={commonPositionStyle}
        >
          <div
            style={{
              fontFamily: layer.fontFamily,
              fontSize: `${layer.fontSize}px`,
              fontWeight: layer.fontWeight,
              color: layer.color,
              textAlign: layer.textAlign,
              lineHeight: layer.lineHeight,
              letterSpacing: `${layer.letterSpacing}px`,
              textTransform: layer.textTransform || 'none',
              textShadow: layer.shadowColor ? `0 2px ${layer.shadowBlur || 8}px ${layer.shadowColor}` : 'none',
              width: '100%',
              userSelect: 'none',
            }}
          >
            {layer.text}
          </div>
        </AnimatedLayer>
      );

    case 'image':
    case 'sticker':
      return (
        <AnimatedLayer
          animation={layer.animation}
          durationFrames={layer.animationDurationFrames}
          style={commonPositionStyle}
        >
          {layer.src ? (
            <Img
              src={layer.src}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'fit' in layer ? layer.fit : 'contain',
                borderRadius: 'borderRadius' in layer ? `${layer.borderRadius}px` : '0px',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px dashed rgba(255,255,255,0.3)',
              }}
            />
          )}
        </AnimatedLayer>
      );

    default:
      return null;
  }
}

function SceneComponent({ scene }: { scene: VideoStudioScene }) {
  const backgroundStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    background: scene.background.value,
    opacity: scene.background.opacity,
    overflow: 'hidden',
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={backgroundStyle} />
      {scene.layers.map((layer) => (
        <SceneLayerRenderer key={layer.id} layer={layer} />
      ))}
    </div>
  );
}

export function WeddingVideoComposition({ project }: WeddingVideoCompositionProps) {
  let accumulatedFrames = 0;

  return (
    <div
      style={{
        width: `${project.width}px`,
        height: `${project.height}px`,
        position: 'relative',
        backgroundColor: '#000000',
        overflow: 'hidden',
      }}
    >
      {/* Audio Track */}
      {project.audio.trackUrl && (
        <Audio
          src={project.audio.trackUrl}
          volume={project.audio.volume}
          startFrom={project.audio.startOffsetSeconds * project.fps}
        />
      )}

      {/* Sequential Scenes */}
      {project.scenes
        .filter((scene) => scene.enabled !== false)
        .map((scene) => {
        const from = accumulatedFrames;
        const duration = scene.durationFrames;
        accumulatedFrames += duration;

        return (
          <Sequence key={scene.id} from={from} durationInFrames={duration}>
            <SceneComponent scene={scene} />
          </Sequence>
        );
      })}
    </div>
  );
}
