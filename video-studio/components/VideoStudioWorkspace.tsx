'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudioTopToolbar } from './StudioTopToolbar';
import { StudioLeftSidebar } from './StudioLeftSidebar';
import { StudioCenterCanvas } from './StudioCenterCanvas';
import { StudioPropertiesPanel } from './StudioPropertiesPanel';
import { StudioBottomTimeline } from './StudioBottomTimeline';
import { ExportModal } from './ExportModal';
import { useVideoEditorStore } from '@/video-studio/stores/useVideoEditorStore';
import { VideoStudioWeddingData } from '@/video-studio/types';

function VideoStudioQueryParamsSync() {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('template');
  const groomParam = searchParams.get('groom');
  const brideParam = searchParams.get('bride');
  const dateParam = searchParams.get('date');
  const venueParam = searchParams.get('venue');

  const { loadFromWebsiteTemplate } = useVideoEditorStore();

  useEffect(() => {
    if (templateParam) {
      const customData: Partial<VideoStudioWeddingData> = {};
      if (groomParam) customData.groomName = groomParam;
      if (brideParam) customData.brideName = brideParam;
      if (dateParam) customData.weddingDate = dateParam;
      if (venueParam) customData.venueName = venueParam;
      loadFromWebsiteTemplate(templateParam, customData);
    }
  }, [templateParam, groomParam, brideParam, dateParam, venueParam, loadFromWebsiteTemplate]);

  return null;
}

export function VideoStudioWorkspace() {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-stone-950 overflow-hidden font-sans select-none">
      <Suspense fallback={null}>
        <VideoStudioQueryParamsSync />
      </Suspense>

      {/* 1. TOP TOOLBAR */}
      <StudioTopToolbar onOpenExport={() => setIsExportOpen(true)} />

      {/* 2. MIDDLE WORKSPACE: LEFT ASSETS + CENTER CANVAS + RIGHT PROPERTIES */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar */}
        <StudioLeftSidebar />

        {/* Center Canvas */}
        <StudioCenterCanvas />

        {/* Right Properties Panel */}
        <StudioPropertiesPanel />
      </div>

      {/* 3. BOTTOM TIMELINE TRACK */}
      <StudioBottomTimeline />

      {/* EXPORT MODAL */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}
