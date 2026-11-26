import { Metadata } from 'next';
import { GlassNav } from '@/components/ui/glass-nav';
import { PremiumFooter } from '@/components/ui/premium-footer';
import { VideoGalleryClient } from '@/components/media/VideoGalleryClient';

export const metadata: Metadata = {
  title: 'Wedding Invitation Videos | Cinematic Mobile Invitations | WedInvites',
  description:
    'Explore luxury, cinematic wedding invitation videos for Instagram Reels, WhatsApp status, and mobile invites. Beautifully crafted royal, floral, botanical, and watercolor video invitations.',
  keywords: [
    'wedding invitation video',
    'cinematic wedding video invite',
    'whatsapp wedding invitation video',
    'instagram reels wedding invitation',
    'indian wedding video invite',
    'royal rajputana wedding video',
  ],
  openGraph: {
    title: 'Wedding Invitation Videos | Cinematic Mobile Invitations | WedInvites',
    description:
      'Explore luxury, cinematic wedding invitation videos crafted for Instagram Reels and WhatsApp.',
    type: 'website',
    url: 'https://wedinvites.in/videos',
  },
};

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-stone-950 flex flex-col justify-between">
      <GlassNav />
      <div className="flex-grow">
        <VideoGalleryClient />
      </div>
      <PremiumFooter />
    </main>
  );
}
