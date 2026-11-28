import { Metadata } from 'next';
import { VideoStudioWorkspace } from '@/video-studio/components/VideoStudioWorkspace';

export const metadata: Metadata = {
  title: 'Video Studio | Canva-Style Wedding Video Invitation Editor | WedInvites',
  description:
    'Customize luxury wedding video invitations online. Drag-and-drop text, background music, multi-scene timeline, and instant Full HD MP4 export for WhatsApp and Instagram Reels.',
};

export default function StudioPage() {
  return <VideoStudioWorkspace />;
}
