'use client';

import { create } from 'zustand';
import {
  VideoStudioProject,
  VideoStudioScene,
  VideoStudioLayer,
  TextLayer,
  ImageLayer,
  VideoStudioWeddingData,
} from '@/video-studio/types';
import { convertTemplateToVideoProject } from '@/video-studio/adapters/templateToVideo';

interface HistoryState {
  past: VideoStudioProject[];
  future: VideoStudioProject[];
}

interface VideoEditorStore {
  project: VideoStudioProject;
  activeSceneId: string;
  selectedLayerId: string | null;
  currentFrame: number;
  isPlaying: boolean;
  zoom: number; // percentage (e.g. 100)
  history: HistoryState;

  // Actions
  setProject: (project: VideoStudioProject) => void;
  setActiveSceneId: (sceneId: string) => void;
  setSelectedLayerId: (layerId: string | null) => void;
  setCurrentFrame: (frame: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setZoom: (zoom: number) => void;

  // Layer mutations
  updateLayer: (sceneId: string, layerId: string, partial: Partial<VideoStudioLayer>) => void;
  addLayer: (sceneId: string, layer: VideoStudioLayer) => void;
  removeLayer: (sceneId: string, layerId: string) => void;
  reorderLayer: (sceneId: string, layerId: string, direction: 'up' | 'down') => void;

  // Scene mutations
  updateScene: (sceneId: string, partial: Partial<VideoStudioScene>) => void;
  toggleScene: (sceneId: string, enabled: boolean) => void;
  addScene: (afterSceneId?: string) => void;
  duplicateScene: (sceneId: string) => void;
  removeScene: (sceneId: string) => void;
  reorderScenes: (fromIndex: number, toIndex: number) => void;

  // Wedding data auto-fill
  applyWeddingData: (data: Partial<VideoStudioWeddingData>) => void;
  loadFromWebsiteTemplate: (templateId: string, customData?: Partial<VideoStudioWeddingData>) => void;

  // Audio mutations
  updateAudio: (audioData: Partial<VideoStudioProject['audio']>) => void;

  // History (Undo / Redo)
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const DEFAULT_WEDDING_DATA: VideoStudioWeddingData = {
  brideName: 'Daniya',
  groomName: 'Shamshad',
  brideParents: 'Begum & Janab Khan',
  groomParents: 'Begum & Janab Husain',
  weddingDate: '14 February 2027',
  weddingTime: '7:00 PM',
  venueName: 'The Grand Heritage Ballroom',
  venueAddress: 'Heritage Lake Road, Lucknow, Uttar Pradesh',
  sacredInvocation: '॥ श्री गणेशाय नमः ॥',
  sacredVerse: 'Together with their families, invite you to celebrate their wedding union',
  events: [
    { name: 'Haldi & Mehendi', date: '12 Feb 2027', time: '4:00 PM', venue: 'Garden Pavilion' },
    { name: 'Sangeet Night', date: '13 Feb 2027', time: '7:30 PM', venue: 'Crystal Banquet' },
    { name: 'Shubh Vivah', date: '14 Feb 2027', time: '6:30 PM', venue: 'The Grand Heritage Ballroom' },
  ],
};

export const INITIAL_VIDEO_PROJECT: VideoStudioProject = {
  id: 'project-draft-1',
  templateId: 'royal-rajputana-vivah',
  title: 'Royal Rajputana Wedding Video Invitation',
  aspectRatio: '9:16',
  fps: 30,
  width: 1080,
  height: 1920,
  audio: {
    trackUrl: '/api/videos/royal-rajputana-heritage',
    volume: 0.85,
    fadeInFrames: 30,
    fadeOutFrames: 45,
    startOffsetSeconds: 0,
  },
  weddingData: DEFAULT_WEDDING_DATA,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  scenes: [
    {
      id: 'scene-1',
      title: 'Sacred Invocation',
      durationFrames: 120, // 4 sec
      transition: 'fade',
      transitionDurationFrames: 15,
      background: {
        type: 'gradient',
        value: 'radial-gradient(ellipse at top, #3A0B12 0%, #170407 100%)',
        opacity: 1,
      },
      layers: [
        {
          id: 's1-motif',
          type: 'sticker',
          name: 'Golden Ganesha Motif',
          category: 'motif',
          src: '/templates/imperial-palace/ballroom.jpg',
          x: 50,
          y: 28,
          width: 160,
          height: 160,
          rotation: 0,
          opacity: 0.9,
          zIndex: 1,
          animation: 'goldShimmer',
          animationDurationFrames: 60,
        },
        {
          id: 's1-invoc',
          type: 'text',
          name: 'Sacred Verse Text',
          text: '॥ श्री गणेशाय नमः ॥',
          fontFamily: 'serif',
          fontSize: 38,
          fontWeight: 700,
          color: '#E1C98E',
          textAlign: 'center',
          lineHeight: 1.3,
          letterSpacing: 2,
          x: 50,
          y: 45,
          width: 800,
          height: 60,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          animation: 'fadeIn',
          animationDurationFrames: 30,
        },
        {
          id: 's1-subtitle',
          type: 'text',
          name: 'Blessings Subtitle',
          text: 'Together with our families, we seek your presence and blessings',
          fontFamily: 'sans-serif',
          fontSize: 22,
          fontWeight: 500,
          color: '#F7F4ED',
          textAlign: 'center',
          lineHeight: 1.5,
          letterSpacing: 1,
          x: 50,
          y: 56,
          width: 760,
          height: 80,
          rotation: 0,
          opacity: 0.9,
          zIndex: 3,
          animation: 'slideUp',
          animationDurationFrames: 45,
        },
      ],
    },
    {
      id: 'scene-2',
      title: 'Couple Announcement',
      durationFrames: 150, // 5 sec
      transition: 'wipe',
      transitionDurationFrames: 20,
      background: {
        type: 'gradient',
        value: 'linear-gradient(180deg, #1A0307 0%, #350A11 50%, #150205 100%)',
        opacity: 1,
      },
      layers: [
        {
          id: 's2-wedding-title',
          type: 'text',
          name: 'Wedding Invitation Label',
          text: 'WEDDING INVITATION',
          fontFamily: 'sans-serif',
          fontSize: 20,
          fontWeight: 700,
          color: '#C8A45E',
          textAlign: 'center',
          lineHeight: 1.2,
          letterSpacing: 6,
          textTransform: 'uppercase',
          x: 50,
          y: 22,
          width: 600,
          height: 40,
          rotation: 0,
          opacity: 0.9,
          zIndex: 1,
          animation: 'fadeIn',
          animationDurationFrames: 30,
        },
        {
          id: 's2-bride',
          type: 'text',
          name: 'Bride Name',
          text: 'Daniya',
          fontFamily: 'serif',
          fontSize: 84,
          fontWeight: 700,
          color: '#F7F4ED',
          textAlign: 'center',
          lineHeight: 1.1,
          letterSpacing: 1,
          x: 50,
          y: 35,
          width: 800,
          height: 100,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          animation: 'zoomIn',
          animationDurationFrames: 45,
        },
        {
          id: 's2-ampersand',
          type: 'text',
          name: 'Ampersand',
          text: '&',
          fontFamily: 'serif',
          fontSize: 48,
          fontWeight: 400,
          color: '#E1C98E',
          textAlign: 'center',
          lineHeight: 1,
          letterSpacing: 0,
          x: 50,
          y: 47,
          width: 200,
          height: 60,
          rotation: 0,
          opacity: 0.85,
          zIndex: 3,
          animation: 'fadeIn',
          animationDurationFrames: 30,
        },
        {
          id: 's2-groom',
          type: 'text',
          name: 'Groom Name',
          text: 'Shamshad',
          fontFamily: 'serif',
          fontSize: 84,
          fontWeight: 700,
          color: '#F7F4ED',
          textAlign: 'center',
          lineHeight: 1.1,
          letterSpacing: 1,
          x: 50,
          y: 60,
          width: 800,
          height: 100,
          rotation: 0,
          opacity: 1,
          zIndex: 4,
          animation: 'zoomIn',
          animationDurationFrames: 45,
        },
      ],
    },
    {
      id: 'scene-3',
      title: 'Ceremony & Venue',
      durationFrames: 150, // 5 sec
      transition: 'fade',
      transitionDurationFrames: 20,
      background: {
        type: 'gradient',
        value: 'radial-gradient(circle at center, #2E080F 0%, #100204 100%)',
        opacity: 1,
      },
      layers: [
        {
          id: 's3-date-heading',
          type: 'text',
          name: 'Save The Date',
          text: 'SUNDAY, 14 FEBRUARY 2027',
          fontFamily: 'serif',
          fontSize: 32,
          fontWeight: 600,
          color: '#E1C98E',
          textAlign: 'center',
          lineHeight: 1.3,
          letterSpacing: 3,
          x: 50,
          y: 30,
          width: 850,
          height: 60,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          animation: 'slideDown',
          animationDurationFrames: 40,
        },
        {
          id: 's3-venue',
          type: 'text',
          name: 'Venue Name',
          text: 'The Grand Heritage Ballroom',
          fontFamily: 'serif',
          fontSize: 42,
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1.3,
          letterSpacing: 1,
          x: 50,
          y: 48,
          width: 860,
          height: 70,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          animation: 'slideUp',
          animationDurationFrames: 45,
        },
        {
          id: 's3-address',
          type: 'text',
          name: 'Venue Address',
          text: 'Heritage Lake Road, Lucknow, Uttar Pradesh',
          fontFamily: 'sans-serif',
          fontSize: 22,
          fontWeight: 400,
          color: '#D1C7BD',
          textAlign: 'center',
          lineHeight: 1.4,
          letterSpacing: 0.5,
          x: 50,
          y: 60,
          width: 780,
          height: 60,
          rotation: 0,
          opacity: 0.85,
          zIndex: 3,
          animation: 'fadeIn',
          animationDurationFrames: 50,
        },
      ],
    },
  ],
};

export const useVideoEditorStore = create<VideoEditorStore>((set, get) => ({
  project: INITIAL_VIDEO_PROJECT,
  activeSceneId: INITIAL_VIDEO_PROJECT.scenes[0].id,
  selectedLayerId: null,
  currentFrame: 0,
  isPlaying: false,
  zoom: 100,
  history: { past: [], future: [] },
  canUndo: false,
  canRedo: false,

  setProject: (project) => {
    set({
      project,
      activeSceneId: project.scenes[0]?.id || '',
      selectedLayerId: null,
      history: { past: [], future: [] },
      canUndo: false,
      canRedo: false,
    });
  },

  setActiveSceneId: (sceneId) => set({ activeSceneId: sceneId, selectedLayerId: null }),
  setSelectedLayerId: (layerId) => set({ selectedLayerId: layerId }),
  setCurrentFrame: (frame) => set({ currentFrame: frame }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setZoom: (zoom) => set({ zoom }),

  updateLayer: (sceneId, layerId, partial) => {
    const { project, history } = get();
    const newPast = [...history.past, project];

    const updatedScenes = project.scenes.map((scene: VideoStudioScene) => {
      if (scene.id !== sceneId) return scene;
      return {
        ...scene,
        layers: scene.layers.map((layer: VideoStudioLayer) => {
          if (layer.id !== layerId) return layer;
          return { ...layer, ...partial } as VideoStudioLayer;
        }),
      };
    });

    const updatedProject = {
      ...project,
      scenes: updatedScenes,
      updatedAt: new Date().toISOString(),
    };

    set({
      project: updatedProject,
      history: { past: newPast, future: [] },
      canUndo: true,
      canRedo: false,
    });
  },

  addLayer: (sceneId, layer) => {
    const { project, history } = get();
    const newPast = [...history.past, project];

    const updatedScenes = project.scenes.map((scene: VideoStudioScene) => {
      if (scene.id !== sceneId) return scene;
      return { ...scene, layers: [...scene.layers, layer] };
    });

    set({
      project: { ...project, scenes: updatedScenes, updatedAt: new Date().toISOString() },
      selectedLayerId: layer.id,
      history: { past: newPast, future: [] },
      canUndo: true,
      canRedo: false,
    });
  },

  removeLayer: (sceneId, layerId) => {
    const { project, history } = get();
    const newPast = [...history.past, project];

    const updatedScenes = project.scenes.map((scene: VideoStudioScene) => {
      if (scene.id !== sceneId) return scene;
      return { ...scene, layers: scene.layers.filter((l: VideoStudioLayer) => l.id !== layerId) };
    });

    set({
      project: { ...project, scenes: updatedScenes, updatedAt: new Date().toISOString() },
      selectedLayerId: null,
      history: { past: newPast, future: [] },
      canUndo: true,
      canRedo: false,
    });
  },

  reorderLayer: (sceneId, layerId, direction) => {
    const { project, history } = get();
    const scene = project.scenes.find((s: VideoStudioScene) => s.id === sceneId);
    if (!scene) return;

    const index = scene.layers.findIndex((l: VideoStudioLayer) => l.id === layerId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index + 1 : index - 1;
    if (targetIndex < 0 || targetIndex >= scene.layers.length) return;

    const newLayers = [...scene.layers];
    const [moved] = newLayers.splice(index, 1);
    newLayers.splice(targetIndex, 0, moved);

    const updatedScenes = project.scenes.map((s: VideoStudioScene) => (s.id === sceneId ? { ...s, layers: newLayers } : s));
    set({
      project: { ...project, scenes: updatedScenes, updatedAt: new Date().toISOString() },
      history: { past: [...history.past, project], future: [] },
      canUndo: true,
      canRedo: false,
    });
  },

  updateScene: (sceneId, partial) => {
    const { project, history } = get();
    const updatedScenes = project.scenes.map((s: VideoStudioScene) => (s.id === sceneId ? { ...s, ...partial } : s));
    set({
      project: { ...project, scenes: updatedScenes, updatedAt: new Date().toISOString() },
      history: { past: [...history.past, project], future: [] },
      canUndo: true,
      canRedo: false,
    });
  },

  toggleScene: (sceneId, enabled) => {
    const { project, history } = get();
    const updatedScenes = project.scenes.map((s: VideoStudioScene) =>
      s.id === sceneId ? { ...s, enabled } : s
    );
    set({
      project: { ...project, scenes: updatedScenes, updatedAt: new Date().toISOString() },
      history: { past: [...history.past, project], future: [] },
      canUndo: true,
      canRedo: false,
    });
  },

  addScene: (afterSceneId) => {
    const { project, history } = get();
    const newSceneId = `scene-${Date.now()}`;
    const newScene: VideoStudioScene = {
      id: newSceneId,
      title: `Scene ${project.scenes.length + 1}`,
      durationFrames: 120,
      transition: 'fade',
      transitionDurationFrames: 15,
      background: {
        type: 'gradient',
        value: 'linear-gradient(180deg, #1C1917 0%, #0C0A09 100%)',
        opacity: 1,
      },
      layers: [
        {
          id: `text-${Date.now()}`,
          type: 'text',
          name: 'Title Text',
          text: 'New Wedding Event',
          fontFamily: 'serif',
          fontSize: 48,
          fontWeight: 700,
          color: '#E1C98E',
          textAlign: 'center',
          lineHeight: 1.2,
          letterSpacing: 2,
          x: 50,
          y: 45,
          width: 700,
          height: 80,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          animation: 'fadeIn',
          animationDurationFrames: 30,
        },
      ],
    };

    let newScenes = [...project.scenes];
    if (afterSceneId) {
      const idx = newScenes.findIndex((s) => s.id === afterSceneId);
      newScenes.splice(idx + 1, 0, newScene);
    } else {
      newScenes.push(newScene);
    }

    set({
      project: { ...project, scenes: newScenes, updatedAt: new Date().toISOString() },
      activeSceneId: newSceneId,
      selectedLayerId: null,
      history: { past: [...history.past, project], future: [] },
      canUndo: true,
      canRedo: false,
    });
  },

  duplicateScene: (sceneId) => {
    const { project, history } = get();
    const sceneToCopy = project.scenes.find((s: VideoStudioScene) => s.id === sceneId);
    if (!sceneToCopy) return;

    const duplicatedScene: VideoStudioScene = {
      ...sceneToCopy,
      id: `scene-${Date.now()}`,
      title: `${sceneToCopy.title} (Copy)`,
      layers: sceneToCopy.layers.map((l: VideoStudioLayer) => ({ ...l, id: `layer-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` })),
    };

    const idx = project.scenes.findIndex((s: VideoStudioScene) => s.id === sceneId);
    const newScenes = [...project.scenes];
    newScenes.splice(idx + 1, 0, duplicatedScene);

    set({
      project: { ...project, scenes: newScenes, updatedAt: new Date().toISOString() },
      activeSceneId: duplicatedScene.id,
      history: { past: [...history.past, project], future: [] },
      canUndo: true,
      canRedo: false,
    });
  },

  removeScene: (sceneId) => {
    const { project, history } = get();
    if (project.scenes.length <= 1) return; // Keep at least 1 scene

    const newScenes = project.scenes.filter((s: VideoStudioScene) => s.id !== sceneId);
    set({
      project: { ...project, scenes: newScenes, updatedAt: new Date().toISOString() },
      activeSceneId: newScenes[0].id,
      selectedLayerId: null,
      history: { past: [...history.past, project], future: [] },
      canUndo: true,
      canRedo: false,
    });
  },

  reorderScenes: (fromIndex, toIndex) => {
    const { project, history } = get();
    const newScenes = [...project.scenes];
    const [moved] = newScenes.splice(fromIndex, 1);
    newScenes.splice(toIndex, 0, moved);

    set({
      project: { ...project, scenes: newScenes, updatedAt: new Date().toISOString() },
      history: { past: [...history.past, project], future: [] },
      canUndo: true,
      canRedo: false,
    });
  },

  applyWeddingData: (data) => {
    const { project, history } = get();
    const mergedData = { ...project.weddingData, ...data };

    // Dynamic replacement in text layers
    const updatedScenes = project.scenes.map((scene: VideoStudioScene) => ({
      ...scene,
      layers: scene.layers.map((layer: VideoStudioLayer) => {
        if (layer.type !== 'text') return layer;
        let newText = layer.text;
        if (data.brideName) newText = newText.replace(project.weddingData.brideName, data.brideName);
        if (data.groomName) newText = newText.replace(project.weddingData.groomName, data.groomName);
        if (data.venueName) newText = newText.replace(project.weddingData.venueName, data.venueName);
        if (data.weddingDate) newText = newText.replace(project.weddingData.weddingDate, data.weddingDate);
        return { ...layer, text: newText };
      }),
    }));

    set({
      project: {
        ...project,
        weddingData: mergedData,
        scenes: updatedScenes,
        updatedAt: new Date().toISOString(),
      },
      history: { past: [...history.past, project], future: [] },
      canUndo: true,
      canRedo: false,
    });
  },

  loadFromWebsiteTemplate: (templateId, customData) => {
    const newProject = convertTemplateToVideoProject({ templateId, customData });
    get().setProject(newProject);
  },

  updateAudio: (audioData) => {
    const { project } = get();
    set({
      project: {
        ...project,
        audio: { ...project.audio, ...audioData },
        updatedAt: new Date().toISOString(),
      },
    });
  },

  undo: () => {
    const { project, history } = get();
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);

    set({
      project: previous,
      history: {
        past: newPast,
        future: [project, ...history.future],
      },
      canUndo: newPast.length > 0,
      canRedo: true,
    });
  },

  redo: () => {
    const { project, history } = get();
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      project: next,
      history: {
        past: [...history.past, project],
        future: newFuture,
      },
      canUndo: true,
      canRedo: newFuture.length > 0,
    });
  },
}));
