export type AspectRatio = '9:16' | '16:9' | '1:1';

export type LayerType = 'text' | 'image' | 'video' | 'sticker' | 'shape';

export type AnimationType =
  | 'none'
  | 'fadeIn'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'zoomIn'
  | 'zoomOut'
  | 'goldShimmer'
  | 'bounce';

export type TransitionType =
  | 'none'
  | 'fade'
  | 'slide-left'
  | 'slide-right'
  | 'wipe'
  | 'zoom-dissolve';

export interface BaseLayer {
  id: string;
  type: LayerType;
  name: string;
  x: number; // percentage (0 - 100) or px in canvas reference
  y: number; // percentage (0 - 100) or px in canvas reference
  width: number;
  height: number;
  rotation: number; // degrees
  opacity: number; // 0 - 1
  zIndex: number;
  animation: AnimationType;
  animationDurationFrames: number;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
  letterSpacing: number;
  textTransform?: 'none' | 'uppercase' | 'capitalize' | 'lowercase';
  shadowColor?: string;
  shadowBlur?: number;
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string;
  fit: 'cover' | 'contain';
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
}

export interface VideoLayer extends BaseLayer {
  type: 'video';
  src: string;
  fit: 'cover' | 'contain';
  volume: number;
  playbackRate: number;
}

export interface StickerLayer extends BaseLayer {
  type: 'sticker';
  src: string;
  category: 'motif' | 'floral' | 'sacred' | 'frame' | 'sparkle';
}

export type VideoStudioLayer = TextLayer | ImageLayer | VideoLayer | StickerLayer;

export interface SceneBackground {
  type: 'color' | 'image' | 'video' | 'gradient';
  value: string; // CSS color, gradient string, or asset URL
  opacity: number;
}

export interface VideoStudioScene {
  id: string;
  title: string;
  durationFrames: number; // at project fps (e.g. 150 frames = 5 seconds @ 30fps)
  transition: TransitionType;
  transitionDurationFrames: number;
  background: SceneBackground;
  layers: VideoStudioLayer[];
  enabled?: boolean; // Toggle scene inclusion in video
  sectionType?: 'entrance' | 'couple' | 'events' | 'venue' | 'gallery' | 'blessings' | 'custom';
}

export interface VideoStudioWeddingData {
  brideName: string;
  groomName: string;
  brideParents: string;
  groomParents: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  sacredInvocation: string;
  sacredVerse: string;
  events: Array<{
    name: string;
    date: string;
    time: string;
    venue: string;
  }>;
}

export interface VideoStudioProject {
  id: string;
  templateId: string;
  title: string;
  aspectRatio: AspectRatio;
  fps: number;
  width: number;
  height: number;
  scenes: VideoStudioScene[];
  audio: {
    trackUrl: string;
    volume: number;
    fadeInFrames: number;
    fadeOutFrames: number;
    startOffsetSeconds: number;
  };
  weddingData: VideoStudioWeddingData;
  createdAt: string;
  updatedAt: string;
}

export interface VideoStudioTemplateMetadata {
  id: string;
  name: string;
  slug: string;
  category: 'traditional' | 'muslim' | 'botanical' | 'floral' | 'luxury';
  theme: string;
  thumbnailUrl: string;
  previewVideoUrl?: string;
  aspectRatio: AspectRatio;
  defaultDurationSeconds: number;
  description: string;
  badge?: string;
}
